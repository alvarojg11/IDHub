import SubscriptionsAdminPanel from "@/components/SubscriptionsAdminPanel";
import Link from "next/link";

export const metadata = {
  title: "Subscriptions Admin | IDHub",
};

export default function SubscriptionsAdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
          Subscriptions Admin
        </h1>
        <p className="mt-3 text-[var(--foreground)]/85">
          Manage subscriber visibility and trigger case/blog notifications.
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Need comment moderation?{" "}
          <Link href="/admin/comments" className="font-semibold text-[var(--primary)] hover:underline">
            Open Comments Admin
          </Link>
        </p>
      </header>

      <SubscriptionsAdminPanel />
    </main>
  );
}
