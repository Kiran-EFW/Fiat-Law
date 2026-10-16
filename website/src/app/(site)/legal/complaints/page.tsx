import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { LegalLayout } from "@/components/LegalLayout";
import { firm, addressOneLine } from "@/config/firm";

export const metadata = pageMeta({
  title: "Complaints",
  description: `How to complain to ${firm.name}, the timescales we work to, and your right to refer regulated legal services complaints to the Legal Ombudsman.`,
  path: "/legal/complaints",
  eyebrow: "Legal and regulatory",
});

export default function ComplaintsPage() {
  return (
    <LegalLayout
      title="Complaints"
      lede="If something has gone wrong, we would rather hear it from you than not hear it. This page sets out how to complain, what we will do, how long it takes, and where you can go if our answer does not satisfy you."
      updated="August 2026"
      current="/legal/complaints"
    >
      <h2>Tell us first</h2>
      <p>
        Please raise the matter with {firm.principal.name} in the first instance, by any of the following:
      </p>
      <ul>
        <li>
          Email: <a href={`mailto:${firm.contact.email}`}>{firm.contact.email}</a>
        </li>
        <li>
          Telephone: <a href={`tel:${firm.contact.telephone}`}>{firm.contact.telephoneDisplay}</a>
        </li>
        <li>Post: {addressOneLine}</li>
      </ul>
      <p>
        It helps if you tell us what happened, when, what effect it has had, and what you would like us to do about it.
        You will not be charged for the time we spend dealing with a complaint.
      </p>

      <h2>What we will do, and when</h2>
      <ol>
        <li>
          We will acknowledge your complaint in writing within <strong>five working days</strong>, confirm our
          understanding of it, and tell you who is handling it.
        </li>
        <li>
          We will investigate — normally by reviewing the file and speaking to anyone involved — and we may ask you for
          further information.
        </li>
        <li>
          We will give you a written response, including our conclusions and any proposed remedy, within{" "}
          <strong>eight weeks</strong> of receiving the complaint. If we cannot, we will tell you why and when we will.
        </li>
        <li>
          If you are not satisfied with that response, tell us and we will review it again. If a review will not resolve
          matters, we will confirm our final position in writing.
        </li>
      </ol>

      <h2>Which regime your complaint falls under</h2>
      <p>
        Because two legal persons deliver the work described on this site, the external route depends on which capacity
        the work was carried out in. That capacity is stated in your engagement letter, on the relevant service page and
        in your UK Entry Brief; if you are not sure, ask us and we will tell you.
      </p>
      <ul>
        <li>
          <strong>Regulated legal services</strong> carried out by {firm.principal.name} as a solicitor through{" "}
          {firm.regulatedFirm.legalName} are also subject to that firm&rsquo;s own
          complaints procedure, and carry a right of referral to the Legal Ombudsman. A copy of that firm&rsquo;s
          procedure is provided with the engagement letter and is available from us on request.
        </li>
        <li>
          <strong>Corporate services</strong> provided by {firm.legalName} are contractual services and are not
          regulated legal services. The Legal Ombudsman does not generally have jurisdiction over them. Our internal
          procedure above still applies in full, and any dispute is otherwise subject to the courts of England and
          Wales.
        </li>
      </ul>

      <h2>The Legal Ombudsman</h2>
      <p>
        If your complaint concerns regulated legal services and you are not satisfied with our final response — or if
        eight weeks have passed since you first complained — you may refer the matter to the Legal Ombudsman. The
        service is free to consumers and to most small businesses, charities, clubs and trusts.
      </p>
      <ul>
        <li>
          Telephone: <a href={`tel:${firm.ombudsman.telephone.replace(/\s/g, "")}`}>{firm.ombudsman.telephone}</a>
        </li>
        <li>
          Email: <a href={`mailto:${firm.ombudsman.email}`}>{firm.ombudsman.email}</a>
        </li>
        <li>Post: {firm.ombudsman.address}</li>
        <li>
          Online:{" "}
          <a href="https://www.legalombudsman.org.uk" target="_blank" rel="noreferrer noopener">
            legalombudsman.org.uk
          </a>
        </li>
      </ul>
      <p>
        <strong>Time limits apply.</strong> You must ordinarily refer your complaint to the Legal Ombudsman within{" "}
        <strong>six months</strong> of receiving our final written response, and within <strong>one year</strong> of the
        act or omission complained about, or within one year of when you should reasonably have known there was cause
        for complaint. The Ombudsman&rsquo;s own scheme rules govern; check them, because they change from time to time.
      </p>

      <h2>The Solicitors Regulation Authority</h2>
      <p>
        The Legal Ombudsman deals with service. The Solicitors Regulation Authority deals with conduct — dishonesty,
        discrimination, taking money improperly, or a serious failure to meet its Standards and Regulations. If your
        concern is of that kind, you can report it to the SRA directly at{" "}
        <a href="https://www.sra.org.uk/consumers/problems/" target="_blank" rel="noreferrer noopener">
          sra.org.uk
        </a>
        , whether or not you have complained to us first.
      </p>

      <h2>Data protection complaints</h2>
      <p>
        If your complaint is about how we have handled your personal data, please see the{" "}
        <Link href="/legal/privacy">privacy notice</Link>, which explains your rights and how to complain to the
        Information Commissioner&rsquo;s Office. You may complain to the ICO at any time, though we would prefer the
        chance to put it right first.
      </p>

      <h2>Our record</h2>
      <p>
        Every complaint is logged with its date, subject, outcome and the time taken, and reviewed for whether something
        in how we work caused it. That review is the point of the procedure; the acknowledgement letter is not.
      </p>
    </LegalLayout>
  );
}
