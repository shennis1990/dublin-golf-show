import Link from "next/link";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { Button } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";

export default async function OrganisationsPage() {
  const session = await requireAdmin();
  const supabase = await createClient();
  const { data: organisations, error } = await supabase
    .from("organisations")
    .select(
      "id, legal_name, trading_name, organisation_type, primary_contact_name, primary_contact_email, created_at",
    )
    .order("created_at", { ascending: false });

  return (
    <AdminChrome email={session.user.email || ""} role={session.role}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">Organisations</h1>
          <p className="mt-2 text-white/55">Create exhibitors and sponsors, then attach draft bookings.</p>
        </div>
        <Button href="/admin/organisations/new" size="sm">
          New organisation
        </Button>
      </div>

      {error ? (
        <p className="text-red-200" role="alert">
          Could not load organisations.
        </p>
      ) : organisations && organisations.length > 0 ? (
        <ul className="divide-y divide-white/10 rounded-3xl border border-white/10">
          {organisations.map((org) => (
            <li key={org.id} className="px-5 py-4">
              <p className="font-medium text-white">{org.legal_name}</p>
              <p className="mt-1 text-sm text-white/50">
                {org.organisation_type}
                {org.trading_name ? ` · ${org.trading_name}` : ""} · {org.primary_contact_name} ·{" "}
                {org.primary_contact_email}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white/55">
          No organisations yet.{" "}
          <Link href="/admin/organisations/new" className="text-accent">
            Create the first one
          </Link>
          .
        </p>
      )}
    </AdminChrome>
  );
}
