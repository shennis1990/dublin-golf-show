"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Contour } from "@/components/ui/Contour";
import { Container } from "@/components/ui/Container";
import { RegisterInterestButton } from "@/components/interest/RegisterInterestButton";
import { PartnerWithUsButton } from "@/components/partner/PartnerWithUsButton";

export function Hero() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const onScroll = () => {
      const y = window.scrollY;
      if (y > window.innerHeight) return;
      layer.style.transform = `translate3d(0, ${y * 0.28}px, 0) scale(1.08)`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-end overflow-hidden pb-28 pt-28 md:items-center md:pb-[18vh] md:pt-24"
    >
      <div ref={layerRef} className="absolute inset-0 scale-105 will-change-transform">
        <Image
          src="/images/hero-hall.png"
          alt="Cinematic view of the Dublin Golf Show exhibition hall at RDS Simmonscourt"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center brightness-[0.72] contrast-[1.05] saturate-[0.92] blur-[2px] scale-105"
        />
      </div>

      {/* Stronger dark wash for type contrast */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,17,28,0.72)_0%,rgba(10,17,28,0.78)_40%,rgba(10,17,28,0.94)_100%)]" />
      {/* Soft emerald lift behind the focal area */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_45%,rgba(0,154,109,0.14)_0%,transparent_52%)]" />
      {/* Edge vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_28%,rgba(10,17,28,0.55)_72%,rgba(10,17,28,0.88)_100%)]" />
      <div className="contour-drift absolute inset-0" aria-hidden>
        <Contour opacity={0.12} />
      </div>

      <Container className="relative z-10 w-full md:-translate-y-8 lg:-translate-y-12">
        <div className="max-w-4xl">
          <h1 className="font-display text-[3.4rem] font-bold uppercase leading-[0.9] tracking-tight text-white sm:text-[4.05rem] md:text-[5.05rem] lg:text-[6.5rem]">
            Dublin Golf Show{" "}
            <span className="text-accent">2027</span>
          </h1>

          <p className="mt-6 font-display text-[1.55rem] font-normal uppercase leading-[1.05] tracking-tight text-white/85 sm:mt-7 sm:text-[1.85rem] md:mt-8 md:text-[2.3rem] lg:text-[2.95rem]">
            Ireland&apos;s Festival of Golf
          </p>

          <div className="mt-9 h-px w-36 bg-gradient-to-r from-accent via-accent/70 to-transparent md:mt-10" />

          <p className="mt-10 max-w-md text-base font-light leading-relaxed text-white/75 md:mt-12 md:text-lg">
            Ireland&apos;s biggest celebration of golf brings together players, brands,
            destinations and innovators for two unforgettable days at RDS Simmonscourt.
          </p>

          <div className="mt-12 flex flex-wrap gap-4 md:mt-14">
            <RegisterInterestButton className="!px-9 !py-4 !text-[14px]">
              Register Interest
            </RegisterInterestButton>
            <PartnerWithUsButton className="!border-white/25 !px-9 !py-4 !text-[14px] hover:!border-accent/60">
              Partner With Us
            </PartnerWithUsButton>
          </div>
        </div>
      </Container>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-white/45 transition-colors hover:text-white"
        aria-label="Scroll to about"
      >
        <span className="flex h-10 w-px items-start justify-center overflow-hidden bg-white/20">
          <span className="scroll-dot block h-2 w-px bg-accent" />
        </span>
      </a>
    </section>
  );
}
