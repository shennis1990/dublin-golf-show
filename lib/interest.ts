export const INTEREST_SOURCES = [
  "register-interest",
  "register-irish-open",
] as const;

export type InterestSource = (typeof INTEREST_SOURCES)[number];

export const DEFAULT_INTEREST_SOURCE: InterestSource = "register-interest";

export function resolveInterestSource(value: unknown): InterestSource {
  if (
    typeof value === "string" &&
    (INTEREST_SOURCES as readonly string[]).includes(value)
  ) {
    return value as InterestSource;
  }

  return DEFAULT_INTEREST_SOURCE;
}
