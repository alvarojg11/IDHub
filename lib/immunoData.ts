// lib/immunoData.ts

export type RiskTag =
  | "Bacterial (general)"
  | "Neutropenia-related infections"
  | "C. difficile"
  | "PJP"
  | "TB (reactivation)"
  | "HBV reactivation"
  | "CMV"
  | "VZV/HSV"
  | "Invasive mold (Aspergillus)"
  | "Endemic fungi"
  | "Nocardia"
  | "Listeria"
  | "Strongyloides"
  | "Cryptococcus"
  | "Encapsulated bacteria";

export type ImmunoDrug = {
  id: string; // keep this flexible
  name: string;
  class: string;
  mechanism: string;
  commonRisks: Array<{
    tag: RiskTag;
    why?: string;
    strength?: 1 | 2 | 3; // 1=possible, 2=common, 3=high-yield
  }>;
  baseScore: number; // 0–10 rough teaching weight
  notes?: string[];
};

// Helpers (keep entries concise)
const risk = (tag: RiskTag, strength: 1 | 2 | 3, why?: string) => ({
  tag,
  strength,
  why,
});

const steroid = (id: string, name: string, thresholdNote: string): ImmunoDrug => ({
  id,
  name,
  class: "Corticosteroid (systemic)",
  mechanism:
    "Broad immunosuppression: reduced cytokine production, impaired phagocyte function, and lymphocyte effects (dose-dependent).",
  commonRisks: [
    risk("Bacterial (general)", 2),
    risk("VZV/HSV", 2),
    risk("TB (reactivation)", 2),
    risk("Strongyloides", 2, "Consider in relevant epidemiology; steroids can precipitate hyperinfection."),
    risk("PJP", 3, "Risk increases with prolonged moderate–high dose steroids (esp. with other agents)."),
    risk("C. difficile", 1, "Often related to concurrent antibiotics/healthcare exposure."),
  ],
  baseScore: 6,
  notes: [thresholdNote],
});

const localizedSteroid = (id: string, name: string, note: string): ImmunoDrug => ({
  id,
  name,
  class: "Corticosteroid (mostly local effect)",
  mechanism:
    "Glucocorticoid effect with predominantly local activity (lower systemic immunosuppression than high-dose systemic steroids).",
  commonRisks: [
    risk("Bacterial (general)", 1),
    risk("C. difficile", 1),
  ],
  baseScore: 2,
  notes: [note],
});

const alkylator = (id: string, name: string, subclass?: string): ImmunoDrug => ({
  id,
  name,
  class: subclass ? `Alkylating agent (${subclass})` : "Alkylating agent",
  mechanism:
    "DNA damage/cross-linking → cytotoxicity, often via marrow suppression; infection risk driven by neutropenia and mucosal barrier injury.",
  commonRisks: [
    risk("Neutropenia-related infections", 3, "Risk depends on regimen intensity and ANC nadir/duration."),
    risk("Bacterial (general)", 2),
    risk("Invasive mold (Aspergillus)", 2, "Higher with prolonged severe neutropenia."),
    risk("PJP", 2, "Consider prophylaxis in certain regimens/combination immunosuppression."),
    risk("CMV", 1),
  ],
  baseScore: 7,
});

const antimetaboliteChemo = (id: string, name: string): ImmunoDrug => ({
  id,
  name,
  class: "Antimetabolite",
  mechanism:
    "Inhibits nucleotide synthesis or DNA replication → cytotoxicity; infection risk often via marrow suppression and mucosal injury.",
  commonRisks: [
    risk("Neutropenia-related infections", 3),
    risk("Bacterial (general)", 2),
    risk("C. difficile", 1),
    risk("Invasive mold (Aspergillus)", 2),
    risk("PJP", 1),
  ],
  baseScore: 7,
});

const transplantAgent = (id: string, name: string, drugClass: string, mechanism: string, baseScore: number, extraRisks: any[] = [], notes?: string[]) =>
  ({
    id,
    name,
    class: `Transplant / immunosuppressive (${drugClass})`,
    mechanism,
    commonRisks: [
      risk("Bacterial (general)", 2),
      risk("CMV", 2),
      risk("PJP", 2),
      ...extraRisks,
    ],
    baseScore,
    notes,
  } as ImmunoDrug);

const tnf = (id: string, name: string): ImmunoDrug => ({
  id,
  name,
  class: "TNF blocker",
  mechanism:
    "TNF-α blockade → impaired granuloma maintenance and macrophage activation.",
  commonRisks: [
    risk("TB (reactivation)", 3),
    risk("Endemic fungi", 3, "Histoplasma/Coccidioides/Blastomyces risk depends on geography/exposure."),
    risk("Listeria", 2),
    risk("VZV/HSV", 2),
    risk("Bacterial (general)", 2),
  ],
  baseScore: 6,
  notes: ["Screen for TB before therapy; consider endemic fungi risk by geography/exposure."],
});

const biologic = (id: string, name: string, drugClass: string, mechanism: string, baseScore: number, risks: any[], notes?: string[]): ImmunoDrug => ({
  id,
  name,
  class: drugClass,
  mechanism,
  commonRisks: risks,
  baseScore,
  notes,
});

export const DRUGS: ImmunoDrug[] = [
  // ---------------------------
  // High-dose steroids thresholds (from your list)
  // ---------------------------
  steroid("prednisone_20", "Prednisone ≥ 20 mg/day", "High-dose threshold: ≥20 mg prednisone-equivalent per day."),
  steroid("prednisolone_20", "Prednisolone ≥ 20 mg/day", "High-dose threshold: ≥20 mg prednisolone per day."),
  steroid("methylpred_16", "Methylprednisolone ≥ 16 mg/day", "High-dose threshold: ≥16 mg methylprednisolone per day."),
  steroid("hydrocortisone_80", "Hydrocortisone ≥ 80 mg/day", "High-dose threshold: ≥80 mg hydrocortisone per day."),
  steroid("dexamethasone_3", "Dexamethasone ≥ 3 mg/day", "High-dose threshold: ≥3 mg dexamethasone per day."),
  localizedSteroid("budesonide_6", "Budesonide ≥ 6 mg/day", "Often lower systemic effect than equivalent systemic steroids, but still immunomodulatory in practice."),

  // ---------------------------
  // Alkylating agents (grouped by subclass from your list)
  // ---------------------------
  alkylator("cyclophosphamide", "Cyclophosphamide", "Nitrogen mustard"),
  alkylator("ifosfamide", "Ifosfamide", "Nitrogen mustard"),
  alkylator("mechlorethamine", "Mechlorethamine", "Nitrogen mustard"),
  alkylator("chlorambucil", "Chlorambucil", "Nitrogen mustard"),
  alkylator("bendamustine", "Bendamustine", "Nitrogen mustard"),
  alkylator("melphalan", "Melphalan", "Nitrogen mustard"),

  alkylator("carmustine", "Carmustine", "Nitrosourea"),
  alkylator("lomustine", "Lomustine", "Nitrosourea"),
  alkylator("streptozocin", "Streptozocin", "Nitrosourea"),

  alkylator("busulfan", "Busulfan", "Alkyl sulfonate"),

  alkylator("dacarbazine", "Dacarbazine", "Triazine/hydrazine-related"),
  alkylator("procarbazine", "Procarbazine", "Triazine/hydrazine-related"),
  alkylator("temozolomide", "Temozolomide", "Triazine/hydrazine-related"),

  alkylator("altretamine", "Altretamine", "Aziridine/epoxide-related"),
  alkylator("thiotepa", "Thiotepa", "Aziridine/epoxide-related"),
  alkylator("mitomycin_c", "Mitomycin C", "Aziridine/epoxide-related"),
  alkylator("diaziquone", "Diaziquone", "Aziridine/epoxide-related"),

  alkylator("cisplatin", "Cisplatin", "Platinum"),
  alkylator("oxaliplatin", "Oxaliplatin", "Platinum"),

  // ---------------------------
  // Antimetabolites (includes oncology + classic immunomodulators)
  // ---------------------------
  biologic(
    "methotrexate",
    "Methotrexate",
    "Antimetabolite (immunomodulator)",
    "Folate antagonist → affects rapidly dividing cells; immunomodulatory effects at lower doses.",
    4,
    [risk("Bacterial (general)", 1), risk("VZV/HSV", 1), risk("PJP", 1)],
    ["Opportunistic risk increases when combined with steroids/biologics."]
  ),
  antimetaboliteChemo("pemetrexed", "Pemetrexed"),
  antimetaboliteChemo("fluorouracil_5", "5-fluorouracil (5-FU)"),
  antimetaboliteChemo("cytarabine", "Cytarabine"),
  antimetaboliteChemo("gemcitabine", "Gemcitabine"),
  biologic(
    "mercaptopurine",
    "Mercaptopurine (6-MP)",
    "Antimetabolite (thiopurine)",
    "Purine antagonist → impairs lymphocyte proliferation.",
    5,
    [risk("Bacterial (general)", 2), risk("VZV/HSV", 2), risk("CMV", 1), risk("PJP", 1)],
    ["Risk increases when combined with steroids/biologics."]
  ),
  biologic(
    "thioguanine",
    "Thioguanine",
    "Antimetabolite (thiopurine)",
    "Purine antagonist → impairs lymphocyte proliferation.",
    5,
    [risk("Bacterial (general)", 2), risk("VZV/HSV", 2), risk("CMV", 1)],
  ),

  // ---------------------------
  // Transplant-related immunosuppressive drugs
  // ---------------------------
  transplantAgent(
    "mycophenolate_mofetil",
    "Mycophenolate mofetil (MMF)",
    "Antimetabolite",
    "Inhibits IMP dehydrogenase → blocks de novo purine synthesis → suppresses lymphocyte proliferation.",
    5,
    [risk("VZV/HSV", 1)],
    ["Common in transplant regimens; opportunistic risks rise with combination therapy."]
  ),
  transplantAgent(
    "azathioprine",
    "Azathioprine",
    "Antimetabolite (thiopurine)",
    "Purine analog → impairs DNA synthesis and lymphocyte proliferation.",
    5,
    [risk("VZV/HSV", 2), risk("CMV", 1)],
  ),
  transplantAgent(
    "tacrolimus",
    "Tacrolimus",
    "Calcineurin inhibitor",
    "Inhibits calcineurin → decreases IL-2 transcription → reduced T-cell activation.",
    5,
    [risk("Nocardia", 1)],
  ),
  transplantAgent(
    "cyclosporine",
    "Cyclosporine",
    "Calcineurin inhibitor",
    "Inhibits calcineurin → decreases IL-2 transcription → reduced T-cell activation.",
    5,
    [risk("Nocardia", 1)],
  ),
  transplantAgent(
    "sirolimus",
    "Sirolimus",
    "mTOR inhibitor",
    "Inhibits mTOR → blocks T-cell proliferation (IL-2 signal transduction).",
    4
  ),
  transplantAgent(
    "everolimus",
    "Everolimus",
    "mTOR inhibitor",
    "Inhibits mTOR → blocks T-cell proliferation (IL-2 signal transduction).",
    4
  ),
  transplantAgent(
    "basiliximab",
    "Basiliximab",
    "IL-2 receptor antagonist (induction)",
    "Blocks IL-2 receptor (CD25) → prevents T-cell proliferation (often used as transplant induction).",
    5
  ),
  transplantAgent(
    "belatacept",
    "Belatacept",
    "Costimulation blocker",
    "CTLA-4 fusion protein → blocks CD80/86–CD28 costimulation → reduced T-cell activation.",
    6,
    [risk("EBV/PTLD risk (context)", 2, "Context-dependent; ensure appropriate screening/monitoring per protocol.") as any],
    ["Risk profile varies by transplant setting and concomitant agents."]
  ) as any,

  // ---------------------------
  // TNF blockers (each as selectable items)
  // ---------------------------
  tnf("infliximab", "Infliximab"),
  tnf("etanercept", "Etanercept"),
  tnf("adalimumab", "Adalimumab"),
  tnf("certolizumab", "Certolizumab pegol"),
  tnf("golimumab", "Golimumab"),

  // ---------------------------
  // Other immunosuppressive / immunomodulatory agents
  // ---------------------------
  biologic(
    "rituximab",
    "Rituximab",
    "Monoclonal antibody (anti-CD20)",
    "B-cell depletion → impaired humoral immunity and memory responses; delayed reconstitution.",
    6,
    [
      risk("HBV reactivation", 3),
      risk("Encapsulated bacteria", 2),
      risk("VZV/HSV", 2),
      risk("PJP", 2),
    ],
    ["Think HBV screening/prophylaxis when indicated."]
  ),
  biologic(
    "anakinra",
    "Anakinra",
    "Biologic (IL-1 receptor antagonist)",
    "Blocks IL-1 signaling → reduces inflammatory cascade.",
    3,
    [risk("Bacterial (general)", 2), risk("VZV/HSV", 1)]
  ),
  biologic(
    "tocilizumab",
    "Tocilizumab",
    "Biologic (IL-6 receptor inhibitor)",
    "Blocks IL-6 signaling; may blunt fever/CRP despite serious infection.",
    4,
    [risk("Bacterial (general)", 2), risk("TB (reactivation)", 1), risk("VZV/HSV", 1)],
    ["Infection may present with muted inflammatory markers."]
  ),
  biologic(
    "abatacept",
    "Abatacept",
    "Immunomodulator (CTLA-4 Ig)",
    "Blocks CD80/86–CD28 costimulation → reduces T-cell activation.",
    4,
    [risk("Bacterial (general)", 2), risk("TB (reactivation)", 1), risk("VZV/HSV", 1)]
  ),
  biologic(
    "ustekinumab",
    "Ustekinumab",
    "Biologic (IL-12/23 inhibitor)",
    "Inhibits IL-12/23 signaling → altered Th1/Th17 responses.",
    3,
    [risk("Bacterial (general)", 1), risk("TB (reactivation)", 1)]
  ),
  biologic(
    "secukinumab",
    "Secukinumab",
    "Biologic (IL-17A inhibitor)",
    "Blocks IL-17A signaling → impacts mucocutaneous defenses.",
    3,
    [risk("Fungal (Candida)", 2, "Mucocutaneous candidiasis risk is increased in some patients." as any) as any, risk("Bacterial (general)", 1)]
  ) as any,
  biologic(
    "ixekizumab",
    "Ixekizumab",
    "Biologic (IL-17A inhibitor)",
    "Blocks IL-17A signaling → impacts mucocutaneous defenses.",
    3,
    [risk("Fungal (Candida)", 2) as any, risk("Bacterial (general)", 1)]
  ) as any,
  biologic(
    "vedolizumab",
    "Vedolizumab",
    "Biologic (anti-integrin; gut-selective)",
    "Blocks α4β7 integrin → reduces lymphocyte trafficking to gut (more gut-selective immunomodulation).",
    2,
    [risk("Bacterial (general)", 1)],
    ["Generally more localized (gut-selective) compared with systemic biologics."]
  ),
  biologic(
    "natalizumab",
    "Natalizumab",
    "Biologic (anti-integrin)",
    "Blocks α4 integrin → alters leukocyte trafficking across blood–brain barrier and other tissues.",
    5,
    [risk("VZV/HSV", 1), risk("Bacterial (general)", 1)],
    ["Risk profile is highly context-specific (neurology protocols)."]
  ),
  biologic(
    "tofacitinib",
    "Tofacitinib",
    "JAK inhibitor",
    "Inhibits JAK-STAT cytokine signaling → broad immunomodulatory effects.",
    5,
    [risk("VZV/HSV", 3), risk("TB (reactivation)", 2), risk("Bacterial (general)", 2), risk("PJP", 1)]
  ),
  biologic(
    "baricitinib",
    "Baricitinib",
    "JAK inhibitor",
    "Inhibits JAK-STAT cytokine signaling → broad immunomodulatory effects.",
    5,
    [risk("VZV/HSV", 3), risk("TB (reactivation)", 2), risk("Bacterial (general)", 2), risk("PJP", 1)]
  ),

  // Hydroxychloroquine (low immunosuppression; still included per list)
  biologic(
    "hydroxychloroquine",
    "Hydroxychloroquine",
    "DMARD (immunomodulator)",
    "Modulates antigen presentation and toll-like receptor signaling; generally not a strong immunosuppressant alone.",
    1,
    [risk("Bacterial (general)", 1)],
    ["Often considered low immunosuppressive risk when used alone."]
  ),
];
