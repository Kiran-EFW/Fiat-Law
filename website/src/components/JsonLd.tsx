/**
 * Renders a schema.org graph.
 *
 * A plain <script>, not next/script: the type is application/ld+json, so the
 * browser never executes it and there is nothing for a loading strategy to
 * schedule. next/script with `beforeInteractive` was making the crawler payload
 * a client-side concern for no benefit.
 *
 * `<` is escaped because JSON-LD is serialised inside a script element, where
 * the string "</script>" appearing in any content-derived field would close it
 * early. Nothing on this site contains one today; the escape is what makes that
 * stay true when the content changes.
 */
export function JsonLd({ id, data }: { id: string; data: object }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
