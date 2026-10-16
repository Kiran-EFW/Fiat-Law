"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { visibleQuestions, type Question } from "@/lib/brief/questions";
import { buildRecommendation } from "@/lib/brief/engine";
import { isSegmentId } from "@/lib/segments";
import type { BriefAnswers } from "@/lib/brief/types";
import { BriefResult } from "@/components/brief/BriefResult";
import { Container, ArrowRight, cx } from "@/components/ui";
import { firm } from "@/config/firm";

type Stage = "questions" | "contact" | "result";

interface FieldErrors {
  [key: string]: string | undefined;
}

/**
 * `notice` is rendered on the final step, immediately above the contact fields.
 * It arrives as a node from the server page rather than being read from the
 * environment here, because this is a client component and the deployment shape
 * is not something to publish into the browser bundle.
 */
export function BriefFlow({ initialSegment, notice }: { initialSegment?: string; notice?: React.ReactNode }) {
  const [answers, setAnswers] = useState<BriefAnswers>(() =>
    initialSegment && isSegmentId(initialSegment) ? { segment: initialSegment } : {},
  );
  const [index, setIndex] = useState(initialSegment && isSegmentId(initialSegment) ? 1 : 0);
  const [stage, setStage] = useState<Stage>("questions");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  // Stamped after mount: reading the clock during render is impure, and this
  // only ever needs to be a client-side measure of how long the brief took.
  const startedAt = useRef<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const questions = useMemo(() => visibleQuestions(answers), [answers]);
  const current: Question | undefined = questions[index];
  const total = questions.length + 1; // + contact
  const step = stage === "questions" ? index + 1 : total;

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    headingRef.current?.focus();
  }, [index, stage]);

  const select = useCallback(
    (question: Question, value: string) => {
      setAnswers((prev) => {
        const next = { ...prev, [question.id]: value } as BriefAnswers;
        // Changing segment invalidates the segment-specific follow-up.
        if (question.id === "segment" && prev.segment !== value) delete next.detail;
        return next;
      });
      window.setTimeout(() => {
        setIndex((i) => {
          const nextIndex = i + 1;
          if (nextIndex >= questions.length) {
            setStage("contact");
            return i;
          }
          return nextIndex;
        });
      }, 180);
    },
    [questions.length],
  );

  function back() {
    setFormError(null);
    if (stage === "contact") {
      setStage("questions");
      setIndex(questions.length - 1);
      return;
    }
    setIndex((i) => Math.max(0, i - 1));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setErrors({});

    const data = new FormData(event.currentTarget);
    const contact = {
      name: String(data.get("name") ?? "").trim(),
      role: String(data.get("role") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      channel: (String(data.get("channel") ?? "email") || "email") as "email" | "phone" | "whatsapp",
      notes: String(data.get("notes") ?? "").trim(),
    };
    const consent = data.get("consent") === "on";
    const marketingConsent = data.get("marketingConsent") === "on";
    const originCity = String(data.get("originCity") ?? "").trim();

    const nextErrors: FieldErrors = {};
    if (!contact.name) nextErrors.name = "Please tell us your name.";
    if (!contact.email) nextErrors.email = "We need an email address to send the brief to.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) nextErrors.email = "That does not look like a valid email address.";
    if (!consent) nextErrors.consent = "We need your agreement to the privacy notice before we can respond.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const finalAnswers: BriefAnswers = {
      ...answers,
      originCity: originCity || undefined,
      contact,
      consent: true,
      marketingConsent,
    };
    setAnswers(finalAnswers);
    setSubmitting(true);

    const params = new URLSearchParams(window.location.search);
    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: finalAnswers,
          website: String(data.get("website") ?? ""),
          source: {
            referrer: document.referrer || undefined,
            landingPath: window.location.pathname + window.location.search,
            utmSource: params.get("utm_source") ?? undefined,
            utmMedium: params.get("utm_medium") ?? undefined,
            utmCampaign: params.get("utm_campaign") ?? undefined,
          },
          timing: {
            startedAt: startedAt.current ?? undefined,
            durationMs: startedAt.current === null ? undefined : Date.now() - startedAt.current,
          },
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setFormError(body?.error ?? "Something went wrong. Please email us and we will pick it up.");
        setSubmitting(false);
        return;
      }
      setReference(body?.id ?? null);
      setSubmitted(true);
      setStage("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFormError("We could not reach the server. Please check your connection, or email us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ------------------------------------------------------------- Result */

  if (stage === "result") {
    const recommendation = buildRecommendation(answers);
    return (
      <div className="bg-bone py-14 sm:py-20">
        <Container width="default">
          <BriefResult answers={answers} recommendation={recommendation} reference={reference} submitted={submitted} />
        </Container>
      </div>
    );
  }

  /* ------------------------------------------------------------ Flow UI */

  return (
    <div className="bg-bone">
      {/* Progress */}
      <div className="sticky top-[76px] z-30 border-b border-stone-200 bg-bone/92 backdrop-blur-md">
        <Container width="default">
          <div className="flex items-center gap-5 py-3.5">
            <button
              type="button"
              onClick={back}
              disabled={stage === "questions" && index === 0}
              className="inline-flex items-center gap-1.5 text-[0.8125rem] text-stone-600 transition-colors hover:text-ink disabled:opacity-30"
            >
              <ArrowRight className="rotate-180" />
              Back
            </button>
            <div className="h-px flex-1 bg-stone-200" aria-hidden="true">
              <div
                className="h-px bg-crimson-600 transition-all duration-500"
                style={{ width: `${(step / total) * 100}%` }}
              />
            </div>
            <p className="shrink-0 text-[0.75rem] tabular-nums text-stone-500">
              {step} / {total}
            </p>
          </div>
        </Container>
      </div>

      <Container width="default">
        <div className="py-14 sm:py-20">
          <p aria-live="polite" className="sr-only">
            Step {step} of {total}
          </p>

          {stage === "questions" && current ? (
            <div key={current.id + String(index)} className="animate-rise">
              <p className="eyebrow mb-5">
                {current.short} · Question {step}
              </p>
              <h1 ref={headingRef} tabIndex={-1} className="text-display-sm outline-none sm:text-display-md">
                {current.prompt}
              </h1>
              {current.help ? <p className="measure-wide mt-4 text-[1.0625rem] text-stone-600">{current.help}</p> : null}

              <fieldset className="mt-10">
                <legend className="sr-only">{current.prompt}</legend>
                <div className="grid gap-px border border-stone-200 bg-stone-200">
                  {current.choices.map((choice) => {
                    const selected = (answers as Record<string, unknown>)[current.id] === choice.value;
                    return (
                      <button
                        key={choice.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => select(current, choice.value)}
                        className={cx(
                          "group flex items-start gap-5 px-6 py-5 text-left transition-colors duration-200 sm:px-7",
                          selected ? "bg-crimson-50" : "bg-parchment hover:bg-bone",
                        )}
                      >
                        <span
                          className={cx(
                            "mt-1.5 block h-3 w-3 shrink-0 rounded-full border transition-colors",
                            selected ? "border-crimson-600 bg-crimson-600" : "border-stone-400 group-hover:border-crimson-600",
                          )}
                          aria-hidden="true"
                        />
                        <span>
                          <span className="block font-display text-lg leading-snug text-ink">{choice.label}</span>
                          {choice.hint ? (
                            <span className="mt-1 block text-[0.875rem] leading-relaxed text-stone-500">{choice.hint}</span>
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <p className="mt-7 text-[0.8125rem] text-stone-500">
                Nothing is sent until the last step, and you can go back and change any answer.
              </p>
            </div>
          ) : null}

          {stage === "contact" ? (
            <form onSubmit={submit} noValidate className="animate-rise">
              <p className="eyebrow mb-5">Last step</p>
              <h1 ref={headingRef} tabIndex={-1} className="text-display-sm outline-none sm:text-display-md">
                Where should we send it?
              </h1>
              <p className="measure-wide mt-4 text-[1.0625rem] text-stone-600">
                Your brief is ready. Give us an address and it appears on the next screen and in your inbox — followed
                within one working day by a written proposal priced to it.
              </p>

              {/* Unwrapped: the notice renders null in a production build, and a
                  wrapper with a margin would leave a gap where nothing is. */}
              {notice}

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <Field label="Your name" name="name" required error={errors.name} autoComplete="name" />
                <Field label="Your role" name="role" placeholder="Director, Head of International, Founder" autoComplete="organization-title" />
                <Field label="Company" name="company" autoComplete="organization" />
                <Field label="Email" name="email" type="email" required error={errors.email} autoComplete="email" />
                <Field label="Telephone" name="phone" type="tel" hint="Include the country code" autoComplete="tel" />
                <Field label="City in India" name="originCity" hint="Optional — it tells us which clock you are on" />
              </div>

              <div className="mt-6">
                <label htmlFor="channel" className="block text-[0.8125rem] font-medium text-ink">
                  How would you prefer we reply?
                </label>
                <select
                  id="channel"
                  name="channel"
                  defaultValue="email"
                  className="mt-2 w-full border border-field bg-parchment px-4 py-3 text-[0.9375rem] text-ink transition-colors focus:border-crimson-600 sm:max-w-xs"
                >
                  <option value="email">Email</option>
                  <option value="phone">Telephone</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>

              <div className="mt-6">
                <label htmlFor="notes" className="block text-[0.8125rem] font-medium text-ink">
                  Anything else we should know?
                </label>
                <p className="mt-1 text-[0.8125rem] text-stone-500">
                  A deadline, a contract, a problem, a question the brief will not have answered. Optional, but it makes
                  the proposal considerably better.
                </p>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  className="mt-3 w-full border border-field bg-parchment px-4 py-3 text-[0.9375rem] leading-relaxed text-ink transition-colors focus:border-crimson-600"
                />
              </div>

              {/* Honeypot */}
              <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="mt-9 space-y-4 border-t border-stone-200 pt-8">
                <Checkbox
                  name="consent"
                  error={errors.consent}
                  label={
                    <>
                      I agree that {firm.legalName} may use these details to prepare and send my brief and to respond to
                      this enquiry, as described in the{" "}
                      <Link href="/legal/privacy" className="underline underline-offset-4 hover:text-ink" target="_blank">
                        privacy notice
                      </Link>
                      .
                    </>
                  }
                />
                <Checkbox
                  name="marketingConsent"
                  label="Send me occasional briefings on India–UK regulatory developments. No more than monthly, and you can stop them at any time."
                />
              </div>

              {formError ? (
                <p role="alert" className="mt-7 border-l-2 border-crimson-600 bg-crimson-50 px-5 py-4 text-[0.9375rem] text-ink">
                  {formError}
                </p>
              ) : null}

              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2.5 bg-crimson-600 px-8 py-4 text-[0.9375rem] font-medium text-bone transition-colors hover:bg-crimson-700 disabled:opacity-60"
                >
                  {submitting ? "Preparing your brief…" : "Show me my brief"}
                  {submitting ? null : <ArrowRight className="h-4 w-4" />}
                </button>
                <button type="button" onClick={back} className="text-[0.9375rem] text-stone-600 hover:text-ink">
                  Back
                </button>
              </div>

              <p className="mt-7 text-[0.75rem] leading-relaxed text-stone-500">
                No solicitor–client relationship arises from submitting this form, and nothing in the brief is legal
                advice. We do not sell or share your details. Records are kept for as long as set out in the privacy
                notice and you can ask us to delete them at any time.
              </p>
            </form>
          ) : null}
        </div>
      </Container>
    </div>
  );
}

/* ------------------------------------------------------------------ Fields */

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  hint,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  placeholder?: string;
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
        placeholder={placeholder}
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

function Checkbox({ name, label, error }: { name: string; label: React.ReactNode; error?: string }) {
  return (
    <div>
      <div className="flex items-start gap-3.5">
        <input
          id={name}
          name={name}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className="mt-1 h-4 w-4 shrink-0 accent-[#8b1e2d]"
        />
        <label htmlFor={name} className="text-[0.875rem] leading-relaxed text-stone-600">
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 pl-7 text-[0.75rem] text-crimson-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
