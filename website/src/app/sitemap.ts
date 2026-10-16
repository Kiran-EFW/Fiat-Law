import type { MetadataRoute } from "next";
import { firm } from "@/config/firm";
import { services } from "@/content/services";
import { cetaArticles } from "@/content/ceta";
import { insights } from "@/content/insights";
import { legalNav } from "@/lib/nav";
import { isoDate } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * `lastModified` is set only where the content carries a real date.
 *
 * This previously stamped every URL with the build time, which asserted that
 * the privacy notice and all six practice pages changed on every deploy. Google
 * discounts lastmod across an entire sitemap once it finds the value unreliable,
 * so a blanket build timestamp costs the signal on the dated articles — the
 * pages where it is both true and worth having.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = firm.url.replace(/\/$/, "");

  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    updated?: string,
  ) => {
    const iso = updated ? isoDate(updated) : null;
    return {
      url: `${base}${path}`,
      ...(iso ? { lastModified: new Date(iso) } : {}),
      changeFrequency,
      priority,
    };
  };

  return [
    entry("/", 1, "weekly"),
    entry("/uk-entry-brief", 0.9, "monthly"),
    entry("/services", 0.8, "monthly"),
    ...services.map((s) => entry(`/services/${s.slug}`, 0.8, "monthly" as const)),
    entry("/india-uk", 0.8, "weekly"),
    entry("/india-uk/tariff-lookup", 0.8, "yearly"),
    ...cetaArticles.map((a) => entry(`/india-uk/${a.slug}`, 0.7, "monthly" as const, a.updated)),
    entry("/insights", 0.6, "weekly"),
    ...insights.map((i) => entry(`/insights/${i.slug}`, 0.6, "monthly" as const, i.updated)),
    entry("/about", 0.7, "monthly"),
    entry("/partners", 0.5, "monthly"),
    entry("/contact", 0.7, "monthly"),
    ...legalNav.map((l) => entry(l.href, 0.3, "yearly" as const)),
  ];
}
