
import { getCasePublishedTimestamp } from "@/lib/cases/dates";

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
  ogImage?: string;     // public path to representative image for OG card
  teaser?: string;      // 2-3 sentence clinical hook + closing question for Instagram
};

export const CASES: CaseMeta[] = [
  {
    title: "The Silent Swallow",
    slug: "pyogenic-brain-abscess",
    description: "When aspiration writes a prescription for the brain.",
    enable: true,
    ogImage: "/cases/brain-abscess/brain-abscess.png",
    teaser: "A 78-year-old man with Parkinson's disease and recurrent aspiration events presents with 10 days of confusion and new left-sided weakness. CT shows a 3.2-cm ring-enhancing right parietal lesion with mass effect, and chest CT reveals a concurrent cavitary lung abscess. DWI MRI shows restricted diffusion. What infectious etiology explains both lesions, and how do you treat it?",
    tags: { organisms: ["Streptococcus anginosus", "Prevotella melaninogenica"], syndromes: ["CNS Infection", "Pulmonary Infection"], concepts: ["Brain abscess", "Aspiration", "DWI restricted diffusion", "Ring-enhancing lesion", "Parkinson's disease dysphagia"] },
  },
  {
    title: "The Traveling Edema",
    slug: "gnathostomiasis",
    description: "Migratory edema after raw seafood exposure.",
    enable: true,
    ogImage: "/cases/gnathostoma/gnathostoma.png",
    tags: { organisms: ["Gnathostoma spinigerum"], syndromes: ["Skin & Soft Tissue", "Travel Medicine", "Parasitology"], concepts: ["Migratory subcutaneous edema", "Eosinophilia", "Raw seafood exposure"] },
  },
  {
    title: "The Climbing Lesion",
    slug: "nocardia-brasiliensis",
    description: "Not your routine skin and soft tissue infection.",
    enable: true,
    ogImage: "/cases/nocardia-brasiliensis/nocardia.png",
    tags: { organisms: ["Nocardia brasiliensis"], syndromes: ["Skin & Soft Tissue"], concepts: ["Sporotrichoid lymphangitis", "Lymphocutaneous syndrome"] },
  },
  {
    title: "The Gardener's Finger",
    slug: "sporotrichosis",
    description: "A gardening injury that did not behave like routine cellulitis.",
    enable: true,
    ogImage: "/cases/sporotrichosis/sporotricosis.png",
    tags: { organisms: ["Sporothrix schenckii complex"], syndromes: ["Skin & Soft Tissue", "Mycology"], concepts: ["Gardening exposure", "Nodular lymphangitis", "Subacute inoculation infection"] },
  },
  {
    title: "Fever, Urinary Symptoms, and a Heart Murmur",
    slug: "aerococcus",
    description: "Beyond the obvious: Gram-positive clusters.",
    enable: true,
    ogImage: "/cases/case-1/aerococcus.png",
    tags: { organisms: ["Aerococcus urinae"], syndromes: ["Endocarditis", "Urinary Tract Infection"], concepts: ["Culture-positive endocarditis", "Gram-positive cocci in clusters"] },
  },
  {
    title: "Amazon Adventure",
    slug: "lobomycosis",
    description: "A returning traveler lesion.",
    enable: true,
    ogImage: "/cases/lobomycosis/lacazia.png",
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
    ogImage: "/cases/krhino/krhinogram.png",
    tags: { organisms: ["Klebsiella rhinoscleromatis"], syndromes: ["ENT", "Granulomatous Infection"], concepts: ["Chronic nasal obstruction", "Mikulicz cells"] },
  },
  {
    title: "Hundreds of Lesions",
    slug: "tungiasis",
    description: "Neglect, poverty, and a devastating skin disease.",
    enable: true,
    ogImage: "/cases/tungiasis/tungiasis.png",
    tags: { organisms: ["Tunga penetrans"], syndromes: ["Skin & Soft Tissue", "Parasitology", "Neglected Tropical Disease"], concepts: ["Sand flea", "Embedded parasite"] },
  },
  {
    title: "Bloody Diarrhea Without a Clear Cause",
    slug: "spirochetosis",
    description: "An unexpected culprit.",
    enable: true,
    ogImage: "/cases/spirochetosis/spirochetosis.jpg",
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
    ogImage: "/cases/talaromyces/talaromyces.png",
    tags: { organisms: ["Talaromyces marneffei"], syndromes: ["HIV/AIDS", "Mycology", "Skin & Soft Tissue"], concepts: ["Umbilicated papules", "Disseminated fungal infection", "Advanced HIV"] },
  },
  {
    title: "Chronic Hemoptysis in a Traveler from Rural Colombia",
    slug: "paragonimiasis",
    description: "When lung flukes mimic TB.",
    enable: true,
    ogImage: "/cases/paragonimus/paragonimus.png",
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
    ogImage: "/cases/actinomycosis/actino1.png",
    tags: { organisms: ["Actinomyces israelii"], syndromes: ["Skin & Soft Tissue", "Granulomatous Infection"], concepts: ["Sulfur granules", "Chronic indolent infection", "Mass mimic"] },
  },
  {
    title: "The 5-Month Mystery",
    slug: "cons-pve",
    description: "A new murmur and persistent fevers follow heart surgery.",
    enable: true,
    ogImage: "/cases/cons-pve/cons.png",
    tags: { organisms: ["Staphylococcus epidermidis"], syndromes: ["Cardiovascular", "Endocarditis"], concepts: ["Prosthetic valve endocarditis", "Coagulase-negative staphylococci", "Biofilm infection"] },
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
    ogImage: "/cases/blastomycosis/blasto-lesion-arm.png",
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
    ogImage: "/cases/hzo-hutchinson-sign/hutchinson-sign.png",
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
    ogImage: "/cases/m-bovis/abdominal-ct.png",
    tags: { organisms: ["Mycobacterium bovis"], syndromes: ["GI & Diarrheal", "Mycobacterial"], concepts: ["Abdominal tuberculosis", "Unpasteurized dairy", "Pyrazinamide resistance"] },
  },
  {
    title: "After the Steroid Burst",
    slug: "strongyloides-hyperinfection",
    description: "ICU shock, pulmonary infiltrates, and diarrhea after immunosuppression.",
    enable: true,
    ogImage: "/cases/strongyloides-hyperinfection/strongy.png",
    tags: { organisms: ["Strongyloides stercoralis"], syndromes: ["Parasitology", "Transplant & Immunocompromised", "Sepsis & Bacteremia"], concepts: ["Hyperinfection syndrome", "Corticosteroid trigger", "Polymicrobial bacteremia"] },
  },
  {
    title: "Persistent Fever, Splinter Hemorrhages, and an Aortic Valve Abscess",
    slug: "brucella-endocarditis",
    description: "A culture-negative endocarditis clue hiding in the exposure history.",
    enable: true,
    ogImage: "/cases/brucella-endocarditis/echo.png",
    tags: { organisms: ["Brucella melitensis"], syndromes: ["Endocarditis", "Zoonotic"], concepts: ["Culture-negative endocarditis", "Unpasteurized dairy exposure", "Valve abscess"] },
  },
  {
    title: "Transient Leg Weakness in a Man from Rural Colombia",
    slug: "sancc",
    description: "Transient deficits, basal cistern lesions, and a hidden tropical diagnosis.",
    enable: true,
    ogImage: "/cases/sancc/sancc_mri.png",
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
    ogImage: "/cases/urogenital-schistosomiasis/hydro.png",
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
    ogImage: "/cases/listeria-rhombencephalitis/listeria.png",
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
    ogImage: "/cases/giardiasis-india/giardia.png",
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
    ogImage: "/cases/trachoma/trachoma.png",
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
    ogImage: "/cases/balamuthia/balamuthia.png",
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
    title: "Paresthesias in Paradise",
    slug: "angiostrongylus",
    description: "Severe headache, migratory paresthesias, and a CSF full of eosinophils after a Hawaiian farm dinner.",
    enable: true,
    ogImage: "/cases/angiostrongylus/angiostrongyloides.png",
    tags: { organisms: ["Angiostrongylus cantonensis"], syndromes: ["Neuroinfection", "Travel Medicine", "Parasitology"], concepts: ["Eosinophilic meningitis", "CSF eosinophilia", "Rat lungworm", "No anthelminthics", "Corticosteroids", "Serial lumbar punctures"] },
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
    teaser: "A woman from Malaysia has had six episodes of febrile leg swelling diagnosed as cellulitis, with an inguinal abscess that healed on its own. A daytime blood smear is negative. What is the most appropriate next diagnostic step?",
    tags: { organisms: ["Brugia malayi", "Wolbachia"], syndromes: ["Travel Medicine", "Parasitology", "Lymphatic"], concepts: ["Nocturnal periodicity", "Lymphatic filariasis", "ADLA", "Sterile abscess", "Anti-Wolbachia therapy", "Doxycycline macrofilaricidal"] },
  },
  {
    title: "Two Continents, One Smear",
    slug: "babesia",
    description: "Fever, hemolysis, and intraerythrocytic ring forms in an asplenic traveler.",
    enable: true,
    ogImage: "/cases/babesia/babesia.png",
    teaser: "An asplenic traveler returns from Cape Cod with fever, hemolytic anemia, and intraerythrocytic ring forms on smear. Malaria RDT is negative. What is the diagnosis and how do you treat?",
    tags: { organisms: ["Babesia microti"], syndromes: ["Hematology", "Travel Medicine", "Tick-Borne", "Parasitology"], concepts: ["Maltese cross tetrad", "Hemolytic anemia", "Asplenia", "Malaria mimic", "Exchange transfusion", "Atovaquone azithromycin"] },
  },
  {
    title: "The Watercress Fever",
    slug: "fasciola-hepatica",
    description: "A Bolivian immigrant with fever, eosinophilia, and hepatic migratory lesions.",
    enable: true,
    ogImage: "/cases/fasciola/fasciola.png",
    teaser: "A 26-year-old woman from rural Bolivia presents with 3 weeks of fever, right upper quadrant pain, and an eosinophil count of 4,540. Three consecutive stool exams are negative. CT shows hypodense hepatic lesions. What test confirms the diagnosis?",
    tags: { organisms: ["Fasciola hepatica"], syndromes: ["Travel Medicine", "Parasitology", "GI & Hepatic"], concepts: ["Hepatic fascioliasis", "Eosinophilic hepatitis", "Watercress exposure", "Triclabendazole", "Praziquantel resistance", "Migratory hepatic lesions"] },
  },
  {
    title: "Resistance by Default",
    slug: "enterococcus-gallinarum",
    description: "Not all vancomycin resistance is created equal.",
    enable: true,
    teaser: "Blood cultures in a cirrhotic patient grow Enterococcus gallinarum, automatically flagged as VRE. The infection control team wants to isolate. The team wants to start linezolid. Is this the right call?",
    tags: { organisms: ["Enterococcus gallinarum"], syndromes: ["Sepsis & Bacteremia", "GI & Hepatic"], concepts: ["VanC resistance", "Intrinsic vancomycin resistance", "VRE misidentification", "Ampicillin-susceptible enterococcus", "Infection control", "Cirrhosis bacteremia"] },
  },
  {
    title: "Fever From the Forest",
    slug: "orientia",
    description: "Fever, rash, and a painless black-crusted ulcer after trekking in rural Nepal.",
    enable: true,
    ogImage: "/cases/orientia/orientia.png",
    tags: { organisms: ["Orientia tsutsugamushi"], syndromes: ["Travel Medicine", "Rickettsial", "Tick-Borne"], concepts: ["Scrub typhus", "Eschar", "Doxycycline", "Obligate intracellular", "Tsutsugamushi triangle"] },
  },
  {
    title: "The Sweet Smell of Trouble",
    slug: "strep-anginosus",
    description: "Fever, weight loss, and a multiloculated liver abscess — with a blood culture plate that smells like butterscotch.",
    enable: true,
    ogImage: "/cases/anginosus/sanginosus.png",
    tags: { organisms: ["Streptococcus anginosus group", "Streptococcus anginosus", "Streptococcus intermedius", "Streptococcus constellatus"], syndromes: ["GI & Hepatic", "Sepsis & Bacteremia"], concepts: ["Pyogenic liver abscess", "Butterscotch odor", "Source control", "Colorectal cancer screening", "Viridans streptococci", "S. milleri group", "Diacetyl"] },
  },
  {
    title: "The Loyal Companion",
    slug: "capnocytophaga",
    description: "Septic shock and meningitis in an asplenic patient whose dog never bit her.",
    enable: true,
    ogImage: "/cases/capnocytophaga/capnocytphaga.png",
    tags: { organisms: ["Capnocytophaga canimorsus"], syndromes: ["Sepsis & Bacteremia", "Neuroinfection", "Zoonoses"], concepts: ["Asplenia", "Dog bite", "Fusiform gram-negative rods", "Aztreonam resistance", "Fastidious organism", "Capnophilic", "OPSI"] },
  },
  {
    title: "The Viscous Clue",
    slug: "klebsiella-endophthalmitis",
    description: "A diabetic man with endophthalmitis whose blood cultures revealed more than an eye infection.",
    enable: true,
    teaser: "A 54-year-old diabetic man presents with 3 days of right eye pain, light perception only, and a week of fever. Ophthalmology confirms endogenous endophthalmitis. Blood cultures are pending. What is the most important next diagnostic step?",
    tags: { organisms: ["Klebsiella pneumoniae"], syndromes: ["Ophthalmology", "Sepsis & Bacteremia", "GI & Hepatic"], concepts: ["Hypervirulent Klebsiella", "Endogenous endophthalmitis", "Pyogenic liver abscess", "String test", "Hypermucoviscosity", "Intravitreal antibiotics", "Metastatic infection"] },
  },
  {
    title: "Forgotten but Not Gone",
    slug: "hflu-meningitis",
    description: "An unvaccinated adult with bacterial meningitis and a Gram stain that tells the whole story.",
    enable: true,
    ogImage: "/cases/hflu/hflu.png",
    teaser: "A 38-year-old man with alcohol use disorder and unknown vaccination history presents with two days of headache, fever, and neck stiffness followed by confusion. CSF is turbid with 4,200 WBC and 94% neutrophils. The Gram stain is shown. What is the most likely organism?",
    tags: { organisms: ["Haemophilus influenzae", "Haemophilus influenzae type b"], syndromes: ["Neuroinfection"], concepts: ["Bacterial meningitis", "Gram-negative coccobacilli", "Beta-lactamase", "Dexamethasone", "Rifampin prophylaxis", "Hib vaccine", "Nasopharyngeal carriage", "Contact prophylaxis"] },
  },
  {
    title: "Memory Lost",
    slug: "hhv6-encephalitis",
    description: "A post-BMT patient with progressive amnesia, seizures, and a viral PCR result that demands a second look.",
    enable: true,
    ogImage: "/cases/hhv6/hhv6.png",
    teaser: "A 51-year-old man on day 38 post-allogeneic BMT develops progressive short-term memory loss, a seizure, and hyponatremia. MRI shows bilateral mesial temporal FLAIR hyperintensity. He was HSV and VZV seronegative pretransplant and never received acyclovir. What is the most likely diagnosis?",
    tags: { organisms: ["HHV-6B", "Human herpesvirus 6"], syndromes: ["Transplant & Immunocompromised", "Neuroinfection"], concepts: ["Limbic encephalitis", "Mesial temporal lobe", "Chromosomally integrated HHV-6", "ciHHV-6", "Ganciclovir", "Foscarnet", "Acyclovir ineffective", "SIADH", "Post-BMT encephalitis", "cGvHD"] },
  },
  {
    title: "Positive, But Wrong",
    slug: "trichosporon-asahii",
    description: "A neutropenic BMT recipient with a positive CrAg and skin lesions that pointed elsewhere.",
    enable: true,
    ogImage: "/cases/trichosporon/trichosporon.png",
    teaser: "A 44-year-old man on day 28 post-allogeneic BMT for AML has persistent fever, umbilicated skin papules, and a positive serum CrAg at 1:8. The team is about to start amphotericin B for cryptococcosis. What should happen first?",
    tags: { organisms: ["Trichosporon asahii"], syndromes: ["Transplant & Immunocompromised", "Mycology"], concepts: ["CrAg false positive", "Glucuronoxylomannan cross-reactivity", "Echinocandin resistance", "Voriconazole", "Arthroconidia", "Disseminated trichosporonosis", "Neutropenia", "Allogeneic HSCT"] },
  },
  {
    slug: "chromoblastomycosis",
    title: "The Copper Penny Sign",
    description: "A Brazilian farmer with a 3-year verrucous plaque and a pathognomonic tissue finding.",
    enable: true,
    ogImage: "/cases/fonsecae/copper.png",
    teaser: "A 47-year-old Brazilian farmer presents with a 3-year history of a slow-growing, verrucous cauliflower-like plaque on his right lower leg. Biopsy is obtained. What does the pathologist find that clinches the diagnosis?",
    tags: { organisms: ["Fonsecaea pedrosoi"], syndromes: ["Skin & Soft Tissue", "Mycology", "Travel Medicine"], concepts: ["Chromoblastomycosis", "Medlar bodies", "Sclerotic bodies", "Copper penny sign", "Dematiaceous fungi", "Polymorphic conidiation", "Itraconazole", "Verrucous plaque"] },
  },
  {
    slug: "secondary-syphilis",
    title: "The Great Imitator",
    description: "A rash that reaches the palms and a genital sore the patient thought had healed.",
    enable: true,
    ogImage: "/cases/secondary-syphilis/secondary-syphilis.png",
    teaser: "A 25-year-old man presents with a two-week diffuse rash, fever, and lymphadenopathy. He recalls a painless genital sore six weeks ago that resolved on its own. Now the rash has spread to his palms and soles. What is the diagnosis?",
    tags: { organisms: ["Treponema pallidum"], syndromes: ["Sexually Transmitted Infections", "Skin & Soft Tissue"], concepts: ["Secondary syphilis", "Palmar rash", "The great imitator", "RPR", "Benzathine penicillin", "Jarisch-Herxheimer reaction", "Non-treponemal testing", "Treponemal testing"] },
  },
  {
    slug: "histoplasmosis-hiv",
    title: "Hidden in Plain Sight",
    description: "A patient with newly diagnosed HIV, a CD4 of 18, and a bone marrow that told the whole story.",
    enable: true,
    ogImage: "/cases/histoplasma/histoplasma.png",
    teaser: "A 34-year-old man with newly diagnosed HIV and a CD4 of 18 presents with six weeks of fever, night sweats, pancytopenia, and massive hepatosplenomegaly. The answer was available with a single urine test. What is it?",
    tags: { organisms: ["Histoplasma capsulatum"], syndromes: ["Transplant & Immunocompromised", "Mycology", "HIV & AIDS"], concepts: ["Disseminated histoplasmosis", "Urine Histoplasma antigen", "Liposomal amphotericin B", "Itraconazole", "Pancytopenia", "Bone marrow aspirate", "Intracellular yeast", "ART timing", "IRIS"] },
  },
  {
    slug: "rotavirus",
    title: "The Wheel Turns",
    description: "A nosocomial gastroenteritis outbreak on a surgical ward and a virus whose structure changes everything about how you contain it.",
    enable: true,
    ogImage: "/cases/rotavirus/rotavirus.png",
    teaser: "Four patients on a surgical ward develop sudden-onset watery diarrhea and vomiting. C. diff is negative. The electron micrograph tells you exactly what you're dealing with — and why your usual hand hygiene routine isn't enough.",
    tags: { organisms: ["Rotavirus"], syndromes: ["Gastroenteritis", "Infection Control", "Hospital Epidemiology"], concepts: ["Non-enveloped virus", "Alcohol hand rub resistance", "Contact precautions", "Nosocomial outbreak", "Oral rehydration", "Triple-layered capsid", "dsRNA virus", "Soap and water"] },
  },
  {
    slug: "rickettsia-typhi",
    title: "Not the Cat's Fault",
    description: "A South Texas woman with cats, a flea, and a fever that didn't need a tick to get started.",
    enable: true,
    ogImage: "/cases/rickettsia-typhi/rtyphi.png",
    teaser: "A 38-year-old woman from Corpus Christi with indoor-outdoor cats presents with 10 days of fever, headache, and a truncal rash. No tick bite. She brings in something she found on her cat. What is the diagnosis, and how did she actually get infected?",
    tags: { organisms: ["Rickettsia typhi"], syndromes: ["Fever & Rash", "Travel Medicine", "Zoonoses"], concepts: ["Murine typhus", "Cat flea", "Ctenocephalides felis", "Flea feces transmission", "Doxycycline", "Thrombocytopenia", "South Texas", "Centrifugal rash"] },
  },
  {
    slug: "entamoeba-histolytica",
    title: "A Quiet Invasion",
    description: "A returning traveler with RUQ pain, fever, and a hypodense hepatic lesion — and no culturable bacteria.",
    enable: true,
    ogImage: "/cases/entamoeba-histolytica/entamoeba-histolytica.png",
    teaser: "A 45-year-old man born in Mexico presents with three weeks of right upper quadrant pain and fever after visiting family in rural Oaxaca. CT shows a large hypodense right hepatic lesion. Blood cultures are negative. What is quietly invading his liver?",
    tags: { organisms: ["Entamoeba histolytica"], syndromes: ["Gastroenterology", "Travel Medicine", "Parasitology"], concepts: ["Amoebic liver abscess", "Erythrophagocytosis", "Serology", "Metronidazole", "Luminal agent", "Paromomycin", "Pyogenic abscess", "Travel medicine"] },
  },
  {
    slug: "salmonella-aortitis",
    title: "A Dangerous Predilection",
    description: "A man with a known aortic aneurysm, a forgotten diarrheal illness, and blood cultures that explain everything.",
    enable: true,
    ogImage: "/cases/salmonella/salmonella.png",
    teaser: "A 68-year-old man with a known aortic aneurysm presents with two weeks of fever and back pain. Three weeks ago he had a brief diarrheal illness after a backyard cookout. His blood cultures are growing gram-negative rods. CT shows periaortic gas.",
    tags: { organisms: ["Salmonella enterica"], syndromes: ["Bacteremia", "Cardiovascular Infections", "Gastroenterology"], concepts: ["Infected aortic aneurysm", "Mycotic aneurysm", "Vascular seeding", "Periaortic gas", "Fluoroquinolone", "Surgical debridement", "Non-typhoidal Salmonella", "GNR bacteremia"] },
  },
  {
    slug: "trypanosoma-gambiense",
    title: "The Long Way Home",
    description: "A humanitarian aid worker returning from the DRC with progressive neuropsychiatric symptoms and a blood smear that tells the whole story.",
    enable: true,
    ogImage: "/cases/trypanosoma-gambiense/trypanosoma-gambiense.png",
    teaser: "A 34-year-old aid worker returns from 18 months in the DRC with six weeks of fever and new personality changes. She barely remembers a skin lesion that resolved months ago. Her blood smear changes everything.",
    tags: { organisms: ["Trypanosoma brucei gambiense"], syndromes: ["Neurologic Infections", "Travel Medicine", "Parasitology"], concepts: ["African sleeping sickness", "Winterbottom sign", "Trypanosomal chancre", "Hemolymphatic stage", "Meningoencephalitic stage", "Lumbar puncture staging", "Fexinidazole", "NECT", "Tsetse fly", "Sleep cycle inversion"] },
  },
  {
    slug: "trachoma-follicular",
    title: "The Blinding Cycle",
    description: "A community health worker in rural Ethiopia with bilateral eye irritation and follicles on the upper tarsal conjunctiva — the world's leading infectious cause of blindness.",
    enable: true,
    ogImage: "/cases/trachoma-follicular/trachoma_follicular.png",
    teaser: "A 28-year-old Ethiopian community health worker presents with three months of bilateral eye irritation and mucopurulent discharge. Slit-lamp reveals follicles on the upper tarsal conjunctiva. Without intervention, this cycle ends in blindness.",
    tags: { organisms: ["Chlamydia trachomatis"], syndromes: ["Ophthalmologic Infections", "Neglected Tropical Diseases", "Travel Medicine"], concepts: ["Trachoma", "WHO SAFE strategy", "Azithromycin MDA", "Trichiasis", "Corneal opacity", "Serovars A-C", "Follicular conjunctivitis", "Mass drug administration"] },
  },
  {
    slug: "tularemia-oculoglandular",
    title: "The Eye of the Rabbit",
    description: "A hunter from Arkansas who field-dressed a rabbit without gloves now has a red eye, a golf ball-sized preauricular node, and a corneal ulcer that is not pink eye.",
    enable: true,
    ogImage: "/cases/tularemia-oculoglandular/oculoglandular-tularemia.png",
    teaser: "A 44-year-old hunter from Arkansas presents 10 days after field-dressing a wild rabbit without gloves. Left eye pain, photophobia, and a 3 cm tender preauricular mass. The slit-lamp tells you exactly what this is — and why it cannot wait.",
    tags: { organisms: ["Francisella tularensis"], syndromes: ["Ophthalmologic Infections", "Zoonoses", "Bioterrorism"], concepts: ["Oculoglandular tularemia", "Parinaud's oculoglandular syndrome", "Type A tularemia", "Aminoglycosides", "Gentamicin", "Streptomycin", "Preauricular lymphadenopathy", "Corneal ulcer", "Hypopyon", "Category A bioterrorism agent"] },
  },
  {
    slug: "hiv-ltbi",
    title: "The Indeterminate Answer",
    description: "A man with newly diagnosed HIV and a CD4 of 118 whose household partner has pulmonary TB — and a QuantiFERON result that demands careful interpretation.",
    enable: true,
    ogImage: "/cases/hiv-ltbi/normal-xray.png",
    teaser: "A 31-year-old man with newly diagnosed HIV (CD4 118) discloses that his household partner was recently diagnosed with smear-positive pulmonary TB. QuantiFERON-TB Gold Plus returns indeterminate. What does this result mean, and what do you do next?",
    tags: { organisms: ["Mycobacterium tuberculosis", "HIV-1"], syndromes: ["HIV/AIDS", "Mycobacterial", "Transplant & Immunocompromised"], concepts: ["Latent TB infection", "LTBI", "Indeterminate IGRA", "QuantiFERON", "1HP", "BRIEF-TB trial", "Rifapentine", "Isoniazid", "Dolutegravir dose adjustment", "Rifamycin-ART interactions", "Bictegravir contraindication", "Pyridoxine", "Post-exposure prophylaxis"] },
  },
  {
    slug: "cmv-colitis",
    title: "A Stubborn Course",
    description: "A kidney transplant recipient who completed C. diff treatment but keeps getting worse — the biopsy reveals who was really behind it.",
    enable: true,
    ogImage: "/cases/cmv-colitis/cmv-colitis.png",
    teaser: "A D+/R- kidney transplant recipient completes oral vancomycin for C. diff but returns two weeks later with bloody diarrhea and weight loss. Repeat C. diff testing is negative. Colonoscopy shows linear ulcerations. What does the biopsy reveal?",
    tags: { organisms: ["Cytomegalovirus", "CMV"], syndromes: ["Transplant & Immunocompromised", "Gastroenterology"], concepts: ["CMV colitis", "D+/R- serostatus", "Late CMV disease", "Post-prophylaxis CMV", "UL97 kinase mutation", "Ganciclovir resistance", "Foscarnet", "Maribavir", "SOLSTICE trial", "Tissue biopsy gold standard", "IHC", "Owl eye inclusion", "Co-infection C. diff"] },
  },
  {
    slug: "ptld-heart-transplant",
    title: "The Mass at Twelve Months",
    description: "A heart transplant recipient with fever, night sweats, and a left upper lobe mass one year after transplant.",
    enable: true,
    ogImage: "/cases/ptld/ptld.png",
    teaser: "A 52-year-old man presents 12 months after heart transplant with six weeks of fever, night sweats, and a 9-pound weight loss. CT chest reveals a 4.2 cm left upper lobe mass with mediastinal adenopathy. His donor was EBV-seropositive; he was seronegative. What is the most likely diagnosis?",
    tags: { organisms: ["Epstein-Barr virus", "EBV"], syndromes: ["Transplant & Immunocompromised", "Oncology", "Pulmonary"], concepts: ["Post-transplant lymphoproliferative disorder", "PTLD", "EBV serostatus mismatch", "Monomorphic PTLD", "Diffuse large B-cell lymphoma", "Rituximab", "Immunosuppression reduction", "EBER in situ hybridization", "CD20", "B symptoms", "Calcineurin inhibitor", "PTLD-1 trial"] },
  },
  {
    slug: "diabetic-foot-osteomyelitis",
    title: "The Forgotten Toe",
    description: "A diabetic foot ulcer that wouldn't heal, leading to osteomyelitis and amputation.",
    enable: true,
    ogImage: "/cases/DFI/om.png",
    teaser: "A 62-year-old man with diabetes and peripheral arterial disease presents with a non-healing plantar ulcer exposing bone. X-ray shows osteomyelitis. What is the appropriate empiric antibiotic regimen?",
    tags: { organisms: ["Staphylococcus aureus", "Streptococcus agalactiae"], syndromes: ["Skin & Soft Tissue", "Diabetes", "Orthopedic ID"], concepts: ["Diabetic foot osteomyelitis", "Transmetatarsal amputation", "Antibiotic duration", "IWGDF guidelines", "Oral step-down therapy"] },
  },
  {
    slug: "leptospirosis-weil-disease",
    title: "Fever after Floodwaters",
    description: "A rice farmer presents with fever, jaundice, and renal failure after wading through floodwaters.",
    enable: true,
    ogImage: "/cases/leptospirosis-weil-disease/conjunctival-suffusion.png",
    teaser: "A 42-year-old rice farmer in rural Thailand presents with 5 days of high-grade fevers, severe myalgias, and progressive jaundice. He recalls wading through floodwaters two weeks prior while repairing irrigation canals. Which organism is most likely responsible for his illness?",
    tags: {
      organisms: [
        "Leptospira interrogans",
      ],
      syndromes: [
        "Travel Medicine",
        "Zoonoses",
        "Renal Infection",
      ],
      concepts: [
        "Conjunctival suffusion",
        "Weil's disease",
        "Hepatorenal syndrome",
        "Occupational exposure",
        "Pulmonary hemorrhage syndrome",
      ],
    },
  },
  {
    slug: "chagas-cardiomyopathy",
    title: "Heart Failure from the Andes",
    description: "A Colombian immigrant presents with progressive heart failure and characteristic cardiac findings.",
    enable: true,
    ogImage: "/cases/chagas-cardiomyopathy/triatomine-bug.png",
    teaser: "A 58-year-old man originally from rural Colombia presents with 4 months of progressive shortness of breath and leg swelling. He recalls frequent 'kissing bug' bites during childhood. Echocardiogram reveals severe biventricular dysfunction with apical aneurysm and thrombus. What is the most likely cause of his cardiomyopathy?",
    tags: {
      organisms: [
        "Trypanosoma cruzi",
      ],
      syndromes: [
        "Cardiovascular",
        "Parasitology",
        "Travel Medicine",
      ],
      concepts: [
        "Chagas cardiomyopathy",
        "Apical aneurysm",
        "Right bundle branch block",
        "Vector-borne transmission",
        "Immigrant health",
      ],
    },
  },
  {
    slug: "chikungunya-fever",
  
  
    title: "Fever and Arthralgia after Caribbean Travel",
  
  
    description: "A traveler returning from the Dominican Republic presents with fever, severe polyarthralgia, and rash. Diagnose and manage this arboviral infection.",
  
  
    enable: true,
  
  
    ogImage: "/cases/chikungunya-fever/mosquito.png",
  
  
  
  
  
  
  
  
    teaser: "A 45-year-old woman presents with 3 days of high fever, severe polyarthralgia, and a maculopapular rash after returning from the Dominican Republic. What is the most likely cause of her illness?",
  
  
  
    tags: {
      organisms: [
        "Chikungunya virus",
      ],
  
  
  
      syndromes: [
        "Travel Medicine",
        "Viral Arthritis",
        "Arboviral Infection",
      ],
  
  
  
  
      concepts: [
        "Symmetric polyarthralgia",
        "RT-PCR diagnosis",
        "Supportive management",
        "Mosquito-borne prevention",
      ],
  
  
  
    },
  },
  {
    slug: "cutibacterium-acnes-shoulder-prosthetic-joint-infection",
  
  
    title: "The Shoulder That Wouldn't Heal",
  
  
    description: "Subtle signs and a revealing gram stain lead to the diagnosis of an unusual shoulder infection. Master the key learning points for managing similar cases.",
  
  
    enable: true,
    ogImage: "/cases/cutibacterium-acnes-shoulder-prosthetic-joint-infection/cacnes.png",
  
  
  
  
    teaser: "A 68-year-old man presents with persistent right shoulder pain 8 months after total shoulder arthroplasty. Examination reveals limited range of motion and mild swelling, with synovial fluid showing gram-positive rods. What organism is most likely responsible and what is the appropriate management?",
  
  
  
  
  
  
  
  
    tags: {
      organisms: [
        "Cutibacterium acnes",
      ],
  
  
  
      syndromes: [
        "Prosthetic Joint Infection",
        "Orthopedic Infection",
      ],
  
  
  
  
      concepts: [
        "Biofilm infection",
        "Indolent infection",
        "Shoulder arthroplasty",
        "Culture‑negative infection",
      ],
  
  
  
    },
  },
  {
    slug: "pml-iris",
  
  
    title: "After the Headaches Faded",
  
  
    description: "A patient with advanced HIV develops worsening focal deficits and a left frontal white matter lesion with midline shift after ART initiation.",
  
  
    enable: true,
  
  
    ogImage: "/cases/pml-iris/pml-iris.png",
  
  
  
  
  
  
  
  
    teaser: "A 39-year-old man with advanced HIV develops aphasia, right-sided weakness, and seizures 10 months after cryptococcal meningitis and several months after starting ART. Brain MRI shows a large left frontal white matter lesion with midline shift and subfalcine herniation. What is the most likely explanation for this worsening lesion?",
  
  
  
  
  
  
  
  
    tags: {
      organisms: [
        "JC polyomavirus",
      ],
  
  
  
      syndromes: [
        "Neuroinfection",
        "HIV/AIDS",
        "Immune Reconstitution Inflammatory Syndrome",
      ],
  
  
  
  
      concepts: [
        "PML-IRIS",
        "JC virus PCR",
        "MRI mass effect",
        "Continue ART",
      ],
  
  
  
    },
  },
  {
    slug: "pulmonary-mucormycosis-dka",

    title: "The Ring in the Right Upper Lobe",

    description: "A patient with uncontrolled diabetes and diabetic ketoacidosis has a right upper lobe reverse halo sign on chest CT.",

    enable: true,

    ogImage: "/cases/pulmonary-mucormycosis-dka/mucor.png",

    teaser: "A 56-year-old man with uncontrolled type 2 diabetes presents with fever, pleuritic chest pain, dyspnea, and diabetic ketoacidosis. Chest CT shows a reverse halo sign in the right upper lobe, and bronchoalveolar lavage later grows Rhizopus arrhizus. What is the most likely diagnosis?",

    tags: {
      organisms: [
        "Rhizopus arrhizus",
      ],

      syndromes: [
        "Invasive Fungal Infection",
        "Pulmonary Infection",
        "Diabetes Mellitus",
      ],

      concepts: [
        "Diabetic ketoacidosis",
        "Reverse halo sign",
        "Pulmonary mucormycosis",
        "Liposomal amphotericin B",
        "Angioinvasive mold infection",
      ],

    },
  },
  {
    slug: "faecium-bacteremia",

    title: "When Ceftriaxone Fails",

    description: "A cirrhotic patient develops persistent VRE bacteremia despite standard ceftriaxone prophylaxis, illustrating why Enterococcus faecium must be interpreted differently from Enterococcus faecalis.",

    enable: true,

    ogImage: "/cases/faecium-bacteremia/agar-plate.png",

    teaser: "A 58-year-old man with decompensated cirrhosis becomes septic on ceftriaxone after a variceal bleed admission. Blood and ascitic fluid grow Enterococcus faecium with vanA-mediated vancomycin resistance, and cultures stay positive after catheter removal. Why does the species call matter, what does vanA add, and what should happen next?",

    tags: {
      organisms: [
        "Enterococcus faecium",
      ],

      syndromes: [
        "Bacteremia",
        "Spontaneous bacterial peritonitis",
        "Cirrhosis",
      ],

      concepts: [
        "Vancomycin-resistant enterococci",
        "vanA",
        "vanB",
        "Ampicillin resistance",
        "Healthcare-associated infection",
      ],

    },
  },
  {
    slug: "bcg-spondylodiscitis",
  
  
    title: "When the Back Pain Came Late",
  
  
    description: "A man develops delayed lumbar pain and constitutional symptoms long after intravesical BCG for urothelial carcinoma. Biopsy reveals granulomatous vertebral infection, and the next step depends on reading the clues correctly.",
  
  
    enable: true,
  
  
    ogImage: "/cases/bcg-spondylodiscitis/mri-l2-l3-spine.png",
  
  
    teaser: "A 74-year-old man develops weeks of worsening low back pain, night sweats, and weight loss 18 months after intravesical BCG for non-muscle-invasive urothelial carcinoma. MRI shows L2-L3 vertebral infection with an adjacent paravertebral abscess, and biopsy reveals necrotizing granulomatous inflammation. What is the most likely diagnosis?",
  
  
  
    tags: {
      organisms: [
        "Mycobacterium bovis",
      ],
  
  
  
      syndromes: [
        "Vertebral osteomyelitis",
        "Healthcare-associated infection",
        "Urologic oncology",
      ],
  
  
  
  
      concepts: [
        "Intravesical BCG complication",
        "Pyrazinamide resistance",
        "Interferon-gamma release assay",
        "Spondylodiscitis",
        "Mycobacterium tuberculosis complex",
      ],
  
  
  
    },
  },
  {
    slug: "acyclovir-resistant-hsv",
    title: "The Ulcers That Would Not Heal",
    description: "A stem cell transplant recipient develops progressive mucocutaneous ulceration despite standard antiviral therapy.",
    enable: true,
    ogImage: "/cases/acyclovir-resistant-hsv/electron-microscopy.png",
    teaser: "A 44-year-old woman on day 64 after allogeneic stem cell transplantation develops painful oral and perianal ulcers. Lesion testing detects herpes simplex virus type 1, but the ulcers enlarge despite appropriately dosed intravenous acyclovir. What diagnosis should be considered when HSV lesions progress during adequate therapy?",
    tags: { organisms: ["Herpes simplex virus type 1"], syndromes: ["Transplant & Immunocompromised", "Mucocutaneous Infection", "Antiviral Resistance"], concepts: ["Acyclovir resistance", "HSV thymidine kinase", "UL23", "Foscarnet", "Hematopoietic stem cell transplantation"] },
  },
  {
    slug: "daptomycin-eosinophilic-pneumonia",
    title: "The New Infiltrates on Week Three",
    description: "A patient receiving outpatient therapy for MRSA bacteremia returns with fever, hypoxemia, and new bilateral pulmonary infiltrates.",
    enable: true,
    ogImage: "/cases/daptomycin-eosinophilic-pneumonia/ct-chest.png",
    teaser: "A 67-year-old man receiving outpatient daptomycin for MRSA vertebral osteomyelitis returns during week 3 of therapy with fever, dry cough, dyspnea, and a new oxygen requirement. CT chest shows bilateral ground-glass and consolidative opacities, while cultures and respiratory viral testing are unrevealing. What diagnosis should be considered before simply broadening antibiotics?",
    tags: { organisms: ["Staphylococcus aureus"], syndromes: ["Pulmonary Infection", "Drug Toxicity", "Antimicrobial Adverse Effects"], concepts: ["Daptomycin", "Eosinophilic pneumonia", "BAL eosinophilia", "MRSA therapy", "Pulmonary surfactant"] },
  },
  {
    slug: "mycoplasma-rime",
    title: "The Painful Mouth and the Quiet Lungs",
    description: "A young woman with severe oral mucositis, minimal skin disease, and subtle pulmonary findings.",
    enable: true,
    ogImage: "/cases/mycoplasma-rime/oral-mucositis.png",
    teaser: "A 24-year-old woman is hospitalized with fever, dry cough, severe oral mucositis, and only a few scattered targetoid lesions. She recently completed TMP-SMX for pyelonephritis, but chest radiograph shows subtle patchy infiltrates. What is the most likely diagnosis, and what treatment should happen next?",
    tags: { organisms: ["Mycoplasma pneumoniae"], syndromes: ["Atypical Pneumonia", "Mucocutaneous Infection", "Dermatologic Infectious Diseases"], concepts: ["RIME", "SJS/TEN mimic", "Mucositis", "Macrolide therapy"] },
  },
  {
    slug: "legionella",
    title: "The Negative Test and the Worsening Lungs",
    description: "An immunosuppressed patient develops progressive multilobar pneumonia despite standard therapy and an initially reassuring test result.",
    enable: true,
    ogImage: "/cases/legionella/xray.png",
    teaser: "A 68-year-old man receiving prednisone and a TNF-alpha inhibitor presents with fever, dyspnea, watery diarrhea, mild confusion, hyponatremia, and multilobar pneumonia after recent plumbing disruption in his apartment building. He worsens despite ceftriaxone and vancomycin, and the urine antigen test is negative. What diagnosis should still be pursued, what test should be sent next, and how should he be treated?",
    tags: { organisms: ["Legionella pneumophila", "Legionella species"], syndromes: ["Pulmonary Infection", "Atypical Pneumonia", "Immunocompromised Host"], concepts: ["Negative urine antigen", "BCYE agar", "Legionella PCR", "Water-system exposure", "Fluoroquinolone therapy"] },
  },
  {
    slug: "yellow-fever-tolima",
    title: "Fever after the Coffee Farms",
    description: "A traveler returning from coffee farms in Tolima, Colombia develops fever, early jaundice, thrombocytopenia, and transaminitis.",
    enable: true,
    ogImage: "/cases/yellow-fever-tolima/aedes.png",
    teaser: "A 32-year-old unvaccinated traveler returns from coffee farms in rural Tolima, Colombia with fever, headache, myalgias, mild jaundice, thrombocytopenia, and AST-predominant hepatitis. Dengue and malaria testing are negative. What is the most likely diagnosis, what test should be sent now, and how should he be treated?",
    tags: { organisms: ["Yellow fever virus"], syndromes: ["Travel Medicine", "Arboviral Infection", "Viral Hemorrhagic Fever"], concepts: ["Aedes aegypti", "Sylvatic transmission", "RT-PCR diagnosis", "Supportive care", "17D vaccine", "Public health notification"] },
  },
  {
    slug: "yersinia-pestis-sierras",
    title: "The Hike and the Tender Node",
    description: "A camper in California's Sierra Nevada develops fever and a painful inguinal node after a small bite near the ankle.",
    enable: true,
    ogImage: "/cases/yersinia-pestis-sierras/ground-squirrel.png",
    teaser: "A 34-year-old camper returns from the Sierra Nevada with abrupt fever, severe malaise, and an exquisitely tender inguinal lymph node near a small ankle papule. Routine cellulitis is the wrong frame. What is the diagnosis, what test should be sent, and how should he be treated?",
    tags: { organisms: ["Yersinia pestis"], syndromes: ["Zoonoses", "Travel Medicine", "Lymphadenitis", "Vector-borne Infection"], concepts: ["Bubonic plague", "Flea-borne transmission", "Ground squirrel exposure", "Bubo aspirate", "Gentamicin", "Public health notification"] },
  },
  {
    slug: "pjp",
    title: "The Normal Lung Exam",
    description: "A young patient develops progressive breathlessness with little to hear on lung exam.",
    enable: true,
    ogImage: "/cases/pjp/pjp-bal.png",
    teaser: "A 29-year-old man with no known medical history presents with 3 weeks of dry cough, fatigue, low-grade fever, and progressive dyspnea. His lungs are nearly clear, but a short walk causes marked desaturation and chest CT changes the differential. What is the diagnosis, what test should be sent, and how should he be treated?",
    tags: { organisms: ["Pneumocystis jirovecii"], syndromes: ["Pulmonary Infection", "Opportunistic Infection", "HIV/AIDS", "Immunocompromised Host"], concepts: ["Pneumocystis pneumonia", "Ground-glass opacities", "Beta-D-glucan", "Bronchoalveolar lavage", "TMP-SMX", "Adjunctive corticosteroids", "PJP prophylaxis"] },
  },
  {
    slug: "psa-dtr",
    title: "After the Lithotripsy",
    description: "Bacteremic difficult-to-treat Pseudomonas after urinary instrumentation and residual stone burden.",
    enable: true,
    ogImage: "/cases/psa-dtr/psa.png",
    teaser: "A man with neurogenic bladder, recurrent stones, and multiple prior antibiotic courses becomes septic one day after lithotripsy and stent placement. Blood and urine cultures grow difficult-to-treat Pseudomonas aeruginosa. Which newer agent is the best definitive therapy, what resistance mechanisms fit the susceptibility profile, and why is source control still the center of management?",
    tags: { organisms: ["Pseudomonas aeruginosa"], syndromes: ["Sepsis & Bacteremia", "Renal & Urologic"], concepts: ["Difficult-to-treat resistance", "Neurogenic bladder", "Ureteral stones", "Lithotripsy", "Source control", "Ceftolozane-tazobactam"] },
  },
].filter((c) => c.enable !== false);

export function getCaseBySlug(slug: string) {
  return CASES.find((item) => item.slug === slug) ?? null;
}

export function getCasesOrdered(order: "newest" | "alphabetical" = "newest") {
  const indexedCases = CASES.map((item, index) => ({ item, index }));

  indexedCases.sort((a, b) => {
    if (order === "alphabetical") {
      return a.item.title.localeCompare(b.item.title);
    }

    const publishedDelta = getCasePublishedTimestamp(b.item.slug) - getCasePublishedTimestamp(a.item.slug);
    if (publishedDelta !== 0) {
      return publishedDelta;
    }

    return a.index - b.index;
  });

  return indexedCases.map(({ item }) => item);
}

export function getPrevNext(slug: string, order: "newest" | "alphabetical" = "newest") {
  const orderedCases = getCasesOrdered(order);
  const idx = orderedCases.findIndex((item) => item.slug === slug);
  if (idx === -1) return { prev: null, next: null };

  return {
    prev: idx > 0 ? orderedCases[idx - 1] : null,
    next: idx < orderedCases.length - 1 ? orderedCases[idx + 1] : null,
  };
}

export function getRelatedCases(slug: string, limit = 3) {
  const currentCase = getCaseBySlug(slug);
  if (!currentCase) return [];

  const currentTags = currentCase.tags ?? { organisms: [], syndromes: [], concepts: [] };
  const currentTagSets = {
    organisms: new Set(currentTags.organisms),
    syndromes: new Set(currentTags.syndromes),
    concepts: new Set(currentTags.concepts),
  };

  const { prev, next } = getPrevNext(slug, "newest");
  const excludedSlugs = new Set([slug, prev?.slug, next?.slug].filter(Boolean));

  const scoredCases = CASES.filter((item) => !excludedSlugs.has(item.slug))
    .map((item) => {
      const tags = item.tags ?? { organisms: [], syndromes: [], concepts: [] };
      const sharedSyndromes = tags.syndromes.filter((value) => currentTagSets.syndromes.has(value)).length;
      const sharedOrganisms = tags.organisms.filter((value) => currentTagSets.organisms.has(value)).length;
      const sharedConcepts = tags.concepts.filter((value) => currentTagSets.concepts.has(value)).length;
      const score = sharedSyndromes * 5 + sharedOrganisms * 3 + sharedConcepts;

      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }

      const publishedDelta = getCasePublishedTimestamp(b.item.slug) - getCasePublishedTimestamp(a.item.slug);
      if (publishedDelta !== 0) {
        return publishedDelta;
      }

      return a.item.title.localeCompare(b.item.title);
    })
    .map((entry) => entry.item);

  if (scoredCases.length >= limit) {
    return scoredCases.slice(0, limit);
  }

  const fallbacks = getCasesOrdered("newest").filter((item) => !excludedSlugs.has(item.slug));
  for (const item of fallbacks) {
    if (scoredCases.some((entry) => entry.slug === item.slug)) {
      continue;
    }

    scoredCases.push(item);
    if (scoredCases.length === limit) {
      break;
    }
  }

  return scoredCases.slice(0, limit);
}
