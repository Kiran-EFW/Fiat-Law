import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container, Section, ArrowRight, Button, GoldRule } from "@/components/ui";
import { Blocks, SourceList } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import { insights, insightBySlug } from "@/content/insights";
import { segmentById } from "@/lib/segments";
import { pageMeta, isoDate } from "@/lib/seo";
import { graph, articleSchema, breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const insight = insightBySlug[slug];
  if (!insight) return {};
  return pageMeta({
    title: insight.title,
    description: insight.metaDescription,
    path: `/insights/${insight.slug}`,
    eyebrow: insight.topic,
    type: "article",
    updated: insight.updated,
  });
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = insightBySlug[slug];
  if (!insight) notFound();

  const others = insights.filter((i) => i.slug !== insight.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        id="ld-article"
        data={graph(
          articleSchema({
            title: insight.title,
            description: insight.metaDescription,
            path: `/insights/${insight.slug}`,
            date: isoDate(insight.updated),
            section: insight.topic,
            readingMinutes: insight.readingMinutes,
            citations: insight.sources,
          }),
          breadcrumbSchema([
            { name: "Insights", path: "/insights" },
            { name: insight.title, path: `/insights/${insight.slug}` },
          ]),
        )}
      />

      <section className="bg-bone">
        <Container width="default">
          <div className="py-16 lg:py-20">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-stone-500 transition-colors hover:text-crimson-600"
            >
              <ArrowRight className="rotate-180" />
              Insights
            </Link>
            <div className="mt-8 flex items-center gap-4">
              <GoldRule />
              <p className="eyebrow">
                {insight.topic} · {insight.updated} · {insight.readingMinutes} min
              </p>
            </div>
            <h1 className="mt-6 max-w-4xl text-display-md sm:text-display-lg">{insight.title}</h1>
            <p className="measure-wide mt-7 text-lg leading-relaxed text-stone-700">{insight.standfirst}</p>
          </div>
        </Container>
      </section>

      <section className="border-t border-stone-200 bg-parchment py-16 lg:py-20">
        <Container width="default">
          <div className="grid gap-14 lg:grid-cols-[1fr_16rem] lg:gap-16">
            <article className="min-w-0">
              <Blocks blocks={insight.blocks} />

              <div className="mt-16 border-t border-stone-300 pt-10">
                <SourceList sources={insight.sources} />
                <p className="mt-8 text-[0.8125rem] leading-relaxed text-stone-500">
                  General information about the law and practice as we understand it at the date shown. Not legal
                  advice, not a substitute for advice on your own facts, and reading it does not create a
                  solicitor&ndash;client relationship.
                </p>
              </div>
            </article>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border-l-2 border-crimson-600 pl-5">
                <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-stone-500">
                  Relevant if you are
                </p>
                <ul className="mt-3 space-y-2.5">
                  {insight.segments.map((id) => (
                    <li key={id}>
                      <Link
                        href={`/uk-entry-brief?segment=${id}`}
                        className="text-[0.9375rem] leading-snug text-stone-600 transition-colors hover:text-crimson-600"
                      >
                        {segmentById[id].name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/uk-entry-brief"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-crimson-600 hover:text-crimson-500"
                >
                  Apply this to your position
                  <ArrowRight />
                </Link>
              </div>

              <div className="mt-10 border-t border-stone-300 pt-7">
                <p className="eyebrow mb-5">More notes</p>
                <ul className="space-y-5">
                  {others.map((other) => (
                    <li key={other.slug}>
                      <Link href={`/insights/${other.slug}`} className="group block">
                        <span className="font-display text-[1.0625rem] leading-snug text-ink transition-colors group-hover:text-crimson-600">
                          {other.title}
                        </span>
                        <span className="mt-1.5 block text-[0.8125rem] uppercase tracking-[0.1em] text-stone-400">
                          {other.topic}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <Section tone="ink">
        <Container width="narrow" className="text-center">
          <h2 className="text-display-sm sm:text-display-md">Where does this leave your position?</h2>
          <p className="measure mx-auto mt-6 text-[1.0625rem] leading-relaxed text-bone/65">
            The UK Entry Brief returns the route, the sequence and the obstacles specific to you — with the capacity
            each piece of work would be delivered in. No figures, no obligation.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button href="/uk-entry-brief" size="lg">
              Start the UK Entry Brief
              <ArrowRight />
            </Button>
            <Button href="/contact" variant="light" size="lg">
              Contact
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
