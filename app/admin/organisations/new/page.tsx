import { AdminChrome } from "@/components/admin/AdminChrome";
import { requireAdmin } from "@/lib/auth/require-admin";
import { NewOrganisationForm } from "../NewOrganisationForm";

export default async function NewOrganisationPage() {
  const session = await requireAdmin();

  return (
    <AdminChrome email={session.user.email || ""} role={session.role}>
      <h1 className="mb-2 font-display text-3xl font-semibold text-white">New organisation</h1>
      <p className="mb-8 text-white/55">Saved to the live booking database under your admin session.</p>
      <NewOrganisationForm />
    </AdminChrome>
  );
}
