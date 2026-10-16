import { Container, Eyebrow, GoldRule } from "@/components/ui";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  lede,
  aside,
  tone = "bone",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  aside?: ReactNode;
  tone?: "bone" | "ink";
}) {
  const dark = tone === "ink";
  return (
    <section className={dark ? "on-dark bg-ink text-bone" : "bg-bone text-ink"}>
      <Container width="wide">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr] lg:gap-20 lg:py-24">
          <div className="animate-rise">
            {eyebrow ? (
              <div className="mb-6 flex items-center gap-4">
                <GoldRule />
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>
            ) : null}
            <h1 className="text-display-md sm:text-display-lg">{title}</h1>
            {lede ? (
              <p className={`measure-wide mt-7 text-lg leading-relaxed ${dark ? "text-bone/65" : "text-stone-700"}`}>
                {lede}
              </p>
            ) : null}
          </div>
          {aside ? <div className="animate-fade self-end">{aside}</div> : null}
        </div>
      </Container>
    </section>
  );
}
