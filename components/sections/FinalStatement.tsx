import Image from "next/image";
import { Contour } from "@/components/ui/Contour";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RegisterInterestButton } from "@/components/interest/RegisterInterestButton";
import { PartnerWithUsButton } from "@/components/partner/PartnerWithUsButton";

export function FinalStatement() {
  return (
    <section
      className="relative overflow-hidden"
      aria-labelledby="final-statement-heading"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/hall-2.png"
          alt="Wide view of the Dublin Golf Show arena atmosphere"
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,17,28,0.75)_0%,rgba(10,17,28,0.82)_50%,rgba(10,17,28,0.94)_100%)]" />
        <div aria-hidden>
          <Contour pattern="apron" opacity={0.08} />
        </div>
      </div>

      <Container className="section-y relative flex min-h-[72vh] items-center md:min-h-[78vh]">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <h2
              id="final-statement-heading"
              className="font-display text-4xl font-bold uppercase leading-[0.92] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              The Future of Golf
              <span className="block text-accent">Comes Together.</span>
            </h2>
          </Reveal>

          <Reveal delay={1}>
            <p className="body-copy mx-auto mt-7 max-w-xl text-white/70 md:mt-8">
              Whether you play, coach, travel, innovate, invest or simply love the game, Dublin
              Golf Show is where Ireland&apos;s golf community comes together.
            </p>
          </Reveal>

          <Reveal delay={2} className="cta-row mt-10 justify-center md:mt-12">
            <RegisterInterestButton>Get Ticket Updates</RegisterInterestButton>
            <PartnerWithUsButton>Exhibit at Dublin Golf Show</PartnerWithUsButton>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
