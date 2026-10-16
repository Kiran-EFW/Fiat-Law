/**
 * Single source of truth for every regulatory identifier, contact detail and
 * capability claim made anywhere on this site.
 *
 * Nothing about the firm's regulated status is hardcoded into a component.
 * If a fact about the firm changes, it changes here and only here.
 *
 * ---------------------------------------------------------------------------
 * WHY THE `capabilities` FLAGS EXIST
 * ---------------------------------------------------------------------------
 * Several of the services in the commercial plan are regulated activities that
 * cannot lawfully be offered until a registration is in place:
 *
 *  - Registered office, company formation, and acting as (or arranging for
 *    another person to act as) a director or secretary are "trust or company
 *    service provider" activities under reg. 12(2) of the Money Laundering,
 *    Terrorist Financing and Transfer of Funds (Information on the Payer)
 *    Regulations 2017. Reg. 56 prohibits carrying them on by way of business
 *    before HMRC confirms registration; reg. 86 makes contravention an offence.
 *
 *  - Filing at Companies House on a client's behalf and verifying identity
 *    under the Economic Crime and Corporate Transparency Act 2023 requires
 *    Authorised Corporate Service Provider registration.
 *
 *  - Giving immigration advice or services is an offence under s.84 of the
 *    Immigration and Asylum Act 1999 unless given in an authorised capacity.
 *
 * Each flag below gates the corresponding content. Set to `true` only when the
 * registration is confirmed in writing.
 */

export type Capacity = "fiat-law" | "solicitor" | "coordinated";

export const firm = {
  name: "Fiat Law",
  legalName: "FIAT LAW UK LTD",
  companyNumber: "13662562",
  descriptor: "Corporate services and legal advisory",
  tagline: "The UK entry practice for Indian businesses",
  domain: "fiatlaw.co.uk",
  url: "https://fiatlaw.co.uk",

  address: {
    line1: "Suite 3, Second Floor",
    line2: "760 Eastern Avenue",
    locality: "Newbury Park, Ilford",
    region: "Essex",
    postcode: "IG2 7HU",
    country: "United Kingdom",
    countryCode: "GB",
  },

  contact: {
    email: "janeevan.john@fiatlaw.co.uk",
    telephone: "+44 20 8036 5612",
    telephoneDisplay: "020 8036 5612",
    mobile: "+44 7877 971233",
    mobileDisplay: "07877 971233",
  },

  /**
   * The practitioner. Reserved and regulated legal work is delivered by
   * Janeevan in his capacity as a solicitor practising through Taylor Rose,
   * not by FIAT LAW UK LTD.
   */
  principal: {
    name: "Janeevan John",
    role: "Solicitor · Founder",
    sraNumber: "443287",
    admitted: "2 July 2007",
    sraCheckUrl: "https://solicitors.lawsociety.org.uk/person/443287",
    portrait: "/brand/janeevan-john.jpg",
  },

  /**
   * The authorised firm through which regulated work is carried out.
   */
  regulatedFirm: {
    name: "Taylor Rose",
    legalName: "Taylor Rose Limited",
    sraNumber: "623604",
    regulator: "Solicitors Regulation Authority",
    regulatorUrl: "https://www.sra.org.uk",
    sraCheckUrl: "https://www.sra.org.uk/consumers/register/organisation/?sraNumber=623604",
    codeUrl: "https://www.sra.org.uk/solicitors/standards-regulations/",
  },

  ombudsman: {
    name: "Legal Ombudsman",
    url: "https://www.legalombudsman.org.uk",
    telephone: "0300 555 0333",
    email: "enquiries@legalombudsman.org.uk",
    address: "Legal Ombudsman, PO Box 6167, Slough, SL1 0EH",
  },

  ico: {
    name: "Information Commissioner's Office",
    url: "https://ico.org.uk",
    telephone: "0303 123 1113",
  },

  /**
   * Capability gates. See the note at the top of this file.
   * Every one of these must be confirmed with Janeevan before launch.
   */
  capabilities: {
    /** HMRC supervision as a trust or company service provider (MLR 2017). */
    tcspSupervised: false,
    /** Authorised Corporate Service Provider registration at Companies House. */
    acspRegistered: false,
    /** Basis on which immigration advice is given: SRA authorisation via Taylor Rose. */
    immigrationAdvice: true,
    /** Accounting delivered through named partner firms rather than in-house. */
    accountingInHouse: false,
  },

  /** Public profiles. Empty strings are not rendered. */
  social: {
    linkedin: "",
    x: "",
  },
} as const;

export const capacityLabel: Record<Capacity, string> = {
  "fiat-law": "Fiat Law",
  solicitor: `${firm.principal.name}, solicitor · ${firm.regulatedFirm.legalName}`,
  coordinated: "Coordinated by Fiat Law with named partner firms",
};

export const capacityNote: Record<Capacity, string> = {
  "fiat-law":
    `Delivered by ${firm.legalName} as corporate services and business advisory. ` +
    `This is not reserved legal activity and ${firm.legalName} is not a firm authorised by the Solicitors Regulation Authority.`,
  solicitor:
    `Delivered by ${firm.principal.name} (SRA ${firm.principal.sraNumber}) in his capacity as a solicitor ` +
    `practising through ${firm.regulatedFirm.legalName} (SRA ${firm.regulatedFirm.sraNumber}), and subject to that firm's ` +
    `authorisation, professional indemnity insurance and complaints procedure.`,
  coordinated:
    `Scoped and project-managed by ${firm.legalName} and delivered by named, independently regulated partner firms. ` +
    `You are told who is doing the work before it begins.`,
};

export const addressLines = [
  firm.address.line1,
  firm.address.line2,
  firm.address.locality,
  firm.address.postcode,
] as const;

export const addressOneLine = addressLines.join(", ");
