import Link from "next/link";
import { LogoLink } from "@/components/Logo";
import { Container, ArrowRight } from "@/components/ui";
import { primaryNav } from "@/lib/nav";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * Lives at the root rather than inside the (site) group so that it also
 * catches URLs that match no route at all. It therefore carries its own
 * lightweight chrome.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-bone">
      <header className="border-b border-stone-200">
        <Container width="wide">
          <div className="flex h-[76px] items-center">
            <LogoLink />
          </div>
        </Container>
      </header>

      <main id="main" className="flex flex-1 items-center py-20">
        <Container width="wide">
          <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
            <div>
              <p className="eyebrow mb-5">404</p>
              <h1 className="text-display-md sm:text-display-lg">
                That page is not here. Everything else still is.
              </h1>
              <p className="measure mt-7 text-lg leading-relaxed text-stone-700">
                The address may have changed, or the link that brought you here may be out of date. If you were looking
                for something specific, the quickest route is the brief. It will point you at the right part of the
                practice in a few minutes.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/uk-entry-brief"
                  className="inline-flex items-center gap-2 bg-crimson-600 px-8 py-4 text-[0.9375rem] font-medium text-bone transition-colors hover:bg-crimson-700"
                >
                  Start the UK Entry Brief
                  <ArrowRight />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 border border-stone-300 px-8 py-4 text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bone"
                >
                  Back to the homepage
                </Link>
              </div>
            </div>

            <nav aria-label="Site sections" className="border-t border-stone-300 pt-7 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              <p className="eyebrow mb-5">Where you might have been going</p>
              <ul className="space-y-3.5">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-display text-xl leading-snug text-ink transition-colors hover:text-crimson-600"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Container>
      </main>
    </div>
  );
}
