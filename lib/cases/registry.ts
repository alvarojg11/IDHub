export type CaseTag = {
  organisms: string[];
  syndromes: string[];
  concepts: string[];
};

export type CaseMeta = {
  slug: string;         // route segment under /cases
  title: string;        // h1 title
  description?: string; // optional card blurb
  subtitle?: string;    // optional
  enable?: boolean;     // optional: hide drafts
  tags?: CaseTag;       // SEO & index tags
};

export const CASES: CaseMeta[] = [
  {
    title: "The Traveling Edema",
    slug: "gnathostomiasis",
    description: "Migratory edema after raw seafood exposure.",
    enable: true,
    tags: { organisms: ["Gnathostoma spinigerum"], syndromes: ["Skin & Soft Tissue", "Travel Medicine", "Parasitology"], concepts: ["Migratory subcutaneous edema", "Eosinophilia", "Raw seafood exposure"] },
  },
  {
    title: "The Climbing Lesion",
    slug: "nocardia-brasiliensis",
    description: "Not your routine skin and soft tissue infection.",
    enable: true,
    tags: { organisms: ["Nocardia brasiliensis"], syndromes: ["Skin & Soft Tissue"], concepts: ["Sporotrichoid lymphangitis", "Lymphocutaneous syndrome"] },
  },
  {
    title: "Fever, Urinary Symptoms, and a Heart Murmur",
    slug: "aerococcus",
    description: "Beyond the obvious: Gram-positive clusters.",
    enable: true,
    tags: { organisms: ["Aerococcus urinae"], syndromes: ["Endocarditis", "Urinary Tract Infection"], concepts: ["Culture-positive endocarditis", "Gram-positive cocci in clusters"] },
  },
  {
    title: "Amazon Adventure",
    slug: "lobomycosis",
    description: "A returning traveler lesion.",
    enable: true,
    tags: { organisms: ["Lacazia loboi"], syndromes: ["Skin & Soft Tissue", "Travel Medicine", "Mycology"], concepts: ["Keloid-like lesion", "Tropical fungal infection"] },
  },
  {
    title: "Fever and Cytopenias After Heart Transplant",
    slug: "parvovirus",
    description: "When the Marrow Goes Quiet",
    enable: true,
    tags: { organisms: ["Parvovirus B19"], syndromes: ["Transplant & Immunocompromised", "Hematology"], concepts: ["Pure red cell aplasia", "Post-transplant infection"] },
  },
  {
    title: "Fulminant Shock",
    slug: "ssuis",
    description: "Shock in the Slaughterhouse",
    enable: true,
    tags: { organisms: ["Streptococcus suis"], syndromes: ["Sepsis & Bacteremia", "Zoonotic"], concepts: ["Fulminant sepsis", "DIC", "Occupational exposure", "Pig exposure"] },
  },
  {
    title: "A Nose Lesion that Wouldn’t Heal",
    slug: "rhinoscleroma",
    description: "A chronic nasal lesion with a broad differential diagnosis.",
    enable: true,
    tags: { organisms: ["Klebsiella rhinoscleromatis"], syndromes: ["ENT", "Granulomatous Infection"], concepts: ["Chronic nasal obstruction", "Mikulicz cells"] },
  },
  {
    title: "Hundreds of Lesions",
    slug: "tungiasis",
    description: "Neglect, poverty, and a devastating skin disease.",
    enable: true,
    tags: { organisms: ["Tunga penetrans"], syndromes: ["Skin & Soft Tissue", "Parasitology", "Neglected Tropical Disease"], concepts: ["Sand flea", "Embedded parasite"] },
  },
  {
    title: "Bloody Diarrhea Without a Clear Cause",
    slug: "spirochetosis",
    description: "An unexpected culprit.",
    enable: true,
    tags: { organisms: ["Brachyspira aalborgi"], syndromes: ["GI & Diarrheal", "Travel Medicine"], concepts: ["Intestinal spirochetosis", "Bloody diarrhea differential"] },
  },
  {
    title: "Headache, Ataxia, and Sixth Nerve Palsy in Connecticut",
    slug: "powassan",
    description: "Brief attachment",
    enable: true,
    tags: { organisms: ["Powassan virus"], syndromes: ["Neuroinfection", "Tick-Borne"], concepts: ["Meningoencephalitis", "Brief tick attachment", "Arboviral encephalitis"] },
  },
  {
    title: "When molluscum is not molluscum",
    slug: "talaromyces",
    description: "Another skin lesion...",
    enable: true,
    tags: { organisms: ["Talaromyces marneffei"], syndromes: ["HIV/AIDS", "Mycology", "Skin & Soft Tissue"], concepts: ["Umbilicated papules", "Disseminated fungal infection", "Advanced HIV"] },
  },
  {
    title: "Chronic Hemoptysis in a Traveler from Rural Colombia",
    slug: "paragonimiasis",
    description: "When lung flukes mimic TB.",
    enable: true,
    tags: { organisms: ["Paragonimus westermani"], syndromes: ["Pulmonary", "Parasitology", "Travel Medicine"], concepts: ["Lung fluke", "Hemoptysis differential", "TB mimic"] },
  },
  {
    title: "A Cryptic Case",
    slug: "cgatti",
    description: "When CNS cryptococcosis reveals an acquired immune defect.",
    enable: true,
    tags: { organisms: ["Cryptococcus gattii"], syndromes: ["Meningitis", "Mycology"], concepts: ["Cryptococcal meningitis in immunocompetent", "CSF opening pressure", "Acquired immunodeficiency"] },
  },
  {
    title: "Slowly Progressive Lumbar Mass",
    slug: "actinomycosis",
    description: "When a soft-tissue mass is an indolent infection.",
    enable: true,
    tags: { organisms: ["Actinomyces israelii"], syndromes: ["Skin & Soft Tissue", "Granulomatous Infection"], concepts: ["Sulfur granules", "Chronic indolent infection", "Mass mimic"] },
  },
  {
    title: "Symmetric Groin Plaques in a Man With Diabetes",
    slug: "erythrasma",
    description: "An intertriginous rash with a key bedside clue.",
    enable: true,
    tags: { organisms: ["Corynebacterium minutissimum"], syndromes: ["Skin & Soft Tissue", "Dermatology"], concepts: ["Wood lamp coral-red fluorescence", "Intertriginous rash", "Tinea mimic"] },
  },
  {
    title: "Verrucous Skin Lesions and a Right Upper Lobe Cavitary Opacity",
    slug: "blastomycosis",
    description: "A verrucous arm lesion, diagnostic GMS stain, and right upper lobe pulmonary disease.",
    enable: true,
    tags: { organisms: ["Blastomyces dermatitidis"], syndromes: ["Mycology", "Pulmonary", "Skin & Soft Tissue"], concepts: ["Verrucous lesions", "Broad-based budding yeast", "GMS stain"] },
  },
  {
    title: "Fever, Hemolysis, and Bleeding Papules After Andes Travel",
    slug: "carrions-disease",
    description: "A classic biphasic Bartonella bacilliformis syndrome.",
    enable: true,
    tags: { organisms: ["Bartonella bacilliformis"], syndromes: ["Travel Medicine", "Hematology", "Vector-Borne"], concepts: ["Oroya fever", "Verruga peruana", "Sandfly-transmitted", "Biphasic illness"] },
  },
  {
    title: "At the Tip of the Nose",
    slug: "hzo-hutchinson-sign",
    description: "A unilateral facial eruption with ocular risk and a misleading early course.",
    enable: true,
    tags: { organisms: ["Varicella-zoster virus"], syndromes: ["Neuroinfection", "Ophthalmology"], concepts: ["Hutchinson sign", "Herpes zoster ophthalmicus", "V1 dermatome"] },
  },
  {
    title: "The Case of the Returning Fever",
    slug: "lbrf",
    description: "Recurrent fever, jaundice, and a diagnosis hiding in the clothing seams.",
    enable: true,
    tags: { organisms: ["Borrelia recurrentis"], syndromes: ["Fever of Unknown Origin", "Vector-Borne", "Travel Medicine"], concepts: ["Louse-borne relapsing fever", "Jarisch-Herxheimer reaction", "Peripheral smear spirochetes"] },
  },
  {
    title: "A Cheesy Clue",
    slug: "m-bovis",
    description: "Infectious differential for chronic diarrhea and edema.",
    enable: true,
    tags: { organisms: ["Mycobacterium bovis"], syndromes: ["GI & Diarrheal", "Mycobacterial"], concepts: ["Abdominal tuberculosis", "Unpasteurized dairy", "Pyrazinamide resistance"] },
  },
  {
    title: "After the Steroid Burst",
    slug: "strongyloides-hyperinfection",
    description: "ICU shock, pulmonary infiltrates, and diarrhea after immunosuppression.",
    enable: true,
    tags: { organisms: ["Strongyloides stercoralis"], syndromes: ["Parasitology", "Transplant & Immunocompromised", "Sepsis & Bacteremia"], concepts: ["Hyperinfection syndrome", "Corticosteroid trigger", "Polymicrobial bacteremia"] },
  },
  {
    title: "Persistent Fever, Splinter Hemorrhages, and an Aortic Valve Abscess",
    slug: "brucella-endocarditis",
    description: "A culture-negative endocarditis clue hiding in the exposure history.",
    enable: true,
    tags: { organisms: ["Brucella melitensis"], syndromes: ["Endocarditis", "Zoonotic"], concepts: ["Culture-negative endocarditis", "Unpasteurized dairy exposure", "Valve abscess"] },
  },
  {
    title: "Transient Leg Weakness in a Man from Rural Colombia",
    slug: "sancc",
    description: "Transient deficits, basal cistern lesions, and a hidden tropical diagnosis.",
    enable: true,
    tags: { organisms: ["Taenia solium"], syndromes: ["Neuroinfection", "Parasitology"], concepts: ["Subarachnoid neurocysticercosis", "Racemose cysts", "Basal cistern disease"] },
  },
  {
    title: "Jaw Stiffness in a Visitor from Rural Haiti",
    slug: "tetanus-trismus",
    description: "An early neurologic warning sign with a dangerous trajectory.",
    enable: true,
    tags: { organisms: ["Clostridium tetani"], syndromes: ["Toxin-Mediated", "Wound Infection"], concepts: ["Trismus", "Generalized tetanus", "Vaccination gap"] },
  },
  {
    title: "Severe Hypertension and Renal Failure in Western Mozambique",
    slug: "urogenital-schistosomiasis",
    description: "A tropical cause of bilateral obstructive uropathy and renal failure.",
    enable: true,
    tags: { organisms: ["Schistosoma haematobium"], syndromes: ["Parasitology", "Renal & Urologic", "Neglected Tropical Disease"], concepts: ["Obstructive uropathy", "Freshwater exposure", "Praziquantel"] },
  },
  {
    title: "Acute Dysentery in a Returning Aid Worker",
    slug: "shigellosis",
    description: "A high-yield cause of acute bloody diarrhea.",
    enable: true,
    tags: { organisms: ["Shigella flexneri"], syndromes: ["GI & Diarrheal", "Travel Medicine"], concepts: ["Acute dysentery", "Fecal-oral transmission", "Antimicrobial resistance"] },
  },
  {
    title: "New HIV Diagnosis in a Patient on Hemodialysis",
    slug: "hiv-hemodialysis",
    description: "Selecting initial ART in end-stage kidney disease on dialysis.",
    enable: true,
    tags: { organisms: ["HIV-1"], syndromes: ["HIV/ART", "Renal & Urologic"], concepts: ["ART in ESKD", "Drug dosing in dialysis", "Renal-adjusted regimens"] },
  },
  {
    title: "Postpartum Fever, Diplopia, and Hemiparesis",
    slug: "listeria-rhombencephalitis",
    description: "A stroke-mimic presentation of postpartum brainstem infection.",
    enable: true,
    tags: { organisms: ["Listeria monocytogenes"], syndromes: ["Neuroinfection", "Meningitis"], concepts: ["Rhombencephalitis", "Brainstem infection", "Postpartum infection", "Stroke mimic"] },
  },
  {
    title: "Fever During Alemtuzumab Therapy",
    slug: "cmv-alemtuzumab",
    description: "An opportunistic infection clue during lymphocyte-depleting therapy.",
    enable: true,
    tags: { organisms: ["Cytomegalovirus"], syndromes: ["Transplant & Immunocompromised", "Opportunistic Infection"], concepts: ["CMV reactivation", "Alemtuzumab-induced T-cell depletion", "Prophylaxis decision"] },
  },
  {
    title: "Persistent Diarrhea and Flatulence After Travel to India",
    slug: "giardiasis-india",
    description: "Greasy stools, bloating after dairy, and a classic travel-related cause of persistent diarrhea.",
    enable: true,
    tags: { organisms: ["Giardia lamblia"], syndromes: ["GI & Diarrheal", "Parasitology", "Travel Medicine"], concepts: ["Malabsorption", "Steatorrhea", "Lactose intolerance post-infection"] },
  },
  {
    title: "Progressive Spastic Paraparesis in a Woman from Guyana",
    slug: "ham-tsp",
    description: "A tropical differential for myelopathy.",
    enable: true,
    tags: { organisms: ["HTLV-1"], syndromes: ["Neuroinfection", "Retroviral"], concepts: ["HAM/TSP", "Tropical spastic paraparesis", "Myelopathy differential"] },
  },
  {
    title: "Recurrent Pneumococcemia",
    slug: "pneumococcemia-myeloma",
    description: "Recurrent invasive pneumococcal disease with a subtle hematologic clue.",
    enable: true,
    tags: { organisms: ["Streptococcus pneumoniae"], syndromes: ["Sepsis & Bacteremia", "Transplant & Immunocompromised"], concepts: ["Recurrent bacteremia", "Hypogammaglobulinemia", "Multiple myeloma", "Encapsulated organisms"] },
  },
  {
    title: "Follicles Beneath the Upper Lid",
    slug: "trachoma",
    description: "Chronic conjunctivitis in a child from rural Ethiopia.",
    enable: true,
    tags: { organisms: ["Chlamydia trachomatis"], syndromes: ["Ophthalmology", "Neglected Tropical Disease"], concepts: ["Trachoma", "Follicular conjunctivitis", "Preventable blindness"] },
  },
  {
    title: "When the Fever Breaks",
    slug: "dengue",
    description: "A tropical febrile illness takes a dangerous turn.",
    enable: true,
    tags: { organisms: ["Dengue virus"], syndromes: ["Travel Medicine", "Vector-Borne"], concepts: ["Dengue critical phase", "Plasma leakage", "Thrombocytopenia", "Warning signs"] },
  },
  {
    title: "Desert Screening Dilemma",
    slug: "coccidioidomycosis-prophylaxis",
    description: "An HIV follow-up case.",
    enable: true,
    tags: { organisms: ["Coccidioides immitis"], syndromes: ["HIV/AIDS", "Mycology"], concepts: ["Coccidioidal prophylaxis", "Serology-based decision-making", "CD4 threshold"] },
  },
  {
    title: "Soft Edges and a Swollen Groin",
    slug: "chancroid",
    description: "A painful genital ulcer that resists easy categorization.",
    enable: true,
    tags: { organisms: ["Haemophilus ducreyi"], syndromes: ["STI", "Skin & Soft Tissue"], concepts: ["Genital ulcer disease", "Painful chancre", "Inguinal bubo"] },
  },
  {
    title: "A Shot in the Dark",
    slug: "hiv-cabotegravir-prep",
    description: "Choosing the right ART when prevention was an injection.",
    enable: true,
    tags: { organisms: ["HIV-1"], syndromes: ["HIV/ART"], concepts: ["Long-acting cabotegravir PrEP", "Integrase resistance", "ART initiation after PrEP failure"] },
  },
  {
    title: "The Rainy Season Abscess",
    slug: "melioidosis",
    description: "A diabetic farmer, a draining wound, and a dangerous saprophyte.",
    enable: true,
    tags: { organisms: ["Burkholderia pseudomallei"], syndromes: ["Travel Medicine", "Granulomatous Infection"], concepts: ["Melioidosis", "Rainy season exposure", "Diabetes risk factor"] },
  },
  {
    title: "The Breast Mass That Wasn’t Cancer",
    slug: "granulomatous-mastitis",
    description: "A suspicious breast mass with a hidden microbiologic cause.",
    enable: true,
    tags: { organisms: ["Corynebacterium kroppenstedtii"], syndromes: ["Skin & Soft Tissue", "Granulomatous Infection"], concepts: ["Granulomatous mastitis", "16S rRNA sequencing", "Lipid-supplemented culture"] },
  },
  {
    title: "The Fever That Would Not Wait",
    slug: "tb-meningitis-hiv",
    description: "TB meningitis in a newly diagnosed HIV patient — treatment timing and ART selection.",
    enable: true,
    tags: { organisms: ["Mycobacterium tuberculosis", "HIV-1"], syndromes: ["Neuroinfection", "HIV/ART", "Mycobacterial", "Meningitis"], concepts: ["TB meningitis", "ART timing", "Paradoxical IRIS", "Dolutegravir with rifampin", "Dexamethasone in TB", "INSPIRING trial"] },
  },
  {
    title: "The Plaque Before the Storm",
    slug: "balamuthia-gae",
    description: "A facial skin lesion that foreshadowed a fatal encephalitis.",
    enable: true,
    tags: { organisms: ["Balamuthia mandrillaris"], syndromes: ["Neuroinfection", "Skin & Soft Tissue", "Parasitology"], concepts: ["Granulomatous amebic encephalitis", "Free-living ameba", "Miltefosine", "Cutaneous prodrome"] },
  },
  {
    title: "Lights Out on Postoperative Day 21",
    slug: "pres-tacrolimus",
    description: "Seizure and cortical blindness in a kidney transplant recipient on tacrolimus.",
    enable: true,
    tags: { organisms: [], syndromes: ["Transplant & Immunocompromised", "Neuroinfection"], concepts: ["PRES", "Tacrolimus neurotoxicity", "Cerebrovascular autoregulation", "Cortical blindness", "Calcineurin inhibitor toxicity"] },
  },
  {
    title: "After the Extraction",
    slug: "pji-management",
    description: "Acute knee pain in a patient with a prosthetic joint after a dental procedure.",
    enable: true,
    tags: { organisms: ["Streptococcus mitis", "Viridans streptococci"], syndromes: ["Orthopedic ID", "Bacteremia"], concepts: ["Prosthetic joint infection", "DAIR", "Biofilm", "OVIVA trial", "Oral step-down therapy", "Hematogenous seeding"] },
  },
  {
    title: "The Cellulitis That Kept Coming Back",
    slug: "brugia-malayi",
    description: "Recurrent leg swelling, a healing inguinal scar, and a blood draw that had to wait until midnight.",
    enable: true,
    tags: { organisms: ["Brugia malayi", "Wolbachia"], syndromes: ["Travel Medicine", "Parasitology", "Lymphatic"], concepts: ["Nocturnal periodicity", "Lymphatic filariasis", "ADLA", "Sterile abscess", "Anti-Wolbachia therapy", "Doxycycline macrofilaricidal"] },
  },
  {
    title: "Two Continents, One Smear",
    slug: "babesia",
    description: "Fever, hemolysis, and intraerythrocytic ring forms in an asplenic traveler.",
    enable: true,
    tags: { organisms: ["Babesia microti"], syndromes: ["Hematology", "Travel Medicine", "Tick-Borne", "Parasitology"], concepts: ["Maltese cross tetrad", "Hemolytic anemia", "Asplenia", "Malaria mimic", "Exchange transfusion", "Atovaquone azithromycin"] },
  },
  {
    title: "The Watercress Fever",
    slug: "fasciola-hepatica",
    description: "A Bolivian immigrant with fever, eosinophilia, and hepatic migratory lesions.",
    enable: true,
    tags: { organisms: ["Fasciola hepatica"], syndromes: ["Travel Medicine", "Parasitology", "GI & Hepatic"], concepts: ["Hepatic fascioliasis", "Eosinophilic hepatitis", "Watercress exposure", "Triclabendazole", "Praziquantel resistance", "Migratory hepatic lesions"] },
  },
].filter((c) => c.enable !== false);

export function getPrevNext(slug: string) {
  const idx = CASES.findIndex((c) => c.slug === slug);
  if (idx === -1) return { prev: null, next: null };

  return {
    prev: idx > 0 ? CASES[idx - 1] : null,
    next: idx < CASES.length - 1 ? CASES[idx + 1] : null,
  };
}
