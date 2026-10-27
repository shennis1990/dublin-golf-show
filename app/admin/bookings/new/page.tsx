import Link from "next/link";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { NewBookingForm } from "../NewBookingForm";

export default async function NewBookingPage() {
  const session = await requireAdmin();
  const supabase = await createClient();

  const [{ data: organisations }, { data: event }] = await Promise.all([
    supabase
      .from("organisations")
      .select("id, legal_name")
      .order("legal_name", { ascending: true }),
    supabase
      .from("events")
      .select("default_vat_rate, default_deposit_percent")
      .eq("slug", "dublin-golf-show-2027")
      .maybeSingle(),
  ]);

  return (
    <AdminChrome email={session.user.email || ""} role={session.role}>
      <h1 className="mb-2 font-display text-3xl font-semibold text-white">New draft booking</h1>
      <p className="mb-8 text-white/55">
        Amounts are calculated on save. VAT and deposit rates come from the 2027 event.
      </p>

      {!organisations?.length ? (
        <p className="text-white/55">
          Create an organisation first.{" "}
          <Link href="/admin/organisations/new" className="text-accent">
            New organisation
          </Link>
        </p>
      ) : !event ? (
        <p className="text-red-200" role="alert">
          The 2027 event is missing from the database.
        </p>
      ) : (
        <NewBookingForm
          organisations={organisations}
          vatRate={String(event.default_vat_rate)}
          depositPercent={String(event.default_deposit_percent)}
        />
      )}
    </AdminChrome>
  );
}
