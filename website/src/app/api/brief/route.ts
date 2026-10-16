import { NextResponse } from "next/server";
import { leadSubmissionSchema } from "@/lib/leads/schema";
import { leadStore } from "@/lib/leads/store";
import { notifyNewLead } from "@/lib/leads/notify";
import { buildRecommendation, scoreLead, scoreBand } from "@/lib/brief/engine";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import type { BriefAnswers } from "@/lib/brief/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limit = rateLimit(`brief:${clientKey(request)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again shortly, or email us directly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // Honeypot first, before validation: a filled field means a bot, and a
  // field-by-field 422 would teach it which field to leave alone next time.
  // Accept silently instead, so it records a success and does not retry.
  if (typeof (payload as { website?: unknown })?.website === "string" && (payload as { website: string }).website) {
    return NextResponse.json({ ok: true, id: null });
  }

  const parsed = leadSubmissionSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Some answers were missing or invalid.",
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      { status: 422 },
    );
  }

  const answers = parsed.data.answers as BriefAnswers;
  const recommendation = buildRecommendation(answers);
  const score = scoreLead(answers);

  let lead;
  try {
    lead = await leadStore.create({
      kind: "brief",
      segment: answers.segment ?? null,
      answers,
      recommendation,
      score,
      band: scoreBand(score),
      name: answers.contact?.name ?? "",
      role: answers.contact?.role ?? "",
      company: answers.contact?.company ?? "",
      email: answers.contact?.email ?? "",
      phone: answers.contact?.phone ?? "",
      notes: answers.contact?.notes ?? "",
      source: parsed.data.source,
      durationMs: parsed.data.timing?.durationMs ?? null,
      marketingConsent: answers.marketingConsent ?? false,
    });
  } catch (error) {
    console.error("[brief] could not persist lead", error);
    return NextResponse.json(
      { ok: false, error: "We could not record that. Please email us and we will pick it up straight away." },
      { status: 500 },
    );
  }

  await notifyNewLead(lead);

  return NextResponse.json({ ok: true, id: lead.id });
}
