import { services } from "@/content/services";

export interface NavLink {
  href: string;
  label: string;
  description?: string;
}

export const primaryNav: { label: string; href: string; children?: NavLink[] }[] = [
  {
    label: "Services",
    href: "/services",
    children: services.map((s) => ({
      href: `/services/${s.slug}`,
      label: s.name,
      description: s.strapline,
    })),
  },
  {
    label: "India–UK",
    href: "/india-uk",
    children: [
      { href: "/india-uk", label: "The CETA briefing", description: "What entered into force on 15 July 2026, and what did not" },
      { href: "/india-uk/mobility", label: "Mobility & the DCC", description: "Routes, thresholds and the 60-month convention" },
      { href: "/india-uk/rules-of-origin", label: "Rules of origin", description: "Claiming preference, and making the claim survive verification" },
      { href: "/india-uk/sectors", label: "Sector by sector", description: "Where the corridor is actually moving" },
      { href: "/india-uk/tariff-lookup", label: "Tariff & origin lookup", description: "Your commodity code, against the schedule and Annex 3A" },
    ],
  },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
];

export const legalNav: NavLink[] = [
  { href: "/legal/regulatory", label: "Regulatory information" },
  { href: "/legal/complaints", label: "Complaints" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/cookies", label: "Cookies" },
  { href: "/legal/terms", label: "Terms of use" },
];
