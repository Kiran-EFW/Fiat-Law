/**
 * The India–UK CETA briefing.
 *
 * Written from the primary sources held in the research library: the agreement
 * text, the UK impact assessment, the Immigration Rules, the implementing
 * statutory instruments and the Indian customs and DGFT notifications. Every
 * article names its sources at the foot, because the whole reason to publish
 * this is that it is checkable.
 */

import type { Block } from "@/content/blocks";

export type { Block };

export interface CetaArticle {
  slug: string;
  title: string;
  standfirst: string;
  updated: string;
  readingMinutes: number;
  blocks: Block[];
  sources: string[];
  metaDescription: string;
}

export const cetaArticles: CetaArticle[] = [
  {
    slug: "mobility",
    title: "Mobility and the Double Contribution Convention",
    standfirst:
      "What the agreement changed for moving people, what it merely restated, and why the 60-month social security exemption is worth less and more than the headlines suggest.",
    updated: "August 2026",
    readingMinutes: 9,
    metaDescription:
      "India–UK CETA mobility: UK Expansion Worker, Senior or Specialist Worker, Service Suppliers, salary thresholds, the Immigration Skills Charge and the 60-month Double Contribution Convention.",
    blocks: [
      {
        kind: "p",
        text: "The mobility provisions of the Comprehensive Economic and Trade Agreement have been reported more loosely than any other part of it. The agreement's services chapter binds a floor; the Immigration Rules set the reality; and the two are not the same document. What follows is drawn from the Rules.",
      },
      { kind: "h", text: "The routes that actually matter" },
      {
        kind: "p",
        text: "For an Indian business putting people into the UK, four routes carry almost all the traffic. Each has a different precondition, and choosing wrongly is expensive because the licence, not the visa, is the long lead item.",
      },
      {
        kind: "table",
        head: ["Route", "Precondition", "Salary floor", "Note"],
        rows: [
          ["UK Expansion Worker", "No UK trading presence needed; a Companies House number suffices under GBM3.4", "£52,500", "Licence lasts 4 years, non-renewable"],
          ["Senior or Specialist Worker", "UK entity trading; 12 months with the group (some exemptions)", "£52,500", "The destination route for most groups"],
          ["Graduate Trainee", "Structured graduate programme; 3 months with the group", "£27,300", "Narrow but cheap"],
          ["Global Talent", "Endorsement or a qualifying prize", "None", "No sponsor, no entity, no job offer"],
        ],
      },
      {
        kind: "callout",
        title: "The thresholds are higher than most guidance says",
        text: "Appendix Global Business Mobility sets £52,500 for Senior or Specialist Worker and UK Expansion Worker, £27,300 for Graduate Trainee, and £73,900 for the high earner provision. A number of gov.uk explainers and law firm articles still carry earlier figures. Where they conflict, the Immigration Rules govern.",
      },
      { kind: "h", text: "Why the entity and the visa are one transaction" },
      {
        kind: "p",
        text: "Paragraph GBM3.4 of the sponsor guidance provides that a Companies House reference number is sufficient to demonstrate the UK footprint required for a UK Expansion Worker licence. That is a small sentence with a large consequence: the incorporation is not a prerequisite to be completed and then forgotten, it is the evidence the immigration application relies on. Sequencing them through two separate suppliers introduces a handover for no reason, and handovers cost weeks.",
      },
      { kind: "h", text: "The Expansion Worker route is a bridge with a hard end" },
      {
        kind: "p",
        text: "A UK Expansion Worker licence is granted for four years and cannot be renewed. Under paragraph GBM3.38, if the business has not established a full UK trading presence within two years, the allocation of Certificates of Sponsorship is reduced to zero. In practice this means the conversion to a standard Skilled Worker or Senior or Specialist Worker licence is the plan, and the Expansion Worker licence is the thing that buys time to execute it.",
      },
      {
        kind: "callout",
        title: "India did not obtain the twelve-month waiver",
        text: "Japan and Australia negotiated away the requirement that an Expansion Worker has been employed by the overseas business for twelve months before applying. India did not. A recently hired candidate cannot be moved on this route, however senior, until they have twelve months with the group.",
      },
      { kind: "h", text: "Service Suppliers: the point most commentary gets backwards" },
      {
        kind: "p",
        text: "Paragraphs 5.2 to 5.4 of the Service Supplier route require the UK party receiving the service to hold the A-rated sponsor licence, not the Indian supplier. A significant amount of published commentary asserts the opposite. If your UK counterparty is not an A-rated sponsor, the route is closed to you and no provision of the trade agreement opens it.",
      },
      { kind: "h", text: "The costs moved too" },
      {
        kind: "p",
        text: "The Immigration Skills Charge was uplifted with effect from 16 December 2025 to £480 per twelve months of sponsorship for small and charitable sponsors and £1,320 for all others. The older £364 and £1,000 figures are still circulating widely, including in competitor material. A licence budget built on them will be materially wrong, and the charge is payable up front, for the whole sponsorship period, per worker.",
      },
      { kind: "h", text: "The Double Contribution Convention" },
      {
        kind: "p",
        text: "This is the strongest single commercial hook in the agreement, and also the most frequently overstated. The convention, extended from 36 to 60 months by SI 2026/794 following the Exchange of Notes of 6 July 2026, allows an Indian employer sending a detached worker to the UK to continue paying Indian social security and be exempt from UK National Insurance for the period of the exemption.",
      },
      {
        kind: "p",
        text: "The nuance that changes the arithmetic: regulations 145(2) and 146 of the Social Security (Contributions) Regulations 2001 already gave a unilateral 52-week exemption from UK National Insurance for workers sent temporarily from a country with no agreement. The genuinely additional benefit of the convention is therefore months 13 to 60, not months 1 to 60. That is still a substantial saving on employer and employee contributions across four years for each seconded worker, but it is not what most articles claim.",
      },
      {
        kind: "callout",
        title: "The transitional trap",
        text: "An employee already on a UK assignment on 15 July 2026 is not a detached worker for the purposes of Article 7(2). If you have people who moved before that date, the convention does not simply pick them up, and any model that assumes it does overstates the saving.",
      },
      { kind: "h", text: "What did not change" },
      {
        kind: "list",
        items: [
          "There is no new visa route. Everything the agreement facilitates runs through the existing Immigration Rules.",
          "There is no relaxation of the sponsor licence regime, and no reduction in compliance duties.",
          "The Immigration Health Surcharge is unaffected.",
          "Settlement and continuous residence rules are unaffected. The convention exempts contributions, not residence.",
        ],
      },
    ],
    sources: [
      "Immigration Rules, Appendix Global Business Mobility (all five routes)",
      "Workers and Temporary Workers: guidance for sponsors, Parts 1 and 2, and the Global Business Mobility annex",
      "The Immigration Skills Charge (Amendment) Regulations 2025",
      "SI 2026/794 — implementing the India–UK Double Contribution Convention",
      "Social Security (Contributions) Regulations 2001, regs 145(2) and 146",
      "India–UK Double Contribution Convention, Exchange of Notes, 6 July 2026 (NOTE NO: CH/551/26)",
    ],
  },

  {
    slug: "rules-of-origin",
    title: "Rules of origin: claiming preference, and making the claim survive",
    standfirst:
      "UK tariff reductions applied in full on 15 July 2026 with no phase-in. The benefit is real and immediate. What stands between you and it is an evidential file most exporters have not built.",
    updated: "August 2026",
    readingMinutes: 8,
    metaDescription:
      "India–UK CETA rules of origin, self-certification, verification, the DGFT PN 19/2026-27 and Notification 62/2026-Customs drafting conflict, and UK CBAM from 1 January 2027.",
    blocks: [
      {
        kind: "p",
        text: "One structural feature of this agreement is unusual and commercially important: on the UK side, tariff reductions took effect in full at entry into force on 15 July 2026. There is no phase-in. An Indian exporter can claim preference on the next shipment rather than in year five.",
      },
      { kind: "h", text: "Preference is claimed, not granted" },
      {
        kind: "p",
        text: "Nothing arrives automatically. Preference is claimed on entry, and the claim has to be supported by origin. That in turn is a documentary discipline that begins at your suppliers, not at the border. Three things have to be settled before the first consignment moves.",
      },
      {
        kind: "numbers",
        items: [
          "The tariff classification of the finished good. Everything else follows from it, and getting it wrong invalidates the origin analysis rather than merely complicating it.",
          "The product-specific rule that applies to that classification, being a change of tariff heading, a value-added threshold, a specific process, or a combination.",
          "The origin status of every material input, evidenced by supplier declarations you actually hold rather than assume you could obtain.",
        ],
      },
      {
        kind: "callout",
        title: "Points one and two can be checked against the annexes now",
        text: "We extracted the United Kingdom's full tariff schedule from Appendix 2A-b and all 266 product specific rules from Annex 3A. Enter a commodity code and the lookup returns the UK's commitment on that line, the rule of origin quoted verbatim, and, where one applies, the Section Note that overrides it. It does not tell you the duty rate, and it does not confirm your classification.",
        link: { href: "/india-uk/tariff-lookup", label: "Open the tariff and origin lookup" },
      },
      {
        kind: "callout",
        title: "A failed claim is recovered with interest",
        text: "Customs authorities verify. If the origin evidence does not support the claim, duty is recovered from the importer with interest, potentially across every prior consignment within the retention period. A saving on a documented claim is a saving; a saving on an assumed one is a contingent liability sitting in your customer's ledger.",
      },
      { kind: "h", text: "Self-certification puts the burden on you" },
      {
        kind: "p",
        text: "Self-certification is faster and cheaper than a certificate-based system, and it moves the compliance burden onto the exporter. You make the statement of origin, you hold the underlying record set, and you produce it if the claim is verified, which may be years later, by which time the person who assembled the calculation may have left.",
      },
      { kind: "h", text: "There is a live drafting conflict" },
      {
        kind: "p",
        text: "Condition 3 of DGFT Public Notice 19/2026-27 and Rule 16(1)(b) of Notification 62/2026-Customs (N.T.) do not sit together cleanly on the evidential requirements. Where two instruments conflict, the prudent course is a file that satisfies both. It costs very little to build that way at the outset and a great deal to reconstruct after a verification letter arrives.",
      },
      { kind: "h", text: "Carbon: the thing the agreement does not mention" },
      {
        kind: "p",
        text: "The UK Carbon Border Adjustment Mechanism starts on 1 January 2027, covering aluminium, cement, fertiliser, hydrogen, and iron and steel. CETA contains no CBAM provision and no rebalancing mechanism, so it is silent on the subject and there is no India exemption. For exporters in those five sectors the tariff advantage and the carbon charge move in opposite directions, and the net landed cost should be modelled now rather than in the fourth quarter of 2026.",
      },
      { kind: "h", text: "The VAT point that catches almost everyone" },
      {
        kind: "p",
        text: "This is not an origin question, but it is the one that costs Indian exporters the most money in their first year. The £90,000 UK VAT registration threshold applies to businesses established in the UK. A business with no fixed establishment here must register from its first taxable supply. There is no threshold and no grace period.",
      },
      { kind: "h", text: "And the procurement point" },
      {
        kind: "p",
        text: "The government procurement chapter opens UK contracts above SDR 130,000 for goods and services and SDR 5 million for construction, with India's own thresholds set considerably higher at SDR 450,000 and SDR 5 million. But Article 15.23 makes the chapter unenforceable state to state until 15 July 2030. The practical route into UK public contracts therefore remains commercial rather than legal: a UK entity, a track record, and supplier registration.",
      },
    ],
    sources: [
      "India–UK Comprehensive Economic and Trade Agreement, Chapter 4 (Rules of Origin) and Annexes",
      "India–UK CETA, Chapter 15 (Government Procurement), Art. 15.23",
      "DGFT Public Notice 19/2026-27",
      "Notification 62/2026-Customs (N.T.)",
      "Notification 29/2026-Customs — tariff concessions schedule",
      "Value Added Tax Act 1994, Sch. 1A",
      "UK Carbon Border Adjustment Mechanism, effective 1 January 2027",
    ],
  },

  {
    slug: "sectors",
    title: "Sector by sector: where the corridor is actually moving",
    standfirst:
      "Which Indian industries have a real reason to be in the UK now, which have a reason that predates the agreement, and which are being sold a story.",
    updated: "August 2026",
    readingMinutes: 7,
    metaDescription:
      "Which Indian sectors benefit from the India–UK CETA: technology, pharmaceuticals, textiles, engineering, chemicals, gems and jewellery, and where the tariff gains and services opportunities actually are.",
    blocks: [
      {
        kind: "p",
        text: "Tariff elimination is not the same as commercial opportunity, and the two diverge sharply by sector. What follows separates the sectors where the agreement changes the economics from those where the UK was already the obvious destination and the agreement is merely a convenient reason to move now.",
      },
      { kind: "h", text: "Where the agreement changes the economics" },
      {
        kind: "table",
        head: ["Sector", "What changed", "What it means in practice"],
        rows: [
          ["Textiles, apparel and leather", "Among the largest UK tariff reductions, applied immediately", "Genuine margin improvement against competitors with existing preferential access. Origin discipline is the constraint, not demand."],
          ["Gems and jewellery", "Duty reduction on a high-value, low-volume trade", "Small percentage changes on high unit values. UK entity useful for trade fairs, consignment stock and insurance."],
          ["Food, agriculture and marine", "Tariff reductions across a range of lines", "Sanitary and phytosanitary compliance, labelling and UK product law are the real barriers, and the agreement does not remove them."],
          ["Engineering and automotive components", "Tariff reductions, though the Year-1 automotive quota is 9,316 cars", "The component trade benefits more reliably than finished vehicles. Watch the quota arithmetic before building a plan on it."],
          ["Chemicals and plastics", "Broad tariff reductions", "Registration, evaluation and authorisation obligations remain the gating item for UK market access."],
        ],
      },
      { kind: "h", text: "Where the UK was already the destination" },
      {
        kind: "p",
        text: "Technology and IT services is by a wide margin the largest flow in this corridor, and almost none of it is tariff-sensitive. Services trade was not liberalised by tariff because services do not attract tariffs. What matters for this sector is people, entity and contract: a UK company to hold customer relationships, a route to move delivery leads and account managers, and English law commercial terms that will hold. The agreement helps at the margin on mobility and social security; it does not create the opportunity.",
      },
      {
        kind: "p",
        text: "Pharmaceuticals and life sciences is similar. Regulatory approval, not tariff, is the barrier, and the agreement does not shorten a marketing authorisation. Where it does help is the movement of technical and regulatory staff, and, for generics manufacturers with UK-facing operations, the Double Contribution Convention across a multi-year build.",
      },
      { kind: "h", text: "Where to be careful" },
      {
        kind: "list",
        items: [
          "Financial services and fintech. Market access is one thing; FCA authorisation is another, and it is a project measured in months. Carrying on a regulated activity without it is an offence under section 19 of the Financial Services and Markets Act 2000, and agreements made in contravention can be unenforceable.",
          "Legal services. The UK bound CPC 861 fully. India bound nothing and omitted legal services from its most-favoured-nation list. The liberalisation runs one way, and it is not the way most Indian firms were told.",
          "Anything in the five CBAM sectors. Aluminium, cement, fertiliser, hydrogen, and iron and steel face a UK carbon charge from 1 January 2027 with no exemption in the agreement. Model the net position before committing capital.",
          "Sectors touching the seventeen mandatory National Security and Investment Act areas, if the plan is acquisition rather than organic entry. The definitions are broader than the sector names, and completing without clearance where it was required makes the transaction void.",
        ],
      },
      { kind: "h", text: "The shape of the corridor" },
      {
        kind: "p",
        text: "There are now around 1,912 Indian-owned companies trading in the UK, up roughly 60% in a year, with combined turnover of about £105.8 billion and 203,549 employees. India was the second largest source of inward investment projects in 2025-26 with 93 projects. The corridor was growing strongly before 15 July 2026; the agreement accelerates something already in motion rather than starting it.",
      },
      {
        kind: "callout",
        title: "What CETA does not contain",
        text: "No investment chapter and no investor-state dispute settlement. The 1994 bilateral investment treaty was terminated on 22 March 2017 with a fifteen-year sunset running to around 2032, and negotiations on a replacement remain stuck on the taxation carve-out and most-favoured-nation treatment. Investment protection in this corridor currently rests on that sunset clause and on contract.",
      },
    ],
    sources: [
      "India–UK Comprehensive Economic and Trade Agreement, tariff schedules and services schedules",
      "UK impact assessment of the India–UK CETA",
      "Grant Thornton, India Meets Britain Tracker 2026",
      "Department for Business and Trade inward investment results 2025-26",
      "Financial Services and Markets Act 2000, s.19",
      "National Security and Investment Act 2021",
    ],
  },

  {
    slug: "market-entry",
    title: "CETA and the entry decision: what to use, what to ignore",
    standfirst:
      "The agreement is not a tariff table to read and a visa form to file. Used properly it changes the sequence and the cost of a UK entry: what to build into the plan on day one, and which parts of the published coverage are wrong.",
    updated: "November 2026",
    readingMinutes: 8,
    metaDescription:
      "How an Indian business should use the India–UK CETA when entering the UK market: tariff preference and rules of origin built into the go-to-market plan, mobility routes sequenced with incorporation under GBM3.4, the 60-month Double Contribution Convention, and what the agreement does not provide — procurement enforceable only from 2030, no investment chapter, no carbon provision.",
    blocks: [
      {
        kind: "p",
        text: "Most coverage of the India–UK CETA treats it as a set of rules a business must comply with. For a business actually entering the UK, it is a planning input: it changes which goods you lead with, who you move first, what a secondment costs over five years, and what order the entity, licence and payroll should happen in. This note sets out how we use the agreement in an entry plan, and where the published commentary gets it wrong.",
      },
      { kind: "h", text: "Start from mobility, not the tariff lines" },
      {
        kind: "p",
        text: "For most entering businesses the binding constraint is people, not goods. Paragraph GBM3.4 of the sponsor guidance lets a Companies House reference number evidence the UK footprint a UK Expansion Worker licence requires, so the incorporation and the visa application should be one transaction. Two provisions decide whether that works in practice: India did not obtain the twelve-month prior-employment waiver that Japan and Australia negotiated away, so a candidate needs twelve months with the group before they can be moved; and the Expansion Worker licence lasts four years, cannot be renewed, and drops to zero Certificates of Sponsorship if no full UK trading presence exists within two years under GBM3.38. The conversion to a standard Skilled Worker or Senior or Specialist Worker licence is the plan, dated from day one.",
      },
      {
        kind: "callout",
        title: "Service Suppliers: check your UK counterparty, not your own status",
        text: "Paragraphs 5.2 to 5.4 put the A-rated sponsor licence requirement on the UK party receiving the service. If your UK client is not an A-rated sponsor, the route is closed and no provision of the agreement opens it.",
      },
      { kind: "h", text: "The Double Contribution Convention is a five-year planning input" },
      {
        kind: "p",
        text: "The convention, extended from 36 to 60 months by SI 2026/794, lets an Indian employer continue paying Indian social security and exempt the worker from UK National Insurance for the exemption period. Model it across the full five years for each seconded worker — but model it honestly: regulations 145(2) and 146 of the Social Security (Contributions) Regulations 2001 already gave a unilateral 52-week exemption, so the genuinely additional benefit is months 13 to 60. Two traps: an employee already on a UK assignment on 15 July 2026 is not a detached worker under Article 7(2), and the convention exempts contributions, not residence or PAYE, which is still due on UK duties through UK payroll.",
      },
      { kind: "h", text: "Tariffs: check the code, then build the origin file" },
      {
        kind: "p",
        text: "On the UK side, tariff reductions applied in full on 15 July 2026 with no phase-in, so an exporter can claim preference on the next shipment. Preference is claimed, not granted, and the claim has to survive verification, which may come years later. Check your classification against the schedule and get the product-specific rule before building a go-to-market plan on it — the lookup below does exactly that, quoting Annex 3A verbatim.",
      },
      {
        kind: "callout",
        title: "Check your commodity code against the treaty",
        text: "Appendix 2A-b and Annex 3A, extracted from the agreement text: enter a code and get the UK's commitment on that line and the rule of origin quoted verbatim. The UK opened exactly one tariff rate quota, on electric and hybrid cars, and it does not open until 2031.",
        link: { href: "/india-uk/tariff-lookup", label: "Open the tariff and origin lookup" },
      },
      {
        kind: "p",
        text: "Where the Indian instruments sit awkwardly together — condition 3 of DGFT Public Notice 19/2026-27 and Rule 16(1)(b) of Notification 62/2026-Customs (N.T.) — build an evidential file that satisfies both. It costs little at the outset and a great deal to reconstruct after a verification letter, and a failed claim is recovered from the importer with interest across prior consignments.",
      },
      { kind: "h", text: "What the agreement does not give an entrant" },
      {
        kind: "list",
        items: [
          "No new visa route. Everything runs through the existing Immigration Rules, sponsor licence regime and salary thresholds, and the Immigration Health Surcharge is unaffected.",
          "No enforceable procurement access yet. Article 15.23 makes the government procurement chapter unenforceable state to state until 15 July 2030; UK public contracts still require a UK entity, a track record and supplier registration.",
          "No investment chapter and no ISDS. The 1994 bilateral investment treaty was terminated in 2017 with a sunset running to around 2032; protection rests on that sunset and on contract.",
          "No carbon provision. UK CBAM starts 1 January 2027 across aluminium, cement, fertiliser, hydrogen and iron and steel, with no India exemption, so for those sectors the tariff advantage and the carbon charge move in opposite directions.",
          "No change to UK company law, VAT or identity verification. The nil VAT threshold for a non-established taxable person, ECCTA identity verification and the registered office rules are exactly as they were.",
        ],
      },
      { kind: "h", text: "How we use it: operationalised, not explained" },
      {
        kind: "p",
        text: "Where generalist coverage explains what CETA says, we build it into the entry plan: classification and the product-specific rule checked before a go-to-market decision; the DCC modelled across the full 60 months for each seconded worker, including the transitional trap for anyone already in the UK; the mobility routes sequenced with the entity so the licence, the company and the payroll are one plan with one owner. That is the difference between citing the agreement and using it, and it is the difference a board should expect from an adviser on this corridor.",
      },
    ],
    sources: [
      "India–UK Comprehensive Economic and Trade Agreement, Ch. 4 (Rules of Origin), tariff schedules and Ch. 15 (Government Procurement), Art. 15.23",
      "Immigration Rules, Appendix Global Business Mobility",
      "Workers and Temporary Workers: guidance for sponsors, GBM3.4, GBM3.38 and Service Supplier paras 5.2–5.4",
      "SI 2026/794 — India–UK Double Contribution Convention; Exchange of Notes, 6 July 2026",
      "Social Security (Contributions) Regulations 2001, regs 145(2) and 146",
      "DGFT Public Notice 19/2026-27; Notification 62/2026-Customs (N.T.)",
      "Value Added Tax Act 1994, Sch. 1A",
      "UK Carbon Border Adjustment Mechanism, effective 1 January 2027",
    ],
  },
];

export const cetaArticleBySlug = Object.fromEntries(cetaArticles.map((a) => [a.slug, a])) as Record<string, CetaArticle>;
