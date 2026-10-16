import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Container, Section, ArrowRight } from "@/components/ui";
import { insights } from "@/content/insights";
import { cetaArticles } from "@/content/ceta";

export const metadata = pageMeta({
  title: "Insights",
  description:
    "Notes on UK company law, business immigration, compliance and transactions for Indian businesses entering the United Kingdom, written from primary sources and dated.",
  path: "/insights",
  eyebrow: "Insights",
});

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Notes from the corridor, with the sources attached."
        lede="We publish the things clients get wrong most often and the things published commentary gets wrong most often. There is a fair amount of overlap. Each note names the statute, rule or guidance paragraph it rests on, and carries the date it was checked."
        aside={
          <div className="border-l-2 border-crimson-600 pl-5">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-stone-500">A word on dates</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone-600">
              Thresholds and charges in this area move at least annually. Anything here is our understanding at the date
              shown on the note, and is general information rather than advice on your facts.
            </p>
          </div>
        }
      />

      {/* Notes */}
      <Section tone="parchment" className="border-t border-stone-200">
        <Container width="wide">
          <div className="flex flex-col">
            {insights.map((insight) => (
              <article key={insight.slug} className="grid gap-6 border-t border-stone-300 py-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
                <div>
                  <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-crimson-600">
                    {insight.topic}
                  </p>
                  <p className="mt-3 text-[0.8125rem] uppercase tracking-[0.1em] text-stone-400">
                    {insight.updated} · {insight.readingMinutes} min
                  </p>
                </div>
                <div>
                  <h2 className="text-display-sm">
                    <Link href={`/insights/${insight.slug}`} className="transition-colors hover:text-crimson-600">
                      {insight.title}
                    </Link>
                  </h2>
                  <p className="measure-wide mt-5 text-[1.0625rem] leading-relaxed text-stone-700">
                    {insight.standfirst}
                  </p>
                  <Link
                    href={`/insights/${insight.slug}`}
                    className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-crimson-600 hover:text-crimson-500"
                  >
                    Read the note
                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* CETA briefing cross-link */}
      <Section tone="ink">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:gap-20">
            <div>
              <p className="eyebrow mb-5">Also published</p>
              <h2 className="text-display-sm">The India–UK CETA briefing.</h2>
              <p className="mt-6 text-[0.9375rem] leading-relaxed text-bone/60">
                A longer, three-part working note on the agreement in force since 15 July 2026, covering what changed, what
                did not, and the provisions that are widely reported the wrong way round.
              </p>
              <Link
                href="/india-uk"
                className="mt-8 inline-flex items-center gap-2 border border-bone/35 px-7 py-3.5 text-sm font-medium text-bone transition-colors hover:bg-bone hover:text-ink"
              >
                Open the briefing
                <ArrowRight />
              </Link>
            </div>
            <div className="grid gap-px bg-bone/10">
              {cetaArticles.map((article) => (
                <Link key={article.slug} href={`/india-uk/${article.slug}`} className="group bg-ink py-7 first:pt-0 last:pb-0">
                  <h3 className="font-display text-xl leading-snug text-bone transition-colors group-hover:text-gold-soft">
                    {article.title}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-bone/55">{article.standfirst}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
