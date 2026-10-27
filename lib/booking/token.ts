import { createHash, randomBytes } from "node:crypto";

export function createBookingInviteToken() {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashBookingToken(token);
  return { token, tokenHash };
}

export function hashBookingToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function createBookingReference(year: number) {
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `DGS-${year}-${suffix}`;
}
