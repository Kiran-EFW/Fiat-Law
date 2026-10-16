import type { MetadataRoute } from "next";
import { firm } from "@/config/firm";

/**
 * A minimal manifest. This is a professional services site, not an app: there
 * is no offline mode, no service worker and nothing to install. The manifest is
 * here so that a phone saving the page to a home screen gets the firm's name
 * and mark rather than a screenshot and a URL, and so Lighthouse stops flagging
 * its absence.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${firm.name} — ${firm.tagline}`,
    short_name: firm.name,
    description: firm.descriptor,
    start_url: "/",
    display: "browser",
    background_color: "#f7f5f2",
    theme_color: "#f7f5f2",
    lang: "en-GB",
    icons: [
      { src: "/favicon.png", sizes: "any", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
