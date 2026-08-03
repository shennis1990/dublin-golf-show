"use client";

import Image from "next/image";
import { Contour } from "@/components/ui/Contour";
import { RegisterInterestButton } from "@/components/interest/RegisterInterestButton";
import { PartnerWithUsButton } from "@/components/partner/PartnerWithUsButton";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[80svh] overflow-hidden bg-[#0A111C]"
    >
      <div className="grid min-h-[80svh] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Left ~40% — brand copy on solid dark, no hero image */}
        <div className="relative z-10 flex flex-col justify-center px-6 pb-14 pt-28 md:px-10 md:pb-16 md:pt-28 lg:px-14 lg:pb-16 xl:pr-10">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
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

        {/* Right ~60% — hero artwork only */}
        <div className="relative min-h-[52vh] lg:min-h-[80svh]">
          <Image
            src="/images/hero-entrance.jpg"
            alt="Visitors approaching the monumental Dublin Golf Show 2027 entrance into the exhibition"
            fill
            priority
            fetchPriority="high"
            quality={95}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-[52%_28%] md:object-[50%_26%] lg:object-[48%_24%]"
          />

          {/* CSS-only blend into the copy column — no baked image fade */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-[linear-gradient(180deg,#0A111C_0%,transparent_100%)] lg:hidden"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-[32%] bg-[linear-gradient(90deg,#0A111C_0%,rgba(10,17,28,0.72)_28%,rgba(10,17,28,0.28)_58%,transparent_100%)] lg:block"
            aria-hidden
          />
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
