"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setSubmitting(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.replace("/admin/leads");
    } else {
      setSubmitting(false);
      setError(true);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[100rem]">
      <div className="mt-20 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-20">
        <div className="max-w-[24rem]">
          <div className="mb-6">
            <h1 className="font-display text-4xl tracking-tight text-ink">Fiat Law</h1>
            <p className="mt-1 text-[0.875rem] text-stone-600">Admin login</p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-4"
          >
            <label className="flex flex-col gap-1.5">
              <span className="text-[0.75rem] uppercase tracking-[0.12em] text-stone-500">Password</span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 rounded border border-stone-200 bg-bone px-3 py-2 text-[0.9375rem] text-ink outline outline-0 focus:outline-2 focus:ring-1 focus:border-ink transition-colors"
                autoComplete="current-password"
                required
              />
            </label>
            {error && (
              <p className="mt-2 text-[0.75rem] text-crimson-600">
                Incorrect password. Please try again.
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 flex items-center justify-center gap-2 rounded bg-crimson-600 px-6 py-2.5 text-[0.875rem] font-medium text-bone transition-colors hover:bg-crimson-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}