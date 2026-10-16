"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { cx } from "@/components/ui";

type Errors = Partial<Record<"name" | "email" | "message" | "consent" | "form", string>>;

/**
 * The plain enquiry form. Deliberately short: the qualification work happens in
 * the UK Entry Brief, and anyone who lands here wants to send a message, not
 * answer questions.
 */
export function EnquiryForm({ defaultSubject = "", context }: { defaultSubject?: string; context?: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? "").trim();

    const next: Errors = {};
    if (!value("name")) next.name = "Please give us a name.";
    const email = value("email");
    if (!email) next.email = "We need an email address to reply to.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "That does not look like a valid email address.";
    if (value("message").length < 10) next.message = "Please tell us a little more.";
    if (data.get("consent") !== "on") next.consent = "We need your agreement to the privacy notice to respond.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setState("sending");
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: value("name"),
          email,
          company: value("company"),
          phone: value("phone"),
          subject: [context, value("subject")].filter(Boolean).join(" — "),
          message: value("message"),
          consent: true,
          website: value("website"),
        }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setErrors({ form: body?.error ?? "We could not send that. Please email us directly." });
        setState("idle");
        return;
      }
      setState("sent");
      form.reset();
    } catch {
      setErrors({ form: "We could not reach the server. Please email us directly." });
      setState("idle");
    }
  }

  if (state === "sent") {
    return (
      <div className="border border-crimson-600/25 bg-crimson-50 p-8" role="status">
        <p className="font-display text-2xl leading-snug text-crimson-700">Received. Thank you.</p>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink/75">
          Janeevan reads enquiries personally and will normally reply within one working day. If your matter is urgent,
          telephone rather than wait.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-6 text-sm font-medium text-crimson-600 underline underline-offset-4 hover:text-crimson-500"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" name="name" required error={errors.name} autoComplete="name" />
        <Field label="Company" name="company" autoComplete="organization" />
        <Field label="Email" name="email" type="email" required error={errors.email} autoComplete="email" />
        <Field label="Telephone" name="phone" type="tel" autoComplete="tel" hint="Include the country code" />
      </div>

      <Field label="Subject" name="subject" defaultValue={defaultSubject} />

      <div>
        <label htmlFor="message" className="block text-[0.8125rem] font-medium text-ink">
          Message
          <span className="ml-1 text-crimson-600">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          aria-required="true"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cx(
            "mt-2 w-full resize-y border bg-parchment px-4 py-3 text-[0.9375rem] leading-relaxed text-ink transition-colors focus:border-crimson-600",
            errors.message ? "border-crimson-600" : "border-stone-300",
          )}
        />
        {errors.message ? (
          <p id="message-error" className="mt-1.5 text-[0.75rem] text-crimson-600">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot — off screen, not hidden, so assistive tech ignores it but bots do not. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <div className="flex items-start gap-3.5">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-1 h-4 w-4 shrink-0 accent-[#8b1e2d]"
          />
          <label htmlFor="consent" className="text-[0.875rem] leading-relaxed text-stone-600">
            I have read the{" "}
            <Link href="/legal/privacy" className="text-crimson-600 underline underline-offset-4">
              privacy notice
            </Link>{" "}
            and agree that Fiat Law may use these details to respond to my enquiry.
          </label>
        </div>
        {errors.consent ? (
          <p id="consent-error" className="mt-1.5 pl-7 text-[0.75rem] text-crimson-600">
            {errors.consent}
          </p>
        ) : null}
      </div>

      {errors.form ? (
        <p role="alert" className="border-l-2 border-crimson-600 pl-4 text-[0.875rem] text-crimson-700">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-5 pt-1">
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex items-center justify-center bg-crimson-600 px-8 py-4 text-[0.9375rem] font-medium text-bone transition-colors hover:bg-crimson-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state === "sending" ? "Sending…" : "Send enquiry"}
        </button>
        <p className="text-[0.75rem] leading-relaxed text-stone-500">
          Sending a message does not create a solicitor–client relationship and no advice is given until we are
          formally instructed.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  hint,
  defaultValue,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  defaultValue?: string;
  autoComplete?: string;
}) {
  const describedBy = [hint ? `${name}-hint` : null, error ? `${name}-error` : null].filter(Boolean).join(" ");
  return (
    <div>
      <label htmlFor={name} className="block text-[0.8125rem] font-medium text-ink">
        {label}
        {required ? <span className="ml-1 text-crimson-600">*</span> : null}
      </label>
      {hint ? (
        <p id={`${name}-hint`} className="mt-1 text-[0.75rem] text-stone-500">
          {hint}
        </p>
      ) : null}
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={cx(
          "mt-2 w-full border bg-parchment px-4 py-3 text-[0.9375rem] text-ink transition-colors focus:border-crimson-600",
          error ? "border-crimson-600" : "border-field",
        )}
      />
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-[0.75rem] text-crimson-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
