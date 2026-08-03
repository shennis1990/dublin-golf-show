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
      className="relative flex min-h-[85svh] items-end overflow-hidden pb-20 pt-28 md:min-h-[85svh] md:items-center md:pb-24 md:pt-28"
    >
      <div ref={layerRef} className="absolute inset-0 scale-105 will-change-transform">
        <Image
          src="/images/hero-hall.png"
          alt="Cinematic view of the Dublin Golf Show exhibition hall at RDS Simmonscourt"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center brightness-[0.88] contrast-[1.04] saturate-[0.95]"
        />
      </div>

      {/* Left content column — keeps type legible while letting photography breathe */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,17,28,0.88)_0%,rgba(10,17,28,0.62)_38%,rgba(10,17,28,0.22)_62%,rgba(10,17,28,0.08)_100%)]" />
      {/* Soft bottom fade into next section */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,17,28,0.35)_0%,transparent_28%,transparent_62%,rgba(10,17,28,0.78)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(10,17,28,0.35)_100%)]" />
      <div className="contour-drift absolute inset-0" aria-hidden>
        <Contour opacity={0.08} />
      </div>

      <Container className="relative z-10 w-full">
        <div className="flex max-w-xl flex-col items-start md:max-w-2xl">
          <h1 className="font-display text-[3rem] font-bold uppercase leading-[0.9] tracking-tight text-white sm:text-[3.75rem] md:text-[4.75rem] lg:text-[5.75rem]">
            Dublin Golf Show{" "}
            <span className="text-accent">2027</span>
          </h1>

          <p className="mt-5 font-display text-[1.35rem] font-normal uppercase leading-[1.05] tracking-tight text-white/85 sm:mt-6 sm:text-[1.65rem] md:text-[2rem] lg:text-[2.5rem]">
            Ireland&apos;s Festival of Golf
          </p>

          <div className="mt-8 h-px w-28 bg-gradient-to-r from-accent via-accent/70 to-transparent md:mt-9" />

          <p className="body-copy prose-width mt-8 text-white/75 md:mt-9">
            Ireland&apos;s biggest celebration of golf brings together players, brands,
            destinations and innovators for two unforgettable days at RDS Simmonscourt.
          </p>

          <div className="cta-row mt-10 md:mt-12">
            <RegisterInterestButton>Register Interest</RegisterInterestButton>
            <PartnerWithUsButton>Partner With Us</PartnerWithUsButton>
          </div>
        </div>
      </Container>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-white/45 transition-colors hover:text-white md:bottom-8"
        aria-label="Scroll to about"
      >
        <span className="flex h-9 w-px items-start justify-center overflow-hidden bg-white/20">
          <span className="scroll-dot block h-2 w-px bg-accent" />
        </span>
      </a>
    </section>
  );
}
