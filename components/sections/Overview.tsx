import { AnimatedStat } from "@/components/ui/AnimatedStat";
import { Contour } from "@/components/ui/Contour";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const zones = [
  "Driving Range",
  "Main Stage",
  "Equipment",
  "Travel",
  "Fashion",
  "Short Game",
];

export function Overview() {
  return (
    <section id="about" className="section-y relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <Contour pattern="green" opacity={0.06} />
      </div>

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16 xl:gap-20">
          {/* Editorial copy — primary focus */}
          <div className="lg:col-span-7 xl:col-span-8">
            <Reveal>
              <p className="eyebrow">Event Overview</p>
              <h2 className="heading-section mt-4 max-w-3xl md:mt-5">
                Two days. Closer to the game you love.
              </h2>
            </Reveal>

            <Reveal delay={1} className="mt-7 grid gap-5 md:mt-8 md:grid-cols-2 md:gap-8 lg:gap-10">
              <p className="body-copy">
                Walk into RDS Simmonscourt and you&apos;re in the middle of it — clubs to try,
                places to go, coaches to learn from, and a weekend crowd that feels like your
                favourite golfing friends, gathered in one place.
              </p>
              <p className="body-copy">
                Come to hit balls. Come to discover something new. Come to hear the names you
                follow. Or simply come to spend two days immersed in Ireland&apos;s festival of
                golf.
              </p>
            </Reveal>
          </div>

          {/* Integrated stats — magazine sidebar */}
          <Reveal
            delay={1}
            className="flex flex-col justify-center border-t border-line pt-8 sm:flex-row sm:gap-10 lg:col-span-5 lg:border-l lg:border-t-0 lg:pt-0 lg:pl-10 xl:col-span-4 xl:pl-12"
          >
            <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 lg:grid-cols-1 lg:gap-9">
              <AnimatedStat compact value="25,000+" label="Visitors" />
              <AnimatedStat compact value="100+" label="Brands" />
              <AnimatedStat compact value="100,000" unit="sq ft" label="Experience" />
            </div>
          </Reveal>
        </div>

        <Reveal delay={2} className="mt-12 border-t border-line pt-8 md:mt-14 md:pt-10">
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            {zones.map((zone) => (
              <span
                key={zone}
                className="font-display text-[15px] font-semibold uppercase tracking-[0.1em] text-white/55 transition-colors duration-300 hover:text-accent"
              >
                {zone}
              </span>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
