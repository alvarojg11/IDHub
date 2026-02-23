// components/ProbIDTool.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { FindingState, LRItem, SyndromeLRModule } from "@/lib/lrTypes";
import { combinedLR, postTestProb, buildStepwisePath, formatPct, clamp } from "@/lib/lrMath";
import { deriveDecisionThresholds, estimateHarms } from "@/lib/probidDecision";
import { FaganChart } from "@/components/FaganChart";
import { LRItemToggle } from "@/components/LRItemToggle";
import { FAMILY_ORDER, familyFor, matchesQuery, normalize } from "@/lib/probidCatalog";
import Link from "next/link";

type Props = {
  modules: SyndromeLRModule[];
  defaultModuleId?: string;
};

type VirstaAcquisition = "nosocomial" | "community_or_nhca";
type HandocSpecies =
  | "unspecified_other"
  | "s_anginosus_group"
  | "s_gallolyticus_bovis_group"
  | "s_mutans_group"
  | "s_sanguinis_group"
  | "s_mitis_oralis_group"
  | "s_salivarius_group";

const HANDOC_SPECIES_POINTS: Record<HandocSpecies, number> = {
  unspecified_other: 0,
  s_anginosus_group: -1,
  s_gallolyticus_bovis_group: 1,
  s_mutans_group: 1,
  s_sanguinis_group: 1,
  s_mitis_oralis_group: 0,
  s_salivarius_group: 0,
};

const ENDO_SCORE_ITEM_IDS = [
  "endo_virsta_high",
  "endo_virsta_na",
  "endo_denova_high",
  "endo_denova_na",
  "endo_handoc_high",
  "endo_handoc_na",
] as const;

type VapRiskFactorId =
  | "male_sex"
  | "copd"
  | "trauma"
  | "impaired_consciousness"
  | "prior_antibiotics"
  | "reintubation"
  | "tracheostomy"
  | "enteral_feeding"
  | "nasogastric_tube"
  | "h2_blocker";

type VapRiskFactorOption = {
  id: VapRiskFactorId;
  label: string;
  pooledOr: number;
  notes?: string;
};

const VAP_RISK_FACTOR_OPTIONS: VapRiskFactorOption[] = [
  { id: "male_sex", label: "Male sex", pooledOr: 1.3 },
  { id: "copd", label: "COPD", pooledOr: 1.52 },
  { id: "trauma", label: "Trauma admission", pooledOr: 1.47 },
  { id: "impaired_consciousness", label: "Impaired consciousness (admission)", pooledOr: 3.14 },
  { id: "prior_antibiotics", label: "Prior antibiotics", pooledOr: 1.52 },
  { id: "reintubation", label: "Reintubation", pooledOr: 5.11 },
  { id: "tracheostomy", label: "Tracheostomy", pooledOr: 3.44 },
  { id: "enteral_feeding", label: "Enteral feeding", pooledOr: 4.73 },
  { id: "nasogastric_tube", label: "Nasogastric tube", pooledOr: 2.94 },
  { id: "h2_blocker", label: "H2 blocker exposure", pooledOr: 2.24 },
];

const DEFAULT_VAP_RISK_STATE: Record<VapRiskFactorId, boolean> = {
  male_sex: false,
  copd: false,
  trauma: false,
  impaired_consciousness: false,
  prior_antibiotics: false,
  reintubation: false,
  tracheostomy: false,
  enteral_feeding: false,
  nasogastric_tube: false,
  h2_blocker: false,
};

// ORs from incidence/risk-factor meta-analysis are not diagnostic LRs.
// We apply them as a conservative odds-space pretest modifier with shrinkage + cap.
const VAP_RISK_OR_SHRINK_EXPONENT = 0.5;
const VAP_RISK_MAX_MULTIPLIER = 6;

type EndoRiskFactorId =
  | "ivdu"
  | "prosthetic_valve"
  | "prior_endo"
  | "structural_valve_disease"
  | "chd"
  | "cied"
  | "hemodialysis";

type EndoRiskFactorOption = {
  id: EndoRiskFactorId;
  label: string;
  orLike: number;
  group: "general_ie" | "sab_context";
};

const ENDO_RISK_FACTOR_OPTIONS: EndoRiskFactorOption[] = [
  { id: "prosthetic_valve", label: "Prosthetic valve", orLike: 2.5, group: "general_ie" },
  { id: "chd", label: "Congenital heart disease", orLike: 1.8, group: "general_ie" },
  { id: "hemodialysis", label: "Hemodialysis", orLike: 2.0, group: "general_ie" },
  { id: "ivdu", label: "Injection drug use", orLike: 2.5, group: "sab_context" },
  { id: "prior_endo", label: "Prior endocarditis", orLike: 2.5, group: "sab_context" },
  { id: "structural_valve_disease", label: "Known structural/native valve disease", orLike: 1.8, group: "sab_context" },
  { id: "cied", label: "Cardiac device (CIED/ICD/pacemaker)", orLike: 2.2, group: "sab_context" },
];

const DEFAULT_ENDO_RISK_STATE: Record<EndoRiskFactorId, boolean> = {
  ivdu: false,
  prosthetic_valve: false,
  prior_endo: false,
  structural_valve_disease: false,
  chd: false,
  cied: false,
  hemodialysis: false,
};

const ENDO_RISK_OR_SHRINK_EXPONENT = 0.5;
const ENDO_RISK_MAX_MULTIPLIER = 5;

function byId(mods: SyndromeLRModule[], id?: string) {
  if (!id) return mods[0];
  return mods.find((m) => m.id === id) ?? mods[0];
}

export function ProbIDTool({ modules, defaultModuleId }: Props) {
  // Syndrome
  const [moduleId, setModuleId] = useState(byId(modules, defaultModuleId)?.id ?? modules[0]?.id);
  const activeModule = useMemo(() => byId(modules, moduleId), [modules, moduleId]);

  // Location (pretest)
  const [presetId, setPresetId] = useState(activeModule.pretestPresets[0]?.id ?? "");

  // Item states + step order
  const [states, setStates] = useState<Record<string, FindingState>>({});
  const [clickOrder, setClickOrder] = useState<string[]>([]);

  // Catalog modal (2-pane)
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogQuery, setCatalogQuery] = useState("");
  const [activeFamily, setActiveFamily] = useState<string>("Location");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  // VAP pretest risk modifiers (OR-informed, applied before diagnostic LR stack)
  const [useVapRiskModifiers, setUseVapRiskModifiers] = useState(false);
  const [vapRiskState, setVapRiskState] = useState<Record<VapRiskFactorId, boolean>>(DEFAULT_VAP_RISK_STATE);
  const [useEndoRiskModifiers, setUseEndoRiskModifiers] = useState(false);
  const [endoRiskState, setEndoRiskState] = useState<Record<EndoRiskFactorId, boolean>>(DEFAULT_ENDO_RISK_STATE);

  // Endocarditis score autocompute controls
  const [useVirsta, setUseVirsta] = useState(false);
  const [virstaEmboli, setVirstaEmboli] = useState(false);
  const [virstaMeningitis, setVirstaMeningitis] = useState(false);
  const [virstaIntracardiacDevice, setVirstaIntracardiacDevice] = useState(false);
  const [virstaPriorEndocarditis, setVirstaPriorEndocarditis] = useState(false);
  const [virstaNativeValveDisease, setVirstaNativeValveDisease] = useState(false);
  const [virstaIvdu, setVirstaIvdu] = useState(false);
  const [virstaPersistentBacteremia48h, setVirstaPersistentBacteremia48h] = useState(false);
  const [virstaVertebralOsteomyelitis, setVirstaVertebralOsteomyelitis] = useState(false);
  const [virstaAcquisition, setVirstaAcquisition] = useState<VirstaAcquisition>("nosocomial");
  const [virstaSevereSepsisShock, setVirstaSevereSepsisShock] = useState(false);
  const [virstaCrpGt190, setVirstaCrpGt190] = useState(false);

  const [useDenova, setUseDenova] = useState(false);
  const [denovaDuration7d, setDenovaDuration7d] = useState(false);
  const [denovaEmbolization, setDenovaEmbolization] = useState(false);
  const [denovaNumPositive2, setDenovaNumPositive2] = useState(false);
  const [denovaOriginUnknown, setDenovaOriginUnknown] = useState(false);
  const [denovaValveDisease, setDenovaValveDisease] = useState(false);
  const [denovaAuscultationMurmur, setDenovaAuscultationMurmur] = useState(false);

  const [useHandoc, setUseHandoc] = useState(false);
  const [handocHeartMurmurValve, setHandocHeartMurmurValve] = useState(false);
  const [handocSpecies, setHandocSpecies] = useState<HandocSpecies>("unspecified_other");
  const [handocNumPositive2, setHandocNumPositive2] = useState(false);
  const [handocDuration7d, setHandocDuration7d] = useState(false);
  const [handocOnlyOneSpecies, setHandocOnlyOneSpecies] = useState(false);
  const [handocCommunityAcquired, setHandocCommunityAcquired] = useState(false);

  // Reset when syndrome changes
  useEffect(() => {
    setPresetId(activeModule.pretestPresets[0]?.id ?? "");
    setStates({});
    setClickOrder([]);
    setCatalogQuery("");
    setActiveFamily("Location");
    setShowSelectedOnly(false);
    setUseVapRiskModifiers(false);
    setVapRiskState(DEFAULT_VAP_RISK_STATE);
    setUseEndoRiskModifiers(false);
    setEndoRiskState(DEFAULT_ENDO_RISK_STATE);
    setUseVirsta(false);
    setVirstaEmboli(false);
    setVirstaMeningitis(false);
    setVirstaIntracardiacDevice(false);
    setVirstaPriorEndocarditis(false);
    setVirstaNativeValveDisease(false);
    setVirstaIvdu(false);
    setVirstaPersistentBacteremia48h(false);
    setVirstaVertebralOsteomyelitis(false);
    setVirstaAcquisition("nosocomial");
    setVirstaSevereSepsisShock(false);
    setVirstaCrpGt190(false);
    setUseDenova(false);
    setDenovaDuration7d(false);
    setDenovaEmbolization(false);
    setDenovaNumPositive2(false);
    setDenovaOriginUnknown(false);
    setDenovaValveDisease(false);
    setDenovaAuscultationMurmur(false);
    setUseHandoc(false);
    setHandocHeartMurmurValve(false);
    setHandocSpecies("unspecified_other");
    setHandocNumPositive2(false);
    setHandocDuration7d(false);
    setHandocOnlyOneSpecies(false);
    setHandocCommunityAcquired(false);
  }, [activeModule]);

  // Derived pretest/posttest
  const preset = activeModule.pretestPresets.find((p) => p.id === presetId) ?? activeModule.pretestPresets[0];
  const basePretestP = clamp(preset?.p ?? 0.05, 0.001, 0.999);

  const vapSelectedRiskFactors = useMemo(
    () => VAP_RISK_FACTOR_OPTIONS.filter((opt) => vapRiskState[opt.id]),
    [vapRiskState]
  );
  const endoSelectedRiskFactors = useMemo(
    () => ENDO_RISK_FACTOR_OPTIONS.filter((opt) => endoRiskState[opt.id]),
    [endoRiskState]
  );
  const endoAppliedRiskFactors = useMemo(
    () =>
      endoSelectedRiskFactors.filter((opt) => !(useVirsta && opt.group === "sab_context")),
    [endoSelectedRiskFactors, useVirsta]
  );
  const endoSuppressedRiskFactors = useMemo(
    () =>
      endoSelectedRiskFactors.filter((opt) => useVirsta && opt.group === "sab_context"),
    [endoSelectedRiskFactors, useVirsta]
  );

  const vapRiskRawMultiplier = useMemo(() => {
    if (activeModule.id !== "vap" || !useVapRiskModifiers) return 1;
    return vapSelectedRiskFactors.reduce((acc, rf) => acc * rf.pooledOr, 1);
  }, [activeModule.id, useVapRiskModifiers, vapSelectedRiskFactors]);

  const vapRiskAppliedMultiplier = useMemo(() => {
    if (activeModule.id !== "vap" || !useVapRiskModifiers) return 1;
    const shrunk = Math.pow(vapRiskRawMultiplier, VAP_RISK_OR_SHRINK_EXPONENT);
    return clamp(shrunk, 1, VAP_RISK_MAX_MULTIPLIER);
  }, [activeModule.id, useVapRiskModifiers, vapRiskRawMultiplier]);

  const endoRiskRawMultiplier = useMemo(() => {
    if (activeModule.id !== "endo" || !useEndoRiskModifiers) return 1;
    return endoAppliedRiskFactors.reduce((acc, rf) => acc * rf.orLike, 1);
  }, [activeModule.id, useEndoRiskModifiers, endoAppliedRiskFactors]);

  const endoRiskAppliedMultiplier = useMemo(() => {
    if (activeModule.id !== "endo" || !useEndoRiskModifiers) return 1;
    const shrunk = Math.pow(endoRiskRawMultiplier, ENDO_RISK_OR_SHRINK_EXPONENT);
    return clamp(shrunk, 1, ENDO_RISK_MAX_MULTIPLIER);
  }, [activeModule.id, useEndoRiskModifiers, endoRiskRawMultiplier]);

  const pretestP = useMemo(() => {
    const odds = basePretestP / (1 - basePretestP);
    let adjustedOdds = odds;
    if (activeModule.id === "vap" && useVapRiskModifiers) {
      adjustedOdds *= vapRiskAppliedMultiplier;
    }
    if (activeModule.id === "endo" && useEndoRiskModifiers) {
      adjustedOdds *= endoRiskAppliedMultiplier;
    }
    return clamp(adjustedOdds / (1 + adjustedOdds), 0.001, 0.999);
  }, [
    activeModule.id,
    basePretestP,
    useVapRiskModifiers,
    vapRiskAppliedMultiplier,
    useEndoRiskModifiers,
    endoRiskAppliedMultiplier,
  ]);
  const showAdjustedPretest =
    (activeModule.id === "vap" && useVapRiskModifiers) ||
    (activeModule.id === "endo" && useEndoRiskModifiers);

  const itemsById = useMemo(() => new Map(activeModule.items.map((i) => [i.id, i])), [activeModule.items]);

  const lr = useMemo(() => combinedLR(activeModule.items, states), [activeModule.items, states]);
  const postP = useMemo(() => postTestProb(pretestP, lr), [pretestP, lr]);
  const harmStates = useMemo(() => {
    if (activeModule.id !== "endo" || !useEndoRiskModifiers) return states;
    return {
      ...states,
      endo_prosthetic_valve: endoRiskState.prosthetic_valve ? "present" : "unknown",
      endo_cied: endoRiskState.cied ? "present" : "unknown",
    } as Record<string, FindingState>;
  }, [activeModule.id, useEndoRiskModifiers, endoRiskState, states]);
  const harmEstimate = useMemo(() => estimateHarms(activeModule.id, harmStates), [activeModule.id, harmStates]);
  const { treatThresholdP: treatmentThresholdP, observeThresholdP } = useMemo(
    () => deriveDecisionThresholds(harmEstimate),
    [harmEstimate]
  );
  const recommendation = postP >= treatmentThresholdP ? "treat" : postP <= observeThresholdP ? "observe" : "test";

  const steps = useMemo(
    () => buildStepwisePath({ pretestP, orderedIds: clickOrder, itemsById, states }),
    [pretestP, clickOrder, itemsById, states]
  );

  // Apply item state w/ group exclusivity + step ordering
  function setItemState(item: LRItem, next: FindingState) {
    setStates((prev) => {
      const out = { ...prev, [item.id]: next };

      // mutual exclusion
      if (item.group && next !== "unknown") {
        for (const other of activeModule.items) {
          if (other.id !== item.id && other.group === item.group) out[other.id] = "unknown";
        }
      }
      return out;
    });

    // step order
    setClickOrder((prev) => {
      const isActivating = next !== "unknown";

      let base = prev;
      if (item.group && isActivating) {
        base = prev.filter((id) => itemsById.get(id)?.group !== item.group);
      }

      if (isActivating) {
        const without = base.filter((id) => id !== item.id);
        return [...without, item.id];
      }
      return base.filter((id) => id !== item.id);
    });
  }

  function isAutoManagedLocked(itemId: string) {
    if (activeModule.id !== "endo") return false;
    if (itemId.startsWith("endo_virsta_")) return useVirsta;
    if (itemId.startsWith("endo_denova_")) return useDenova;
    if (itemId.startsWith("endo_handoc_")) return useHandoc;
    return false;
  }

  function resetAll() {
    setPresetId(activeModule.pretestPresets[0]?.id ?? "");
    setStates({});
    setClickOrder([]);
    setCatalogQuery("");
    setActiveFamily("Location");
    setShowSelectedOnly(false);
    setUseVapRiskModifiers(false);
    setVapRiskState(DEFAULT_VAP_RISK_STATE);
    setUseEndoRiskModifiers(false);
    setEndoRiskState(DEFAULT_ENDO_RISK_STATE);
    setUseVirsta(false);
    setVirstaEmboli(false);
    setVirstaMeningitis(false);
    setVirstaIntracardiacDevice(false);
    setVirstaPriorEndocarditis(false);
    setVirstaNativeValveDisease(false);
    setVirstaIvdu(false);
    setVirstaPersistentBacteremia48h(false);
    setVirstaVertebralOsteomyelitis(false);
    setVirstaAcquisition("nosocomial");
    setVirstaSevereSepsisShock(false);
    setVirstaCrpGt190(false);
    setUseDenova(false);
    setDenovaDuration7d(false);
    setDenovaEmbolization(false);
    setDenovaNumPositive2(false);
    setDenovaOriginUnknown(false);
    setDenovaValveDisease(false);
    setDenovaAuscultationMurmur(false);
    setUseHandoc(false);
    setHandocHeartMurmurValve(false);
    setHandocSpecies("unspecified_other");
    setHandocNumPositive2(false);
    setHandocDuration7d(false);
    setHandocOnlyOneSpecies(false);
    setHandocCommunityAcquired(false);
  }

  // Modal escape-close
  useEffect(() => {
    if (!catalogOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCatalogOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [catalogOpen]);

  function addLocation(pId: string) {
    const p = activeModule.pretestPresets.find((x) => x.id === pId);
    if (!p) return;
    setPresetId(pId);
  }

  function toggleVapRiskFactor(id: VapRiskFactorId) {
    setVapRiskState((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleEndoRiskFactor(id: EndoRiskFactorId) {
    setEndoRiskState((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  // Selected: show everything active (not unknown)
  const activeSelected = useMemo(() => {
    return activeModule.items
      .filter((it) => (states[it.id] ?? "unknown") !== "unknown")
      .map((it) => it.id);
  }, [activeModule.items, states]);

  const virstaScore = useMemo(() => {
    const deviceOrPriorIePoints = virstaIntracardiacDevice || virstaPriorEndocarditis ? 4 : 0;
    const acquisitionPoints = virstaAcquisition === "community_or_nhca" ? 2 : 0;

    return (
      (virstaEmboli ? 5 : 0) +
      (virstaMeningitis ? 5 : 0) +
      deviceOrPriorIePoints +
      (virstaNativeValveDisease ? 3 : 0) +
      (virstaIvdu ? 4 : 0) +
      (virstaPersistentBacteremia48h ? 3 : 0) +
      (virstaVertebralOsteomyelitis ? 2 : 0) +
      acquisitionPoints +
      (virstaSevereSepsisShock ? 1 : 0) +
      (virstaCrpGt190 ? 1 : 0)
    );
  }, [
    virstaAcquisition,
    virstaCrpGt190,
    virstaEmboli,
    virstaIntracardiacDevice,
    virstaIvdu,
    virstaMeningitis,
    virstaNativeValveDisease,
    virstaPersistentBacteremia48h,
    virstaPriorEndocarditis,
    virstaSevereSepsisShock,
    virstaVertebralOsteomyelitis,
  ]);

  const denovaScore = useMemo(
    () =>
      [
        denovaDuration7d,
        denovaEmbolization,
        denovaNumPositive2,
        denovaOriginUnknown,
        denovaValveDisease,
        denovaAuscultationMurmur,
      ].filter(Boolean).length,
    [
      denovaDuration7d,
      denovaEmbolization,
      denovaNumPositive2,
      denovaOriginUnknown,
      denovaValveDisease,
      denovaAuscultationMurmur,
    ]
  );

  const handocScore = useMemo(() => {
    const aetiologyPoints = HANDOC_SPECIES_POINTS[handocSpecies];
    return (
      (handocHeartMurmurValve ? 1 : 0) +
      aetiologyPoints +
      (handocNumPositive2 ? 1 : 0) +
      (handocDuration7d ? 1 : 0) +
      (handocOnlyOneSpecies ? 1 : 0) +
      (handocCommunityAcquired ? 1 : 0)
    );
  }, [
    handocSpecies,
    handocCommunityAcquired,
    handocDuration7d,
    handocHeartMurmurValve,
    handocNumPositive2,
    handocOnlyOneSpecies,
  ]);

  useEffect(() => {
    if (activeModule.id !== "endo") return;

    const autoStates: Record<string, FindingState> = {
      endo_virsta_high: "unknown",
      endo_virsta_na: "unknown",
      endo_denova_high: "unknown",
      endo_denova_na: "unknown",
      endo_handoc_high: "unknown",
      endo_handoc_na: "unknown",
    };

    if (useVirsta) autoStates.endo_virsta_high = virstaScore >= 3 ? "present" : "absent";

    if (useDenova) autoStates.endo_denova_high = denovaScore >= 3 ? "present" : "absent";
    if (useHandoc) autoStates.endo_handoc_high = handocScore >= 3 ? "present" : "absent";

    setStates((prev) => {
      let changed = false;
      const out = { ...prev };
      for (const [id, next] of Object.entries(autoStates)) {
        const current = out[id] ?? "unknown";
        if (current !== next) {
          out[id] = next;
          changed = true;
        }
      }
      return changed ? out : prev;
    });

    setClickOrder((prev) => {
      const out = [...prev];
      let changed = false;
      for (const id of ENDO_SCORE_ITEM_IDS) {
        const desired = autoStates[id] ?? "unknown";
        const idx = out.indexOf(id);
        if (desired === "unknown") {
          if (idx !== -1) {
            out.splice(idx, 1);
            changed = true;
          }
          continue;
        }
        if (idx === -1) {
          out.push(id);
          changed = true;
        }
      }
      return changed ? out : prev;
    });
  }, [
    denovaScore,
    handocScore,
    activeModule.id,
    useDenova,
    useHandoc,
    useVirsta,
    virstaScore,
  ]);

  const catalogQ = normalize(catalogQuery);

  return (
    <div className="mx-auto max-w-6xl py-12">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">ProbID</h1>
      <p className="mt-3 text-gray-700">
        Choose syndrome, location/setting, and features to estimate post-test probability using likelihood ratios.
        (Educational aid—not a guideline.)
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT */}
        <section className="rounded-xl border bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Select features</h2>
            <button type="button" onClick={resetAll} className="text-sm text-gray-600 underline hover:text-gray-900">
              Reset
            </button>
          </div>

          {/* Syndrome toggle */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">Clinical syndrome</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {modules.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModuleId(m.id)}
                  className={[
                    "rounded-full border px-3 py-1 text-sm",
                    m.id === activeModule.id ? "bg-gray-900 text-white border-gray-900" : "hover:bg-gray-50",
                  ].join(" ")}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setCatalogOpen(true)}
              className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Browse catalog →
            </button>
            <p className="mt-2 text-xs text-gray-600">
              Pick location/setting + findings/tests in the catalog. Close it when done.
            </p>
          </div>

          {/* Location summary */}
          <div className="mt-6 rounded-lg border bg-gray-50 p-3 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Location:</span> {preset?.label}
                <span className="ml-2 text-xs text-gray-600">(Pretest {formatPct(basePretestP)})</span>
                {showAdjustedPretest ? (
                  <span className="ml-2 text-xs text-gray-600">
                    (Risk-adjusted {formatPct(pretestP)})
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveFamily("Location");
                  setCatalogOpen(true);
                }}
                className="text-xs text-gray-600 underline hover:text-gray-900"
              >
                change
              </button>
            </div>
          </div>

          {activeModule.id === "vap" ? (
            <div className="mt-6 rounded-lg border bg-gray-50 p-3 text-sm text-gray-700">
              <div className="font-medium text-gray-900">VAP risk modifiers (pretest)</div>
              <p className="mt-1 text-xs text-gray-600">
                Optional: adjust the ICU time-based pretest using pooled VAP risk-factor associations (ORs), then apply
                diagnostic LRs. These are not diagnostic test LRs.
              </p>

              <div className="mt-3 rounded-md border bg-white p-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <input
                    type="checkbox"
                    checked={useVapRiskModifiers}
                    onChange={(e) => setUseVapRiskModifiers(e.target.checked)}
                  />
                  Apply VAP risk-factor pretest adjustment
                </label>

                {useVapRiskModifiers ? (
                  <div className="mt-3 space-y-3">
                    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                      {VAP_RISK_FACTOR_OPTIONS.map((rf) => (
                        <label key={rf.id} className="inline-flex items-center gap-2 text-xs text-gray-700">
                          <input
                            type="checkbox"
                            checked={vapRiskState[rf.id]}
                            onChange={() => toggleVapRiskFactor(rf.id)}
                          />
                          <span>
                            {rf.label} <span className="text-gray-500">(pooled OR {rf.pooledOr.toFixed(2)})</span>
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="rounded border bg-gray-50 px-2 py-2 text-xs text-gray-700 space-y-1">
                      <div>
                        Selected factors: <span className="font-semibold">{vapSelectedRiskFactors.length}</span>
                      </div>
                      <div>
                        Raw OR product: <span className="font-semibold">{vapRiskRawMultiplier.toFixed(2)}</span>
                      </div>
                      <div>
                        Applied multiplier (sqrt shrink + cap):{" "}
                        <span className="font-semibold">{vapRiskAppliedMultiplier.toFixed(2)}</span>
                      </div>
                      <div>
                        Base pretest <span className="font-semibold">{formatPct(basePretestP)}</span> → adjusted pretest{" "}
                        <span className="font-semibold">{formatPct(pretestP)}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-600">
                      Conservative implementation to avoid over-amplifying correlated ICU exposures (for example,
                      reintubation, tracheostomy, enteral feeding, and NGT use).
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {activeModule.id === "endo" ? (
            <div className="mt-6 rounded-lg border bg-gray-50 p-3 text-sm text-gray-700">
              <div className="font-medium text-gray-900">Endocarditis host risk modifiers (pretest)</div>
              <p className="mt-1 text-xs text-gray-600">
                Optional: adjust the setting-based pretest using host-risk associations before applying diagnostic LRs.
                These are pretest modifiers (OR-informed), not diagnostic test LRs.
              </p>

              <div className="mt-3 rounded-md border bg-white p-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <input
                    type="checkbox"
                    checked={useEndoRiskModifiers}
                    onChange={(e) => setUseEndoRiskModifiers(e.target.checked)}
                  />
                  Apply endocarditis host-risk pretest adjustment
                </label>

                {useEndoRiskModifiers ? (
                  <div className="mt-3 space-y-3">
                    <div className="rounded border bg-gray-50 p-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                        General IE Host Risk (pretest)
                      </div>
                      <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                        {ENDO_RISK_FACTOR_OPTIONS.filter((rf) => rf.group === "general_ie").map((rf) => (
                          <label key={rf.id} className="inline-flex items-center gap-2 text-xs text-gray-700">
                            <input
                              type="checkbox"
                              checked={endoRiskState[rf.id]}
                              onChange={() => toggleEndoRiskFactor(rf.id)}
                            />
                            <span>
                              {rf.label} <span className="text-gray-500">(OR-like {rf.orLike.toFixed(2)})</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="rounded border bg-gray-50 p-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                          SAB Context (pretest)
                        </div>
                        {useVirsta ? (
                          <span className="text-[10px] rounded border bg-white px-2 py-0.5 text-gray-600">
                            suppressed while VIRSTA is enabled
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                        {ENDO_RISK_FACTOR_OPTIONS.filter((rf) => rf.group === "sab_context").map((rf) => (
                          <label
                            key={rf.id}
                            className={`inline-flex items-center gap-2 text-xs ${useVirsta ? "text-gray-400" : "text-gray-700"}`}
                          >
                            <input
                              type="checkbox"
                              checked={endoRiskState[rf.id]}
                              onChange={() => toggleEndoRiskFactor(rf.id)}
                              disabled={useVirsta}
                            />
                            <span>
                              {rf.label} <span className="text-gray-500">(OR-like {rf.orLike.toFixed(2)})</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="rounded border bg-gray-50 px-2 py-2 text-xs text-gray-700 space-y-1">
                      <div>
                        Selected factors: <span className="font-semibold">{endoSelectedRiskFactors.length}</span>
                        {endoSuppressedRiskFactors.length > 0 ? (
                          <span className="ml-2 text-gray-500">
                            ({endoSuppressedRiskFactors.length} SAB factor{endoSuppressedRiskFactors.length === 1 ? "" : "s"} excluded by VIRSTA)
                          </span>
                        ) : null}
                      </div>
                      <div>
                        Applied factors: <span className="font-semibold">{endoAppliedRiskFactors.length}</span>
                      </div>
                      <div>
                        Raw multiplier product: <span className="font-semibold">{endoRiskRawMultiplier.toFixed(2)}</span>
                      </div>
                      <div>
                        Applied multiplier (sqrt shrink + cap):{" "}
                        <span className="font-semibold">{endoRiskAppliedMultiplier.toFixed(2)}</span>
                      </div>
                      <div>
                        Base pretest <span className="font-semibold">{formatPct(basePretestP)}</span> → adjusted pretest{" "}
                        <span className="font-semibold">{formatPct(pretestP)}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-600">
                      Conservative implementation to avoid over-amplifying correlated host factors. These values should be
                      curated against score- and organism-specific populations over time.
                    </p>

                    <div className="rounded border bg-white px-2 py-2 text-[11px] text-gray-600 space-y-1">
                      <div className="font-semibold text-gray-700">Sources</div>
                      <div>
                        General IE host-risk context:{" "}
                        <a
                          href="https://doi.org/10.1093/eurheartj/ehad193"
                          target="_blank"
                          rel="noreferrer"
                          className="underline underline-offset-2 hover:text-gray-900"
                        >
                          ESC Endocarditis Guideline (2023)
                        </a>
                      </div>
                      <div>
                        SAB-specific host/context variables overlap with VIRSTA components:{" "}
                        <a
                          href="https://doi.org/10.1016/j.jinf.2016.04.005"
                          target="_blank"
                          rel="noreferrer"
                          className="underline underline-offset-2 hover:text-gray-900"
                        >
                          VIRSTA derivation (Tubiana et al., 2016)
                        </a>
                        {" "}and{" "}
                        <a
                          href="https://doi.org/10.1093/cid/ciaa1844"
                          target="_blank"
                          rel="noreferrer"
                          className="underline underline-offset-2 hover:text-gray-900"
                        >
                          external validation (Peinado-Acevedo et al., 2021)
                        </a>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {activeModule.id === "endo" ? (
            <div className="mt-6 rounded-lg border bg-gray-50 p-3 text-sm text-gray-700">
              <div className="font-medium text-gray-900">Endocarditis score auto-compute</div>
              <p className="mt-1 text-xs text-gray-600">
                Enable a score, mark its components, and ProbID will auto-apply the threshold LR item.
              </p>

              <div className="mt-3 space-y-3">
                <div className="rounded-md border bg-white p-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <input
                      type="checkbox"
                      checked={useVirsta}
                      onChange={(e) => setUseVirsta(e.target.checked)}
                    />
                    VIRSTA (for SAB)
                  </label>

                  {useVirsta ? (
                    <div className="mt-3 space-y-2 text-xs text-gray-700">
                      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                        <label className="inline-flex items-center gap-2">
                          <input type="checkbox" checked={virstaEmboli} onChange={(e) => setVirstaEmboli(e.target.checked)} />
                          Cerebral/peripheral emboli (+5)
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input type="checkbox" checked={virstaMeningitis} onChange={(e) => setVirstaMeningitis(e.target.checked)} />
                          Meningitis (+5)
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={virstaIntracardiacDevice}
                            onChange={(e) => setVirstaIntracardiacDevice(e.target.checked)}
                          />
                          Permanent intracardiac device (+4)
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={virstaPriorEndocarditis}
                            onChange={(e) => setVirstaPriorEndocarditis(e.target.checked)}
                          />
                          Prior endocarditis (+4; shared bucket)
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={virstaNativeValveDisease}
                            onChange={(e) => setVirstaNativeValveDisease(e.target.checked)}
                          />
                          Native valve disease (+3)
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input type="checkbox" checked={virstaIvdu} onChange={(e) => setVirstaIvdu(e.target.checked)} />
                          Injection drug use (+4)
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={virstaPersistentBacteremia48h}
                            onChange={(e) => setVirstaPersistentBacteremia48h(e.target.checked)}
                          />
                          Persistent bacteremia &gt;48h (+3)
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={virstaVertebralOsteomyelitis}
                            onChange={(e) => setVirstaVertebralOsteomyelitis(e.target.checked)}
                          />
                          Vertebral osteomyelitis (+2)
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={virstaSevereSepsisShock}
                            onChange={(e) => setVirstaSevereSepsisShock(e.target.checked)}
                          />
                          Severe sepsis / septic shock (+1)
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={virstaCrpGt190}
                            onChange={(e) => setVirstaCrpGt190(e.target.checked)}
                          />
                          CRP &gt;190 mg/L (+1)
                        </label>
                      </div>

                      <label className="space-y-1 block">
                        <span className="block text-[11px] uppercase tracking-wide text-gray-500">Acquisition</span>
                        <select
                          value={virstaAcquisition}
                          onChange={(e) => setVirstaAcquisition(e.target.value as VirstaAcquisition)}
                          className="w-full rounded border px-2 py-1 text-xs"
                        >
                          <option value="nosocomial">Nosocomial (0)</option>
                          <option value="community_or_nhca">Community or non-nosocomial healthcare-associated (+2)</option>
                        </select>
                      </label>

                      <div className="rounded border bg-gray-50 px-2 py-1">
                        VIRSTA score: <span className="font-semibold">{virstaScore}</span> (high if &gt;=3)
                      </div>
                      {useEndoRiskModifiers ? (
                        <div className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-900">
                          SAB-context host-risk modifiers in the pretest panel are suppressed while VIRSTA is enabled to avoid overlap.
                        </div>
                      ) : null}
                      <div className="text-[11px] text-gray-600">
                        Auto-applies the <span className="font-semibold">VIRSTA &gt;=3</span> LR item for SAB.
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-md border bg-white p-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <input
                      type="checkbox"
                      checked={useDenova}
                      onChange={(e) => setUseDenova(e.target.checked)}
                    />
                    DENOVA (for E. faecalis bacteremia)
                  </label>

                  {useDenova ? (
                    <div className="mt-3 space-y-2 text-xs text-gray-700">
                      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={denovaDuration7d} onChange={(e) => setDenovaDuration7d(e.target.checked)} />Duration of symptoms &gt;=7 days</label>
                        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={denovaEmbolization} onChange={(e) => setDenovaEmbolization(e.target.checked)} />Embolization</label>
                        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={denovaNumPositive2} onChange={(e) => setDenovaNumPositive2(e.target.checked)} />Number of positive cultures &gt;=2</label>
                        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={denovaOriginUnknown} onChange={(e) => setDenovaOriginUnknown(e.target.checked)} />Origin unknown</label>
                        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={denovaValveDisease} onChange={(e) => setDenovaValveDisease(e.target.checked)} />Valve disease</label>
                        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={denovaAuscultationMurmur} onChange={(e) => setDenovaAuscultationMurmur(e.target.checked)} />Auscultation murmur</label>
                      </div>
                      <div className="rounded border bg-gray-50 px-2 py-1">
                        DENOVA score: <span className="font-semibold">{denovaScore}</span> (high if &gt;=3)
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-md border bg-white p-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <input
                      type="checkbox"
                      checked={useHandoc}
                      onChange={(e) => setUseHandoc(e.target.checked)}
                    />
                    HANDOC (for NBHS bacteremia)
                  </label>

                  {useHandoc ? (
                    <div className="mt-3 space-y-2 text-xs text-gray-700">
                      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={handocHeartMurmurValve} onChange={(e) => setHandocHeartMurmurValve(e.target.checked)} />Heart murmur or valve disease</label>
                        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={handocNumPositive2} onChange={(e) => setHandocNumPositive2(e.target.checked)} />Number of positive cultures &gt;=2</label>
                        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={handocDuration7d} onChange={(e) => setHandocDuration7d(e.target.checked)} />Duration of symptoms &gt;=7 days</label>
                        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={handocOnlyOneSpecies} onChange={(e) => setHandocOnlyOneSpecies(e.target.checked)} />Only one species in blood cultures</label>
                        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={handocCommunityAcquired} onChange={(e) => setHandocCommunityAcquired(e.target.checked)} />Community acquisition</label>
                      </div>

                      <label className="space-y-1">
                        <span className="block text-[11px] uppercase tracking-wide text-gray-500">Species (Aetiology)</span>
                        <select
                          value={handocSpecies}
                          onChange={(e) => setHandocSpecies(e.target.value as HandocSpecies)}
                          className="w-full rounded border px-2 py-1 text-xs"
                        >
                          <option value="unspecified_other">Other / unspecified NBHS (0)</option>
                          <option value="s_anginosus_group">S. anginosus group (-1)</option>
                          <option value="s_gallolyticus_bovis_group">S. gallolyticus (bovis) group (+1)</option>
                          <option value="s_mutans_group">S. mutans group (+1)</option>
                          <option value="s_sanguinis_group">S. sanguinis group (+1)</option>
                          <option value="s_mitis_oralis_group">S. mitis / S. oralis group (0)</option>
                          <option value="s_salivarius_group">S. salivarius group (0)</option>
                        </select>
                      </label>

                      <div className="rounded border bg-gray-50 px-2 py-1">
                        HANDOC score: <span className="font-semibold">{handocScore}</span> (high if &gt;=3)
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          {/* Selected */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700">Selected findings/tests</p>

            {activeSelected.length === 0 ? (
              <p className="mt-2 text-sm text-gray-600">None selected yet. Open the catalog to add.</p>
            ) : (
              <div className="mt-3 divide-y rounded-lg border bg-white">
                {activeSelected.map((id) => {
                  const it = itemsById.get(id);
                  if (!it) return null;
                  const locked = isAutoManagedLocked(it.id);
                  return (
                    <div key={id} className="px-3 py-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <LRItemToggle
                            item={it}
                            state={states[it.id] ?? "unknown"}
                            disabled={locked}
                            onChange={(next) => setItemState(it, next)}
                          />
                        </div>

                        <button
                          type="button"
                          disabled={locked}
                          onClick={() => setItemState(it, "unknown")}
                          className="mt-1 shrink-0 rounded-md border px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* MIDDLE */}
        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Stepwise update</h2>

          {steps.length === 0 ? (
            <p className="mt-4 text-gray-700">Choose findings/tests to see stepwise probability updates.</p>
          ) : (
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <div>
                Start: <span className="font-semibold">{formatPct(pretestP)}</span>
                {showAdjustedPretest ? (
                  <span className="ml-2 text-xs text-gray-600">(base {formatPct(basePretestP)})</span>
                ) : null}
              </div>
              <ol className="mt-2 space-y-2">
                {steps.map((s, idx) => (
                  <li key={s.id} className="rounded-lg border bg-gray-50 p-3">
                    <div className="font-medium text-gray-900">
                      {idx + 1}. {s.label}
                    </div>
                    <div className="mt-1 text-gray-700">
                      {s.state === "present" ? "LR+" : "LR−"} {s.lrUsed.toFixed(2)} →{" "}
                      <span className="font-semibold">{formatPct(s.pAfter)}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900">Fagan nomogram</h3>
            <div className="mt-2 rounded-lg border bg-gray-50 p-3">
              <FaganChart pretestP={pretestP} combinedLR={lr} />
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
            Multiplying LRs assumes conditional independence. Correlated inputs may overestimate certainty.
          </div>
        </section>

        {/* RIGHT */}
        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Post-test probability</h2>

          <div className="mt-4 rounded-lg border bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-gray-900">Estimated probability</div>
              <div className="text-sm text-gray-700">
                {showAdjustedPretest ? (
                  <>
                    Base <span className="font-semibold">{formatPct(basePretestP)}</span>{" "}
                    <span className="mx-1">•</span>
                    Adj pretest <span className="font-semibold">{formatPct(pretestP)}</span>
                  </>
                ) : (
                  <>
                    Pretest <span className="font-semibold">{formatPct(pretestP)}</span>
                  </>
                )}
              </div>
            </div>

            <div className="mt-2 text-5xl font-extrabold tracking-tight text-gray-900">{formatPct(postP)}</div>

            <div className="mt-3 text-sm text-gray-700">
              Combined LR: <span className="font-semibold">{lr.toFixed(2)}</span>
            </div>

            <div className="mt-3 text-xs text-gray-600">Educational estimate only. Always use clinical context.</div>
          </div>

          <div className="mt-4 rounded-lg border p-4">
            <div className="text-sm font-semibold text-gray-900">Decision layer (MVP)</div>
            <p className="mt-1 text-xs text-gray-600">
              Harms are auto-estimated from syndrome + selected high-impact findings. Treatment threshold uses:
              P(treat) = Harm of unnecessary treatment / (Harm of unnecessary treatment + Harm of missed diagnosis).
            </p>

            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded border bg-gray-50 px-3 py-2">
                <div className="text-gray-600">Harm of missed diagnosis</div>
                <div className="text-lg font-semibold text-gray-900">{harmEstimate.missedDx}</div>
              </div>
              <div className="rounded border bg-gray-50 px-3 py-2">
                <div className="text-gray-600">Harm of unnecessary treatment</div>
                <div className="text-lg font-semibold text-gray-900">{harmEstimate.unnecessaryTx}</div>
              </div>
            </div>

            <details className="mt-3 rounded-md border bg-gray-50 p-3 text-xs text-gray-700">
              <summary className="cursor-pointer font-semibold text-gray-900">What is driving harm?</summary>
              <div className="mt-2 space-y-1">
                <div>
                  <div className="flex items-center justify-between">
                    <span>Baseline missed-diagnosis harm ({activeModule.name})</span>
                    <span className="font-semibold">{harmEstimate.baseMissedDx}</span>
                  </div>
                  {harmEstimate.baseEvidence ? (
                    <div className="text-[11px] text-gray-500">
                      Source:{" "}
                      {harmEstimate.baseEvidence.url ? (
                        <a
                          href={harmEstimate.baseEvidence.url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline underline-offset-2 hover:text-gray-700"
                        >
                          {harmEstimate.baseEvidence.short}
                        </a>
                      ) : (
                        harmEstimate.baseEvidence.short
                      )}
                    </div>
                  ) : null}
                </div>
                {harmEstimate.missedDxDrivers.map((d, idx) => (
                  <div key={`${d.label}-${idx}`}>
                    <div className="flex items-center justify-between">
                      <span>+ {d.label}</span>
                      <span className="font-semibold">+{d.delta}</span>
                    </div>
                    {d.evidence ? (
                      <div className="text-[11px] text-gray-500">
                        Source:{" "}
                        {d.evidence.url ? (
                          <a
                            href={d.evidence.url}
                            target="_blank"
                            rel="noreferrer"
                            className="underline underline-offset-2 hover:text-gray-700"
                          >
                            {d.evidence.short}
                          </a>
                        ) : (
                          d.evidence.short
                        )}
                      </div>
                    ) : null}
                  </div>
                ))}
                <div className="mt-1 border-t pt-1 flex items-center justify-between">
                  <span>Total missed-diagnosis harm</span>
                  <span className="font-semibold">{harmEstimate.missedDx}</span>
                </div>
              </div>
            </details>

            <div className="mt-3 text-sm text-gray-700">
              Treatment threshold: <span className="font-semibold">{formatPct(treatmentThresholdP)}</span>
            </div>
            <div className="text-sm text-gray-700">
              Observation threshold: <span className="font-semibold">{formatPct(observeThresholdP)}</span>
            </div>

            <div className="mt-2 space-y-2">
              <div className="relative h-2 rounded bg-gray-200">
                <div
                  className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-gray-500"
                  style={{ left: `${observeThresholdP * 100}%` }}
                  aria-hidden="true"
                />
                <div
                  className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-gray-900"
                  style={{ left: `${treatmentThresholdP * 100}%` }}
                  aria-hidden="true"
                />
                <div
                  className={[
                    "absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full border",
                    recommendation === "treat"
                      ? "border-emerald-700 bg-emerald-500"
                      : recommendation === "observe"
                      ? "border-sky-700 bg-sky-500"
                      : "border-amber-700 bg-amber-500",
                  ].join(" ")}
                  style={{ left: `${postP * 100}%` }}
                  aria-hidden="true"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-600">
                <span>0%</span>
                <span>Observe &le; {formatPct(observeThresholdP)}</span>
                <span>Treat &ge; {formatPct(treatmentThresholdP)}</span>
                <span>100%</span>
              </div>
            </div>

            <div
              className={[
                "mt-3 rounded-md border px-3 py-2 text-sm",
                recommendation === "treat"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : recommendation === "observe"
                  ? "border-sky-200 bg-sky-50 text-sky-900"
                  : "border-amber-200 bg-amber-50 text-amber-900",
              ].join(" ")}
            >
              <span className="font-semibold">
                {recommendation === "treat"
                  ? "Treat now"
                  : recommendation === "observe"
                  ? "Observe / monitor"
                  : "Pursue further testing"}
              </span>
              <span className="ml-2">
                (Post-test {formatPct(postP)})
              </span>
            </div>

            <div className="mt-3 text-xs text-gray-600">
              {harmEstimate.rationale.length === 1 && harmEstimate.missedDxDrivers.length === 0
                ? harmEstimate.rationale[0]
                : "Harm estimates are heuristic and configurable in lib/probidDecision.ts."}
            </div>
          </div>

          <div className="mt-4 rounded-lg border p-4">
            <div className="text-sm font-semibold text-gray-900">What’s driving it?</div>
            {steps.length === 0 ? (
              <p className="mt-2 text-sm text-gray-700">No selected findings yet.</p>
            ) : (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                {steps.slice(-5).map((s) => (
                  <li key={s.id}>
                    {s.label}: {s.state === "present" ? "LR+" : "LR−"} {s.lrUsed.toFixed(2)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

        <div className="mt-10 rounded-lg border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
            Educational content only. Not medical advice.{" "}
            <Link
                href="/probid/references"
                className="underline decoration-gray-400 underline-offset-2 hover:decoration-gray-900"
                >
            See references & methodology.
            </Link>
        </div>


      {/* =========================
          CATALOG MODAL (2-pane)
         ========================= */}
      {catalogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30" onClick={() => setCatalogOpen(false)} aria-hidden="true" />

          {/* Panel */}
          <div className="relative z-10 flex h-[640px] max-h-[80vh] w-[min(980px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border bg-white shadow-lg">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b p-4">
              <div className="min-w-0">
                <div className="text-lg font-semibold text-gray-900">Browse catalog</div>
                <div className="mt-1 text-sm text-gray-600">
                  Pick a category on the left, then mark items as Present/Absent. (Esc to close.)
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCatalogOpen(false)}
                className="shrink-0 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            {/* Top controls */}
            <div className="border-b p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:max-w-md">
                  <label className="text-sm font-medium text-gray-700">Search</label>
                  <input
                    value={catalogQuery}
                    onChange={(e) => setCatalogQuery(e.target.value)}
                    placeholder="Search by label…"
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
                  />
                  {catalogQuery && (
                    <button
                      type="button"
                      onClick={() => setCatalogQuery("")}
                      className="mt-2 text-xs text-gray-600 underline hover:text-gray-900"
                    >
                      Clear search
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSelectedOnly((v) => !v)}
                    className={[
                      "rounded-md border px-3 py-2 text-sm",
                      showSelectedOnly ? "border-gray-900 bg-gray-900 text-white" : "hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {showSelectedOnly ? "Showing: Selected" : "Show selected only"}
                  </button>
                </div>
              </div>
            </div>

            {/* Body: 2-pane layout (right pane scrolls) */}
            <div className="flex min-h-0 flex-1">
              {/* LEFT: categories */}
              <aside className="w-52 border-r bg-gray-50 p-2">
                <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">Categories</div>

                {(["Location", ...FAMILY_ORDER.filter((f) => f !== "Location")] as string[]).map((fam) => {
                  const isActive = fam === activeFamily;

                  const count =
                    fam === "Location"
                      ? activeModule.pretestPresets.length
                      : activeModule.items.filter((it) => familyFor(it) === fam).length;

                  return (
                    <button
                      key={fam}
                      type="button"
                      onClick={() => setActiveFamily(fam)}
                      className={[
                        "mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm",
                        isActive ? "bg-white border border-gray-200 shadow-sm" : "hover:bg-white/70",
                      ].join(" ")}
                    >
                      <span className="truncate">{fam}</span>
                      <span className="ml-2 text-xs text-gray-500">{count}</span>
                    </button>
                  );
                })}
              </aside>

              {/* RIGHT: scrollable list */}
              <section className="min-w-0 flex-1 overflow-y-auto p-4" style={{ WebkitOverflowScrolling: "touch" }}>
                {activeFamily === "Location" ? (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-900">Location / Setting</div>
                    <div className="text-xs text-gray-600">Choosing location sets the pretest probability.</div>

                    <div className="mt-3 space-y-2">
                      {activeModule.pretestPresets
                        .filter((p) => (!catalogQ ? true : p.label.toLowerCase().includes(catalogQ)))
                        .map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => addLocation(p.id)}
                            className={[
                              "w-full rounded-lg border px-3 py-2 text-left hover:bg-gray-50",
                              p.id === presetId ? "border-gray-900 bg-gray-900 text-white hover:bg-gray-900" : "",
                            ].join(" ")}
                          >
                            <div className="font-medium">{p.label}</div>
                            <div className="text-xs opacity-90">Pretest {formatPct(p.p)}</div>
                          </button>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900">{activeFamily}</div>
                      <div className="text-xs text-gray-600">Mark each item as Present or Absent (or Clear).</div>
                    </div>

                    {(() => {
                      const items = activeModule.items
                        .filter((it) => familyFor(it) === activeFamily)
                        .filter((it) => (catalogQ ? matchesQuery(it, catalogQ) : true))
                        .filter((it) => (!showSelectedOnly ? true : (states[it.id] ?? "unknown") !== "unknown"));

                      if (items.length === 0) {
                        return (
                          <div className="rounded-lg border bg-gray-50 p-4 text-sm text-gray-700">No items found.</div>
                        );
                      }

                      const byGroup: Record<string, LRItem[]> = {};
                      for (const it of items) (byGroup[it.group ?? "General"] ??= []).push(it);
                      const groupKeys = Object.keys(byGroup).sort((a, b) => a.localeCompare(b));

                      return (
                        <div className="space-y-4">
                          {groupKeys.map((gk) => (
                            <div key={gk} className="rounded-lg border">
                              <div className="border-b bg-gray-50 px-3 py-2">
                                <div className="text-xs font-semibold uppercase tracking-wide text-gray-700">{gk}</div>
                              </div>

                              <div className="divide-y">
                                {byGroup[gk].map((it) => {
                                  const st = states[it.id] ?? "unknown";
                                  const isPresent = st === "present";
                                  const isAbsent = st === "absent";
                                  const locked = isAutoManagedLocked(it.id);

                                  return (
                                    <div key={it.id} className="flex items-center justify-between gap-3 px-3 py-2">
                                      <div className="min-w-0">
                                        <div className="truncate text-sm font-medium text-gray-900">{it.label}</div>
                                        {it.notes ? (
                                          <div className="mt-0.5 text-xs text-gray-600">{it.notes}</div>
                                        ) : null}
                                        {it.source ? (
                                          <div className="mt-1 text-xs text-gray-600">
                                            Source:{" "}
                                            {it.source.url ? (
                                              <a
                                                href={it.source.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="underline underline-offset-2 hover:text-gray-900"
                                              >
                                                {it.source.short}
                                                {it.source.year ? ` (${it.source.year})` : ""}
                                              </a>
                                            ) : (
                                              <span>
                                                {it.source.short}
                                                {it.source.year ? ` (${it.source.year})` : ""}
                                              </span>
                                            )}
                                          </div>
                                        ) : null}
                                      </div>

                                      <div className="shrink-0 flex items-center gap-2">
                                        <button
                                          type="button"
                                          disabled={locked}
                                          onClick={() => setItemState(it, "present")}
                                          className={[
                                            "rounded-md border px-2 py-1 text-xs disabled:opacity-40 disabled:cursor-not-allowed",
                                            isPresent
                                              ? "border-gray-900 bg-gray-900 text-white"
                                              : "hover:bg-gray-50",
                                          ].join(" ")}
                                        >
                                          Present
                                        </button>
                                        <button
                                          type="button"
                                          disabled={locked}
                                          onClick={() => setItemState(it, "absent")}
                                          className={[
                                            "rounded-md border px-2 py-1 text-xs disabled:opacity-40 disabled:cursor-not-allowed",
                                            isAbsent
                                              ? "border-gray-900 bg-gray-900 text-white"
                                              : "hover:bg-gray-50",
                                          ].join(" ")}
                                        >
                                          Absent
                                        </button>
                                        <button
                                          type="button"
                                          disabled={locked}
                                          onClick={() => setItemState(it, "unknown")}
                                          className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                          title="Clear"
                                        >
                                          Clear
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </section>
            </div>

            {/* Footer */}
            <div className="border-t bg-white p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Selected: <span className="font-semibold">{activeSelected.length}</span> • Pretest{" "}
                  <span className="font-semibold">{formatPct(pretestP)}</span>
                  {showAdjustedPretest ? (
                    <span className="ml-2 text-xs text-gray-600">(base {formatPct(basePretestP)})</span>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => setCatalogOpen(false)}
                  className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
