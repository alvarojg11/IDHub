import Link from "next/link";

import { confirmSubscriptionByToken } from "@/lib/subscriptionsStore";

export const runtime = "nodejs";

export default async function ConfirmSubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token ?? "";
  const result = token ? await confirmSubscriptionByToken(token) : { ok: false as const, reason: "invalid_token" as const };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
        Subscription Confirmation
      </h1>

      <section className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        {result.ok ? (
          <>
            <p className="text-[var(--foreground)]">
              Subscription confirmed for <span className="font-semibold">{result.email}</span>.
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              You will now receive updates for new cases and blog posts.
            </p>
          </>
        ) : (
          <>
            <p className="text-[var(--foreground)]">
              This confirmation link is invalid or expired.
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              You can submit your email again to request a new confirmation link.
            </p>
          </>
        )}

        <div className="mt-4">
          <Link href="/subscribe" className="text-sm font-semibold text-[var(--primary)] hover:underline">
            Go to subscription page
          </Link>
        </div>
      </section>
    </main>
  );
}
