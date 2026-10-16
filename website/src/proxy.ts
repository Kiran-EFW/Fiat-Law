import { NextResponse, type NextRequest } from "next/server";

/**
 * HTTP Basic authentication for /admin and the admin API.
 *
 * Next 16 renamed the `middleware` file convention to `proxy`; this is that
 * file.
 *
 * Deliberately the simplest thing that is actually safe: one shared credential,
 * checked in constant time, over TLS. There is no user model on this site and
 * inventing one for a single-principal practice would be more attack surface,
 * not less. If the practice ever needs per-user access, replace this with a
 * real session — nothing else depends on it.
 */
export function proxy(request: NextRequest) {
  const user = process.env.ADMIN_USER ?? "fiat";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    // Never leave the lead pipeline open because someone forgot an env var.
    if (process.env.NODE_ENV === "production") {
      return new NextResponse("Admin access is not configured.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    return NextResponse.next();
  }

  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    let decoded = "";
    try {
      decoded = atob(header.slice(6));
    } catch {
      decoded = "";
    }
    const separator = decoded.indexOf(":");
    const given = separator === -1 ? "" : decoded.slice(0, separator);
    const secret = separator === -1 ? "" : decoded.slice(separator + 1);
    if (safeEqual(given, user) && safeEqual(secret, password)) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Fiat Law admin", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

/** Length-independent comparison, to avoid leaking the secret by timing. */
function safeEqual(a: string, b: string) {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  let diff = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i += 1) {
    diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  }
  return diff === 0;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
