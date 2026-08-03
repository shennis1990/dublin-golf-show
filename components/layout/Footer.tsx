"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Contour } from "@/components/ui/Contour";
import { Container } from "@/components/ui/Container";

const socials: Array<{ label: string; href: string; icon: ReactNode }> = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5">
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
    label: "X",
    href: "https://x.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-5 w-5">
        <path d="M13.682 10.622 20.24 3h-1.554l-5.693 6.618L8.45 3H3.25l6.876 10.007L3.25 21h1.554l6.012-6.989L15.8 21h5.2l-7.318-10.378Zm-2.126 2.471-.697-.997L4.864 4.17h2.387l4.473 6.4.697.997 5.901 8.44h-2.387l-4.379-6.914Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-5 w-5">
        <path d="M6.94 8.5H4.05V20h2.89V8.5ZM5.5 7.17a1.68 1.68 0 1 0 0-3.36 1.68 1.68 0 0 0 0 3.36ZM20 20h-2.88v-5.6c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95V20H10.2V8.5h2.77v1.57h.04c.39-.73 1.33-1.5 2.74-1.5 2.93 0 3.47 1.93 3.47 4.44V20Z" />
      </svg>
    ),
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail("");
  }

  return (
    <footer id="contact" className="section-y relative overflow-hidden border-t border-line bg-[#070d16]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Contour variant="corner" anchor="bottom-right" opacity={0.95} />
      </div>

      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow">Stay Close</p>
            <h2 className="mt-4 max-w-md font-display text-3xl font-bold uppercase leading-none tracking-tight text-white md:text-4xl">
              Be first to hear
            </h2>

            <form
              onSubmit={onSubmit}
              className="mt-8 flex max-w-lg flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="h-12 w-full flex-1 rounded-full border border-white/15 bg-white/[0.03] px-5 text-base text-white outline-none transition-colors placeholder:text-white/35 focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              />
              <Button type="submit" className="h-12 w-full shrink-0 sm:w-auto">
                Subscribe
              </Button>
            </form>
            {done ? (
              <p className="mt-4 text-base text-accent">You&apos;re on the list.</p>
            ) : null}
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:justify-items-end lg:text-right">
            <div className="sm:justify-self-start lg:justify-self-end">
              <p className="font-display text-[14px] font-semibold uppercase tracking-[0.12em] text-white/40">
                Contact
              </p>
              <a
                href="mailto:hello@dublingolfshow.ie"
                className="mt-4 block text-lg font-light text-white transition-colors hover:text-accent"
              >
                hello@dublingolfshow.ie
              </a>
            </div>

            <div className="sm:justify-self-end">
              <p className="font-display text-[14px] font-semibold uppercase tracking-[0.12em] text-white/40">
                Social
              </p>
              <ul className="mt-4 flex flex-wrap gap-3 sm:justify-end">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} (opens in a new tab)`}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-[14px] font-semibold uppercase tracking-[0.1em] text-white/50">
            Dublin Golf Show 2027
          </p>
          <p className="text-[14px] font-light text-white/35">
            © {new Date().getFullYear()} Dublin Golf Show. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
