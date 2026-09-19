import type { CaseOption } from "@/components/caseQuestion";

export type Reading = {
  title: string;
  source: string;
  url?: string;
  kind: "guideline" | "review" | "book" | "trial" | "pdf" | "lecture";
  focus?: string;
};

export type CurriculumQuestion = {
  pollId: string;
  prompt: string;
  options: CaseOption[];
};

export type KeyConceptSection = {
  heading: string;
  prose: string;
  bullets?: string[];
  question?: CurriculumQuestion;
};

export type RegimenRow = {
  scenario: string;
  hostFactors?: string;
  regimen: string;
  duration?: string;
  note?: string;
};

export type RegimenTable = {
  title: string;
  rows: RegimenRow[];
};

export type DifferentialEntry = {
  diagnosis: string;
  distinguishing: string;
};

export type ToolLink = {
  href: string;
  label: string;
  why?: string;
};

export type ScoringPoint = {
  factor: string;
  score: number | string;
};

export type ScoringInterpretation = {
  range: string;
  meaning: string;
  action: string;
};

export type ScoringTool = {
  name: string;
  purpose: string;
  points: ScoringPoint[];
  interpretation: ScoringInterpretation[];
  source?: string;
};

export type PreventionEntry = {
  modality: string;
  target: string;
  detail: string;
  source?: string;
};

export type SpecialPopulationEntry = {
  population: string;
  considerations: string;
};

export type ComplicationEntry = {
  name: string;
  recognize: string;
  manage: string;
};

export type PrognosisEntry = {
  metric: string;
  value: string;
  source?: string;
};

export type Difficulty = "core" | "intermediate" | "advanced";

export type CurriculumModule = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  readMins?: number;
  difficulty?: Difficulty;
  lastReviewed?: string;
  lastUpdated?: string;
  atAGlance: string[];
  objectives: string[];
  keyConcepts: KeyConceptSection[];
  differentials?: DifferentialEntry[];
  regimenTables?: RegimenTable[];
  evidence: Reading[];
  pearls: string[];
  syndromeTags: string[];
  conceptTags: string[];
  tools: ToolLink[];
  furtherReading?: Reading[];
  scoringTools?: ScoringTool[];
  prevention?: PreventionEntry[];
  specialPopulations?: SpecialPopulationEntry[];
  complications?: ComplicationEntry[];
  prognosis?: PrognosisEntry[];
  whenToRefer?: string[];
  followUp?: string[];
};

export const CURRICULUM_CATEGORIES = [
  "Antimicrobial Therapy & Resistance",
  "Antimicrobial & Diagnostic Stewardship",
  "Basic Microbiology",
  "Respiratory Infections",
  "Cardiovascular Infections",
  "Skin, Soft Tissue, Bone & Joint Infections",
  "Genitourinary Infections",
  "HIV & Sexually Transmitted Infections",
  "Vector-Borne & Zoonotic Infections",
  "Gastrointestinal & Intra-Abdominal Infections",
  "Immunocompromised Host & Fungal Infections",
  "Parasitic Infections",
] as const;

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    slug: "community-acquired-pneumonia",
    title: "Community-acquired pneumonia",
    category: "Respiratory Infections",
    summary:
      "One of the most common admission diagnoses in Internal Medicine. Mastering severity stratification (CURB-65, PSI), empiric therapy, the admission decision, and complication recognition is core to early residency.",
    readMins: 18,
    difficulty: "core",
    lastReviewed: "2026-07-21",
    lastUpdated: "2026-07-21",
    atAGlance: [
      "Use a validated severity score (PSI or CURB-65) PLUS clinical judgment to decide site of care — never the chest X-ray alone.",
      "Empiric therapy targets S. pneumoniae, H. influenzae, and the atypicals (Mycoplasma, Chlamydia, Legionella); atypical coverage is standard for inpatient CAP.",
      "Add MRSA and Pseudomonas coverage ONLY when validated risk factors are present (prior respiratory isolation, OR recent hospitalization with parenteral antibiotics) — routine empiric coverage is not indicated.",
      "Diagnostic yield of blood cultures is low in uncomplicated CAP; reserve for severe disease, hospitalization, or failure of therapy.",
      "Short-course therapy (≥5 days) is appropriate once the patient is afebrile 48–72 h and clinically stable — longer is not better.",
      "Corticosteroids reduce mortality in severe CAP with septic shock (e.g., hydrocortisone). Avoid in influenza or undrained infection. [VERIFY regimen and point estimate against CAPE COD II — JAMA Intern Med 2023]",
      "Procalcitonin-guided therapy does NOT improve outcomes — do not use it to decide whether to start antibiotics in suspected CAP.",
      "Give pneumococcal, influenza, COVID-19, and (age-eligible) RSV vaccination at discharge — prevention matters.",
    ],
    objectives: [
      "Define CAP and distinguish it from hospital-acquired and ventilator-associated pneumonia.",
      "Identify common and high-risk pathogens by host, including the ATS/IDSA 2019 validated risk factors for MRSA and Pseudomonas.",
      "Apply CURB-65 and the PSI (PORT) to guide the admission and ICU decision.",
      "Choose appropriate empiric therapy for outpatient, inpatient (non-severe), and severe CAP, and know when to broaden for MRSA or Pseudomonas.",
      "Determine duration of therapy and the criteria for IV-to-oral step-down.",
      "Recognize and manage complications (empyema, lung abscess, ARDS, metastatic infection).",
      "Counsel patients on vaccination and smoking cessation for prevention.",
    ],
    keyConcepts: [
      {
        heading: "Clinical problem & epidemiology",
        prose:
          "CAP is an acute infection of the lung parenchyma in a patient who has not been hospitalized or exposed to healthcare in the prior 14 days. It is among the most frequent causes of hospitalization and infectious death in adults, with mortality driven by severity at presentation and the timeliness of appropriate therapy. Streptococcus pneumoniae remains the most common identifiable bacterial pathogen, but respiratory viruses (influenza, SARS-CoV-2, RSV) now account for a large and growing fraction of cases.",
        bullets: [
          "Incidence is highest at the extremes of age and in patients with chronic cardiopulmonary disease, diabetes, or immunocompromise.",
          "The 'HCAP' category was retired from the 2019 ATS/IDSA guidelines — broaden coverage based on validated individual risk factors, not the old label.",
          "Smoking is the single biggest modifiable risk factor; address it at every encounter.",
        ],
      },
      {
        heading: "Microbiology & validated risk factors for resistant pathogens",
        prose:
          "Pathogens cluster by host. S. pneumoniae, H. influenzae, and M. catarrhalis dominate typical CAP; the atypicals (Mycoplasma, Chlamydia, Legionella) are covered whenever a patient is sick enough to admit. The 2019 ATS/IDSA guideline replaced the retired 'HCAP' label with two validated, evidence-based sets of risk factors that actually predict MRSA or Pseudomonas — use these, not the old label, to decide when to broaden empiric coverage.",
        bullets: [
          "Typical: S. pneumoniae, H. influenzae, M. catarrhalis.",
          "Atypical: Mycoplasma pneumoniae, Chlamydia pneumoniae, Legionella pneumophila.",
          "Validated risk factors for MRSA: prior respiratory isolation of MRSA, OR recent hospitalization + exposure to parenteral antibiotics.",
          "Validated risk factors for Pseudomonas: prior respiratory isolation of Pseudomonas, OR recent hospitalization + parenteral antibiotics in a patient with structurally diseased lung (bronchiectasis, severe COPD with recurrent infection).",
          "Injection drug use raises S. aureus risk (tricuspid valve seeding, septic emboli) — a separate clinical pattern, not captured by the two risk-factor sets above.",
        ],
        question: {
          pollId: "train-cap-microbiology-q1",
          prompt:
            "A 68-year-old man with COPD on long-term inhaled corticosteroids, recently hospitalized for a COPD exacerbation and treated with IV ceftriaxone, is admitted with multilobar CAP. Per the ATS/IDSA 2019 validated risk factors, which pathogen requires you to ADD specific coverage beyond standard empiric therapy?",
          options: [
            {
              id: "A",
              label: "Streptococcus pneumoniae",
              feedback:
                "S. pneumoniae is covered by standard empiric therapy (beta-lactam ± macrolide). No additional coverage is required.",
            },
            {
              id: "B",
              label: "Haemophilus influenzae",
              feedback:
                "H. influenzae is covered by standard empiric therapy (beta-lactam). No additional coverage is required.",
            },
            {
              id: "C",
              label: "Pseudomonas aeruginosa",
              correct: true,
              feedback:
                "Correct. Recent hospitalization plus parenteral antibiotics in a patient with structurally diseased lung (severe COPD with frequent exacerbations) meets the ATS/IDSA 2019 validated risk factor for Pseudomonas. Switch to an antipseudomonal beta-lactam (e.g., piperacillin-tazobactam or cefepime) plus atypical coverage, and add MRSA coverage if risk factors are also present.",
            },
            {
              id: "D",
              label: "Mycoplasma pneumoniae",
              feedback:
                "Mycoplasma is covered by the macrolide (or doxycycline/fluoroquinolone) component of standard empiric therapy.",
            },
          ],
        },
      },
      {
        heading: "Clinical manifestations",
        prose:
          "The classic presentation is fever, cough, productive sputum, dyspnea, and pleuritic chest pain, with focal exam findings (crackles, consolidation). Presentation is often subtler in the elderly or immunocompromised, who may present with confusion, falls, or functional decline alone — in an older patient, CAP is a leading cause of non-specific functional decline.",
        bullets: [
          "Tachypnea and tachycardia are the most sensitive physical-exam findings; their absence makes CAP less likely.",
          "Hypothermia, hypotension, or confusion signal severe disease (and are CURB-65 components).",
          "Extrapulmonary features — diarrhea, hyponatremia, hepatitis, neurologic change — suggest Legionella.",
        ],
      },
      {
        heading: "Approach to diagnosis: tiered testing",
        prose:
          "Chest imaging is required to confirm the diagnosis. Additional testing is tiered by severity: the sicker or more complex the patient, the more diagnostics are justified. Over-testing in low-severity CAP adds cost and false positives without changing management. Procalcitonin does NOT improve clinically important outcomes when used to guide initiation or duration, and should not delay antibiotics in suspected CAP.",
        bullets: [
          "First tier (all patients): chest X-ray (or chest CT if X-ray is negative but suspicion is high).",
          "Second tier (hospitalized): blood cultures before antibiotics if possible, sputum culture if a good sample can be obtained, respiratory viral testing including influenza and SARS-CoV-2.",
          "Third tier (severe ICU): urinary antigens for S. pneumoniae and Legionella serogroup 1; consider bronchoscopy if atypical or opportunistic infection is suspected.",
          "Do NOT use procalcitonin to decide whether to start antibiotics in suspected CAP (ProCAP and related trials showed no outcome benefit). [VERIFY exact ProCAP citation]",
        ],
        question: {
          pollId: "train-cap-diagnosis-q1",
          prompt:
            "A previously healthy 42-year-old with 3 days of cough, fever, and pleuritic chest pain has CURB-65 = 0. Chest X-ray shows a small right lower lobe infiltrate. Vitals are stable. Which of the following is indicated?",
          options: [
            {
              id: "A",
              label: "Blood cultures",
              feedback:
                "Blood cultures have very low yield in uncomplicated outpatient CAP and are not indicated here.",
            },
            {
              id: "B",
              label: "Sputum culture",
              feedback:
                "Sputum cultures are not routinely recommended in the outpatient setting for uncomplicated CAP.",
            },
            {
              id: "C",
              label: "Chest X-ray",
              correct: true,
              feedback:
                "Correct. Chest imaging is required to confirm the diagnosis of CAP. This patient has already been appropriately imaged, and outpatient empiric therapy with close follow-up is the right plan.",
            },
            {
              id: "D",
              label: "Bronchoscopy with BAL",
              feedback:
                "Bronchoscopy is reserved for severe, atypical, or immunocompromised presentations where standard diagnostics fail.",
            },
          ],
        },
      },
      {
        heading: "Risk stratification & the admission decision",
        prose:
          "Severity scores objectify the risk of death, but they do not replace clinical judgment — social factors, the ability to take oral medications, and access to follow-up all affect the site of care. The PSI (Pneumonia Severity Index / PORT) is more sensitive (and more complex), weighting age and comorbidities heavily; CURB-65 is a simpler bedside score. The scoring-tools section below gives the full point tables and interpretation bands.",
        bullets: [
          "CURB-65: Confusion, Urea >7 mmol/L (BUN >19 mg/dL), Respiratory rate ≥30, Blood pressure (SBP <90 or DBP ≤60), age ≥65. Score 0–1 consider outpatient; 2 admit; ≥3 consider ICU.",
          "PSI is preferred for borderline site-of-care decisions because it is more sensitive (fewer inappropriate outpatients).",
          "Clinical judgment overrides the score — a young parent unable to follow up or take oral medications may still need admission.",
          "Use an early-warning score (NEWS2, MEWS) to detect deterioration on the floor.",
        ],
      },
      {
        heading: "Treatment: empiric therapy by site of care",
        prose:
          "Empiric therapy follows the site of care and host risk. The principles: cover the core pathogens, add atypicals for inpatient therapy, and add MRSA/Pseudomonas coverage only for the validated risk factors above. The regimen table below summarizes the common scenarios; de-escalate the moment cultures and susceptibilities return.",
        bullets: [
          "Outpatient (healthy): amoxicillin high-dose, doxycycline, or a respiratory fluoroquinolone.",
          "Outpatient (comorbidities): amoxicillin/clavulanate plus a macrolide or doxycycline; or a respiratory fluoroquinolone alone.",
          "Inpatient (non-severe): an antipneumococcal beta-lactam (ceftriaxone, cefotaxime, ampicillin-sulbactam, or ertapenem) PLUS a macrolide; or a respiratory fluoroquinolone.",
          "Severe (ICU): beta-lactam PLUS macrolide (azithromycin) — fluoroquinolone is an acceptable alternative; add vancomycin/linezolid AND an antipseudomonal beta-lactam when validated risk factors are present. Avoid fluoroquinolone monotherapy in ICU disease.",
        ],
        question: {
          pollId: "train-cap-treatment-q1",
          prompt:
            "A 55-year-old with no comorbidities, CURB-65 = 0, tolerating oral intake, presents with uncomplicated outpatient CAP. What is the most appropriate empiric therapy?",
          options: [
            {
              id: "A",
              label: "Ceftriaxone + azithromycin (IV, inpatient)",
              feedback:
                "IV ceftriaxone + azithromycin is inpatient therapy and is more than is needed for stable outpatient CAP.",
            },
            {
              id: "B",
              label: "Amoxicillin 1 g three times daily for 5–7 days",
              correct: true,
              feedback:
                "Correct. High-dose amoxicillin is first-line for healthy adults with outpatient CAP. Doxycycline or a respiratory fluoroquinolone is a reasonable alternative.",
            },
            {
              id: "C",
              label: "Vancomycin + cefepime + metronidazole",
              feedback:
                "This broad empiric regimen is reserved for severe disease with MRSA/Pseudomonas/anaerobic risk — inappropriate here.",
            },
            {
              id: "D",
              label: "Observation without antibiotics",
              feedback:
                "CAP confirmed on imaging with symptoms warrants antibiotics; observation alone is inappropriate.",
            },
          ],
        },
      },
      {
        heading: "Duration, oral step-down & treatment failure",
        prose:
          "Shorter is better. Patients who improve can complete therapy orally, and most courses run ≥5 days. Transition to oral therapy does not require repeat blood cultures, a documented normal temperature, or a normal WBC — only clinical stability and the ability to absorb oral drugs. Failure to improve by day 3 should prompt structured reassessment rather than reflexive broadening. Corticosteroids reduce mortality in severe CAP with septic shock; they should be avoided in influenza or undrained infection.",
        bullets: [
          "Minimum 5 days of therapy, provided the patient is afebrile for 48–72 hours and clinically stable.",
          "Switch IV→PO when the patient is hemodynamically stable, improving, and able to take oral medications — high-bioavailability oral agents (fluoroquinolones, linezolid, doxycycline, metronidazole, fluconazole) achieve serum levels close to IV.",
          "Causes of failure by day 3: wrong pathogen or resistant organism, complication (empyema, abscess, metastatic infection), wrong diagnosis (PE, heart failure, atypical presentation), or inadequate source control.",
          "Corticosteroids (e.g., hydrocortisone) reduce mortality in severe CAP with septic shock; avoid in influenza or active undrained infection. [VERIFY regimen and point estimate — CAPE COD II, JAMA Intern Med 2023]",
        ],
      },
      {
        heading: "Aspiration pneumonitis vs aspiration pneumonia",
        prose:
          "Not every infiltrate after a witnessed aspiration event is an infection. Aspiration pneumonitis is a chemical lung injury from sterile gastric contents (typically after a large-volume aspiration in an altered patient) and may not require antibiotics — supportive care plus observation is often sufficient. Aspiration pneumonia is a bacterial infection that develops subacutely, classically in the dependent lobes, with anaerobic and mixed flora. Distinguishing the two prevents unnecessary broad-spectrum antibiotics.",
        bullets: [
          "Aspiration pneumonitis: acute onset after a witnessed aspiration, chemical injury; consider supportive care first and add antibiotics only if the infiltrate persists or fever/purulence develops over 24–48 h.",
          "Aspiration pneumonia: subacute presentation in a patient with aspiration risk (stroke, seizure, dysphagia, substance use), dependent-lobe infiltrate (RLL, RML, posterior LUL).",
          "Routine anaerobic coverage is NOT needed for simple CAP; add anaerobic coverage (clindamycin or metronidazole, or a beta-lactam/beta-lactamase inhibitor) only for true aspiration pneumonia, lung abscess, or empyema.",
        ],
      },
    ],
    scoringTools: [
      {
        name: "CURB-65",
        purpose: "Rapid bedside severity stratification and site-of-care decision.",
        points: [
          { factor: "Confusion (new disorientation in person, place, or time)", score: 1 },
          { factor: "Uremia — BUN > 19 mg/dL (urea > 7 mmol/L)", score: 1 },
          { factor: "Respiratory rate ≥ 30/min", score: 1 },
          { factor: "Blood pressure: SBP < 90 OR DBP ≤ 60 mmHg", score: 1 },
          { factor: "Age ≥ 65 years", score: 1 },
        ],
        interpretation: [
          { range: "Score 0–1", meaning: "Low risk of mortality", action: "Consider outpatient therapy (with clinical judgment and social factors)." },
          { range: "Score 2", meaning: "Moderate risk", action: "Inpatient admission (or brief inpatient/observation with close follow-up)." },
          { range: "Score ≥ 3", meaning: "Severe / high mortality", action: "Inpatient admission; consider ICU for scores 3–4–5." },
        ],
        source: "Lim WS et al. Thorax 2003;58:377–382. [VERIFY mortality bands: 0 ~0.6%, 1 ~3.2%, 2 ~9%, 3 ~15%, 4 ~28%, 5 ~35%]",
      },
      {
        name: "Pneumonia Severity Index (PSI / PORT)",
        purpose: "Comorbidity-weighted score; more sensitive than CURB-65 and preferred for borderline site-of-care decisions.",
        points: [
          { factor: "Age (men = age in years; women = age − 10); nursing-home resident (+10)", score: "yrs" },
          { factor: "Neoplastic disease", score: "+30" },
          { factor: "Liver disease", score: "+20" },
          { factor: "Congestive heart failure", score: "+10" },
          { factor: "Cerebrovascular disease", score: "+10" },
          { factor: "Renal disease", score: "+10" },
          { factor: "Altered mental status", score: "+20" },
          { factor: "Respiratory rate ≥ 30", score: "+20" },
          { factor: "Systolic BP < 90", score: "+20" },
          { factor: "Temperature < 35 °C or ≥ 40 °C", score: "+15" },
          { factor: "Pulse ≥ 125", score: "+10" },
          { factor: "Arterial pH < 7.35", score: "+30" },
          { factor: "BUN ≥ 30 mg/dL (or urea ≥ 11 mmol/L)", score: "+20" },
          { factor: "Sodium < 130", score: "+20" },
          { factor: "Glucose ≥ 250", score: "+10" },
          { factor: "Hematocrit < 30%", score: "+10" },
          { factor: "PaO₂ < 60 or O₂ sat < 90%", score: "+10" },
          { factor: "Pleural effusion on CXR", score: "+10" },
        ],
        interpretation: [
          { range: "Class I–II (< 70 pts)", meaning: "Low mortality (~1%)", action: "Outpatient management." },
          { range: "Class III (71–90 pts)", meaning: "Low–moderate mortality (~3%)", action: "Brief inpatient stay or observation." },
          { range: "Class IV (91–130 pts)", meaning: "Moderate mortality (~8–9%)", action: "Inpatient admission." },
          { range: "Class V (> 130 pts)", meaning: "High mortality (~27–29%)", action: "Inpatient admission; consider ICU." },
        ],
        source: "Fine MJ et al. N Engl J Med 1997;336:243–250. [VERIFY class-specific mortality]",
      },
    ],
    differentials: [
      {
        diagnosis: "Acute bronchitis",
        distinguishing: "Cough without infiltrate on imaging; usually viral and self-limited.",
      },
      {
        diagnosis: "Tuberculosis",
        distinguishing: "Subacute cough, night sweats, weight loss, upper-lobe or cavitary infiltrate, risk exposures.",
      },
      {
        diagnosis: "Pulmonary embolism",
        distinguishing: "Pleuritic pain, dyspnea out of proportion, risk factors for VTE; possible wedge-shaped infarct on imaging.",
      },
      {
        diagnosis: "Heart failure / cardiogenic edema",
        distinguishing: "Bilateral infiltrates, elevated BNP, volume overload, no fever or response to antibiotics.",
      },
      {
        diagnosis: "Lung abscess or empyema",
        distinguishing: "Cavitary lesion or pleural collection; often aspiration or anaerobic; requires drainage.",
      },
      {
        diagnosis: "Aspiration pneumonitis (sterile)",
        distinguishing: "Acute infiltrate after a witnessed large-volume aspiration; chemical injury, often no fever or purulence initially.",
      },
      {
        diagnosis: "Viral pneumonia (influenza, SARS-CoV-2, RSV)",
        distinguishing: "Viral prodrome, bilateral infiltrates, lymphopenia; confirm with a respiratory viral panel.",
      },
    ],
    regimenTables: [
      {
        title: "Empiric therapy by site of care (ATS/IDSA 2019)",
        rows: [
          {
            scenario: "Outpatient, healthy, no risk factors",
            regimen: "Amoxicillin 1 g PO TID; alternatives: doxycycline 100 mg PO BID, or a respiratory fluoroquinolone",
            duration: "5–7 days",
          },
          {
            scenario: "Outpatient with comorbidities",
            hostFactors: "Chronic heart/lung/liver/kidney disease, diabetes, alcohol use, asplenia",
            regimen:
              "Amoxicillin/clavulanate PLUS a macrolide or doxycycline; or a respiratory fluoroquinolone alone",
            duration: "5–7 days",
          },
          {
            scenario: "Inpatient, non-severe",
            regimen:
              "Antipneumococcal beta-lactam (ceftriaxone, cefotaxime, ampicillin-sulbactam, ertapenem) PLUS a macrolide; or a respiratory fluoroquinolone",
            duration: "≥5 days (until afebrile 48–72 h and clinically stable)",
          },
          {
            scenario: "Inpatient, severe (ICU)",
            regimen:
              "Beta-lactam PLUS macrolide (azithromycin); fluoroquinolone acceptable alternative. Add vancomycin or linezolid (MRSA) AND switch to an antipseudomonal beta-lactam when validated risk factors are present.",
            note: "Avoid fluoroquinolone monotherapy in ICU disease.",
          },
          {
            scenario: "Aspiration pneumonia / lung abscess / empyema",
            hostFactors: "Witnessed aspiration, dysphagia, substance use, poor dentition",
            regimen:
              "Add anaerobic coverage (metronidazole or clindamycin, or use ampicillin-sulbactam/piperacillin-tazobactam). Routine anaerobic coverage is NOT needed for simple CAP.",
          },
        ],
      },
    ],
    complications: [
      {
        name: "Parapneumonic effusion & empyema",
        recognize: "Persistent fever or failure to improve; pleural fluid on imaging. Send fluid for pH, LDH, protein, cell count, Gram stain, and culture.",
        manage: "Thoracentesis to characterize; if pH < 7.2 or loculated/infected → chest tube (tube thoracostomy) ± surgical or catheter drainage. Early involvement of pulmonology, interventional radiology, or thoracic surgery.",
      },
      {
        name: "Lung abscess",
        recognize: "Cavity with air-fluid level, often after aspiration or with S. aureus / anaerobes / Klebsiella; foul-smelling sputum suggests anaerobes.",
        manage: "Prolonged anaerobic-covering antibiotics (weeks to months until cavity resolves on imaging); drainage if large or not responding. Bronchoscopy to exclude obstruction.",
      },
      {
        name: "ARDS & septic shock",
        recognize: "Refractory hypoxemia, bilateral opacities, vasopressor dependence; typically with severe or multilobar CAP.",
        manage: "Lung-protective ventilation, conservative fluid strategy, vasopressors. Consider corticosteroids for septic-shock CAP (avoid in influenza). Source control for any drainable collection.",
      },
      {
        name: "Metastatic infection (esp. S. aureus)",
        recognize: "New murmur, embolic phenomena, back pain, septic arthritis — suggests endocarditis, vertebral osteomyelitis, or septic emboli.",
        manage: "Repeat blood cultures, echocardiography (TEE if S. aureus or prosthetic valve), imaging for metastatic foci; prolong therapy and involve ID, cardiology, and surgery as indicated.",
      },
      {
        name: "Non-resolving pneumonia",
        recognize: "Infiltrate that fails to improve by 4–6 weeks despite appropriate therapy.",
        manage: "Reconsider the diagnosis (malignancy, organizing pneumonia, TB/fungal, aspiration, immunodeficiency); chest CT and often bronchoscopy. Underlying lung cancer is a real concern in smokers.",
      },
    ],
    prognosis: [
      { metric: "Overall outpatient CAP mortality", value: "< 1–5%" },
      { metric: "Overall hospitalized CAP mortality", value: "~10–12% [VERIFY]" },
      { metric: "ICU CAP mortality", value: "~20–50% [VERIFY]" },
      { metric: "CURB-65 score 0", value: "~0.6% mortality [VERIFY]" },
      { metric: "CURB-65 score 2", value: "~9% mortality [VERIFY]" },
      { metric: "CURB-65 score 4–5", value: "~28–35% mortality [VERIFY]" },
      { metric: "Standard outcome endpoint", value: "30-day all-cause mortality" },
    ],
    specialPopulations: [
      {
        population: "Pregnancy",
        considerations: "Favor beta-lactams (safe in pregnancy). Avoid fluoroquinolones and tetracyclines/doxycycline. Treat severe CAP aggressively — pregnancy is a high-risk host. Influenza vaccination is essential; treat suspected influenza with oseltamivir promptly.",
      },
      {
        population: "ESKD / dialysis",
        considerations: "Dose-adjust all renally cleared antibiotics. Higher risk for S. pneumoniae, S. aureus, and healthcare exposure. Consider extended-spectrum empiric coverage if recently hospitalized or catheter-associated bacteremia is a concern.",
      },
      {
        population: "Neutropenia / hematologic malignancy / HSCT",
        considerations: "Broaden empiric coverage to include Pseudomonas (antipseudomonal beta-lactam). Add MRSA coverage per risk. Consider Pneumocystis (PCP), respiratory viruses, and fungal pathogens (Aspergillus, Mucorales) — bronchoscopy and CT early. Involve ID and hematology/oncology.",
      },
      {
        population: "COPD / bronchiectasis (structural lung disease)",
        considerations: "Higher Pseudomonas risk — consider antipseudomonal beta-lactam empirically in severe CAP or recent antibiotic exposure. Treat exacerbation drivers in parallel.",
      },
      {
        population: "Asplenia / hyposplenism",
        considerations: "High risk for encapsulated organisms (S. pneumoniae, H. influenzae, N. meningitidis). Ensure vaccination (pneumococcal, Hib, meningococcal) and treat bacteremic CAP aggressively.",
      },
      {
        population: "Injection drug use",
        considerations: "S. aureus is a leading pathogen — evaluate for tricuspid valve endocarditis, septic emboli (cavitary lesions), and vertebral osteomyelitis. Add MRSA coverage (vancomycin) empirically in severe disease.",
      },
      {
        population: "Alcohol use disorder",
        considerations: "Aspiration risk, S. pneumoniae, and Klebsiella pneumoniae (classic upper-lobe). Assess for aspiration pneumonitis vs pneumonia; ensure thiamine and withdrawal prophylaxis as needed.",
      },
    ],
    prevention: [
      {
        modality: "Pneumococcal vaccination (PCV20 or PCV15→PPSV23)",
        target: "Adults ≥ 65, OR 19–64 with risk factors (chronic lung/heart/liver disease, diabetes, smoking, immunocompromise, asplenia, cochlear implant, CSF leak)",
        detail: "Per current ACIP guidance: PCV20 alone is a complete series; alternatively PCV15 followed ≥1 year later by PPSV23 (≥8 weeks if immunocompromised). [VERIFY current ACIP schedule — MMWR 2023/2024]",
      },
      {
        modality: "Influenza vaccination",
        target: "Everyone ≥ 6 months, annually",
        detail: "Inactivated vaccine in pregnancy and high-risk hosts; reduces CAP, hospitalization, and mortality.",
      },
      {
        modality: "COVID-19 vaccination",
        target: "All adults per current CDC schedule",
        detail: "Reduces severe COVID-19 pneumonia and post-COVID complications.",
      },
      {
        modality: "RSV vaccination",
        target: "Adults ≥ 60 (shared clinical decision-making), pregnant persons, and infants via maternal or infant immunization",
        detail: "Per current ACIP RSV recommendations. [VERIFY current schedule]",
      },
      {
        modality: "Smoking cessation",
        target: "All smokers",
        detail: "The single biggest modifiable risk factor for CAP — counsel and offer pharmacotherapy at every encounter.",
      },
      {
        modality: "Aspiration precautions",
        target: "Patients with dysphagia, stroke, neuromuscular disease, or substance use",
        detail: "Head-of-bed elevation, oral hygiene, swallow evaluation, and feeding modifications as indicated.",
      },
    ],
    whenToRefer: [
      "ICU transfer for septic shock requiring vasopressors, respiratory failure, or CURB-65 ≥ 3 with organ dysfunction.",
      "ID consultation for confirmed MRSA or Pseudomonas, failure to improve by day 3, suspected endocarditis or metastatic infection, or an immunocompromised host with an atypical pathogen.",
      "Pulmonology or cardiothoracic / interventional radiology for empyema or a complicated pleural effusion needing drainage, lung abscess, or bronchoscopy for a non-resolving or atypical infiltrate.",
      "Speech therapy / ENT for aspiration risk and swallow evaluation.",
      "Outpatient follow-up within 48–72 hours for any patient discharged on oral therapy.",
    ],
    followUp: [
      "Outpatient: clinical reassessment at 48–72 hours (in person or by phone) with return precautions for worsening dyspnea, fever, or confusion.",
      "Inpatient: assess response at 48–72 hours; switch IV→PO when the patient is hemodynamically stable, improving, and tolerating oral intake — do NOT require afebrile status or repeat blood cultures before step-down.",
      "Repeat chest imaging at ~6 weeks ONLY if the patient is a smoker, age ≥ 50, or has persistent symptoms — to exclude an underlying malignancy.",
      "Reinforce smoking cessation and ensure pneumococcal, influenza, COVID-19, and age-eligible RSV vaccination before discharge.",
      "CAP can be the first presentation of underlying lung cancer — ensure age-appropriate cancer screening is arranged.",
    ],
    evidence: [
      {
        title: "Diagnosis and Treatment of Adults with Community-Acquired Pneumonia (ATS/IDSA)",
        source: "Metlay JP, et al. Am J Respir Crit Care Med. 2019;200(7):e45–e67",
        url: "https://www.atsjournals.org/doi/10.1164/rccm.201908-1581ST",
        kind: "guideline",
        focus: "The current definitive US guideline — severity, diagnostics, empiric therapy, and the validated MRSA/Pseudomonas risk factors. [VERIFY no 2024–2025 replacement update]",
      },
      {
        title: "Community-Acquired Pneumonia",
        source: "Wunderink RG, Waterer G. N Engl J Med",
        url: "https://www.nejm.org/doi/full/10.1056/NEJMcp1314869",
        kind: "review",
        focus: "A concise NEJM clinical review of diagnosis and management.",
      },
      {
        title: "CAPE COD II — Hydrocortisone in severe community-acquired pneumonia",
        source: "JAMA Intern Med. 2023 [VERIFY exact authors, volume, and point estimate]",
        kind: "trial",
        focus: "Randomized trial of hydrocortisone in severe CAP with septic shock; mortality benefit. The current basis for steroid use in severe CAP.",
      },
      {
        title: "Procalcitonin-guided antibiotic therapy in community-acquired pneumonia (ProCAP)",
        source: "[VERIFY exact citation — ProCAP / procalcitonin CAP trial]",
        kind: "trial",
        focus: "Procalcitonin guidance did not improve clinically important outcomes in CAP — do not use to decide initiation.",
      },
      {
        title: "Recommended Adult Immunization Schedule — United States (pneumococcal)",
        source: "ACIP / CDC MMWR [VERIFY most recent schedule year]",
        kind: "guideline",
        focus: "Current PCV20 / PCV15→PPSV23 recommendations for adults.",
      },
      {
        title: "Principles and Practice of Infectious Diseases, 9e — Community-Acquired Pneumonia chapter",
        source: "Mandell, Bennett, Dolin",
        kind: "book",
        focus: "Comprehensive reference for pathogens and management.",
      },
    ],
    pearls: [
      "“HCAP” is retired — broaden empiric coverage based on the two validated ATS/IDSA risk-factor sets, not the old label.",
      "Always check a respiratory viral panel including influenza, SARS-CoV-2, and RSV.",
      "Legionella urinary antigen detects only serogroup 1 (the most common) — culture on BCYE agar detects other serogroups.",
      "Failure to improve by day 3 → reassess (resistant organism, complication, wrong diagnosis); don't just broaden.",
      "Sterile blood cultures do not rule out bacteremia.",
      "Procalcitonin does NOT improve outcomes in CAP — do not let it delay antibiotics.",
      "Oral step-down does NOT require afebrile status or repeat blood cultures — only clinical stability and PO tolerance.",
      "Add anaerobic coverage only for aspiration pneumonia, lung abscess, or empyema — not for simple CAP.",
      "Corticosteroids reduce mortality in severe CAP with septic shock; avoid in influenza or undrained infection.",
      "Repeat chest imaging at 6 weeks ONLY if smoker, age ≥ 50, or persistent symptoms — to exclude underlying lung cancer.",
    ],
    syndromeTags: ["Pulmonary Infection", "Atypical Pneumonia", "Pulmonary", "Community-Acquired Pneumonia", "Pneumococcal Infection"],
    conceptTags: [
      "CAP",
      "CURB-65",
      "PSI",
      "PORT",
      "Empiric therapy",
      "Lobar pneumonia",
      "MRSA risk factors",
      "Pseudomonas risk factors",
      "Aspiration pneumonitis",
      "Procalcitonin",
      "Pneumococcal vaccination",
    ],
    tools: [
      { href: "/probid", label: "ProbID", why: "Syndrome probability and pretest framing." },
      { href: "/tools/doseid", label: "DoseID", why: "Renal-adjusted antimicrobial dosing for inpatient regimens." },
      { href: "/tools/spectrum", label: "Spectrum", why: "Verify empiric coverage against suspected organisms." },
      { href: "/mechid", label: "MechID", why: "Antimicrobial mechanisms and resistance relevant to empiric choices." },
    ],
    furtherReading: [
      {
        title: "Community-acquired pneumonia",
        source: "File TM. Lancet. 2003 [consider updating to a more recent Lancet review]",
        kind: "review",
      },
      {
        title: "Epidemiology, pathogenesis, and treatment of community-acquired pneumonia",
        source: "[VERIFY — identify a current 2022–2025 comprehensive review]",
        kind: "review",
      },
    ],
  },
  {
    slug: "antimicrobials-mechanisms-of-action",
    title: "Antimicrobials: mechanisms of action",
    category: "Antimicrobial Therapy & Resistance",
    summary:
      "A class-based resident guide to how antibacterial drugs work: targets, spectrum anchors, site limitations, toxicities, and pharmacodynamic principles.",
    readMins: 30,
    difficulty: "core",
    lastReviewed: "2026-09-19",
    lastUpdated: "2026-09-19",
    atAGlance: [
      "First classify the drug by target: cell wall, ribosome, nucleic-acid synthesis, folate metabolism, or membrane.",
      "Beta-lactams are cell-wall agents; their clinical differences come from spectrum, beta-lactamase stability, PBP affinity, and PK/PD.",
      "Protein synthesis inhibitors share ribosomal targets but differ in spectrum, toxicity, oral bioavailability, and intracellular activity.",
      "Fluoroquinolones, rifamycins, metronidazole, nitrofurantoin, and TMP-SMX are best remembered by target plus syndrome-specific limitations.",
      "Drug selection is not spectrum alone: infection site, source control, host factors, toxicity, interactions, and oral bioavailability matter.",
      "Mechanism-of-action knowledge is the foundation; resistance mechanisms are layered on in the next module.",
    ],
    objectives: [
      "Organize common antibacterial agents by class and cellular target.",
      "Explain how beta-lactam subclasses differ in spectrum and clinical use.",
      "Compare 30S and 50S protein synthesis inhibitors by mechanism, clinical niche, and toxicity.",
      "Recognize site-specific limitations such as nitrofurantoin for cystitis only and daptomycin inactivation in pneumonia.",
      "Apply basic PK/PD principles to class selection and dosing conversations.",
    ],
    keyConcepts: [
      {
        heading: "Classify antimicrobials by target before memorizing spectrum",
        prose:
          "Antibacterial drugs are easier to understand when the first question is 'what bacterial process does this drug interrupt?' Cell-wall agents weaken peptidoglycan synthesis or assembly. Protein synthesis inhibitors bind ribosomal subunits. Fluoroquinolones and rifamycins interfere with DNA or RNA synthesis. TMP-SMX blocks sequential folate metabolism. Daptomycin and polymyxins disrupt membranes. This framework explains many spectrum gaps, toxicities, and treatment limitations before resistance is considered.",
        bullets: [
          "Cell wall: beta-lactams bind PBPs; vancomycin binds D-Ala-D-Ala; fosfomycin blocks an early peptidoglycan step.",
          "Ribosome: aminoglycosides and tetracyclines act at 30S; macrolides, clindamycin, linezolid, chloramphenicol, and streptogramins act at 50S.",
          "DNA/RNA: fluoroquinolones inhibit DNA gyrase/topoisomerase IV; rifamycins inhibit RNA polymerase; metronidazole causes anaerobe-specific DNA injury.",
          "Metabolism/membrane: TMP-SMX blocks folate metabolism; daptomycin and polymyxins disrupt bacterial membranes.",
        ],
        question: {
          pollId: "train-abx-action-q1",
          prompt:
            "Which pairing correctly matches an antibacterial class with its primary target?",
          options: [
            { id: "A", label: "TMP-SMX and bacterial cell membrane depolarization", feedback: "Incorrect. TMP-SMX blocks sequential folate metabolism." },
            { id: "B", label: "Fluoroquinolones and DNA gyrase/topoisomerase IV", correct: true, feedback: "Correct. Fluoroquinolones inhibit bacterial DNA gyrase and topoisomerase IV." },
            { id: "C", label: "Vancomycin and 30S ribosomal binding", feedback: "Incorrect. Vancomycin binds D-Ala-D-Ala cell-wall precursors." },
            { id: "D", label: "Aminoglycosides and folate synthesis", feedback: "Incorrect. Aminoglycosides bind the 30S ribosomal subunit." },
          ],
        },
      },
      {
        heading: "Beta-lactams all target PBPs, but subclasses behave differently",
        prose:
          "Penicillins, cephalosporins, carbapenems, and aztreonam all inhibit cell-wall synthesis by binding PBPs, but their clinical roles differ. Natural penicillins remain important for susceptible streptococci, syphilis, and selected anaerobes. Anti-staphylococcal penicillins and cefazolin are core MSSA drugs. Aminopenicillins add Enterococcus and selected gram-negative activity. Anti-pseudomonal penicillins, later-generation cephalosporins, cefepime, carbapenems, and aztreonam extend gram-negative coverage in different ways. Beta-lactams are generally time-dependent drugs: maintaining free drug above the MIC is the key exposure concept.",
        bullets: [
          "Cefazolin/nafcillin: preferred definitive therapy for many MSSA infections.",
          "Ceftriaxone: useful for many community gram-negative and streptococcal infections but not Pseudomonas or Enterococcus.",
          "Cefepime: broader gram-negative activity including Pseudomonas; neurotoxicity risk rises with renal dysfunction.",
          "Carbapenems: broad gram-negative, anaerobic, and many ESBL roles; ertapenem does not cover Pseudomonas or Acinetobacter.",
        ],
        question: {
          pollId: "train-abx-action-q2",
          prompt:
            "Which pharmacodynamic principle best supports extended-infusion cefepime or piperacillin-tazobactam in selected severe gram-negative infections?",
          options: [
            { id: "A", label: "Beta-lactams work best only by maximizing peak concentration", feedback: "Incorrect. Peak-to-MIC is more relevant to concentration-dependent drugs such as aminoglycosides." },
            { id: "B", label: "Beta-lactams are inactivated by pulmonary surfactant", feedback: "Incorrect. That limitation applies to daptomycin, not beta-lactams." },
            { id: "C", label: "Beta-lactams work best when free concentrations remain above the MIC for enough of the dosing interval", correct: true, feedback: "Correct. Beta-lactams are time-dependent; prolonged infusion can increase fT>MIC." },
            { id: "D", label: "Beta-lactams require anaerobic nitro-reduction", feedback: "Incorrect. Nitro-reduction is relevant to metronidazole activation." },
          ],
        },
      },
      {
        heading: "Beta-lactamase inhibitor combinations extend, but do not universalize, beta-lactams",
        prose:
          "Beta-lactamase inhibitors protect partner beta-lactams from some enzymes, but each inhibitor has a specific range. Clavulanate, sulbactam, and tazobactam improve activity against many common beta-lactamases but do not solve AmpC, ESBL, or carbapenemase problems reliably in all syndromes. Newer combinations such as ceftazidime-avibactam, meropenem-vaborbactam, imipenem-relebactam, ceftolozane-tazobactam, and aztreonam-avibactam have organism- and mechanism-specific roles. The key bedside habit is to ask what the likely enzyme is and whether the combination was designed for it.",
        bullets: [
          "Piperacillin-tazobactam: broad empiric gram-negative, anaerobic, and Enterococcus faecalis activity, but not a universal ESBL drug for invasive infection.",
          "Ceftolozane-tazobactam: often useful for resistant Pseudomonas depending on susceptibility.",
          "Ceftazidime-avibactam: activity against many KPC and OXA-48-like producers, not metallo-beta-lactamases alone.",
          "Aztreonam-avibactam: conceptually important for metallo-beta-lactamase producers because aztreonam resists MBL hydrolysis while avibactam protects from co-produced serine beta-lactamases.",
        ],
        question: {
          pollId: "train-abx-action-q3",
          prompt:
            "Why does adding a beta-lactamase inhibitor not automatically make a beta-lactam active against every resistant gram-negative organism?",
          options: [
            { id: "A", label: "All inhibitors bind PBPs instead of beta-lactamases", feedback: "Incorrect. The main role is beta-lactamase inhibition, although some agents have additional activity." },
            { id: "B", label: "Inhibitors only work in urine", feedback: "Incorrect. They are used for many systemic infections depending on agent and syndrome." },
            { id: "C", label: "Inhibitors convert gram-negative rods into gram-positive organisms", feedback: "Incorrect. They do not change cell envelope biology." },
            { id: "D", label: "Each inhibitor covers only certain enzyme classes and may not overcome porin loss, efflux, or target changes", correct: true, feedback: "Correct. Activity depends on the beta-lactam, inhibitor, enzyme, organism, permeability, efflux, target, and syndrome." },
          ],
        },
      },
      {
        heading: "Glycopeptides, lipopeptides, and other cell-wall agents have narrow but important roles",
        prose:
          "Vancomycin binds D-Ala-D-Ala precursors and remains central for empiric serious MRSA coverage, but it is not active against gram-negative rods and is poorly absorbed orally. Oral vancomycin is therefore an intestinal drug for C. difficile, not a systemic MRSA drug. Daptomycin depolarizes gram-positive membranes and can treat MRSA and VRE bacteremia or right-sided endocarditis, but pulmonary surfactant inactivates it, so it is not used for pneumonia. Fosfomycin blocks early cell-wall synthesis and is mainly used as an oral option for selected cystitis syndromes in the United States.",
        bullets: [
          "IV vancomycin: systemic gram-positive coverage; monitor exposure and kidney risk.",
          "Oral vancomycin: not systemically absorbed; use is gastrointestinal, especially C. difficile.",
          "Daptomycin: bactericidal gram-positive agent; avoid pneumonia; monitor CPK and myopathy risk.",
          "Fosfomycin: urinary concentrations are the clinical advantage; do not use as bacteremia therapy.",
        ],
        question: {
          pollId: "train-abx-action-q4",
          prompt:
            "A patient with MRSA bacteremia and septic pulmonary emboli is improving, but CT also shows parenchymal pneumonia. Why is daptomycin not appropriate for the pneumonia component?",
          options: [
            { id: "A", label: "Daptomycin has no gram-positive activity", feedback: "Incorrect. Daptomycin has important gram-positive activity, including MRSA and many VRE isolates." },
            { id: "B", label: "Daptomycin requires anaerobic activation", feedback: "Incorrect. That concept applies to metronidazole, not daptomycin." },
            { id: "C", label: "Daptomycin is inactivated by pulmonary surfactant", correct: true, feedback: "Correct. Daptomycin is not used for pneumonia because pulmonary surfactant inactivates it." },
            { id: "D", label: "Daptomycin is only active in urine", feedback: "Incorrect. It is systemic, but pneumonia is the key limitation." },
          ],
        },
      },
      {
        heading: "30S inhibitors: aminoglycosides and tetracyclines are not interchangeable",
        prose:
          "Aminoglycosides bind the 30S ribosomal subunit and cause misreading of mRNA. They are concentration-dependent, nephrotoxic, ototoxic, synergistic in selected gram-positive infections, and poor in anaerobic or acidic environments because uptake requires oxygen-dependent transport. Tetracyclines also act at 30S but are primarily bacteriostatic, orally available in many cases, and clinically useful for rickettsial illness, atypical pneumonia pathogens, some MRSA skin infections, zoonoses, and selected resistant gram-negative infections depending on agent and susceptibility.",
        bullets: [
          "Aminoglycosides: gentamicin, tobramycin, amikacin; peak-driven killing; kidney/ear toxicity; not anaerobic drugs.",
          "Doxycycline: first-line for many tick-borne rickettsial illnesses and useful for atypical pathogens.",
          "Minocycline/tigecycline/eravacycline: broader resistant-organism niches; understand bloodstream limitations and syndrome fit.",
          "Tetracycline toxicities: GI intolerance, photosensitivity, esophagitis, tooth/bone considerations in selected populations.",
        ],
        question: {
          pollId: "train-abx-action-q5",
          prompt:
            "Why are aminoglycosides intrinsically unreliable for anaerobic infections?",
          options: [
            { id: "A", label: "Anaerobes lack DNA", feedback: "Incorrect. Anaerobes have DNA; aminoglycoside failure is about drug uptake." },
            { id: "B", label: "Aminoglycoside uptake requires oxygen-dependent transport", correct: true, feedback: "Correct. Anaerobic conditions impair aminoglycoside uptake, making these drugs unreliable for anaerobic infection." },
            { id: "C", label: "Aminoglycosides bind only fungal ribosomes", feedback: "Incorrect. Aminoglycosides bind bacterial 30S ribosomal subunits." },
            { id: "D", label: "Aminoglycosides are neutralized by pulmonary surfactant", feedback: "Incorrect. Daptomycin, not aminoglycosides, has that limitation." },
          ],
        },
      },
      {
        heading: "50S inhibitors differ by syndrome, toxicity, and oral bioavailability",
        prose:
          "Macrolides are useful for atypical respiratory pathogens and selected streptococcal infections, but resistance can limit pneumococcal use. Clindamycin has anaerobic and gram-positive activity and is often discussed for toxin suppression, but inducible resistance matters. Linezolid has excellent oral bioavailability and activity against MRSA and VRE; monitor for cytopenias, neuropathy with prolonged use, and serotonergic interactions. Chloramphenicol and streptogramins are now niche agents but remain useful for understanding ribosomal pharmacology.",
        bullets: [
          "Azithromycin: atypical pneumonia coverage and selected STI/GI uses; QT and drug interaction issues matter.",
          "Clindamycin: selected skin/soft tissue, anaerobic, and toxin-suppression roles; C. difficile risk and D-test matter.",
          "Linezolid: oral equals IV exposure for practical purposes; useful step-down option when syndrome fits.",
          "Tedizolid: related oxazolidinone with selected ABSSSI role; less residency-core than linezolid.",
        ],
        question: {
          pollId: "train-abx-action-q6",
          prompt:
            "A clinically improving patient with susceptible MRSA pneumonia can take oral medications but needs ongoing MRSA therapy. Which oral agent has essentially complete bioavailability and MRSA activity?",
          options: [
            { id: "A", label: "Vancomycin capsules", feedback: "Incorrect. Oral vancomycin is not systemically absorbed and is used for C. difficile, not pneumonia." },
            { id: "B", label: "Cefazolin", feedback: "Incorrect. Cefazolin is IV and does not cover MRSA." },
            { id: "C", label: "Nitrofurantoin", feedback: "Incorrect. Nitrofurantoin concentrates in urine and is not used for pneumonia." },
            { id: "D", label: "Linezolid", correct: true, feedback: "Correct. Linezolid has excellent oral bioavailability and activity against MRSA; monitor for cytopenias, neuropathy with prolonged use, and interactions." },
          ],
        },
      },
      {
        heading: "DNA/RNA agents are powerful but syndrome-limited",
        prose:
          "Fluoroquinolones inhibit DNA gyrase and topoisomerase IV and have high oral bioavailability, but toxicity and resistance concerns mean they should not be reflexive convenience drugs. Rifamycins inhibit bacterial RNA polymerase and are central in tuberculosis regimens and selected hardware-associated staphylococcal infections, but resistance emerges rapidly with monotherapy. Metronidazole is reduced in anaerobic organisms and protozoa to reactive intermediates that damage DNA; it covers anaerobes but not aerobes. Nitrofurantoin damages bacterial macromolecules after intracellular activation and is a bladder drug, not a pyelonephritis or bacteremia drug.",
        bullets: [
          "Fluoroquinolones: oral step-down potential, atypical coverage for respiratory agents, and gram-negative activity; watch tendons, CNS, QT, aortic, dysglycemia, and C. difficile risks.",
          "Rifampin: never use alone for active staphylococcal infection or TB because resistance emerges quickly.",
          "Metronidazole: anaerobes below the diaphragm and selected protozoa; no aerobic gram-negative coverage.",
          "Nitrofurantoin: lower UTI only when renal function and organism susceptibility support use.",
        ],
        question: {
          pollId: "train-abx-action-q7",
          prompt:
            "A urine isolate causing simple cystitis is nitrofurantoin susceptible, but the patient has fever, flank pain, and E. coli bacteremia. Why is nitrofurantoin inappropriate?",
          options: [
            { id: "A", label: "It has no activity in the bladder", feedback: "Incorrect. Nitrofurantoin can be useful for bladder-limited cystitis." },
            { id: "B", label: "It is only active against viruses", feedback: "Incorrect. Nitrofurantoin is antibacterial." },
            { id: "C", label: "It concentrates in urine but does not achieve reliable renal parenchymal or bloodstream levels", correct: true, feedback: "Correct. Nitrofurantoin is not appropriate for pyelonephritis or bacteremia despite a susceptible cystitis isolate." },
            { id: "D", label: "It is inactivated by pulmonary surfactant", feedback: "Incorrect. That limitation applies to daptomycin." },
          ],
        },
      },
      {
        heading: "Folate pathway inhibition is sequential blockade",
        prose:
          "Trimethoprim-sulfamethoxazole combines two steps in bacterial folate metabolism: sulfamethoxazole inhibits dihydropteroate synthase, and trimethoprim inhibits dihydrofolate reductase. The combination can treat selected urinary, skin, Pneumocystis, Nocardia, Stenotrophomonas, and other infections when susceptibility and syndrome fit. Toxicities include rash, severe cutaneous reactions, hyperkalemia, renal effects, cytopenias, hepatitis, and drug interactions. Its broad usefulness makes it tempting, but local resistance and host contraindications matter.",
        bullets: [
          "TMP-SMX is not one target; it is sequential folate pathway blockade.",
          "Hyperkalemia risk rises with kidney disease, ACE inhibitors/ARBs, spironolactone, and higher doses.",
          "Pneumocystis therapy uses much higher dosing than routine cystitis regimens.",
          "Always interpret through syndrome, susceptibility, allergy history, renal function, and interacting medications.",
        ],
        question: {
          pollId: "train-abx-action-q8",
          prompt:
            "TMP-SMX works primarily through which mechanism?",
          options: [
            { id: "A", label: "Membrane depolarization of gram-positive bacteria", feedback: "Incorrect. That describes daptomycin." },
            { id: "B", label: "Binding D-Ala-D-Ala cell-wall precursors", feedback: "Incorrect. That describes vancomycin." },
            { id: "C", label: "Sequential inhibition of bacterial folate synthesis", correct: true, feedback: "Correct. Sulfamethoxazole and trimethoprim block sequential steps in folate metabolism." },
            { id: "D", label: "Inhibition of RNA polymerase", feedback: "Incorrect. Rifamycins inhibit RNA polymerase." },
          ],
        },
      },
      {
        heading: "Membrane-active agents are reserved tools, not routine broadening",
        prose:
          "Daptomycin and polymyxins are often grouped as membrane-active drugs, but their clinical use is very different. Daptomycin targets gram-positive membranes and is used for selected MRSA and VRE syndromes outside pneumonia. Polymyxins such as colistin and polymyxin B bind gram-negative outer membrane lipopolysaccharide and are now generally reserved for difficult resistant gram-negative infections because toxicity and outcome concerns are substantial. These drugs should trigger careful syndrome, susceptibility, and toxicity review rather than reflexive escalation.",
        bullets: [
          "Daptomycin: gram-positive; bactericidal; not pneumonia; monitor CPK.",
          "Polymyxins: gram-negative outer membrane activity; nephrotoxicity and neurotoxicity matter.",
          "Do not confuse membrane activity with universal activity; organism and site still decide usefulness.",
          "When polymyxins are being considered, reassess source control and newer beta-lactam options.",
        ],
        question: {
          pollId: "train-abx-action-q9",
          prompt:
            "Which toxicity concern is most classically associated with polymyxin therapy?",
          options: [
            { id: "A", label: "Optic neuritis after one dose", feedback: "Incorrect. Optic neuropathy is more associated with prolonged linezolid exposure." },
            { id: "B", label: "Nephrotoxicity and neurotoxicity", correct: true, feedback: "Correct. Polymyxins are limited by nephrotoxicity and neurotoxicity concerns." },
            { id: "C", label: "Pulmonary surfactant inactivation", feedback: "Incorrect. That is the key daptomycin limitation, not polymyxin toxicity." },
            { id: "D", label: "Irreversible tooth staining in all adults", feedback: "Incorrect. Tooth/bone issues are classically discussed with tetracyclines in selected populations." },
          ],
        },
      },
      {
        heading: "Class choice must include site, toxicity, and oral bioavailability",
        prose:
          "The final antimicrobial choice is a clinical decision, not a drug-class quiz. Ask whether the drug reaches the site, whether source control has occurred, whether oral therapy can achieve comparable exposure, whether the toxicity profile fits the host, and whether the drug's spectrum is unnecessarily broad. High-bioavailability oral agents such as fluoroquinolones, TMP-SMX, doxycycline, linezolid, metronidazole, and fluconazole can be excellent step-down drugs when the syndrome, isolate, and patient are appropriate. Conversely, a susceptible result does not rescue a drug with the wrong site profile.",
        bullets: [
          "Meningitis, endocarditis, bacteremia, pneumonia, cystitis, abscess, and osteomyelitis each impose different exposure requirements.",
          "Oral step-down is about exposure and syndrome fit, not about whether IV therapy feels stronger.",
          "Avoid treating colonization: no mechanism of action is helpful when there is no infection.",
          "Dose and duration are part of the antimicrobial decision, not afterthoughts.",
        ],
        question: {
          pollId: "train-abx-action-q10",
          prompt:
            "A stable patient with susceptible E. coli bacteremia from a urinary source improves after initial IV therapy and can absorb oral medications. Which stewardship move is most appropriate?",
          options: [
            { id: "A", label: "Continue vancomycin because any bacteremia needs gram-positive coverage", feedback: "Incorrect. Vancomycin does not treat E. coli and should be stopped if no gram-positive indication remains." },
            { id: "B", label: "Add metronidazole for all bloodstream infections", feedback: "Incorrect. Anaerobic coverage is syndrome-specific and not routine for pyelonephritis-associated bacteremia." },
            { id: "C", label: "Assess for oral step-down with an active high-bioavailability agent and appropriate duration", correct: true, feedback: "Correct. Improving uncomplicated gram-negative bacteremia from a urinary source can often be narrowed and transitioned when criteria are met." },
            { id: "D", label: "Restart broad empiric therapy until all inflammatory markers normalize", feedback: "Incorrect. Clinical response, source control, and syndrome matter more than waiting for nonspecific markers to normalize." },
          ],
        },
      },
    ],
    evidence: [
      {
        title: "Action and resistance mechanisms of antibiotics: a guide for clinicians",
        source: "Kapoor G, Saigal S, Elongavan A. J Anaesthesiol Clin Pharmacol. 2017;33(3):300-305. PMID: 29109626. DOI: 10.4103/joacp.JOACP_349_15.",
        url: "https://pubmed.ncbi.nlm.nih.gov/29109626/",
        kind: "review",
        focus: "Accessible clinician review of major antibiotic classes, mechanisms of action, and resistance concepts.",
      },
      {
        title: "Mandell, Douglas, and Bennett's Principles and Practice of Infectious Diseases",
        source: "Antimicrobial therapy chapters, current edition.",
        kind: "book",
        focus: "Textbook reference for antimicrobial class pharmacology, spectrum, mechanisms, and syndrome-based use.",
      },
      {
        title: "Sanford Guide to Antimicrobial Therapy",
        source: "Antimicrobial class and syndrome treatment reference, current edition.",
        kind: "guideline",
        focus: "Practical bedside reference for class selection, dosing, and syndrome-specific therapy.",
      },
    ],
    pearls: [
      "Learn the target first, then add spectrum, toxicity, site penetration, and resistance.",
      "Beta-lactams are time-dependent PBP-binding drugs; not all beta-lactams cover the same organisms.",
      "Oral vancomycin is not systemic therapy; oral linezolid is effectively systemic therapy.",
      "Nitrofurantoin and fosfomycin are urinary tools, not bacteremia or pyelonephritis drugs.",
      "A broader drug is not automatically a better drug; the best drug fits the syndrome with the least unnecessary collateral damage.",
    ],
    syndromeTags: ["Antimicrobial therapy", "Stewardship"],
    conceptTags: ["Mechanism of action", "Beta-lactams", "Protein synthesis", "PK/PD", "Oral step-down"],
    tools: [
      { href: "/mechid", label: "MechID", why: "Connect mechanism of action, resistance mechanisms, and susceptibility interpretation." },
      { href: "/tools/spectrum", label: "Spectrum", why: "Check practical spectrum gaps before broadening or narrowing therapy." },
      { href: "/tools/doseid", label: "DoseID", why: "Review dosing considerations after selecting an agent." },
    ],
  },

  {
    slug: "antibiotic-mechanisms-resistance",
    title: "Antimicrobial resistance mechanisms",
    category: "Antimicrobial Therapy & Resistance",
    summary:
      "A Mandell-style framework for how bacteria evade antimicrobial activity: genetic acquisition, drug inactivation, target changes, bypass, permeability, efflux, biofilm, and clinical resistance phenotypes.",
    readMins: 32,
    difficulty: "core",
    lastReviewed: "2026-09-19",
    lastUpdated: "2026-09-19",
    atAGlance: [
      "Resistance can be intrinsic, mutational, or horizontally acquired through plasmids, transposons, integrons, and resistance islands.",
      "Mandell's practical framework is mechanism-first: inactivate the drug, alter/protect the target, bypass the pathway, reduce entry, increase efflux, or persist in biofilm.",
      "Beta-lactam resistance often combines enzyme activity with permeability, efflux, or altered PBPs.",
      "A susceptibility report is a phenotype; it may not tell you the full mechanism or whether the drug fits the infection site.",
      "High-yield phenotypes include MRSA, VRE, ESBL-E, AmpC-E, CRE, DTR Pseudomonas, Acinetobacter, and Stenotrophomonas.",
      "Resistance prevention is clinical stewardship: avoid colonization treatment, narrow when possible, optimize exposure, and obtain source control.",
    ],
    objectives: [
      "Distinguish intrinsic resistance, mutational resistance, and horizontally acquired resistance.",
      "Explain major molecular resistance mechanisms using Mandell's framework.",
      "Recognize beta-lactamase phenotypes including ESBL, AmpC, KPC, OXA-48-like, and metallo-beta-lactamases.",
      "Connect class-specific resistance mechanisms to bedside treatment traps.",
      "Interpret susceptibility reports using organism identity, mechanism, infection site, and source-control status.",
    ],
    keyConcepts: [
      {
        heading: "Resistance is intrinsic, acquired, and selected by exposure",
        prose:
          "Intrinsic resistance is predictable from organism biology, such as Enterococcus resistance to cephalosporins or anaerobe resistance to aminoglycosides. Acquired resistance appears through mutation or horizontal gene transfer. Antibiotic exposure then selects organisms or subpopulations that can survive. The ecological lesson is practical: unnecessary antibiotics, prolonged courses, underdosing, high-burden infection, and delayed source control all increase selection pressure.",
        bullets: [
          "Mutation: target changes such as gyrA/parC fluoroquinolone resistance or rpoB rifampin resistance.",
          "Horizontal transfer: plasmid-mediated ESBLs, carbapenemases, aminoglycoside-modifying enzymes, qnr, and mcr.",
          "Mobile elements: plasmids, transposons, integrons, and resistance islands can cluster multiple mechanisms.",
          "Selection: treating colonization and leaving uncontrolled sources are resistance accelerants.",
        ],
        question: {
          pollId: "train-abx-resistance-q1",
          prompt:
            "Which statement best distinguishes intrinsic from acquired resistance?",
          options: [
            { id: "A", label: "Intrinsic resistance is predictable from species biology; acquired resistance develops by mutation or gene acquisition", correct: true, feedback: "Correct. Intrinsic resistance is built into the organism-drug pairing, while acquired resistance reflects new mutations or horizontally acquired genes." },
            { id: "B", label: "Intrinsic resistance occurs only after prior antibiotic exposure", feedback: "Incorrect. Prior exposure selects resistant organisms, but intrinsic resistance exists independent of the patient's antibiotic history." },
            { id: "C", label: "Acquired resistance cannot spread between species", feedback: "Incorrect. Mobile genetic elements can spread resistance genes across organisms." },
            { id: "D", label: "Intrinsic resistance is always overcome by higher dosing", feedback: "Incorrect. Higher dosing usually does not overcome a fundamental organism-drug mismatch and may only add toxicity." },
          ],
        },
      },
      {
        heading: "Drug inactivation is the classic enzymatic mechanism",
        prose:
          "Bacteria can destroy or modify antibiotics before the drug reaches its target. Beta-lactamases hydrolyze beta-lactams. Aminoglycoside-modifying enzymes acetylate, adenylate, or phosphorylate aminoglycosides. Chloramphenicol acetyltransferase inactivates chloramphenicol. The clinical mistake is treating all enzymes as equivalent. Enzyme class, organism, drug, inhibitor, inoculum, and infection site determine whether a drug is reliable.",
        bullets: [
          "Ambler A: serine beta-lactamases including many ESBLs and KPC.",
          "Ambler B: metallo-beta-lactamases such as NDM, VIM, and IMP; not inhibited by avibactam, vaborbactam, or relebactam alone.",
          "Ambler C: AmpC enzymes, inducible or derepressed in several Enterobacterales.",
          "Ambler D: OXA enzymes, including OXA-48-like carbapenemases.",
        ],
        question: {
          pollId: "train-abx-resistance-q2",
          prompt:
            "A CRE isolate is reported to produce NDM, a metallo-beta-lactamase. Why does this mechanism matter clinically?",
          options: [
            { id: "A", label: "It proves vancomycin is preferred", feedback: "Incorrect. Vancomycin has no reliable Enterobacterales activity." },
            { id: "B", label: "It predicts that some KPC-active beta-lactamase inhibitor combinations may not work", correct: true, feedback: "Correct. Metallo-beta-lactamases are not inhibited by several serine beta-lactamase inhibitor combinations; therapy differs from KPC-producing CRE." },
            { id: "C", label: "It means resistance is due only to PBP2a", feedback: "Incorrect. PBP2a is the MRSA mechanism, not an NDM carbapenemase." },
            { id: "D", label: "It makes cefazolin preferred for bacteremia", feedback: "Incorrect. NDM-producing CRE requires mechanism-directed gram-negative therapy." },
          ],
        },
      },
      {
        heading: "Target alteration lowers drug binding",
        prose:
          "If the target changes, an otherwise active drug may no longer bind. MRSA produces PBP2a encoded by mecA, lowering affinity for most beta-lactams. VRE remodels peptidoglycan termini from D-Ala-D-Ala to D-Ala-D-Lac, reducing vancomycin binding. Macrolide and clindamycin resistance can occur through erm-mediated ribosomal methylation. Fluoroquinolone resistance commonly involves DNA gyrase or topoisomerase IV mutations. Rifampin resistance can emerge through rpoB mutations.",
        bullets: [
          "MRSA: altered PBP, not an ESBL problem.",
          "VRE: altered cell-wall precursor terminus, not vancomycin destruction.",
          "MLSB resistance: ribosomal methylation can affect macrolides, lincosamides, and streptogramin B.",
          "Fluoroquinolones/rifampin: target mutations can emerge quickly under selection pressure.",
        ],
        question: {
          pollId: "train-abx-resistance-q3",
          prompt:
            "A resident asks why cefazolin treats MSSA bacteremia but not MRSA bacteremia. Which explanation is most accurate?",
          options: [
            { id: "A", label: "MRSA lacks a peptidoglycan cell wall", feedback: "Incorrect. S. aureus has a peptidoglycan cell wall." },
            { id: "B", label: "MRSA is intrinsically resistant because cefazolin cannot enter gram-positive cells", feedback: "Incorrect. Cefazolin enters gram-positive bacteria and is active against MSSA." },
            { id: "C", label: "MRSA produces an altered penicillin-binding protein with low beta-lactam affinity", correct: true, feedback: "Correct. mecA encodes PBP2a, which has low affinity for most beta-lactams." },
            { id: "D", label: "MRSA inactivates cefazolin only through ESBL production", feedback: "Incorrect. ESBLs are mainly an Enterobacterales problem; MRSA resistance is driven by altered PBPs." },
          ],
        },
      },
      {
        heading: "Target protection and target bypass preserve essential pathways",
        prose:
          "Some resistance mechanisms protect the target without replacing it. Tet(M) and related ribosomal protection proteins dislodge tetracyclines from the ribosome. Qnr proteins protect DNA gyrase and topoisomerase IV from fluoroquinolones. Other organisms bypass the inhibited pathway by using alternative enzymes, such as sul and dfr genes that reduce TMP-SMX activity. These mechanisms may combine with efflux, permeability changes, and enzymatic resistance.",
        bullets: [
          "Target protection: tetracycline ribosomal protection and Qnr-mediated fluoroquinolone protection.",
          "Target bypass: alternative folate enzymes for sulfonamide or trimethoprim resistance.",
          "Clinical implication: low-level protection mechanisms can become high-level resistance when layered with other mechanisms.",
        ],
        question: {
          pollId: "train-abx-resistance-q4",
          prompt:
            "Which mechanism is best described as target protection rather than drug destruction?",
          options: [
            { id: "A", label: "KPC hydrolysis of meropenem", feedback: "Incorrect. That is enzymatic drug inactivation." },
            { id: "B", label: "Aminoglycoside acetylation", feedback: "Incorrect. That is drug modification/inactivation." },
            { id: "C", label: "AmpC hydrolysis of ceftriaxone", feedback: "Incorrect. That is beta-lactamase-mediated drug inactivation." },
            { id: "D", label: "Qnr protection of DNA gyrase from fluoroquinolones", correct: true, feedback: "Correct. Qnr proteins protect the target rather than destroying the fluoroquinolone." },
          ],
        },
      },
      {
        heading: "Reduced permeability and efflux are central gram-negative defenses",
        prose:
          "Gram-negative organisms add an outer membrane barrier. Drugs must enter through porins or cross membranes, avoid periplasmic enzymes, and remain near the target. Porin loss can reduce entry of beta-lactams and carbapenems. Efflux pumps actively remove antibiotics and can affect tetracyclines, macrolides, fluoroquinolones, beta-lactams, and multiple unrelated classes. Pseudomonas is the classic organism where low permeability, efflux, AmpC, and target changes combine.",
        bullets: [
          "Porin loss plus ESBL or AmpC can cause carbapenem resistance without a carbapenemase.",
          "Efflux can create multidrug resistance because one pump may export several classes.",
          "DTR Pseudomonas often reflects layered mechanisms, not one simple mutation.",
        ],
        question: {
          pollId: "train-abx-resistance-q5",
          prompt:
            "A carbapenem-resistant Enterobacterales isolate lacks a carbapenemase but has porin loss plus an ESBL. What principle does this illustrate?",
          options: [
            { id: "A", label: "All carbapenem resistance requires a metallo-beta-lactamase", feedback: "Incorrect. Carbapenem resistance can arise without a carbapenemase." },
            { id: "B", label: "Gram-negative rods do not have PBPs", feedback: "Incorrect. Beta-lactams still target PBPs." },
            { id: "C", label: "Vancomycin should be added for porin loss", feedback: "Incorrect. Vancomycin does not treat Enterobacterales." },
            { id: "D", label: "Resistance phenotypes can reflect combined permeability and enzymatic mechanisms", correct: true, feedback: "Correct. Porin loss decreases entry while beta-lactamase hydrolyzes drug that enters." },
          ],
        },
      },
      {
        heading: "ESBL, AmpC, and CRE are different beta-lactam resistance problems",
        prose:
          "ESBLs hydrolyze many penicillins and cephalosporins and make ceftriaxone unreliable for serious infection even when reports appear tempting. AmpC enzymes may be inducible or derepressed in organisms such as Enterobacter cloacae complex, Klebsiella aerogenes, and Citrobacter freundii; third-generation cephalosporin therapy can select resistance during invasive infection. CRE may reflect KPC, OXA-48-like, metallo-beta-lactamase, or non-carbapenemase mechanisms, and preferred therapy depends on the mechanism and susceptibility.",
        bullets: [
          "ESBL-E: think ceftriaxone failure risk in invasive infection.",
          "AmpC-E: avoid ceftriaxone for invasive disease with moderate-risk organisms even if initially susceptible.",
          "CRE: request or review mechanism testing when available because therapy differs by enzyme.",
          "Do not treat all beta-lactamases as one category.",
        ],
        question: {
          pollId: "train-abx-resistance-q6",
          prompt:
            "A patient has Klebsiella aerogenes bacteremia from cholangitis. The isolate reports ceftriaxone susceptible. What is the main concern with ceftriaxone?",
          options: [
            { id: "A", label: "K. aerogenes lacks a cell wall", feedback: "Incorrect. K. aerogenes has a gram-negative cell wall." },
            { id: "B", label: "Ceftriaxone never reaches bile", feedback: "Incorrect. Ceftriaxone has biliary excretion; the issue is resistance emergence." },
            { id: "C", label: "Inducible AmpC can select for derepressed mutants during therapy", correct: true, feedback: "Correct. K. aerogenes is a moderate-risk AmpC organism; invasive infection treated with ceftriaxone can select resistance during therapy." },
            { id: "D", label: "All Enterobacterales with bacteremia require vancomycin", feedback: "Incorrect. Vancomycin has no reliable gram-negative activity." },
          ],
        },
      },
      {
        heading: "Ribosomal resistance includes drug modification, methylation, protection, and efflux",
        prose:
          "Aminoglycoside resistance commonly reflects aminoglycoside-modifying enzymes, reduced uptake, or 16S rRNA methylation. Tetracycline resistance often reflects efflux pumps, ribosomal protection proteins, or enzymatic inactivation such as Tet(X). Macrolide and clindamycin resistance may reflect erm-mediated ribosomal methylation; the D-test detects inducible clindamycin resistance when erythromycin resistance is present. Linezolid resistance may involve 23S rRNA mutations or transferable genes such as cfr, optrA, and poxtA.",
        bullets: [
          "Aminoglycosides: modifying enzymes are common; 16S methylation can cause high-level resistance.",
          "Tetracyclines: efflux and ribosomal protection are classic.",
          "Macrolide/clindamycin: erm methylation can be inducible or constitutive.",
          "Linezolid: watch for resistance with prolonged exposure and VRE pressure.",
        ],
        question: {
          pollId: "train-abx-resistance-q7",
          prompt:
            "A community MRSA isolate is erythromycin resistant and clindamycin susceptible on the initial report. What additional result would make clindamycin unreliable?",
          options: [
            { id: "A", label: "Negative beta-lactamase test", feedback: "Incorrect. Beta-lactamase testing does not assess inducible MLSB resistance." },
            { id: "B", label: "Low vancomycin MIC", feedback: "Incorrect. Vancomycin MIC does not determine inducible clindamycin resistance." },
            { id: "C", label: "Lactose fermentation", feedback: "Incorrect. Lactose fermentation is an Enterobacterales lab feature." },
            { id: "D", label: "Positive D-test", correct: true, feedback: "Correct. A positive D-test indicates inducible clindamycin resistance and risk of clinical failure." },
          ],
        },
      },
      {
        heading: "Glycopeptide, daptomycin, polymyxin, fosfomycin, and cefiderocol resistance are mechanism-specific",
        prose:
          "VRE usually resists vancomycin by replacing D-Ala-D-Ala with D-Ala-D-Lac, reducing glycopeptide binding. VISA/VRSA in S. aureus involve different biology and are rare but important. Daptomycin resistance often involves altered membrane charge or homeostasis. Polymyxin resistance can result from lipid A modification, including plasmid-mediated mcr genes. Fosfomycin resistance may reflect transporter changes, MurA changes, or Fos enzymes. Cefiderocol resistance may involve siderophore transport changes, beta-lactamases, or permeability changes.",
        bullets: [
          "VRE: target remodeling; linezolid or daptomycin decisions depend on syndrome and susceptibility.",
          "Daptomycin: resistance risk rises with high-burden infection and poor source control.",
          "Polymyxins: lipid A modification reduces binding.",
          "Cefiderocol: iron-transport biology means resistance can involve siderophore pathway changes.",
        ],
        question: {
          pollId: "train-abx-resistance-q8",
          prompt:
            "Vancomycin-resistant Enterococcus faecium most commonly avoids vancomycin activity through which mechanism?",
          options: [
            { id: "A", label: "Production of PBP2a encoded by mecA", feedback: "Incorrect. PBP2a explains MRSA beta-lactam resistance." },
            { id: "B", label: "Replacement of D-Ala-D-Ala with D-Ala-D-Lac in the cell-wall precursor", correct: true, feedback: "Correct. Van genes remodel the peptidoglycan terminus and reduce vancomycin binding." },
            { id: "C", label: "Anaerobic inactivation of vancomycin", feedback: "Incorrect. VRE resistance is not driven by anaerobic drug inactivation." },
            { id: "D", label: "Loss of bacterial ribosomes", feedback: "Incorrect. Ribosomes are essential and are not the mechanism of glycopeptide resistance." },
          ],
        },
      },
      {
        heading: "Biofilm and persistence are source-control problems as much as drug problems",
        prose:
          "Biofilm on catheters, prosthetic joints, valves, cardiac devices, stones, and necrotic tissue creates a protected microbial community with altered metabolism and reduced antimicrobial susceptibility. Persister cells are phenotypically tolerant rather than genetically resistant, but the clinical effect can be relapse if the infected focus remains. Antibiotic escalation rarely solves an undrained abscess, obstructed urinary tract, infected catheter, or devitalized tissue by itself.",
        bullets: [
          "Remove or exchange infected hardware when feasible and clinically indicated.",
          "Drain abscesses and relieve obstruction early.",
          "Do not confuse persistent positive cultures from poor source control with the need for endlessly broader antibiotics.",
        ],
        question: {
          pollId: "train-abx-resistance-q9",
          prompt:
            "A patient with persistent bacteremia has an infected central venous catheter that remains in place. What resistance-related principle is most relevant?",
          options: [
            { id: "A", label: "Biofilm and source-control failure can cause persistence despite in vitro susceptibility", correct: true, feedback: "Correct. Biofilm on infected hardware can sustain infection; source control is often essential." },
            { id: "B", label: "All persistent bacteremia means the lab reported the wrong organism", feedback: "Incorrect. Lab error is possible but not the main principle; source control is central." },
            { id: "C", label: "Antibiotics sterilize all retained foreign material if continued long enough", feedback: "Incorrect. Retained infected hardware may require removal or exchange." },
            { id: "D", label: "Susceptibility testing is irrelevant", feedback: "Incorrect. Susceptibility matters, but it cannot replace source control." },
          ],
        },
      },
      {
        heading: "Susceptibility reports are phenotypes, not complete mechanism reports",
        prose:
          "The susceptibility table reflects standardized testing and breakpoint interpretation. It does not automatically report mechanism, tissue penetration, inoculum effect, biofilm activity, source control, toxicity, or whether a drug is appropriate for the syndrome. Intermediate or susceptible-dose-dependent results may require higher exposure. Some drugs are reported because they are useful for cystitis but are wrong for pyelonephritis or bacteremia. When CRE, DTR Pseudomonas, VRE bacteremia, or discordant results appear, call the microbiology lab early.",
        bullets: [
          "Read organism identity before the drug rows.",
          "Know the site: urine-only drugs are not bloodstream drugs.",
          "Ask for mechanism testing when it will change therapy.",
          "Treat infection, not colonization or culture positivity alone.",
        ],
        question: {
          pollId: "train-abx-resistance-q10",
          prompt:
            "Blood cultures grow E. coli in a patient with pyelonephritis. The urine isolate reports nitrofurantoin susceptible. Why is nitrofurantoin inappropriate definitive therapy for bacteremia/pyelonephritis?",
          options: [
            { id: "A", label: "It has no activity against E. coli in the bladder", feedback: "Incorrect. Nitrofurantoin often has E. coli cystitis activity; the problem is the invasive syndrome and site." },
            { id: "B", label: "It is only active against anaerobes", feedback: "Incorrect. Nitrofurantoin is used for selected aerobic urinary pathogens." },
            { id: "C", label: "It is a glycopeptide blocked by D-Ala-D-Lac", feedback: "Incorrect. Nitrofurantoin is not a glycopeptide." },
            { id: "D", label: "It concentrates in urine but does not achieve reliable renal parenchymal or bloodstream levels", correct: true, feedback: "Correct. Nitrofurantoin can be useful for lower-tract cystitis but is not appropriate for pyelonephritis or bacteremia." },
          ],
        },
      },
    ],
    evidence: [
      {
        title: "Molecular Mechanisms of Antibiotic Resistance in Bacteria",
        source: "Perez F, Stiefel U, Bonomo RA. In: Mandell, Douglas, and Bennett's Principles and Practice of Infectious Diseases, Ch. 18.",
        kind: "book",
        focus: "Authoritative textbook chapter for beta-lactamases, permeability, efflux, target alteration, mobile genetic elements, and clinically important resistance phenotypes.",
      },
      {
        title: "Action and resistance mechanisms of antibiotics: a guide for clinicians",
        source: "Kapoor G, Saigal S, Elongavan A. J Anaesthesiol Clin Pharmacol. 2017;33(3):300-305. PMID: 29109626. DOI: 10.4103/joacp.JOACP_349_15.",
        url: "https://pubmed.ncbi.nlm.nih.gov/29109626/",
        kind: "review",
        focus: "Short clinician-friendly companion review for mechanisms of action and major resistance pathways.",
      },
      {
        title: "IDSA Guidance on the Treatment of Antimicrobial-Resistant Gram-Negative Infections",
        source: "Infectious Diseases Society of America, current online guidance.",
        url: "https://www.idsociety.org/practice-guideline/amr-guidance/",
        kind: "guideline",
        focus: "Practical treatment guidance for ESBL-E, AmpC-E, CRE, and difficult-to-treat Pseudomonas.",
      },
      {
        title: "CLSI: Standards for Antimicrobial Susceptibility Testing",
        source: "Clinical and Laboratory Standards Institute M100 performance standards, current edition.",
        url: "https://clsi.org/standards/products/microbiology/documents/m100/",
        kind: "guideline",
        focus: "Breakpoint interpretation, susceptibility categories, and standardized antimicrobial susceptibility testing framework.",
      },
      {
        title: "A primer on AmpC beta-lactamases: necessary knowledge for an increasingly multidrug-resistant world",
        source: "Tamma PD, Doi Y, Bonomo RA, Johnson JK, Simner PJ. Clin Infect Dis. 2019;69(8):1446-1455.",
        url: "https://pubmed.ncbi.nlm.nih.gov/30776247/",
        kind: "review",
        focus: "Focused explanation of AmpC biology, inducible resistance, and clinical treatment traps.",
      },
    ],
    pearls: [
      "Resistance mechanisms explain the classic treatment traps: MRSA and beta-lactams, Enterococcus and cephalosporins, AmpC organisms and ceftriaxone, nitrofurantoin and pyelonephritis.",
      "Do not treat the susceptibility table without the organism, syndrome, source, host, and site of infection.",
      "Gram-negative resistance is often layered; ask whether beta-lactamase, porin loss, efflux, and target changes are interacting.",
      "A positive culture is not always infection. Treating colonization is one of the fastest ways to select resistance without helping the patient.",
      "When CRE, DTR Pseudomonas, VRE bacteremia, or unusual resistance appears, call the microbiology lab early; mechanism testing can change therapy.",
    ],
    syndromeTags: ["Antimicrobial resistance", "Stewardship"],
    conceptTags: ["Mechanism of action", "Beta-lactamase", "AmpC", "ESBL", "CRE", "MRSA", "VRE", "Susceptibility interpretation"],
    tools: [
      { href: "/mechid", label: "MechID", why: "Connect mechanism of action, resistance mechanisms, and susceptibility interpretation." },
      { href: "/tools/spectrum", label: "Spectrum", why: "Check practical spectrum gaps before broadening or narrowing therapy." },
      { href: "/tools/doseid", label: "DoseID", why: "Review dosing considerations after selecting an agent." },
    ],
  },

  {
    slug: "infective-endocarditis",
    title: "Infective endocarditis",
    category: "Cardiovascular Infections",
    summary:
      "A diagnostic and management challenge where early recognition, pre-antibiotic blood cultures, and timely echocardiography drive outcome. Use the 2023 ISCVID Duke criteria — endocarditis must be on every IM resident's differential for unexplained bacteremia.",
    readMins: 20,
    difficulty: "intermediate",
    lastReviewed: "2026-07-21",
    lastUpdated: "2026-07-21",
    atAGlance: [
      "Think endocarditis in any unexplained bacteremia (especially S. aureus), new murmur, or embolic phenomenon.",
      "Obtain three sets of blood cultures from separate sites before antibiotics — the single highest-yield diagnostic step.",
      "Apply the 2023 ISCVID Duke criteria (revised — now includes CT and 18F-FDG PET/CT findings and S. aureus as a major criterion). [VERIFY exact criteria against the 2023 ISCVID update]",
      "Echocardiography is tiered: TTE first, then TEE if TTE is negative, if a prosthetic valve is present, or in S. aureus bacteremia.",
      "S. aureus bacteremia mandates echocardiography — TTE misses a meaningful fraction of vegetations.",
      "Surgical indications: heart failure, uncontrolled infection, large mobile vegetations, perivalvular extension, and embolic events despite appropriate therapy.",
      "Do NOT routinely add rifampin to native-valve S. aureus bacteremia (ARREST and CAMERA2 showed no benefit and more harm).",
      "Selected stable left-sided IE can transition to oral therapy (POET, POSITIVE trials). [VERIFY eligibility criteria]",
    ],
    objectives: [
      "Recognize the clinical presentation and predisposing conditions for infective endocarditis.",
      "Apply the 2023 ISCVID Duke criteria for diagnosis.",
      "Select appropriate diagnostic studies (blood cultures, echocardiography, CT/PET, serologies).",
      "Choose empiric and organism-directed therapy, including the role of partial oral step-down.",
      "Identify indications for surgical intervention and the role of the Endocarditis Team.",
      "Distinguish who does and does not need IE prophylaxis.",
    ],
    keyConcepts: [
      {
        heading: "Clinical problem & epidemiology",
        prose:
          "Infective endocarditis (IE) is an infection of the endocardial surface, most often a cardiac valve. The epidemiology has shifted: Staphylococcus aureus is now the most common cause in many contemporary series, driven by healthcare exposure and injection drug use, while streptococci remain important in native-valve disease with a dental or biliary source. Mortality remains substantial (in-hospital ~15–25%), and outcome hinges on early cultures, imaging, and coordinated medical-surgical care.",
        bullets: [
          "Predisposing conditions: prosthetic valve, congenital heart disease, prior IE, injection drug use, indwelling catheters, poor dentition.",
          "Native-valve IE and prosthetic-valve IE differ in microbiology, the role of rifampin, and surgical timing.",
          "Healthcare-associated IE is increasingly common with lines, devices, and cardiac implantable electronic devices (CIEDs).",
        ],
      },
      {
        heading: "Microbiology by valve type and exposure",
        prose:
          "Organisms cluster by valve type and exposure. S. aureus and viridans streptococci dominate native-valve disease; coagulase-negative staphylococci are classic for early prosthetic-valve IE; enterococci and HACEK organisms are less common but important. Culture-negative endocarditis has a defined differential — and a structured workup.",
        bullets: [
          "Native valve: S. aureus, viridans streptococci, Streptococcus gallolyticus (formerly S. bovis — associate with colorectal neoplasia), enterococci.",
          "Prosthetic valve (early, <1 year): coagulase-negative staphylococci, S. aureus, hospital-acquired gram-negatives.",
          "Prosthetic valve (late, >1 year): resembles native-valve microbiology.",
          "Culture-negative causes: Coxiella burnetii, Bartonella, HACEK, T. whipplei, and the prior-antibiotic effect.",
        ],
        question: {
          pollId: "train-ie-microbiology-q1",
          prompt:
            "A 65-year-old man presents 6 weeks after bioprosthetic aortic valve replacement with low-grade fever and a new murmur. Blood cultures grow coagulase-negative staphylococci in multiple bottles. What is the most likely scenario, and what does it imply for empiric therapy?",
          options: [
            {
              id: "A",
              label: "Native-valve endocarditis; penicillin alone is sufficient",
              feedback:
                "Coagulase-negative staphylococci in a prosthetic valve early after surgery point to prosthetic-valve IE, not native-valve disease. Penicillin alone would be inadequate.",
            },
            {
              id: "B",
              label:
                "Early prosthetic-valve endocarditis; empiric therapy should include vancomycin plus rifampin plus gentamicin",
              correct: true,
              feedback:
                "Correct. Early prosthetic-valve IE with coagulase-negative staphylococci warrants a regimen including vancomycin (for methicillin resistance), with rifampin (for biofilm) and an aminoglycoside in the initial weeks, per guideline — directed eventually by susceptibility data.",
            },
            {
              id: "C",
              label: "Contamination; no further workup needed",
              feedback:
                "Multiple positive bottles with a prosthetic valve and a new murmur is endocarditis until proven otherwise — cultures are not contamination here.",
            },
            {
              id: "D",
              label: "HACEK endocarditis; ceftriaxone monotherapy",
              feedback:
                "HACEK organisms are gram-negative bacilli and grow slowly; the organism here is a coagulase-negative staphylococcus.",
            },
          ],
        },
      },
      {
        heading: "Clinical manifestations",
        prose:
          "Presentation ranges from an indolent febrile illness to fulminant sepsis with embolic phenomena. The classic peripheral stigmata (Osler nodes, Roth spots, Janeway lesions, splinter hemorrhages) are now less common but are still taught because they point to sustained bacteremia and immune-complex deposition. New heart block on telemetry is an underappreciated clue to perivalvular abscess.",
        bullets: [
          "Constitutional: fever, malaise, anorexia, weight loss.",
          "Cardiac: new or changing murmur, heart failure, conduction abnormality (perivalvular extension — aortic-root abscess).",
          "Embolic/immunologic: arterial emboli (brain, spleen, kidney, mesentery), septic pulmonary emboli (right-sided IE), mycotic aneurysm, immune-complex glomerulonephritis.",
        ],
      },
      {
        heading: "Diagnosis: the 2023 ISCVID Duke criteria & tiered imaging",
        prose:
          "IE is a clinical diagnosis codified by the Duke criteria, which were substantially revised in 2023 by the International Society for Cardiovascular Infectious Diseases (ISCVID). The 2023 update added CT and 18F-FDG PET/CT findings, expanded imaging findings, and reclassified S. aureus bacteremia as a major criterion. Imaging remains tiered: transthoracic echo (TTE) is non-invasive and a reasonable first step, but transesophageal echo (TEE) is far more sensitive and is required when TTE is negative but suspicion persists, in prosthetic valves, and in S. aureus bacteremia. The full point criteria are in the scoring-tools section.",
        bullets: [
          "2023 ISCVID major criteria now include: typical organisms in blood cultures (including S. aureus); endocardial involvement on echo OR CT (perivalvular abscess, native-valve vegetation) OR 18F-FDG PET/CT or radiolabeled-leukocyte SPECT/CT abnormal uptake around a prosthetic valve (<3 months post-implant). [VERIFY exact list]",
          "Minor criteria: predisposition, fever ≥38°C, vascular phenomena, immunologic phenomena, suggestive (but not major) microbiology.",
          "General imaging principle: escalate to TEE whenever the diagnosis is not excluded.",
        ],
        question: {
          pollId: "train-ie-diagnosis-q1",
          prompt:
            "A 40-year-old who injects drugs has S. aureus bacteremia and a transthoracic echocardiogram showing no vegetation. What is the next best step?",
          options: [
            {
              id: "A",
              label: "Conclude endocarditis is excluded",
              feedback:
                "TTE has limited sensitivity, especially in injection-drug-use–associated IE. A negative TTE does not exclude endocarditis.",
            },
            {
              id: "B",
              label: "Repeat the transthoracic echo in one week",
              feedback:
                "Waiting and repeating a less-sensitive test is not appropriate when a more definitive study (TEE) is available.",
            },
            {
              id: "C",
              label: "Proceed to transesophageal echocardiography",
              correct: true,
              feedback:
                "Correct. S. aureus bacteremia warrants echocardiography, and a negative TTE should be followed by TEE, which is substantially more sensitive for vegetations and complications.",
            },
            {
              id: "D",
              label: "Refer for empiric valve surgery",
              feedback:
                "Surgery is reserved for specific indications (heart failure, uncontrolled infection, complications). It is not an empiric step.",
            },
          ],
        },
      },
      {
        heading: "Culture-negative endocarditis: a structured workup",
        prose:
          "When blood cultures fail to grow, send the targeted serologic and molecular workup rather than resigning to 'empiric therapy forever.' The yield is high if you think about it systematically. Coxiella burnetii and Bartonella together account for a large fraction of true culture-negative IE.",
        bullets: [
          "Coxiella burnetii: phase I IgG ≥ 1:800 is a major Duke criterion. [VERIFY exact titer cutoff]",
          "Bartonella henselae/quintana: serology (IgG) and, when available, PCR of blood or valve tissue.",
          "HACEK: slow-growing gram-negative bacilli; most modern blood-culture systems now recover them, but incubation may be prolonged.",
          "Tropheryma whipplei: PCR of blood or valve tissue (consider in older patients with aortic-valve IE and arthritis/diarrhea).",
          "16S rRNA / 18S rRNA PCR and histopathology on excised valve tissue when surgery is performed.",
        ],
      },
      {
        heading: "Treatment: empiric, organism-directed, and partial oral step-down",
        prose:
          "Empiric therapy covers S. aureus (including MRSA) and streptococci while cultures are pending; once an organism and susceptibilities are known, therapy is narrowed and prolonged (typically 4–6 weeks). Selected clinically stable patients with left-sided IE caused by susceptible organisms can transition to oral therapy after an initial IV course — supported by the POET and POSITIVE trials. Always consult the most recent guideline and involve ID and cardiothoracic surgery early when surgery is a possibility.",
        bullets: [
          "Empiric (native valve): vancomycin (or anti-staphylococcal beta-lactam if MSSA likely) ± cefepime/gentamicin depending on local epidemiology.",
          "Native-valve MSSA: nafcillin, oxacillin, or cefazolin — do NOT add gentamicin (no longer recommended) and do NOT add rifampin (ARREST and CAMERA2 showed harm).",
          "MRSA (native or prosthetic): vancomycin (or daptomycin if vancomycin cannot be used).",
          "Viridans streptococci, penicillin-susceptible: penicillin G or ceftriaxone for 2–4 weeks (2-week regimens exist with aminoglycoside, but most use 4 weeks).",
          "Enterococcus faecalis, ampicillin-susceptible: ampicillin + gentamicin (or ampicillin + ceftriaxone for HLAR — high-level aminoglycoside resistance — to avoid nephrotoxicity).",
          "Partial oral step-down: POET (Iversen et al. NEJM 2019) and POSITIVE (JAMA 2024 [VERIFY]) support oral step-down in selected stable left-sided IE with susceptible streptococci, enterococci, or E. coli — NOT for S. aureus or unstable patients.",
        ],
      },
      {
        heading: "Indications for surgery & risk scoring",
        prose:
          "Surgery is lifesaving in a defined subset of patients. The classic indications cluster around heart failure, uncontrolled infection, and prevention or management of embolic and destructive complications. Validated scores (AEPE, ELDER) help risk-stratify and time surgery; early collaboration with cardiothoracic surgery as part of an Endocarditis Team is the standard of care.",
        bullets: [
          "Heart failure due to valve dysfunction — the most common indication.",
          "Uncontrolled infection: persistent bacteremia or fever beyond ~5–7 days despite appropriate therapy, fungal or highly resistant organisms.",
          "Perivalvular extension: abscess, fistula, heart block.",
          "Embolic events despite appropriate therapy, or large (>10 mm) mobile vegetations with high embolic risk; vegetation >15 mm and mobile carries the highest risk.",
          "AEPE score (Actionable Points in Endocarditis) quantifies urgent-surgical-need features. ELDER score predicts in-hospital mortality in elderly IE. [VERIFY current versions]",
        ],
      },
    ],
    scoringTools: [
      {
        name: "2023 ISCVID Duke Criteria (revised)",
        purpose: "Standardized clinical diagnosis of infective endocarditis — supersedes the modified Duke criteria.",
        points: [
          { factor: "MAJOR — Typical microorganism in blood cultures from 2 separate sites: viridans strep, S. gallolyticus, HACEK, OR S. aureus", score: "major" },
          { factor: "MAJOR — Persistent bacteremia (≥2 positive cultures >12 h apart, or ≥3 of 4) with typical organism", score: "major" },
          { factor: "MAJOR — Single positive Coxiella burnetii blood culture OR phase I IgG ≥ 1:800", score: "major" },
          { factor: "MAJOR — Endocardial involvement on echo: vegetation, abscess, new partial dehiscence of prosthetic valve", score: "major" },
          { factor: "MAJOR — Endocardial involvement on CT: perivalvular abscess or native-valve vegetation [2023 addition]", score: "major" },
          { factor: "MAJOR — Abnormal 18F-FDG PET/CT or radiolabeled-leukocyte SPECT/CT uptake around a prosthetic valve implanted <3 months ago [2023 addition]", score: "major" },
          { factor: "MAJOR — New pulmonary emboli in suspected right-sided IE [2023 addition]", score: "major" },
          { factor: "MINOR — Predisposition: predisposing heart condition OR injection drug use", score: "minor" },
          { factor: "MINOR — Fever ≥ 38 °C", score: "minor" },
          { factor: "MINOR — Vascular phenomena: arterial emboli, septic pulmonary infarcts, mycotic aneurysm, intracranial hemorrhage, conjunctival hemorrhages, Janeway lesions", score: "minor" },
          { factor: "MINOR — Immunologic phenomena: glomerulonephritis, Osler nodes, Roth spots, rheumatoid factor", score: "minor" },
          { factor: "MINOR — Microbiologic finding not meeting a major criterion", score: "minor" },
        ],
        interpretation: [
          { range: "Definite IE", meaning: "Pathologic or clinical certainty", action: "2 major, OR 1 major + 3 minor, OR 5 minor criteria. [VERIFY exact combinations — also Definite on pathologic/histologic evidence] Treat as IE." },
          { range: "Possible IE", meaning: "Suggestive but not definitive", action: "1 major + 1 minor, OR 3 minor criteria. [VERIFY] Continue workup and treat empirically while awaiting data." },
          { range: "Rejected", meaning: "Alternative diagnosis or no evidence", action: "Firm alternative diagnosis, OR resolution with ≤4 days of antibiotics, OR no pathologic evidence after ≤4 days. [VERIFY] Pursue the alternative diagnosis." },
        ],
        source: "2023 ISCVID Duke Criteria — Task Force on Criteria for IE. [VERIFY exact citation — Clin Infect Dis 2023 / companion in JAMA]",
      },
    ],
    differentials: [
      {
        diagnosis: "Non-endocarditis bacteremia",
        distinguishing: "Bacteremia without endocardial involvement; diagnosis rests on imaging and clinical course.",
      },
      {
        diagnosis: "Culture-negative endocarditis",
        distinguishing: "Sustained clinical picture with negative cultures; think Coxiella, Bartonella, HACEK, T. whipplei, or prior antibiotics.",
      },
      {
        diagnosis: "Non-bacterial thrombotic (marantic) endocarditis",
        distinguishing: "Sterile vegetations in malignancy or hypercoagulable states; no bacteremia or fever.",
      },
      {
        diagnosis: "Libman-Sacks endocarditis",
        distinguishing: "Sterile vegetations in systemic lupus erythematosus.",
      },
      {
        diagnosis: "Atrial myxoma",
        distinguishing: "Constitutional symptoms and emboli without infection; echo is diagnostic.",
      },
    ],
    regimenTables: [
      {
        title: "Organism-directed therapy (illustrative — confirm with current ISCVID/ESC/AHA-IDSA guideline)",
        rows: [
          {
            scenario: "Native valve, methicillin-susceptible S. aureus",
            regimen: "Nafcillin or oxacillin (cefazolin as alternative)",
            duration: "6 weeks",
            note: "No routine aminoglycoside. No routine rifampin (ARREST, CAMERA2 — no benefit, more harm).",
          },
          {
            scenario: "Native or prosthetic valve, MRSA",
            regimen: "Vancomycin (AUC-guided); daptomycin if vancomycin cannot be used",
            duration: "6 weeks",
          },
          {
            scenario: "Viridans streptococci, penicillin-susceptible (MIC ≤ 0.12)",
            regimen: "Penicillin G or ceftriaxone",
            duration: "4 weeks",
          },
          {
            scenario: "Prosthetic valve, coagulase-negative staphylococci",
            hostFactors: "Early prosthetic-valve IE",
            regimen: "Vancomycin + rifampin + gentamicin (initial 2 weeks)",
            duration: "≥ 6 weeks",
            note: "Rifampin is for the biofilm of prosthetic material — NOT for native-valve IE.",
          },
          {
            scenario: "Enterococcus faecalis, ampicillin-susceptible",
            hostFactors: "High-level aminoglycoside resistance (HLAR)",
            regimen: "Ampicillin + ceftriaxone (double beta-lactam — avoids aminoglycoside nephrotoxicity when HLAR)",
            duration: "6 weeks",
          },
          {
            scenario: "Selected stable left-sided IE (oral step-down)",
            hostFactors: "Afebrile, improving, negative cultures, susceptible organism (strep, enterococcus, E. coli); NOT S. aureus",
            regimen: "High-bioavailability oral regimen (e.g., amoxicillin ± fluoroquinolone/rifampin per organism) after initial IV course",
            duration: "Total 4–6 weeks (POET/POSITIVE)",
            note: "Per POET (NEJM 2019) and POSITIVE (JAMA 2024 [VERIFY]); case-select carefully.",
          },
        ],
      },
    ],
    complications: [
      {
        name: "Embolic stroke & systemic emboli",
        recognize: "Acute focal neurologic deficit, splenic or renal infarct, mesenteric ischemia; embolic risk highest in the first week and with large mobile vegetations (>10 mm, highest >15 mm).",
        manage: "Repeat imaging; involve neurology/stroke team. Surgery timing after stroke requires multidisciplinary discussion (avoid heparin); intracranial mycotic aneurysm may require neurosurgery/neurointerventional.",
      },
      {
        name: "Perivalvular extension (abscess, fistula, heart block)",
        recognize: "New conduction abnormality (PR prolongation → heart block) on telemetry, persistent bacteremia, TEE showing abscess/dehiscence.",
        manage: "Urgent surgical evaluation — perivalvular extension is a surgical indication. Aortic-root abscess is a surgical emergency.",
      },
      {
        name: "Acute severe valve regurgitation & heart failure",
        recognize: "Pulmonary edema, cardiogenic shock, new murmur; the most common indication for surgery.",
        manage: "Urgent surgical evaluation; medical stabilization (afterload reduction, diuresis) as a bridge to surgery.",
      },
      {
        name: "Mycotic aneurysm",
        recognize: "Headache, neurologic change, or hemorrhage; cerebral, visceral, or peripheral arterial distribution.",
        manage: "CTA/MRA imaging; neurosurgery or interventional radiology consultation; treatment individualized (resection, embolization, or surveillance).",
      },
      {
        name: "Splenic abscess & renal injury",
        recognize: "Persistent fever, left-upper-quadrant pain; renal failure from immune-complex GN, emboli, or drug toxicity.",
        manage: "Splenic abscess often needs percutaneous or surgical drainage; renal injury — distinguish GN vs drug toxicity vs emboli and adjust therapy.",
      },
    ],
    prognosis: [
      { metric: "In-hospital mortality (all IE)", value: "~15–25% [VERIFY]" },
      { metric: "S. aureus IE mortality", value: "~20–30% [VERIFY]" },
      { metric: "Prosthetic-valve IE mortality", value: "~20–40% [VERIFY]" },
      { metric: "1-year mortality", value: "~30–40% [VERIFY]" },
      { metric: "Embolic risk", value: "Highest in the first week; vegetation >10 mm higher; >15 mm and mobile highest" },
      { metric: "Outcome determinant", value: "Early cultures, early imaging, early Endocarditis Team involvement" },
    ],
    specialPopulations: [
      {
        population: "Prosthetic valve IE",
        considerations: "Classified early (<1 year, often nosocomial/CoNS) vs late (>1 year, resembles native valve). Biofilm mandates rifampin in staphylococcal PVE after debridement. Lower threshold for surgery; PET/CT or WBC SPECT/CT now a major Duke criterion within 3 months of implantation.",
      },
      {
        population: "Injection drug use (right-sided IE)",
        considerations: "S. aureus predominates; tricuspid valve; septic pulmonary emboli are the hallmark. Shorter courses (2–4 weeks) are often appropriate in uncomplicated right-sided IE with clearance. Address addiction — offer MOUD (medication for opioid use disorder) and harm reduction to prevent recurrence.",
      },
      {
        population: "Pregnancy",
        considerations: "Treat aggressively — beta-lactams are safe in pregnancy; avoid aminoglycosides when possible (fetal ototoxicity), fluoroquinolones, and tetracyclines. Multidisciplinary care with OB and cardiothoracic surgery.",
      },
      {
        population: "Cardiac implantable electronic device (CIED) infection",
        considerations: "Pocket or lead infection — requires COMPLETE device and lead extraction by electrophysiology, not just antibiotics. Cultures of the explanted lead guide therapy. Do NOT leave an infected lead in place.",
      },
      {
        population: "Healthcare-associated / line-related",
        considerations: "Often S. aureus, CoNS, enterococci, or gram-negatives from catheters. Remove infected lines early; source control is central. Higher rates of resistant organisms — broaden empirically and narrow on susceptibilities.",
      },
    ],
    prevention: [
      {
        modality: "Antimicrobial prophylaxis before dental procedures",
        target: "HIGH-RISK cardiac conditions ONLY: prosthetic valve (including transcatheter-implanted and prosthetic material used in repair), prior IE, specific unrepaired or repaired-with-residual CHD, cardiac transplant with valvulopathy",
        detail: "Amoxicillin 2 g PO 30–60 min before procedures that manipulate gingiva or tooth apex. Ampicillin 2 g IM/IV, or cefazolin/ceftriaxone, if unable to take PO. Routine prophylaxis for GI/GU procedures is NOT recommended. [VERIFY current AHA/IDSA status]",
      },
      {
        modality: "Optimal oral hygiene",
        target: "All patients at risk",
        detail: "Daily dental care and regular professional dental care reduce the burden of transient bacteremia and IE risk — at least as important as procedural prophylaxis.",
      },
      {
        modality: "Injection-drug-use harm reduction",
        target: "People who inject drugs",
        detail: "Offer MOUD (buprenorphine/methadone), naloxone, syringe-service referral, and screening for endovascular infection early — the highest-yield prevention of recurrent IE in this population.",
      },
      {
        modality: "Catheter & surgical best practices",
        target: "Hospitalized and procedural patients",
        detail: "Strict aseptic central-line insertion, bundled maintenance, and prompt removal of unneeded catheters reduce healthcare-associated IE.",
      },
    ],
    whenToRefer: [
      "ID consultation for every case of suspected or confirmed IE — multidisciplinary Endocarditis Team is the standard of care.",
      "Cardiothoracic surgery early for heart failure, uncontrolled infection, perivalvular extension, large mobile vegetations, or embolic events despite therapy.",
      "Electrophysiology for CIED infection — lead and device extraction.",
      "Neurology / neurosurgery / interventional neuroradiology for embolic stroke or mycotic aneurysm.",
      "Nephrology for immune-complex glomerulonephritis or drug-related nephrotoxicity.",
      "Interventional radiology or general surgery for splenic abscess or other drainable metastatic collections.",
      "Addiction medicine for injection-drug-use-associated IE (MOUD reduces recurrence).",
    ],
    followUp: [
      "Repeat blood cultures every 24–48 hours until clearance — persistent bacteremia is a clue to a complication or source-control failure.",
      "Serial TTE (and TEE when indicated) to monitor vegetations, valve function, and complications.",
      "Total therapy typically 4–6 weeks IV; selected stable left-sided IE may complete orally (POET/POSITIVE). [VERIFY eligibility]",
      "Monitor renal, hepatic, and hematologic toxicity of prolonged therapy (vancomycin AUC, beta-lactam levels in renal failure, linezolid CBC for >2 weeks).",
      "Dental evaluation for viridans-streptococcal IE (source control; colorectal cancer screening for S. gallolyticus).",
      "Watch for embolic events and immune-complex disease during and after therapy; counsel on symptoms.",
    ],
    evidence: [
      {
        title: "2023 ISCVID Duke Criteria for Infective Endocarditis (revised)",
        source: "Task Force on Criteria for IE. Clin Infect Dis 2023 [VERIFY exact authors/volume/pages; companion paper in JAMA]",
        kind: "guideline",
        focus: "The current diagnostic standard — supersedes the modified Duke criteria. Adds CT, PET/CT, and SPECT/CT findings and reclassifies S. aureus as a major criterion.",
      },
      {
        title: "2023 ESC Guidelines for the management of infective endocarditis",
        source: "European Society of Cardiology. [VERIFY exact citation]",
        kind: "guideline",
        focus: "Comprehensive European guideline — Endocarditis Team, imaging, surgery, therapy.",
      },
      {
        title: "Infective Endocarditis in Adults: Diagnosis, Antimicrobial Therapy, and Management of Complications",
        source: "Baddour LM, et al. Circulation. 2015 (AHA/IDSA foundational guideline)",
        url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000396",
        kind: "guideline",
        focus: "Foundational AHA/IDSA guideline — many principles still current; some therapy updated by 2023 ISCVID/ESC.",
      },
      {
        title: "POET — Partial Oral versus Intravenous Antibiotic Treatment of Endocarditis",
        source: "Iversen K, et al. N Engl J Med. 2019;380:415–424",
        kind: "trial",
        focus: "Non-inferiority of partial oral therapy in selected stable left-sided IE (strep, enterococcus, E. coli).",
      },
      {
        title: "POSITIVE — Partial Oral Treatment for Endocarditis",
        source: "Wald et al. JAMA 2024 [VERIFY exact volume/pages]",
        kind: "trial",
        focus: "Contemporary support for oral step-down in selected left-sided IE.",
      },
      {
        title: "CAMERA2 — Adjunctive rifampin for Staphylococcus aureus bacteremia",
        source: "Tong SYC, et al. [VERIFY exact citation — NEJM/JAMA]",
        kind: "trial",
        focus: "No mortality benefit and more adverse events — do NOT routinely add rifampin to native-valve SAB.",
      },
      {
        title: "ARREST — Adjunctive rifampin for Staphylococcus aureus bacteremia",
        source: "Turnbull E, et al. [VERIFY — Lancet Infect Dis / NEJM]",
        kind: "trial",
        focus: "No benefit of rifampin in SAB; supports avoiding routine use.",
      },
      {
        title: "Infective Endocarditis",
        source: "Cahill TJ, Prendergast BD. N Engl J Med. 2016",
        url: "https://www.nejm.org/doi/full/10.1056/NEJMcp1509822",
        kind: "review",
        focus: "A concise, high-yield NEJM clinical review (pre-2023 criteria — update needed).",
      },
      {
        title: "Principles and Practice of Infectious Diseases, 9e — Infective Endocarditis chapter",
        source: "Mandell, Bennett, Dolin",
        kind: "book",
        focus: "Comprehensive reference for organism-directed therapy and surgery.",
      },
    ],
    pearls: [
      "Use the 2023 ISCVID Duke criteria — not the modified Duke. New major criteria: CT/PET findings, native-valve vegetations on CT, S. aureus bacteremia, new pulmonary emboli in right-sided IE. [VERIFY]",
      "S. aureus bacteremia → echocardiography is mandatory; a negative TTE mandates a TEE.",
      "Three sets of blood cultures, drawn from separate sites, before antibiotics.",
      "Culture-negative endocarditis → send Coxiella (phase I IgG ≥ 1:800), Bartonella, HACEK, T. whipplei serology/PCR. [VERIFY Coxiella titer]",
      "Do NOT routinely add rifampin to native-valve S. aureus bacteremia — ARREST and CAMERA2 showed no benefit and more harm. Rifampin is for prosthetic-material biofilm after debridement.",
      "Enterococcus with HLAR → ampicillin + ceftriaxone (double beta-lactam) instead of aminoglycoside.",
      "New heart block on telemetry → think aortic-root abscess → urgent surgery.",
      "Embolic risk highest first week; vegetation >10 mm higher, >15 mm + mobile highest.",
      "Selected stable left-sided IE (NOT S. aureus) can complete orally — POET and POSITIVE.",
      "CIED infection = complete device AND lead extraction by electrophysiology.",
      "S. gallolyticus (formerly S. bovis) IE → colonoscopy to exclude colorectal neoplasia.",
    ],
    syndromeTags: ["Endocarditis", "Cardiovascular", "Cardiovascular Infections", "Bacteremia", "Sepsis & Bacteremia"],
    conceptTags: [
      "2023 ISCVID Duke criteria",
      "Modified Duke criteria",
      "Blood cultures",
      "TEE",
      "TTE",
      "Vegetation",
      "Prosthetic valve",
      "POET",
      "POSITIVE",
      "CAMERA2",
      "ARREST",
      "Rifampin",
      "Culture-negative endocarditis",
      "Endocarditis prophylaxis",
    ],
    tools: [
      { href: "/mechid", label: "MechID", why: "Antimicrobial mechanisms and resistance relevant to prolonged IE therapy." },
      { href: "/tools/doseid", label: "DoseID", why: "AUC-guided vancomycin and prolonged parenteral dosing." },
      { href: "/tools/spectrum", label: "Spectrum", why: "Verify organism-directed coverage and de-escalation." },
      { href: "/probid", label: "ProbID", why: "Pretest framing for endocarditis in unexplained bacteremia." },
    ],
    furtherReading: [
      {
        title: "Contemporary management of infective endocarditis",
        source: "Pettersson GB, Hussain ST. Lancet [VERIFY most recent edition]",
        kind: "review",
      },
      {
        title: "The 2023 Duke-ISCVID criteria for infective endocarditis — what changed and why",
        source: "[VERIFY — identify the 2023 ISCVID summary/editorial]",
        kind: "review",
      },
    ],
  },

  {
    slug: "antimicrobial-stewardship",
    title: "Antimicrobial stewardship & spectrum",
    category: "Antimicrobial & Diagnostic Stewardship",
    summary:
      "Stewardship is choosing the right drug, dose, route, and duration — and knowing when not to treat at all. It improves outcomes, limits resistance, reduces C. difficile, and is a core competency for every Internal Medicine resident.",
    readMins: 12,
    difficulty: "core",
    lastReviewed: "2026-07-21",
    lastUpdated: "2026-07-21",
    atAGlance: [
      "The four pillars: right drug, right dose, right route, right duration — and the fifth, no drug at all when not indicated.",
      "De-escalate empiric broad therapy to the narrowest effective agent at 48–72 hours once cultures return.",
      "Run an 'antibiotic timeout' at 48–72 hours on every antibiotic you start: still needed? narrower? shorter? oral?",
      "Do not treat asymptomatic bacteriuria (except pregnancy and before urologic procedures with mucosal bleeding).",
      "Shorter is better: 7 days is enough for most uncomplicated gram-negative bacteremia (PITT, BACTEREMIA meta-analysis).",
      "Beta-lactams are time-dependent → maximize time above MIC with extended/continuous infusion in serious infection.",
      "Vancomycin is dosed to AUC₀₋₂₄ 400–600 (Bayesian preferred); trough-only monitoring is obsolete for MRSA.",
      "~9 of 10 patients labeled 'penicillin allergic' tolerate beta-lactams — delabel low-risk labels with PEN-FAST and an oral amoxicillin challenge.",
      "Fluoroquinolones, linezolid, metronidazole, TMP-SMX, and fluconazole are ~100% orally bioavailable — convert IV→PO early.",
    ],
    objectives: [
      "Define antimicrobial stewardship and its goals (outcomes, resistance, C. difficile, cost).",
      "Apply de-escalation and the structured antibiotic timeout in everyday practice.",
      "Choose empiric therapy using the syndrome, the antibiogram, and patient risk factors.",
      "Recognize when antibiotics are not indicated (asymptomatic bacteriuria, colonization, viral syndromes).",
      "Apply PK/PD principles: beta-lactam time above MIC, concentration-dependent agents, AUC-based vancomycin.",
      "Delabel penicillin allergy in low-risk patients using PEN-FAST and oral amoxicillin challenge.",
      "Select oral step-down therapy using drug bioavailability and clinical response.",
      "Identify the major antibiotic-associated adverse effects and 'collateral damage' (VRE, ESBL, C. difficile).",
    ],
    keyConcepts: [
      {
        heading: "What stewardship is and why it matters",
        prose:
          "Antimicrobial stewardship is the coordinated set of interventions designed to optimize antibiotic use. It is not about denying antibiotics — it is about giving the right drug, at the right dose, by the right route, for the right duration, and only when indicated. The benefits accrue to the individual patient and to the population.",
        bullets: [
          "Better outcomes: appropriate therapy faster, fewer adverse events.",
          "Less resistance: antibiotic pressure drives resistance at the unit and hospital level.",
          "Less C. difficile: antibiotic exposure is the single biggest modifiable risk factor.",
          "Lower cost and toxicity: unnecessary days and redundant coverage add up.",
        ],
        question: {
          pollId: "train-stewardship-why-q1",
          prompt:
            "Which of the following is the best description of antimicrobial stewardship?",
          options: [
            {
              id: "A",
              label: "Restricting antibiotics to reduce hospital pharmacy costs",
              feedback:
                "Cost reduction is a side benefit, but the core goals are clinical outcomes, resistance, and patient safety — stewardship is not primarily a cost-containment exercise.",
            },
            {
              id: "B",
              label:
                "Using the right drug, dose, route, and duration — and avoiding antibiotics when not indicated",
              correct: true,
              feedback:
                "Correct. Stewardship is optimization across all four dimensions, plus the discipline of not treating when antibiotics are unnecessary.",
            },
            {
              id: "C",
              label: "Always using the narrowest possible antibiotic regardless of clinical context",
              feedback:
                "Narrowing is central to stewardship, but empiric therapy for a sick patient must be adequately broad. Stewardship is about appropriateness, not narrowness at all costs.",
            },
            {
              id: "D",
              label: "Requiring infectious diseases consultation for every antibiotic",
              feedback:
                "ID consultation is helpful for complex cases but is not the definition of stewardship; good stewardship is a frontline responsibility.",
            },
          ],
        },
      },
      {
        heading: "The antibiogram & the empiric choice",
        prose:
          "Empiric therapy is chosen before susceptibilities are known, so it must be informed by the likely organism and local resistance patterns. The hospital antibiogram summarizes the susceptibility of common isolates over the prior year and is the indispensable reference for empiric decisions at your institution.",
        bullets: [
          "Identify the syndrome and the likely organisms first; then pick a drug that covers them.",
          "Cross-check against your unit antibiogram — empiric choices that worked elsewhere may fail locally.",
          "Weigh host factors: allergy, renal/hepatic function, weight, pregnancy, immunocompromise, recent antibiotics.",
          "Avoid redundancy: double anaerobic or double MRSA coverage is rarely needed empirically.",
        ],
      },
      {
        heading: "De-escalation, narrowing, and the antibiotic timeout",
        prose:
          "The most impactful single stewardship habit is the structured review of every antibiotic at 48–72 hours, once culture and susceptibility data return. This 'timeout' asks three questions: is the antibiotic still needed, can it be narrowed, and how long should it run?",
        bullets: [
          "Stop empiric coverage for organisms not isolated (e.g., stop MRSA coverage when cultures grow an organism without MRSA risk).",
          "Narrow to the narrowest effective agent based on susceptibilities.",
          "Convert IV to oral when the patient is stable and an oral option with good bioavailability exists.",
          "Set a clear stop date or reassessment date at the time of ordering.",
        ],
        question: {
          pollId: "train-stewardship-deescalation-q1",
          prompt:
            "A patient was started on vancomycin + cefepime + metronidazole for suspected sepsis. At 48 hours, blood cultures grow E. coli susceptible to ceftriaxone; the patient is improving and afebrile. What is the best action?",
          options: [
            {
              id: "A",
              label: "Continue all three antibiotics to complete a 14-day course",
              feedback:
                "Continuing unnecessary MRSA and anaerobic coverage adds toxicity and resistance risk without benefit.",
            },
            {
              id: "B",
              label: "De-escalate to ceftriaxone and stop vancomycin and metronidazole",
              correct: true,
              feedback:
                "Correct. With a susceptible organism and a responding patient, narrow to ceftriaxone and stop the empiric MRSA and anaerobic coverage. This is textbook de-escalation.",
            },
            {
              id: "C",
              label: "Stop all antibiotics immediately",
              feedback:
                "The patient has a confirmed E. coli bacteremia and needs directed therapy — stopping everything is premature.",
            },
            {
              id: "D",
              label: "Switch to piperacillin-tazobactam for broader coverage",
              feedback:
                "Broadening when a narrower, active agent is identified is the opposite of stewardship.",
            },
          ],
        },
      },
      {
        heading: "Duration: less is more",
        prose:
          "For decades, courses were long by tradition. Modern trials have repeatedly shown that shorter durations are as effective for many common infections and carry less risk of resistance and C. difficile. The 2022 BACTEREMIA individual-patient-data meta-analysis of 9 randomized trials and the PITT trial (von Dach et al. 2023) established that 7 days is non-inferior to 14 days for uncomplicated Enterobacterales bacteremia in clinically responding patients. When a patient is improving and source control is adequate, default to the shortest evidence-based duration.",
        bullets: [
          "Uncomplicated cystitis: 3–5 days (nitrofurantoin 5 days, TMP-SMX 3 days, fosfomycin single-dose).",
          "Pyelonephritis: 5–7 days (fluoroquinolone) or 7–14 days (beta-lactam).",
          "Community-acquired pneumonia (responding): ≥5 days minimum, if afebrile 48–72 h and clinically stable.",
          "Cellulitis (non-purulent): 5–6 days.",
          "Uncomplicated gram-negative bacteremia: 7 days from first negative culture (PITT; BACTEREMIA meta-analysis — non-inferior to 14 days). [VERIFY PITT inclusion criteria and 7-day definition]",
          "Intra-abdominal infection (source-controlled): 4 days post-source-control (STOP-IT).",
          "Do NOT shorten when: source control incomplete, endovascular infection, slow clinical response, metastatic foci, or immunocompromise.",
        ],
      },
      {
        heading: "PK/PD: time- vs concentration-dependent, and why it changes dosing",
        prose:
          "Pharmacokinetic/pharmacodynamic (PK/PD) principles describe how a drug's exposure relates to its effect and guide dosing and optimization. Beta-lactams kill based on the fraction of the dosing interval free drug concentrations exceed the organism's MIC (fT>MIC); aminoglycosides, fluoroquinolones, and daptomycin kill based on peak exposure (Cmax/MIC or AUC/MIC). Translating PK/PD to the bedside is the foundation of modern optimization — extended infusions, once-daily aminoglycosides, and AUC-guided vancomycin.",
        bullets: [
          "Beta-lactams: maximize fT>MIC — for severe pseudomonal or resistant infection use extended (3–4 h) or continuous infusion of piperacillin-tazobactam, cefepime, or meropenem. [VERIFY outcome evidence]",
          "Aminoglycosides: extended-interval (once-daily) dosing exploits concentration-dependent killing and a long post-antibiotic effect; monitor for nephro/ototoxicity.",
          "Vancomycin: AUC₀₋₂₄ 400–600 for serious MRSA infection — Bayesian dosing (2 timed levels or software) is preferred over the 2-trapezoidal-level method; trough-only monitoring is no longer recommended (Rybak 2020 consensus). [VERIFY Bayesian vs trapezoidal recommendation strength]",
          "Daptomycin: concentration-dependent; dosing escalates with weight and indication (6 mg/kg for S. aureus bacteremia; higher for VRE).",
          "Vancomycin + piperacillin-tazobactam: associated with higher AKI than either alone — reconsider the combination when both are not essential. [VERIFY magnitude of AKI risk]",
        ],
      },
      {
        heading: "IV-to-oral conversion: bioavailability drives the step-down",
        prose:
          "Early IV-to-oral switch shortens length of stay, line days, and cost without harming outcomes — provided the patient is hemodynamically stable, tolerating oral intake, and the chosen oral agent reaches the infection site. The decision rests almost entirely on oral bioavailability: drugs with near-complete bioavailability are pharmacokinetically equivalent IV and PO, so continuing IV therapy is purely a delivery issue, not an efficacy one.",
        bullets: [
          "Near-100% bioavailable (effectively interchangeable IV/PO): fluoroquinolones, linezolid, metronidazole, TMP-SMX, fluconazole, and doxycycline.",
          "Good but variable bioavailability: beta-lactams (amoxicillin ~80%, cephalexin ~90%, cefuroxime ~50%), clindamycin (~90%), and azithromycin (~37%).",
          "Convert when: clinically improving, afebrile 24–48 h, tolerating PO, hemodynamically stable, and an oral agent with adequate bioavailability and tissue penetration exists.",
          "Avoid oral step-down when absorption is unreliable (ileus, neutropenic enterocolitis, severe shock, malabsorption) or the source is endovascular, CNS, or undrained.",
        ],
        question: {
          pollId: "train-stewardship-ivpo-q1",
          prompt:
            "A patient with E. coli bacteremia from a urinary source is improving on IV ceftriaxone by day 3, tolerating a regular diet, and hemodynamically stable. Susceptibilities show an oral option with near-complete bioavailability. Best step-down?",
          options: [
            {
              id: "A",
              label: "Complete 14 days IV ceftriaxone before any change",
              feedback:
                "Prolonged IV therapy adds line and stay cost without outcome benefit when an active oral agent is available and the patient is stable.",
            },
            {
              id: "B",
              label: "Convert to an appropriate oral agent with high bioavailability (e.g., TMP-SMX, levofloxacin, or oral cephalexin if susceptible) once clinically stable",
              correct: true,
              feedback:
                "Correct. With a controlled source, clinical improvement, and a bioavailable oral option, oral step-down is safe and standard for uncomplicated gram-negative bacteremia.",
            },
            {
              id: "C",
              label: "Switch to oral vancomycin because it has excellent tissue penetration",
              feedback:
                "Oral vancomycin is not systemically absorbed — it treats C. difficile, not bacteremia. It is the wrong drug for this infection.",
            },
            {
              id: "D",
              label: "Continue IV but add an oral agent for synergy",
              feedback:
                "There is no synergy rationale here, and dual therapy adds harm and resistance pressure.",
            },
          ],
        },
      },
      {
        heading: "Penicillin allergy delabeling: a high-yield stewardship intervention",
        prose:
          "Roughly 9 in 10 patients who carry a penicillin allergy label are not truly allergic, yet the label drives broader, more toxic alternatives (vancomycin, fluoroquinolones, aztreonam) and is associated with longer stays, more resistance, and worse outcomes. Delabeling is a core stewardship action and can be done safely at the bedside with a validated tool. The PEN-FAST score combines a brief history (PENicillin allergy, New reaction, Severe reaction, Time since last reaction) with a point score that stratifies risk and identifies candidates for direct oral amoxicillin challenge without skin testing.",
        bullets: [
          "PEN-FAST 0: very low risk — oral amoxicillin challenge (single dose, observed) without prior skin testing. [VERIFY exact PEN-FAST components and cutoffs]",
          "PEN-FAST 1–2: low-moderate risk — skin testing or graded oral challenge under supervision.",
          "PEN-FAST ≥3: higher risk — referral to allergy/immunology; consider skin testing or supervised challenge.",
          "Side-chain cross-reactivity (not the beta-lactam ring) is what matters: cefazolin and ceftriaxone do not share side chains with penicillin and are safe in most penicillin-allergic patients without anaphylaxis.",
          "Anaphylaxis, SJS/TEN, or severe delayed reactions (DRESS, AGEP) are NOT candidates for bedside delabeling — refer to allergy.",
        ],
        question: {
          pollId: "train-stewardship-penfast-q1",
          prompt:
            "A 60-year-old with a 'penicillin allergy — rash as a child, 50 years ago, never re-exposed' needs ceftriaxone for pyelonephritis. The label is the only barrier. Best stewardship action?",
          options: [
            {
              id: "A",
              label: "Give aztreonam to be safe",
              feedback:
                "Aztreonam has poor gram-positive coverage and bypasses a delabeling opportunity; it is rarely the right empiric answer for this scenario.",
            },
            {
              id: "B",
              label: "Give vancomycin + aztreonam for full coverage",
              feedback:
                "Over-broad, exposes the patient to nephrotoxicity, and perpetuates an almost certainly obsolete allergy label.",
            },
            {
              id: "C",
              label: "Assess with PEN-FAST; if low-risk, give oral amoxicillin challenge (or ceftriaxone directly if bedside challenge impractical and reaction was non-severe)",
              correct: true,
              feedback:
                "Correct. A childhood rash decades ago with no re-exposure is PEN-FAST 0 (or 1). Low-risk labels can be delabeled and the patient given the optimal beta-lactam, with documentation of the delabeling.",
            },
            {
              id: "D",
              label: "Refer to allergy for skin testing and withhold all antibiotics until then",
              feedback:
                "Skin testing is reasonable for higher-risk labels but is overkill and impractical when you need to treat now; bedside risk-stratification and challenge is appropriate.",
            },
          ],
        },
      },
      {
        heading: "Adverse effects & toxicity",
        prose:
          "Every antibiotic has a toxicity profile. Knowing the signature adverse effects lets you anticipate, monitor, and choose safer alternatives — and it is high-yield for both the wards and the boards.",
        bullets: [
          "Beta-lactams: allergy, interstitial nephritis, C. difficile.",
          "Vancomycin: nephrotoxicity (especially with piperacillin-tazobactam), infusion reaction, ototoxicity at high levels.",
          "Aminoglycosides: nephrotoxicity, ototoxicity — monitor levels and duration.",
          "Fluoroquinolones: QT prolongation, tendinopathy/rupture, dysglycemia, CNS effects, aortic warning — reserve for clear indications.",
          "Daptomycin: inactivated by pulmonary surfactant — never for pneumonia; monitor creatine kinase for myopathy.",
          "Linezolid: thrombocytopenia, neuropathy, and serotonin syndrome with prolonged use (>2 weeks) or serotonergic drugs.",
          "Colistin/polymyxin: nephrotoxicity and neurotoxicity — drug of last resort.",
        ],
      },
      {
        heading: "Special situations: asymptomatic bacteriuria & prophylaxis",
        prose:
          "Two scenarios generate the most unnecessary antibiotics on a medicine service: treating asymptomatic bacteriuria and prolonging surgical prophylaxis. Both are teachable moments. Treating asymptomatic bacteriuria does not prevent symptomatic infection in most patients and increases harm — with two well-defined exceptions.",
        bullets: [
          "Do NOT treat asymptomatic bacteriuria — except in pregnancy and before urologic procedures with mucosal bleeding.",
          "Pyuria alone does not require treatment in the absence of symptoms.",
          "Surgical prophylaxis: single preoperative dose; stop within 24 hours (48 hours for cardiac); do not continue as 'coverage.'",
          "Treat the patient, not the culture or the colonization.",
        ],
      },
    ],
    regimenTables: [
      {
        title: "Common infection durations (when clinically responding and source-controlled)",
        rows: [
          {
            scenario: "Uncomplicated cystitis (women)",
            regimen: "Nitrofurantoin 5 d, or TMP-SMX 3 d, or a single dose of fosfomycin",
            duration: "3–5 d",
          },
          {
            scenario: "Acute uncomplicated pyelonephritis",
            regimen: "Fluoroquinolone or TMP-SMX (if susceptible); beta-lactam alternative",
            duration: "5–7 d (FQ) or 7–14 d (beta-lactam)",
          },
          {
            scenario: "Community-acquired pneumonia (responding)",
            regimen: "Standard empiric regimen",
            duration: "≥5 d, if afebrile 48–72 h and clinically stable",
          },
          {
            scenario: "Non-purulent cellulitis",
            regimen: "Beta-lactam active against streptococci (e.g., cephalexin)",
            duration: "5–6 d",
          },
          {
            scenario: "Uncomplicated gram-negative bacteremia",
            hostFactors: "Source identified and controlled; prompt response",
            regimen: "Directed by susceptibility",
            duration: "7 d from first negative culture",
            note: "PITT (JAMA Intern Med 2023) and BACTEREMIA IPD meta-analysis (Yahav et al. JAMA 2022) — non-inferior to 14 d. [VERIFY]",
          },
          {
            scenario: "Intra-abdominal infection",
            hostFactors: "Adequate source control (STOP-IT)",
            regimen: "Directed by cultures",
            duration: "4 d post-source-control",
          },
        ],
      },
      {
        title: "Oral bioavailability: when IV→PO switch is pharmacokinetically equivalent",
        rows: [
          {
            scenario: "Near-complete bioavailability (≥90%) — IV→PO interchangeable",
            regimen: "Fluoroquinolones (cipro/levo/moxi), linezolid, metronidazole, TMP-SMX, fluconazole, doxycycline",
            duration: "Convert as soon as clinically stable",
          },
          {
            scenario: "Good bioavailability (50–90%) — usually suitable for step-down",
            regimen: "Amoxicillin (~80%), cephalexin (~90%), clindamycin (~90%), azithromycin (~37% with tissue accumulation)",
            duration: "Convert when stable and tolerating PO",
          },
          {
            scenario: "Low or unreliable bioavailability — not for serious infection step-down",
            regimen: "Vancomycin (PO not absorbed — treats C. difficile only), aminoglycosides, polymyxins, IV azoles other than fluconazole",
            duration: "Do not use PO for systemic infection",
          },
        ],
      },
      {
        title: "Targeted empiric choices for resistant gram-negatives (illustrative — confirm with current IDSA guidance)",
        rows: [
          {
            scenario: "ESBL-producing E. coli / Klebsiella bacteremia (MERINO)",
            hostFactors: "Carbapenem-susceptible",
            regimen: "Carbapenem (meropenem, ertapenem, imipenem) — NOT piperacillin-tazobactam",
            duration: "Per syndrome; typically 7 d for uncomplicated bacteremia",
            note: "MERINO (Harris et al. JAMA 2018): pip-tazo higher 30-d mortality vs ceftriaxone for ESBL E. coli bacteremia. [VERIFY MERINO-2 / ongoing data]",
          },
          {
            scenario: "Difficult-to-treat (DTR) Pseudomonas (non-carbapenem-β-lactam-resistant)",
            hostFactors: "Per 2024 IDSA AMR guidance [VERIFY]",
            regimen: "Ceftolozane-tazobactam, ceftazidime-avibactam, imipenem-relebactam, or cefiderocol",
            duration: "Per syndrome; consider extended infusion",
          },
          {
            scenario: "AmpC-inducible Enterobacterales (Enterobacter, Citrobacter, Serratia)",
            hostFactors: "Avoid 3rd-gen cephalosporins for serious infection",
            regimen: "Cefepime or carbapenem",
            duration: "Per syndrome",
          },
        ],
      },
    ],
    scoringTools: [
      {
        name: "PEN-FAST — penicillin allergy risk stratification",
        purpose:
          "Identifies low-risk penicillin-allergy labels suitable for direct oral amoxicillin challenge without skin testing. About 9 in 10 'penicillin-allergic' patients tolerate beta-lactams.",
        points: [
          { factor: "Time since last reaction ≤ 5 years (F)", score: 1 },
          { factor: "Time since last reaction > 5 years (F)", score: 0 },
          { factor: "Anaphylaxis or angioedema (A) — IgE-mediated severe", score: 2 },
          { factor: "Severe cutaneous adverse reaction: SJS, TEN, DRESS, AGEP (S)", score: 2 },
          { factor: "Treatment required for reaction: epinephrine, ED visit, or admission (T)", score: 1 },
        ],
        interpretation: [
          {
            range: "0",
            meaning: "Very low risk (<1% probability of true allergy)",
            action: "Direct oral amoxicillin challenge (e.g., amoxicillin 250 mg, observed 1 h). Document and remove the allergy label. [VERIFY exact probability and challenge protocol]",
          },
          {
            range: "1–2",
            meaning: "Low-to-moderate risk (~5% probability)",
            action: "Supervised oral challenge or skin testing before beta-lactam use; do not delabel at bedside. [VERIFY cutoff]",
          },
          {
            range: "≥ 3 (or any 'A' or 'S' = 2)",
            meaning: "Higher risk; do not challenge without testing",
            action: "Refer to allergy/immunology for skin testing or supervised graded challenge. Not a bedside-delabeling candidate. [VERIFY]",
          },
        ],
        source:
          "Devchand M, et al. J Antimicrob Chemother 2019; Stone CA Jr, et al. JAMA 2020. [VERIFY exact citations, cutoffs, and challenge protocols]",
      },
    ],
    complications: [
      {
        name: "Clostridioides difficile infection",
        recognize:
          "Watery diarrhea (≥3/day) within weeks of antibiotic exposure, leukocytosis, abdominal pain, and (severe) ileus or AKI; check stool toxin or nucleic acid amplification.",
        manage:
          "Stop the inciting antibiotic if possible; fidaxomicin (preferred) or oral vancomycin by severity; bezlotoxumab adjunct for high recurrence risk. [VERIFY current 2021 IDSA/SHEA first-line]",
      },
      {
        name: "VRE colonization & bacteremia (collateral damage)",
        recognize:
          "Selected by prolonged vancomycin, piperacillin-tazobactam, cephalosporins, and long ICU stays; common in neutropenic and transplant patients.",
        manage:
          "Remove selective pressure; treat bacteremia with daptomycin (high dose) or linezolid per susceptibility; consult ID and review source.",
      },
      {
        name: "ESBL and carbapenem-resistant Enterobacterales (CRE)",
        recognize:
          "Recent healthcare exposure, prior broad-spectrum antibiotics, and indwelling devices; suspect in pyelonephritis/bacteremia from endemic regions.",
        manage:
          "ESBL bacteremia → carbapenem (per MERINO); CRE → novel beta-lactam/beta-lactamase inhibitor per 2024 IDSA AMR guidance [VERIFY]; consult ID.",
      },
      {
        name: "Cefepime neurotoxicity (encephalopathy)",
        recognize:
          "Confusion, myoclonus, non-convulsive seizures, or coma — especially with renal impairment and high cumulative dose.",
        manage:
          "Renal-dose adjust cefepime strictly; switch to another agent; monitor renal function daily; EEG if unexplained encephalopathy. [VERIFY incidence]",
      },
      {
        name: "Fluoroquinolone harm",
        recognize:
          "QT prolongation, tendinopathy/rupture (Achilles), dysglycemia, CNS effects (delirium, seizures), aortic dissection/aneurysm warning — risk highest in elderly and on steroids.",
        manage:
          "Stop and avoid in elderly when possible; reserve for clear indications where alternatives are inferior.",
      },
    ],
    prognosis: [
      { metric: "Antibiotic stewardship programs — reduction in inappropriate use", value: "~30% [VERIFY]" },
      { metric: "Stewardship impact on C. difficile rates", value: "~25–30% reduction in meta-analyses [VERIFY]" },
      { metric: "Penicillin allergy delabeling — impact on length of stay", value: "shorter LOS and less broad-spectrum use [VERIFY point estimate]" },
      { metric: "Vancomycin + piperacillin-tazobactam AKI vs either alone", value: "increased AKI; magnitude debated [VERIFY]" },
      { metric: "Cefepime neurotoxicity incidence in severe renal impairment", value: "up to 1 in 5 [VERIFY]" },
    ],
    specialPopulations: [
      {
        population: "Renal impairment",
        considerations:
          "Renal-dose-adjust renally-cleared agents (vancomycin, beta-lactams, aminoglycosides, levofloxacin, TMP-SMX, daptomycin, linezolid is NOT renally adjusted); use therapeutic drug monitoring where available; reassess daily as renal function changes.",
      },
      {
        population: "Hepatic impairment",
        considerations:
          "Caution with clindamycin, macrolides, metronidazole, tigecycline, and rifampin; dose-reduce or avoid; flucloxacillin/nafcillin hepatotoxicity risk.",
      },
      {
        population: "Obesity",
        considerations:
          "Use weight-based dosing for aminoglycosides (adjusted body weight), vancomycin (initial by total body weight, cap consideration), and daptomycin; beta-lactams have larger volume of distribution — consider higher/extended-infusion dosing for severe infection.",
      },
      {
        population: "Pregnancy and lactation",
        considerations:
          "Preferred: beta-lactams, nitrofurantoin (avoid at term), cephalosporins. Avoid: fluoroquinolones (cartilage), tetracyclines (teeth/bone), TMP-SMX (1st trimester folate, kernicterus near term), aminoglycosides (fetal ototoxicity), clarithromycin. Penicillin delabeling and challenge is safe and encouraged.",
      },
      {
        population: "Older adults",
        considerations:
          "Avoid fluoroquinolones when possible (delirium, dysglycemia, tendinopathy, aortic risk); dose-adjust aggressively for renal function; minimize anticholinergic and CNS-active drugs (urinary antiseptics); shortest effective duration.",
      },
      {
        population: "Neutropenic fever",
        considerations:
          "Prompt empiric anti-pseudomonal beta-lactam (cefepime, piperacillin-tazobactam, or meropenem) within 1 h; add MRSA coverage if line/cellulitis/pneumonia; narrow when cultures return; do not use prophylactic fluoroquinolone history as the sole empiric guide.",
      },
    ],
    prevention: [
      {
        modality: "De-escalation",
        target: "All empiric broad therapy",
        detail:
          "Reassess every antibiotic at 48–72 h once cultures return; stop redundant MRSA/anaerobic coverage; narrow to the most active single agent.",
      },
      {
        modality: "Shortest effective duration",
        target: "Common infections",
        detail:
          "Default to evidence-based short durations (e.g., 7 d gram-negative bacteremia; 5 d CAP; 5–6 d cellulitis) and document a stop date at order entry.",
      },
      {
        modality: "Penicillin allergy delabeling",
        target: "Patients with low-risk allergy labels",
        detail:
          "Use PEN-FAST; low-risk patients can be directly challenged and delabeled, restoring access to optimal beta-lactams.",
      },
      {
        modality: "Asymptomatic bacteriuria — do not treat",
        target: "Most patients with positive urine cultures",
        detail:
          "Do NOT treat except in pregnancy and before urologic procedures with mucosal bleeding; pyuria alone is not treatment indication. [VERIFY current IDSA ASB guidance]",
      },
      {
        modality: "C. difficile prevention",
        target: "All inpatients on antibiotics",
        detail:
          "Minimize duration and number of antibiotics; avoid unnecessary PPIs; prefer fidaxomicin for treatment; consider bezlotoxumab in high-recurrence-risk patients.",
      },
      {
        modality: "Surgical prophylaxis",
        target: "Perioperative patients",
        detail:
          "Single preoperative dose; stop within 24 h (48 h for cardiac); do not continue as 'coverage.' Avoid routine vancomycin unless MRSA risk.",
      },
      {
        modality: "Restricted-antibiotic preauthorization & audit-feedback",
        target: "Broad-spectrum and novel agents",
        detail:
          "Restrict daptomycin, linezolid, echinocandins, novel beta-lactamase inhibitors, and prolonged courses behind ID or stewardship review; combine preauthorization with post-prescription audit-feedback for maximal impact.",
      },
    ],
    whenToRefer: [
      "Staphylococcus aureus, Candida, or polymicrobial bacteremia — ID consultation improves outcomes.",
      "Endocarditis, CNS infection, prosthetic-device infection, or any endovascular infection.",
      "Multidrug-resistant organisms: ESBL, CRE, DTR Pseudomonas, Acinetobacter, Stenotrophomonas.",
      "Persistent fever or fever of unknown origin (>72 h without source).",
      "Restricted antimicrobials: daptomycin, linezolid, echinocandins, IV antifungals, ceftazidime-avibactam, ceftolozane-tazobactam, imipenem-relebactam, cefiderocol.",
      "OPAT candidates, prolonged IV courses (>7 d), or complex oral step-down planning.",
      "C. difficile that is severe, fulminant, or recurrent after first line.",
      "Opportunistic infections in immunocompromised hosts (HIV, transplant, chemo).",
      "Beta-lactam allergy in surgical prophylaxis or when optimal therapy requires a beta-lactam.",
    ],
    followUp: [
      "Day 0: Place empiric order with a planned stop date and de-escalation reminder.",
      "Day 3 (48–72 h): Structured antibiotic timeout — still needed? narrower? oral? shorter? Repeat cultures if persistent fever.",
      "Day 5–7: Assess clinical response; finalize organism, susceptibility, source, and target duration.",
      "Day 7+: Reassess ongoing need; convert to oral step-down when criteria met; arrange OPAT if needed.",
      "Discharge: Reconcile antibiotics (right drug, dose, duration); communicate stop date to outpatient team and pharmacy.",
      "Post-discharge: Confirm oral step-down is picked up; document final diagnosis, organism, and total duration for the record.",
    ],
    evidence: [
      {
        title: "Implementing an Antibiotic Stewardship Program (IDSA/SHEA)",
        source: "Barlam TF, et al. Clin Infect Dis. 2016;62(10):e51–e77",
        url: "https://academic.oup.com/cid/article/62/10/e51/2462896",
        kind: "guideline",
        focus: "The core guideline for building and running stewardship interventions.",
      },
      {
        title: "The New Antibiotic Mantra — “Shorter Is Better”",
        source: "Spellberg B. N Engl J Med",
        kind: "review",
        focus: "A persuasive overview of why shorter durations matter.",
      },
      {
        title: "Short versus long duration of therapy for uncomplicated gram-negative bacteremia (PITT)",
        source: "von Dach E, et al. JAMA Intern Med. 2023",
        kind: "trial",
        focus: "A key trial supporting 7-day courses for uncomplicated gram-negative bacteremia.",
      },
      {
        title: "A consensus guideline for therapeutic drug monitoring of vancomycin (AUC-based)",
        source: "Rybak MJ, et al. Am J Health-Syst Pharm. 2020",
        kind: "guideline",
        focus: "Establishes AUC-based vancomycin monitoring (target AUC 400–600).",
      },
      {
        title: "MERINO — Piperacillin-tazobactam vs ceftriaxone for ESBL E. coli / K. pneumoniae bacteremia",
        source: "Harris PNA, et al. JAMA. 2018;320(10):984–994",
        kind: "trial",
        focus: "Piperacillin-tazobactam was inferior to carbapenems for ESBL bloodstream infection — use a carbapenem. [VERIFY volume/pages]",
      },
      {
        title: "Seven versus 14 days of antibiotic therapy for uncomplicated gram-negative bacteremia (individual patient data meta-analysis)",
        source: "Yahav D, et al. JAMA. 2022;327(4):335–345 [VERIFY — 9 RCTs IPD meta]",
        kind: "trial",
        focus: "7 days non-inferior to 14 days for uncomplicated Enterobacterales bacteremia across multiple trials.",
      },
      {
        title: "Clinical Practice Guideline for Clostridioides difficile Infection (IDSA/SHEA)",
        source: "McDonald LC, et al. Clin Infect Dis. 2018 [updated 2021; fidaxomicin preferred] [VERIFY current version]",
        kind: "guideline",
        focus: "Fidaxomicin first-line for initial and recurrent CDI; oral vancomycin alternative; bezlotoxumab for recurrence risk.",
      },
      {
        title: "2024 IDSA Guidance on the Treatment of Antimicrobial-Resistant Gram-Negative Infections (AMR)",
        source: "Tamma PD, et al. Clin Infect Dis. 2024 [VERIFY]",
        kind: "guideline",
        focus: "Carbapenem-sparing and targeted therapy for ESBL, CRE, and DTR Pseudomonas — including novel beta-lactamase inhibitors.",
      },
      {
        title: "PEN-FAST — A tool for rapid risk stratification of penicillin allergy",
        source: "Devchand M, et al. J Antimicrob Chemother. 2019;74(2):437–442 [VERIFY exact volume/pages]",
        kind: "trial",
        focus: "Validated 4-item score to identify low-risk penicillin-allergy labels for direct oral challenge without skin testing.",
      },
      {
        title: "Risk stratification of penicillin allergy by clinical history (PEN-FAST review)",
        source: "Stone CA Jr, et al. JAMA. 2020 [VERIFY]",
        kind: "review",
        focus: "Reviews PEN-FAST application, cross-reactivity, and the safety of direct oral challenge in low-risk patients.",
      },
    ],
    pearls: [
      "Treat the patient, not the culture — asymptomatic bacteriuria and colonization are not infections.",
      "Stop double anaerobic and double MRSA coverage when cultures return.",
      "Vancomycin troughs are out; AUC-based monitoring (AUC₀₋₂₄ 400–600) is in — use Bayesian dosing when available.",
      "Fluoroquinolones carry QT, tendinopathy, dysglycemia, CNS, and aortic warnings — reserve for clear indications, and avoid in the elderly when possible.",
      "Daptomycin is inactivated by surfactant — never use it for pneumonia.",
      "Check a creatine kinase if daptomycin is prolonged (myopathy).",
      "Linezolid beyond two weeks → watch thrombocytopenia, neuropathy, and serotonin syndrome.",
      "Run an antibiotic timeout at 48–72 hours on every antibiotic you start — still needed? narrower? shorter? oral?",
      "~9 of 10 'penicillin-allergic' patients tolerate beta-lactams — delabel low-risk labels with PEN-FAST and an oral amoxicillin challenge.",
      "Fluoroquinolones, linezolid, metronidazole, TMP-SMX, and fluconazole are ~100% orally bioavailable — convert IV→PO early.",
      "ESBL E. coli bacteremia → carbapenem, not piperacillin-tazobactam (MERINO).",
      "Uncomplicated gram-negative bacteremia → 7 days is enough when the patient has responded (PITT, BACTEREMIA meta-analysis).",
      "Watch for cefepime neurotoxicity (encephalopathy, myoclonus) in renal impairment — renal-dose adjust and reconsider.",
      "Vancomycin + piperacillin-tazobactam is associated with more AKI than either alone — reconsider when both aren't essential.",
    ],
    syndromeTags: ["Antimicrobial Adverse Effects", "Drug Toxicity", "Stewardship"],
    conceptTags: [
      "Stewardship",
      "De-escalation",
      "Antibiotic timeout",
      "PK/PD",
      "Antibiogram",
      "Vancomycin AUC",
      "Penicillin allergy delabeling",
      "PEN-FAST",
      "Oral bioavailability",
      "IV-to-oral conversion",
      "Collateral damage",
      "Short-course therapy",
      "ESBL",
      "DTR Pseudomonas",
    ],
    tools: [
      { href: "/mechid", label: "MechID", why: "Mechanisms of action and resistance that drive empiric choices." },
      { href: "/tools/spectrum", label: "Spectrum", why: "The antibiogram of last resort — verify coverage before narrowing." },
      { href: "/tools/doseid", label: "DoseID", why: "Renal-adjusted dosing and beta-lactam optimization." },
    ],
    furtherReading: [
      {
        title: "Asymptomatic bacteriuria: what to do and what not to do",
        source: "Nicolle LE, et al. Clin Infect Dis. 2019 [VERIFY current version]",
        kind: "guideline",
        focus: "Definitive IDSA guidance — do not treat except in pregnancy and before urologic procedures.",
      },
      {
        title: "Therapeutic Drug Monitoring of Beta-Lactam Antibiotics",
        source: "Wong G, et al. Clin Microbiol Rev. [VERIFY]",
        kind: "review",
        focus: "Beta-lactam TDM and target attainment — the frontier of PK/PD optimization.",
      },
      {
        title: "Infectious Diseases Society of America Antimicrobial Resistant (AMR) Guidance",
        source: "IDSA AMR Guidance Center, 2024 [VERIFY]",
        kind: "guideline",
        focus: "Living guidance for resistant gram-negatives, gram-positives, and fungi.",
      },
    ],
  },
  {
    slug: "hiv",
    title: "HIV infection & opportunistic complications",
    category: "HIV & Sexually Transmitted Infections",
    summary:
      "HIV is now a chronic, manageable disease, and every Internal Medicine resident must know how to diagnose acute and chronic infection, start or confirm first-line antiretroviral therapy (ART), recognize the opportunistic infections that still present late, and counsel on U=U and PrEP. ART is recommended for everyone living with HIV regardless of CD4 count.",
    readMins: 22,
    difficulty: "core",
    lastReviewed: "2026-07-21",
    lastUpdated: "2026-07-21",
    atAGlance: [
      "ART is recommended for ALL patients with HIV, regardless of CD4 count — same day as diagnosis if possible (START, TEMPRANO).",
      "U=U: sustained viral suppression (<200 copies/mL) eliminates sexual transmission of HIV.",
      "Diagnose with a 4th-generation HIV Ag/Ab combo test; acute HIV mimics infectious mononucleosis and should be on every IM differential for fever + rash + adenopathy.",
      "First-line ART is an integrase strand transfer inhibitor (INSTI) plus two NRTIs — bictegravir or dolutegravir-based single-tablet regimens (e.g., Biktarvy, Triumeq, Dovato). [VERIFY current DHHS preferred regimens]",
      "CD4 < 200 cells/µL → start PCP prophylaxis (TMP-SMX); CD4 < 50 → consider MAC prophylaxis (azithromycin).",
      "Immune reconstitution inflammatory syndrome (IRIS) paradoxically worsens OIs after ART starts — recognize it, don't stop ART.",
      "Tenofovir-based PrEP (TDF/FTC or TAF/FTC) and long-acting cabotegravir prevent HIV in high-risk individuals.",
    ],
    objectives: [
      "Diagnose acute, recent, and chronic HIV using the appropriate test for the clinical scenario and window period.",
      "Initiate or confirm first-line ART and recognize the preferred INSTI-based regimens.",
      "Apply CD4-based thresholds to start and stop opportunistic infection prophylaxis.",
      "Recognize and manage the common opportunistic infections: PCP, cerebral toxoplasmosis, CMV, MAC, and cryptococcal meningitis.",
      "Identify and manage immune reconstitution inflammatory syndrome (IRIS).",
      "Counsel on U=U, PrEP, PEP, and prevention of vertical and sexual transmission.",
      "Recognize key ART toxicities and drug interactions relevant to Internal Medicine.",
    ],
    keyConcepts: [
      {
        heading: "Why HIV still belongs on every IM differential",
        prose:
          "Antiretroviral therapy transformed HIV from a near-uniformly fatal illness into a chronic, manageable condition with near-normal life expectancy when started early. Yet late presentations still occur — the patient with 'pneumonia' who has PCP, the young adult with a mono-like illness who has acute HIV seroconversion, or the inpatient with unexplained wasting and oral candidiasis. Early diagnosis and rapid ART initiation improve individual outcomes and prevent transmission. The clinician's job is to test, treat early, prevent OIs, and engage patients in lifelong care.",
        bullets: [
          "About 1 in 7 people with HIV in the United States are unaware of their status — routine opt-out screening is recommended for everyone aged 13–64 at least once. [VERIFY prevalence]",
          "Late presenters (CD4 < 200 at diagnosis) account for a substantial fraction of new diagnoses and drive most opportunistic complications.",
          "U=U — sustained viral load suppression prevents sexual transmission; this is a powerful counseling and adherence tool.",
        ],
        question: {
          pollId: "train-hiv-why-q1",
          prompt:
            "A 28-year-old presents with fever, sore throat, diffuse rash, and cervical adenopathy 2 weeks after a new sexual partner. Monospot is negative. What is the most important next diagnostic step?",
          options: [
            {
              id: "A",
              label: "Treat symptomatically and reassess in 2 weeks",
              feedback:
                "Missing the chance to diagnose acute HIV in the highly contagious seroconversion illness risks onward transmission and delays life-changing therapy.",
            },
            {
              id: "B",
              label: "HIV Ag/Ab combo test plus HIV RNA (viral load) if antibody is negative",
              correct: true,
              feedback:
                "Correct. Acute HIV is a mononucleosis-like illness with a negative or evolving antibody; a 4th-generation Ag/Ab test plus an HIV RNA when antibody is negative captures acute infection.",
            },
            {
              id: "C",
              label: "EBV and CMV serologies only",
              feedback:
                "EBV/CMV testing is reasonable, but missing acute HIV in this scenario would be a serious error — HIV testing must accompany, not follow, the mono workup.",
            },
            {
              id: "D",
              label: "Reassure that a negative monospot rules out HIV",
              feedback:
                "Heterophile antibody (monospot) has nothing to do with HIV; a negative monospot does not address the most important differential here.",
            },
          ],
        },
      },
      {
        heading: "Diagnosis: the 4th-generation test, acute HIV, and the window period",
        prose:
          "The laboratory 4th-generation HIV antigen/antibody combination test detects p24 antigen (appearing ~2 weeks after exposure) and HIV-1/2 antibodies (appearing ~3–8 weeks). It narrows the window period to about 2–6 weeks. Acute HIV — the syndrome of high-level viremia in the weeks after acquisition — is the period when antibody may still be negative but p24 antigen and HIV RNA are positive. When acute HIV is suspected and the Ag/Ab test is negative, send an HIV RNA (viral load), which will be very high (often >1 million copies/mL).",
        bullets: [
          "4th-generation Ag/Ab: preferred screening test; p24 Ag narrows the window to ~2–6 weeks.",
          "Acute HIV (seroconversion illness): fever, rash, pharyngitis, adenopathy, mucosal ulcers, arthralgia — mono-like; send HIV RNA if Ag/Ab is negative.",
          "Rapid point-of-care antibody tests have a longer window (~3–12 weeks); a negative rapid test does not exclude acute HIV.",
          "Confirm a reactive Ag/Ab with an HIV-1/HIV-2 differentiation immunoassay; acute infection may show a positive p24 with a partial antibody profile.",
        ],
        question: {
          pollId: "train-hiv-dx-q1",
          prompt:
            "A patient has a reactive 4th-generation HIV Ag/Ab screen. The HIV-1/HIV-2 differentiation assay is negative for antibody but p24 antigen is reactive. What does this indicate?",
          options: [
            {
              id: "A",
              label: "False positive — no further action",
              feedback:
                "A reactive p24 with negative antibody is most consistent with acute HIV infection, not a false positive — confirm with HIV RNA.",
            },
            {
              id: "B",
              label: "Acute HIV-1 infection — confirm with HIV RNA viral load",
              correct: true,
              feedback:
                "Correct. p24 Ag positivity before antibody appears defines acute infection; an HIV RNA (typically >1 million copies/mL) confirms and quantifies it.",
            },
            {
              id: "C",
              label: "HIV-2 infection",
              feedback:
                "HIV-2 is rare and would show on the differentiation assay; this pattern is acute HIV-1.",
            },
            {
              id: "D",
              label: "Advanced AIDS",
              feedback:
                "Advanced HIV has abundant antibody; the discordance here reflects acute (pre-antibody) infection, not late disease.",
            },
          ],
        },
      },
      {
        heading: "ART principles: START early, U=U, INSTI-first",
        prose:
          "The START trial established that immediate ART — regardless of CD4 count — reduces serious AIDS and non-AIDS events and mortality. Current guidelines recommend ART for everyone living with HIV on the day of diagnosis if the patient is ready. Sustained viral suppression to undetectable levels eliminates sexual transmission (HPTN 052; PARTNER/PARTNER2). First-line regimens are built around an integrase strand transfer inhibitor (INSTI) — bictegravir or dolutegravir — combined with two NRTIs, often as a single-tablet regimen.",
        bullets: [
          "START (NEJM 2015): immediate ART reduced serious AIDS/non-AIDS events vs deferred therapy at CD4 ≤ 350 — treat everyone, immediately.",
          "U=U (PARTNER, PARTNER2): zero linked sexual transmissions when viral load is suppressed (<200 copies/mL) — a core counseling message.",
          "INSTI + 2 NRTIs is first-line: bictegravir (Biktarvy = BIC/FTC/TAF), dolutegravir (Triumeq = DTG/ABC/3TC; Dovato = DTG/3TC in selected patients). [VERIFY current DHHS preferred list]",
          "HLA-B*5701 screening before abacavir (hypersensitivity); HBV co-infection mandates a tenofovir-containing regimen (don't use Dovato/Triumeq without HBV coverage).",
        ],
        question: {
          pollId: "train-hiv-art-q1",
          prompt:
            "A 35-year-old newly diagnosed with HIV (CD4 480, viral load 32,000) has no comorbidities, normal renal function, and is HBV-immune. Which is the most appropriate first-line regimen?",
          options: [
            {
              id: "A",
              label: "Efavirenz/tenofovir/emtricitabine (Atripla)",
              feedback:
                "Efavirenz-based therapy has neuropsychiatric adverse effects and is no longer preferred; avoid in women who might conceive (first-trimester teratogenicity).",
            },
            {
              id: "B",
              label: "Bictegravir/tenofovir alafenamide/emtricitabine (Biktarvy)",
              correct: true,
              feedback:
                "Correct. An INSTI (bictegravir) + 2 NRTIs is a DHHS-preferred first-line regimen — high barrier to resistance, well tolerated, single tablet.",
            },
            {
              id: "C",
              label: "Delay ART until CD4 drops below 350",
              feedback:
                "Deferring therapy is obsolete since START — start ART regardless of CD4 count.",
            },
            {
              id: "D",
              label: "Raltegravir + zidovudine + lamivudine",
              feedback:
                "Older agents with more toxicity and twice-daily dosing — not preferred when single-tablet INSTI regimens are available.",
            },
          ],
        },
      },
      {
        heading: "Opportunistic infections: the classic syndromes",
        prose:
          "OIs arise predominantly with CD4 < 200 cells/µL and remain the way many late presenters first come to medical attention. The pattern is recognizable: a dyspneic patient with a diffuse interstitial pneumonia and an elevated LDH has PCP until proven otherwise; a patient with headache, fever, and ring-enhancing brain lesions has cerebral toxoplasmosis; a patient with floaters and visual loss has CMV retinitis. Prophylaxis is effective and CD4-driven.",
        bullets: [
          "PCP (Pneumocystis jirovecii): subacute dyspnea, dry cough, fever, diffuse bilateral infiltrates, elevated LDH, often pneumothorax risk; treat with TMP-SMX, add steroids if severe (PaO₂ < 70 mmHg or A-a gradient ≥ 45).",
          "Cerebral toxoplasmosis: multiple ring-enhancing lesions, seizures, headache; Toxo IgG usually positive; treat with pyrimethamine + sulfadiazine + leucovorin.",
          "CMV retinitis: floaters, scotomata, visual loss; urgent ophthalmology; treat with valganciclovir or ganciclovir/foscarnet.",
          "Disseminated Mycobacterium avium complex (MAC): fever, weight loss, anemia, hepatosplenomegaly at CD4 < 50; treat with azithromycin + ethambutol (± rifabutin).",
          "Cryptococcal meningitis: subacute headache, fever, meningismus; serum/CSF cryptococcal antigen; treat with liposomal amphotericin + flucytosine induction, then fluconazole consolidation (AIIRS/ACTA). [VERIFY current induction regimen]",
        ],
        question: {
          pollId: "train-hiv-oi-q1",
          prompt:
            "A patient with untreated HIV (CD4 60) presents with 2 weeks of progressive dyspnea, dry cough, and fever; chest X-ray shows bilateral interstitial infiltrates and LDH is 1,200 U/L. Room-air PaO₂ is 64 mmHg. Best empiric therapy?",
          options: [
            {
              id: "A",
              label: "Ceftriaxone for community-acquired pneumonia",
              feedback:
                "Bacterial CAP is always possible, but this clinical syndrome with CD4 60 and elevated LDH is classic PCP — add PCP coverage, don't wait.",
            },
            {
              id: "B",
              label: "TMP-SMX and add corticosteroids for severe PCP",
              correct: true,
              feedback:
                "Correct. TMP-SMX is first-line for PCP; add corticosteroids (e.g., prednisone taper) when PaO₂ < 70 mmHg or A-a gradient ≥ 45 to reduce mortality.",
            },
            {
              id: "C",
              label: "Azithromycin for atypical pneumonia",
              feedback:
                "Azithromycin does not treat PCP; this presentation in a CD4-60 patient is PCP until proven otherwise.",
            },
            {
              id: "D",
              label: "Bronchoscopy before any treatment",
              feedback:
                "If the patient is hypoxemic, empiric TMP-SMX (and steroids) should begin immediately; bronchoscopy can confirm but should not delay therapy.",
            },
          ],
        },
      },
      {
        heading: "Immune reconstitution inflammatory syndrome (IRIS)",
        prose:
          "IRIS is a paradoxical worsening of a known or subclinical opportunistic infection within weeks of ART initiation, driven by the recovering immune system's exaggerated response to microbial antigens. It occurs most often in patients with very low baseline CD4 counts and presents as worsening fever, adenopathy, infiltrates, or inflammation around a known OI (TB, MAC, CMV retinitis, cryptococcal meningitis, herpes). ART is generally continued; treat the underlying OI and, in severe IRIS, use short-course corticosteroids or NSAIDs. Distinguish IRIS from ART toxicity, drug resistance, and a new OI.",
        bullets: [
          "Risk: low baseline CD4, high baseline viral load, rapid ART start with a subclinical OI, and specific pathogens (TB, MAC, Crypto, CMV).",
          "Onset: typically within the first 4–8 weeks of ART, occasionally later.",
          "Management: continue ART, treat the OI, and use corticosteroids for severe or organ-threatening IRIS (e.g., IRIS with respiratory failure or CNS inflammation).",
          "Do not routinely delay ART for OI treatment in most cases — early ART reduces mortality (exceptions: cryptococcal meningitis and TB meningitis, where a short delay may be considered). [VERIFY timing recommendations]",
        ],
      },
      {
        heading: "ART toxicities & drug interactions every IM resident should know",
        prose:
          "Modern ART is well tolerated, but specific toxicities and interactions remain important. Tenofovir disoproxil fumarate (TDF) can cause nephrotoxicity and bone loss; tenofovir alafenamide (TAF) reduces these but can cause weight gain and lipid changes. Abacavir requires HLA-B*5701 screening (hypersensitivity). Dolutegravir and other INSTIs can cause weight gain and, rarely, neuropsychiatric symptoms. Efavirenz causes vivid dreams, depression, and is teratogenic in the first trimester. Ritonavir/cobicistat boosting creates major cytochrome P450 interactions — review all co-prescribed medications.",
        bullets: [
          "Tenofovir (TDF): nephrotoxicity (Fanconi-like), bone demineralization — prefer TAF in kidney disease or osteoporosis.",
          "Abacavir: screen HLA-B*5701 — hypersensitivity (fever, rash, GI) can be fatal on rechallenge.",
          "INSTIs (BIC, DTG, RAL): generally well tolerated; weight gain and rare neuropsychiatric symptoms (insomnia, mood) reported.",
          "Efavirenz: CNS effects, depression, suicidality, teratogenicity — avoid in pregnancy planning.",
          "PIs (darunavir, atazanavir): hyperlipidemia, hyperglycemia, GI; atazanavir causes indirect hyperbilirubinemia.",
          "Pharmacokinetic boosters (ritonavir, cobicistat): potent CYP3A inhibition — check every new medication (statins, anticoagulants, steroids, PPIs).",
        ],
      },
      {
        heading: "Prevention: PrEP, PEP, U=U, and prevention of vertical transmission",
        prose:
          "HIV prevention is now as central as treatment. Pre-exposure prophylaxis (PrEP) with daily tenofovir-based therapy (TDF/FTC or TAF/FTC) is highly effective in high-risk individuals; long-acting injectable cabotegravir every 2 months is an alternative for those who prefer it. Post-exposure prophylaxis (PEP) is a 28-day regimen started within 72 hours of a high-risk exposure. Treatment as prevention (U=U) means that suppressed patients do not transmit HIV sexually. Perinatal transmission is preventable with maternal ART, planned delivery, and (when needed) neonatal prophylaxis.",
        bullets: [
          "PrEP: daily oral TDF/FTC (Truvada) or TAF/FTC (Descovy) in high-risk individuals; long-acting cabotegravir every 2 months is an alternative. [VERIFY current CDC PrEP guidance]",
          "Test creatinine, HBV, and HIV before starting PrEP; follow every 3 months with HIV test, STI screen, and adherence counseling.",
          "PEP: TDF/FTC + raltegravir or dolutegravir for 28 days, started within 72 hours of exposure (sooner is better).",
          "Perinatal transmission: maternal viral suppression throughout pregnancy and delivery reduces transmission to <1%; planned C-section if viral load >1,000 near delivery; neonatal prophylaxis tailored to risk.",
        ],
        question: {
          pollId: "train-hiv-prep-q1",
          prompt:
            "A 24-year-old MSM requests PrEP after a condom rupture with an HIV-positive partner on stable ART (viral load suppressed) last night. Best immediate management?",
          options: [
            {
              id: "A",
              label: "Start PrEP (daily TDF/FTC) and follow up in 3 months",
              feedback:
                "This is a single recent high-risk exposure within the last 72 hours — nPEP is more appropriate than PrEP for this acute exposure.",
            },
            {
              id: "B",
              label: "Reassure that U=U eliminates all risk — no medication needed",
              feedback:
                "U=U substantially reduces risk from the suppressed partner, but does not address other potential exposures and is not the standard for a defined acute exposure — discuss and offer nPEP.",
            },
            {
              id: "C",
              label: "Start nPEP (TDF/FTC + dolutegravir) for 28 days, baseline labs, and close follow-up",
              correct: true,
              feedback:
                "Correct. A high-risk exposure within 72 hours warrants nPEP with a 3-drug regimen, baseline HIV/HBV/HCV and renal testing, and follow-up at 2–4 weeks and 3 months.",
            },
            {
              id: "D",
              label: "HIV testing today and treat only if positive",
              feedback:
                "Waiting to diagnose misses the window for effective post-exposure prophylaxis; offer nPEP now.",
            },
          ],
        },
      },
    ],
    scoringTools: [
      {
        name: "CD4-based opportunistic infection prophylaxis (adults with HIV)",
        purpose:
          "Stratifies when to start and stop primary OI prophylaxis based on CD4 count. Prophylaxis can generally be discontinued once the CD4 exceeds the threshold on two consecutive measurements while on ART.",
        points: [
          { factor: "CD4 < 200 cells/µL", score: "start PCP prophylaxis" },
          { factor: "CD4 < 100 and Toxoplasma IgG positive", score: "add Toxo prophylaxis (TMP-SMX covers both)" },
          { factor: "CD4 < 50 cells/µL", score: "consider MAC prophylaxis (azithromycin weekly)" },
          { factor: "CD4 > 200 on ART (×2 measurements)", score: "discontinue PCP/Toxo prophylaxis" },
        ],
        interpretation: [
          {
            range: "≥ 200",
            meaning: "Low risk for most OIs",
            action: "No primary PCP/Toxo/MAC prophylaxis. Continue ART and routine monitoring.",
          },
          {
            range: "< 200",
            meaning: "PCP risk increased",
            action: "Start TMP-SMX DS daily (or DS 3×/week). Alternatives: dapsone, atovaquone, aerosolized pentamidine. [VERIFY dosing]",
          },
          {
            range: "< 100 (Toxo IgG+)",
            meaning: "Cerebral toxoplasmosis risk",
            action: "TMP-SMX DS daily covers both PCP and Toxo; if TMP-SMX not tolerated, dapsone + pyrimethamine + leucovorin.",
          },
          {
            range: "< 50",
            meaning: "Disseminated MAC risk",
            action: "Azithromycin 1,200 mg weekly (or clarithromycin). Confirm no active MAC with a blood culture first. [VERIFY regimen]",
          },
        ],
        source: "CDC/NIH/IDSA Guidelines for Prevention and Treatment of Opportunistic Infections in HIV-infected adults and adolescents. [VERIFY current version]",
      },
    ],
    differentials: [
      {
        diagnosis: "Infectious mononucleosis (EBV)",
        distinguishing:
          "Heterophile-positive, atypical lymphocytes, lacks the rash of acute HIV; send HIV RNA if monospot is negative or the syndrome is atypical.",
      },
      {
        diagnosis: "Cytomegalovirus (CMV) primary infection",
        distinguishing:
          "Similar mono-like illness; distinguish by CMV serology and HIV testing — CMV is a less common cause of acute mononucleosis than EBV.",
      },
      {
        diagnosis: "Secondary syphilis",
        distinguishing:
          "Diffuse rash including palms/soles, mucous membrane patches, alopecia; distinguish by RPR/TPPA and HIV co-testing (syphilis and HIV frequently co-transmitted).",
      },
      {
        diagnosis: "Streptococcal pharyngitis",
        distinguishing:
          "Exudative pharyngitis without rash or diarrhea; positive rapid strep. Acute HIV classically has rash and GI symptoms that GAS pharyngitis lacks.",
      },
      {
        diagnosis: "Acute hepatitis A, B, or C",
        distinguishing:
          "Elevated transaminases predominate; acute HIV can have transaminitis but typically features fever, rash, and adenopathy more prominently.",
      },
      {
        diagnosis: "Influenza or other viral respiratory illness",
        distinguishing:
          "Predominantly respiratory; lacks mucosal ulcers, rash, and persistent adenopathy of acute retroviral syndrome.",
      },
    ],
    regimenTables: [
      {
        title: "Preferred first-line ART regimens (illustrative — confirm with current DHHS guideline)",
        rows: [
          {
            scenario: "Treatment-naïve, no comorbidities",
            regimen: "Bictegravir/TAF/emtricitabine (Biktarvy) — single tablet, daily",
            duration: "Lifelong",
            note: "INSTI + 2 NRTIs; high barrier to resistance. [VERIFY current preferred list]",
          },
          {
            scenario: "Treatment-naïve, HLA-B*5701 negative",
            regimen: "Dolutegravir/abacavir/lamivudine (Triumeq)",
            duration: "Lifelong",
            note: "Screen HLA-B*5701 before abacavir (hypersensitivity).",
          },
          {
            scenario: "Treatment-naïve with HBV co-infection",
            hostFactors: "Active HBV",
            regimen: "Tenofovir (TDF or TAF) + emtricitabine or lamivudine + INSTI",
            duration: "Lifelong",
            note: "Tenofovir treats both HIV and HBV — do not use Dovato/Triumeq without HBV coverage.",
          },
          {
            scenario: "Simplified regimen (selected patients)",
            regimen: "Dolutegravir/lamivudine (Dovato)",
            duration: "Lifelong",
            note: "Only if HBV-negative, no resistance, viral load <500,000. [VERIFY eligibility]",
          },
        ],
      },
      {
        title: "Opportunistic infection therapy (illustrative — confirm with current guideline)",
        rows: [
          {
            scenario: "Pneumocystis pneumonia (PCP)",
            regimen: "TMP-SMX (15–20 mg/kg/day TMP in divided doses); corticosteroids if severe",
            duration: "21 days, then secondary prophylaxis until CD4 > 200",
            note: "Add prednisone taper if PaO₂ < 70 mmHg or A-a gradient ≥ 45.",
          },
          {
            scenario: "Cerebral toxoplasmosis",
            regimen: "Pyrimethamine + sulfadiazine + leucovorin",
            duration: "≥ 6 weeks, then chronic suppression until immune reconstitution",
          },
          {
            scenario: "Disseminated MAC",
            regimen: "Azithromycin + ethambutol (± rifabutin)",
            duration: "≥ 12 months and until immune reconstitution",
          },
          {
            scenario: "Cryptococcal meningitis",
            regimen: "Liposomal amphotericin B + flucytosine (induction) → fluconazole (consolidation/maintenance)",
            duration: "Induction 2 weeks, then consolidation/maintenance",
            note: "Consider a brief delay in ART after crypto diagnosis (IRIS risk). [VERIFY ART timing]",
          },
          {
            scenario: "CMV retinitis",
            regimen: "Valganciclovir (or ganciclovir/foscarnet for sight-threatening disease)",
            duration: "Until immune reconstitution; urgent ophthalmology",
          },
        ],
      },
      {
        title: "Pre-exposure (PrEP) and post-exposure prophylaxis (PEP)",
        rows: [
          {
            scenario: "PrEP — cisgender MSM, transgender women, others at risk",
            regimen: "TDF/FTC (Truvada) or TAF/FTC (Descovy) daily; or long-acting cabotegravir q8 weeks",
            duration: "Ongoing while risk persists",
            note: "Confirm HIV-negative, creatinine, HBV status before start; follow every 3 months. [VERIFY current CDC PrEP]",
          },
          {
            scenario: "nPEP after sexual or injection exposure",
            regimen: "TDF/FTC + raltegravir or dolutegravir",
            duration: "28 days, started within 72 h of exposure",
            note: "Baseline HIV/HBV/HCV + renal; follow-up testing at 2–4 weeks and 3 months.",
          },
        ],
      },
    ],
    complications: [
      {
        name: "Pneumocystis pneumonia (PCP)",
        recognize:
          "Subacute dyspnea, dry cough, fever, bilateral interstitial infiltrates (or normal X-ray early), elevated LDH, hypoxemia; pneumothorax in severe disease.",
        manage:
          "TMP-SMX (oral if mild, IV if severe); corticosteroids for PaO₂ < 70 mmHg or A-a gradient ≥ 45; start ART within 2 weeks of diagnosis (early ART reduces mortality).",
      },
      {
        name: "Cerebral toxoplasmosis",
        recognize:
          "Headache, focal deficits, seizures; multiple ring-enhancing lesions on MRI; Toxoplasma IgG usually positive.",
        manage:
          "Pyrimethamine + sulfadiazine + leucovorin; alternative clindamycin + pyrimethamine; consider lymphoma if IgG-negative or solitary lesion.",
      },
      {
        name: "Cryptococcal meningitis",
        recognize:
          "Subacute headache, fever, meningismus (may be subtle); serum/CSF cryptococcal antigen; elevated CSF opening pressure common.",
        manage:
          "Liposomal amphotericin B + flucytosine (induction) → fluconazole; manage raised intracranial pressure with therapeutic lumbar drains; delay ART ~2 weeks (IRIS risk).",
      },
      {
        name: "Immune reconstitution inflammatory syndrome (IRIS)",
        recognize:
          "Paradoxical worsening of an OI within 4–8 weeks of ART; fever, infiltrates, adenopathy, or new inflammation around a known pathogen (TB, MAC, Crypto, CMV).",
        manage:
          "Continue ART, treat the underlying OI, and use short-course corticosteroids for severe or organ-threatening IRIS; distinguish from ART failure and new OI.",
      },
      {
        name: "Disseminated Mycobacterium avium complex (MAC)",
        recognize:
          "Fever, night sweats, weight loss, anemia, hepatosplenomegaly, diarrhea at CD4 < 50; blood cultures positive.",
        manage:
          "Azithromycin + ethambutol (± rifabutin); start MAC therapy before ART, then start ART ~2 weeks later.",
      },
    ],
    prognosis: [
      { metric: "Life expectancy with early, effective ART", value: "Near-normal (approaching the general population) [VERIFY]" },
      { metric: "Untreated HIV — median survival from AIDS diagnosis", value: "~3 years [VERIFY]" },
      { metric: "Perinatal transmission risk with maternal viral suppression", value: "<1% [VERIFY]" },
      { metric: "PCP mortality in hospitalized patients", value: "~10–20% [VERIFY]" },
      { metric: "Cryptococcal meningitis mortality (with optimal therapy)", value: "~10–25% in 10 weeks [VERIFY]" },
      { metric: "CD4 recovery on ART", value: "Depends on nadir; often incomplete if started late [VERIFY]" },
    ],
    specialPopulations: [
      {
        population: "Pregnancy",
        considerations:
          "ART for everyone, ideally before conception; dolutegravir is acceptable throughout pregnancy; avoid efavirenz first trimester and cobicistat-boosted regimens in late pregnancy (low levels). Plan delivery mode by viral load (C-section if >1,000 near delivery); neonatal prophylaxis tailored to risk. [VERIFY current perinatal guideline]",
      },
      {
        population: "HBV co-infection",
        considerations:
          "Use a tenofovir (TDF or TAF) + emtricitabine or lamivudine regimen to treat both HIV and HBV; abrupt withdrawal risks HBV flare and hepatic decompensation.",
      },
      {
        population: "HCV co-infection",
        considerations:
          "Direct-acting antiviral cure of HCV is feasible and recommended; review drug interactions between ART and DAAs; manage in concert with ID/hepatology.",
      },
      {
        population: "Tuberculosis co-infection",
        considerations:
          "Start TB therapy first, then ART within 2 weeks for pulmonary TB with CD4 < 50 (and within 8 weeks otherwise); for TB meningitis, delay ART ~8 weeks. Beware rifampin interactions with PIs and INSTIs — use rifabutin or adjust ART.",
      },
      {
        population: "Adolescents and young adults",
        considerations:
          "Tailor adherence support and confidentiality; long-acting injectable cabotegravir + rilpivirine is an option for virologically suppressed patients who prefer not to take daily pills.",
      },
      {
        population: "People who inject drugs",
        considerations:
          "ART works and is recommended; treat opioid use disorder (buprenorphine, methadone); avoid efavirenz and abacavir if HLA-B*5701 unknown; address HCV co-infection.",
      },
    ],
    prevention: [
      {
        modality: "Antiretroviral therapy (treatment as prevention)",
        target: "All people with HIV",
        detail:
          "Sustained viral suppression (<200 copies/mL) prevents sexual transmission (U=U, HPTN 052, PARTNER).",
      },
      {
        modality: "Pre-exposure prophylaxis (PrEP)",
        target: "High-risk HIV-negative individuals",
        detail:
          "Daily TDF/FTC, TAF/FTC, or long-acting cabotegravir q8 weeks. Quarterly HIV/STI testing and adherence support. [VERIFY current CDC PrEP]",
      },
      {
        modality: "Post-exposure prophylaxis (nPEP / oPEP)",
        target: "Recent high-risk exposure (<72 h)",
        detail:
          "28-day 3-drug regimen (TDF/FTC + raltegravir or dolutegravir) with baseline labs and follow-up testing.",
      },
      {
        modality: "Perinatal prevention",
        target: "Pregnant patients with HIV",
        detail:
          "Maternal viral suppression throughout pregnancy and delivery reduces transmission to <1%; neonatal prophylaxis tailored to risk.",
      },
      {
        modality: "Vaccination",
        target: "All people with HIV",
        detail:
          "Pneumococcal (PCV20), influenza annually, COVID-19, Hepatitis A and B (with serology), HPV up to age 26 (45 if risk), zoster (Shingrix ≥50), and MMR if CD4 ≥ 200. [VERIFY schedule]",
      },
      {
        modality: "Condoms and harm reduction",
        target: "High-risk individuals",
        detail:
          "Condoms reduce sexual transmission; syringe services and opioid agonist therapy reduce injection-related transmission.",
      },
    ],
    whenToRefer: [
      "All newly diagnosed HIV to an HIV/ID specialist for ART initiation, resistance testing, and longitudinal care.",
      "Pregnant patients with HIV — co-manage with a perinatal HIV specialist.",
      "Suspected or confirmed opportunistic infection (PCP, cerebral toxoplasmosis, CMV retinitis, MAC, cryptococcal meningitis, disseminated TB).",
      "Virologic failure or resistance — regimen change should involve ID/HIV expertise.",
      "Significant ART–comedication interactions (transplant, chemotherapy, anticoagulants, anticonvulsants).",
      "Co-infection with TB, HBV (with cirrhosis), or HCV requiring DAA therapy.",
      "PrEP for complex patients (e.g., renal impairment, transgender care, cabotegravir).",
      "IRIS — particularly with respiratory or CNS involvement.",
    ],
    followUp: [
      "Baseline: CD4 count, HIV viral load, genotypic resistance, HBV/HCV serology, Toxoplasma IgG, G6PD, renal and hepatic panel, lipid panel, pregnancy test, Pap/anal cytology.",
      "At ART initiation: 2–4 weeks for toxicity and adherence; viral load at 4–8 weeks to confirm a ≥ 1 log drop.",
      "Every 3–6 months (first year): viral load, CD4, renal/hepatic panel, and adherence review.",
      "Once virologically suppressed: viral load every 6–12 months; CD4 annually if stable (> 300).",
      "Annual: STI screen (syphilis, gonorrhea, chlamydia), Pap/anal cytology, depression and substance use screening, vaccination review.",
      "Discontinue PCP/Toxo prophylaxis once CD4 > 200 on two measurements; discontinue MAC prophylaxis once CD4 > 50–100 sustained.",
    ],
    evidence: [
      {
        title: "START — Immediate versus deferred ART for HIV infection",
        source: "INSIGHT START Study Group. N Engl J Med. 2015;373:795–807 [VERIFY volume/pages]",
        kind: "trial",
        focus: "Immediate ART reduces serious AIDS and non-AIDS events regardless of baseline CD4 — treat everyone.",
      },
      {
        title: "HPTN 052 — ART for prevention of HIV transmission",
        source: "Cohen MS, et al. N Engl J Med. 2011;365:493–505 and 2016 [VERIFY]",
        kind: "trial",
        focus: "Early ART reduced HIV transmission by 96% in serodiscordant couples — treatment as prevention.",
      },
      {
        title: "PARTNER and PARTNER2 — Sexual transmission when viral load is suppressed",
        source: "Rodger AJ, et al. Lancet / JAMA. [VERIFY citations]",
        kind: "trial",
        focus: "Zero linked transmissions in serodiscordant couples when viral load was suppressed — U=U.",
      },
      {
        title: "DHHS Panel on Antiretroviral Guidelines for Adults and Adolescents",
        source: "Clinicalinfo.hiv.gov, current living guideline [VERIFY version]",
        kind: "guideline",
        focus: "The U.S. standard-of-care ART guideline — preferred regimens, monitoring, OIs, pregnancy.",
      },
      {
        title: "CDC/NIH/IDSA OI Prevention and Treatment Guidelines",
        source: "NIH Clinicalinfo, current living guideline [VERIFY version]",
        kind: "guideline",
        focus: "CD4-driven prophylaxis and treatment of opportunistic infections in adults and adolescents.",
      },
      {
        title: "iPrEx — Preexposure chemoprophylaxis for HIV in MSM",
        source: "Grant RM, et al. N Engl J Med. 2010;363:2587–2599 [VERIFY]",
        kind: "trial",
        focus: "Daily TDF/FTC reduced HIV acquisition by ~44% overall and ~92% among those with detectable drug levels.",
      },
      {
        title: "DISCOVER — TAF/FTC vs TDF/FTC for PrEP",
        source: "Mayer KH, et al. Lancet. 2020 [VERIFY]",
        kind: "trial",
        focus: "TAF/FTC non-inferior to TDF/FTC for PrEP with better bone and renal markers.",
      },
    ],
    pearls: [
      "START: treat everyone with HIV immediately, regardless of CD4 count.",
      "U=U: undetectable viral load (<200 copies/mL) eliminates sexual transmission — counsel and reinforce.",
      "First-line ART is an INSTI (bictegravir or dolutegravir) + 2 NRTIs.",
      "Acute HIV is a mononucleosis-like illness — send a 4th-generation Ag/Ab test and an HIV RNA if the antibody is negative.",
      "CD4 < 200 → PCP prophylaxis (TMP-SMX); CD4 < 100 with Toxo IgG+ → Toxo prophylaxis; CD4 < 50 → MAC prophylaxis.",
      "HLA-B*5701 before abacavir; tenofovir covers HBV; never stop ART in HBV co-infection without HBV coverage (hepatic flare).",
      "IRIS: paradoxical worsening after ART — continue ART, treat the OI, use steroids for severe cases.",
      "Add corticosteroids for severe PCP (PaO₂ < 70 mmHg or A-a gradient ≥ 45) — it reduces mortality.",
      "PrEP is highly effective; long-acting cabotegravir is a new option for those who prefer non-daily therapy.",
      "Review every co-prescribed medication with boosted PIs and INSTIs — CYP3A interactions are common and serious.",
    ],
    syndromeTags: ["HIV", "Opportunistic Infection", "Sexually Transmitted Infection"],
    conceptTags: [
      "HIV",
      "Antiretroviral therapy",
      "ART",
      "INSTI",
      "Opportunistic infection",
      "PCP",
      "Cerebral toxoplasmosis",
      "Cryptococcal meningitis",
      "MAC",
      "IRIS",
      "PrEP",
      "PEP",
      "U=U",
      "CD4",
    ],
    tools: [
      { href: "/mechid", label: "MechID", why: "Antiretroviral drug classes and resistance mechanisms." },
      { href: "/tools/spectrum", label: "Spectrum", why: "Coverage of antibiotics used for OIs and co-infections." },
      { href: "/tools/doseid", label: "DoseID", why: "Renal-adjusted dosing for TMP-SMX, tenofovir, ganciclovir, and more." },
    ],
    furtherReading: [
      {
        title: "Guidelines for the Use of Antiretroviral Agents in Adults and Adolescents with HIV",
        source: "DHHS Panel, clinicalinfo.hiv.gov [VERIFY current version]",
        kind: "guideline",
        focus: "The U.S. living guideline — preferred regimens, switching, OIs, pregnancy.",
      },
      {
        title: "US Public Health Service PrEP Clinical Practice Guideline",
        source: "CDC, current [VERIFY]",
        kind: "guideline",
        focus: "Daily oral and injectable PrEP — indications, monitoring, follow-up.",
      },
      {
        title: "Guidelines for Prevention and Treatment of Opportunistic Infections in HIV-Infected Adults and Adolescents",
        source: "CDC/NIH/IDSA, current [VERIFY]",
        kind: "guideline",
        focus: "CD4-driven prophylaxis and treatment of all major OIs.",
      },
    ],
  },
  {
    slug: "urinary-tract-infection",
    title: "Urinary tract infection",
    category: "Genitourinary Infections",
    summary:
      "Urinary tract infection is among the most common reasons IM residents prescribe antibiotics — and one of the most common places they are overprescribed. Mastering the distinctions between acute uncomplicated cystitis, pyelonephritis, complicated UTI, catheter-associated infection, and asymptomatic bacteriuria is essential to using antibiotics well and avoiding harm.",
    readMins: 18,
    difficulty: "core",
    lastReviewed: "2026-07-21",
    lastUpdated: "2026-07-21",
    atAGlance: [
      "Acute uncomplicated cystitis in women: nitrofurantoin × 5 d or TMP-SMX × 3 d (local E. coli susceptibility ≥ 80%) or single-dose fosfomycin — reserve fluoroquinolones for pyelonephritis and systemic illness.",
      "Uncomplicated pyelonephritis: oral fluoroquinolone or TMP-SMX for 5–7 d (FQ) or 7–14 d (TMP-SMX); ceftriaxone IV if unable to take PO or unstable.",
      "Do NOT treat asymptomatic bacteriuria — except pregnancy and before urologic procedures with mucosal bleeding (IDSA).",
      "CAUTI: treat only with new symptoms (fever, rigors, suprapubic pain); bacteriuria alone is not infection. Replace or remove the catheter before treating.",
      "Treat pregnancy cystitis and pyelonephritis aggressively — asymptomatic bacteriuria in pregnancy progresses to pyelonephritis in 20–30%.",
      "ESBL risk (recent antibiotics, recent healthcare exposure, prior ESBL): use a carbapenem for pyelonephritis or bacteremia (MERINO).",
      "Recurrent UTI in women (≥ 2 in 6 mo or ≥ 3 in 12 mo): non-antibiotic measures first (vaginal estrogen if postmenopausal); daily or post-coital prophylaxis for selected patients.",
    ],
    objectives: [
      "Distinguish acute uncomplicated cystitis, pyelonephritis, complicated UTI, catheter-associated UTI, and asymptomatic bacteriuria.",
      "Choose empiric therapy based on syndrome, local resistance patterns, and patient risk factors (pregnancy, ESBL, allergy).",
      "Recognize when imaging, blood cultures, and urology or IR referral are needed.",
      "Avoid treating asymptomatic bacteriuria and catheter-associated bacteriuria outside the defined exceptions.",
      "Manage recurrent UTI with non-antibiotic measures and, when indicated, prophylactic antibiotics.",
      "Identify complications of pyelonephritis (abscess, emphysematous pyelonephritis, sepsis) and know when to escalate.",
    ],
    keyConcepts: [
      {
        heading: "Why definitions matter: cystitis, pyelonephritis, complicated UTI, CAUTI, and asymptomatic bacteriuria",
        prose:
          "The single most important step in UTI management is naming what you are treating. Cystitis is lower-tract dysuria, frequency, urgency, and suprapubic pain without fever or systemic signs. Pyelonephritis adds fever, flank pain, nausea, or vomiting. A 'complicated UTI' is any UTI in a man, a pregnant patient, or a patient with structural/functional abnormality (obstruction, stones, catheter, immunocompromise, recent instrumentation). Catheter-associated UTI requires new symptoms attributable to the urinary tract plus bacteriuria. Asymptomatic bacteriuria is a positive urine culture without urinary or systemic symptoms — and is not an infection in almost all circumstances. Mislabeling drives unnecessary antibiotics, resistance, and C. difficile.",
        bullets: [
          "Acute uncomplicated cystitis = dysuria/frequency/urgency in a non-pregnant premenopausal woman.",
          "Pyelonephritis = fever, flank pain, nausea/vomiting, or costovertebral angle tenderness.",
          "Complicated UTI = male, pregnant, obstruction, stones, catheter, immunocompromise, recent instrumentation, or treatment failure.",
          "Asymptomatic bacteriuria = positive culture without urinary/systemic symptoms; do NOT treat except pregnancy and pre-urologic procedures.",
          "CAUTI = new symptoms (fever, rigors, suprapubic pain, new delirium in the absence of another source) PLUS bacteriuria.",
        ],
        question: {
          pollId: "train-uti-def-q1",
          prompt:
            "A 68-year-old nursing home resident with a chronic Foley catheter has cloudy urine and a positive culture (E. coli >10⁵ CFU/mL) but is afebrile, comfortable, and has no new confusion or systemic symptoms. Best management?",
          options: [
            {
              id: "A",
              label: "Treat with a 7-day course of ciprofloxacin based on culture",
              feedback:
                "This is catheter-associated asymptomatic bacteriuria — treatment does not prevent symptomatic infection and increases resistance and C. difficile. Do not treat.",
            },
            {
              id: "B",
              label: "Do not treat; observe and evaluate for other sources if symptoms develop",
              correct: true,
              feedback:
                "Correct. Catheter-associated asymptomatic bacteriuria should not be treated; re-evaluate only if new systemic or localizing symptoms develop.",
            },
            {
              id: "C",
              label: "Replace the catheter and start antibiotics",
              feedback:
                "Catheter replacement is reasonable for symptom relief or malfunction, but adding antibiotics for bacteriuria is unnecessary and harmful.",
            },
            {
              id: "D",
              label: "Daily suppressive antibiotics to prevent future infection",
              feedback:
                "Suppressive antibiotics for catheter bacteriuria are not recommended — they drive resistance without preventing symptomatic infection.",
            },
          ],
        },
      },
      {
        heading: "Acute uncomplicated cystitis in women",
        prose:
          "In a premenopausal, non-pregnant woman with classic dysuria, frequency, and urgency, the diagnosis can be made clinically without a urine culture. First-line therapy is nitrofurantoin for 5 days, TMP-SMX for 3 days (if local E. coli susceptibility is ≥ 80%), or single-dose fosfomycin. Beta-lactams (amoxicillin-clavulanate, cephalexin) are alternatives but less effective. Fluoroquinolones should be reserved for pyelonephritis or systemic illness given their toxicity profile. Pip-tazo and other broad agents have no role in uncomplicated cystitis.",
        bullets: [
          "Diagnose clinically when symptoms are classic; a urine culture is not required unless symptoms are atypical, recurrent, or treatment fails.",
          "Nitrofurantoin 100 mg PO BID × 5 d — first-line; avoids much collateral resistance.",
          "TMP-SMX DS BID × 3 d — first-line ONLY if local E. coli susceptibility ≥ 80%.",
          "Fosfomycin 3 g × 1 — single-dose alternative; less effective in some trials but excellent adherence.",
          "Avoid fluoroquinolones, and reserve broad agents (pip-tazo, cefepime, carbapenems) for complicated/systemic infection.",
          "Pyuria is expected but does not require treatment in asymptomatic patients.",
        ],
        question: {
          pollId: "train-uti-cystitis-q1",
          prompt:
            "A 26-year-old woman has 2 days of dysuria, frequency, and suprapubic pain; no vaginal discharge, fever, or flank pain. Local E. coli susceptibility to TMP-SMX is 78%. Best first-line therapy?",
          options: [
            {
              id: "A",
              label: "TMP-SMX DS BID × 3 days",
              feedback:
                "TMP-SMX is not first-line when local E. coli resistance exceeds 20% — empiric failure is too likely.",
            },
            {
              id: "B",
              label: "Nitrofurantoin 100 mg PO BID × 5 days",
              correct: true,
              feedback:
                "Correct. Nitrofurantoin is first-line regardless of local TMP-SMX resistance; it preserves gut flora and avoids fluoroquinolones.",
            },
            {
              id: "C",
              label: "Ciprofloxacin 500 mg BID × 3 days",
              feedback:
                "Fluoroquinolones are reserved for pyelonephritis and systemic infection given QT, tendon, and CNS toxicities — overkill for uncomplicated cystitis.",
            },
            {
              id: "D",
              label: "Single-dose fosfomycin",
              feedback:
                "Fosfomycin is acceptable but slightly less effective than nitrofurantoin in some trials; with local TMP-SMX resistance above 20%, nitrofurantoin is the stronger first choice.",
            },
          ],
        },
      },
      {
        heading: "Acute pyelonephritis: when to admit, what to give",
        prose:
          "Pyelonephritis is an upper-tract infection with systemic signs (fever, flank pain, nausea/vomiting). Most young, otherwise healthy patients can be managed as outpatients with an oral fluoroquinolone or TMP-SMX (if susceptible) once cultures are drawn. Admit patients with severe sepsis, intractable vomiting, pregnancy, immunocompromise, suspected obstruction, failed outpatient therapy, or social barriers. Imaging is indicated for treatment failure, suspected obstruction or stones, diabetes (emphysematous pyelonephritis), and complicated UTI.",
        bullets: [
          "Outpatient oral: ciprofloxacin or levofloxacin × 5–7 d; TMP-SMX × 14 d if organism susceptible; always culture first.",
          "Inpatient IV: ceftriaxone 1–2 g daily is a reasonable empiric choice; add ESBL coverage (ertapenem, meropenem) for known ESBL or severe risk.",
          "Discharge on oral step-down once afebrile, improving, and tolerating PO; transition based on susceptibilities.",
          "Blood cultures are reasonable for pyelonephritis (especially inpatient) but not required for every mild outpatient case.",
          "Imaging (CT abdomen/pelvis without contrast preferred) for treatment failure at 48–72 h, suspected obstruction, diabetes, immunocompromise, recurrent disease, and severe sepsis.",
        ],
        question: {
          pollId: "train-uti-pyelo-q1",
          prompt:
            "A 30-year-old non-pregnant woman has fever (39 °C), right flank pain, nausea, and vomiting. Vitals: HR 110, BP 96/60, normal mental status. She can tolerate small amounts of fluid by mouth. Local E. coli TMP-SMX susceptibility is 85%. Best initial management?",
          options: [
            {
              id: "A",
              label: "Outpatient TMP-SMX DS BID × 14 days, with return precautions",
              feedback:
                "Her hypotension and tachycardia suggest early sepsis — outpatient therapy is unsafe. She needs IV therapy, fluids, and observation.",
            },
            {
              id: "B",
              label: "Admit for IV ceftriaxone, IV fluids, blood and urine cultures, and reassessment",
              correct: true,
              feedback:
                "Correct. Fever, vomiting, hypotension, and tachycardia warrant admission, IV antibiotics, fluids, and close monitoring; de-escalate once susceptibilities return.",
            },
            {
              id: "C",
              label: "Oral levofloxacin 750 mg daily × 5 days as outpatient",
              feedback:
                "Fluoroquinolone would be reasonable if she were stable and tolerating PO, but her vital signs argue for admission and IV therapy.",
            },
            {
              id: "D",
              label: "Admit for IV piperacillin-tazobactam plus vancomycin empirically",
              feedback:
                "Over-broad empiric coverage adds harm; ceftriaxone is appropriate first-line for uncomplicated pyelonephritis without MRSA or ESBL risk.",
            },
          ],
        },
      },
      {
        heading: "Asymptomatic bacteriuria & catheter-associated bacteriuria: the over-treatment problem",
        prose:
          "Asymptomatic bacteriuria is extraordinarily common — especially in elderly, catheterized, and diabetic patients — yet treatment provides no benefit and real harm (antibiotic toxicity, resistance selection, C. difficile, and cost). The IDSA guidance is explicit: do not screen or treat asymptomatic bacteriuria except in pregnancy and before urologic procedures involving mucosal bleeding. Pyuria does not change the decision. Treating catheter-associated bacteriuria is similarly ineffective; replace or remove the catheter and look for other causes if the patient is unwell.",
        bullets: [
          "Do NOT treat asymptomatic bacteriuria — except pregnancy and before urologic procedures with mucosal bleeding (e.g., TURP).",
          "Pyuria accompanying asymptomatic bacteriuria does not require treatment.",
          "Older adults with delirium but no fever or localizing signs usually have another source — do not assume UTI from a positive culture alone.",
          "Catheter-associated bacteriuria: replace or remove the catheter; treat only with new symptoms (fever, rigors, suprapubic pain).",
          "Avoid routine 'urine screening' before orthopedic or non-urologic procedures.",
        ],
        question: {
          pollId: "train-uti-asb-q2",
          prompt:
            "An 82-year-old woman in a nursing facility has a positive urine culture found during evaluation for poor appetite. She has no fever, dysuria, flank pain, suprapubic pain, or hemodynamic instability. Best management?",
          options: [
            { id: "A", label: "Do not treat bacteriuria; evaluate other causes", correct: true, feedback: "Correct. Asymptomatic bacteriuria in older adults should not be treated without localizing or systemic signs of infection." },
            { id: "B", label: "Treat with ciprofloxacin for 7 days", feedback: "Incorrect. Treating asymptomatic bacteriuria causes harm without benefit." },
            { id: "C", label: "Treat because pyuria is present", feedback: "Incorrect. Pyuria does not distinguish ASB from UTI in this population." },
            { id: "D", label: "Start chronic suppressive antibiotics", feedback: "Incorrect. Suppression promotes resistance and adverse events." },
          ],
        },
      },
      {
        heading: "Pregnancy: treat the bacteriuria, choose the drug carefully",
        prose:
          "Pregnancy changes the rules. Asymptomatic bacteriuria in pregnancy progresses to pyelonephritis in 20–30% of untreated women and is associated with preterm birth and low birth weight — screen at the first prenatal visit and treat. Cystitis and pyelonephritis in pregnancy require prompt, appropriate therapy. Drug selection is constrained: fluoroquinolones and tetracyclines are avoided; TMP-SMX is avoided in the first trimester (folate antagonist) and near term (kernicterus); nitrofurantoin is generally safe except near term (theoretical hemolysis in G6PD deficiency).",
        bullets: [
          "Screening: urine culture at first prenatal visit; treat asymptomatic bacteriuria.",
          "Preferred cystitis agents: amoxicillin-clavulanate, cephalexin, fosfomycin; nitrofurantoin is acceptable except near term.",
          "Pyelonephritis in pregnancy: admit and treat with IV ceftriaxone; avoid fluoroquinolones, TMP-SMX (1st trimester/near term), and tetracyclines.",
          "Repeat urine cultures after therapy (test of cure) and consider monthly screening for the remainder of pregnancy.",
        ],
        question: {
          pollId: "train-uti-pregnancy-q1",
          prompt:
            "A pregnant patient at 12 weeks has asymptomatic bacteriuria with E. coli on screening culture. What is the best management principle?",
          options: [
            { id: "A", label: "Treat because asymptomatic bacteriuria in pregnancy increases pyelonephritis risk", correct: true, feedback: "Correct. Pregnancy is one of the key exceptions where ASB should be screened for and treated." },
            { id: "B", label: "Do not treat any asymptomatic bacteriuria", feedback: "Incorrect. Pregnancy is an exception." },
            { id: "C", label: "Use doxycycline as first-line therapy", feedback: "Incorrect. Tetracyclines are generally avoided in pregnancy." },
            { id: "D", label: "Use fluoroquinolone prophylaxis until delivery", feedback: "Incorrect. Fluoroquinolones are generally avoided in pregnancy and chronic prophylaxis is not the default." },
          ],
        },
      },
      {
        heading: "Recurrent UTI in women: a stewardship problem",
        prose:
          "Recurrent UTI (≥ 2 in 6 months or ≥ 3 in 12 months) is common and often over-treated with repeated courses of antibiotics. The first-line interventions are non-antibiotic: behavioral counseling, post-coital voiding, vaginal estrogen in postmenopausal women (highly effective), and cranberry products or D-mannose (modest, inconsistent evidence). When antibiotics are needed, daily or post-coital prophylaxis (nitrofurantoin, TMP-SMX, cephalexin) for 3–6 months reduces recurrence. Always rule out structural causes (stones, reflux) with imaging and urology referral when indicated.",
        bullets: [
          "Confirm recurrent UTI with cultures — not every dysuria episode is bacterial UTI (consider STIs, vaginitis, interstitial cystitis).",
          "Postmenopausal women: topical vaginal estrogen is one of the most effective non-antibiotic interventions.",
          "Behavioral: hydration, post-coital voiding, avoid spermicides.",
          "Cranberry (products, juice) and D-mannose have modest evidence; offer as adjuncts, not substitutes.",
          "When antibiotics needed: daily or post-coital prophylaxis × 3–6 months (e.g., nitrofurantoin 50–100 mg, TMP-SMX, cephalexin).",
          "Self-start therapy with a standby prescription is an option for reliable patients.",
        ],
        question: {
          pollId: "train-uti-recurrent-q1",
          prompt:
            "A 58-year-old postmenopausal woman has had four culture-confirmed E. coli cystitis episodes in the past year. She uses no vaginal estrogen. Best first step?",
          options: [
            {
              id: "A",
              label: "Start daily nitrofurantoin prophylaxis indefinitely",
              feedback:
                "Prophylaxis is reasonable for recurrent UTI but should be time-limited and combined with non-antibiotic measures; vaginal estrogen should be tried first in postmenopausal women.",
            },
            {
              id: "B",
              label: "Topical vaginal estrogen and behavioral counseling, with a structured follow-up plan",
              correct: true,
              feedback:
                "Correct. Topical vaginal estrogen is among the most effective interventions for postmenopausal recurrent UTI and should precede or accompany antibiotic prophylaxis.",
            },
            {
              id: "C",
              label: "Daily cranberry tablets and reassurance",
              feedback:
                "Cranberry has modest, inconsistent evidence; it is an adjunct, not first-line therapy for documented recurrent UTI in a postmenopausal woman.",
            },
            {
              id: "D",
              label: "Lifetime fluoroquinolone prophylaxis",
              feedback:
                "Fluoroquinolone prophylaxis is not recommended — toxicity, resistance, and the availability of safer options make this inappropriate.",
            },
          ],
        },
      },
      {
        heading: "Resistant organisms & ESBL: when to reach for a carbapenem",
        prose:
          "Extended-spectrum beta-lactamase (ESBL)-producing E. coli and Klebsiella are increasingly common, particularly in patients with recent healthcare exposure, prior antibiotics, or indwelling devices. For cystitis, nitrofurantoin and fosfomycin remain active against many ESBL organisms. For pyelonephritis or bacteremia caused by ESBL Enterobacterales, piperacillin-tazobactam is inferior to a carbapenem (MERINO) — use ertapenem or meropenem. Enterococcus (treat with ampicillin or nitrofurantoin for cystitis) and Pseudomonas (need an antipseudomonal agent) require distinct empiric strategies. Always de-escalate once susceptibilities return.",
        bullets: [
          "ESBL cystitis: nitrofurantoin or fosfomycin often still work; TMP-SMX may be active if susceptible.",
          "ESBL pyelonephritis or bacteremia: carbapenem (ertapenem or meropenem) per MERINO — NOT pip-tazo.",
          "Enterococcus: ampicillin (IV) for systemic infection; nitrofurantoin or amoxicillin for cystitis; do NOT use cephalosporins.",
          "Pseudomonas: piperacillin-tazobactam, cefepime, ceftazidime, or a carbapenem — extended infusion in severe infection.",
          "AmpC-inducible organisms (Enterobacter, Citrobacter, Serratia): avoid third-generation cephalosporins for serious infection — use cefepime or a carbapenem.",
        ],
        question: {
          pollId: "train-uti-esbl-q1",
          prompt:
            "A patient has pyelonephritis with bacteremia due to ESBL-producing E. coli. Susceptibilities show piperacillin-tazobactam susceptible. Which definitive IV therapy is preferred?",
          options: [
            { id: "A", label: "Ertapenem or meropenem", correct: true, feedback: "Correct. For ESBL pyelonephritis with bacteremia, a carbapenem is preferred; MERINO raised concern for piperacillin-tazobactam in ESBL bacteremia." },
            { id: "B", label: "Piperacillin-tazobactam because any susceptible result is enough", feedback: "Incorrect. ESBL bacteremia is a key scenario where piperacillin-tazobactam may be inferior despite reported susceptibility." },
            { id: "C", label: "Nitrofurantoin", feedback: "Incorrect. Nitrofurantoin is for lower-tract cystitis, not bacteremic pyelonephritis." },
            { id: "D", label: "Vancomycin", feedback: "Incorrect. Vancomycin does not treat E. coli." },
          ],
        },
      },
      {
        heading: "Complicated UTI requires anatomy and source control thinking",
        prose:
          "Complicated UTI includes infection with structural or functional urinary tract abnormality, obstruction, stones, catheters, renal transplant, immunocompromise, male sex in many frameworks, or systemic illness. Antibiotics alone may fail when obstruction, infected stone, abscess, or catheter biofilm persists. Ask whether something needs to be drained, removed, exchanged, or imaged.",
        question: {
          pollId: "train-uti-complicated-q1",
          prompt:
            "A patient with pyelonephritis remains febrile 72 hours after active antibiotics and has severe flank pain. What is the best next diagnostic step?",
          options: [
            { id: "A", label: "Image for obstruction, abscess, or stone", correct: true, feedback: "Correct. Persistent fever despite active therapy should prompt imaging for a complication needing source control." },
            { id: "B", label: "Continue the same plan for 2 more weeks without reassessment", feedback: "Incorrect. Lack of response requires reassessment for obstruction or abscess." },
            { id: "C", label: "Stop antibiotics because fever proves viral illness", feedback: "Incorrect. Persistent fever does not exclude bacterial pyelonephritis; look for complications." },
            { id: "D", label: "Treat Candida from oral thrush as the urinary pathogen", feedback: "Incorrect. This distracts from the need to image a nonresponding urinary infection." },
          ],
        },
      },
      {
        heading: "Catheter-associated UTI starts with the catheter",
        prose:
          "Long-term urinary catheters become colonized. When symptomatic CAUTI is suspected, replace or remove the catheter if feasible and obtain urine culture from the newly placed catheter before antibiotics. Do not culture from the drainage bag, and do not treat bacteriuria in an asymptomatic catheterized patient.",
        question: {
          pollId: "train-uti-cauti-q1",
          prompt:
            "A patient with a Foley catheter develops fever and suprapubic pain. The catheter has been in place for 3 weeks. Best culture approach?",
          options: [
            { id: "A", label: "Replace the catheter and culture urine from the new catheter", correct: true, feedback: "Correct. For suspected CAUTI with an old catheter, exchange/removal improves culture accuracy and source control." },
            { id: "B", label: "Culture urine from the drainage bag", feedback: "Incorrect. Drainage bag cultures are contaminated and misleading." },
            { id: "C", label: "Do not culture symptomatic catheterized patients", feedback: "Incorrect. Symptomatic CAUTI should be cultured to guide therapy." },
            { id: "D", label: "Treat without ever addressing the catheter", feedback: "Incorrect. Catheter exchange/removal is a key management step when feasible." },
          ],
        },
      },
      {
        heading: "Oral step-down is reasonable when the syndrome allows it",
        prose:
          "For clinically improving UTI or bacteremic UTI with source control and susceptible isolates, oral step-down can be appropriate using agents with adequate bioavailability and urinary/systemic exposure. Nitrofurantoin and fosfomycin are useful for bladder-only infection but are not appropriate for pyelonephritis or bacteremia.",
        question: {
          pollId: "train-uti-stepdown-q1",
          prompt:
            "A patient with E. coli bacteremic pyelonephritis improves after IV ceftriaxone. The isolate is susceptible to TMP-SMX and ciprofloxacin. Which statement is most accurate?",
          options: [
            { id: "A", label: "Oral step-down can be considered with an active high-bioavailability agent", correct: true, feedback: "Correct. With clinical improvement and susceptible isolate, oral step-down with TMP-SMX or a fluoroquinolone can be appropriate." },
            { id: "B", label: "Nitrofurantoin is ideal for bacteremia", feedback: "Incorrect. Nitrofurantoin is bladder-limited and not used for pyelonephritis or bacteremia." },
            { id: "C", label: "All bacteremic UTIs require 6 weeks of IV therapy", feedback: "Incorrect. Many uncomplicated bacteremic UTIs can be treated with shorter courses and oral step-down when criteria are met." },
            { id: "D", label: "Vancomycin should be added for all bacteremias", feedback: "Incorrect. Vancomycin does not treat E. coli." },
          ],
        },
      },
      {
        heading: "Difficult-to-treat resistance requires mechanism-aware therapy",
        prose:
          "CRE and difficult-to-treat Pseudomonas should prompt review of the resistance mechanism, prior cultures, infection site, source control, renal dosing, and current IDSA AMR guidance. Newer beta-lactam/beta-lactamase inhibitor agents are not interchangeable; activity depends on the organism and enzyme, such as KPC versus metallo-beta-lactamase.",
        question: {
          pollId: "train-uti-cre-dtr-q1",
          prompt:
            "A urine and blood culture grows carbapenem-resistant Klebsiella pneumoniae. Why is identifying the carbapenemase mechanism clinically useful?",
          options: [
            { id: "A", label: "It helps select among newer agents because KPC, OXA, and metallo-beta-lactamases differ", correct: true, feedback: "Correct. Mechanism guides therapy; newer agents have different activity by carbapenemase type." },
            { id: "B", label: "It proves antibiotics are never needed", feedback: "Incorrect. Invasive CRE infection requires active therapy and source control." },
            { id: "C", label: "It replaces susceptibility testing entirely", feedback: "Incorrect. Mechanism and susceptibility data are complementary." },
            { id: "D", label: "It only matters for gram-positive organisms", feedback: "Incorrect. Carbapenemases are central to resistant gram-negative management." },
          ],
        },
      },
    ],
    scoringTools: [
      {
        name: "When to treat asymptomatic bacteriuria",
        purpose:
          "Asymptomatic bacteriuria should NOT be treated except in two clearly defined situations. Pyuria accompanying asymptomatic bacteriuria does not change the decision.",
        points: [
          { factor: "Pregnancy (any trimester)", score: "treat" },
          { factor: "Before urologic procedure with mucosal bleeding (e.g., TURP)", score: "treat" },
          { factor: "Elderly / nursing home / diabetic / catheterized, no symptoms", score: "do not treat" },
          { factor: "Pyuria without urinary symptoms", score: "do not treat" },
          { factor: "Before joint replacement, cardiac or non-urologic surgery", score: "do not treat" },
        ],
        interpretation: [
          {
            range: "Pregnancy",
            meaning: "Progression to pyelonephritis in 20–30% if untreated",
            action: "Screen at first prenatal visit and treat; re-culture after therapy.",
          },
          {
            range: "Pre-urologic procedure",
            meaning: "Risk of procedure-related bacteremia",
            action: "Treat shortly before the procedure per IDSA guidance. [VERIFY timing]",
          },
          {
            range: "All others",
            meaning: "No benefit, real harm (resistance, C. difficile, cost)",
            action: "Do not screen or treat; look for other sources of symptoms.",
          },
        ],
        source: "Nicolle LE, et al. IDSA Asymptomatic Bacteriuria Guideline. Clin Infect Dis. 2019 [VERIFY current version]",
      },
    ],
    differentials: [
      {
        diagnosis: "Urethritis (STI: chlamydia, gonorrhea, trichomonas, mycoplasma)",
        distinguishing:
          "Sexually active patient with dysuria and discharge; send NAAT for chlamydia/gonorrhea/trichomonas; consider in young, sexually active patients and treat empirically if risk.",
      },
      {
        diagnosis: "Vaginitis (candida, bacterial vaginosis, trichomonas)",
        distinguishing:
          "Vaginal discharge and irritation predominate; perform pelvic exam with KOH and saline wet mount.",
      },
      {
        diagnosis: "Acute prostatitis",
        distinguishing:
          "Perineal/suprapubic pain, fever, tender prostate; consider in men; treat for 10–14 days (longer for chronic).",
      },
      {
        diagnosis: "Pelvic inflammatory disease",
        distinguishing:
          "Cervical motion tenderness, adnexal pain, abnormal uterine bleeding; screen and treat for chlamydia/gonorrhea.",
      },
      {
        diagnosis: "Urethral trauma or irritation (stones, catheter, instrumentation)",
        distinguishing:
          "History of trauma, catheterization, or instrumentation; hematuria may dominate; evaluate for stones and structural causes.",
      },
      {
        diagnosis: "Interstitial cystitis / bladder pain syndrome",
        distinguishing:
          "Chronic dysuria and pain with negative cultures; diagnosis of exclusion after repeated evaluations.",
      },
      {
        diagnosis: "Bladder or upper-tract malignancy",
        distinguishing:
          "Painless gross hematuria, weight loss, smoking history; cystoscopy and imaging are diagnostic.",
      },
    ],
    regimenTables: [
      {
        title: "Acute uncomplicated cystitis in non-pregnant women (IDSA 2010, current practice)",
        rows: [
          {
            scenario: "First-line (regardless of local TMP-SMX resistance)",
            regimen: "Nitrofurantoin 100 mg BID",
            duration: "5 d",
          },
          {
            scenario: "First-line if local E. coli susceptibility ≥ 80%",
            regimen: "TMP-SMX DS BID",
            duration: "3 d",
          },
          {
            scenario: "Single-dose alternative",
            regimen: "Fosfomycin 3 g PO × 1",
            duration: "1 d",
          },
          {
            scenario: "Beta-lactam alternative (less effective)",
            regimen: "Amoxicillin-clavulanate 875/125 BID or cephalexin 500 mg QID",
            duration: "5–7 d",
          },
        ],
      },
      {
        title: "Acute pyelonephritis (uncomplicated, outpatient)",
        rows: [
          {
            scenario: "Empiric oral (no ESBL risk)",
            regimen: "Ciprofloxacin 500 mg BID or levofloxacin 750 mg daily",
            duration: "5–7 d",
            note: "Always obtain urine culture first; de-escalate based on susceptibilities.",
          },
          {
            scenario: "If TMP-SMX susceptibility confirmed",
            regimen: "TMP-SMX DS BID",
            duration: "14 d",
          },
          {
            scenario: "Oral beta-lactam (less effective — reserve for alternatives)",
            regimen: "Amoxicillin-clavulanate or cephalexin",
            duration: "10–14 d",
          },
        ],
      },
      {
        title: "Inpatient IV therapy for pyelonephritis / complicated UTI",
        rows: [
          {
            scenario: "Empiric for uncomplicated pyelonephritis",
            regimen: "Ceftriaxone 1–2 g IV daily",
            duration: "Until afebrile and tolerating PO, then oral step-down",
          },
          {
            scenario: "ESBL risk or known ESBL",
            hostFactors: "Recent antibiotics, healthcare exposure, prior ESBL",
            regimen: "Ertapenem 1 g IV daily (or meropenem if severely ill)",
            duration: "Per syndrome; transition to oral once susceptibilities known",
            note: "MERINO — pip-tazo inferior to carbapenem for ESBL bacteremia.",
          },
          {
            scenario: "Pseudomonas risk",
            hostFactors: "Catheter, healthcare exposure, recurrent, structural disease",
            regimen: "Piperacillin-tazobactam, cefepime, or ceftazidime (extended infusion if severe)",
            duration: "Per syndrome",
          },
          {
            scenario: "Enterococcus suspected",
            regimen: "Ampicillin IV (or ampicillin + gentamicin/ceftriaxone for HLAR)",
            duration: "Per syndrome",
            note: "Do NOT use cephalosporins for enterococcus.",
          },
        ],
      },
      {
        title: "Pregnancy-specific therapy",
        rows: [
          {
            scenario: "Asymptomatic bacteriuria or cystitis (1st–2nd trimester)",
            regimen: "Cephalexin, amoxicillin-clavulanate, or fosfomycin; nitrofurantoin acceptable (avoid at term)",
            duration: "5–7 d (or 1 d for fosfomycin)",
          },
          {
            scenario: "Pyelonephritis",
            regimen: "IV ceftriaxone",
            duration: "Until afebrile, then oral beta-lactam",
            note: "Avoid fluoroquinolones, TMP-SMX (1st trimester, near term), tetracyclines.",
          },
        ],
      },
    ],
    complications: [
      {
        name: "Renal or perinephric abscess",
        recognize:
          "Persistent fever and flank pain despite 48–72 h of appropriate therapy; CT shows a rim-enhancing collection.",
        manage:
          "Continue IV antibiotics, image with contrast CT, and drain percutaneously (IR) collections > 3 cm or those failing antibiotics alone.",
      },
      {
        name: "Emphysematous pyelonephritis (diabetic patients)",
        recognize:
          "Severe diabetic with sepsis and gas in the renal parenchyma on CT; high mortality.",
        manage:
          "Urgent urology and ID consult; broad-spectrum IV antibiotics; percutaneous drainage and often nephrectomy for extensive disease. [VERIFY current management]",
      },
      {
        name: "Papillary necrosis",
        recognize:
          "Flank pain, hematuria, and (sometimes) passage of fragments; classically in diabetes, sickle cell, NSAID abuse, TB.",
        manage:
          "Supportive care, treat the precipitating UTI, address the underlying cause; imaging may show a 'ring sign' on CT.",
      },
      {
        name: "Urosepsis",
        recognize:
          "Fever, hypotension, organ dysfunction from a urinary source; suspect with pyelo plus hemodynamic instability.",
        manage:
          "Resuscitation (lactate, fluids, vasopressors if needed), source control (obstruction, abscess, catheter), and broad empiric IV antibiotics narrowed as soon as possible.",
      },
      {
        name: "Acute prostatitis",
        recognize:
          "Fever, perineal/suprapubic pain, tender prostate on exam, dysuria; more common in older men.",
        manage:
          "Urine and blood cultures, fluoroquinolone or TMP-SMX × 10–14 days (longer for chronic); exclude abscess by imaging if persistent.",
      },
    ],
    prognosis: [
      { metric: "Uncomplicated cystitis — clinical cure with first-line therapy", value: "~90–95% [VERIFY]" },
      { metric: "Uncomplicated pyelonephritis — cure with appropriate therapy", value: "~90% [VERIFY]" },
      { metric: "Pregnancy — untreated asymptomatic bacteriuria progression to pyelonephritis", value: "20–30% [VERIFY]" },
      { metric: "Emphysematous pyelonephritis mortality", value: "~10–20% with prompt drainage/surgery [VERIFY]" },
      { metric: "Urosepsis mortality (septic shock)", value: "~10–30% [VERIFY]" },
    ],
    specialPopulations: [
      {
        population: "Pregnancy",
        considerations:
          "Screen and treat asymptomatic bacteriuria; avoid fluoroquinolones, tetracyclines, and TMP-SMX (1st trimester and near term); admit pyelonephritis and treat with IV ceftriaxone.",
      },
      {
        population: "Men",
        considerations:
          "Treat as complicated UTI; consider prostatitis (longer courses, 10–14 d; chronic prostatitis 4–6 weeks); evaluate for obstruction and structural disease.",
      },
      {
        population: "Older adults",
        considerations:
          "Do not assume UTI from a positive culture in delirium — look for other sources; avoid fluoroquinolones; renal-dose-adjust; use the shortest effective duration.",
      },
      {
        population: "Catheterized patients",
        considerations:
          "Replace or remove catheter before treating; treat only symptomatic CAUTI; do not treat asymptomatic bacteriuria; minimize catheter duration.",
      },
      {
        population: "Diabetes",
        considerations:
          "Higher risk of emphysematous pyelonephritis, papillary necrosis, and fungal UTI; image if treatment fails or if severe infection; control glucose.",
      },
      {
        population: "Renal transplant",
        considerations:
          "More aggressive management with antimicrobial prophylaxis; involve transplant/ID; consider unusual organisms (BK virus nephropathy not to be confused with UTI).",
      },
    ],
    prevention: [
      {
        modality: "Behavioral counseling",
        target: "Women with recurrent UTI",
        detail:
          "Hydration, post-coital voiding, avoid spermicides; limited evidence for specific behaviors but reasonable.",
      },
      {
        modality: "Topical vaginal estrogen",
        target: "Postmenopausal women with recurrent UTI",
        detail:
          "Among the most effective non-antibiotic interventions — restores vaginal lactobacilli and reduces recurrence.",
      },
      {
        modality: "Cranberry products and D-mannose",
        target: "Women with recurrent UTI",
        detail:
          "Modest and inconsistent evidence; offer as adjuncts but not as substitutes for proven therapy. [VERIFY current evidence]",
      },
      {
        modality: "Daily or post-coital antibiotic prophylaxis",
        target: "Selected women with recurrent UTI",
        detail:
          "Nitrofurantoin, TMP-SMX, or cephalexin × 3–6 months after full evaluation; reassess for ongoing need.",
      },
      {
        modality: "Self-start therapy",
        target: "Reliable patients with recurrent UTI",
        detail:
          "Standby prescription (e.g., nitrofurantoin or TMP-SMX) with instructions to self-initiate at symptom onset and drop a culture.",
      },
      {
        modality: "Catheter stewardship",
        target: "Hospitalized and catheterized patients",
        detail:
          "Minimize catheter duration; use closed systems and aseptic insertion; review daily necessity and remove promptly.",
      },
    ],
    whenToRefer: [
      "Recurrent UTI (≥ 2 in 6 mo or ≥ 3 in 12 mo) → urology for cystoscopy and upper-tract imaging to rule out structural causes.",
      "Renal or perinephric abscess → interventional radiology for drainage.",
      "Emphysematous pyelonephritis → urology and ID urgently; drainage ± nephrectomy.",
      "Suspected obstruction (stones, BPH, tumor) → urology for source control.",
      "Pregnancy with pyelonephritis → obstetrics ± ID co-management.",
      "Renal transplant with UTI → transplant/ID.",
      "Urosepsis with hemodynamic instability → ICU and ID.",
      "Recurrent or complicated Candida urinary infection → ID (consider fluconazole, rarely echinocandin or amphotericin).",
    ],
    followUp: [
      "Acute cystitis: no routine test of cure unless symptoms persist; advise return if symptoms recur within 4 weeks.",
      "Pyelonephritis: repeat culture if symptoms persist at 48–72 h; image if no response by then.",
      "Pregnancy: test-of-cure culture 1–2 weeks after therapy, then monthly screening for the remainder of pregnancy.",
      "CAUTI: remove or replace catheter; reassess symptoms daily; do not repeat urine cultures to document cure.",
      "Recurrent UTI: confirm with cultures; consider urology referral and discuss non-antibiotic and prophylactic options.",
      "Drug-resistant organisms: ensure follow-up cultures and decolonization or stewardship input as appropriate.",
    ],
    evidence: [
      {
        title: "IDSA Guideline on the Management of Acute Uncomplicated Cystitis and Pyelonephritis",
        source: "Gupta K, Hooton TM, Naber KG, et al. Clin Infect Dis. 2011;52(5):e103-e120. PMID: 21292654. DOI: 10.1093/cid/ciq257.",
        url: "https://pubmed.ncbi.nlm.nih.gov/21292654/",
        kind: "guideline",
        focus: "The foundational US guideline for cystitis and pyelonephritis — regimens, durations, ESBL considerations.",
      },
      {
        title: "IDSA Guidelines on the Management and Treatment of Complicated Urinary Tract Infections",
        source: "Infectious Diseases Society of America, 2025 guideline.",
        url: "https://www.idsociety.org/practice-guideline/complicated-uti/",
        kind: "guideline",
        focus: "Current framework for complicated UTI diagnosis, empiric therapy, definitive therapy, and duration.",
      },
      {
        title: "IDSA Asymptomatic Bacteriuria Guideline",
        source: "Nicolle LE, Gupta K, Bradley SF, et al. Clin Infect Dis. 2019;68(10):e83-e110. PMID: 30895288. DOI: 10.1093/cid/ciy1121.",
        url: "https://pubmed.ncbi.nlm.nih.gov/30895288/",
        kind: "guideline",
        focus: "Definitive guidance — do not treat except pregnancy and before urologic procedures with mucosal bleeding.",
      },
      {
        title: "IDSA Guidance on the Treatment of Antimicrobial-Resistant Gram-Negative Infections",
        source: "Tamma PD, Bonomo RA, Heil EL, Justo JA, Satlin MJ, Mathers AJ. Infectious Diseases Society of America. Published July 30, 2026.",
        url: "https://www.idsociety.org/practice-guideline/amr-guidance/",
        kind: "guideline",
        focus: "Updated recommendations for ESBL-E uncomplicated cystitis and complicated UTI, AmpC-E, CRE, and difficult-to-treat Pseudomonas.",
      },
      {
        title: "MERINO — Piperacillin-tazobactam vs ceftriaxone for ESBL E. coli / Klebsiella bacteremia",
        source: "Harris PNA, Tambyah PA, Lye DC, et al. JAMA. 2018;320(10):984-994. PMID: 30208454. DOI: 10.1001/jama.2018.12163.",
        url: "https://pubmed.ncbi.nlm.nih.gov/30208454/",
        kind: "trial",
        focus: "Pip-tazo inferior to carbapenem for ESBL bacteremia — use a carbapenem.",
      },
      {
        title: "Duration of treatment for cystitis — systematic reviews of short courses",
        source: "[VERIFY — identify a current meta-analysis]",
        kind: "review",
        focus: "Short courses (3–5 d) are as effective as longer courses for uncomplicated cystitis.",
      },
      {
        title: "Vaginal estrogen for recurrent UTI in postmenopausal women — meta-analysis",
        source: "[VERIFY — identify the most recent Cochrane / systematic review]",
        kind: "review",
        focus: "Vaginal estrogen significantly reduces recurrent UTI in postmenopausal women.",
      },
    ],
    pearls: [
      "Name the syndrome before you prescribe — cystitis, pyelo, complicated UTI, CAUTI, or asymptomatic bacteriuria.",
      "Nitrofurantoin × 5 d or TMP-SMX × 3 d (if local E. coli susceptibility ≥ 80%) for acute uncomplicated cystitis; reserve fluoroquinolones.",
      "Do NOT treat asymptomatic bacteriuria — except pregnancy and before urologic procedures with mucosal bleeding.",
      "Cloudy urine in a catheterized patient is bacteriuria, not infection — look for symptoms.",
      "Pregnancy: screen, treat ASB, use beta-lactams, avoid FQ/TMP-SMX/tetracyclines.",
      "ESBL pyelonephritis or bacteremia → carbapenem (MERINO), NOT pip-tazo.",
      "Enterococcus is not covered by cephalosporins — use ampicillin (or amoxicillin for cystitis).",
      "Postmenopausal recurrent UTI → topical vaginal estrogen is highly effective and often overlooked.",
      "Image pyelonephritis that fails therapy at 48–72 h or in diabetics/immunocompromised — look for abscess, emphysematous change, obstruction.",
      "Delirium in an elderly patient with a positive urine culture: look for another source — over-diagnosing UTI is a major driver of antibiotic harm.",
    ],
    syndromeTags: ["Urinary Tract Infection", "Pyelonephritis", "Sepsis"],
    conceptTags: [
      "Urinary tract infection",
      "Cystitis",
      "Pyelonephritis",
      "Asymptomatic bacteriuria",
      "Catheter-associated UTI",
      "Recurrent UTI",
      "ESBL",
      "Enterococcus",
      "Pregnancy",
      "Nitrofurantoin",
      "MERINO",
    ],
    tools: [
      { href: "/mechid", label: "MechID", why: "Antibiotic mechanisms relevant to empiric UTI therapy." },
      { href: "/tools/spectrum", label: "Spectrum", why: "Confirm coverage for Enterococcus, ESBL, and Pseudomonas before de-escalation." },
      { href: "/tools/doseid", label: "DoseID", why: "Renal-adjusted dosing for nitrofurantoin, TMP-SMX, beta-lactams." },
    ],
    furtherReading: [
      {
        title: "Acute Uncomplicated Cystitis and Pyelonephritis in Women — Current Clinical Management",
        source: "[VERIFY — identify a current 2023–2025 review]",
        kind: "review",
        focus: "Modern empiric and targeted therapy, ESBL considerations, and oral step-down.",
      },
      {
        title: "Catheter-Associated UTI (CAUTI) Prevention and Management",
        source: "CDC / HICPAC [VERIFY current version]",
        kind: "guideline",
        focus: "Prevention bundles, indications for treatment, and catheter stewardship.",
      },
    ],
  },
  {
    slug: "skin-and-soft-tissue-infection",
    title: "Skin and soft tissue infection",
    category: "Skin, Soft Tissue, Bone & Joint Infections",
    summary:
      "Skin and soft tissue infection is one of the most common infections IM residents manage. The first branch point is purulent vs non-purulent: abscesses are treated with incision and drainage (antibiotics add little for uncomplicated abscess), while non-purulent cellulitis is typically streptococcal and responds to a beta-lactam. Recognizing necrotizing infection is a surgical emergency that cannot wait.",
    readMins: 17,
    difficulty: "core",
    lastReviewed: "2026-07-21",
    lastUpdated: "2026-07-21",
    atAGlance: [
      "The first branch point is purulent vs non-purulent — drain the abscess, treat the cellulitis.",
      "Non-purulent cellulitis is usually streptococcal; cephalexin or dicloxacillin is first-line. Add MRSA coverage (TMP-SMX or doxycycline) for purulence, IVDU, prior MRSA, severe infection, or treatment failure.",
      "Incision and drainage is the treatment for abscess — antibiotics add little for uncomplicated drained abscess (NEJM 2017 trial confirms I&D alone is sufficient in many).",
      "Default duration for uncomplicated SSTI is 5–6 days; longer is not better.",
      "Necrotizing soft tissue infection: pain out of proportion, woody induration, bullae, crepitus, or sepsis — surgical exploration is diagnostic and therapeutic; do NOT delay for imaging.",
      "Diabetic foot infection: probe-to-bone, deep tissue cultures, broader empiric coverage, and evaluate for osteomyelitis.",
      "Consider bite wounds (Pasteurella, anaerobes — amoxicillin-clavulanate), seawater (Vibrio), and freshwater (Aeromonas) exposures.",
    ],
    objectives: [
      "Distinguish purulent from non-purulent SSTI and apply the right initial management.",
      "Identify MRSA risk factors and choose empiric therapy accordingly.",
      "Recognize the clinical features of necrotizing soft tissue infection and escalate urgently to surgery.",
      "Manage diabetic foot infection, including evaluation for osteomyelitis.",
      "Apply the IDSA SSTI guideline on duration, de-escalation, and oral step-down.",
      "Know when source control (incision and drainage, debridement) is the treatment and antibiotics are adjunctive.",
    ],
    keyConcepts: [
      {
        heading: "The first branch point: purulent vs non-purulent",
        prose:
          "The IDSA SSTI guideline organizes management around whether the lesion is purulent. Purulent infections (abscess, furuncle, carbuncle) are typically staphylococcal (mostly MRSA in many US communities) and are treated primarily with incision and drainage (I&D), with antibiotics reserved for severe disease, immunocompromise, or inadequate response. Non-purulent cellulitis and erysipelas are typically streptococcal and respond to a beta-lactam active against streptococci. Adding empiric MRSA coverage to non-purulent cellulitis does not improve outcomes in most trials, but is reasonable with systemic toxicity, IVDU, prior MRSA, or treatment failure.",
        bullets: [
          "Purulent (abscess, furuncle): I&D is the treatment; send culture if severe or for epidemiology.",
          "Non-purulent cellulitis: beta-lactam (cephalexin, dicloxacillin); adding empiric MRSA cover is reasonable with risk factors.",
          "Erysipelas: sharply demarcated raised lesion, streptococcal — beta-lactam.",
          "MRSA risk factors: prior MRSA, IVDU, recent hospitalization, dialysis, household contacts, recurrent SSTI.",
          "Bilateral 'cellulitis' is almost never cellulitis — look for stasis dermatitis, contact dermatitis, or vascular causes.",
        ],
        question: {
          pollId: "train-ssti-branch-q1",
          prompt:
            "A 40-year-old presents with a 3 cm fluctuant, erythematous, tender nodule on the thigh with a central pustule. No fever; vitals normal. Best initial management?",
          options: [
            {
              id: "A",
              label: "Oral cephalexin 500 mg QID × 7 days",
              feedback:
                "Cephalexin does not cover MRSA, and antibiotics alone are inadequate for a fluctuant abscess — drainage is the treatment.",
            },
            {
              id: "B",
              label: "Incision and drainage; antibiotics only if severe or MRSA risk factors",
              correct: true,
              feedback:
                "Correct. Incision and drainage is the primary therapy for an abscess; antibiotics add little for uncomplicated drained abscess in immunocompetent patients.",
            },
            {
              id: "C",
              label: "TMP-SMX DS BID × 10 days without drainage",
              feedback:
                "MRSA coverage is incomplete without source control; antibiotics alone for an undrained abscess often fail.",
            },
            {
              id: "D",
              label: "Warm compresses and observation",
              feedback:
                "A fluctuant abscess needs drainage; observation alone prolongs the infection and risks extension.",
            },
          ],
        },
      },
      {
        heading: "Non-purulent cellulitis: streptococcal, beta-lactam-first",
        prose:
          "Non-purulent cellulitis is an acute spreading infection of the dermis and subcutaneous tissue, usually caused by beta-hemolytic streptococci (Groups A, B, C, G), with Staphylococcus aureus (often MSSA) a less common cause. The classic presentation is unilateral, warm, erythematous, edematous skin with poorly defined margins, often on a lower extremity. Look for and treat the portal of entry (tinea pedis, fissures, ulceration, injection sites). First-line therapy is a beta-lactam active against streptococci — cephalexin or dicloxacillin PO for outpatients; cefazolin or ceftriaxone IV for inpatients. Adding empiric MRSA coverage does not improve outcomes in classic non-purulent cellulitis (three RCTs of TMP-SMX and placebo vs beta-lactam alone found no benefit).",
        bullets: [
          "First-line: cephalexin 500 mg QID or dicloxacillin 500 mg QID × 5–6 days (with clinical response).",
          "Inpatient IV: cefazolin or ceftriaxone; switch to oral when afebrile and improving.",
          "Add empiric MRSA cover (TMP-SMX, doxycycline, or clindamycin) if: IVDU, prior MRSA, severe/sepsis, purulence, bite wound, or failure of beta-lactam.",
          "Mark the border, elevate the limb, treat tinea pedis and any portal of entry.",
          "Reassess at 48–72 h — if not improving, reconsider diagnosis, antibiotic choice, and need for imaging or source control.",
        ],
        question: {
          pollId: "train-ssti-cellulitis-q1",
          prompt:
            "A 55-year-old with type 2 diabetes and tinea pedis has 1 day of unilateral leg erythema, warmth, and tenderness, no pus, no fever, normal vitals. Best initial therapy?",
          options: [
            {
              id: "A",
              label: "Cephalexin 500 mg QID × 5–6 days, plus treat tinea pedis",
              correct: true,
              feedback:
                "Correct. Non-purulent cellulitis is usually streptococcal; a beta-lactam is first-line, and treating the portal of entry (tinea) reduces recurrence.",
            },
            {
              id: "B",
              label: "TMP-SMX DS BID × 10 days",
              feedback:
                "TMP-SMX lacks streptococcal activity and is inferior for non-purulent cellulitis unless MRSA risk factors are present.",
            },
            {
              id: "C",
              label: "Vancomycin IV inpatient",
              feedback:
                "This presentation does not require inpatient IV therapy or MRSA coverage; oral beta-lactam is appropriate.",
            },
            {
              id: "D",
              label: "Prednisone 40 mg daily for 5 days",
              feedback:
                "There is limited evidence for steroids in non-purulent cellulitis (PRIME trial suggested some benefit but it is not first-line); antibiotics and source control are primary.",
            },
          ],
        },
      },
      {
        heading: "Purulent SSTI & MRSA: drain, then cover",
        prose:
          "Purulent SSTI (abscess, furuncle, carbuncle) is driven by Staphylococcus aureus — in much of the United States, community-associated MRSA is the dominant strain. Incision and drainage is the cornerstone of therapy; antibiotics are added for severe disease, extensive surrounding cellulitis, immunocompromise, fever, older age, failed I&D, or when source control is incomplete. Empiric oral MRSA coverage is TMP-SMX or doxycycline (plus a beta-lactam if streptococcal coverage is also needed). For inpatient or severe disease, vancomycin is first-line; linezolid or daptomycin are alternatives.",
        bullets: [
          "I&D is the treatment — always; pack the cavity, ensure complete drainage.",
          "Add antibiotics for: sepsis, rapid progression, extensive cellulitis, immunocompromise, extremes of age, failed I&D, or inadequate source control.",
          "Oral MRSA cover: TMP-SMX DS BID or doxycycline 100 mg BID (doxycycline lacks some streptococcal activity).",
          "Clindamycin: active against many MRSA, but check local D-test (inducible resistance); avoid as monotherapy for severe disease.",
          "Inpatient MRSA cover: vancomycin (AUC-guided), linezolid (avoid >2 weeks), daptomycin (never for pneumonia).",
        ],
      },
      {
        heading: "Necrotizing soft tissue infection: a surgical emergency",
        prose:
          "Necrotizing fasciitis is a rapidly progressive infection of the deep fascia and subcutaneous tissues that causes tissue necrosis and carries high mortality. The single most important principle is that surgical exploration is both diagnostic and therapeutic — and must not wait for definitive imaging or laboratory confirmation. Suspect necrotizing infection when pain is out of proportion to physical findings, when the skin is hard and woody with induration extending beyond visible erythema, when there are bullae, crepitus, or skin necrosis, or when sepsis coexists with a soft tissue complaint. The LRINEC score can support the diagnosis but is not sufficiently sensitive to exclude it.",
        bullets: [
          "Red flags: pain out of proportion, woody/hard induration, bullae, skin necrosis, crepitus, sepsis, rapid progression.",
          "Surgical exploration is diagnostic — 'hard signs' of necrosis (dishwater fluid, thrombosed vessels, non-contractile muscle) mandate debridement.",
          "Empiric broad coverage: piperacillin-tazobactam (or carbapenem) + vancomycin + clindamycin (clindamycin for toxin suppression in streptococcal and staphylococcal toxic shock). [VERIFY current empiric regimen]",
          "Polymicrobial (Type I): post-surgical, diabetic, perineal (Fournier). Monomicrobial (Type II): GAS, often in healthy hosts. Vibrio/Aeromonas: saltwater/freshwater exposure.",
          "Imaging (CT with contrast) is useful only if it does NOT delay surgery; subcutaneous gas and fascial fluid with enhancement support the diagnosis.",
        ],
        question: {
          pollId: "train-ssti-necrotizing-q1",
          prompt:
            "A 50-year-old with diabetes presents with severe thigh pain out of proportion to exam, tachycardia, hypotension, and a rapidly enlarging area of indurated, dusky skin with a small bulla. Best immediate action?",
          options: [
            {
              id: "A",
              label: "Obtain CT scan to confirm necrotizing fasciitis before treatment",
              feedback:
                "Imaging must not delay surgical exploration in a patient with clinical signs of necrotizing infection and sepsis.",
            },
            {
              id: "B",
              label: "Start IV piperacillin-tazobactam + vancomycin + clindamycin and consult surgery emergently",
              correct: true,
              feedback:
                "Correct. Immediate broad-spectrum antibiotics, resuscitation, and emergent surgical exploration with debridement are the standard of care.",
            },
            {
              id: "C",
              label: "Admit for IV cefazolin and reassess in the morning",
              feedback:
                "Cefazolin alone is inadequate for necrotizing infection (misses MRSA, anaerobes, toxin suppression), and delay risks mortality.",
            },
            {
              id: "D",
              label: "Outpatient management with TMP-SMX and follow-up in 48 h",
              feedback:
                "This presentation is a surgical emergency — outpatient therapy is unsafe.",
            },
          ],
        },
      },
      {
        heading: "Diabetic foot infection: probe, culture, cover broadly",
        prose:
          "Diabetic foot infection ranges from mild cellulitis to limb-threatening infection with osteomyelitis and deep space abscess. The most important early steps are: probe the ulcer to bone (probe-to-bone test), assess perfusion, evaluate for osteomyelitis (plain films, MRI), and obtain deep tissue cultures (preferably after debridement) before starting broad empiric therapy. Mild infection is often streptococcal or staphylococcal; moderate-to-severe infection is polymicrobial (aerobes and anaerobes) and requires broad coverage with a focus on source control (debridement, offloading, revascularization). Always involve podiatry, vascular surgery, and ID.",
        bullets: [
          "Probe-to-bone: a positive test predicts osteomyelitis in high-risk patients; correlate with imaging and cultures.",
          "Mild infection: cephalexin or dicloxacillin (add MRSA cover if risk factors).",
          "Moderate-to-severe: ampicillin-sulbactam, piperacillin-tazobactam, or a carbapenem; add MRSA and (sometimes) Pseudomonas coverage in severe or chronic infection.",
          "Obtain deep tissue or bone cultures after debridement; avoid superficial swabs.",
          "Image with plain radiographs first; MRI is most sensitive for osteomyelitis and deep abscess.",
          "Multidisciplinary care: podiatry, vascular surgery (for revascularization), ID, and endocrinology.",
        ],
        question: {
          pollId: "train-ssti-diabetic-foot-q1",
          prompt:
            "A patient with diabetes has a chronic plantar ulcer with surrounding erythema. A superficial swab grows MRSA, Enterococcus, and Pseudomonas. What is the best culture strategy if deeper infection is suspected?",
          options: [
            { id: "A", label: "Base therapy only on the superficial swab", feedback: "Incorrect. Superficial swabs often recover colonizers and can lead to unnecessary broad therapy." },
            { id: "B", label: "Obtain deep tissue or bone culture after cleaning/debridement", correct: true, feedback: "Correct. Deep tissue or bone specimens better reflect true pathogens in diabetic foot infection." },
            { id: "C", label: "Avoid cultures in all diabetic foot infections", feedback: "Incorrect. Cultures are useful when obtained correctly and infection is present." },
            { id: "D", label: "Use urine culture to identify foot pathogens", feedback: "Incorrect. Urine culture does not diagnose diabetic foot infection." },
          ],
        },
      },
      {
        heading: "Bite wounds and special exposures",
        prose:
          "Bite wounds and environmental exposures shape the empiric antibiotic choice. Cat and dog bites inoculate Pasteurella multocida, anaerobes, and oral streptococci; first-line is amoxicillin-clavulanate. Human bites add Eikenella corrodens and require the same. Seawater exposure raises concern for Vibrio vulnificus; freshwater for Aeromonas. Puncture wounds (through shoes) risk Pseudomonas osteomyelitis. Consider rabies for animal bites in endemic areas, and tetanus for all contaminated wounds. Surgical assessment is essential for bites involving joints, tendons, or deep structures of the hand.",
        bullets: [
          "Dog/cat/human bites: amoxicillin-clavulanate (Pasteurella, anaerobes, Eikenella); doxycycline or TMP-SMX + metronidazole in penicillin-allergic.",
          "Seawater exposure: add coverage for Vibrio (doxycycline + ceftazidime for severe infection). [VERIFY]",
          "Freshwater: add coverage for Aeromonas (fluoroquinolone or TMP-SMX).",
          "Puncture through shoes: cover Pseudomonas (fluoroquinolone); assess for osteomyelitis.",
          "Update tetanus and assess rabies risk for all animal bites.",
        ],
        question: {
          pollId: "train-ssti-bites-q1",
          prompt:
            "A patient presents with an infected cat bite to the hand. Which oral antibiotic best covers Pasteurella, oral streptococci, and anaerobes?",
          options: [
            { id: "A", label: "Amoxicillin-clavulanate", correct: true, feedback: "Correct. Amoxicillin-clavulanate is first-line for many dog and cat bite infections." },
            { id: "B", label: "Cephalexin alone", feedback: "Incorrect. Cephalexin lacks reliable Pasteurella and anaerobic coverage for bite wounds." },
            { id: "C", label: "Azithromycin alone", feedback: "Incorrect. This is not preferred empiric bite-wound coverage." },
            { id: "D", label: "Nitrofurantoin", feedback: "Incorrect. Nitrofurantoin is a urinary antibiotic and is not used for bite wounds." },
          ],
        },
      },
      {
        heading: "Recurrent SSTI and decolonization",
        prose:
          "Recurrent SSTI (especially MRSA) is common in households and among close contacts. After treating the acute infection, address modifiable risk factors: nasal colonization, skin hygiene, fomites, and any underlying portal of entry (injection drug use, tinea, eczema). Decolonization regimens combine nasal mupirocin with chlorhexidine body washes, though evidence is mixed and benefit is often temporary. Educate households about personal hygiene, not sharing personal items, and cleaning high-touch surfaces.",
        bullets: [
          "Address modifiable risk factors: IVDU, tinea, eczema, obesity, diabetes, chronic wounds.",
          "MRSA decolonization: nasal mupirocin × 5–10 days + chlorhexidine body washes; benefit is often temporary and evidence is mixed. [VERIFY current guideline]",
          "Household hygiene: clean high-touch surfaces, do not share razors/towels, cover draining wounds.",
          "Consider decolonization for: ≥ 2 documented MRSA infections in a year, or household outbreaks.",
        ],
        question: {
          pollId: "train-ssti-recurrent-q1",
          prompt:
            "A patient has three culture-confirmed MRSA abscesses in 8 months and several household contacts with boils. After treating the current abscess, what prevention strategy is reasonable?",
          options: [
            { id: "A", label: "Discuss hygiene, household measures, and possible decolonization", correct: true, feedback: "Correct. Recurrent MRSA SSTI can justify hygiene interventions and selected decolonization strategies." },
            { id: "B", label: "Give lifelong vancomycin", feedback: "Incorrect. Chronic systemic antibiotics are harmful and not standard prevention." },
            { id: "C", label: "Ignore household contacts", feedback: "Incorrect. Household transmission can sustain recurrence." },
            { id: "D", label: "Use ceftriaxone monthly", feedback: "Incorrect. Ceftriaxone is not a decolonization strategy and does not reliably cover MRSA." },
          ],
        },
      },
      {
        heading: "Cellulitis mimics are common",
        prose:
          "Not every red leg is cellulitis. Venous stasis dermatitis, lymphedema, contact dermatitis, gout, DVT, drug reactions, and inflammatory dermatoses can look infectious. Bilateral chronic erythema without fever, leukocytosis, tenderness, or progression should make residents pause before prescribing antibiotics.",
        question: {
          pollId: "train-ssti-mimic-q1",
          prompt:
            "An afebrile patient has chronic bilateral lower-leg erythema, scaling, edema, and venous varicosities. No tenderness or leukocytosis. Best interpretation?",
          options: [
            { id: "A", label: "Venous stasis dermatitis is more likely than bilateral cellulitis", correct: true, feedback: "Correct. Bilateral chronic changes strongly suggest a mimic rather than acute bacterial cellulitis." },
            { id: "B", label: "Bilateral cellulitis is the default diagnosis", feedback: "Incorrect. True bilateral cellulitis is uncommon; mimics are frequent." },
            { id: "C", label: "Treat with broad IV antibiotics for 6 weeks", feedback: "Incorrect. This would expose the patient to avoidable harm." },
            { id: "D", label: "Diagnose necrotizing fasciitis", feedback: "Incorrect. The chronic, bilateral, non-toxic presentation does not fit necrotizing infection." },
          ],
        },
      },
      {
        heading: "Duration should shorten when the patient responds",
        prose:
          "Uncomplicated cellulitis often improves with short courses when the patient responds clinically. Slow fading of erythema does not always mean failure; edema and inflammation can persist after bacterial burden falls. Reassess for abscess, wrong diagnosis, resistant pathogen, adherence, or inadequate source control before simply extending therapy.",
        question: {
          pollId: "train-ssti-duration-q1",
          prompt:
            "A patient with uncomplicated non-purulent cellulitis is afebrile and clinically improved after 5 days of cephalexin, but faint erythema remains. Best next step?",
          options: [
            { id: "A", label: "Stop or complete the short planned course if improving", correct: true, feedback: "Correct. Residual inflammation can persist; prolonged therapy is not automatically needed when clinical response is good." },
            { id: "B", label: "Add vancomycin for residual color", feedback: "Incorrect. Faint residual erythema alone does not prove MRSA or failure." },
            { id: "C", label: "Treat until the skin looks completely normal", feedback: "Incorrect. This often leads to unnecessary prolonged antibiotics." },
            { id: "D", label: "Send blood cultures now in all cases", feedback: "Incorrect. Blood cultures are low yield in uncomplicated improving cellulitis." },
          ],
        },
      },
      {
        heading: "Water exposure changes empiric therapy",
        prose:
          "Severe SSTI after seawater exposure raises concern for Vibrio vulnificus, especially with liver disease or iron overload. Freshwater exposure raises concern for Aeromonas. These syndromes can progress quickly and require exposure-specific antibiotics plus urgent surgical evaluation when necrotizing infection is possible.",
        question: {
          pollId: "train-ssti-water-q1",
          prompt:
            "A man with cirrhosis develops rapidly progressive bullous cellulitis after handling oysters and exposure to seawater. Which pathogen is the key concern?",
          options: [
            { id: "A", label: "Vibrio vulnificus", correct: true, feedback: "Correct. Seawater/oyster exposure plus liver disease and bullous rapidly progressive SSTI is classic for V. vulnificus." },
            { id: "B", label: "Bordetella pertussis", feedback: "Incorrect. Pertussis causes respiratory disease, not seawater-associated necrotizing SSTI." },
            { id: "C", label: "Candida albicans", feedback: "Incorrect. Candida is not the classic cause of this syndrome." },
            { id: "D", label: "Mycoplasma pneumoniae", feedback: "Incorrect. Mycoplasma is a respiratory pathogen." },
          ],
        },
      },
      {
        heading: "Source control beats antibiotic escalation for abscesses",
        prose:
          "When an abscess is present, drainage is the key intervention. Antibiotics may be added for systemic illness, extensive disease, immunocompromise, difficult-to-drain areas, surrounding cellulitis, recurrent disease, or high-risk hosts, but antibiotics alone are usually inadequate for a drainable collection.",
        question: {
          pollId: "train-ssti-source-control-q1",
          prompt:
            "A patient has a 4-cm fluctuant abscess with surrounding erythema. What is the most important management step?",
          options: [
            { id: "A", label: "Incision and drainage", correct: true, feedback: "Correct. Drainage is the central intervention for a drainable abscess." },
            { id: "B", label: "Topical steroid only", feedback: "Incorrect. A fluctuant abscess needs drainage." },
            { id: "C", label: "Blood cultures before any local therapy", feedback: "Incorrect. Blood cultures are not the key first step in uncomplicated abscess." },
            { id: "D", label: "Antibiotics alone are always sufficient", feedback: "Incorrect. Antibiotics alone often fail when source control is needed." },
          ],
        },
      },
    ],
    scoringTools: [
      {
        name: "LRINEC — Laboratory Risk Indicator for Necrotizing Fasciitis",
        purpose:
          "A bedside score to support the diagnosis of necrotizing soft tissue infection. A low score does NOT exclude necrotizing infection; clinical suspicion and surgical exploration override a low score.",
        points: [
          { factor: "CRP ≥ 150 mg/L", score: 4 },
          { factor: "CRP < 150 mg/L", score: 0 },
          { factor: "WBC 15–25 × 10⁹/L", score: 1 },
          { factor: "WBC > 25 × 10⁹/L", score: 2 },
          { factor: "WBC < 15 × 10⁹/L", score: 0 },
          { factor: "Hemoglobin 11–13.5 g/dL", score: 1 },
          { factor: "Hemoglobin < 11 g/dL", score: 2 },
          { factor: "Hemoglobin ≥ 13.5 g/dL", score: 0 },
          { factor: "Sodium < 135 mmol/L", score: 2 },
          { factor: "Sodium ≥ 135 mmol/L", score: 0 },
          { factor: "Creatinine > 1.6 mg/dL (141 µmol/L)", score: 2 },
          { factor: "Creatinine ≤ 1.6 mg/dL", score: 0 },
          { factor: "Glucose > 180 mg/dL (10 mmol/L)", score: 1 },
          { factor: "Glucose ≤ 180 mg/dL", score: 0 },
        ],
        interpretation: [
          {
            range: "0–4",
            meaning: "Low risk (in the original derivation cohort)",
            action:
              "Continue routine management, but clinical signs override the score — if pain is out of proportion or there are hard signs, obtain surgical evaluation regardless.",
          },
          {
            range: "≥ 6",
            meaning: "Moderate-to-high probability of necrotizing fasciitis",
            action:
              "Urgent surgical consultation and empiric broad-spectrum antibiotics. Do NOT delay for imaging. [VERIFY performance in external validation — sensitivity is lower than in derivation]",
          },
        ],
        source: "Wong CH, et al. Crit Care Med. 2004 [VERIFY; caution — external validation shows lower sensitivity].",
      },
    ],
    differentials: [
      {
        diagnosis: "Stasis dermatitis (mimics cellulitis)",
        distinguishing:
          "Bilateral, chronic, often in the setting of venous insufficiency; lacks fever and ascending lymphangitis. Treat with compression, elevation, and skin care — not antibiotics.",
      },
      {
        diagnosis: "Contact dermatitis",
        distinguishing:
          "Pruritic, linear or geometric pattern, exposure history; not painful or warm; responds to topical steroids and allergen avoidance.",
      },
      {
        diagnosis: "Deep venous thrombosis / superficial thrombophlebitis",
        distinguishing:
          "Unilateral swelling without surface erythema that tracks a vein; suspect with immobility, malignancy, or recent surgery; confirm with venous Doppler.",
      },
      {
        diagnosis: "Erythema migrans (Lyme disease)",
        distinguishing:
          "Expanding annular lesion with central clearing after tick exposure; treat with doxycycline (early localized Lyme).",
      },
      {
        diagnosis: "Brown recluse spider envenomation",
        distinguishing:
          "Painless blister that becomes necrotic over hours to days in an endemic region; no systemic sepsis early.",
      },
      {
        diagnosis: "Septic arthritis or osteomyelitis",
        distinguishing:
          "Joint pain with restricted motion, pain with passive motion (arthritis); chronic ulcer with exposed bone (osteomyelitis); image and aspirate as indicated.",
      },
      {
        diagnosis: "Calciphylaxis (renal failure)",
        distinguishing:
          "Painful, purpuric, reticular lesions that progress to necrosis in ESRD; biopsy confirms — manage with phosphate binders, sodium thiosulfate, and wound care.",
      },
    ],
    regimenTables: [
      {
        title: "Empiric therapy by SSTI type and severity",
        rows: [
          {
            scenario: "Non-purulent cellulitis (outpatient, no MRSA risk)",
            regimen: "Cephalexin 500 mg QID or dicloxacillin 500 mg QID",
            duration: "5–6 d",
          },
          {
            scenario: "Non-purulent cellulitis with MRSA risk (IVDU, prior MRSA, severe, bite)",
            regimen: "Add TMP-SMX DS BID or doxycycline 100 mg BID to the beta-lactam",
            duration: "5–7 d",
          },
          {
            scenario: "Purulent SSTI / abscess (outpatient)",
            regimen: "I&D (always); TMP-SMX DS BID or doxycycline if antibiotics needed",
            duration: "5–7 d if antibiotics used",
            note: "NEJM 2017 — I&D alone sufficient for many uncomplicated abscesses.",
          },
          {
            scenario: "Inpatient SSTI (severe, sepsis)",
            hostFactors: "MRSA risk: vancomycin required",
            regimen: "Vancomycin + piperacillin-tazobactam (or ceftriaxone if no MRSA risk)",
            duration: "Until improving, then oral step-down",
          },
          {
            scenario: "Necrotizing soft tissue infection",
            regimen: "Piperacillin-tazobactam + vancomycin + clindamycin",
            duration: "Source control (debridement) is primary",
            note: "Clindamycin for toxin suppression. [VERIFY current empiric regimen]",
          },
        ],
      },
      {
        title: "Special exposure SSTI",
        rows: [
          {
            scenario: "Dog or cat bite",
            regimen: "Amoxicillin-clavulanate 875/125 BID (Pasteurella, anaerobes, oral streptococci)",
            duration: "5–7 d (longer for infected bites)",
          },
          {
            scenario: "Human bite",
            regimen: "Amoxicillin-clavulanate (Eikenella, anaerobes)",
            duration: "7–10 d",
            note: "Surgical assessment for bites involving the hand, joint, or tendon.",
          },
          {
            scenario: "Seawater exposure (Vibrio risk)",
            regimen: "Doxycycline + ceftazidime for severe infection",
            duration: "Per severity",
          },
          {
            scenario: "Freshwater exposure (Aeromonas risk)",
            regimen: "Fluoroquinolone or TMP-SMX",
            duration: "Per severity",
          },
          {
            scenario: "Puncture through shoes (Pseudomonas risk)",
            regimen: "Fluoroquinolone (ciprofloxacin)",
            duration: "10–14 d; evaluate for osteomyelitis",
          },
        ],
      },
      {
        title: "Diabetic foot infection empiric therapy",
        rows: [
          {
            scenario: "Mild infection (no systemic signs)",
            regimen: "Cephalexin or dicloxacillin; add MRSA cover if risk factors",
            duration: "7–14 d",
          },
          {
            scenario: "Moderate infection",
            regimen: "Ampicillin-sulbactam or piperacillin-tazobactam; add vancomycin if MRSA risk",
            duration: "Until clinically improved",
          },
          {
            scenario: "Severe infection / sepsis",
            hostFactors: "Polymicrobial, MRSA, Pseudomonas possible",
            regimen: "Piperacillin-tazobactam + vancomycin ± a carbapenem",
            duration: "Until source control and improvement; osteomyelitis requires 4–6 wk",
            note: "Deep tissue or bone cultures after debridement; multidisciplinary care.",
          },
        ],
      },
    ],
    complications: [
      {
        name: "Necrotizing fasciitis",
        recognize:
          "Severe pain out of proportion to exam, hard woody induration, bullae, crepitus, skin necrosis, sepsis; rapidly progressive.",
        manage:
          "Emergent surgical debridement; broad-spectrum antibiotics (pip-tazo + vanco + clinda); resuscitation; ICU.",
      },
      {
        name: "Streptococcal toxic shock syndrome",
        recognize:
          "Hypotension, multiorgan failure, soft tissue source, often GAS; rash and desquamation may follow.",
        manage:
          "IV penicillin + clindamycin (toxin suppression); IVIG for severe disease; surgical source control.",
      },
      {
        name: "Staphylococcal toxic shock syndrome",
        recognize:
          "Fever, hypotension, diffuse macular rash with desquamation, mucosal hyperemia; TSST-1-producing S. aureus.",
        manage:
          "Source control (remove tampon or drain focus); anti-staphylococcal therapy + clindamycin; supportive care.",
      },
      {
        name: "Clostridial myonecrosis (gas gangrene)",
        recognize:
          "Rapid onset after trauma or surgery; severe pain, bronze discoloration, crepitus, bullea with dishwater fluid.",
        manage:
          "Emergent surgical debridement; high-dose penicillin + clindamycin; hyperbaric oxygen considered. [VERIFY current role of hyperbaric]",
      },
      {
        name: "Osteomyelitis (from contiguous spread, esp. diabetic foot)",
        recognize:
          "Probe-to-bone positive, chronic ulcer with exposed bone, elevated inflammatory markers; MRI confirms.",
        manage:
          "Deep cultures, surgical debridement if needed, prolonged targeted antibiotics (4–6 wk) and offloading.",
      },
    ],
    prognosis: [
      { metric: "Uncomplicated cellulitis — clinical cure with appropriate therapy", value: "~90% [VERIFY]" },
      { metric: "Abscess cured by I&D alone (outpatient, uncomplicated)", value: "~90%+ [VERIFY]" },
      { metric: "Necrotizing fasciitis mortality", value: "~20–30% (higher with delay) [VERIFY]" },
      { metric: "Streptococcal toxic shock mortality", value: "~30–50% [VERIFY]" },
      { metric: "Diabetic foot osteomyelitis recurrence", value: "high without surgical and vascular optimization [VERIFY]" },
    ],
    specialPopulations: [
      {
        population: "Diabetes",
        considerations:
          "Higher risk of polymicrobial, severe, and necrotizing infection; image aggressively; consider osteomyelitis; broad empiric coverage; multidisciplinary care.",
      },
      {
        population: "People who inject drugs",
        considerations:
          "High MRSA prevalence; consider septic thrombophlebitis, bacteremia, endocarditis, and epidural abscess; screen for bloodborne viruses; engage harm reduction.",
      },
      {
        population: "Neutropenia / immunocompromise",
        considerations:
          "Broader empiric coverage including Pseudomonas and (in prolonged neutropenia) mold; early ID consultation; consider ecthyma gangrenosum.",
      },
      {
        population: "Chronic venous insufficiency / lymphedema",
        considerations:
          "Recurrent cellulitis is common; treat the portal of entry (tinea, fissures), compression for lymphedema, and consider prophylactic penicillin for frequent recurrences. [VERIFY regimen]",
      },
      {
        population: "Pregnancy",
        considerations:
          "Prefer beta-lactams (cephalexin, cefazolin); TMP-SMX avoided in 1st trimester and near term; clindamycin acceptable; avoid tetracyclines and fluoroquinolones.",
      },
      {
        population: "Burns",
        considerations:
          "Pseudomonas, MRSA, and (late) mold; topical antimicrobials and surgical debridement are primary; involve a burn center.",
      },
    ],
    prevention: [
      {
        modality: "Treat the portal of entry",
        target: "All patients with cellulitis",
        detail:
          "Look for and treat tinea pedis, fissures, eczema, ulcers, and injection sites; reduces recurrence.",
      },
      {
        modality: "Compression and elevation",
        target: "Patients with venous stasis or lymphedema",
        detail:
          "Compression stockings and limb elevation reduce edema and recurrent cellulitis; lymphedema therapy when needed.",
      },
      {
        modality: "MRSA decolonization",
        target: "Recurrent MRSA SSTI or household outbreaks",
        detail:
          "Nasal mupirocin × 5–10 days + chlorhexidine body washes; evidence is mixed and benefit temporary. [VERIFY current guideline]",
      },
      {
        modality: "Antibiotic prophylaxis",
        target: "Selected patients with very frequent recurrent cellulitis",
        detail:
          "Penicillin V or erythromycin for prophylaxis reduces recurrence in selected patients; weigh against resistance and harm.",
      },
      {
        modality: "Diabetic foot care",
        target: "Patients with diabetes",
        detail:
          "Daily foot inspection, well-fitting footwear, podiatry, glycemic control, and prompt treatment of ulcers reduce infection and amputation.",
      },
      {
        modality: "Wound care and hygiene (bites)",
        target: "Patients with bite wounds",
        detail:
          "Copious irrigation, debridement of devitalized tissue, elevate, and assess tetanus/rabies; antibiotic prophylaxis for high-risk bites.",
      },
    ],
    whenToRefer: [
      "Suspected necrotizing infection — emergent surgical consultation; do NOT delay for imaging.",
      "Diabetic foot infection with deep ulcer, suspected osteomyelitis, or rapid progression — podiatry, vascular surgery, ID.",
      "Abscess not amenable to bedside drainage (deep, large, complex) — IR or surgery.",
      "Bite wounds involving joints, tendons, or deep structures of the hand — hand surgery.",
      "Recurrent SSTI despite hygiene and decolonization — ID for evaluation.",
      "Severe sepsis or toxic shock — ICU and ID.",
      "Chronic ulcers with vascular insufficiency — vascular surgery for revascularization.",
      "Suspected mold infection in neutropenia or burn — ID and (often) infectious diseases with mold expertise.",
    ],
    followUp: [
      "Outpatient cellulitis: 48–72 h follow-up; if not improving, reconsider diagnosis, antibiotic choice, and source control.",
      "Abscess post-I&D: warm soaks and dressing changes; re-evaluate in 48 h; antibiotics only if not improving.",
      "Inpatient SSTI: oral step-down once afebrile and improving; 5–7 d total for uncomplicated cases.",
      "Diabetic foot: weekly multidisciplinary follow-up until healed; offloading, wound care, and revascularization as indicated.",
      "Bite wounds: recheck at 24–48 h for infection; check tetanus and rabies status.",
      "Recurrent SSTI: address decolonization, household contacts, and portals of entry.",
    ],
    evidence: [
      {
        title: "IDSA Guideline on the Diagnosis and Management of Skin and Soft Tissue Infections",
        source: "Stevens DL, Bisno AL, Chambers HF, et al. Clin Infect Dis. 2014;59(2):e10-e52. PMID: 24973422. DOI: 10.1093/cid/ciu444.",
        url: "https://pubmed.ncbi.nlm.nih.gov/24973422/",
        kind: "guideline",
        focus: "Older but still useful foundational US SSTI guideline: purulent vs non-purulent infection, severity, empiric therapy, necrotizing infection, bite wounds, and diabetic foot considerations.",
      },
      {
        title: "Cephalexin plus TMP-SMX vs cephalexin alone for uncomplicated cellulitis",
        source: "Brindle R, et al. (3 RCTs). [VERIFY — identify trials and citations]",
        kind: "trial",
        focus: "Adding empiric MRSA cover to a beta-lactam did not improve outcomes in non-purulent cellulitis.",
      },
      {
        title: "Trimethoprim-sulfamethoxazole vs placebo for uncomplicated abscess (I&D)",
        source: "Talan DA, et al. N Engl J Med. 2016;374:823–832 [VERIFY]",
        kind: "trial",
        focus: "TMP-SMX modestly improved outcomes after I&D in some patients (larger abscesses); I&D remains primary.",
      },
      {
        title: "Placebo vs TMP-SMX after drainage of small abscesses",
        source: "Chen AE, et al. (pediatric trial). [VERIFY]",
        kind: "trial",
        focus: "Small uncomplicated abscesses do well with I&D alone; antibiotics add little.",
      },
      {
        title: "LRINEC — Laboratory Risk Indicator for Necrotizing Fasciitis",
        source: "Wong CH, et al. Crit Care Med. 2004 [VERIFY; external validation shows lower sensitivity]",
        kind: "review",
        focus: "Bedside score to support necrotizing infection diagnosis — never overrides clinical judgment.",
      },
    ],
    pearls: [
      "Purulent vs non-purulent is the first branch point — drain the abscess, treat the cellulitis.",
      "Non-purulent cellulitis is usually streptococcal — beta-lactam first; add MRSA cover only with risk factors.",
      "Incision and drainage is the treatment for abscess — antibiotics add little for uncomplicated drained abscesses.",
      "Mark the border, elevate the limb, treat the portal of entry (tinea, fissure, ulcer).",
      "Bilateral 'cellulitis' is almost never cellulitis — look for stasis dermatitis or vascular causes.",
      "Necrotizing infection: pain out of proportion, hard induration, bullae, crepitus, sepsis — surgery now, imaging later.",
      "LRINEC supports but does not exclude necrotizing infection — clinical signs override a low score.",
      "Diabetic foot: probe-to-bone, deep cultures, MRI for osteomyelitis, broad coverage, multidisciplinary care.",
      "Dog/cat bites: amoxicillin-clavulanate (Pasteurella, anaerobes); human bites add Eikenella.",
      "Recurrent cellulitis: treat tinea, use compression for lymphedema, consider MRSA decolonization.",
    ],
    syndromeTags: ["Skin and Soft Tissue Infection", "Cellulitis", "Abscess", "Necrotizing Fasciitis", "Diabetic Foot"],
    conceptTags: [
      "Skin and soft tissue infection",
      "Cellulitis",
      "Abscess",
      "Erysipelas",
      "MRSA",
      "Necrotizing fasciitis",
      "LRINEC",
      "Diabetic foot infection",
      "Osteomyelitis",
      "Bite wounds",
      "Incision and drainage",
      "Source control",
    ],
    tools: [
      { href: "/mechid", label: "MechID", why: "Mechanisms of beta-lactams, anti-MRSA agents, and toxin-suppressive clindamycin." },
      { href: "/tools/spectrum", label: "Spectrum", why: "Confirm coverage for MRSA, streptococci, anaerobes, and Pseudomonas." },
      { href: "/tools/doseid", label: "DoseID", why: "Renal-adjusted dosing for vancomycin, TMP-SMX, and beta-lactams." },
    ],
    furtherReading: [
      {
        title: "Current Concepts in the Diagnosis and Management of Skin and Soft Tissue Infections",
        source: "[VERIFY — identify a 2023–2025 review]",
        kind: "review",
        focus: "Modern empiric therapy, MRSA coverage, short-course durations, and necrotizing infection recognition.",
      },
      {
        title: "Diabetic Foot Infection — IWGDF/IDSA Guidance",
        source: "International Working Group on the Diabetic Foot, current [VERIFY version]",
        kind: "guideline",
        focus: "Probe-to-bone, imaging, deep cultures, multidisciplinary care, and antibiotic duration for osteomyelitis.",
      },
    ],
  },
  {
    slug: "tick-borne-diseases",
    title: "Tick-borne diseases",
    category: "Vector-Borne & Zoonotic Infections",
    summary:
      "A practical approach to Lyme disease, anaplasmosis, ehrlichiosis, RMSF, and babesiosis, with emphasis on early empiric treatment and diagnostic pitfalls.",
    readMins: 28,
    difficulty: "core",
    lastReviewed: "2026-09-19",
    lastUpdated: "2026-09-19",
    atAGlance: [
      "Do not wait for confirmatory testing when RMSF, ehrlichiosis, or anaplasmosis is clinically plausible; early doxycycline saves lives.",
      "Lyme serology can be falsely negative early; erythema migrans is a clinical diagnosis.",
      "Babesiosis causes hemolytic anemia and thrombocytopenia; diagnose with smear or PCR, not Lyme serology.",
      "Geography, season, outdoor exposure, cytopenias, transaminitis, rash pattern, and hemolysis are the key bedside clues.",
      "Doxycycline is appropriate for suspected rickettsial disease in adults and children when disease is suspected.",
    ],
    objectives: [
      "Distinguish Lyme disease, anaplasmosis, ehrlichiosis, RMSF, and babesiosis by syndrome and lab pattern.",
      "Know when to treat empirically before diagnostic confirmation.",
      "Interpret Lyme serology based on timing and pretest probability.",
      "Choose initial therapy for common tick-borne syndromes.",
      "Counsel patients about post-treatment symptoms without reflexively extending antibiotics.",
    ],
    keyConcepts: [
      { heading: "Erythema migrans is a clinical diagnosis", prose: "Early localized Lyme disease classically presents with erythema migrans, often with fever, fatigue, headache, myalgias, or arthralgias. Serology is frequently negative early because antibodies have not developed. If the lesion is compatible and exposure risk is plausible, treat clinically rather than waiting for testing.", question: { pollId: "train-tick-q1", prompt: "A Connecticut resident develops an expanding annular erythematous rash 10 days after hiking. He has fatigue and headache. Lyme ELISA is negative. Best next step?", options: [{ id: "A", label: "Treat for early Lyme disease", correct: true, feedback: "Correct. Compatible erythema migrans is a clinical diagnosis; early serology may be negative." }, { id: "B", label: "Repeat ELISA daily until positive", feedback: "Incorrect. Treatment should not wait for seroconversion when erythema migrans is present." }, { id: "C", label: "Give ceftriaxone for 6 weeks", feedback: "Incorrect. Uncomplicated early localized Lyme is usually treated orally, not with prolonged IV therapy." }, { id: "D", label: "Reassure because the test excludes Lyme", feedback: "Incorrect. Negative early serology does not exclude early Lyme disease." }] } },
      { heading: "Two-tier Lyme testing is for compatible syndromes", prose: "Lyme serology performs best when the clinical syndrome and epidemiology fit. Testing patients with nonspecific chronic symptoms and low pretest probability increases false positives. Use serology for disseminated manifestations such as facial palsy, carditis, meningitis, or arthritis when compatible.", question: { pollId: "train-tick-q2", prompt: "Which patient is the best candidate for Lyme serologic testing?", options: [{ id: "A", label: "Chronic fatigue alone for 5 years in a non-endemic area", feedback: "Incorrect. Very low pretest probability makes false positives more likely." }, { id: "B", label: "Acute facial palsy in summer after tick exposure in an endemic area", correct: true, feedback: "Correct. This is a compatible disseminated Lyme syndrome with plausible exposure." }, { id: "C", label: "Asymptomatic patient with a tick crawling on clothing", feedback: "Incorrect. Testing asymptomatic patients after exposure is not useful." }, { id: "D", label: "Simple cellulitis after shaving", feedback: "Incorrect. This is not a compatible Lyme syndrome." }] } },
      { heading: "RMSF is a treat-now diagnosis", prose: "Rocky Mountain spotted fever can progress rapidly and early tests are often negative. Fever, severe headache, rash, thrombocytopenia, hyponatremia, and transaminitis should trigger empiric doxycycline when epidemiology fits. Do not withhold doxycycline from children or pregnant patients when RMSF is suspected without expert input.", question: { pollId: "train-tick-q3", prompt: "A child has fever, severe headache, thrombocytopenia, hyponatremia, and a petechial rash after camping. RMSF serology is pending. Best management?", options: [{ id: "A", label: "Start doxycycline now", correct: true, feedback: "Correct. RMSF treatment should start immediately; delayed doxycycline increases mortality." }, { id: "B", label: "Wait for paired serology", feedback: "Incorrect. Serology confirms retrospectively and should not delay therapy." }, { id: "C", label: "Use amoxicillin because doxycycline is contraindicated in children", feedback: "Incorrect. Doxycycline is recommended for suspected RMSF in children." }, { id: "D", label: "Use vancomycin monotherapy", feedback: "Incorrect. Vancomycin does not treat Rickettsia rickettsii." }] } },
      { heading: "Anaplasmosis and ehrlichiosis often look like viral sepsis with cytopenias", prose: "Anaplasmosis and ehrlichiosis commonly cause fever, headache, malaise, leukopenia, thrombocytopenia, and mild transaminitis. Rash is more common in ehrlichiosis than anaplasmosis but is not required. PCR is useful early; serology may be negative initially. Treat with doxycycline when suspected.", question: { pollId: "train-tick-q4", prompt: "A patient from New England has fever, headache, leukopenia, thrombocytopenia, and AST/ALT elevation in July. No rash. Which treatment is most appropriate while PCR is pending?", options: [{ id: "A", label: "Doxycycline", correct: true, feedback: "Correct. This pattern strongly suggests anaplasmosis/ehrlichiosis; treat empirically." }, { id: "B", label: "Oseltamivir only", feedback: "Incorrect. Influenza can cause fever, but the seasonal exposure and cytopenia/transaminitis pattern support tick-borne disease." }, { id: "C", label: "Cephalexin", feedback: "Incorrect. Cephalexin does not treat anaplasmosis or ehrlichiosis." }, { id: "D", label: "No treatment until serology turns positive", feedback: "Incorrect. Early serology may be negative; do not delay doxycycline." }] } },
      { heading: "Babesiosis is the tick-borne hemolysis syndrome", prose: "Babesia microti infection should be suspected with fever, fatigue, hemolytic anemia, thrombocytopenia, elevated bilirubin/LDH, and compatible geography. Asplenia and immunocompromise increase severity. Diagnosis is by blood smear or PCR. Treat symptomatic disease with atovaquone plus azithromycin; severe disease may require clindamycin plus quinine and exchange transfusion consideration.", question: { pollId: "train-tick-q5", prompt: "A splenectomized patient has fever after Nantucket travel, hemolytic anemia, thrombocytopenia, and intraerythrocytic parasites on smear. Best usual therapy for non-life-threatening babesiosis?", options: [{ id: "A", label: "Atovaquone plus azithromycin", correct: true, feedback: "Correct. This is standard therapy for most symptomatic babesiosis." }, { id: "B", label: "Doxycycline alone", feedback: "Incorrect. Doxycycline treats Lyme/anaplasmosis/ehrlichiosis/RMSF but not babesiosis reliably." }, { id: "C", label: "Amoxicillin", feedback: "Incorrect. Amoxicillin treats selected Lyme presentations, not babesiosis." }, { id: "D", label: "Valacyclovir", feedback: "Incorrect. Babesia is a protozoan parasite, not a herpesvirus." }] } },
      { heading: "Coinfection changes the clinical pattern", prose: "Ixodes ticks can transmit Lyme, anaplasmosis, and babesiosis. Persistent high fever, cytopenias, transaminitis, or hemolysis should prompt evaluation for coinfection rather than attributing everything to uncomplicated Lyme disease.", question: { pollId: "train-tick-q6", prompt: "A patient treated for erythema migrans has persistent high fever, leukopenia, thrombocytopenia, and transaminitis. What is the best next consideration?", options: [{ id: "A", label: "Possible anaplasma coinfection", correct: true, feedback: "Correct. Cytopenias and transaminitis with high fever suggest anaplasmosis or ehrlichiosis coinfection." }, { id: "B", label: "Expected Jarisch-Herxheimer reaction for two weeks", feedback: "Incorrect. Brief worsening can occur, but persistent cytopenic febrile illness needs reassessment." }, { id: "C", label: "Lyme serology failure means no tick-borne disease", feedback: "Incorrect. Coinfections require different tests and may not be reflected by Lyme serology." }, { id: "D", label: "Immediate chronic IV ceftriaxone", feedback: "Incorrect. This pattern suggests coinfection, not an indication for prolonged empiric IV Lyme therapy." }] } },
      { heading: "Post-treatment Lyme symptoms are not active infection by default", prose: "Some patients have fatigue, pain, or cognitive symptoms after appropriate Lyme therapy. Current guidelines do not support prolonged or repeated antibiotics in the absence of objective evidence of active infection. The clinical task is to validate symptoms, reassess for alternate diagnoses, and avoid harm from unnecessary antibiotics.", question: { pollId: "train-tick-q7", prompt: "A patient completed guideline-concordant Lyme therapy 4 months ago and has fatigue and diffuse pain but no objective arthritis, meningitis, neuropathy, or carditis. Best approach?", options: [{ id: "A", label: "Provide supportive evaluation and avoid prolonged antibiotics", correct: true, feedback: "Correct. Persistent nonspecific symptoms alone are not an indication for prolonged antibiotic therapy." }, { id: "B", label: "Place a PICC for 6 months of ceftriaxone", feedback: "Incorrect. Prolonged IV antibiotics add harm without proven benefit in this scenario." }, { id: "C", label: "Repeat Lyme serology until negative", feedback: "Incorrect. Antibodies can persist and should not be used as a test of cure." }, { id: "D", label: "Treat babesiosis without testing", feedback: "Incorrect. Babesiosis has a different syndrome and should be evaluated when clinically suggested." }] } },
      { heading: "Prophylaxis after tick bite is selective", prose: "Single-dose doxycycline prophylaxis is reserved for high-risk Ixodes bites: endemic area, tick attached long enough, prophylaxis started within 72 hours of removal, and no contraindication. Otherwise observe and educate about symptoms.", question: { pollId: "train-tick-q8", prompt: "Which exposure best fits single-dose doxycycline prophylaxis for Lyme prevention?", options: [{ id: "A", label: "Engorged Ixodes tick removed after 48 hours in an endemic area, within 72 hours", correct: true, feedback: "Correct. This meets typical high-risk criteria for prophylaxis." }, { id: "B", label: "Mosquito bite with fever", feedback: "Incorrect. Lyme prophylaxis is for selected Ixodes tick bites, not mosquito bites." }, { id: "C", label: "Tick crawling on skin with no attachment", feedback: "Incorrect. No attachment means transmission risk is negligible." }, { id: "D", label: "Tick removed 10 days ago with no symptoms", feedback: "Incorrect. Prophylaxis is time-limited and should be given within 72 hours of removal when criteria are met." }] } },
      { heading: "Testing strategy depends on timing", prose: "PCR is most useful early for anaplasmosis/ehrlichiosis and smear/PCR for babesiosis. RMSF and ehrlichial serologies often require paired acute and convalescent samples. Lyme serology becomes more sensitive after several weeks. A negative early test should not overrule a dangerous compatible syndrome.", question: { pollId: "train-tick-q9", prompt: "Which statement about tick-borne testing is most accurate?", options: [{ id: "A", label: "Early negative serology excludes RMSF", feedback: "Incorrect. Early RMSF serology is often negative." }, { id: "B", label: "Babesiosis is diagnosed with blood smear or PCR", correct: true, feedback: "Correct. Smear and PCR directly evaluate for Babesia; Lyme serology does not diagnose babesiosis." }, { id: "C", label: "Lyme antibodies always disappear after cure", feedback: "Incorrect. Antibodies can persist after treatment." }, { id: "D", label: "Anaplasmosis requires urine antigen testing", feedback: "Incorrect. PCR and serology are used; urine antigen testing is not standard." }] } },
      { heading: "Doxycycline is the empiric anchor for many severe tick-borne syndromes", prose: "When fever plus epidemiology plus cytopenias, transaminitis, severe headache, or compatible rash suggests rickettsial disease, doxycycline is the empiric anchor. Amoxicillin may be appropriate for selected Lyme disease, but it does not cover RMSF, anaplasmosis, or ehrlichiosis.", question: { pollId: "train-tick-q10", prompt: "Why is amoxicillin a poor empiric choice for undifferentiated febrile tick-borne illness with thrombocytopenia?", options: [{ id: "A", label: "It does not reliably treat RMSF, anaplasmosis, or ehrlichiosis", correct: true, feedback: "Correct. Doxycycline is needed when these syndromes are plausible." }, { id: "B", label: "It has no activity against any Lyme manifestation", feedback: "Incorrect. Amoxicillin can treat selected Lyme disease but is too narrow for this syndrome." }, { id: "C", label: "It treats Babesia better than atovaquone", feedback: "Incorrect. Amoxicillin is not babesiosis therapy." }, { id: "D", label: "It is contraindicated in all adults", feedback: "Incorrect. Amoxicillin is commonly used in adults; the issue is spectrum." }] } },
    ],
    evidence: [
      { title: "Diagnosis and management of tickborne rickettsial diseases", source: "Biggs HM, Behravesh CB, Bradley KK, et al. MMWR Recomm Rep. 2016;65(2):1-44. PMID: 27172113. DOI: 10.15585/mmwr.rr6502a1.", url: "https://pubmed.ncbi.nlm.nih.gov/27172113/", kind: "guideline", focus: "Essential guidance for RMSF, ehrlichiosis, and anaplasmosis; emphasizes empiric doxycycline without waiting for confirmation." },
      { title: "2020 Guidelines for the prevention, diagnosis, and treatment of Lyme disease", source: "Lantos PM, Rumbaugh J, Bockenstedt LK, et al. Clin Infect Dis. 2021;72(1):e1-e48. PMID: 33417672. DOI: 10.1093/cid/ciaa1215.", url: "https://pubmed.ncbi.nlm.nih.gov/33417672/", kind: "guideline", focus: "Core Lyme disease reference: erythema migrans, testing strategy, neuroborreliosis, carditis, arthritis, prophylaxis, and post-treatment symptoms." },
    ],
    pearls: ["Treat suspected RMSF now; confirm later.", "Early negative Lyme serology does not exclude erythema migrans.", "Hemolysis after tick exposure should make you think Babesia.", "Cytopenias and transaminitis are clues to anaplasmosis/ehrlichiosis."],
    syndromeTags: ["Lyme disease", "RMSF", "Anaplasmosis", "Ehrlichiosis", "Babesiosis"],
    conceptTags: ["Tick-borne disease", "Doxycycline", "Serology", "Diagnostic stewardship"],
    tools: [{ href: "/probid", label: "ProbID", why: "Use pretest probability to decide when tick-borne testing is meaningful." }],
  },
  {
    slug: "sti-syphilis-prep",
    title: "HIV PrEP, syphilis, and sexually transmitted infections",
    category: "HIV & Sexually Transmitted Infections",
    summary: "A resident-focused approach to PrEP, syphilis staging and treatment, and common STI diagnostic and management decisions.",
    readMins: 26,
    difficulty: "core",
    lastReviewed: "2026-09-19",
    lastUpdated: "2026-09-19",
    atAGlance: ["PrEP starts with confirming HIV-negative status and assessing renal function, HBV status, pregnancy potential, and STI risk.", "Syphilis treatment depends on stage; staging is often the hardest part.", "Do not diagnose neurosyphilis from serum RPR titer alone; neurologic, ocular, or otic symptoms drive evaluation.", "Test at anatomic sites of exposure for gonorrhea and chlamydia.", "Partner treatment, follow-up testing, and public health reporting are part of STI care."],
    objectives: ["Identify PrEP candidates and baseline safety testing.", "Stage syphilis and select appropriate penicillin-based therapy.", "Interpret RPR trends after treatment.", "Manage common gonorrhea, chlamydia, and trichomonas scenarios.", "Recognize when HIV guidelines or specialist input are needed."],
    keyConcepts: [
      { heading: "PrEP is prevention plus longitudinal care", prose: "PrEP is indicated for patients with ongoing risk for HIV acquisition and requires baseline HIV testing, renal assessment for tenofovir-containing regimens, HBV evaluation, STI screening, and follow-up monitoring. The iPrEx trial established proof of concept for oral TDF/FTC PrEP in MSM, with efficacy strongly linked to adherence.", question: { pollId: "train-sti-q1", prompt: "Before starting oral tenofovir/emtricitabine PrEP, which baseline step is essential?", options: [{ id: "A", label: "Confirm the patient is HIV negative", correct: true, feedback: "Correct. Starting PrEP in undiagnosed HIV can select resistance and delays full ART." }, { id: "B", label: "Wait for an AIDS-defining illness", feedback: "Incorrect. PrEP prevents HIV and is used before infection." }, { id: "C", label: "Avoid STI testing", feedback: "Incorrect. STI screening is part of PrEP care." }, { id: "D", label: "Prescribe without follow-up", feedback: "Incorrect. PrEP requires monitoring for HIV, renal safety when applicable, and STIs." }] } },
      { heading: "Acute HIV must be excluded when symptoms fit", prose: "A negative antibody-only test can miss acute HIV. If recent exposure and viral syndrome are present, use an antigen/antibody test and HIV RNA as appropriate before PrEP or when evaluating possible seroconversion.", question: { pollId: "train-sti-q2", prompt: "A patient requesting PrEP reports fever, sore throat, rash, and condomless sex 12 days ago. Rapid antibody test is negative. Best next step?", options: [{ id: "A", label: "Evaluate for acute HIV with HIV RNA/Ag-Ab testing before PrEP", correct: true, feedback: "Correct. Symptoms and timing raise concern for acute HIV; do not rely on antibody-only testing." }, { id: "B", label: "Start PrEP and ignore symptoms", feedback: "Incorrect. Acute HIV must be assessed first." }, { id: "C", label: "Give benzathine penicillin only", feedback: "Incorrect. Syphilis may be considered, but acute HIV evaluation is essential here." }, { id: "D", label: "No testing is needed if the antibody test is negative", feedback: "Incorrect. Early antibody tests can be negative in acute HIV." }] } },
      { heading: "Syphilis stage determines duration", prose: "Primary syphilis presents with chancre, secondary with rash/mucous patches/condyloma lata/systemic symptoms, and latent disease has positive serology without symptoms. Early latent is infection acquired within the prior year; late latent or unknown duration generally needs three weekly benzathine penicillin doses.", question: { pollId: "train-sti-q3", prompt: "A patient has positive treponemal test and RPR 1:64 but no symptoms. Last negative syphilis test was 4 months ago. Stage?", options: [{ id: "A", label: "Early latent syphilis", correct: true, feedback: "Correct. Asymptomatic infection acquired within the prior year is early latent syphilis." }, { id: "B", label: "Late latent syphilis", feedback: "Incorrect. A documented negative test 4 months ago supports early latent disease." }, { id: "C", label: "Primary syphilis", feedback: "Incorrect. Primary syphilis requires a chancre or compatible lesion." }, { id: "D", label: "Neurosyphilis", feedback: "Incorrect. Neurosyphilis requires neurologic/ocular/otic findings and appropriate evaluation." }] } },
      { heading: "Primary, secondary, and early latent syphilis use single-dose benzathine penicillin", prose: "For nonpregnant adults without neurosyphilis, ocular syphilis, or otosyphilis, primary, secondary, and early latent syphilis are treated with benzathine penicillin G 2.4 million units IM once. Late latent or unknown duration requires weekly dosing for three weeks.", question: { pollId: "train-sti-q4", prompt: "A nonpregnant adult has secondary syphilis with diffuse rash including palms and soles. No neurologic, ocular, or otic symptoms. Best treatment?", options: [{ id: "A", label: "Benzathine penicillin G 2.4 million units IM once", correct: true, feedback: "Correct. Secondary syphilis is treated with single-dose benzathine penicillin G." }, { id: "B", label: "Ceftriaxone for 6 weeks", feedback: "Incorrect. This is not standard treatment for uncomplicated secondary syphilis." }, { id: "C", label: "Acyclovir", feedback: "Incorrect. Syphilis is caused by Treponema pallidum, not herpesvirus." }, { id: "D", label: "No treatment until rash resolves", feedback: "Incorrect. Syphilis requires treatment and partner/public health management." }] } },
      { heading: "RPR follow-up is about fourfold change", prose: "Nontreponemal titers are used to follow response. A fourfold change equals two dilutions, such as 1:32 to 1:8. Treponemal tests often stay positive and should not be used as test of cure.", question: { pollId: "train-sti-q5", prompt: "Which RPR change represents a fourfold decline after syphilis therapy?", options: [{ id: "A", label: "1:32 to 1:8", correct: true, feedback: "Correct. Two dilution steps is a fourfold decline." }, { id: "B", label: "1:32 to 1:16", feedback: "Incorrect. That is a twofold decline." }, { id: "C", label: "Positive treponemal test to negative", feedback: "Incorrect. Treponemal tests often remain positive and are not used for response monitoring." }, { id: "D", label: "1:8 to 1:10", feedback: "Incorrect. RPR titers are reported in serial dilutions, and this is not a meaningful fourfold decline." }] } },
      { heading: "Neurosyphilis evaluation is symptom-driven", prose: "CSF evaluation is guided by neurologic findings, cranial nerve dysfunction, meningitis, stroke, altered mental status, ocular disease, or otic symptoms. High serum RPR alone is not an indication for lumbar puncture.", question: { pollId: "train-sti-q6", prompt: "Which patient most needs evaluation for neurosyphilis/ocular syphilis?", options: [{ id: "A", label: "Positive RPR with new vision loss", correct: true, feedback: "Correct. Ocular symptoms require urgent evaluation and treatment planning." }, { id: "B", label: "Asymptomatic early latent syphilis with RPR 1:64", feedback: "Incorrect. Titer alone does not mandate CSF evaluation." }, { id: "C", label: "Remote treated syphilis with stable low RPR", feedback: "Incorrect. Stable low titers without symptoms do not imply neurosyphilis." }, { id: "D", label: "Chlamydia exposure only", feedback: "Incorrect. This does not suggest neurosyphilis." }] } },
      { heading: "Gonorrhea requires ceftriaxone and exposure-site testing", prose: "Nucleic acid amplification testing should be sent from sites of exposure: urine/urethral, vaginal/cervical, rectal, and pharyngeal as indicated. Current CDC guidance uses ceftriaxone-based therapy for uncomplicated gonorrhea, with chlamydia treatment added if chlamydia has not been excluded.", question: { pollId: "train-sti-q7", prompt: "A man has receptive oral and anal sex and urethral symptoms. What testing strategy is best?", options: [{ id: "A", label: "NAAT from exposed urogenital, rectal, and pharyngeal sites", correct: true, feedback: "Correct. Test anatomic sites of exposure; urine alone can miss extragenital infection." }, { id: "B", label: "Urine culture only", feedback: "Incorrect. NAAT and exposure-site testing are preferred for GC/CT diagnosis." }, { id: "C", label: "RPR only", feedback: "Incorrect. RPR screens for syphilis, not GC/CT at exposed sites." }, { id: "D", label: "No testing if symptoms improve", feedback: "Incorrect. Diagnosis, treatment, partner care, and reporting matter." }] } },
      { heading: "Chlamydia treatment depends on site and pregnancy", prose: "Doxycycline is preferred for many nonpregnant adolescents and adults with chlamydia, especially rectal infection. Azithromycin remains important in pregnancy and selected situations. Partner management and abstinence until treatment completion are essential.", question: { pollId: "train-sti-q8", prompt: "A nonpregnant adult has rectal chlamydia. Preferred therapy?", options: [{ id: "A", label: "Doxycycline", correct: true, feedback: "Correct. Doxycycline is preferred for rectal chlamydia in nonpregnant adults." }, { id: "B", label: "Vancomycin", feedback: "Incorrect. Vancomycin has no role in chlamydia treatment." }, { id: "C", label: "Fluconazole", feedback: "Incorrect. Fluconazole treats fungal infections, not chlamydia." }, { id: "D", label: "No therapy if asymptomatic", feedback: "Incorrect. Chlamydia should be treated even when asymptomatic." }] } },
      { heading: "Trichomonas is often missed if not considered", prose: "Trichomoniasis can cause vaginal discharge, irritation, dysuria, or be asymptomatic. Metronidazole-based therapy is used, and partners should be treated to prevent reinfection.", question: { pollId: "train-sti-q9", prompt: "A woman has NAAT-confirmed trichomoniasis. What additional management point is most important?", options: [{ id: "A", label: "Treat sex partners to prevent reinfection", correct: true, feedback: "Correct. Partner treatment is essential for trichomoniasis management." }, { id: "B", label: "Use cefazolin", feedback: "Incorrect. Cefazolin does not treat Trichomonas." }, { id: "C", label: "No treatment if symptoms are mild", feedback: "Incorrect. Confirmed infection should be treated." }, { id: "D", label: "Follow RPR titers", feedback: "Incorrect. RPR monitoring is for syphilis, not trichomoniasis." }] } },
      { heading: "STI care includes prevention, vaccines, and partners", prose: "STI visits are opportunities for HIV testing, PrEP discussion, hepatitis B vaccination, HPV vaccination when eligible, pregnancy assessment, partner services, expedited partner therapy where allowed, and counseling without stigma.", question: { pollId: "train-sti-q10", prompt: "A patient is treated for gonorrhea. Which prevention step should routinely be considered at the same visit?", options: [{ id: "A", label: "HIV testing and PrEP assessment", correct: true, feedback: "Correct. Bacterial STI is a marker of HIV acquisition risk and should prompt prevention assessment." }, { id: "B", label: "Stop all vaccines", feedback: "Incorrect. Vaccination is part of sexual health prevention." }, { id: "C", label: "Avoid partner notification", feedback: "Incorrect. Partner services reduce reinfection and transmission." }, { id: "D", label: "Use treponemal tests as gonorrhea test of cure", feedback: "Incorrect. Treponemal tests are for syphilis, not gonorrhea." }] } },
    ],
    evidence: [
      { title: "Preexposure chemoprophylaxis for HIV prevention in men who have sex with men", source: "Grant RM, Lama JR, Anderson PL, et al. N Engl J Med. 2010;363(27):2587-2599. PMID: 21091279. DOI: 10.1056/NEJMoa1011205.", url: "https://pubmed.ncbi.nlm.nih.gov/21091279/", kind: "trial", focus: "Landmark iPrEx trial showing oral TDF/FTC PrEP efficacy linked strongly to adherence." },
      { title: "Sexually Transmitted Infections Treatment Guidelines, 2021", source: "CDC. MMWR Recomm Rep. 2021;70(4):1-187. PMID: 34292926. DOI: 10.15585/mmwr.rr7004a1.", url: "https://pubmed.ncbi.nlm.nih.gov/34292926/", kind: "guideline", focus: "Primary U.S. reference for syphilis, gonorrhea, chlamydia, trichomoniasis, partner management, and follow-up." },
      { title: "HIV clinical guidelines", source: "ClinicalInfo.HIV.gov, current guideline portal.", url: "https://clinicalinfo.hiv.gov/en/guidelines", kind: "guideline", focus: "Current federal HIV guidance, including prevention, testing, ART, pregnancy, and opportunistic infection resources." },
    ],
    pearls: ["Confirm HIV-negative status before PrEP.", "Stage syphilis before choosing one dose versus three weekly doses.", "RPR follows response; treponemal tests usually do not become negative.", "Test GC/CT at sites of exposure."],
    syndromeTags: ["HIV prevention", "Syphilis", "STI", "Gonorrhea", "Chlamydia"],
    conceptTags: ["PrEP", "RPR", "Partner management", "Sexual health"],
    tools: [{ href: "/training/hiv", label: "HIV module", why: "Review HIV diagnosis, ART basics, OI prevention, and U=U." }],
  },
  {
    slug: "diagnostic-stewardship",
    title: "Diagnostic stewardship",
    category: "Antimicrobial & Diagnostic Stewardship",
    summary: "How to choose, interpret, and sometimes avoid infectious diseases tests so results improve care rather than create antibiotic momentum.",
    readMins: 24,
    difficulty: "core",
    lastReviewed: "2026-09-19",
    lastUpdated: "2026-09-19",
    atAGlance: ["A test should answer a management question.", "Do not culture urine without compatible symptoms except in pregnancy or before selected urologic procedures.", "C. difficile testing requires compatible diarrhea and no better explanation.", "Superficial wound cultures often identify colonizers rather than pathogens.", "Positive tests can cause harm when pretest probability is low."],
    objectives: ["Explain how diagnostic stewardship supports antimicrobial stewardship.", "Choose when to send urine cultures, blood cultures, C. difficile tests, respiratory panels, and wound cultures.", "Interpret positive tests in the context of colonization versus infection.", "Recognize test-related cascades that lead to unnecessary antibiotics.", "Use pretest probability to decide whether testing is helpful."],
    keyConcepts: [
      { heading: "Testing should change management", prose: "Diagnostic stewardship means ordering the right test for the right patient at the right time and acting appropriately on the result. A test that will not change management can still create harm through false positives, incidental colonization, antibiotic exposure, isolation, cost, and delayed diagnosis of the real problem.", question: { pollId: "train-dxstew-q1", prompt: "Which is the best diagnostic stewardship reason not to send a test?", options: [{ id: "A", label: "The result will not change management and false positives may cause harm", correct: true, feedback: "Correct. Testing should answer a clinical question and improve decisions." }, { id: "B", label: "All tests are inaccurate", feedback: "Incorrect. Many tests are useful when applied to the right patient." }, { id: "C", label: "Cultures never guide antibiotics", feedback: "Incorrect. Cultures are essential when the syndrome warrants them." }, { id: "D", label: "Residents should avoid microbiology", feedback: "Incorrect. Residents should use microbiology thoughtfully." }] } },
      { heading: "Urine cultures are overused", prose: "Cloudy urine, foul smell, pyuria, and bacteriuria do not diagnose UTI without compatible symptoms. Asymptomatic bacteriuria should not be treated except in pregnancy and before selected invasive urologic procedures. Testing low-probability patients creates antibiotic pressure and C. difficile risk.", question: { pollId: "train-dxstew-q2", prompt: "An afebrile nursing-home resident with a chronic Foley has cloudy urine but no new symptoms. Best approach?", options: [{ id: "A", label: "Do not culture or treat solely for cloudy urine", correct: true, feedback: "Correct. This is likely colonization/asymptomatic bacteriuria." }, { id: "B", label: "Send culture and treat any growth", feedback: "Incorrect. Chronic catheters are commonly colonized; culture drives overtreatment." }, { id: "C", label: "Start vancomycin", feedback: "Incorrect. Vancomycin does not treat typical gram-negative UTI and no infection is established." }, { id: "D", label: "Treat pyuria alone", feedback: "Incorrect. Pyuria is common with catheters and does not equal infection." }] } },
      { heading: "C. difficile testing requires the right stool", prose: "Test patients with clinically significant unexplained diarrhea, usually at least three unformed stools in 24 hours, and avoid testing formed stool or laxative-associated diarrhea when another explanation is clear. NAAT detects toxigenic potential and can identify colonization; toxin testing improves specificity depending on local algorithms.", question: { pollId: "train-dxstew-q3", prompt: "Which patient is the best candidate for C. difficile testing?", options: [{ id: "A", label: "Four watery stools in 24 hours after antibiotics with no laxatives", correct: true, feedback: "Correct. This is compatible with CDI testing criteria." }, { id: "B", label: "One formed stool daily", feedback: "Incorrect. Formed stool should not be tested." }, { id: "C", label: "Diarrhea immediately after bowel prep", feedback: "Incorrect. Laxative/bowel prep explains diarrhea; testing risks false attribution." }, { id: "D", label: "Test of cure after symptoms resolve", feedback: "Incorrect. Test of cure is not recommended." }] } },
      { heading: "Blood cultures should match bacteremia risk", prose: "Blood cultures are high value in sepsis, endocarditis concern, meningitis, vertebral osteomyelitis, severe pneumonia, complicated pyelonephritis, immunocompromise, intravascular catheter infection, or before antibiotics in serious infection. They are low yield in uncomplicated cellulitis or cystitis.", question: { pollId: "train-dxstew-q4", prompt: "Which scenario most clearly warrants blood cultures before antibiotics?", options: [{ id: "A", label: "Suspected infective endocarditis with fever and new murmur", correct: true, feedback: "Correct. Multiple blood cultures are central to endocarditis diagnosis." }, { id: "B", label: "Mild uncomplicated cystitis", feedback: "Incorrect. Blood cultures are low yield and not routine." }, { id: "C", label: "Small uncomplicated abscess already drained", feedback: "Incorrect. Blood cultures are not routine for uncomplicated abscess." }, { id: "D", label: "Tinea pedis", feedback: "Incorrect. This does not suggest bacteremia." }] } },
      { heading: "Respiratory panels require actionability", prose: "Respiratory viral panels can support isolation, antiviral decisions, antibiotic de-escalation, and outbreak control, but broad testing in low-risk patients may not change care. A positive viral test also does not fully exclude bacterial coinfection when the clinical syndrome suggests it.", question: { pollId: "train-dxstew-q5", prompt: "A broad respiratory PCR is most useful when the result will affect isolation, antivirals, antibiotics, or disposition. Which case best fits?", options: [{ id: "A", label: "Immunocompromised patient admitted with pneumonia during respiratory virus season", correct: true, feedback: "Correct. Results can affect treatment, isolation, and antibiotic decisions." }, { id: "B", label: "Healthy adult with 1 day of mild rhinorrhea who will not change behavior", feedback: "Incorrect. Testing is less useful if it changes nothing." }, { id: "C", label: "Asymptomatic pre-employment screen", feedback: "Incorrect. This is not an ID diagnostic indication." }, { id: "D", label: "Chronic cough for 5 years without acute illness", feedback: "Incorrect. Broad acute viral testing is unlikely to help." }] } },
      { heading: "Superficial wound swabs mislead", prose: "Open wounds are colonized. Superficial swabs often recover colonizers and can drive unnecessary broad antibiotics. When culture is needed, obtain deep tissue or operative specimens after cleaning/debridement, especially for diabetic foot infection or deep surgical infection.", question: { pollId: "train-dxstew-q6", prompt: "A chronic diabetic foot ulcer without systemic signs is superficially swabbed and grows MRSA, Enterococcus, and Pseudomonas. What is the main interpretation problem?", options: [{ id: "A", label: "Superficial swabs often reflect colonization rather than invasive pathogens", correct: true, feedback: "Correct. Deep tissue cultures are preferred when infection requires microbiology." }, { id: "B", label: "All organisms on swab must be treated for 6 weeks", feedback: "Incorrect. This is how swabs lead to overtreatment." }, { id: "C", label: "Pseudomonas always means osteomyelitis", feedback: "Incorrect. Pseudomonas on a superficial swab may be colonization." }, { id: "D", label: "Cultures are never useful in diabetic foot infection", feedback: "Incorrect. Proper deep cultures are useful when infection is present." }] } },
      { heading: "Positive molecular tests can represent colonization", prose: "Highly sensitive NAATs can detect colonization, prolonged shedding, or nonviable organisms. Interpret results in context. Examples include C. difficile NAAT in colonized patients, respiratory viral PCR after recent infection, and multiplex wound panels from nonsterile sites.", question: { pollId: "train-dxstew-q7", prompt: "A hospitalized patient on laxatives has formed stool sent for C. difficile NAAT, which is positive. What is the best interpretation?", options: [{ id: "A", label: "Possible colonization or inappropriate testing; do not diagnose CDI from this alone", correct: true, feedback: "Correct. Testing formed/laxative-associated stool can identify colonization rather than disease." }, { id: "B", label: "Fulminant CDI is proven", feedback: "Incorrect. Clinical syndrome is not compatible." }, { id: "C", label: "Test everyone on the ward", feedback: "Incorrect. Screening asymptomatic patients is not standard CDI diagnosis." }, { id: "D", label: "Use NAAT as test of cure", feedback: "Incorrect. NAAT may remain positive and is not a test of cure." }] } },
      { heading: "Pretest probability controls false positives", prose: "Even a good test performs poorly when used in patients with very low pretest probability. Low-value testing creates false positives that trigger antibiotic cascades. This principle is especially important for Lyme testing, urine cultures, fungal biomarkers, and broad multiplex panels.", question: { pollId: "train-dxstew-q8", prompt: "Why is Lyme serology discouraged for chronic nonspecific fatigue in a non-endemic area without exposure risk?", options: [{ id: "A", label: "Low pretest probability makes false positives more likely than true positives", correct: true, feedback: "Correct. Testing low-probability syndromes can mislabel patients and cause harm." }, { id: "B", label: "Lyme serology is never useful", feedback: "Incorrect. It is useful for compatible syndromes with plausible exposure." }, { id: "C", label: "Antibiotics are harmless", feedback: "Incorrect. Unnecessary antibiotics cause adverse effects and resistance." }, { id: "D", label: "Fatigue always means Lyme", feedback: "Incorrect. Nonspecific symptoms alone are not enough." }] } },
      { heading: "Diagnostic stewardship includes stopping tests", prose: "Duplicate daily blood cultures, repeated C. difficile tests, repeated urine cultures after clinical improvement, and broad serologic panels can create noise. Stop testing once the clinical question is answered unless the result will change management.", question: { pollId: "train-dxstew-q9", prompt: "A patient with E. coli pyelonephritis improves rapidly on active therapy. Repeat urine culture is ordered to prove cure. Best response?", options: [{ id: "A", label: "Avoid routine test-of-cure culture if symptoms resolve", correct: true, feedback: "Correct. Routine repeat cultures are unnecessary in uncomplicated clinical response." }, { id: "B", label: "Repeat cultures daily until sterile", feedback: "Incorrect. This creates noise and unnecessary treatment." }, { id: "C", label: "Broaden antibiotics despite improvement", feedback: "Incorrect. Improvement supports narrowing, not broadening." }, { id: "D", label: "Add antifungal therapy", feedback: "Incorrect. No fungal syndrome is described." }] } },
      { heading: "Good stewardship is collaborative", prose: "The best diagnostic stewardship uses clinicians, microbiology labs, pharmacists, infection prevention, and IT. Examples include urine culture reflex criteria, C. difficile testing algorithms, blood culture contamination reduction, antibiogram education, and comments that help clinicians interpret results.", question: { pollId: "train-dxstew-q10", prompt: "Which intervention best represents diagnostic stewardship at the system level?", options: [{ id: "A", label: "A urine culture reflex policy requiring pyuria plus symptoms documentation in selected settings", correct: true, feedback: "Correct. Reflex criteria can reduce low-value urine cultures and overtreatment." }, { id: "B", label: "Encouraging cultures on all admitted patients", feedback: "Incorrect. Universal low-value testing increases false positives." }, { id: "C", label: "Suppressing all microbiology results", feedback: "Incorrect. Useful results should be available and interpreted well." }, { id: "D", label: "Treating every colonizer to simplify decisions", feedback: "Incorrect. Treating colonization is a major harm diagnostic stewardship tries to prevent." }] } },
    ],
    evidence: [
      { title: "Diagnostic stewardship: leveraging the laboratory to improve antimicrobial use", source: "Morgan DJ, Malani P, Diekema DJ. JAMA. 2017;318(7):607-608. PMID: 28719668. DOI: 10.1001/jama.2017.8531.", url: "https://pubmed.ncbi.nlm.nih.gov/28719668/", kind: "review", focus: "Concise foundational article connecting diagnostic ordering, lab systems, and antimicrobial use." },
      { title: "IDSA Asymptomatic Bacteriuria Guideline", source: "Infectious Diseases Society of America, 2019.", url: "https://www.idsociety.org/practice-guideline/asymptomatic-bacteriuria/", kind: "guideline", focus: "Essential reference for when not to culture or treat bacteriuria." },
    ],
    pearls: ["A positive culture from the wrong patient is not helpful information.", "Do not let a test substitute for a syndrome.", "Colonization is common in urine, wounds, airways, and stool.", "The best test may be no test when pretest probability is low."],
    syndromeTags: ["Diagnostic stewardship", "Asymptomatic bacteriuria", "C. difficile", "Blood cultures"],
    conceptTags: ["Pretest probability", "Colonization", "Microbiology", "Stewardship"],
    tools: [{ href: "/probid", label: "ProbID", why: "Practice pretest probability and threshold-based diagnostic reasoning." }],
  },
  {
    slug: "basic-microbiology",
    title: "Basic microbiology for ID consults",
    category: "Basic Microbiology",
    summary:
      "A practical bridge between organism taxonomy and bedside interpretation: specimen quality, Gram stain patterns, culture results, colonization, blood cultures, and susceptibility reports.",
    readMins: 26,
    difficulty: "core",
    lastReviewed: "2026-09-19",
    lastUpdated: "2026-09-19",
    atAGlance: [
      "Microbiology starts with the specimen: a poor specimen can produce a precise but clinically misleading result.",
      "Gram stain gives early taxonomy: gram reaction, shape, arrangement, and sometimes urgency.",
      "Organism identity predicts likely source, virulence, resistance risk, and whether a result can be dismissed.",
      "Colonization is common in urine, sputum, wounds, stool, skin, nares, and devices; treat the syndrome, not the isolate alone.",
      "Blood culture interpretation depends on organism, number of positive sets, time to positivity, host, and hardware.",
      "Susceptibility reports guide therapy but do not replace infection-site, source-control, and intrinsic-resistance reasoning.",
    ],
    objectives: [
      "Interpret common Gram stain patterns and connect them to organism groups.",
      "Recognize when specimen quality limits culture interpretation.",
      "Distinguish infection, colonization, and contamination in common ID consult scenarios.",
      "Use basic bacterial taxonomy to predict source, syndrome, and empiric therapy implications.",
      "Interpret blood culture results using organism identity and clinical context.",
      "Explain MIC, S/I/R, breakpoints, and why susceptibility must be interpreted by syndrome.",
      "Know when routine culture is insufficient and when to call the microbiology laboratory.",
    ],
    keyConcepts: [
      {
        heading: "Microbiology starts with the specimen",
        prose:
          "Before interpreting an organism, ask where the specimen came from, how it was collected, and whether it represents the infected site. Expectorated sputum with many squamous epithelial cells, urine from a catheter bag, and superficial swabs of chronic wounds can all produce believable reports that mostly describe contamination or colonization. Good ID reasoning starts before the culture grows.",
        bullets: [
          "Blood: obtain separate venipuncture sets when bacteremia is suspected.",
          "Sputum: assess epithelial cells and neutrophils; poor-quality sputum is often oral contamination.",
          "Wounds: deep tissue or operative specimens usually beat superficial swabs.",
          "Urine: collect from a fresh catheter or clean catch when clinically indicated; do not culture catheter bags.",
        ],
        question: {
          pollId: "train-micro-specimen-q1",
          prompt:
            "A sputum culture from a patient with mild cough reports 'mixed respiratory flora.' The Gram stain shows many squamous epithelial cells and few neutrophils. Best interpretation?",
          options: [
            { id: "A", label: "Poor-quality specimen with oropharyngeal contamination", correct: true, feedback: "Correct. Many squamous epithelial cells and few neutrophils suggest saliva/oral contamination rather than a lower-respiratory specimen." },
            { id: "B", label: "Definitive diagnosis of polymicrobial pneumonia", feedback: "Incorrect. Mixed flora in poor-quality sputum should not be treated as definitive pneumonia microbiology." },
            { id: "C", label: "Proof that anaerobic pneumonia is present", feedback: "Incorrect. This specimen does not establish anaerobic pneumonia." },
            { id: "D", label: "A reason to start vancomycin for all patients", feedback: "Incorrect. The result is not evidence of MRSA or another invasive pathogen." },
          ],
        },
      },
      {
        heading: "Gram stain is the first taxonomy tool",
        prose:
          "The Gram stain is not just a preliminary lab result; it is the first taxonomy framework. Gram-positive cocci in clusters suggest Staphylococcus; gram-positive cocci in chains or pairs suggest Streptococcus or Enterococcus; gram-negative rods suggest Enterobacterales, Pseudomonas, or other gram-negative bacilli; yeast suggests Candida or other fungi depending on source. Shape and arrangement should immediately narrow empiric thinking.",
        question: {
          pollId: "train-micro-gram-q1",
          prompt:
            "Two blood culture bottles flag positive with gram-positive cocci in clusters. Which organism group is most likely?",
          options: [
            { id: "A", label: "Staphylococcus species", correct: true, feedback: "Correct. Gram-positive cocci in clusters classically suggest Staphylococcus." },
            { id: "B", label: "Enterobacterales", feedback: "Incorrect. Enterobacterales are gram-negative rods." },
            { id: "C", label: "Mycobacteria", feedback: "Incorrect. Mycobacteria are acid-fast organisms and are not described this way on routine Gram stain." },
            { id: "D", label: "Molds", feedback: "Incorrect. Molds are fungi with hyphal forms, not gram-positive cocci in clusters." },
          ],
        },
      },
      {
        heading: "Gram-positive cocci: Staph, Strep, Enterococcus",
        prose:
          "Staphylococci tend to form clusters and live on skin; S. aureus is virulent and should not be dismissed in blood. Coagulase-negative staphylococci can be contaminants but become real pathogens with prosthetic valves, central lines, and other hardware. Streptococci often form chains or pairs and point toward pneumonia, cellulitis, endocarditis, or oral/GI sources depending on species. Enterococcus often points toward GU, GI, biliary, intra-abdominal, or healthcare-associated disease and is intrinsically resistant to cephalosporins.",
        question: {
          pollId: "train-micro-gpc-q1",
          prompt:
            "A blood culture grows Staphylococcus aureus. The patient is afebrile the next day and feels better. What is the safest interpretation?",
          options: [
            { id: "A", label: "Treat as clinically significant bacteremia until proven otherwise", correct: true, feedback: "Correct. S. aureus in blood is rarely a contaminant and requires repeat cultures, source evaluation, and appropriate therapy." },
            { id: "B", label: "Dismiss as skin contamination", feedback: "Incorrect. Unlike many coagulase-negative staphylococci, S. aureus bacteremia should not be dismissed." },
            { id: "C", label: "No follow-up cultures are needed", feedback: "Incorrect. Follow-up blood cultures are essential in S. aureus bacteremia." },
            { id: "D", label: "Treat with oral nitrofurantoin", feedback: "Incorrect. Nitrofurantoin is a bladder antibiotic and does not treat S. aureus bacteremia." },
          ],
        },
      },
      {
        heading: "Gram-negative rods: Enterobacterales, Pseudomonas, and non-fermenters",
        prose:
          "Gram-negative rods are not one group clinically. Enterobacterales such as E. coli, Klebsiella, Proteus, Enterobacter, Citrobacter, and Serratia commonly come from urinary, biliary, intra-abdominal, and bloodstream sources. Pseudomonas suggests structural lung disease, healthcare exposure, water exposure, burns, neutropenia, devices, or prior antibiotics. Other non-fermenters such as Stenotrophomonas and Acinetobacter are often healthcare-associated and resistant; organism identity matters before choosing therapy.",
        question: {
          pollId: "train-micro-gnr-q1",
          prompt:
            "A patient with bronchiectasis and multiple prior antibiotic courses has pneumonia with gram-negative rods on sputum Gram stain. Which pathogen deserves specific empiric consideration?",
          options: [
            { id: "A", label: "Pseudomonas aeruginosa", correct: true, feedback: "Correct. Structural lung disease and repeated antibiotics increase Pseudomonas risk." },
            { id: "B", label: "Treponema pallidum", feedback: "Incorrect. Syphilis is not a gram-negative rod pneumonia pathogen." },
            { id: "C", label: "Candida albicans", feedback: "Incorrect. Candida in respiratory specimens usually reflects colonization and is not a gram-negative rod." },
            { id: "D", label: "Enterobius vermicularis", feedback: "Incorrect. Pinworm does not cause this pneumonia pattern." },
          ],
        },
      },
      {
        heading: "Anaerobes and polymicrobial infection follow anatomy",
        prose:
          "Anaerobes live where oxygen tension is low and mucosal surfaces are dense: mouth, GI tract, pelvis, necrotic tissue, devitalized wounds, and abscesses. Anaerobic infection is usually suggested by anatomy and syndrome rather than by a routine swab. Proper anaerobic culture requires correct collection and transport; superficial swabs exposed to air are usually poor anaerobic specimens.",
        question: {
          pollId: "train-micro-anaerobe-q1",
          prompt:
            "Which scenario most strongly suggests anaerobic and polymicrobial infection?",
          options: [
            { id: "A", label: "Perforated diverticulitis with intra-abdominal abscess", correct: true, feedback: "Correct. Bowel perforation with abscess is a classic polymicrobial infection requiring gram-negative, anaerobic coverage, and source control." },
            { id: "B", label: "Uncomplicated cystitis in a young woman", feedback: "Incorrect. Routine cystitis is not an anaerobic syndrome." },
            { id: "C", label: "Primary varicella", feedback: "Incorrect. Varicella is viral, not anaerobic bacterial infection." },
            { id: "D", label: "Asymptomatic nasal MRSA colonization", feedback: "Incorrect. Colonization alone is not anaerobic infection." },
          ],
        },
      },
      {
        heading: "Atypical and intracellular organisms explain beta-lactam failure",
        prose:
          "Some organisms are not well treated by beta-lactams because they lack a conventional cell wall target, are intracellular, or require special testing. Mycoplasma lacks a cell wall; Legionella is intracellular and requires macrolide or fluoroquinolone activity; Chlamydia species and rickettsial organisms are intracellular and often require doxycycline or other non-beta-lactam therapy. When pneumonia or systemic illness does not fit routine extracellular bacteria, taxonomy changes therapy.",
        question: {
          pollId: "train-micro-atypical-q1",
          prompt:
            "A patient with severe pneumonia, diarrhea, hyponatremia, and recent hotel water exposure is not improving on ceftriaxone alone. Which microbiologic principle explains the concern?",
          options: [
            { id: "A", label: "Legionella is intracellular and requires therapy with intracellular activity", correct: true, feedback: "Correct. Legionella is not reliably treated with beta-lactam monotherapy; azithromycin or a respiratory fluoroquinolone is used." },
            { id: "B", label: "Legionella is always a strict anaerobe", feedback: "Incorrect. The issue is intracellular biology and diagnostic limitations, not strict anaerobiosis." },
            { id: "C", label: "Ceftriaxone cannot treat any pneumonia", feedback: "Incorrect. Ceftriaxone treats many typical bacterial pneumonias but not Legionella." },
            { id: "D", label: "Hyponatremia proves fungal pneumonia", feedback: "Incorrect. Hyponatremia is a clue but not proof; Legionella fits this syndrome." },
          ],
        },
      },
      {
        heading: "Fungi, mycobacteria, parasites, and viruses need different tests",
        prose:
          "Routine bacterial culture is not enough for every organism. Mycobacteria require AFB smear and prolonged culture or molecular tests. Fungi may require fungal culture, histopathology, antigen testing, serology, or PCR depending on syndrome. Parasites may require smear, ova and parasite exam, serology, antigen, or PCR. Viruses are usually diagnosed with nucleic acid amplification, antigen tests, serology, or tissue pathology depending on timing and disease site.",
        question: {
          pollId: "train-micro-specialtests-q1",
          prompt:
            "A patient has chronic cough, weight loss, cavitary upper-lobe disease, and TB risk factors. Routine bacterial sputum culture is pending. What additional microbiology is most important?",
          options: [
            { id: "A", label: "AFB smear/culture and rapid molecular testing for Mycobacterium tuberculosis", correct: true, feedback: "Correct. Suspected pulmonary TB requires AFB testing and molecular testing, not routine bacterial culture alone." },
            { id: "B", label: "Urine culture only", feedback: "Incorrect. Urine culture does not evaluate pulmonary TB." },
            { id: "C", label: "Nasal MRSA PCR as the only test", feedback: "Incorrect. MRSA PCR does not diagnose TB." },
            { id: "D", label: "No testing because chronic symptoms exclude infection", feedback: "Incorrect. Chronic symptoms can be infectious, including TB and endemic fungi." },
          ],
        },
      },
      {
        heading: "Colonization is not infection",
        prose:
          "Many body sites are colonized. Candida in sputum, bacteria in chronic catheters, mixed flora in superficial wounds, positive nares MRSA PCR, and toxigenic C. difficile carriage can all mislead clinicians when the syndrome is absent. The clinical question is not 'what grew?' but 'does this organism explain this patient's syndrome from this specimen?'",
        question: {
          pollId: "train-micro-colonization-q1",
          prompt:
            "An intubated patient has Candida albicans reported from tracheal aspirate but no evidence of invasive fungal disease. Best interpretation?",
          options: [
            { id: "A", label: "Candida airway colonization is most likely", correct: true, feedback: "Correct. Candida in respiratory specimens almost always represents colonization rather than Candida pneumonia." },
            { id: "B", label: "Start amphotericin for all Candida in sputum", feedback: "Incorrect. Treating colonization causes harm and is not indicated." },
            { id: "C", label: "Candida is a common cause of lobar pneumonia in immunocompetent hosts", feedback: "Incorrect. Candida pneumonia is rare and usually requires tissue evidence." },
            { id: "D", label: "The result proves bloodstream candidemia", feedback: "Incorrect. Respiratory isolation does not prove candidemia." },
          ],
        },
      },
      {
        heading: "Blood cultures: contaminant or true bacteremia?",
        prose:
          "Blood culture interpretation combines organism identity, number of positive sets, time to positivity, host factors, and hardware. S. aureus, Enterobacterales, Pseudomonas, Candida, and beta-hemolytic streptococci in blood are usually significant. Coagulase-negative staphylococci, Corynebacterium, Bacillus other than anthracis, and Cutibacterium can be contaminants, but not always, especially with prosthetic material or multiple positive sets.",
        question: {
          pollId: "train-micro-bloodculture-q1",
          prompt:
            "A patient with a prosthetic valve has two separate blood culture sets positive for Staphylococcus epidermidis. Best interpretation?",
          options: [
            { id: "A", label: "Possible true bacteremia/endocarditis; do not dismiss as contaminant", correct: true, feedback: "Correct. Multiple positive sets plus prosthetic material makes coagulase-negative staphylococci clinically significant until evaluated." },
            { id: "B", label: "Always contamination regardless of context", feedback: "Incorrect. Coagulase-negative staphylococci can cause prosthetic valve and device infection." },
            { id: "C", label: "Treat with nitrofurantoin", feedback: "Incorrect. Nitrofurantoin is not a bacteremia or endocarditis drug." },
            { id: "D", label: "No repeat cultures or echocardiography should be considered", feedback: "Incorrect. This context requires a careful bacteremia/endocarditis evaluation." },
          ],
        },
      },
      {
        heading: "Susceptibility testing is a clinical tool, not an autopilot",
        prose:
          "MICs are interpreted against breakpoints to produce susceptible, intermediate or susceptible-dose dependent, and resistant categories. These categories assume specific dosing, organism, drug, and infection-site assumptions. A reported susceptible result can still be clinically wrong if the drug does not reach the site, if source control is absent, if the organism has intrinsic resistance concerns, or if the syndrome requires bactericidal/high-exposure therapy.",
        question: {
          pollId: "train-micro-susceptibility-q1",
          prompt:
            "A urine isolate causing simple cystitis is susceptible to nitrofurantoin. The same patient also has E. coli bacteremia from pyelonephritis. Why is nitrofurantoin not appropriate definitive therapy for the bacteremia?",
          options: [
            { id: "A", label: "It concentrates in urine but does not achieve adequate renal tissue or bloodstream levels", correct: true, feedback: "Correct. Susceptibility must be interpreted by syndrome and site; nitrofurantoin is for bladder infection, not pyelonephritis or bacteremia." },
            { id: "B", label: "Nitrofurantoin has no urinary activity", feedback: "Incorrect. Nitrofurantoin is useful for bladder-limited cystitis." },
            { id: "C", label: "All susceptible drugs are interchangeable", feedback: "Incorrect. Site of infection, exposure, and syndrome matter." },
            { id: "D", label: "E. coli cannot cause pyelonephritis", feedback: "Incorrect. E. coli is the most common pyelonephritis pathogen." },
          ],
        },
      },
    ],
    evidence: [
      {
        title: "ASM Clinical Microbiology Portal",
        source: "American Society for Microbiology educational and clinical microbiology resources.",
        url: "https://asm.org/clinical-microbiology",
        kind: "book",
        focus: "Practical reference hub for specimen collection, organism identification, diagnostic methods, and clinical microbiology interpretation.",
      },
      {
        title: "CLSI AST News Update and breakpoint resources",
        source: "Clinical and Laboratory Standards Institute antimicrobial susceptibility testing resources.",
        url: "https://clsi.org/standards/products/microbiology/",
        kind: "guideline",
        focus: "Reference for susceptibility testing concepts, breakpoints, MIC interpretation, and reporting categories.",
      },
      {
        title: "A Guide to Utilization of the Microbiology Laboratory for Diagnosis of Infectious Diseases",
        source: "Miller JM, Binnicker MJ, Campbell S, et al. Clin Infect Dis. 2018;67(6):e1-e94. PMID: 29955859. DOI: 10.1093/cid/ciy381.",
        url: "https://pubmed.ncbi.nlm.nih.gov/29955859/",
        kind: "guideline",
        focus: "Comprehensive IDSA/ASM guidance on specimen selection, collection, transport, and diagnostic test use by syndrome.",
      },
    ],
    pearls: [
      "The organism is only as useful as the specimen that produced it.",
      "S. aureus in blood is clinically significant until proven otherwise.",
      "Coagulase-negative staphylococci are context-dependent: contaminant in one patient, prosthetic infection in another.",
      "Candida in sputum is usually colonization, not pneumonia.",
      "Susceptible does not mean appropriate for every site of infection.",
      "When the result does not fit the syndrome, call the microbiology lab before broadening antibiotics.",
    ],
    syndromeTags: ["Microbiology", "Bacteremia", "Colonization", "Specimen quality"],
    conceptTags: ["Gram stain", "Taxonomy", "MIC", "Susceptibility", "Blood cultures", "Biofilm"],
    tools: [
      { href: "/mechid", label: "MechID", why: "Connect organism identity and resistance mechanisms to antibiotic decisions." },
      { href: "/training/diagnostic-stewardship", label: "Diagnostic stewardship module", why: "Apply microbiology interpretation to smarter test ordering." },
      { href: "/training/antibiotic-mechanisms-resistance", label: "Antibiotic mechanisms module", why: "Link taxonomy and susceptibility results to antimicrobial mechanism." },
    ],
  },
];

export function getCurriculumModule(slug: string): CurriculumModule | undefined {
  return CURRICULUM_MODULES.find((m) => m.slug === slug);
}

export function getOrderedCurriculumModules(): CurriculumModule[] {
  return [...CURRICULUM_MODULES].sort((a, b) => {
    const aCategory = CURRICULUM_CATEGORIES.indexOf(
      a.category as (typeof CURRICULUM_CATEGORIES)[number],
    );
    const bCategory = CURRICULUM_CATEGORIES.indexOf(
      b.category as (typeof CURRICULUM_CATEGORIES)[number],
    );
    const categoryDelta = aCategory - bCategory;
    if (categoryDelta !== 0) return categoryDelta;
    return CURRICULUM_MODULES.indexOf(a) - CURRICULUM_MODULES.indexOf(b);
  });
}

export function getCurriculumModuleNeighbors(
  slug: string,
): { prev?: CurriculumModule; next?: CurriculumModule } {
  const orderedModules = getOrderedCurriculumModules();
  const index = orderedModules.findIndex((m) => m.slug === slug);
  if (index === -1) return {};
  return {
    prev: orderedModules[index - 1],
    next: orderedModules[index + 1],
  };
}
