/**
 * The Open Graph share card.
 *
 * One renderer for every page rather than a per-segment `opengraph-image.tsx`,
 * because the card is the same design everywhere and the only variables are two
 * strings. Fonts are read from the repository rather than fetched from Google
 * at render time: a share card that depends on a third-party request is a share
 * card that is blank whenever that request is slow, and the crawler does not
 * come back. `outputFileTracingIncludes` in next.config.ts carries the two .ttf
 * files into the standalone build.
 *
 * Not under /api — robots.txt disallows that prefix, and the LinkedIn and
 * Facebook crawlers honour it.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { firm } from "@/config/firm";
import { OG_SIZE } from "@/lib/seo";

// Deliberately not `force-static`: that makes a Route Handler's searchParams
// come back empty, which would collapse every card onto the homepage's.
export const runtime = "nodejs";

const fontDir = join(process.cwd(), "src/assets/fonts");
const display = readFileSync(join(fontDir, "newsreader-600.ttf"));
const sans = readFileSync(join(fontDir, "inter-500.ttf"));

const INK = "#0b0b0c";
const CRIMSON = "#8b1e2d";
const BONE = "#f7f5f2";
const STONE = "#53535b";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const title = (params.get("t") || firm.tagline).slice(0, 160);
  const eyebrow = (params.get("k") || firm.descriptor).slice(0, 48);

  // Long headlines are set smaller rather than allowed to wrap into the rule at
  // the foot of the card. Three sizes is enough: the titles on this site are
  // editorial, not arbitrary.
  const size = title.length > 90 ? 52 : title.length > 52 ? 62 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BONE,
          padding: "68px 76px",
          fontFamily: "Inter",
          // The crimson edge is the logo's own gradient, flattened to one bar.
          borderLeft: `18px solid ${CRIMSON}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 21,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: CRIMSON,
              fontWeight: 500,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 30,
              fontFamily: "Newsreader",
              fontSize: size,
              lineHeight: 1.08,
              letterSpacing: "-0.022em",
              color: INK,
              maxWidth: 960,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: `1px solid #cfcdc8`,
            paddingTop: 26,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Newsreader",
                fontSize: 38,
                letterSpacing: "0.02em",
                color: INK,
              }}
            >
              {firm.name}
            </div>
            <div style={{ display: "flex", marginTop: 8, fontSize: 19, color: STONE }}>
              {firm.tagline}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 19, color: STONE, letterSpacing: "0.04em" }}>
            {firm.domain}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Newsreader", data: display, weight: 600, style: "normal" },
        { name: "Inter", data: sans, weight: 500, style: "normal" },
      ],
      headers: {
        // Immutable in practice: the card is a pure function of the query string.
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
