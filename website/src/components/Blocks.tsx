import Link from "next/link";
import type { Block } from "@/content/blocks";
import { ArrowRight } from "@/components/ui";

/**
 * Renders the editorial block union used by the CETA briefing and the insights.
 * Deliberately plain: the typography lives in `.prose-fiat` and in the tokens,
 * not in per-block decoration.
 */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-fiat">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "p":
            return <p key={i}>{block.text}</p>;

          case "h":
            return (
              <h2 key={i} className="!mt-14 !text-[1.75rem] first:!mt-0">
                {block.text}
              </h2>
            );

          case "list":
            return (
              <ul key={i}>
                {block.items.map((item) => (
                  <li key={item.slice(0, 40)}>{item}</li>
                ))}
              </ul>
            );

          case "numbers":
            return (
              <ol key={i}>
                {block.items.map((item) => (
                  <li key={item.slice(0, 40)}>{item}</li>
                ))}
              </ol>
            );

          case "quote":
            return (
              <blockquote key={i}>
                {block.text}
                {block.attribution ? (
                  <footer className="mt-3 text-[0.8125rem] not-italic tracking-wide text-stone-500">
                    {block.attribution}
                  </footer>
                ) : null}
              </blockquote>
            );

          case "callout":
            return (
              <aside key={i} className="my-10 border border-crimson-600/25 bg-crimson-50 p-7">
                <p className="font-display text-lg leading-snug text-crimson-700">{block.title}</p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/80">{block.text}</p>
                {block.link ? (
                  <Link
                    href={block.link.href}
                    className="mt-4 inline-flex items-center gap-2 text-[0.875rem] font-medium text-crimson-700 underline underline-offset-4 hover:text-crimson-600"
                  >
                    {block.link.label}
                    <ArrowRight />
                  </Link>
                ) : null}
              </aside>
            );

          case "table":
            return (
              // tabIndex/role: a horizontally scrolling region has to be
              // reachable and operable by keyboard alone (WCAG 2.1.1).
              <div
                key={i}
                role="region"
                aria-label={block.head.join(", ")}
                tabIndex={0}
                className="my-10 -mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0"
              >
                <table className="w-full min-w-[36rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-ink/25">
                      {block.head.map((cell) => (
                        <th
                          key={cell}
                          scope="col"
                          className="py-3 pr-6 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-stone-500 last:pr-0"
                        >
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row[0]} className="border-b border-stone-200 align-top">
                        {row.map((cell, c) => (
                          <td
                            key={c}
                            className={
                              c === 0
                                ? "py-4 pr-6 font-display text-[1.0625rem] leading-snug text-ink last:pr-0"
                                : "py-4 pr-6 text-[0.9375rem] leading-relaxed text-stone-600 last:pr-0"
                            }
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}

export function SourceList({ sources, className }: { sources: string[]; className?: string }) {
  return (
    <div className={className}>
      <p className="eyebrow mb-5">Sources</p>
      <ol className="space-y-2.5">
        {sources.map((source, i) => (
          <li key={source} className="flex gap-4 text-[0.875rem] leading-relaxed text-stone-600">
            <span className="w-6 shrink-0 font-display text-[0.8125rem] text-crimson-600">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{source}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
