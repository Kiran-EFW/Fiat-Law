import Link from "next/link";
import { leadStore, type LeadStatus } from "@/lib/leads/store";
import { segments, segmentById, isSegmentId } from "@/lib/segments";
import { cx } from "@/components/ui";

export const dynamic = "force-dynamic";

const STATUSES: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "proposal_sent", label: "Proposal sent" },
  { value: "instructed", label: "Instructed" },
  { value: "declined", label: "Declined" },
];

function bandClasses(band: string) {
  if (band === "priority") return "bg-crimson-600 text-bone";
  if (band === "qualified") return "bg-crimson-50 text-crimson-700 border border-crimson-600/30";
  return "bg-stone-100 text-stone-600 border border-stone-300";
}

function since(iso: string) {
  const then = new Date(iso).getTime();
  const hours = Math.round((Date.now() - then) / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 31) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; segment?: string; erased?: string }>;
}) {
  const params = await searchParams;
  // Only echo something that looks like one of our references, so the banner
  // cannot be turned into a reflected-content vector by a crafted admin URL.
  const erased = /^FL-\d{8}-[A-Z0-9]{6}$/.test(params.erased ?? "") ? params.erased : undefined;
  const status = STATUSES.some((s) => s.value === params.status && s.value !== "all")
    ? (params.status as LeadStatus)
    : undefined;
  const segment = params.segment && isSegmentId(params.segment) ? params.segment : undefined;

  const leads = await leadStore.list({ status, segment, limit: 500 });
  const counts = await leadStore.count();
  const priority = leads.filter((l) => l.band === "priority").length;

  const query = (next: Record<string, string | undefined>) => {
    const search = new URLSearchParams();
    const merged = { status: params.status, segment: params.segment, ...next };
    for (const [key, value] of Object.entries(merged)) {
      if (value && value !== "all") search.set(key, value);
    }
    const qs = search.toString();
    return qs ? `/admin/leads?${qs}` : "/admin/leads";
  };

  return (
    <div className="mx-auto w-full max-w-[100rem] px-6 py-10">
      {erased ? (
        <p
          role="status"
          className="mb-8 border-l-2 border-crimson-600 bg-crimson-50 px-5 py-3.5 text-[0.875rem] text-ink"
        >
          Record <span className="font-mono">{erased}</span> has been permanently erased. Remember to remove any copies
          held outside this console — exported CSVs, email threads and matter files.
        </p>
      ) : null}

      {/* Summary */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl tracking-tight text-ink">Leads</h1>
          <p className="mt-2 text-[0.875rem] text-stone-600">
            {counts.total} total · {counts.byStatus.new ?? 0} unactioned · {priority} priority in this view
          </p>
        </div>
        <dl className="flex flex-wrap gap-px border border-stone-200 bg-stone-200">
          {STATUSES.filter((s) => s.value !== "all").map((s) => (
            <div key={s.value} className="bg-parchment px-5 py-3">
              <dt className="text-[0.6875rem] uppercase tracking-[0.12em] text-stone-400">{s.label}</dt>
              <dd className="mt-1 font-display text-xl text-ink">{counts.byStatus[s.value] ?? 0}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Filters */}
      <div className="mt-8 space-y-3 border-y border-stone-200 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-[0.6875rem] uppercase tracking-[0.12em] text-stone-400">Status</span>
          {STATUSES.map((s) => {
            const active = (params.status ?? "all") === s.value;
            return (
              <Link
                key={s.value}
                href={query({ status: s.value === "all" ? undefined : s.value })}
                className={cx(
                  "border px-3 py-1.5 text-[0.8125rem] transition-colors",
                  active ? "border-ink bg-ink text-bone" : "border-stone-300 text-stone-600 hover:border-ink",
                )}
              >
                {s.label}
              </Link>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-[0.6875rem] uppercase tracking-[0.12em] text-stone-400">Position</span>
          <Link
            href={query({ segment: undefined })}
            className={cx(
              "border px-3 py-1.5 text-[0.8125rem] transition-colors",
              !params.segment ? "border-ink bg-ink text-bone" : "border-stone-300 text-stone-600 hover:border-ink",
            )}
          >
            All
          </Link>
          {segments.map((s) => {
            const active = params.segment === s.id;
            return (
              <Link
                key={s.id}
                href={query({ segment: s.id })}
                className={cx(
                  "border px-3 py-1.5 text-[0.8125rem] transition-colors",
                  active ? "border-ink bg-ink text-bone" : "border-stone-300 text-stone-600 hover:border-ink",
                )}
              >
                {s.code} · {s.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Table */}
      {leads.length === 0 ? (
        <p className="mt-16 border border-dashed border-stone-300 p-12 text-center text-[0.9375rem] text-stone-500">
          Nothing here yet. Submissions from the UK Entry Brief and the enquiry forms appear immediately.
        </p>
      ) : (
        <div role="region" aria-label="Leads" tabIndex={0} className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[64rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink/20">
                {["Score", "Reference", "Who", "Position", "Timing", "Status", "Received"].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="py-3 pr-6 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-stone-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-stone-200 align-top hover:bg-parchment">
                  <td className="py-4 pr-6">
                    <span
                      className={cx(
                        "inline-flex min-w-[2.75rem] justify-center px-2 py-1 font-sans text-[0.75rem] font-medium tabular-nums",
                        bandClasses(lead.band),
                      )}
                    >
                      {lead.score}
                    </span>
                  </td>
                  <td className="py-4 pr-6">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-mono text-[0.8125rem] text-crimson-600 hover:underline"
                    >
                      {lead.id}
                    </Link>
                    <span className="mt-1 block text-[0.6875rem] uppercase tracking-[0.1em] text-stone-400">
                      {lead.kind}
                    </span>
                  </td>
                  <td className="py-4 pr-6">
                    <span className="block text-[0.9375rem] text-ink">{lead.name || "—"}</span>
                    <span className="block text-[0.8125rem] text-stone-500">
                      {[lead.role, lead.company].filter(Boolean).join(", ") || "—"}
                    </span>
                    <a href={`mailto:${lead.email}`} className="block text-[0.8125rem] text-stone-500 hover:text-crimson-600">
                      {lead.email}
                    </a>
                  </td>
                  <td className="py-4 pr-6 text-[0.875rem] text-stone-600">
                    {lead.segment && isSegmentId(lead.segment) ? segmentById[lead.segment].name : "—"}
                  </td>
                  <td className="py-4 pr-6 text-[0.875rem] text-stone-600">
                    {lead.answers?.urgency ? urgencyLabel[lead.answers.urgency] : "—"}
                  </td>
                  <td className="py-4 pr-6 text-[0.875rem] text-stone-600">{statusLabel[lead.status]}</td>
                  <td className="py-4 pr-6 text-[0.875rem] text-stone-500">{since(lead.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const urgencyLabel: Record<string, string> = {
  exploring: "Exploring",
  this_quarter: "This quarter",
  thirty_days: "Within 30 days",
  overdue: "Already late",
};

const statusLabel: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  proposal_sent: "Proposal sent",
  instructed: "Instructed",
  declined: "Declined",
};
