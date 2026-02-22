import CasePollsAdminPanel from "@/components/CasePollsAdminPanel";
import Link from "next/link";

export const metadata = {
  title: "Case Polls Admin | IDHub",
};

export default function CasePollsAdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
          Case Polls Admin
        </h1>
        <p className="mt-3 text-[var(--foreground)]/85">
          Review how users answered case questions across IDHub.
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Need subscribers or comments?{" "}
          <Link href="/admin/subscriptions" className="font-semibold text-[var(--primary)] hover:underline">
            Subscriptions
          </Link>
          {" · "}
          <Link href="/admin/comments" className="font-semibold text-[var(--primary)] hover:underline">
            Comments
          </Link>
        </p>
      </header>

      <CasePollsAdminPanel />
    </main>
  );
}
