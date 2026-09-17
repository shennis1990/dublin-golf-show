"use client";

import { Contour } from "@/components/ui/Contour";
import { OverviewCarousel } from "@/components/sections/OverviewCarousel";
import { RegisterInterestButton } from "@/components/interest/RegisterInterestButton";
import { PartnerWithUsButton } from "@/components/partner/PartnerWithUsButton";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[#0A111C] lg:min-h-[78svh]"
    >
      {/* Signature hero contours — topographic brand mark, not ambient texture */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <Contour pattern="hero" className="scale-[1.35] origin-[12%_45%]" />
        {/* Secondary quieter layer for depth beneath the Stories column */}
        <Contour
          pattern="hero"
          opacity={0.35}
          className="scale-[1.15] origin-[70%_60%]"
        />
        {/* Soft centre wash so type stays primary */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_32%_48%,rgba(10,17,28,0.42)_0%,rgba(10,17,28,0.12)_42%,transparent_68%)]" />
      </div>

      <div className="relative z-10 mx-auto grid h-full max-w-7xl items-center gap-6 px-6 pb-16 pt-32 md:gap-7 md:px-10 md:pb-16 md:pt-36 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:gap-7 lg:px-14 lg:pb-14 lg:pt-32 xl:gap-8">
        {/* Left ~45% — copy */}
        <div className="relative flex items-center lg:pr-1">
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

        {/* Right ~55% — Stories as primary editorial feature */}
        <div className="relative flex h-full items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-[31.5rem] sm:max-w-[33.5rem] xl:max-w-[36rem]">
            <OverviewCarousel
              className="aspect-[4/5]"
              sizes="(max-width: 1024px) 90vw, min(36rem, 46vw)"
            />
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2.5 text-white/40 transition-colors hover:text-white lg:bottom-6"
        aria-label="Scroll to about"
      >
        <span className="flex h-7 w-px items-start justify-center overflow-hidden bg-white/20">
          <span className="scroll-dot block h-2 w-px bg-accent" />
        </span>
      </a>
    </section>
  );
}
