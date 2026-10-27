import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateBookingAmounts, roundMoney } from "./calc.ts";

test("applies 23% VAT then 25% deposit of the VAT-inclusive total", () => {
  const amounts = calculateBookingAmounts({
    priceExVat: 1000,
    vatRate: 23,
    depositPercent: 25,
  });

  assert.equal(amounts.vatAmount, 230);
  assert.equal(amounts.totalIncVat, 1230);
  assert.equal(amounts.depositAmount, 307.5);
  assert.equal(amounts.balanceAmount, 922.5);
  assert.equal(
    roundMoney(amounts.depositAmount + amounts.balanceAmount),
    amounts.totalIncVat,
  );
});

test("keeps deposit plus balance equal to the inclusive total after rounding", () => {
  const amounts = calculateBookingAmounts({
    priceExVat: 99.99,
    vatRate: 23,
    depositPercent: 25,
  });

  assert.equal(
    roundMoney(amounts.depositAmount + amounts.balanceAmount),
    amounts.totalIncVat,
  );
});
