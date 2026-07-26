import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Contour } from "@/components/ui/Contour";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RegisterInterestButton } from "@/components/interest/RegisterInterestButton";

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
          <Contour className="contour-drift" opacity={0.18} />
        </div>
      </div>

      <Container className="relative flex min-h-[85vh] items-center py-28 md:py-36">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <h2
              id="final-statement-heading"
              className="font-display text-5xl font-semibold uppercase leading-[0.92] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            >
              The Future of Golf
              <span className="block text-accent">Comes Together.</span>
            </h2>
          </Reveal>

          <Reveal delay={1}>
            <p className="mx-auto mt-8 max-w-2xl text-base font-light leading-relaxed text-white/70 md:text-lg">
              Whether you play, coach, travel, innovate, invest or simply love the game, Dublin
              Golf Show is where Ireland&apos;s golf community comes together.
            </p>
          </Reveal>

          <Reveal delay={2} className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <RegisterInterestButton>Register Interest</RegisterInterestButton>
            <Button
              href="mailto:hello@dublingolfshow.ie?subject=Partnership%20Enquiry%20%E2%80%94%20Dublin%20Golf%20Show%202027"
              variant="ghost"
            >
              Partner With Us
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
