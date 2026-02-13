// lib/lrTypes.ts
export type FindingState = "present" | "absent" | "unknown";

export type LRCategory =
  | "symptom"
  | "vital"
  | "exam"
  | "lab"
  | "imaging"
  | "micro"
  | "host";

export type LRItemKind = "location" | "finding";

export type LRItem = {
  id: string;
  label: string;
  kind?: LRItemKind; // default "finding"
  category: LRCategory;
  lrPos?: number;
  lrNeg?: number;
  group?: string;
  notes?: string;
  source?: LRSource;
};

export type SyndromeLRModule = {
  id: string;
  name: string;
  description?: string;

  // Keep presets for pretest (Location/setting lives here)
  pretestPresets: PretestPreset[];

  // Findings/tests live here
  items: LRItem[];
};


export type LRSource = {
  short: string;
  year?: number;
  url?: string;
};

export type LRItem = {
  id: string;
  label: string;
  category: LRCategory;
  lrPos?: number; // LR+ if present
  lrNeg?: number; // LR− if absent
  group?: string; // mutually exclusive group key (e.g., "cxr")
  notes?: string;
  source?: LRSource;
};

export type PretestPreset = {
  id: string;
  label: string;
  p: number; // 0..1
  notes?: string;
  source?: LRSource;
};

export type SyndromeLRModule = {
  id: string;
  name: string;
  description?: string;
  pretestPresets: PretestPreset[];
  items: LRItem[];
};
