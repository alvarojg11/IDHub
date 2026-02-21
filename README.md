This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Email Subscriptions

IDHub includes a built-in subscription flow:

- `/subscribe` for signup
- `/subscribe/confirm?token=...` for double opt-in confirmation
- `/subscribe/unsubscribe?token=...` for one-click unsubscribe
- `POST /api/subscriptions/notify` to send new-case/new-blog notifications

### Required environment variables (email delivery)

```bash
RESEND_API_KEY=...
RESEND_FROM_EMAIL="IDHub <noreply@yourdomain.com>"
APP_BASE_URL="https://your-domain.com"
SUBSCRIPTIONS_NOTIFY_SECRET="choose-a-strong-secret"
```

### Triggering notifications

Call the notify endpoint with your secret:

```bash
curl -X POST https://your-domain.com/api/subscriptions/notify \
  -H "Content-Type: application/json" \
  -H "x-notify-secret: $SUBSCRIPTIONS_NOTIFY_SECRET" \
  -d '{}'
```

Use `{"dryRun": true}` to preview counts without sending.
