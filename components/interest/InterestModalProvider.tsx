"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/Button";
import { MARKETING_CONSENT_TEXT } from "@/lib/consent";

type InterestModalContextValue = {
  openInterestModal: () => void;
  closeInterestModal: () => void;
};

const InterestModalContext = createContext<InterestModalContextValue | null>(
  null,
);

export function useInterestModal() {
  const ctx = useContext(InterestModalContext);
  if (!ctx) {
    throw new Error("useInterestModal must be used within InterestModalProvider");
  }
  return ctx;
}

const SUCCESS_MESSAGE =
  "We look forward to welcoming you to the Dublin Golf Show 2027 and will keep you updated with tickets and news soon.";

export function InterestModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openInterestModal = useCallback(() => setOpen(true), []);
  const closeInterestModal = useCallback(() => setOpen(false), []);

  return (
    <InterestModalContext.Provider value={{ openInterestModal, closeInterestModal }}>
      {children}
      <InterestModal open={open} onClose={closeInterestModal} />
    </InterestModalContext.Provider>
  );
}

function InterestModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState(""); // honeypot
  const [openedAt, setOpenedAt] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setStatus("idle");
    setError("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setConsent(false);
    setCompany("");
    setOpenedAt(Date.now());

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => firstNameRef.current?.focus(), 40);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-10"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(7,13,22,0.78)] backdrop-blur-md"
        aria-label="Close register interest dialog"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/12 bg-[#0c1522] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:p-9"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/55 transition-colors hover:border-white/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Close"
        >
          <span aria-hidden className="text-lg leading-none">
            ×
          </span>
        </button>

        {status === "success" ? (
          <div className="pr-6">
            <p className="font-display text-[14px] font-semibold uppercase tracking-[0.12em] text-accent">
              Interest registered
            </p>
            <h2
              id={titleId}
              className="mt-4 font-display text-3xl font-bold uppercase leading-none tracking-tight text-white"
            >
              You&apos;re on the list
            </h2>
            <p
              id={descId}
              className="mt-5 text-base font-light leading-[1.9] text-white/70"
            >
              {SUCCESS_MESSAGE}
            </p>
            <Button type="button" className="mt-8 w-full" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <div className="pr-4">
            <p className="font-display text-[14px] font-semibold uppercase tracking-[0.12em] text-accent">
              Register Interest
            </p>
            <h2
              id={titleId}
              className="mt-4 font-display text-3xl font-bold uppercase leading-none tracking-tight text-white"
            >
              Stay close to the fairway
            </h2>
            <p
              id={descId}
              className="mt-4 text-base font-light leading-[1.9] text-white/65"
            >
              Leave your details and we&apos;ll keep you updated on tickets and news for
              Dublin Golf Show 2027.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
              <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
                <label htmlFor="interest-company">Company</label>
                <input
                  id="interest-company"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="interest-first-name"
                    className="mb-2 block font-display text-[14px] font-semibold uppercase tracking-[0.1em] text-white/45"
                  >
                    First name
                  </label>
                  <input
                    ref={firstNameRef}
                    id="interest-first-name"
                    name="firstName"
                    type="text"
                    required
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-12 w-full rounded-full border border-white/15 bg-white/[0.03] px-5 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="interest-last-name"
                    className="mb-2 block font-display text-[14px] font-semibold uppercase tracking-[0.1em] text-white/45"
                  >
                    Last name
                  </label>
                  <input
                    id="interest-last-name"
                    name="lastName"
                    type="text"
                    required
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-12 w-full rounded-full border border-white/15 bg-white/[0.03] px-5 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="interest-email"
                  className="mb-2 block font-display text-[14px] font-semibold uppercase tracking-[0.1em] text-white/45"
                >
                  Email
                </label>
                <input
                  id="interest-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-full border border-white/15 bg-white/[0.03] px-5 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  placeholder="you@email.com"
                />
              </div>

              <label
                htmlFor="interest-consent"
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
              >
                <input
                  id="interest-consent"
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

              {status === "error" ? (
                <p className="text-sm text-red-300" role="alert">
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
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
