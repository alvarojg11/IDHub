import { clamp } from "@/lib/lrMath";

export type UtilityEvidence = {
  short: string;
  url?: string;
};

export type UtilityTermKey = "treatDisease" | "noTreatDisease" | "treatNoDisease" | "noTreatNoDisease";

export type UtilityTerm = {
  label: string;
  value: number;
  rationale: string;
  evidence?: UtilityEvidence;
  structuredEstimate?: boolean;
};

export type UtilityModifier = {
  id: string;
  label: string;
  description: string;
  deltas: Partial<Record<UtilityTermKey, number>>;
  evidence?: UtilityEvidence;
};

export type TreatmentUtilityModel = {
  syndromeId: string;
  syndromeLabel: string;
  diseaseLabel: string;
  treatmentLabel: string;
  noTreatmentLabel: string;
  horizonLabel: string;
  summary: string;
  terms: Record<UtilityTermKey, UtilityTerm>;
  modifiers: UtilityModifier[];
};

export type AdjustedUtilityTerm = UtilityTerm & {
  baseValue: number;
  adjustedValue: number;
  totalDelta: number;
};

export type AdjustedUtilityModel = {
  model: TreatmentUtilityModel;
  terms: Record<UtilityTermKey, AdjustedUtilityTerm>;
  selectedModifiers: UtilityModifier[];
};

export type ExpectedUtilityResult = {
  treat: number;
  noTreat: number;
  netBenefit: number;
};

const CAP_UTILITY_MODEL: TreatmentUtilityModel = {
  syndromeId: "cap",
  syndromeLabel: "CAP",
  diseaseLabel: "Community-acquired pneumonia",
  treatmentLabel: "Treat empirically",
  noTreatmentLabel: "Hold empiric antibiotics",
  horizonLabel: "14-day acute illness horizon",
  summary:
    "Structured CAP utility model anchored to published adult CAP functional-burden data, modern CABP trial response and adverse-event rates, and outpatient CAP antibiotic safety reviews.",
  terms: {
    treatDisease: {
      label: "Treat + true CAP",
      value: 0.972,
      rationale:
        "Prompt treatment still carries short-lived illness burden, but expected recovery is substantially better than missed or delayed CAP treatment.",
      evidence: {
        short: "Stets et al. NEJM CABP trial; ATS/IDSA CAP guideline",
        url: "https://doi.org/10.1056/NEJMoa1800201",
      },
      structuredEstimate: true,
    },
    noTreatDisease: {
      label: "No treat + true CAP",
      value: 0.918,
      rationale:
        "Missed CAP has lower expected utility because of prolonged symptoms and higher risk of deterioration, hospitalization, and sepsis before the diagnosis is corrected.",
      evidence: {
        short: "Jose and Corso functional CAP study; ATS/IDSA CAP guideline",
        url: "https://doi.org/10.1590/S1413-35552013005000098",
      },
      structuredEstimate: true,
    },
    treatNoDisease: {
      label: "Treat + no CAP",
      value: 0.993,
      rationale:
        "Unnecessary outpatient CAP treatment usually produces a mild, transient utility penalty driven by GI adverse effects, rash, drug interactions, and C. difficile risk.",
      evidence: {
        short: "Cochrane outpatient CAP antibiotics review; CABP trial safety data",
        url: "https://doi.org/10.1002/14651858.CD002109.pub4",
      },
      structuredEstimate: true,
    },
    noTreatNoDisease: {
      label: "No treat + no CAP",
      value: 1,
      rationale: "Reference state: no CAP and no unnecessary antibiotic exposure.",
      structuredEstimate: false,
    },
  },
  modifiers: [
    {
      id: "cap_factor_frailty",
      label: "Age 65+ or frailty",
      description: "Raises the downside of missed CAP more than the downside of treatment.",
      deltas: {
        treatDisease: -0.006,
        noTreatDisease: -0.03,
        treatNoDisease: -0.002,
      },
      evidence: {
        short: "ATS/IDSA CAP guideline severity anchors",
        url: "https://doi.org/10.1164/rccm.201908-1581ST",
      },
    },
    {
      id: "cap_factor_cardiopulm",
      label: "Chronic lung or heart disease",
      description: "Makes missed CAP more consequential because decompensation is more likely.",
      deltas: {
        treatDisease: -0.008,
        noTreatDisease: -0.024,
      },
      evidence: {
        short: "ATS/IDSA CAP host-risk anchors",
        url: "https://doi.org/10.1164/rccm.201908-1581ST",
      },
    },
    {
      id: "cap_factor_liver",
      label: "Chronic liver disease",
      description:
        "Increases the danger of untreated CAP while also making antibiotic toxicity and interactions harder to tolerate.",
      deltas: {
        treatDisease: -0.01,
        noTreatDisease: -0.03,
        treatNoDisease: -0.006,
      },
      evidence: {
        short: "CAP severity anchors plus antibiotic-toxicity adjustment",
        url: "https://doi.org/10.1164/rccm.201908-1581ST",
      },
    },
    {
      id: "cap_factor_ckd",
      label: "Chronic kidney disease",
      description: "Shifts both disease and treatment utilities because CAP outcomes worsen and some regimens are less forgiving.",
      deltas: {
        treatDisease: -0.008,
        noTreatDisease: -0.022,
        treatNoDisease: -0.004,
      },
      evidence: {
        short: "CAP severity anchors plus renal-toxicity adjustment",
        url: "https://doi.org/10.1164/rccm.201908-1581ST",
      },
    },
    {
      id: "cap_factor_immunocompromised",
      label: "Immunocompromised host",
      description: "Substantially increases the expected harm of missing CAP or undertreating early infection.",
      deltas: {
        treatDisease: -0.015,
        noTreatDisease: -0.045,
        treatNoDisease: -0.002,
      },
      evidence: {
        short: "CAP severity anchors in vulnerable hosts",
        url: "https://doi.org/10.1164/rccm.201908-1581ST",
      },
    },
    {
      id: "cap_factor_prior_cdiff",
      label: "Prior C. difficile or high microbiome risk",
      description: "Makes unnecessary empiric antibiotics meaningfully less attractive.",
      deltas: {
        treatDisease: -0.01,
        treatNoDisease: -0.018,
      },
      evidence: {
        short: "Cochrane outpatient CAP review; modern CABP trial GI AE rates",
        url: "https://doi.org/10.1002/14651858.CD002109.pub4",
      },
    },
    {
      id: "cap_factor_beta_lactam_allergy",
      label: "Severe beta-lactam allergy",
      description: "Raises treatment burden because regimen options narrow and adverse-event concern increases.",
      deltas: {
        treatDisease: -0.01,
        treatNoDisease: -0.013,
      },
      evidence: {
        short: "Structured regimen-limitation adjustment",
      },
    },
    {
      id: "cap_factor_qt_interactions",
      label: "QT / drug-interaction concern",
      description: "Adds treatment downside when empiric CAP regimens are more likely to cause interactions or arrhythmia risk.",
      deltas: {
        treatDisease: -0.007,
        treatNoDisease: -0.01,
      },
      evidence: {
        short: "Modern CABP trial safety data; structured QT/interactions adjustment",
        url: "https://doi.org/10.1016/j.eclinm.2025.103656",
      },
    },
    {
      id: "cap_factor_side_effect_aversion",
      label: "High concern about antibiotic side effects",
      description: "Preference-sensitive penalty for patients who find even mild antibiotic harms very disruptive.",
      deltas: {
        treatDisease: -0.008,
        treatNoDisease: -0.012,
      },
      evidence: {
        short: "Preference-sensitive utility adjustment",
      },
    },
  ],
};

const MODELS: Record<string, TreatmentUtilityModel> = {
  cap: CAP_UTILITY_MODEL,
};

export function getTreatmentUtilityModel(syndromeId: string): TreatmentUtilityModel | null {
  return MODELS[syndromeId] ?? null;
}

export function applyUtilityModifiers(
  model: TreatmentUtilityModel,
  selectedModifierIds: string[]
): AdjustedUtilityModel {
  const selectedModifiers = model.modifiers.filter((modifier) => selectedModifierIds.includes(modifier.id));
  const terms = {
    treatDisease: { ...model.terms.treatDisease, baseValue: model.terms.treatDisease.value, adjustedValue: model.terms.treatDisease.value, totalDelta: 0 },
    noTreatDisease: { ...model.terms.noTreatDisease, baseValue: model.terms.noTreatDisease.value, adjustedValue: model.terms.noTreatDisease.value, totalDelta: 0 },
    treatNoDisease: { ...model.terms.treatNoDisease, baseValue: model.terms.treatNoDisease.value, adjustedValue: model.terms.treatNoDisease.value, totalDelta: 0 },
    noTreatNoDisease: { ...model.terms.noTreatNoDisease, baseValue: model.terms.noTreatNoDisease.value, adjustedValue: model.terms.noTreatNoDisease.value, totalDelta: 0 },
  } satisfies Record<UtilityTermKey, AdjustedUtilityTerm>;

  for (const modifier of selectedModifiers) {
    const keys = Object.keys(modifier.deltas) as UtilityTermKey[];
    for (const key of keys) {
      const delta = modifier.deltas[key];
      if (delta == null) continue;
      terms[key].totalDelta += delta;
      terms[key].adjustedValue = clamp(terms[key].baseValue + terms[key].totalDelta, 0.2, 1);
    }
  }

  return { model, terms, selectedModifiers };
}

export function deriveTreatmentThresholdFromUtilities(terms: Record<UtilityTermKey, AdjustedUtilityTerm>) {
  const numerator = terms.noTreatNoDisease.adjustedValue - terms.treatNoDisease.adjustedValue;
  const denominator = numerator + (terms.treatDisease.adjustedValue - terms.noTreatDisease.adjustedValue);

  if (denominator <= 0) return 0.999;
  return clamp(numerator / denominator, 0.001, 0.999);
}

export function calculateExpectedUtilities(
  terms: Record<UtilityTermKey, AdjustedUtilityTerm>,
  diseaseProbability: number
): ExpectedUtilityResult {
  const p = clamp(diseaseProbability, 0.001, 0.999);
  const treat = p * terms.treatDisease.adjustedValue + (1 - p) * terms.treatNoDisease.adjustedValue;
  const noTreat = p * terms.noTreatDisease.adjustedValue + (1 - p) * terms.noTreatNoDisease.adjustedValue;

  return {
    treat,
    noTreat,
    netBenefit: treat - noTreat,
  };
}
