import { headers } from "next/headers";

function asInet(value: string | null | undefined) {
  const ip = value?.trim() || "";
  if (
    /^\d{1,3}(?:\.\d{1,3}){3}$/.test(ip) ||
    (ip.includes(":") && /^[0-9a-fA-F:.]+$/.test(ip))
  ) {
    return ip;
  }
  return "0.0.0.0";
}

export async function getRequestIp() {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for");
  if (forwarded) {
    return asInet(forwarded.split(",")[0]);
  }

  return asInet(
    requestHeaders.get("x-real-ip") || requestHeaders.get("cf-connecting-ip"),
  );
}

export async function getRequestUserAgent() {
  const requestHeaders = await headers();
  return requestHeaders.get("user-agent")?.slice(0, 500) || "unknown";
}
