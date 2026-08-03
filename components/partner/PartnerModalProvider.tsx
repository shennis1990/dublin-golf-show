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

type PartnerModalContextValue = {
  openPartnerModal: () => void;
  closePartnerModal: () => void;
};

const PartnerModalContext = createContext<PartnerModalContextValue | null>(null);

export function usePartnerModal() {
  const ctx = useContext(PartnerModalContext);
  if (!ctx) {
    throw new Error("usePartnerModal must be used within PartnerModalProvider");
  }
  return ctx;
}

const SUCCESS_MESSAGE =
  "Thanks for your interest in partnering with Dublin Golf Show 2027. Our team will be in touch shortly.";

export function PartnerModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openPartnerModal = useCallback(() => setOpen(true), []);
  const closePartnerModal = useCallback(() => setOpen(false), []);

  return (
    <PartnerModalContext.Provider value={{ openPartnerModal, closePartnerModal }}>
      {children}
      <PartnerModal open={open} onClose={closePartnerModal} />
    </PartnerModalContext.Provider>
  );
}

function PartnerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const descId = useId();
  const firstNameRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
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
    setCompanyName("");
    setPhone("");
    setWebsite("");
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

    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/partner-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          companyName,
          phone,
          website,
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

  const inputClass =
    "h-12 w-full rounded-full border border-white/15 bg-white/[0.03] px-5 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  const labelClass =
    "mb-2 block font-display text-[14px] font-semibold uppercase tracking-[0.1em] text-white/45";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-10"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(7,13,22,0.78)] backdrop-blur-md"
        aria-label="Close partner enquiry dialog"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/12 bg-[#0c1522] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:p-9"
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
              Enquiry received
            </p>
            <h2
              id={titleId}
              className="mt-4 font-display text-3xl font-bold uppercase leading-none tracking-tight text-white"
            >
              We&apos;ll be in touch
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
              Partner With Us
            </p>
            <h2
              id={titleId}
              className="mt-4 font-display text-3xl font-bold uppercase leading-none tracking-tight text-white"
            >
              Showcase your brand
            </h2>
            <p
              id={descId}
              className="mt-4 text-base font-light leading-[1.9] text-white/65"
            >
              Tell us about your brand and we&apos;ll follow up on sponsorship, exhibitor
              and media opportunities for Dublin Golf Show 2027.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
              <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
                <label htmlFor="partner-website">Website</label>
                <input
                  id="partner-website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="partner-first-name" className={labelClass}>
                    First name
                  </label>
                  <input
                    ref={firstNameRef}
                    id="partner-first-name"
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
                  <label htmlFor="partner-last-name" className={labelClass}>
                    Last name
                  </label>
                  <input
                    id="partner-last-name"
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
                <label htmlFor="partner-company" className={labelClass}>
                  Company
                </label>
                <input
                  id="partner-company"
                  name="companyName"
                  type="text"
                  required
                  autoComplete="organization"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={inputClass}
                  placeholder="Company name"
                />
              </div>

              <div>
                <label htmlFor="partner-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="partner-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label htmlFor="partner-phone" className={labelClass}>
                  Phone
                </label>
                <input
                  id="partner-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  placeholder="+353…"
                />
              </div>

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
