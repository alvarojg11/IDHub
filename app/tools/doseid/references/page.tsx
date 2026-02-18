import Link from "next/link";

const tiles = [
  {
    href: "/tools/doseid/references/methods",
    title: "Methods",
    desc:
      "How DoseID normalizes units, computes body-size metrics, estimates renal function, and maps indication-specific dose pathways.",
  },
  {
    href: "/tools/doseid/references/sources",
    title: "References",
    desc:
      "Primary institutional dosing references and TB guidance used to cross-check the current DoseID alpha regimens.",
  },
];

export default function DoseIDReferencesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-14">
        <div className="inline-flex items-baseline gap-2">
          <h1 className="text-4xl tracking-tight">
            <span className="font-extrabold text-[var(--foreground)]">DoseID</span>
            <span className="font-semibold text-[var(--foreground)]/80"> Methodology</span>
          </h1>
        </div>

        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--foreground)]/85">
          Methodology and source references for DoseID as an educational antimicrobial dosing reference tool.
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
              <h2 className="text-xl font-semibold text-[var(--foreground)]">{t.title}</h2>

              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{t.desc}</p>

              <div className="mt-auto pt-5">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)]">
                  Open
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
