import Link from "next/link";
import type { ReactNode } from "react";
import { Container, GoldRule } from "@/components/ui";
import { legalNav } from "@/lib/nav";
import { firm } from "@/config/firm";

/**
 * Shared frame for the five legal pages. These are the pages a regulator, a
 * professional indemnity insurer or a careful in-house counsel will read first,
 * so they get the same typographic care as the marketing pages and none of the
 * marketing tone.
 */
export function LegalLayout({
  title,
  lede,
  updated,
  current,
  children,
}: {
  title: string;
  lede: string;
  updated: string;
  current: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="bg-bone">
        <Container width="default">
          <div className="py-14 lg:py-20">
            <div className="mb-6 flex items-center gap-4">
              <GoldRule />
              <p className="eyebrow">Legal · Updated {updated}</p>
            </div>
            <h1 className="max-w-3xl text-display-md">{title}</h1>
            <p className="measure-wide mt-6 text-lg leading-relaxed text-stone-700">{lede}</p>
          </div>
        </Container>
      </section>

      <section className="border-t border-stone-200 bg-parchment py-14 lg:py-20">
        <Container width="default">
          <div className="grid gap-14 lg:grid-cols-[1fr_15rem] lg:gap-16">
            <div className="prose-fiat min-w-0">{children}</div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="eyebrow mb-5">Legal and regulatory</p>
              <ul className="space-y-3">
                {legalNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={item.href === current ? "page" : undefined}
                      className={
                        item.href === current
                          ? "border-l-2 border-crimson-600 pl-4 text-[0.9375rem] font-medium text-ink"
                          : "border-l-2 border-transparent pl-4 text-[0.9375rem] text-stone-600 transition-colors hover:border-stone-300 hover:text-ink"
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-10 border-t border-stone-300 pt-7 text-[0.8125rem] leading-relaxed text-stone-500">
                <p className="font-medium text-ink">{firm.legalName}</p>
                <p className="mt-2">Registered in England and Wales, company number {firm.companyNumber}.</p>
                <p className="mt-3">
                  <a href={`mailto:${firm.contact.email}`} className="break-all hover:text-crimson-600">
                    {firm.contact.email}
                  </a>
                </p>
                <p>
                  <a href={`tel:${firm.contact.telephone}`} className="hover:text-crimson-600">
                    {firm.contact.telephoneDisplay}
                  </a>
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
