// app/probid/references/sources/page.tsx
import Link from "next/link";

type Reference = {
  section: string;
  citation: string;
  doi?: string;
};

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
        {title}
      </h2>
      <div className="mt-5 space-y-6">{children}</div>
    </section>
  );
}

function CitationEntry({ item }: { item: Reference }) {
  return (
    <article className="pb-6 border-b border-[var(--border)] last:border-b-0 last:pb-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
        Citation
      </span>

      <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]/85 text-justify">
        {item.citation}
      </p>

      {item.doi ? (
        <div className="mt-4">
          <a
            href={item.doi}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--primary)] hover:underline underline-offset-2"
          >
            DOI <span className="text-[var(--primary)]/80">{item.doi}</span>
          </a>
        </div>
      ) : null}
    </article>
  );
}

export default function ProbIDAllReferencesPage() {
  const references: Reference[] = [
    {
      section: "General Methods",
      citation:
        "Deeks JJ, Altman DG. Diagnostic tests 4: likelihood ratios. BMJ. 2004;329:168–169.",
      doi: "https://doi.org/10.1136/bmj.329.7458.168",
    },
    {
      section: "Endocarditis",
      citation:
        "Habib G, Lancellotti P, Antunes MJ, et al. 2015 ESC Guidelines for the management of infective endocarditis. Eur Heart J. 2015;36:3075–3128.",
      doi: "https://doi.org/10.1093/eurheartj/ehv319",
    },
    {
      section: "Endocarditis",
      citation:
        "Simon Favre, Mathieu Sauvezie, Marie Sarah Dilhuydy, Stéphane Vigouroux, Reza Tabrizi, Gaelle Laboure, Margot Robles, Noel-Jean Milpied, Krimo Bouabdallah. High Incidence of HHV-6 Infection Associated with Bendamustine, Cytarabine, Etoposide and Melphalan (BeEAM) Conditioning Regimen: Results of a Monocentric and Retrospective Study. Blood. 2016;128(22):5817.",
      doi: "https://doi.org/10.1182/blood.V128.22.5817.5817",
    },
    {
      section: "Endocarditis",
      citation:
        "San S, Ravis E, Tessonier L, et al. Diagnostic performance of 18F-FDG PET/CT in infective endocarditis: A meta-analysis. Open Heart. 2022;9:e001856.",
      doi: "https://doi.org/10.1136/openhrt-2021-001856",
    },
    {
      section: "CAP",
      citation:
        "Metlay JP, Waterer GW, Long AC, et al. Diagnosis and Treatment of Adults with Community-acquired Pneumonia. Am J Respir Crit Care Med. 2019;200:e45–e67.",
      doi: "https://doi.org/10.1164/rccm.201908-1581ST",
    },
    {
      section: "CDI",
      citation:
        "McDonald LC, Gerding DN, Johnson S, et al. Clinical Practice Guidelines for Clostridioides difficile Infection in Adults and Children. Clin Infect Dis. 2018;66:e1–e48.",
      doi: "https://doi.org/10.1093/cid/cix1085",
    },
    {
      section: "UTI",
      citation:
        "Hooton TM. Clinical practice. Uncomplicated urinary tract infection. N Engl J Med. 2012;366:1028–1037.",
      doi: "https://doi.org/10.1056/NEJMcp1104429",
    },
  ];

  const grouped = references.reduce<Record<string, Reference[]>>((acc, r) => {
    (acc[r.section] ??= []).push(r);
    return acc;
  }, {});

  const sectionOrder = ["General Methods", "Endocarditis", "CAP", "CDI", "UTI"];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-14 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl tracking-tight">
            <span className="font-extrabold text-[var(--foreground)]">ProbID</span>
            <span className="font-semibold text-[var(--foreground)]/80">
              {" "}
              References
            </span>
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--foreground)]/85 text-justify">
            Primary literature, guideline documents, and meta-analyses informing
            likelihood ratio estimates within ProbID.
            <span className="ml-2 text-[var(--muted)]">
              This list will expand as additional syndromes are curated.
            </span>
          </p>
        </div>

        <Link
          href="/probid/references"
          className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--cardHover)] transition"
        >
          ← Back
        </Link>
      </header>

      <section className="grid gap-6">
        {sectionOrder
          .filter((s) => grouped[s]?.length)
          .map((section) => (
            <SectionCard key={section} title={section}>
              {grouped[section].map((item, idx) => (
                <CitationEntry key={`${section}-${idx}`} item={item} />
              ))}
            </SectionCard>
          ))}

        {Object.keys(grouped)
          .filter((k) => !sectionOrder.includes(k))
          .sort()
          .map((section) => (
            <SectionCard key={section} title={section}>
              {grouped[section].map((item, idx) => (
                <CitationEntry key={`${section}-${idx}`} item={item} />
              ))}
            </SectionCard>
          ))}
      </section>

      <footer className="mt-16 border-t border-[var(--border)] pt-8 text-sm text-[var(--muted)]">
        IDHub is an educational project focused on clinical teaching in Infectious Disease.

        Content is for learning purposes only and does not replace clinical judgment, institutional guidelines, or consultation with infectious diseases specialists.

        © 2026 IDHub
      </footer>
    </main>
  );
}
