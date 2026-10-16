import Image from "next/image";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Container, Section, SectionHead, Eyebrow, Card, ArrowRight, GoldRule, Statistic } from "@/components/ui";
import { services } from "@/content/services";
import { doorSegments } from "@/lib/segments";
import { firm } from "@/config/firm";

export const metadata = pageMeta({
  title: firm.tagline,
  // Absolute: the layout template would otherwise append the firm name twice.
  absoluteTitle: `${firm.name} — ${firm.tagline}`,
  description:
    "The UK entry practice for Indian businesses. The immigration route, the entity and the compliance handled as one instruction, not three suppliers.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      {/* ------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden bg-bone">
        <Container width="wide">
          <div className="grid items-center gap-14 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:py-24">
            <div className="animate-rise">
              <div className="flex items-center gap-4">
                <GoldRule />
                <Eyebrow>India · United Kingdom</Eyebrow>
              </div>

              <h1 className="mt-7 text-display-lg sm:text-[3.75rem] lg:text-display-xl">
                Entering the UK is
                <br />
                <span className="italic text-crimson-600">one</span> instruction,
                <br />
                not three suppliers.
              </h1>

              <p className="measure-wide mt-8 text-lg leading-relaxed text-stone-700">
                The visa route, the entity and the compliance are the same transaction. Sponsor guidance GBM3.4 says a
                Companies House number is enough to show the UK footprint an Expansion Worker application requires — so
                the company and the visa are one file, and buying them from two firms costs you weeks you do not have.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/uk-entry-brief"
                  className="inline-flex items-center justify-center gap-2.5 bg-crimson-600 px-8 py-4 text-[0.9375rem] font-medium text-bone transition-colors hover:bg-crimson-700"
                >
                  Get your UK Entry Brief
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 border border-stone-300 px-8 py-4 text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink"
                >
                  What we do
                </Link>
              </div>

              <p className="mt-6 text-[0.8125rem] leading-relaxed text-stone-500">
                Free, written, and yours to keep. No fee is quoted until we have scoped the work with you.
              </p>
            </div>

            <div className="relative animate-fade">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-200 sm:max-w-md lg:max-w-none">
                <Image
                  src={firm.principal.portrait}
                  alt={`${firm.principal.name}, solicitor and founder of ${firm.name}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="mt-5 border-l-2 border-crimson-600 pl-4">
                <p className="font-display text-lg leading-tight text-ink">{firm.principal.name}</p>
                <p className="mt-1 text-[0.8125rem] leading-snug text-stone-600">
                  Solicitor · Founder · Admitted {firm.principal.admitted}
                </p>
                <p className="mt-1 text-[0.75rem] leading-snug text-stone-500">
                  SRA {firm.principal.sraNumber} · practising through {firm.regulatedFirm.legalName}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------- Credibility */}
      <section className="border-y border-stone-200 bg-parchment">
        <Container width="wide">
          <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-14">
            <Statistic value="1,912" label="Indian-owned companies now trading in the UK — up 60% in a year" source="India Meets Britain Tracker 2026" />
            <Statistic value="£105.8bn" label="Combined UK turnover of Indian-owned companies" source="India Meets Britain Tracker 2026" />
            <Statistic value="203,549" label="People they employ in the United Kingdom" source="India Meets Britain Tracker 2026" />
            <Statistic value="15 Jul 2026" label="CETA in force. UK tariff cuts applied immediately, with no phase-in" source="Comprehensive Economic and Trade Agreement" />
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------- Segment doors */}
      <Section>
        <Container width="wide">
          <SectionHead
            eyebrow="Where are you"
            title="Six positions. Each one has a different first move."
            lede="Most firms publish a list of services and leave you to work out which ones you need. We would rather start where you are, because the sequence changes completely depending on the answer."
          />

          <div className="mt-14 grid gap-px border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-3">
            {doorSegments.map((segment) => (
              <Link
                key={segment.id}
                href={`/uk-entry-brief?segment=${segment.id}`}
                className="group relative flex flex-col bg-parchment p-8 transition-colors duration-300 hover:bg-bone"
              >
                <span className="font-sans text-[0.6875rem] font-medium tracking-[0.16em] text-crimson-600">
                  {segment.code}
                </span>
                <h3 className="mt-4 font-display text-[1.375rem] leading-snug text-ink">
                  &ldquo;{segment.selfDescription}&rdquo;
                </h3>
                <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-stone-600">{segment.summary}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-crimson-600">
                  Start here
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------- The thesis */}
      <Section tone="ink">
        <Container width="wide">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <Eyebrow className="mb-5">The position</Eyebrow>
              <h2 className="text-display-sm sm:text-display-md">
                Incorporation is a commodity.
                <br />
                The sequence is not.
              </h2>
              <p className="mt-6 text-[1.0625rem] leading-relaxed text-bone/65">
                A formation agent will register your company for under two hundred pounds and their interface will be
                better than any law firm&rsquo;s. We are not competing with that, and we will tell you so.
              </p>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-bone/65">
                What costs Indian entrants money is the order of operations, and the handful of provisions nobody
                mentions until they bite.
              </p>
            </div>

            <div className="grid gap-px bg-bone/10 sm:grid-cols-2">
              <Insight
                title="The bank account is the critical path"
                body="Six to eight weeks where the directors sit overseas. It cannot start until the company exists, and it gates payroll, VAT recovery and your first invoice. Everything else sequences around it."
              />
              <Insight
                title="A UK-resident director is not required"
                body="Section 155 of the Companies Act 2006 requires a natural person, not a resident. Anyone selling you a resident director as a legal requirement is selling you something the law does not ask for."
              />
              <Insight
                title="A nominee cannot hold your sponsor licence"
                body="Paragraph L4.33 requires the Authorising Officer to be a paid member of staff or an office holder. You cannot appoint someone from another organisation. Licence structures built on nominees fail."
              />
              <Insight
                title="For a non-established business, VAT starts at zero"
                body="The £90,000 threshold applies to businesses established in the UK. Selling in from India without a fixed establishment, you register from the first taxable supply."
              />
              <Insight
                title="The Expansion Worker licence expires"
                body="Four years, non-renewable. No full UK trading presence within two and the allocation of Certificates of Sponsorship drops to zero. The conversion is planned at the start or not at all."
              />
              <Insight
                title="India did not get the twelve-month waiver"
                body="Japan and Australia negotiated away the prior-overseas-employment condition. India did not. Your candidate needs twelve months with the group before they can be moved."
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------- Services */}
      <Section tone="parchment">
        <Container width="wide">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHead
              eyebrow="Practice"
              title="Six areas, one instruction."
              lede="Each is delivered in a stated capacity — by Fiat Law, or by Janeevan as a solicitor through Taylor Rose. You are told which before the work starts."
            />
            <Link href="/services" className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-crimson-600 hover:text-crimson-500">
              All services
              <ArrowRight />
            </Link>
          </div>

          <div className="mt-14 grid gap-px border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex flex-col bg-bone p-8 transition-colors duration-300 hover:bg-parchment"
              >
                <span className="font-display text-sm italic text-crimson-600">{service.index}</span>
                <h3 className="mt-3 font-display text-2xl leading-tight text-ink">{service.name}</h3>
                <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-stone-600">{service.strapline}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-crimson-600">
                  Read
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------- The Entry Brief */}
      <Section>
        <Container width="wide">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <Eyebrow className="mb-5">The UK Entry Brief</Eyebrow>
              <h2 className="text-display-sm sm:text-display-md">
                We give away the hour everyone else charges for.
              </h2>
              <div className="measure-wide mt-7 space-y-4 text-[1.0625rem] leading-relaxed text-stone-700">
                <p>
                  The Department for Business and Trade has trained every inbound Indian corporate to expect a free first
                  consultation. Rather than pretend otherwise, we deliver it before you have spent it — in writing, at
                  no cost, at three in the morning in Bengaluru if that is when you are working.
                </p>
                <p>
                  Answer six to nine questions and you receive a brief built for your position: the route that fits,
                  the sequence in order with realistic elapsed time, the specific obstacles your profile will hit, and
                  what we would do at each step and in which capacity.
                </p>
                <p className="text-stone-600">
                  What we sell is the execution, the signature and the liability. Those are the things every free
                  government service disclaims in writing.
                </p>
              </div>
              <Link
                href="/uk-entry-brief"
                className="mt-9 inline-flex items-center gap-2.5 bg-crimson-600 px-8 py-4 text-[0.9375rem] font-medium text-bone transition-colors hover:bg-crimson-700"
              >
                Begin — four minutes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <ol className="relative border-l border-stone-200 pl-8">
              {briefSteps.map((step, i) => (
                <li key={step.title} className={i === 0 ? "" : "mt-9"}>
                  <span className="absolute -left-[5px] mt-2 block h-2.5 w-2.5 rounded-full bg-crimson-600" />
                  <h3 className="font-display text-xl leading-snug text-ink">{step.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-stone-600">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- Janeevan */}
      <Section tone="parchment">
        <Container width="wide">
          <div className="grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden bg-stone-200">
              <Image
                src={firm.principal.portrait}
                alt={firm.principal.name}
                fill
                sizes="(max-width: 1024px) 80vw, 30vw"
                className="object-cover object-top"
              />
            </div>
            <div>
              <Eyebrow className="mb-5">The practitioner</Eyebrow>
              <h2 className="text-display-sm sm:text-display-md">You will be dealing with Janeevan.</h2>
              <div className="measure-wide mt-7 space-y-4 text-[1.0625rem] leading-relaxed text-stone-700">
                <p>
                  Not a client relationship manager, not a business development lead, not an associate you meet after the
                  engagement letter is signed. A boutique&rsquo;s only real advantage over a full-service firm is that the
                  person who scoped the work is the person who does it, and that advantage disappears the moment it is
                  delegated.
                </p>
                <p>
                  Janeevan was admitted as a solicitor of England and Wales on {firm.principal.admitted} and practises
                  through {firm.regulatedFirm.legalName}, an SRA-authorised firm. Immigration, corporate and commercial
                  work for businesses moving between India and the United Kingdom.
                </p>
              </div>
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
                <Link href="/about" className="inline-flex items-center gap-2 text-sm font-medium text-crimson-600 hover:text-crimson-500">
                  About Janeevan
                  <ArrowRight />
                </Link>
                <a
                  href={firm.principal.sraCheckUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-stone-600 underline underline-offset-4 hover:text-ink"
                >
                  Verify SRA {firm.principal.sraNumber}
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------- CETA hub */}
      <Section tone="ink">
        <Container width="wide">
          <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <Eyebrow className="mb-5">India–UK CETA</Eyebrow>
              <h2 className="text-display-sm sm:text-display-md">Read from the treaty, not from a competitor&rsquo;s blog.</h2>
              <p className="mt-6 text-[1.0625rem] leading-relaxed text-bone/65">
                Our briefing on the Comprehensive Economic and Trade Agreement is written from the legal text, the impact
                assessment, the Immigration Rules, the implementing statutory instruments and the Indian customs
                notifications — a library of more than three hundred primary documents held on file. Every claim cites its
                source.
              </p>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-bone/65">
                It is free, and it is more accurate than most of what is being published about this agreement.
              </p>
              <Link
                href="/india-uk"
                className="mt-9 inline-flex items-center gap-2.5 border border-bone/35 px-8 py-4 text-[0.9375rem] font-medium text-bone transition-colors hover:bg-bone hover:text-ink"
              >
                Read the briefing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-px bg-bone/10">
              {cetaFacts.map((fact) => (
                <div key={fact.label} className="flex items-baseline justify-between gap-6 bg-ink px-1 py-5">
                  <span className="text-[0.9375rem] leading-snug text-bone/60">{fact.label}</span>
                  <span className="shrink-0 font-display text-xl text-bone">{fact.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------------- Engagement */}
      <Section>
        <Container width="wide">
          <SectionHead
            eyebrow="How we price"
            title="No price list, because there is no standard matter."
            lede="Every published fee in this corridor is either a commodity formation price that tells you nothing about your situation, or a number invented to be beaten on the call. We do neither."
          />
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {pricingSteps.map((step, i) => (
              <Card key={step.title}>
                <span className="font-display text-sm italic text-crimson-600">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-xl leading-snug text-ink">{step.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone-600">{step.body}</p>
              </Card>
            ))}
          </div>
          <p className="measure-wide mt-10 text-[0.9375rem] leading-relaxed text-stone-600">
            Fees are fixed wherever the scope can be fixed, and charged at an agreed rate where it genuinely cannot. You
            approve the figure in writing before any work begins, and you are told in advance if anything would change
            it.
          </p>
        </Container>
      </Section>
    </>
  );
}

function Insight({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-ink p-7">
      <h3 className="font-display text-lg leading-snug text-bone">{title}</h3>
      <p className="mt-3 text-[0.875rem] leading-relaxed text-bone/55">{body}</p>
    </div>
  );
}

const briefSteps = [
  {
    title: "Your position, restated",
    body: "So you can see we have understood it before you read a single recommendation.",
  },
  {
    title: "The route that fits — named",
    body: "UK Expansion Worker, Senior or Specialist Worker, Global Talent, or no visa at all. Including when the honest answer is that you do not need us.",
  },
  {
    title: "The sequence, with real elapsed time",
    body: "In order, with the bank account on the critical path where it belongs, and priority service costs where they change the timeline.",
  },
  {
    title: "The obstacles your profile will hit",
    body: "Specific to you. The nil VAT threshold, the DCC transitional trap, the two-year Expansion Worker cliff, the twelve-month employment condition.",
  },
  {
    title: "What we would do, and in which capacity",
    body: "Step by step, labelled Fiat Law or Janeevan as a solicitor through Taylor Rose. Then a written proposal, priced to that scope.",
  },
];

const cetaFacts = [
  { label: "Entry into force", value: "15 Jul 2026" },
  { label: "UK tariff reductions", value: "Immediate" },
  { label: "Double Contribution Convention", value: "60 months" },
  { label: "Investment chapter or ISDS", value: "None" },
  { label: "Carbon border provision", value: "None" },
  { label: "Procurement enforceable from", value: "2030" },
];

const pricingSteps = [
  {
    title: "Scope",
    body: "The brief, then a conversation. We establish what is actually needed — which is regularly less than you were expecting, and occasionally more.",
  },
  {
    title: "Proposal",
    body: "A written proposal setting out the work, the sequence, who does each part, in what capacity, and what it costs. Sent within two working days.",
  },
  {
    title: "Engagement",
    body: "Nothing starts until you have approved the figure in writing. No open-ended retainers, and no work outside the scope without your agreement.",
  },
];
