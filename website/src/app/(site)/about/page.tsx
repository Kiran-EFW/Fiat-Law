import Image from "next/image";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Container, Section, ArrowRight, Button, GoldRule } from "@/components/ui";
import { firm, addressLines } from "@/config/firm";

export const metadata = pageMeta({
  title: "About",
  description:
    "Fiat Law is a boutique UK entry practice for Indian businesses, led by founder Janeevan John, a solicitor admitted in 2007 practising through Taylor Rose Limited.",
  path: "/about",
  eyebrow: "The practice",
});

const principles = [
  {
    n: "01",
    title: "One instruction, not three suppliers",
    body: "The entity, the immigration route and the compliance calendar are not three projects that happen to run at the same time. They are one project with three workstreams, and the handovers between separate suppliers are where the weeks and the mistakes accumulate. We hold all three.",
  },
  {
    n: "02",
    title: "The capacity is stated before the work starts",
    body: "Some of what we do is corporate services. Some of it is reserved legal work that only a solicitor may carry out. You are told which is which on the service page, in your brief and in the engagement letter, because a client who does not know which regulator stands behind a piece of work cannot make an informed decision about it.",
  },
  {
    n: "03",
    title: "We publish what we will not do",
    body: "There are services in this market that require registrations we do not currently hold, and situations where the right answer is that you do not need us. Both are said plainly. It costs us some instructions and saves the client considerably more.",
  },
  {
    n: "04",
    title: "The detail is checked against the source",
    body: "Salary thresholds, charge rates, statutory deadlines and treaty provisions on this site are taken from the Immigration Rules, the statutory instruments, the agreement text and the official notifications, not from secondary commentary, a material amount of which is out of date or simply wrong.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero with portrait */}
      <section className="bg-bone">
        <Container width="wide">
          <div className="grid items-center gap-14 py-16 lg:grid-cols-[1.25fr_1fr] lg:gap-20 lg:py-24">
            <div className="animate-rise">
              <div className="mb-6 flex items-center gap-4">
                <GoldRule />
                <p className="eyebrow">About</p>
              </div>
              <h1 className="text-display-md sm:text-display-lg">
                A small practice, deliberately. You will deal with the person doing the work.
              </h1>
              <p className="measure-wide mt-7 text-lg leading-relaxed text-stone-700">
                {firm.name} exists for one corridor and one problem: Indian businesses establishing in the United
                Kingdom, and the fact that the legal, immigration and corporate elements of that move are almost always
                bought separately and then fail to fit together. Janeevan John leads the practice and reads every brief
                personally. His team covers each discipline the move touches, and one named owner project-manages the
                whole sequence to completion.
              </p>
            </div>
            <div className="animate-fade">
              <figure>
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
                  <Image
                    src={firm.principal.portrait}
                    alt={`${firm.principal.name}, ${firm.principal.role}, ${firm.name}`}
                    fill
                    sizes="(min-width: 1024px) 32rem, 100vw"
                    className="object-cover object-top"
                    priority
                  />
                </div>
                <figcaption className="mt-5 border-l-2 border-crimson-600 pl-5">
                  <p className="font-display text-xl leading-snug text-ink">{firm.principal.name}</p>
                  <p className="mt-1 text-[0.875rem] text-stone-600">{firm.principal.role}</p>
                  <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-stone-500">
                    Solicitor of the Senior Courts of England and Wales, admitted {firm.principal.admitted}. Practises
                    through {firm.regulatedFirm.legalName}.
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>
        </Container>
      </section>

      {/* The two capacities — the structural explanation */}
      <Section tone="ink">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <div>
              <p className="eyebrow mb-5">How the practice is structured</p>
              <h2 className="text-display-sm">Two capacities, one point of contact.</h2>
            </div>
            <div>
              <div className="grid gap-px bg-bone/10 sm:grid-cols-2">
                <div className="bg-ink pb-8 sm:pb-0 sm:pr-9">
                  <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-gold-soft">
                    Corporate services and advisory
                  </p>
                  <p className="mt-4 font-display text-xl leading-snug text-bone">{firm.legalName}</p>
                  <p className="mt-1 text-[0.8125rem] text-bone/55">
                    Registered in England and Wales, company number {firm.companyNumber}
                  </p>
                  <p className="mt-5 text-[0.9375rem] leading-relaxed text-bone/60">
                    Entity formation and company secretarial support, market-entry planning, trade and origin work,
                    project coordination and the compliance calendar. This company is not authorised or regulated by the
                    Solicitors Regulation Authority and does not carry on reserved legal activities.
                  </p>
                </div>
                <div className="bg-ink pt-8 sm:pl-9 sm:pt-0">
                  <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-gold-soft">
                    Reserved and regulated legal work
                  </p>
                  <p className="mt-4 font-display text-xl leading-snug text-bone">
                    {firm.principal.name}, solicitor
                  </p>
                  <p className="mt-1 text-[0.8125rem] text-bone/55">
                    Practising through {firm.regulatedFirm.legalName}
                  </p>
                  <p className="mt-5 text-[0.9375rem] leading-relaxed text-bone/60">
                    Corporate and commercial drafting, share and asset acquisitions, immigration advice and
                    representation, and any other reserved legal activity. Carried out under that firm&rsquo;s
                    authorisation and professional standards.
                  </p>
                </div>
              </div>
              <Link
                href="/legal/regulatory"
                className="mt-9 inline-flex items-center gap-2 border border-bone/35 px-7 py-3.5 text-sm font-medium text-bone transition-colors hover:bg-bone hover:text-ink"
              >
                Regulatory information in full
                <ArrowRight />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* Principles */}
      <Section tone="parchment">
        <Container width="wide">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">How we work</p>
            <h2 className="text-display-sm sm:text-display-md">Four commitments, and the reasons for them.</h2>
          </div>
          <div className="mt-14 grid gap-px border border-stone-200 bg-stone-200 sm:grid-cols-2">
            {principles.map((principle) => (
              <div key={principle.n} className="bg-bone p-8 sm:p-9">
                <span className="font-display text-sm italic text-crimson-600">{principle.n}</span>
                <h3 className="mt-4 font-display text-xl leading-snug text-ink">{principle.title}</h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-stone-600">{principle.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why this corridor */}
      <Section>
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:gap-20">
            <div>
              <p className="eyebrow mb-5">Why this corridor</p>
              <h2 className="text-display-sm">It was already moving. The agreement made the timing obvious.</h2>
            </div>
            <div className="prose-fiat">
              <p>
                There are now around 1,912 Indian-owned companies trading in the United Kingdom, roughly 60% more than
                a year earlier, with combined turnover of about £105.8 billion and 203,549 employees. India was the
                second largest source of inward investment projects into the UK in 2025-26. None of that was caused by
                the Comprehensive Economic and Trade Agreement, which only entered into force on 15 July 2026.
              </p>
              <p>
                What the agreement did was remove the last reason to wait. Tariff reductions applied in full on day one
                rather than over a decade, and the Double Contribution Convention now runs to sixty months, which
                changes the arithmetic on a multi-year secondment. The businesses that move well in the next two years
                will be the ones that treated the entity, the people and the compliance obligations as a single design
                problem rather than a sequence of purchases.
              </p>
              <p>
                That is the whole reason this practice is shaped the way it is. It is not a full-service firm and does
                not try to be. It does one corridor, and it does the parts of that corridor that are usually dropped
                between suppliers.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Contact strip */}
      <Section tone="parchment" className="border-t border-stone-200">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
            <div>
              <h2 className="text-display-sm">Start with the brief, not with a sales call.</h2>
              <p className="measure mt-6 text-[1.0625rem] leading-relaxed text-stone-600">
                Six questions, a few minutes, and you receive a written position: the route, the sequence, the specific
                obstacles your situation runs into, and the capacity each piece of work would be delivered in. Janeevan
                reads every one personally before any conversation.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="/uk-entry-brief" size="lg">
                  Start the UK Entry Brief
                  <ArrowRight />
                </Button>
                <Button href="/contact" variant="secondary" size="lg">
                  Contact details
                </Button>
              </div>
            </div>
            <div className="border-t border-stone-300 pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <p className="eyebrow mb-4">Office</p>
              <address className="not-italic text-[0.9375rem] leading-relaxed text-stone-600">
                {addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-stone-600">
                <a href={`tel:${firm.contact.telephone}`} className="block hover:text-crimson-600">
                  {firm.contact.telephoneDisplay}
                </a>
                <a href={`mailto:${firm.contact.email}`} className="block break-all hover:text-crimson-600">
                  {firm.contact.email}
                </a>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
