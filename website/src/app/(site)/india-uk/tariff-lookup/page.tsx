import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Container, Section, Button, ArrowRight, GoldRule } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { graph, breadcrumbSchema } from "@/lib/schema";
import { EnquiryForm } from "@/components/EnquiryForm";
import { EphemeralLeadNotice } from "@/components/PreviewBanner";
import {
  normaliseCode,
  formatCode,
  lookupTariff,
  lookupPsr,
  sectionNoteFor,
  allSectionNotes,
  glossaryFor,
  tariffByChapter,
  chapterRules,
  stagingInfo,
  ukTrq,
  tariffSource,
  psrSource,
  entryIntoForce,
  tariffRowCount,
  psrRowCount,
  type Staging,
} from "@/lib/ceta";

const PATH = "/india-uk/tariff-lookup";

const TITLE = "CETA tariff and origin lookup";
const DESCRIPTION =
  "Enter a commodity code and read the United Kingdom's actual commitment on it under the India–UK trade agreement — duty-free, quota, or excluded — alongside the rule of origin the goods must satisfy. Quoted from Appendix 2A-b and Annex 3A.";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams;
  const parsed = code ? normaliseCode(code) : null;
  if (!parsed) return pageMeta({ title: TITLE, description: DESCRIPTION, path: PATH, eyebrow: "Tariff tool" });

  const pretty = formatCode(parsed.digits);
  const { matched } = lookupTariff(parsed.digits);
  const verdict = matched ? stagingInfo[matched.staging].label.toLowerCase() : "not listed in the UK schedule";

  // The canonical stays on the bare path. Every commodity code is a variant of
  // one page, not a page of its own, and a few hundred thousand query URLs in
  // the index would be worth nothing to anyone.
  return pageMeta({
    title: `HS ${pretty} — ${verdict}`,
    description: `The United Kingdom's tariff commitment on commodity code ${pretty} for originating goods of India under CETA, and the Annex 3A rule of origin that applies. ${DESCRIPTION}`,
    path: PATH,
    eyebrow: "Tariff lookup",
  });
}

/** Annex 2A Section A(2): year one ends on 31 December of the year of entry
 *  into force, and each later year is a calendar year. */
function agreementYear(now: Date): number {
  return now.getUTCFullYear() - Number(entryIntoForce.slice(0, 4)) + 1;
}

/**
 * Section VI carries two notes — the chemical reaction rule and the mixing and
 * blending rule — printed one after the other, each opening with its own label
 * and, where it has one, a name. The annex sets the name on its own line and
 * the extractor flattens that, so it is recovered here: the named rules all
 * begin their operative text at "Notwithstanding".
 */
function splitSectionNote(note: string): { label: string | null; name: string | null; body: string }[] {
  return note
    .split(/(?=Section Note(?:\s+\d+)?:)/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [, label = null, rest = part] = /^(Section Note(?:\s+\d+)?:)\s*([\s\S]*)$/.exec(part) ?? [];
      const named = /^(.{0,60}?)\s*(Notwithstanding[\s\S]*)$/.exec(rest);
      return named
        ? { label, name: named[1] || null, body: named[2] }
        : { label, name: null, body: rest };
    });
}

const STAGING_TONE: Record<Staging, string> = {
  A: "border-l-emerald-700 bg-emerald-700/[0.04]",
  TRQ: "border-l-gold bg-gold/[0.07]",
  U: "border-l-crimson-600 bg-crimson-600/[0.04]",
};

/* ------------------------------------------------------------------ Result */

function Result({ input }: { input: string }) {
  const parsed = normaliseCode(input);

  if (!parsed) {
    return (
      <Note title="That is not a commodity code.">
        A commodity code is between two and ten digits. Enter at least the two-digit chapter — <Ex code="61" /> for
        knitted apparel, <Ex code="8703" /> for passenger cars, <Ex code="0904" /> for pepper and spices.
      </Note>
    );
  }

  const { digits, trimmed } = parsed;
  const pretty = formatCode(digits);
  const tariff = lookupTariff(digits);
  const psr = lookupPsr(digits);
  const sectionNote = sectionNoteFor(digits);
  const rules = psr.matches.map((m) => m.rule);
  const glossary = glossaryFor(rules);
  const year = agreementYear(new Date());
  const quotaOpen = year >= ukTrq.firstYear;

  return (
    <div className="animate-rise">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h2 className="font-display text-display-sm">{pretty}</h2>
        <span className="text-[0.8125rem] uppercase tracking-[0.12em] text-stone-500">
          Commodity code, HS 2022 nomenclature
        </span>
      </div>
      {trimmed ? (
        <p className="mt-3 text-[0.875rem] leading-relaxed text-stone-500">
          Read to eight digits. Digits beyond the eighth are a national subdivision of the UK tariff and the agreement
          does not reach them.
        </p>
      ) : null}

      {/* ---------------------------------------------------- the commitment */}
      <div className="mt-10">
        <p className="eyebrow mb-4">The United Kingdom&rsquo;s commitment</p>
        {tariff.matched ? (
          <div className={`border border-stone-200 border-l-4 p-7 sm:p-8 ${STAGING_TONE[tariff.matched.staging]}`}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display text-2xl text-ink">{stagingInfo[tariff.matched.staging].label}</span>
              <span className="border border-stone-300 px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-wider text-stone-600">
                Category {tariff.matched.staging}
              </span>
            </div>
            <p className="measure-wide mt-4 text-[0.9375rem] leading-relaxed text-stone-700">
              {stagingInfo[tariff.matched.staging].detail}
            </p>
            <dl className="mt-6 border-t border-stone-300/70 pt-5 text-[0.875rem] leading-relaxed">
              <dt className="text-[0.6875rem] uppercase tracking-[0.12em] text-stone-500">Schedule line</dt>
              <dd className="mt-1.5 text-stone-700">
                <span className="font-mono text-ink">{tariff.matched.code}</span> — {tariff.matched.description}
              </dd>
            </dl>
            {tariff.broader ? (
              <p className="mt-5 border-t border-stone-300/70 pt-5 text-[0.875rem] leading-relaxed text-stone-600">
                The schedule does not list {pretty} itself. This is the commitment on the broader line{" "}
                <span className="font-mono">{tariff.matched.code}</span>, which covers it. That is how the schedule is
                built: a chapter or heading entry governs everything beneath it that is not separately listed.
              </p>
            ) : null}
          </div>
        ) : (
          <Note title="Appendix 2A-b does not list this line.">
            <p>
              Six chapters — meat, dairy, cereals, meat preparations, sugar and vehicles — are scheduled heading by
              heading rather than chapter-wide, so within them a code that is not listed has no commitment attached to
              it at all.
            </p>
            <p className="mt-3">
              This is not the same as an exclusion, and it is not the same as duty-free. It means the answer turns on
              the correct classification of the goods, which is worth getting right before an entry is filed rather
              than after. Send us the code and a description and we will tell you where it lands.
            </p>
          </Note>
        )}
      </div>

      {/* ----------------------------------------------------------- the TRQ */}
      {tariff.matched?.staging === "TRQ" ? (
        <div className="mt-10 border border-gold/45 bg-gold/[0.06] p-7 sm:p-8">
          <p className="eyebrow mb-4">The quota, in full</p>
          <h3 className="font-display text-2xl leading-snug text-ink">{ukTrq.title}</h3>
          <p className="measure-wide mt-4 text-[0.9375rem] font-medium leading-relaxed text-ink">
            {quotaOpen
              ? `The quota is open. This is agreement year ${year}.`
              : `There is no quota yet. This is agreement year ${year}, and the table below begins at year ${ukTrq.firstYear} — ${ukTrq.firstCalendarYear}. Until then an originating electric or hybrid car from India entering the United Kingdom pays the full UK Global Tariff rate, because paragraph 2(c) provides no out-of-quota preference.`}
          </p>

          <div className="mt-7 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-[0.875rem]">
              <caption className="sr-only">
                United Kingdom tariff rate quota for electric, hybrid and hydrogen passenger cars of HS heading 8703,
                in units per year, by CIF value band
              </caption>
              <thead>
                <tr className="border-b border-stone-400 text-left text-[0.6875rem] uppercase tracking-[0.1em] text-stone-600">
                  <th scope="col" className="py-2.5 pr-4 font-medium">Year</th>
                  <th scope="col" className="py-2.5 pr-4 text-right font-medium">Under £20k CIF</th>
                  <th scope="col" className="py-2.5 pr-4 text-right font-medium">£20k–£40k</th>
                  <th scope="col" className="py-2.5 pr-4 text-right font-medium">£40k–£80k</th>
                  <th scope="col" className="py-2.5 pr-4 text-right font-medium">Above £80k</th>
                  <th scope="col" className="py-2.5 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="font-mono text-stone-700">
                {ukTrq.quota.map((row) => (
                  <tr key={row.year} className="border-b border-stone-300/60">
                    <th scope="row" className="py-2.5 pr-4 text-left font-sans font-normal text-ink">
                      {row.openEnded ? `${row.year}+` : row.year}
                      <span className="ml-2 text-stone-500">{row.calendarYear}</span>
                    </th>
                    <td className="py-2.5 pr-4 text-right">{row.bands.under20k.toLocaleString("en-GB")}</td>
                    <td className="py-2.5 pr-4 text-right">{row.bands.from20kTo40k.toLocaleString("en-GB")}</td>
                    <td className="py-2.5 pr-4 text-right">{row.bands.from40kTo80k.toLocaleString("en-GB")}</td>
                    <td className="py-2.5 pr-4 text-right text-crimson-600">Excluded</td>
                    <td className="py-2.5 text-right text-ink">{row.total.toLocaleString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-7 space-y-3 border-t border-gold/40 pt-6 text-[0.875rem] leading-relaxed text-stone-700">
            {ukTrq.notes.map((note) => (
              <li key={note} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.55em] h-px w-3 shrink-0 bg-gold" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* -------------------------------------------------- the origin rule */}
      <div className="mt-12">
        <p className="eyebrow mb-4">The rule of origin</p>
        <p className="measure-wide mb-6 text-[0.9375rem] leading-relaxed text-stone-600">
          A commitment applies only to an <em>originating</em> good. Goods shipped from India are not automatically
          originating in India — they qualify by satisfying the rule below, and by the exporter being able to show it.
        </p>

        {sectionNote ? (
          <div className="mb-6 border-l-2 border-gold bg-bone p-7 sm:p-8">
            <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-stone-500">
              Annex 3A, Section {sectionNote.section} — {sectionNote.title} · chapters{" "}
              {sectionNote.chapters[0]}–{sectionNote.chapters[sectionNote.chapters.length - 1]}
            </p>
            <p className="mt-3 font-display text-xl leading-snug text-ink">
              Read this before the rule below. It overrides it.
            </p>
            {splitSectionNote(sectionNote.note).map(({ label, name, body }) => (
              <div key={body} className="mt-6">
                {label || name ? (
                  <p className="text-[0.8125rem] font-medium uppercase tracking-[0.1em] text-crimson-700">
                    {[label, name].filter(Boolean).join(" ")}
                  </p>
                ) : null}
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-stone-700">{body}</p>
              </div>
            ))}
          </div>
        ) : null}

        {psr.matches.length > 0 ? (
          <div className="space-y-5">
            {psr.matches.map((match) => (
              <div key={`${match.code}-${match.description}`} className="border border-stone-200 bg-parchment p-7 sm:p-8">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.6875rem] uppercase tracking-[0.12em] text-stone-500">
                  <span className="font-mono text-ink">
                    {match.partial ? "Ex " : ""}
                    {match.level === "chapter" ? `Chapter ${match.code}` : match.code}
                  </span>
                  <span>Annex 3A, {match.level}</span>
                </div>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone-700">{match.description}</p>
                <p className="mt-5 border-t border-stone-300 pt-5 font-display text-xl leading-relaxed text-ink">
                  {match.rule}
                </p>
                {match.partial ? (
                  <p className="mt-5 text-[0.875rem] leading-relaxed text-crimson-700">
                    This rule is prefixed <strong>Ex</strong>. It reaches only the part of the {match.level} that the
                    description above covers — so the description is operative, not a convenience. If your goods are
                    not what it describes, this is not your rule.
                  </p>
                ) : null}
                {match.sharedWith ? (
                  <p className="mt-4 text-[0.875rem] leading-relaxed text-stone-600">
                    Annex 3A states this rule once for headings {match.sharedWith.join(", ")} together.
                  </p>
                ) : null}
              </div>
            ))}
            {psr.matches.length > 1 ? (
              <p className="text-[0.875rem] leading-relaxed text-stone-600">
                Annex 3A splits this sub-heading into more than one row, each with its own rule. Which applies depends
                on which description fits the goods.
              </p>
            ) : null}
            {psr.chapter ? (
              <details className="border border-stone-200 bg-bone p-6">
                <summary className="cursor-pointer text-[0.875rem] font-medium text-ink">
                  Chapter {psr.chapter.code} rule, for context
                </summary>
                <p className="mt-4 text-[0.875rem] leading-relaxed text-stone-600">{psr.chapter.description}</p>
                <p className="mt-3 font-display text-lg text-ink">{psr.chapter.rule}</p>
              </details>
            ) : null}
          </div>
        ) : Number(digits.slice(0, 2)) > 97 ? (
          <Note title="That chapter is outside the Harmonized System.">
            The nomenclature runs to chapter 97. Chapters 98 and 99 are reserved for national use, so the agreement is
            not written against them and Annex 3A does not reach them. Check the code on your commercial invoice.
          </Note>
        ) : digits.slice(0, 2) === "77" ? (
          <Note title="Chapter 77 is reserved.">
            The World Customs Organization holds chapter 77 empty for future use. No goods are classified there, so
            there is nothing for Annex 3A to state a rule about.
          </Note>
        ) : (
          <Note title="No rule found for this code.">
            Annex 3A carries a rule for all 96 chapters of the Harmonized System, so this should not happen. Please tell
            us the code you entered.
          </Note>
        )}

        {glossary.length > 0 ? (
          <dl className="mt-8 border-t border-stone-200 pt-7">
            <p className="eyebrow mb-5">What those terms mean</p>
            {glossary.map(([token, meaning]) => (
              <div key={token} className="mt-4 grid gap-1.5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="font-mono text-[0.8125rem] text-crimson-600">{token}</dt>
                <dd className="text-[0.875rem] leading-relaxed text-stone-600">{meaning}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {/* --------------------------------------------------- what this isn't */}
      <div className="mt-12 border-l-2 border-ink/25 pl-6">
        <p className="eyebrow mb-4">Three things this does not tell you</p>
        <ol className="space-y-4 text-[0.9375rem] leading-relaxed text-stone-600">
          <li>
            <strong className="font-medium text-ink">The duty rate.</strong> The schedule records what the United
            Kingdom committed to do — eliminate, quota or exclude. The rate a category A elimination is measured
            against is the UK Global Tariff rate, which is not part of the agreement and is not reproduced here.
          </li>
          <li>
            <strong className="font-medium text-ink">Whether your goods are classified correctly.</strong> Every answer
            above depends entirely on the code being right. Classification is the importer&rsquo;s legal
            responsibility, and it is the single most common point of failure in a preference claim.
          </li>
          <li>
            <strong className="font-medium text-ink">Whether the claim would survive verification.</strong> Meeting the
            rule is one half. The other is the origin declaration, the supporting records and the ability to produce
            them when HMRC asks — sometimes years later.{" "}
            <Link href="/india-uk/rules-of-origin" className="text-crimson-600 underline underline-offset-4">
              We have written about that
            </Link>
            .
          </li>
        </ol>
      </div>

      {/* --------------------------------------------------------------- CTA */}
      <div className="mt-14 border-t border-stone-200 pt-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          <div>
            <GoldRule className="mb-6" />
            <h3 className="text-display-sm">Have this checked against your goods.</h3>
            <p className="measure mt-5 text-[0.9375rem] leading-relaxed text-stone-600">
              The lookup reads the annexes. It does not read your bill of materials, your supplier declarations or your
              classification. Send the code and a description of the goods and we will tell you whether the preference
              is really available and what the file needs to contain to keep it.
            </p>
          </div>
          <div className="border border-stone-200 bg-parchment p-7 sm:p-8">
            <EphemeralLeadNotice className="mb-8" />
            <EnquiryForm
              context={`Tariff lookup: ${pretty}`}
              defaultSubject={`Commodity code ${pretty}${tariff.matched ? ` — category ${tariff.matched.staging}` : ""}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- bits */

function Note({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-stone-300 border-l-4 border-l-ink bg-parchment p-7 sm:p-8">
      <p className="font-display text-xl text-ink">{title}</p>
      <div className="measure-wide mt-4 text-[0.9375rem] leading-relaxed text-stone-600">{children}</div>
    </div>
  );
}

function Ex({ code }: { code: string }) {
  return (
    <Link href={`${PATH}?code=${code}`} className="font-mono text-crimson-600 underline underline-offset-4">
      {code}
    </Link>
  );
}

const EXAMPLES = [
  { code: "8703.80", label: "Electric passenger cars" },
  { code: "6109", label: "T-shirts, knitted" },
  { code: "0904", label: "Pepper and spices" },
  { code: "7113", label: "Jewellery" },
  { code: "3004", label: "Medicaments, retail" },
  { code: "0203.11.10", label: "Swine carcases" },
];

/* ------------------------------------------------------------------- page */

export default async function TariffLookupPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code = "" } = await searchParams;
  const chapters = tariffByChapter();

  return (
    <>
      <JsonLd
        id="ld-tariff-lookup"
        data={graph(
          breadcrumbSchema([
            { name: "India–UK CETA", path: "/india-uk" },
            { name: TITLE, path: PATH },
          ]),
        )}
      />

      <PageHero
        eyebrow="Tariff tool"
        title="What did the United Kingdom actually commit to on your commodity code?"
        lede="Enter a code and read the commitment and the rule of origin, quoted from the two annexes that govern them. Nothing here is generated, estimated or summarised — it is the schedule, looked up."
        aside={
          <div className="border-l-2 border-crimson-600 pl-5">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-stone-500">The data</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone-600">
              {tariffRowCount} lines of Appendix 2A-b and {psrRowCount} rules from Annex 3A, extracted from the treaty
              text laid before Parliament. Both files are named and hashed at the foot of this page.
            </p>
          </div>
        }
      />

      {/* Search */}
      <Section tone="parchment" className="border-y border-stone-200 !py-14">
        <Container width="wide">
          <form method="get" action={PATH} className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="code"
                className="block text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-stone-500"
              >
                Commodity code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                defaultValue={code}
                placeholder="8703.80, 6109, or 0203 11 10"
                className="mt-3 w-full border-0 border-b border-stone-400 bg-transparent pb-3 font-mono text-2xl text-ink placeholder:text-stone-400 focus:border-crimson-600 focus:outline-none"
              />
            </div>
            <Button size="lg" type="submit" className="shrink-0">
              Look it up
              <ArrowRight />
            </Button>
          </form>
          <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-[0.6875rem] uppercase tracking-[0.12em] text-stone-500">Try</span>
            {EXAMPLES.map((example) => (
              <Link
                key={example.code}
                href={`${PATH}?code=${example.code}`}
                className="border border-stone-300 px-3 py-1.5 text-[0.8125rem] text-stone-600 transition-colors hover:border-ink hover:text-ink"
              >
                <span className="font-mono">{example.code}</span>
                <span className="ml-2 text-stone-500">{example.label}</span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Result, or the explanation of the categories */}
      <Section>
        <Container width="wide">
          {code ? (
            <Result input={code} />
          ) : (
            <div>
              <div className="max-w-2xl">
                <p className="eyebrow mb-4">Three answers are possible</p>
                <h2 className="text-display-sm sm:text-display-md">
                  The schedule has one of three things to say about any line.
                </h2>
              </div>
              <div className="mt-12 grid gap-px border border-stone-200 bg-stone-200 md:grid-cols-3">
                {(Object.keys(stagingInfo) as Staging[]).map((key) => (
                  <div key={key} className="bg-parchment p-8">
                    <span className="border border-stone-300 px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-wider text-stone-600">
                      Category {key}
                    </span>
                    <h3 className="mt-5 font-display text-xl leading-snug text-ink">{stagingInfo[key].label}</h3>
                    <p className="mt-4 text-[0.9375rem] leading-relaxed text-stone-600">{stagingInfo[key].detail}</p>
                  </div>
                ))}
              </div>
              <p className="measure-wide mt-10 text-[0.9375rem] leading-relaxed text-stone-600">
                Of the {tariffRowCount} lines the United Kingdom scheduled, {chapters.length} chapters carry a
                chapter-wide commitment and six — meat, dairy, cereals, meat preparations, sugar and vehicles — are
                scheduled heading by heading. Only one tariff rate quota exists on the UK side, and it does not open
                until {ukTrq.firstCalendarYear}.
              </p>
            </div>
          )}
        </Container>
      </Section>

      {/* Browse the schedule */}
      <Section tone="parchment" className="border-t border-stone-200">
        <Container width="wide">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">The schedule in full</p>
            <h2 className="text-display-sm sm:text-display-md">Appendix 2A-b, all {tariffRowCount} lines.</h2>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-stone-600">
              Grouped by chapter. Every line is reproduced as it appears in the schedule laid before Parliament.
            </p>
          </div>
          <div className="mt-12 border-t border-stone-300">
            {chapters.map((group) => (
              <details key={group.chapter} className="group border-b border-stone-300">
                <summary className="flex cursor-pointer items-baseline gap-4 py-4 hover:text-crimson-600">
                  <span className="font-mono text-[0.8125rem] text-crimson-600">{group.chapter}</span>
                  <span className="flex-1 text-[0.9375rem] leading-snug text-ink">{group.title}</span>
                  <span className="shrink-0 text-[0.6875rem] uppercase tracking-[0.1em] text-stone-500">
                    {group.rows.length} {group.rows.length === 1 ? "line" : "lines"}
                  </span>
                </summary>
                <ul className="pb-6">
                  {group.rows.map((row) => (
                    <li
                      key={row.code}
                      className="grid gap-x-5 gap-y-1 border-t border-stone-200 py-3 sm:grid-cols-[7rem_1fr_5rem]"
                    >
                      <Link
                        href={`${PATH}?code=${row.code}`}
                        className="font-mono text-[0.8125rem] text-crimson-600 hover:underline"
                      >
                        {row.code}
                      </Link>
                      <span className="text-[0.875rem] leading-relaxed text-stone-600">{row.description}</span>
                      <span className="text-[0.75rem] uppercase tracking-[0.1em] text-stone-500 sm:text-right">
                        {row.staging === "A" ? "Duty-free" : row.staging === "TRQ" ? "Quota" : "Excluded"}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* Chapter origin rules */}
      <Section>
        <Container width="wide">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">Rules of origin</p>
            <h2 className="text-display-sm sm:text-display-md">The chapter rule, for all 96 chapters.</h2>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-stone-600">
              Annex 3A states a rule for every chapter and then overrides it for particular headings and sub-headings.
              Look up a specific code above to see whether an override applies to it.
            </p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-stone-600">
              Three sections carry a Section Note, which sits above every rule beneath it. Chapters they govern are
              marked <span className="text-gold">§</span> below.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {allSectionNotes.map((note) => (
              <details key={note.section} className="border border-stone-200 bg-parchment p-6">
                <summary className="cursor-pointer text-[0.875rem] font-medium text-ink">
                  <span className="text-gold">§</span> Section {note.section} — {note.title} · chapters{" "}
                  {note.chapters[0]}–{note.chapters[note.chapters.length - 1]}
                </summary>
                {splitSectionNote(note.note).map(({ label, name, body }) => (
                  <div key={body} className="mt-4">
                    {label || name ? (
                      <p className="text-[0.75rem] font-medium uppercase tracking-[0.1em] text-crimson-700">
                        {[label, name].filter(Boolean).join(" ")}
                      </p>
                    ) : null}
                    <p className="mt-1.5 text-[0.875rem] leading-relaxed text-stone-600">{body}</p>
                  </div>
                ))}
              </details>
            ))}
          </div>

          <div className="mt-12 grid gap-x-12 gap-y-0 md:grid-cols-2">
            {chapterRules.map((rule) => (
              <div key={rule.code} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-stone-200 py-3.5">
                <Link
                  href={`${PATH}?code=${rule.code}`}
                  className="font-mono text-[0.8125rem] text-crimson-600 hover:underline"
                >
                  {rule.code}
                </Link>
                <div>
                  <p className="text-[0.875rem] leading-snug text-stone-600">
                    {rule.partial ? <span className="text-stone-400">Ex — </span> : null}
                    {rule.description}
                  </p>
                  <p className="mt-1 font-mono text-[0.75rem] text-ink">
                    {rule.rule}
                    {sectionNoteFor(rule.code) ? <span className="ml-2 text-gold">§</span> : null}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Sources */}
      <Section tone="ink" className="!py-16">
        <Container width="wide">
          <p className="eyebrow mb-6">Where this comes from</p>
          <div className="grid gap-8 md:grid-cols-2">
            {[tariffSource, psrSource].map((source) => (
              <div key={source.file} className="border-t border-bone/20 pt-6">
                <p className="text-[0.9375rem] leading-relaxed text-bone">{source.file.split("/").pop()}</p>
                <a
                  href={source.url}
                  className="mt-2 inline-block break-all text-[0.8125rem] text-gold underline underline-offset-4"
                  rel="noreferrer"
                >
                  {source.url}
                </a>
                <dl className="mt-4 space-y-1 text-[0.75rem] text-bone/50">
                  <div className="flex gap-2">
                    <dt>Retrieved</dt>
                    <dd className="text-bone/70">{source.retrieved}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt>SHA-256</dt>
                    <dd className="break-all font-mono text-bone/70">{source.sha256}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
          <p className="measure-wide mt-10 text-[0.875rem] leading-relaxed text-bone/60">
            The agreement entered into force on 15 July 2026. This tool reproduces the schedules as laid; it is general
            information about the agreement, not advice on a shipment, and no solicitor–client relationship arises from
            using it.
          </p>
        </Container>
      </Section>
    </>
  );
}
