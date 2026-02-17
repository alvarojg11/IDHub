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
    "Infective endocarditis probability update using host risk + organism-specific microbiology + risk-score context (PREDICT / DENOVA / HANDOC) + imaging (TTE/TEE) ± FDG PET/CT. Imaging LRs derived from published sensitivity/specificity where available; several organism/risk-score LRs are starter scaffolds—replace with curated local evidence. Beware correlated Duke elements.",
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
    {
      id: "endo_sab_risk_context",
      label: "S. aureus bacteremia high-risk context (community onset, persistent bacteremia, or intracardiac prosthesis)",
      category: "host",
      lrPos: 2.2,
      lrNeg: 0.8,
      notes: "Use mainly when S. aureus bacteremia is present. Avoid stacking with PREDICT if already applied.",
    },
    {
      id: "endo_efaecalis_risk_context",
      label: "E. faecalis bacteremia high-risk context (unknown source, valve disease, prolonged symptoms)",
      category: "host",
      lrPos: 2.4,
      lrNeg: 0.75,
      notes: "Use mainly when Enterococcus faecalis bacteremia is present. Avoid stacking with DENOVA if already applied.",
    },
    {
      id: "endo_nbhs_risk_context",
      label: "Non-beta-hemolytic streptococcal bacteremia high-risk context (community acquisition, >=2 positive sets, prolonged symptoms)",
      category: "host",
      lrPos: 2.0,
      lrNeg: 0.8,
      notes: "Use mainly when NBHS bacteremia is present. Avoid stacking with HANDOC if already applied.",
    },

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
      id: "endo_predict_day1_high",
      label: "PREDICT (SAB) day-1 score >=4",
      category: "lab",
      group: "endo_predict",
      lrPos: 5.3,
      lrNeg: 0.82,
      notes: "Rule-in oriented threshold for S. aureus bacteremia.",
    },
    {
      id: "endo_predict_day5_high",
      label: "PREDICT (SAB) day-5 score >=2",
      category: "lab",
      group: "endo_predict",
      lrPos: 2.0,
      lrNeg: 0.26,
      notes: "Use when day-5 data available; stronger for ruling out when below threshold.",
    },
    {
      id: "endo_predict_na",
      label: "PREDICT not applied/unknown",
      category: "lab",
      group: "endo_predict",
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
    "Active pulmonary TB probability update using setting prevalence, host risk, symptom screen strategy, immune-based tests (QFT/TST), respiratory microbiology (MTB PCR, AFB smear, culture), and chest X-ray. LRs use pooled estimates where available.",
  pretestPresets: [
    {
      id: "tb_low",
      label: "Low-prevalence setting (no major TB exposure/travel risk)",
      p: 0.02,
      notes: "Use as a starting point in low-incidence settings before adding risk factors/findings.",
      source: {
        short: "WHO Global TB Report",
        year: 2024,
        url: "https://www.who.int/publications/i/item/9789240101531",
      },
    },
    {
      id: "tb_intermediate",
      label: "Intermediate prevalence (born in or traveled to endemic region)",
      p: 0.08,
      notes: "For patients from/intermittently exposed to moderate-to-high incidence settings.",
      source: {
        short: "WHO Global TB Report",
        year: 2024,
        url: "https://www.who.int/publications/i/item/9789240101531",
      },
    },
    {
      id: "tb_high",
      label: "High prevalence or recent close exposure to contagious TB",
      p: 0.20,
      notes: "Higher baseline risk when epidemiology/exposure is strongly suggestive.",
      source: {
        short: "Fox et al. PLoS Med",
        year: 2013,
        url: "https://doi.org/10.1371/journal.pmed.1001432",
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
    "Pneumocystis jirovecii pneumonia probability update using risk setting, host factors, vitals, serum BDG, respiratory diagnostics (PCR/DFA), and chest imaging.",
  pretestPresets: [
    {
      id: "pjp_low",
      label: "Low risk: no meaningful immunosuppression",
      p: 0.01,
      notes: "Very low baseline probability in patients without classic host risk factors.",
      source: {
        short: "Mappin-Kasirer et al. BMC Infect Dis",
        year: 2024,
        url: "https://doi.org/10.1186/s12879-024-09957-y",
      },
    },
    {
      id: "pjp_moderate",
      label: "Moderate risk: some immunosuppression, usually not meeting prophylaxis criteria",
      p: 0.08,
      notes: "Intermediate pretest setting before adding diagnostic findings.",
      source: {
        short: "Mappin-Kasirer et al. BMC Infect Dis",
        year: 2024,
        url: "https://doi.org/10.1186/s12879-024-09957-y",
      },
    },
    {
      id: "pjp_high",
      label: "High risk: AIDS, transplant, prolonged steroids, or similar high-risk state",
      p: 0.25,
      notes: "High pretest context where rapid diagnostics and empiric decisions are often needed.",
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

export const PJI_MODULE: SyndromeLRModule = {
  id: "pji",
  name: "PJI",
  description:
    "Prosthetic joint infection probability update using clinical setting, host risk factors, inflammatory markers, synovial biomarkers, microbiology, and supportive imaging.",
  pretestPresets: [
    {
      id: "pji_low",
      label: "Low concern: painful prosthesis without clear inflammatory/infectious features",
      p: 0.05,
      notes: "Low-prevalence context where aseptic causes remain more likely.",
      source: {
        short: "Cortes-Penfield et al. Clin Infect Dis",
        year: 2023,
        url: "https://doi.org/10.1093/cid/ciac992",
      },
    },
    {
      id: "pji_intermediate",
      label: "Intermediate concern: painful prosthesis with inflammatory/infectious features",
      p: 0.20,
      notes: "Intermediate pretest setting before synovial/microbiologic data.",
      source: {
        short: "Cortes-Penfield et al. Clin Infect Dis",
        year: 2023,
        url: "https://doi.org/10.1093/cid/ciac992",
      },
    },
    {
      id: "pji_high",
      label: "High concern: sinus tract, or strong suspicion",
      p: 0.45,
      notes: "High pretest setting where expedited aspiration and microbiology are central.",
      source: {
        short: "Parvizi et al. J Arthroplasty",
        year: 2018,
        url: "https://doi.org/10.1016/j.arth.2018.09.028",
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
    // Symptoms / signs
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
      id: "pji_sym_local_inflammation",
      label: "Local erythema, warmth, swelling, or drainage",
      category: "symptom",
      lrPos: 1.8,
      lrNeg: 0.8,
      notes: "Supportive but not definitive without microbiologic correlation.",
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
      label: "C-reactive protein elevated",
      category: "lab",
      lrPos: 3.01,
      lrNeg: 0.14,
      notes: "Set Present=above selected threshold, Absent=below threshold.",
      source: {
        short: "Tarabichi et al. J Arthroplasty",
        year: 2024,
        url: "https://doi.org/10.1016/j.arth.2024.02.030",
      },
    },
    {
      id: "pji_esr",
      label: "ESR elevated",
      category: "lab",
      lrPos: 4.99,
      lrNeg: 0.31,
      notes: "Set Present=above selected threshold, Absent=below threshold.",
      source: {
        short: "Tarabichi et al. J Arthroplasty",
        year: 2024,
        url: "https://doi.org/10.1016/j.arth.2024.02.030",
      },
    },
    {
      id: "pji_alpha_defensin_elisa",
      label: "Synovial alpha-defensin (ELISA laboratory assay)",
      category: "lab",
      group: "pji_synovial_marker",
      lrPos: 41.8,
      lrNeg: 0.12,
      notes: "Set Present=positive, Absent=negative. Very strong rule-in performance in pooled analyses.",
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
      notes: "Set Present=positive, Absent=negative. Point-of-care format with lower sensitivity vs ELISA.",
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
      notes: "Set Present=positive, Absent=negative. Strong diagnostic utility in pooled analyses.",
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

const SRC_ENDO_PREDICT_2015: LRSource = {
  short: "Tubiana et al. Clin Infect Dis",
  year: 2015,
  url: "https://doi.org/10.1093/cid/civ235",
};

const SRC_ENDO_PREDICT_EXT: LRSource = {
  short: "Peinado-Acevedo et al. Clin Infect Dis",
  year: 2022,
  url: "https://doi.org/10.1093/cid/ciab632",
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

const ENDO_MODULE_WITH_SOURCES = withEvidenceSources(ENDO_MODULE, {
  pretestSource: SRC_ENDO_ESC_2023,
  resolveItemSource: (item) => {
    if (item.id === "endo_tte" || item.id === "endo_tte_na") return SRC_ENDO_TTE_META;
    if (item.id === "endo_pet" || item.id === "endo_pet_na") return SRC_ENDO_PET_META;
    if (item.id === "endo_tee") return SRC_ENDO_ESC_2023;
    if (item.id === "endo_predict_day1_high") return SRC_ENDO_PREDICT_2015;
    if (item.id === "endo_predict_day5_high" || item.id === "endo_predict_na") return SRC_ENDO_PREDICT_EXT;
    if (item.id === "endo_denova_high" || item.id === "endo_denova_na" || item.id === "endo_efaecalis_risk_context") {
      return SRC_ENDO_DENOVA_2018;
    }
    if (item.id === "endo_handoc_high" || item.id === "endo_handoc_na" || item.id === "endo_nbhs_risk_context") {
      return SRC_ENDO_HANDOC_2018;
    }
    if (item.id === "endo_sab_risk_context") return SRC_ENDO_PREDICT_2015;
    return SRC_ENDO_DUKE_2023;
  },
});


export const PROBID_MODULES: SyndromeLRModule[] = [
  CAP_MODULE_WITH_SOURCES,
  CDI_MODULE_WITH_SOURCES,
  UTI_MODULE_WITH_SOURCES,
  ENDO_MODULE_WITH_SOURCES,
  ACTIVE_TB_MODULE,
  PJP_MODULE,
  PJI_MODULE,
];
