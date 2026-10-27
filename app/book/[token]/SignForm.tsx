"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { inputClass, labelClass } from "@/lib/booking/styles";
import { submitBookingSignature } from "@/app/book/actions";

export function SignForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(
    submitBookingSignature,
    {
      error: "",
      signed: false,
      values: {
        signerName: "",
        signerRole: "",
        detailsConfirmed: false,
        authorisedConfirmed: false,
        termsConfirmed: false,
      },
    },
  );

  if (state.signed) {
    return (
      <p className="rounded-3xl border border-accent/40 bg-accent/10 px-5 py-4 text-white">
        Agreement signed. A snapshot of the booking and terms has been stored and cannot be changed.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="token" value={token} />

      {state.error ? (
        <p className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200" role="alert">
          {state.error}
        </p>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="signerName">
          Full name
        </label>
        <input
          id="signerName"
          name="signerName"
          required
          autoComplete="name"
          defaultValue={state.values.signerName}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="signerRole">
          Role
        </label>
        <input
          id="signerRole"
          name="signerRole"
          required
          placeholder="Director, authorised signatory"
          defaultValue={state.values.signerRole}
          className={inputClass}
        />
      </div>

      <fieldset className="space-y-3 text-sm text-white/75">
        <legend className={labelClass}>Confirmations</legend>
        <label className="flex gap-3">
          <input
            type="checkbox"
            name="detailsConfirmed"
            defaultChecked={state.values.detailsConfirmed}
            className="mt-1"
          />
          <span>I confirm the organisation and booking details above are correct.</span>
        </label>
        <label className="flex gap-3">
          <input
            type="checkbox"
            name="authorisedConfirmed"
            defaultChecked={state.values.authorisedConfirmed}
            className="mt-1"
          />
          <span>I confirm I am authorised to sign this agreement on behalf of the organisation.</span>
        </label>
        <label className="flex gap-3">
          <input
            type="checkbox"
            name="termsConfirmed"
            defaultChecked={state.values.termsConfirmed}
            className="mt-1"
          />
          <span>I agree to the agreement terms shown on this page.</span>
        </label>
      </fieldset>

      <p className="text-xs text-white/40">
        Typing your name is the signature. The signed record, terms, and booking amounts are stored immutably.
      </p>

      <Button type="submit" disabled={pending}>
        {pending ? "Submitting…" : "Sign agreement"}
      </Button>
    </form>
  );
}
