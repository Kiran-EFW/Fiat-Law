/**
 * The recommendation engine.
 *
 * Deterministic and rules-based. Given a set of answers it produces the UK Entry
 * Brief: the route, the sequence with realistic elapsed time, the specific
 * obstacles that profile will hit, the scope, and — where it applies — the case
 * for not instructing us at all.
 *
 * Every obstacle names its primary source, because the whole point of giving the
 * brief away is that it is checkably more accurate than the alternatives.
 */

import { firm, type Capacity } from "@/config/firm";
import { segmentById } from "@/lib/segments";
import { serviceBySlug } from "@/content/services";
import { sectorChoices } from "@/lib/brief/questions";
import type { BriefAnswers, Obstacle, Recommendation, ScopeLine, SequenceStep } from "@/lib/brief/types";

/* ----------------------------------------------------------- Obstacle bank */

const OBSTACLES: Record<string, Obstacle> = {
  bank: {
    title: "The bank account, not the company, is your critical path",
    body: "Six to eight weeks is normal for a UK business account where the directors and beneficial owners are resident overseas. It cannot begin until the company exists, and until it closes you cannot run payroll, recover input VAT or invoice a UK customer properly. Every other date in your plan should be set from this one.",
    source: "Practice experience; UK banks' standard onboarding for non-resident controllers",
  },
  residentDirector: {
    title: "You do not need a UK-resident director",
    body: "Section 155 of the Companies Act 2006 requires at least one director who is a natural person. It says nothing about residence. Providers selling a resident director on the basis that UK law requires one are selling a product the statute does not ask for. There are commercial reasons you might still want a UK-based director — banking, credibility, practicality — but a legal requirement is not one of them.",
    source: "Companies Act 2006, s.155",
  },
  nomineeAO: {
    title: "A nominee cannot be your Authorising Officer",
    body: "Paragraph L4.33 of the sponsor guidance requires the Authorising Officer to be a paid member of your staff or an office holder, and states expressly that you cannot appoint a representative or somebody from another organisation to fill the role. Any licence structure that relies on an outsourced Authorising Officer is built on sand.",
    source: "Workers and Temporary Workers: guidance for sponsors, Part 1, L4.33",
  },
  address: {
    title: "The registered office must be an appropriate address, and it may be visited",
    body: "Section 86 of the Companies Act 2006 requires an address at which a document delivered by hand or by post would come to the attention of a person acting for the company, and where delivery can be recorded. PO boxes no longer qualify. If the company sponsors a visa, a Home Office compliance officer may attend unannounced under paragraph L8.20 of the sponsor guidance — including at the registered office.",
    source: "Companies Act 2006, s.86; sponsor guidance L8.20",
  },
  eccta: {
    title: "Identity verification is mandatory, and the transition closes 18 November 2026",
    body: "Under the Economic Crime and Corporate Transparency Act 2023, directors and people with significant control must verify their identity with Companies House. It has applied to new appointments since 18 November 2025, and the transition window for existing officers closes on 18 November 2026. For officers resident in India this takes planning, not an afternoon.",
    source: "Economic Crime and Corporate Transparency Act 2023",
  },
  expansionCliff: {
    title: "The Expansion Worker licence is a bridge with a hard end",
    body: "A UK Expansion Worker licence lasts four years and cannot be renewed. Under paragraph GBM3.38 of the sponsor guidance, if the business has not established a full UK trading presence within two years the allocation of Certificates of Sponsorship is reduced to zero. Converting to a standard Skilled Worker or Senior or Specialist Worker licence is not an afterthought — it is the plan.",
    source: "Sponsor guidance, GBM3.38",
  },
  twelveMonths: {
    title: "India did not obtain the twelve-month waiver",
    body: "Japan and Australia negotiated away the requirement that an Expansion Worker has been employed by the overseas business for twelve months before applying. India did not. A recently hired candidate — however senior — cannot be moved on this route until they have twelve months with the group behind them.",
    source: "Immigration Rules, Appendix Global Business Mobility",
  },
  thresholds: {
    title: "The salary thresholds are higher than most published guidance says",
    body: `Appendix Global Business Mobility sets £52,500 for Senior or Specialist Worker and for UK Expansion Worker, £27,300 for Graduate Trainee, and £73,900 for the high earner provision. A number of gov.uk explainers and law firm articles still carry the older figures. Where they conflict, the Immigration Rules are the authority.`,
    source: "Immigration Rules, Appendix Global Business Mobility",
  },
  skillsCharge: {
    title: "The Immigration Skills Charge went up on 16 December 2025",
    body: "£480 per twelve months of sponsorship for small and charitable sponsors, £1,320 for everyone else. The £364 and £1,000 figures are still circulating widely and will make a licence budget materially wrong. The charge is payable up front, for the whole period, per worker.",
    source: "The Immigration Skills Charge (Amendment) Regulations 2025",
  },
  dcc: {
    title: "The Double Contribution Convention runs 60 months — but the first year was already free",
    body: "SI 2026/794 extended the convention from 36 to 60 months. The genuinely additional benefit is months 13 to 60, because regulations 145(2) and 146 of the Social Security (Contributions) Regulations 2001 already gave a unilateral 52-week exemption from UK National Insurance for workers sent temporarily from a non-agreement country. The saving is real and substantial; it is not what most articles say it is.",
    source: "SI 2026/794; Social Security (Contributions) Regulations 2001, regs 145(2) and 146",
  },
  dccTransition: {
    title: "The DCC transitional trap",
    body: "An employee who was already on a UK assignment on 15 July 2026 is not a detached worker for the purposes of Article 7(2). If you have people who moved before that date, the convention does not simply pick them up, and any modelling that assumes it does is overstating the saving.",
    source: "India–UK Double Contribution Convention, Art. 7(2)",
  },
  vatNil: {
    title: "For a non-established business, the VAT threshold is nil",
    body: "The £90,000 registration threshold applies only to businesses established in the UK. A business with no fixed establishment here — selling into the UK from India — must register from its first taxable supply. There is no threshold, no grace period, and this is the single most common and most expensive misunderstanding among Indian exporters entering the market.",
    source: "Value Added Tax Act 1994, Sch. 1A",
  },
  groupSize: {
    title: "Your UK subsidiary may not count as small",
    body: "Audit exemption and the small company accounts regime are tested against the group as a whole, not the UK entity alone. A modest UK subsidiary of a substantial Indian parent can fall outside the exemption and face an audit that was never in the budget. Establish this before the first year end, not at it.",
    source: "Companies Act 2006, ss.383, 479",
  },
  origin: {
    title: "A preference claim that fails verification is recovered with interest",
    body: "Tariff preference under CETA is claimed, not granted. If the origin evidence does not support the claim on verification, duty is recovered from the importer with interest, potentially across every prior consignment within the retention period. Build the origin file before the first shipment, not when the verification letter arrives.",
    source: "India–UK CETA, Chapter 4 (Rules of Origin)",
  },
  originConflict: {
    title: "There is a live drafting conflict in the origin instruments",
    body: "Condition 3 of DGFT Public Notice 19/2026-27 and Rule 16(1)(b) of Notification 62/2026-Customs (N.T.) do not sit together cleanly on the evidential requirements. Where two instruments conflict, the prudent course is a file that satisfies both, which costs very little to do at the outset and a great deal to reconstruct later.",
    source: "DGFT PN 19/2026-27; Notification 62/2026-Customs (N.T.)",
  },
  cbam: {
    title: "CETA contains no carbon border provision at all",
    body: "The UK Carbon Border Adjustment Mechanism starts on 1 January 2027 for aluminium, cement, fertiliser, hydrogen, and iron and steel. There is no India exemption and no rebalancing mechanism in the agreement — it is silent on the subject. For exporters in those sectors the tariff advantage and the carbon charge move in opposite directions, and the net position should be modelled now.",
    source: "India–UK CETA (no CBAM provision); UK CBAM from 1 January 2027",
  },
  nsia: {
    title: "National security screening is mandatory in seventeen sectors, and the definitions are broad",
    body: "The National Security and Investment Act 2021 requires notification and clearance before completion in seventeen sensitive areas. Advanced materials, computing hardware, data infrastructure and critical suppliers to government catch a great many businesses that do not consider themselves sensitive. Completing without clearance where clearance was required makes the transaction void — not fineable, void.",
    source: "National Security and Investment Act 2021",
  },
  disclosure: {
    title: "Warranties are worth what the disclosure letter and the warrantor leave of them",
    body: "A long warranty schedule means little if the disclosure letter is drawn widely enough to carve out the known problems, or if the person giving the warranties has no assets after completion. Warranty and indemnity insurance is frequently the right answer, and it has to be arranged during the transaction rather than remembered afterwards.",
    source: "Standard English law share purchase practice",
  },
  commercialAgents: {
    title: "A UK commercial agent may be entitled to compensation you never agreed",
    body: "The Commercial Agents (Council Directive) Regulations 1993 can apply to a UK agent selling your goods whatever the contract says, and on termination the agent may be entitled to compensation or an indemnity that can approach a year's average commission. Whether you appoint an agent or a distributor is a legal decision with a price attached, not a naming convention.",
    source: "Commercial Agents (Council Directive) Regulations 1993",
  },
  globalTalent: {
    title: "Global Talent needs no employer, no entity and no job offer",
    body: "If you qualify by endorsement or by a qualifying prize, Global Talent gives you the right to work, to be self-employed, to found companies and to change direction, with settlement available after three years on the exceptional talent basis. It is the cleanest route available and it does not need a company, a sponsor or a salary threshold. Where it fits, no corporate structure should be built simply to obtain a visa.",
    source: "Immigration Rules, Appendix Global Talent",
  },
  strikeOff: {
    title: "Strike-off action moves faster than most people expect",
    body: "Once the registrar has begun the process, the first gazette notice runs on a short clock, and dissolution transfers the company's assets to the Crown as bona vacantia — including the bank balance. If a first gazette notice has been published, this is measured in weeks, not months.",
    source: "Companies Act 2006, ss.1000–1002",
  },
  fca: {
    title: "Financial services activity needs authorisation before it starts, not alongside it",
    body: "Carrying on a regulated activity by way of business in the UK without authorisation is an offence under section 19 of the Financial Services and Markets Act 2000, and agreements made in contravention can be unenforceable under sections 26 and 27. Authorisation is a project measured in months. If your UK plan involves payments, lending, insurance distribution, credit or investment services, the perimeter question comes first.",
    source: "Financial Services and Markets Act 2000, ss.19, 26–27",
  },
  procurement: {
    title: "Public procurement access is real but not yet enforceable",
    body: "The government procurement chapter opens UK contracts above SDR 130,000 for goods and services and SDR 5 million for construction. But Article 15.23 makes the chapter unenforceable state to state until 15 July 2030, so the practical route into UK public contracts remains commercial: a UK entity, a track record and a supplier registration.",
    source: "India–UK CETA, Chapter 15, Art. 15.23",
  },
};

/* --------------------------------------------------------------- Utilities */

const sectorLabel = (id?: string) => sectorChoices.find((c) => c.value === id)?.label ?? "your sector";

const urgencyLabel: Record<string, string> = {
  exploring: "exploring, with no fixed date",
  this_quarter: "aiming to be operational this quarter",
  thirty_days: "working to a deadline inside 30 days",
  overdue: "already past a date that mattered",
};

const entityLabel: Record<string, string> = {
  none: "no UK presence yet",
  branch: "a UK establishment of the Indian parent",
  subsidiary: "a UK limited company trading normally",
  dormant: "a dormant UK company",
  non_compliant: "a UK company with filing or register problems",
};

const peopleLabel: Record<string, string> = {
  none: "nobody in the UK and none planned",
  need_to_move: "people to move from India",
  already_here: "people already in the UK",
  hiring_locally: "hiring locally in the UK",
};

const scaleLabel: Record<string, string> = {
  micro: "under 10 people",
  small: "10 to 50 people",
  mid: "50 to 250 people",
  large: "250 to 1,000 people",
  enterprise: "over 1,000 people",
};

function scopeLine(slug: string, items: string[], capacityOverride?: Capacity): ScopeLine {
  const service = serviceBySlug[slug];
  return {
    service: service.name,
    slug,
    items,
    capacity: capacityOverride ?? service.capacity,
  };
}

/* ------------------------------------------------------------ Core builder */

export function buildRecommendation(a: BriefAnswers): Recommendation {
  const segment = a.segment ? segmentById[a.segment] : undefined;

  const position: string[] = [];
  if (segment) position.push(segment.selfDescription);
  if (a.entityStatus) position.push(`In the UK today: ${entityLabel[a.entityStatus]}.`);
  if (a.peoplePosition) position.push(`On people: ${peopleLabel[a.peoplePosition]}.`);
  if (a.sector) position.push(`Sector: ${sectorLabel(a.sector)}.`);
  if (a.scale) position.push(`Scale of the business behind it: ${scaleLabel[a.scale]}.`);
  if (a.urgency) position.push(`Timing: ${urgencyLabel[a.urgency]}.`);
  if (a.originCity) position.push(`Based in ${a.originCity}.`);

  const built =
    a.segment === "partner"
      ? buildPartner(a)
      : a.segment === "acquirer"
        ? buildAcquirer(a)
        : a.segment === "exporter"
          ? buildExporter(a)
          : a.segment === "operator"
            ? buildOperator(a)
            : a.segment === "principal"
              ? buildPrincipal(a)
              : a.segment === "establisher"
                ? buildEstablisher(a)
                : buildBridgehead(a);

  // Cross-cutting obstacles that depend on answers rather than segment.
  const extra: Obstacle[] = [];
  if (a.entityStatus === "non_compliant") extra.push(OBSTACLES.strikeOff);
  if (a.sector === "financial") extra.push(OBSTACLES.fca);
  if (a.peoplePosition === "already_here" && a.segment !== "operator") extra.push(OBSTACLES.dccTransition);

  const obstacles = dedupe([...built.obstacles, ...extra]).slice(0, 5);

  return {
    ...built,
    position,
    obstacles,
    needFromYou: built.needFromYou,
  };
}

function dedupe(list: Obstacle[]): Obstacle[] {
  const seen = new Set<string>();
  return list.filter((o) => (seen.has(o.title) ? false : (seen.add(o.title), true)));
}

type Built = Omit<Recommendation, "position">;

/* ------------------------------------------------------------- A Bridgehead */

function buildBridgehead(a: BriefAnswers): Built {
  const moving = a.peoplePosition === "need_to_move";
  const hasEntity = a.entityStatus === "subsidiary" || a.entityStatus === "branch" || a.entityStatus === "dormant";

  const sequence: SequenceStep[] = [];
  if (!hasEntity) {
    sequence.push({
      title: "Decide branch or subsidiary, then incorporate",
      detail:
        "A UK establishment of the Indian parent must file the parent's accounts at Companies House, where anyone can read them. A subsidiary does not. Share structure, articles and officers are settled in the same conversation, because changing them afterwards means resolutions and filings.",
      elapsed: "3–5 working days once the structure is agreed",
      capacity: "fiat-law",
    });
  }
  sequence.push({
    title: "Registered office and statutory registers",
    detail:
      "An address that satisfies section 86 and would survive an unannounced Home Office visit, with the registers opened correctly from day one.",
    elapsed: "Same week",
    capacity: "fiat-law",
  });
  sequence.push({
    title: "Open the bank account",
    detail:
      "Start the day the company number is issued. With overseas directors this is six to eight weeks and it gates payroll, VAT recovery and your first properly issued invoice. Nothing else on this list should be scheduled independently of it.",
    elapsed: "6–8 weeks — start immediately",
    capacity: "fiat-law",
    criticalPath: true,
  });
  if (moving) {
    sequence.push({
      title: "Sponsor licence on the UK Expansion Worker route",
      detail:
        "The Companies House number issued at step one is sufficient to demonstrate the UK footprint the route requires under paragraph GBM3.4. The application, the Authorising Officer and Key Personnel structure, and the systems a compliance visit will ask to see are prepared together.",
      elapsed: "8 weeks standard, or 10 working days with the £750 priority service",
      capacity: "solicitor",
    });
    sequence.push({
      title: "Certificate of Sponsorship and visa application",
      detail:
        "Assigned once the licence is granted, with the candidate's twelve months of prior employment with the group evidenced properly.",
      elapsed: "3 weeks from assignment, priority available",
      capacity: "solicitor",
    });
  }
  sequence.push({
    title: "Tax registrations",
    detail: "Corporation tax, PAYE before the first payroll runs, and VAT — in that order, and timed against when you want to recover input tax on set-up costs.",
    elapsed: "2–6 weeks depending on the registration",
    capacity: "coordinated",
  });
  sequence.push({
    title: "First hire and commercial documents",
    detail: "Employment contract, section 1 statement, restrictive covenants, and the customer or supplier contracts that made you come here.",
    elapsed: "Alongside the above",
    capacity: "solicitor",
  });

  const obstacles = [OBSTACLES.bank, OBSTACLES.residentDirector, OBSTACLES.address];
  if (moving) obstacles.push(OBSTACLES.twelveMonths, OBSTACLES.nomineeAO);
  obstacles.push(OBSTACLES.eccta);

  return {
    headline:
      "A first UK presence, sequenced so the bank account does not quietly become the thing that delays everything else.",
    route: {
      name: moving ? "Incorporation, then a sponsor licence on the UK Expansion Worker route" : "Incorporation and registration only",
      why: moving
        ? "The Expansion Worker route exists precisely for a business with no UK trading presence. Paragraph GBM3.4 of the sponsor guidance treats a Companies House reference number as sufficient evidence of the footprint it requires — which is why the entity and the visa are one file rather than two."
        : "With nobody moving from India, there is no sponsorship question. The work is the entity, the address, the registrations and the contracts, and it is considerably cheaper than a route involving a licence.",
      alternatives: moving
        ? "If the person moving already has the right to work in the UK, or would qualify for Global Talent, no sponsor licence is needed at all and the plan gets materially shorter and cheaper. We check this before recommending a licence."
        : undefined,
    },
    sequence,
    obstacles,
    scope: [
      scopeLine("uk-entry", [
        "Branch or subsidiary decision and share structure",
        "Incorporation and articles",
        "Registered office and statutory registers",
        "ECCTA identity verification for overseas officers",
      ]),
      ...(moving
        ? [scopeLine("immigration", ["Route assessment", "Sponsor licence application", "Authorising Officer and Key Personnel structure", "Certificate of Sponsorship and visa application"])]
        : []),
      scopeLine("accounting", ["Corporation tax, PAYE and VAT registration", "Payroll set-up and auto-enrolment"]),
      scopeLine("corporate", ["Employment contract and covenants for the first hire", "Customer or supplier contracts under English law"]),
    ],
    needFromYou: [
      "Certificate of incorporation and constitutional documents of the Indian parent",
      "Passport and proof of address for each proposed director and person with significant control",
      "The proposed shareholding, and who will be on the UK board",
      "The contract or opportunity that prompted this, if there is one",
      ...(moving ? ["Employment history evidencing twelve months with the group for the person you intend to move"] : []),
    ],
    candour:
      "If all you need is a company number and an address, a formation agent will do it for under two hundred pounds and we will tell you so. Instruct us when the sequence matters — when a visa, a bank, a customer contract and a filing deadline all have to land in the right order.",
  };
}

/* ----------------------------------------------------------- B Establisher */

function buildEstablisher(a: BriefAnswers): Built {
  const bigPlans = a.detail === "11_50" || a.detail === "50_plus";
  const hasEntity = a.entityStatus === "subsidiary" || a.entityStatus === "branch";

  const sequence: SequenceStep[] = [];
  if (!hasEntity) {
    sequence.push({
      title: "Incorporate the subsidiary",
      detail:
        "A subsidiary rather than a branch in almost every case at this scale, because a UK establishment obliges you to file the Indian parent's accounts publicly. Articles, share classes and the intercompany position are settled now, before there is anything to unwind.",
      elapsed: "3–5 working days",
      capacity: "fiat-law",
    });
  }
  sequence.push({
    title: "Bank account and treasury",
    detail:
      "Started immediately, because it will take six to eight weeks and it gates payroll and VAT recovery. Intercompany funding arrangements documented at the same time so the money can move cleanly.",
    elapsed: "6–8 weeks — the true critical path",
    capacity: "fiat-law",
    criticalPath: true,
  });
  sequence.push({
    title: "Sponsor licence — and the choice of which one",
    detail: bigPlans
      ? "At your intended headcount the Expansion Worker route is a bridge you will outgrow quickly. We would normally apply for the Expansion Worker licence to get people in, with the conversion to a standard Skilled Worker licence planned and dated from the outset rather than left to year two."
      : "The Expansion Worker route gets your first people in without a UK trading presence. The application covers the Authorising Officer and Key Personnel structure, the HR systems a compliance visit will inspect, and the evidence of the overseas business.",
    elapsed: "8 weeks standard, 10 working days with the £750 priority service",
    capacity: "solicitor",
  });
  sequence.push({
    title: "Move the first cohort",
    detail:
      "Certificates of Sponsorship assigned, applications made, and each candidate's twelve months of prior employment with the group evidenced. Salary set against the current threshold, not the figure in last year's guidance.",
    elapsed: "3 weeks per application from assignment",
    capacity: "solicitor",
  });
  sequence.push({
    title: "PAYE, payroll, pension and VAT",
    detail:
      "PAYE registered before the first payroll runs. Auto-enrolment from the first employee. VAT timed so that input tax on set-up costs is recoverable.",
    elapsed: "2–6 weeks, run in parallel",
    capacity: "coordinated",
  });
  sequence.push({
    title: "Double Contribution Convention certificates",
    detail:
      "Certificates of coverage obtained for each detached worker, with the position checked against Article 7(2) for anyone who was already on assignment before 15 July 2026.",
    elapsed: "Alongside each move",
    capacity: "coordinated",
  });
  sequence.push({
    title: "Employment and commercial documentation",
    detail:
      "UK contracts, policies and covenants; equity or incentives for the UK managing director documented properly; customer and supplier contracts under English law.",
    elapsed: "4–8 weeks",
    capacity: "solicitor",
  });
  sequence.push({
    title: "Convert the licence before the cliff",
    detail:
      "Full UK trading presence evidenced and the standard licence in place well before the two-year point, so the Certificate of Sponsorship allocation never drops to zero.",
    elapsed: "Planned now, executed inside 24 months",
    capacity: "solicitor",
  });

  return {
    headline:
      "A committed UK subsidiary, where the licence, the entity and the payroll are one sequence with one owner — and the conversion off the Expansion Worker route is dated from the start.",
    route: {
      name: "UK Expansion Worker, converting to a standard Skilled Worker or Senior or Specialist Worker licence",
      why: "The Expansion Worker route is the only sponsored route that works before you have a UK trading presence, and paragraph GBM3.4 lets a Companies House number carry that requirement. But it is explicitly temporary, and the value of doing this properly is almost entirely in planning the conversion at the outset.",
      alternatives:
        "If the UK entity will be trading quickly and any of your candidates have existing UK work rights, a standard Skilled Worker licence may be simpler and avoids the four-year non-renewable constraint entirely. We test both before recommending either.",
    },
    sequence,
    obstacles: [
      OBSTACLES.expansionCliff,
      OBSTACLES.thresholds,
      OBSTACLES.twelveMonths,
      OBSTACLES.skillsCharge,
      OBSTACLES.dcc,
      OBSTACLES.bank,
      OBSTACLES.groupSize,
    ],
    scope: [
      scopeLine("uk-entry", ["Subsidiary incorporation and articles", "Registered office and company secretarial", "ECCTA identity verification", "Intercompany and parent documentation"]),
      scopeLine("immigration", ["Licence strategy — Expansion Worker versus standard", "Sponsor licence application and compliance systems", "Certificates of Sponsorship and visa applications", "Conversion planning and execution"]),
      scopeLine("accounting", ["PAYE, VAT and corporation tax registration", "Monthly payroll and auto-enrolment", "DCC certificates of coverage", "Statutory accounts and management reporting"]),
      scopeLine("corporate", ["UK employment contracts and covenants", "Equity or incentives for UK management", "Commercial contracts under English law"]),
    ],
    needFromYou: [
      "Group structure chart and the Indian parent's constitutional documents",
      "The intended UK headcount and roles over 24 months",
      "Employment history for each person you intend to move — twelve months with the group is a hard condition",
      "Proposed UK salaries, so they can be tested against the current thresholds",
      "Who will be the Authorising Officer: a paid member of staff or an office holder, not a representative",
      "Details of anyone already on UK assignment before 15 July 2026",
    ],
    candour:
      "If your two-year plan is one or two people, a sponsor licence may be more machinery than the situation needs — an existing right to work, or a Global Talent endorsement, can achieve the same outcome without the compliance burden. We would rather tell you that now than sell you a licence you have to maintain.",
  };
}

/* -------------------------------------------------------------- C Exporter */

function buildExporter(a: BriefAnswers): Built {
  const cbam = a.detail === "cbam";
  const fromScratch = a.detail === "unknown";

  return {
    headline:
      "Tariff preference is available on your next shipment — but only on a claim you can evidence, and the VAT position catches almost everyone.",
    route: {
      name: "Claim preference under CETA, register for UK VAT from the first supply, and contract properly with your route to market",
      why: "UK tariff reductions applied in full on 15 July 2026 with no phase-in, so the benefit is available immediately rather than over a decade. What stands between you and it is origin evidence, and what stands behind it is a VAT registration obligation with no threshold.",
    },
    sequence: [
      {
        title: "Classify the product and establish the origin rule",
        detail: fromScratch
          ? "From the beginning: the tariff classification of the finished good, then the product-specific rule that applies to it, then whether your actual bill of materials satisfies it."
          : "Confirm the classification, then test your bill of materials against the applicable product-specific rule rather than against the general rule.",
        elapsed: "1–3 weeks",
        capacity: "fiat-law",
      },
      {
        title: "Build the origin file",
        detail:
          "Supplier declarations, the calculation, and the retained records — assembled to satisfy both DGFT PN 19/2026-27 and Notification 62/2026-Customs (N.T.), which do not sit together cleanly.",
        elapsed: "2–4 weeks, then maintained per product",
        capacity: "fiat-law",
        criticalPath: true,
      },
      {
        title: "Register for UK VAT",
        detail:
          "As a non-established taxable person there is no registration threshold. Registration is required from the first taxable supply, and this needs to be in place before you invoice, not after.",
        elapsed: "2–6 weeks",
        capacity: "coordinated",
      },
      {
        title: "Contract with the route to market",
        detail:
          "Distributor or agent — a legal decision rather than a label, because the Commercial Agents Regulations attach compensation rights to one of them regardless of what the contract says.",
        elapsed: "3–5 weeks",
        capacity: "solicitor",
      },
      ...(cbam
        ? [
            {
              title: "Model the CBAM position",
              detail:
                "The UK Carbon Border Adjustment Mechanism starts on 1 January 2027 in your sector, with no India exemption in the agreement. Embedded emissions data and landed cost should be modelled against the tariff saving now.",
              elapsed: "Before Q4 2026",
              capacity: "fiat-law" as Capacity,
            },
          ]
        : []),
      {
        title: "Decide whether you need a UK entity at all",
        detail:
          "Many exporters do not. A UK entity buys you easier banking, easier customer contracting and eligibility for public procurement, but it is a decision to take on the commercial merits rather than a requirement of the trade agreement.",
        elapsed: "Reviewed once volume is established",
        capacity: "fiat-law",
      },
    ],
    obstacles: [
      OBSTACLES.vatNil,
      OBSTACLES.origin,
      OBSTACLES.originConflict,
      ...(cbam ? [OBSTACLES.cbam] : []),
      OBSTACLES.commercialAgents,
      OBSTACLES.procurement,
    ],
    scope: [
      scopeLine("trade", ["Classification and product-specific origin rules", "Origin file and self-certification", "Verification readiness", ...(cbam ? ["CBAM exposure assessment"] : [])]),
      scopeLine("accounting", ["UK VAT registration as a non-established taxable person", "VAT returns and Making Tax Digital"]),
      scopeLine("corporate", ["Distribution or agency agreement", "Supply terms and limitation of liability", "Product compliance and labelling review"]),
    ],
    needFromYou: [
      "Product list with HS classifications, or the product specifications if classification is not settled",
      "Bill of materials with the origin of each input",
      "Existing supplier declarations, if you hold any",
      "Your intended UK route to market — direct, distributor, agent or marketplace",
      "Expected first shipment date and annual volume",
    ],
    candour:
      "If your UK sales are modest and you are selling through a single established distributor, the honest position is that you may need a VAT registration and a good distribution agreement and very little else. We would rather do that well than build you a structure you do not need.",
  };
}

/* -------------------------------------------------------------- D Acquirer */

function buildAcquirer(a: BriefAnswers): Built {
  const late = a.detail === "heads" || a.detail === "diligence";

  return {
    headline: late
      ? "A live transaction. The work that determines whether this was a good deal is happening now, in the disclosure letter."
      : "An acquisition, approached so that screening and diligence are settled before price is.",
    route: {
      name: "Share or asset purchase, with National Security and Investment Act screening assessed at the outset",
      why: "Acquiring an established UK business gives you the customers, the accreditations, the staff and — importantly for an Indian parent — the trading history a UK bank wants to see. The variable that decides the outcome is the quality of the diligence and the disclosure position, not the headline price.",
      alternatives:
        "An asset purchase can leave historic liabilities behind, but it triggers TUPE for the employees and requires contracts and consents to be novated. Which is right depends on what the diligence finds, which is why the structure decision comes after the first pass rather than before it.",
    },
    sequence: [
      {
        title: "Screening assessment",
        detail:
          "Test the target against the seventeen mandatory sectors before anything is signed. The definitions are wider than the sector names, and completing without clearance where clearance was required renders the transaction void.",
        elapsed: "Days — do it first",
        capacity: "solicitor",
        criticalPath: true,
      },
      {
        title: "Structure and heads of terms",
        detail:
          "Share or asset purchase, acquisition vehicle, funding route and the tax interface between the UK target and the Indian parent. Heads of terms that set the exclusivity and the diligence perimeter.",
        elapsed: "1–2 weeks",
        capacity: "solicitor",
      },
      {
        title: "Legal due diligence",
        detail:
          "Corporate, commercial, employment, property and intellectual property, reported by exception so you read what matters. Change-of-control clauses in the major contracts, employee entitlements, and any pension exposure.",
        elapsed: "3–6 weeks depending on size",
        capacity: "solicitor",
      },
      {
        title: "Transaction documents",
        detail:
          "Share purchase agreement, warranties and indemnities negotiated against what diligence found, and the disclosure letter read line by line against the warranty schedule.",
        elapsed: "3–5 weeks, overlapping diligence",
        capacity: "solicitor",
      },
      {
        title: "Completion and filings",
        detail: "Completion mechanics, stock transfer, Companies House filings, stamp duty, and the post-completion register work.",
        elapsed: "Completion day and the fortnight after",
        capacity: "solicitor",
      },
      {
        title: "Integration",
        detail:
          "Directors appointed and identity-verified, banking mandates changed, employment and commercial documents aligned, and the reporting the Indian parent needs to consolidate.",
        elapsed: "4–12 weeks post-completion",
        capacity: "coordinated",
      },
    ],
    obstacles: [OBSTACLES.nsia, OBSTACLES.disclosure, OBSTACLES.eccta, OBSTACLES.groupSize, OBSTACLES.bank],
    scope: [
      scopeLine("ma", ["Screening assessment and notification where required", "Structuring", "Legal due diligence", "Share or asset purchase agreement", "Warranties, indemnities and disclosure", "Completion and post-completion filings"]),
      scopeLine("corporate", ["Employment and TUPE analysis", "Commercial contract review and novation", "Post-completion governance documents"]),
      scopeLine("uk-entry", ["Acquisition vehicle where one is needed", "Director appointments and identity verification", "Company secretarial for the acquired group"]),
    ],
    needFromYou: [
      "The target's name and, if you have it, the information memorandum",
      "Heads of terms or the outline commercial deal, if agreed",
      "The intended acquisition vehicle and funding structure",
      "Your assessment of whether the target operates in any sensitive sector",
      "Your timetable, and any exclusivity period already running",
    ],
    candour:
      "Corporate finance — arranging the deal, advising on the investment itself — is a regulated activity under the Financial Services and Markets Act 2000, and it is not what we do. Our work is legal advice on the transaction and its documents. Where a regulated adviser is needed you are introduced to an authorised firm and told so in writing.",
  };
}

/* -------------------------------------------------------------- E Operator */

function buildOperator(a: BriefAnswers): Built {
  const eccta = a.detail === "eccta";
  const broken = a.detail === "remediation" || a.entityStatus === "non_compliant";

  const sequence: SequenceStep[] = [];
  if (broken) {
    sequence.push({
      title: "Stabilise the position",
      detail:
        "Establish exactly what is outstanding and whether any strike-off action has begun. If a first gazette notice has been published, this is measured in weeks and everything else waits.",
      elapsed: "Immediate",
      capacity: "fiat-law",
      criticalPath: true,
    });
  }
  sequence.push({
    title: "Identity verification for directors and PSCs",
    detail:
      "Verification for every director and person with significant control, including those resident in India. The transition window closes on 18 November 2026 and the volume at Companies House will not get lighter as it approaches.",
    elapsed: "2–4 weeks with overseas officers",
    capacity: "fiat-law",
    criticalPath: eccta,
  });
  sequence.push({
    title: "Register and filing review",
    detail:
      "Statutory registers checked against reality, PSC position confirmed, confirmation statement and accounts brought current, and anything filed incorrectly corrected.",
    elapsed: "2–4 weeks",
    capacity: "fiat-law",
  });
  sequence.push({
    title: "Put the calendar on someone else's desk",
    detail:
      "Confirmation statement, accounts, corporation tax, VAT and payroll deadlines held and met by us, with the register kept accurate between filings rather than reconstructed at year end.",
    elapsed: "Ongoing",
    capacity: "fiat-law",
  });
  sequence.push({
    title: "Review what has been outgrown",
    detail:
      "Companies that have been here a few years usually have at least one document written for a smaller version of themselves: the shareholders' agreement, the standard terms, or the employment contracts.",
    elapsed: "As needed",
    capacity: "solicitor",
  });

  return {
    headline: eccta
      ? "Identity verification is a dated statutory obligation with directors sitting in India — it is a project, not a form."
      : broken
        ? "An existing UK company that needs putting right, then kept right."
        : "An established UK operation that deserves company secretarial and compliance support that does not need chasing.",
    route: {
      name: "Compliance remediation, then ongoing company secretarial and filing",
      why: "The obligations here are externally dated and automatically penalised. There is no strategy question; there is an execution question, and the only thing that matters is that someone reliable owns the calendar.",
    },
    sequence,
    obstacles: [OBSTACLES.eccta, ...(broken ? [OBSTACLES.strikeOff] : []), OBSTACLES.address, OBSTACLES.groupSize, OBSTACLES.dccTransition],
    scope: [
      scopeLine("uk-entry", ["ECCTA identity verification for overseas officers", "Statutory registers and PSC review", "Confirmation statements and filings", "Remediation of late or incorrect filings"]),
      scopeLine("accounting", ["Statutory accounts and corporation tax", "VAT and payroll", "Management reporting for the Indian parent"]),
      scopeLine("corporate", ["Shareholders' agreement and articles review", "Employment documentation refresh", "Commercial contract review"]),
    ],
    needFromYou: [
      "Company number, and access to the Companies House authentication code",
      "Names and residence of every director and person with significant control",
      "Details of any filing that is late, or any correspondence from the registrar",
      "Your current accountant's details, if you have one",
    ],
    candour:
      "If your existing accountant is already handling the filings competently, do not move them. What we would add is the company secretarial and identity verification layer, which most accountants do not cover, and we are happy to sit alongside them rather than replace them.",
  };
}

/* ------------------------------------------------------------- F Principal */

function buildPrincipal(a: BriefAnswers): Built {
  const talent = a.detail === "talent";
  const founder = a.detail === "founder";

  return {
    headline: talent
      ? "If Global Talent is open to you, it is the cleanest route into the UK there is — and it needs no company at all."
      : founder
        ? "A founder route, where the visa and the business plan are the same document."
        : "A personal move, where the route determines everything that follows — including whether you need a UK company.",
    route: {
      name: talent
        ? "Global Talent"
        : founder
          ? "Innovator Founder, with Global Talent tested first"
          : "Route assessment before anything else",
      why: talent
        ? "Global Talent requires no sponsor, no job offer, no UK entity and no salary threshold. It permits employment, self-employment and founding companies, and allows settlement after three years on the exceptional talent basis. Where you qualify, nothing else competes with it."
        : founder
          ? "Innovator Founder requires endorsement of a business that is innovative, viable and scalable, and it ties your immigration status to that business. Before committing to it we test Global Talent, because if you qualify there the constraint disappears."
          : "Choosing the route first and building around it is considerably cheaper than incorporating a company and then discovering it was not the vehicle you needed.",
      alternatives:
        "A sponsored route through your own UK company is possible but means becoming a sponsor and carrying the compliance burden of one. It is the right answer less often than it is chosen.",
    },
    sequence: [
      {
        title: "Route assessment",
        detail:
          "An honest test against Global Talent, Innovator Founder, Skilled Worker and the sponsored options, with settlement and naturalisation timing mapped from the start rather than discovered in year four.",
        elapsed: "1 week",
        capacity: "solicitor",
        criticalPath: true,
      },
      {
        title: "Endorsement or sponsorship",
        detail: talent
          ? "The endorsement application: evidence of recognition, letters of support, and the narrative that carries them."
          : founder
            ? "Endorsing body engagement and the business plan that has to satisfy innovation, viability and scalability together."
            : "Whichever the assessment produces, prepared properly the first time.",
        elapsed: "6–12 weeks",
        capacity: "solicitor",
      },
      {
        title: "Visa application",
        detail: "The application, dependants, and the maintenance and English language requirements evidenced correctly.",
        elapsed: "3 weeks, priority available",
        capacity: "solicitor",
      },
      {
        title: "Corporate structure, if you actually need one",
        detail:
          "Only after the route is settled. On Global Talent you may need nothing; on Innovator Founder the company is part of the endorsement; on a sponsored route it is the sponsor.",
        elapsed: "1 week once decided",
        capacity: "fiat-law",
      },
      {
        title: "Settlement and the family",
        detail:
          "Continuous residence tracked from arrival, absences monitored against the rules, and dependants kept aligned. Plus the private client work that follows a move: wills, property and family arrangements.",
        elapsed: "3–5 years, planned from day one",
        capacity: "solicitor",
      },
    ],
    obstacles: [
      OBSTACLES.globalTalent,
      {
        title: "Absences are counted, and they are counted strictly",
        body: "Settlement requires continuous residence, and absences above the permitted limit reset the clock. For a founder still running an Indian business this is the constraint that most often costs a year, and it is trivially manageable if it is tracked from the beginning and impossible to fix retrospectively.",
        source: "Immigration Rules, Appendix Continuous Residence",
      },
      {
        title: "Innovator Founder ties your status to the business",
        body: "The endorsement is of a specific business, and the endorsing body carries out contact point checks during the visa. Material changes to the business have to be reported and can put the endorsement at risk. Global Talent has no equivalent constraint, which is why it is worth testing first.",
        source: "Immigration Rules, Appendix Innovator Founder",
      },
    ],
    scope: [
      scopeLine("immigration", ["Route assessment across all realistic options", talent ? "Global Talent endorsement application" : "Endorsement or sponsorship as applicable", "Visa application and dependants", "Settlement and naturalisation planning"]),
      scopeLine("corporate", ["UK company where the route requires one", "Founder and shareholder documentation"]),
    ],
    needFromYou: [
      "CV, and evidence of recognition in your field — awards, publications, funding, press, senior appointments",
      "Details of any business you intend to run in the UK",
      "Family members who would come with you",
      "Any previous UK visas, refusals or immigration history",
      "Your intended arrival date",
    ],
    candour:
      "If you qualify for Global Talent, you do not need a UK company, a sponsor or us to build you a structure — you need a well-prepared endorsement application and nothing else. We will tell you that even though the smaller instruction is the less profitable one.",
  };
}

/* --------------------------------------------------------------- G Partner */

function buildPartner(a: BriefAnswers): Built {
  const isLaw = a.detail === "law";

  return {
    headline: "A referral relationship with a clear boundary, so your client stays yours.",
    route: {
      name: "Referral, with the professional boundary agreed in writing before the first introduction",
      why: isLaw
        ? "Indian advocates cannot practise English law and UK solicitors have no reciprocal access in India — the trade agreement bound nothing on India's side for legal services. That asymmetry makes a clean referral arrangement the only workable structure, and it works well when both sides know exactly where the line is."
        : "You hold the client relationship and the domestic work. We take the UK instruction, in a named capacity, and report to you as well as to the client if that is what you want.",
    },
    sequence: [
      {
        title: "Introductory conversation",
        detail: "What your clients typically need in the UK, what you already handle, and where the gaps genuinely are.",
        elapsed: "One call",
        capacity: "fiat-law",
      },
      {
        title: "Terms of the relationship",
        detail:
          "In writing: what is referred, who holds the client, what we will and will not do, response times you can promise, and the fee position between advisers.",
        elapsed: "1–2 weeks",
        capacity: "fiat-law",
      },
      {
        title: "A first matter",
        detail: "A live instruction, run the way both sides agreed, so the arrangement is tested on something real before it is scaled.",
        elapsed: "As it arises",
        capacity: "solicitor",
      },
      {
        title: "Materials for your clients",
        detail:
          "Briefings, checklists and — where it is useful — joint sessions for your clients on UK entry, so the relationship produces something visible to them.",
        elapsed: "Ongoing",
        capacity: "fiat-law",
      },
    ],
    obstacles: [
      {
        title: "The legal services asymmetry is real, and it runs one way",
        body: "The UK bound CPC 861 legal services fully under the agreement. India bound nothing and omitted legal services from its most-favoured-nation list entirely. Foreign lawyers still cannot practise Indian law. Any arrangement has to be built on that asymmetry rather than in spite of it.",
        source: "India–UK CETA, services schedules",
      },
      {
        title: "Referral fees are constrained on the regulated side",
        body: "Where the work is reserved legal activity, the SRA Code of Conduct governs referral arrangements and requires disclosure to the client. We would rather set that out plainly at the start than have it surface awkwardly later.",
        source: "SRA Code of Conduct for Firms, paras 5.1–5.4",
      },
    ],
    scope: [
      scopeLine("uk-entry", ["UK entity and structure work referred from your practice", "Company secretarial and compliance"]),
      scopeLine("immigration", ["Sponsor licences and business immigration for your clients"]),
      scopeLine("corporate", ["English law commercial and corporate documents"]),
      scopeLine("ma", ["UK-side transaction support on cross-border deals"]),
    ],
    needFromYou: [
      "The kind of clients you act for, and the sectors they are in",
      "What you already do for them on UK matters",
      "How you would like the relationship documented",
      "Whether you want to be copied into client correspondence",
    ],
    candour:
      "We are not looking to acquire your clients. If the arrangement does not leave the relationship clearly with you, it is not worth either of us doing.",
  };
}

/* ------------------------------------------------------------- Lead scoring */

/**
 * 0–100. Segment value is the largest single factor, then urgency, then scale,
 * then how completely the brief was filled in.
 */
export function scoreLead(a: BriefAnswers): number {
  const segment = a.segment ? segmentById[a.segment] : undefined;
  let score = (segment?.value ?? 30) * 0.45;

  const urgencyPoints: Record<string, number> = {
    exploring: 3,
    this_quarter: 14,
    thirty_days: 22,
    overdue: 19,
  };
  score += urgencyPoints[a.urgency ?? "exploring"] ?? 0;

  const scalePoints: Record<string, number> = { micro: 2, small: 6, mid: 11, large: 15, enterprise: 18 };
  score += scalePoints[a.scale ?? "micro"] ?? 0;

  // Multi-service positions are worth more than single-service ones.
  if (a.peoplePosition === "need_to_move") score += 6;
  if (a.entityStatus === "none") score += 4;
  if (a.entityStatus === "non_compliant") score += 5;

  // Completeness — a fully answered brief with a phone number is a real enquiry.
  if (a.contact?.phone) score += 3;
  if (a.contact?.company) score += 2;
  if (a.detail) score += 2;
  if (a.contact?.notes && a.contact.notes.length > 40) score += 3;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function scoreBand(score: number): "priority" | "qualified" | "nurture" {
  if (score >= 70) return "priority";
  if (score >= 45) return "qualified";
  return "nurture";
}

/** Capacity label used throughout the rendered brief. */
export const shortCapacity: Record<Capacity, string> = {
  "fiat-law": firm.name,
  solicitor: `${firm.principal.name}, solicitor`,
  coordinated: "Coordinated",
};
