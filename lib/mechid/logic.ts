// lib/mechid/logic.ts
import type { MaybeSIR, OrganismRules, SIR, CascadeRule } from "./data";

export type ResultMap = Record<string, MaybeSIR>;
export type ConsolidatedRow = { antibiotic: string; result: SIR; source: "User-entered" | "Intrinsic rule" | "Cascade rule" };

export function applyCascade(orgRules: OrganismRules | undefined, inputs: ResultMap): ResultMap {
  if (!orgRules?.cascade?.length) return {};

  const inferred: ResultMap = {};
  const getStatus = (ab: string): MaybeSIR => inputs[ab] ?? inferred[ab] ?? null;

  for (const rule of orgRules.cascade) {
    const tgt = rule.target;
    if (getStatus(tgt) != null) continue;

    const kind = rule.rule;

    if (kind === "same_as") {
      const val = getStatus(rule.ref);
      if (val != null) inferred[tgt] = val;
    }

    if (kind === "sus_if_sus") {
      if (getStatus(rule.ref) === "Susceptible") inferred[tgt] = "Susceptible";
    }

    if (kind === "sus_if_any_sus") {
      if (rule.refs.some((r) => getStatus(r) === "Susceptible")) inferred[tgt] = "Susceptible";
    }

    if (kind === "sus_if_sus_else_res") {
      const val = getStatus(rule.ref);
      if (val === "Susceptible") inferred[tgt] = "Susceptible";
      else if (val != null) inferred[tgt] = "Resistant";
    }

    if (kind === "same_as_else_sus_if_sus") {
      const pv = getStatus(rule.primary);
      if (pv != null) inferred[tgt] = pv;
      else if (getStatus(rule.fallback) === "Susceptible") inferred[tgt] = "Susceptible";
    }
  }

  return inferred;
}

export function consolidateResults(params: {
  panel: string[];
  user: ResultMap;
  orgRules?: OrganismRules;
}): { final: ResultMap; inferred: ResultMap; rows: ConsolidatedRow[]; intrinsic: string[] } {
  const { panel, user, orgRules } = params;
  const intrinsic = orgRules?.intrinsic_resistance ?? [];

  const inferred = applyCascade(orgRules, user);

  // final = user + inferred + intrinsic forced R
  const final: ResultMap = {};
  for (const ab of panel) {
    const v = inferred[ab] ?? user[ab] ?? null;
    final[ab] = v;
  }
  for (const ab of intrinsic) final[ab] = "Resistant";

  // build table rows (only show non-null)
  const rows: ConsolidatedRow[] = [];
  for (const ab of panel) {
    const v = final[ab];
    if (v == null) continue;

    let source: ConsolidatedRow["source"] = "User-entered";
    if (intrinsic.includes(ab)) source = "Intrinsic rule";
    else if (inferred[ab] != null && (user[ab] == null || user[ab] === null)) source = "Cascade rule";

    rows.push({ antibiotic: ab, result: v as SIR, source });
  }

  return { final, inferred, rows, intrinsic };
}

/**
 * Mechanisms / Therapy registry
 * Paste your existing functions here, but converted to TS.
 * Start small: add E. coli + Serratia + Pseudomonas first.
 */
export type MechOut = {
  mechs: string[];
  banners: string[];
  greens: string[];
  therapy: string[];
};

export type OrganismEngine = (final: ResultMap) => MechOut;

const dedup = (items: string[]) => Array.from(new Set(items.filter(Boolean)));

const get = (R: ResultMap, ab: string) => R[ab] ?? null;
const anyR = (R: ResultMap, names: string[]) => names.some((n) => R[n] === "Resistant");
const anyS = (R: ResultMap, names: string[]) => names.some((n) => R[n] === "Susceptible");

const CARBAPENEMS = ["Imipenem", "Meropenem", "Ertapenem", "Doripenem"];
const THIRD_GENS = ["Ceftriaxone", "Cefotaxime", "Ceftazidime", "Cefpodoxime"];

/** Example: E. coli (you can paste your full text exactly; this is already close to what you wrote) */
function ecoliEngine(final: ResultMap): MechOut {
  const mechs: string[] = [];
  const banners: string[] = [];
  const greens: string[] = [];
  const therapy: string[] = [];

  const carpR = anyR(final, CARBAPENEMS);
  const thirdR = anyR(final, THIRD_GENS);
  const cefepimeR = get(final, "Cefepime") === "Resistant";
  const ctxS = get(final, "Ceftriaxone") === "Susceptible";
  const cefazolinR = get(final, "Cefazolin") === "Resistant";
  const ampR = get(final, "Ampicillin") === "Resistant";
  const caz = get(final, "Ceftazidime");

  if (carpR) mechs.push("Carbapenem resistance (screen for carbapenemase; confirm by phenotypic/molecular tests).");
  else if (thirdR) mechs.push("ESBL pattern (3rd-generation cephalosporin resistance).");

  if (!carpR && cefazolinR && ctxS && ampR && (caz == null || (caz !== "Resistant" && caz !== "Intermediate"))) {
    banners.push("β-lactam pattern **Amp R + Cefazolin R + Ceftriaxone S** → **broad-spectrum β-lactamase (TEM-1/SHV)**, not ESBL.");
  }

  if (!carpR && cefepimeR && ctxS) {
    mechs.push("Uncommon: **Cefepime R** with **Ceftriaxone S** — consider ESBL variant/porin–efflux/testing factors.");
  }

  if (get(final, "Ertapenem") === "Resistant" && (get(final, "Imipenem") === "Susceptible" || get(final, "Meropenem") === "Susceptible")) {
    banners.push("**Ertapenem R** with **Imipenem/Meropenem S** → often ESBL or AmpC + porin loss.");
  }

  const cip = get(final, "Ciprofloxacin");
  const lev = get(final, "Levofloxacin");
  if (cip === "Resistant" || lev === "Resistant") {
    mechs.push(
      "Fluoroquinolone resistance: typically **QRDR mutations** in **gyrA/parC** ± **efflux upregulation** (AcrAB–TolC / OqxAB) and sometimes **plasmid-mediated qnr / AAC(6')-Ib-cr**."
    );
  }
  if (cip === "Resistant" && lev === "Susceptible") {
    mechs.push(
      "Fluoroquinolone discordance: **Ciprofloxacin R** with **Levofloxacin S** — suggests **PMQR/efflux** phenotype; can **step up** to high-level resistance on therapy."
    );
    banners.push("Caution using **levofloxacin** despite apparent susceptibility — PMQR/efflux phenotypes carry higher risk of on-therapy failure.");
  }

  const tmpsmx = get(final, "Trimethoprim/Sulfamethoxazole");
  if (tmpsmx === "Resistant") {
    mechs.push("TMP-SMX resistance: **dfrA** + **sul1/sul2** (often integrons); efflux/target mutation can contribute.");
  }

  // Therapy heuristics (keep yours; abbreviated here)
  if (anyS(final, ["Piperacillin/Tazobactam", "Ceftriaxone", "Cefepime", "Aztreonam", "Imipenem", "Meropenem", "Ertapenem"]) && anyR(final, ["Ciprofloxacin", "Levofloxacin"])) {
    therapy.push("**Fluoroquinolone R but β-lactam S** → prefer a **β-lactam** that is susceptible.");
  }
  if (anyR(final, THIRD_GENS) && !anyR(final, CARBAPENEMS)) therapy.push("**ESBL pattern** → use a **carbapenem** for serious infections.");
  if (tmpsmx === "Susceptible") therapy.push("**TMP-SMX susceptible** → reasonable **oral step-down** option in selected scenarios; avoid as sole therapy in severe sepsis/uncontrolled bacteremia.");

  return {
    mechs: dedup(mechs),
    banners: dedup(banners),
    greens: dedup(greens),
    therapy: dedup(therapy),
  };
}

// Add this into lib/mechid/logic.ts (below ecoliEngine is fine)

// Serratia marcescens: port of your Python mech_serratia + tx_serratia
function serratiaEngine(final: ResultMap): MechOut {
  const mechs: string[] = [];
  const banners: string[] = [];
  const greens: string[] = [];
  const therapy: string[] = [];

  // Core drugs
  const imi = get(final, "Imipenem");
  const mero = get(final, "Meropenem");
  const ept = get(final, "Ertapenem");
  const ctx = get(final, "Ceftriaxone");
  const fep = get(final, "Cefepime");
  const caz = get(final, "Ceftazidime");
  const cefox = get(final, "Cefoxitin");

  const carpR = anyR(final, ["Imipenem", "Meropenem", "Ertapenem"]);
  const thirdR = anyR(final, THIRD_GENS); // ceftriaxone/cefotaxime/ceftazidime/cefpodoxime

  const ctxS = ctx === "Susceptible";
  const fepS = fep === "Susceptible";
  const cazS = caz === "Susceptible";

  // ---- Serratia baseline teaching point ----
  mechs.push(
    "*Serratia marcescens* has an **inducible chromosomal AmpC β-lactamase**, so it is typically **resistant to ampicillin and 1st-generation cephalosporins**."
  );

  // If cefoxitin is tested, use it as an AmpC signal comment (not all labs report it)
  if (cefox === "Intermediate" || cefox === "Resistant") {
    banners.push(
      "**Cefoxitin non-susceptible** supports an **AmpC** signal (common in *Serratia*). Interpret 3rd-gen cephalosporins carefully in serious infections."
    );
  }

  // ---- ESBL pattern (not the main baseline issue for Serratia, but can happen) ----
  if (thirdR && !carpR) {
    mechs.push(
      "3rd-generation cephalosporin resistance pattern — consider **ESBL** and/or **AmpC derepression**; confirm per lab policy."
    );
  }

  // ---- Carbapenem resistance: include SME/chromosomal possibility + preserved cephalosporins ----
  if (carpR) {
    mechs.push(
      "Carbapenem resistance in *Serratia*: evaluate for **carbapenemase**. This can be due to **chromosomal SME-type carbapenemase**, or acquired enzymes (e.g., **KPC**) depending on epidemiology."
    );

    // Key phenotype: carbapenem R but some cephalosporins still S
    if (ctxS || fepS || cazS) {
      banners.push(
        "Carbapenem R with **some cephalosporins still susceptible** can occur in *Serratia* (e.g., **SME-type chromosomal carbapenemase** phenotypes). **Do not assume all cephalosporins are inactive** — treat according to **specific reported susceptibilities** and confirm mechanism."
      );
    }
  }

  // ---- “Ceftriaxone acceptable when susceptible” ----
  if (!carpR && ctxS) {
    greens.push(
      "If **ceftriaxone is susceptible**, it can be used for *S. marcescens* in many scenarios; *Serratia* is often considered **lower risk for clinically significant AmpC induction** than classic AmpC inducers (still use clinical judgment for severe/high-inoculum infections)."
    );
  }

  // ---- Ertapenem R with IMI/MEM S ----
  if (
    ept === "Resistant" &&
    (imi === "Susceptible" || mero === "Susceptible")
  ) {
    banners.push(
      "**Ertapenem R** with **Imipenem/Meropenem S** → can reflect **β-lactamase + permeability changes**; confirm and select therapy by **tested carbapenem MICs/site**."
    );
  }

  // ---- Fluoroquinolones ----
  const cip = get(final, "Ciprofloxacin");
  const lev = get(final, "Levofloxacin");

  if (cip === "Resistant" || lev === "Resistant") {
    mechs.push(
      "Fluoroquinolone resistance: typically **QRDR mutations** (gyrA/parC) ± **efflux upregulation**; sometimes **plasmid-mediated qnr / AAC(6')-Ib-cr**."
    );
  }

  if (cip === "Resistant" && lev === "Susceptible") {
    mechs.push(
      "FQ discordance (**Ciprofloxacin R / Levofloxacin S**) suggests **low-level non-target mechanisms** (e.g., **PMQR** such as **qnr** or **AAC(6')-Ib-cr**) and/or **efflux**. These can **step up during therapy** with additional QRDR mutations."
    );
    banners.push(
      "Use **levofloxacin** cautiously despite S — higher risk of **on-therapy failure** with PMQR/efflux phenotypes, especially for invasive disease."
    );
  }

  // ---- TMP-SMX ----
  const tmpsmx = get(final, "Trimethoprim/Sulfamethoxazole");
  if (tmpsmx === "Resistant") {
    mechs.push(
      "TMP-SMX resistance: **dfrA** (DHFR) and/or **sul1/sul2** (DHPS), often on **class 1 integrons**."
    );
  } else if (tmpsmx === "Susceptible") {
    greens.push("TMP-SMX is **susceptible** — may be an oral option depending on site/severity.");
  }

  // ======================
  // Therapy (tx_serratia)
  // ======================

  const anyCephS = [ctx, fep, caz].some((x) => x === "Susceptible");

  // Prefer β-lactam when FQ resistant and BL susceptible
  if (
    anyS(final, [
      "Ceftriaxone",
      "Cefepime",
      "Ceftazidime",
      "Piperacillin/Tazobactam",
      "Aztreonam",
      "Imipenem",
      "Meropenem",
      "Ertapenem",
    ]) &&
    anyR(final, ["Ciprofloxacin", "Levofloxacin", "Moxifloxacin"])
  ) {
    therapy.push("**Fluoroquinolone R but β-lactam S** → prefer a **β-lactam** that is susceptible.");
  }

  // ESBL / 3rd-gen resistance without carbapenem resistance
  if (anyR(final, THIRD_GENS) && !carpR) {
    therapy.push(
      "3rd-gen cephalosporin resistance → for serious infections, choose a **reliably active agent** (often **cefepime** if susceptible/MIC appropriate or a **carbapenem** depending on local guidance)."
    );
  }

  // Carbapenem resistance but cephalosporins still susceptible (SME-like phenotype)
  if (carpR && anyCephS) {
    const choices: string[] = [];
    if (ctx === "Susceptible") choices.push("**ceftriaxone**");
    if (fep === "Susceptible") choices.push("**cefepime**");
    if (caz === "Susceptible") choices.push("**ceftazidime**");

    therapy.push(
      `**Carbapenem R with cephalosporin S** can occur in *Serratia* (e.g., **SME-type chromosomal carbapenemase** phenotypes). Use a susceptible cephalosporin: ${choices.join(
        ", "
      )} (dose by site/MIC/severity) and confirm mechanism with lab/ID.`
    );
  } else if (carpR) {
    therapy.push(
      "**Carbapenem resistance present** → prioritize confirmed actives; request **carbapenemase workup** and involve **ID** for invasive disease."
    );
  }

  // Ertapenem R / IMI or MEM S
  if (
    ept === "Resistant" &&
    (imi === "Susceptible" || mero === "Susceptible")
  ) {
    therapy.push(
      "**Ertapenem R / IMI or MEM S** → select based on **tested MICs**; consider **optimized meropenem dosing** when appropriate."
    );
  }

  // FQ discordance: CIP R / LEV S
  if (cip === "Resistant" && lev === "Susceptible") {
    therapy.push(
      "**Ciprofloxacin R / Levofloxacin S** → levofloxacin *may* be used for selected **low-risk** scenarios if no better oral options, but **failure risk is higher** (PMQR/efflux). Prefer a confirmed-active **β-lactam** for **severe/invasive** infections."
    );
  }

  // TMP-SMX oral step-down
  if (tmpsmx === "Susceptible") {
    therapy.push(
      "**TMP-SMX susceptible** → possible **oral step-down** in selected cases once improving and source controlled (site/severity dependent; avoid as sole therapy for uncontrolled bacteremia/severe sepsis)."
    );
  }

  return {
    mechs: dedup(mechs),
    banners: dedup(banners),
    greens: dedup(greens),
    therapy: dedup(therapy),
  };
}

// Then register it in ORGANISM_ENGINES:

export const ORGANISM_ENGINES: Record<string, OrganismEngine> = {
  "Escherichia coli": ecoliEngine,
  "Serratia marcescens": serratiaEngine,
  // ...
};


export function runOrganism(org: string, final: ResultMap): MechOut {
  const fn = ORGANISM_ENGINES[org];
  if (!fn) return { mechs: [], banners: [], greens: [], therapy: [] };
  return fn(final);
}
