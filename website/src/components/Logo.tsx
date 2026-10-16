import Image from "next/image";
import Link from "next/link";
import { firm } from "@/config/firm";
import { cx } from "@/components/ui";

/**
 * The existing Fiat Law mark, unchanged. `-light` is the same artwork with the
 * neutral text recoloured to bone for dark surfaces; the crimson arcs are
 * untouched in both.
 */
export function Logo({
  tone = "dark",
  className,
  priority = false,
}: {
  tone?: "dark" | "light";
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={tone === "light" ? "/brand/fiat-law-logo-light.png" : "/brand/fiat-law-logo.png"}
      alt={`${firm.name} — legal services`}
      width={522}
      height={144}
      priority={priority}
      className={cx("h-auto w-auto", className)}
    />
  );
}

export function LogoLink({
  tone = "dark",
  className,
  priority = false,
}: {
  tone?: "dark" | "light";
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link href="/" className={cx("inline-flex items-center", className)} aria-label={`${firm.name} — home`}>
      <Logo tone={tone} priority={priority} className="h-9 w-auto sm:h-10" />
    </Link>
  );
}
