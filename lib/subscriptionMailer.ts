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
  replyTo?: string;
};

type ContentUpdateEmailInput = {
  title: string;
  url: string;
  kind: "case" | "blog";
  summary?: string | null;
  firstQuestion?: string | null;
  imageUrl?: string | null;
  unsubscribeToken: string;
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
      reply_to: input.replyTo,
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
  const email = buildContentUpdateEmail(args);

  if (!canSendEmail()) {
    return { ok: false as const, reason: "provider_not_configured" as const };
  }
  return sendViaResend({ to: args.to, subject: email.subject, html: email.html, text: email.text });
}

export function buildContentUpdateEmail(args: ContentUpdateEmailInput) {
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
  if (summary) {
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

  const summaryHtml =
    summary
      ? `
          <div style="margin: 0 0 16px; border: 1px solid #dde5e2; border-radius: 12px; background: #ffffff; padding: 16px;">
            <p style="margin: 0 0 6px; font-size: 11px; font-weight: 700; color: #145c47; letter-spacing: 0.12em; text-transform: uppercase;">${args.kind === "case" ? "Preview" : "Opening Lines"}</p>
            <p style="margin: 0; font-size: ${args.kind === "case" ? "14px" : "16px"}; line-height: ${args.kind === "case" ? "1.7" : "1.75"}; color: #102019;${args.kind === "blog" ? " font-style: italic;" : ""}">${summary}</p>
          </div>
        `
      : "";

  const firstQuestionHtml =
    args.kind === "case" && firstQuestion
      ? `
          <div style="margin: 0 0 16px; border: 1px solid #dde5e2; border-radius: 12px; background: #ffffff; padding: 16px;">
            <p style="margin: 0 0 6px; font-size: 11px; font-weight: 700; color: #145c47; letter-spacing: 0.12em; text-transform: uppercase;">First Question</p>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #102019;">${firstQuestion}</p>
          </div>
        `
      : "";

  const imageHtml =
    args.kind === "case" && imageUrl
      ? `
          <div style="margin: 0 0 16px; border: 1px solid #dde5e2; border-radius: 12px; overflow: hidden;">
            <img
              src="${escapeHtml(imageUrl)}"
              alt="${title}"
              style="display: block; width: 100%; height: auto;"
            />
          </div>
        `
      : "";

  const ctaLabel = args.kind === "blog" ? "Read the full post" : `Read ${kindLabel}`;

  const html = `
    <div style="margin: 0; padding: 32px 16px; background: #f3f7f6; font-family: 'Avenir Next', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; color: #102019;">
      <div style="max-width: 600px; margin: 0 auto;">

        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 11px; font-weight: 700; color: #145c47; letter-spacing: 0.12em; text-transform: uppercase;">New ${kindLabel}</span>
        </div>

        <div style="border: 1px solid #dde5e2; border-radius: 16px; background: #ffffff; overflow: hidden; box-shadow: 0 18px 40px rgba(13, 30, 24, 0.08);">

          <div style="padding: 28px 28px 20px;">
            <h1 style="margin: 0 0 8px; font-size: 22px; line-height: 1.2; letter-spacing: -0.022em; color: #102019; font-weight: 800;">${title}</h1>
            <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #53675f;">A new ${kindLabel.toLowerCase()} is now available on IDHub.</p>
          </div>

          <div style="padding: 0 28px 28px;">
            ${imageHtml}
            ${summaryHtml}
            ${firstQuestionHtml}

            <div style="text-align: center; margin: 8px 0 0;">
              <a href="${args.url}" style="display: inline-block; padding: 12px 28px; border-radius: 999px; background: #145c47; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; box-shadow: 0 12px 28px rgba(20, 92, 71, 0.22);">${ctaLabel}</a>
            </div>
          </div>

        </div>

        <div style="text-align: center; padding: 24px 0 0;">
          <p style="margin: 0 0 4px; font-size: 12px; color: #53675f;">InfectiousDiseaseHub</p>
          <p style="margin: 0; font-size: 11px; color: #73877f;">
            <a href="${unsubscribeUrl}" style="color: #73877f; text-decoration: underline;">Unsubscribe</a>
          </p>
        </div>

      </div>
    </div>
  `;

  return { subject, html, text };
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

  const pillLink = (href: string, label: string) =>
    `<a href="${href}" style="display: inline-block; margin: 0 6px 8px 0; padding: 8px 16px; border-radius: 999px; border: 1px solid #dde5e2; background: #ffffff; color: #145c47; font-size: 13px; font-weight: 600; text-decoration: none; box-shadow: 0 2px 6px rgba(13, 30, 24, 0.05);">${label}</a>`;

  const html = `
    <div style="margin: 0; padding: 32px 16px; background: #f3f7f6; font-family: 'Avenir Next', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; color: #102019;">
      <div style="max-width: 600px; margin: 0 auto;">

        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 11px; font-weight: 700; color: #145c47; letter-spacing: 0.12em; text-transform: uppercase;">Welcome</span>
        </div>

        <div style="border: 1px solid #dde5e2; border-radius: 16px; background: #ffffff; overflow: hidden; box-shadow: 0 18px 40px rgba(13, 30, 24, 0.08);">

          <div style="padding: 28px 28px 16px;">
            <h1 style="margin: 0 0 10px; font-size: 24px; line-height: 1.15; letter-spacing: -0.022em; color: #102019; font-weight: 800;">Welcome to IDHub</h1>
            <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #53675f;">Thank you for subscribing.</p>
          </div>

          <div style="padding: 0 28px 24px;">
            <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.7; color: #102019;">
              ${introText}
            </p>

            <p style="margin: 0 0 6px; font-size: 11px; font-weight: 700; color: #145c47; letter-spacing: 0.12em; text-transform: uppercase;">Explore</p>
            <div style="margin: 0 0 8px;">
              ${pillLink(casesUrl, "Cases")}
              ${pillLink(blogUrl, "Blog")}
              ${pillLink(mechidUrl, "MechID")}
              ${pillLink(immunoidUrl, "ImmunoID")}
              ${pillLink(probidUrl, "ProbID")}
              ${pillLink(doseidUrl, "DoseID")}
            </div>
          </div>

        </div>

        <div style="text-align: center; padding: 24px 0 0;">
          <p style="margin: 0 0 4px; font-size: 12px; color: #53675f;">InfectiousDiseaseHub</p>
          <p style="margin: 0; font-size: 11px; color: #73877f;">
            <a href="${unsubscribeUrl}" style="color: #73877f; text-decoration: underline;">Unsubscribe</a>
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

export async function sendContactEmail(args: {
  name: string;
  email: string;
  organization?: string;
  message: string;
  context?: "contact" | "research";
}) {
  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) {
    return { ok: false as const, reason: "recipient_not_configured" as const };
  }

  const organization = args.organization?.trim();
  const context = args.context === "research" ? "research" : "contact";
  const contextLabel = context === "research" ? "research inquiry" : "contact";
  const subjectPrefix = process.env.CONTACT_SUBJECT_PREFIX?.trim() || "IDHub contact";
  const subject = `${subjectPrefix} (${contextLabel}): ${args.name}`;
  const escapedName = escapeHtml(args.name);
  const escapedEmail = escapeHtml(args.email);
  const escapedOrg = organization ? escapeHtml(organization) : null;
  const escapedMessage = escapeHtml(args.message).replace(/\n/g, "<br/>");

  const text = [
    `Name: ${args.name}`,
    `Email: ${args.email}`,
    `Organization: ${organization || "-"}`,
    `Context: ${contextLabel}`,
    "",
    "Message:",
    args.message,
  ].join("\n");

  const html = `
    <div style="margin: 0; padding: 32px 16px; background: #f3f7f6; font-family: 'Avenir Next', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; color: #102019;">
      <div style="max-width: 600px; margin: 0 auto;">

        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 11px; font-weight: 700; color: #145c47; letter-spacing: 0.12em; text-transform: uppercase;">${context === "research" ? "Research Inquiry" : "Contact Message"}</span>
        </div>

        <div style="border: 1px solid #dde5e2; border-radius: 16px; background: #ffffff; overflow: hidden; box-shadow: 0 18px 40px rgba(13, 30, 24, 0.08);">

          <div style="padding: 28px 28px 16px;">
            <h1 style="margin: 0 0 8px; font-size: 20px; line-height: 1.2; letter-spacing: -0.022em; color: #102019; font-weight: 800;">New ${context === "research" ? "research" : "contact"} message</h1>
            <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #53675f;">Sent from the IDHub ${context === "research" ? "research" : "contact"} page.</p>
          </div>

          <div style="padding: 0 28px 24px;">
            <table style="width: 100%; border-collapse: collapse; margin: 0 0 16px;">
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #53675f; width: 100px; vertical-align: top;">Name</td>
                <td style="padding: 6px 0; font-size: 14px; color: #102019; font-weight: 600;">${escapedName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #53675f; vertical-align: top;">Email</td>
                <td style="padding: 6px 0; font-size: 14px; color: #102019;">${escapedEmail}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #53675f; vertical-align: top;">Organization</td>
                <td style="padding: 6px 0; font-size: 14px; color: #102019;">${escapedOrg ?? "—"}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #53675f; vertical-align: top;">Context</td>
                <td style="padding: 6px 0; font-size: 14px; color: #102019;">${escapeHtml(contextLabel)}</td>
              </tr>
            </table>

            <div style="border: 1px solid #dde5e2; border-radius: 12px; background: #f3f7f6; padding: 16px;">
              <p style="margin: 0 0 6px; font-size: 11px; font-weight: 700; color: #145c47; letter-spacing: 0.12em; text-transform: uppercase;">Message</p>
              <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #102019;">${escapedMessage}</p>
            </div>
          </div>

        </div>

        <div style="text-align: center; padding: 24px 0 0;">
          <p style="margin: 0; font-size: 12px; color: #53675f;">InfectiousDiseaseHub</p>
        </div>

      </div>
    </div>
  `;

  if (!canSendEmail()) {
    return { ok: false as const, reason: "provider_not_configured" as const };
  }
  return sendViaResend({ to, subject, html, text, replyTo: args.email });
}
