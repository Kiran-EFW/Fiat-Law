/**
 * The client taxonomy.
 *
 * Seven segments, each with a genuinely different problem, sequence and buying
 * trigger. Everything personalised on this site — the brief, the recommended
 * route, the scope, the lead score — resolves to one of these.
 */

export type SegmentId = "bridgehead" | "establisher" | "exporter" | "acquirer" | "operator" | "principal" | "partner";

export interface Segment {
  id: SegmentId;
  /** A–G, used in the admin view and in exported data. */
  code: string;
  name: string;
  /** How the client would describe themselves, in the first person. */
  selfDescription: string;
  /** One line, for cards and doors. */
  summary: string;
  /** What makes them start looking. */
  trigger: string;
  /** The three or four things they actually need. */
  needs: string[];
  /** Services keyed to src/content/services.ts */
  services: string[];
  /** Relative commercial weight, feeds the lead score. 0–100. */
  value: number;
  /** Shown on the homepage segment doors. Partner track is separate. */
  isDoor: boolean;
}

export const segments: Segment[] = [
  {
    id: "bridgehead",
    code: "A",
    name: "Bridgehead",
    selfDescription: "We are testing the UK market and have no presence here yet.",
    summary:
      "An Indian company with a first UK customer or a pilot contract, needing one or two people on the ground and a credible address.",
    trigger: "A first UK customer, a pilot contract, or a tender that requires a UK entity.",
    needs: [
      "A UK company, incorporated correctly the first time",
      "An address that is genuinely appropriate, not a PO box",
      "A bank account, routinely the real critical path, at six to eight weeks",
      "A visa route for the person who will run it, which is usually the UK Expansion Worker route they have not heard of",
    ],
    services: ["uk-entry", "immigration", "accounting"],
    value: 55,
    isDoor: true,
  },
  {
    id: "establisher",
    code: "B",
    name: "Establisher",
    selfDescription: "The board has approved a UK subsidiary and we are hiring here.",
    summary:
      "An Indian mid-cap or large company committing to a UK subsidiary with staff, the sequence where immigration, entity and payroll are one problem rather than three.",
    trigger: "Board approval, or a contract too large to service from India.",
    needs: [
      "The subsidiary, and a sponsor licence that survives a compliance visit",
      "UK Expansion Worker converting to Senior or Specialist Worker before the two-year cliff",
      "PAYE, payroll and VAT registered in the right order",
      "Double Contribution Convention planning across the full 60 months",
    ],
    services: ["uk-entry", "immigration", "accounting", "corporate"],
    value: 100,
    isDoor: true,
  },
  {
    id: "exporter",
    code: "C",
    name: "Exporter",
    selfDescription: "We are selling into the UK and want the tariff advantage.",
    summary:
      "An Indian manufacturer or exporter using CETA tariff preference, with a light UK footprint or none at all.",
    trigger: "The Comprehensive Economic and Trade Agreement entering into force on 15 July 2026.",
    needs: [
      "Rules of origin and self-certification that will survive verification",
      "Customs classification and the correct preference claim",
      "UK VAT, where the registration threshold for a non-established taxable person is nil rather than £90,000",
      "Distribution, agency and supply contracts governed by English law",
    ],
    services: ["trade", "corporate", "accounting"],
    value: 60,
    isDoor: true,
  },
  {
    id: "acquirer",
    code: "D",
    name: "Acquirer",
    selfDescription: "We are buying a UK business.",
    summary:
      "An Indian corporate with an identified target or a live mandate. Highest value per instruction, lowest frequency.",
    trigger: "An identified target, a broker approach, or an internal mandate to acquire.",
    needs: [
      "Legal due diligence that finds the things the vendor did not disclose",
      "Share purchase agreement, warranties, indemnities and disclosure",
      "Employment, TUPE and pensions exposure quantified before signing",
      "National Security and Investment Act screening, which is mandatory in seventeen sectors",
    ],
    services: ["ma", "corporate", "uk-entry"],
    value: 95,
    isDoor: true,
  },
  {
    id: "operator",
    code: "E",
    name: "Established operator",
    selfDescription: "We already have a UK company and need it looked after properly.",
    summary:
      "One of the ~1,912 Indian-owned companies already trading in the UK. The trigger here is a date, not an ambition.",
    trigger:
      "Economic Crime and Corporate Transparency Act identity verification, now mandatory, with the transition closing 18 November 2026.",
    needs: [
      "Identity verification for directors and PSCs who are sitting in India",
      "Company secretarial, confirmation statements and filings that are actually on time",
      "Remediation where filings have slipped or the register is wrong",
      "Restructuring, disputes and commercial contracts as they arise",
    ],
    services: ["uk-entry", "accounting", "corporate"],
    value: 70,
    isDoor: true,
  },
  {
    id: "principal",
    code: "F",
    name: "Founder or principal",
    selfDescription: "I am moving to the UK myself.",
    summary:
      "An individual founder, investor or executive relocating, sometimes with a business behind them and sometimes without.",
    trigger: "A personal decision to relocate, invest, or move a family.",
    needs: [
      "The right route: Global Talent, Innovator Founder, Skilled Worker or a sponsored move",
      "An honest answer on whether a UK company is needed at all; for Global Talent, it is not",
      "Settlement and naturalisation planned from day one, not year four",
      "Private client work: wills, property, family",
    ],
    services: ["immigration", "corporate"],
    value: 45,
    isDoor: true,
  },
  {
    id: "partner",
    code: "G",
    name: "Referral partner",
    selfDescription: "I advise clients who are going to the UK.",
    summary:
      "Indian law firms, chartered accountants, chambers of commerce and investment promotion agencies with clients heading to the UK.",
    trigger: "A client asks a question about the UK that the adviser cannot answer in their own jurisdiction.",
    needs: [
      "A clear statement of what stays with you and what does not",
      "A professional boundary that respects both regulators",
      "Response times you can promise your own client",
      "Fee transparency between advisers, agreed before anyone is introduced",
    ],
    services: ["uk-entry", "immigration", "corporate", "ma"],
    value: 35,
    isDoor: false,
  },
];

export const segmentById = Object.fromEntries(segments.map((s) => [s.id, s])) as Record<SegmentId, Segment>;

export const doorSegments = segments.filter((s) => s.isDoor);

export function isSegmentId(value: unknown): value is SegmentId {
  return typeof value === "string" && value in segmentById;
}
