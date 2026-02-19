import type { FindingState } from "@/lib/lrTypes";
import { clamp } from "@/lib/lrMath";

export type HarmEvidence = {
  short: string;
  url?: string;
};

export type HarmEstimate = {
  baseMissedDx: number;
  baseUnnecessaryTx: number;
  baseEvidence?: HarmEvidence;
  missedDx: number;
  unnecessaryTx: number;
  rationale: string[];
  missedDxDrivers: Array<{ label: string; delta: number; evidence?: HarmEvidence }>;
};

export const BASE_HARM_BY_MODULE: Record<
  string,
  { missedDx: number; unnecessaryTx: number; evidence?: HarmEvidence }
> = {
  cap: {
    missedDx: 10,
    unnecessaryTx: 3,
    evidence: { short: "Metlay et al. ATS/IDSA", url: "https://doi.org/10.1164/rccm.201908-1581ST" },
  },
  cdi: {
    missedDx: 11,
    unnecessaryTx: 4,
    evidence: { short: "Johnson et al. IDSA/SHEA", url: "https://doi.org/10.1093/cid/ciab549" },
  },
  uti: {
    missedDx: 7,
    unnecessaryTx: 4,
    evidence: { short: "Bent et al. JAMA", url: "https://doi.org/10.1001/jama.287.20.2701" },
  },
  endo: {
    missedDx: 20,
    unnecessaryTx: 6,
    evidence: { short: "Delgado et al. ESC Endocarditis", url: "https://doi.org/10.1093/eurheartj/ehad193" },
  },
  active_tb: {
    missedDx: 18,
    unnecessaryTx: 8,
    evidence: { short: "WHO Global TB Report 2024", url: "https://www.who.int/publications/i/item/9789240101531" },
  },
  pjp: {
    missedDx: 16,
    unnecessaryTx: 5,
    evidence: { short: "Mappin-Kasirer et al. BMC Infect Dis", url: "https://doi.org/10.1186/s12879-024-09957-y" },
  },
  pji: {
    missedDx: 14,
    unnecessaryTx: 8,
    evidence: { short: "Cortes-Penfield et al. Clin Infect Dis", url: "https://doi.org/10.1093/cid/ciac992" },
  },
  inv_mold: {
    missedDx: 18,
    unnecessaryTx: 9,
    evidence: { short: "Donnelly et al. Clin Infect Dis", url: "https://doi.org/10.1093/cid/ciz1008" },
  },
  inv_candida: {
    missedDx: 16,
    unnecessaryTx: 7,
    evidence: { short: "Pappas et al. IDSA Candidiasis", url: "https://doi.org/10.1093/cid/civ933" },
  },
};

export function estimateHarms(moduleId: string, states: Record<string, FindingState>): HarmEstimate {
  const base = BASE_HARM_BY_MODULE[moduleId] ?? { missedDx: 10, unnecessaryTx: 4 };
  let missedDx = base.missedDx;
  const unnecessaryTx = base.unnecessaryTx;
  const rationale: string[] = [];
  const missedDxDrivers: Array<{ label: string; delta: number; evidence?: HarmEvidence }> = [];
  const has = (id: string) => (states[id] ?? "unknown") === "present";
  const addMissedDxDriver = (delta: number, label: string, evidence?: HarmEvidence) => {
    missedDx += delta;
    missedDxDrivers.push({ label, delta, evidence });
    rationale.push(label);
  };

  if (moduleId === "cap") {
    if (has("cap_hypox") || has("cap_rr")) {
      addMissedDxDriver(3, "Higher severity physiology selected (hypoxemia/tachypnea).", {
        short: "Metlay et al. ATS/IDSA",
        url: "https://doi.org/10.1164/rccm.201908-1581ST",
      });
    }
    if (has("cap_cxr_consolidation")) {
      addMissedDxDriver(2, "Radiographic consolidation selected.", {
        short: "Metlay et al. ATS/IDSA",
        url: "https://doi.org/10.1164/rccm.201908-1581ST",
      });
    }
  }

  if (moduleId === "uti") {
    if (has("uti_cva") || has("uti_fever")) {
      addMissedDxDriver(2, "Systemic/upper-tract features selected.", {
        short: "Bent et al. JAMA",
        url: "https://doi.org/10.1001/jama.287.20.2701",
      });
    }
    if (has("uti_catheter") || has("uti_obstruction")) {
      addMissedDxDriver(1, "Complicated host factors selected.", {
        short: "Gupta et al. IDSA/ESCMID",
        url: "https://doi.org/10.1093/cid/ciq257",
      });
    }
  }

  if (moduleId === "endo") {
    if (has("endo_prosthetic_valve") || has("endo_cied")) {
      addMissedDxDriver(3, "Prosthetic/device host risk selected.", {
        short: "Delgado et al. ESC Endocarditis",
        url: "https://doi.org/10.1093/eurheartj/ehad193",
      });
    }
    if (has("endo_bcx_major_typical") || has("endo_bcx_major_persistent")) {
      addMissedDxDriver(4, "Major microbiology criterion selected.", {
        short: "Fowler et al. Duke-ISCVID",
        url: "https://doi.org/10.1093/cid/ciad271",
      });
    }
    if (has("endo_tte") || has("endo_tee")) {
      addMissedDxDriver(2, "Positive endocarditis imaging selected.", {
        short: "Bai et al. JASE",
        url: "https://doi.org/10.1016/j.echo.2017.03.007",
      });
    }
  }

  if (moduleId === "active_tb") {
    if (has("tb_contact") || has("tb_hiv_or_immunosuppression")) {
      addMissedDxDriver(3, "Major TB epidemiologic/host risk selected.", {
        short: "Fox et al. PLoS Med",
        url: "https://doi.org/10.1371/journal.pmed.1001432",
      });
    }
    if (has("tb_incarceration") || has("tb_homelessness")) {
      addMissedDxDriver(2, "High-risk transmission setting selected.", {
        short: "Cords et al. Lancet Public Health",
        url: "https://doi.org/10.1016/S2468-2667(21)00025-6",
      });
    }
  }

  if (moduleId === "pjp") {
    if (has("pjp_host_hiv_cd4_sot") || has("pjp_host_no_ppx")) {
      addMissedDxDriver(4, "High-risk host/prophylaxis context selected.", {
        short: "Mappin-Kasirer et al. BMC Infect Dis",
        url: "https://doi.org/10.1186/s12879-024-09957-y",
      });
    }
    if (has("pjp_vital_hypoxemia")) {
      addMissedDxDriver(2, "Hypoxemia selected.", {
        short: "Mappin-Kasirer et al. BMC Infect Dis",
        url: "https://doi.org/10.1186/s12879-024-09957-y",
      });
    }
  }

  if (moduleId === "pji") {
    if (has("pji_exam_sinus_tract")) {
      addMissedDxDriver(4, "Sinus tract (major exam criterion) selected.", {
        short: "Parvizi et al. J Arthroplasty",
        url: "https://doi.org/10.1016/j.arth.2018.09.028",
      });
    }
    if (has("pji_alpha_defensin_elisa") || has("pji_synovial_fluid_culture")) {
      addMissedDxDriver(2, "Strong synovial/microbiologic evidence selected.", {
        short: "Cortes-Penfield et al. Clin Infect Dis",
        url: "https://doi.org/10.1093/cid/ciac992",
      });
    }
  }

  if (moduleId === "inv_mold") {
    if (has("imi_host_neutropenia_hsct") || has("imi_host_hematologic_malignancy")) {
      addMissedDxDriver(4, "High-risk mold host profile selected.", {
        short: "Donnelly et al. Clin Infect Dis",
        url: "https://doi.org/10.1093/cid/ciz1008",
      });
    }
    if (has("imi_mucorales_pcr_bal") || has("imi_aspergillus_pcr_bal")) {
      addMissedDxDriver(2, "Specific mold molecular evidence selected.", {
        short: "Brown et al. Int J Infect Dis",
        url: "https://doi.org/10.1016/j.ijid.2025.107941",
      });
    }
  }

  if (moduleId === "inv_candida") {
    if (has("icand_component_severe_sepsis") || has("icand_component_multifocal_colonization")) {
      addMissedDxDriver(3, "High-risk candidiasis host context selected.", {
        short: "León et al. Crit Care Med",
        url: "https://doi.org/10.1097/01.CCM.0000202208.37364.7D",
      });
    }
    if (has("icand_t2candida") || has("icand_pcr_blood")) {
      addMissedDxDriver(2, "Candida molecular evidence selected.", {
        short: "Tang et al. BMC Infect Dis",
        url: "https://doi.org/10.1186/s12879-019-4419-z",
      });
    }
  }

  if (moduleId === "cdi") {
    if (has("cdi_naat_pos_tox_pos")) {
      addMissedDxDriver(2, "Concordant CDI molecular/toxin evidence selected.", {
        short: "Kraft et al. Clin Microbiol Rev",
        url: "https://doi.org/10.1128/CMR.00032-18",
      });
    }
  }

  return {
    baseMissedDx: base.missedDx,
    baseUnnecessaryTx: base.unnecessaryTx,
    baseEvidence: base.evidence,
    missedDx: clamp(missedDx, 1, 30),
    unnecessaryTx: clamp(unnecessaryTx, 1, 30),
    rationale:
      rationale.length > 0
        ? rationale
        : ["No additional high-impact risk modifiers selected; using syndrome baseline harms."],
    missedDxDrivers,
  };
}

export function deriveDecisionThresholds(harm: Pick<HarmEstimate, "missedDx" | "unnecessaryTx">) {
  const treatThresholdP = clamp(harm.unnecessaryTx / (harm.unnecessaryTx + harm.missedDx), 0.001, 0.999);
  const observeThresholdP = clamp(treatThresholdP * 0.5, 0.001, 0.999);
  return { treatThresholdP, observeThresholdP };
}
