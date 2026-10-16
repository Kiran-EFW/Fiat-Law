import { isPreview, leadsAreEphemeral } from "@/config/deployment";

/**
 * A standing notice on every page of a preview build.
 *
 * The site is complete enough to be mistaken for the live one — that is the
 * point of showing it — and the two things that are not true of it are exactly
 * the two a visitor cannot see: the address is not the firm's, and an enquiry
 * submitted here is written to a disk that is discarded when the container
 * restarts. Somebody forwarded this link is entitled to know both before they
 * type their name into the form.
 *
 * Renders nothing at all in a production build, so it costs the live site one
 * import and no markup.
 */
export function PreviewBanner() {
  if (!isPreview) return null;

  return (
    <div
      role="note"
      className="border-b border-ink/15 bg-ink px-6 py-2.5 text-center text-[0.8125rem] leading-relaxed text-bone"
    >
      <span className="font-medium uppercase tracking-[0.14em] text-gold">Preview</span>
      <span className="mx-3 text-bone/30">|</span>
      <span className="text-bone/85">
        Not the live site. <span className="font-medium text-bone">fiatlaw.co.uk</span> is unchanged.
        {leadsAreEphemeral ? " Enquiries sent from here are not retained; please do not use it with clients." : null}
      </span>
    </div>
  );
}

/**
 * The same warning again, immediately above a form.
 *
 * The banner is at the top of the document and the contact page is long, so by
 * the time somebody is filling in the form the banner is several screens away.
 * The moment that matters is the one before they press send, and this is the
 * only place a notice is certain to be on screen then.
 *
 * A server component, so it reads the driver directly. Making the client form
 * aware of this would mean either threading a prop through every call site — a
 * new one added later would silently miss it — or publishing the deployment
 * shape into the browser bundle under NEXT_PUBLIC_, which is a lot of machinery
 * for a sentence.
 */
export function EphemeralLeadNotice({ className }: { className?: string }) {
  if (!leadsAreEphemeral) return null;

  return (
    <p
      role="note"
      className={`border-l-2 border-gold bg-bone px-5 py-4 text-[0.875rem] leading-relaxed text-stone-700 ${className ?? ""}`}
    >
      <span className="font-medium text-ink">This is a preview.</span> Anything sent from this form is written to
      temporary storage and is lost when the server restarts. Nobody at Fiat Law will see it. Use{" "}
      <a href="mailto:janeevan.john@fiatlaw.co.uk" className="text-crimson-600 underline underline-offset-4">
        janeevan.john@fiatlaw.co.uk
      </a>{" "}
      for anything real.
    </p>
  );
}
