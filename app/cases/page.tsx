import Link from "next/link";

const cases = [
  {
    title: "Fever, Urinary Symptoms, and a Heart Murmur",
    slug: "aerococcus",
    description: "Beyond the obvious: Gram-positive clusters.",
  },
  {
    title: "Amazon Adventure",
    slug: "lobomycosis",
    description: "A returning traveler lesion.",
  },
  {
    title: "A Nose Lesion that Wouldn’t Heal",
    slug: "rhinoscleroma",
    description: "A chronic nasal lesion with a broad differential diagnosis.",
  },
  {
    title: "Hundreds of Lesions",
    slug: "tungiasis",
    description: "Neglect, poverty, and a devastating skin disease.",
  },
  {
    title: "Bloody Diarrhea Without a Clear Cause",
    slug: "spirochetosis",
    description: "An unexpected culprit.",
  },
  {
    title: "When molluscum is not molluscum",
    slug: "talaromyces",
    description: "Another skin lesion...",
  },
];

export default function CasesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
          Cases
        </h1>
        <p className="mt-4 max-w-3xl text-[var(--foreground)]/85">
          Interactive, stepwise clinical reasoning cases in infectious diseases.
          <span className="ml-2 text-[var(--muted)]">
            Designed for continuous learning through problem solving.
          </span>
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        {cases.map((c) => (
          <Link
            key={c.slug}
            href={`/cases/${c.slug}`}
            className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm hover:bg-[var(--cardHover)] transition"
          >
            <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)] group-hover:text-[var(--primary)] transition">
              {c.title}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[var(--foreground)]/80">
              {c.description}
            </p>

            <div className="mt-4 text-xs font-semibold text-[var(--primary)]">
              Open case →
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
