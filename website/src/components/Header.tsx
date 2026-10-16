"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoLink } from "@/components/Logo";
import { ArrowRight, cx } from "@/components/ui";
import { primaryNav } from "@/lib/nav";
import { firm } from "@/config/firm";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close both menus on navigation. Adjusted during render rather than in an
  // effect so the new page never paints for a frame with the old menu open —
  // this is React's documented "reset state when a prop changes" pattern.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setOpen(false);
    setOpenMenu(null);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setOpenMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cx(
        "sticky top-0 z-50 border-b bg-bone/92 backdrop-blur-md transition-colors duration-300",
        scrolled ? "border-stone-200" : "border-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-bone"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-[76px] w-full max-w-7xl items-center justify-between gap-6 px-6 sm:px-8 lg:px-12">
        <LogoLink priority />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => {
            const active = isActive(item.href);
            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "px-3.5 py-2 text-[0.8125rem] font-medium tracking-tight transition-colors",
                    active ? "text-crimson-600" : "text-stone-700 hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            }
            const menuOpen = openMenu === item.label;
            return (
              <div key={item.href} className="relative" onMouseEnter={() => { cancelClose(); setOpenMenu(item.label); }} onMouseLeave={scheduleClose}>
                <Link
                  href={item.href}
                  aria-expanded={menuOpen}
                  onFocus={() => { cancelClose(); setOpenMenu(item.label); }}
                  className={cx(
                    "flex items-center gap-1.5 px-3.5 py-2 text-[0.8125rem] font-medium tracking-tight transition-colors",
                    active ? "text-crimson-600" : "text-stone-700 hover:text-ink",
                  )}
                >
                  {item.label}
                  <svg viewBox="0 0 10 6" aria-hidden="true" className={cx("h-1.5 w-2.5 transition-transform duration-200", menuOpen && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 1l4 4 4-4" strokeLinecap="square" />
                  </svg>
                </Link>
                {menuOpen ? (
                  <div
                    className="absolute left-0 top-full w-[26rem] animate-fade border border-stone-200 bg-parchment p-2 shadow-[0_18px_50px_-24px_rgba(11,11,12,0.35)]"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} className="block px-4 py-3 transition-colors hover:bg-crimson-50">
                        <span className="block font-display text-[0.9375rem] text-ink">{child.label}</span>
                        {child.description ? (
                          <span className="mt-0.5 block text-[0.75rem] leading-snug text-stone-500">{child.description}</span>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a href={`tel:${firm.contact.telephone.replace(/\s/g, "")}`} className="text-[0.8125rem] tabular-nums text-stone-600 transition-colors hover:text-ink">
            {firm.contact.telephoneDisplay}
          </a>
          <Link
            href="/uk-entry-brief"
            className="inline-flex items-center gap-2 bg-crimson-600 px-5 py-2.5 text-[0.8125rem] font-medium text-bone transition-colors hover:bg-crimson-700"
          >
            UK Entry Brief
            <ArrowRight />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="-mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg viewBox="0 0 22 14" aria-hidden="true" className="h-3.5 w-5.5" stroke="currentColor" strokeWidth="1.5" fill="none">
            {open ? <path d="M2 1l18 12M20 1L2 13" strokeLinecap="square" /> : <path d="M0 1.5h22M0 12.5h22" strokeLinecap="square" />}
          </svg>
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="animate-fade max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-stone-200 bg-bone lg:hidden">
          <nav aria-label="Mobile" className="px-6 py-6 sm:px-8">
            {primaryNav.map((item) => (
              <div key={item.href} className="border-b border-stone-200 py-4 last:border-0">
                <Link href={item.href} className="font-display text-xl text-ink">
                  {item.label}
                </Link>
                {item.children ? (
                  <div className="mt-3 flex flex-col gap-2.5 pl-4">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} className="text-sm text-stone-600">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <div className="mt-7 flex flex-col gap-3">
              <Link href="/uk-entry-brief" className="inline-flex items-center justify-center gap-2 bg-crimson-600 px-6 py-3.5 text-sm font-medium text-bone">
                Start the UK Entry Brief
                <ArrowRight />
              </Link>
              <a href={`tel:${firm.contact.telephone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center border border-stone-300 px-6 py-3.5 text-sm text-ink">
                {firm.contact.telephoneDisplay}
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
