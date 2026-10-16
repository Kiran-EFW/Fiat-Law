import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container, Section, ArrowRight } from "@/components/ui";
import { CapacityNotice } from "@/components/CapacityNotice";
import { JsonLd } from "@/components/JsonLd";
import { services, serviceBySlug } from "@/content/services";
import { segmentById } from "@/lib/segments";
import { pageMeta } from "@/lib/seo";
import { graph, serviceSchema, breadcrumbSchema } from "@/lib/schema";
import { firm } from "@/config/firm";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug[slug];
  if (!service) return {};
  return pageMeta({
    title: service.name,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
    eyebrow: `Practice ${service.index}`,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = serviceBySlug[slug];
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const visibleWork = service.work.filter(
    (item) => !item.requires || firm.capabilities[item.requires] === true,
  );
  const gatedCount = service.work.length - visibleWork.length;

  return (
    <>
      {/* The catalogue lists only the work that is visible on the page, so a
          capability the firm is not yet registered for cannot be advertised in
          the markup after it has been correctly hidden from the reader. */}
      <JsonLd
        id="ld-service"
        data={graph(
          serviceSchema({
            name: service.name,
            description: service.metaDescription,
            path: `/services/${service.slug}`,
            serviceType: service.strapline,
            offers: visibleWork.map((item) => item.title),
          }),
          breadcrumbSchema([
            { name: "Services", path: "/services" },
            { name: service.name, path: `/services/${service.slug}` },
          ]),
        )}
      />
      <PageHero
        eyebrow={`Practice ${service.index}`}
        title={service.name}
        lede={service.strapline}
        aside={<CapacityNotice capacity={service.capacity} />}
      />

      {/* The problem, in their words */}
      <section className="border-y border-stone-200 bg-parchment">
        <Container width="wide">
          <div className="py-14">
            <p className="eyebrow mb-5">What clients say</p>
            <p className="max-w-4xl font-display text-display-sm leading-tight text-ink">
              &ldquo;{service.problem}&rdquo;
            </p>
          </div>
        </Container>
      </section>

      {/* Reality */}
      <Section>
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:gap-20">
            <div>
              <h2 className="text-display-sm">What actually happens</h2>
            </div>
            <div className="prose-fiat">
              {service.reality.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Traps */}
      <Section tone="ink">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:gap-20">
            <div>
              <h2 className="text-display-sm">The specific traps</h2>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-bone/55">
                Each of these costs somebody money every week. They are here because knowing them in advance is free and
                discovering them afterwards is not.
              </p>
            </div>
            <div className="grid gap-px bg-bone/10">
              {service.traps.map((trap) => (
                <div key={trap.title} className="bg-ink py-7 first:pt-0 last:pb-0">
                  <h3 className="font-display text-xl leading-snug text-bone">{trap.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-bone/60">{trap.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* What we do */}
      <Section tone="parchment">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:gap-20">
            <div>
              <h2 className="text-display-sm">What we do</h2>
              <CapacityNotice capacity={service.capacity} className="mt-7" />
            </div>
            <div>
              <div className="grid gap-px border border-stone-200 bg-stone-200 sm:grid-cols-2">
                {visibleWork.map((item) => (
                  <div key={item.title} className="bg-bone p-7">
                    <h3 className="font-display text-lg leading-snug text-ink">{item.title}</h3>
                    <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-stone-600">{item.body}</p>
                  </div>
                ))}
              </div>
              {gatedCount > 0 ? (
                <p className="mt-6 border-l-2 border-stone-300 pl-5 text-[0.8125rem] leading-relaxed text-stone-500">
                  Some services in this area are regulated activities that we do not offer until the corresponding
                  registration is confirmed, namely trust or company service provider supervision under the Money Laundering
                  Regulations 2017, or Authorised Corporate Service Provider registration at Companies House. We would
                  rather show you nothing than offer something we cannot yet lawfully provide.{" "}
                  <Link href="/contact" className="underline underline-offset-4 hover:text-ink">
                    Ask us where that stands
                  </Link>
                  .
                </p>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>

      {/* Who this is for */}
      <Section>
        <Container width="wide">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow mb-4">Who this is for</p>
              <h2 className="text-display-sm">
                {service.segments.length === 1 ? "One position in particular." : "Positions this normally applies to."}
              </h2>
            </div>
            <Link href="/uk-entry-brief" className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-crimson-600 hover:text-crimson-500">
              Find out where you sit
              <ArrowRight />
            </Link>
          </div>

          <div className="mt-10 grid gap-px border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-4">
            {service.segments.map((id) => {
              const segment = segmentById[id];
              return (
                <Link
                  key={id}
                  href={`/uk-entry-brief?segment=${id}`}
                  className="group bg-parchment p-7 transition-colors hover:bg-bone"
                >
                  <span className="font-sans text-[0.6875rem] tracking-[0.16em] text-crimson-600">{segment.code}</span>
                  <h3 className="mt-3 font-display text-xl leading-snug text-ink">{segment.name}</h3>
                  <p className="mt-3 text-[0.875rem] leading-relaxed text-stone-600">{segment.summary}</p>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Next */}
      <Section tone="parchment" className="border-t border-stone-200">
        <Container width="wide">
          <p className="eyebrow mb-8">Related practice</p>
          <div className="grid gap-px border border-stone-200 bg-stone-200 sm:grid-cols-3">
            {others.map((other) => (
              <Link key={other.slug} href={`/services/${other.slug}`} className="group bg-bone p-7 transition-colors hover:bg-parchment">
                <span className="font-display text-sm italic text-crimson-600">{other.index}</span>
                <h3 className="mt-3 font-display text-xl leading-snug text-ink">{other.name}</h3>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-stone-600">{other.strapline}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-crimson-600">
                  Read
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
