import Link from "next/link";
import { cookies } from "next/headers";
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
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  const cookieStore = await cookies();
  const isAuthed = cookieStore.get("admin_session")?.value === "1";

  if (!isAuthed) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-20">
        <div className="max-w-[24rem]">
          <div className="bg-stone-50 p-8 rounded-xl border border-stone-200 shadow-sm">
            <h2 className="text-xl font-semibold text-ink mb-4">Admin Login Required</h2>
            <p className="text-stone-600 mb-6">You must be logged in to view the admin area.</p>
            <form action="/api/auth/login" method="POST" className="space-y-3">
              <label className="block text-[0.75rem] font-medium text-stone-700">Admin Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full rounded border border-stone-200 bg-bone px-3 py-2 text-[0.9375rem] text-ink outline-none focus:border-ink focus:ring-1 focus:border-ink transition-colors"
              />
              <button
                type="submit"
                className="flex flex-col items-center gap-2 rounded bg-crimson-600 px-6 py-2 text-[0.875rem] font-medium text-bone transition-colors hover:bg-crimson-700 mt-3"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[100rem] px-6 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl tracking-tight text-ink">Leads</h1>
          <p className="mt-2 text-[0.875rem] text-stone-600">
            {counts.total} total · {counts.byStatus.new ?? 0} unactioned · {priority} priority in this view
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/admin/login" className="inline-flex items-center gap-2 bg-stone-200 px-4 py-2 text-[0.875rem] font-medium text-stone-700 hover:bg-stone-300 transition-colors">
            Log Out
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="mr-2 text-[0.6875rem] uppercase tracking-[0.12em] text-stone-500">Status</span>
        {STATUSES.map((s) => {
          const active = (params.status ?? "all") === s.value;
          return (
            <Link
              key={s.value}
              href={query({ status: s.value === "all" ? undefined : s.value })}
              className={cx(
                "border px-3 py-1.5 text-[0.8125rem] transition-colors",
                active ? "border-ink bg-ink text-bone" : "border-stone-300 text-stone-600",
              )}
            >
              {s.label}
            </Link>
          )}
        </div>

        const linkClass = cx(
          "border px-3 py-1.5 text-[0.8125rem] transition-colors",
          active ? "border-ink bg-ink text-bone" : "border-stone-300 text-stone-600",
        )

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-[0.6875rem] uppercase tracking-[0.12em] text-stone-400">Position</span>
          <Link
            href={query({ segment: undefined })}
            className={linkClass}
          >
            All
          </Link>
        </div>
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
        <div className="mt-6 flex flex-col items-center justify-center gap-2 text-[0.9375rem] text-stone-600">
          <span className="inline-flex items-center gap-2 bg-stone-50 px-4 py-2 text-stone-600 rounded-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-9-3v6m6-10.316a1.625 1.625 0 011.642 1.89l1.077 1.392m-1.678-3.956L11.262 10H9v12c0 .553-.448.807-1 .809l-.008.001z" />
            </svg>
            No leads yet
          </span>
          <p className="text-[0.75rem] text-stone-500">
            Submit a UK Entry Brief or contact form to see leads here.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[64rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink/20">
                {["Score", "Reference", "Who", "Position", "Timing", "Status", "Received"].map((h) => (
                  <th key={h} scope="col" className="py-3 pr-6 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-stone-500">
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
                    <Link href={`/admin/leads/${lead.id}`} className="font-mono text-[0.8125rem] text-crimson-600 hover:underline">
                      {lead.id}
                    </Link>
                    <span className="mt-1 block text-[0.6875rem] uppercase tracking-[0.1em] text-stone-400">{lead.kind}</span>
                  </td>
                  <td className="py-4 pr-6">
                    <span className="block text-[0.9375rem] text-ink">{lead.name || "—"}</span>
                    <span className="block text-[0.8125rem] text-stone-500">{[lead.role, lead.company].filter(Boolean).join(", ") || "—"}</span>
                    <a href={`mailto:${lead.email}`} className="block text-[0.8125rem] text-stone-500 hover:text-crimson-600">
                      {lead.email}
                    </a>
                  </td>
                  <td className="py-4 pr-6 text-[0.875rem] text-stone-600">
                    {lead.segment && isSegmentId(lead.segment) ? segmentById[lead.segment].name : "—"}
                  </td>
                  <td className="py-4 pr-6 text-[0.875rem] text-stone-600">{lead.answers?.urgency ? urgencyLabel[lead.answers.urgency] : "—"}</td>
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