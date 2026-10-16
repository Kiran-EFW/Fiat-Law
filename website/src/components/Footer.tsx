import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Container, ArrowRight } from "@/components/ui";
import { legalNav } from "@/lib/nav";
import { services } from "@/content/services";
import { doorSegments } from "@/lib/segments";
import { firm, addressLines } from "@/config/firm";

/**
 * The compliance block in this footer is not decoration. Because FIAT LAW UK LTD
 * is not itself an SRA-authorised firm, every page must make the two capacities
 * distinguishable — see VISION.md §3 and the note in src/config/firm.ts.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-ink text-bone">
      {/* Call to action */}
      <div className="border-b border-bone/10">
        <Container>
          <div className="flex flex-col gap-8 py-16 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow mb-4">Start here</p>
              <h2 className="text-display-sm sm:text-display-md">Tell us where you are, and we will tell you what happens next.</h2>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-bone/65">
                Six questions. Four minutes. You receive a written UK Entry Brief setting out the route that fits, the
                sequence, the realistic timeline and the specific obstacles your position will hit — before you speak to
                anyone.
              </p>
            </div>
            <Link
              href="/uk-entry-brief"
              className="inline-flex shrink-0 items-center gap-2.5 bg-crimson-600 px-8 py-4 text-[0.9375rem] font-medium text-bone transition-colors hover:bg-crimson-500"
            >
              Begin your UK Entry Brief
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </div>

      {/* Directory */}
      <Container>
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-20">
          <div>
            <Logo tone="light" className="h-9 w-auto" />
            <address className="mt-6 text-sm not-italic leading-relaxed text-bone/60">
              {addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <div className="mt-5 flex flex-col gap-1.5 text-sm">
              <a href={`tel:${firm.contact.telephone.replace(/\s/g, "")}`} className="text-bone/75 tabular-nums transition-colors hover:text-bone">
                {firm.contact.telephoneDisplay}
              </a>
              <a href={`mailto:${firm.contact.email}`} className="break-all text-bone/75 transition-colors hover:text-bone">
                {firm.contact.email}
              </a>
            </div>
          </div>

          <FooterColumn title="Services" links={services.map((s) => ({ href: `/services/${s.slug}`, label: s.name }))} />

          <FooterColumn
            title="Where you are"
            links={doorSegments.map((s) => ({ href: `/uk-entry-brief?segment=${s.id}`, label: s.name }))}
          />

          <div className="flex flex-col gap-10">
            <FooterColumn
              title="India–UK"
              links={[
                { href: "/india-uk", label: "The CETA briefing" },
                { href: "/india-uk/mobility", label: "Mobility & the DCC" },
                { href: "/india-uk/rules-of-origin", label: "Rules of origin" },
                { href: "/india-uk/sectors", label: "Sector by sector" },
              ]}
            />
            <FooterColumn
              title="Firm"
              links={[
                { href: "/about", label: "About Janeevan" },
                { href: "/insights", label: "Insights" },
                { href: "/partners", label: "Referral partners" },
                { href: "/contact", label: "Contact" },
              ]}
            />
          </div>
        </div>
      </Container>

      {/* Regulatory */}
      <div className="border-t border-bone/10">
        <Container>
          <div className="py-10">
            <p className="eyebrow mb-4">Regulatory information</p>
            <div className="grid gap-6 text-[0.8125rem] leading-relaxed text-bone/55 lg:grid-cols-2">
              <p>
                <strong className="font-medium text-bone/80">{firm.legalName}</strong> (company number {firm.companyNumber}) is a
                company registered in England and Wales, and provides corporate services and business advisory. It is{" "}
                <strong className="font-medium text-bone/80">not</strong> a firm authorised and regulated by the Solicitors
                Regulation Authority, and it does not carry on reserved legal activities.
              </p>
              <p>
                Reserved and regulated legal work is carried out by{" "}
                <strong className="font-medium text-bone/80">{firm.principal.name}</strong>, solicitor (SRA{" "}
                {firm.principal.sraNumber}), practising through{" "}
                <strong className="font-medium text-bone/80">{firm.regulatedFirm.legalName}</strong> (SRA{" "}
                {firm.regulatedFirm.sraNumber}), which is authorised and regulated by the Solicitors Regulation Authority.
                That work is subject to Taylor Rose&rsquo;s authorisation, professional indemnity insurance and
                complaints procedure.{" "}
                <Link href="/legal/regulatory" className="text-bone/80 underline underline-offset-4 hover:text-bone">
                  Full regulatory information
                </Link>
                .
              </p>
            </div>
            <p className="mt-6 text-[0.75rem] leading-relaxed text-bone/55">
              Nothing on this website is legal advice, immigration advice, tax advice or investment advice, and no
              solicitor–client relationship arises from reading it or from submitting an enquiry. Advice is given only
              under a written engagement, in the capacity that engagement identifies.
            </p>
          </div>
        </Container>
      </div>

      <div className="border-t border-bone/10">
        <Container>
          <div className="flex flex-col gap-4 py-7 text-[0.75rem] text-bone/55 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {firm.legalName}. All rights reserved.
            </p>
            <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
              {legalNav.map((link) => (
                <Link key={link.href} href={link.href} className="transition-colors hover:text-bone/80">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-bone/55">{title}</h3>
      <ul className="mt-5 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link href={link.href} className="text-sm text-bone/65 transition-colors hover:text-bone">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
