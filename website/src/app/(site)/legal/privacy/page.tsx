import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { LegalLayout } from "@/components/LegalLayout";
import { firm, addressOneLine } from "@/config/firm";
import { PRIVACY_VERSION } from "@/lib/leads/privacy";

export const metadata = pageMeta({
  title: "Privacy notice",
  description: `How ${firm.legalName} collects, uses, shares and retains personal data, the lawful bases we rely on, how long we keep it, and your rights under the UK GDPR.`,
  path: "/legal/privacy",
  eyebrow: "Legal and regulatory",
});

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy notice"
      lede="What we collect, why, on what lawful basis, who sees it, how long we keep it and what you can require us to do about it. Written to be read rather than to be defensible."
      updated="August 2026"
      current="/legal/privacy"
    >
      <p className="!mt-0 text-[0.8125rem] uppercase tracking-[0.1em] text-stone-400">
        Version {PRIVACY_VERSION}
      </p>

      <h2>Who we are</h2>
      <p>
        The controller for personal data collected through this website is <strong>{firm.legalName}</strong>, a company
        registered in England and Wales, number {firm.companyNumber}, of {addressOneLine}. You can reach us at{" "}
        <a href={`mailto:${firm.contact.email}`}>{firm.contact.email}</a> or{" "}
        <a href={`tel:${firm.contact.telephone}`}>{firm.contact.telephoneDisplay}</a>.
      </p>
      <p>
        Where {firm.principal.name} acts as a solicitor through {firm.regulatedFirm.legalName}, that firm is the
        controller for personal data processed on the matters it handles, and its own privacy notice applies. It is
        provided with the engagement letter. This notice covers the website and Fiat Law&rsquo;s own processing.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>UK Entry Brief answers.</strong> Your position, entity status, people position, sector, approximate
          scale, timing, and the short follow-up answer for your position. These are structured choices, not free text,
          apart from the notes field.
        </li>
        <li>
          <strong>Contact details.</strong> Name, role, company, email address, telephone number, preferred contact
          channel, the city you are contacting us from, and anything you write in the notes or message field.
        </li>
        <li>
          <strong>Consent record.</strong> Whether you agreed to this notice, whether you asked for occasional
          briefings, and the version of this notice in force at the time.
        </li>
        <li>
          <strong>Submission context.</strong> The page you started from, the referring website if any, campaign
          parameters in the link you followed, and how long the brief took to complete. We use the last of these to tell
          a considered submission from an automated one.
        </li>
        <li>
          <strong>Your IP address, transiently.</strong> Held in memory only, to rate-limit form submissions. It is not
          written to our database and is discarded within minutes.
        </li>
      </ul>
      <p>
        We do not ask for special category data and you should not send it to us through this website. Please do not
        send confidential documents with a first enquiry; once we have established that we can act, we will give you a
        secure route.
      </p>

      <h2>Why, and on what lawful basis</h2>
      <div role="region" aria-label="Purpose and lawful basis" tabIndex={0} className="my-8 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-ink/25">
              {["Purpose", "Lawful basis"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="py-3 pr-6 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-stone-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Responding to your enquiry and preparing a proposal", "Legitimate interests — answering someone who has asked us to; and steps at your request prior to a contract"],
              ["Conflict and identity checks before accepting instructions", "Legal obligation, and legitimate interests in not acting where we should not"],
              ["Carrying out the work once instructed", "Performance of a contract"],
              ["Anti-money laundering and record-keeping obligations", "Legal obligation"],
              ["Occasional briefings on India–UK developments", "Consent, which you may withdraw at any time"],
              ["Understanding which enquiries we can help with, in aggregate", "Legitimate interests in running the practice sensibly"],
            ].map(([purpose, basis]) => (
              <tr key={purpose} className="border-b border-stone-200 align-top">
                <td className="py-4 pr-6 font-display text-[1.0625rem] leading-snug text-ink">{purpose}</td>
                <td className="py-4 text-[0.9375rem] leading-relaxed text-stone-600">{basis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Where we rely on legitimate interests, we have considered whether our interest is overridden by your rights. You
        can object to that processing at any time; see <em>Your rights</em> below.
      </p>

      <h2>What we do not do</h2>
      <ul>
        <li>We do not sell, rent or share your data with anyone for their own marketing.</li>
        <li>We do not run advertising or analytics tracking on this site. See the <Link href="/legal/cookies">cookies page</Link>.</li>
        <li>We do not make decisions producing legal effects about you by automated means alone.</li>
      </ul>
      <p>
        Your UK Entry Brief result <em>is</em> generated automatically from your answers — that is what makes it
        immediate. It is a document, not a decision about you: it recommends a route and identifies obstacles, and
        nothing follows from it until a person has read it. {firm.principal.name} reads every brief before any
        conversation. We also record an internal priority score derived from your answers, which affects only how
        quickly we respond, and you may ask us what it was.
      </p>

      <h2>Who else sees it</h2>
      <ul>
        <li>
          <strong>Our hosting and infrastructure providers</strong>, who process data on our instructions under written
          terms.
        </li>
        <li>
          <strong>Our email provider</strong>, which delivers the notification of your enquiry to us.
        </li>
        <li>
          <strong>{firm.regulatedFirm.legalName}</strong>, where your matter involves reserved or regulated legal work
          carried out by {firm.principal.name} as a solicitor.
        </li>
        <li>
          <strong>Partner professional firms</strong> — accountants, auditors, specialist tax or local counsel — but
          only where you have asked us to introduce you or have agreed to it, and we will tell you who they are first.
        </li>
        <li>
          <strong>Regulators, law enforcement or the courts</strong>, where we are required by law to disclose. In some
          circumstances we are prohibited from telling you that we have done so.
        </li>
      </ul>

      <h2>Where it is held</h2>
      <p>
        Enquiry data is held on servers within the United Kingdom or the European Economic Area. If a provider we use
        processes data outside those territories, we rely on UK adequacy regulations or on the International Data
        Transfer Agreement or Addendum, and we will tell you which on request.
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>
          <strong>Enquiries that do not become instructions:</strong> up to 24 months from our last contact, then
          deleted. If you ask us to delete sooner, we will.
        </li>
        <li>
          <strong>Matters we are instructed on:</strong> the file is retained for the period set out in the engagement
          letter for that matter — commonly six years from the end of the matter, and longer for transactional files
          where a longer limitation period may apply.
        </li>
        <li>
          <strong>Anti-money laundering records:</strong> five years from the end of the business relationship or the
          completion of the transaction, as the Money Laundering Regulations 2017 require.
        </li>
        <li>
          <strong>Marketing consent records:</strong> for as long as you remain subscribed, and for a short period
          afterwards to evidence that you unsubscribed.
        </li>
      </ul>

      <h2>Your rights</h2>
      <p>Under the UK GDPR you may ask us to:</p>
      <ul>
        <li>give you a copy of the personal data we hold about you, and tell you what we do with it;</li>
        <li>correct anything inaccurate, or complete anything incomplete;</li>
        <li>delete it, where we no longer need it and no legal obligation requires us to keep it;</li>
        <li>restrict what we do with it while a question about it is resolved;</li>
        <li>provide it in a portable form, where we hold it on the basis of consent or a contract;</li>
        <li>stop processing it where we rely on legitimate interests, and stop marketing to you at any time.</li>
      </ul>
      <p>
        Write to <a href={`mailto:${firm.contact.email}`}>{firm.contact.email}</a>. We will respond within one month. We
        do not charge for this, and we will not ask you why.
      </p>

      <h2>Complaints</h2>
      <p>
        If you are unhappy with how we have handled your data, please tell us first — see the{" "}
        <Link href="/legal/complaints">complaints procedure</Link>. You may also complain to the{" "}
        {firm.ico.name} at any time:{" "}
        <a href={firm.ico.url} target="_blank" rel="noreferrer noopener">
          ico.org.uk
        </a>{" "}
        or <a href={`tel:${firm.ico.telephone.replace(/\s/g, "")}`}>{firm.ico.telephone}</a>. Complaining to the ICO
        does not affect any other right you have.
      </p>

      <h2>Changes</h2>
      <p>
        If we change this notice we will change the version number and the date at the top. Where the change is
        material and affects data we already hold, we will tell the people affected directly rather than relying on the
        page having been updated.
      </p>
    </LegalLayout>
  );
}
