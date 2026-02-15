import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

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
            Link <span className="text-[var(--primary)]/80">{item.doi}</span>
          </a>
        </div>
      ) : null}
    </article>
  );
}

export default function ImmunoIDReferencesPage() {
  const references: Reference[] = [
    {
      section: "General Framework",
      citation:
        "Taplitz RA, Kennedy EB, Bow EJ, et al. Outpatient Management of Fever and Neutropenia in Adults Treated for Malignancy: ASCO and IDSA Clinical Practice Guideline Update. J Clin Oncol. 2018;36(14):1443-1453.",
      doi: "https://doi.org/10.1200/JCO.2017.77.6211",
    },
    {
      section: "General Framework",
      citation:
        "Taplitz RA, Kennedy EB, Bow EJ, et al. Antimicrobial Prophylaxis for Adult Patients With Cancer-Related Immunosuppression: ASCO and IDSA Clinical Practice Guideline Update. J Clin Oncol. 2018;36(30):3043-3054.",
      doi: "https://doi.org/10.1200/JCO.18.00374",
    },
    {
      section: "Rheumatology / Autoimmune",
      citation:
        "Fragoulis GE, Nikiphorou E, Larsen J, et al. 2022 EULAR recommendations for screening and prophylaxis of chronic and opportunistic infections in adults with autoimmune inflammatory rheumatic diseases. Ann Rheum Dis. 2023;82(6):742-753.",
      doi: "https://doi.org/10.1136/ard-2022-223335",
    },
    {
      section: "TNF Inhibitors and TB",
      citation:
        "Keane J, Gershon S, Wise RP, et al. Tuberculosis associated with infliximab, a tumor necrosis factor alpha-neutralizing agent. N Engl J Med. 2001;345(15):1098-1104.",
      doi: "https://doi.org/10.1056/NEJMoa011110",
    },
    {
      section: "HBV Reactivation",
      citation:
        "Terrault NA, Lok ASF, McMahon BJ, et al. Update on prevention, diagnosis, and treatment of chronic hepatitis B: AASLD 2018 hepatitis B guidance. Hepatology. 2018;67(4):1560-1599.",
      doi: "https://doi.org/10.1002/hep.29800",
    },
    {
      section: "Complement Inhibition",
      citation:
        "McNamara LA, Topaz N, Wang X, et al. High Risk for Invasive Meningococcal Disease Among Patients Receiving Eculizumab (Soliris) Despite Receipt of Meningococcal Vaccine. MMWR Morb Mortal Wkly Rep. 2017;66(27):734-737.",
      doi: "https://doi.org/10.15585/mmwr.mm6627e1",
    },
    {
      section: "Cell Therapy / CAR-T",
      citation:
        "Kampouri E, Walti CS, Sarmati L, et al. How I prevent infections in patients receiving CD19-targeted chimeric antigen receptor T cells for B-cell malignancies. Transpl Infect Dis. 2023;25(6):e14157.",
      doi: "https://doi.org/10.1111/tid.14157",
    },
    {
      section: "Risk Curation",
      citation:
        "Ahmed S, Siddiqui AK. Infections associated with novel therapeutic monoclonal antibodies and fusion proteins in immune-mediated diseases and cancer. Ther Deliv. 2024;15(11):741-755.",
      doi: "https://doi.org/10.46989/001c.115932",
    },
  ];

  const grouped = references.reduce<Record<string, Reference[]>>((acc, r) => {
    (acc[r.section] ??= []).push(r);
    return acc;
  }, {});

  const sectionOrder = [
    "General Framework",
    "Rheumatology / Autoimmune",
    "TNF Inhibitors and TB",
    "HBV Reactivation",
    "Complement Inhibition",
    "Cell Therapy / CAR-T",
    "Risk Curation",
  ];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-14 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl tracking-tight">
            <span className="font-extrabold text-[var(--foreground)]">ImmunoID</span>
            <span className="font-semibold text-[var(--foreground)]/80">
              {" "}
              References
            </span>
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--foreground)]/85 text-justify">
            Literature and guidance documents used to curate infection-risk patterns
            in ImmunoID. Scoring remains an educational heuristic rather than a
            validated predictive model.
          </p>
        </div>

        <Link
          href="/tools/immunoid/references"
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
      </section>

      <SiteFooter />
    </main>
  );
}
