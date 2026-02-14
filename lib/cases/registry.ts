export type CaseMeta = {
  slug: string;        // route segment under /cases
  title: string;       // h1 title
  subtitle?: string;   // optional
  enabled?: boolean;   // optional: hide drafts
};

export const CASES: CaseMeta[] = [
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
].filter((c) => c.enable !== false);

export function getPrevNext(slug: string) {
  const idx = CASES.findIndex((c) => c.slug === slug);
  if (idx === -1) return { prev: null, next: null };

  return {
    prev: idx > 0 ? CASES[idx - 1] : null,
    next: idx < CASES.length - 1 ? CASES[idx + 1] : null,
  };
}
