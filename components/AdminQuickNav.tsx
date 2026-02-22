import Link from "next/link";

type Props = {
  current?: "hub" | "subscriptions" | "comments" | "case-polls";
};

const items: Array<{ id: NonNullable<Props["current"]>; href: string; label: string }> = [
  { id: "hub", href: "/admin", label: "Admin Hub" },
  { id: "subscriptions", href: "/admin/subscriptions", label: "Subscriptions" },
  { id: "comments", href: "/admin/comments", label: "Comments" },
  { id: "case-polls", href: "/admin/case-polls", label: "Case Polls" },
];

export default function AdminQuickNav({ current }: Props) {
  return (
    <nav className="mt-4 flex flex-wrap gap-2" aria-label="Admin navigation">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            current === item.id
              ? "border-[var(--primary)] bg-[var(--primary)] text-white"
              : "border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--background)]"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
