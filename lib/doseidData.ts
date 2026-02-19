import { NormalizedPatient, roundDose } from "@/lib/doseidMath";

export type MedicationCategory =
  | "antibacterial"
  | "mycobacterial_tb"
  | "antifungal"
  | "antiviral";

export type WeightBasis = "tbw" | "ibw" | "adjbw" | "lbw";

export type RenalMode = "standard" | "ihd" | "crrt";

export type MedicationIndication = {
  id: string;
  label: string;
};

export type DoseContext = {
  indicationId: string;
  renalMode: RenalMode;
};

export type DoseResult = {
  regimen: string;
  renalBucket: string;
  doseWeight?: {
    basis: WeightBasis;
    kg: number;
  };
  notes: string[];
};

export type MedicationRule = {
  id: string;
  name: string;
  category: MedicationCategory;
  indications: MedicationIndication[];
  sourcePages: string;
  calculate: (patient: NormalizedPatient, context: DoseContext) => DoseResult;
};

function obesityAdjustedWeight(patient: NormalizedPatient) {
  if (patient.bmi >= 30) {
    return {
      basis: "adjbw" as const,
      kg: patient.adjbwKg,
    };
  }
  return {
    basis: "tbw" as const,
    kg: patient.totalBodyWeightKg,
  };
}

function adjustedWeightOver120Ibw(patient: NormalizedPatient) {
  if (patient.totalBodyWeightKg > patient.ibwKg * 1.2) {
    return {
      basis: "adjbw" as const,
      kg: patient.adjbwKg,
    };
  }
  return {
    basis: "tbw" as const,
    kg: patient.totalBodyWeightKg,
  };
}

function foscarnetAdjustedCrclMlMinPerKg(patient: NormalizedPatient): number {
  if (patient.serumCreatinineMgDl <= 0) return 0;
  const sexFactor = patient.sex === "female" ? 0.85 : 1;
  return ((140 - patient.ageYears) * sexFactor) / (72 * patient.serumCreatinineMgDl);
}

function crclBand(patient: NormalizedPatient, bands: number[]) {
  const crcl = patient.crclMlMin;
  if (bands.length === 3) {
    const [upper, mid, low] = bands;
    if (crcl > upper) return `CrCl > ${upper} mL/min`;
    if (crcl > mid) return `CrCl ${mid + 1}-${upper} mL/min`;
    if (crcl > low) return `CrCl ${low + 1}-${mid} mL/min`;
    return `CrCl <= ${low} mL/min`;
  }
  return `CrCl ${Math.round(crcl)} mL/min`;
}

function mgFromWeight(mgPerKg: number, weightKg: number, step = 50, maxMg?: number): number {
  const rounded = roundDose(mgPerKg * weightKg, step);
  if (typeof maxMg === "number") {
    return Math.min(maxMg, rounded);
  }
  return rounded;
}

function noRenalAdjustBucket(mode: RenalMode): string {
  if (mode === "standard") return "No routine renal adjustment in major references";
  if (mode === "ihd") return "Intermittent hemodialysis";
  return "Continuous renal replacement therapy (CRRT)";
}

export function renalModeLabel(mode: RenalMode): string {
  if (mode === "standard") return "Standard renal pathway";
  if (mode === "ihd") return "Intermittent hemodialysis (iHD)";
  return "Continuous renal replacement therapy (CRRT)";
}

const ANTIBACTERIAL_SOURCE =
  "Cross-check: UCSF IDMP + Nebraska Medicine Antimicrobial Renal Dosing Guidance";
const TB_SOURCE = "Cross-check: UCSF IDMP + CDC/ATS/IDSA TB guidance";
const ANTIFUNGAL_SOURCE =
  "Cross-check: UCSF IDMP + Nebraska Medicine Antimicrobial Renal Dosing Guidance";
const ANTIVIRAL_SOURCE =
  "Cross-check: UCSF IDMP + Nebraska Medicine Antimicrobial Renal Dosing Guidance";

export const DOSEID_MEDICATIONS: MedicationRule[] = [
  {
    id: "cefepime",
    name: "Cefepime",
    category: "antibacterial",
    indications: [
      { id: "severe_non_cns", label: "Severe non-CNS infection" },
      { id: "cns_meningitis", label: "Meningitis / CNS infection" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      if (context.renalMode === "ihd") {
        return {
          regimen: "2 g IV post-HD after each session",
          renalBucket: "Intermittent hemodialysis",
          notes: [
            "Alternative institutional approach: 1 g IV qPM with post-HD timing alignment.",
            "CNS infection may need intensive PK/PD optimization.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: "2 g IV q8h",
          renalBucket: "CRRT",
          notes: [
            "CRRT dosing is modality and effluent-dependent; confirm with ICU pharmacist.",
            "Template favors high beta-lactam exposure in critical illness.",
          ],
        };
      }

      let regimen = "1 g IV q24h";
      if (patient.crclMlMin > 60) regimen = "2 g IV q8h";
      else if (patient.crclMlMin > 30) regimen = "2 g IV q12h";
      else if (patient.crclMlMin > 10) regimen = "2 g IV q24h";

      return {
        regimen,
        renalBucket: crclBand(patient, [60, 30, 10]),
        notes: [
          "Cross-institution default; final dose depends on source control, MIC, and neurotoxicity risk.",
          "Dialysis and CRRT pathways can be selected in the renal function section.",
        ],
      };
    },
  },
  {
    id: "piperacillin_tazobactam",
    name: "Piperacillin/Tazobactam",
    category: "antibacterial",
    indications: [
      { id: "severe_ei", label: "Severe infection (extended infusion)" },
      { id: "high_inoculum_pseudomonal", label: "High inoculum / high-risk pseudomonal infection" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const highInoculum = context.indicationId === "high_inoculum_pseudomonal";

      if (context.renalMode === "ihd") {
        return {
          regimen: highInoculum
            ? "2.25 g IV q6h (short infusion), dose after HD on dialysis days"
            : "2.25 g IV q8h (short infusion), dose after HD on dialysis days",
          renalBucket: "Intermittent hemodialysis",
          notes: [
            "Dialysis pathway is a template; local protocol may use alternative schedules.",
            "Use extended infusion when feasible for time-above-MIC optimization.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: highInoculum
            ? "4.5 g IV q6h (4-hour infusion)"
            : "4.5 g IV q8h (4-hour infusion)",
          renalBucket: "CRRT",
          notes: [
            "CRRT regimens vary with effluent flow and residual renal function.",
            "Confirm strategy with ICU antimicrobial stewardship/pharmacy.",
          ],
        };
      }

      let regimen = "3.375 g IV q8h (short infusion)";
      if (highInoculum) {
        if (patient.crclMlMin > 20) regimen = "4.5 g IV q6h (4-hour infusion)";
        else regimen = "3.375 g IV q6h (short infusion)";
      } else {
        if (patient.crclMlMin > 20) regimen = "4.5 g IV q8h (4-hour infusion)";
      }

      return {
        regimen,
        renalBucket: patient.crclMlMin > 20 ? "CrCl > 20 mL/min" : "CrCl <= 20 mL/min",
        notes: [
          "Low-CrCl pathways vary across institutions; short-infusion fallback is common.",
          "Ensure indication-specific source control assumptions are met.",
        ],
      };
    },
  },
  {
    id: "meropenem",
    name: "Meropenem",
    category: "antibacterial",
    indications: [
      { id: "severe_non_cns", label: "Severe non-CNS infection" },
      { id: "cns_meningitis", label: "Meningitis / CNS infection" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const isCns = context.indicationId === "cns_meningitis";

      if (context.renalMode === "ihd") {
        return {
          regimen: isCns
            ? "1 g IV qPM (after HD on dialysis days)"
            : "500 mg IV qPM (after HD on dialysis days)",
          renalBucket: "Intermittent hemodialysis",
          notes: [
            "This mirrors common qPM post-HD institutional schedules.",
            "Use local susceptibility data to guide escalation/de-escalation.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: isCns ? "2 g IV q8h" : "1 g IV q8h",
          renalBucket: "CRRT",
          notes: [
            "CRRT template assumes high-intensity critical care infection management.",
            "May need prolonged infusion per ICU protocol.",
          ],
        };
      }

      let regimen = "500 mg IV q24h";
      if (isCns) {
        if (patient.crclMlMin > 50) regimen = "2 g IV q8h";
        else if (patient.crclMlMin > 25) regimen = "2 g IV q12h";
        else if (patient.crclMlMin > 10) regimen = "1 g IV q12h";
        else regimen = "1 g IV q24h";
      } else {
        if (patient.crclMlMin > 50) regimen = "1 g IV q8h";
        else if (patient.crclMlMin > 25) regimen = "1 g IV q12h";
        else if (patient.crclMlMin > 10) regimen = "500 mg IV q12h";
      }

      return {
        regimen,
        renalBucket:
          patient.crclMlMin > 50
            ? "CrCl > 50 mL/min"
            : patient.crclMlMin > 25
            ? "CrCl 26-50 mL/min"
            : patient.crclMlMin > 10
            ? "CrCl 11-25 mL/min"
            : "CrCl <= 10 mL/min",
        notes: [
          "Higher regimens are indication-specific; use local guidance for resistant pathogens.",
        ],
      };
    },
  },
  {
    id: "daptomycin",
    name: "Daptomycin",
    category: "antibacterial",
    indications: [
      { id: "bacteremia_endovascular", label: "Bacteremia / endovascular infection" },
      { id: "vre_high_burden", label: "High-burden VRE infection" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const mgPerKg = context.indicationId === "vre_high_burden" ? 10 : 8;
      const doseWeight = obesityAdjustedWeight(patient);
      const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 50);

      if (context.renalMode === "ihd") {
        return {
          regimen: `${doseMg} mg IV post-HD (3x weekly)`,
          renalBucket: "Intermittent hemodialysis",
          doseWeight,
          notes: [
            "For long interdialytic intervals, many protocols increase the final weekly dose.",
            "Check CK baseline and serially; evaluate for myopathy symptoms.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        const crrtMgPerKg = context.indicationId === "vre_high_burden" ? 8 : 6;
        const crrtDoseMg = mgFromWeight(crrtMgPerKg, doseWeight.kg, 50);

        return {
          regimen: `${crrtDoseMg} mg IV q24h (${crrtMgPerKg} mg/kg)`,
          renalBucket: "CRRT",
          doseWeight,
          notes: [
            "CRRT interval may vary by filter and effluent intensity.",
            "Higher CRRT doses can be considered for deep-seated VRE infection.",
          ],
        };
      }

      return {
        regimen: `${doseMg} mg IV ${patient.crclMlMin > 30 ? "q24h" : "q48h"} (${mgPerKg} mg/kg)`,
        renalBucket: patient.crclMlMin > 30 ? "CrCl > 30 mL/min" : "CrCl <= 30 mL/min",
        doseWeight,
        notes: [
          "This tool uses AdjBW when BMI >=30; otherwise TBW.",
          "Dose optimization should incorporate infection source and organism MIC when available.",
        ],
      };
    },
  },
  {
    id: "ampicillin_sulbactam",
    name: "Ampicillin/Sulbactam",
    category: "antibacterial",
    indications: [
      { id: "standard_systemic", label: "Standard systemic infection" },
      { id: "surgical_or_intraabdominal", label: "Intra-abdominal or polymicrobial source" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const intraAbdominal = context.indicationId === "surgical_or_intraabdominal";

      if (context.renalMode === "ihd") {
        return {
          regimen: "3 g IV q12h (administer after HD on dialysis days)",
          renalBucket: "Intermittent hemodialysis",
          notes: [
            "Post-dialysis timing is preferred on HD days.",
            "For high-inoculum infection, confirm interval/intensity with local protocol.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: "3 g IV q6h",
          renalBucket: "CRRT",
          notes: [
            "CRRT pathway is an educational template and may vary by effluent rate.",
            "Extended-infusion strategies can be considered per ICU protocol.",
          ],
        };
      }

      let regimen = intraAbdominal ? "3 g IV q6h" : "1.5-3 g IV q6h";
      if (patient.crclMlMin <= 15) regimen = "3 g IV q24h";
      else if (patient.crclMlMin <= 30) regimen = "3 g IV q12h";
      else if (!intraAbdominal) regimen = "3 g IV q6h";

      return {
        regimen,
        renalBucket:
          patient.crclMlMin > 30
            ? "CrCl > 30 mL/min"
            : patient.crclMlMin > 15
            ? "CrCl 16-30 mL/min"
            : "CrCl <= 15 mL/min",
        notes: [
          "Renal interval extension aligns with common antimicrobial dosing references.",
          "Use organism and source-specific targets for final regimen selection.",
        ],
      };
    },
  },
  {
    id: "aztreonam",
    name: "Aztreonam",
    category: "antibacterial",
    indications: [
      { id: "systemic_gram_negative", label: "Systemic Gram-negative infection" },
      { id: "uncomplicated_uti", label: "Uncomplicated UTI" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const uncomplicatedUti = context.indicationId === "uncomplicated_uti";

      if (context.renalMode === "ihd") {
        return {
          regimen: uncomplicatedUti ? "1 g IV x1, then 1 g IV qPM" : "2 g IV x1, then 2 g IV qPM",
          renalBucket: "Intermittent hemodialysis",
          notes: [
            "qPM maintenance is a common post-HD pathway.",
            "Use higher-intensity pathways for deep or high-inoculum infections.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: uncomplicatedUti ? "2 g IV q12h" : "2 g IV q8h",
          renalBucket: "CRRT",
          notes: [
            "CRRT dosing varies by modality and residual renal function.",
            "Confirm final interval with ICU antimicrobial stewardship when available.",
          ],
        };
      }

      if (uncomplicatedUti) {
        return {
          regimen:
            patient.crclMlMin > 30
              ? "1 g IV q8h"
              : patient.crclMlMin >= 10
              ? "500 mg IV q8h"
              : "500 mg IV q12h",
          renalBucket:
            patient.crclMlMin > 30
              ? "CrCl > 30 mL/min"
              : patient.crclMlMin >= 10
              ? "CrCl 10-30 mL/min"
              : "CrCl < 10 mL/min",
          notes: [
            "Uncomplicated UTI pathway uses lower exposure targets.",
            "Escalate for bacteremia or complicated urinary source.",
          ],
        };
      }

      return {
        regimen:
          patient.crclMlMin > 30
            ? "2 g IV q8h"
            : patient.crclMlMin >= 10
            ? "2 g IV q12h"
            : "1 g IV q12h",
        renalBucket:
          patient.crclMlMin > 30
            ? "CrCl > 30 mL/min"
            : patient.crclMlMin >= 10
            ? "CrCl 10-30 mL/min"
            : "CrCl < 10 mL/min",
        notes: [
          "Systemic pathway reflects common renal-adjustment intervals.",
          "Consider infusion optimization for difficult-to-treat pathogens.",
        ],
      };
    },
  },
  {
    id: "cefazolin",
    name: "Cefazolin",
    category: "antibacterial",
    indications: [
      { id: "uncomplicated_infection", label: "Uncomplicated infection" },
      { id: "complicated_or_deep", label: "Complicated / deep-seated infection" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const complicated = context.indicationId === "complicated_or_deep";

      if (context.renalMode === "ihd") {
        return {
          regimen: complicated
            ? "2 g IV post-HD (consider 2 g / 2 g / 3 g across weekly HD sessions)"
            : "2 g IV post-HD",
          renalBucket: "Intermittent hemodialysis",
          notes: [
            "Many protocols use higher third-weekly doses for long interdialytic intervals.",
            "Align dose timing with HD schedule.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: "2 g IV q12h",
          renalBucket: "CRRT",
          notes: [
            "CRRT pathways vary with effluent intensity and infection severity.",
            "Consult ICU pharmacy for protocol-specific adjustments.",
          ],
        };
      }

      if (complicated) {
        return {
          regimen:
            patient.crclMlMin > 30
              ? "2 g IV q8h"
              : patient.crclMlMin >= 10
              ? "2 g IV q12h"
              : "1 g IV q24h",
          renalBucket:
            patient.crclMlMin > 30
              ? "CrCl > 30 mL/min"
              : patient.crclMlMin >= 10
              ? "CrCl 10-29 mL/min"
              : "CrCl < 10 mL/min",
          notes: [
            "Complicated-pathway exposure aligns with high-burden MSSA and deep-source dosing.",
            "Source control remains essential for definitive outcomes.",
          ],
        };
      }

      return {
        regimen:
          patient.crclMlMin > 30
            ? "1 g IV q8h"
            : patient.crclMlMin >= 10
            ? "1 g IV q12h"
            : "1 g IV q24h",
        renalBucket:
          patient.crclMlMin > 30
            ? "CrCl > 30 mL/min"
            : patient.crclMlMin >= 10
            ? "CrCl 10-29 mL/min"
            : "CrCl < 10 mL/min",
        notes: [
          "Uncomplicated pathway is a simplified reference regimen.",
          "Escalate to complicated pathway when infection burden is high.",
        ],
      };
    },
  },
  {
    id: "ceftriaxone",
    name: "Ceftriaxone",
    category: "antibacterial",
    indications: [
      { id: "standard_dose", label: "Standard infection" },
      { id: "serious_infection", label: "Serious infection" },
      { id: "meningitis", label: "Meningitis / CNS infection" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      if (context.indicationId === "meningitis") {
        return {
          regimen: "2 g IV q12h",
          renalBucket: noRenalAdjustBucket(context.renalMode),
          notes: [
            "No routine renal adjustment in major adult references.",
            "For CNS infection, optimize adjunctive management per syndrome guidelines.",
          ],
        };
      }

      if (context.indicationId === "serious_infection") {
        return {
          regimen: "2 g IV q24h",
          renalBucket: noRenalAdjustBucket(context.renalMode),
          notes: [
            "No routine renal adjustment in major adult references.",
            "Typical severe-infection pathway uses 2 g daily.",
          ],
        };
      }

      return {
        regimen: patient.bmi >= 30 ? "2 g IV q24h" : "1 g IV q24h",
        renalBucket: noRenalAdjustBucket(context.renalMode),
        notes: [
          "No routine renal adjustment in major adult references.",
          "In obesity, many protocols prefer at least 2 g daily for systemic infection.",
        ],
      };
    },
  },
  {
    id: "ceftazidime",
    name: "Ceftazidime",
    category: "antibacterial",
    indications: [
      { id: "standard_systemic", label: "Standard systemic infection" },
      { id: "pseudomonal_or_severe", label: "Severe / pseudomonal infection" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const severe = context.indicationId === "pseudomonal_or_severe";

      if (context.renalMode === "ihd") {
        return {
          regimen: "1 g IV x1, then 1 g IV post-HD",
          renalBucket: "Intermittent hemodialysis",
          notes: [
            "Post-HD administration is preferred for dialysis days.",
            "Higher-intensity strategies may be required for resistant pathogens.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: severe ? "2 g IV q8h" : "2 g IV q12h",
          renalBucket: "CRRT",
          notes: [
            "CRRT pathway depends on effluent flow and target attainment strategy.",
            "Prolonged infusion can be considered for difficult-to-treat organisms.",
          ],
        };
      }

      let regimen = "1 g IV q24h";
      if (patient.crclMlMin > 50) regimen = severe ? "2 g IV q8h" : "2 g IV q12h";
      else if (patient.crclMlMin > 30) regimen = "2 g IV q12h";
      else if (patient.crclMlMin > 15) regimen = "2 g IV q24h";

      return {
        regimen,
        renalBucket:
          patient.crclMlMin > 50
            ? "CrCl > 50 mL/min"
            : patient.crclMlMin > 30
            ? "CrCl 31-50 mL/min"
            : patient.crclMlMin > 15
            ? "CrCl 16-30 mL/min"
            : "CrCl <= 15 mL/min",
        notes: [
          "Renal intervals follow common non-dialysis reference pathways.",
          "Use susceptibility and syndrome context for final regimen selection.",
        ],
      };
    },
  },
  {
    id: "ertapenem",
    name: "Ertapenem",
    category: "antibacterial",
    indications: [
      { id: "standard_systemic", label: "Standard systemic infection" },
      { id: "esbl_targeted", label: "Targeted ESBL infection" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      if (context.renalMode === "ihd") {
        return {
          regimen: "500 mg IV q24h (administer after HD on dialysis days)",
          renalBucket: "Intermittent hemodialysis",
          notes: [
            "Some programs use post-HD three-times-weekly alternatives for stable schedules.",
            "Template favors daily pathway for simplicity.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: "1 g IV q24h",
          renalBucket: "CRRT",
          notes: [
            "CRRT clearance is variable; confirm maintenance with ICU protocol.",
            "Daily regimen is commonly used as a starting point in CRRT.",
          ],
        };
      }

      return {
        regimen: patient.crclMlMin > 30 ? "1 g IV q24h" : "500 mg IV q24h",
        renalBucket: patient.crclMlMin > 30 ? "CrCl > 30 mL/min" : "CrCl <= 30 mL/min",
        notes: [
          "Reference pathway uses reduced maintenance at lower CrCl.",
          "Dose finalization should include infection severity and source control.",
        ],
      };
    },
  },
  {
    id: "linezolid",
    name: "Linezolid",
    category: "antibacterial",
    indications: [
      { id: "standard_bacterial", label: "Standard bacterial infection" },
      { id: "mycobacterial_or_long_course", label: "Mycobacterial or prolonged-course use" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (_patient, context) => {
      const longCourse = context.indicationId === "mycobacterial_or_long_course";
      return {
        regimen: longCourse ? "600 mg IV/PO q24h" : "600 mg IV/PO q12h",
        renalBucket: noRenalAdjustBucket(context.renalMode),
        notes: [
          "No routine renal adjustment in major references.",
          "For prolonged therapy, monitor CBC closely and consider expert-guided dose individualization.",
        ],
      };
    },
  },
  {
    id: "levofloxacin",
    name: "Levofloxacin",
    category: "antibacterial",
    indications: [
      { id: "standard_infection", label: "Standard infection" },
      { id: "pneumonia_or_pseudomonas", label: "Pneumonia / pseudomonal infection" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const highDose = context.indicationId === "pneumonia_or_pseudomonas";

      if (context.renalMode === "ihd") {
        return {
          regimen: highDose
            ? "750 mg IV/PO x1, then 500 mg IV/PO q48h"
            : "500 mg IV/PO x1, then 250 mg IV/PO q48h",
          renalBucket: "Intermittent hemodialysis",
          notes: [
            "Load-maintenance strategy aligns with common HD pathways.",
            "Use ECG/QT and drug-interaction review where appropriate.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: highDose
            ? "750 mg IV/PO q24h"
            : "750 mg IV/PO x1, then 250 mg IV/PO q24h",
          renalBucket: "CRRT",
          notes: [
            "CRRT pathway is an educational reference and may vary by modality.",
            "For severe infection, ensure PK/PD target attainment with local guidance.",
          ],
        };
      }

      if (highDose) {
        return {
          regimen:
            patient.crclMlMin > 50
              ? "750 mg IV/PO q24h"
              : patient.crclMlMin >= 20
              ? "750 mg IV/PO q48h"
              : "750 mg IV/PO x1, then 500 mg IV/PO q48h",
          renalBucket:
            patient.crclMlMin > 50
              ? "CrCl > 50 mL/min"
              : patient.crclMlMin >= 20
              ? "CrCl 20-49 mL/min"
              : "CrCl < 20 mL/min",
          notes: [
            "Higher-dose pathway is used for pneumonia and pseudomonal targets.",
            "Avoid duplicate QT-prolonging combinations when possible.",
          ],
        };
      }

      return {
        regimen:
          patient.crclMlMin > 50
            ? "500 mg IV/PO q24h"
            : patient.crclMlMin >= 20
            ? "500 mg IV/PO x1, then 250 mg IV/PO q24h"
            : "500 mg IV/PO x1, then 250 mg IV/PO q48h",
        renalBucket:
          patient.crclMlMin > 50
            ? "CrCl > 50 mL/min"
            : patient.crclMlMin >= 20
            ? "CrCl 20-49 mL/min"
            : "CrCl < 20 mL/min",
        notes: [
          "Standard pathway follows common renal adjustment tables.",
          "Tailor duration and route to syndrome and clinical response.",
        ],
      };
    },
  },
  {
    id: "metronidazole",
    name: "Metronidazole",
    category: "antibacterial",
    indications: [
      { id: "anaerobic_systemic", label: "Anaerobic systemic infection" },
      { id: "intraabdominal_coverage", label: "Intra-abdominal adjunctive coverage" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const intraAbdominal = context.indicationId === "intraabdominal_coverage";

      if (context.renalMode === "ihd") {
        return {
          regimen: intraAbdominal ? "500 mg IV/PO q12h" : "500 mg IV/PO q8h",
          renalBucket: "Intermittent hemodialysis",
          notes: [
            "For iHD, q12h is often used for non-severe adjunctive intra-abdominal coverage.",
            "Escalate to q8h in high-severity anaerobic infection.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: intraAbdominal ? "500 mg IV/PO q12h" : "500 mg IV/PO q8h",
          renalBucket: "CRRT",
          notes: [
            "CRRT pathway commonly mirrors standard systemic intervals.",
            "Clinical severity should drive interval choice.",
          ],
        };
      }

      if (intraAbdominal) {
        return {
          regimen: "500 mg IV/PO q12h",
          renalBucket: patient.crclMlMin >= 10 ? "CrCl >= 10 mL/min" : "CrCl < 10 mL/min",
          notes: [
            "Adjunctive intra-abdominal pathway is a simplified educational regimen.",
            "Final duration should follow source-control status.",
          ],
        };
      }

      return {
        regimen: patient.crclMlMin >= 10 ? "500 mg IV/PO q8h" : "500 mg IV/PO q12h",
        renalBucket: patient.crclMlMin >= 10 ? "CrCl >= 10 mL/min" : "CrCl < 10 mL/min",
        notes: [
          "Renal adjustment is usually modest except at very low CrCl.",
          "In severe disease, maintain adequate exposure and reassess daily.",
        ],
      };
    },
  },
  {
    id: "tmp_smx",
    name: "Trimethoprim-Sulfamethoxazole",
    category: "antibacterial",
    indications: [
      { id: "uncomplicated_cystitis", label: "Uncomplicated cystitis" },
      { id: "ssti", label: "Skin/soft tissue infection" },
      { id: "staph_bone_joint", label: "S. aureus bone/joint infection" },
      { id: "gnr_bacteremia", label: "Gram-negative rod bacteremia" },
      { id: "stenotrophomonas", label: "Stenotrophomonas infection" },
      { id: "pjp_treatment", label: "Pneumocystis jirovecii pneumonia (PJP) treatment" },
      { id: "pjp_prophylaxis", label: "PJP prophylaxis" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const indication = context.indicationId;
      const pjpProphylaxis = indication === "pjp_prophylaxis";
      const pjpTreatment = indication === "pjp_treatment";
      const steno = indication === "stenotrophomonas";
      const cystitis = indication === "uncomplicated_cystitis";
      const ssti = indication === "ssti";
      const doseWeight = obesityAdjustedWeight(patient);
      const tmpRange = (minMgPerKgPerDay: number, maxMgPerKgPerDay: number, factor = 1) => {
        const low = mgFromWeight(minMgPerKgPerDay * factor, doseWeight.kg, 40);
        const high = mgFromWeight(maxMgPerKgPerDay * factor, doseWeight.kg, 40);
        return low === high ? `${low}` : `${low}-${high}`;
      };

      if (pjpProphylaxis) {
        if (context.renalMode === "ihd") {
          return {
            regimen: "1 SS tablet PO daily after HD (or 1 DS tablet PO three times weekly after HD)",
            renalBucket: "Intermittent hemodialysis",
            notes: [
              "PJP prophylaxis pathway is oral and usually dose-timed after HD sessions.",
              "Approximate IV equivalent (TMP component): 80-160 mg TMP/day.",
              "Monitor potassium, creatinine, and blood counts during chronic prophylaxis.",
            ],
          };
        }

        if (context.renalMode === "crrt") {
          return {
            regimen: "1 SS tablet PO daily",
            renalBucket: "CRRT",
            notes: [
              "CRRT prophylaxis data are limited; this is a pragmatic reference starting regimen.",
              "Approximate IV equivalent (TMP component): 80 mg TMP/day.",
              "Adjust with local protocol and tolerance monitoring.",
            ],
          };
        }

        if (patient.crclMlMin > 30) {
          return {
            regimen: "1 DS tablet PO daily (or 1 DS tablet PO three times weekly)",
            renalBucket: "CrCl > 30 mL/min",
            notes: [
              "Prophylaxis strategy can be daily or three-times-weekly based on tolerance and local protocol.",
              "Approximate IV equivalent (TMP component): 160 mg TMP/day (or 160 mg TMP on prophylaxis days for TIW strategy).",
              "Monitor potassium, creatinine, and blood counts during chronic prophylaxis.",
            ],
          };
        }

        if (patient.crclMlMin >= 15) {
          return {
            regimen: "1 SS tablet PO daily (or 1 DS tablet PO three times weekly)",
            renalBucket: "CrCl 15-30 mL/min",
            notes: [
              "Renal pathway uses reduced prophylaxis intensity.",
              "Approximate IV equivalent (TMP component): 80-160 mg TMP/day depending on chosen prophylaxis schedule.",
              "Monitor potassium, creatinine, and blood counts during chronic prophylaxis.",
            ],
          };
        }

        return {
          regimen: "1 SS tablet PO three times weekly (specialist-guided at very low CrCl)",
          renalBucket: "CrCl < 15 mL/min",
          notes: [
            "At very low CrCl, prophylaxis should be individualized by ID/pharmacy.",
            "Approximate IV equivalent (TMP component): 80 mg TMP on prophylaxis days.",
            "Monitor for hyperkalemia, kidney function changes, and cytopenias.",
          ],
        };
      }

      if (cystitis) {
        if (context.renalMode === "ihd") {
          return {
            regimen: "1 DS tablet PO q24h after HD",
            renalBucket: "Intermittent hemodialysis",
            notes: [
              "Cystitis pathway is derived from indication-based clinical-use guidance plus dialysis timing.",
              "Approximate IV equivalent (TMP component): 160 mg TMP/day.",
              "Dose after HD on dialysis days.",
            ],
          };
        }
        if (context.renalMode === "crrt") {
          return {
            regimen: "1 DS tablet PO q12-24h",
            renalBucket: "CRRT",
            notes: [
              "CRRT oral interval is a practical reference range.",
              "Approximate IV equivalent (TMP component): 160-320 mg TMP/day.",
              "Adjust to clinical response and local practice.",
            ],
          };
        }
        return {
          regimen:
            patient.crclMlMin > 30
              ? "1 DS tablet PO q12h"
              : patient.crclMlMin >= 15
              ? "1 DS tablet PO q24h"
              : "Not routinely recommended at CrCl <15 mL/min; if required, 1 SS tablet PO q24h with close monitoring",
          renalBucket:
            patient.crclMlMin > 30
              ? "CrCl > 30 mL/min"
              : patient.crclMlMin >= 15
              ? "CrCl 15-30 mL/min"
              : "CrCl < 15 mL/min",
          notes: [
            "Clinical-use pathway: uncomplicated cystitis oral dosing.",
            patient.crclMlMin > 30
              ? "Approximate IV equivalent (TMP component): 320 mg TMP/day."
              : patient.crclMlMin >= 15
              ? "Approximate IV equivalent (TMP component): 160 mg TMP/day."
              : "Approximate IV equivalent (TMP component): ~80 mg TMP/day if therapy is used.",
            "At very low CrCl, use only with specialist oversight.",
          ],
        };
      }

      if (ssti) {
        if (context.renalMode === "ihd") {
          return {
            regimen: "1 DS tablet PO q24h after HD (up to 2 DS/day in selected severe cases)",
            renalBucket: "Intermittent hemodialysis",
            notes: [
              "SSTI pathway reflects a common clinical-use range (1-2 DS q12h baseline).",
              "Approximate IV equivalent (TMP component): 160-320 mg TMP/day (up to 320 mg/day for higher oral exposure).",
              "Use higher exposure only when clinically indicated.",
            ],
          };
        }
        if (context.renalMode === "crrt") {
          return {
            regimen: "1-2 DS tablets PO q12h",
            renalBucket: "CRRT",
            notes: [
              "CRRT pathway uses standard exposure range as reference.",
              "Approximate IV equivalent (TMP component): 320-640 mg TMP/day.",
              "Monitor potassium, renal function, and blood counts.",
            ],
          };
        }
        return {
          regimen:
            patient.crclMlMin > 30
              ? "1-2 DS tablets PO q12h"
              : patient.crclMlMin >= 15
              ? "1 DS tablet PO q12h"
              : "Not routinely recommended at CrCl <15 mL/min; if required, 1 DS tablet PO q24h with close monitoring",
          renalBucket:
            patient.crclMlMin > 30
              ? "CrCl > 30 mL/min"
              : patient.crclMlMin >= 15
              ? "CrCl 15-30 mL/min"
              : "CrCl < 15 mL/min",
          notes: [
            "Clinical-use pathway: skin/soft tissue infection oral range.",
            patient.crclMlMin > 30
              ? "Approximate IV equivalent (TMP component): 320-640 mg TMP/day."
              : patient.crclMlMin >= 15
              ? "Approximate IV equivalent (TMP component): 320 mg TMP/day."
              : "Approximate IV equivalent (TMP component): ~160 mg TMP/day if therapy is used.",
            "At very low CrCl, use only with specialist oversight.",
          ],
        };
      }

      let baseMin = 8;
      let baseMax = 10;
      let interval = "q8-12h";
      if (indication === "staph_bone_joint") {
        baseMin = 8;
        baseMax = 8;
        interval = "q8-12h";
      } else if (indication === "gnr_bacteremia") {
        baseMin = 8;
        baseMax = 10;
        interval = "q8-12h";
      } else if (steno) {
        baseMin = 15;
        baseMax = 15;
        interval = "q8h";
      } else if (pjpTreatment) {
        baseMin = 15;
        baseMax = 20;
        interval = "q6-8h";
      }

      if (context.renalMode === "ihd") {
        const hdMin = pjpTreatment ? 5 : steno ? 7.5 : 2.5;
        const hdMax = pjpTreatment ? 7.5 : steno ? 7.5 : 5;
        const range = tmpRange(hdMin, hdMax);
        const practicalRegimen =
          pjpTreatment ? "1-2 DS tablets PO q24h after HD" : steno ? "2 DS tablets PO q24h after HD" : "1 DS tablet PO q24h after HD";
        return {
          regimen: practicalRegimen,
          renalBucket: "Intermittent hemodialysis",
          doseWeight,
          notes: [
            "Dose displayed as trimethoprim (TMP) component.",
            `Approximate IV equivalent (TMP component): ${range} mg TMP/day.`,
            pjpTreatment
              ? "PJP pathway uses high-target dosing; oral suggestion is 1-2 DS tablets q24h after HD."
              : steno
              ? "Stenotrophomonas pathway uses the maximum-target approach; oral suggestion is 2 DS tablets q24h after HD."
              : "Oral suggestion uses a practical tablet-based pathway.",
            pjpTreatment
              ? "HD pathway for PJP uses 5-7.5 mg TMP/kg/day q24h."
              : steno
              ? "HD pathway for Stenotrophomonas uses 5-7.5 mg TMP/kg/day q24h."
              : "HD pathway for non-PJP severe indications uses 2.5-5 mg TMP/kg/day q24h.",
            "Administer after HD and monitor potassium, renal function, and blood counts closely.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        const crrtMin = pjpTreatment ? 10 : steno ? 15 : 5;
        const crrtMax = pjpTreatment ? 15 : steno ? 15 : 10;
        const crrtInterval = pjpTreatment ? "q8h" : steno ? "q8h" : "q12h";
        const range = tmpRange(crrtMin, crrtMax);
        const practicalRegimen = pjpTreatment
          ? "2 DS tablets PO q8-12h"
          : steno
          ? "2 DS tablets PO q8h"
          : "1-2 DS tablets PO q12h";
        return {
          regimen: practicalRegimen,
          renalBucket: "CRRT",
          doseWeight,
          notes: [
            `Approximate IV equivalent (TMP component): ${range} mg TMP/day divided ${crrtInterval}.`,
            pjpTreatment
              ? "PJP pathway uses high-target dosing in CRRT with practical oral suggestion of 2 DS tablets q8-12h."
              : steno
              ? "Stenotrophomonas pathway uses maximum-target dosing in CRRT with practical oral suggestion of 2 DS tablets q8h."
              : "Oral suggestion uses a practical tablet-based pathway.",
            pjpTreatment
              ? "CRRT pathway for PJP: 10-15 mg TMP/kg/day."
              : steno
              ? "CRRT pathway for Stenotrophomonas: 10-15 mg TMP/kg/day."
              : "CRRT pathway for most severe non-PJP indications: 5-10 mg TMP/kg/day.",
            "CRRT clearance varies by modality and intensity; confirm final regimen with ICU pharmacy when possible.",
          ],
        };
      }

      const factor = patient.crclMlMin > 30 ? 1 : patient.crclMlMin >= 15 ? 0.5 : 0.25;
      const range = tmpRange(baseMin, baseMax, factor);
      const low25 = mgFromWeight(baseMin * 0.25, doseWeight.kg, 40);
      const high50 = mgFromWeight(baseMax * 0.5, doseWeight.kg, 40);
      const practicalRegimen =
        patient.crclMlMin > 30
          ? pjpTreatment
            ? "2 DS tablets PO q8h"
            : steno
            ? "2 DS tablets PO q8h"
            : "2 DS tablets PO q12h"
          : patient.crclMlMin >= 15
          ? pjpTreatment
            ? "2 DS tablets PO q12h"
            : steno
            ? "2 DS tablets PO q12h"
            : "1 DS tablet PO q12h"
          : pjpTreatment
          ? "1 DS tablet PO q12h (specialist-guided)"
          : steno
          ? "1 DS tablet PO q12h (specialist-guided)"
          : "1 DS tablet PO q24h (specialist-guided)";
      return {
        regimen: practicalRegimen,
        renalBucket:
          patient.crclMlMin > 30
            ? "CrCl > 30 mL/min"
            : patient.crclMlMin >= 15
            ? "CrCl 15-30 mL/min"
            : "CrCl < 15 mL/min",
        doseWeight,
        notes: [
          "Dose displayed as trimethoprim (TMP) component; uses adjusted body weight in obesity.",
          pjpTreatment
            ? "PJP pathway uses high target 15-20 mg TMP/kg/day when feasible."
            : steno
            ? "Stenotrophomonas pathway uses maximum target 15 mg TMP/kg/day when feasible."
            : "For non-Stenotrophomonas severe indications, target selection follows indication-specific ranges.",
          pjpTreatment && patient.crclMlMin > 30
            ? "Approximate oral option: 2 DS tablets PO q8h (~960 mg TMP/day). Approximate IV option: TMP-based target above divided q6-8h."
            : pjpTreatment && patient.crclMlMin >= 15
            ? "Approximate oral option: 2 DS tablets PO q12h (~640 mg TMP/day). Approximate IV option: TMP-based renal-reduced target above divided q12h."
            : pjpTreatment
            ? "Approximate oral option: 1 DS tablet PO q12h (~320 mg TMP/day) if treatment is pursued. Approximate IV option: low-end specialist-guided renal-reduced TMP target."
            : steno && patient.crclMlMin > 30
            ? "Approximate oral option: 2 DS tablets PO q8h (~960 mg TMP/day). Approximate IV option: TMP-based target above divided q8h."
            : steno && patient.crclMlMin >= 15
            ? "Approximate oral option: 2 DS tablets PO q12h (~640 mg TMP/day). Approximate IV option: TMP-based renal-reduced target above divided q12h."
            : steno
            ? "Approximate oral option: 1 DS tablet PO q12h (~320 mg TMP/day) if treatment is pursued. Approximate IV option: low-end specialist-guided renal-reduced TMP target."
            : "Approximate oral and IV options should follow the selected indication range and renal bucket.",
          patient.crclMlMin > 30
            ? `Approximate IV equivalent (TMP component): ${range} mg TMP/day divided ${interval}.`
            : patient.crclMlMin >= 15
            ? `Approximate IV equivalent with renal reduction (TMP component): ${range} mg TMP/day.`
            : `At very low CrCl, if therapy is used, approximate IV equivalent target (TMP component): ${low25}-${high50} mg TMP/day with specialist-guided monitoring.`,
          "At CrCl <15 mL/min, use is generally avoided unless benefit outweighs risk and close monitoring is available.",
        ],
      };
    },
  },
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    category: "antibacterial",
    indications: [
      { id: "standard_oral", label: "Standard oral infection" },
      { id: "high_dose_oral", label: "High-dose oral pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const highDose = context.indicationId === "high_dose_oral";

      if (context.renalMode === "ihd") {
        return {
          regimen: highDose ? "500 mg PO q12h (after HD on dialysis days)" : "500 mg PO q24h (after HD)",
          renalBucket: "Intermittent hemodialysis",
          notes: ["Dialysis-day doses should be given after HD when feasible."],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: highDose ? "875 mg PO q12h" : "500 mg PO q8h",
          renalBucket: "CRRT",
          notes: ["CRRT pathway is an educational template and should be locally confirmed."],
        };
      }

      if (highDose) {
        return {
          regimen:
            patient.crclMlMin > 30
              ? "875 mg PO q12h"
              : patient.crclMlMin > 10
              ? "875 mg PO q24h"
              : "500 mg PO q24h",
          renalBucket:
            patient.crclMlMin > 30
              ? "CrCl > 30 mL/min"
              : patient.crclMlMin > 10
              ? "CrCl 11-30 mL/min"
              : "CrCl <= 10 mL/min",
          notes: ["Higher oral pathway should be matched to syndrome severity and susceptibility context."],
        };
      }

      return {
        regimen:
          patient.crclMlMin > 30
            ? "500 mg PO q8h"
            : patient.crclMlMin > 10
            ? "500 mg PO q12h"
            : "500 mg PO q24h",
        renalBucket:
          patient.crclMlMin > 30
            ? "CrCl > 30 mL/min"
            : patient.crclMlMin > 10
            ? "CrCl 11-30 mL/min"
            : "CrCl <= 10 mL/min",
        notes: ["Oral pathway follows common renal-adjustment intervals in adult references."],
      };
    },
  },
  {
    id: "amoxicillin_clavulanate",
    name: "Amoxicillin/Clavulanate",
    category: "antibacterial",
    indications: [
      { id: "standard_oral", label: "Standard oral infection" },
      { id: "high_exposure_oral", label: "Higher oral exposure pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const highExposure = context.indicationId === "high_exposure_oral";

      if (context.renalMode === "ihd") {
        return {
          regimen: "500/125 mg PO q24h (after HD on dialysis days)",
          renalBucket: "Intermittent hemodialysis",
          notes: ["Avoid ER formulations in advanced renal dysfunction."],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: highExposure ? "875/125 mg PO q12h" : "500/125 mg PO q8h",
          renalBucket: "CRRT",
          notes: ["CRRT oral pathway should be confirmed with local protocol when available."],
        };
      }

      if (patient.crclMlMin > 30) {
        return {
          regimen: highExposure ? "875/125 mg PO q12h" : "500/125 mg PO q8h",
          renalBucket: "CrCl > 30 mL/min",
          notes: ["Avoid ER formulations in low CrCl pathways."],
        };
      }

      if (patient.crclMlMin > 10) {
        return {
          regimen: "500/125 mg PO q12h",
          renalBucket: "CrCl 11-30 mL/min",
          notes: ["Lower-CrCl pathway uses interval extension."],
        };
      }

      return {
        regimen: "500/125 mg PO q24h",
        renalBucket: "CrCl <= 10 mL/min",
        notes: ["Avoid ER formulations in advanced renal dysfunction."],
      };
    },
  },
  {
    id: "ampicillin",
    name: "Ampicillin",
    category: "antibacterial",
    indications: [
      { id: "systemic_standard", label: "Systemic infection" },
      { id: "high_exposure", label: "High-exposure pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const highExposure = context.indicationId === "high_exposure";

      if (context.renalMode === "ihd") {
        return {
          regimen: highExposure ? "2 g IV q8h (after HD on dialysis days)" : "2 g IV q12h (after HD)",
          renalBucket: "Intermittent hemodialysis",
          notes: ["Dialysis-day dosing should be synchronized post-HD."],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: highExposure ? "2 g IV q4h" : "2 g IV q6h",
          renalBucket: "CRRT",
          notes: ["CRRT pathway depends on modality and effluent flow."],
        };
      }

      if (patient.crclMlMin > 50) {
        return {
          regimen: highExposure ? "2 g IV q4h" : "2 g IV q6h",
          renalBucket: "CrCl > 50 mL/min",
          notes: ["Higher-intensity pathway should be guided by source and organism profile."],
        };
      }
      if (patient.crclMlMin > 30) {
        return {
          regimen: "2 g IV q6h",
          renalBucket: "CrCl 31-50 mL/min",
          notes: ["Renal interval extension is commonly used in reference protocols."],
        };
      }
      if (patient.crclMlMin > 15) {
        return {
          regimen: "2 g IV q8h",
          renalBucket: "CrCl 16-30 mL/min",
          notes: ["Renal interval extension is commonly used in reference protocols."],
        };
      }
      return {
        regimen: "2 g IV q12h",
        renalBucket: "CrCl <= 15 mL/min",
        notes: ["Severe infection may require specialist review at very low CrCl."],
      };
    },
  },
  {
    id: "azithromycin",
    name: "Azithromycin",
    category: "antibacterial",
    indications: [
      { id: "respiratory", label: "Respiratory infection pathway" },
      { id: "alt_short_course", label: "Alternative short-course pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (_patient, context) => {
      const shortCourse = context.indicationId === "alt_short_course";
      return {
        regimen: shortCourse ? "500 mg PO/IV q24h for 3 days" : "500 mg PO/IV once, then 250 mg PO/IV q24h",
        renalBucket: noRenalAdjustBucket(context.renalMode),
        notes: ["No routine renal adjustment in major adult references."],
      };
    },
  },
  {
    id: "cefiderocol",
    name: "Cefiderocol",
    category: "antibacterial",
    indications: [
      { id: "resistant_gram_negative", label: "Resistant Gram-negative infection" },
      { id: "high_clearance_or_critical", label: "High-clearance / critical illness pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const highClearance = context.indicationId === "high_clearance_or_critical";

      if (context.renalMode === "ihd") {
        return {
          regimen: "750 mg IV q12h (3-hour infusion; dose after HD on dialysis days)",
          renalBucket: "Intermittent hemodialysis",
          notes: ["Dialysis schedule and infection severity should guide final interval."],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: "1.5 g IV q8h (3-hour infusion)",
          renalBucket: "CRRT",
          notes: ["CRRT regimens vary by effluent intensity and residual renal function."],
        };
      }

      if (patient.crclMlMin > 120) {
        return {
          regimen: "2 g IV q6h (3-hour infusion)",
          renalBucket: "CrCl > 120 mL/min",
          notes: ["Augmented renal clearance pathway."],
        };
      }
      if (patient.crclMlMin > 60) {
        return {
          regimen: highClearance ? "2 g IV q6h (3-hour infusion)" : "2 g IV q8h (3-hour infusion)",
          renalBucket: "CrCl 61-120 mL/min",
          notes: ["Use higher frequency when exposure targets are difficult to achieve."],
        };
      }
      if (patient.crclMlMin > 30) {
        return {
          regimen: "1.5 g IV q8h (3-hour infusion)",
          renalBucket: "CrCl 31-60 mL/min",
          notes: ["Interval and dose reduction align with common reference pathways."],
        };
      }
      if (patient.crclMlMin > 15) {
        return {
          regimen: "1 g IV q8h (3-hour infusion)",
          renalBucket: "CrCl 16-30 mL/min",
          notes: ["Use susceptibility and infection site to finalize dose."],
        };
      }
      return {
        regimen: "750 mg IV q12h (3-hour infusion)",
        renalBucket: "CrCl <= 15 mL/min",
        notes: ["Very low CrCl pathways should be reviewed with stewardship/pharmacy."],
      };
    },
  },
  {
    id: "cefpodoxime",
    name: "Cefpodoxime",
    category: "antibacterial",
    indications: [
      { id: "standard_oral", label: "Standard oral pathway" },
      { id: "complicated_oral", label: "Complicated oral pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const complicated = context.indicationId === "complicated_oral";

      if (context.renalMode === "ihd") {
        return {
          regimen: "200 mg PO q24h (after HD on dialysis days)",
          renalBucket: "Intermittent hemodialysis",
          notes: ["Oral dialysis pathway uses daily maintenance with post-HD timing."],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: complicated ? "200 mg PO q12h" : "200 mg PO q24h",
          renalBucket: "CRRT",
          notes: ["CRRT oral intervals should be confirmed locally."],
        };
      }

      return {
        regimen:
          patient.crclMlMin >= 30
            ? complicated
              ? "200 mg PO q12h"
              : "200 mg PO q12h"
            : "200 mg PO q24h",
        renalBucket: patient.crclMlMin >= 30 ? "CrCl >= 30 mL/min" : "CrCl < 30 mL/min",
        notes: ["Lower-CrCl pathway uses interval extension."],
      };
    },
  },
  {
    id: "ceftaroline",
    name: "Ceftaroline",
    category: "antibacterial",
    indications: [
      { id: "standard_serious", label: "Standard serious infection" },
      { id: "high_exposure_mrsa", label: "High-exposure MRSA pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const highExposure = context.indicationId === "high_exposure_mrsa";

      if (context.renalMode === "ihd") {
        return {
          regimen: "200 mg IV q12h (after HD on dialysis days)",
          renalBucket: "Intermittent hemodialysis",
          notes: ["Dialysis-day doses should be given after HD when feasible."],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: highExposure ? "400 mg IV q8h" : "400 mg IV q12h",
          renalBucket: "CRRT",
          notes: ["CRRT pathway should be individualized to modality and severity."],
        };
      }

      if (patient.crclMlMin > 50) {
        return {
          regimen: highExposure ? "600 mg IV q8h" : "600 mg IV q12h",
          renalBucket: "CrCl > 50 mL/min",
          notes: ["High-exposure pathway is for selected high-burden scenarios."],
        };
      }
      if (patient.crclMlMin > 30) {
        return {
          regimen: "400 mg IV q12h",
          renalBucket: "CrCl 31-50 mL/min",
          notes: ["Renal-adjusted pathway."],
        };
      }
      if (patient.crclMlMin > 15) {
        return {
          regimen: "300 mg IV q12h",
          renalBucket: "CrCl 16-30 mL/min",
          notes: ["Renal-adjusted pathway."],
        };
      }
      return {
        regimen: "200 mg IV q12h",
        renalBucket: "CrCl <= 15 mL/min",
        notes: ["Very low CrCl pathway should be confirmed with local policy."],
      };
    },
  },
  {
    id: "ceftazidime_avibactam",
    name: "Ceftazidime/Avibactam",
    category: "antibacterial",
    indications: [
      { id: "standard_resistant_gn", label: "Resistant Gram-negative pathway" },
      { id: "high_exposure_critical", label: "High-exposure critical illness pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const highExposure = context.indicationId === "high_exposure_critical";

      if (context.renalMode === "ihd") {
        return {
          regimen: "0.94 g IV q24h (2-hour infusion), dose after HD on dialysis days",
          renalBucket: "Intermittent hemodialysis",
          notes: ["Dialysis pathway may require supplemental dosing in prolonged sessions."],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: highExposure ? "2.5 g IV q8h (2-hour infusion)" : "1.25 g IV q8h (2-hour infusion)",
          renalBucket: "CRRT",
          notes: ["CRRT strategy should be matched to effluent intensity and organism MIC."],
        };
      }

      if (patient.crclMlMin > 50) {
        return {
          regimen: highExposure ? "2.5 g IV q8h (2-hour infusion)" : "2.5 g IV q8h (2-hour infusion)",
          renalBucket: "CrCl > 50 mL/min",
          notes: ["Standard preserved-renal-function pathway."],
        };
      }
      if (patient.crclMlMin > 30) {
        return {
          regimen: "1.25 g IV q8h (2-hour infusion)",
          renalBucket: "CrCl 31-50 mL/min",
          notes: ["Renal-adjusted pathway."],
        };
      }
      if (patient.crclMlMin > 15) {
        return {
          regimen: "0.94 g IV q12h (2-hour infusion)",
          renalBucket: "CrCl 16-30 mL/min",
          notes: ["Renal-adjusted pathway."],
        };
      }
      if (patient.crclMlMin > 5) {
        return {
          regimen: "0.94 g IV q24h (2-hour infusion)",
          renalBucket: "CrCl 6-15 mL/min",
          notes: ["Renal-adjusted pathway."],
        };
      }
      return {
        regimen: "0.94 g IV q48h (2-hour infusion)",
        renalBucket: "CrCl <= 5 mL/min",
        notes: ["Very low CrCl pathway should be confirmed with local protocol."],
      };
    },
  },
  {
    id: "ceftolozane_tazobactam",
    name: "Ceftolozane/Tazobactam",
    category: "antibacterial",
    indications: [
      { id: "resistant_gn_standard", label: "Resistant Gram-negative pathway" },
      { id: "high_exposure_pneumonia", label: "High-exposure pneumonia pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const highExposure = context.indicationId === "high_exposure_pneumonia";

      if (context.renalMode === "ihd") {
        return {
          regimen: "750 mg IV q8h (1-hour infusion), dose after HD on dialysis days",
          renalBucket: "Intermittent hemodialysis",
          notes: ["Dialysis pathway is an educational template and should be locally confirmed."],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: highExposure ? "3 g IV q8h (1-hour infusion)" : "1.5 g IV q8h (1-hour infusion)",
          renalBucket: "CRRT",
          notes: ["CRRT pathway may need adjustment for high effluent flows."],
        };
      }

      if (patient.crclMlMin > 50) {
        return {
          regimen: highExposure ? "3 g IV q8h (1-hour infusion)" : "1.5 g IV q8h (1-hour infusion)",
          renalBucket: "CrCl > 50 mL/min",
          notes: ["High-exposure pathway is selected for severe pulmonary/critical scenarios."],
        };
      }
      if (patient.crclMlMin > 30) {
        return {
          regimen: "750 mg IV q8h (1-hour infusion)",
          renalBucket: "CrCl 31-50 mL/min",
          notes: ["Renal-adjusted pathway."],
        };
      }
      if (patient.crclMlMin > 15) {
        return {
          regimen: "375 mg IV q8h (1-hour infusion)",
          renalBucket: "CrCl 16-30 mL/min",
          notes: ["Renal-adjusted pathway."],
        };
      }
      return {
        regimen: "375 mg IV q12h (1-hour infusion)",
        renalBucket: "CrCl <= 15 mL/min",
        notes: ["Very low CrCl pathway should be confirmed with local protocol."],
      };
    },
  },
  {
    id: "cephalexin",
    name: "Cephalexin",
    category: "antibacterial",
    indications: [
      { id: "standard_oral", label: "Standard oral infection" },
      { id: "high_frequency_oral", label: "Higher-frequency oral pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const highFrequency = context.indicationId === "high_frequency_oral";

      if (context.renalMode === "ihd") {
        return {
          regimen: highFrequency ? "500 mg PO q12h (after HD on dialysis days)" : "250-500 mg PO q12h",
          renalBucket: "Intermittent hemodialysis",
          notes: ["Dialysis-day doses should be given after HD when feasible."],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: highFrequency ? "500 mg PO q6h" : "500 mg PO q8h",
          renalBucket: "CRRT",
          notes: ["CRRT oral pathways are templates and should be clinically individualized."],
        };
      }

      if (patient.crclMlMin > 30) {
        return {
          regimen: highFrequency ? "500 mg PO q6h" : "500 mg PO q8h",
          renalBucket: "CrCl > 30 mL/min",
          notes: ["Preserved-renal-function oral pathway."],
        };
      }
      if (patient.crclMlMin > 15) {
        return {
          regimen: "500 mg PO q8h",
          renalBucket: "CrCl 16-30 mL/min",
          notes: ["Renal interval extension."],
        };
      }
      return {
        regimen: "500 mg PO q12h",
        renalBucket: "CrCl <= 15 mL/min",
        notes: ["Renal interval extension."],
      };
    },
  },
  {
    id: "ciprofloxacin",
    name: "Ciprofloxacin",
    category: "antibacterial",
    indications: [
      { id: "standard_systemic", label: "Standard systemic infection" },
      { id: "high_exposure_pseudomonal", label: "High-exposure pseudomonal pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const highExposure = context.indicationId === "high_exposure_pseudomonal";

      if (context.renalMode === "ihd") {
        return {
          regimen: highExposure ? "400 mg IV qPM (or 500 mg PO qPM) after HD" : "400 mg IV qPM (or 500 mg PO qPM)",
          renalBucket: "Intermittent hemodialysis",
          notes: ["Dialysis-day timing should be post-HD when feasible."],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: highExposure ? "400 mg IV q8h (or 750 mg PO q12h)" : "400 mg IV q12h (or 500 mg PO q12h)",
          renalBucket: "CRRT",
          notes: ["CRRT pathway should be matched to target exposure and local protocol."],
        };
      }

      if (patient.crclMlMin > 50) {
        return {
          regimen: highExposure ? "400 mg IV q8h (or 750 mg PO q12h)" : "400 mg IV q12h (or 500 mg PO q12h)",
          renalBucket: "CrCl > 50 mL/min",
          notes: ["High-exposure pathway is intended for selected severe Gram-negative scenarios."],
        };
      }
      if (patient.crclMlMin > 30) {
        return {
          regimen: "400 mg IV q12h (or 500 mg PO q12h)",
          renalBucket: "CrCl 31-50 mL/min",
          notes: ["Renal-adjusted pathway."],
        };
      }
      return {
        regimen: "400 mg IV q24h (or 500 mg PO q24h)",
        renalBucket: "CrCl <= 30 mL/min",
        notes: ["Renal-adjusted pathway."],
      };
    },
  },
  {
    id: "clindamycin",
    name: "Clindamycin",
    category: "antibacterial",
    indications: [
      { id: "standard_systemic_max", label: "Systemic infection (high-dose pathway)" },
      { id: "bone_joint_infection", label: "Bone and joint infection pathway" },
      { id: "adjunctive_toxin_suppression", label: "Adjunctive toxin-suppression pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (_patient, context) => {
      const boneJoint = context.indicationId === "bone_joint_infection";
      const regimen = "900 mg IV/PO q8h";

      return {
        regimen,
        renalBucket: noRenalAdjustBucket(context.renalMode),
        notes: [
          "No routine renal adjustment in major adult references.",
          "Clindamycin has high oral bioavailability; PO step-down is favored when clinically appropriate and tolerated.",
          "Obesity-focused guidance supports upper-end routine dosing with matched maximum IV and PO schedules.",
          "Equivalent high-dose obesity options include 900 mg q8h or 600 mg q6h.",
          boneJoint
            ? "Bone and joint pathway uses maximized routine dosing to support tissue exposure."
            : "High-dose pathway selected as default to avoid underexposure in higher body-weight patients.",
        ],
      };
    },
  },
  {
    id: "dalbavancin",
    name: "Dalbavancin",
    category: "antibacterial",
    indications: [
      { id: "single_dose", label: "Single-dose pathway" },
      { id: "two_dose", label: "Two-dose pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const twoDose = context.indicationId === "two_dose";
      const severeRenal = patient.crclMlMin < 30 && context.renalMode === "standard";

      if (twoDose) {
        return {
          regimen: severeRenal ? "750 mg IV once, then 375 mg IV on day 8" : "1000 mg IV once, then 500 mg IV on day 8",
          renalBucket:
            context.renalMode === "standard"
              ? severeRenal
                ? "CrCl < 30 mL/min (non-dialysis)"
                : "CrCl >= 30 mL/min"
              : renalModeLabel(context.renalMode),
          notes: ["Renal reduction is typically applied only for CrCl <30 mL/min not on intermittent HD."],
        };
      }

      return {
        regimen: severeRenal ? "1125 mg IV once" : "1500 mg IV once",
        renalBucket:
          context.renalMode === "standard"
            ? severeRenal
              ? "CrCl < 30 mL/min (non-dialysis)"
              : "CrCl >= 30 mL/min"
            : renalModeLabel(context.renalMode),
        notes: ["Renal reduction is typically applied only for CrCl <30 mL/min not on intermittent HD."],
      };
    },
  },
  {
    id: "doxycycline",
    name: "Doxycycline",
    category: "antibacterial",
    indications: [
      { id: "standard_oral_or_iv", label: "Standard oral/IV pathway" },
      { id: "high_exposure", label: "High-exposure pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (_patient, context) => {
      const highExposure = context.indicationId === "high_exposure";
      return {
        regimen: highExposure ? "100 mg IV/PO q12h" : "100 mg IV/PO q12h",
        renalBucket: noRenalAdjustBucket(context.renalMode),
        notes: ["No routine renal adjustment in major adult references."],
      };
    },
  },
  {
    id: "fidaxomicin",
    name: "Fidaxomicin",
    category: "antibacterial",
    indications: [
      { id: "cdiff_standard", label: "C. difficile treatment pathway" },
      { id: "cdiff_extended", label: "Extended-pulsed C. difficile pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (_patient, context) => {
      const extended = context.indicationId === "cdiff_extended";
      return {
        regimen: extended
          ? "200 mg PO q12h for 5 days, then 200 mg PO every other day (days 7-25)"
          : "200 mg PO q12h for 10 days",
        renalBucket: noRenalAdjustBucket(context.renalMode),
        notes: ["No routine renal adjustment in major references."],
      };
    },
  },
  {
    id: "imipenem_cilastatin",
    name: "Imipenem/Cilastatin",
    category: "antibacterial",
    indications: [
      { id: "standard_severe", label: "Standard severe infection" },
      { id: "high_exposure_resistant", label: "High-exposure resistant-pathogen pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const highExposure = context.indicationId === "high_exposure_resistant";

      if (context.renalMode === "ihd") {
        return {
          regimen: highExposure ? "500 mg IV q8h (after HD on dialysis days)" : "200 mg IV q12h (after HD)",
          renalBucket: "Intermittent hemodialysis",
          notes: ["Dialysis-day dosing should be synchronized post-HD."],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: highExposure ? "500 mg IV q6h" : "500 mg IV q8h",
          renalBucket: "CRRT",
          notes: ["CRRT pathway is a teaching template and may vary by modality."],
        };
      }

      if (patient.crclMlMin > 90) {
        return {
          regimen: highExposure ? "1 g IV q6h" : "500 mg IV q6h",
          renalBucket: "CrCl > 90 mL/min",
          notes: ["Higher-intensity pathway should be used selectively for severe resistant infection."],
        };
      }
      if (patient.crclMlMin > 60) {
        return {
          regimen: "400 mg IV q6h",
          renalBucket: "CrCl 61-90 mL/min",
          notes: ["Renal-adjusted pathway."],
        };
      }
      if (patient.crclMlMin > 30) {
        return {
          regimen: "300 mg IV q6h",
          renalBucket: "CrCl 31-60 mL/min",
          notes: ["Renal-adjusted pathway."],
        };
      }
      if (patient.crclMlMin > 15) {
        return {
          regimen: "200 mg IV q6h",
          renalBucket: "CrCl 16-30 mL/min",
          notes: ["Renal-adjusted pathway."],
        };
      }
      return {
        regimen: "200 mg IV q12h",
        renalBucket: "CrCl <= 15 mL/min",
        notes: ["Very low CrCl pathways should be confirmed with local protocol."],
      };
    },
  },
  {
    id: "nafcillin",
    name: "Nafcillin",
    category: "antibacterial",
    indications: [
      { id: "mssa_standard", label: "MSSA systemic infection pathway" },
      { id: "mssa_high_burden", label: "MSSA high-burden pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (_patient, context) => {
      const highBurden = context.indicationId === "mssa_high_burden";
      return {
        regimen: highBurden ? "2 g IV q4h" : "2 g IV q4-6h",
        renalBucket: noRenalAdjustBucket(context.renalMode),
        notes: ["No routine renal adjustment in major references; monitor hepatic and sodium load context."],
      };
    },
  },
  {
    id: "penicillin_g",
    name: "Penicillin G",
    category: "antibacterial",
    indications: [
      { id: "serious_streptococcal", label: "Serious streptococcal/systemic pathway" },
      { id: "cns_or_high_exposure", label: "CNS or high-exposure pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const highExposure = context.indicationId === "cns_or_high_exposure";

      if (context.renalMode === "ihd") {
        return {
          regimen: highExposure ? "3 million units IV q6h (after HD on dialysis days)" : "2 million units IV q6h (after HD)",
          renalBucket: "Intermittent hemodialysis",
          notes: ["Dialysis-day doses should be timed after HD."],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: highExposure ? "4 million units IV q4h" : "4 million units IV q6h",
          renalBucket: "CRRT",
          notes: ["CRRT pathway should be individualized to target exposure and local protocol."],
        };
      }

      if (patient.crclMlMin > 50) {
        return {
          regimen: highExposure ? "4 million units IV q4h" : "4 million units IV q4h",
          renalBucket: "CrCl > 50 mL/min",
          notes: ["Preserved-renal-function pathway."],
        };
      }
      if (patient.crclMlMin > 10) {
        return {
          regimen: highExposure ? "3 million units IV q4h" : "3 million units IV q4h",
          renalBucket: "CrCl 11-50 mL/min",
          notes: ["Renal-adjusted pathway."],
        };
      }
      return {
        regimen: "3 million units IV q6h",
        renalBucket: "CrCl <= 10 mL/min",
        notes: ["Renal interval extension for very low CrCl."],
      };
    },
  },
  {
    id: "tedizolid",
    name: "Tedizolid",
    category: "antibacterial",
    indications: [
      { id: "standard_skin_soft_tissue", label: "Skin/soft tissue pathway" },
      { id: "offlabel_systemic", label: "Off-label systemic pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (_patient, context) => {
      return {
        regimen: "200 mg IV/PO q24h",
        renalBucket: noRenalAdjustBucket(context.renalMode),
        notes: ["No routine renal adjustment in major adult references."],
      };
    },
  },
  {
    id: "amikacin",
    name: "Amikacin",
    category: "antibacterial",
    indications: [
      { id: "systemic_gram_negative", label: "Systemic Gram-negative infection" },
      { id: "high_exposure_mdr", label: "High-exposure MDR Gram-negative pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const highExposure = context.indicationId === "high_exposure_mdr";
      const doseWeight = obesityAdjustedWeight(patient);

      if (context.renalMode === "ihd") {
        const doseMg = mgFromWeight(highExposure ? 10 : 7.5, doseWeight.kg, 25);
        return {
          regimen: `${doseMg} mg IV post-HD (level-guided redosing)`,
          renalBucket: "Intermittent hemodialysis",
          doseWeight,
          notes: [
            "Dose is a post-HD template and should be individualized with peak/trough targets.",
            "Aminoglycosides require therapeutic drug monitoring.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        const mgPerKg = highExposure ? 15 : 10;
        const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 25);
        return {
          regimen: `${doseMg} mg IV q24h (${mgPerKg} mg/kg, level-guided)`,
          renalBucket: "CRRT",
          doseWeight,
          notes: [
            "CRRT dosing depends on modality and effluent rate.",
            "TDM is required for final interval selection.",
          ],
        };
      }

      const mgPerKg = highExposure ? 20 : 15;
      const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 25);
      if (patient.crclMlMin > 60) {
        return {
          regimen: `${doseMg} mg IV q24h (${mgPerKg} mg/kg, extended interval)`,
          renalBucket: "CrCl > 60 mL/min",
          doseWeight,
          notes: ["Use level-guided interval adjustment."],
        };
      }
      if (patient.crclMlMin > 40) {
        return {
          regimen: `${doseMg} mg IV q36h (${mgPerKg} mg/kg, extended interval)`,
          renalBucket: "CrCl 41-60 mL/min",
          doseWeight,
          notes: ["Use level-guided interval adjustment."],
        };
      }
      if (patient.crclMlMin > 20) {
        return {
          regimen: `${doseMg} mg IV q48h (${mgPerKg} mg/kg, extended interval)`,
          renalBucket: "CrCl 21-40 mL/min",
          doseWeight,
          notes: ["Use level-guided interval adjustment."],
        };
      }
      return {
        regimen: `${doseMg} mg IV once, then redose by drug levels`,
        renalBucket: "CrCl <= 20 mL/min",
        doseWeight,
        notes: ["Very low CrCl pathway should be individualized by TDM protocol."],
      };
    },
  },
  {
    id: "gentamicin",
    name: "Gentamicin",
    category: "antibacterial",
    indications: [
      { id: "extended_interval", label: "Extended-interval pathway" },
      { id: "synergy", label: "Synergy pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const synergy = context.indicationId === "synergy";
      const doseWeight = obesityAdjustedWeight(patient);

      if (context.renalMode === "ihd") {
        const mgPerKg = synergy ? 1 : 2;
        const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 10);
        return {
          regimen: `${doseMg} mg IV post-HD (level-guided redosing)`,
          renalBucket: "Intermittent hemodialysis",
          doseWeight,
          notes: ["Aminoglycosides require therapeutic drug monitoring for interval optimization."],
        };
      }

      if (context.renalMode === "crrt") {
        const mgPerKg = synergy ? 1 : 5;
        const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 10);
        return {
          regimen: synergy
            ? `${doseMg} mg IV q24h (${mgPerKg} mg/kg)`
            : `${doseMg} mg IV q24h (${mgPerKg} mg/kg, extended interval)`,
          renalBucket: "CRRT",
          doseWeight,
          notes: ["CRRT pathways are highly protocol-dependent; confirm with local PK support."],
        };
      }

      if (synergy) {
        const doseMg = mgFromWeight(1, doseWeight.kg, 10);
        return {
          regimen:
            patient.crclMlMin > 50
              ? `${doseMg} mg IV q24h (1 mg/kg)`
              : patient.crclMlMin > 30
              ? `${doseMg} mg IV q24-36h (1 mg/kg)`
              : `${doseMg} mg IV q48h (1 mg/kg, level-guided)`,
          renalBucket:
            patient.crclMlMin > 50
              ? "CrCl > 50 mL/min"
              : patient.crclMlMin > 30
              ? "CrCl 31-50 mL/min"
              : "CrCl <= 30 mL/min",
          doseWeight,
          notes: ["Synergy pathway should be individualized by indication and culture context."],
        };
      }

      const doseMg = mgFromWeight(7, doseWeight.kg, 10);
      if (patient.crclMlMin > 60) {
        return {
          regimen: `${doseMg} mg IV q24h (7 mg/kg, extended interval)`,
          renalBucket: "CrCl > 60 mL/min",
          doseWeight,
          notes: ["Use level-guided interval adjustment."],
        };
      }
      if (patient.crclMlMin > 40) {
        return {
          regimen: `${doseMg} mg IV q36h (7 mg/kg, extended interval)`,
          renalBucket: "CrCl 41-60 mL/min",
          doseWeight,
          notes: ["Use level-guided interval adjustment."],
        };
      }
      if (patient.crclMlMin > 20) {
        return {
          regimen: `${doseMg} mg IV q48h (7 mg/kg, extended interval)`,
          renalBucket: "CrCl 21-40 mL/min",
          doseWeight,
          notes: ["Use level-guided interval adjustment."],
        };
      }
      return {
        regimen: `${doseMg} mg IV once, then redose by drug levels`,
        renalBucket: "CrCl <= 20 mL/min",
        doseWeight,
        notes: ["Very low CrCl pathway should be individualized by TDM protocol."],
      };
    },
  },
  {
    id: "tobramycin",
    name: "Tobramycin",
    category: "antibacterial",
    indications: [
      { id: "extended_interval", label: "Extended-interval pathway" },
      { id: "synergy", label: "Synergy pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const synergy = context.indicationId === "synergy";
      const doseWeight = obesityAdjustedWeight(patient);

      if (context.renalMode === "ihd") {
        const mgPerKg = synergy ? 1 : 2;
        const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 10);
        return {
          regimen: `${doseMg} mg IV post-HD (level-guided redosing)`,
          renalBucket: "Intermittent hemodialysis",
          doseWeight,
          notes: ["Reference pathway follows gentamicin-style guidance; apply TDM-guided interval selection."],
        };
      }

      if (context.renalMode === "crrt") {
        const mgPerKg = synergy ? 1 : 5;
        const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 10);
        return {
          regimen: synergy
            ? `${doseMg} mg IV q24h (${mgPerKg} mg/kg)`
            : `${doseMg} mg IV q24h (${mgPerKg} mg/kg, extended interval)`,
          renalBucket: "CRRT",
          doseWeight,
          notes: ["CRRT pathways are highly protocol-dependent; confirm with local PK support."],
        };
      }

      if (synergy) {
        const doseMg = mgFromWeight(1, doseWeight.kg, 10);
        return {
          regimen:
            patient.crclMlMin > 50
              ? `${doseMg} mg IV q24h (1 mg/kg)`
              : patient.crclMlMin > 30
              ? `${doseMg} mg IV q24-36h (1 mg/kg)`
              : `${doseMg} mg IV q48h (1 mg/kg, level-guided)`,
          renalBucket:
            patient.crclMlMin > 50
              ? "CrCl > 50 mL/min"
              : patient.crclMlMin > 30
              ? "CrCl 31-50 mL/min"
              : "CrCl <= 30 mL/min",
          doseWeight,
          notes: ["Synergy pathway should be individualized by indication and culture context."],
        };
      }

      const doseMg = mgFromWeight(7, doseWeight.kg, 10);
      if (patient.crclMlMin > 60) {
        return {
          regimen: `${doseMg} mg IV q24h (7 mg/kg, extended interval)`,
          renalBucket: "CrCl > 60 mL/min",
          doseWeight,
          notes: ["Use level-guided interval adjustment."],
        };
      }
      if (patient.crclMlMin > 40) {
        return {
          regimen: `${doseMg} mg IV q36h (7 mg/kg, extended interval)`,
          renalBucket: "CrCl 41-60 mL/min",
          doseWeight,
          notes: ["Use level-guided interval adjustment."],
        };
      }
      if (patient.crclMlMin > 20) {
        return {
          regimen: `${doseMg} mg IV q48h (7 mg/kg, extended interval)`,
          renalBucket: "CrCl 21-40 mL/min",
          doseWeight,
          notes: ["Use level-guided interval adjustment."],
        };
      }
      return {
        regimen: `${doseMg} mg IV once, then redose by drug levels`,
        renalBucket: "CrCl <= 20 mL/min",
        doseWeight,
        notes: ["Very low CrCl pathway should be individualized by TDM protocol."],
      };
    },
  },
  {
    id: "moxifloxacin",
    name: "Moxifloxacin",
    category: "antibacterial",
    indications: [
      { id: "respiratory_or_standard", label: "Respiratory/systemic pathway" },
      { id: "high_exposure", label: "High-exposure pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (_patient, context) => {
      return {
        regimen: "400 mg PO/IV q24h",
        renalBucket: noRenalAdjustBucket(context.renalMode),
        notes: ["No routine renal adjustment in major adult references."],
      };
    },
  },
  {
    id: "polymyxin_b",
    name: "Polymyxin B",
    category: "antibacterial",
    indications: [
      { id: "resistant_gram_negative", label: "Resistant Gram-negative pathway" },
      { id: "high_exposure_critical", label: "High-exposure critical-illness pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const highExposure = context.indicationId === "high_exposure_critical";
      const doseWeight = adjustedWeightOver120Ibw(patient);
      const loadUnitsPerKg = highExposure ? 25000 : 20000;
      const maintUnitsPerKg = highExposure ? 15000 : 12500;
      const loadUnits = mgFromWeight(loadUnitsPerKg, doseWeight.kg, 10000);
      const maintUnits = mgFromWeight(maintUnitsPerKg, doseWeight.kg, 10000);
      return {
        regimen: `${loadUnits.toLocaleString()} units IV once, then ${maintUnits.toLocaleString()} units IV q12h`,
        renalBucket: noRenalAdjustBucket(context.renalMode),
        doseWeight,
        notes: [
          "Polymyxin B pathways are typically not adjusted by renal function but require close toxicity monitoring.",
          "Nephrotoxicity and neurotoxicity risk should be reassessed daily.",
        ],
      };
    },
  },
  {
    id: "vancomycin_iv",
    name: "Vancomycin IV",
    category: "antibacterial",
    indications: [
      { id: "serious_mrsa_or_invasive", label: "Serious MRSA/invasive pathway" },
      { id: "standard_systemic", label: "Standard systemic pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (patient, context) => {
      const serious = context.indicationId === "serious_mrsa_or_invasive";
      const doseWeight = {
        basis: "tbw" as const,
        kg: patient.totalBodyWeightKg,
      };

      if (context.renalMode === "ihd") {
        const loadMg = mgFromWeight(serious ? 25 : 20, doseWeight.kg, 250, 3000);
        const postHdMg = mgFromWeight(serious ? 15 : 10, doseWeight.kg, 250, 2000);
        return {
          regimen: `${loadMg} mg IV once, then ${postHdMg} mg IV post-HD (AUC/level-guided)`,
          renalBucket: "Intermittent hemodialysis",
          doseWeight,
          notes: [
            "Maintenance must be adjusted with levels and dialysis schedule.",
            "AUC-guided monitoring is preferred.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        const loadMg = mgFromWeight(serious ? 25 : 20, doseWeight.kg, 250, 3000);
        const maintMg = mgFromWeight(serious ? 15 : 10, doseWeight.kg, 250, 2000);
        return {
          regimen: `${loadMg} mg IV once, then ${maintMg} mg IV q12-24h (AUC/level-guided)`,
          renalBucket: "CRRT",
          doseWeight,
          notes: [
            "CRRT vancomycin pathways require protocol-specific level timing.",
            "AUC-guided monitoring is preferred.",
          ],
        };
      }

      const mgPerKg = serious ? 20 : 15;
      const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 250, 2500);
      let interval = "q48h or by levels";
      if (patient.crclMlMin > 90) interval = "q8h";
      else if (patient.crclMlMin > 50) interval = "q12h";
      else if (patient.crclMlMin > 30) interval = "q24h";
      return {
        regimen: `${doseMg} mg IV ${interval} (${mgPerKg} mg/kg, AUC/level-guided)`,
        renalBucket:
          patient.crclMlMin > 90
            ? "CrCl > 90 mL/min"
            : patient.crclMlMin > 50
            ? "CrCl 51-90 mL/min"
            : patient.crclMlMin > 30
            ? "CrCl 31-50 mL/min"
            : "CrCl <= 30 mL/min",
        doseWeight,
        notes: [
          "Final maintenance must be adjusted to measured levels and AUC targets.",
          "Use local vancomycin monitoring protocol for definitive dosing.",
        ],
      };
    },
  },
  {
    id: "vancomycin_po",
    name: "Vancomycin PO",
    category: "antibacterial",
    indications: [
      { id: "cdiff_standard", label: "C. difficile standard pathway" },
      { id: "cdiff_fulminant", label: "C. difficile fulminant pathway" },
    ],
    sourcePages: ANTIBACTERIAL_SOURCE,
    calculate: (_patient, context) => {
      const fulminant = context.indicationId === "cdiff_fulminant";
      return {
        regimen: fulminant ? "500 mg PO q6h" : "125 mg PO q6h",
        renalBucket: noRenalAdjustBucket(context.renalMode),
        notes: ["No routine renal adjustment; oral vancomycin has minimal systemic absorption."],
      };
    },
  },
  {
    id: "isoniazid",
    name: "Isoniazid",
    category: "mycobacterial_tb",
    indications: [
      { id: "tb_daily", label: "Active TB daily regimen" },
      { id: "tb_intermittent", label: "Active TB intermittent regimen (3x weekly)" },
    ],
    sourcePages: TB_SOURCE,
    calculate: (patient, context) => {
      const intermittent = context.indicationId === "tb_intermittent";
      const doseMg = intermittent
        ? Math.min(900, mgFromWeight(15, patient.totalBodyWeightKg, 50, 900))
        : Math.min(300, mgFromWeight(5, patient.totalBodyWeightKg, 25, 300));

      return {
        regimen: intermittent
          ? `${doseMg} mg PO three times weekly (max 900 mg)`
          : `${doseMg} mg PO daily (max 300 mg/day)`,
        renalBucket: noRenalAdjustBucket(context.renalMode),
        doseWeight: {
          basis: "tbw",
          kg: patient.totalBodyWeightKg,
        },
        notes: [
          "No routine renal dose reduction in major TB references; in iHD dose after dialysis on HD days.",
          "Add pyridoxine when clinically indicated.",
        ],
      };
    },
  },
  {
    id: "rifampin",
    name: "Rifampin",
    category: "mycobacterial_tb",
    indications: [
      { id: "tb_daily", label: "Active TB daily regimen" },
      { id: "hardware_adjuvant", label: "Staphylococcal hardware adjuvant use" },
    ],
    sourcePages: TB_SOURCE,
    calculate: (_patient, context) => {
      const hardware = context.indicationId === "hardware_adjuvant";

      return {
        regimen: hardware ? "300 mg PO q12h" : "600 mg PO daily",
        renalBucket: noRenalAdjustBucket(context.renalMode),
        notes: [
          "Rifampin is interaction-heavy; always perform full medication reconciliation.",
          "In iHD, dose after dialysis sessions when practical.",
        ],
      };
    },
  },
  {
    id: "ethambutol",
    name: "Ethambutol",
    category: "mycobacterial_tb",
    indications: [
      { id: "tb_standard", label: "Active TB standard regimen" },
      { id: "tb_high_dose_intermittent", label: "High-dose intermittent TB regimen" },
    ],
    sourcePages: TB_SOURCE,
    calculate: (patient, context) => {
      const highDoseIntermittent = context.indicationId === "tb_high_dose_intermittent";
      const mgPerKg = highDoseIntermittent ? 25 : 20;
      const doseWeight = {
        basis: "lbw" as const,
        kg: patient.lbwKg,
      };
      const maxDose = highDoseIntermittent ? 2400 : 1600;
      const doseMg = Math.min(maxDose, mgFromWeight(mgPerKg, doseWeight.kg, 100, maxDose));

      if (context.renalMode === "ihd") {
        return {
          regimen: `${doseMg} mg PO three times weekly post-HD`,
          renalBucket: "Intermittent hemodialysis",
          doseWeight,
          notes: [
            "Template uses lean body weight for obesity dosing.",
            "Use ophthalmologic toxicity monitoring per TB protocol.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: highDoseIntermittent
            ? `${doseMg} mg PO three times weekly`
            : `${doseMg} mg PO q24h`,
          renalBucket: "CRRT",
          doseWeight,
          notes: [
            "CRRT pathway is a teaching template; confirm with TB pharmacy/ID team.",
          ],
        };
      }

      return {
        regimen: highDoseIntermittent
          ? `${doseMg} mg PO three times weekly`
          : `${doseMg} mg PO ${patient.crclMlMin >= 30 ? "daily" : "three times weekly"}`,
        renalBucket: patient.crclMlMin >= 30 ? "CrCl >= 30 mL/min" : "CrCl < 30 mL/min",
        doseWeight,
        notes: [
          "Daily dose aligned to common institutional range (~20 mg/kg; upper ranges up to 24 mg/kg exist).",
          "Renal dysfunction usually requires interval extension for standard regimens.",
        ],
      };
    },
  },
  {
    id: "pyrazinamide",
    name: "Pyrazinamide",
    category: "mycobacterial_tb",
    indications: [
      { id: "tb_standard", label: "Active TB standard regimen" },
      { id: "tb_high_dose_intermittent", label: "High-dose intermittent TB regimen" },
    ],
    sourcePages: TB_SOURCE,
    calculate: (patient, context) => {
      const highDoseIntermittent = context.indicationId === "tb_high_dose_intermittent";
      const mgPerKg = highDoseIntermittent ? 35 : 20;
      const doseWeight = {
        basis: "lbw" as const,
        kg: patient.lbwKg,
      };
      const maxDose = highDoseIntermittent ? 3000 : 2000;
      const doseMg = Math.min(maxDose, mgFromWeight(mgPerKg, doseWeight.kg, 100, maxDose));

      if (context.renalMode === "ihd") {
        return {
          regimen: `${doseMg} mg PO three times weekly post-HD`,
          renalBucket: "Intermittent hemodialysis",
          doseWeight,
          notes: [
            "Dialysis pathway generally uses intermittent post-HD administration.",
            "Monitor liver tests and uric acid when clinically indicated.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: highDoseIntermittent
            ? `${doseMg} mg PO three times weekly`
            : `${doseMg} mg PO q24h`,
          renalBucket: "CRRT",
          doseWeight,
          notes: [
            "CRRT pathway is a template and requires specialist confirmation.",
          ],
        };
      }

      return {
        regimen: highDoseIntermittent
          ? `${doseMg} mg PO three times weekly`
          : `${doseMg} mg PO ${patient.crclMlMin >= 30 ? "daily" : "three times weekly"}`,
        renalBucket: patient.crclMlMin >= 30 ? "CrCl >= 30 mL/min" : "CrCl < 30 mL/min",
        doseWeight,
        notes: [
          "Daily pathway aligned to common institutional range (~20-25 mg/kg).",
          "In renal dysfunction, interval extension is usually preferred.",
        ],
      };
    },
  },
  {
    id: "moxifloxacin_tb",
    name: "Moxifloxacin (TB/NTM)",
    category: "mycobacterial_tb",
    indications: [
      { id: "tb_alt_backbone", label: "TB alternative backbone regimen" },
      { id: "ntm_or_salvage", label: "NTM or salvage regimen component" },
    ],
    sourcePages: TB_SOURCE,
    calculate: (_patient, context) => {
      return {
        regimen: context.indicationId === "ntm_or_salvage" ? "400 mg PO/IV q24h" : "400 mg PO/IV q24h",
        renalBucket: noRenalAdjustBucket(context.renalMode),
        notes: [
          "No routine renal adjustment in major references.",
          "QT interval and drug-interaction review are recommended.",
        ],
      };
    },
  },
  {
    id: "rifabutin",
    name: "Rifabutin",
    category: "mycobacterial_tb",
    indications: [
      { id: "tb_or_ntm_standard", label: "TB/NTM regimen component" },
      { id: "renal_impairment_low_clearance", label: "Low CrCl pathway" },
    ],
    sourcePages: TB_SOURCE,
    calculate: (patient, context) => {
      const lowClearance = context.indicationId === "renal_impairment_low_clearance" || patient.crclMlMin < 30;
      return {
        regimen: lowClearance ? "150 mg PO q24h" : "300 mg PO q24h",
        renalBucket:
          context.renalMode === "standard"
            ? patient.crclMlMin >= 30
              ? "CrCl >= 30 mL/min"
              : "CrCl < 30 mL/min"
            : renalModeLabel(context.renalMode),
        notes: [
          "Major pathway concern is drug-drug interaction burden (CYP induction).",
          "Dialysis-specific data are limited; use specialist confirmation for iHD/CRRT.",
        ],
      };
    },
  },
  {
    id: "caspofungin",
    name: "Caspofungin",
    category: "antifungal",
    indications: [
      { id: "invasive_candidiasis", label: "Invasive candidiasis pathway" },
      { id: "invasive_aspergillosis_salvage", label: "Invasive aspergillosis salvage pathway" },
    ],
    sourcePages: ANTIFUNGAL_SOURCE,
    calculate: (_patient, context) => {
      const aspergillus = context.indicationId === "invasive_aspergillosis_salvage";
      return {
        regimen: aspergillus ? "70 mg IV once, then 50 mg IV q24h" : "70 mg IV once, then 50 mg IV q24h",
        renalBucket: noRenalAdjustBucket(context.renalMode),
        notes: ["No routine renal adjustment in major references."],
      };
    },
  },
  {
    id: "isavuconazole",
    name: "Isavuconazole",
    category: "antifungal",
    indications: [
      { id: "invasive_mold_treatment", label: "Invasive mold treatment" },
      { id: "stepdown_oral", label: "Step-down oral pathway" },
    ],
    sourcePages: ANTIFUNGAL_SOURCE,
    calculate: (_patient, context) => {
      const stepdown = context.indicationId === "stepdown_oral";
      return {
        regimen: stepdown ? "372 mg PO q24h (after loading)" : "372 mg IV/PO q8h x6 doses, then 372 mg IV/PO q24h",
        renalBucket: noRenalAdjustBucket(context.renalMode),
        notes: ["No routine renal adjustment in major references."],
      };
    },
  },
  {
    id: "posaconazole",
    name: "Posaconazole",
    category: "antifungal",
    indications: [
      { id: "mold_prophylaxis", label: "Mold prophylaxis pathway" },
      { id: "invasive_fungal_treatment", label: "Invasive fungal treatment pathway" },
    ],
    sourcePages: ANTIFUNGAL_SOURCE,
    calculate: (_patient, context) => {
      return {
        regimen: "300 mg PO/IV q12h x2 doses, then 300 mg PO/IV q24h",
        renalBucket: noRenalAdjustBucket(context.renalMode),
        notes: [
          "No routine renal dose adjustment in major references.",
          "For IV route in low CrCl, vehicle accumulation concerns may favor oral delayed-release tablets when feasible.",
        ],
      };
    },
  },
  {
    id: "fluconazole",
    name: "Fluconazole",
    category: "antifungal",
    indications: [
      { id: "candidemia_invasive", label: "Candidemia / invasive candidiasis" },
      { id: "mucosal_candidiasis", label: "Mucosal candidiasis" },
    ],
    sourcePages: ANTIFUNGAL_SOURCE,
    calculate: (patient, context) => {
      const invasive = context.indicationId === "candidemia_invasive";

      if (context.renalMode === "ihd") {
        return {
          regimen: invasive
            ? "800 mg PO/IV once, then 400 mg after each HD session"
            : "200 mg PO/IV once, then 100-200 mg after each HD session",
          renalBucket: "Intermittent hemodialysis",
          notes: [
            "Give maintenance dose after dialysis sessions.",
            "For invasive Candida, verify organism susceptibility and source control.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: invasive
            ? "800 mg PO/IV once, then 800-1200 mg/day divided q12-24h"
            : "200 mg PO/IV once, then 200 mg q24h",
          renalBucket: "CRRT",
          notes: [
            "CRRT may clear fluconazole substantially; higher maintenance can be required.",
            "Use local ICU antifungal protocol where available.",
          ],
        };
      }

      if (invasive) {
        return {
          regimen:
            patient.crclMlMin > 50
              ? "800 mg PO/IV once, then 400 mg q24h"
              : "800 mg PO/IV once, then 200 mg q24h",
          renalBucket: patient.crclMlMin > 50 ? "CrCl > 50 mL/min" : "CrCl <= 50 mL/min",
          notes: [
            "Cross-institution references typically reduce maintenance by ~50% when CrCl <=50 mL/min.",
            "Use susceptibility, source control, and species context for final maintenance.",
          ],
        };
      }

      return {
        regimen:
          patient.crclMlMin > 50
            ? "200 mg PO/IV once, then 100 mg q24h"
            : "200 mg PO/IV once, then 50 mg q24h",
        renalBucket: patient.crclMlMin > 50 ? "CrCl > 50 mL/min" : "CrCl <= 50 mL/min",
        notes: [
          "Mucosal pathway is a simplified educational regimen.",
          "Adjust by syndrome severity and treatment duration guidance.",
        ],
      };
    },
  },
  {
    id: "micafungin",
    name: "Micafungin",
    category: "antifungal",
    indications: [
      { id: "candidemia_invasive", label: "Candidemia / invasive candidiasis" },
      { id: "esophageal_candidiasis", label: "Esophageal candidiasis" },
    ],
    sourcePages: ANTIFUNGAL_SOURCE,
    calculate: (_patient, context) => {
      const esophageal = context.indicationId === "esophageal_candidiasis";
      return {
        regimen: esophageal ? "150 mg IV q24h" : "100 mg IV q24h",
        renalBucket: noRenalAdjustBucket(context.renalMode),
        notes: [
          "No routine renal adjustment in major references.",
          "Track hepatic profile and treatment response during therapy.",
        ],
      };
    },
  },
  {
    id: "voriconazole",
    name: "Voriconazole",
    category: "antifungal",
    indications: [
      { id: "invasive_mold_treatment", label: "Invasive mold treatment" },
      { id: "mold_prophylaxis", label: "Mold prophylaxis" },
    ],
    sourcePages: ANTIFUNGAL_SOURCE,
    calculate: (patient, context) => {
      const treatment = context.indicationId === "invasive_mold_treatment";
      const doseWeight = adjustedWeightOver120Ibw(patient);

      if (!treatment) {
        if (patient.bmi >= 30) {
          const prophylaxisMg = mgFromWeight(4, doseWeight.kg, 50);
          return {
            regimen: `${prophylaxisMg} mg IV/PO q12h (4 mg/kg AdjBW obesity pathway)`,
            renalBucket: noRenalAdjustBucket(context.renalMode),
            doseWeight,
            notes: [
              "Obesity prophylaxis pathway (BMI >=30) uses weight-based dosing: 4 mg/kg q12h with adjusted body weight.",
              "No routine renal dose adjustment in major references.",
              "For prolonged therapy with CrCl <50 mL/min, oral route is commonly preferred over IV due to SBECD vehicle exposure.",
            ],
          };
        }

        return {
          regimen: "200 mg PO/IV q12h",
          renalBucket: noRenalAdjustBucket(context.renalMode),
          notes: [
            "Non-obesity prophylaxis pathway: fixed 200 mg q12h.",
            "No routine renal dose adjustment in major references.",
            "For prolonged therapy with CrCl <50 mL/min, oral route is commonly preferred over IV due to SBECD vehicle exposure.",
          ],
        };
      }

      const loadMg = mgFromWeight(6, doseWeight.kg, 50);
      const maintMg = mgFromWeight(4, doseWeight.kg, 50);
      return {
        regimen: `${loadMg} mg IV q12h x2 doses, then ${maintMg} mg IV/PO q12h`,
        renalBucket: noRenalAdjustBucket(context.renalMode),
        doseWeight,
        notes: [
          "Weight-based pathway uses AdjBW when TBW >120% of IBW.",
          "Therapeutic drug monitoring is recommended when available.",
        ],
      };
    },
  },
  {
    id: "liposomal_amphotericin_b",
    name: "Liposomal Amphotericin B",
    category: "antifungal",
    indications: [
      { id: "invasive_mold_or_severe_yeast", label: "Invasive mold / severe yeast infection" },
      { id: "cryptococcal_cns_induction", label: "Cryptococcal CNS induction pathway" },
    ],
    sourcePages: ANTIFUNGAL_SOURCE,
    calculate: (patient, context) => {
      const cns = context.indicationId === "cryptococcal_cns_induction";
      const doseWeight = adjustedWeightOver120Ibw(patient);
      const mgPerKg = cns ? 4 : 5;
      const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 50);

      return {
        regimen: `${doseMg} mg IV q24h (${mgPerKg} mg/kg)`,
        renalBucket: noRenalAdjustBucket(context.renalMode),
        doseWeight,
        notes: [
          "No routine renal dose adjustment; nephrotoxicity risk remains significant.",
          "Monitor creatinine, potassium, and magnesium frequently during therapy.",
        ],
      };
    },
  },
  {
    id: "foscarnet",
    name: "Foscarnet",
    category: "antiviral",
    indications: [
      { id: "cmv_disease_induction", label: "CMV disease induction pathway" },
      { id: "acyclovir_resistant_hsv", label: "Acyclovir-resistant HSV pathway" },
    ],
    sourcePages: ANTIVIRAL_SOURCE,
    calculate: (patient, context) => {
      const cmvInduction = context.indicationId === "cmv_disease_induction";
      const doseWeight = adjustedWeightOver120Ibw(patient);
      const adjustedCrcl = foscarnetAdjustedCrclMlMinPerKg(patient);

      const renalBand =
        adjustedCrcl > 1.4
          ? "> 1.4 mL/min/kg"
          : adjustedCrcl > 1.0
          ? "1.0-1.4 mL/min/kg"
          : adjustedCrcl > 0.8
          ? "0.8-1.0 mL/min/kg"
          : adjustedCrcl > 0.6
          ? "0.6-0.8 mL/min/kg"
          : adjustedCrcl > 0.5
          ? "0.5-0.6 mL/min/kg"
          : adjustedCrcl >= 0.4
          ? "0.4-0.5 mL/min/kg"
          : "< 0.4 mL/min/kg";

      const adjustedCrclLabel = `Adjusted CrCl ${adjustedCrcl.toFixed(2)} mL/min/kg (${renalBand})`;

      if (context.renalMode === "ihd") {
        const mgPerKg = cmvInduction ? 60 : 45;
        const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 500);
        return {
          regimen: `${doseMg} mg IV post-HD (${mgPerKg} mg/kg; level/clinical-guided redosing)`,
          renalBucket: "Intermittent hemodialysis",
          doseWeight,
          notes: [
            "Dialysis pathway should be individualized with specialist support.",
            "Adjusted CrCl formula is used for non-dialysis pathways; HD uses post-dialysis dosing templates.",
            "Aggressive hydration and electrolyte monitoring are required.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen:
            "No standardized CRRT foscarnet dose in major references. Use an individualized protocol with ID/pharmacy support.",
          renalBucket: "CRRT",
          doseWeight,
          notes: [
            "CRRT foscarnet pathways vary substantially by modality and effluent rate.",
            "Monitor creatinine, calcium, magnesium, phosphate, and potassium closely.",
          ],
        };
      }

      if (adjustedCrcl < 0.4) {
        return {
          regimen: "Not recommended at adjusted CrCl < 0.4 mL/min/kg without specialist-guided individualized dosing",
          renalBucket: adjustedCrclLabel,
          doseWeight,
          notes: [
            "Adjusted CrCl (mL/min/kg) = ((140 - age) x sex factor) / (72 x SCr), with sex factor 0.85 for females.",
            "For obesity, dosing weight is TBW unless TBW >120% of IBW, then AdjBW.",
            "Aggressive hydration and electrolyte repletion are mandatory when foscarnet is used.",
          ],
        };
      }

      if (cmvInduction) {
        let mgPerKg = 50;
        let interval = "q24h";
        if (adjustedCrcl > 1.4) {
          mgPerKg = 90;
          interval = "q12h";
        } else if (adjustedCrcl > 1.0) {
          mgPerKg = 70;
          interval = "q12h";
        } else if (adjustedCrcl > 0.8) {
          mgPerKg = 50;
          interval = "q12h";
        } else if (adjustedCrcl > 0.6) {
          mgPerKg = 80;
          interval = "q24h";
        } else if (adjustedCrcl > 0.5) {
          mgPerKg = 60;
          interval = "q24h";
        }

        const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 500);
        return {
          regimen: `${doseMg} mg IV ${interval} (${mgPerKg} mg/kg)`,
          renalBucket: adjustedCrclLabel,
          doseWeight,
          notes: [
            "Adjusted CrCl (mL/min/kg) = ((140 - age) x sex factor) / (72 x SCr), with sex factor 0.85 for females.",
            "For obesity, dosing weight is TBW unless TBW >120% of IBW, then AdjBW.",
            "Hydration and electrolyte repletion are mandatory during therapy.",
          ],
        };
      }

      let mgPerKg = 35;
      let interval = "q24h";
      if (adjustedCrcl > 1.4) {
        mgPerKg = 40;
        interval = "q8h";
      } else if (adjustedCrcl > 1.0) {
        mgPerKg = 30;
        interval = "q8h";
      } else if (adjustedCrcl > 0.8) {
        mgPerKg = 35;
        interval = "q12h";
      } else if (adjustedCrcl > 0.6) {
        mgPerKg = 25;
        interval = "q12h";
      } else if (adjustedCrcl > 0.5) {
        mgPerKg = 40;
        interval = "q24h";
      }
      const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 500);
      return {
        regimen: `${doseMg} mg IV ${interval} (${mgPerKg} mg/kg)`,
        renalBucket: adjustedCrclLabel,
        doseWeight,
        notes: [
          "Adjusted CrCl (mL/min/kg) = ((140 - age) x sex factor) / (72 x SCr), with sex factor 0.85 for females.",
          "For obesity, dosing weight is TBW unless TBW >120% of IBW, then AdjBW.",
          "Monitor renal function and electrolytes frequently throughout treatment.",
        ],
      };
    },
  },
  {
    id: "famciclovir",
    name: "Famciclovir",
    category: "antiviral",
    indications: [
      { id: "herpes_zoster", label: "Herpes zoster pathway" },
      { id: "recurrent_genital_hsv", label: "Recurrent genital HSV (1-day episodic therapy)" },
      { id: "hsv_suppression", label: "Chronic HSV suppression pathway" },
    ],
    sourcePages: ANTIVIRAL_SOURCE,
    calculate: (patient, context) => {
      const indication = context.indicationId;

      if (context.renalMode === "ihd") {
        if (indication === "herpes_zoster") {
          return {
            regimen: "250 mg PO after each hemodialysis session",
            renalBucket: "Intermittent hemodialysis",
            notes: [
              "Hemodialysis pathway is directly from FDA/DailyMed renal dosing table.",
              "Initiate at first sign of symptoms for maximal benefit.",
            ],
          };
        }
        if (indication === "recurrent_genital_hsv") {
          return {
            regimen: "250 mg PO single dose following dialysis",
            renalBucket: "Intermittent hemodialysis",
            notes: [
              "Single-day episodic pathway is from FDA/DailyMed renal dosing table.",
              "Start at prodrome or earliest lesion onset.",
            ],
          };
        }
        return {
          regimen: "125 mg PO following each dialysis",
          renalBucket: "Intermittent hemodialysis",
          notes: [
            "Suppressive pathway is from FDA/DailyMed renal dosing table.",
            "Dose reductions are required to reduce renal toxicity risk.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen:
            "No standardized CRRT famciclovir regimen in major references; use specialist-guided individualized dosing",
          renalBucket: "CRRT",
          notes: [
            "Published dose tables specify CrCl- and HD-based adjustments, with limited CRRT-specific data.",
            "Review antiviral strategy with ID/pharmacy and monitor renal function closely.",
          ],
        };
      }

      if (indication === "herpes_zoster") {
        if (patient.crclMlMin >= 60) {
          return {
            regimen: "500 mg PO q8h for 7 days",
            renalBucket: "CrCl >= 60 mL/min",
            notes: ["FDA/DailyMed adult renal table pathway."],
          };
        }
        if (patient.crclMlMin >= 40) {
          return {
            regimen: "500 mg PO q12h for 7 days",
            renalBucket: "CrCl 40-59 mL/min",
            notes: ["FDA/DailyMed adult renal table pathway."],
          };
        }
        if (patient.crclMlMin >= 20) {
          return {
            regimen: "500 mg PO q24h for 7 days",
            renalBucket: "CrCl 20-39 mL/min",
            notes: ["FDA/DailyMed adult renal table pathway."],
          };
        }
        return {
          regimen: "250 mg PO q24h for 7 days",
          renalBucket: "CrCl < 20 mL/min",
          notes: ["FDA/DailyMed adult renal table pathway."],
        };
      }

      if (indication === "recurrent_genital_hsv") {
        if (patient.crclMlMin >= 60) {
          return {
            regimen: "1000 mg PO q12h for 1 day (2 doses total)",
            renalBucket: "CrCl >= 60 mL/min",
            notes: ["FDA/DailyMed adult renal table pathway."],
          };
        }
        if (patient.crclMlMin >= 40) {
          return {
            regimen: "500 mg PO q12h for 1 day (2 doses total)",
            renalBucket: "CrCl 40-59 mL/min",
            notes: ["FDA/DailyMed adult renal table pathway."],
          };
        }
        if (patient.crclMlMin >= 20) {
          return {
            regimen: "500 mg PO single dose",
            renalBucket: "CrCl 20-39 mL/min",
            notes: ["FDA/DailyMed adult renal table pathway."],
          };
        }
        return {
          regimen: "250 mg PO single dose",
          renalBucket: "CrCl < 20 mL/min",
          notes: ["FDA/DailyMed adult renal table pathway."],
        };
      }

      if (patient.crclMlMin >= 40) {
        return {
          regimen: "250 mg PO q12h",
          renalBucket: "CrCl >= 40 mL/min",
          notes: ["FDA/DailyMed suppressive-therapy renal table pathway."],
        };
      }
      if (patient.crclMlMin >= 20) {
        return {
          regimen: "125 mg PO q12h",
          renalBucket: "CrCl 20-39 mL/min",
          notes: ["FDA/DailyMed suppressive-therapy renal table pathway."],
        };
      }
      return {
        regimen: "125 mg PO q24h",
        renalBucket: "CrCl < 20 mL/min",
        notes: ["FDA/DailyMed suppressive-therapy renal table pathway."],
      };
    },
  },
  {
    id: "acyclovir_po",
    name: "Acyclovir PO",
    category: "antiviral",
    indications: [
      { id: "mucocutaneous_hsv", label: "Mucocutaneous HSV pathway" },
      { id: "zoster_or_severe_hsv", label: "Zoster/severe HSV pathway" },
    ],
    sourcePages: ANTIVIRAL_SOURCE,
    calculate: (patient, context) => {
      const zoster = context.indicationId === "zoster_or_severe_hsv";

      if (context.renalMode === "ihd") {
        return {
          regimen: zoster ? "800 mg PO q12h (after HD on dialysis days)" : "200 mg PO q12h (after HD on dialysis days)",
          renalBucket: "Intermittent hemodialysis",
          notes: ["Dialysis-day administration should be timed after HD."],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: zoster ? "800 mg PO q8h" : "400 mg PO q8h",
          renalBucket: "CRRT",
          notes: ["CRRT pathway is an educational template and may vary by modality."],
        };
      }

      if (zoster) {
        return {
          regimen:
            patient.crclMlMin > 25
              ? "800 mg PO five times daily (q4h while awake)"
              : patient.crclMlMin >= 10
              ? "800 mg PO q8h"
              : "800 mg PO q12h",
          renalBucket:
            patient.crclMlMin > 25
              ? "CrCl > 25 mL/min"
              : patient.crclMlMin >= 10
              ? "CrCl 10-25 mL/min"
              : "CrCl < 10 mL/min",
          notes: ["High-frequency oral pathway should be matched to indication and tolerability."],
        };
      }

      return {
        regimen:
          patient.crclMlMin > 25
            ? "400 mg PO q8h"
            : patient.crclMlMin >= 10
            ? "200 mg PO q8h"
            : "200 mg PO q12h",
        renalBucket:
          patient.crclMlMin > 25
            ? "CrCl > 25 mL/min"
            : patient.crclMlMin >= 10
            ? "CrCl 10-25 mL/min"
            : "CrCl < 10 mL/min",
        notes: ["Renal interval extension follows common oral acyclovir reference pathways."],
      };
    },
  },
  {
    id: "acyclovir_iv",
    name: "Acyclovir IV",
    category: "antiviral",
    indications: [
      { id: "severe_hsv_vzv", label: "Severe HSV/VZV (non-CNS)" },
      { id: "hsv_encephalitis_or_disseminated", label: "HSV encephalitis / disseminated VZV" },
    ],
    sourcePages: ANTIVIRAL_SOURCE,
    calculate: (patient, context) => {
      const highDose = context.indicationId === "hsv_encephalitis_or_disseminated";
      const doseWeight = obesityAdjustedWeight(patient);

      if (context.renalMode === "ihd") {
        const mgPerKg = highDose ? 10 : 5;
        const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 50);

        return {
          regimen: `${doseMg} mg IV qPM (give after HD on dialysis days)`,
          renalBucket: "Intermittent hemodialysis",
          doseWeight,
          notes: [
            "Ensure aggressive hydration and renal monitoring.",
            "Dialysis pathway is a template; verify local protocol.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        const mgPerKg = highDose ? 10 : 5;
        const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 50);

        return {
          regimen: `${doseMg} mg IV q12h (${mgPerKg} mg/kg)`,
          renalBucket: "CRRT",
          doseWeight,
          notes: [
            "CRRT acyclovir regimens vary by modality and clearance intensity.",
            "Track renal function trends daily while on therapy.",
          ],
        };
      }

      if (highDose) {
        const mgPerKg = patient.crclMlMin >= 10 ? 10 : 5;
        const interval =
          patient.crclMlMin > 50
            ? "q8h"
            : patient.crclMlMin > 25
            ? "q12h"
            : "q24h";
        const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 50);

        return {
          regimen: `${doseMg} mg IV ${interval} (${mgPerKg} mg/kg)`,
          renalBucket:
            patient.crclMlMin > 50
              ? "CrCl > 50 mL/min"
              : patient.crclMlMin > 25
              ? "CrCl 26-50 mL/min"
              : patient.crclMlMin >= 10
              ? "CrCl 10-25 mL/min"
              : "CrCl < 10 mL/min",
          doseWeight,
          notes: [
            "For CrCl <10, this simplified pathway drops to 5 mg/kg q24h.",
            "Consider therapeutic drug monitoring where available for prolonged therapy.",
          ],
        };
      }

      const mgPerKg = patient.crclMlMin >= 10 ? 5 : 2.5;
      const interval =
        patient.crclMlMin > 50
          ? "q8h"
          : patient.crclMlMin > 25
          ? "q12h"
          : "q24h";
      const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 50);

      return {
        regimen: `${doseMg} mg IV ${interval} (${mgPerKg} mg/kg)`,
        renalBucket:
          patient.crclMlMin > 50
            ? "CrCl > 50 mL/min"
            : patient.crclMlMin > 25
            ? "CrCl 26-50 mL/min"
            : patient.crclMlMin >= 10
            ? "CrCl 10-25 mL/min"
            : "CrCl < 10 mL/min",
        doseWeight,
        notes: [
          "This tool uses AdjBW when BMI >=30; otherwise TBW for acyclovir dosing weight.",
          "Hydration and nephrotoxicity monitoring remain essential.",
        ],
      };
    },
  },
  {
    id: "valacyclovir",
    name: "Valacyclovir",
    category: "antiviral",
    indications: [
      { id: "hsv_vzv_treatment", label: "HSV/VZV treatment pathway" },
      { id: "hsv_suppression", label: "HSV suppression pathway" },
    ],
    sourcePages: ANTIVIRAL_SOURCE,
    calculate: (patient, context) => {
      const suppression = context.indicationId === "hsv_suppression";

      if (context.renalMode === "ihd") {
        return {
          regimen: suppression ? "500 mg PO after HD (three times weekly)" : "500 mg PO q24h (after HD on dialysis days)",
          renalBucket: "Intermittent hemodialysis",
          notes: ["Dialysis-day administration should be timed after HD."],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: suppression ? "500 mg PO q24h" : "500 mg PO q8h",
          renalBucket: "CRRT",
          notes: ["CRRT pathway is an educational template and may vary by modality."],
        };
      }

      if (suppression) {
        return {
          regimen:
            patient.crclMlMin > 30
              ? "500 mg PO q24h"
              : patient.crclMlMin > 10
              ? "500 mg PO q48h"
              : "500 mg PO every 72h",
          renalBucket:
            patient.crclMlMin > 30
              ? "CrCl > 30 mL/min"
              : patient.crclMlMin > 10
              ? "CrCl 11-30 mL/min"
              : "CrCl <= 10 mL/min",
          notes: ["Suppressive dosing should be individualized to recurrence burden and clinical context."],
        };
      }

      if (patient.crclMlMin > 50) {
        return {
          regimen: "1 g PO q8h",
          renalBucket: "CrCl > 50 mL/min",
          notes: ["Standard treatment pathway for preserved renal function."],
        };
      }
      if (patient.crclMlMin > 30) {
        return {
          regimen: "1 g PO q12h",
          renalBucket: "CrCl 31-50 mL/min",
          notes: ["Renal-adjusted treatment pathway."],
        };
      }
      if (patient.crclMlMin > 10) {
        return {
          regimen: "1 g PO q24h",
          renalBucket: "CrCl 11-30 mL/min",
          notes: ["Renal-adjusted treatment pathway."],
        };
      }
      return {
        regimen: "500 mg PO q24h",
        renalBucket: "CrCl <= 10 mL/min",
        notes: ["Very low CrCl pathway should be confirmed with local protocol."],
      };
    },
  },
  {
    id: "ganciclovir_iv",
    name: "Ganciclovir IV",
    category: "antiviral",
    indications: [
      { id: "cmv_treatment", label: "CMV treatment" },
      { id: "cmv_prophylaxis", label: "CMV prophylaxis" },
    ],
    sourcePages: ANTIVIRAL_SOURCE,
    calculate: (patient, context) => {
      const treatment = context.indicationId === "cmv_treatment";
      const doseWeight = adjustedWeightOver120Ibw(patient);

      if (context.renalMode === "ihd") {
        const mgPerKg = treatment ? 1.25 : 0.625;
        const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 25);
        return {
          regimen: `${doseMg} mg IV x1 now and after HD sessions (${mgPerKg} mg/kg)`,
          renalBucket: "Intermittent hemodialysis",
          doseWeight,
          notes: [
            "Dose displayed as IV ganciclovir total mg.",
            "CBC and renal monitoring are required during therapy.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        const mgPerKg = treatment ? 2.5 : 2.5;
        const interval = treatment ? "q12h" : "q24h";
        const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 25);
        return {
          regimen: `${doseMg} mg IV ${interval} (${mgPerKg} mg/kg)`,
          renalBucket: "CRRT",
          doseWeight,
          notes: [
            "CRRT pathway is an educational reference and may vary by modality.",
            "Track marrow suppression risk with serial CBC.",
          ],
        };
      }

      if (treatment) {
        let mgPerKg = 1.25;
        let interval = "q24h";
        if (patient.crclMlMin > 70) {
          mgPerKg = 5;
          interval = "q12h";
        } else if (patient.crclMlMin > 50) {
          mgPerKg = 2.5;
          interval = "q12h";
        } else if (patient.crclMlMin > 25) {
          mgPerKg = 2.5;
          interval = "q24h";
        }
        const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 25);
        return {
          regimen: `${doseMg} mg IV ${interval} (${mgPerKg} mg/kg)`,
          renalBucket:
            patient.crclMlMin > 70
              ? "CrCl > 70 mL/min"
              : patient.crclMlMin > 50
              ? "CrCl 51-70 mL/min"
              : patient.crclMlMin > 25
              ? "CrCl 26-50 mL/min"
              : "CrCl <= 25 mL/min",
          doseWeight,
          notes: [
            "Weight-based pathway uses AdjBW when TBW >120% of IBW.",
            "Therapy should be guided by virologic context and toxicity monitoring.",
          ],
        };
      }

      let mgPerKg = 0.625;
      if (patient.crclMlMin > 70) mgPerKg = 5;
      else if (patient.crclMlMin > 50) mgPerKg = 2.5;
      else if (patient.crclMlMin > 25) mgPerKg = 1.25;
      else if (patient.crclMlMin > 10) mgPerKg = 0.625;
      const doseMg = mgFromWeight(mgPerKg, doseWeight.kg, 25);

      return {
        regimen: `${doseMg} mg IV q24h (${mgPerKg} mg/kg)`,
        renalBucket:
          patient.crclMlMin > 70
            ? "CrCl > 70 mL/min"
            : patient.crclMlMin > 50
            ? "CrCl 51-70 mL/min"
            : patient.crclMlMin > 25
            ? "CrCl 26-50 mL/min"
            : patient.crclMlMin > 10
            ? "CrCl 11-25 mL/min"
            : "CrCl <= 10 mL/min",
        doseWeight,
        notes: [
          "Prophylaxis pathway uses simplified once-daily maintenance.",
          "CBC and renal function monitoring remain required.",
        ],
      };
    },
  },
  {
    id: "valganciclovir",
    name: "Valganciclovir",
    category: "antiviral",
    indications: [
      { id: "cmv_treatment", label: "CMV treatment" },
      { id: "cmv_prophylaxis", label: "CMV prophylaxis" },
    ],
    sourcePages: ANTIVIRAL_SOURCE,
    calculate: (patient, context) => {
      const treatment = context.indicationId === "cmv_treatment";

      if (context.renalMode === "ihd") {
        return {
          regimen: treatment ? "450 mg PO post-HD" : "450 mg PO twice weekly post-HD",
          renalBucket: "Intermittent hemodialysis",
          notes: [
            "Administer with food when feasible.",
            "For unstable renal function, IV ganciclovir may be preferred.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: treatment ? "450 mg PO q24h" : "450 mg PO q48h",
          renalBucket: "CRRT",
          notes: [
            "CRRT pathway is a simplified teaching regimen.",
            "Use CBC and renal trend monitoring throughout therapy.",
          ],
        };
      }

      if (treatment) {
        if (patient.crclMlMin > 60) {
          return {
            regimen: "900 mg PO q12h",
            renalBucket: "CrCl > 60 mL/min",
            notes: ["Standard treatment pathway in adults with preserved renal function."],
          };
        }
        if (patient.crclMlMin > 40) {
          return {
            regimen: "450 mg PO q12h",
            renalBucket: "CrCl 41-60 mL/min",
            notes: ["Renal-adjusted treatment pathway."],
          };
        }
        if (patient.crclMlMin > 25) {
          return {
            regimen: "450 mg PO q24h",
            renalBucket: "CrCl 26-40 mL/min",
            notes: ["Renal-adjusted treatment pathway."],
          };
        }
        if (patient.crclMlMin > 10) {
          return {
            regimen: "450 mg PO q48h",
            renalBucket: "CrCl 11-25 mL/min",
            notes: ["Consider IV ganciclovir if rapid control is needed."],
          };
        }
        return {
          regimen: "Insufficient oral data for CrCl <= 10 mL/min; use IV ganciclovir specialist pathway",
          renalBucket: "CrCl <= 10 mL/min",
          notes: ["Very low renal function generally requires individualized IV dosing."],
        };
      }

      if (patient.crclMlMin > 60) {
        return {
          regimen: "900 mg PO q24h",
          renalBucket: "CrCl > 60 mL/min",
          notes: ["Standard prophylaxis pathway in adults with preserved renal function."],
        };
      }
      if (patient.crclMlMin > 40) {
        return {
          regimen: "450 mg PO q24h",
          renalBucket: "CrCl 41-60 mL/min",
          notes: ["Renal-adjusted prophylaxis pathway."],
        };
      }
      if (patient.crclMlMin > 25) {
        return {
          regimen: "450 mg PO q48h",
          renalBucket: "CrCl 26-40 mL/min",
          notes: ["Renal-adjusted prophylaxis pathway."],
        };
      }
      if (patient.crclMlMin > 10) {
        return {
          regimen: "450 mg PO twice weekly",
          renalBucket: "CrCl 11-25 mL/min",
          notes: ["Low-CrCl prophylaxis pathway should include close CBC follow-up."],
        };
      }
      return {
        regimen: "Insufficient oral data for CrCl <= 10 mL/min; use IV ganciclovir specialist pathway",
        renalBucket: "CrCl <= 10 mL/min",
        notes: ["Very low renal function generally requires individualized IV dosing."],
      };
    },
  },
  {
    id: "oseltamivir",
    name: "Oseltamivir",
    category: "antiviral",
    indications: [
      { id: "influenza_treatment", label: "Influenza treatment" },
      { id: "influenza_prophylaxis", label: "Influenza prophylaxis" },
    ],
    sourcePages: ANTIVIRAL_SOURCE,
    calculate: (patient, context) => {
      const prophylaxis = context.indicationId === "influenza_prophylaxis";

      if (context.renalMode === "ihd") {
        return {
          regimen: prophylaxis ? "30 mg PO once weekly post-HD" : "30 mg PO x1 now, then 30 mg PO after each HD",
          renalBucket: "Intermittent hemodialysis",
          notes: [
            "Start treatment as early as possible after symptom onset when clinically indicated.",
            "Post-HD dosing is standard for iHD pathways.",
          ],
        };
      }

      if (context.renalMode === "crrt") {
        return {
          regimen: prophylaxis ? "30 mg PO q24h" : "75 mg PO q12h",
          renalBucket: "CRRT",
          notes: [
            "CRRT pathway is a simplified educational template.",
            "Adjust to local virology and critical-care protocol when applicable.",
          ],
        };
      }

      if (prophylaxis) {
        return {
          regimen:
            patient.crclMlMin > 60
              ? "75 mg PO q24h"
              : patient.crclMlMin > 30
              ? "30 mg PO q24h"
              : patient.crclMlMin > 10
              ? "30 mg PO every other day"
              : "Not routinely recommended for CrCl <= 10 mL/min without specialist guidance",
          renalBucket:
            patient.crclMlMin > 60
              ? "CrCl > 60 mL/min"
              : patient.crclMlMin > 30
              ? "CrCl 31-60 mL/min"
              : patient.crclMlMin > 10
              ? "CrCl 11-30 mL/min"
              : "CrCl <= 10 mL/min",
          notes: [
            "Prophylaxis should be coordinated with current outbreak and exposure context.",
            "Use local public-health recommendations for duration.",
          ],
        };
      }

      return {
        regimen:
          patient.crclMlMin > 60
            ? "75 mg PO q12h"
            : patient.crclMlMin > 30
            ? "30 mg PO q12h"
            : patient.crclMlMin > 10
            ? "30 mg PO q24h"
            : "Not routinely recommended for CrCl <= 10 mL/min without specialist guidance",
        renalBucket:
          patient.crclMlMin > 60
            ? "CrCl > 60 mL/min"
            : patient.crclMlMin > 30
            ? "CrCl 31-60 mL/min"
            : patient.crclMlMin > 10
            ? "CrCl 11-30 mL/min"
            : "CrCl <= 10 mL/min",
        notes: [
          "Treatment efficacy is greatest when started early in illness.",
          "Clinical severity and local resistance trends should guide final antiviral plan.",
        ],
      };
    },
  },
];

export const DOSEID_CATEGORY_LABELS: Record<MedicationCategory, string> = {
  antibacterial: "Antibacterial",
  mycobacterial_tb: "Mycobacterial / TB",
  antifungal: "Antifungal",
  antiviral: "Antiviral",
};

export function medsForCategory(category: MedicationCategory) {
  return DOSEID_MEDICATIONS.filter((med) => med.category === category);
}

export function weightBasisLabel(basis: WeightBasis): string {
  if (basis === "tbw") return "Total body weight";
  if (basis === "ibw") return "Ideal body weight";
  if (basis === "adjbw") return "Adjusted body weight";
  return "Lean body weight";
}
