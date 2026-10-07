"use client";

import { useId } from "react";
import { InterestRegistrationForm } from "@/components/interest/InterestRegistrationForm";
import { siteConfig } from "@/lib/site";

const textLinkClass =
  "text-white/85 underline decoration-accent/50 underline-offset-[5px] transition-colors hover:text-accent hover:decoration-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function InstagramHandle() {
  return (
    <a
      href={siteConfig.social.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className={textLinkClass}
    >
      @dublingolfshow
    </a>
  );
}

export function RegisterIrishOpenForm() {
  const titleId = useId();
  const descId = useId();

  return (
    <div className="relative w-full max-w-md rounded-2xl border border-white/12 bg-[#0c1522] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:p-9">
      <InterestRegistrationForm
        idPrefix="irish-open"
        source="register-irish-open"
        autoFocus
        titleId={titleId}
        descId={descId}
        layout="page"
        success={{
          eyebrow: "Interest registered",
          title: "Thank you — you're registered",
          message: (
            <div className="space-y-4">
              <p>Your Dublin Golf Show 2027 registration has been received.</p>
              <p>
                Remember to follow <InstagramHandle /> on Instagram to complete
                your competition entry.
              </p>
              <p>Limited to the first 1,000 eligible registrations.</p>
            </div>
          ),
        }}
      />
    </div>
  );
}
