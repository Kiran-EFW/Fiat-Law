"use client";

import Link from "next/link";
import { firm } from "@/config/firm";
import { shortCapacity } from "@/lib/brief/engine";
import { segmentById } from "@/lib/segments";
import type { BriefAnswers, Recommendation } from "@/lib/brief/types";
import { ArrowRight, GoldRule } from "@/components/ui";

export function BriefResult({
  answers,
  recommendation,
  reference,
  submitted,
}: {
  answers: BriefAnswers;
  recommendation: Recommendation;
  reference?: string | null;
  submitted: boolean;
}) {
  const segment = answers.segment ? segmentById[answers.segment] : undefined;
  const name = answers.contact?.name?.split(" ")[0];

  return (
    <article className="animate-rise">
      {/* Masthead */}
      <header className="border-b border-stone-300 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <GoldRule />
            <p className="eyebrow">UK Entry Brief</p>
          </div>
          {reference ? (
            <p className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-stone-400">Ref {reference}</p>
          ) : null}
        </div>
        <h1 className="mt-6 text-display-sm sm:text-display-md">
          {name ? `${name}, ` : ""}
          {recommendation.headline}
        </h1>
        {segment ? (
          <p className="mt-5 text-sm text-stone-500">
            Prepared for a {segment.name.toLowerCase()} position ({segment.code}) ·{" "}
            {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        ) : null}
      </header>

      {submitted ? (
        <div className="mt-8 border-l-2 border-crimson-600 bg-crimson-50 px-6 py-5">
          <p className="text-[0.9375rem] leading-relaxed text-ink">
            <strong className="font-medium">Received.</strong> Janeevan will read this himself and come back to you
            within one working day with a written proposal priced to the scope below. If it is urgent, call{" "}
            <a href={`tel:${firm.contact.telephone.replace(/\s/g, "")}`} className="underline underline-offset-4">
              {firm.contact.telephoneDisplay}
            </a>
            .
          </p>
        </div>
      ) : null}

      {/* 1 · Position */}
      <BriefSection number="01" title="Your position, as we understand it">
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {recommendation.position.map((line) => (
            <li key={line} className="flex gap-3 text-[0.9375rem] leading-relaxed text-stone-700">
              <span className="mt-2.5 h-px w-3 shrink-0 bg-crimson-600" aria-hidden="true" />
              {line}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[0.8125rem] text-stone-500">
          If any of that is wrong, tell us — the rest of this brief follows from it.
        </p>
      </BriefSection>

      {/* 2 · Route */}
      <BriefSection number="02" title="The route we would take">
        <h3 className="font-display text-2xl leading-snug text-ink">{recommendation.route.name}</h3>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-stone-700">{recommendation.route.why}</p>
        {recommendation.route.alternatives ? (
          <div className="mt-6 border-l-2 border-stone-300 pl-5">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-stone-500">The alternative</p>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-stone-600">{recommendation.route.alternatives}</p>
          </div>
        ) : null}
      </BriefSection>

      {/* 3 · Sequence */}
      <BriefSection number="03" title="The sequence, in order, with realistic elapsed time">
        <ol className="mt-2">
          {recommendation.sequence.map((step, i) => (
            <li
              key={step.title}
              className="grid gap-4 border-t border-stone-200 py-6 sm:grid-cols-[3rem_1fr_11rem] sm:gap-6"
            >
              <span className="font-display text-lg italic text-crimson-600">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-xl leading-snug text-ink">
                  {step.title}
                  {step.criticalPath ? (
                    <span className="ml-3 inline-block translate-y-[-2px] bg-crimson-600 px-2 py-0.5 align-middle font-sans text-[0.625rem] font-medium uppercase tracking-[0.12em] text-bone">
                      Critical path
                    </span>
                  ) : null}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-stone-600">{step.detail}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-[0.8125rem] font-medium leading-snug text-ink">{step.elapsed}</p>
                <p className="mt-1 text-[0.75rem] leading-snug text-stone-500">{shortCapacity[step.capacity]}</p>
              </div>
            </li>
          ))}
        </ol>
      </BriefSection>

      {/* 4 · Obstacles */}
      <BriefSection number="04" title="What your position will run into">
        <p className="measure-wide text-[0.9375rem] leading-relaxed text-stone-600">
          These are specific to the answers you gave. Each names its source so you can check it against the instrument
          rather than against us.
        </p>
        <div className="mt-8 grid gap-px bg-stone-200">
          {recommendation.obstacles.map((obstacle) => (
            <div key={obstacle.title} className="bg-parchment p-6 sm:p-7">
              <h3 className="font-display text-xl leading-snug text-ink">{obstacle.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone-600">{obstacle.body}</p>
              <p className="mt-4 text-[0.6875rem] uppercase tracking-[0.12em] text-stone-400">{obstacle.source}</p>
            </div>
          ))}
        </div>
      </BriefSection>

      {/* 5 · Scope */}
      <BriefSection number="05" title="What we would do, and in which capacity">
        <div className="grid gap-8 sm:grid-cols-2">
          {recommendation.scope.map((line) => (
            <div key={line.slug + line.service} className="border-t border-stone-300 pt-5">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl leading-snug text-ink">{line.service}</h3>
                <Link href={`/services/${line.slug}`} className="shrink-0 text-[0.75rem] text-crimson-600 hover:text-crimson-500">
                  Detail
                </Link>
              </div>
              <p className="mt-1.5 text-[0.75rem] uppercase tracking-[0.12em] text-stone-400">
                {shortCapacity[line.capacity]}
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {line.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.9375rem] leading-snug text-stone-600">
                    <span className="mt-2.5 h-px w-3 shrink-0 bg-crimson-600" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border border-stone-300 bg-bone p-6 sm:p-7">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-stone-500">On capacity</p>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone-600">
            <strong className="font-medium text-ink">{firm.name}</strong> means {firm.legalName} (company{" "}
            {firm.companyNumber}), providing corporate services and business advisory. It is not a firm authorised by the
            Solicitors Regulation Authority.{" "}
            <strong className="font-medium text-ink">{firm.principal.name}, solicitor</strong> means work carried out by
            him (SRA {firm.principal.sraNumber}) through {firm.regulatedFirm.legalName} (SRA{" "}
            {firm.regulatedFirm.sraNumber}), an SRA-authorised firm.{" "}
            <strong className="font-medium text-ink">Coordinated</strong> means scoped and project-managed by us and
            delivered by named, independently regulated partner firms — you are told who before it starts.
          </p>
        </div>
      </BriefSection>

      {/* 6 · Candour */}
      {recommendation.candour ? (
        <BriefSection number="06" title="Where we would tell you not to instruct us">
          <blockquote className="border-l-2 border-crimson-600 pl-6 font-display text-xl leading-relaxed text-ink">
            {recommendation.candour}
          </blockquote>
        </BriefSection>
      ) : null}

      {/* 7 · What we need */}
      <BriefSection number={recommendation.candour ? "07" : "06"} title="What we would need from you">
        <ol className="grid gap-3 sm:grid-cols-2">
          {recommendation.needFromYou.map((item, i) => (
            <li key={item} className="flex gap-4 text-[0.9375rem] leading-relaxed text-stone-700">
              <span className="font-sans text-[0.75rem] tabular-nums text-crimson-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item}
            </li>
          ))}
        </ol>
      </BriefSection>

      {/* Fees */}
      <section className="mt-16 border-t border-stone-300 pt-10">
        <h2 className="font-display text-2xl text-ink">On fees</h2>
        <p className="measure-wide mt-4 text-[1.0625rem] leading-relaxed text-stone-700">
          We do not publish figures, because there is no standard matter and a published number would either be a
          commodity price that tells you nothing or an invented one designed to be beaten on the call. What you get
          instead is a written proposal, priced to exactly the scope above, within two working days — fixed wherever the
          scope can be fixed, and at an agreed rate where it genuinely cannot. Nothing starts until you have approved
          the figure in writing.
        </p>
      </section>

      {/* Actions */}
      <div className="mt-10 flex flex-col gap-4 border-t border-stone-300 pt-10 sm:flex-row sm:items-center print:hidden">
        {submitted ? (
          <>
            <a
              href={`mailto:${firm.contact.email}?subject=${encodeURIComponent(`UK Entry Brief${reference ? ` ${reference}` : ""}`)}`}
              className="inline-flex items-center justify-center gap-2.5 bg-crimson-600 px-8 py-4 text-[0.9375rem] font-medium text-bone transition-colors hover:bg-crimson-700"
            >
              Add something we should know
              <ArrowRight className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center border border-stone-300 px-8 py-4 text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink"
            >
              Save as PDF
            </button>
          </>
        ) : null}
      </div>

      <p className="mt-10 text-[0.75rem] leading-relaxed text-stone-500">
        This brief is general information prepared from the answers you gave. It is not legal advice, immigration advice,
        tax advice or investment advice, and no solicitor–client relationship arises from it. Advice is given only under
        a written engagement, in the capacity that engagement identifies. Sources are current as at{" "}
        {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}.
      </p>
    </article>
  );
}

function BriefSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14 border-t border-stone-300 pt-10 first-of-type:mt-12">
      <div className="flex items-baseline gap-4">
        <span className="font-sans text-[0.6875rem] tabular-nums tracking-[0.14em] text-crimson-600">{number}</span>
        <h2 className="text-display-sm">{title}</h2>
      </div>
      <div className="mt-7">{children}</div>
    </section>
  );
}
