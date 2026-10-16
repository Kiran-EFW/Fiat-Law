import Link from "next/link";
import { notFound } from "next/navigation";
import { leadStore } from "@/lib/leads/store";
import { setLeadStatus, deleteLead } from "../actions";
import { answerRows } from "@/lib/brief/labels";
import { segmentById, isSegmentId } from "@/lib/segments";
import { capacityLabel } from "@/config/firm";

export const dynamic = "force-dynamic";

const STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "proposal_sent", label: "Proposal sent" },
  { value: "instructed", label: "Instructed" },
  { value: "declined", label: "Declined" },
];

export default async function AdminLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await leadStore.get(id);
  if (!lead) notFound();

  const rows = lead.answers ? answerRows(lead.answers) : [];
  const recommendation = lead.recommendation;

  return (
    <div className="mx-auto w-full max-w-[76rem] px-6 py-10">
      <Link href="/admin/leads" className="text-[0.8125rem] text-stone-500 hover:text-crimson-600">
        ← All leads
      </Link>

      {/* Header */}
      <div className="mt-6 flex flex-wrap items-start justify-between gap-6 border-b border-stone-300 pb-7">
        <div>
          <p className="font-mono text-[0.8125rem] text-stone-500">{lead.id}</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-ink">{lead.name || "Unnamed enquiry"}</h1>
          <p className="mt-2 text-[0.9375rem] text-stone-600">
            {[lead.role, lead.company].filter(Boolean).join(", ") || "No company given"}
          </p>
          <p className="mt-3 space-x-4 text-[0.875rem]">
            <a href={`mailto:${lead.email}`} className="text-crimson-600 hover:underline">
              {lead.email}
            </a>
            {lead.phone ? (
              <a href={`tel:${lead.phone}`} className="text-crimson-600 hover:underline">
                {lead.phone}
              </a>
            ) : null}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-stone-400">Priority score</p>
          <p className="mt-1 font-display text-4xl tabular-nums text-ink">{lead.score}</p>
          <p className="text-[0.8125rem] uppercase tracking-[0.1em] text-crimson-600">{lead.band}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_18rem] lg:gap-14">
        <div className="min-w-0 space-y-10">
          {/* Answers */}
          <section>
            <h2 className="text-[0.6875rem] uppercase tracking-[0.12em] text-stone-400">What they told us</h2>
            {rows.length === 0 ? (
              <p className="mt-4 text-[0.9375rem] text-stone-500">
                Direct enquiry — no brief answers. The message is below.
              </p>
            ) : (
              <dl className="mt-4 grid gap-px border border-stone-200 bg-stone-200 sm:grid-cols-2">
                {rows.map((row) => (
                  <div key={row.field} className="bg-parchment p-5">
                    <dt className="text-[0.6875rem] uppercase tracking-[0.12em] text-stone-400">{row.question}</dt>
                    <dd className="mt-1.5 text-[0.9375rem] leading-snug text-ink">{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>

          {/* Their message */}
          {lead.notes ? (
            <section>
              <h2 className="text-[0.6875rem] uppercase tracking-[0.12em] text-stone-400">In their words</h2>
              <p className="mt-4 whitespace-pre-wrap border-l-2 border-crimson-600 bg-parchment p-6 text-[0.9375rem] leading-relaxed text-ink">
                {lead.notes}
              </p>
            </section>
          ) : null}

          {/* What they were shown */}
          {recommendation ? (
            <section>
              <h2 className="text-[0.6875rem] uppercase tracking-[0.12em] text-stone-400">
                What the brief told them — read this before you call
              </h2>
              <div className="mt-4 border border-stone-200 bg-parchment p-6">
                <p className="font-display text-xl leading-snug text-ink">{recommendation.headline}</p>

                <p className="mt-6 text-[0.6875rem] uppercase tracking-[0.12em] text-stone-400">Route</p>
                <p className="mt-1.5 text-[0.9375rem] text-ink">{recommendation.route.name}</p>
                <p className="mt-1 text-[0.875rem] leading-relaxed text-stone-600">{recommendation.route.why}</p>

                <p className="mt-6 text-[0.6875rem] uppercase tracking-[0.12em] text-stone-400">Sequence</p>
                <ol className="mt-2 space-y-2">
                  {recommendation.sequence.map((step, i) => (
                    <li key={step.title} className="text-[0.875rem] leading-relaxed text-stone-700">
                      <span className="mr-2 font-mono text-[0.75rem] text-crimson-600">{String(i + 1).padStart(2, "0")}</span>
                      {step.title}
                      <span className="text-stone-400">
                        {" "}
                        · {step.elapsed} · {capacityLabel[step.capacity]}
                        {step.criticalPath ? " · critical path" : ""}
                      </span>
                    </li>
                  ))}
                </ol>

                <p className="mt-6 text-[0.6875rem] uppercase tracking-[0.12em] text-stone-400">
                  Obstacles they were shown
                </p>
                <ul className="mt-2 space-y-1.5">
                  {recommendation.obstacles.map((o) => (
                    <li key={o.title} className="text-[0.875rem] leading-relaxed text-stone-700">
                      {o.title} <span className="text-stone-400">· {o.source}</span>
                    </li>
                  ))}
                </ul>

                {recommendation.candour ? (
                  <>
                    <p className="mt-6 text-[0.6875rem] uppercase tracking-[0.12em] text-stone-400">
                      Where we said not to instruct us
                    </p>
                    <p className="mt-1.5 text-[0.875rem] leading-relaxed text-stone-600">{recommendation.candour}</p>
                  </>
                ) : null}
              </div>
            </section>
          ) : null}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
          <section>
            <h2 className="text-[0.6875rem] uppercase tracking-[0.12em] text-stone-400">Status</h2>
            <form action={setLeadStatus} className="mt-3 space-y-3">
              <input type="hidden" name="id" value={lead.id} />
              <label htmlFor="status" className="sr-only">
                Status
              </label>
              {/* key: the select is uncontrolled, and React does not re-apply
                  defaultValue when the option list is patched on re-render —
                  after an update the control silently collapsed to the first
                  option. Keying on the stored status remounts it instead. */}
              <select
                key={lead.status}
                id="status"
                name="status"
                defaultValue={lead.status}
                className="w-full border border-field bg-parchment px-3 py-2.5 text-[0.875rem] text-ink"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-ink px-4 py-2.5 text-[0.875rem] font-medium text-bone hover:bg-ink-soft"
              >
                Update
              </button>
            </form>
          </section>

          <section className="border-t border-stone-200 pt-6">
            <h2 className="text-[0.6875rem] uppercase tracking-[0.12em] text-stone-400">Record</h2>
            <dl className="mt-3 space-y-2.5 text-[0.8125rem]">
              <Row label="Kind" value={lead.kind} />
              <Row
                label="Position"
                value={lead.segment && isSegmentId(lead.segment) ? segmentById[lead.segment].name : "—"}
              />
              <Row label="Received" value={new Date(lead.createdAt).toLocaleString("en-GB")} />
              <Row label="Updated" value={new Date(lead.updatedAt).toLocaleString("en-GB")} />
              <Row
                label="Time on brief"
                value={lead.durationMs ? `${Math.round(lead.durationMs / 1000)}s` : "—"}
              />
              <Row label="Channel" value={lead.answers?.contact?.channel ?? "—"} />
              <Row label="Marketing" value={lead.marketingConsent ? "Opted in" : "No"} />
              <Row label="Privacy version" value={lead.privacyVersion || "—"} />
            </dl>
          </section>

          <section className="border-t border-stone-200 pt-6">
            <h2 className="text-[0.6875rem] uppercase tracking-[0.12em] text-stone-400">Where they came from</h2>
            <dl className="mt-3 space-y-2.5 text-[0.8125rem]">
              <Row label="Landing" value={lead.source.landingPath ?? "—"} />
              <Row label="Referrer" value={lead.source.referrer ?? "Direct"} />
              <Row label="Campaign" value={lead.source.utmCampaign ?? "—"} />
              <Row label="Source" value={lead.source.utmSource ?? "—"} />
              <Row label="Medium" value={lead.source.utmMedium ?? "—"} />
            </dl>
          </section>

          <section className="border-t border-stone-200 pt-6">
            <h2 className="text-[0.6875rem] uppercase tracking-[0.12em] text-stone-400">Erasure</h2>
            <p className="mt-2 text-[0.75rem] leading-relaxed text-stone-500">
              Deletes the record permanently. Use for a data subject erasure request, or when the retention period has
              run.
            </p>
            <form action={deleteLead} className="mt-3">
              <input type="hidden" name="id" value={lead.id} />
              <button
                type="submit"
                className="w-full border border-crimson-600 px-4 py-2.5 text-[0.875rem] font-medium text-crimson-600 transition-colors hover:bg-crimson-600 hover:text-bone"
              >
                Delete this lead
              </button>
            </form>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-stone-400">{label}</dt>
      <dd className="break-all text-right text-stone-700">{value}</dd>
    </div>
  );
}
