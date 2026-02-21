import "server-only";

const RESEND_API_URL = "https://api.resend.com/emails";

function getAppBaseUrl() {
  return (
    process.env.APP_BASE_URL ??
    process.env.NEXT_PUBLIC_APP_BASE_URL ??
    "http://localhost:3000"
  );
}

function canSendEmail() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export function emailProviderConfigured() {
  return canSendEmail();
}

type MailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

async function sendViaResend(input: MailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return { ok: false, reason: "provider_not_configured" as const };

  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Email send failed (${res.status}): ${body}`);
  }

  return { ok: true as const };
}

export async function sendConfirmationEmail(args: {
  to: string;
  confirmToken: string;
  unsubscribeToken: string;
}) {
  const baseUrl = getAppBaseUrl();
  const confirmUrl = `${baseUrl}/subscribe/confirm?token=${encodeURIComponent(args.confirmToken)}`;
  const unsubscribeUrl = `${baseUrl}/subscribe/unsubscribe?token=${encodeURIComponent(args.unsubscribeToken)}`;
  const subject = "Confirm your IDHub subscription";

  const text = [
    "You requested IDHub updates.",
    "",
    `Confirm subscription: ${confirmUrl}`,
    "",
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.5;">
      <h2 style="margin: 0 0 12px;">Confirm your IDHub subscription</h2>
      <p>Click below to confirm and receive updates when new cases or blog posts are published.</p>
      <p><a href="${confirmUrl}">Confirm subscription</a></p>
      <hr />
      <p style="font-size: 12px; color: #666;">If this was not you, ignore this email.</p>
      <p style="font-size: 12px; color: #666;">Unsubscribe: <a href="${unsubscribeUrl}">${unsubscribeUrl}</a></p>
    </div>
  `;

  if (!canSendEmail()) {
    return { ok: false as const, reason: "provider_not_configured" as const, confirmUrl };
  }
  const result = await sendViaResend({ to: args.to, subject, html, text });
  return { ...result, confirmUrl };
}

export async function sendContentUpdateEmail(args: {
  to: string;
  title: string;
  url: string;
  kind: "case" | "blog";
  unsubscribeToken: string;
}) {
  const baseUrl = getAppBaseUrl();
  const unsubscribeUrl = `${baseUrl}/subscribe/unsubscribe?token=${encodeURIComponent(args.unsubscribeToken)}`;
  const subject = `New IDHub ${args.kind}: ${args.title}`;

  const text = [
    `A new IDHub ${args.kind} is available:`,
    `${args.title}`,
    args.url,
    "",
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.5;">
      <h2 style="margin: 0 0 12px;">New IDHub ${args.kind}</h2>
      <p><strong>${args.title}</strong></p>
      <p><a href="${args.url}">Open update</a></p>
      <hr />
      <p style="font-size: 12px; color: #666;">Unsubscribe: <a href="${unsubscribeUrl}">${unsubscribeUrl}</a></p>
    </div>
  `;

  if (!canSendEmail()) {
    return { ok: false as const, reason: "provider_not_configured" as const };
  }
  return sendViaResend({ to: args.to, subject, html, text });
}
