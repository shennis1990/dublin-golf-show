import type { SupabaseClient } from "@supabase/supabase-js";

export async function writeAdminAudit(
  supabase: SupabaseClient,
  input: {
    actorId: string | null;
    action: string;
    entityType: string;
    entityId?: string | null;
    metadata?: Record<string, unknown>;
  },
) {
  const { error } = await supabase.from("admin_audit_events").insert({
    actor_id: input.actorId,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    metadata: input.metadata ?? {},
  });

  if (error) {
    console.error("admin_audit_events insert failed:", error.message);
  }
}
