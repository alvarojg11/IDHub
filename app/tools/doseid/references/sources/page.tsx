import Link from "next/link";
import { DOSEID_MEDICATIONS } from "@/lib/doseidData";

type RefItem = {
  citation: string;
  url: string;
};

type CoverageBlock = {
  title: string;
  medicationIds: string[];
  references: RefItem[];
  note?: string;
};

const medicationNameById = new Map(DOSEID_MEDICATIONS.map((med) => [med.id, med.name]));

function medNames(ids: string[]) {
  return ids
    .map((id) => medicationNameById.get(id))
    .filter(Boolean)
    .sort((a, b) => a!.localeCompare(b!)) as string[];
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">{title}</h2>
      <div className="mt-5 space-y-6">{children}</div>
    </section>
  );
}

function RefEntry({ item }: { item: RefItem }) {
  return (
    <article className="border-b border-[var(--border)] pb-6 last:border-b-0 last:pb-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Reference</span>
      <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]/85">{item.citation}</p>
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[var(--primary)] hover:underline underline-offset-2"
      >
        Open source <span className="text-[var(--primary)]/80">{item.url}</span>
      </a>
    </article>
  );
}

function MedicationChips({ ids }: { ids: string[] }) {
  const names = medNames(ids);
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {names.map((name) => (
        <span
          key={name}
          className="rounded-full border border-[var(--border)] bg-[var(--cardHover)] px-3 py-1 text-xs text-[var(--foreground)]/85"
        >
          {name}
        </span>
      ))}
    </div>
  );
}

const coreRenalRefs: RefItem[] = [
  {
    citation: "UCSF Infectious Diseases Management Program. Adult Antimicrobial Dosing, Non-dialysis.",
    url: "https://idmp.ucsf.edu/adult-antimicrobial-dosing-non-dialysis",
  },
  {
    citation: "UCSF Infectious Diseases Management Program. Adult Antimicrobial Dosing, Intermittent & Continuous Hemodialysis.",
    url: "https://idmp.ucsf.edu/adult-antimicrobial-dosing-intermittent-continuous-hemodialysis",
  },
  {
    citation: "Nebraska Medicine Antimicrobial Stewardship Program. Renal Dosage Adjustment Guidelines for Antimicrobials.",
    url: "https://www.unmc.edu/intmed/_documents/id/asp/dose-pdf-antimicrobial-renal-dosing-guidelines.pdf",
  },
];

const specialAgentRefs: RefItem[] = [
  {
    citation: "UCSF IDMP. Foscarnet (includes adjusted CrCl mL/min/kg method and obesity dosing notes).",
    url: "https://idmp.ucsf.edu/content/foscarnet",
  },
  {
    citation: "UCSF IDMP. Amikacin.",
    url: "https://idmp.ucsf.edu/content/amikacin",
  },
  {
    citation: "UCSF IDMP. Gentamicin.",
    url: "https://idmp.ucsf.edu/content/gentamicin",
  },
  {
    citation: "UCSF IDMP. Tobramycin.",
    url: "https://idmp.ucsf.edu/content/tobramycin",
  },
  {
    citation: "UCSF IDMP. Polymyxin B.",
    url: "https://idmp.ucsf.edu/content/polymyxin-b",
  },
  {
    citation: "UCSF IDMP. Vancomycin Initial Dosing Nomogram.",
    url: "https://idmp.ucsf.edu/content/vancomycin-initial-dosing-nomogram",
  },
  {
    citation: "UCSF IDMP. Vancomycin PO.",
    url: "https://idmp.ucsf.edu/content/vancomycin-po",
  },
];

const tbRefs: RefItem[] = [
  {
    citation: "Nahid P, et al. ATS/CDC/IDSA Clinical Practice Guidelines: Treatment of Drug-Susceptible Tuberculosis.",
    url: "https://www.idsociety.org/practice-guideline/treatment-of-drug-susceptible-tb/",
  },
  {
    citation:
      "CDC. New treatment regimens for drug-susceptible tuberculosis infection and disease in the United States (2025 update).",
    url: "https://www.cdc.gov/tb/hcp/treatment/tuberculosis-disease.html",
  },
];

const antifungalRefs: RefItem[] = [
  {
    citation: "UCSF IDMP. Voriconazole (including obesity prophylaxis notes).",
    url: "https://idmp.ucsf.edu/content/voriconazole",
  },
  {
    citation: "Pappas PG, et al. Clinical Practice Guideline for the Management of Candidiasis (IDSA).",
    url: "https://www.idsociety.org/practice-guideline/candidiasis/",
  },
  {
    citation: "Patterson TF, et al. Practice Guidelines for the Diagnosis and Management of Aspergillosis (IDSA).",
    url: "https://www.idsociety.org/practice-guideline/aspergillosis/",
  },
];

const antiviralRefs: RefItem[] = [
  {
    citation: "UCSF IDMP. Acyclovir PO.",
    url: "https://idmp.ucsf.edu/content/acyclovir-po",
  },
  {
    citation: "UCSF IDMP. Acyclovir IV.",
    url: "https://idmp.ucsf.edu/content/acyclovir-iv",
  },
  {
    citation: "UCSF IDMP. Valacyclovir.",
    url: "https://idmp.ucsf.edu/content/valacyclovir",
  },
  {
    citation: "UCSF IDMP. Ganciclovir.",
    url: "https://idmp.ucsf.edu/content/ganciclovir",
  },
  {
    citation: "UCSF IDMP. Valganciclovir.",
    url: "https://idmp.ucsf.edu/content/valganciclovir",
  },
  {
    citation: "UCSF IDMP. Oseltamivir.",
    url: "https://idmp.ucsf.edu/content/oseltamivir",
  },
  {
    citation: "UCSF IDMP. Foscarnet.",
    url: "https://idmp.ucsf.edu/content/foscarnet",
  },
  {
    citation: "DailyMed (FDA label). Famciclovir renal dosage recommendations.",
    url: "https://dailymed.nlm.nih.gov/dailymed/getFile.cfm?setid=4053724a-db89-4b11-bf39-20410ef5b9aa&type=pdf",
  },
];

const obesityDosingRefs: RefItem[] = [
  {
    citation:
      "Stanford Antimicrobial Dosing Guide for Obesity (adult dosing ranges including clindamycin high-dose IV/PO options).",
    url: "https://med.stanford.edu/content/dam/sm/bugsanddrugs/documents/antimicrobial-dosing-protocols/SHC-ABX-Obesity-Dosing-Guide.pdf",
  },
  {
    citation:
      "Castro-Balado A, et al. Updated antimicrobial dosing recommendations for obese patients. Antimicrob Agents Chemother. 2024;68(3):e0171923.",
    url: "https://journals.asm.org/doi/10.1128/aac.01719-23",
  },
];

const antibacterialSpecialIds = new Set([
  "amikacin",
  "gentamicin",
  "tobramycin",
  "vancomycin_iv",
  "vancomycin_po",
  "polymyxin_b",
]);

const antibacterialGeneralIds = DOSEID_MEDICATIONS.filter(
  (med) => med.category === "antibacterial" && !antibacterialSpecialIds.has(med.id)
).map((med) => med.id);

const antibacterialTdmIds = DOSEID_MEDICATIONS.filter(
  (med) => med.category === "antibacterial" && antibacterialSpecialIds.has(med.id)
).map((med) => med.id);

const tbIds = DOSEID_MEDICATIONS.filter((med) => med.category === "mycobacterial_tb").map((med) => med.id);
const antifungalIds = DOSEID_MEDICATIONS.filter((med) => med.category === "antifungal").map((med) => med.id);
const antiviralIds = DOSEID_MEDICATIONS.filter((med) => med.category === "antiviral").map((med) => med.id);
const clindamycinIds = DOSEID_MEDICATIONS.filter((med) => med.id === "clindamycin").map((med) => med.id);

const coverageBlocks: CoverageBlock[] = [
  {
    title: "Antibacterial: Core Renal Dosing Tables",
    medicationIds: antibacterialGeneralIds,
    references: coreRenalRefs,
    note: "These core tables are the primary dosing framework for most antibacterial pathways in DoseID.",
  },
  {
    title: "Antibacterial: Level-Guided and Special Agents",
    medicationIds: antibacterialTdmIds,
    references: specialAgentRefs,
    note: "These agents rely on specific drug pages and therapeutic monitoring protocols in addition to core tables.",
  },
  {
    title: "Obesity-Focused Dosing Evidence",
    medicationIds: clindamycinIds,
    references: obesityDosingRefs,
    note: "Used for clindamycin high-dose defaulting in obesity and bone/joint pathways where PK uncertainty exists.",
  },
  {
    title: "Mycobacterial/TB",
    medicationIds: tbIds,
    references: tbRefs,
    note: "TB pathways use national guidance plus institutional cross-checking for renal and interval adjustments.",
  },
  {
    title: "Antifungal",
    medicationIds: antifungalIds,
    references: [...coreRenalRefs, ...antifungalRefs],
    note: "Antifungal dosing combines renal-dose references with IDSA syndrome-specific guidance.",
  },
  {
    title: "Antiviral",
    medicationIds: antiviralIds,
    references: [...coreRenalRefs, ...antiviralRefs],
    note: "Antiviral pathways are anchored to UCSF IDMP drug-specific renal dosing references.",
  },
];

export default function DoseIDSourcesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl tracking-tight">
            <span className="font-extrabold text-[var(--foreground)]">DoseID</span>
            <span className="font-semibold text-[var(--foreground)]/80"> References</span>
          </h1>

          <Link
            href="/tools/doseid/references"
            className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--cardHover)] transition"
          >
            ← Back
          </Link>
        </div>

        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--foreground)]/85">
          Medication-level source mapping for current DoseID dosing pathways. Local institutional protocols and specialist
          review remain required for final prescribing.
        </p>
      </header>

      <div className="grid gap-6">
        {coverageBlocks.map((block) => (
          <SectionCard key={block.title} title={block.title}>
            {block.note && <p className="text-sm leading-relaxed text-[var(--foreground)]/80">{block.note}</p>}
            {block.references.map((item) => (
              <RefEntry key={`${block.title}-${item.url}`} item={item} />
            ))}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">DoseID Medications Covered</p>
              <MedicationChips ids={block.medicationIds} />
            </div>
          </SectionCard>
        ))}
      </div>
    </main>
  );
}
