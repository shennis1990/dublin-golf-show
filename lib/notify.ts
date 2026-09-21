const SHOW_NOTIFY_EMAIL = "shane@dublingolfshow.ie";

export function notifyRecipients(primary: string): string[] {
  const seen = new Set<string>();
  const recipients: string[] = [];

  for (const email of [primary, SHOW_NOTIFY_EMAIL]) {
    const trimmed = email.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    recipients.push(trimmed);
  }

  return recipients;
}

export async function deliverNotifyEmails(
  primary: string,
  send: (to: string[]) => Promise<{ error: unknown }>,
): Promise<boolean> {
  let delivered = false;

  for (const to of notifyRecipients(primary)) {
    const { error } = await send([to]);
    if (error) {
      console.error("Resend error:", to, error);
      continue;
    }
    delivered = true;
  }

  return delivered;
}
