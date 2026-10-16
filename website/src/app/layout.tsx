import type { Metadata, Viewport } from "next";
import { Newsreader, Inter } from "next/font/google";
import "./globals.css";
import { firm } from "@/config/firm";
import { ogImageUrl, OG_SIZE } from "@/lib/seo";
import { isPreview } from "@/config/deployment";
import { PreviewBanner } from "@/components/PreviewBanner";

const SOCIAL_DESCRIPTION =
  "Entity, immigration and compliance handled as one instruction, for Indian businesses entering the United Kingdom.";

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(firm.url),
  title: {
    default: `${firm.name} — ${firm.tagline}`,
    template: `%s — ${firm.name}`,
  },
  description:
    "Fiat Law is the UK entry practice for Indian businesses. Entity, immigration and compliance handled as one instruction — incorporation, sponsor licences, corporate and commercial law, accounting and acquisitions.",
  keywords: [
    "UK company formation for Indian businesses",
    "UK Expansion Worker visa",
    "sponsor licence India",
    "India UK trade agreement CETA",
    "Indian company UK subsidiary",
    "ECCTA identity verification",
  ],
  authors: [{ name: firm.principal.name }],
  creator: firm.principal.name,
  publisher: firm.legalName,
  // The fallback card, for anything that does not build its own with pageMeta()
  // — 404s, and any page added later before its metadata is written. Pages that
  // do call pageMeta() override every field of this.
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: firm.url,
    siteName: firm.name,
    title: `${firm.name} — ${firm.tagline}`,
    description: SOCIAL_DESCRIPTION,
    images: [{ url: ogImageUrl(firm.tagline), ...OG_SIZE, alt: `${firm.name} — ${firm.tagline}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${firm.name} — ${firm.tagline}`,
    description: SOCIAL_DESCRIPTION,
    images: [ogImageUrl(firm.tagline)],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  // A preview build is the whole site on a hostname that is not the firm's.
  // Indexed, it would compete with fiatlaw.co.uk for its own content and put a
  // scalix.run address in front of people searching for the practice. Inherited
  // by every page, because none of them override `robots`.
  robots: isPreview
    ? { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          // Let Google show a full text snippet and a large image. The default cap
          // truncates the snippet, and for a practice whose whole pitch is "we tell
          // you the specific obstacle", the snippet is the pitch.
          "max-snippet": -1,
          "max-image-preview": "large",
          "max-video-preview": -1,
        },
      },
  // No `alternates` here on purpose: a canonical is a claim about one document,
  // and inheriting "/" would have every page that forgets to set one declare
  // itself a duplicate of the homepage.
};

export const viewport: Viewport = {
  themeColor: "#f7f5f2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${newsreader.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <PreviewBanner />
        {children}
      </body>
    </html>
  );
}
