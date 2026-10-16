import type { Block } from "@/content/blocks";
import type { SegmentId } from "@/lib/segments";

export interface Insight {
  slug: string;
  title: string;
  standfirst: string;
  updated: string;
  readingMinutes: number;
  topic: "Company law" | "Immigration" | "Compliance" | "Transactions";
  segments: SegmentId[];
  blocks: Block[];
  sources: string[];
  metaDescription: string;
}

export const insights: Insight[] = [
  {
    slug: "registered-office-is-not-a-mailbox",
    title: "A registered office is not a mailbox",
    standfirst:
      "Section 86 of the Companies Act 2006 was rewritten by ECCTA 2023. PO boxes are out, and an address that cannot deliver a document to a human being is now grounds for the Registrar to move you and eventually to strike you off.",
    updated: "August 2026",
    readingMinutes: 5,
    topic: "Company law",
    segments: ["bridgehead", "establisher", "operator"],
    metaDescription:
      "What section 86 of the Companies Act 2006 now requires of a registered office after ECCTA 2023: appropriate address, no PO boxes, acknowledgement of delivery, and the strike-off risk.",
    blocks: [
      {
        kind: "p",
        text: "The registered office is the cheapest line item in a UK entry budget and the one most likely to cause the company to be dissolved. That is not a rhetorical flourish. It is the sequence set out in sections 1000 to 1002 of the Companies Act 2006, and it starts with post that nobody answers.",
      },
      { kind: "h", text: "What the section now says" },
      {
        kind: "p",
        text: "Since the Economic Crime and Corporate Transparency Act 2023 amended it, section 86 requires a company's registered office to be an 'appropriate address'. An address is appropriate if, in the ordinary course of events, a document addressed to the company and delivered there would be expected to come to the attention of a person acting on behalf of the company, and delivery there is capable of being recorded by an acknowledgement of delivery.",
      },
      {
        kind: "p",
        text: "Two consequences follow immediately. A PO box cannot be a registered office. And an address that technically receives mail but where nothing is opened, scanned or escalated is not compliant either, however respectable the postcode.",
      },
      {
        kind: "callout",
        title: "The Registrar can move you",
        text: "Where the Registrar is satisfied the address is not appropriate, the company's registered office can be changed to a default address at Companies House. From that point the company is on a path to strike-off unless it acts, and correspondence, including from HMRC and from claimants, is going somewhere the company is not reading.",
      },
      { kind: "h", text: "Why this bites hardest on overseas groups" },
      {
        kind: "p",
        text: "A UK subsidiary of an Indian parent typically has no employee in the UK for the first six to eighteen months. Post arrives at an address where nobody has been told what any of it means. A Companies House late filing notice, a corporation tax determination, an employment tribunal claim form and a bank marketing letter all look identical to a receptionist at a serviced office.",
      },
      {
        kind: "p",
        text: "The failure mode is almost never dramatic. It is a confirmation statement missed by four months, then an accounts filing missed, then a first Gazette notice for compulsory strike-off that nobody sees. Restoration is possible and it is slow, public and expensive, and in the meantime the company's assets have vested in the Crown as bona vacantia.",
      },
      { kind: "h", text: "What an address actually has to do" },
      {
        kind: "numbers",
        items: [
          "Receive and record delivery, including of documents served personally or by process server.",
          "Put every item in front of a named person who knows the difference between a statutory notice and a circular, on the day it arrives.",
          "Escalate anything with a deadline to the person who can meet it, which for an overseas group means someone in a compatible time zone with authority to act.",
          "Keep the record, because service is a question of fact and the company may need to prove what arrived and when.",
        ],
      },
      { kind: "h", text: "The related traps" },
      {
        kind: "list",
        items: [
          "The registered office address is public. Directors who use a home address as the registered office publish it, permanently, in a searchable register.",
          "A registered email address is now also required, and must be one where messages sent by the Registrar come to the company's attention. The same reasoning applies to it.",
          "Providing a registered office to third parties for a fee is itself a regulated activity, namely trust or company service provider work supervised under the Money Laundering Regulations 2017. Ask any provider who supervises them.",
          "The registered office is not necessarily the right address for HMRC, and using it as the trading address on invoices can create questions about where the business is actually established.",
        ],
      },
    ],
    sources: [
      "Companies Act 2006, s.86 (as amended by the Economic Crime and Corporate Transparency Act 2023)",
      "Companies Act 2006, ss.1000–1002 (striking off)",
      "Economic Crime and Corporate Transparency Act 2023",
      "Money Laundering, Terrorist Financing and Transfer of Funds (Information on the Payer) Regulations 2017, reg. 12(2)",
    ],
  },

  {
    slug: "authorising-officer-cannot-be-a-nominee",
    title: "Your Authorising Officer cannot be a nominee",
    standfirst:
      "The single most common structural defect in an overseas group's sponsor licence application, and the reason a 'we provide the UK director' package quietly fails at the compliance visit.",
    updated: "August 2026",
    readingMinutes: 6,
    topic: "Immigration",
    segments: ["bridgehead", "establisher", "operator"],
    metaDescription:
      "Sponsor licence key personnel: why paragraph L4.33 requires the Authorising Officer to be a paid member of staff or an office holder, and why nominee director arrangements fail Home Office scrutiny.",
    blocks: [
      {
        kind: "p",
        text: "A sponsor licence requires key personnel, and the most important of them is the Authorising Officer, being the most senior person responsible for the recruitment of sponsored workers and for the sponsor's compliance duties. Paragraph L4.33 of the sponsor guidance requires that person to be a paid member of staff or an office holder.",
      },
      {
        kind: "p",
        text: "This is where a great deal of packaged 'UK entry' provision comes apart. The offer is a UK company, a UK address and a UK-resident director supplied by the provider. The provider's director is then put forward as Authorising Officer because there is nobody else in the country. That person is neither a paid member of the sponsor's staff nor, in any meaningful sense, responsible for its recruitment.",
      },
      {
        kind: "callout",
        title: "It is not caught at application. It is caught later.",
        text: "Paragraph L8.20 provides for unannounced compliance visits. An officer who attends and finds that the Authorising Officer has never met a sponsored worker, cannot describe the recruitment process, and holds the same role for eleven unrelated companies is not looking at an administrative defect. Licences are suspended and revoked on exactly this, and revocation curtails the visas of every worker sponsored under it.",
      },
      { kind: "h", text: "There is no UK resident director requirement to solve" },
      {
        kind: "p",
        text: "Part of what drives nominee arrangements is a belief that a UK company must have a UK-resident director. It must not. Section 155 of the Companies Act 2006 requires at least one director who is a natural person. There is no residence requirement anywhere in the Act. An Indian parent can incorporate a UK subsidiary whose sole director lives in Bengaluru.",
      },
      {
        kind: "p",
        text: "What does exist are practical pressures: banks prefer a UK-resident signatory, and someone has to be reachable in working hours. Those are real, and they are solved by appointing the right person from within the group rather than renting one.",
      },
      { kind: "h", text: "What the Home Office is actually testing" },
      {
        kind: "list",
        items: [
          "That a genuine organisation is operating lawfully in the UK, and that the vacancy is genuine.",
          "That the people named in the Sponsorship Management System are the people who in fact run the sponsorship, and that their contact details reach them.",
          "That HR systems exist: right to work checks, absence monitoring, contact detail records, and reporting of changes within the prescribed periods.",
          "That the sponsor can produce the documents at Appendix D on request, for the retention period, without notice.",
        ],
      },
      { kind: "h", text: "The workable structure" },
      {
        kind: "p",
        text: "For a group with no UK staff yet, the Authorising Officer is normally a senior individual within the group who is appointed as a director or officer of the UK entity, with a real role in its recruitment decisions and a documented reporting line. The Level 1 User handling day-to-day sponsorship activity can then be supported, including by a professional adviser acting as an additional Level 1 or Level 2 User, without anyone pretending the accountable person is somebody they are not.",
      },
      {
        kind: "p",
        text: "The distinction matters commercially as well as legally. A licence built this way survives a compliance visit. A licence built the other way is a contingent liability sitting under every visa the group holds.",
      },
    ],
    sources: [
      "Workers and Temporary Workers: guidance for sponsors, Part 1, paras L4.33 and L8.20",
      "Workers and Temporary Workers: guidance for sponsors, Appendix D (record keeping)",
      "Companies Act 2006, s.155",
    ],
  },

  {
    slug: "first-ninety-days",
    title: "The first ninety days, and the five things that go wrong in them",
    standfirst:
      "Incorporation is the easy part and it is not the start of the clock. These are the obligations that attach in the first quarter, in the order they bite.",
    updated: "August 2026",
    readingMinutes: 7,
    topic: "Compliance",
    segments: ["bridgehead", "establisher", "operator", "exporter"],
    metaDescription:
      "The UK compliance obligations that attach in an overseas-owned company's first ninety days: identity verification, VAT for non-established taxable persons, PAYE, the compliance calendar and the accounts regime.",
    blocks: [
      {
        kind: "p",
        text: "A UK company can be incorporated in a day. What follows is a set of obligations that attach automatically, run on statutory deadlines, and do not send reminders to an address in another country. Five of them account for most of the damage.",
      },
      { kind: "h", text: "One. Identity verification is now mandatory" },
      {
        kind: "p",
        text: "Under the Economic Crime and Corporate Transparency Act 2023, identity verification became mandatory for new director appointments from 18 November 2025, and the transition window for existing directors and people with significant control closes on 18 November 2026. Verification is done through GOV.UK One Login or an Authorised Corporate Service Provider. Overseas directors without UK documentation should start this early rather than discover the requirement when a filing is rejected.",
      },
      { kind: "h", text: "Two. VAT has no threshold for you" },
      {
        kind: "p",
        text: "The £90,000 registration threshold applies to businesses established in the UK. Schedule 1A to the Value Added Tax Act 1994 applies to a non-established taxable person, and it sets the threshold at nil. If you make a taxable supply in the UK and have no fixed establishment here, you must register for the first supply rather than the ninetieth thousand pound of turnover.",
      },
      {
        kind: "callout",
        title: "This is the most expensive misunderstanding in the corridor",
        text: "A company that trades for a year believing it is under the threshold owes VAT on everything it supplied, plus interest and penalties, and usually cannot recover it from customers after the fact. The 'establishment' test is a question of fact about human and technical resources in the UK, not about where the company is registered.",
      },
      { kind: "h", text: "Three. PAYE starts before the first payslip" },
      {
        kind: "p",
        text: "Registering as an employer, operating Real Time Information, auto-enrolment duties and the apprenticeship levy position all attach to the first UK employee, including a seconded one. Where the Double Contribution Convention applies, the National Insurance treatment changes but the PAYE obligation does not. Income tax is still due through UK payroll on UK duties, and a certificate of coverage does not exempt anyone from that.",
      },
      { kind: "h", text: "Four. The calendar is unforgiving and it is public" },
      {
        kind: "table",
        head: ["Obligation", "When", "If missed"],
        rows: [
          ["Confirmation statement", "Annually, within 14 days of the review period ending", "Offence; a trigger for compulsory strike-off proceedings"],
          ["Annual accounts", "9 months after the accounting reference date for a private company", "Automatic penalties escalating with delay; doubled if late two years running"],
          ["Corporation tax return", "12 months after the end of the accounting period", "Penalties, and interest on tax due at 9 months and a day"],
          ["PSC register changes", "14 days to update internally, 14 more to notify the Registrar", "Criminal offence for the company and its officers"],
          ["Sponsor reporting duties", "Generally 10 or 20 working days depending on the event", "Licence downgrade, suspension or revocation"],
        ],
      },
      { kind: "h", text: "Five. Audit exemption is tested at group level" },
      {
        kind: "p",
        text: "A small UK subsidiary is not automatically exempt from audit. Sections 383 and 479 of the Companies Act 2006 test the size criteria against the whole group, including the overseas parent. A UK company with three employees and modest turnover can be caught by an audit requirement because of the consolidated position of a large Indian group, and the discovery usually happens well after the first year end, when it is expensive to fix.",
      },
      {
        kind: "p",
        text: "None of these are difficult in isolation. They fail together, in overseas-owned companies, for a structural reason: the obligations attach to a UK entity that has no UK staff, and the person who would notice is in a different time zone dealing with a different regulator.",
      },
    ],
    sources: [
      "Economic Crime and Corporate Transparency Act 2023 (identity verification)",
      "Value Added Tax Act 1994, Sch. 1A (non-established taxable persons)",
      "Companies Act 2006, ss.383, 479 (small companies and audit exemption, group-tested)",
      "Companies Act 2006, ss.441, 853A (accounts and confirmation statement)",
      "Workers and Temporary Workers: guidance for sponsors, Part 3 (reporting duties)",
    ],
  },

  {
    slug: "buying-a-uk-company",
    title: "Buying a UK company: three provisions that decide the deal",
    standfirst:
      "National security clearance, the tax indemnity, and what actually happens to the seller's people. Everything else in a share purchase agreement is negotiation; these three are structural.",
    updated: "August 2026",
    readingMinutes: 6,
    topic: "Transactions",
    segments: ["acquirer", "principal"],
    metaDescription:
      "Acquiring a UK company as an Indian buyer: National Security and Investment Act mandatory notification, the tax covenant, TUPE, and warranty and indemnity structure.",
    blocks: [
      {
        kind: "p",
        text: "For an Indian group, buying an existing UK business is often faster and lower-risk than building one: customers, staff, premises, a trading history a bank will lend against, and a track record a public buyer will accept. The risk moves rather than disappears, and it moves into the agreement and into one statute that can undo the transaction entirely.",
      },
      { kind: "h", text: "One. National security clearance is not optional and not a formality" },
      {
        kind: "p",
        text: "The National Security and Investment Act 2021 requires mandatory notification for acquisitions of qualifying entities in seventeen specified sectors. The sector definitions are considerably broader than their names suggest. Advanced materials, computing hardware, critical suppliers to government, data infrastructure and artificial intelligence all catch companies that would not describe themselves that way.",
      },
      {
        kind: "callout",
        title: "Completing without clearance makes the transaction void",
        text: "Not voidable, and not penalised but still effective. Void, with criminal sanctions as well. Where mandatory notification applies, clearance is a condition precedent to completion, and the timetable has to be built around it from the first draft rather than discovered in due diligence.",
      },
      { kind: "h", text: "Two. Warranties tell you about risk; the tax covenant moves it" },
      {
        kind: "p",
        text: "A warranty is a statement of fact that gives a damages claim if untrue, subject to disclosure, caps, baskets and time limits, and subject to the buyer proving loss. A tax covenant is a promise to pay, pound for pound, for pre-completion tax liabilities. They do different jobs and buyers routinely accept limitations on the second that they would never accept on the first.",
      },
      {
        kind: "p",
        text: "The disclosure letter is where most of the value is decided. Anything fairly disclosed is carved out of the warranties, and a data room dumped wholesale into general disclosure can hollow out a warranty schedule that looked comprehensive. For a cross-border buyer relying on a UK adviser, the question to ask is not 'are the warranties strong' but 'what has been disclosed against them'.",
      },
      { kind: "h", text: "Three. The people transfer, and you cannot vary their terms" },
      {
        kind: "p",
        text: "On a share purchase the employer does not change, so employment simply continues. On a business or asset purchase, the Transfer of Undertakings (Protection of Employment) Regulations transfer employees automatically on their existing terms, with liabilities, and changes made by reason of the transfer are generally void. Information and consultation obligations attach before completion, and failure to comply carries a protective award of up to thirteen weeks' pay per affected employee.",
      },
      { kind: "h", text: "The items specific to an Indian buyer" },
      {
        kind: "list",
        items: [
          "Funding route and exchange control on the Indian side, which determines the timetable more often than anything on the UK side does.",
          "Whether key management stay, and on what terms: retention, restrictive covenants that will actually be enforced in England, and immigration status for anyone who is not settled.",
          "Whether the target holds a sponsor licence, and what a change of control does to it. Some licences must be reported and re-applied for, and sponsored workers can be affected.",
          "Whether any part of the consideration structure creates a UK tax presence for the acquiring entity that the group did not intend.",
        ],
      },
      {
        kind: "p",
        text: "Share purchase agreements, tax covenants and disclosure letters are reserved legal work. They are drafted and negotiated by Janeevan in his capacity as a solicitor practising through Taylor Rose, under that firm's authorisation and insurance.",
      },
    ],
    sources: [
      "National Security and Investment Act 2021 and the notifiable acquisition regulations",
      "Transfer of Undertakings (Protection of Employment) Regulations 2006",
      "Companies Act 2006 (share transfers, PSC and filing consequences)",
      "Workers and Temporary Workers: guidance for sponsors (change of control reporting)",
    ],
  },
];

export const insightBySlug = Object.fromEntries(insights.map((i) => [i.slug, i])) as Record<string, Insight>;

export function insightsForSegment(segment: SegmentId) {
  return insights.filter((i) => i.segments.includes(segment));
}
