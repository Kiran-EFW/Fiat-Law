import { leadStore } from "@/lib/leads/store";
import { answerLabel } from "@/lib/brief/labels";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** RFC 4180 quoting, plus the leading-quote guard against formula injection in Excel. */
function cell(value: unknown): string {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

const COLUMNS = [
  "reference",
  "received",
  "kind",
  "status",
  "score",
  "band",
  "name",
  "role",
  "company",
  "email",
  "phone",
  "position",
  "entity",
  "people",
  "sector",
  "scale",
  "timing",
  "detail",
  "origin_city",
  "channel",
  "marketing_consent",
  "landing_path",
  "referrer",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "seconds_on_brief",
  "notes",
];

export async function GET() {
  const leads = await leadStore.list({ limit: 5000 });

  const lines = [COLUMNS.join(",")];
  for (const lead of leads) {
    const a = lead.answers;
    lines.push(
      [
        lead.id,
        lead.createdAt,
        lead.kind,
        lead.status,
        lead.score,
        lead.band,
        lead.name,
        lead.role,
        lead.company,
        lead.email,
        lead.phone,
        lead.segment ? answerLabel("segment", lead.segment) : "",
        a?.entityStatus ? answerLabel("entityStatus", a.entityStatus) : "",
        a?.peoplePosition ? answerLabel("peoplePosition", a.peoplePosition) : "",
        a?.sector ? answerLabel("sector", a.sector) : "",
        a?.scale ? answerLabel("scale", a.scale) : "",
        a?.urgency ? answerLabel("urgency", a.urgency) : "",
        a?.detail ? answerLabel("detail", a.detail, a.segment) : "",
        a?.originCity ?? "",
        a?.contact?.channel ?? "",
        lead.marketingConsent ? "yes" : "no",
        lead.source.landingPath ?? "",
        lead.source.referrer ?? "",
        lead.source.utmSource ?? "",
        lead.source.utmMedium ?? "",
        lead.source.utmCampaign ?? "",
        lead.durationMs ? Math.round(lead.durationMs / 1000) : "",
        lead.notes,
      ]
        .map(cell)
        .join(","),
    );
  }

  // BOM so Excel opens it as UTF-8 rather than mangling the pound signs.
  const body = `﻿${lines.join("\r\n")}\r\n`;
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="fiat-law-leads-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
