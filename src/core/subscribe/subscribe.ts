import { prisma } from "@/src/lib/prisma";
import { appConfig } from "@/src/core/config/appConfig";
import { sendEmail } from "@/src/core/email/sendEmail";
import { confirmUrl, randomToken } from "./tokens";

/** Feature flag (appConfig.subscription.isEnabled). */
export const isSubscriptionEnabled = () => appConfig.subscription.isEnabled;

/** Defense in depth: even if a route forgets the check, nothing runs while disabled. */
function assertEnabled() {
  if (!isSubscriptionEnabled()) throw new Error("Subscriptions are disabled.");
}

/** 404 for every subscription endpoint while the feature is off. */
export const subscriptionDisabledResponse = () => Response.json({ error: "Not found" }, { status: 404 });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Reads `{ email }` from a JSON body; returns a normalized email or null. */
export async function readEmail(request: Request): Promise<string | null> {
  const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  return email.length <= 254 && EMAIL_RE.test(email) ? email : null;
}

/**
 * Step 1 of double opt-in: store the email as PENDING and mail a confirmation
 * link. Already-ACTIVE emails get nothing, and a PENDING email is not re-mailed
 * inside the cooldown, so this can't be used to spam an inbox or probe who is
 * subscribed (the caller answers identically in every case).
 */
export async function requestSubscription(email: string): Promise<void> {
  assertEnabled();
  const existing = await prisma.subscription.findUnique({ where: { email } });
  if (existing?.status === "ACTIVE") return;

  const now = new Date();
  const { resendCooldownSeconds, confirmTtlHours } = appConfig.subscription;
  if (
    existing?.status === "PENDING" &&
    existing.confirmSentAt &&
    now.getTime() - existing.confirmSentAt.getTime() < resendCooldownSeconds * 1000
  ) {
    return;
  }

  const confirmToken = randomToken();
  const data = {
    status: "PENDING" as const,
    confirmToken,
    confirmTokenExpiresAt: new Date(now.getTime() + confirmTtlHours * 3600 * 1000),
    confirmSentAt: now,
  };
  await prisma.subscription.upsert({
    where: { email },
    create: { email, unsubscribeToken: randomToken(), ...data },
    update: data,
  });

  const link = confirmUrl(confirmToken);
  await sendEmail({
    to: email,
    subject: appConfig.email.confirmSubject,
    text: `Confirm your subscription by opening this link (valid ${confirmTtlHours} hours):\n${link}\n\nIf you did not ask for this, ignore this email.`,
    html: `<p>Confirm your subscription (link valid ${confirmTtlHours} hours):</p><p><a href="${link}">Confirm subscription</a></p><p>If you did not ask for this, ignore this email.</p>`,
  });
}

/** Step 2: the link from the email. Returns false for unknown/expired/used tokens. */
export async function confirmSubscription(token: string): Promise<boolean> {
  assertEnabled();
  const row = await prisma.subscription.findUnique({ where: { confirmToken: token } });
  if (!row?.confirmTokenExpiresAt || row.confirmTokenExpiresAt < new Date()) return false;

  await prisma.subscription.update({
    where: { id: row.id },
    data: {
      status: "ACTIVE",
      confirmToken: null,
      confirmTokenExpiresAt: null,
      subscribedAt: new Date(),
      cancelledAt: null,
    },
  });
  return true;
}

/** Unsubscribe link in an email. Soft cancel: the row stays, status INACTIVE. */
export async function unsubscribeByToken(token: string): Promise<boolean> {
  assertEnabled();
  const row = await prisma.subscription.findUnique({ where: { unsubscribeToken: token } });
  if (!row) return false;

  if (row.status !== "INACTIVE") {
    await prisma.subscription.update({
      where: { id: row.id },
      data: {
        status: "INACTIVE",
        cancelledAt: new Date(),
        confirmToken: null,
        confirmTokenExpiresAt: null,
      },
    });
  }
  return true;
}
