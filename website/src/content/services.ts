import type { Capacity } from "@/config/firm";
import type { SegmentId } from "@/lib/segments";

export interface ServiceItem {
  title: string;
  body: string;
  /** Optional capability gate from firm.capabilities. Hidden when false. */
  requires?: "tcspSupervised" | "acspRegistered" | "immigrationAdvice" | "accountingInHouse";
}

export interface Service {
  slug: string;
  /** Roman numeral used as an editorial index mark. */
  index: string;
  name: string;
  /** One line under the name in navigation and cards. */
  strapline: string;
  /** The client's problem, in their words. */
  problem: string;
  /** Two or three paragraphs on what actually happens. */
  reality: string[];
  /** The specific traps. These are the reason to read the page. */
  traps: { title: string; body: string }[];
  /** What we do. */
  work: ServiceItem[];
  capacity: Capacity;
  segments: SegmentId[];
  metaDescription: string;
}

export const services: Service[] = [
  {
    slug: "uk-entry",
    index: "I",
    name: "UK entry & entity",
    strapline: "Branch or subsidiary, incorporation, identity verification, registered office, company secretarial",
    problem: "We need a UK company. We are not sure what kind, where, or what it commits us to.",
    reality: [
      "Incorporation itself is a commodity — a formation agent will do it for under two hundred pounds and their interface is better than any law firm's. What is not a commodity is the set of decisions taken in the ten minutes before you press submit, because several of them are expensive to reverse and one or two of them are not reversible at all.",
      "Branch or subsidiary is the first. A UK establishment of an Indian company files the Indian parent's accounts at Companies House, where any customer, competitor or counterparty can read them; a subsidiary does not. Share structure is the second: a single ordinary class is fine until the moment you want to give a UK managing director equity without giving them votes, and by then you are amending articles and filing forms.",
      "Then there is the address. Section 86 of the Companies Act 2006 requires an appropriate address — one where a document delivered by hand or post would come to the attention of someone acting for the company, and where delivery can be acknowledged. PO boxes no longer qualify. If the company is later sponsoring a visa, a Home Office compliance officer may attend that address unannounced under paragraph L8.20 of the sponsor guidance. An address that cannot survive that visit is worse than no address.",
    ],
    traps: [
      {
        title: "A UK-resident director is not required — and a nominee cannot be your Authorising Officer",
        body: "Section 155 of the Companies Act 2006 requires at least one director who is a natural person. It does not require a UK resident. Anyone selling you a resident director on the basis that the law demands one is selling you something you do not need. And if you intend to sponsor a visa, note that paragraph L4.33 of the sponsor guidance requires the Authorising Officer to be a paid member of your staff or an office holder — you cannot appoint a representative from another organisation to that role. A nominee arrangement will not carry the licence.",
      },
      {
        title: "Identity verification is now a dated obligation, not a formality",
        body: "Under the Economic Crime and Corporate Transparency Act 2023, directors and people with significant control must verify their identity. It became mandatory for new appointments on 18 November 2025 and the transition for existing officers closes on 18 November 2026. For an Indian-resident director this is not a five-minute exercise, and failure has consequences at the register.",
      },
      {
        title: "The bank account is the critical path, and nobody tells you in advance",
        body: "Six to eight weeks is normal for a UK business bank account where the directors and beneficial owners are overseas. It is routinely the longest single item in a UK entry, it cannot start until the company exists, and it will hold up payroll, VAT recovery and your first invoice. Sequence around it from day one.",
      },
    ],
    work: [
      { title: "Structure advice", body: "Branch versus subsidiary, share classes, articles, shareholder and parent arrangements — decided before incorporation, not after." },
      { title: "Incorporation", body: "The company formed on the structure agreed, with articles that reflect it." },
      { title: "Identity verification", body: "ECCTA verification for directors and PSCs resident in India, coordinated end to end.", requires: "acspRegistered" },
      { title: "Registered office", body: "A real, staffed, inspectable London address that satisfies section 86 and survives a Home Office visit.", requires: "tcspSupervised" },
      { title: "Company secretarial", body: "Statutory registers, confirmation statements, board and shareholder resolutions, filings on time." },
      { title: "Remediation", body: "Late filings, incorrect registers, strike-off action and PSC errors put right." },
    ],
    capacity: "fiat-law",
    segments: ["bridgehead", "establisher", "operator", "acquirer"],
    metaDescription:
      "UK company formation, structure, ECCTA identity verification, registered office and company secretarial services for Indian businesses entering the United Kingdom.",
  },
  {
    slug: "immigration",
    index: "II",
    name: "Business immigration",
    strapline: "Sponsor licence, UK Expansion Worker, Senior or Specialist Worker, Global Talent, Innovator Founder, compliance",
    problem: "We need our people in the UK. We do not know which route, or in what order.",
    reality: [
      "The Global Business Mobility UK Expansion Worker route exists precisely for a business with no UK trading presence yet, and paragraph GBM3.4 of the sponsor guidance says a Companies House reference number is sufficient to demonstrate the footprint it requires. That single sentence is why the entity and the visa are one transaction rather than two, and why buying them from two suppliers costs you weeks.",
      "But the route is a bridge, not a destination. An Expansion Worker licence is granted for four years and cannot be renewed. If the business has not established a full UK trading presence within two years, the allocation of Certificates of Sponsorship drops to zero under paragraph GBM3.38. The conversion to a standard Skilled Worker or Senior or Specialist Worker licence is the whole game, and it is planned at the start or not at all.",
      "The thresholds moved. Appendix Global Business Mobility now sets £52,500 for Senior or Specialist Worker and UK Expansion Worker, £27,300 for Graduate Trainee, and £73,900 for the high earner provision. Several published explainers still carry the old figures. The Immigration Rules are the authority; a blog is not.",
    ],
    traps: [
      {
        title: "India did not get the twelve-month waiver",
        body: "Japan and Australia negotiated a waiver of the requirement that an Expansion Worker has been employed by the overseas business for twelve months before applying. India did not. Your candidate must have that twelve months of prior overseas employment with the sponsoring group, and a recent hire will not qualify no matter how senior.",
      },
      {
        title: "Service Supplier requires the UK client to be the A-rated sponsor",
        body: "Paragraphs 5.2 to 5.4 of the Service Supplier route require the UK party receiving the service to hold the A-rated sponsor licence — not the Indian supplier. A good deal of published commentary states the opposite. If your UK counterparty is not a sponsor, this route is not open to you and the mobility provisions of the trade agreement will not fix it.",
      },
      {
        title: "The Immigration Skills Charge was uplifted",
        body: "From 16 December 2025 the charge is £480 per twelve months for small and charitable sponsors and £1,320 for all others. The £364 and £1,000 figures still circulating in competitor material are out of date, and a licence budget built on them will be materially wrong.",
      },
      {
        title: "The Double Contribution Convention runs 60 months — but the first year was already free",
        body: "The convention was extended from 36 to 60 months by SI 2026/794. The genuinely valuable period is months 13 to 60, because regulations 145(2) and 146 of the Social Security (Contributions) Regulations 2001 already gave a unilateral 52-week exemption. There is also a transitional trap: an employee already on a UK assignment on 15 July 2026 is not a detached worker for the purposes of Article 7(2).",
      },
    ],
    work: [
      { title: "Route selection", body: "An honest assessment of which route fits — including telling you when you do not need a sponsor licence at all.", requires: "immigrationAdvice" },
      { title: "Sponsor licence", body: "Application, supporting evidence, Authorising Officer and Key Personnel structure, and the systems a compliance visit will ask to see.", requires: "immigrationAdvice" },
      { title: "UK Expansion Worker", body: "The route into the market, planned alongside incorporation so the Companies House number arrives when the application needs it.", requires: "immigrationAdvice" },
      { title: "Senior or Specialist Worker", body: "Intra-group transfers, and the conversion off the Expansion Worker licence before the two-year cliff.", requires: "immigrationAdvice" },
      { title: "Global Talent and Innovator Founder", body: "For founders and individuals — routes that need no sponsor, no UK entity and no job offer.", requires: "immigrationAdvice" },
      { title: "Compliance", body: "Right to work, reporting duties, record keeping and audit readiness — before the visit, not after it.", requires: "immigrationAdvice" },
    ],
    capacity: "solicitor",
    segments: ["bridgehead", "establisher", "principal"],
    metaDescription:
      "Sponsor licence applications, UK Expansion Worker, Senior or Specialist Worker, Global Talent and Innovator Founder routes for Indian businesses and founders.",
  },
  {
    slug: "corporate",
    index: "III",
    name: "Corporate & commercial",
    strapline: "Shareholders' agreements, share purchase, distribution and agency, commercial contracts",
    problem: "We need the documents that hold the UK business together, drafted so they work here.",
    reality: [
      "English law is chosen as the governing law of a very large share of the world's cross-border commercial contracts, and Indian parties choose it constantly — often without appreciating that the reason it is chosen is that English courts hold parties to what they wrote. There is limited scope for arguing that the commercial substance was different from the drafting.",
      "That cuts both ways. A well-drafted English law agreement is a reliable instrument. A contract adapted from an Indian template, or a UK precedent bought online and filled in, tends to fail at the points that matter most: limitation of liability, termination, intellectual property ownership, and what happens when a shareholder wants out.",
      "The shareholders' agreement is the one most often skipped and most expensive to skip. Two founders who agree about everything do not need one until they disagree about one thing, and by then the negotiating leverage has already been allocated by the articles they never read.",
    ],
    traps: [
      {
        title: "The Commercial Agents Regulations give an agent compensation you did not agree to",
        body: "Appoint a UK commercial agent to sell your goods and the Commercial Agents (Council Directive) Regulations 1993 may apply whatever the contract says. On termination the agent can be entitled to compensation or an indemnity that was never negotiated and can run to a year's average commission. Whether you appoint an agent or a distributor is therefore a legal decision, not a commercial label.",
      },
      {
        title: "A UK managing director with shares and no agreement is a governance problem",
        body: "Equity for the person running the UK subsidiary is standard and sensible. Doing it without a shareholders' agreement, without vesting and without leaver provisions means that if the relationship ends badly, a former employee is a permanent minority shareholder in your UK business with statutory rights you cannot switch off.",
      },
    ],
    work: [
      { title: "Shareholders' agreements", body: "Control, reserved matters, deadlock, vesting, leavers, exit — negotiated before they are needed." },
      { title: "Articles of association", body: "Drafted to match the agreement, not the default model articles." },
      { title: "Commercial contracts", body: "Supply, services, distribution, agency, licensing and framework agreements under English law." },
      { title: "Share purchase and subscription", body: "Investment rounds, transfers, buy-backs and reorganisations." },
      { title: "Employment documentation", body: "Contracts, restrictive covenants, policies and the section 1 statement." },
      { title: "Legal due diligence", body: "On a target, a counterparty, or your own house before someone else looks at it." },
    ],
    capacity: "solicitor",
    segments: ["establisher", "exporter", "acquirer", "operator"],
    metaDescription:
      "English law shareholders' agreements, commercial contracts, distribution and agency, share purchase and legal due diligence for Indian businesses in the UK.",
  },
  {
    slug: "ma",
    index: "IV",
    name: "Mergers & acquisitions",
    strapline: "Transaction documents, due diligence, warranties, national security screening, integration",
    problem: "We are buying a UK business and need someone who has read the other side's disclosure letter properly.",
    reality: [
      "Acquiring an established UK business is frequently faster and cheaper than building one: the customers, the accreditations, the staff and the trading history already exist, and the trading history is what the bank wanted to see before it would open the account. For an Indian corporate with capital and no UK footprint, it is a serious alternative to organic entry rather than a separate strategy.",
      "The work that determines whether the deal was a good one is done before signing, and most of it is unglamorous. Reading the disclosure letter against the warranties line by line. Establishing what the employees are actually entitled to. Finding the change-of-control clause in the largest customer contract. Checking whether the pension scheme has a deficit and who is on the hook for it.",
      "Then there is screening. The National Security and Investment Act 2021 makes notification mandatory for acquisitions in seventeen sensitive sectors, and the definitions are considerably broader than the sector names suggest — advanced materials, computing hardware, data infrastructure and critical suppliers to government catch businesses that do not think of themselves as sensitive at all. Completing without clearance where clearance was required makes the transaction void.",
    ],
    traps: [
      {
        title: "Seventeen sectors, and the definitions are wider than they sound",
        body: "A software business selling into a utility can fall within critical suppliers. A components manufacturer can fall within advanced materials. The mandatory regime is not a formality, and the sanction for getting it wrong is not a fine but a void transaction.",
      },
      {
        title: "Warranties are only as good as the disclosure letter and the person standing behind them",
        body: "A comprehensive warranty schedule is worth very little if the disclosure letter is broad enough to carve out the problems, or if the warrantor is a retiring individual with no assets after completion. Warranty and indemnity insurance is often the answer, and it must be arranged during the deal rather than remembered afterwards.",
      },
      {
        title: "We advise on the transaction; we do not arrange the investment",
        body: "Arranging deals in investments and advising on investments are regulated activities under the Financial Services and Markets Act 2000. Our work is legal advice on the transaction and its documents. Where a regulated corporate finance function is needed, you are introduced to an authorised firm and told so in writing.",
      },
    ],
    work: [
      { title: "Structuring", body: "Share purchase or asset purchase, acquisition vehicle, funding structure and tax interface." },
      { title: "Due diligence", body: "Legal diligence across corporate, commercial, employment, property and intellectual property, reported by exception." },
      { title: "Transaction documents", body: "Heads of terms, share or asset purchase agreement, disclosure letter, ancillary documents." },
      { title: "Warranties and indemnities", body: "Negotiated, quantified, and insured where insurance is the right answer." },
      { title: "National security screening", body: "Assessment against the seventeen mandatory sectors, and notification where required." },
      { title: "Completion and integration", body: "Completion mechanics, post-completion filings, and the integration work that follows." },
    ],
    capacity: "solicitor",
    segments: ["acquirer"],
    metaDescription:
      "Legal advice on UK acquisitions for Indian corporates: due diligence, share purchase agreements, warranties, National Security and Investment Act screening and integration.",
  },
  {
    slug: "accounting",
    index: "V",
    name: "Accounting & compliance",
    strapline: "PAYE, VAT, payroll, statutory accounts, confirmation statements",
    problem: "We need the UK back office to run without anyone in India thinking about it.",
    reality: [
      "The UK's filing obligations are not onerous but they are unforgiving about dates, and the penalties are automatic. A small company that files its accounts a day late pays a penalty with no discretion attached. A company that misses its confirmation statement can be struck off the register, which is an inconvenience until you discover the bank has frozen the account.",
      "The order matters more than the individual registrations. PAYE must be in place before the first payroll runs, not after. VAT registration timing interacts with when you can recover input tax on set-up costs. Corporation tax notification follows incorporation on its own clock. Each is straightforward; the sequence is where entrants lose money.",
    ],
    traps: [
      {
        title: "For a non-established taxable person the VAT threshold is nil",
        body: "The £90,000 registration threshold applies to businesses established in the UK. If your business is not established here — selling into the UK from India without a fixed establishment — you must register for VAT from your first taxable supply. There is no threshold at all. This is the single most common and most expensive misunderstanding among Indian exporters entering the UK.",
      },
      {
        title: "A UK subsidiary of an Indian parent may not qualify as small",
        body: "The small company exemptions from audit and from full accounts are tested against the whole group, not the UK entity alone. A modest UK subsidiary of a substantial Indian group can find itself outside the exemption and facing an audit requirement that was never in the budget.",
      },
    ],
    work: [
      { title: "Registrations", body: "Corporation tax, PAYE, VAT and the Construction Industry Scheme where relevant — in the right order." },
      { title: "Payroll", body: "Monthly payroll, Real Time Information submissions, pension auto-enrolment, P60s and P11Ds." },
      { title: "VAT", body: "Registration including for non-established taxable persons, returns, and Making Tax Digital compliance." },
      { title: "Statutory accounts", body: "Annual accounts prepared and filed, and the corporation tax return." },
      { title: "Management reporting", body: "Reporting the Indian parent can actually consolidate, on a cadence that matches its own." },
      { title: "Confirmation statements", body: "Filed on time, with the register kept accurate between filings." },
    ],
    capacity: "coordinated",
    segments: ["bridgehead", "establisher", "exporter", "operator"],
    metaDescription:
      "UK PAYE, VAT, payroll, statutory accounts and filing compliance for Indian-owned UK companies, including non-established taxable person VAT registration.",
  },
  {
    slug: "trade",
    index: "VI",
    name: "Trade under CETA",
    strapline: "Rules of origin, self-certification, tariff preference, customs, CBAM readiness",
    problem: "The trade agreement is in force. We want the tariff benefit and we do not want it clawed back.",
    reality: [
      "The India–UK Comprehensive Economic and Trade Agreement entered into force on 15 July 2026. On the UK side the tariff reductions took effect immediately, with no phase-in — which is unusual, and which means the benefit is available on the next shipment rather than in five years.",
      "Preference is not automatic. It has to be claimed, and the claim has to be supported by origin. Getting origin right is a documentary discipline that starts at your supplier, not at the border: you need to know the tariff classification of the finished good, the origin status of every material input, and which of the applicable origin rules you are satisfying. Self-certification puts that responsibility on the exporter, and the records have to be retained and produced if the claim is verified years later.",
      "There is also a live drafting conflict worth knowing about between condition 3 of DGFT Public Notice 19/2026-27 and Rule 16(1)(b) of Notification 62/2026-Customs (N.T.). Where two instruments do not sit together cleanly, the safe course is to build the file that satisfies both.",
    ],
    traps: [
      {
        title: "A preference claim that fails verification is recovered with interest",
        body: "Customs authorities verify. If the origin evidence does not support the claim, the duty is recovered — from the importer, with interest, and potentially across every prior consignment within the retention period. The saving is real, but it is a saving on a documented claim, not on an assumed one.",
      },
      {
        title: "The agreement contains no carbon border provision at all",
        body: "The UK's Carbon Border Adjustment Mechanism starts on 1 January 2027, covering aluminium, cement, fertiliser, hydrogen and iron and steel. There is no India exemption in CETA — the agreement is silent on the subject. Exporters in those five sectors should be modelling the effect on their landed cost now, because the tariff advantage and the carbon charge move in opposite directions.",
      },
      {
        title: "Procurement is open but not enforceable yet",
        body: "The government procurement chapter gives access above SDR 130,000 for UK goods and services contracts and SDR 5 million for construction, with India's own thresholds set higher. Article 15.23 makes the chapter unenforceable state to state until 15 July 2030, so the practical route is commercial rather than legal.",
      },
    ],
    work: [
      { title: "Origin assessment", body: "Product-specific rules applied to your actual bill of materials, and the classification that drives them." },
      { title: "Self-certification", body: "The statement of origin, the underlying record set, and the retention discipline behind it." },
      { title: "Customs and duty", body: "Classification, valuation, and the correct claim on entry." },
      { title: "Verification readiness", body: "The file assembled before it is asked for, so a verification is a document request and not an investigation." },
      { title: "Route to market", body: "Distribution and agency structures, with the Commercial Agents Regulations properly handled." },
      { title: "CBAM readiness", body: "Exposure assessment for the five covered sectors ahead of 1 January 2027." },
    ],
    capacity: "fiat-law",
    segments: ["exporter", "establisher"],
    metaDescription:
      "India–UK CETA rules of origin, self-certification, tariff preference, customs classification and CBAM readiness for Indian exporters to the United Kingdom.",
  },
];

export const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s])) as Record<string, Service>;

export function servicesForSegment(segmentId: SegmentId): Service[] {
  return services.filter((s) => s.segments.includes(segmentId));
}
