"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass, selectClass } from "@/lib/booking/styles";
import { createBooking } from "./actions";

type OrganisationOption = {
  id: string;
  legal_name: string;
};

export function NewBookingForm({
  organisations,
  vatRate,
  depositPercent,
}: {
  organisations: OrganisationOption[];
  vatRate: string;
  depositPercent: string;
}) {
  const [state, action, pending] = useActionState(
    createBooking,
    {
      error: "",
      values: {
        organisationId: "",
        category: "exhibitor",
        packageName: "",
        standWidth: "",
        standDepth: "",
        priceExVat: "",
      },
    },
  );

  return (
    <form action={action} className="max-w-xl space-y-6">
      {state.error ? (
        <p className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200" role="alert">
          {state.error}
        </p>
      ) : null}

      <p className="text-sm text-white/55">
        VAT {vatRate}% is added to the ex-VAT price. The deposit is {depositPercent}% of the
        VAT-inclusive total; the remainder is the balance.
      </p>

      <div>
        <label className={labelClass} htmlFor="organisationId">
          Organisation
        </label>
        <select
          id="organisationId"
          name="organisationId"
          required
          defaultValue={state.values.organisationId}
          className={selectClass}
        >
          <option value="">Select organisation</option>
          {organisations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.legal_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="category">
          Category
        </label>
        <select
          id="category"
          name="category"
          defaultValue={state.values.category}
          className={selectClass}
        >
          <option value="exhibitor">Exhibitor</option>
          <option value="sponsor">Sponsor</option>
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="packageName">
          Package name
        </label>
        <input
          id="packageName"
          name="packageName"
          required
          defaultValue={state.values.packageName}
          className={inputClass}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="standWidth">
            Stand width (m)
          </label>
          <input
            id="standWidth"
            name="standWidth"
            inputMode="decimal"
            defaultValue={state.values.standWidth}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="standDepth">
            Stand depth (m)
          </label>
          <input
            id="standDepth"
            name="standDepth"
            inputMode="decimal"
            defaultValue={state.values.standDepth}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="priceExVat">
          Price excluding VAT (€)
        </label>
        <input
          id="priceExVat"
          name="priceExVat"
          required
          inputMode="decimal"
          defaultValue={state.values.priceExVat}
          className={inputClass}
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Create draft booking"}
      </Button>
    </form>
  );
}
