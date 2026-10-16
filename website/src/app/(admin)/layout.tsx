import Link from "next/link";
import type { Metadata } from "next";
import { firm } from "@/config/firm";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The console. No marketing chrome, no animation, higher information density.
 * It is behind HTTP Basic auth (see src/middleware.ts) and excluded in
 * robots.txt, but the noindex above is the belt to that pair of braces.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-bone">
      <header className="border-b border-stone-300 bg-parchment">
        <div className="mx-auto flex w-full max-w-[100rem] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-baseline gap-4">
            <Link href="/admin/leads" className="font-display text-lg tracking-tight text-ink">
              {firm.name} <span className="text-stone-400">console</span>
            </Link>
            <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-stone-400">Internal</span>
          </div>
          <nav className="flex items-center gap-6 text-[0.8125rem]">
            <Link href="/admin/leads" className="text-stone-600 hover:text-crimson-600">
              Leads
            </Link>
            <a href="/api/admin/leads.csv" className="text-stone-600 hover:text-crimson-600">
              Export CSV
            </a>
            <Link href="/" className="text-stone-600 hover:text-crimson-600">
              Public site
            </Link>
          </nav>
        </div>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-stone-200 px-6 py-5">
        <p className="mx-auto w-full max-w-[100rem] text-[0.75rem] leading-relaxed text-stone-500">
          Personal data. Handle under the published privacy notice: enquiries that do not become instructions are
          deleted 24 months after last contact, and a deletion request must be actioned within one month.
        </p>
      </footer>
    </div>
  );
}
