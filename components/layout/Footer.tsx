"use client";

import type { ReactNode } from "react";
import { Contour } from "@/components/ui/Contour";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { RegisterInterestButton } from "@/components/interest/RegisterInterestButton";
import { siteConfig } from "@/lib/site";

const socials: Array<{ label: string; href: string; icon: ReactNode }> = [
  {
    label: "Instagram",
    href: siteConfig.social.instagram,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-[1.375rem] w-[1.375rem]">
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: siteConfig.social.facebook,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-[1.375rem] w-[1.375rem]">
        <path d="M14.5 8.5V6.75c0-.69.1-1.08 1.12-1.08H17V3h-2.34C11.9 3 11 4.55 11 6.58V8.5H9v2.75h2V21h3.5v-9.75h2.34l.36-2.75H14.5Z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: siteConfig.social.x,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-[1.375rem] w-[1.375rem]">
        <path d="M13.682 10.622 20.24 3h-1.554l-5.693 6.618L8.45 3H3.25l6.876 10.007L3.25 21h1.554l6.012-6.989L15.8 21h5.2l-7.318-10.378Zm-2.126 2.471-.697-.997L4.864 4.17h2.387l4.473 6.4.697.997 5.901 8.44h-2.387l-4.379-6.914Z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer id="contact" className="section-y relative overflow-hidden border-t border-line bg-[#070d16]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Contour anchor="bottom-right" opacity={0.14} />
      </div>

      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="max-w-md font-display text-3xl font-bold uppercase leading-none tracking-tight text-white md:text-4xl">
              Get Ticket Updates
            </h2>
            <p className="body-copy prose-width mt-5 md:mt-6">
              Be the first to hear about tickets, new experiences and everything coming to the Dublin
              Golf Show 2027.
            </p>
            <div className="mt-8 md:mt-10">
              <RegisterInterestButton>Get Ticket Updates</RegisterInterestButton>
            </div>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between lg:col-span-5 lg:justify-end lg:gap-14">
            <div>
              <p className="font-display text-[14px] font-semibold uppercase tracking-[0.12em] text-white/40">
                Contact
              </p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-4 block text-lg font-light leading-none text-white transition-colors hover:text-accent"
              >
                {siteConfig.email}
              </a>
            </div>

            <div className="sm:text-right">
              <p className="font-display text-[14px] font-semibold uppercase tracking-[0.12em] text-white/40">
                Social
              </p>
              <ul className="mt-4 grid w-fit grid-cols-2 gap-3.5 sm:flex sm:grid-cols-none sm:flex-row sm:items-center sm:justify-end">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} (opens in a new tab)`}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 sm:mt-20 sm:flex-row sm:items-start sm:justify-between">
          <p className="font-display text-[14px] font-semibold uppercase tracking-[0.1em] text-white/50">
            Dublin Golf Show 2027
          </p>
          <div className="sm:text-right">
            <p className="text-[14px] font-light text-white/35">
              © {new Date().getFullYear()} Dublin Golf Show. All rights reserved.
            </p>
            <p className="mt-1 text-[14px] font-light text-white/35">
              {siteConfig.organiser.legalName}
            </p>
            <Button
              href={siteConfig.organiser.path}
              variant="ghost"
              size="sm"
              className="mt-4"
            >
              About the Event Organiser
            </Button>
          </div>
        </div>
      </Container>
    </footer>
  );
}
