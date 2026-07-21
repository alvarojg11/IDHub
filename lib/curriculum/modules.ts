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
  "Respiratory & mycobacterial",
  "Cardiovascular",
  "Skin, soft tissue & MSK",
  "Gastrointestinal",
  "Genitourinary & STI",
  "Vector-borne",
  "Bloodborne & viral",
  "Opportunistic & fungal",
  "Parasitology",
  "Stewardship",
] as const;

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    slug: "community-acquired-pneumonia",
    title: "Community-acquired pneumonia",
    category: "Respiratory & mycobacterial",
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
    slug: "infective-endocarditis",
    title: "Infective endocarditis",
    category: "Cardiovascular",
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
    category: "Stewardship",
    summary:
      "Stewardship is choosing the right drug, dose, route, and duration — and knowing when not to treat at all. It improves outcomes, limits resistance, reduces C. difficile, and is a core competency for every Internal Medicine resident.",
    readMins: 12,
    difficulty: "core",
    lastReviewed: "2026-07-21",
    lastUpdated: "2026-07-21",
    atAGlance: [
      "The four pillars: right drug, right dose, right route, right duration.",
      "De-escalate empiric broad therapy to the narrowest effective agent within 48–72 hours based on cultures.",
      "Run an 'antibiotic timeout' at 48–72 hours: still needed? narrower? shorter?",
      "Do not treat asymptomatic bacteriuria (except pregnancy and before urologic procedures).",
      "Shorter is better: most common infections are treatable in ≤7 days; use the shortest effective duration.",
      "Beta-lactams are time-dependent; aminoglycosides, fluoroquinolones, and daptomycin are concentration-dependent.",
    ],
    objectives: [
      "Define antimicrobial stewardship and its goals (outcomes, resistance, C. difficile, cost).",
      "Apply de-escalation and the antibiotic timeout in everyday practice.",
      "Choose empiric therapy using the antibiogram and patient risk.",
      "Recognize when antibiotics are not indicated.",
      "Apply key PK/PD principles including beta-lactam optimization.",
      "Identify the major antibiotic-associated adverse effects.",
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
          "For decades, courses were long by tradition. Modern trials have repeatedly shown that shorter durations are as effective for many common infections and carry less risk of resistance and C. difficile. When a patient is improving and source control is adequate, default to the shortest evidence-based duration.",
        bullets: [
          "Uncomplicated cystitis: 3–5 days (nitrofurantoin 5 days, TMP-SMX 3 days).",
          "Pyelonephritis: 5–7 days (fluoroquinolone) or 7–14 days (beta-lactam).",
          "Community-acquired pneumonia (responding): 5 days minimum if afebrile 48 hours and stable.",
          "Cellulitis (non-purulent): 5–6 days.",
          "Uncomplicated gram-negative bacteremia: 7 days from first negative culture (short-course trials support this).",
          "Intra-abdominal infection (source controlled): 4 days post-source-control.",
        ],
      },
      {
        heading: "PK/PD: time- vs concentration-dependent",
        prose:
          "Pharmacokinetic/pharmacodynamic (PK/PD) principles describe how a drug's exposure relates to its effect, and they guide dosing and optimization. Beta-lactams kill based on the time concentrations exceed the organism's MIC; aminoglycosides, fluoroquinolones, and daptomycin kill based on peak exposure (Cmax/MIC or AUC/MIC).",
        bullets: [
          "Beta-lactams: maximize time above MIC — consider extended or continuous infusions for severe infection.",
          "Aminoglycosides: high once-daily dosing exploits concentration-dependent killing and a post-antibiotic effect.",
          "Vancomycin: AUC-based monitoring (target AUC 400–600) for MRSA — trough-based dosing is no longer recommended.",
          "Daptomycin: concentration-dependent; dosing escalates with weight and indication.",
        ],
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
            regimen: "Nitrofurantoin 5 days, or TMP-SMX 3 days, or a single dose of fosfomycin",
            duration: "3–5 days",
          },
          {
            scenario: "Acute uncomplicated pyelonephritis",
            regimen: "Fluoroquinolone or TMP-SMX (if susceptible); beta-lactam alternative",
            duration: "5–7 days (FQ) or 7–14 days (beta-lactam)",
          },
          {
            scenario: "Community-acquired pneumonia (responding)",
            regimen: "Standard empiric regimen",
            duration: "≥5 days, if afebrile 48 h and clinically stable",
          },
          {
            scenario: "Non-purulent cellulitis",
            regimen: "Beta-lactam active against streptococci (e.g., cephalexin)",
            duration: "5–6 days",
          },
          {
            scenario: "Uncomplicated gram-negative bacteremia",
            hostFactors: "Source identified and controlled; prompt response",
            regimen: "Directed by susceptibility",
            duration: "~7 days from first negative culture",
            note: "Short-course trials (e.g., PITT/BACTREM) support non-inferiority to 14 days.",
          },
          {
            scenario: "Intra-abdominal infection",
            hostFactors: "Adequate source control",
            regimen: "Directed by cultures",
            duration: "4 days post-source-control",
          },
        ],
      },
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
    ],
    pearls: [
      "Treat the patient, not the culture — asymptomatic bacteriuria and colonization are not infections.",
      "Stop double anaerobic and double MRSA coverage when cultures return.",
      "Vancomycin troughs are out; AUC-based monitoring (target AUC 400–600) is in.",
      "Fluoroquinolones carry QT, tendinopathy, dysglycemia, CNS, and aortic warnings — reserve for clear indications.",
      "Daptomycin is inactivated by surfactant — never use it for pneumonia.",
      "Check a creatine kinase if daptomycin is prolonged (myopathy).",
      "Linezolid beyond two weeks → watch thrombocytopenia, neuropathy, and serotonin syndrome.",
      "Run an antibiotic timeout at 48–72 hours on every antibiotic you start.",
    ],
    syndromeTags: ["Antimicrobial Adverse Effects", "Drug Toxicity"],
    conceptTags: [
      "Stewardship",
      "De-escalation",
      "Antibiotic timeout",
      "PK/PD",
      "Antibiogram",
      "Vancomycin AUC",
    ],
    tools: [
      { href: "/mechid", label: "MechID", why: "Mechanisms of action and resistance that drive empiric choices." },
      { href: "/tools/spectrum", label: "Spectrum", why: "The antibiogram of last resort — verify coverage before narrowing." },
      { href: "/tools/doseid", label: "DoseID", why: "Renal-adjusted dosing and beta-lactam optimization." },
    ],
    furtherReading: [
      {
        title: "Asymptomatic bacteriuria: what to do and what not to do",
        source: "Nicolle LE, et al. Clin Infect Dis",
        kind: "guideline",
      },
    ],
  },
];

export function getCurriculumModule(slug: string): CurriculumModule | undefined {
  return CURRICULUM_MODULES.find((m) => m.slug === slug);
}

export function getCurriculumModuleNeighbors(
  slug: string,
): { prev?: CurriculumModule; next?: CurriculumModule } {
  const index = CURRICULUM_MODULES.findIndex((m) => m.slug === slug);
  if (index === -1) return {};
  return {
    prev: CURRICULUM_MODULES[index - 1],
    next: CURRICULUM_MODULES[index + 1],
  };
}
