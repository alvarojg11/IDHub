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
  | "Encapsulated bacteria"
  | "EBV/PTLD"
  | "Fungal (Candida)";

  type RiskEntry = {
  tag: RiskTag;
  why?: string;
  strength?: 1 | 2 | 3;
};


export type ImmunoDrug = {
  id: string;
  name: string;
  class: string;
  mechanism: string;
  commonRisks: RiskEntry[];
  baseScore: number;
  notes?: string[];
};


// Helpers (keep entries concise)
const risk = (tag: RiskTag, strength: 1 | 2 | 3, why?: string): RiskEntry => ({
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

const transplantAgent = (
  id: string,
  name: string,
  drugClass: string,
  mechanism: string,
  baseScore: number,
  extraRisks: RiskEntry[] = [],
  notes?: string[]
): ImmunoDrug => ({
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
});


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

const checkpoint = (
  id: string,
  name: string,
  target: "CTLA-4" | "PD-1" | "PD-L1"
): ImmunoDrug => ({
  id,
  name,
  class: `Checkpoint inhibitor (${target})`,
  mechanism:
    target === "CTLA-4"
      ? "CTLA-4 blockade removes inhibitory signaling during early T-cell priming → increased T-cell activation (immune stimulation)."
      : target === "PD-1"
      ? "PD-1 blockade prevents T-cell exhaustion signaling → reinvigorates effector T-cell activity (immune stimulation)."
      : "PD-L1 blockade prevents tumor/host PD-L1 from suppressing PD-1+ T cells → sustained T-cell activity (immune stimulation).",
  commonRisks: [
    // Not truly “immunosuppressive”, but infections can happen due to irAEs + treatment
    risk("Bacterial (general)", 1, "Baseline infection risk is not typically increased; risk often relates to immune-related adverse events and steroid treatment."),
    risk("C. difficile", 1, "Diarrhea/colitis workups often involve antibiotics/healthcare exposure; steroids used for immune-mediated colitis can increase risk."),
    risk("TB (reactivation)", 1, "Rare/controversial; consider screening in high-risk patients per oncology/institutional practice."),
  ],
  baseScore: 1, // low immunosuppression (immune-activating)
  notes: [
    "Checkpoint inhibitors are immune-activating. Most infection risk is indirect (immune-related toxicities and immunosuppression used to treat them).",
    "Key toxicities: colitis, hepatitis, pneumonitis, endocrinopathies—these can mimic infection.",
  ]});


const carT = (id: string, name: string, targetNote?: string): ImmunoDrug => ({
  id,
  name,
  class: "Cell therapy (CAR-T / adoptive cellular therapy)",
  mechanism:
    "Adoptive cellular therapy. Infection risk is driven by lymphodepleting chemotherapy, prolonged cytopenias, hypogammaglobulinemia/B-cell aplasia (target-dependent), and immunosuppression used to treat CRS/ICANS.",
  commonRisks: [
    risk("Bacterial (general)", 3, "Early risk with neutropenia/mucositis; late risk with immune reconstitution delays."),
    risk("Neutropenia-related infections", 3, "Prolonged cytopenias can occur."),
    risk("VZV/HSV", 2),
    risk("CMV", 2, "Reactivation risk varies by center protocols and prior serostatus."),
    risk("PJP", 2, "Prophylaxis often used per institutional protocols."),
    risk("Invasive mold (Aspergillus)", 2, "Especially with prolonged neutropenia and steroid exposure."),
  ],
  baseScore: 8,
  notes: [
    ...(targetNote ? [targetNote] : []),
    "Risk varies by product, prior therapies, and supportive care/prophylaxis protocols.",
  ],
});

const adc = (id: string, name: string, target: string): ImmunoDrug => ({
  id,
  name,
  class: `Antibody–drug conjugate (ADC; target ${target})`,
  mechanism:
    "Monoclonal antibody delivers a cytotoxic payload to antigen-expressing cells; infection risk is often indirect via cytopenias (regimen-dependent).",
  commonRisks: [
    risk("Bacterial (general)", 2),
    risk("Neutropenia-related infections", 2, "Depends on degree/duration of cytopenias."),
    risk("C. difficile", 1, "Often related to concurrent antibiotics/healthcare exposure."),
    risk("PJP", 1),
  ],
  baseScore: 6,
  notes: ["Infection risk is largely driven by cytopenias and prior/concurrent therapies."],
});

const bispecific = (id: string, name: string, target: string): ImmunoDrug => ({
  id,
  name,
  class: `Bispecific T-cell engager (target ${target})`,
  mechanism:
    "Redirects T cells to tumor antigen (often CD3 x target) → immune activation; infection risk is commonly related to prior therapy burden, cytopenias, and hypogammaglobulinemia (especially in myeloma targets).",
  commonRisks: [
    risk("Bacterial (general)", 2),
    risk("Neutropenia-related infections", 2),
    risk("VZV/HSV", 2),
    risk("CMV", 1),
    risk("PJP", 1),
  ],
  baseScore: 6,
  notes: ["Risk varies substantially by disease setting and concomitant steroids/anti-cytokine therapies."],
});

const antiCD38 = (id: string, name: string): ImmunoDrug => ({
  id,
  name,
  class: "Monoclonal antibody (anti-CD38)",
  mechanism:
    "Targets CD38-expressing plasma cells (and other immune cells) → impaired humoral immunity; often used with combination regimens in myeloma.",
  commonRisks: [
    risk("Bacterial (general)", 2),
    risk("VZV/HSV", 2, "Zoster prophylaxis commonly used in myeloma regimens."),
    risk("PJP", 1),
  ],
  baseScore: 5,
  notes: ["Infection risk strongly influenced by concomitant steroids/IMiDs/proteasome inhibitors and prior lines of therapy."],
});

const antiCD19 = (id: string, name: string): ImmunoDrug => ({
  id,
  name,
  class: "Monoclonal antibody (B-cell directed)",
  mechanism:
    "B-cell targeting therapy → impaired humoral immunity and vaccine responses (degree depends on agent and schedule).",
  commonRisks: [
    risk("Encapsulated bacteria", 2),
    risk("Bacterial (general)", 2),
    risk("VZV/HSV", 1),
    risk("HBV reactivation", 1, "Screening/prophylaxis practices vary by regimen and co-therapies."),
  ],
  baseScore: 5,
});

const vegf = (id: string, name: string): ImmunoDrug => ({
  id,
  name,
  class: "Monoclonal antibody / fusion protein (VEGF/angiogenesis pathway)",
  mechanism:
    "Anti-angiogenic therapy (VEGF/VEGFR pathway). Not typically immunosuppressive; infection risk is usually not a dominant feature.",
  commonRisks: [risk("Bacterial (general)", 1)],
  baseScore: 1,
  notes: ["Main toxicities are non-infectious (bleeding, thrombosis, wound healing, etc.)."],
});

const egfr = (id: string, name: string): ImmunoDrug => ({
  id,
  name,
  class: "Monoclonal antibody (EGFR pathway)",
  mechanism:
    "EGFR pathway blockade. Not typically immunosuppressive; infection risk is generally low and often relates to skin barrier effects or concurrent chemo.",
  commonRisks: [risk("Bacterial (general)", 1)],
  baseScore: 1,
});

const immuneStim = (id: string, name: string, mechanism: string): ImmunoDrug => ({
  id,
  name,
  class: "Immune-stimulating cytokine / immunotherapy",
  mechanism,
  commonRisks: [
    risk("Bacterial (general)", 1, "Not typically immunosuppressive; risk is often indirect (lines of therapy, steroids for toxicities)."),
  ],
  baseScore: 1,
  notes: ["Included for completeness; not a classic immunosuppressant."],
});

const oncolytic = (id: string, name: string): ImmunoDrug => ({
  id,
  name,
  class: "Oncolytic virus therapy",
  mechanism:
    "Modified virus delivered to tumor to promote local oncolysis and immune activation.",
  commonRisks: [
    risk("VZV/HSV", 2, "Live viral product; avoid use in severely immunocompromised patients per oncology guidance."),
    risk("Bacterial (general)", 1),
  ],
  baseScore: 2,
});

const geneTherapy = (id: string, name: string): ImmunoDrug => ({
  id,
  name,
  class: "Gene therapy (local administration)",
  mechanism:
    "Locally administered gene therapy; not classically immunosuppressive. Infection risk is usually procedural/local.",
  commonRisks: [risk("Bacterial (general)", 1)],
  baseScore: 1,
});

const checkpointExtended = (
  id: string,
  name: string,
  target: "CTLA-4" | "PD-1" | "PD-L1" | "LAG-3"
): ImmunoDrug => ({
  ...(checkpoint(id, name, target === "LAG-3" ? "PD-1" : target) as ImmunoDrug),
  id,
  name,
  class: `Checkpoint inhibitor (${target})`,
  mechanism:
    target === "LAG-3"
      ? "LAG-3 blockade releases an inhibitory checkpoint on T cells → immune stimulation; often used with PD-1 blockade."
      : (checkpoint(id, name, target as any) as any).mechanism,
  baseScore: 1,
})

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
    [risk("EBV/PTLD", 2, "Context-dependent; ensure appropriate screening/monitoring per protocol.") ],
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
    [risk("Fungal (Candida)", 2, "Mucocutaneous candidiasis risk is increased in some patients."), risk("Bacterial (general)", 1)]
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
  
  // ---------------------------
  // Immune checkpoint inhibitors (immune-activating; included for completeness)
  // ---------------------------
  checkpoint("ipilimumab", "Ipilimumab (Yervoy)", "CTLA-4"),

  checkpoint("nivolumab", "Nivolumab (Opdivo)", "PD-1"),
  checkpoint("pembrolizumab", "Pembrolizumab (Keytruda)", "PD-1"),
  checkpoint("cemiplimab", "Cemiplimab (Libtayo)", "PD-1"),

  checkpoint("atezolizumab", "Atezolizumab (Tecentriq)", "PD-L1"),
  checkpoint("avelumab", "Avelumab (Bavencio)", "PD-L1"),
  checkpoint("durvalumab", "Durvalumab (Imfinzi)", "PD-L1"),

  checkpointExtended("dostarlimab", "Dostarlimab (Jemperli)", "PD-1"),
  checkpointExtended("retifanlimab", "Retifanlimab (Zynyz)", "PD-1"),
  checkpointExtended("toripalimab", "Toripalimab (Loqtorzi)", "PD-1"),
  checkpointExtended("tremelimumab", "Tremelimumab (Imjudo)", "CTLA-4"),
  checkpointExtended("relatlimab", "Relatlimab (part of Opdualag)", "LAG-3"),

  checkpointExtended("cosibelimab", "Cosibelimab (Unloxcyt)", "PD-L1"),

  checkpointExtended("atezolizumab_hybreza", "Atezolizumab + hyaluronidase (Tecentriq Hybreza)", "PD-L1"),
  checkpointExtended("nivolumab_qvantig", "Nivolumab + hyaluronidase (Opdivo Qvantig)", "PD-1"),
  checkpointExtended("opdualag_combo", "Nivolumab + relatlimab (Opdualag)", "PD-1"),

// --- CAR-T / cellular therapies ---
  carT("brexu_cel", "Brexucabtagene autoleucel (Tecartus)", "CAR-T; B-cell aplasia/hypogammaglobulinemia possible depending on target/disease."),
  carT("axi_cel", "Axicabtagene ciloleucel (Yescarta)", "CAR-T; infection risk varies by cytopenias + immunosuppression for CRS/ICANS."),
  carT("tisa_cel", "Tisagenlecleucel (Kymriah)", "CAR-T; prolonged cytopenias may occur."),
  carT("liso_cel", "Lisocabtagene maraleucel (Breyanzi)", "CAR-T; risk varies by disease and prior therapy."),
  carT("ide_cel", "Idecabtagene vicleucel (Abecma)", "BCMA-directed cellular therapy; hypogammaglobulinemia/infection risk in myeloma settings."),
  carT("cilta_cel", "Ciltacabtagene autoleucel (Carvykti)", "BCMA-directed cellular therapy; infection risk often influenced by prior lines and cytopenias."),
  carT("afami_cel", "Afamitresgene autoleucel (Tecelra)", "Adoptive cellular therapy; infection risk driven by cytopenias + supportive immunosuppression."),
  carT("lifileucel", "Lifileucel (Amtagvi)", "Tumor-infiltrating lymphocyte therapy; infection risk often related to lymphodepletion and cytopenias."),
  immuneStim("sipuleucel_t", "Sipuleucel-T (Provenge)", "Autologous cellular immunotherapy designed to stimulate anti-tumor immune responses."),

// --- Bispecifics / T-cell engagers ---
bispecific("blinatumomab", "Blinatumomab (Blincyto)", "CD3 x CD19"),
bispecific("glofitamab", "Glofitamab (Columvi)", "CD3 x CD20"),
bispecific("mosunetuzumab", "Mosunetuzumab (Lunsumio)", "CD3 x CD20"),
bispecific("epcoritamab", "Epcoritamab (Epkinly / Tepkinly)", "CD3 x CD20"),
bispecific("teclistamab", "Teclistamab (Tecvayli)", "CD3 x BCMA"),
bispecific("elranatamab", "Elranatamab (Elrexfio)", "CD3 x BCMA"),
bispecific("talquetamab", "Talquetamab (Talvey)", "CD3 x GPRC5D"),
bispecific("tarlatamab", "Tarlatamab (Imdelltra)", "CD3 x DLL3"),
bispecific("tebentafusp", "Tebentafusp (Kimmtrak)", "TCR x gp100 (immune redirection)"),

// --- Anti-CD38 (myeloma) ---
antiCD38("daratumumab", "Daratumumab (Darzalex / Darzalex Faspro)"),
antiCD38("isatuximab", "Isatuximab (Sarclisa)"),

// --- B-cell directed (additional) ---
biologic(
  "obinutuzumab",
  "Obinutuzumab (Gazyva / Gazyvaro)",
  "Monoclonal antibody (anti-CD20)",
  "Type II anti-CD20 monoclonal antibody → B-cell depletion → impaired humoral immunity.",
  6,
  [
    risk("HBV reactivation", 3),
    risk("Encapsulated bacteria", 2),
    risk("Bacterial (general)", 2),
    risk("VZV/HSV", 2),
    risk("PJP", 2),
  ],
  ["Similar infection considerations to rituximab; consider HBV screening/prophylaxis when indicated."]
),
antiCD19("tafasitamab", "Tafasitamab (Monjuvi / Minjuvi)"),

// --- ADCs (add from list) ---
adc("ado_trastuzumab_emtansine", "Ado-trastuzumab emtansine (Kadcyla)", "HER2"),
adc("trastuzumab_deruxtecan", "Fam-trastuzumab deruxtecan (Enhertu)", "HER2"),
adc("brentuximab_vedotin", "Brentuximab vedotin (Adcetris)", "CD30"),
adc("polatuzumab_vedotin", "Polatuzumab vedotin (Polivy)", "CD79b"),
adc("enfortumab_vedotin", "Enfortumab vedotin (Padcev)", "Nectin-4"),
adc("sacituzumab_govitecan", "Sacituzumab govitecan (Trodelvy)", "Trop-2"),
adc("mirvetuximab_soravtansine", "Mirvetuximab soravtansine (Elahere)", "FRα"),
adc("tisotumab_vedotin", "Tisotumab vedotin (Tivdak)", "Tissue factor"),
adc("belantamab_mafodotin", "Belantamab mafodotin (Blenrep)", "BCMA"),
adc("loncastuximab_tesirine", "Loncastuximab tesirine (Zynlonta)", "CD19"),
adc("gemtuzumab_ozogamicin", "Gemtuzumab ozogamicin (Mylotarg)", "CD33"),
adc("inotuzumab_ozogamicin", "Inotuzumab ozogamicin (Besponsa)", "CD22"),
adc("tagraxofusp", "Tagraxofusp (Elzonris)", "CD123"),

// --- Other oncology mAbs / immune therapies from list ---
biologic(
  "amivantamab",
  "Amivantamab (Rybrevant)",
  "Monoclonal antibody (EGFR/MET bispecific)",
  "Targets EGFR and MET signaling on tumor cells (not a classic immunosuppressant).",
  1,
  [risk("Bacterial (general)", 1)]
),
biologic(
  "daratumumab_faspro",
  "Daratumumab + hyaluronidase (Darzalex Faspro)",
  "Monoclonal antibody (anti-CD38 formulation)",
  "Subcutaneous formulation of daratumumab; see daratumumab entry for immunologic effects.",
  5,
  [risk("Bacterial (general)", 2), risk("VZV/HSV", 2), risk("PJP", 1)]
),
biologic(
  "dinutuximab",
  "Dinutuximab (Unituxin)",
  "Monoclonal antibody (anti-GD2)",
  "Targets GD2; not a classic immunosuppressant—risk is typically regimen/context related.",
  1,
  [risk("Bacterial (general)", 1)]
),
biologic(
  "dinutuximab_beta",
  "Dinutuximab beta (Qarziba)",
  "Monoclonal antibody (anti-GD2)",
  "Targets GD2; not a classic immunosuppressant—risk is typically regimen/context related.",
  1,
  [risk("Bacterial (general)", 1)]
),
biologic(
  "elotuzumab",
  "Elotuzumab (Empliciti)",
  "Monoclonal antibody (SLAMF7; myeloma)",
  "Targets SLAMF7; infection risk usually reflects myeloma regimen context.",
  4,
  [risk("Bacterial (general)", 2), risk("VZV/HSV", 1), risk("PJP", 1)]
),
biologic(
  "mogamulizumab",
  "Mogamulizumab (Poteligeo)",
  "Monoclonal antibody (CCR4)",
  "Targets CCR4 on malignant T cells; can affect immune cell subsets.",
  4,
  [risk("Bacterial (general)", 2), risk("VZV/HSV", 2), risk("CMV", 1)]
),
biologic(
  "siltuximab",
  "Siltuximab (Sylvant)",
  "Monoclonal antibody (anti-IL-6)",
  "Binds IL-6; immunomodulatory; may blunt inflammatory responses.",
  3,
  [risk("Bacterial (general)", 2)]
),
immuneStim("aldesleukin", "Aldesleukin (Proleukin)", "Recombinant IL-2 → immune stimulation and T-cell expansion (not immunosuppressive)."),
immuneStim("nogapendekin", "Nogapendekin alfa (Anktiva)", "IL-15 superagonist/IL-15 pathway stimulation → immune activation (not immunosuppressive)."),

oncolytic("t_vecc", "Talimogene laherparepvec (Imlygic)"),
geneTherapy("nadofaragene", "Nadofaragene firadenovec (Adstiladrin)"),

// --- VEGF / angiogenesis pathway (not typically immunosuppressive) ---
vegf("bevacizumab", "Bevacizumab (Avastin)"),
vegf("bevacizumab_awwb", "Bevacizumab-awwb (Mvasi)"),
vegf("bevacizumab_bvzr", "Bevacizumab-bvzr (Zirabev)"),
vegf("ramucirumab", "Ramucirumab (Cyramza)"),
vegf("ziv_aflibercept", "ziv-Aflibercept (Zaltrap)"),

// --- EGFR mAbs (low immunosuppression) ---
egfr("cetuximab", "Cetuximab (Erbitux)"),
egfr("panitumumab", "Panitumumab (Vectibix)"),
egfr("necitumumab", "Necitumumab (Portrazza)"),

// --- Trastuzumab products (not typically immunosuppressive; include as low-score) ---
biologic(
  "trastuzumab_herceptin",
  "Trastuzumab (Herceptin)",
  "Monoclonal antibody (HER2)",
  "Targets HER2. Not a classic immunosuppressant; infection risk usually reflects chemo combinations.",
  1,
  [risk("Bacterial (general)", 1)]
),
biologic(
  "trastuzumab_hylecta",
  "Trastuzumab + hyaluronidase (Herceptin Hylecta)",
  "Monoclonal antibody (HER2 formulation)",
  "Subcutaneous formulation; not a classic immunosuppressant.",
  1,
  [risk("Bacterial (general)", 1)]
),
biologic("trastuzumab_kanjinti", "Trastuzumab (Kanjinti)", "Monoclonal antibody (HER2)", "HER2-targeted; not a classic immunosuppressant.", 1, [risk("Bacterial (general)", 1)]),
biologic("trastuzumab_ogivri", "Trastuzumab (Ogivri)", "Monoclonal antibody (HER2)", "HER2-targeted; not a classic immunosuppressant.", 1, [risk("Bacterial (general)", 1)]),
biologic("trastuzumab_ontruzant", "Trastuzumab (Ontruzant)", "Monoclonal antibody (HER2)", "HER2-targeted; not a classic immunosuppressant.", 1, [risk("Bacterial (general)", 1)]),
biologic("trastuzumab_herzuma", "Trastuzumab (Herzuma)", "Monoclonal antibody (HER2)", "HER2-targeted; not a classic immunosuppressant.", 1, [risk("Bacterial (general)", 1)]),
biologic("trastuzumab_trazimera", "Trastuzumab (Trazimera)", "Monoclonal antibody (HER2)", "HER2-targeted; not a classic immunosuppressant.", 1, [risk("Bacterial (general)", 1)]),
biologic("trastuzumab_zercepac", "Trastuzumab (Zercepac)", "Monoclonal antibody (HER2)", "HER2-targeted; not a classic immunosuppressant.", 1, [risk("Bacterial (general)", 1)]),

// --- Extra HER2 combos (generally not immunosuppressive; low-score) ---
biologic(
  "pertuzumab",
  "Pertuzumab (Perjeta)",
  "Monoclonal antibody (HER2 dimerization inhibitor)",
  "HER2 dimerization blockade; infection risk mainly reflects combination chemo.",
  1,
  [risk("Bacterial (general)", 1)]
),
biologic(
  "phesgo",
  "Pertuzumab + trastuzumab + hyaluronidase (Phesgo)",
  "Monoclonal antibody combo (HER2)",
  "HER2-targeted combo; infection risk mainly reflects combination regimens.",
  1,
  [risk("Bacterial (general)", 1)]
),

// --- Additional odds/ends from list (kept low unless clear immunosuppressive signal) ---
biologic(
  "margetuximab",
  "Margetuximab (Margenza)",
  "Monoclonal antibody (HER2)",
  "Fc-engineered HER2 antibody; not a classic immunosuppressant.",
  1,
  [risk("Bacterial (general)", 1)]
),
];
