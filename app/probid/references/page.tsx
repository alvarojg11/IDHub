import Link from "next/link";

const tiles = [
  {
    href: "/probid/references/methods",
    title: "Methods",
    desc:
      "How likelihood ratios were derived, how sensitivity and specificity were converted, and how Bayesian updating is implemented within ProbID.",
  },
  {
    href: "/probid/references/sources",
    title: "References",
    desc:
      "Primary literature, meta-analyses, and guideline documents informing likelihood ratios across Endocarditis, CAP, CDI, and UTI.",
  },
];

export default function ProbIDReferencesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-14">
        <div className="inline-flex items-baseline gap-2">
          <h1 className="text-4xl tracking-tight">
            <span className="font-extrabold text-[var(--foreground)]">
              ProbID
            </span>
            <span className="font-semibold text-[var(--foreground)]/80">
              {" "}
              Methodology
            </span>
          </h1>
        </div>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--foreground)]/85">
          Methodology and literature sources used to construct the
          probabilistic framework within ProbID.
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

      <footer className="mt-16 border-t border-[var(--border)] pt-8 text-sm text-[var(--muted)] py-12">
        <p>
            IDHub is an educational project focused on clinical teaching in Infectious Disease.

            Content is for learning purposes only and does not replace clinical judgment, institutional guidelines, or consultation with infectious diseases specialists.

            © 2026 IDHub
        </p>
      </footer>
    </main>
  );
}
