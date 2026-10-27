import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { Footer } from "@/components/layout/Footer";
import { Contour } from "@/components/ui/Contour";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site";

const PAGE_TITLE =
  "Dublin Golf Show 2027 | Competition Terms & Conditions & Privacy Notice";
const PAGE_DESCRIPTION =
  "Competition Terms & Conditions and Privacy Notice for the Dublin Golf Show 2027 competition to win two tickets to the 2027 Irish Open at The K Club.";

export const metadata: Metadata = {
  title: {
    absolute: PAGE_TITLE,
  },
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: siteConfig.terms.path,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: siteConfig.terms.path,
  },
  twitter: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

const textLinkClass =
  "text-white/85 underline decoration-accent/50 underline-offset-[5px] transition-colors hover:text-accent hover:decoration-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const listClass =
  "body-copy space-y-2 pl-5 marker:text-accent md:space-y-2.5";

function BackLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.03] px-6 py-2.5 font-display text-[14px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-all duration-500 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      Back to Dublin Golf Show
    </Link>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-line pt-8 md:pt-10">
      <h2 className="font-display text-[1.35rem] font-bold tracking-tight text-white md:text-[1.5rem]">
        {title}
      </h2>
      <div className="mt-4 space-y-4 md:mt-5 md:space-y-5">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Contour anchor="top-right" opacity={0.1} />
      </div>

      <header className="relative z-10 border-b border-white/10">
        <nav
          className="mx-auto flex h-20 max-w-7xl items-center px-6 md:h-[5.25rem] md:px-10 lg:px-14"
          aria-label="Terms page"
        >
          <Link
            href="/"
            aria-label="Dublin Golf Show 2027"
            className="relative rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <BrandLogo />
          </Link>
        </nav>
      </header>

      <main id="main-content" className="relative">
        <Container className="relative pt-8 pb-[var(--section-y)] md:pt-16 md:pb-[var(--section-y-md)] lg:pt-20 lg:pb-[var(--section-y-lg)]">
          <article className="max-w-[60rem]">
            <BackLink className="mb-5 md:mb-6" />

            <p className="eyebrow">Dublin Golf Show 2027</p>
            <h1 className="heading-section mt-4 md:mt-5">
              Competition Terms &amp; Conditions and Privacy Notice
            </h1>
            <p className="mt-5 font-display text-[14px] font-semibold uppercase tracking-[0.1em] text-white/45 md:mt-6">
              Last updated: 07/10/2026
            </p>

            <div className="mt-4 h-px w-24 bg-gradient-to-r from-accent via-accent/70 to-transparent md:mt-5" />

            <h2 className="mt-10 font-display text-[1.65rem] font-bold uppercase leading-[1.05] tracking-tight text-accent md:mt-14 md:text-[2rem]">
              WIN TWO TICKETS TO THE 2027 IRISH OPEN
            </h2>

            <div className="mt-6 space-y-5 md:mt-8 md:space-y-6">
              <p className="body-copy">
                These Terms &amp; Conditions apply to the Dublin Golf Show 2027
                competition to win two tickets to the 2027 Irish Open (the
                “Competition”).
              </p>
              <p className="body-copy">
                By entering the Competition, you agree to be bound by these Terms
                &amp; Conditions.
              </p>
            </div>

            <div className="mt-12 space-y-0 md:mt-16">
              <Section title="1. Promoter">
                <p className="body-copy">The Competition is organised by:</p>
                <p className="body-copy">JKLM Media DAC</p>
                <p className="body-copy">
                  referred to in these Terms as “Dublin Golf Show”, “we”, “us” or
                  “the Promoter”.
                </p>
                <p className="body-copy">
                  For questions regarding the Competition, please contact:
                </p>
                <p className="body-copy">
                  <a href={`mailto:${siteConfig.email}`} className={textLinkClass}>
                    hello@dublingolfshow.ie
                  </a>
                </p>
              </Section>

              <Section title="2. Competition period">
                <p className="body-copy">
                  The Competition opens at 19:30 on 07/10/2026.
                </p>
                <p className="body-copy">
                  The Competition will close when 1,000 eligible entries have been
                  received, or at 23:59 on 31/12/2026, whichever occurs first.
                </p>
                <p className="body-copy">
                  The Promoter may close the Competition earlier if the first
                  1,000 eligible entries are received.
                </p>
                <p className="body-copy">
                  The date and time recorded by the Promoter&apos;s registration
                  system will determine the order in which entries are received.
                </p>
              </Section>

              <Section title="3. Eligibility">
                <p className="body-copy">
                  The Competition is open to residents of Republic of Ireland and
                  Northern Ireland aged 18 years or over at the time of entry.
                </p>
                <p className="body-copy">
                  Employees of the Promoter, its associated companies, agencies,
                  professional advisers, and anyone directly involved in organising
                  or administering the Competition, together with their immediate
                  family members, are not eligible to enter.
                </p>
                <p className="body-copy">
                  The Promoter reserves the right to request reasonable evidence of
                  age, identity and eligibility.
                </p>
              </Section>

              <Section title="4. How to enter">
                <p className="body-copy">To enter the Competition, you must:</p>
                <ol className={`${listClass} list-decimal`}>
                  <li>
                    Register your interest for Dublin Golf Show 2027 through the
                    official registration form at{" "}
                    <Link
                      href={siteConfig.irishOpen.path}
                      className={textLinkClass}
                    >
                      www.dublingolfshow.ie/register-irish-open
                    </Link>; and
                  </li>
                  <li>
                    Follow{" "}
                    <a
                      href={siteConfig.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={textLinkClass}
                    >
                      @dublingolfshow
                    </a>{" "}
                    on Instagram at the time the Competition closes.
                  </li>
                </ol>
                <p className="body-copy">
                  Only entries satisfying both requirements will be considered
                  eligible.
                </p>
                <p className="body-copy">
                  No purchase is necessary to enter.
                </p>
                <p className="body-copy">
                  There is a limit of one entry per person.
                </p>
                <p className="body-copy">
                  Multiple registrations, duplicate entries, automated entries,
                  entries submitted on behalf of another person, or entries which
                  are incomplete, inaccurate or otherwise invalid may be
                  disqualified.
                </p>
                <p className="body-copy">
                  The Competition is limited to the first 1,000 eligible
                  registrations.
                </p>
                <p className="body-copy">
                  Being one of the first 1,000 people to register does not itself
                  guarantee that an entry is valid. The entrant must satisfy all
                  eligibility and entry requirements.
                </p>
              </Section>

              <Section title="5. Prize">
                <p className="body-copy">There will be one winner.</p>
                <p className="body-copy">The winner will receive:</p>
                <p className="body-copy">
                  Two tickets to the 2027 Irish Open at The K Club, Ireland.
                </p>
                <p className="body-copy">
                  The prize is subject to the terms, conditions and restrictions
                  imposed by the relevant ticket issuer and/or event organiser.
                </p>
                <p className="body-copy">
                  The prize is non-transferable unless otherwise permitted by the
                  Promoter or ticket issuer and cannot be exchanged for cash or
                  another prize.
                </p>
                <p className="body-copy">
                  The Promoter reserves the right, where reasonably necessary, to
                  substitute the prize with a prize of equal or greater value.
                </p>
                <p className="body-copy">
                  The Promoter is not responsible for any costs associated with the
                  winner&apos;s attendance at the Irish Open that are not expressly
                  included in the prize, including travel, accommodation, food,
                  parking or other personal expenses.
                </p>
              </Section>

              <Section title="6. Winner selection">
                <p className="body-copy">
                  The winner will be selected at random from all eligible entries
                  received within the first 1,000 eligible entries.
                </p>
                <p className="body-copy">
                  The draw will be conducted by the Promoter or by an independent
                  person appointed by the Promoter.
                </p>
                <p className="body-copy">
                  The draw will take place on 01/03/2027.
                </p>
                <p className="body-copy">
                  The Promoter&apos;s decision regarding eligibility and the
                  selection of the winner is final, subject to applicable law.
                </p>
              </Section>

              <Section title="7. Contacting the winner">
                <p className="body-copy">
                  The winner will be contacted using the email address provided
                  when registering for Dublin Golf Show 2027.
                </p>
                <p className="body-copy">
                  The winner will be asked to provide reasonable information
                  required to verify their identity and eligibility and to
                  facilitate delivery of the prize.
                </p>
                <p className="body-copy">
                  If the winner does not respond within 7 Days of the
                  Promoter&apos;s first attempt to contact them, or cannot
                  reasonably demonstrate that they meet the eligibility
                  requirements, the Promoter reserves the right to select an
                  alternative winner from the remaining eligible entries.
                </p>
              </Section>

              <Section title="8. Winner announcement">
                <p className="body-copy">
                  The first name and/or surname initial of the winner may be
                  published on Dublin Golf Show&apos;s website and/or social media
                  channels where permitted by law and where the winner has been
                  appropriately informed.
                </p>
                <p className="body-copy">
                  The Promoter will not publish unnecessary personal information
                  about the winner.
                </p>
                <p className="body-copy">
                  The winner may object to publication or request that their
                  details are presented in a manner that minimises identification,
                  subject to the Promoter&apos;s legal obligations and applicable
                  promotional rules.
                </p>
              </Section>

              <Section title="9. Disqualification">
                <p className="body-copy">
                  The Promoter reserves the right to disqualify any entrant where
                  it reasonably believes that the entrant:
                </p>
                <ul className={`${listClass} list-disc`}>
                  <li>has breached these Terms &amp; Conditions;</li>
                  <li>has provided false or misleading information;</li>
                  <li>has attempted to enter more than once;</li>
                  <li>has used automated or fraudulent means to enter;</li>
                  <li>has interfered with the operation of the Competition; or</li>
                  <li>has otherwise attempted to obtain an unfair advantage.</li>
                </ul>
                <p className="body-copy">
                  The Promoter may also refuse an entry where it reasonably
                  believes that the entry is incomplete, illegible, fraudulent or
                  otherwise invalid.
                </p>
              </Section>

              <Section title="10. Changes to the Competition">
                <p className="body-copy">
                  The Promoter reserves the right, where reasonably necessary and
                  where circumstances outside its reasonable control require it, to
                  amend, suspend or withdraw the Competition.
                </p>
                <p className="body-copy">
                  Where reasonably possible, any material change will be
                  communicated through the Dublin Golf Show website and/or official
                  social media channels.
                </p>
                <p className="body-copy">
                  Nothing in these Terms &amp; Conditions limits any rights or
                  remedies that cannot lawfully be excluded.
                </p>
                <h3 className="font-display text-[1.15rem] font-bold tracking-tight text-white md:text-[1.25rem]">
                  Cancellation of Dublin Golf Show
                </h3>
                <p className="body-copy">
                  The Competition is being run in connection with Dublin Golf Show
                  2027, currently scheduled to take place on 19–20 June 2027 at RDS
                  Simmonscourt, Dublin.
                </p>
                <p className="body-copy">
                  If Dublin Golf Show 2027 is cancelled, postponed indefinitely, or
                  otherwise does not proceed for any reason, the Competition will
                  automatically become void and no prize will be awarded.
                </p>
                <p className="body-copy">
                  In such circumstances, the Promoter will have no obligation to
                  provide an alternative prize or compensation to entrants.
                </p>
                <p className="body-copy">
                  The Promoter will communicate any such cancellation through the
                  Dublin Golf Show website and, where appropriate, its official
                  social media channels.
                </p>
              </Section>

              <Section title="11. Liability">
                <p className="body-copy">The Promoter will not be responsible for:</p>
                <ul className={`${listClass} list-disc`}>
                  <li>
                    website, internet or technical failures outside its reasonable
                    control;
                  </li>
                  <li>
                    entries that are lost, delayed, incomplete or incorrectly
                    submitted;
                  </li>
                  <li>
                    any failure of Instagram or any third-party platform;
                  </li>
                  <li>
                    circumstances affecting the Irish Open that are outside the
                    Promoter&apos;s reasonable control; or
                  </li>
                  <li>
                    any costs incurred by the winner that are not expressly included
                    in the prize.
                  </li>
                </ul>
                <p className="body-copy">
                  Nothing in these Terms &amp; Conditions excludes or limits
                  liability where doing so would be unlawful.
                </p>
              </Section>

              <Section title="12. Personal data and privacy">
                <p className="body-copy">
                  The Promoter will process personal data collected through the
                  Competition in accordance with applicable data protection law,
                  including the EU General Data Protection Regulation (GDPR) and
                  the Data Protection Act 2018.
                </p>
                <p className="body-copy">
                  The information collected may include:
                </p>
                <ul className={`${listClass} list-disc`}>
                  <li>name;</li>
                  <li>email address;</li>
                  <li>
                    Instagram username, where required to verify the entry; and
                  </li>
                  <li>
                    information reasonably required to verify eligibility and
                    administer the Competition.
                  </li>
                </ul>
                <p className="body-copy">
                  Personal data will be used for purposes including:
                </p>
                <ul className={`${listClass} list-disc`}>
                  <li>administering the Competition;</li>
                  <li>determining eligibility;</li>
                  <li>selecting and contacting the winner;</li>
                  <li>delivering the prize;</li>
                  <li>preventing fraud or duplicate entries;</li>
                  <li>maintaining appropriate records of the Competition; and</li>
                  <li>
                    complying with legal and regulatory obligations.
                  </li>
                </ul>
                <p className="body-copy">
                  The Promoter will only use personal data for direct marketing
                  purposes where it has an appropriate lawful basis to do so and,
                  where required, the individual&apos;s consent.
                </p>
                <p className="body-copy">
                  Entering the Competition does not, by itself, constitute consent
                  to receive marketing communications.
                </p>
                <p className="body-copy">
                  Where you separately opt in to receive marketing communications
                  from Dublin Golf Show, you may withdraw that consent at any time.
                </p>
                <p className="body-copy">
                  Personal data may be processed by service providers assisting the
                  Promoter with website hosting, registration, email
                  communications, competition administration and related services.
                  Where appropriate, these providers will process data on the
                  Promoter&apos;s behalf.
                </p>
                <p className="body-copy">
                  Personal data will not be sold to third parties.
                </p>
                <p className="body-copy">
                  Personal data will be retained only for as long as reasonably
                  necessary for the purposes for which it was collected, including
                  administration of the Competition, legal, accounting and
                  regulatory requirements, and any applicable limitation periods.
                </p>
                <p className="body-copy">
                  The Promoter will take appropriate measures to protect personal
                  data against unauthorised access, loss, misuse or disclosure.
                </p>
              </Section>

              <Section title="13. Your data protection rights">
                <p className="body-copy">
                  Subject to applicable law, you have rights in relation to your
                  personal data, including the right to:
                </p>
                <ul className={`${listClass} list-disc`}>
                  <li>access your personal data;</li>
                  <li>request correction of inaccurate personal data;</li>
                  <li>request deletion of personal data;</li>
                  <li>request restriction of processing;</li>
                  <li>object to certain processing;</li>
                  <li>request data portability where applicable; and</li>
                  <li>withdraw consent where processing is based on consent.</li>
                </ul>
                <p className="body-copy">
                  Further information about your rights is available from the Data
                  Protection Commission.
                </p>
                <p className="body-copy">
                  To exercise your rights or ask a question about your personal
                  data, contact:
                </p>
                <p className="body-copy">
                  <a href={`mailto:${siteConfig.email}`} className={textLinkClass}>
                    hello@dublingolfshow.ie
                  </a>
                </p>
                <p className="body-copy">
                  You also have the right to lodge a complaint with the Irish Data
                  Protection Commission.
                </p>
              </Section>

              <Section title="14. Instagram disclaimer">
                <p className="body-copy">
                  This Competition is in no way sponsored, endorsed, administered
                  by, or associated with Instagram.
                </p>
                <p className="body-copy">
                  By entering the Competition, each entrant releases Instagram from
                  any responsibility or liability arising from or relating to the
                  Competition.
                </p>
                <p className="body-copy">
                  Instagram is not responsible for the administration of the
                  Competition, the selection of the winner or the awarding of the
                  prize.
                </p>
              </Section>

              <Section title="15. Acceptance of these Terms">
                <p className="body-copy">
                  By entering the Competition, you confirm that you have read and
                  accepted these Terms &amp; Conditions.
                </p>
                <p className="body-copy">
                  If any provision of these Terms &amp; Conditions is found to be
                  invalid or unenforceable, the remaining provisions will continue
                  to apply.
                </p>
                <p className="body-copy">
                  These Terms &amp; Conditions are governed by the laws of Ireland
                  and are subject to the jurisdiction of the Irish courts.
                </p>
              </Section>
            </div>

            <div className="mt-14 border-t border-line pt-10 md:mt-16">
              <p className="font-display text-[14px] font-semibold uppercase tracking-[0.1em] text-white/50">
                Dublin Golf Show 2027
              </p>
              <p className="body-copy mt-4">19–20 June 2027</p>
              <p className="body-copy">RDS Simmonscourt, Dublin</p>
              <p className="mt-4">
                <Link href="/" className={textLinkClass}>
                  www.dublingolfshow.ie
                </Link>
              </p>
            </div>

            <BackLink className="mt-12 md:mt-16" />
          </article>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
