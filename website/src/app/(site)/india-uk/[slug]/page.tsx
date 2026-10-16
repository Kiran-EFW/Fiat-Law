import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container, Section, ArrowRight, Button, GoldRule } from "@/components/ui";
import { Blocks, SourceList } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import { cetaArticles, cetaArticleBySlug } from "@/content/ceta";
import { pageMeta, isoDate } from "@/lib/seo";
import { graph, articleSchema, breadcrumbSchema } from "@/lib/schema";
import { firm } from "@/config/firm";

export function generateStaticParams() {
  return cetaArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = cetaArticleBySlug[slug];
  if (!article) return {};
  return pageMeta({
    title: article.title,
    description: article.metaDescription,
    path: `/india-uk/${article.slug}`,
    eyebrow: "India–UK CETA",
    type: "article",
    updated: article.updated,
  });
}

export default async function CetaArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = cetaArticleBySlug[slug];
  if (!article) notFound();

  const others = cetaArticles.filter((a) => a.slug !== article.slug);

  return (
    <>
      <JsonLd
        id="ld-article"
        data={graph(
          articleSchema({
            title: article.title,
            description: article.metaDescription,
            path: `/india-uk/${article.slug}`,
            date: isoDate(article.updated),
            section: "India–UK CETA",
            readingMinutes: article.readingMinutes,
            citations: article.sources,
          }),
          breadcrumbSchema([
            { name: "India–UK CETA", path: "/india-uk" },
            { name: article.title, path: `/india-uk/${article.slug}` },
          ]),
        )}
      />

      {/* Masthead */}
      <section className="bg-bone">
        <Container width="default">
          <div className="py-16 lg:py-20">
            <Link
              href="/india-uk"
              className="inline-flex items-center gap-2 text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-stone-500 transition-colors hover:text-crimson-600"
            >
              <ArrowRight className="rotate-180" />
              The CETA briefing
            </Link>
            <div className="mt-8 flex items-center gap-4">
              <GoldRule />
              <p className="eyebrow">
                India–UK CETA · Updated {article.updated} · {article.readingMinutes} min
              </p>
            </div>
            <h1 className="mt-6 max-w-4xl text-display-md sm:text-display-lg">{article.title}</h1>
            <p className="measure-wide mt-7 text-lg leading-relaxed text-stone-700">{article.standfirst}</p>
          </div>
        </Container>
      </section>

      {/* Body */}
      <section className="border-t border-stone-200 bg-parchment py-16 lg:py-20">
        <Container width="default">
          <div className="grid gap-14 lg:grid-cols-[1fr_16rem] lg:gap-16">
            <article className="min-w-0">
              <Blocks blocks={article.blocks} />

              <div className="mt-16 border-t border-stone-300 pt-10">
                <SourceList sources={article.sources} />
                <p className="mt-8 text-[0.8125rem] leading-relaxed text-stone-500">
                  This briefing is general information about the law and practice as we understand it at the date shown.
                  It is not legal advice, it is not a substitute for advice on your own facts, and reading it does not
                  create a solicitor–client relationship. Positions change; check the date.
                </p>
              </div>
            </article>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border-l-2 border-crimson-600 pl-5">
                <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-stone-500">
                  Apply this to your position
                </p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone-600">
                  Six questions. You get the route, the sequence and the obstacles specific to you — including the ones
                  on this page that actually bite.
                </p>
                <Link
                  href="/uk-entry-brief"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-crimson-600 hover:text-crimson-500"
                >
                  Start the UK Entry Brief
                  <ArrowRight />
                </Link>
              </div>

              <div className="mt-10 border-t border-stone-300 pt-7">
                <p className="eyebrow mb-5">Also in this briefing</p>
                <ul className="space-y-5">
                  {others.map((other) => (
                    <li key={other.slug}>
                      <Link href={`/india-uk/${other.slug}`} className="group block">
                        <span className="font-display text-[1.0625rem] leading-snug text-ink transition-colors group-hover:text-crimson-600">
                          {other.title}
                        </span>
                        <span className="mt-1.5 block text-[0.8125rem] uppercase tracking-[0.1em] text-stone-400">
                          {other.readingMinutes} min
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

      {/* CTA */}
      <Section tone="ink">
        <Container width="narrow" className="text-center">
          <h2 className="text-display-sm sm:text-display-md">Take the next step with someone accountable for it.</h2>
          <p className="measure mx-auto mt-6 text-[1.0625rem] leading-relaxed text-bone/65">
            {firm.principal.name} — solicitor, admitted {firm.principal.admitted}, SRA {firm.principal.sraNumber} —
            reads every brief personally before the call.
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
