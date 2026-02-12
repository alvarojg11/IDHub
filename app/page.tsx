import Link from "next/link";

const tiles = [
  {
    href: "/blog",
    title: "Blog",
    desc: "Reflections on diagnostics, antimicrobial therapy, and clinical reasoning in infectious diseases, shaped by training, bedside conversations, and the recognition that even strong evidence leaves room for nuance.",
  },
  {
    href: "/cases",
    title: "Cases",
    desc: "Clinical cases for ongoing learning in infectious diseases, using problem solving to revisit syndromes, pathogens, and treatment decisions.",
  },
  {
    href: "/mechid",
    title: "MechID",
    desc: "An interactive susceptibility interpretation tool to support antimicrobial selection and stewardship.",
  },
  {
    href: "/tools/immunoid",
    title: "ImmunoID",
    desc: "Explore immunosuppressive medications, mechanisms of action, and high-yield infection risks—with an educational immunosuppression level estimate.",
  },
  {
    href: "/about",
    title: "About",
    desc: "Why IDHub exists, how it’s meant to be used, and the philosophy behind case-based learning and clinical reasoning in infectious diseases.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-14">
        <div className="inline-flex items-baseline gap-2">
        <h1 className="text-5xl tracking-tight">
          <span className="font-extrabold text-[var(--foreground)]">
            ID
          </span>
          <span className="font-semibold text-[var(--foreground)]/80">
            Hub
          </span>
        </h1>
        </div>

  <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--foreground)]/85">
    An educational hub for Infectious Diseases, combining clinical cases,
    concise explanations, and interactive tools for everyday practice.
  </p>
</header>



      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

              {/* keeps every card "symmetrical" by aligning the bottom row */}
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
        <div className="max-w-5xl mx-auto space-y-2">
          <p>
            IDHub is an educational project focused on clinical teaching in Infectious Disease.
          </p>
          <p>
            Content is for learning purposes only and does not replace clinical judgment,
            institutional guidelines, or consultation with infectious diseases specialists.
        </p>
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} IDHub
        </p>
        </div>
      </footer>

    </main>
  );
}
