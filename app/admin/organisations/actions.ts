"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { writeAdminAudit } from "@/lib/booking/audit";
import { createClient } from "@/lib/supabase/server";

export type OrganisationFormState = {
  error: string;
  values: {
    legalName: string;
    tradingName: string;
    organisationType: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  };
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ORG_TYPES = new Set(["exhibitor", "sponsor", "both"]);

function readOrgForm(formData: FormData): OrganisationFormState["values"] {
  return {
    legalName: String(formData.get("legalName") || "").trim(),
    tradingName: String(formData.get("tradingName") || "").trim(),
    organisationType: String(formData.get("organisationType") || "exhibitor").trim(),
    contactName: String(formData.get("contactName") || "").trim(),
    contactEmail: String(formData.get("contactEmail") || "").trim(),
    contactPhone: String(formData.get("contactPhone") || "").trim(),
  };
}

export async function createOrganisation(
  _prev: OrganisationFormState | null,
  formData: FormData,
): Promise<OrganisationFormState> {
  const session = await requireAdmin();
  const values = readOrgForm(formData);

  if (values.legalName.length < 2) {
    return { error: "Enter the organisation legal name.", values };
  }
  if (!ORG_TYPES.has(values.organisationType)) {
    return { error: "Choose a valid organisation type.", values };
  }
  if (values.contactName.length < 2) {
    return { error: "Enter the primary contact name.", values };
  }
  if (!EMAIL_PATTERN.test(values.contactEmail)) {
    return { error: "Enter a valid primary contact email.", values };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organisations")
    .insert({
      legal_name: values.legalName,
      trading_name: values.tradingName || null,
      organisation_type: values.organisationType,
      primary_contact_name: values.contactName,
      primary_contact_email: values.contactEmail.toLowerCase(),
      primary_contact_phone: values.contactPhone || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      error: "Could not save the organisation. Check your access and try again.",
      values,
    };
  }

  await writeAdminAudit(supabase, {
    actorId: session.user.id,
    action: "organisation.created",
    entityType: "organisation",
    entityId: data.id,
    metadata: { legal_name: values.legalName },
  });

  redirect(`/admin/organisations`);
}

