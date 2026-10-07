"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { MARKETING_CONSENT_TEXT } from "@/lib/consent";
import {
  DEFAULT_INTEREST_SOURCE,
  type InterestSource,
} from "@/lib/interest";

const DEFAULT_SUCCESS_MESSAGE =
  "We look forward to welcoming you to the Dublin Golf Show 2027 and will keep you updated with tickets and news soon.";

export const DEFAULT_INTEREST_SUCCESS = {
  eyebrow: "Interest registered",
  title: "You're on the list",
  message: DEFAULT_SUCCESS_MESSAGE,
} as const;

const inputClass =
  "h-12 w-full rounded-full border border-white/15 bg-white/[0.03] px-5 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const labelClass =
  "mb-2 block font-display text-[14px] font-semibold uppercase tracking-[0.1em] text-white/45";

type InterestRegistrationFormProps = {
  idPrefix: string;
  source?: InterestSource;
  autoFocus?: boolean;
  titleId: string;
  descId: string;
  heading?: {
    eyebrow: string;
    title: string;
    description: ReactNode;
  };
  success: {
    eyebrow: string;
    title: string;
    message: ReactNode;
    action?: ReactNode;
  };
  footer?: ReactNode;
  layout?: "dialog" | "page";
};

export function InterestRegistrationForm({
  idPrefix,
  source = DEFAULT_INTEREST_SOURCE,
  autoFocus = false,
  titleId,
  descId,
  heading,
  success,
  footer,
  layout = "page",
}: InterestRegistrationFormProps) {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState("");
  const [openedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!autoFocus) return;
    const t = window.setTimeout(() => firstNameRef.current?.focus(), 40);
    return () => window.clearTimeout(t);
  }, [autoFocus]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    if (!consent) {
      setStatus("error");
      setError(
        "Please confirm you agree to be contacted about tickets and marketing updates.",
      );
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/register-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          consent,
          company,
          openedAt,
          source,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  const isDialog = layout === "dialog";

  if (status === "success") {
    return (
      <div
        className={
          isDialog
            ? "flex min-h-0 flex-col overflow-hidden pr-6"
            : "flex flex-col"
        }
      >
        <div
          className={
            isDialog ? "min-h-0 overflow-y-auto overscroll-contain" : undefined
          }
        >
          <p className="font-display text-[14px] font-semibold uppercase tracking-[0.12em] text-accent">
            {success.eyebrow}
          </p>
          <h2
            id={titleId}
            className="mt-4 font-display text-3xl font-bold uppercase leading-none tracking-tight text-white"
          >
            {success.title}
          </h2>
          <div
            id={descId}
            className="mt-5 text-base font-light leading-[1.9] text-white/70"
          >
            {typeof success.message === "string" ? (
              <p>{success.message}</p>
            ) : (
              success.message
            )}
          </div>
        </div>
        {success.action}
      </div>
    );
  }

  return (
    <div
      className={
        isDialog ? "flex min-h-0 flex-col overflow-hidden pr-4" : "flex flex-col"
      }
    >
      {heading ? (
        <div className={isDialog ? "shrink-0 pr-8" : undefined}>
          <p className="font-display text-[14px] font-semibold uppercase tracking-[0.12em] text-accent">
            {heading.eyebrow}
          </p>
          <h2
            id={titleId}
            className="mt-4 font-display text-3xl font-bold uppercase leading-none tracking-tight text-white"
          >
            {heading.title}
          </h2>
          <p
            id={descId}
            className="mt-4 text-base font-light leading-[1.9] text-white/65"
          >
            {heading.description}
          </p>
        </div>
      ) : null}

      <form
        onSubmit={onSubmit}
        className={
          isDialog
            ? "relative mt-8 flex min-h-0 flex-col overflow-hidden"
            : heading
              ? "relative mt-8 flex flex-col"
              : "relative flex flex-col"
        }
        noValidate
      >
        <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
          <label htmlFor={`${idPrefix}-company`}>Company</label>
          <input
            id={`${idPrefix}-company`}
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div
          className={
            isDialog
              ? "min-h-0 space-y-4 overflow-y-auto overscroll-contain"
              : "space-y-4"
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${idPrefix}-first-name`} className={labelClass}>
                First name
              </label>
              <input
                ref={firstNameRef}
                id={`${idPrefix}-first-name`}
                name="firstName"
                type="text"
                required
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
                placeholder="First name"
              />
            </div>

            <div>
              <label htmlFor={`${idPrefix}-last-name`} className={labelClass}>
                Last name
              </label>
              <input
                id={`${idPrefix}-last-name`}
                name="lastName"
                type="text"
                required
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label htmlFor={`${idPrefix}-email`} className={labelClass}>
              Email
            </label>
            <input
              id={`${idPrefix}-email`}
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@email.com"
            />
          </div>

          <label
            htmlFor={`${idPrefix}-consent`}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
          >
            <input
              id={`${idPrefix}-consent`}
              name="consent"
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-white/30 accent-[#009A6D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
            <span className="text-left text-[14px] font-light leading-[1.75] text-white/60">
              {MARKETING_CONSENT_TEXT}
            </span>
          </label>
        </div>

        <div className={isDialog ? "shrink-0 pt-4" : "pt-4"}>
          {status === "error" ? (
            <p className="mb-4 text-sm text-red-300" role="alert">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Sending…" : "Submit"}
          </Button>

          {footer}
        </div>
      </form>
    </div>
  );
}
