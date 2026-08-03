import Image from "next/image";
import { Contour } from "@/components/ui/Contour";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RegisterInterestButton } from "@/components/interest/RegisterInterestButton";
import { PartnerWithUsButton } from "@/components/partner/PartnerWithUsButton";

export function ChooseExperience() {
  return (
    <section id="experience" className="section-y relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <Contour opacity={0.11} />
      </div>

      <Container className="relative">
        <Reveal className="mb-12 max-w-3xl md:mb-16">
          <p className="eyebrow">Choose Your Experience</p>
          <h2 className="heading-section mt-4 md:mt-5">
            Two ways into Ireland&apos;s Festival of Golf
          </h2>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <Reveal>
            <article
              id="register"
              className="media-frame group relative flex min-h-[64vh] flex-col justify-end md:min-h-[72vh]"
            >
              <Image
                src="/images/hall-3.png"
                alt="Visitors examining premium golf clubs on the exhibition floor"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,17,28,0.15)_0%,rgba(10,17,28,0.55)_45%,rgba(10,17,28,0.92)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,154,109,0.18),transparent_55%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

              <div className="relative z-10 flex flex-col p-8 md:p-12">
                <p className="eyebrow">For Golf Fans</p>
                <h3 className="mt-4 max-w-md font-display text-3xl font-bold uppercase leading-[0.95] tracking-tight text-white md:text-4xl lg:text-5xl">
                  Join Ireland&apos;s Festival of Golf
                </h3>
                <p className="mt-5 max-w-md text-base font-light leading-[1.9] text-white/70 md:text-lg">
                  Hit the driving range. Explore the latest equipment. Learn from the pros. Book
                  your next golf escape. Two days built for people who live and love the game.
                </p>
                <div className="mt-8">
                  <RegisterInterestButton>Notify Me About Tickets</RegisterInterestButton>
                </div>
              </div>
            </article>
          </Reveal>

          <Reveal delay={1}>
            <article
              id="partner"
              className="media-frame group relative flex min-h-[64vh] flex-col justify-end md:min-h-[72vh]"
            >
              <Image
                src="/images/hall-floor.png"
                alt="Guests entering the branded Dublin Golf Show exhibition hall"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,17,28,0.2)_0%,rgba(10,17,28,0.58)_45%,rgba(10,17,28,0.94)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,154,109,0.18),transparent_55%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

              <div className="relative z-10 flex flex-col p-8 md:p-12">
                <p className="eyebrow">For Brands, Sponsors, Exhibitors & Media</p>
                <h3 className="mt-4 max-w-md font-display text-3xl font-bold uppercase leading-[0.95] tracking-tight text-white md:text-4xl lg:text-5xl">
                  Showcase Your Brand
                </h3>
                <p className="mt-5 max-w-md text-base font-light leading-[1.9] text-white/70 md:text-lg">
                  Stand among Ireland&apos;s most engaged golf audience. Own a signature zone,
                  secure category presence, or cover the festival as media — with spaces limited
                  and allocated with intention.
                </p>
                <div className="mt-8">
                  <PartnerWithUsButton>Partner With Us</PartnerWithUsButton>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
