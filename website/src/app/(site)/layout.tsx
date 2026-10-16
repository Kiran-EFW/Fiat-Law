import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { graph, organisationSchema, websiteSchema, personSchema } from "@/lib/schema";

/**
 * The public site: marketing chrome, structured data, the regulatory footer.
 * The admin console lives in its own group and deliberately gets none of it.
 *
 * The three organisation-level nodes are declared once, here, with stable @id
 * values. Every Article, Service and breadcrumb elsewhere on the site points at
 * those ids rather than repeating the firm's details, so a crawler reads
 * sixteen pages as one publisher's body of work — and there is exactly one
 * place where the firm's regulated identity is asserted to machines, matching
 * the single source of truth the footer renders for people.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd id="ld-firm" data={graph(organisationSchema(), websiteSchema(), personSchema())} />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      {/* The legal name, company number and registered address are carried
          visibly in the footer, so there is no sr-only duplicate here: it
          would only read the same identifiers twice, outside any landmark. */}
      <Footer />
    </>
  );
}
