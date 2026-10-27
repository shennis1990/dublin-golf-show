import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loginAdmin } from "@/app/admin/actions";
import { getAdminSession } from "@/lib/auth/require-admin";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Contour } from "@/components/ui/Contour";

export const metadata: Metadata = {
  title: "Admin login",
};

const inputClass =
  "h-12 w-full rounded-full border border-white/15 bg-white/[0.03] px-5 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const labelClass =
  "mb-2 block font-display text-[14px] font-semibold uppercase tracking-[0.1em] text-white/45";

const errorCopy: Record<string, string> = {
  invalid: "Invalid email or password.",
  forbidden: "This account is not authorised for admin access.",
  config: "Admin login is not configured.",
  auth: "Sign-in link is invalid or has expired.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  const { error } = await searchParams;
  const message = error ? errorCopy[error] || errorCopy.invalid : null;

  return (
    <main
      id="main-content"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-background"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Contour anchor="top-right" opacity={0.1} />
      </div>

      <div className="section-y relative z-10 mx-auto w-full max-w-md px-6 md:px-10">
        <div className="mb-10">
          <BrandLogo />
        </div>
        <p className="eyebrow">Staff only</p>
        <h1 className="heading-section mt-5 text-4xl md:text-5xl">Admin login</h1>
        <p className="body-copy mt-5">
          Invitation-only access. Public signup is not available.
        </p>

        <form action={loginAdmin} className="mt-10 space-y-5">
          {message ? (
            <p
              className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              role="alert"
            >
              {message}
            </p>
          ) : null}

          <div>
            <label htmlFor="admin-email" className={labelClass}>
              Email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="admin-password" className={labelClass}>
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={inputClass}
            />
          </div>

          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </div>
    </main>
  );
}
