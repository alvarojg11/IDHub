// lib/probidModules.ts

import type { SyndromeLRModule } from "@/lib/lrTypes";

import {
  CAP_MODULE,
  CDI_MODULE,
  UTI_MODULE,
  ENDO_MODULE,
} from "@/lib/lrSyndromes";


// Adjust paths above if your modules live elsewhere

export const PROBID_MODULES: SyndromeLRModule[] = [
  CAP_MODULE,
  CDI_MODULE,
  UTI_MODULE,
  ENDO_MODULE,
];
