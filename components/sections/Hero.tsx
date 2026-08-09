"use client";

import { Contour } from "@/components/ui/Contour";
import { OverviewCarousel } from "@/components/sections/OverviewCarousel";
import { RegisterInterestButton } from "@/components/interest/RegisterInterestButton";
import { PartnerWithUsButton } from "@/components/partner/PartnerWithUsButton";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[#0A111C] lg:h-[75svh] lg:min-h-[72svh] lg:max-h-[78svh]"
    >
      <div className="mx-auto grid h-full max-w-7xl items-center gap-8 px-6 pb-12 pt-28 md:gap-10 md:px-10 md:pb-14 md:pt-28 lg:grid-cols-2 lg:gap-12 lg:px-14 lg:pb-10 lg:pt-24 xl:gap-16">
        {/* Left 50% — copy, vertically centred with carousel */}
        <div className="relative z-10 flex items-center">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <Contour pattern="ridge" opacity={0.06} />
          </div>

          <div className="relative flex w-full max-w-[30rem] flex-col items-start xl:max-w-[32rem]">
            <h1 className="font-display text-[2.65rem] font-bold uppercase leading-[0.9] tracking-tight text-white sm:text-[3.25rem] md:text-[3.85rem] lg:text-[4.5rem] xl:text-[4.85rem]">
              Dublin Golf Show{" "}
              <span className="text-accent">2027</span>
            </h1>

            <p className="mt-2.5 font-display text-[1.2rem] font-normal uppercase leading-[1.05] tracking-tight text-white/85 sm:mt-3 sm:text-[1.4rem] md:text-[1.65rem] lg:text-[1.85rem]">
              Ireland&apos;s Festival of Golf
            </p>

            <div className="mt-4 h-px w-24 bg-gradient-to-r from-accent via-accent/70 to-transparent md:mt-5" />

            <p className="body-copy mt-4 max-w-[28rem] text-white/75 md:mt-5">
              Ireland&apos;s biggest celebration of golf brings together players, brands,
              destinations and innovators for two unforgettable days at RDS Simmonscourt.
            </p>

            <div className="cta-row mt-6 md:mt-7">
              <RegisterInterestButton>Get Ticket Updates</RegisterInterestButton>
              <PartnerWithUsButton>Exhibit at The Dublin Golf Show</PartnerWithUsButton>
            </div>
          </div>
        </div>

        {/* Right 50% — anchored Stories feature */}
        <div className="relative z-10 flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-[400px] shrink-0 lg:w-[400px]">
            <OverviewCarousel
              className="aspect-[4/5] shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
              sizes="(max-width: 1024px) 90vw, 400px"
            />
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2.5 text-white/40 transition-colors hover:text-white lg:bottom-5"
        aria-label="Scroll to about"
      >
        <span className="flex h-7 w-px items-start justify-center overflow-hidden bg-white/20">
          <span className="scroll-dot block h-2 w-px bg-accent" />
        </span>
      </a>
    </section>
  );
}
