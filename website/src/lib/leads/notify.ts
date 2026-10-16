import "server-only";
import type { Lead } from "@/lib/leads/store";
import { firm } from "@/config/firm";
import { segmentById } from "@/lib/segments";

/**
 * Notification is deliberately transport-agnostic.
 *
 * With LEADS_WEBHOOK_URL set, every submission is POSTed there — a Slack or
 * Teams incoming webhook, a Zapier or Make hook, or a CRM endpoint. With
 * RESEND_API_KEY set, an email is sent instead. With neither, the lead is
 * written to the database and logged, which is enough to run on day one.
 */
export async function notifyNewLead(lead: Lead): Promise<void> {
  const summary = summarise(lead);

  const webhook = process.env.LEADS_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summary, lead }),
      });
    } catch (error) {
      console.error("[leads] webhook delivery failed", error);
    }
  }

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_NOTIFY_EMAIL ?? firm.contact.email;
  if (resendKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.LEADS_FROM_EMAIL ?? `Fiat Law website <noreply@${firm.domain}>`,
          to: [to],
          reply_to: lead.email,
          subject: `${lead.band === "priority" ? "PRIORITY " : ""}New ${lead.kind}: ${lead.name}${lead.company ? ` — ${lead.company}` : ""}`,
          text: summary,
        }),
      });
    } catch (error) {
      console.error("[leads] email delivery failed", error);
    }
  }

  if (!webhook && !resendKey) {
    console.info(`[leads] new ${lead.kind} recorded\n${summary}`);
  }
}

function summarise(lead: Lead): string {
  const segment = lead.segment ? segmentById[lead.segment as keyof typeof segmentById] : undefined;
  const lines = [
    `${lead.id} · score ${lead.score}/100 (${lead.band})`,
    `${lead.name}${lead.role ? `, ${lead.role}` : ""}${lead.company ? ` — ${lead.company}` : ""}`,
    `${lead.email}${lead.phone ? ` · ${lead.phone}` : ""}`,
  ];
  if (segment) lines.push(`Segment ${segment.code} · ${segment.name}`);
  if (lead.answers) {
    const a = lead.answers;
    lines.push(
      [
        a.entityStatus && `entity: ${a.entityStatus}`,
        a.peoplePosition && `people: ${a.peoplePosition}`,
        a.sector && `sector: ${a.sector}`,
        a.scale && `scale: ${a.scale}`,
        a.urgency && `urgency: ${a.urgency}`,
        a.detail && `detail: ${a.detail}`,
        a.originCity && `from: ${a.originCity}`,
      ]
        .filter(Boolean)
        .join(" · "),
    );
  }
  if (lead.recommendation?.route?.name) lines.push(`Recommended route: ${lead.recommendation.route.name}`);
  if (lead.notes) lines.push(`\nNotes:\n${lead.notes}`);
  if (lead.source?.landingPath) {
    lines.push(
      `\nSource: ${lead.source.landingPath}${lead.source.utmSource ? ` · utm_source=${lead.source.utmSource}` : ""}${
        lead.source.referrer ? ` · ref=${lead.source.referrer}` : ""
      }`,
    );
  }
  if (lead.durationMs) lines.push(`Completed in ${Math.round(lead.durationMs / 1000)}s`);
  return lines.filter(Boolean).join("\n");
}
