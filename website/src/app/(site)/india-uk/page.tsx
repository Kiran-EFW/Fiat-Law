import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Container, Section, ArrowRight, Button } from "@/components/ui";
import { cetaArticles } from "@/content/ceta";

export const metadata = pageMeta({
  title: "India–UK CETA",
  description:
    "A working briefing on the India–UK Comprehensive Economic and Trade Agreement in force from 15 July 2026, covering what changed for mobility, tariffs, social security and market access, and what did not.",
  path: "/india-uk",
  eyebrow: "The briefing",
});

const changed = [
  {
    title: "Tariffs, in full and at once",
    body: "UK tariff reductions applied on the day of entry into force with no phase-in. An Indian exporter can claim preference on the next shipment, provided the origin file supports it.",
  },
  {
    title: "Social security, for four extra years",
    body: "The Double Contribution Convention runs to 60 months. The genuinely new benefit is months 13 to 60, because a unilateral 52-week exemption already existed.",
  },
  {
    title: "Services commitments, bound",
    body: "Existing openness in a range of service sectors is now locked in rather than merely current policy. Predictability, rather than new access.",
  },
  {
    title: "Procurement, on paper",
    body: "UK contracts above SDR 130,000 for goods and services are opened, but Article 15.23 makes the chapter unenforceable state to state until 15 July 2030.",
  },
];

const unchanged = [
  {
    title: "No new visa route",
    body: "Nothing in the agreement creates a route. Everything runs through the existing Immigration Rules, the existing sponsor licence regime and the existing salary thresholds.",
  },
  {
    title: "No investment chapter, no ISDS",
    body: "Investment protection is not in this agreement. The 1994 bilateral investment treaty was terminated in 2017 with a sunset running to around 2032; a replacement remains unagreed.",
  },
  {
    title: "No carbon provision",
    body: "The UK Carbon Border Adjustment Mechanism starts on 1 January 2027 across five sectors. CETA is silent on it and there is no India exemption.",
  },
  {
    title: "No change to UK company law",
    body: "Resident director requirements, registered office rules, identity verification under ECCTA 2023 and the accounts regime are exactly as they were.",
  },
];

const timeline = [
  { date: "22 March 2017", event: "India–UK bilateral investment treaty terminated, with a fifteen-year sunset clause." },
  { date: "16 December 2025", event: "Immigration Skills Charge uplifted to £480 (small and charitable) and £1,320 (all others)." },
  { date: "6 July 2026", event: "Exchange of Notes extends the Double Contribution Convention from 36 to 60 months." },
  { date: "15 July 2026", event: "CETA enters into force. UK tariff reductions apply in full, immediately." },
  { date: "18 November 2026", event: "ECCTA 2023 identity verification transition closes for existing directors and PSCs." },
  { date: "1 January 2027", event: "UK CBAM begins: aluminium, cement, fertiliser, hydrogen, iron and steel." },
  { date: "15 July 2030", event: "The government procurement chapter becomes enforceable between the parties." },
];

export default function IndiaUkPage() {
  return (
    <>
      <PageHero
        eyebrow="India–UK CETA"
        title="In force since 15 July 2026. Less of it is new than you have been told."
        lede="This is the briefing we wrote for ourselves, from the agreement text, the Immigration Rules, the statutory instruments and the Indian customs notifications. It is published because the useful version of this is the checkable one."
        aside={
          <div className="border-l-2 border-crimson-600 pl-5">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-stone-500">Why this matters</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone-600">
              Almost every commercial decision in this corridor turns on a detail that is either misreported or absent
              from the agreement altogether. Three of the largest are set out below.
            </p>
          </div>
        }
      />

      {/* What changed / what did not */}
      <Section tone="parchment" className="border-t border-stone-200">
        <Container width="wide">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="eyebrow mb-5">What changed</p>
              <div className="space-y-8">
                {changed.map((item) => (
                  <div key={item.title} className="border-t border-stone-300 pt-6">
                    <h2 className="font-display text-xl leading-snug text-ink">{item.title}</h2>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone-600">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow mb-5">What did not</p>
              <div className="space-y-8">
                {unchanged.map((item) => (
                  <div key={item.title} className="border-t border-stone-300 pt-6">
                    <h2 className="font-display text-xl leading-snug text-ink">{item.title}</h2>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone-600">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* The three misreadings */}
      <Section tone="ink">
        <Container width="wide">
          <div className="max-w-3xl">
            <p className="eyebrow mb-5">Three things worth getting right</p>
            <h2 className="text-display-sm sm:text-display-md">
              Each of these appears the wrong way round in published commentary.
            </h2>
          </div>
          <div className="mt-14 grid gap-px bg-bone/10 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "The Service Supplier route needs your UK client to be the sponsor",
                body: "Paragraphs 5.2 to 5.4 put the A-rated sponsor licence requirement on the UK party receiving the service, not on the Indian supplier. If the counterparty is not a sponsor, the route is closed.",
              },
              {
                n: "02",
                title: "India did not get the twelve-month waiver",
                body: "Japan and Australia negotiated away the requirement for twelve months' prior employment with the overseas business before an Expansion Worker application. India did not.",
              },
              {
                n: "03",
                title: "The DCC saving starts at month thirteen",
                body: "A unilateral 52-week National Insurance exemption already existed under the 2001 Contributions Regulations. The convention's additional value is months 13 to 60, which is real but not what is usually claimed.",
              },
            ].map((item) => (
              <div key={item.n} className="bg-ink p-8 md:p-9">
                <span className="font-display text-sm italic text-gold">{item.n}</span>
                <h3 className="mt-4 font-display text-xl leading-snug text-bone">{item.title}</h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-bone/60">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Articles */}
      <Section>
        <Container width="wide">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow mb-4">The briefing</p>
              <h2 className="text-display-sm sm:text-display-md">Three parts, each sourced.</h2>
            </div>
          </div>
          <div className="mt-12 grid gap-px border border-stone-200 bg-stone-200 md:grid-cols-3">
            {cetaArticles.map((article, i) => (
              <Link
                key={article.slug}
                href={`/india-uk/${article.slug}`}
                className="group flex flex-col bg-parchment p-8 transition-colors hover:bg-bone"
              >
                <span className="font-display text-sm italic text-crimson-600">
                  Part {["I", "II", "III"][i]}
                </span>
                <h3 className="mt-4 font-display text-2xl leading-snug text-ink">{article.title}</h3>
                <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-stone-600">{article.standfirst}</p>
                <span className="mt-7 flex items-center justify-between border-t border-stone-200 pt-5">
                  <span className="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-crimson-600">
                    Read
                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="text-[0.6875rem] uppercase tracking-[0.12em] text-stone-400">
                    {article.readingMinutes} min
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* The lookup */}
      <Section tone="parchment" className="border-t border-stone-200 !py-16">
        <Container width="wide">
          <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
            <div>
              <p className="eyebrow mb-4">Look it up yourself</p>
              <h2 className="text-display-sm">
                The whole schedule, searchable by commodity code.
              </h2>
              <p className="measure-wide mt-5 text-[1rem] leading-relaxed text-stone-600">
                We extracted Appendix 2A-b and Annex 3A from the treaty text laid before Parliament. Enter a code and
                you get the United Kingdom&rsquo;s commitment on that line, being duty-free, quota or excluded, and the
                rule of origin the goods have to satisfy, quoted rather than summarised. It is the same lookup we run
                internally before advising on a shipment.
              </p>
            </div>
            <div className="border-l-2 border-crimson-600 pl-6">
              <p className="text-[0.9375rem] leading-relaxed text-stone-700">
                It answers one question most commentary gets wrong: the UK opened exactly one tariff rate quota, on
                electric and hybrid cars, and it does not open until 2031.
              </p>
              <Button href="/india-uk/tariff-lookup" className="mt-7">
                Open the lookup
                <ArrowRight />
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Timeline */}
      <Section tone="parchment" className="border-y border-stone-200">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:gap-20">
            <div>
              <p className="eyebrow mb-5">Dates that bind</p>
              <h2 className="text-display-sm">The sequence the corridor is actually on.</h2>
              <p className="mt-6 text-[0.9375rem] leading-relaxed text-stone-600">
                Two of these are deadlines rather than milestones. If you already have a UK company, 18 November 2026
                applies to you. If you are in one of the five carbon sectors, 1 January 2027 applies to you.
              </p>
            </div>
            <ol className="space-y-0">
              {timeline.map((item) => (
                <li key={item.date} className="grid gap-2 border-t border-stone-300 py-6 sm:grid-cols-[11rem_1fr] sm:gap-8">
                  <span className="font-sans text-[0.8125rem] font-medium uppercase tracking-[0.1em] text-crimson-600">
                    {item.date}
                  </span>
                  <span className="text-[1rem] leading-relaxed text-stone-700">{item.event}</span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container width="narrow" className="text-center">
          <h2 className="text-display-sm sm:text-display-md">
            None of this tells you what <em>your</em> position runs into.
          </h2>
          <p className="measure mx-auto mt-6 text-[1.0625rem] leading-relaxed text-stone-600">
            The UK Entry Brief takes six questions and returns the route, the sequence, the specific obstacles your
            situation will hit, and the capacity each piece of work would be delivered in. No figures, no obligation.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button href="/uk-entry-brief" size="lg">
              Start the UK Entry Brief
              <ArrowRight />
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Speak to Janeevan
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
