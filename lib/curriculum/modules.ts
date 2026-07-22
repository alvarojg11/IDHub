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
    category: "Bloodborne & viral",
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
    category: "Genitourinary & STI",
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
        source: "Gupta K, et al. Clin Infect Dis. 2011;52(5):e103–e120 [VERIFY current version — 2024 update pending]",
        kind: "guideline",
        focus: "The foundational US guideline for cystitis and pyelonephritis — regimens, durations, ESBL considerations.",
      },
      {
        title: "IDSA Asymptomatic Bacteriuria Guideline",
        source: "Nicolle LE, et al. Clin Infect Dis. 2019 [VERIFY]",
        kind: "guideline",
        focus: "Definitive guidance — do not treat except pregnancy and before urologic procedures with mucosal bleeding.",
      },
      {
        title: "MERINO — Piperacillin-tazobactam vs ceftriaxone for ESBL E. coli / Klebsiella bacteremia",
        source: "Harris PNA, et al. JAMA. 2018;320(10):984–994 [VERIFY]",
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
    category: "Skin, soft tissue & MSK",
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
        source: "Stevens DL, et al. Clin Infect Dis. 2014;59(2):e10–e52 [VERIFY — 2024 update pending]",
        kind: "guideline",
        focus: "The foundational US SSTI guideline — purulent vs non-purulent, severity, empiric therapy.",
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
