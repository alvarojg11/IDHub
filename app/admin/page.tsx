import Link from "next/link";

import AdminQuickNav from "@/components/AdminQuickNav";

export const metadata = {
  title: "Admin",
};

const tools = [
  {
    href: "/admin/subscriptions",
    title: "Subscriptions",
    description: "View subscribers, check storage mode, and send case/blog notifications.",
  },
  {
    href: "/admin/comments",
    title: "Comments",
    description: "Review blog comments, approve submissions, and moderate visibility.",
  },
  {
    href: "/admin/case-polls",
    title: "Case Polls",
    description: "Review answer distributions, per-case responses, and export CSV results.",
  },
];

export default function AdminHubPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
          Admin Hub
        </h1>
        <p className="mt-3 text-[var(--foreground)]/85">
          Quick access to subscriber management, comment moderation, and case poll analytics.
        </p>
        <AdminQuickNav current="hub" />
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:bg-[var(--cardHover)]"
          >
            <h2 className="text-lg font-semibold text-[var(--foreground)]">{tool.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{tool.description}</p>
            <p className="mt-4 text-xs font-semibold text-[var(--primary)]">Open →</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
