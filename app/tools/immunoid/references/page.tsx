import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

const tiles = [
  {
    href: "/tools/immunoid/references/methods",
    title: "Methods",
    desc:
      "How ImmunoID calculates the educational immunosuppression level, including base score, combination penalty, and risk-tag aggregation.",
  },
  {
    href: "/tools/immunoid/references/sources",
    title: "References",
    desc:
      "Guidelines and primary literature used to curate infection risk patterns across immunosuppressive drug classes.",
  },
];

export default function ImmunoIDReferencesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-14">
        <div className="inline-flex items-baseline gap-2">
          <h1 className="text-4xl tracking-tight">
            <span className="font-extrabold text-[var(--foreground)]">
              ImmunoID
            </span>
            <span className="font-semibold text-[var(--foreground)]/80">
              {" "}
              Methodology
            </span>
          </h1>
        </div>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--foreground)]/85">
          Methods and references supporting the educational risk framework used in
          ImmunoID.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
          >
            <div className="flex h-full flex-col">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                {t.title}
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {t.desc}
              </p>

              <div className="mt-auto pt-5">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)]">
                  Open
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <SiteFooter />
    </main>
  );
}
