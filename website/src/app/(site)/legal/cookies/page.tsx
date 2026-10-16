import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { LegalLayout } from "@/components/LegalLayout";
import { firm } from "@/config/firm";

export const metadata = pageMeta({
  title: "Cookies",
  description: `${firm.name} sets no analytics, advertising or tracking cookies on this website. This page explains what that means and what the site does instead.`,
  path: "/legal/cookies",
  eyebrow: "Legal and regulatory",
});

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookies"
      lede="This website sets no cookies for analytics, advertising or tracking. There is no consent banner because there is nothing to consent to. That is unusual enough to be worth explaining properly."
      updated="August 2026"
      current="/legal/cookies"
    >
      <h2>What this site does not do</h2>
      <ul>
        <li>No analytics cookies. We do not run Google Analytics or any equivalent.</li>
        <li>No advertising or retargeting pixels. Nothing here follows you to another website.</li>
        <li>No social media tracking scripts. Links to other sites are ordinary links.</li>
        <li>No session cookies, and no data stored in your browser&rsquo;s local or session storage.</li>
        <li>No fingerprinting, and no third-party tag manager through which any of the above could later appear.</li>
      </ul>

      <h2>Why</h2>
      <p>
        The people this practice is built for are, in the main, deciding whether to hand a confidential corporate plan to
        somebody they have not met. Loading their first visit with a consent dialogue and a set of third-party trackers
        is a poor way to begin that conversation, and the information we would get from it is not worth what it costs in
        trust.
      </p>
      <p>
        Server logs kept by our hosting provider record requests in the ordinary way, and your IP address is held
        briefly in memory to rate-limit form submissions so that the forms cannot be abused. Neither is a cookie, and
        neither is used to build a profile of you. The{" "}
        <Link href="/legal/privacy">privacy notice</Link> covers both.
      </p>

      <h2>Fonts and assets</h2>
      <p>
        The typefaces used on this site are served from our own domain rather than from a third-party font service, so
        no request for a font tells anyone else that you visited. Images and scripts are served from the same origin.
      </p>

      <h2>Things we link to</h2>
      <p>
        Where we link to legislation, the SRA register, the Legal Ombudsman, the Information Commissioner&rsquo;s Office
        or other external sites, those sites have their own cookie and privacy practices, and we have no control over
        them. Following a link takes you out of this notice&rsquo;s scope.
      </p>

      <h2>If that changes</h2>
      <p>
        If we ever introduce analytics or any other non-essential cookie, we will ask for your consent before setting
        it, in a way that makes refusing as easy as accepting, and we will update this page and its date before doing
        so. There is no plan to.
      </p>

      <h2>Blocking cookies anyway</h2>
      <p>
        You do not need to do anything for this site. If you want to control cookies generally, every major browser
        allows you to block or delete them in its settings, and{" "}
        <a href="https://ico.org.uk/for-the-public/online/cookies/" target="_blank" rel="noreferrer noopener">
          the Information Commissioner&rsquo;s guidance for the public
        </a>{" "}
        explains the options.
      </p>
    </LegalLayout>
  );
}
