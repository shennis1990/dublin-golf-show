import { NextResponse } from "next/server";
import { safeAdminNextPath } from "@/lib/auth/paths";
import { createClient } from "@/lib/supabase/server";

function isAdminRole(role: unknown) {
  return role === "admin" || role === "superadmin";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeAdminNextPath(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${origin}/admin/login?error=auth`);
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(`${origin}/admin/login?error=auth`);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: profile } = user
      ? await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle()
      : { data: null };

    if (!user || !profile || !isAdminRole(profile.role)) {
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/admin/login?error=forbidden`);
    }

    return NextResponse.redirect(`${origin}${next}`);
  } catch {
    return NextResponse.redirect(`${origin}/admin/login?error=config`);
  }
}
