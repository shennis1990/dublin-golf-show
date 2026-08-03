import Image from "next/image";
import { Contour } from "@/components/ui/Contour";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RegisterInterestButton } from "@/components/interest/RegisterInterestButton";
import { PartnerWithUsButton } from "@/components/partner/PartnerWithUsButton";

export function ChooseExperience() {
  return (
    <>
      {/* Journey 1 — Golf Fans: image left, content right */}
      <section
        id="experience"
        className="section-y relative overflow-hidden"
        aria-labelledby="fans-heading"
      >
        <div className="absolute inset-0" aria-hidden>
          <Contour pattern="swale" opacity={0.05} />
        </div>

        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
            <Reveal>
              <div
                id="register"
                className="media-frame group relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/6] lg:min-h-[72vh] lg:aspect-auto"
              >
                <Image
                  src="/images/fans-entrance.jpg"
                  alt="Visitors approaching the Dublin Golf Show 2027 entrance into the exhibition hall"
                  fill
                  loading="lazy"
                  quality={95}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-[center_42%] transition-transform duration-[1.6s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A111C]/35 via-transparent to-transparent" />
              </div>
            </Reveal>

            <Reveal delay={1} className="lg:py-8">
              <p className="eyebrow">For Golf Fans</p>
              <h2
                id="fans-heading"
                className="heading-section mt-4 max-w-xl md:mt-5"
              >
                Experience Ireland&apos;s Festival of Golf
              </h2>
              <p className="body-copy prose-width mt-7 md:mt-8">
                Discover the latest equipment and apparel, test cutting-edge golf technology,
                explore unforgettable golf destinations and watch live demonstrations from
                leading coaches and tour professionals.
              </p>
              <p className="body-copy prose-width mt-5">
                Whether you&apos;re looking to improve your game, find your next set of clubs,
                plan your next golf trip or simply enjoy the atmosphere, Dublin Golf Show brings
                everything you love about golf together under one roof.
              </p>
              <div className="mt-10 md:mt-12">
                <RegisterInterestButton>Get Ticket Updates</RegisterInterestButton>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Journey 2 — Partners: content left, image right */}
      <section
        id="partner"
        className="section-y relative overflow-hidden"
        aria-labelledby="partners-heading"
      >
        <div className="absolute inset-0" aria-hidden>
          <Contour pattern="ridge" opacity={0.05} />
        </div>

        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
            <Reveal className="order-2 lg:order-1 lg:py-8">
              <p className="eyebrow">For Exhibitors, Sponsors & Media</p>
              <h2
                id="partners-heading"
                className="heading-section mt-4 max-w-xl md:mt-5"
              >
                Showcase Your Brand
              </h2>
              <p className="body-copy prose-width mt-7 md:mt-8">
                Stand among Ireland&apos;s most engaged golf audience. Own a signature zone,
                secure category presence, or cover the festival as media — with spaces limited
                and allocated with intention.
              </p>
              <p className="body-copy prose-width mt-5">
                From flagship sponsorship to curated exhibitor stands, partner with a festival
                built to connect your brand with thousands of passionate golfers.
              </p>
              <div className="mt-10 md:mt-12">
                <PartnerWithUsButton>Exhibit at The Dublin Golf Show</PartnerWithUsButton>
              </div>
            </Reveal>

            <Reveal delay={1} className="order-1 lg:order-2">
              <div className="media-frame group relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/6] lg:min-h-[72vh] lg:aspect-auto">
                <Image
                  src="/images/partners-floor.jpg"
                  alt="Exhibitors and visitors in conversation on the Dublin Golf Show exhibition floor"
                  fill
                  loading="lazy"
                  quality={95}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-[center_45%] transition-transform duration-[1.6s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A111C]/35 via-transparent to-transparent" />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
