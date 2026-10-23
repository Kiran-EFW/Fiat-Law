import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { LegalLayout } from "@/components/LegalLayout";
import { firm, addressOneLine } from "@/config/firm";

export const metadata = pageMeta({
  title: "Regulatory information",
  description: `Who is regulated by whom at ${firm.name}: ${firm.legalName} (company ${firm.companyNumber}) provides corporate services and is not SRA-authorised; ${firm.principal.name} carries out reserved legal work as a solicitor practising through ${firm.regulatedFirm.legalName}.`,
  path: "/legal/regulatory",
  eyebrow: "Legal and regulatory",
});

export default function RegulatoryPage() {
  return (
    <LegalLayout
      title="Regulatory information"
      lede="Two legal persons deliver the work described on this site, under two different regimes. This page sets out which is which, so that before you instruct anyone you can tell who is accountable, to whom, and with what insurance behind them."
      updated="August 2026"
      current="/legal/regulatory"
    >
      <h2>The two capacities</h2>
      <p>
        <strong>{firm.legalName}</strong> is a private company limited by shares, registered in England and Wales with
        company number {firm.companyNumber} and registered office at {addressOneLine}. It provides corporate services
        and business advisory: entity formation support and company secretarial work, market-entry planning, trade and
        rules-of-origin work, project coordination and compliance calendars.
      </p>
      <p>
        {firm.legalName} <strong>is not authorised or regulated by the Solicitors Regulation Authority</strong>. It is
        not a firm of solicitors, it does not carry on reserved legal activities within the meaning of section 12 of the
        Legal Services Act 2007, and it does not hold itself out as entitled to do so.
      </p>
      <p>
        <strong>{firm.principal.name}</strong> is a solicitor of the Senior Courts of England and Wales, admitted on{" "}
        {firm.principal.admitted}. Reserved and regulated legal work is carried out by him in that capacity,
        practising through <strong>{firm.regulatedFirm.legalName}</strong>, a firm authorised and regulated by the
        Solicitors Regulation Authority. That work is subject to that firm&rsquo;s authorisation and the SRA Standards
        and Regulations.
      </p>
      <p>
        You can verify {firm.principal.name}&rsquo;s practising status, and the firm he practises through, on the
        Solicitors Regulation Authority&rsquo;s{" "}
        <a href="https://www.sra.org.uk/consumers/register/" target="_blank" rel="noreferrer noopener">
          public register
        </a>
        . We would encourage you to do so, for us and for anyone else you are considering instructing.
      </p>

      <h2>Which regime applies to which work</h2>
      <p>
        Every service page on this site is marked with the capacity in which that service is delivered, and your UK
        Entry Brief repeats the marking for each step of your own sequence. In summary:
      </p>
      <ul>
        <li>
          <strong>Fiat Law, corporate services.</strong> Entity and company secretarial support, UK entry planning and
          sequencing, trade and origin work, project management and compliance calendars. Contractual duties only; no
          SRA regulation, no Legal Ombudsman jurisdiction.
        </li>
        <li>
          <strong>Solicitor, reserved and regulated legal work.</strong> Corporate and commercial drafting and
          negotiation, share and asset acquisitions, immigration advice and representation, and any other reserved
          activity. Delivered by {firm.principal.name} through {firm.regulatedFirm.legalName} and regulated by the SRA.
        </li>
        <li>
          <strong>Coordinated.</strong> Statutory accounts, audit, payroll and specialist tax are delivered by regulated
          partner practices under their own engagement letters, with their own regulators and their own insurance. We
          coordinate; they are responsible for their own work.
        </li>
      </ul>

      <h2>Immigration advice</h2>
      <p>
        Immigration advice and services are given by {firm.principal.name} in his capacity as a solicitor. A solicitor
        regulated by the Solicitors Regulation Authority is a qualified person for the purposes of section 84 of the
        Immigration and Asylum Act 1999 and may lawfully provide immigration advice and services. Neither Fiat Law nor
        any person who is not so qualified provides immigration advice.
      </p>

      <h2>Anti-money laundering supervision</h2>
      <p>
        Certain services in this market are supervised business under the Money Laundering, Terrorist Financing and
        Transfer of Funds (Information on the Payer) Regulations 2017, in particular forming companies for others and
        providing a registered office, business address or correspondence address to third parties by way of business,
        which is trust or company service provider activity within regulation 12(2).
      </p>
      <p>
        {firm.legalName} is not presently registered as a trust or company service provider, and does not carry on that
        activity. Services on this site that would require that registration are withheld and are marked as such rather
        than quietly offered. Where a client needs a UK registered office or correspondence address, we will introduce a
        supervised provider and tell you who supervises them.
      </p>
      <p>
        Separately, {firm.legalName} is not presently registered as an Authorised Corporate Service Provider with
        Companies House, and does not carry out identity verification in that capacity under the Economic Crime and
        Corporate Transparency Act 2023. Where verification is needed, we will tell you which routes are open to you,
        including verifying directly through GOV.UK One Login at no cost.
      </p>
      <p>
        Client due diligence is carried out before any engagement. We will ask for identification and, for corporate
        clients, evidence of ownership and control. We cannot begin work until it is complete, and we may be required by
        law to make a disclosure without telling you that we have done so.
      </p>

      <h2>Financial services</h2>
      <p>
        Neither Fiat Law nor {firm.principal.name} provides investment advice, arranges investments or carries on any
        other regulated activity for the purposes of the Financial Services and Markets Act 2000. Nothing on this site
        is a financial promotion or an inducement to engage in investment activity. Where a matter requires it, we work
        alongside authorised advisers.
      </p>

      <h2>Price and service transparency</h2>
      <p>
        This site does not publish prices, for the reasons given on the{" "}
        <Link href="/services">services page</Link>. Where the SRA Transparency Rules require price and service
        information to be published for a particular type of work, that information is published by{" "}
        {firm.regulatedFirm.legalName} as the authorised firm, and we will provide it to you before you instruct us. In
        every case you receive a written proposal with a figure in it, and you approve that figure in writing before any
        work starts.
      </p>

      <h2>Jurisdiction and law</h2>
      <p>
        We advise on the law of England and Wales. We do not advise on Indian law, Scots law, Northern Ireland law or
        the law of any other jurisdiction, and where a matter requires it we work with local counsel whom you instruct
        directly or through us. Our engagement terms are governed by the law of England and Wales.
      </p>

      <h2>This site</h2>
      <p>
        Nothing on this website is legal advice, and no solicitor–client relationship arises from reading it,
        completing the UK Entry Brief, or corresponding with us before we have carried out our checks and issued an
        engagement letter. The <Link href="/legal/terms">terms of use</Link> apply to your use of the site.
      </p>
    </LegalLayout>
  );
}
