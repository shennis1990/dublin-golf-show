export function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function isPublicAdminPath(pathname: string) {
  return pathname === "/admin/login" || pathname.startsWith("/admin/login/");
}

export function isProtectedAdminPath(pathname: string) {
  return isAdminPath(pathname) && !isPublicAdminPath(pathname);
}

export function isAuthPath(pathname: string) {
  return pathname === "/auth" || pathname.startsWith("/auth/");
}

export function safeAdminNextPath(next: string | null | undefined) {
  if (!next) return "/admin";
  if (!next.startsWith("/")) return "/admin";
  if (next.startsWith("//") || next.includes("\\") || next.includes("://")) {
    return "/admin";
  }
  if (!isAdminPath(next)) return "/admin";
  return next;
}
