import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/leads/schema";
import { leadStore } from "@/lib/leads/store";
import { notifyNewLead } from "@/lib/leads/notify";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limit = rateLimit(`enquiry:${clientKey(request)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please try again shortly, or telephone us." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // Honeypot first, before validation: a bot that gets a field-by-field 422
  // learns which field to leave alone next time. This looks like success.
  if (typeof (payload as { website?: unknown })?.website === "string" && (payload as { website: string }).website) {
    return NextResponse.json({ ok: true, id: null });
  }

  const parsed = enquirySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Some fields were missing or invalid.",
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      { status: 422 },
    );
  }

  const { name, email, company, phone, subject, message } = parsed.data;

  let lead;
  try {
    lead = await leadStore.create({
      kind: "enquiry",
      name,
      email,
      company,
      phone,
      notes: subject ? `${subject}\n\n${message}` : message,
      score: 40,
      band: "qualified",
    });
  } catch (error) {
    console.error("[enquiry] could not persist", error);
    return NextResponse.json(
      { ok: false, error: "We could not send that. Please email us directly and we will pick it up." },
      { status: 500 },
    );
  }

  await notifyNewLead(lead);

  return NextResponse.json({ ok: true, id: lead.id });
}
