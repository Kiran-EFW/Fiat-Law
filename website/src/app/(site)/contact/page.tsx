import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Container, Section, ArrowRight } from "@/components/ui";
import { EnquiryForm } from "@/components/EnquiryForm";
import { EphemeralLeadNotice } from "@/components/PreviewBanner";
import { firm, addressLines } from "@/config/firm";

export const metadata = pageMeta({
  title: "Contact",
  description: `Contact ${firm.name} — ${addressLines.join(", ")}. Telephone ${firm.contact.telephoneDisplay}, or start the UK Entry Brief for a written position on your matter.`,
  path: "/contact",
  eyebrow: "Contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us where you are, and we will tell you what it runs into."
        lede="If you already know what you need, write to us. If you are working out what you need, the UK Entry Brief will do more for you in five minutes than a first call will, and Janeevan will have read it before you speak."
        aside={
          <div className="border-l-2 border-crimson-600 pl-5">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-stone-500">Response times</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone-600">
              Enquiries are normally answered within one working day. India is four and a half or five and a half hours
              ahead of the UK depending on the season, so a message sent in the Indian afternoon usually receives a
              reply the same day.
            </p>
          </div>
        }
      />

      <Section tone="parchment" className="border-t border-stone-200">
        <Container width="wide">
          <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
            {/* Form */}
            <div>
              <h2 className="text-display-sm">Send a message</h2>
              <p className="measure mt-5 text-[0.9375rem] leading-relaxed text-stone-600">
                Please do not send confidential documents with a first enquiry. Once we have established that we can
                act and there is no conflict, we will give you a secure way to send them.
              </p>
              <div className="mt-10">
                <EphemeralLeadNotice className="mb-8" />
                <EnquiryForm />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-10">
              <div className="border-t border-stone-300 pt-7">
                <p className="eyebrow mb-4">Office</p>
                <address className="not-italic text-[0.9375rem] leading-relaxed text-stone-700">
                  {addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <p className="mt-4 text-[0.8125rem] leading-relaxed text-stone-500">
                  Meetings by appointment. Video conference is usually quicker for a first conversation, and we are
                  comfortable working to Indian Standard Time.
                </p>
              </div>

              <div className="border-t border-stone-300 pt-7">
                <p className="eyebrow mb-4">Direct</p>
                <dl className="space-y-4 text-[0.9375rem] leading-relaxed">
                  <div>
                    <dt className="text-[0.75rem] uppercase tracking-[0.1em] text-stone-400">Telephone</dt>
                    <dd className="mt-1">
                      <a href={`tel:${firm.contact.telephone}`} className="text-stone-700 hover:text-crimson-600">
                        {firm.contact.telephoneDisplay}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.75rem] uppercase tracking-[0.1em] text-stone-400">Email</dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${firm.contact.email}`}
                        className="break-all text-stone-700 hover:text-crimson-600"
                      >
                        {firm.contact.email}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="border-t border-stone-300 pt-7">
                <p className="eyebrow mb-4">Before you write</p>
                <ul className="space-y-3 text-[0.875rem] leading-relaxed text-stone-600">
                  <li className="border-l-2 border-stone-300 pl-4">
                    We cannot advise on your matter until we have carried out conflict and identity checks and issued an
                    engagement letter. Nothing on this site or in an email exchange is advice you can rely on.
                  </li>
                  <li className="border-l-2 border-stone-300 pl-4">
                    If your matter is a complaint about work already done, please contact Janeevan directly on the
                    number above.{" "}
                    rather than this form, so that it is logged correctly.
                  </li>
                  <li className="border-l-2 border-stone-300 pl-4">
                    We never ask for bank details by email and we will never tell you our account details have changed.
                    If you receive such a message, telephone the number on this page before acting on it.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Brief CTA */}
      <Section tone="ink">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-20">
            <div>
              <p className="eyebrow mb-5">A better first contact</p>
              <h2 className="text-display-sm sm:text-display-md">
                The UK Entry Brief tells you something. A contact form tells us something.
              </h2>
              <p className="measure-wide mt-6 text-[1.0625rem] leading-relaxed text-bone/65">
                Six questions, no figures, no obligation. You receive a written position covering the route, the
                sequence, the specific obstacles your situation runs into, what we would do and in which capacity, and
                where we would tell you not to instruct us at all.
              </p>
            </div>
            <div>
              <Link
                href="/uk-entry-brief"
                className="inline-flex items-center gap-2 bg-crimson-600 px-8 py-4 text-[0.9375rem] font-medium text-bone transition-colors hover:bg-crimson-500"
              >
                Start the UK Entry Brief
                <ArrowRight />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* Regulatory reminder */}
      <Section tone="parchment" className="border-t border-stone-200 !py-14">
        <Container width="wide">
          <div className="grid gap-8 text-[0.8125rem] leading-relaxed text-stone-500 md:grid-cols-2 md:gap-16">
            <p>
              {firm.legalName} is a company registered in England and Wales, number {firm.companyNumber}, with its
              registered office at {addressLines.join(", ")}. It is not authorised or regulated by the Solicitors
              Regulation Authority and it does not carry on reserved legal activities.
            </p>
            <p>
              {firm.principal.name} is a solicitor of the Senior Courts of England and Wales and carries out reserved
              and regulated legal work through {firm.regulatedFirm.legalName}.{" "}
              <Link href="/legal/regulatory" className="text-crimson-600 underline underline-offset-4">
                Full regulatory information
              </Link>
              .
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
