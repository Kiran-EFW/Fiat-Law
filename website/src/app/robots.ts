import type { MetadataRoute } from "next";
import { firm } from "@/config/firm";
import { isPreview } from "@/config/deployment";

/**
 * Generated rather than served from public/robots.txt, so the sitemap URL comes
 * from the same constant as every other absolute URL on the site and cannot go
 * stale if the domain changes.
 *
 * /og is deliberately allowed. It sits outside /api precisely because the
 * LinkedIn, Facebook and Slack crawlers honour robots.txt, and a disallowed
 * og:image is a blank share card.
 */
export default function robots(): MetadataRoute.Robots {
  const base = firm.url.replace(/\/$/, "");

  // A preview build is a copy of the whole site on a hostname that is not the
  // firm's. Indexed, it competes with fiatlaw.co.uk for its own content. No
  // sitemap is advertised either — a sitemap is an invitation to crawl, and
  // pointing at one while disallowing everything is a contradiction crawlers
  // resolve in whichever direction they prefer.
  if (isPreview) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/og"],
        // /admin holds enquiry records: names, companies and what each person
        // said about their business. /api is machine surface with nothing to
        // index. Neither is a security control — both are access-controlled —
        // but there is no reason for either to be crawled.
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
