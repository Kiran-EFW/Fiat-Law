import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Container, Section, ArrowRight } from "@/components/ui";
import { CapacityBadge } from "@/components/CapacityNotice";
import { services } from "@/content/services";
import { segmentById } from "@/lib/segments";
import { firm } from "@/config/firm";

export const metadata = pageMeta({
  title: "Services",
  description:
    "Six practice areas for Indian businesses entering the UK: entity and company secretarial, business immigration, corporate and commercial, mergers and acquisitions, accounting and compliance, and trade under CETA.",
  path: "/services",
  eyebrow: "Practice areas",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Practice"
        title="Six areas, one instruction, one person accountable."
        lede="Each is delivered in a stated capacity — by Fiat Law as corporate services, by Janeevan as a solicitor through Taylor Rose, or coordinated with named partner firms. You are told which before anything starts, and the brief tells you again for your specific matter."
        aside={
          <div className="border-l-2 border-crimson-600 pl-5">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-stone-500">Not sure which</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone-600">
              Most entrants need three of the six, in a particular order. The brief works out which three and puts them
              in sequence.
            </p>
            <Link href="/uk-entry-brief" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-crimson-600 hover:text-crimson-500">
              Start the UK Entry Brief
              <ArrowRight />
            </Link>
          </div>
        }
      />

      <Section tone="parchment" className="border-t border-stone-200">
        <Container width="wide">
          <div className="flex flex-col gap-16">
            {services.map((service) => (
              <article key={service.slug} className="grid gap-8 border-t border-stone-300 pt-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
                <div>
                  <span className="font-display text-sm italic text-crimson-600">{service.index}</span>
                  <h2 className="mt-3 text-display-sm">
                    <Link href={`/services/${service.slug}`} className="transition-colors hover:text-crimson-600">
                      {service.name}
                    </Link>
                  </h2>
                  <CapacityBadge capacity={service.capacity} className="mt-5" />
                </div>
                <div>
                  <p className="font-display text-2xl leading-snug text-ink">&ldquo;{service.problem}&rdquo;</p>
                  <p className="mt-5 text-[1.0625rem] leading-relaxed text-stone-700">{service.reality[0]}</p>
                  <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
                    {service.segments.map((id) => (
                      <span key={id} className="text-[0.75rem] uppercase tracking-[0.12em] text-stone-400">
                        {segmentById[id].name}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-crimson-600 hover:text-crimson-500"
                  >
                    {service.name} in detail
                    <ArrowRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="ink">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="text-display-sm">How the two capacities work</h2>
              <p className="mt-6 text-[1.0625rem] leading-relaxed text-bone/65">
                {firm.legalName} (company {firm.companyNumber}) provides corporate services and business advisory. It is
                not a firm authorised by the Solicitors Regulation Authority and it does not carry on reserved legal
                activities.
              </p>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-bone/65">
                Reserved and regulated legal work is carried out by {firm.principal.name} (SRA{" "}
                {firm.principal.sraNumber}) in his capacity as a solicitor practising through{" "}
                {firm.regulatedFirm.legalName} (SRA {firm.regulatedFirm.sraNumber}), and is subject to that firm&rsquo;s
                authorisation, insurance and complaints procedure.
              </p>
              <Link
                href="/legal/regulatory"
                className="mt-8 inline-flex items-center gap-2 border border-bone/35 px-7 py-3.5 text-sm font-medium text-bone transition-colors hover:bg-bone hover:text-ink"
              >
                Full regulatory information
                <ArrowRight />
              </Link>
            </div>
            <div>
              <h2 className="text-display-sm">And how we charge for it</h2>
              <p className="mt-6 text-[1.0625rem] leading-relaxed text-bone/65">
                There is no price list on this site, and that is deliberate. A published figure in this market is either
                a commodity formation price that says nothing about your situation, or a number set to be negotiated
                down on the call. Neither helps you.
              </p>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-bone/65">
                Instead: the brief, then a conversation, then a written proposal priced to the scope we agreed — fixed
                where the scope can be fixed, at an agreed rate where it genuinely cannot. You approve the figure in
                writing before any work begins.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
