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

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

export async function sendContentUpdateEmail(args: {
  to: string;
  title: string;
  url: string;
  kind: "case" | "blog";
  summary?: string | null;
  firstQuestion?: string | null;
  imageUrl?: string | null;
  unsubscribeToken: string;
}) {
  const baseUrl = getAppBaseUrl();
  const unsubscribeUrl = `${baseUrl}/subscribe/unsubscribe?token=${encodeURIComponent(args.unsubscribeToken)}`;
  const kindLabel = args.kind === "case" ? "Case" : "Blog Post";
  const subject = `New IDHub ${kindLabel}: ${args.title}`;
  const title = escapeHtml(args.title);
  const summary = args.summary?.trim() ? escapeHtml(args.summary.trim()) : null;
  const firstQuestion = args.firstQuestion?.trim()
    ? escapeHtml(args.firstQuestion.trim())
    : null;
  const imageUrl = args.imageUrl?.trim() ? args.imageUrl.trim() : null;

  const textParts = [
    `A new IDHub ${kindLabel.toLowerCase()} is available:`,
    `${args.title}`,
  ];
  if (summary && args.kind === "case") {
    textParts.push("", `Preview: ${args.summary?.trim() ?? ""}`);
  }
  if (firstQuestion && args.kind === "case") {
    textParts.push("", `First question: ${args.firstQuestion?.trim() ?? ""}`);
  }
  if (imageUrl && args.kind === "case") {
    textParts.push("", `Image: ${imageUrl}`);
  }
  textParts.push("", args.url, "", `Unsubscribe: ${unsubscribeUrl}`);
  const text = textParts.join("\n");

  const casePreviewHtml =
    args.kind === "case" && summary
      ? `
          <div style="margin: 0 0 12px; border: 1px solid #cfe0d4; border-radius: 10px; background: #ffffff; padding: 12px;">
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #0f1a13;">${summary}</p>
          </div>
        `
      : "";

  const firstQuestionHtml =
    args.kind === "case" && firstQuestion
      ? `
          <div style="margin: 0 0 16px; border: 1px solid #cfe0d4; border-radius: 10px; background: #ffffff; padding: 12px;">
            <p style="margin: 0; font-size: 12px; color: #3f5649; letter-spacing: 0.02em; text-transform: uppercase;">First question</p>
            <p style="margin: 6px 0 0; font-size: 14px; line-height: 1.5; color: #0f1a13;">${firstQuestion}</p>
          </div>
        `
      : "";

  const imageHtml =
    args.kind === "case" && imageUrl
      ? `
          <div style="margin: 0 0 12px; border: 1px solid #cfe0d4; border-radius: 10px; background: #ffffff; padding: 8px;">
            <img
              src="${escapeHtml(imageUrl)}"
              alt="${title}"
              style="display: block; width: 100%; height: auto; border-radius: 8px;"
            />
          </div>
        `
      : "";

  const html = `
    <div style="margin: 0; padding: 24px; background: #e7f1ea; font-family: Arial, Helvetica, sans-serif; color: #0f1a13;">
      <div style="max-width: 640px; margin: 0 auto; border: 1px solid #cfe0d4; border-radius: 16px; background: #f7fbf8; overflow: hidden;">
        <div style="padding: 22px 24px; border-bottom: 1px solid #cfe0d4; background: #ffffff;">
          <h2 style="margin: 0; font-size: 24px; line-height: 1.25; color: #1f6f4a;">New IDHub ${kindLabel}</h2>
          <p style="margin: 10px 0 0; font-size: 14px; line-height: 1.5; color: #3f5649;">A new ${kindLabel.toLowerCase()} is available.</p>
        </div>

        <div style="padding: 20px 24px;">
          <p style="margin: 0 0 14px; font-size: 18px; line-height: 1.4; color: #0f1a13;">
            <strong>${title}</strong>
          </p>

          ${imageHtml}
          ${casePreviewHtml}
          ${firstQuestionHtml}

          <p style="margin: 0 0 16px;">
            <a href="${args.url}" style="display: inline-block; padding: 10px 14px; border-radius: 10px; background: #1f6f4a; color: #ffffff; font-size: 14px; text-decoration: none;">Open ${kindLabel}</a>
          </p>

          <p style="margin: 14px 0 0; font-size: 12px; color: #3f5649;">
            Unsubscribe: <a href="${unsubscribeUrl}" style="color: #1f6f4a; text-decoration: underline;">${unsubscribeUrl}</a>
          </p>
        </div>
      </div>
    </div>
  `;

  if (!canSendEmail()) {
    return { ok: false as const, reason: "provider_not_configured" as const };
  }
  return sendViaResend({ to: args.to, subject, html, text });
}

export async function sendWelcomeEmail(args: {
  to: string;
  unsubscribeToken: string;
}) {
  const baseUrl = getAppBaseUrl();
  const unsubscribeUrl = `${baseUrl}/subscribe/unsubscribe?token=${encodeURIComponent(args.unsubscribeToken)}`;
  const mechidUrl = `${baseUrl}/mechid`;
  const immunoidUrl = `${baseUrl}/tools/immunoid`;
  const probidUrl = `${baseUrl}/probid`;
  const doseidUrl = `${baseUrl}/tools/doseid`;
  const casesUrl = `${baseUrl}/cases`;
  const blogUrl = `${baseUrl}/blog`;
  const subject = "Welcome to IDHub";
  const introText =
    "IDHub is an educational hub for infectious diseases with practical tools, case-based learning, and concise clinical updates.";

  const text = [
    "Thank you for subscribing to IDHub.",
    "",
    introText,
    "",
    "Explore IDHub:",
    `Cases: ${casesUrl}`,
    `Blog: ${blogUrl}`,
    `MechID: ${mechidUrl}`,
    `ImmunoID: ${immunoidUrl}`,
    `ProbID: ${probidUrl}`,
    `DoseID: ${doseidUrl}`,
    "",
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

  const html = `
    <div style="margin: 0; padding: 24px; background: #e7f1ea; font-family: Arial, Helvetica, sans-serif; color: #0f1a13;">
      <div style="max-width: 640px; margin: 0 auto; border: 1px solid #cfe0d4; border-radius: 16px; background: #f7fbf8; overflow: hidden;">
        <div style="padding: 22px 24px; border-bottom: 1px solid #cfe0d4; background: #ffffff;">
          <h2 style="margin: 0; font-size: 24px; line-height: 1.25; color: #1f6f4a;">Welcome to IDHub</h2>
          <p style="margin: 10px 0 0; font-size: 14px; line-height: 1.5; color: #3f5649;">Thank you for subscribing.</p>
        </div>

        <div style="padding: 20px 24px;">
          <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #0f1a13;">
            ${introText}
          </p>

          <div style="margin: 0 0 14px;">
            <a href="${casesUrl}" style="display: inline-block; margin: 0 8px 8px 0; padding: 8px 12px; border-radius: 999px; border: 1px solid #cfe0d4; background: #ffffff; color: #1f6f4a; font-size: 13px; text-decoration: none;">Cases</a>
            <a href="${blogUrl}" style="display: inline-block; margin: 0 8px 8px 0; padding: 8px 12px; border-radius: 999px; border: 1px solid #cfe0d4; background: #ffffff; color: #1f6f4a; font-size: 13px; text-decoration: none;">Blog</a>
            <a href="${mechidUrl}" style="display: inline-block; margin: 0 8px 8px 0; padding: 8px 12px; border-radius: 999px; border: 1px solid #cfe0d4; background: #ffffff; color: #1f6f4a; font-size: 13px; text-decoration: none;">MechID</a>
            <a href="${immunoidUrl}" style="display: inline-block; margin: 0 8px 8px 0; padding: 8px 12px; border-radius: 999px; border: 1px solid #cfe0d4; background: #ffffff; color: #1f6f4a; font-size: 13px; text-decoration: none;">ImmunoID</a>
            <a href="${probidUrl}" style="display: inline-block; margin: 0 8px 8px 0; padding: 8px 12px; border-radius: 999px; border: 1px solid #cfe0d4; background: #ffffff; color: #1f6f4a; font-size: 13px; text-decoration: none;">ProbID</a>
            <a href="${doseidUrl}" style="display: inline-block; margin: 0 8px 8px 0; padding: 8px 12px; border-radius: 999px; border: 1px solid #cfe0d4; background: #ffffff; color: #1f6f4a; font-size: 13px; text-decoration: none;">DoseID</a>
          </div>

          <p style="margin: 14px 0 0; font-size: 12px; color: #3f5649;">
            Unsubscribe: <a href="${unsubscribeUrl}" style="color: #1f6f4a; text-decoration: underline;">${unsubscribeUrl}</a>
          </p>
        </div>
      </div>
    </div>
  `;

  if (!canSendEmail()) {
    return { ok: false as const, reason: "provider_not_configured" as const };
  }
  return sendViaResend({ to: args.to, subject, html, text });
}
