import type { NextConfig } from "next";

// Duplicated from src/config/deployment.ts rather than imported: next.config.ts
// is loaded by the Next CLI outside the application's module graph, so the "@/"
// alias does not resolve here. The two must agree, and the check in
// scripts/verify-preview.mjs is what enforces that they do.
const isPreview = process.env.SITE_ENV?.trim().toLowerCase() === "preview";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Everything the container needs, and nothing else. Scalix Run compute is
  // ephemeral, so the image is the whole deployment.
  output: "standalone",
  serverExternalPackages: ["better-sqlite3"],
  // The share-card renderer reads its two typefaces off disk. Tracing does not
  // see a runtime readFileSync, so the files have to be declared or /og renders
  // fontless in the container and nowhere else.
  outputFileTracingIncludes: {
    "/og": ["./src/assets/fonts/**"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // The header, not just the <meta>, because metadata only reaches HTML
          // documents. /sitemap.xml, /llms.txt, /manifest.webmanifest, /og and
          // the API routes have no <head> to put a robots tag in, and a crawler
          // that finds the preview's sitemap has a complete list of its URLs.
          ...(isPreview ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
        ],
      },
    ];
  },
};

export default nextConfig;
