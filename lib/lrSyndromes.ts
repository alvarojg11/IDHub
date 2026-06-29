// lib/lrSyndromes.ts
import type { LRItem, LRSource, SyndromeLRModule } from "./lrTypes";

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
    {
      id: "pc_adult",
      label: "Primary Care",
      p: 0.03,
      notes: "Setting-only baseline (not symptom-enriched). Add findings such as cough separately.",
    },
    {
      id: "ed_adult",
      label: "Emergency Department",
      p: 0.06,
      notes: "Setting-only baseline (not symptom-enriched). Add findings such as cough separately.",
    },
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
    // Virology (bacterial coinfection modifier)
    // -------------------------
    {
      id: "cap_rvp_pos",
      label: "Respiratory viral panel positive",
      category: "micro",
      group: "cap_rvp",
      lrPos: 0.53,
      lrNeg: 1.07,
      notes:
        "Modeled as modifier of bacterial coinfection likelihood in CAP (proxy endpoint: blood-culture positivity). Derived from cohort rates (viral-positive 12.6%; blood-culture positivity 2.7% vs 5.3%), yielding LR+ ~0.53 and LR− ~1.07.",
      source: {
        short: "Klompas et al. Infect Control Hosp Epidemiol",
        year: 2021,
        url: "https://doi.org/10.1017/ice.2020.1312",
      },
    },
    {
      id: "cap_rvp_na",
      label: "Respiratory viral panel not done/unknown",
      category: "micro",
      group: "cap_rvp",
      notes: "Neutral selection.",
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

export const VAP_MODULE: SyndromeLRModule = {
  id: "vap",
  name: "VAP",
  description:
    "Ventilator-associated pneumonia (adult ICU, mechanically ventilated >48h) diagnostic probability update using clinical features and respiratory microbiology. Core LRs are derived from a 2020 systematic review/meta-analysis using histopathology as reference standard where available.",
  pretestPresets: [
    {
      id: "vap_icu_gt48h",
      label: "ICU, mechanically ventilated >48 hours",
      p: 0.12,
      notes:
        "Setting/time-only baseline. Select clinical, imaging, and microbiology findings separately. Calibrate to local ICU epidemiology and surveillance definitions.",
      source: {
        short: "Cook et al. Ann Intern Med",
        year: 1998,
        url: "https://doi.org/10.7326/0003-4819-129-6-199809150-00002",
      },
    },
    {
      id: "vap_icu_ge5d",
      label: "ICU, mechanically ventilated >=5 days",
      p: 0.2,
      notes:
        "Setting/time-only baseline with longer ventilation exposure. Higher duration mainly increases cumulative VAP risk and shifts pathogen resistance risk; calibrate locally.",
      source: {
        short: "Cook et al. Ann Intern Med",
        year: 1998,
        url: "https://doi.org/10.7326/0003-4819-129-6-199809150-00002",
      },
    },
  ],
  items: [
    // -------------------------
    // Clinical features (histopathology-referenced meta-analysis)
    // -------------------------
    {
      id: "vap_fever",
      label: "Fever (>=38 C)",
      category: "vital",
      lrPos: 1.44,
      lrNeg: 0.62,
      notes: "Weak diagnostic modifier in suspected VAP.",
    },
    {
      id: "vap_purulent_secretions",
      label: "Purulent tracheal secretions",
      category: "exam",
      lrPos: 1.26,
      lrNeg: 0.59,
      notes: "Common but non-specific in mechanically ventilated ICU patients.",
    },
    {
      id: "vap_cxr_infiltrate",
      label: "Chest radiograph infiltrate (new/progressive compatible opacity)",
      category: "imaging",
      group: "vap_cxr",
      lrPos: 1.2,
      lrNeg: 0.42,
      notes:
        "High sensitivity but poor specificity in the meta-analysis. If CXR done, mark Present/Absent. If not done/indeterminate, choose 'CXR not done/unknown'.",
    },
    {
      id: "vap_cxr_na",
      label: "CXR not done/unknown",
      category: "imaging",
      group: "vap_cxr",
      notes: "Neutral selection.",
    },
    {
      id: "vap_leukocytosis",
      label: "Leukocytosis (WBC >=12 x10^9/L)",
      category: "lab",
      lrPos: 1.57,
      lrNeg: 0.61,
      notes:
        "Evidence synthesis used varying thresholds (commonly >=10 or >=12 x10^9/L); this module standardizes to >=12 for usability. Weak diagnostic modifier.",
    },
    {
      id: "vap_hypoxemia_pf240",
      label: "Worsening oxygenation (PaO2/FiO2 <=240)",
      category: "vital",
      lrPos: 0.77,
      lrNeg: 1.95,
      notes:
        "Included because it is commonly used in bedside VAP suspicion frameworks, but evidence suggests poor diagnostic performance for microbiologically confirmed VAP. In one multicenter prospective cohort of suspected VAP, this threshold was associated with LESS microbiologic confirmation.",
    },

    // -------------------------
    // Composite score (avoid double counting)
    // -------------------------
    {
      id: "vap_cpis_gt6",
      label: "CPIS > 6 (use instead of individual CPIS component findings)",
      category: "lab",
      group: "vap_cpis",
      lrPos: 2.2,
      lrNeg: 0.4,
      notes:
        "Do not combine with fever/secretions/WBC/CXR component findings if using CPIS, as this will double count overlapping information.",
    },
    {
      id: "vap_cpis_na",
      label: "CPIS not used/unknown",
      category: "lab",
      group: "vap_cpis",
      notes: "Neutral selection.",
    },

    // -------------------------
    // Respiratory microbiology (mutually exclusive strategy to avoid double counting)
    // Mark Present if culture is at/above threshold; mark Absent if below threshold/negative.
    // -------------------------
    {
      id: "vap_eta_qcx",
      label: "Endotracheal aspirate culture positive",
      category: "micro",
      group: "vap_resp_micro",
      lrPos: 2.36,
      lrNeg: 0.36,
      notes:
        "Set Present for clinically significant ETA culture growth (quantitative threshold if your lab reports it; semiquantitative positive interpreted clinically if not). Published pooled LRs are based primarily on quantitative thresholds.",
    },
    {
      id: "vap_psb_qcx",
      label: "Protected specimen brush culture positive",
      category: "micro",
      group: "vap_resp_micro",
      lrPos: 2.62,
      lrNeg: 0.5,
      notes:
        "Set Present for clinically significant PSB culture growth. Published pooled LRs are based on quantitative thresholds (commonly >=10^3 CFU/mL).",
    },
    {
      id: "vap_bal_qcx",
      label: "BAL culture positive",
      category: "micro",
      group: "vap_resp_micro",
      lrPos: 3.48,
      lrNeg: 0.36,
      notes:
        "Set Present for clinically significant BAL culture growth (quantitative threshold if reported; semiquantitative positive interpreted clinically if not). Published pooled LRs are based primarily on quantitative thresholds (commonly >=10^4 CFU/mL).",
    },
    {
      id: "vap_resp_micro_na",
      label: "Respiratory sampling/culture not done or unknown",
      category: "micro",
      group: "vap_resp_micro",
      notes: "Neutral selection.",
    },

    // -------------------------
    // Biomarker (guideline-pooled HAP/VAP data; optional, not definitive)
    // -------------------------
    {
      id: "vap_pct_elevated",
      label: "Serum procalcitonin elevated (diagnostic threshold assay/study dependent)",
      category: "lab",
      group: "vap_pct",
      lrPos: 3.9,
      lrNeg: 0.4,
      notes:
        "Pooled HAP/VAP estimate from ATS/IDSA evidence review (cutoffs varied ~0.5-3.9 ng/mL). Not recommended as a sole trigger to start antibiotics.",
    },
    {
      id: "vap_pct_na",
      label: "Procalcitonin not done/unknown",
      category: "lab",
      group: "vap_pct",
      notes: "Neutral selection.",
    },
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
    "UTI probability update using setting-only pretest probability plus symptoms, urinalysis (and optional culture), and host risk factors. Starter LRs—replace with curated evidence.",
  pretestPresets: [
    {
      id: "uti_comm",
      label: "Outpatient / primary care",
      p: 0.05,
      notes: "Setting-only baseline (not symptom-enriched). Add symptoms/UA findings separately.",
    },
    {
      id: "uti_hc",
      label: "ED / inpatient",
      p: 0.08,
      notes: "Setting-only baseline (not symptom-enriched). Add symptoms/UA findings separately.",
    },
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
    "Infective endocarditis probability update using setting-only pretest probability plus selected host risk, organism-specific microbiology, risk-score context (VIRSTA / DENOVA / HANDOC), and imaging (TTE/TEE) ± FDG PET/CT. Imaging LRs derived from published sensitivity/specificity where available. Beware correlated Duke elements.",
  pretestPresets: [
    {
      id: "endo_very_low",
      label: "Outpatient / primary care",
      p: 0.001,
      notes: "Setting-only baseline. Add host, exam, microbiology, and imaging findings separately.",
    },
    {
      id: "endo_low",
      label: "ED / inpatient",
      p: 0.005,
      notes: "Setting-only baseline. Add host, exam, microbiology, and imaging findings separately.",
    },
    {
      id: "endo_mod",
      label: "Tertiary referral center",
      p: 0.01,
      notes: "Setting-only baseline for referral settings. Add host, exam, microbiology, and imaging findings separately.",
    },
  ],

  items: [
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
    // Organism-specific risk scores
    {
      id: "endo_virsta_high",
      label: "VIRSTA (SAB) score >=3",
      category: "lab",
      group: "endo_virsta",
      lrPos: 2.0,
      lrNeg: 0.06,
      notes:
        "High-sensitivity rule-out oriented SAB score for endocarditis risk stratification (external validation performance).",
    },
    {
      id: "endo_virsta_na",
      label: "VIRSTA not applied/unknown",
      category: "lab",
      group: "endo_virsta",
      notes: "Neutral selection.",
    },
    {
      id: "endo_denova_high",
      label: "DENOVA (E. faecalis bacteremia) >=3",
      category: "lab",
      group: "endo_denova",
      lrPos: 6.7,
      lrNeg: 0.08,
      notes: "High sensitivity score for E. faecalis bacteremia endocarditis risk stratification.",
    },
    {
      id: "endo_denova_na",
      label: "DENOVA not applied/unknown",
      category: "lab",
      group: "endo_denova",
      notes: "Neutral selection.",
    },
    {
      id: "endo_handoc_high",
      label: "HANDOC (NBHS bacteremia) >=3",
      category: "lab",
      group: "endo_handoc",
      lrPos: 4.2,
      lrNeg: 0.08,
      notes: "High sensitivity score for non-beta-hemolytic streptococcal bacteremia.",
    },
    {
      id: "endo_handoc_na",
      label: "HANDOC not applied/unknown",
      category: "lab",
      group: "endo_handoc",
      notes: "Neutral selection.",
    },

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
      id: "endo_bcx_saureus_multi",
      label: "Blood cultures: Staphylococcus aureus in >=2 sets",
      category: "micro",
      lrPos: 11.0,
      lrNeg: 0.9,
      group: "endo_micro",
      notes: "Typical IE organism; choose one microbiology option to avoid double counting.",
    },
    {
      id: "endo_bcx_efaecalis_multi",
      label: "Blood cultures: Enterococcus faecalis in >=2 sets",
      category: "micro",
      lrPos: 8.0,
      lrNeg: 0.9,
      group: "endo_micro",
      notes: "Typical organism in appropriate context; pair with DENOVA only if clinically justified.",
    },
    {
      id: "endo_bcx_nbhs_multi",
      label: "Blood cultures: NBHS (e.g., viridans group / S. gallolyticus) in >=2 sets",
      category: "micro",
      lrPos: 7.0,
      lrNeg: 0.9,
      group: "endo_micro",
      notes: "Typical organism in appropriate context; pair with HANDOC only if clinically justified.",
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

export const ACTIVE_TB_MODULE: SyndromeLRModule = {
  id: "active_tb",
  name: "Active TB",
  description:
    "Active pulmonary TB probability update using setting-only pretest probability plus selected host risk factors, symptom screen strategy, immune-based tests (QFT/TST), respiratory microbiology (MTB PCR, AFB smear, culture), and chest X-ray. LRs use pooled estimates where available.",
  pretestPresets: [
    {
      id: "tb_low",
      label: "Outpatient",
      p: 0.005,
      notes: "Setting-only baseline. Add host/risk findings separately below.",
      source: {
        short: "WHO Global TB Report",
        year: 2024,
        url: "https://www.who.int/publications/i/item/9789240101531",
      },
    },
    {
      id: "tb_intermediate",
      label: "ED / Inpatient",
      p: 0.02,
      notes: "Setting-only baseline. Add host/risk findings separately below.",
      source: {
        short: "WHO Global TB Report",
        year: 2024,
        url: "https://www.who.int/publications/i/item/9789240101531",
      },
    },
  ],

  items: [
    // -------------------------
    // Host risk factors (epidemiologic enrichers)
    // -------------------------
    {
      id: "tb_contact",
      label: "Close/household contact with infectious pulmonary TB",
      category: "host",
      lrPos: 2.0,
      lrNeg: 0.85,
      notes: "Approximate risk enrichment from contact-investigation cohorts/meta-analyses.",
      source: {
        short: "Fox et al. PLoS Med",
        year: 2013,
        url: "https://doi.org/10.1371/journal.pmed.1001432",
      },
    },
    {
      id: "tb_birth_travel_high_incidence",
      label: "Born in or prolonged travel/residence in high-incidence TB region",
      category: "host",
      lrPos: 2.1,
      lrNeg: 0.9,
      notes: "Epidemiologic risk enrichment modeled conservatively to avoid overcounting with other host factors.",
      source: {
        short: "WHO Global TB Report",
        year: 2024,
        url: "https://www.who.int/publications/i/item/9789240101531",
      },
    },
    {
      id: "tb_incarceration",
      label: "Current or recent incarceration",
      category: "host",
      lrPos: 2.2,
      lrNeg: 0.9,
      notes: "Prison populations have much higher TB burden than the general population; LR kept conservative due overlap with other social/host risks.",
      source: {
        short: "Cords et al. Lancet Public Health",
        year: 2021,
        url: "https://doi.org/10.1016/S2468-2667(21)00025-6",
      },
    },
    {
      id: "tb_homelessness",
      label: "Experiencing homelessness or regular shelter exposure",
      category: "host",
      lrPos: 2.0,
      lrNeg: 0.92,
      notes: "Homeless populations/shelters are higher-risk TB settings; LR kept conservative to reduce overlap with other vulnerabilities.",
      source: {
        short: "Beijer et al. Lancet Infect Dis",
        year: 2012,
        url: "https://doi.org/10.1016/S1473-3099(12)70177-9",
      },
    },
    {
      id: "tb_hiv_or_immunosuppression",
      label: "HIV or major cellular immunosuppression",
      category: "host",
      lrPos: 2.5,
      lrNeg: 0.9,
      notes: "Major TB risk factor; modeled as conservative pretest enrichment in this tool.",
      source: {
        short: "WHO Global TB Report",
        year: 2024,
        url: "https://www.who.int/publications/i/item/9789240101531",
      },
    },
    {
      id: "tb_diabetes",
      label: "Diabetes mellitus",
      category: "host",
      lrPos: 1.6,
      lrNeg: 0.95,
      notes: "Epidemiologic risk modifier rather than a direct microbiologic diagnostic test.",
      source: {
        short: "Jeon & Murray. PLoS Med",
        year: 2008,
        url: "https://doi.org/10.1371/journal.pmed.0050152",
      },
    },

    // -------------------------
    // Symptoms
    // Use one symptom-screen strategy at a time to reduce double counting.
    // -------------------------
    {
      id: "tb_sym_any",
      label: "Any WHO TB symptom (cough, fever, night sweats, or weight loss)",
      category: "symptom",
      group: "tb_sym_screen",
      lrPos: 2.0,
      lrNeg: 0.45,
      notes: "From pooled sensitivity/specificity of symptom screening studies.",
      source: {
        short: "van't Hoog et al. Cochrane",
        year: 2022,
        url: "https://doi.org/10.1002/14651858.CD010890.pub2",
      },
    },
    {
      id: "tb_sym_cough_2w",
      label: "Cough >=2 weeks (cough-only symptom strategy)",
      category: "symptom",
      group: "tb_sym_screen",
      lrPos: 7.5,
      lrNeg: 0.61,
      notes: "Higher specificity than broad symptom screens, with lower sensitivity.",
      source: {
        short: "van't Hoog et al. Cochrane",
        year: 2022,
        url: "https://doi.org/10.1002/14651858.CD010890.pub2",
      },
    },
    {
      id: "tb_sym_na",
      label: "Symptom screen not done/unknown",
      category: "symptom",
      group: "tb_sym_screen",
      notes: "Neutral selection.",
    },

    // -------------------------
    // Labs
    // Immune-based assays do NOT distinguish latent from active TB.
    // We allow one immune-test strategy at a time.
    // -------------------------
    {
      id: "tb_qft",
      label: "QuantiFERON (IGRA) result",
      category: "lab",
      group: "tb_immune_test",
      lrPos: 3.0,
      lrNeg: 0.24,
      notes: "Set Present=positive, Absent=negative. Supportive only for active TB diagnosis.",
      source: {
        short: "AlAlyani et al. Diagnostics",
        year: 2025,
        url: "https://doi.org/10.3390/diagnostics15182343",
      },
    },
    {
      id: "tb_tst",
      label: "Tuberculin skin test (TST) result",
      category: "lab",
      group: "tb_immune_test",
      lrPos: 1.9,
      lrNeg: 0.47,
      notes: "Set Present=positive, Absent=negative. Supportive only for active TB diagnosis.",
      source: {
        short: "AlAlyani et al. Diagnostics",
        year: 2025,
        url: "https://doi.org/10.3390/diagnostics15182343",
      },
    },
    {
      id: "tb_immune_na",
      label: "QFT/TST not done/unknown",
      category: "lab",
      group: "tb_immune_test",
      notes: "Neutral selection.",
    },

    // -------------------------
    // Respiratory microbiology
    // -------------------------
    {
      id: "tb_mtbpcr_sputum",
      label: "MTB PCR (Xpert MTB/RIF) on sputum",
      category: "micro",
      group: "tb_mtbpcr",
      lrPos: 42.5,
      lrNeg: 0.15,
      notes: "Present=positive PCR, Absent=negative PCR. Pooled sensitivity ~85%, specificity ~98%.",
      source: {
        short: "Steingart et al. Cochrane",
        year: 2014,
        url: "https://doi.org/10.1002/14651858.CD009593.pub4",
      },
    },
    {
      id: "tb_mtbpcr_bal",
      label: "MTB PCR (Xpert MTB/RIF) on BAL",
      category: "micro",
      group: "tb_mtbpcr",
      lrPos: 10.21,
      lrNeg: 0.16,
      notes: "Present=positive PCR, Absent=negative PCR. Pooled PLR 10.21, NLR 0.16.",
      source: {
        short: "Liu et al. J Clin Microbiol",
        year: 2021,
        url: "https://doi.org/10.1128/JCM.02170-20",
      },
    },
    {
      id: "tb_afb_smear_sputum",
      label: "AFB smear microscopy (sputum)",
      category: "micro",
      lrPos: 32.0,
      lrNeg: 0.37,
      notes: "Present=smear positive, Absent=smear negative. Pooled sensitivity ~64%, specificity ~98%.",
      source: {
        short: "Davis et al. Lancet Infect Dis",
        year: 2013,
        url: "https://doi.org/10.1016/S1473-3099(12)70232-3",
      },
    },
    {
      id: "tb_culture_sputum",
      label: "Mycobacterial culture (sputum)",
      category: "micro",
      group: "tb_culture",
      lrPos: 100,
      lrNeg: 0.58,
      notes: "Present=culture positive, Absent=culture negative. Reported specificity ~100%; LR+ is mathematically non-finite (capped here at 100).",
      source: {
        short: "You et al. Syst Rev",
        year: 2024,
        url: "https://doi.org/10.1186/s13643-024-02733-8",
      },
    },
    {
      id: "tb_culture_bal",
      label: "Mycobacterial culture (BAL)",
      category: "micro",
      group: "tb_culture",
      lrPos: 100,
      lrNeg: 0.56,
      notes: "Present=culture positive, Absent=culture negative. Reported specificity ~100%; LR+ is mathematically non-finite (capped here at 100).",
      source: {
        short: "You et al. Syst Rev",
        year: 2024,
        url: "https://doi.org/10.1186/s13643-024-02733-8",
      },
    },

    // -------------------------
    // Chest X-ray
    // -------------------------
    {
      id: "tb_cxr_suggestive",
      label: "CXR suggestive of active pulmonary TB",
      category: "imaging",
      group: "tb_cxr",
      lrPos: 19.3,
      lrNeg: 0.16,
      notes: "Set Present=suggestive CXR, Absent=not suggestive CXR.",
      source: {
        short: "van't Hoog et al. Cochrane",
        year: 2022,
        url: "https://doi.org/10.1002/14651858.CD010890.pub2",
      },
    },
    {
      id: "tb_cxr_na",
      label: "CXR not done/unknown",
      category: "imaging",
      group: "tb_cxr",
      notes: "Neutral selection.",
    },
  ],
};

export const PJP_MODULE: SyndromeLRModule = {
  id: "pjp",
  name: "PJP",
  description:
    "Pneumocystis jirovecii pneumonia probability update using setting-only pretest probability plus selected host risk factors, vitals, serum BDG, respiratory diagnostics (PCR/DFA), and chest imaging.",
  pretestPresets: [
    {
      id: "pjp_low",
      label: "Outpatient / Emergency Department",
      p: 0.003,
      notes: "Setting-only baseline. Add host/risk findings separately below.",
      source: {
        short: "Mappin-Kasirer et al. BMC Infect Dis",
        year: 2024,
        url: "https://doi.org/10.1186/s12879-024-09957-y",
      },
    },
    {
      id: "pjp_moderate",
      label: "Hospitalized (non-ICU)",
      p: 0.01,
      notes: "Setting-only baseline. Add host/risk findings separately below.",
      source: {
        short: "Mappin-Kasirer et al. BMC Infect Dis",
        year: 2024,
        url: "https://doi.org/10.1186/s12879-024-09957-y",
      },
    },
    {
      id: "pjp_high",
      label: "ICU",
      p: 0.02,
      notes: "Setting-only baseline. Add host/risk findings separately below.",
      source: {
        short: "Mappin-Kasirer et al. BMC Infect Dis",
        year: 2024,
        url: "https://doi.org/10.1186/s12879-024-09957-y",
      },
    },
  ],
  items: [
    // -------------------------
    // Risk factors
    // (OR-informed approximations where pooled LRs are unavailable)
    // -------------------------
    {
      id: "pjp_host_hiv_cd4_sot",
      label: "HIV (CD4 <=200) or solid organ transplant",
      category: "host",
      lrPos: 3.2,
      lrNeg: 0.9,
      notes: "Approximate LR informed by adjusted OR from a bronchoscopy-derived diagnostic cohort.",
      source: {
        short: "Mappin-Kasirer et al. BMC Infect Dis",
        year: 2024,
        url: "https://doi.org/10.1186/s12879-024-09957-y",
      },
    },
    {
      id: "pjp_host_no_ppx",
      label: "No TMP-SMX prophylaxis despite indication",
      category: "host",
      lrPos: 6.5,
      lrNeg: 0.15,
      notes: "Absence of prophylaxis increases risk; prophylaxis is strongly protective in risk-score cohorts.",
      source: {
        short: "Mappin-Kasirer et al. BMC Infect Dis",
        year: 2024,
        url: "https://doi.org/10.1186/s12879-024-09957-y",
      },
    },
    {
      id: "pjp_host_prolonged_steroids",
      label: "Prolonged systemic steroids (roughly >=20 mg prednisone-equivalent for >=3 weeks)",
      category: "host",
      lrPos: 1.8,
      lrNeg: 0.95,
      notes: "Commonly recognized major risk state for non-HIV PJP; treated as conservative pretest enrichment.",
      source: {
        short: "Shin et al. Sci Rep",
        year: 2019,
        url: "https://doi.org/10.1038/s41598-019-38618-3",
      },
    },

    // -------------------------
    // Vital signs (limited standalone discrimination)
    // -------------------------
    {
      id: "pjp_vital_hypoxemia",
      label: "Hypoxemia",
      category: "vital",
      lrPos: 1.2,
      lrNeg: 0.9,
      notes: "Weak diagnostic discriminator alone in multivariable diagnostic cohorts.",
      source: {
        short: "Mappin-Kasirer et al. BMC Infect Dis",
        year: 2024,
        url: "https://doi.org/10.1186/s12879-024-09957-y",
      },
    },
    {
      id: "pjp_vital_fever",
      label: "Fever",
      category: "vital",
      lrPos: 1.2,
      lrNeg: 0.95,
      notes: "Common but non-specific in immunocompromised hosts.",
      source: {
        short: "Mappin-Kasirer et al. BMC Infect Dis",
        year: 2024,
        url: "https://doi.org/10.1186/s12879-024-09957-y",
      },
    },

    // -------------------------
    // Labs (serum)
    // -------------------------
    {
      id: "pjp_bdg_serum",
      label: "Serum beta-D-glucan (BDG)",
      category: "lab",
      group: "pjp_bdg",
      lrPos: 4.3,
      lrNeg: 0.11,
      notes: "Set Present=positive, Absent=negative. Good rule-out utility when pretest probability is low/intermediate.",
      source: {
        short: "Del Corpo et al. Clin Microbiol Infect",
        year: 2020,
        url: "https://doi.org/10.1016/j.cmi.2020.05.024",
      },
    },
    {
      id: "pjp_bdg_na",
      label: "Serum BDG not done/unknown",
      category: "lab",
      group: "pjp_bdg",
      notes: "Neutral selection.",
    },
    {
      id: "pjp_ldh_high",
      label: "Serum LDH elevated (around >=265 IU/L)",
      category: "lab",
      lrPos: 3.0,
      lrNeg: 0.75,
      notes: "OR-informed approximation from multivariable diagnostic model.",
      source: {
        short: "Mappin-Kasirer et al. BMC Infect Dis",
        year: 2024,
        url: "https://doi.org/10.1186/s12879-024-09957-y",
      },
    },

    // -------------------------
    // Microbiology (respiratory samples)
    // -------------------------
    {
      id: "pjp_pcr_bal",
      label: "Respiratory PCR (BAL qPCR)",
      category: "micro",
      group: "pjp_pcr_strategy",
      lrPos: 9.19,
      lrNeg: 0.014,
      notes: "Set Present=positive, Absent=negative.",
      source: {
        short: "Brown et al. Clin Infect Dis",
        year: 2024,
        url: "https://doi.org/10.1093/cid/ciae239",
      },
    },
    {
      id: "pjp_pcr_induced_sputum",
      label: "Respiratory PCR (induced sputum qPCR)",
      category: "micro",
      group: "pjp_pcr_strategy",
      lrPos: 5.3,
      lrNeg: 0.024,
      notes: "Set Present=positive, Absent=negative.",
      source: {
        short: "Brown et al. Clin Infect Dis",
        year: 2024,
        url: "https://doi.org/10.1093/cid/ciae239",
      },
    },
    {
      id: "pjp_pcr_upper_airway",
      label: "Respiratory PCR (upper airway sample)",
      category: "micro",
      group: "pjp_pcr_strategy",
      lrPos: 9.34,
      lrNeg: 0.12,
      notes: "Set Present=positive, Absent=negative.",
      source: {
        short: "Brown et al. Clin Infect Dis",
        year: 2024,
        url: "https://doi.org/10.1093/cid/ciae239",
      },
    },
    {
      id: "pjp_pcr_na",
      label: "Respiratory PCR not done/unknown",
      category: "micro",
      group: "pjp_pcr_strategy",
      notes: "Neutral selection.",
    },
    {
      id: "pjp_dfa",
      label: "Respiratory direct fluorescent antibody (DFA/IFA)",
      category: "micro",
      group: "pjp_dfa_strategy",
      lrPos: 20,
      lrNeg: 0.73,
      notes: "Set Present=positive, Absent=negative. Very specific but substantially less sensitive than PCR in routine cohorts.",
      source: {
        short: "Veintimilla et al. J Fungi",
        year: 2023,
        url: "https://doi.org/10.3390/jof9040414",
      },
    },
    {
      id: "pjp_dfa_na",
      label: "Respiratory DFA/IFA not done/unknown",
      category: "micro",
      group: "pjp_dfa_strategy",
      notes: "Neutral selection.",
    },

    // -------------------------
    // Imaging
    // -------------------------
    {
      id: "pjp_cxr_typical",
      label: "CXR typical of PJP (diffuse/interstitial-interstitial-alveolar pattern)",
      category: "imaging",
      group: "pjp_imaging",
      lrPos: 3.0,
      lrNeg: 0.7,
      notes: "Approximation informed by pooled ORs and multivariable diagnostic cohorts.",
      source: {
        short: "Wills et al. Open Forum Infect Dis",
        year: 2024,
        url: "https://doi.org/10.1093/ofid/ofae146",
      },
    },
    {
      id: "pjp_ct_typical",
      label: "CT typical of PJP (ground-glass/interstitial pattern)",
      category: "imaging",
      group: "pjp_imaging",
      lrPos: 4.4,
      lrNeg: 0.45,
      notes: "OR-informed approximation from multivariable CT diagnostic cohorts.",
      source: {
        short: "Mappin-Kasirer et al. BMC Infect Dis",
        year: 2024,
        url: "https://doi.org/10.1186/s12879-024-09957-y",
      },
    },
    {
      id: "pjp_imaging_na",
      label: "Chest imaging not done/unknown",
      category: "imaging",
      group: "pjp_imaging",
      notes: "Neutral selection.",
    },
  ],
};

export const INVASIVE_ASPERGILLOSIS_MODULE: SyndromeLRModule = {
  id: "inv_aspergillosis",
  name: "Invasive Aspergillosis",
  description:
    "Invasive aspergillosis probability update using care-setting pretest probability plus selected host risk factors, chest imaging, serum/BAL galactomannan, beta-D-glucan, Aspergillus lateral-flow assay, Aspergillus PCR, and culture. For mucormycosis (Mucorales), use the dedicated Mucormycosis module.",
  pretestPresets: [
    {
      id: "imi_low",
      label: "Outpatient / Emergency Department",
      p: 0.001,
      notes: "Setting-only baseline (very low prevalence). Add host/risk findings separately below.",
      source: {
        short: "Patterson et al. IDSA Aspergillosis",
        year: 2016,
        url: "https://doi.org/10.1093/cid/ciw326",
      },
    },
    {
      id: "imi_heme_high",
      label: "Hospitalized (non-ICU)",
      p: 0.005,
      notes: "Setting-only baseline. Add host/risk findings separately below.",
      source: {
        short: "Cruciani et al. Cochrane",
        year: 2019,
        url: "https://doi.org/10.1002/14651858.CD009551.pub4",
      },
    },
    {
      id: "imi_icu_viral",
      label: "ICU",
      p: 0.015,
      notes: "Setting-only baseline (non-enriched ICU population). Add host/risk findings separately below.",
      source: {
        short: "Feys et al. Lancet Infect Dis",
        year: 2022,
        url: "https://doi.org/10.1016/S1473-3099(22)00044-8",
      },
    },
  ],
  items: [
    // -------------------------
    // Host context
    // (risk-enrichment approximations informed by consensus host criteria)
    // -------------------------
    {
      id: "imi_host_neutropenia_hsct",
      label: "Profound neutropenia or recent allogeneic HSCT",
      category: "host",
      lrPos: 3.0,
      lrNeg: 0.85,
      notes: "Consensus major host factor for invasive mold disease; modeled as pretest enrichment.",
      source: {
        short: "Donnelly et al. Clin Infect Dis",
        year: 2020,
        url: "https://doi.org/10.1093/cid/ciz1008",
      },
    },
    {
      id: "imi_host_hematologic_malignancy",
      label: "Active hematologic malignancy (e.g., AML/MDS/relapsed leukemia)",
      category: "host",
      lrPos: 2.2,
      lrNeg: 0.92,
      notes: "Consensus host-risk enricher for invasive aspergillosis and related mold disease.",
      source: {
        short: "Donnelly et al. Clin Infect Dis",
        year: 2020,
        url: "https://doi.org/10.1093/cid/ciz1008",
      },
    },
    {
      id: "imi_host_solid_organ_transplant",
      label: "Solid organ transplant recipient",
      category: "host",
      lrPos: 1.9,
      lrNeg: 0.94,
      notes: "Modeled as a conservative pretest-risk enrichment factor.",
      source: {
        short: "Patterson et al. IDSA Aspergillosis",
        year: 2016,
        url: "https://doi.org/10.1093/cid/ciw326",
      },
    },
    {
      id: "imi_host_steroids_tcell",
      label: "Prolonged corticosteroids or significant T-cell immunosuppression",
      category: "host",
      lrPos: 2.0,
      lrNeg: 0.9,
      notes: "Modeled as a conservative host-risk enricher when classic immunosuppression is present.",
      source: {
        short: "Donnelly et al. Clin Infect Dis",
        year: 2020,
        url: "https://doi.org/10.1093/cid/ciz1008",
      },
    },
    {
      id: "imi_host_icu_viral_steroid",
      label: "Severe viral pneumonia in ICU with corticosteroid exposure (CAPA context)",
      category: "host",
      lrPos: 1.8,
      lrNeg: 0.95,
      notes: "Host/context enrichment only; add diagnostics (GM/PCR/imaging) for meaningful rule-in or rule-out shifts.",
      source: {
        short: "Feys et al. Lancet Infect Dis",
        year: 2022,
        url: "https://doi.org/10.1016/S1473-3099(22)00044-8",
      },
    },
    {
      id: "imi_fever_refractory",
      label: "Persistent/refractory fever despite broad-spectrum antibacterials",
      category: "symptom",
      lrPos: 1.4,
      lrNeg: 0.9,
      notes: "Supportive but non-specific in high-risk patients.",
      source: {
        short: "Patterson et al. IDSA Aspergillosis",
        year: 2016,
        url: "https://doi.org/10.1093/cid/ciw326",
      },
    },

    // -------------------------
    // Imaging
    // -------------------------
    {
      id: "imi_ct_halo_sign",
      label: "Chest CT halo sign (nodular lesion with surrounding ground-glass opacity)",
      category: "imaging",
      group: "imi_ct",
      lrPos: 5.6,
      lrNeg: 0.55,
      notes: "Good rule-in support in the right host context; absence does not exclude invasive mold infection.",
      source: {
        short: "Agarwal et al. Eur J Radiol",
        year: 2020,
        url: "https://doi.org/10.1016/j.ejrad.2020.108843",
      },
    },
    {
      id: "imi_ct_na",
      label: "Chest CT not done/unknown",
      category: "imaging",
      group: "imi_ct",
      notes: "Neutral selection.",
    },

    // -------------------------
    // Biomarkers
    // -------------------------
    {
      id: "imi_serum_gm_odi10",
      label: "Serum galactomannan (ODI >0.5)",
      category: "lab",
      group: "imi_gm",
      lrPos: 5.75,
      lrNeg: 0.1,
      notes: "Set Present=positive, Absent=negative. LR values are calculated from pooled sensitivity 0.92 and specificity 0.84 for the commonly used serum ODI >0.5 cutoff in hematologic populations.",
      source: {
        short: "Al-Rawahi et al. J Fungi",
        year: 2023,
        url: "https://doi.org/10.3390/jof9020266",
      },
    },
    {
      id: "imi_bal_gm_odi10",
      label: "BAL galactomannan (ODI >1.0)",
      category: "lab",
      group: "imi_gm",
      lrPos: 18.75,
      lrNeg: 0.26,
      notes: "Set Present=positive, Absent=negative. LR values are calculated from pooled sensitivity 0.75 and specificity 0.96 for the commonly used BAL ODI >1.0 cutoff in hematologic populations.",
      source: {
        short: "Al-Rawahi et al. J Fungi",
        year: 2023,
        url: "https://doi.org/10.3390/jof9020266",
      },
    },
    {
      id: "imi_gm_na",
      label: "Galactomannan testing not done/unknown",
      category: "lab",
      group: "imi_gm",
      notes: "Neutral selection.",
    },
    {
      id: "imi_serum_bdg",
      label: "Serum beta-D-glucan (BDG)",
      category: "lab",
      group: "imi_bdg",
      lrPos: 4.0,
      lrNeg: 0.34,
      notes: "Pan-fungal biomarker; interpret with clinical context and potential non-mold causes of positivity.",
      source: {
        short: "Huang et al. Clin Respir J",
        year: 2024,
        url: "https://doi.org/10.1111/crj.13760",
      },
    },
    {
      id: "imi_bdg_na",
      label: "Serum BDG not done/unknown",
      category: "lab",
      group: "imi_bdg",
      notes: "Neutral selection.",
    },
    {
      id: "imi_aspergillus_lfd",
      label: "Aspergillus lateral flow test (LFD/LFA)",
      category: "lab",
      group: "imi_lfd",
      lrPos: 6.65,
      lrNeg: 0.26,
      notes: "Set Present=positive, Absent=negative. Interpret by specimen type and local assay performance.",
      source: {
        short: "Zhang et al. Heliyon",
        year: 2024,
        url: "https://doi.org/10.1016/j.heliyon.2024.e34569",
      },
    },
    {
      id: "imi_lfd_na",
      label: "Aspergillus LFD/LFA not done/unknown",
      category: "lab",
      group: "imi_lfd",
      notes: "Neutral selection.",
    },

    // -------------------------
    // Molecular diagnostics
    // -------------------------
    {
      id: "imi_aspergillus_pcr_bal",
      label: "Aspergillus PCR from BAL",
      category: "micro",
      group: "imi_aspergillus_pcr",
      lrPos: 25.1,
      lrNeg: 0.1,
      notes: "Set Present=positive, Absent=negative. Performance can vary with antifungal exposure and assay method.",
      source: {
        short: "Avni et al. J Clin Microbiol",
        year: 2012,
        url: "https://doi.org/10.1128/JCM.00942-12",
      },
    },
    {
      id: "imi_aspergillus_culture_resp",
      label: "Respiratory culture grows Aspergillus (BAL preferred; sputum less specific)",
      category: "micro",
      group: "imi_aspergillus_culture",
      lrPos: 4.12,
      notes: "Supportive rule-in microbiology, especially when recovered from BAL in a compatible host and imaging context. This LR is conservatively modeled from BAL culture sensitivity 0.40 and specificity 0.903; sputum or other lower-respiratory cultures are more colonization-prone and a negative culture should not be used to exclude invasive mold disease.",
      source: {
        short: "Levy et al. Respir Med",
        year: 1992,
        url: "https://doi.org/10.1016/S0954-6111(06)80062-4",
      },
    },
    {
      id: "imi_aspergillus_culture_na",
      label: "Respiratory fungal culture not done/unknown",
      category: "micro",
      group: "imi_aspergillus_culture",
      notes: "Neutral selection.",
    },
    {
      id: "imi_aspergillus_pcr_plasma",
      label: "Aspergillus PCR from plasma",
      category: "micro",
      group: "imi_aspergillus_pcr",
      lrPos: 5.67,
      lrNeg: 0.06,
      notes: "Set Present=positive, Absent=negative. LR values are calculated from sensitivity 94.7% and specificity 83.3% in a standardized plasma PCR study; evidence is less mature than BAL-based Aspergillus PCR.",
      source: {
        short: "White et al. J Clin Microbiol",
        year: 2015,
        url: "https://doi.org/10.1128/JCM.00904-15",
      },
    },
    {
      id: "imi_aspergillus_pcr_na",
      label: "Aspergillus PCR strategy not done/unknown",
      category: "micro",
      group: "imi_aspergillus_pcr",
      notes: "Neutral selection.",
    },

  ],
};

export const MUCORMYCOSIS_MODULE: SyndromeLRModule = {
  id: "inv_mucormycosis",
  name: "Mucormycosis (Mucorales)",
  description:
    "Mucormycosis probability update using care-setting pretest probability plus selected host risk factors (including diabetes/DKA and iron overload), chest imaging (reverse halo sign, rhino-orbital-cerebral findings), galactomannan negativity as a differentiator, serum BDG, Mucorales PCR from BAL and blood, and culture. Based on Brown et al. 2025 meta-analysis, Jeong et al. 2019 epidemiology, Jang et al. 2025 imaging, and Cornely et al. 2019 global guideline.",
  pretestPresets: [
    {
      id: "muc_low",
      label: "Outpatient / Emergency Department",
      p: 0.0005,
      notes: "Setting-only baseline (very low prevalence; ~2 per million population/year). Add host/risk findings separately below.",
      source: {
        short: "Seidel & Cornely. Dtsch Med Wochenschr 2024",
        year: 2024,
        url: "https://doi.org/10.1055/a-2139-3902",
      },
    },
    {
      id: "muc_heme",
      label: "Hematologic malignancy / neutropenia / HSCT",
      p: 0.02,
      notes: "Setting + host-enriched baseline. Mucormycosis accounts for ~8% of IFI in hematology patients.",
      source: {
        short: "Estagnasié et al. Med Mycol 2024",
        year: 2024,
        url: "https://doi.org/10.1093/mmy/myae102",
      },
    },
    {
      id: "muc_dka",
      label: "Diabetes mellitus or DKA",
      p: 0.01,
      notes: "Setting + host-enriched baseline. DM is the most common underlying condition globally (~40% of cases).",
      source: {
        short: "Jeong et al. Clin Microbiol Infect 2019",
        year: 2019,
        url: "https://doi.org/10.1016/j.cmi.2018.07.011",
      },
    },
    {
      id: "muc_iron",
      label: "Iron overload / deferoxamine therapy",
      p: 0.015,
      notes: "Setting + host-enriched baseline. Deferoxamine acts as a xenosiderophore for Mucorales (Ibrahim 2014).",
      source: {
        short: "Ibrahim. Mycoses 2014",
        year: 2014,
        url: "https://doi.org/10.1111/myc.12232",
      },
    },
    {
      id: "muc_icu",
      label: "ICU with risk factors",
      p: 0.005,
      notes: "Setting + host-enriched baseline in ICU population with additional risk factors.",
      source: {
        short: "Larcher et al. J Fungi 2021",
        year: 2021,
        url: "https://doi.org/10.3390/jof7050330",
      },
    },
  ],
  items: [
    {
      id: "muc_host_neutropenia_hsct",
      label: "Profound neutropenia or recent allogeneic HSCT",
      category: "host",
      lrPos: 3.0,
      lrNeg: 0.85,
      notes: "Consensus major host factor for invasive mold disease; modeled as pretest enrichment.",
      source: {
        short: "Donnelly et al. Clin Infect Dis",
        year: 2020,
        url: "https://doi.org/10.1093/cid/ciz1008",
      },
    },
    {
      id: "muc_host_hematologic_malignancy",
      label: "Active hematologic malignancy (e.g., AML/MDS/relapsed leukemia)",
      category: "host",
      lrPos: 2.2,
      lrNeg: 0.92,
      notes: "Consensus host-risk enricher for mucormycosis.",
      source: {
        short: "Donnelly et al. Clin Infect Dis",
        year: 2020,
        url: "https://doi.org/10.1093/cid/ciz1008",
      },
    },
    {
      id: "muc_host_dka",
      label: "Diabetes mellitus or diabetic ketoacidosis",
      category: "host",
      lrPos: 2.5,
      lrNeg: 0.7,
      notes: "DM was an independent risk factor for mucormycosis: OR 2.49 (95% CI 1.77–3.54). The most common underlying condition globally.",
      source: {
        short: "Jeong et al. Clin Microbiol Infect 2019",
        year: 2019,
        url: "https://doi.org/10.1016/j.cmi.2018.07.011",
      },
    },
    {
      id: "muc_host_iron_overload",
      label: "Iron overload or deferoxamine therapy",
      category: "host",
      lrPos: 3.0,
      lrNeg: 0.9,
      notes: "Deferoxamine acts as a xenosiderophore for Mucorales, enhancing iron acquisition — a key virulence mechanism. Deferasirox is considered safer.",
      source: {
        short: "Ibrahim. Mycoses 2014",
        year: 2014,
        url: "https://doi.org/10.1111/myc.12232",
      },
    },
    {
      id: "muc_host_sot",
      label: "Solid organ transplant recipient",
      category: "host",
      lrPos: 2.0,
      lrNeg: 0.94,
      notes: "SOT associated with pulmonary mucormycosis: OR 3.19 (95% CI 1.50–6.82).",
      source: {
        short: "Jeong et al. Clin Microbiol Infect 2019",
        year: 2019,
        url: "https://doi.org/10.1016/j.cmi.2018.07.011",
      },
    },
    {
      id: "muc_host_steroids",
      label: "Prolonged corticosteroids or significant T-cell immunosuppression",
      category: "host",
      lrPos: 2.0,
      lrNeg: 0.9,
      notes: "Corticosteroids impair phagocyte function against Mucorales. 78.5% of COVID-associated mucormycosis patients received corticosteroids.",
      source: {
        short: "Cornely et al. Lancet Infect Dis 2019",
        year: 2019,
        url: "https://doi.org/10.1016/S1473-3099(19)30312-3",
      },
    },
    {
      id: "muc_host_trauma",
      label: "Trauma or wound exposure (cutaneous mucormycosis context)",
      category: "host",
      lrPos: 2.5,
      lrNeg: 0.85,
      notes: "54% of cutaneous mucormycosis cases were trauma-related; 39.6% had no identified underlying disease.",
      source: {
        short: "Skiada et al. J Fungi 2022",
        year: 2022,
        url: "https://doi.org/10.3390/jof8020194",
      },
    },

    {
      id: "muc_fever_refractory",
      label: "Persistent/refractory fever despite broad-spectrum antibacterials",
      category: "symptom",
      lrPos: 1.4,
      lrNeg: 0.9,
      notes: "Supportive but non-specific in high-risk patients.",
      source: {
        short: "Cornely et al. Lancet Infect Dis 2019",
        year: 2019,
        url: "https://doi.org/10.1016/S1473-3099(19)30312-3",
      },
    },

    {
      id: "muc_ct_reverse_halo",
      label: "Reverse halo sign on chest CT",
      category: "imaging",
      group: "muc_ct",
      lrPos: 4.0,
      lrNeg: 0.3,
      notes: "RHS OR 6.73 (95% CI 2.39–18.98) for pulmonary mucormycosis vs. invasive aspergillosis. Present in 83.9% of hematologic patients with mucormycosis (Ma 2021). LR+ conservatively estimated from OR.",
      source: {
        short: "Jang et al. Mycoses 2025",
        year: 2025,
        url: "https://doi.org/10.1111/myc.70115",
      },
    },
    {
      id: "muc_ct_rhinocerebral",
      label: "Rhino-orbital-cerebral involvement on imaging (sinus/bony erosion/periantral fat invasion)",
      category: "imaging",
      group: "muc_ct",
      lrPos: 5.0,
      lrNeg: 0.4,
      notes: "Bony erosion, periantral fat invasion, and septal ulceration are predictive of invasive fungal disease in sinus involvement. Rhino-orbital-cerebral pattern is characteristic of mucormycosis in diabetic/immunocompromised hosts.",
      source: {
        short: "Lamoth et al. Clin Microbiol Infect 2024",
        year: 2024,
        url: "https://doi.org/10.1016/j.cmi.2023.08.013",
      },
    },
    {
      id: "muc_ct_na",
      label: "CT not done/unknown",
      category: "imaging",
      group: "muc_ct",
      notes: "Neutral selection.",
    },

    {
      id: "muc_gm_negative",
      label: "Serum/BAL galactomannan negative",
      category: "lab",
      group: "muc_gm",
      lrPos: 1.8,
      lrNeg: 0.5,
      notes: "Mucorales do not contain galactomannan in their cell wall. A negative GM in a compatible host shifts probability modestly toward Mucorales/away from Aspergillus, but does not confirm mucormycosis. LR+ is conservatively estimated.",
      source: {
        short: "Cornely et al. Lancet Infect Dis 2019",
        year: 2019,
        url: "https://doi.org/10.1016/S1473-3099(19)30312-3",
      },
    },
    {
      id: "muc_gm_positive",
      label: "Serum/BAL galactomannan positive (consider Aspergillus co-infection)",
      category: "lab",
      group: "muc_gm",
      lrPos: 0.3,
      lrNeg: 2.5,
      notes: "A positive GM argues against isolated mucormycosis. Co-infection with Aspergillus is documented in ~19.5% of aspergillosis cases by plasma Mucorales PCR (Jang 2025). Set Present=GM positive, Absent=GM negative.",
      source: {
        short: "Jang et al. Infect Chemother 2025",
        year: 2025,
        url: "https://doi.org/10.3947/ic.2025.0074",
      },
    },
    {
      id: "muc_gm_na",
      label: "Galactomannan not done/unknown",
      category: "lab",
      group: "muc_gm",
      notes: "Neutral selection.",
    },
    {
      id: "muc_bdg",
      label: "Serum BDG (may be negative in mucormycosis)",
      category: "lab",
      group: "muc_bdg",
      lrPos: 2.0,
      lrNeg: 0.6,
      notes: "Mucorales cell walls contain low/variable amounts of BDG. BDG can be negative in confirmed mucormycosis. Lower diagnostic performance than for Aspergillus.",
      source: {
        short: "Cornely et al. Lancet Infect Dis 2019",
        year: 2019,
        url: "https://doi.org/10.1016/S1473-3099(19)30312-3",
      },
    },
    {
      id: "muc_bdg_na",
      label: "Serum BDG not done/unknown",
      category: "lab",
      group: "muc_bdg",
      notes: "Neutral selection.",
    },

    {
      id: "muc_mucorales_pcr_bal",
      label: "Mucorales PCR from BAL",
      category: "micro",
      group: "muc_pcr",
      lrPos: 23.5,
      lrNeg: 0.03,
      notes: "Set Present=positive, Absent=negative. Pooled sensitivity 97.5%, specificity 95.8% from meta-analysis.",
      source: {
        short: "Brown et al. EClinicalMedicine 2025",
        year: 2025,
        url: "https://doi.org/10.1016/j.eclinm.2025.103115",
      },
    },
    {
      id: "muc_mucorales_pcr_blood",
      label: "Mucorales PCR from blood",
      category: "micro",
      group: "muc_pcr",
      lrPos: 18.3,
      lrNeg: 0.19,
      notes: "Set Present=positive, Absent=negative. Pooled sensitivity 81.6%, specificity 95.5% from meta-analysis.",
      source: {
        short: "Brown et al. EClinicalMedicine 2025",
        year: 2025,
        url: "https://doi.org/10.1016/j.eclinm.2025.103115",
      },
    },
    {
      id: "muc_mucorales_pcr_na",
      label: "Mucorales PCR not done/unknown",
      category: "micro",
      group: "muc_pcr",
      notes: "Neutral selection.",
    },
    {
      id: "muc_culture_resp",
      label: "Respiratory culture growing Mucorales",
      category: "micro",
      group: "muc_culture",
      lrPos: 15.0,
      notes: "Recovery of Mucorales from BAL or sputum in a compatible host is strongly suggestive. Negative culture does not exclude mucormycosis. LR+ conservatively estimated.",
      source: {
        short: "Cornely et al. Lancet Infect Dis 2019",
        year: 2019,
        url: "https://doi.org/10.1016/S1473-3099(19)30312-3",
      },
    },
    {
      id: "muc_culture_na",
      label: "Respiratory fungal culture not done/unknown",
      category: "micro",
      group: "muc_culture",
      notes: "Neutral selection.",
    },
  ],
};

export const INVASIVE_CANDIDIASIS_MODULE: SyndromeLRModule = {
  id: "inv_candida",
  name: "Invasive Candidiasis",
  description:
    "Invasive candidiasis probability update using care-setting pretest probability plus selected risk factors (host findings), serum biomarkers, molecular diagnostics, and culture-based confirmation.",
  pretestPresets: [
    {
      id: "icand_low",
      label: "Outpatient / Emergency Department",
      p: 0.002,
      notes: "Setting-only baseline (low prevalence). Add host/risk findings separately below.",
      source: {
        short: "Clancy and Nguyen. Clin Infect Dis",
        year: 2013,
        url: "https://doi.org/10.1093/cid/cit006",
      },
    },
    {
      id: "icand_icu_risk",
      label: "Hospitalized (non-ICU)",
      p: 0.006,
      notes: "Setting-only baseline. Add host/risk findings separately below.",
      source: {
        short: "Clancy and Nguyen. Clin Infect Dis",
        year: 2013,
        url: "https://doi.org/10.1093/cid/cit006",
      },
    },
    {
      id: "icand_high",
      label: "ICU",
      p: 0.01,
      notes: "Setting-only baseline (typical ICU incidence is generally low single-digit percentages). Add host/risk findings separately below.",
      source: {
        short: "Bassetti et al. Crit Care",
        year: 2019,
        url: "https://doi.org/10.1186/s13054-019-2497-3",
      },
    },
  ],
  items: [
    // -------------------------
    // Candida Score components
    // (OR-informed LR approximations from derivation cohort)
    // -------------------------
    {
      id: "icand_component_tpn",
      label: "Total parenteral nutrition",
      category: "host",
      lrPos: 1.6,
      lrNeg: 0.92,
      notes: "Candida Score component; modeled as an OR-informed risk enricher rather than a standalone diagnostic test.",
      source: {
        short: "León et al. Crit Care Med",
        year: 2006,
        url: "https://doi.org/10.1097/01.CCM.0000202208.37364.7D",
      },
    },
    {
      id: "icand_component_surgery",
      label: "Recent surgery",
      category: "host",
      lrPos: 1.7,
      lrNeg: 0.9,
      notes: "Candida Score component; modeled as an OR-informed risk enricher rather than a standalone diagnostic test.",
      source: {
        short: "León et al. Crit Care Med",
        year: 2006,
        url: "https://doi.org/10.1097/01.CCM.0000202208.37364.7D",
      },
    },
    {
      id: "icand_component_multifocal_colonization",
      label: "Multifocal Candida colonization",
      category: "micro",
      lrPos: 2.3,
      lrNeg: 0.85,
      notes: "Candida Score component; stronger enrichment when colonization is documented at multiple non-blood sites.",
      source: {
        short: "León et al. Crit Care Med",
        year: 2006,
        url: "https://doi.org/10.1097/01.CCM.0000202208.37364.7D",
      },
    },
    {
      id: "icand_component_severe_sepsis",
      label: "Severe sepsis/septic shock",
      category: "vital",
      lrPos: 2.8,
      lrNeg: 0.85,
      notes: "Candida Score component with the highest weighting in the original score derivation.",
      source: {
        short: "León et al. Crit Care Med",
        year: 2006,
        url: "https://doi.org/10.1097/01.CCM.0000202208.37364.7D",
      },
    },

    // -------------------------
    // Serum biomarkers
    // -------------------------
    {
      id: "icand_bdg_serum",
      label: "Serum beta-D-glucan (BDG)",
      category: "lab",
      group: "icand_bdg",
      lrPos: 5.22,
      lrNeg: 0.27,
      notes: "Pan-fungal biomarker; values derived from pooled IFI performance and interpreted as supportive (not Candida-specific).",
      source: {
        short: "Karageorgopoulos et al. Clin Infect Dis",
        year: 2011,
        url: "https://doi.org/10.1093/cid/ciq206",
      },
    },
    {
      id: "icand_bdg_na",
      label: "Serum BDG not done/unknown",
      category: "lab",
      group: "icand_bdg",
      notes: "Neutral selection.",
    },
    {
      id: "icand_mannan_antimannan",
      label: "Combined mannan + anti-mannan assay",
      category: "lab",
      group: "icand_mannan",
      lrPos: 5.93,
      lrNeg: 0.2,
      notes: "Set Present=positive combined assay, Absent=negative combined assay.",
      source: {
        short: "Mikulska et al. Crit Care",
        year: 2010,
        url: "https://doi.org/10.1186/cc9365",
      },
    },
    {
      id: "icand_mannan_na",
      label: "Mannan/anti-mannan testing not done/unknown",
      category: "lab",
      group: "icand_mannan",
      notes: "Neutral selection.",
    },

    // -------------------------
    // Molecular diagnostics
    // -------------------------
    {
      id: "icand_t2candida",
      label: "T2Candida panel",
      category: "micro",
      group: "icand_t2",
      lrPos: 10.16,
      lrNeg: 0.08,
      notes: "Set Present=positive, Absent=negative. High NPV performance in pooled analyses.",
      source: {
        short: "Tang et al. BMC Infect Dis",
        year: 2019,
        url: "https://doi.org/10.1186/s12879-019-4419-z",
      },
    },
    {
      id: "icand_t2_na",
      label: "T2Candida not done/unknown",
      category: "micro",
      group: "icand_t2",
      notes: "Neutral selection.",
    },
    {
      id: "icand_pcr_blood",
      label: "Candida PCR from blood",
      category: "micro",
      group: "icand_pcr",
      lrPos: 11.88,
      lrNeg: 0.05,
      notes: "Set Present=positive, Absent=negative.",
      source: {
        short: "Avni et al. J Clin Microbiol",
        year: 2011,
        url: "https://doi.org/10.1128/JCM.01602-10",
      },
    },
    {
      id: "icand_pcr_na",
      label: "Candida PCR not done/unknown",
      category: "micro",
      group: "icand_pcr",
      notes: "Neutral selection.",
    },

    // -------------------------
    // Culture confirmation
    // -------------------------
    {
      id: "icand_culture_positive",
      label: "Blood/sterile-site culture positive for Candida",
      category: "micro",
      group: "icand_culture",
      lrPos: 20,
      notes: "Strong rule-in finding. A negative blood culture should not be used to exclude invasive candidiasis.",
      source: {
        short: "Clancy and Nguyen. J Fungi",
        year: 2018,
        url: "https://doi.org/10.3390/jof4010027",
      },
    },
    {
      id: "icand_culture_na",
      label: "Culture strategy not done/unknown",
      category: "micro",
      group: "icand_culture",
      notes: "Neutral selection.",
    },
  ],
};

export const PJI_MODULE: SyndromeLRModule = {
  id: "pji",
  name: "PJI",
  description:
    "Chronic hip/knee periprosthetic joint infection probability update using evidence-backed Stage 0 context priors plus a staged evidence pathway: one serum anchor, one aspiration-zone interpretation, one reflex synovial adjunct block, then confirmatory microbiology and supportive imaging.",
  pretestPresets: [
    {
      id: "pji_low",
      label: "Planned revision for presumed aseptic failure",
      p: 0.1,
      notes:
        "Stage 0 chronic-PJI prior anchored to presumed aseptic revision cohorts, where unsuspected infection or unexpected positive cultures cluster around 7-13%. Use before modeled biomarkers. Do not use for sinus tract, acute postoperative, hematogenous, or overtly septic presentations.",
      source: {
        short: "Jacobs et al. Bone Joint J",
        year: 2017,
        url: "https://pubmed.ncbi.nlm.nih.gov/29092987/",
      },
    },
    {
      id: "pji_intermediate",
      label: "Outpatient chronic painful arthroplasty work-up",
      p: 0.2,
      notes:
        "Representative Stage 0 chronic-work-up prior. This 20% anchor is evidence-supported by preoperative biomarker-validation cohorts near 20.7%, but should still be interpreted as a context prior before modeled biomarkers rather than a universal prevalence estimate.",
      source: {
        short: "Parr et al. Cureus",
        year: 2025,
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12074866/",
      },
    },
    {
      id: "pji_high",
      label: "Tertiary referral for unresolved chronic PJI concern",
      p: 0.3,
      notes:
        "Upper-context Stage 0 chronic-PJI prior set conservatively below enriched referral cohorts reporting roughly 38-49% prevalence, to avoid importing biomarker- and referral-conditioned information into the starting probability.",
      source: {
        short: "Sigmund et al. Bone Joint Res",
        year: 2022,
        url: "https://pubmed.ncbi.nlm.nih.gov/36047011/",
      },
    },
  ],
  items: [
    // -------------------------
    // Host risk factors
    // (OR-informed approximations where direct pooled LRs are unavailable)
    // -------------------------
    {
      id: "pji_host_revision_arthroplasty",
      label: "Prior revision arthroplasty",
      category: "host",
      lrPos: 2.2,
      lrNeg: 0.9,
      notes: "Approximate enrichment from pooled observational risk-factor data.",
      source: {
        short: "Zhu et al. Int Wound J",
        year: 2016,
        url: "https://doi.org/10.1111/iwj.12465",
      },
    },
    {
      id: "pji_host_obesity",
      label: "Obesity (roughly BMI >=30)",
      category: "host",
      lrPos: 1.4,
      lrNeg: 0.95,
      notes: "Modeled as a modest pretest risk enricher.",
      source: {
        short: "Zhu et al. Int Wound J",
        year: 2016,
        url: "https://doi.org/10.1111/iwj.12465",
      },
    },
    {
      id: "pji_host_diabetes",
      label: "Diabetes mellitus",
      category: "host",
      lrPos: 1.5,
      lrNeg: 0.95,
      notes: "Modeled as a modest pretest risk enricher.",
      source: {
        short: "Zhu et al. Int Wound J",
        year: 2016,
        url: "https://doi.org/10.1111/iwj.12465",
      },
    },
    {
      id: "pji_host_ra_immunosuppression",
      label: "Rheumatoid arthritis or meaningful immunosuppression",
      category: "host",
      lrPos: 1.8,
      lrNeg: 0.95,
      notes: "Risk-factor enrichment from pooled observational datasets.",
      source: {
        short: "Zhu et al. Int Wound J",
        year: 2016,
        url: "https://doi.org/10.1111/iwj.12465",
      },
    },

    // -------------------------
    // Symptoms
    // -------------------------
    {
      id: "pji_sym_joint_pain",
      label: "Persistent or worsening pain in prosthetic joint",
      category: "symptom",
      lrPos: 1.4,
      lrNeg: 0.8,
      notes: "Common but non-specific; best interpreted with labs and aspiration data.",
      source: {
        short: "Cortes-Penfield et al. Clin Infect Dis",
        year: 2023,
        url: "https://doi.org/10.1093/cid/ciac992",
      },
    },
    {
      id: "pji_vital_fever",
      label: "Fever (>=38 C)",
      category: "vital",
      lrPos: 1.3,
      lrNeg: 0.95,
      notes: "Absent fever does not exclude PJI, especially chronic presentations.",
      source: {
        short: "Cortes-Penfield et al. Clin Infect Dis",
        year: 2023,
        url: "https://doi.org/10.1093/cid/ciac992",
      },
    },
    {
      id: "pji_sym_local_inflammation",
      label: "Local erythema, warmth, swelling, or drainage",
      category: "exam",
      lrPos: 1.8,
      lrNeg: 0.8,
      notes: "Physical exam finding; supportive but not definitive without microbiologic correlation.",
      source: {
        short: "Cortes-Penfield et al. Clin Infect Dis",
        year: 2023,
        url: "https://doi.org/10.1093/cid/ciac992",
      },
    },
    {
      id: "pji_exam_sinus_tract",
      label: "Sinus tract communicating with prosthesis",
      category: "exam",
      lrPos: 30,
      lrNeg: 0.95,
      notes: "Major diagnostic criterion with very high rule-in value.",
      source: {
        short: "Parvizi et al. J Arthroplasty",
        year: 2018,
        url: "https://doi.org/10.1016/j.arth.2018.09.028",
      },
    },

    // -------------------------
    // Blood and synovial laboratory tests
    // -------------------------
    {
      id: "pji_crp",
      label: "CRP elevated (preferred serum anchor)",
      category: "lab",
      group: "pji_serum_inflammation",
      lrPos: 3.6,
      lrNeg: 0.27,
      notes: "Preferred Stage 2 serum anchor for the chronic-PJI pathway. Set Present=above threshold, Absent=below threshold. Do not stack with ESR as if they were independent evidence.",
      source: {
        short: "Sigmund et al. JBJI",
        year: 2025,
        url: "https://pubmed.ncbi.nlm.nih.gov/41230391/",
      },
    },
    {
      id: "pji_esr",
      label: "ESR elevated (alternative serum anchor)",
      category: "lab",
      group: "pji_serum_inflammation",
      lrPos: 4.99,
      lrNeg: 0.31,
      notes: "Alternative Stage 2 serum marker when ESR is the main serum anchor locally. Do not stack with CRP as if they were independent evidence.",
      source: {
        short: "Tarabichi et al. J Arthroplasty",
        year: 2024,
        url: "https://doi.org/10.1016/j.arth.2024.02.030",
      },
    },
    {
      id: "pji_serum_marker_na",
      label: "No serum inflammatory anchor selected",
      category: "lab",
      group: "pji_serum_inflammation",
      notes: "Neutral selection when no single serum anchor is being used.",
    },
    {
      id: "pji_aspiration_low_zone",
      label: "Aspiration low zone (WBC <=1500/uL and/or PMN <=65%)",
      category: "lab",
      group: "pji_aspiration_zone",
      lrPos: 0.053,
      notes: "Representative low-cellularity aspiration anchor. The LR is anchored conservatively to the PMN <=65% rule-out threshold from Sabater-Martos 2025; WBC <=1500/uL is also strongly supportive of a low-probability pattern but the reported rounded 100% sensitivity makes its exact negative LR unstable.",
      source: {
        short: "Sabater-Martos et al. JBJI",
        year: 2025,
        url: "https://pubmed.ncbi.nlm.nih.gov/40385309/",
      },
    },
    {
      id: "pji_aspiration_intermediate_zone",
      label: "Aspiration intermediate or discordant zone",
      category: "lab",
      group: "pji_aspiration_zone",
      notes: "Use for WBC/PMN results in the gray zone or when the two markers disagree. This is intentionally treated as a qualitative uncertainty state rather than a single pooled LR. Reflex to leukocyte esterase, alpha-defensin, calprotectin, culture, or multidisciplinary review.",
      source: {
        short: "Sabater-Martos et al. JBJI",
        year: 2025,
        url: "https://pubmed.ncbi.nlm.nih.gov/40385309/",
      },
    },
    {
      id: "pji_aspiration_high_zone",
      label: "Aspiration high zone (WBC >=3000/uL and/or PMN >=75%)",
      category: "lab",
      group: "pji_aspiration_zone",
      lrPos: 59.1,
      notes: "Representative high-cellularity aspiration anchor. The LR is anchored to the WBC >=3000/uL rule-in threshold from Sabater-Martos 2025; PMN >=75% is similar but slightly less extreme. This pattern supports likely PJI, especially when paired with a positive serum or synovial adjunct block.",
      source: {
        short: "Sabater-Martos et al. JBJI",
        year: 2025,
        url: "https://pubmed.ncbi.nlm.nih.gov/40385309/",
      },
    },
    {
      id: "pji_aspiration_zone_na",
      label: "No aspiration zone assigned",
      category: "lab",
      group: "pji_aspiration_zone",
      notes: "Neutral selection when no interpretable WBC/PMN aspiration zone is available.",
    },
    {
      id: "pji_alpha_defensin_elisa",
      label: "Synovial alpha-defensin (ELISA laboratory assay)",
      category: "lab",
      group: "pji_synovial_marker",
      lrPos: 41.8,
      lrNeg: 0.12,
      notes: "Alternative Stage 4 reflex synovial adjunct. Use when aspiration remains intermediate or discordant, and do not stack with leukocyte esterase as if they were fully independent evidence.",
      source: {
        short: "Paul et al. JBJI",
        year: 2025,
        url: "https://doi.org/10.5194/jbji-10-525-2025",
      },
    },
    {
      id: "pji_alpha_defensin_lateral_flow",
      label: "Synovial alpha-defensin (lateral flow)",
      category: "lab",
      group: "pji_synovial_marker",
      lrPos: 17.0,
      lrNeg: 0.23,
      notes: "Point-of-care alternative reflex synovial adjunct with lower sensitivity than ELISA. Use as an alternative, not as an additive same-block test with leukocyte esterase.",
      source: {
        short: "Paul et al. JBJI",
        year: 2025,
        url: "https://doi.org/10.5194/jbji-10-525-2025",
      },
    },
    {
      id: "pji_leukocyte_esterase",
      label: "Synovial leukocyte esterase strip",
      category: "lab",
      group: "pji_synovial_marker",
      lrPos: 20.4,
      lrNeg: 0.13,
      notes: "Preferred Stage 4 reflex synovial adjunct for unresolved aspiration results. Strong rule-in value in pooled analyses; do not stack with alpha-defensin as if they were independent evidence.",
      source: {
        short: "Poursalehian et al. Arthroplasty",
        year: 2025,
        url: "https://doi.org/10.1186/s42836-025-00325-y",
      },
    },
    {
      id: "pji_synovial_marker_na",
      label: "Synovial biomarker testing not done/unknown",
      category: "lab",
      group: "pji_synovial_marker",
      notes: "Neutral selection.",
    },

    // -------------------------
    // Microbiology
    // -------------------------
    {
      id: "pji_synovial_fluid_culture",
      label: "Preoperative synovial fluid culture",
      category: "micro",
      group: "pji_culture_strategy",
      lrPos: 15.8,
      lrNeg: 0.39,
      notes: "Set Present=positive, Absent=negative.",
      source: {
        short: "Watanabe et al. J Arthroplasty",
        year: 2024,
        url: "https://doi.org/10.1016/j.arth.2024.03.016",
      },
    },
    {
      id: "pji_intraop_tissue_culture",
      label: "Intraoperative periprosthetic tissue culture",
      category: "micro",
      group: "pji_culture_strategy",
      lrPos: 8.9,
      lrNeg: 0.32,
      notes: "Set Present=positive, Absent=negative.",
      source: {
        short: "Watanabe et al. J Arthroplasty",
        year: 2024,
        url: "https://doi.org/10.1016/j.arth.2024.03.016",
      },
    },
    {
      id: "pji_sonication_culture",
      label: "Sonication fluid culture (removed prosthesis)",
      category: "micro",
      group: "pji_culture_strategy",
      lrPos: 8.7,
      lrNeg: 0.24,
      notes: "Set Present=positive, Absent=negative.",
      source: {
        short: "Watanabe et al. J Arthroplasty",
        year: 2024,
        url: "https://doi.org/10.1016/j.arth.2024.03.016",
      },
    },
    {
      id: "pji_culture_na",
      label: "Culture strategy not done/unknown",
      category: "micro",
      group: "pji_culture_strategy",
      notes: "Neutral selection.",
    },
    {
      id: "pji_synovial_pcr",
      label: "Synovial PCR for bacterial detection",
      category: "micro",
      group: "pji_pcr_strategy",
      lrPos: 12.7,
      lrNeg: 0.26,
      notes: "Set Present=positive, Absent=negative.",
      source: {
        short: "Jun et al. Surg Infect",
        year: 2018,
        url: "https://doi.org/10.1089/sur.2018.014",
      },
    },
    {
      id: "pji_pcr_na",
      label: "Synovial PCR not done/unknown",
      category: "micro",
      group: "pji_pcr_strategy",
      notes: "Neutral selection.",
    },

    // -------------------------
    // Imaging
    // -------------------------
    {
      id: "pji_xray_supportive",
      label: "Plain radiograph suggestive of infection (rapid loosening/osteolysis/periosteal reaction)",
      category: "imaging",
      group: "pji_imaging",
      lrPos: 2.0,
      lrNeg: 0.7,
      notes: "Supportive finding with limited standalone discrimination.",
      source: {
        short: "Cortes-Penfield et al. Clin Infect Dis",
        year: 2023,
        url: "https://doi.org/10.1093/cid/ciac992",
      },
    },
    {
      id: "pji_imaging_na",
      label: "Imaging not done/unknown",
      category: "imaging",
      group: "pji_imaging",
      notes: "Neutral selection.",
    },
  ],
};

const SRC_CAP_GUIDELINE: LRSource = {
  short: "Metlay et al. ATS/IDSA",
  year: 2019,
  url: "https://doi.org/10.1164/rccm.201908-1581ST",
};

const SRC_CAP_CLINICAL: LRSource = {
  short: "Metlay et al. JAMA",
  year: 1997,
  url: "https://doi.org/10.1001/jama.278.17.1440",
};

const SRC_CAP_BIOMARKER: LRSource = {
  short: "Ebell et al. Acad Emerg Med",
  year: 2020,
  url: "https://doi.org/10.1111/acem.13889",
};

const SRC_CDI_GUIDELINE_2021: LRSource = {
  short: "Johnson et al. IDSA/SHEA",
  year: 2021,
  url: "https://doi.org/10.1093/cid/ciab549",
};

const SRC_CDI_TEST_META: LRSource = {
  short: "Kraft et al. Clin Microbiol Rev",
  year: 2019,
  url: "https://doi.org/10.1128/CMR.00032-18",
};

const SRC_UTI_GUIDELINE: LRSource = {
  short: "Gupta et al. IDSA/ESCMID",
  year: 2011,
  url: "https://doi.org/10.1093/cid/ciq257",
};

const SRC_UTI_CLINICAL: LRSource = {
  short: "Bent et al. JAMA",
  year: 2002,
  url: "https://doi.org/10.1001/jama.287.20.2701",
};

const SRC_UTI_DIPSTICK_META: LRSource = {
  short: "Deville et al. BMC Urol",
  year: 2004,
  url: "https://doi.org/10.1186/1471-2490-4-4",
};

const SRC_ENDO_ESC_2023: LRSource = {
  short: "Delgado et al. ESC Endocarditis",
  year: 2023,
  url: "https://doi.org/10.1093/eurheartj/ehad193",
};

const SRC_ENDO_DUKE_2023: LRSource = {
  short: "Fowler et al. Duke-ISCVID",
  year: 2023,
  url: "https://doi.org/10.1093/cid/ciad271",
};

const SRC_ENDO_TTE_META: LRSource = {
  short: "Bai et al. JASE",
  year: 2017,
  url: "https://doi.org/10.1016/j.echo.2017.03.007",
};

const SRC_ENDO_PET_META: LRSource = {
  short: "San et al. Open Heart",
  year: 2022,
  url: "https://doi.org/10.1136/openhrt-2021-001856",
};

const SRC_ENDO_VIRSTA_2016: LRSource = {
  short: "Tubiana et al. J Infect",
  year: 2016,
  url: "https://doi.org/10.1016/j.jinf.2016.04.005",
};

const SRC_ENDO_VIRSTA_EXT_2021: LRSource = {
  short: "Peinado-Acevedo et al. Clin Infect Dis",
  year: 2021,
  url: "https://doi.org/10.1093/cid/ciaa1844",
};

const SRC_ENDO_DENOVA_2018: LRSource = {
  short: "Berge et al. Infection",
  year: 2019,
  url: "https://doi.org/10.1007/s15010-018-1208-3",
};

const SRC_ENDO_HANDOC_2018: LRSource = {
  short: "Sunnerhagen et al. Clin Infect Dis",
  year: 2018,
  url: "https://doi.org/10.1093/cid/cix880",
};

const SRC_VAP_DIAG_META_2020: LRSource = {
  short: "Fernando et al. Intensive Care Med",
  year: 2020,
  url: "https://doi.org/10.1007/s00134-020-06036-z",
};

const SRC_VAP_GUIDELINE_2016: LRSource = {
  short: "Kalil et al. ATS/IDSA HAP/VAP",
  year: 2016,
  url: "https://doi.org/10.1093/cid/ciw353",
};

const SRC_VAP_INCIDENCE_COOK_1998: LRSource = {
  short: "Cook et al. Ann Intern Med",
  year: 1998,
  url: "https://doi.org/10.7326/0003-4819-129-6-199809150-00002",
};

const SRC_VAP_OXYGENATION_FERRER_2019: LRSource = {
  short: "Ferrer et al. J Clin Med",
  year: 2019,
  url: "https://doi.org/10.3390/jcm8081217",
};

function withEvidenceSources(
  module: SyndromeLRModule,
  opts: {
    pretestSource: LRSource;
    resolveItemSource: (item: LRItem) => LRSource;
  }
): SyndromeLRModule {
  return {
    ...module,
    pretestPresets: module.pretestPresets.map((p) =>
      p.source ? p : { ...p, source: opts.pretestSource }
    ),
    items: module.items.map((item) =>
      item.source ? item : { ...item, source: opts.resolveItemSource(item) }
    ),
  };
}

const CAP_MODULE_WITH_SOURCES = withEvidenceSources(CAP_MODULE, {
  pretestSource: SRC_CAP_GUIDELINE,
  resolveItemSource: (item) => {
    if (item.id === "cap_procal_high") return SRC_CAP_BIOMARKER;
    if (item.category === "symptom" || item.category === "vital" || item.category === "exam") {
      return SRC_CAP_CLINICAL;
    }
    return SRC_CAP_GUIDELINE;
  },
});

const CDI_MODULE_WITH_SOURCES = withEvidenceSources(CDI_MODULE, {
  pretestSource: SRC_CDI_GUIDELINE_2021,
  resolveItemSource: (item) => (item.category === "micro" ? SRC_CDI_TEST_META : SRC_CDI_GUIDELINE_2021),
});

const UTI_MODULE_WITH_SOURCES = withEvidenceSources(UTI_MODULE, {
  pretestSource: SRC_UTI_GUIDELINE,
  resolveItemSource: (item) => {
    if (item.category === "lab") return SRC_UTI_DIPSTICK_META;
    if (item.category === "symptom" || item.category === "exam" || item.category === "vital") {
      return SRC_UTI_CLINICAL;
    }
    return SRC_UTI_GUIDELINE;
  },
});

const VAP_MODULE_WITH_SOURCES = withEvidenceSources(VAP_MODULE, {
  pretestSource: SRC_VAP_INCIDENCE_COOK_1998,
  resolveItemSource: (item) => {
    if (item.id === "vap_hypoxemia_pf240") return SRC_VAP_OXYGENATION_FERRER_2019;
    if (item.id === "vap_pct_elevated" || item.id === "vap_pct_na") return SRC_VAP_GUIDELINE_2016;
    return SRC_VAP_DIAG_META_2020;
  },
});

const ENDO_MODULE_WITH_SOURCES = withEvidenceSources(ENDO_MODULE, {
  pretestSource: SRC_ENDO_ESC_2023,
  resolveItemSource: (item) => {
    if (item.id === "endo_tte" || item.id === "endo_tte_na") return SRC_ENDO_TTE_META;
    if (item.id === "endo_pet" || item.id === "endo_pet_na") return SRC_ENDO_PET_META;
    if (item.id === "endo_tee") return SRC_ENDO_ESC_2023;
    if (item.id === "endo_virsta_high") return SRC_ENDO_VIRSTA_EXT_2021;
    if (item.id === "endo_virsta_na") return SRC_ENDO_VIRSTA_2016;
    if (item.id === "endo_denova_high" || item.id === "endo_denova_na") {
      return SRC_ENDO_DENOVA_2018;
    }
    if (item.id === "endo_handoc_high" || item.id === "endo_handoc_na") {
      return SRC_ENDO_HANDOC_2018;
    }
    return SRC_ENDO_DUKE_2023;
  },
});


export const PROBID_MODULES: SyndromeLRModule[] = [
  CAP_MODULE_WITH_SOURCES,
  VAP_MODULE_WITH_SOURCES,
  CDI_MODULE_WITH_SOURCES,
  UTI_MODULE_WITH_SOURCES,
  ENDO_MODULE_WITH_SOURCES,
  ACTIVE_TB_MODULE,
  PJP_MODULE,
  INVASIVE_CANDIDIASIS_MODULE,
  INVASIVE_ASPERGILLOSIS_MODULE,
  MUCORMYCOSIS_MODULE,
  PJI_MODULE,
];
