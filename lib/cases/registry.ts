export type CaseMeta = {
  slug: string;         // route segment under /cases
  title: string;        // h1 title
  description?: string; // optional card blurb
  subtitle?: string;    // optional
  enable?: boolean;     // optional: hide drafts
};

export const CASES: CaseMeta[] = [
  {
    title: "The Traveling Edema",
    slug: "gnathostomiasis",
    description: "Migratory edema after raw seafood exposure.",
    enable: true
  },
  {
    title: "The Climbing Lesion",
    slug: "nocardia-brasiliensis",
    description: "Not your routine skin and soft tissue infection.",
    enable: true
  },
  {
    title: "Fever, Urinary Symptoms, and a Heart Murmur",
    slug: "aerococcus",
    description: "Beyond the obvious: Gram-positive clusters.",
    enable: true
  },
  {
    title: "Amazon Adventure",
    slug: "lobomycosis",
    description: "A returning traveler lesion.",
    enable: true
  },
  {
    title: "Fever and Cytopenias After Heart Transplant",
    slug: "parvovirus",
    description: "When the Marrow Goes Quiet",
    enable: true
  },
  {
    title: "Fulminant Shock",
    slug: "ssuis",
    description: "Shock in the Slaughterhouse",
    enable: true
  },
  {
    title: "A Nose Lesion that Wouldn’t Heal",
    slug: "rhinoscleroma",
    description: "A chronic nasal lesion with a broad differential diagnosis.",
    enable: true
  },
  {
    title: "Hundreds of Lesions",
    slug: "tungiasis",
    description: "Neglect, poverty, and a devastating skin disease.",
    enable: true
  },
  {
    title: "Bloody Diarrhea Without a Clear Cause",
    slug: "spirochetosis",
    description: "An unexpected culprit.",
    enable: true
  },
  {
    title: "Headache, Ataxia, and Sixth Nerve Palsy in Connecticut",
    slug: "powassan",
    description: "Brief attachment",
    enable: true
  },
  {
    title: "When molluscum is not molluscum",
    slug: "talaromyces",
    description: "Another skin lesion...",
    enable: true
  },
  {
    title: "Chronic Hemoptysis in a Traveler from Rural Colombia",
    slug: "paragonimiasis",
    description: "When lung flukes mimic TB.",
    enable: true
  },
  {
    title: "A Cryptic Case",
    slug: "cgatti",
    description: "When CNS cryptococcosis reveals an acquired immune defect.",
    enable: true
  },
  {
    title: "Slowly Progressive Lumbar Mass",
    slug: "actinomycosis",
    description: "When a soft-tissue mass is an indolent infection.",
    enable: true
  },
  {
    title: "Symmetric Groin Plaques in a Man With Diabetes",
    slug: "erythrasma",
    description: "An intertriginous rash with a key bedside clue.",
    enable: true
  },
  {
    title: "Verrucous Skin Lesions and a Right Upper Lobe Cavitary Opacity",
    slug: "blastomycosis",
    description: "A verrucous arm lesion, diagnostic GMS stain, and right upper lobe pulmonary disease.",
    enable: true
  },
  {
    title: "Fever, Hemolysis, and Bleeding Papules After Andes Travel",
    slug: "carrions-disease",
    description: "A classic biphasic Bartonella bacilliformis syndrome.",
    enable: true
  },
  {
    title: "At the Tip of the Nose",
    slug: "hzo-hutchinson-sign",
    description: "A unilateral facial eruption with ocular risk and a misleading early course.",
    enable: true
  },
  {
    title: "The Case of the Returning Fever",
    slug: "lbrf",
    description: "Recurrent fever, jaundice, and a diagnosis hiding in the clothing seams.",
    enable: true
  },
  {
    title: "A Cheesy Clue",
    slug: "m-bovis",
    description: "Infectious differential for chronic diarrhea and edema.",
    enable: true
  },
  {
    title: "After the Steroid Burst",
    slug: "strongyloides-hyperinfection",
    description: "ICU shock, pulmonary infiltrates, and diarrhea after immunosuppression.",
    enable: true
  },
  {
    title: "Persistent Fever, Splinter Hemorrhages, and an Aortic Valve Abscess",
    slug: "brucella-endocarditis",
    description: "A culture-negative endocarditis clue hiding in the exposure history.",
    enable: true
  },
  {
    title: "Transient Leg Weakness in a Man from Rural Colombia",
    slug: "sancc",
    description: "Transient deficits, basal cistern lesions, and a hidden tropical diagnosis.",
    enable: true
  },
  {
    title: "Jaw Stiffness in a Visitor from Rural Haiti",
    slug: "tetanus-trismus",
    description: "An early neurologic warning sign with a dangerous trajectory.",
    enable: true
  },
  {
    title: "Severe Hypertension and Renal Failure in Western Mozambique",
    slug: "urogenital-schistosomiasis",
    description: "A tropical cause of bilateral obstructive uropathy and renal failure.",
    enable: true
  },
  {
    title: "Acute Dysentery in a Returning Aid Worker",
    slug: "shigellosis",
    description: "A high-yield cause of acute bloody diarrhea.",
    enable: true
  },
  {
    title: "New HIV Diagnosis in a Patient on Hemodialysis",
    slug: "hiv-hemodialysis",
    description: "Selecting initial ART in end-stage kidney disease on dialysis.",
    enable: true
  },
  {
    title: "Postpartum Fever, Diplopia, and Hemiparesis",
    slug: "listeria-rhombencephalitis",
    description: "A stroke-mimic presentation of postpartum brainstem infection.",
    enable: true
  },
  {
    title: "Fever During Alemtuzumab Therapy",
    slug: "cmv-alemtuzumab",
    description: "An opportunistic infection clue during lymphocyte-depleting therapy.",
    enable: true
  },
  {
    title: "Persistent Diarrhea and Flatulence After Travel to India",
    slug: "giardiasis-india",
    description: "Greasy stools, bloating after dairy, and a classic travel-related cause of persistent diarrhea.",
    enable: true
  },
  {
    title: "Progressive Spastic Paraparesis in a Woman from Guyana",
    slug: "ham-tsp",
    description: "A tropical differential for myelopathy.",
    enable: true
  },
  {
    title: "Recurrent Pneumococcemia",
    slug: "pneumococcemia-myeloma",
    description: "Recurrent invasive pneumococcal disease with a subtle hematologic clue.",
    enable: true
  },
  {
    title: "Follicles Beneath the Upper Lid",
    slug: "trachoma",
    description: "Chronic conjunctivitis in a child from rural Ethiopia.",
    enable: true
  },
  {
    title: "When the Fever Breaks",
    slug: "dengue",
    description: "A tropical febrile illness takes a dangerous turn.",
    enable: true
  },
  {
    title: "Desert Screening Dilemma",
    slug: "coccidioidomycosis-prophylaxis",
    description: "An HIV follow-up case.",
    enable: true
  },
  {
    title: "Soft Edges and a Swollen Groin",
    slug: "chancroid",
    description: "A painful genital ulcer that resists easy categorization.",
    enable: true
  },
  {
    title: "A Shot in the Dark",
    slug: "hiv-cabotegravir-prep",
    description: "Choosing the right ART when prevention was an injection.",
    enable: true
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
