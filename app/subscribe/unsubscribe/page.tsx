import Link from "next/link";

import { unsubscribeByToken } from "@/lib/subscriptionsStore";

export const runtime = "nodejs";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token ?? "";
  const result = token ? await unsubscribeByToken(token) : { ok: false as const };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
        Unsubscribe
      </h1>

      <section className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        {result.ok ? (
          <>
            <p className="text-[var(--foreground)]">
              <span className="font-semibold">{result.email}</span> has been unsubscribed.
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              You will no longer receive IDHub email updates.
            </p>
          </>
        ) : (
          <>
            <p className="text-[var(--foreground)]">
              This unsubscribe link is invalid or expired.
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              If you still receive emails, use the latest unsubscribe link included in a recent message.
            </p>
          </>
        )}

        <div className="mt-4">
          <Link href="/" className="text-sm font-semibold text-[var(--primary)] hover:underline">
            Return to home
          </Link>
        </div>
      </section>
    </main>
  );
}
