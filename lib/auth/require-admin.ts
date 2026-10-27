import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export type AdminRole = "admin" | "superadmin";

export type AdminSession = {
  user: User;
  role: AdminRole;
};

function isAdminRole(role: unknown): role is AdminRole {
  return role === "admin" || role === "superadmin";
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (error) return null;

    if (!profile || !isAdminRole(profile.role)) {
      await supabase.auth.signOut();
      return null;
    }

    return { user, role: profile.role };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
