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
      section: "Rheumatology / Autoimmune",
      citation:
        "Fragoulis GE, Dey M, Zhao S, et al. Systematic literature review informing the 2022 EULAR recommendations for screening and prophylaxis of chronic and opportunistic infections in adults with autoimmune inflammatory rheumatic diseases. RMD Open. 2022;8(2):e002726.",
      doi: "https://doi.org/10.1136/rmdopen-2022-002726",
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
      section: "Anti-CD20 / HBV Reactivation",
      citation:
        "Evens AM, Jovanovic BD, Su YC, et al. Rituximab-associated hepatitis B virus (HBV) reactivation in lymphoproliferative diseases: meta-analysis and examination of FDA safety reports. Ann Oncol. 2011;22(5):1170-1180.",
      doi: "https://doi.org/10.1093/annonc/mdq583",
    },
    {
      section: "Complement Inhibition",
      citation:
        "McNamara LA, Topaz N, Wang X, et al. High Risk for Invasive Meningococcal Disease Among Patients Receiving Eculizumab (Soliris) Despite Receipt of Meningococcal Vaccine. MMWR Morb Mortal Wkly Rep. 2017;66(27):734-737.",
      doi: "https://doi.org/10.15585/mmwr.mm6627e1",
    },
    {
      section: "Vasculitis / Complement Pathway",
      citation:
        "Jayne DRW, Merkel PA, Schall TJ, Bekker P; ADVOCATE Study Group. Avacopan for the Treatment of ANCA-Associated Vasculitis. N Engl J Med. 2021;384(7):599-609.",
      doi: "https://doi.org/10.1056/NEJMoa2023386",
    },
    {
      section: "JAK Inhibitors",
      citation:
        "Winthrop KL, Isaacs J, Calabrese L, et al. Opportunistic infections associated with Janus kinase inhibitor treatment for rheumatoid arthritis: A structured literature review. Semin Arthritis Rheum. 2023;58:152120.",
      doi: "https://doi.org/10.1016/j.semarthrit.2022.152120",
    },
    {
      section: "JAK Inhibitors",
      citation:
        "Winthrop KL, Yamanaka H, Valdez H, et al. Herpes zoster and tofacitinib therapy in patients with rheumatoid arthritis. Arthritis Rheumatol. 2014;66(10):2675-2684.",
      doi: "https://doi.org/10.1002/art.38745",
    },
    {
      section: "HLH-directed Therapies (Etoposide / Emapalumab)",
      citation:
        "Henter JI, Samuelsson-Horne A, Aricó M, et al. Treatment of hemophagocytic lymphohistiocytosis with HLH-94 immunochemotherapy and bone marrow transplantation. Blood. 2002;100(7):2367-2373.",
      doi: "https://doi.org/10.1182/blood-2002-01-0172",
    },
    {
      section: "HLH-directed Therapies (Etoposide / Emapalumab)",
      citation:
        "Ehl S, Astigarraga I, von Bahr Greenwood T, et al. Recommendations for the use of etoposide-based therapy and bone marrow transplantation for the treatment of HLH: consensus statements by the HLH Steering Committee of the Histiocyte Society. J Allergy Clin Immunol Pract. 2018;6(5):1508-1517.",
      doi: "https://doi.org/10.1016/j.jaip.2018.05.031",
    },
    {
      section: "HLH-directed Therapies (Etoposide / Emapalumab)",
      citation:
        "Locatelli F, Jordan MB, Allen C, et al. Emapalumab in Children with Primary Hemophagocytic Lymphohistiocytosis. N Engl J Med. 2020;382(19):1811-1822.",
      doi: "https://doi.org/10.1056/NEJMoa1911326",
    },
    {
      section: "Cell Therapy / CAR-T",
      citation:
        "Kampouri E, Walti CS, Sarmati L, et al. How I prevent infections in patients receiving CD19-targeted chimeric antigen receptor T cells for B-cell malignancies. Transpl Infect Dis. 2023;25(6):e14157.",
      doi: "https://doi.org/10.1111/tid.14157",
    },
    {
      section: "Multiple Sclerosis / Neuro-immunology",
      citation:
        "Grebenciucova E, Pruitt A. Infections in Patients Receiving Multiple Sclerosis Disease-Modifying Therapies. Curr Neurol Neurosci Rep. 2017;17(11):88.",
      doi: "https://doi.org/10.1007/s11910-017-0800-8",
    },
    {
      section: "Multiple Sclerosis / Neuro-immunology",
      citation:
        "Croteau D, Kim T, Chan V, et al. Progressive multifocal leukoencephalopathy associated with sphingosine-1-phosphate receptor modulators: A large case series. Mult Scler Relat Disord. 2024;92:106163.",
      doi: "https://doi.org/10.1016/j.msard.2024.106163",
    },
    {
      section: "Multiple Sclerosis / Neuro-immunology",
      citation:
        "Hauser SL, Bar-Or A, Cohen JA, et al; ASCLEPIOS I and II Trial Groups. Ofatumumab versus Teriflunomide in Multiple Sclerosis. N Engl J Med. 2020;383(6):546-557.",
      doi: "https://doi.org/10.1056/NEJMoa1917246",
    },
    {
      section: "Multiple Sclerosis / Neuro-immunology",
      citation:
        "Davies L, Shehadeh R, Watkins WJ, et al. Real-world observational study of infections in people treated with ocrelizumab for multiple sclerosis. J Neurol. 2025;272(6):415.",
      doi: "https://doi.org/10.1007/s00415-025-13133-w",
    },
    {
      section: "Multiple Sclerosis / Neuro-immunology",
      citation:
        "Langer-Gould A, Atlas SW, Green AJ, Bollen AW, Pelletier D. Progressive multifocal leukoencephalopathy in a patient treated with natalizumab. N Engl J Med. 2005;353(4):375-381.",
      doi: "https://doi.org/10.1056/NEJMoa051847",
    },
    {
      section: "Dermatology / TYK2 and PDE4",
      citation:
        "Strober B, et al. Deucravacitinib versus placebo and apremilast in moderate to severe plaque psoriasis: phase 3 POETYK PSO-2 trial. J Am Acad Dermatol. 2023;88(1):40-51.",
      doi: "https://doi.org/10.1016/j.jaad.2022.08.061",
    },
    {
      section: "IL-17 Pathway and Candida",
      citation:
        "Davidson L, van den Reek J, Bruno M, et al. Risk of candidiasis associated with interleukin-17 inhibitors: A real-world observational study of multiple independent sources. Lancet Reg Health Eur. 2022;13:100266.",
      doi: "https://doi.org/10.1016/j.lanepe.2021.100266",
    },
    {
      section: "Heme/Onc Targeted Therapies",
      citation:
        "Chamilos G, Lionakis MS, Kontoyiannis DP. Invasive fungal infections associated with ibrutinib and other small molecule kinase inhibitors targeting immune signaling pathways. Clin Infect Dis. 2018;66(1):140-148.",
      doi: "https://doi.org/10.1093/cid/cix687",
    },
    {
      section: "Heme/Onc Targeted Therapies",
      citation:
        "Yin Y, Rodriguez-Abreu D, et al. Risk of Infection Associated With Ibrutinib in Patients With B-Cell Malignancies: A Systematic Review and Meta-analysis of Randomized Controlled Trials. Clin Lymphoma Myeloma Leuk. 2020;20(2):87-97.e5.",
      doi: "https://doi.org/10.1016/j.clml.2019.10.004",
    },
    {
      section: "Heme/Onc Targeted Therapies",
      citation:
        "Mato AR, Roeker LE, Lamanna N, Allan JN, Leslie L, Pagel JM, et al. Infections in patients with chronic lymphocytic leukaemia: Mitigating risk in the era of targeted therapies. Blood Rev. 2018;32(6):499-507.",
      doi: "https://doi.org/10.1016/j.blre.2018.04.007",
    },
    {
      section: "PI3K Inhibitors (CLL)",
      citation:
        "Mauro FR, Giannarelli D, Visentin A, et al. Infection control in patients treated for chronic lymphocytic leukemia with ibrutinib or idelalisib: recommendations from Italian Society of Hematology. Leuk Res. 2019;81:88-94.",
      doi: "https://doi.org/10.1016/j.leukres.2019.04.016",
    },
    {
      section: "Alemtuzumab / CD52 Depletion",
      citation:
        "George J, Mozessohn L, Lam PW. Cytomegalovirus infection risk with alemtuzumab therapy in hematological malignancies: a retrospective cohort study in the non-transplant setting. Leuk Lymphoma. 2024;65(11):1716-1723.",
      doi: "https://doi.org/10.1080/10428194.2024.2371474",
    },
    {
      section: "Multiple Myeloma",
      citation:
        "Raje NS, Anaissie E, Kumar SK, et al. Consensus guidelines and recommendations for infection prevention in multiple myeloma: a report from the International Myeloma Working Group. Lancet Haematol. 2022;9(2):e143-e161.",
      doi: "https://doi.org/10.1016/S2352-3026(21)00283-0",
    },
    {
      section: "Multiple Myeloma",
      citation:
        "Girmenia C, Cavo M, Corso A, et al. Management of infectious risk of daratumumab therapy in multiple myeloma: A consensus-based position paper from an ad hoc Italian expert panel. Crit Rev Oncol Hematol. 2022;172:103623.",
      doi: "https://doi.org/10.1016/j.critrevonc.2022.103623",
    },
    {
      section: "Proteasome Inhibitors (VZV)",
      citation:
        "Swaika A, Paulus A, Miller KC, et al. Acyclovir prophylaxis against varicella zoster virus reactivation in multiple myeloma patients treated with bortezomib-based therapies: a retrospective analysis of 100 patients. J Support Oncol. 2012;10(4):155-159.",
      doi: "https://doi.org/10.1016/j.suponc.2011.10.006",
    },
    {
      section: "Checkpoint Inhibitors and OI",
      citation:
        "Schneider BJ, Naidoo J, Santomasso BD, et al. Management of Immune-Related Adverse Events in Patients Treated With Immune Checkpoint Inhibitor Therapy: ASCO Guideline Update. J Clin Oncol. 2021;39(36):4073-4126.",
      doi: "https://doi.org/10.1200/JCO.21.01440",
    },
    {
      section: "Checkpoint Inhibitors and OI",
      citation:
        "Ocana-Guzman R, Osorio-Perez D, Chavez-Galan L. Opportunistic Infections and Immune-Related Adverse Events Associated with Administering Immune Checkpoint Inhibitors: A Narrative Review. Pharmaceuticals (Basel). 2023;16(8):1119.",
      doi: "https://doi.org/10.3390/ph16081119",
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
    "Anti-CD20 / HBV Reactivation",
    "Complement Inhibition",
    "Vasculitis / Complement Pathway",
    "JAK Inhibitors",
    "HLH-directed Therapies (Etoposide / Emapalumab)",
    "Multiple Sclerosis / Neuro-immunology",
    "Dermatology / TYK2 and PDE4",
    "IL-17 Pathway and Candida",
    "Heme/Onc Targeted Therapies",
    "PI3K Inhibitors (CLL)",
    "Alemtuzumab / CD52 Depletion",
    "Multiple Myeloma",
    "Proteasome Inhibitors (VZV)",
    "Checkpoint Inhibitors and OI",
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
