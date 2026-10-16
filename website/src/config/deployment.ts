/**
 * What kind of deployment this build is.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS A BUILD-TIME CONSTANT AND NOT A RUNTIME ENV VAR
 * ---------------------------------------------------------------------------
 * robots.ts is `force-static` and page metadata is generated during `next
 * build`, so the value that decides whether this site says "index me" is
 * resolved once, at build, and frozen into the output. Reading SITE_ENV at
 * request time would produce a robots.txt that says one thing and a <head> that
 * says another.
 *
 * Freezing it is also the safer property. A preview image is a preview image
 * for its whole life; nobody can promote it to production by editing a service
 * environment variable and get a half-configured site that is indexable but
 * still throwing its enquiries away. Production is a separate build.
 *
 * ---------------------------------------------------------------------------
 * WHAT `preview` CHANGES
 * ---------------------------------------------------------------------------
 *  - robots.txt disallows everything and advertises no sitemap.
 *  - Every response carries `X-Robots-Tag: noindex, nofollow` (next.config.ts),
 *    which covers the surfaces metadata does not reach: /og, /sitemap.xml,
 *    /llms.txt and the API routes.
 *  - The root layout's metadata sets index:false, follow:false.
 *  - A banner states, on every page, that enquiries are not retained.
 *
 * Canonical URLs still point at https://fiatlaw.co.uk. That is deliberate: if
 * some crawler ignores all of the above, the strongest remaining signal should
 * send it to the real domain rather than let the preview host accumulate
 * authority of its own.
 */

export type SiteEnv = "production" | "preview";

export const siteEnv: SiteEnv = process.env.SITE_ENV?.trim().toLowerCase() === "preview" ? "preview" : "production";

export const isPreview = siteEnv === "preview";

/**
 * Set when the preview's lead store is the container filesystem. SQLite on
 * Scalix Run compute is ephemeral, so an enquiry submitted through the preview
 * survives until the next restart and no longer. The forms still work end to
 * end — that is the point of the preview — but a real client's enquiry must not
 * be silently accepted into a store that is going to discard it, so the banner
 * says so before anybody fills one in.
 */
export const leadsAreEphemeral = isPreview && (process.env.LEADS_DRIVER?.trim().toLowerCase() ?? "sqlite") === "sqlite";
