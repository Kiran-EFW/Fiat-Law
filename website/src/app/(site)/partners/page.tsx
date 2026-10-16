import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Container, Section, ArrowRight } from "@/components/ui";
import { EnquiryForm } from "@/components/EnquiryForm";
import { EphemeralLeadNotice } from "@/components/PreviewBanner";
import { firm } from "@/config/firm";

export const metadata = pageMeta({
  title: "Partners and referrals",
  description:
    "Fiat Law works with Indian law firms, chartered accountants, trade bodies and UK professional firms on India–UK entry work. How referrals are handled, and what we commit to.",
  path: "/partners",
  eyebrow: "Partners and referrals",
});

const referrers = [
  {
    title: "Indian law firms",
    body: "You hold the client relationship and the Indian law. We take the English law elements — entity, contracts, immigration, acquisitions — and hand them back with the client relationship intact. We do not advise on Indian law and we do not compete for your mandate.",
  },
  {
    title: "Chartered accountants and CA firms",
    body: "The UK subsidiary, the transfer pricing conversation, the VAT position for a non-established taxable person, and the audit exemption question that is tested at group level rather than at the UK company. We work alongside your team rather than displacing it.",
  },
  {
    title: "Chambers, trade bodies and promotion agencies",
    body: "Structured briefings for delegations and members, and a clear route for the members whose questions go past what a free orientation session can answer. We are content to do the general session unpaid; that is how people find out whether we know the subject.",
  },
  {
    title: "UK professional firms",
    body: "Corporate finance advisers, commercial property agents, recruiters and IFAs with an Indian-owned client who needs the entity, immigration and compliance side handled properly. Reciprocal where it makes sense; never a condition.",
  },
];

const commitments = [
  {
    n: "01",
    title: "Your client stays your client",
    body: "We take the scope you give us and nothing beyond it without asking you first. If the client raises something in your territory, we say so and route it back.",
  },
  {
    n: "02",
    title: "You are told the capacity too",
    body: "Every piece of work is delivered either by Fiat Law as corporate services or by Janeevan as a solicitor through Taylor Rose. You get the same disclosure the client does, so you know exactly what you are referring into.",
  },
  {
    n: "03",
    title: "Referral arrangements are disclosed",
    body: "Where there is any fee-sharing or referral arrangement, it is disclosed in writing to the client at the outset, as the SRA Codes require. We will not accept an arrangement that cannot be disclosed.",
  },
  {
    n: "04",
    title: "A written scope before anything starts",
    body: "You and the client see the same proposal: what is in scope, what is out, who does it, and what it costs. There are no figures on this site and there is always a figure in the proposal.",
  },
];

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Partners and referrals"
        title="A boutique is only useful if it knows where its edges are."
        lede="Fiat Law does one corridor. Everything outside it — Indian law, audit, transfer pricing, specialist tax, property, recruitment — is done by people who do that for a living, either yours or ours. This page is how that works in practice."
        aside={
          <div className="border-l-2 border-crimson-600 pl-5">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-stone-500">Already advising</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone-600">
              If you have an Indian client asking about the UK and you want a second opinion before it becomes a
              mandate, ask. A short conversation between advisers is not a referral and is not charged for.
            </p>
          </div>
        }
      />

      {/* Who we work with */}
      <Section tone="parchment" className="border-t border-stone-200">
        <Container width="wide">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">Who we work with</p>
            <h2 className="text-display-sm sm:text-display-md">Four kinds of relationship, all of them one-directional by design.</h2>
          </div>
          <div className="mt-14 grid gap-px border border-stone-200 bg-stone-200 sm:grid-cols-2">
            {referrers.map((item) => (
              <div key={item.title} className="bg-bone p-8 sm:p-9">
                <h3 className="font-display text-xl leading-snug text-ink">{item.title}</h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-stone-600">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* The coordinated capacity */}
      <Section tone="ink">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <div>
              <p className="eyebrow mb-5">The other direction</p>
              <h2 className="text-display-sm">What we bring in, and how we say so.</h2>
            </div>
            <div>
              <p className="text-[1.0625rem] leading-relaxed text-bone/65">
                Some services in a UK entry package are ours and some are not. Statutory accounts preparation, audit,
                payroll bureau work, specialist tax structuring and Indian-side regulatory work are delivered by named
                partner firms under their own engagement letters, with their own regulators and their own insurance.
              </p>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-bone/65">
                Where that is the case, the service is marked <em>coordinated</em> on this site and in your brief. We
                run the project, hold the timetable and stay accountable for the sequence; the specialist firm is
                responsible for its own work and you contract with them directly. You are never left uncertain about
                who is liable for what.
              </p>
              <div className="mt-9 grid gap-px bg-bone/10 sm:grid-cols-2">
                <div className="bg-ink pb-7 sm:pb-0 sm:pr-9">
                  <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-gold-soft">
                    Reserved legal work
                  </p>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-bone/60">
                    Carried out by {firm.principal.name}, solicitor, SRA {firm.principal.sraNumber}, practising through{" "}
                    {firm.regulatedFirm.legalName}, SRA {firm.regulatedFirm.sraNumber}.
                  </p>
                </div>
                <div className="bg-ink pt-7 sm:pl-9 sm:pt-0">
                  <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-gold-soft">
                    Accounting, audit and payroll
                  </p>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-bone/60">
                    Delivered by regulated partner practices under their own engagement, coordinated by us against a
                    single compliance calendar.
                  </p>
                </div>
              </div>
              <Link
                href="/legal/regulatory"
                className="mt-9 inline-flex items-center gap-2 border border-bone/35 px-7 py-3.5 text-sm font-medium text-bone transition-colors hover:bg-bone hover:text-ink"
              >
                Regulatory information
                <ArrowRight />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* Commitments */}
      <Section>
        <Container width="wide">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">What we commit to</p>
            <h2 className="text-display-sm sm:text-display-md">Four rules that make a referral safe to make.</h2>
          </div>
          <div className="mt-14 grid gap-px border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-4">
            {commitments.map((item) => (
              <div key={item.n} className="bg-parchment p-8">
                <span className="font-display text-sm italic text-crimson-600">{item.n}</span>
                <h3 className="mt-4 font-display text-lg leading-snug text-ink">{item.title}</h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-stone-600">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Form */}
      <Section tone="parchment" className="border-t border-stone-200">
        <Container width="wide">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div>
              <h2 className="text-display-sm">Talk to us about working together</h2>
              <p className="measure mt-6 text-[1.0625rem] leading-relaxed text-stone-600">
                Tell us what you do, who your clients are and what you keep having to turn away. If there is a fit we
                will say so, and if there is not we will say that instead.
              </p>
              <p className="mt-6 text-[0.875rem] leading-relaxed text-stone-500">
                For client matters rather than partnerships, the{" "}
                <Link href="/uk-entry-brief" className="text-crimson-600 underline underline-offset-4">
                  UK Entry Brief
                </Link>{" "}
                is faster — it produces a written position your client can read before anyone speaks.
              </p>
            </div>
            <div>
              <EphemeralLeadNotice className="mb-8" />
              <EnquiryForm context="Partnership enquiry" defaultSubject="Referral relationship" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
