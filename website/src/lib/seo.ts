/**
 * Every public page's <head>, built in one place.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 * ---------------------------------------------------------------------------
 * Next merges Open Graph metadata down from the parent. A page that exports
 * only `title` and `description` therefore keeps the *root layout's* og:title
 * and og:description — so thirteen of the sixteen public pages were serving the
 * homepage's share card. The <meta name="description"> was correct on each one;
 * the card that actually appears when somebody pastes the link into LinkedIn or
 * WhatsApp was not. For this audience that is the more important of the two: a
 * link to /services/immigration is passed between a founder, their CFO and
 * their Indian counsel long before anybody searches for it.
 *
 * `pageMeta()` writes title, description, canonical, Open Graph and Twitter
 * from a single description of the page, so the three can no longer drift.
 */

import type { Metadata } from "next";
import { firm } from "@/config/firm";

/** Facebook, LinkedIn and X all crop to 1.91:1. */
export const OG_SIZE = { width: 1200, height: 630 } as const;

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

/**
 * Content carries a human month — "August 2026" — because that is what belongs
 * on the page. Sitemaps and Article schema need a date. Parsed to the first of
 * the month, which is the honest reading of a month-precision claim: it is the
 * earliest moment the statement could have been true.
 *
 * Returns null rather than guessing if the string is not a month and a year, so
 * a malformed date is absent from the markup instead of wrong in it.
 */
export function isoDate(human: string): string | null {
  const match = /^([A-Za-z]+)\s+(\d{4})$/.exec(human.trim());
  if (!match) return null;
  const month = MONTHS.indexOf(match[1].toLowerCase());
  if (month < 0) return null;
  return `${match[2]}-${String(month + 1).padStart(2, "0")}-01`;
}

/**
 * The share card is rendered on demand by /og. Deliberately not under /api,
 * which robots.txt disallows: LinkedIn's and Facebook's crawlers honour that
 * file, and an og:image they are told not to fetch is an og:image that does not
 * exist.
 */
export function ogImageUrl(title: string, eyebrow?: string): string {
  const params = new URLSearchParams({ t: title.slice(0, 160) });
  if (eyebrow) params.set("k", eyebrow.slice(0, 48));
  return `/og?${params.toString()}`;
}

export interface PageMetaInput {
  /** Page title without the firm suffix — the root template appends it. */
  title: string;
  /** Bypasses the root template. The homepage needs it; nothing else should. */
  absoluteTitle?: string;
  description: string;
  /** Absolute path from the site root, e.g. "/services/immigration". */
  path: string;
  /** Small line above the title on the share card. */
  eyebrow?: string;
  type?: "website" | "article";
  /** Human month from the content, e.g. "August 2026". */
  updated?: string;
  /** Set for pages that must stay out of the index but remain crawlable. */
  noindex?: boolean;
  /** Overrides the generated share card. */
  image?: string;
}

export function pageMeta({
  title,
  absoluteTitle,
  description,
  path,
  eyebrow,
  type = "website",
  updated,
  noindex,
  image,
}: PageMetaInput): Metadata {
  const canonical = path === "/" ? "/" : path.replace(/\/$/, "");
  // The card shows the full name because it is read out of context, away from
  // the site chrome that would otherwise say whose page this is.
  const socialTitle = title === firm.tagline ? `${firm.name} — ${firm.tagline}` : `${title} — ${firm.name}`;
  const card = image ?? ogImageUrl(title, eyebrow);
  const modified = updated ? isoDate(updated) : null;

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: { canonical },
    openGraph: {
      type,
      locale: "en_GB",
      siteName: firm.name,
      url: canonical,
      title: socialTitle,
      description,
      images: [{ url: card, ...OG_SIZE, alt: socialTitle }],
      ...(type === "article" && modified ? { publishedTime: modified, modifiedTime: modified } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [card],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
