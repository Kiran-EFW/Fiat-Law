import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { LegalLayout } from "@/components/LegalLayout";
import { firm, addressOneLine } from "@/config/firm";

export const metadata = pageMeta({
  title: "Terms of use",
  description: `The terms on which ${firm.legalName} makes this website available, including the status of the information published on it and the limits of what may be relied on.`,
  path: "/legal/terms",
  eyebrow: "Legal and regulatory",
});

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of use"
      lede="These terms govern your use of fiatlaw.co.uk. They are not the terms on which we act for clients, which are set out in an engagement letter you will have read and accepted before any work begins."
      updated="August 2026"
      current="/legal/terms"
    >
      <h2>1. Who publishes this site</h2>
      <p>
        This website is published by <strong>{firm.legalName}</strong>, a company registered in England and Wales with
        company number {firm.companyNumber} and registered office at {addressOneLine}. References to &ldquo;we&rdquo;,
        &ldquo;us&rdquo; and &ldquo;our&rdquo; are to that company. By using the site you accept these terms; if you do
        not accept them, please do not use it.
      </p>

      <h2>2. Nothing here is advice</h2>
      <p>
        The content of this site, including the service pages, the India–UK briefing, the insights and the output of
        the UK Entry Brief, is general information about the law and practice as we understand it at the dates shown.
        It is not legal advice, it is not tax advice, and it is not advice on your particular facts.
      </p>
      <p>
        Do not act, or refrain from acting, in reliance on anything published here. Take advice on your own
        circumstances. Where a page carries a date, that is the date the position was checked; the law and the published
        thresholds in this field change frequently, and a page that was accurate when written may not be accurate when
        you read it.
      </p>

      <h2>3. No solicitor–client relationship</h2>
      <p>
        Using this site, submitting the UK Entry Brief, sending an enquiry or corresponding with us does not create a
        solicitor–client relationship and does not make us your advisers. We take on a client only after we have carried
        out conflict and identity checks and both sides have accepted a written engagement letter setting out the scope,
        the capacity in which the work is delivered and the fees.
      </p>
      <p>
        Information you send us before that point is not protected by legal professional privilege. Please do not send
        confidential or sensitive material with a first enquiry.
      </p>

      <h2>4. The UK Entry Brief</h2>
      <p>
        The brief produces an indicative written position generated automatically from the answers you give. It is
        deliberately general, it depends entirely on the accuracy and completeness of those answers, and it cannot take
        account of facts you have not told us or that we have not asked about. It is a starting point for a
        conversation, not a plan you should execute.
      </p>
      <p>
        Nothing in a brief is an offer, a quotation or a commitment to act. Fees are given only in a written proposal
        after we have discussed the matter, and no work is done until you have approved that proposal in writing.
      </p>

      <h2>5. Regulatory position</h2>
      <p>
        {firm.legalName} is not authorised or regulated by the Solicitors Regulation Authority and does not carry on
        reserved legal activities. Reserved and regulated legal work described on this site is carried out by{" "}
        {firm.principal.name} as a solicitor practising through{" "}
        {firm.regulatedFirm.legalName}. Full details are on the{" "}
        <Link href="/legal/regulatory">regulatory information page</Link>, which forms part of these terms.
      </p>

      <h2>6. Intellectual property</h2>
      <p>
        The text, design, logo and arrangement of this site are owned by us or licensed to us. You may read, print and
        share pages for your own or your organisation&rsquo;s internal use, and you may quote from them with
        attribution and a link. You may not republish substantial parts commercially, present our material as your own,
        or use it to train a model or build a derivative service, without our written permission.
      </p>

      <h2>7. Links to other sites</h2>
      <p>
        We link to legislation, official guidance, regulators and registers because a claim you cannot check is worth
        very little. We do not control those sites, we are not responsible for their content, and a link is not an
        endorsement. Where an official source and this site disagree, the official source governs.
      </p>

      <h2>8. Availability</h2>
      <p>
        We make the site available on an &ldquo;as is&rdquo; basis. We do not guarantee that it will be uninterrupted,
        error-free, or free of anything harmful, and we may change, suspend or withdraw any part of it without notice.
        You are responsible for the security of the device and connection you use to reach it.
      </p>

      <h2>9. Liability</h2>
      <p>
        To the fullest extent permitted by law, we exclude liability for any loss or damage arising from use of, or
        reliance on, this site or its content, including loss of profit, loss of business, loss of anticipated savings
        or any indirect or consequential loss.
      </p>
      <p>
        Nothing in these terms excludes or limits liability for death or personal injury caused by negligence, for fraud
        or fraudulent misrepresentation, or for any other liability that cannot lawfully be excluded or limited. Nothing
        here affects the rights of a consumer that cannot be excluded by law. Liability for work we are actually
        instructed on is governed by the engagement letter for that matter, not by this page.
      </p>

      <h2>10. Fraud and payment warning</h2>
      <p>
        We will never tell you by email that our bank details have changed. If you receive any message appearing to come
        from us with payment instructions, telephone us on{" "}
        <a href={`tel:${firm.contact.telephone}`}>{firm.contact.telephoneDisplay}</a>, using the number on this site
        rather than one in the message, and confirm it before sending money. We accept no responsibility for funds sent on the
        strength of an instruction you have not verified with us by telephone.
      </p>

      <h2>11. Your data</h2>
      <p>
        How we handle personal data is set out in the <Link href="/legal/privacy">privacy notice</Link>. What this site
        does and does not store in your browser is set out on the <Link href="/legal/cookies">cookies page</Link>.
      </p>

      <h2>12. Changes to these terms</h2>
      <p>
        We may amend these terms from time to time. The version in force is the one published here, with the date shown
        at the top of the page. Continuing to use the site after a change means you accept the amended terms.
      </p>

      <h2>13. Law and jurisdiction</h2>
      <p>
        These terms, and any dispute arising out of them or out of your use of this site, are governed by the law of
        England and Wales, and the courts of England and Wales have exclusive jurisdiction, save that a consumer
        resident elsewhere in the United Kingdom may bring proceedings in the courts of their own jurisdiction.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions about these terms should go to <a href={`mailto:${firm.contact.email}`}>{firm.contact.email}</a> or{" "}
        <a href={`tel:${firm.contact.telephone}`}>{firm.contact.telephoneDisplay}</a>.
      </p>
    </LegalLayout>
  );
}
