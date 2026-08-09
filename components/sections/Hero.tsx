"use client";

import { Contour } from "@/components/ui/Contour";
import { OverviewCarousel } from "@/components/sections/OverviewCarousel";
import { RegisterInterestButton } from "@/components/interest/RegisterInterestButton";
import { PartnerWithUsButton } from "@/components/partner/PartnerWithUsButton";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[#0A111C] lg:h-[73svh] lg:min-h-[72svh] lg:max-h-[75svh]"
    >
      {/* Contour layers — architectural depth across the full hero */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <Contour
          pattern="ridge"
          opacity={0.13}
          className="scale-[1.55] origin-[8%_42%]"
        />
        <Contour
          pattern="green"
          opacity={0.07}
          className="scale-[1.25] origin-[20%_70%]"
        />
        <Contour
          anchor="bottom-left"
          opacity={0.06}
          className="scale-110 origin-bottom-left"
        />
        {/* Soft fade toward centre so contours texture the field without fighting type */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,17,28,0.15)_0%,rgba(10,17,28,0.45)_38%,rgba(10,17,28,0.55)_52%,rgba(10,17,28,0.2)_72%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_35%_45%,rgba(10,17,28,0.5)_0%,transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto grid h-full max-w-7xl items-center gap-6 px-6 pb-12 pt-28 md:gap-8 md:px-10 md:pb-12 md:pt-28 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:gap-8 lg:px-14 lg:pb-8 lg:pt-24 xl:gap-10">
        {/* Left ~45% — copy */}
        <div className="relative flex items-center lg:pr-2">
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
          <div className="relative w-full max-w-[28rem] sm:max-w-[30rem] xl:max-w-[32rem]">
            {/* Contours continue behind the card for depth */}
            <div
              className="pointer-events-none absolute -inset-12 -z-10 lg:-inset-16"
              aria-hidden
            >
              <Contour
                pattern="apron"
                opacity={0.09}
                className="scale-125 origin-center"
              />
            </div>

            <OverviewCarousel
              className="aspect-[4/5]"
              sizes="(max-width: 1024px) 90vw, min(32rem, 42vw)"
            />
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-3.5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/40 transition-colors hover:text-white lg:bottom-4"
        aria-label="Scroll to about"
      >
        <span className="flex h-6 w-px items-start justify-center overflow-hidden bg-white/20">
          <span className="scroll-dot block h-2 w-px bg-accent" />
        </span>
      </a>
    </section>
  );
}
