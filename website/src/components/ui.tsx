import Link from "next/link";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* --------------------------------------------------------------- Container */

export function Container({
  children,
  className,
  width = "default",
}: {
  children: ReactNode;
  className?: string;
  width?: "default" | "narrow" | "wide";
}) {
  const widths = {
    narrow: "max-w-3xl",
    default: "max-w-6xl",
    wide: "max-w-7xl",
  };
  return <div className={cx("mx-auto w-full px-6 sm:px-8 lg:px-12", widths[width], className)}>{children}</div>;
}

/* ----------------------------------------------------------------- Section */

export function Section({
  children,
  className,
  tone = "bone",
  id,
  as: As = "section",
}: {
  children: ReactNode;
  className?: string;
  tone?: "bone" | "parchment" | "ink" | "crimson" | "none";
  id?: string;
  as?: ElementType;
}) {
  const tones = {
    bone: "bg-bone text-ink",
    parchment: "bg-parchment text-ink",
    ink: "on-dark bg-ink text-bone",
    crimson: "on-dark bg-crimson-900 text-bone",
    none: "",
  };
  return (
    <As id={id} className={cx("py-20 sm:py-24 lg:py-28", tones[tone], className)}>
      {children}
    </As>
  );
}

/* ----------------------------------------------------------------- Eyebrow */

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx("eyebrow", className)}>{children}</p>;
}

/* -------------------------------------------------------------- SectionHead */

export function SectionHead({
  eyebrow,
  title,
  lede,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cx(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
      <h2 className="text-display-sm sm:text-display-md">{title}</h2>
      {lede ? (
        <p className={cx("mt-5 text-[1.0625rem] leading-relaxed text-stone-600", align === "center" && "mx-auto")}>
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ Button */

type ButtonVariant = "primary" | "secondary" | "ghost" | "light";

const buttonBase =
  "inline-flex items-center justify-center gap-2 font-sans text-sm font-medium tracking-tight " +
  "transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

const buttonSizes = {
  md: "px-6 py-3",
  lg: "px-8 py-4 text-[0.9375rem]",
  sm: "px-4 py-2 text-[0.8125rem]",
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-crimson-600 text-bone hover:bg-crimson-700",
  secondary: "border border-stone-300 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-bone",
  ghost: "text-crimson-600 hover:text-crimson-500 underline underline-offset-4 decoration-1 px-0 py-0",
  light: "border border-bone/35 bg-transparent text-bone hover:bg-bone hover:text-ink",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: {
  href?: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: keyof typeof buttonSizes;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "children" | "className">) {
  const classes = cx(buttonBase, variant !== "ghost" && buttonSizes[size], buttonVariants[variant], className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

/* -------------------------------------------------------------- ArrowRight */

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cx("h-3.5 w-3.5 shrink-0", className)}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 10h13M11 5l5 5-5 5" strokeLinecap="square" />
    </svg>
  );
}

/* -------------------------------------------------------------- GoldRule */

export function GoldRule({ className }: { className?: string }) {
  return <div className={cx("rule-gold", className)} aria-hidden="true" />;
}

/* ------------------------------------------------------------------- Card */

export function Card({
  href,
  children,
  className,
  tone = "light",
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  const classes = cx(
    "group relative flex flex-col border p-7 transition-colors duration-300 sm:p-8",
    tone === "light"
      ? "border-stone-200 bg-parchment hover:border-crimson-600/45"
      : "border-bone/15 bg-white/[0.03] hover:border-gold/50",
    className,
  );
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return <div className={classes}>{children}</div>;
}

/* --------------------------------------------------------------- Statistic */

export function Statistic({ value, label, source }: { value: string; label: string; source?: string }) {
  return (
    <div>
      <p className="font-display text-4xl leading-none tracking-tight sm:text-5xl">{value}</p>
      <p className="mt-3 text-sm leading-snug text-stone-600">{label}</p>
      {source ? <p className="mt-2 text-[0.6875rem] uppercase tracking-wider text-stone-400">{source}</p> : null}
    </div>
  );
}
