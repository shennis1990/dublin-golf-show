export type BookingAmounts = {
  priceExVat: number;
  vatRate: number;
  vatAmount: number;
  totalIncVat: number;
  depositPercent: number;
  depositAmount: number;
  balanceAmount: number;
};

export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) {
    throw new RangeError("Amount must be a finite number");
  }
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function parseMoney(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? roundMoney(value) : null;
  }
  if (typeof value !== "string") return null;
  const trimmed = value.trim().replace(",", ".");
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return null;
  return roundMoney(parsed);
}

export function calculateBookingAmounts(input: {
  priceExVat: number;
  vatRate: number;
  depositPercent: number;
}): BookingAmounts {
  const priceExVat = roundMoney(input.priceExVat);
  const vatRate = roundMoney(input.vatRate);
  const depositPercent = roundMoney(input.depositPercent);

  if (priceExVat <= 0) {
    throw new RangeError("Price excluding VAT must be greater than zero");
  }
  if (vatRate < 0 || vatRate > 100) {
    throw new RangeError("VAT rate must be between 0 and 100");
  }
  if (depositPercent < 0 || depositPercent > 100) {
    throw new RangeError("Deposit percent must be between 0 and 100");
  }

  const vatAmount = roundMoney(priceExVat * (vatRate / 100));
  const totalIncVat = roundMoney(priceExVat + vatAmount);
  const depositAmount = roundMoney(totalIncVat * (depositPercent / 100));
  const balanceAmount = roundMoney(totalIncVat - depositAmount);

  return {
    priceExVat,
    vatRate,
    vatAmount,
    totalIncVat,
    depositPercent,
    depositAmount,
    balanceAmount,
  };
}

export function formatEur(value: number | string): string {
  const amount = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
