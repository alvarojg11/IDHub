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
      "One of the most common admission diagnoses in Internal Medicine. Mastering severity stratification, empiric therapy, and the admission decision is core to early residency.",
    readMins: 12,
    difficulty: "core",
    lastReviewed: "2026-07-21",
    lastUpdated: "2026-07-21",
    atAGlance: [
      "Use a validated severity score (PSI or CURB-65) plus clinical judgment to decide site of care — not the chest X-ray alone.",
      "Empiric therapy targets S. pneumoniae, H. influenzae, and the atypicals (Mycoplasma, Chlamydia, Legionella); atypical coverage is standard for inpatient CAP.",
      "Add MRSA and Pseudomonas coverage only when risk factors are present — routine empiric coverage is not indicated.",
      "Diagnostic yield of blood cultures is low in uncomplicated CAP; reserve for severe disease, hospitalization, or failure of therapy.",
      "Short-course therapy (5–7 days) is appropriate for most patients who improve clinically.",
      "Corticosteroids reduce mortality in severe CAP, but are not routine — avoid in influenza or undrained infection without a specific reason.",
    ],
    objectives: [
      "Define CAP and distinguish it from hospital-acquired pneumonia.",
      "Identify common and high-risk pathogens by host.",
      "Apply a validated severity tool (PSI, CURB-65) to guide the admission decision.",
      "Choose appropriate empiric therapy for outpatient, inpatient (non-severe), and severe CAP.",
      "Recognize when to add MRSA or Pseudomonas coverage.",
      "Determine duration of therapy and criteria for transition to oral therapy.",
    ],
    keyConcepts: [
      {
        heading: "Clinical problem & epidemiology",
        prose:
          "CAP is an acute infection of the lung parenchyma in a patient who has not been hospitalized or exposed to healthcare in the prior 14 days. It is among the most frequent causes of hospitalization and infectious death in adults, with mortality driven by severity at presentation and timeliness of appropriate therapy.",
        bullets: [
          "Incidence is highest at the extremes of age and in patients with chronic cardiopulmonary disease or immunocompromise.",
          "The 'HCAP' category was retired from the 2019 ATS/IDSA guidelines — broaden coverage based on individual risk, not the label.",
          "Seasonal viruses (influenza, SARS-CoV-2, RSV) are common and change empiric considerations when prevalent.",
        ],
      },
      {
        heading: "Microbiology & host risk",
        prose:
          "Pathogens cluster by host. Streptococcus pneumoniae remains the most common bacterial cause across all settings. Atypicals (Mycoplasma, Chlamydia, Legionella) are classically part of the differential and are covered when patients are sick enough to admit. Certain hosts mandate broader empiric coverage.",
        bullets: [
          "Typical: S. pneumoniae, H. influenzae, M. catarrhalis.",
          "Atypical: Mycoplasma pneumoniae, Chlamydia pneumoniae, Legionella pneumophila.",
          "Risk factors for MRSA: prior MRSA respiratory infection/colonization, recent hospitalization, IV drug use (tricusval/endocarditis with septic emboli).",
          "Risk factors for Pseudomonas: structurally damaged lung (bronchiectasis, repeated antibiotic exposure), recent hospitalization with parenteral antibiotics.",
        ],
        question: {
          pollId: "train-cap-microbiology-q1",
          prompt:
            "A 68-year-old man with COPD on long-term inhaled corticosteroids, recently hospitalized for a COPD exacerbation and treated with IV ceftriaxone, is admitted with multilobar CAP. Which pathogen requires you to ADD specific coverage beyond standard empiric therapy?",
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
                "Correct. Recent hospitalization plus parenteral antibiotics and structurally diseased lung (COPD with frequent exacerbations) is a risk for Pseudomonas. Empiric therapy should include an antipseudomonal beta-lactam (e.g., piperacillin-tazobactam or cefepime) plus atypical coverage, with MRSA coverage added if indicated.",
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
          "The classic presentation is fever, cough, productive sputum, dyspnea, and pleuritic chest pain, with focal exam findings (crackles, consolidation). Presentation is often subtler in the elderly or immunocompromised, who may present with confusion, falls, or functional decline alone.",
        bullets: [
          "Tachypnea and tachycardia are the most sensitive physical-exam findings.",
          "Hypothermia, hypotension, or confusion signal severe disease.",
          "Extrapulmonary features (diarrhea, hyponatremia, hepatitis, neurologic change) suggest Legionella.",
        ],
      },
      {
        heading: "Approach to diagnosis",
        prose:
          "Chest imaging is required to confirm the diagnosis. Additional testing is tiered by severity: the sicker or more complex the patient, the more diagnostics are justified. Over-testing in low-severity CAP adds cost and false positives without changing management.",
        bullets: [
          "First tier (all): chest X-ray (or chest CT if X-ray is negative but suspicion is high).",
          "Second tier (hospitalized): blood cultures (before antibiotics if possible), sputum culture if a good sample can be obtained, respiratory viral testing including influenza and SARS-CoV-2.",
          "Third tier (severe ICU): urinary antigens for S. pneumoniae and Legionella serogroup 1; consider bronchoscopy if atypical or opportunistic infection is suspected.",
          "CURB-65/PSI guide severity, but blood cultures are reasonable in any hospitalized patient.",
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
          "Severity scores objectify the risk of death, but they do not replace clinical judgment — social factors, ability to take oral medications, and follow-up all affect the site of care. The PSI (Pneumonia Severity Index) is more sensitive but more complex; CURB-65 is simpler and bedside-friendly.",
        bullets: [
          "CURB-65: Confusion, Urea >7 mmol/L, Respiratory rate ≥30, Blood pressure (SBP <90 or DBP ≤60), age ≥65. Score ≥2 generally warrants admission; ≥3 consider ICU.",
          "PSI (PORT score) weights age and comorbidities heavily and is preferred for borderline decisions.",
          "Clinical judgment overrides the score — a young parent unable to follow up or take oral medications may still need admission.",
        ],
      },
      {
        heading: "Treatment: empiric therapy",
        prose:
          "Empiric therapy follows the site of care and host risk. The principles: cover the core pathogens, add atypicals for inpatient therapy, and add MRSA/Pseudomonas coverage only for validated risk factors. The regimen table below summarizes the common scenarios.",
        bullets: [
          "Outpatient (healthy): amoxicillin high-dose, doxycycline, or a respiratory fluoroquinolone.",
          "Outpatient (comorbidities): amoxicillin/clavulanate plus a macrolide or doxycycline; or a respiratory fluoroquinolone alone.",
          "Inpatient (non-severe): an antipneumococcal beta-lactam (ceftriaxone, cefotaxime, ampicillin-sulbactam, or ertapenem) plus a macrolide; or a respiratory fluoroquinolone.",
          "Severe (ICU): beta-lactam plus macrolide (or fluoroquinolone); add MRSA and antipseudomonal coverage when risk factors are present.",
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
                "Correct. High-dose amoxicillin is first-line for healthy adults with outpatient CAP. A doxycycline or a respiratory fluoroquinolone is a reasonable alternative.",
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
          "Shorter is better. Patients who improve can complete therapy orally, and most courses last 5–7 days. Transition to oral therapy does not require repeat blood cultures in uncomplicated cases. Failure to improve by day 3 of therapy should prompt reassessment rather than reflexive broadening.",
        bullets: [
          "Minimum 5 days of therapy, provided the patient is afebrile for 48–72 hours and clinically stable.",
          "Switch from IV to oral when the patient is hemodynamically stable, improving, and able to take oral medications.",
          "Causes of failure by day 3: wrong pathogen or resistant organism, complication (empyema, abscess, metastatic infection), wrong diagnosis (PE, heart failure, atypical presentation), or inadequate source control.",
          "Steroids (e.g., hydrocortisone) are considered in severe CAP with high inflammatory burden; avoid in influenza or active undrained infection.",
        ],
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
    ],
    regimenTables: [
      {
        title: "Empiric therapy by site of care (ATS/IDSA 2019)",
        rows: [
          {
            scenario: "Outpatient, healthy, no risk factors",
            regimen: "Amoxicillin 1 g PO TID, or doxycycline 100 mg PO BID, or a respiratory fluoroquinolone",
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
            duration: "5–7 days",
          },
          {
            scenario: "Inpatient, severe (ICU)",
            regimen:
              "Beta-lactam PLUS macrolide (azithromycin); fluoroquinolone acceptable alternative. Add MRSA + antipseudomonal coverage if risk factors.",
            note: "Avoid fluoroquinolone monotherapy in ICU disease.",
          },
          {
            scenario: "Aspiration concern",
            regimen:
              "Add anaerobic coverage (metronidazole or clindamycin) if a true lung abscess or empyema is present; routine anaerobic coverage is not needed for simple CAP.",
          },
        ],
      },
    ],
    evidence: [
      {
        title: "Diagnosis and Treatment of Adults with Community-Acquired Pneumonia (ATS/IDSA)",
        source: "Am J Respir Crit Care Med. 2019;200(7):e45–e67",
        url: "https://www.atsjournals.org/doi/10.1164/rccm.201908-1581ST",
        kind: "guideline",
        focus: "The current definitive guideline — severity, diagnostics, and empiric therapy.",
      },
      {
        title: "Community-Acquired Pneumonia",
        source: "Wunderink RG, Waterer G. N Engl J Med",
        url: "https://www.nejm.org/doi/full/10.1056/NEJMcp1314869",
        kind: "review",
        focus: "A concise NEJM clinical review of diagnosis and management.",
      },
      {
        title: "Corticosteroid therapy for patients hospitalized with community-acquired pneumonia: a systematic review and meta-analysis",
        source: "Siemieniuk RAC, et al. Ann Intern Med. 2015",
        kind: "trial",
        focus: "Foundation for the role of corticosteroids in severe CAP.",
      },
      {
        title: "Principles and Practice of Infectious Diseases, 9e — Community-Acquired Pneumonia chapter",
        source: "Mandell, Bennett, Dolin",
        kind: "book",
        focus: "Comprehensive reference for pathogens and management.",
      },
    ],
    pearls: [
      "“HCAP” is retired — broaden empiric coverage based on validated risk factors, not the old label.",
      "Always check a respiratory viral panel including influenza and SARS-CoV-2.",
      "Legionella urinary antigen detects only serogroup 1 (the most common); culture on BCYE agar detects other serogroups.",
      "Failure to improve by day 3 → reassess (resistant organism, complication, wrong diagnosis), don't just broaden.",
      "Sterile blood cultures do not rule out bacteremia.",
      "Pneumococcal, influenza, and COVID-19 vaccination at discharge — prevention matters.",
    ],
    syndromeTags: ["Pulmonary Infection", "Atypical Pneumonia", "Pulmonary"],
    conceptTags: ["CAP", "CURB-65", "PSI", "Empiric therapy", "Lobar pneumonia"],
    tools: [
      { href: "/probid", label: "ProbID", why: "Syndrome probability and pretest framing." },
      { href: "/tools/doseid", label: "DoseID", why: "Antimicrobial dosing for inpatient regimens." },
      { href: "/tools/spectrum", label: "Spectrum", why: "Verify empiric coverage against suspected organisms." },
    ],
    furtherReading: [
      {
        title: "Community-acquired pneumonia",
        source: "File TM. Lancet. 2003",
        kind: "review",
      },
    ],
  },

  {
    slug: "infective-endocarditis",
    title: "Infective endocarditis",
    category: "Cardiovascular",
    summary:
      "A diagnostic and management challenge where early recognition, multiple pre-antibiotic blood cultures, and timely echocardiography drive outcome. Endocarditis must be on every IM resident's differential for unexplained bacteremia.",
    readMins: 14,
    difficulty: "intermediate",
    lastReviewed: "2026-07-21",
    lastUpdated: "2026-07-21",
    atAGlance: [
      "Think endocarditis in any unexplained bacteremia (especially S. aureus), new murmur, or embolic phenomenon.",
      "Obtain three sets of blood cultures from separate sites before antibiotics — the single highest-yield diagnostic step.",
      "Use the modified Duke criteria for diagnosis (clinical diagnosis, not imaging alone).",
      "Echocardiography is tiered: TTE first, then TEE if TTE is negative, if a prosthetic valve is present, or in S. aureus bacteremia.",
      "S. aureus bacteremia mandates echocardiography — TTE misses a meaningful fraction of vegetations.",
      "Surgical indications: heart failure, uncontrolled infection, large mobile vegetations, perivalvular extension, and embolic events despite appropriate therapy.",
    ],
    objectives: [
      "Recognize the clinical presentation and predisposing conditions for infective endocarditis.",
      "Apply the modified Duke criteria.",
      "Select appropriate diagnostic studies (blood cultures, echocardiography).",
      "Understand empiric and organism-directed therapy.",
      "Identify indications for surgical intervention.",
    ],
    keyConcepts: [
      {
        heading: "Clinical problem & epidemiology",
        prose:
          "Infective endocarditis (IE) is an infection of the endocardial surface, most often a cardiac valve. The incidence has shifted: Staphylococcus aureus is now the most common cause in many series, driven by healthcare exposure and injection drug use. Mortality remains substantial, and outcome hinges on early cultures, imaging, and coordinated medical-surgical care.",
        bullets: [
          "Predisposing conditions: prosthetic valve, congenital heart disease, prior IE, injection drug use, indwelling catheters, poor dentition.",
          "Native-valve IE and prosthetic-valve IE differ in microbiology and management timing.",
          "Healthcare-associated IE is increasingly common with lines and devices.",
        ],
      },
      {
        heading: "Microbiology",
        prose:
          "Organisms cluster by valve type and exposure. S. aureus and viridans streptococci dominate native-valve disease; coagulase-negative staphylococci are classic for early prosthetic-valve IE; enterococci and HACEK organisms are less common but important. Culture-negative endocarditis has a defined differential to keep in mind when cultures fail to grow.",
        bullets: [
          "Native valve: S. aureus, viridans streptococci, Streptococcus gallolyticus, enterococci.",
          "Prosthetic valve (early, <1 year): coagulase-negative staphylococci, S. aureus, hospital-acquired gram-negatives.",
          "Prosthetic valve (late, >1 year): resembles native-valve microbiology.",
          "Culture-negative causes: Coxiella burnetii, Bartonella, HACEK, and the prior-antibiotic effect.",
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
                "Correct. Early prosthetic-valve IE with coagulase-negative staphylococci warrants a regimen including vancomycin (for methicillin resistance), with rifampin and an aminoglycoside in the initial weeks, per guideline — directed eventually by susceptibility data.",
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
          "Presentation ranges from an indolent febrile illness to fulminant sepsis with embolic phenomena. The classic peripheral stigmata (Osler nodes, Roth spots, Janeway lesions, splinter hemorrhages) are now less common but are still taught because they point to sustained bacteremia and immune-complex deposition.",
        bullets: [
          "Constitutional: fever, malaise, anorexia, weight loss.",
          "Cardiac: new or changing murmur, heart failure, conduction abnormality (perivalvular extension).",
          "Embolic/immunologic: arterial emboli (brain, spleen, kidney, mesentery), mycotic aneurysm, immune-complex glomerulonephritis.",
        ],
      },
      {
        heading: "Approach to diagnosis: Duke criteria & imaging",
        prose:
          "IE is a clinical diagnosis codified by the modified Duke criteria, built from blood cultures and echocardiographic and clinical evidence. Imaging is tiered: transthoracic echo (TTE) is non-invasive and a reasonable first step, but transesophageal echo (TEE) is far more sensitive and is required when TTE is negative but suspicion persists, in prosthetic valves, and in S. aureus bacteremia.",
        bullets: [
          "Major Duke criteria: typical organism in blood cultures (from two separate sites) or persistent bacteremia; endocardial involvement on echo (vegetation, abscess, new regurgitation).",
          "Minor criteria: predisposition, fever ≥38°C, vascular and immunologic phenomena, suggestive (but not definitive) microbiology.",
          "Two TTEs and three TEEs — the general principle is to escalate to TEE whenever the diagnosis is not excluded.",
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
        heading: "Treatment: empiric and organism-directed therapy",
        prose:
          "Empiric therapy covers S. aureus (including MRSA) and streptococci while cultures are pending; once an organism and susceptibilities are known, therapy is narrowed and prolonged (typically 4–6 weeks). The regimen table summarizes common organism-directed strategies. Always consult the most recent guideline and involve ID and cardiothoracic surgery early when surgery is a possibility.",
        bullets: [
          "Empiric: vancomycin +/- cefepime or gentamicin depending on the native vs prosthetic setting and local epidemiology.",
          "Native-valve MSSA: nafcillin or oxacillin (cefazolin is an alternative); add gentamicin briefly in select cases.",
          "MRSA (native or prosthetic): vancomycin (or daptomycin if vancomycin cannot be used).",
          "Viridans streptococci, penicillin-susceptible: penicillin G or ceftriaxone for 4 weeks.",
          "Enterococci: ampicillin plus an aminoglycoside (or ceftriaxone) per susceptibility and guideline.",
        ],
      },
      {
        heading: "Indications for surgery & complications",
        prose:
          "Surgery is lifesaving in a defined subset of patients. The classic indications cluster around heart failure, uncontrolled infection, and prevention or management of embolic and destructive complications. Early collaboration with cardiothoracic surgery is essential when any of these emerge.",
        bullets: [
          "Heart failure due to valve dysfunction — the most common indication.",
          "Uncontrolled infection: persistent bacteremia or fever beyond ~5–7 days despite appropriate therapy, fungal or resistant organisms.",
          "Perivalvular extension: abscess, fistula, heart block.",
          "Embolic events despite appropriate therapy, or large (>10 mm) mobile vegetations with high embolic risk.",
          "Complications to watch: embolic stroke, mycotic aneurysm, renal injury (GN, emboli, drug toxicity), and immune-mediated disease.",
        ],
      },
    ],
    differentials: [
      {
        diagnosis: "Non-endocarditis bacteremia",
        distinguishing: "Bacteremia without endocardial involvement; diagnosis rests on imaging and clinical course.",
      },
      {
        diagnosis: "Culture-negative endocarditis",
        distinguishing: "Sustained clinical picture with negative cultures; think Coxiella, Bartonella, HACEK, or prior antibiotics.",
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
        title: "Organism-directed therapy (illustrative — confirm with current guideline)",
        rows: [
          {
            scenario: "Native valve, methicillin-susceptible S. aureus",
            regimen: "Nafcillin or oxacillin (cefazolin as alternative)",
            duration: "6 weeks",
            note: "Brief aminoglycoside no longer routinely recommended.",
          },
          {
            scenario: "Native or prosthetic valve, MRSA",
            regimen: "Vancomycin (daptomycin if vancomycin cannot be used)",
            duration: "6 weeks",
          },
          {
            scenario: "Viridens streptococci, penicillin-susceptible (MIC ≤0.12)",
            regimen: "Penicillin G or ceftriaxone",
            duration: "4 weeks",
          },
          {
            scenario: "Prosthetic valve, coagulase-negative staphylococci",
            hostFactors: "Early prosthetic-valve IE",
            regimen: "Vancomycin + rifampin + gentamicin (initial 2 weeks)",
            duration: "≥6 weeks",
            note: "Per current IDSA/ISCVID guidance; tailor to susceptibilities.",
          },
          {
            scenario: "Enterococci, ampicillin-susceptible",
            regimen: "Ampicillin + aminoglycoside (or ceftriaxone per guideline)",
            duration: "4–6 weeks",
          },
        ],
      },
    ],
    evidence: [
      {
        title: "Infective Endocarditis in Adults: Diagnosis, Antimicrobial Therapy, and Management of Complications (AHA/IDSA)",
        source: "Circulation. 2015 (focused updates since; 2023 ISCVID/IDSA)",
        url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000396",
        kind: "guideline",
        focus: "The foundational guideline for diagnosis and management of IE.",
      },
      {
        title: "Infective Endocarditis",
        source: "Cahill TJ, Prendergast BD. N Engl J Med. 2016",
        url: "https://www.nejm.org/doi/full/10.1056/NEJMcp1509822",
        kind: "review",
        focus: "A concise, high-yield clinical review.",
      },
      {
        title: "Clinical presentation, etiology, and outcome of infective endocarditis (ICE-PCS)",
        source: "Murdoch DR, et al. Arch Intern Med. 2009",
        kind: "trial",
        focus: "Large prospective cohort describing contemporary presentation and outcomes.",
      },
      {
        title: "Principles and Practice of Infectious Diseases, 9e — Infective Endocarditis chapter",
        source: "Mandell, Bennett, Dolin",
        kind: "book",
        focus: "Comprehensive reference for organism-directed therapy and surgery.",
      },
    ],
    pearls: [
      "S. aureus bacteremia → echocardiography is mandatory; a meaningful fraction have IE even without classic signs.",
      "Three sets of blood cultures, drawn from separate sites 30+ minutes apart, before antibiotics.",
      "Culture-negative endocarditis → think Coxiella burnetii, Bartonella, HACEK; send serology/PCR.",
      "Embolic risk is highest in the first week; large (>10 mm), mobile vegetations carry higher risk.",
      "Do not stop at a negative TTE when suspicion persists — get a TEE.",
      "New heart block on telemetry should make you worry about perivalvular extension (abscess).",
      "Involve ID and cardiothoracic surgery early when surgical indications appear.",
    ],
    syndromeTags: ["Endocarditis", "Cardiovascular", "Cardiovascular Infections", "Bacteremia"],
    conceptTags: ["Duke criteria", "Blood cultures", "TEE", "Vegetation", "Prosthetic valve"],
    tools: [
      { href: "/mechid", label: "MechID", why: "Antimicrobial mechanisms and resistance relevant to therapy." },
      { href: "/tools/doseid", label: "DoseID", why: "Prolonged parenteral therapy and dosing." },
      { href: "/tools/spectrum", label: "Spectrum", why: "Verify organism-directed coverage." },
    ],
    furtherReading: [
      {
        title: "Contemporary management of infective endocarditis",
        source: "Pettersson GB, Hussain ST. Lancet",
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
