"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function isAdminRole(role: unknown) {
  return role === "admin" || role === "superadmin";
}

export async function loginAdmin(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/admin/login?error=invalid");
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirect("/admin/login?error=config");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirect("/admin/login?error=invalid");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || !isAdminRole(profile.role)) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=forbidden");
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Still send the user back to login if Auth is misconfigured.
  }
  redirect("/admin/login");
}
