#!/usr/bin/env node
/**
 * Turns two CETA annexes into checked-in JSON the site can serve.
 *
 *   node scripts/extract-ceta.mjs
 *
 * Reads the extracted text held in ../library (the primary-source corpus) and
 * writes src/content/generated/. The generated files are committed, so the
 * website builds without the library present — the library is provenance, not
 * a build dependency.
 *
 * Sources:
 *   Appendix 2A-b  Schedule of Tariff Commitments of the United Kingdom
 *   Annex 3A       Product Specific Rules of Origin
 *
 * Every record carries the file it came from. The manifest's SHA-256 for that
 * file is copied into the dataset header, so a figure shown on the site can be
 * traced to a specific byte sequence of a specific PDF retrieved on a specific
 * day. For a practice whose pitch is "our numbers are checkable", that chain
 * has to actually exist.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const LIBRARY = join(here, "../../library");
const OUT = join(here, "../src/content/generated");

const TARIFF_SRC = "01-ceta-legal-text/uk_india_ceta_annex2a_b_schedules_tariff_commitments_of_united_kingdom.pdf";
const PSR_SRC = "01-ceta-legal-text/uk_india_ceta_annex3a_product_specific_rules_of_origin.pdf";
const ANNEX2A_SRC = "01-ceta-legal-text/uk_india_ceta_annex2a_schedules_tariff_commitments_for_goods.pdf";

/**
 * Annex 2A Section A(2): year one runs from entry into force to 31 December of
 * the same year, and every later year is the calendar year beginning 1 January.
 * So year N for N >= 2 is calendar year (EIF year + N - 1).
 */
const ENTRY_INTO_FORCE = "2026-07-15";
const EIF_YEAR = Number(ENTRY_INTO_FORCE.slice(0, 4));
const calendarYear = (n) => EIF_YEAR + n - 1;

const manifest = JSON.parse(readFileSync(join(LIBRARY, "_manifest.json"), "utf8"));

function textOf(pdfPath) {
  const flat = `${pdfPath.replace("/", "__").replace(/\.pdf$/, "")}.txt`;
  return readFileSync(join(LIBRARY, "99-extracted-text", flat), "utf8");
}

function provenance(pdfPath) {
  const entry = manifest[pdfPath];
  if (!entry) throw new Error(`${pdfPath} is not in the library manifest`);
  return { file: pdfPath, url: entry.url, sha256: entry.sha256, retrieved: entry.retrieved };
}

/**
 * The PDF extractor breaks words across a hyphen with a stray space —
 * "semi -trailers", "non -domestic", "build -down" — and hard-wraps mid-cell.
 * Both have to be repaired before the text means anything.
 */
function tidy(s) {
  return s
    .replace(/(\w) +- +(\w)/g, "$1-$2") // "ex - works"  (hyphen ended the line)
    .replace(/(\w) +-(\w)/g, "$1-$2") // "build -down"
    .replace(/(\w)- +(\w)/g, "$1-$2") // "free on- board"
    .replace(/\s+/g, " ")
    .trim();
}

function usefulLines(raw, isFurniture) {
  return raw
    .split("\n")
    .map((line) => line.replace(/\s+$/, "").trim())
    .filter((line) => line && !line.startsWith("#") && !isFurniture(line));
}

/**
 * Both annexes are tables whose first column is an HS code and whose rows wrap
 * over several lines. A row therefore starts at a line that opens with a code
 * and runs until the next such line.
 *
 * The trap is that a wrapped *description* line can also open with a code —
 * "2304 or 2305", "8701 to 8705" — which starts a phantom row that swallows the
 * real row's remaining text. Both tables are in ascending HS order, so a
 * candidate code lower than the row already open is prose, not a new row. That
 * one guard is what stops heading 2306 being published with no rule of origin
 * because the words "other than those of heading 2304 or 2305" happened to wrap.
 */
function tableRows(lines, keyPattern, sortKey) {
  const rows = [];
  let open = null;
  for (const line of lines) {
    const m = keyPattern.exec(line);
    if (m && (!open || sortKey(m[1]) >= sortKey(open.key))) {
      open = { key: m[1], text: line.slice(m[0].length).trim() };
      rows.push(open);
    } else if (open) {
      open.text += ` ${line}`;
    }
  }
  return rows.map((r) => ({ key: tidy(r.key), text: tidy(r.text) }));
}

// --------------------------------------------------------------------------
// Appendix 2A-b — the UK's tariff commitments on originating goods of India
// --------------------------------------------------------------------------

const STAGING = {
  A: {
    code: "A",
    label: "Duty-free from entry into force",
    detail:
      "Customs duty eliminated on the date the agreement entered into force. No phase-in, no quota: an originating good of India in this category enters the United Kingdom at nil duty today.",
  },
  TRQ: {
    code: "TRQ",
    label: "Tariff rate quota",
    detail:
      "Duty-free only within an annual quota, and only for goods within the stated value bands. There is no preferential out-of-quota rate — once the quota is exhausted the good pays the full UK Global Tariff rate.",
  },
  U: {
    code: "U",
    label: "Excluded from the agreement",
    detail:
      "Excluded from any commitment to reduce or eliminate customs duty. The UK Global Tariff rate applies in full, and no CETA preference can be claimed. Claiming one on an entry for a good in this category is a false declaration.",
  },
};

/** "01" → 010000, "0201" → 020100, "0203.11.10" → 020311 (the dotted 8th digit
 *  is a national subdivision and does not affect ordering). */
function tariffSortKey(code) {
  const digits = code.replace(/\./g, "").slice(0, 6);
  return Number(digits.padEnd(6, "0"));
}

function parseTariffSchedule() {
  const lines = usefulLines(
    textOf(TARIFF_SRC),
    (l) =>
      /^Appendix 2A-b/i.test(l) ||
      /^Commodity code/.test(l) ||
      /^\(2022\) Indicative description/.test(l) ||
      /^category$/.test(l) ||
      /^1 2 3$/.test(l) ||
      /^SCHEDULE OF TARIFF COMMITMENTS/.test(l),
  );

  const rows = tableRows(lines, /^(\d{2}(?:\d{2})?(?:\.\d{2}){0,2})(?=\s|$)/, tariffSortKey);

  // The staging cell is usually the last thing in the row, but where a
  // description crosses a page break the extractor emits the cell first and the
  // rest of the description after it. Every one of the 246 rows contains
  // exactly one standalone staging token, so splitting on it and rejoining the
  // description around it is unambiguous — no description contains a bare
  // "A", "U" or "TRQ".
  const STAGING_TOKEN = /(?<=^|\s)(TRQ|A|U)(?=\s|$)/g;

  return rows.map(({ key, text }) => {
    const hits = [...text.matchAll(STAGING_TOKEN)];
    if (hits.length !== 1) {
      throw new Error(`Appendix 2A-b: ${hits.length} staging tokens on ${key} — "${text.slice(0, 90)}"`);
    }
    const [hit] = hits;
    const description = tidy(`${text.slice(0, hit.index)} ${text.slice(hit.index + hit[0].length)}`);
    return { code: key, description, staging: hit[1] };
  });
}

/**
 * Annex 2A Section D paragraph 2 — the only tariff rate quota the United Kingdom
 * opens under this agreement.
 *
 * Two things here are worth more than the rest of the dataset put together, and
 * neither is visible from the schedule itself. The quota table begins at year
 * six, so for the first five years there is no quota; and paragraph 2(c) says
 * there is no out-of-quota preference. Together those mean an Indian electric or
 * hybrid car entering the United Kingdom today pays the full UK Global Tariff,
 * notwithstanding a schedule entry that reads "TRQ". A reader who saw only the
 * schedule would conclude the opposite.
 */
function parseUkTrq() {
  const raw = textOf(ANNEX2A_SRC);
  const start = raw.indexOf("Section D: Schedule of Tariff Commitments of the United Kingdom");
  if (start < 0) throw new Error("Annex 2A: Section D not found");
  const text = tidy(
    usefulLines(raw.slice(start), (l) => /^Annex 2A - \d+$/.test(l)).join(" "),
  );

  // Year | under £20k CIF | £20k–£40k | £40k–£80k | above £80k | total.
  // The final row reads "15 and following years".
  const row = /(\d+)(?:\s+and following years)?\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+U\s+([\d,]+)/g;
  const num = (s) => Number(s.replace(/,/g, ""));

  const quota = [];
  for (const m of text.matchAll(row)) {
    const year = Number(m[1]);
    const bands = [num(m[2]), num(m[3]), num(m[4])];
    const total = num(m[5]);
    // The bands are stated alongside their own total, so they check each other.
    // If this ever fails the columns have been misread and nothing below is safe.
    const sum = bands.reduce((a, b) => a + b, 0);
    if (sum !== total) {
      throw new Error(`Annex 2A TRQ year ${year}: bands sum to ${sum}, table says ${total}`);
    }
    quota.push({
      year,
      calendarYear: calendarYear(year),
      openEnded: /and following years/.test(m[0]),
      bands: { under20k: bands[0], from20kTo40k: bands[1], from40kTo80k: bands[2], above80k: null },
      total,
    });
  }
  if (!quota.length) throw new Error("Annex 2A: TRQ quota table did not parse");

  const codes = [...new Set([...text.matchAll(/8703\.\d{2}/g)].map((m) => m[0]))].sort();

  return {
    title: "Electric, hybrid and hydrogen passenger cars (HS 8703)",
    firstYear: quota[0].year,
    firstCalendarYear: quota[0].calendarYear,
    codes,
    quota,
    notes: [
      "The quota table begins at year six. For years one to five the United Kingdom opens no quota at all.",
      "Annex 2A Section D paragraph 2(c): there is no out-of-quota preferential customs duty for these codes. Outside the quota the full UK Global Tariff rate applies.",
      "Cars above £80,000 CIF are marked U in every year — excluded from the quota for the life of the agreement.",
      "Annex 2A Section D paragraph 2(d): the values in the quota are not adjusted for inflation.",
      `Annex 2A Section A paragraph 2: year one runs from entry into force on ${ENTRY_INTO_FORCE} to 31 December ${EIF_YEAR}; each later year is the calendar year beginning 1 January.`,
    ],
  };
}

// --------------------------------------------------------------------------
// Annex 3A — product specific rules of origin
// --------------------------------------------------------------------------

const RULE_GLOSSARY = {
  WO: "Wholly obtained. The good must be entirely obtained or produced in India — grown, mined, born and raised, or made exclusively from materials that themselves qualify. Article 3.3.",
  CC: "Change of chapter. Every non-originating material must be classified in a different 2-digit HS chapter from the finished good.",
  CTH: "Change of tariff heading. Every non-originating material must be classified in a different 4-digit HS heading from the finished good.",
  CTSH: "Change of tariff sub-heading. Every non-originating material must be classified in a different 6-digit HS sub-heading from the finished good.",
  QVC: "Qualifying value content. A stated percentage of the good's value must be accounted for by originating content, calculated under Article 3.5 by either the build-up or the build-down method.",
  "Standard QVC":
    "Standard qualifying value content: 40% of the ex-works price or 45% of the FOB value under the build-down method, or 35% of either under the build-up method. Article 3.5.",
};

/** Where Column 3 begins. Anything before the first of these tokens is the
 *  Column 2 description. "(b)"/"(c)" are enumerated limbs of a rule cell that
 *  the extractor has spread across the rows the cell spans — see mergeSpans. */
const RULE_OPENER =
  /\b(WO|CC|CTSH|CTH|Standard QVC|A QVC|QVC|Melt and Pour|Chemical [Rr]eaction|Purification|Change in [Pp]article [Ss]ize|Standard [Mm]aterials|Isomer [Ss]eparation|Biotechnological)\b|\(([b-e])\)\s/;

const CONTINUATION = /^\([b-e]\)\s/;

function psrSortKey(key) {
  const bare = key.replace(/^Ex\s+/i, "");
  if (/^Chapter/i.test(bare)) return Number(bare.replace(/\D/g, "")) * 10000;
  return Number(bare.padEnd(6, "0"));
}

/**
 * Some rules are stated once for a run of consecutive headings — 7201 to 7204
 * share a single cell, as do 8407 to 8409. The extractor emits that cell's
 * later lines *after* the intervening heading rows, so those rows come out with
 * no rule at all and one of them carries a stray "(c) 45% ..." limb.
 *
 * Left alone, the site would publish "ferro-alloys: no rule of origin", which is
 * both wrong and the kind of wrong a client acts on. So a row with no rule, or
 * whose rule starts with a continuation limb, is folded back into the run that
 * owns the cell, and every member of the run gets the complete rule.
 */
function mergeSpans(parsed) {
  const groups = [];
  for (const row of parsed) {
    const own = row.rule;
    const isContinuation = !own || CONTINUATION.test(own);
    if (!isContinuation || groups.length === 0) {
      groups.push({ members: [row], parts: own ? [own] : [] });
    } else {
      const group = groups[groups.length - 1];
      group.members.push(row);
      if (own) group.parts.push(own);
    }
  }

  const out = [];
  for (const { members, parts } of groups) {
    const rule = tidy(parts.join(" "));
    if (!rule) throw new Error(`Annex 3A: no rule for ${members.map((m) => m.code).join(", ")}`);
    const shared = members.length > 1 ? members.map((m) => m.code) : undefined;
    for (const member of members) out.push({ ...member, rule, ...(shared ? { sharedWith: shared } : {}) });
  }
  return out;
}

/**
 * One row in the whole annex is emitted on the same physical line as the tail of
 * the rule cell above it: "build-up method 7205 Granules and powders, of pig".
 *
 * Left alone that is not a row at all. Heading 7205 vanishes from the dataset
 * and its description is served to readers as part of heading 7204's rule of
 * origin — which is how the first draft of this parser behaved. Splitting before
 * a mid-line code that introduces a capitalised description recovers it.
 *
 * The guard against "Ex" matters: without it "Ex 8411 Turbo-jets" splits into a
 * stray "Ex" and a row that has lost the very prefix that limits its scope.
 */
function splitInlineKeys(lines) {
  const out = [];
  const split = [];
  for (const line of lines) {
    const m = /^(.+?\S)\s+((?:\d{4}(?:\d{2})?|Chapter\s+\d{1,2})\s+[A-Z].*)$/.exec(line);
    if (m && !/\bEx$/i.test(m[1])) {
      out.push(m[1], m[2]);
      split.push(line);
    } else {
      out.push(line);
    }
  }
  return { lines: out, split };
}

const PSR_KEY = /^((?:Ex\s+)?(?:Chapter\s+\d{1,2}|\d{4}(?:\d{2})?))(?=\s|$)/i;

/**
 * Sections of the Harmonized System, from the WCO nomenclature. The annex
 * prints a SECTION marker only for the three sections that carry a note, so a
 * marker's block runs on through every section after it — Section II's marker
 * is followed by chapters 6 to 27, not 6 to 14. Coverage has to come from the
 * nomenclature; what the document supplies is the check, below, that the
 * chapter following each marker is the one the section is supposed to start at.
 */
const HS_SECTIONS = {
  I: [1, 5], II: [6, 14], III: [15, 15], IV: [16, 24], V: [25, 27],
  VI: [28, 38], VII: [39, 40], VIII: [41, 43], IX: [44, 46], X: [47, 49],
  XI: [50, 63], XII: [64, 67], XIII: [68, 70], XIV: [71, 71], XV: [72, 83],
  XVI: [84, 85], XVII: [86, 89], XVIII: [90, 92], XIX: [93, 93],
  XX: [94, 96], XXI: [97, 97],
};

/**
 * Justified typesetting in the source PDF opens a gap inside three tokens when
 * the text is extracted. They are spacing artifacts, not the drafting. Each is
 * listed rather than repaired by a general rule, because a general rule that
 * closes gaps between digits would also join two numbers that belong apart.
 */
const NOTE_REPAIRS = [
  ["chapter 2 8 through 3 8", "chapter 28 through 38"],
  ["are n ot chemical reactions", "are not chemical reactions"],
  ["“chemical reaction ”", "“chemical reaction”"],
];

function repairNote(text) {
  return NOTE_REPAIRS.reduce((acc, [from, to]) => acc.split(from).join(to), text);
}

/**
 * Three sections of the annex carry a Section Note, and a Section Note beats the
 * product specific rule beneath it — a chemical reaction carried out in India
 * confers origin on a chapter 28 to 38 good whatever the chapter rule says.
 *
 * They are laid out as a SECTION marker, an all-caps section title, then the
 * note, and the extractor emits all of that immediately after the last row of
 * the previous section. So without this the notes are silently appended to the
 * rules for chapters 5, 27 and 38 — three chapters get a rule that is mostly
 * someone else's section note, and the other thirty-odd chapters the notes
 * actually govern never see them.
 *
 * Which chapters a note covers is taken from the chapters that follow it in the
 * document, rather than from a hardcoded table of HS sections. The annex is the
 * evidence for its own structure.
 */
function partitionSections(lines) {
  const segments = [{ section: null, title: [], note: [], lines: [] }];
  let mode = "table";

  for (const line of lines) {
    const marker = /^SECTION\s+([IVXL]+)$/.exec(line);
    if (marker) {
      segments.push({ section: marker[1], title: [], note: [], lines: [] });
      mode = "title";
      continue;
    }
    const segment = segments[segments.length - 1];
    if (mode !== "table") {
      if (PSR_KEY.test(line)) {
        mode = "table";
      } else if (mode === "note" || /^Section Note/.test(line)) {
        mode = "note";
        segment.note.push(line);
        continue;
      } else {
        segment.title.push(line);
        continue;
      }
    }
    segment.lines.push(line);
  }
  return segments;
}

function parsePsr() {
  const raw = textOf(PSR_SRC);
  // Section A is the headnotes; only Section B is the table. The phrase
  // "Section B of this Annex" appears inside the headnotes, so anchor on the
  // standalone heading line rather than the first occurrence of the words.
  const all = raw.split("\n");
  const start = all.findIndex((l) => l.trim() === "Section B");
  if (start < 0) throw new Error("Annex 3A: Section B heading not found");

  const lines = usefulLines(all.slice(start + 1).join("\n"), (l) =>
    /^Annex 3A - \d+$/.test(l) ||
    /^Chapter\/$/.test(l) ||
    /^heading\/ sub-?$/.test(l) ||
    /^heading$/.test(l) ||
    /^\(Column [123]\)$/.test(l) ||
    /^Description$/.test(l) ||
    /^Product Specific Rules? of$/.test(l) ||
    /^Product Specific Rules of Origin$/.test(l) ||
    /^Origin$/.test(l),
  );

  const parsed = [];
  const sectionNotes = [];

  for (const segment of partitionSections(lines)) {
    const { lines: split, split: repaired } = splitInlineKeys(segment.lines);
    for (const line of repaired) console.log(`  Annex 3A: split a merged line — "${line}"`);

    // Column 1 is "Chapter 10", "Ex Chapter 9", "1101", "090112" or "Ex 110320".
    const rows = tableRows(split, PSR_KEY, psrSortKey).map(({ key, text }) => {
      const at = text.search(RULE_OPENER);
      const bare = key.replace(/^Ex\s+/i, "");
      const isChapter = /^Chapter/i.test(bare);
      const code = isChapter ? bare.replace(/^Chapter\s+/i, "").padStart(2, "0") : bare;
      return {
        code,
        level: isChapter ? "chapter" : code.length === 4 ? "heading" : "subheading",
        // "Ex" means the rule reaches only the part of the chapter or heading that
        // Column 2 describes, so the description is operative, not a convenience.
        partial: /^Ex\s/i.test(key),
        description: at < 0 ? text : text.slice(0, at).trim(),
        rule: at < 0 ? "" : text.slice(at).trim(),
      };
    });
    parsed.push(...rows);

    if (!segment.note.length) continue;

    const span = HS_SECTIONS[segment.section];
    if (!span) throw new Error(`Annex 3A: unknown HS section "${segment.section}"`);
    const [first, last] = span;
    // The document's own evidence that the marker is where the nomenclature
    // says it is: the first row after it must open the section's first chapter.
    const opens = Number(rows[0]?.code.slice(0, 2));
    if (opens !== first) {
      throw new Error(
        `Annex 3A: Section ${segment.section} should open at chapter ${first} but the first row after the marker is chapter ${opens}`,
      );
    }
    sectionNotes.push({
      section: segment.section,
      title: tidy(segment.title.join(" ")),
      note: repairNote(tidy(segment.note.join(" "))),
      chapters: Array.from({ length: last - first + 1 }, (_, i) => String(first + i).padStart(2, "0")),
    });
  }

  const rows = mergeSpans(parsed);

  // A note keyed to a chapter the annex never lists would never be shown.
  const present = new Set(rows.map((r) => r.code.slice(0, 2)));
  for (const note of sectionNotes) {
    note.chapters = note.chapters.filter((c) => present.has(c));
  }

  return { rows, sectionNotes };
}

// --------------------------------------------------------------------------

mkdirSync(OUT, { recursive: true });

const tariff = parseTariffSchedule();
const { rows: psr, sectionNotes } = parsePsr();
const trq = parseUkTrq();

// The quota names its own HS codes and the schedule marks its own TRQ rows.
// They are stated in two different documents, so agreeing is evidence both
// parses are right — and disagreeing means one of them is wrong.
const flagged = tariff.filter((r) => r.staging === "TRQ").map((r) => r.code).sort();
if (flagged.join() !== trq.codes.join()) {
  throw new Error(
    `TRQ mismatch — Appendix 2A-b flags [${flagged}] but Annex 2A Section D lists [${trq.codes}]`,
  );
}

const write = (name, payload) => {
  writeFileSync(join(OUT, name), `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`  ${name.padEnd(24)} ${String(payload.rows.length).padStart(5)} rows`);
};

write("ceta-uk-tariff.json", {
  title: "Appendix 2A-b — Schedule of Tariff Commitments of the United Kingdom",
  note: "The United Kingdom's commitments on originating goods of India. Commodity codes are 2022 nomenclature.",
  entryIntoForce: ENTRY_INTO_FORCE,
  source: provenance(TARIFF_SRC),
  staging: STAGING,
  trq: { ...trq, source: provenance(ANNEX2A_SRC) },
  rows: tariff,
});

write("ceta-psr.json", {
  title: "Annex 3A — Product Specific Rules of Origin",
  note: "The rule a good must satisfy to be an originating good. Rules are read most-specific-first: sub-heading, then heading, then chapter. A Section Note, where one exists, sits above all of them.",
  source: provenance(PSR_SRC),
  glossary: RULE_GLOSSARY,
  sectionNotes,
  rows: psr,
});

/**
 * The failure mode that matters here is not a crash — it is a row that parses
 * cleanly and says the wrong thing. Heading 7205 was published inside heading
 * 7204's rule of origin and nothing complained. These are the shapes that
 * mistake takes, checked for explicitly.
 */
function validate() {
  const problems = [];
  const flag = (what) => problems.push(what);

  for (const row of psr) {
    // A code followed by a capitalised word inside a rule means a row below it
    // has been swallowed, which is exactly how 7205 was lost.
    if (/\b\d{4}\s+[A-Z]/.test(row.rule)) flag(`PSR ${row.code}: rule appears to contain another row — "${row.rule.slice(-70)}"`);
    if (row.rule.length > 420) flag(`PSR ${row.code}: rule is ${row.rule.length} chars, suspiciously long`);
    if (!row.description) flag(`PSR ${row.code}: empty description`);
    if (RULE_OPENER.test(row.description)) flag(`PSR ${row.code}: description starts a rule — "${row.description.slice(0, 70)}"`);
  }

  for (const row of tariff) {
    if (!row.description) flag(`Tariff ${row.code}: empty description`);
    if (/(?<=^|\s)(TRQ|A|U)(?=\s|$)/.test(row.description)) flag(`Tariff ${row.code}: staging token left in description`);
    if (/\b\d{4}\.\d{2}\s+[A-Z]/.test(row.description)) flag(`Tariff ${row.code}: description appears to contain another row`);
  }

  const codes = tariff.map((r) => r.code);
  if (new Set(codes).size !== codes.length) flag("Tariff: duplicate commodity codes");

  // A Section Note that ended up in the wrong place is the same class of error
  // as a swallowed row: it parses, it renders, and it is attached to chapters
  // it does not govern.
  for (const note of sectionNotes) {
    if (!/^Section Note/.test(note.note)) flag(`Section ${note.section}: note does not begin "Section Note"`);
    if (!note.title) flag(`Section ${note.section}: no section title captured`);
    if (note.chapters.some((c) => !/^\d{2}$/.test(c))) flag(`Section ${note.section}: bad chapter code in [${note.chapters}]`);
  }

  if (problems.length) {
    console.error(`\n  ${problems.length} problem(s):`);
    for (const p of problems) console.error(`    ${p}`);
    process.exitCode = 1;
  } else {
    console.log("\n  validation: clean");
  }
}

validate();

const tally = (rows, field) =>
  JSON.stringify(rows.reduce((acc, r) => ({ ...acc, [r[field]]: (acc[r[field]] ?? 0) + 1 }), {}));

console.log(`\n  tariff staging split: ${tally(tariff, "staging")}`);
console.log(`  psr levels:           ${tally(psr, "level")}`);

// Rules stated once for a run of headings are the part of this parse most
// likely to be wrong, and the least likely to look wrong. Print them so each
// one can be read back against the annex.
console.log(`\n  ${sectionNotes.length} section notes — check the chapter coverage against Annex 3A:`);
for (const n of sectionNotes) {
  const { chapters } = n;
  console.log(`    Section ${n.section} (${n.title}) — chapters ${chapters[0]}–${chapters[chapters.length - 1]}`);
  console.log(`      ${n.note.slice(0, 200)}`);
}

const spans = [...new Map(psr.filter((r) => r.sharedWith).map((r) => [r.sharedWith.join(","), r])).values()];
console.log(`\n  ${spans.length} shared rule cells — check each against Annex 3A:`);
for (const s of spans) {
  console.log(`    ${s.sharedWith.join(", ")}`);
  console.log(`      ${s.rule.slice(0, 150)}`);
}
