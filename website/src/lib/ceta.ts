/**
 * Lookup over the two CETA annexes extracted by scripts/extract-ceta.mjs.
 *
 * Everything here is a pure function over checked-in JSON. There is no database
 * call, no third-party API and no model in the path: the same commodity code
 * returns the same answer to every visitor, and that answer is a quotation from
 * an annex rather than a paraphrase of one. For a page whose entire value is
 * that a client can check it against the instrument, that is the requirement.
 *
 * What this deliberately does NOT do is tell anyone what duty they will pay.
 * The schedule records the United Kingdom's *commitment* — eliminate, quota, or
 * exclude. The rate itself lives in the UK Global Tariff, which is not in this
 * dataset. Showing a saving would mean inventing the number it is measured from.
 */

import tariffData from "@/content/generated/ceta-uk-tariff.json";
import psrData from "@/content/generated/ceta-psr.json";

export type Staging = "A" | "TRQ" | "U";

export interface TariffRow {
  code: string;
  description: string;
  staging: Staging;
}

export interface PsrRow {
  code: string;
  level: "chapter" | "heading" | "subheading";
  partial: boolean;
  description: string;
  rule: string;
  sharedWith?: string[];
}

export interface SectionNote {
  section: string;
  title: string;
  note: string;
  chapters: string[];
}

export const tariffSource = tariffData.source;
export const psrSource = psrData.source;
export const stagingInfo = tariffData.staging as Record<Staging, { code: string; label: string; detail: string }>;
export const ruleGlossary = psrData.glossary as Record<string, string>;
export const ukTrq = tariffData.trq;
export const entryIntoForce = tariffData.entryIntoForce;

const tariffRows = tariffData.rows as TariffRow[];
const psrRows = psrData.rows as PsrRow[];
export const allSectionNotes = psrData.sectionNotes as SectionNote[];
const sectionNotes = allSectionNotes;

/**
 * Three sections of Annex 3A carry a note, and a Section Note beats the product
 * specific rule beneath it — a chapter 28 to 38 good that is the product of a
 * chemical reaction in India originates whatever the chapter rule requires.
 *
 * Showing the chapter rule without the note would therefore be worse than
 * showing nothing: it states a test the good may not have to meet.
 */
export function sectionNoteFor(digits: string): SectionNote | null {
  const chapter = digits.slice(0, 2);
  return sectionNotes.find((n) => n.chapters.includes(chapter)) ?? null;
}

/** "8703.80" and "8703 80 00 00" and "870380" are the same line. */
const digitsOf = (code: string) => code.replace(/\D/g, "");

/**
 * What the visitor typed, reduced to the digits of a commodity code.
 *
 * UK import declarations use a ten-digit code; the agreement is written to
 * eight at most and usually to six. Anything past eight is a national
 * subdivision that the annexes do not reach, so it is dropped rather than
 * silently failed on — a trader who pastes the code off their own declaration
 * should get an answer, not an error.
 */
export function normaliseCode(input: string): { digits: string; trimmed: boolean } | null {
  const digits = digitsOf(input);
  if (digits.length < 2) return null;
  return { digits: digits.slice(0, 8), trimmed: digits.length > 8 };
}

export function formatCode(digits: string): string {
  if (digits.length <= 4) return digits;
  return digits.slice(0, 4) + digits.slice(4).replace(/(\d{2})/g, ".$1");
}

/** Longest prefix wins: an entry for 0203.11.10 beats one for 0203, which beats one for 02. */
function longestPrefix<T extends { code: string }>(rows: T[], digits: string): T[] {
  let best: T[] = [];
  let bestLength = -1;
  for (const row of rows) {
    const rowDigits = digitsOf(row.code);
    if (!digits.startsWith(rowDigits)) continue;
    if (rowDigits.length > bestLength) {
      bestLength = rowDigits.length;
      best = [row];
    } else if (rowDigits.length === bestLength) {
      // Annex 3A splits some sub-headings across several rows — "Ex 711319
      // Parts" and "Ex 711319 Gold jewellery: Plain" carry different rules, and
      // which one applies turns on the Column 2 description. Both are returned;
      // choosing between them is the reader's job, and the page says so.
      best.push(row);
    }
  }
  return best;
}

export interface TariffResult {
  matched: TariffRow | null;
  /** True when the answer comes from a broader line than the code entered. */
  broader: boolean;
}

export function lookupTariff(digits: string): TariffResult {
  const [matched = null] = longestPrefix(tariffRows, digits);
  return { matched, broader: matched !== null && digitsOf(matched.code).length < digits.length };
}

export interface PsrResult {
  matches: PsrRow[];
  /** The chapter rule, shown for context whenever a narrower rule was found. */
  chapter: PsrRow | null;
}

export function lookupPsr(digits: string): PsrResult {
  const matches = longestPrefix(psrRows, digits);
  const chapter = psrRows.find((r) => r.level === "chapter" && digitsOf(r.code) === digits.slice(0, 2)) ?? null;
  return { matches, chapter: chapter && !matches.includes(chapter) ? chapter : null };
}

/** The glossary entries a given rule actually uses, longest token first so
 *  "Standard QVC" is matched before the bare "QVC" inside it. */
export function glossaryFor(rules: string[]): [string, string][] {
  const text = rules.join(" ");
  return Object.entries(ruleGlossary)
    .sort((a, b) => b[0].length - a[0].length)
    .filter(([token], i, all) => {
      if (!new RegExp(`\\b${token}\\b`).test(text)) return false;
      // "Standard QVC" already explains the percentages, so the generic QVC
      // entry is redundant noise when both would match.
      return !all.slice(0, i).some(([longer]) => longer.includes(token));
    });
}

export interface ChapterGroup {
  chapter: string;
  title: string;
  rows: TariffRow[];
}

/**
 * The schedule grouped for browsing. A chapter's title is taken from its own
 * two-digit entry where the United Kingdom made a chapter-wide commitment; the
 * six chapters listed heading by heading — meat, dairy, cereals, meat
 * preparations, sugar and vehicles, which is to say the sensitive ones — have
 * no such entry, so the first heading's description stands in.
 */
export function tariffByChapter(): ChapterGroup[] {
  const groups = new Map<string, TariffRow[]>();
  for (const row of tariffRows) {
    const chapter = digitsOf(row.code).slice(0, 2);
    const list = groups.get(chapter);
    if (list) list.push(row);
    else groups.set(chapter, [row]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([chapter, rows]) => {
      const own = rows.find((r) => digitsOf(r.code).length === 2);
      return { chapter, title: own?.description ?? rows[0].description, rows };
    });
}

export const chapterRules = psrRows.filter((r) => r.level === "chapter");
export const tariffRowCount = tariffRows.length;
export const psrRowCount = psrRows.length;
