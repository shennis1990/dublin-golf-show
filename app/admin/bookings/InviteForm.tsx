"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/lib/booking/styles";
import { generateBookingInvite } from "./actions";

export function InviteForm({ bookingId }: { bookingId: string }) {
  const [state, action, pending] = useActionState(
    generateBookingInvite,
    { error: "", url: "", emailed: false },
  );

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="bookingId" value={bookingId} />
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Creating link…" : state.url ? "Create a new invitation link" : "Create invitation link"}
      </Button>

      {state.error ? (
        <p className="text-sm text-red-200" role="alert">
          {state.error}
        </p>
      ) : null}

      {state.url ? (
        <div className="space-y-2">
          <p className="text-sm text-white/60">
            {state.emailed
              ? "Invitation emailed to the organisation contact. Copy the link below if you also need to send it yourself."
              : "Email is not configured or sending failed. Copy this single-use link now — it is not stored in plain text."}
          </p>
          <input
            readOnly
            value={state.url}
            className={inputClass}
            onFocus={(event) => event.currentTarget.select()}
          />
        </div>
      ) : null}
    </form>
  );
}
