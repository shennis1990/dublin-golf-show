"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/Button";
import {
  DEFAULT_INTEREST_SUCCESS,
  InterestRegistrationForm,
} from "@/components/interest/InterestRegistrationForm";

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

  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] md:px-6 md:py-10"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(7,13,22,0.78)] backdrop-blur-md"
        aria-label="Close ticket updates dialog"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-10 flex min-h-0 w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#0c1522] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.45)] max-h-[calc(100dvh-2rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] md:max-h-[min(90vh,calc(100dvh-5rem))] md:p-9"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 text-white/55 transition-colors hover:border-white/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Close"
        >
          <span aria-hidden className="text-lg leading-none">
            ×
          </span>
        </button>

        <InterestRegistrationForm
          idPrefix="interest"
          source="register-interest"
          autoFocus
          titleId={titleId}
          descId={descId}
          layout="dialog"
          heading={{
            eyebrow: "Get Ticket Updates",
            title: "Be part of what's coming",
            description:
              "Leave your details and we'll keep you updated on tickets and news for the Dublin Golf Show 2027.",
          }}
          success={{
            eyebrow: DEFAULT_INTEREST_SUCCESS.eyebrow,
            title: DEFAULT_INTEREST_SUCCESS.title,
            message: DEFAULT_INTEREST_SUCCESS.message,
            action: (
              <Button type="button" className="mt-8 w-full shrink-0" onClick={onClose}>
                Close
              </Button>
            ),
          }}
        />
      </div>
    </div>
  );
}
