export type SyndromeGroupEntry = {
  moduleId: string;
  label: string;
  shortDescription: string;
};

export type SyndromeGroup = {
  id: string;
  label: string;
  syndromes: SyndromeGroupEntry[];
};

export const SYNDROME_GROUPS: SyndromeGroup[] = [
  {
    id: "respiratory",
    label: "Respiratory",
    syndromes: [
      { moduleId: "cap", label: "CAP", shortDescription: "Community-acquired pneumonia" },
      { moduleId: "vap", label: "VAP", shortDescription: "Ventilator-associated pneumonia" },
      { moduleId: "pjp", label: "PJP", shortDescription: "Pneumocystis pneumonia" },
    ],
  },
  {
    id: "bloodstream",
    label: "Bloodstream",
    syndromes: [
      { moduleId: "endo", label: "Endocarditis", shortDescription: "Infective endocarditis" },
    ],
  },
  {
    id: "invasive_fungal",
    label: "Invasive Fungal",
    syndromes: [
      { moduleId: "inv_candida", label: "Inv. Candida", shortDescription: "Invasive candidiasis" },
      { moduleId: "inv_aspergillosis", label: "Inv. Aspergillosis", shortDescription: "Invasive aspergillosis" },
      { moduleId: "inv_mucormycosis", label: "Mucormycosis", shortDescription: "Mucormycosis (Mucorales)" },
    ],
  },
  {
    id: "gi_gu",
    label: "GI / GU",
    syndromes: [
      { moduleId: "cdi", label: "C. difficile", shortDescription: "C. difficile infection" },
      { moduleId: "uti", label: "UTI", shortDescription: "Urinary tract infection" },
    ],
  },
  {
    id: "msk",
    label: "MSK",
    syndromes: [
      { moduleId: "pji", label: "PJI", shortDescription: "Periprosthetic joint infection" },
    ],
  },
  {
    id: "other",
    label: "Other",
    syndromes: [
      { moduleId: "active_tb", label: "Active TB", shortDescription: "Active tuberculosis" },
    ],
  },
];

export function findGroupForModule(moduleId: string): SyndromeGroup | undefined {
  return SYNDROME_GROUPS.find((g) => g.syndromes.some((s) => s.moduleId === moduleId));
}
