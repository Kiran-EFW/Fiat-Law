/**
 * Structured data.
 *
 * The rule applied throughout: schema describes what is on the page and what is
 * true of the firm, and nothing else. No FAQPage, because the site has no
 * question-and-answer content and inventing some to win a rich result is both
 * against Google's guidelines and, for a regulated practice, a misrepresentation.
 * No aggregateRating and no review markup, for the same reason — the SRA Code
 * treats a claim you cannot substantiate as a Code issue, not a marketing one.
 *
 * `@id` values are stable URLs with fragments, so the Organization declared once
 * in the site layout is *referenced* by every Article, Service and breadcrumb
 * rather than repeated. That is what lets a crawler understand the pages as one
 * publisher's body of work instead of sixteen unrelated documents.
 */

import { firm } from "@/config/firm";

const base = firm.url.replace(/\/$/, "");
const abs = (path: string) => (path === "/" ? base : `${base}${path}`);

export const ORG_ID = `${base}/#organisation`;
export const SITE_ID = `${base}/#website`;
export const PERSON_ID = `${base}/about#janeevan-john`;

/** The practitioner. Referenced as the author of everything published here. */
export function personSchema() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: firm.principal.name,
    jobTitle: "Solicitor",
    url: abs("/about"),
    image: abs(firm.principal.portrait),
    worksFor: { "@id": ORG_ID },
    ...(firm.social.linkedin || firm.social.x
      ? { sameAs: [firm.social.linkedin, firm.social.x].filter(Boolean) }
      : {}),
    ...(firm.capabilities.immigrationAdvice
      ? { memberOf: { "@type": "Organization", name: firm.regulatedFirm.legalName } }
      : {}),
  };
}

export function organisationSchema() {
  return {
    "@type": "LegalService",
    "@id": ORG_ID,
    name: firm.name,
    legalName: firm.legalName,
    url: base,
    logo: abs("/brand/fiat-law-logo.png"),
    image: abs("/brand/fiat-law-logo.png"),
    description: `${firm.tagline}. Corporate services, business immigration, corporate and commercial law, acquisitions, accounting and CETA trade advisory.`,
    telephone: firm.contact.telephone,
    email: firm.contact.email,
    priceRange: "££££",
    areaServed: [
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "India" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: `${firm.address.line1}, ${firm.address.line2}`,
      addressLocality: firm.address.locality,
      addressRegion: firm.address.region,
      postalCode: firm.address.postcode,
      addressCountry: firm.address.countryCode,
    },
    identifier: {
      "@type": "PropertyValue",
      name: "Companies House company number",
      value: firm.companyNumber,
    },
    founder: { "@id": PERSON_ID },
    employee: { "@id": PERSON_ID },
    knowsLanguage: ["en-GB"],
    ...(firm.social.linkedin || firm.social.x
      ? { sameAs: [firm.social.linkedin, firm.social.x].filter(Boolean) }
      : {}),
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: base,
    name: firm.name,
    inLanguage: "en-GB",
    publisher: { "@id": ORG_ID },
  };
}

/**
 * Breadcrumbs. The home crumb is always first, so callers pass only the trail
 * below it and cannot produce a list that starts halfway down the site.
 */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${abs(trail[trail.length - 1]?.path ?? "/")}#breadcrumbs`,
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: abs(crumb.path),
    })),
  };
}

export interface ArticleInput {
  title: string;
  description: string;
  path: string;
  /** ISO date, from `isoDate()` in @/lib/seo. Omitted from the output if null. */
  date: string | null;
  section: string;
  readingMinutes?: number;
  /** The primary sources cited at the foot of the piece. */
  citations?: string[];
}

export function articleSchema({
  title,
  description,
  path,
  date,
  section,
  readingMinutes,
  citations,
}: ArticleInput) {
  return {
    "@type": "Article",
    "@id": `${abs(path)}#article`,
    headline: title.slice(0, 110),
    description,
    url: abs(path),
    mainEntityOfPage: abs(path),
    articleSection: section,
    inLanguage: "en-GB",
    isAccessibleForFree: true,
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    ...(date ? { datePublished: date, dateModified: date } : {}),
    ...(readingMinutes ? { timeRequired: `PT${readingMinutes}M` } : {}),
    // The whole argument for publishing this material is that it is checkable.
    // `citation` is the machine-readable half of the sources list on the page.
    ...(citations?.length ? { citation: citations } : {}),
  };
}

export interface ServiceInput {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  offers?: string[];
}

export function serviceSchema({ name, description, path, serviceType, offers }: ServiceInput) {
  return {
    "@type": "Service",
    "@id": `${abs(path)}#service`,
    name,
    description,
    serviceType,
    url: abs(path),
    provider: { "@id": ORG_ID },
    areaServed: [
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "India" },
    ],
    audience: {
      "@type": "BusinessAudience",
      name: "Indian businesses establishing or operating in the United Kingdom",
    },
    // No `price` and no `priceRange` on the individual services. Every
    // engagement here is scoped and quoted, and a number in the markup that is
    // not a number on the page is a claim the firm would have to honour.
    ...(offers?.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${name}: scope`,
            itemListElement: offers.map((item) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: item },
            })),
          },
        }
      : {}),
  };
}

/** Wraps one or more node types into a single graph document. */
export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
