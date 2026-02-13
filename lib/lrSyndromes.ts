// lib/lrSyndromes.ts
import type { SyndromeLRModule } from "./lrTypes";

/**
 * NOTE:
 * - LR values below are starter placeholders to get the UX + architecture right.
 * - Replace with your curated evidence (and add `source` / `notes`) before clinical use.
 */

export const CAP_MODULE: SyndromeLRModule = {
  id: "cap",
  name: "CAP",
  description:
    "Community-acquired pneumonia probability update using symptoms/vitals/exam + simplified CXR and labs. Starter LRs—replace with curated evidence.",
  pretestPresets: [
    { id: "pc_adult", label: "Primary Care", p: 0.05 },
    { id: "ed_adult", label: "Emergency Department", p: 0.10 },
  ],
  items: [
    // -------------------------
    // Symptoms
    // -------------------------
    { id: "cap_cough", label: "Cough", category: "symptom", lrPos: 1.2 },
    {
      id: "cap_purp_sputum",
      label: "Purulent sputum",
      category: "symptom",
      lrPos: 1.3,
      notes: "Often non-specific.",
    },
    { id: "cap_pleuritic", label: "Pleuritic chest pain", category: "symptom", lrPos: 1.7 },
    { id: "cap_dyspnea", label: "Dyspnea", category: "symptom", lrPos: 1.5 },

    // -------------------------
    // Vitals
    // -------------------------
    { id: "cap_fever", label: "Fever (≥38°C)", category: "vital", lrPos: 2.0, lrNeg: 0.7 },
    { id: "cap_rr", label: "Tachypnea (RR ≥ 24)", category: "vital", lrPos: 2.5, lrNeg: 0.5 },
    { id: "cap_hr", label: "Tachycardia (HR > 100)", category: "vital", lrPos: 1.5, lrNeg: 0.8 },
    { id: "cap_hypox", label: "O2 sat < 95%", category: "vital", lrPos: 2.3, lrNeg: 0.6 },

    // -------------------------
    // Exam
    // -------------------------
    { id: "cap_crackles", label: "Crackles/rales", category: "exam", lrPos: 2.0, lrNeg: 0.7 },
    { id: "cap_focal", label: "Focal decreased breath sounds", category: "exam", lrPos: 2.0, lrNeg: 0.8 },

    // -------------------------
    // Imaging (simplified, mutually exclusive)
    // - One CXR item that can be Present/Absent
    // - Plus “No CXR performed” (neutral)
    // -------------------------
    {
      id: "cap_cxr_consolidation",
      label: "CXR: lobar or multilobar consolidation/infiltrate",
      category: "imaging",
      group: "cap_cxr",
      lrPos: 8.0,
      lrNeg: 0.25,
      notes: "If CXR done, mark Present/Absent. If not done, choose “CXR not done”.",
    },
    {
      id: "cap_cxr_not_done",
      label: "CXR not done",
      category: "imaging",
      group: "cap_cxr",
      notes: "Neutral (does not change probability).",
      // No lrPos/lrNeg => should behave like LR=1 (neutral) in your combinedLR()
      // If your engine requires explicit neutral, set lrPos: 1, lrNeg: 1
    },

    // -------------------------
    // Labs (simplified)
    // WBC is generally nonspecific and only adds limited diagnostic value vs symptoms/signs/CXR. :contentReference[oaicite:2]{index=2}
    // Keep ONE threshold to avoid false precision.
    // -------------------------
    {
      id: "cap_wbc_ge15",
      label: "WBC ≥ 15,000",
      category: "lab",
      lrPos: 1.6,
      lrNeg: 0.9,
      notes: "Weak diagnostic modifier; more useful for severity than diagnosis in many contexts.",
    },
    {
      id: "cap_procal_high",
      label: "Procalcitonin elevated",
      category: "lab",
      lrPos: 1.8,
      lrNeg: 0.7,
      notes: "Assay-dependent; interpret with clinical context.",
    },

    // -------------------------
    // Host factors (optional)
    // These are not “classic diagnostic tests”; consider later modeling as pretest modifiers instead.
    // Keep LRs small to avoid over-weighting.
    // -------------------------
    { id: "cap_age_ge65", label: "Age ≥ 65", category: "host", lrPos: 1.15},
    { id: "cap_copd", label: "COPD", category: "host", lrPos: 1.15 },
    { id: "cap_hf", label: "Heart failure", category: "host", lrPos: 1.10 },
    { id: "cap_ckd", label: "Chronic kidney disease", category: "host", lrPos: 1.10 },
    { id: "cap_dm", label: "Diabetes", category: "host", lrPos: 1.05 },
  ],
};


export const CDI_MODULE: SyndromeLRModule = {
  id: "cdi",
  name: "C. difficile",
  description:
    "C. difficile infection probability update using diarrhea features + host/exposure risk + simplified NAAT→toxin testing. Starter LRs—replace with curated evidence.",
  pretestPresets: [
    { id: "outpt_low", label: "Outpatient", p: 0.02 },
    { id: "inpt", label: "Inpatient diarrhea after day 3", p: 0.15 },
  ],
  items: [
    // -------------------------
    // Symptoms / features
    // -------------------------
    { id: "cdi_freq", label: "≥3 unformed stools / 24h", category: "symptom", lrPos: 1.6 },
    { id: "cdi_watery", label: "Watery diarrhea", category: "symptom", lrPos: 1.4 },
    { id: "cdi_abd_pain", label: "Abdominal pain/cramping", category: "symptom", lrPos: 1.3 },
    { id: "cdi_fever", label: "Fever (≥38°C)", category: "vital", lrPos: 1.3, lrNeg: 0.9 },
    {
      id: "cdi_blood",
      label: "Gross blood in stool",
      category: "symptom",
      lrPos: 0.6,
      lrNeg: 1.0,
      notes: "Often suggests alternative dx (e.g., IBD flare, ischemia, invasive bacterial diarrhea).",
    },

    // -------------------------
    // Host / exposure (baseline risk drivers)
    // Keep modest so tests remain main drivers.
    // -------------------------
    { id: "cdi_abx", label: "Antibiotics in prior 8–12 weeks", category: "host", lrPos: 2.0, lrNeg: 0.7 },
    { id: "cdi_healthcare", label: "Recent hospitalization/healthcare exposure", category: "host", lrPos: 1.8, lrNeg: 0.8 },
    { id: "cdi_ppi", label: "PPI use", category: "host", lrPos: 1.2, lrNeg: 0.95 },
    { id: "cdi_prev", label: "Prior CDI", category: "host", lrPos: 2.5, lrNeg: 0.8 },
    { id: "cdi_age_ge65", label: "Age ≥ 65", category: "host", lrPos: 1.3, lrNeg: 0.9 },
    { id: "cdi_immuno", label: "Immunocompromised", category: "host", lrPos: 1.3, lrNeg: 0.9 },
    { id: "cdi_ibd", label: "Inflammatory bowel disease", category: "host", lrPos: 1.3, lrNeg: 0.9 },

    // -------------------------
    // Severity-ish labs (optional; weak diagnostic modifiers)
    // -------------------------
    {
      id: "cdi_wbc15",
      label: "WBC ≥ 15k",
      category: "lab",
      lrPos: 1.4,
      lrNeg: 0.9,
      notes: "More severity-associated than diagnostic.",
    },
    {
      id: "cdi_cr",
      label: "Creatinine rise",
      category: "lab",
      lrPos: 1.2,
      lrNeg: 0.95,
      notes: "More severity-associated than diagnostic.",
    },

    // -------------------------
    // Testing (SIMPLIFIED NAAT → toxin)
    // Single mutually-exclusive group to avoid double counting.
    // -------------------------
    { id: "cdi_test_na", label: "Stool testing not done/unknown", category: "micro", group: "cdi_test" },

    { id: "cdi_naat_neg", label: "NAAT/PCR: negative", category: "micro", lrNeg: 0.10, group: "cdi_test" },

    {
      id: "cdi_naat_pos_tox_pos",
      label: "NAAT/PCR positive + Toxin EIA positive",
      category: "micro",
      lrPos: 12.0,
      group: "cdi_test",
      notes: "Most supportive of toxin-mediated CDI.",
    },
    {
      id: "cdi_naat_pos_tox_neg",
      label: "NAAT/PCR positive + Toxin EIA negative",
      category: "micro",
      lrPos: 3.5,
      group: "cdi_test",
      notes: "Could represent colonization or low toxin burden; interpret clinically.",
    },
    {
      id: "cdi_naat_pos_tox_na",
      label: "NAAT/PCR positive (toxin not sent/unknown)",
      category: "micro",
      lrPos: 6.0,
      group: "cdi_test",
      notes: "Intermediate support; toxin result would refine.",
    },
  ],
};


export const UTI_MODULE: SyndromeLRModule = {
  id: "uti",
  name: "UTI",
  description:
    "UTI probability update using symptoms + urinalysis (and optional culture). Presets represent care setting; sex and other risk factors live in Host. Starter LRs—replace with curated evidence.",
  pretestPresets: [
    { id: "uti_comm", label: "Community / primary care", p: 0.25 },
    { id: "uti_hc", label: "Hospital / healthcare-associated", p: 0.20 },
  ],
  items: [
    // -------------------------
    // Symptoms (lower tract)
    // -------------------------
    { id: "uti_dysuria", label: "Dysuria", category: "symptom", lrPos: 2.0, lrNeg: 0.6 },
    { id: "uti_freq", label: "Frequency/urgency", category: "symptom", lrPos: 1.6, lrNeg: 0.8 },
    { id: "uti_suprapubic", label: "Suprapubic pain", category: "symptom", lrPos: 1.3, lrNeg: 0.9 },

    // “Alternative dx” clue (mostly women)
    {
      id: "uti_vaginitis",
      label: "Vaginal discharge/irritation",
      category: "symptom",
      lrPos: 0.4,
      lrNeg: 1.0,
      notes: "Suggests vaginitis/cervicitis rather than cystitis.",
    },

    // -------------------------
    // Systemic / pyelo-ish (contextual)
    // -------------------------
    { id: "uti_fever", label: "Fever (≥38°C)", category: "vital", lrPos: 1.3, lrNeg: 0.9 },
    { id: "uti_cva", label: "CVA tenderness", category: "exam", lrPos: 2.0, lrNeg: 0.8 },

    // -------------------------
    // Host (baseline modifiers / complicated-risk)
    // Keep modest so UA remains the main driver.
    // Sex: make mutually exclusive so user can’t click both.
    // -------------------------
    { id: "uti_female", label: "Female sex", category: "host", lrPos: 1.4, lrNeg: 0.95, group: "uti_sex" },
    { id: "uti_male", label: "Male sex", category: "host", lrPos: 0.7, lrNeg: 1.0, group: "uti_sex", notes: "Lower likelihood of uncomplicated cystitis; consider prostatitis/complicated UTI." },

    { id: "uti_age_ge65", label: "Age ≥ 65", category: "host", lrPos: 1.2, lrNeg: 0.95 },
    { id: "uti_diabetes", label: "Diabetes mellitus", category: "host", lrPos: 1.2, lrNeg: 0.95 },
    { id: "uti_ckd", label: "Chronic kidney disease", category: "host", lrPos: 1.2, lrNeg: 0.95 },
    { id: "uti_immuno", label: "Immunocompromised", category: "host", lrPos: 1.2, lrNeg: 0.95 },

    { id: "uti_catheter", label: "Indwelling catheter / recent instrumentation", category: "host", lrPos: 1.6, lrNeg: 0.9 },
    { id: "uti_obstruction", label: "Urinary obstruction/BPH or anatomic abnormality", category: "host", lrPos: 1.5, lrNeg: 0.9 },
    { id: "uti_stones", label: "Nephrolithiasis history", category: "host", lrPos: 1.3, lrNeg: 0.95 },
    { id: "uti_recurrent", label: "Recurrent UTIs", category: "host", lrPos: 1.3, lrNeg: 0.95 },

    // -------------------------
    // UA dipstick (simple: Positive vs Negative only)
    // Mutually exclusive per parameter.
    // -------------------------
    { id: "ua_le_pos", label: "Urine leukocyte esterase", category: "lab", lrPos: 2.5, lrNeg: 0.3, group: "ua_le" },

    { id: "ua_nit_pos", label: "Urine nitrite", category: "lab", lrPos: 6.0, lrNeg: 0.7, group: "ua_nit" },

    // -------------------------
    // Microscopy (optional)
    // -------------------------
    { id: "ua_pyuria_pos", label: "Pyuria on microscopy", category: "lab", lrPos: 2.0, lrNeg: 0.2, group: "ua_pyuria" },

    { id: "ua_bact_pos", label: "Bacteriuria on microscopy", category: "lab", lrPos: 2.0, lrNeg: 0.6, group: "ua_bact" },

    // -------------------------
    // Culture (mutually exclusive)
    // -------------------------
    { id: "uti_cx_pos", label: "Urine culture >100,000 CFU", category: "micro", lrPos: 10.0, lrNeg: 0.1, group: "uti_cx" },
  ],
};

export const ENDO_MODULE: SyndromeLRModule = {
  id: "endo",
  name: "Endocarditis",
  description:
    "Infective endocarditis probability update using host risk + microbiology + imaging (TTE/TEE) ± FDG PET/CT. Imaging LRs derived from published sensitivity/specificity where available; micro LRs are starter heuristics—replace with curated evidence. Beware correlated Duke elements.",
  pretestPresets: [
    { id: "endo_very_low", label: "Very low suspicion (fever, no RF, alternate dx likely)", p: 0.005 },
    { id: "endo_low", label: "Low suspicion (fever + murmur or RF, not classic)", p: 0.02 },
    { id: "endo_mod", label: "Moderate suspicion (bacteremia or multiple RF)", p: 0.08 },
  ],

  items: [
    // -------------------------
    // HOST / RISK (baseline drivers)
    // -------------------------
    { id: "endo_ivdu", label: "Injection drug use", category: "host", lrPos: 2.5, lrNeg: 0.9 },
    { id: "endo_prosthetic_valve", label: "Prosthetic valve", category: "host", lrPos: 2.5, lrNeg: 0.9 },
    { id: "endo_prior_endo", label: "Prior endocarditis", category: "host", lrPos: 2.5, lrNeg: 0.95 },
    { id: "endo_structural", label: "Known structural valve disease", category: "host", lrPos: 1.8, lrNeg: 0.95 },
    { id: "endo_chd", label: "Congenital heart disease", category: "host", lrPos: 1.8, lrNeg: 0.95 },
    { id: "endo_cied", label: "Cardiac device (CIED/ICD/pacemaker)", category: "host", lrPos: 2.2, lrNeg: 0.95 },
    { id: "endo_hd", label: "Hemodialysis", category: "host", lrPos: 2.0, lrNeg: 0.95 },

    // -------------------------
    // CLINICAL FEATURES (minor Duke-ish)
    // -------------------------
    { id: "endo_fever", label: "Fever (≥38°C)", category: "symptom", lrPos: 1.4, lrNeg: 0.85 },
    { id: "endo_new_murmur", label: "New regurgitant murmur", category: "exam", lrPos: 2.5, lrNeg: 0.9 },
    {
      id: "endo_vascular",
      label: "Vascular phenomena (emboli/Janeway/splinter hemorrhages)",
      category: "exam",
      lrPos: 2.0,
      lrNeg: 0.95,
    },
    { id: "endo_immune", label: "Immunologic phenomena (GN/Osler/RF)", category: "exam", lrPos: 1.8, lrNeg: 0.95 },

    // Nonspecific labs (keep weak)
    { id: "endo_esr_crp", label: "Elevated ESR/CRP", category: "lab", lrPos: 1.1, lrNeg: 0.95 },
    { id: "endo_anemia", label: "Anemia of Chronic Disease", category: "lab", lrPos: 1.1, lrNeg: 0.95 },

    // -------------------------
    // MICROBIOLOGY
    // Grouped to avoid stacking correlated micro “majors”.
    // Choose ONE option that best matches the clinical situation.
    // (These are *starter heuristics*; replace with curated evidence.)
    // -------------------------
    { id: "endo_micro_na", label: "Blood cultures / serology not done/unknown", category: "micro", group: "endo_micro" },

    {
      id: "endo_bcx_major_typical",
      label: "Blood cultures: Duke major (typical organism in ≥2 sets)",
      category: "micro",
      lrPos: 12.0,
      lrNeg: 0.9,
      group: "endo_micro",
      notes: "Duke major criterion; avoid stacking with other major micro options.",
    },
    {
      id: "endo_bcx_major_persistent",
      label: "Blood cultures: Duke major (persistent positivity)",
      category: "micro",
      lrPos: 15.0,
      lrNeg: 0.9,
      group: "endo_micro",
      notes: "Duke major criterion; correlated with typical organism + echo findings.",
    },
    {
      id: "endo_bcx_pos_not_major",
      label: "Blood cultures: positive but NOT Duke major",
      category: "micro",
      lrPos: 3.0,
      lrNeg: 0.95,
      group: "endo_micro",
      notes: "Example: single positive set, atypical organism, or uncertain significance.",
    },
    {
      id: "endo_bcx_negative",
      label: "Blood cultures: negative",
      category: "micro",
      lrPos: 1.0,
      lrNeg: 0.6,
      group: "endo_micro",
    },
    {
      id: "endo_coxiella_major",
      label: "Coxiella burnetii Phase I IgG ≥ 1:800",
      category: "micro",
      lrPos: 20.0,
      lrNeg: 0.95,
      group: "endo_micro",
      notes: "Major criterion in IE guidelines; very specific for chronic Q fever endocarditis.",
    },

    // -------------------------
    // IMAGING
    // Each modality is mutually exclusive within itself via group.
    // We model each modality as ONE item where:
    //   Present = test positive
    //   Absent  = test negative
    //   Unknown = not done/unknown
    //
    // TTE LRs derived from pooled sens/spec ~0.61/0.94 => LR+~10.2, LR-~0.41. (Bai et al meta-analysis)
    // PET/CT LRs are scaffolding based on meta-analyses in prosthetic/device contexts.
    // -------------------------

    // TTE
    {
      id: "endo_tte",
      label: "Transthoracic echo (TTE) with evidence of new vegetation, regurgitation or valve perforation",
      category: "imaging",
      group: "endo_tte",
      lrPos: 10.2,
      lrNeg: 0.41,
      notes: "LR derived from pooled sens/spec (meta-analysis). Performance lower in prosthetic/device/early disease.",
    },
    { id: "endo_tte_na", label: "TTE not done/unknown", category: "imaging", group: "endo_tte" },

    // TEE (keep as scaffold unless you swap in pooled sens/spec you prefer)
    {
      id: "endo_tee",
      label: "Transesophageal echo (TEE) with evidence of new vegetation, regurgitation or valve perforation",
      category: "imaging",
      group: "endo_tee",
      lrPos: 9.0,
      lrNeg: 0.12,
      notes: "Pooled values for your target population (native vs prosthetic).",
    },

    // FDG PET/CT (prosthetic valve/device emphasis)
    {
      id: "endo_pet",
      label: "FDG PET/CT (prosthetic valve/device infection)",
      category: "imaging",
      group: "endo_pet",
      lrPos: 5.5,
      lrNeg: 0.20,
      notes: "Best for prosthetic valve/device IE; negative does not exclude native-valve IE.",
    },
    { id: "endo_pet_na", label: "FDG PET/CT not done/unknown", category: "imaging", group: "endo_pet" },
  ],
};



export const PROBID_MODULES: SyndromeLRModule[] = [CAP_MODULE, CDI_MODULE, UTI_MODULE, ENDO_MODULE];
