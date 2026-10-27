import Link from "next/link";
import { logoutAdmin } from "@/app/admin/actions";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Contour } from "@/components/ui/Contour";
import type { AdminRole } from "@/lib/auth/require-admin";

export function AdminChrome({
  email,
  role,
  children,
}: {
  email: string;
  role: AdminRole;
  children: React.ReactNode;
}) {
  return (
    <main
      id="main-content"
      className="relative min-h-[100svh] overflow-hidden bg-background"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Contour anchor="top-right" opacity={0.08} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-8 md:px-10">
        <header className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <BrandLogo />
            <p className="mt-3 text-sm text-white/45">
              {email} · {role}
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin"
              className="font-display text-[13px] font-semibold uppercase tracking-[0.12em] text-white/70 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/organisations"
              className="font-display text-[13px] font-semibold uppercase tracking-[0.12em] text-white/70 hover:text-white"
            >
              Organisations
            </Link>
            <Link
              href="/admin/bookings"
              className="font-display text-[13px] font-semibold uppercase tracking-[0.12em] text-white/70 hover:text-white"
            >
              Bookings
            </Link>
            <form action={logoutAdmin}>
              <Button type="submit" variant="ghost" size="sm">
                Sign out
              </Button>
            </form>
          </nav>
        </header>
        {children}
      </div>
    </main>
  );
}
