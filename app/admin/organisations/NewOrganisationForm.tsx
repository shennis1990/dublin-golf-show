"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass, selectClass } from "@/lib/booking/styles";
import { createOrganisation } from "./actions";

export function NewOrganisationForm() {
  const [state, action, pending] = useActionState(
    createOrganisation,
    {
      error: "",
      values: {
        legalName: "",
        tradingName: "",
        organisationType: "exhibitor",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
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

      <div>
        <label className={labelClass} htmlFor="legalName">
          Legal name
        </label>
        <input
          id="legalName"
          name="legalName"
          required
          defaultValue={state.values.legalName}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="tradingName">
          Trading name
        </label>
        <input
          id="tradingName"
          name="tradingName"
          defaultValue={state.values.tradingName}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="organisationType">
          Type
        </label>
        <select
          id="organisationType"
          name="organisationType"
          defaultValue={state.values.organisationType}
          className={selectClass}
        >
          <option value="exhibitor">Exhibitor</option>
          <option value="sponsor">Sponsor</option>
          <option value="both">Both</option>
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="contactName">
          Primary contact name
        </label>
        <input
          id="contactName"
          name="contactName"
          required
          defaultValue={state.values.contactName}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="contactEmail">
          Primary contact email
        </label>
        <input
          id="contactEmail"
          name="contactEmail"
          type="email"
          required
          defaultValue={state.values.contactEmail}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="contactPhone">
          Primary contact phone
        </label>
        <input
          id="contactPhone"
          name="contactPhone"
          defaultValue={state.values.contactPhone}
          className={inputClass}
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Create organisation"}
      </Button>
    </form>
  );
}
