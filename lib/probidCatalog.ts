// lib/probidCatalog.ts
import type { LRItem, SyndromeLRModule } from "@/lib/lrTypes";
import { formatPct } from "@/lib/lrMath";

export type CatalogFamily =
  | "Location"
  | "Symptoms"
  | "Vitals"
  | "Exam"
  | "Imaging"
  | "Labs"
  | "Micro"
  | "Other"
  | "Testing"
  | "Host";

export const FAMILY_ORDER: CatalogFamily[] = [
  "Location",
  "Host",
  "Exam",
  "Symptoms",
  "Vitals",
  "Labs",
  "Micro",
  "Imaging",
  "Other",
];

export function familyFor(it: LRItem): string {
  switch (it.category) {
    case "symptom":
      return "Symptoms";
    case "vital":
      return "Vitals";
    case "exam":
      return "Exam";
    case "imaging":
      return "Imaging";
    case "lab":
      return "Labs";
    case "host":
      return "Host";
    default:
      return "Other";
    case "micro":
        return "Micro";
  }
}


// “Pinned” items per syndrome (starter; tweak to your taste)
export const PINNED_BY_SYNDROME: Record<string, string[]> = {
  cap: ["cap_fever", "cap_rr", "cap_hypox", "cap_crackles", "cap_cxr_pos", "cap_cxr_neg"],
  cdi: ["cdi_abx", "cdi_watery", "cdi_wbc15", "cdi_naat_pos", "cdi_test_neg"],
  uti: ["uti_dysuria", "uti_freq", "ua_le_pos", "ua_nit_pos", "ua_pyuria", "uti_cx_pos"],
  endo: ["endo_fever", "endo_murmur_new", "bcx_typical", "echo_veg", "echo_negative"],
  pji: ["pji_exam_sinus_tract", "pji_crp", "pji_aspiration_low_zone", "pji_aspiration_intermediate_zone", "pji_aspiration_high_zone", "pji_leukocyte_esterase"],
  inv_aspergillosis: ["imi_host_neutropenia_hsct", "imi_ct_halo_sign", "imi_serum_gm_odi10", "imi_bal_gm_odi10", "imi_aspergillus_pcr_bal"],
  inv_mucormycosis: ["muc_host_neutropenia_hsct", "muc_host_dka", "muc_ct_reverse_halo", "muc_mucorales_pcr_bal", "muc_mucorales_pcr_blood"],
};

export function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function matchesQuery(item: LRItem, q: string) {
  const hay = `${item.label} ${item.notes ?? ""}`.toLowerCase();
  return hay.includes(q);
}

// Build a synthetic “catalog list” including location presets
export function buildCatalog(module: SyndromeLRModule) {
  const locations = module.pretestPresets.map((p) => ({
    id: `loc__${p.id}`,
    label: p.label,
    category: "lab" as const, // not used in UI for location; we’ll special-case
    notes: `Pretest ${formatPct(p.p)}`,
  }));

  return { locations, items: module.items };
}
