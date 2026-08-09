"use client";

import { Contour } from "@/components/ui/Contour";
import { OverviewCarousel } from "@/components/sections/OverviewCarousel";
import { RegisterInterestButton } from "@/components/interest/RegisterInterestButton";
import { PartnerWithUsButton } from "@/components/partner/PartnerWithUsButton";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[80svh] overflow-hidden bg-[#0A111C]"
    >
      <div className="grid min-h-[80svh] items-center gap-10 px-6 pb-16 pt-28 md:gap-12 md:px-10 md:pb-16 md:pt-28 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:gap-14 lg:px-14 lg:pb-14 xl:gap-16">
        {/* Left ~45% — brand copy */}
        <div className="relative z-10 flex flex-col justify-center lg:pr-4">
          <div className="pointer-events-none absolute inset-0 -mx-6 md:-mx-10 lg:mx-0" aria-hidden>
            <Contour pattern="ridge" opacity={0.07} />
          </div>

          <div className="relative flex max-w-xl flex-col items-start lg:max-w-none">
            <h1 className="font-display text-[2.85rem] font-bold uppercase leading-[0.9] tracking-tight text-white sm:text-[3.5rem] md:text-[4.4rem] lg:text-[5.35rem]">
              Dublin Golf Show{" "}
              <span className="text-accent">2027</span>
            </h1>

            <p className="mt-3 font-display text-[1.3rem] font-normal uppercase leading-[1.05] tracking-tight text-white/85 sm:mt-4 sm:text-[1.55rem] md:text-[1.85rem] lg:text-[2.25rem]">
              Ireland&apos;s Festival of Golf
            </p>

            <div className="mt-5 h-px w-28 bg-gradient-to-r from-accent via-accent/70 to-transparent md:mt-6" />

            <p className="body-copy prose-width mt-5 text-white/75 md:mt-6">
              Ireland&apos;s biggest celebration of golf brings together players, brands,
              destinations and innovators for two unforgettable days at RDS Simmonscourt.
            </p>

            <div className="cta-row mt-7 md:mt-8">
              <RegisterInterestButton>Get Ticket Updates</RegisterInterestButton>
              <PartnerWithUsButton>Exhibit at The Dublin Golf Show</PartnerWithUsButton>
            </div>
          </div>
        </div>

        {/* Right ~55% — Stories carousel as primary visual */}
        <div className="relative z-10 flex justify-center lg:justify-end lg:pl-2">
          <div className="w-full max-w-[19.5rem] sm:max-w-[21rem] md:max-w-[22.5rem] xl:max-w-[24rem]">
            <OverviewCarousel
              className="aspect-[4/5]"
              sizes="(max-width: 1024px) 90vw, 24rem"
            />
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-white/45 transition-colors hover:text-white md:bottom-6"
        aria-label="Scroll to about"
      >
        <span className="flex h-8 w-px items-start justify-center overflow-hidden bg-white/20">
          <span className="scroll-dot block h-2 w-px bg-accent" />
        </span>
      </a>
    </section>
  );
}
