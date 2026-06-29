"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { FindingState, LRItem, SyndromeLRModule } from "@/lib/lrTypes";
import { combinedLR, postTestProb, buildStepwisePath, formatPct, clamp } from "@/lib/lrMath";
import {
  applyActionThresholdModifiers,
  deriveActionThresholdsFromHarms,
  deriveDecisionThresholds,
  estimateHarms,
  getActionThresholdModel,
} from "@/lib/probidDecision";
import {
  applyUtilityModifiers,
  calculateExpectedUtilities,
  deriveTreatmentThresholdFromUtilities,
  getTreatmentUtilityModel,
} from "@/lib/probidExpectedUtility";
import { computeTestImpact } from "@/lib/probidTestImpact";
import { FAMILY_ORDER, familyFor, matchesQuery, normalize } from "@/lib/probidCatalog";
import { ProbidVerdict } from "@/components/ProbidVerdict";
import { ProbidThresholdHighway } from "@/components/ProbidThresholdHighway";
import { ProbidTestImpact } from "@/components/ProbidTestImpact";
import { ProbidBuildPanel } from "@/components/ProbidBuildPanel";
import { ProbidPatientFactors } from "@/components/ProbidPatientFactors";
import { ProbidMathDetails } from "@/components/ProbidMathDetails";
import { ProbidFloatingBar } from "@/components/ProbidFloatingBar";
import { ProbidProbabilityTrace } from "@/components/ProbidProbabilityTrace";
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
  "endo_virsta_high", "endo_virsta_na", "endo_denova_high",
  "endo_denova_na", "endo_handoc_high", "endo_handoc_na",
] as const;

type VapRiskFactorId =
  | "male_sex" | "copd" | "trauma" | "impaired_consciousness"
  | "prior_antibiotics" | "reintubation" | "tracheostomy"
  | "enteral_feeding" | "nasogastric_tube" | "h2_blocker";

type VapRiskFactorOption = { id: VapRiskFactorId; label: string; pooledOr: number; notes?: string };

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
  male_sex: false, copd: false, trauma: false, impaired_consciousness: false,
  prior_antibiotics: false, reintubation: false, tracheostomy: false,
  enteral_feeding: false, nasogastric_tube: false, h2_blocker: false,
};

const VAP_RISK_OR_SHRINK_EXPONENT = 0.5;
const VAP_RISK_MAX_MULTIPLIER = 6;

type EndoRiskFactorId = "ivdu" | "prosthetic_valve" | "prior_endo"
  | "structural_valve_disease" | "chd" | "cied" | "hemodialysis";

type EndoRiskFactorOption = { id: EndoRiskFactorId; label: string; orLike: number; group: "general_ie" | "sab_context" };

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
  ivdu: false, prosthetic_valve: false, prior_endo: false,
  structural_valve_disease: false, chd: false, cied: false, hemodialysis: false,
};

const ENDO_RISK_OR_SHRINK_EXPONENT = 0.5;
const ENDO_RISK_MAX_MULTIPLIER = 5;
const SHARE_PARAM = "probid";

function byId(mods: SyndromeLRModule[], id?: string) {
  if (!id) return mods[0];
  return mods.find((m) => m.id === id) ?? mods[0];
}

function recommendationHeadline(moduleId: string, recommendation: "treat" | "test" | "observe") {
  if (moduleId === "pji") {
    if (recommendation === "treat") return "Manage as likely chronic PJI";
    if (recommendation === "observe") return "Stop invasive PJI work-up for now";
    return "Clarify the chronic PJI diagnosis";
  }
  if (moduleId === "cap") {
    if (recommendation === "treat") return "Treat for CAP now";
    if (recommendation === "observe") return "Watch without antibiotics";
    return "Not enough probability for antibiotics yet";
  }
  if (moduleId === "inv_aspergillosis") {
    if (recommendation === "treat") return "Start mold-active treatment";
    if (recommendation === "observe") return "Aspergillus is less likely right now";
    return "Keep aspergillosis on the differential";
  }
  if (moduleId === "inv_mucormycosis") {
    if (recommendation === "treat") return "Start mucormycosis treatment";
    if (recommendation === "observe") return "Mucormycosis is less likely right now";
    return "Keep mucormycosis on the differential";
  }
  if (recommendation === "treat") return "Treatment is supported";
  if (recommendation === "observe") return "Observe and reassess";
  return "Get more diagnostic data";
}

function recommendationDetail(moduleId: string, recommendation: "treat" | "test" | "observe") {
  if (moduleId === "pji") {
    if (recommendation === "treat") return "The current probability is above the personalized management threshold, so chronic PJI-directed management is reasonable now.";
    if (recommendation === "test") return "The current probability still sits between the stop and manage thresholds, so more diagnostic clarification is more defensible than stopping or fully committing.";
    return "The current probability is below the stop-work-up threshold for the selected patient factors, so more invasive PJI work-up is less likely to help right now.";
  }
  if (moduleId === "cap") {
    if (recommendation === "treat") return "The current probability is above the CAP treatment threshold for the selected patient factors.";
    if (recommendation === "test") return "The current probability is still below the CAP treatment threshold, so more data or reassessment makes more sense than empiric antibiotics.";
    return "Current data support monitoring rather than empiric antibiotics.";
  }
  if (moduleId === "inv_aspergillosis") {
    if (recommendation === "treat") return "Invasive aspergillosis is concerning enough that empiric mold-active therapy is reasonable while the workup continues.";
    if (recommendation === "test") return "Aspergillosis remains possible, but better microbiology or tissue confirmation would help before treating this as established disease.";
    return "The current data do not strongly support invasive aspergillosis, so competing diagnoses should stay front and center.";
  }
  if (moduleId === "inv_mucormycosis") {
    if (recommendation === "treat") return "Mucormycosis is concerning enough that empiric treatment (liposomal amphotericin B ± surgical evaluation) is reasonable while the workup continues.";
    if (recommendation === "test") return "Mucormycosis remains possible, but Mucorales PCR, tissue biopsy, or further imaging would help confirm before committing to treatment.";
    return "The current data do not strongly support mucormycosis. Consider whether invasive aspergillosis or another diagnosis is more likely.";
  }
  if (recommendation === "treat") return "The current probability is high enough that treatment is reasonable now.";
  if (recommendation === "test") return "The current probability sits in the middle zone, so extra testing or reassessment is the safer next step.";
  return "The current probability is low enough that observation and follow-up are more reasonable than treatment.";
}

function recommendationBadgeLabel(moduleId: string, recommendation: "treat" | "test" | "observe") {
  if (moduleId === "pji") {
    if (recommendation === "treat") return "MANAGE PJI";
    if (recommendation === "observe") return "STOP WORK-UP";
    return "CLARIFY";
  }
  if (recommendation === "treat") return "TREAT";
  if (recommendation === "observe") return "OBSERVE";
  return "GET MORE DATA";
}

export function ProbIDTool({ modules, defaultModuleId }: Props) {
  const suppressModuleResetRef = useRef(false);
  const didHydrateFromUrlRef = useRef(false);

  const [moduleId, setModuleId] = useState(byId(modules, defaultModuleId)?.id ?? modules[0]?.id);
  const activeModule = useMemo(() => byId(modules, moduleId), [modules, moduleId]);

  const [presetId, setPresetId] = useState(activeModule.pretestPresets[0]?.id ?? "");
  const [states, setStates] = useState<Record<string, FindingState>>({});
  const [clickOrder, setClickOrder] = useState<string[]>([]);

  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogQuery, setCatalogQuery] = useState("");
  const [activeFamily, setActiveFamily] = useState<string>("Location");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [utilityModifierState, setUtilityModifierState] = useState<Record<string, boolean>>({});
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">("idle");
  const [shareSyncEnabled, setShareSyncEnabled] = useState(false);

  const [useVapRiskModifiers, setUseVapRiskModifiers] = useState(false);
  const [vapRiskState, setVapRiskState] = useState<Record<VapRiskFactorId, boolean>>(DEFAULT_VAP_RISK_STATE);
  const [useEndoRiskModifiers, setUseEndoRiskModifiers] = useState(false);
  const [endoRiskState, setEndoRiskState] = useState<Record<EndoRiskFactorId, boolean>>(DEFAULT_ENDO_RISK_STATE);

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

  useEffect(() => {
    if (typeof window === "undefined" || didHydrateFromUrlRef.current) return;
    didHydrateFromUrlRef.current = true;

    const raw = new URLSearchParams(window.location.search).get(SHARE_PARAM);
    if (!raw) { setShareSyncEnabled(true); return; }

    try {
      const p = JSON.parse(raw) as Record<string, unknown>;
      suppressModuleResetRef.current = true;
      if (typeof p.moduleId === "string") setModuleId(p.moduleId === "inv_mold" ? "inv_aspergillosis" : p.moduleId);
      if (typeof p.presetId === "string") setPresetId(p.presetId);
      setStates(toFindingStateMap(p.states));
      setClickOrder(toStringArray(p.clickOrder));
      setUtilityModifierState(toBooleanRecord(p.utilityModifierState));
      if (typeof p.useVapRiskModifiers === "boolean") setUseVapRiskModifiers(p.useVapRiskModifiers);
      if (p.vapRiskState) setVapRiskState({ ...DEFAULT_VAP_RISK_STATE, ...toBooleanRecord(p.vapRiskState) } as Record<VapRiskFactorId, boolean>);
      if (typeof p.useEndoRiskModifiers === "boolean") setUseEndoRiskModifiers(p.useEndoRiskModifiers);
      if (p.endoRiskState) setEndoRiskState({ ...DEFAULT_ENDO_RISK_STATE, ...toBooleanRecord(p.endoRiskState) } as Record<EndoRiskFactorId, boolean>);
      if (typeof p.useVirsta === "boolean") setUseVirsta(p.useVirsta);
      if (typeof p.virstaEmboli === "boolean") setVirstaEmboli(p.virstaEmboli);
      if (typeof p.virstaMeningitis === "boolean") setVirstaMeningitis(p.virstaMeningitis);
      if (typeof p.virstaIntracardiacDevice === "boolean") setVirstaIntracardiacDevice(p.virstaIntracardiacDevice);
      if (typeof p.virstaPriorEndocarditis === "boolean") setVirstaPriorEndocarditis(p.virstaPriorEndocarditis);
      if (typeof p.virstaNativeValveDisease === "boolean") setVirstaNativeValveDisease(p.virstaNativeValveDisease);
      if (typeof p.virstaIvdu === "boolean") setVirstaIvdu(p.virstaIvdu);
      if (typeof p.virstaPersistentBacteremia48h === "boolean") setVirstaPersistentBacteremia48h(p.virstaPersistentBacteremia48h);
      if (typeof p.virstaVertebralOsteomyelitis === "boolean") setVirstaVertebralOsteomyelitis(p.virstaVertebralOsteomyelitis);
      if (typeof p.virstaAcquisition === "string") setVirstaAcquisition(p.virstaAcquisition as VirstaAcquisition);
      if (typeof p.virstaSevereSepsisShock === "boolean") setVirstaSevereSepsisShock(p.virstaSevereSepsisShock);
      if (typeof p.virstaCrpGt190 === "boolean") setVirstaCrpGt190(p.virstaCrpGt190);
      if (typeof p.useDenova === "boolean") setUseDenova(p.useDenova);
      if (typeof p.denovaDuration7d === "boolean") setDenovaDuration7d(p.denovaDuration7d);
      if (typeof p.denovaEmbolization === "boolean") setDenovaEmbolization(p.denovaEmbolization);
      if (typeof p.denovaNumPositive2 === "boolean") setDenovaNumPositive2(p.denovaNumPositive2);
      if (typeof p.denovaOriginUnknown === "boolean") setDenovaOriginUnknown(p.denovaOriginUnknown);
      if (typeof p.denovaValveDisease === "boolean") setDenovaValveDisease(p.denovaValveDisease);
      if (typeof p.denovaAuscultationMurmur === "boolean") setDenovaAuscultationMurmur(p.denovaAuscultationMurmur);
      if (typeof p.useHandoc === "boolean") setUseHandoc(p.useHandoc);
      if (typeof p.handocHeartMurmurValve === "boolean") setHandocHeartMurmurValve(p.handocHeartMurmurValve);
      if (typeof p.handocSpecies === "string") setHandocSpecies(p.handocSpecies as HandocSpecies);
      if (typeof p.handocNumPositive2 === "boolean") setHandocNumPositive2(p.handocNumPositive2);
      if (typeof p.handocDuration7d === "boolean") setHandocDuration7d(p.handocDuration7d);
      if (typeof p.handocOnlyOneSpecies === "boolean") setHandocOnlyOneSpecies(p.handocOnlyOneSpecies);
      if (typeof p.handocCommunityAcquired === "boolean") setHandocCommunityAcquired(p.handocCommunityAcquired);
    } catch { /* ignore bad URL state */ }
    setShareSyncEnabled(true);
  }, []);

  useEffect(() => {
    if (suppressModuleResetRef.current) { suppressModuleResetRef.current = false; return; }
    setPresetId(activeModule.pretestPresets[0]?.id ?? "");
    setStates({});
    setClickOrder([]);
    setCatalogQuery("");
    setActiveFamily("Location");
    setShowSelectedOnly(false);
    setUtilityModifierState({});
    setUseVapRiskModifiers(false);
    setVapRiskState(DEFAULT_VAP_RISK_STATE);
    setUseEndoRiskModifiers(false);
    setEndoRiskState(DEFAULT_ENDO_RISK_STATE);
    setUseVirsta(false);
    setVirstaEmboli(false); setVirstaMeningitis(false); setVirstaIntracardiacDevice(false);
    setVirstaPriorEndocarditis(false); setVirstaNativeValveDisease(false); setVirstaIvdu(false);
    setVirstaPersistentBacteremia48h(false); setVirstaVertebralOsteomyelitis(false);
    setVirstaAcquisition("nosocomial"); setVirstaSevereSepsisShock(false); setVirstaCrpGt190(false);
    setUseDenova(false);
    setDenovaDuration7d(false); setDenovaEmbolization(false); setDenovaNumPositive2(false);
    setDenovaOriginUnknown(false); setDenovaValveDisease(false); setDenovaAuscultationMurmur(false);
    setUseHandoc(false);
    setHandocHeartMurmurValve(false); setHandocSpecies("unspecified_other");
    setHandocNumPositive2(false); setHandocDuration7d(false);
    setHandocOnlyOneSpecies(false); setHandocCommunityAcquired(false);
  }, [activeModule]);

  const preset = activeModule.pretestPresets.find((p) => p.id === presetId) ?? activeModule.pretestPresets[0];
  const basePretestP = clamp(preset?.p ?? 0.05, 0.001, 0.999);

  const vapSelectedRiskFactors = useMemo(() => VAP_RISK_FACTOR_OPTIONS.filter((opt) => vapRiskState[opt.id]), [vapRiskState]);
  const endoSelectedRiskFactors = useMemo(() => ENDO_RISK_FACTOR_OPTIONS.filter((opt) => endoRiskState[opt.id]), [endoRiskState]);
  const endoAppliedRiskFactors = useMemo(() => endoSelectedRiskFactors.filter((opt) => !(useVirsta && opt.group === "sab_context")), [endoSelectedRiskFactors, useVirsta]);
  const endoSuppressedRiskFactors = useMemo(() => endoSelectedRiskFactors.filter((opt) => useVirsta && opt.group === "sab_context"), [endoSelectedRiskFactors, useVirsta]);

  const vapRiskRawMultiplier = useMemo(() => {
    if (activeModule.id !== "vap" || !useVapRiskModifiers) return 1;
    return vapSelectedRiskFactors.reduce((acc, rf) => acc * rf.pooledOr, 1);
  }, [activeModule.id, useVapRiskModifiers, vapSelectedRiskFactors]);

  const vapRiskAppliedMultiplier = useMemo(() => {
    if (activeModule.id !== "vap" || !useVapRiskModifiers) return 1;
    return clamp(Math.pow(vapRiskRawMultiplier, VAP_RISK_OR_SHRINK_EXPONENT), 1, VAP_RISK_MAX_MULTIPLIER);
  }, [activeModule.id, useVapRiskModifiers, vapRiskRawMultiplier]);

  const endoRiskRawMultiplier = useMemo(() => {
    if (activeModule.id !== "endo" || !useEndoRiskModifiers) return 1;
    return endoAppliedRiskFactors.reduce((acc, rf) => acc * rf.orLike, 1);
  }, [activeModule.id, useEndoRiskModifiers, endoAppliedRiskFactors]);

  const endoRiskAppliedMultiplier = useMemo(() => {
    if (activeModule.id !== "endo" || !useEndoRiskModifiers) return 1;
    return clamp(Math.pow(endoRiskRawMultiplier, ENDO_RISK_OR_SHRINK_EXPONENT), 1, ENDO_RISK_MAX_MULTIPLIER);
  }, [activeModule.id, useEndoRiskModifiers, endoRiskRawMultiplier]);

  const pretestP = useMemo(() => {
    const odds = basePretestP / (1 - basePretestP);
    let adjustedOdds = odds;
    if (activeModule.id === "vap" && useVapRiskModifiers) adjustedOdds *= vapRiskAppliedMultiplier;
    if (activeModule.id === "endo" && useEndoRiskModifiers) adjustedOdds *= endoRiskAppliedMultiplier;
    return clamp(adjustedOdds / (1 + adjustedOdds), 0.001, 0.999);
  }, [activeModule.id, basePretestP, useVapRiskModifiers, vapRiskAppliedMultiplier, useEndoRiskModifiers, endoRiskAppliedMultiplier]);

  const showAdjustedPretest = (activeModule.id === "vap" && useVapRiskModifiers) || (activeModule.id === "endo" && useEndoRiskModifiers);

  const itemsById = useMemo(() => new Map(activeModule.items.map((i) => [i.id, i])), [activeModule.items]);
  const actionThresholdModel = useMemo(() => getActionThresholdModel(activeModule.id), [activeModule.id]);
  const treatmentUtilityModel = useMemo(() => actionThresholdModel ? null : getTreatmentUtilityModel(activeModule.id), [activeModule.id, actionThresholdModel]);
  const activeDecisionModifierIds = useMemo(() => Object.entries(utilityModifierState).filter(([, v]) => v).map(([id]) => id), [utilityModifierState]);

  const lr = useMemo(() => combinedLR(activeModule.items, states), [activeModule.items, states]);
  const postP = useMemo(() => postTestProb(pretestP, lr), [pretestP, lr]);

  const harmStates = useMemo(() => {
    if (activeModule.id !== "endo" || !useEndoRiskModifiers) return states;
    return { ...states, endo_prosthetic_valve: endoRiskState.prosthetic_valve ? "present" : "unknown", endo_cied: endoRiskState.cied ? "present" : "unknown" } as Record<string, FindingState>;
  }, [activeModule.id, useEndoRiskModifiers, endoRiskState, states]);

  const harmEstimate = useMemo(() => estimateHarms(activeModule.id, harmStates), [activeModule.id, harmStates]);
  const { treatThresholdP: heuristicTreatThresholdP, observeThresholdP: heuristicObserveThresholdP } = useMemo(() => deriveDecisionThresholds(harmEstimate), [harmEstimate]);
  const adjustedActionThresholdModel = useMemo(
    () => actionThresholdModel ? applyActionThresholdModifiers(actionThresholdModel, activeDecisionModifierIds) : null,
    [actionThresholdModel, activeDecisionModifierIds]
  );
  const actionThresholds = useMemo(
    () => adjustedActionThresholdModel ? deriveActionThresholdsFromHarms(adjustedActionThresholdModel.terms) : null,
    [adjustedActionThresholdModel]
  );
  const adjustedUtilityModel = useMemo(() => treatmentUtilityModel ? applyUtilityModifiers(treatmentUtilityModel, activeDecisionModifierIds) : null, [treatmentUtilityModel, activeDecisionModifierIds]);
  const expectedUtilityResult = useMemo(() => adjustedUtilityModel ? calculateExpectedUtilities(adjustedUtilityModel.terms, postP) : null, [adjustedUtilityModel, postP]);
  const utilityTreatmentThresholdP = useMemo(() => adjustedUtilityModel ? deriveTreatmentThresholdFromUtilities(adjustedUtilityModel.terms) : null, [adjustedUtilityModel]);
  const treatmentThresholdP = actionThresholds?.manageThresholdP ?? utilityTreatmentThresholdP ?? heuristicTreatThresholdP;
  const observeThresholdP = actionThresholds?.stopThresholdP ?? heuristicObserveThresholdP;

  const recommendation: "treat" | "test" | "observe" = adjustedActionThresholdModel
    ? postP >= treatmentThresholdP ? "treat" : postP <= observeThresholdP ? "observe" : "test"
    : adjustedUtilityModel
    ? postP >= treatmentThresholdP ? "treat" : "test"
    : postP >= treatmentThresholdP ? "treat" : postP <= heuristicObserveThresholdP ? "observe" : "test";

  const recHeadline = useMemo(() => recommendationHeadline(activeModule.id, recommendation), [activeModule.id, recommendation]);
  const recDetail = useMemo(() => recommendationDetail(activeModule.id, recommendation), [activeModule.id, recommendation]);
  const recBadgeLabel = useMemo(() => recommendationBadgeLabel(activeModule.id, recommendation), [activeModule.id, recommendation]);
  const thresholdCopy = useMemo(() => {
    if (activeModule.id === "pji") {
      return {
        treatThresholdLabel: "Manage at",
        observeThresholdLabel: "Stop below",
        treatZoneLabel: "Manage as likely PJI",
        testZoneLabel: "Clarify",
        observeZoneLabel: "Stop work-up",
        treatThresholdShortLabel: "Manage",
        observeThresholdShortLabel: "Stop",
      };
    }
    return {
      treatThresholdLabel: "Treat at",
      observeThresholdLabel: "Observe below",
      treatZoneLabel: "Treat",
      testZoneLabel: "Get more data",
      observeZoneLabel: "Observe",
      treatThresholdShortLabel: "Treat",
      observeThresholdShortLabel: "Observe",
    };
  }, [activeModule.id]);
  const testImpactIntro = useMemo(() => {
    if (activeModule.id === "pji") {
      return "These remaining tests are most likely to push the case below the stop threshold or above the manage-as-PJI threshold.";
    }
    return "These tests could change the decision. Click to add them.";
  }, [activeModule.id]);

  const steps = useMemo(() => buildStepwisePath({ pretestP, orderedIds: clickOrder, itemsById, states }), [pretestP, clickOrder, itemsById, states]);

  const testImpactEntries = useMemo(() => computeTestImpact({
    currentPostP: postP, currentCombinedLR: lr, items: activeModule.items,
    states, treatThresholdP: treatmentThresholdP, observeThresholdP,
  }), [postP, lr, activeModule.items, states, treatmentThresholdP, observeThresholdP]);

  const shareableState = useMemo(() => ({
    moduleId, presetId, states, clickOrder, utilityModifierState,
    useVapRiskModifiers, vapRiskState, useEndoRiskModifiers, endoRiskState,
    useVirsta, virstaEmboli, virstaMeningitis, virstaIntracardiacDevice,
    virstaPriorEndocarditis, virstaNativeValveDisease, virstaIvdu,
    virstaPersistentBacteremia48h, virstaVertebralOsteomyelitis,
    virstaAcquisition, virstaSevereSepsisShock, virstaCrpGt190,
    useDenova, denovaDuration7d, denovaEmbolization, denovaNumPositive2,
    denovaOriginUnknown, denovaValveDisease, denovaAuscultationMurmur,
    useHandoc, handocHeartMurmurValve, handocSpecies, handocNumPositive2,
    handocDuration7d, handocOnlyOneSpecies, handocCommunityAcquired,
  }), [moduleId, presetId, states, clickOrder, utilityModifierState,
    useVapRiskModifiers, vapRiskState, useEndoRiskModifiers, endoRiskState,
    useVirsta, virstaEmboli, virstaMeningitis, virstaIntracardiacDevice,
    virstaPriorEndocarditis, virstaNativeValveDisease, virstaIvdu,
    virstaPersistentBacteremia48h, virstaVertebralOsteomyelitis,
    virstaAcquisition, virstaSevereSepsisShock, virstaCrpGt190,
    useDenova, denovaDuration7d, denovaEmbolization, denovaNumPositive2,
    denovaOriginUnknown, denovaValveDisease, denovaAuscultationMurmur,
    useHandoc, handocHeartMurmurValve, handocSpecies, handocNumPositive2,
    handocDuration7d, handocOnlyOneSpecies, handocCommunityAcquired]);

  useEffect(() => {
    if (typeof window === "undefined" || !shareSyncEnabled) return;
    const params = new URLSearchParams(window.location.search);
    params.set(SHARE_PARAM, JSON.stringify(shareableState));
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}${window.location.hash}`);
  }, [shareSyncEnabled, shareableState]);

  const virstaScore = useMemo(() => {
    const dp = virstaIntracardiacDevice || virstaPriorEndocarditis ? 4 : 0;
    const ap = virstaAcquisition === "community_or_nhca" ? 2 : 0;
    return (virstaEmboli ? 5 : 0) + (virstaMeningitis ? 5 : 0) + dp + (virstaNativeValveDisease ? 3 : 0) +
      (virstaIvdu ? 4 : 0) + (virstaPersistentBacteremia48h ? 3 : 0) + (virstaVertebralOsteomyelitis ? 2 : 0) +
      ap + (virstaSevereSepsisShock ? 1 : 0) + (virstaCrpGt190 ? 1 : 0);
  }, [virstaAcquisition, virstaCrpGt190, virstaEmboli, virstaIntracardiacDevice, virstaIvdu, virstaMeningitis, virstaNativeValveDisease, virstaPersistentBacteremia48h, virstaPriorEndocarditis, virstaSevereSepsisShock, virstaVertebralOsteomyelitis]);

  const denovaScore = useMemo(() => [denovaDuration7d, denovaEmbolization, denovaNumPositive2, denovaOriginUnknown, denovaValveDisease, denovaAuscultationMurmur].filter(Boolean).length, [denovaDuration7d, denovaEmbolization, denovaNumPositive2, denovaOriginUnknown, denovaValveDisease, denovaAuscultationMurmur]);

  const handocScore = useMemo(() => {
    const ap = HANDOC_SPECIES_POINTS[handocSpecies];
    return (handocHeartMurmurValve ? 1 : 0) + ap + (handocNumPositive2 ? 1 : 0) + (handocDuration7d ? 1 : 0) + (handocOnlyOneSpecies ? 1 : 0) + (handocCommunityAcquired ? 1 : 0);
  }, [handocSpecies, handocCommunityAcquired, handocDuration7d, handocHeartMurmurValve, handocNumPositive2, handocOnlyOneSpecies]);

  useEffect(() => {
    if (activeModule.id !== "endo") return;
    const autoStates: Record<string, FindingState> = { endo_virsta_high: "unknown", endo_virsta_na: "unknown", endo_denova_high: "unknown", endo_denova_na: "unknown", endo_handoc_high: "unknown", endo_handoc_na: "unknown" };
    if (useVirsta) autoStates.endo_virsta_high = virstaScore >= 3 ? "present" : "absent";
    if (useDenova) autoStates.endo_denova_high = denovaScore >= 3 ? "present" : "absent";
    if (useHandoc) autoStates.endo_handoc_high = handocScore >= 3 ? "present" : "absent";
    setStates((prev) => { let c = false; const o = { ...prev }; for (const [id, n] of Object.entries(autoStates)) { if ((o[id] ?? "unknown") !== n) { o[id] = n; c = true; } } return c ? o : prev; });
    setClickOrder((prev) => { const o = [...prev]; let c = false; for (const id of ENDO_SCORE_ITEM_IDS) { const d = autoStates[id] ?? "unknown"; const i = o.indexOf(id); if (d === "unknown") { if (i !== -1) { o.splice(i, 1); c = true; } continue; } if (i === -1) { o.push(id); c = true; } } return c ? o : prev; });
  }, [denovaScore, handocScore, activeModule.id, useDenova, useHandoc, useVirsta, virstaScore]);

  function setItemState(item: LRItem, next: FindingState) {
    setStates((prev) => {
      const out = { ...prev, [item.id]: next };
      if (item.group && next !== "unknown") { for (const o of activeModule.items) { if (o.id !== item.id && o.group === item.group) out[o.id] = "unknown"; } }
      return out;
    });
    setClickOrder((prev) => {
      const isAct = next !== "unknown";
      let base = prev;
      if (item.group && isAct) base = prev.filter((id) => itemsById.get(id)?.group !== item.group);
      if (isAct) { const w = base.filter((id) => id !== item.id); return [...w, item.id]; }
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
    setStates({}); setClickOrder([]); setCatalogQuery(""); setActiveFamily("Location"); setShowSelectedOnly(false); setUtilityModifierState({});
    setUseVapRiskModifiers(false); setVapRiskState(DEFAULT_VAP_RISK_STATE);
    setUseEndoRiskModifiers(false); setEndoRiskState(DEFAULT_ENDO_RISK_STATE);
    setUseVirsta(false); setVirstaEmboli(false); setVirstaMeningitis(false); setVirstaIntracardiacDevice(false);
    setVirstaPriorEndocarditis(false); setVirstaNativeValveDisease(false); setVirstaIvdu(false);
    setVirstaPersistentBacteremia48h(false); setVirstaVertebralOsteomyelitis(false);
    setVirstaAcquisition("nosocomial"); setVirstaSevereSepsisShock(false); setVirstaCrpGt190(false);
    setUseDenova(false); setDenovaDuration7d(false); setDenovaEmbolization(false); setDenovaNumPositive2(false);
    setDenovaOriginUnknown(false); setDenovaValveDisease(false); setDenovaAuscultationMurmur(false);
    setUseHandoc(false); setHandocHeartMurmurValve(false); setHandocSpecies("unspecified_other");
    setHandocNumPositive2(false); setHandocDuration7d(false); setHandocOnlyOneSpecies(false); setHandocCommunityAcquired(false);
  }

  useEffect(() => {
    if (!catalogOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setCatalogOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [catalogOpen]);

  async function copyShareLink() {
    if (typeof window === "undefined") return;
    try { await navigator.clipboard.writeText(window.location.href); setShareStatus("copied"); setTimeout(() => setShareStatus("idle"), 2000); }
    catch { setShareStatus("error"); setTimeout(() => setShareStatus("idle"), 2000); }
  }

  const catalogQ = normalize(catalogQuery);
  const selectedCount = activeModule.items.filter((it) => (states[it.id] ?? "unknown") !== "unknown").length;

  return (
    <div className="idhub-tool-shell mx-auto max-w-6xl pb-20 lg:pb-6">
      {/* MOBILE: Verdict first */}
      <div className="lg:hidden">
        <ProbidVerdict
          postP={postP} pretestP={pretestP} treatmentThresholdP={treatmentThresholdP}
          treatmentThresholdLabel={thresholdCopy.treatThresholdLabel}
          observeThresholdP={adjustedActionThresholdModel ? observeThresholdP : null}
          observeThresholdLabel={thresholdCopy.observeThresholdLabel}
          combinedLR={lr} recommendation={recommendation}
          recommendationBadgeLabel={recBadgeLabel}
          recommendationHeadline={recHeadline} recommendationDetail={recDetail}
          showAdjustedPretest={showAdjustedPretest} basePretestP={basePretestP}
          syndromeName={activeModule.name} settingLabel={preset?.label ?? ""}
          onCopyShareLink={copyShareLink} shareStatus={shareStatus}
        />
        <div className="mt-3">
          <ProbidThresholdHighway
            currentP={postP} treatThresholdP={treatmentThresholdP}
            observeThresholdP={observeThresholdP} recommendation={recommendation} compact
            observeZoneLabel={activeModule.id === "pji" ? "Stop" : thresholdCopy.observeZoneLabel}
            testZoneLabel={activeModule.id === "pji" ? "Clarify" : "Test more"}
            treatZoneLabel={activeModule.id === "pji" ? "Manage" : thresholdCopy.treatZoneLabel}
            observeThresholdLabel={activeModule.id === "pji" ? "Stop" : thresholdCopy.observeThresholdShortLabel}
            treatThresholdLabel={activeModule.id === "pji" ? "Manage" : thresholdCopy.treatThresholdShortLabel}
          />
        </div>
      </div>

      {/* 2-column desktop / stacked mobile */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] xl:gap-7">
        {/* LEFT: Build panel */}
        <ProbidBuildPanel
          activeModule={activeModule} presetId={presetId} states={states}
          onSetModule={(id) => setModuleId(id)}
          onSetPreset={(id) => setPresetId(id)}
          onSetItemState={setItemState}
          onOpenCatalog={() => setCatalogOpen(true)}
          onReset={resetAll}
          isAutoManagedLocked={isAutoManagedLocked}
        />

        {/* RIGHT: Result panel (desktop only on lg+, always on mobile below verdict) */}
        <div className="space-y-4 lg:space-y-5">
          {/* Desktop verdict */}
          <div className="hidden lg:block">
            <ProbidVerdict
              postP={postP} pretestP={pretestP} treatmentThresholdP={treatmentThresholdP}
              treatmentThresholdLabel={thresholdCopy.treatThresholdLabel}
              observeThresholdP={adjustedActionThresholdModel ? observeThresholdP : null}
              observeThresholdLabel={thresholdCopy.observeThresholdLabel}
              combinedLR={lr} recommendation={recommendation}
              recommendationBadgeLabel={recBadgeLabel}
              recommendationHeadline={recHeadline} recommendationDetail={recDetail}
              showAdjustedPretest={showAdjustedPretest} basePretestP={basePretestP}
              syndromeName={activeModule.name} settingLabel={preset?.label ?? ""}
              onCopyShareLink={copyShareLink} shareStatus={shareStatus}
            />
          </div>

          {/* Threshold highway (desktop full) */}
          <div className="hidden lg:block">
            <ProbidThresholdHighway
              currentP={postP} treatThresholdP={treatmentThresholdP}
              observeThresholdP={observeThresholdP} recommendation={recommendation}
              observeZoneLabel={thresholdCopy.observeZoneLabel}
              testZoneLabel={thresholdCopy.testZoneLabel}
              treatZoneLabel={thresholdCopy.treatZoneLabel}
              observeThresholdLabel={thresholdCopy.observeThresholdShortLabel}
              treatThresholdLabel={thresholdCopy.treatThresholdShortLabel}
            />
          </div>

          <ProbidProbabilityTrace
            pretestP={pretestP}
            steps={steps}
            currentP={postP}
            observeThresholdP={observeThresholdP}
            treatThresholdP={treatmentThresholdP}
            observeZoneLabel={thresholdCopy.observeZoneLabel}
            middleZoneLabel={thresholdCopy.testZoneLabel}
            treatZoneLabel={thresholdCopy.treatZoneLabel}
            observeThresholdLabel={thresholdCopy.observeThresholdLabel}
            treatThresholdLabel={thresholdCopy.treatThresholdLabel}
          />

          {/* Syndrome-specific risk modifiers */}
          {activeModule.id === "vap" && <VapRiskModifiers
            useVapRiskModifiers={useVapRiskModifiers} setUseVapRiskModifiers={setUseVapRiskModifiers}
            vapRiskState={vapRiskState} toggleVapRiskFactor={(id) => setVapRiskState((p) => ({ ...p, [id]: !p[id] }))}
            vapSelectedRiskFactors={vapSelectedRiskFactors} vapRiskRawMultiplier={vapRiskRawMultiplier}
            vapRiskAppliedMultiplier={vapRiskAppliedMultiplier} basePretestP={basePretestP} pretestP={pretestP}
          />}
          {activeModule.id === "endo" && <EndoRiskModifiers
            useEndoRiskModifiers={useEndoRiskModifiers} setUseEndoRiskModifiers={setUseEndoRiskModifiers}
            endoRiskState={endoRiskState} toggleEndoRiskFactor={(id) => setEndoRiskState((p) => ({ ...p, [id]: !p[id] }))}
            endoAppliedRiskFactors={endoAppliedRiskFactors} endoSuppressedRiskFactors={endoSuppressedRiskFactors}
            endoRiskRawMultiplier={endoRiskRawMultiplier}
            endoRiskAppliedMultiplier={endoRiskAppliedMultiplier} basePretestP={basePretestP} pretestP={pretestP}
            useVirsta={useVirsta}
          />}
          {activeModule.id === "endo" && <EndoScoreAutocompute
            useVirsta={useVirsta} setUseVirsta={setUseVirsta} virstaScore={virstaScore}
            virstaEmboli={virstaEmboli} setVirstaEmboli={setVirstaEmboli}
            virstaMeningitis={virstaMeningitis} setVirstaMeningitis={setVirstaMeningitis}
            virstaIntracardiacDevice={virstaIntracardiacDevice} setVirstaIntracardiacDevice={setVirstaIntracardiacDevice}
            virstaPriorEndocarditis={virstaPriorEndocarditis} setVirstaPriorEndocarditis={setVirstaPriorEndocarditis}
            virstaNativeValveDisease={virstaNativeValveDisease} setVirstaNativeValveDisease={setVirstaNativeValveDisease}
            virstaIvdu={virstaIvdu} setVirstaIvdu={setVirstaIvdu}
            virstaPersistentBacteremia48h={virstaPersistentBacteremia48h} setVirstaPersistentBacteremia48h={setVirstaPersistentBacteremia48h}
            virstaVertebralOsteomyelitis={virstaVertebralOsteomyelitis} setVirstaVertebralOsteomyelitis={setVirstaVertebralOsteomyelitis}
            virstaAcquisition={virstaAcquisition} setVirstaAcquisition={setVirstaAcquisition}
            virstaSevereSepsisShock={virstaSevereSepsisShock} setVirstaSevereSepsisShock={setVirstaSevereSepsisShock}
            virstaCrpGt190={virstaCrpGt190} setVirstaCrpGt190={setVirstaCrpGt190}
            useDenova={useDenova} setUseDenova={setUseDenova} denovaScore={denovaScore}
            denovaDuration7d={denovaDuration7d} setDenovaDuration7d={setDenovaDuration7d}
            denovaEmbolization={denovaEmbolization} setDenovaEmbolization={setDenovaEmbolization}
            denovaNumPositive2={denovaNumPositive2} setDenovaNumPositive2={setDenovaNumPositive2}
            denovaOriginUnknown={denovaOriginUnknown} setDenovaOriginUnknown={setDenovaOriginUnknown}
            denovaValveDisease={denovaValveDisease} setDenovaValveDisease={setDenovaValveDisease}
            denovaAuscultationMurmur={denovaAuscultationMurmur} setDenovaAuscultationMurmur={setDenovaAuscultationMurmur}
            useHandoc={useHandoc} setUseHandoc={setUseHandoc} handocScore={handocScore}
            handocHeartMurmurValve={handocHeartMurmurValve} setHandocHeartMurmurValve={setHandocHeartMurmurValve}
            handocSpecies={handocSpecies} setHandocSpecies={setHandocSpecies}
            handocNumPositive2={handocNumPositive2} setHandocNumPositive2={setHandocNumPositive2}
            handocDuration7d={handocDuration7d} setHandocDuration7d={setHandocDuration7d}
            handocOnlyOneSpecies={handocOnlyOneSpecies} setHandocOnlyOneSpecies={setHandocOnlyOneSpecies}
            handocCommunityAcquired={handocCommunityAcquired} setHandocCommunityAcquired={setHandocCommunityAcquired}
            useEndoRiskModifiers={useEndoRiskModifiers}
          />}

          {/* Test Impact */}
          <div>
            <div className="text-sm font-semibold text-gray-900">What if you ordered more tests?</div>
            <p className="mt-1 text-xs text-gray-600">
              {testImpactIntro}
            </p>
            <div className="mt-3">
              <ProbidTestImpact
                entries={testImpactEntries}
                treatThresholdP={treatmentThresholdP}
                observeThresholdP={observeThresholdP}
                currentP={postP}
                onAddTest={(itemId, state) => {
                  const item = itemsById.get(itemId);
                  if (item) setItemState(item, state);
                }}
              />
            </div>
          </div>

          {/* Patient factors */}
          <ProbidPatientFactors
            adjustedUtilityModel={adjustedUtilityModel}
            adjustedActionThresholdModel={adjustedActionThresholdModel}
            utilityModifierState={utilityModifierState}
            onToggleModifier={(id) => setUtilityModifierState((p) => ({ ...p, [id]: !p[id] }))}
            expectedUtilityTreat={expectedUtilityResult?.treat ?? null}
            expectedUtilityNoTreat={expectedUtilityResult?.noTreat ?? null}
            expectedUtilityNetBenefit={expectedUtilityResult?.netBenefit ?? null}
            currentProbability={postP}
            stopThresholdP={adjustedActionThresholdModel ? observeThresholdP : null}
            manageThresholdP={adjustedActionThresholdModel ? treatmentThresholdP : null}
          />

          {/* Math details */}
          <ProbidMathDetails
            steps={steps} pretestP={pretestP} combinedLR={lr}
            showAdjustedPretest={showAdjustedPretest} basePretestP={basePretestP}
            harmEstimate={!adjustedUtilityModel && !adjustedActionThresholdModel ? { baseMissedDx: harmEstimate.baseMissedDx, baseUnnecessaryTx: harmEstimate.baseUnnecessaryTx, missedDx: harmEstimate.missedDx, unnecessaryTx: harmEstimate.unnecessaryTx, rationale: harmEstimate.rationale, missedDxDrivers: harmEstimate.missedDxDrivers, baseEvidence: harmEstimate.baseEvidence } : null}
            adjustedUtilityModel={adjustedUtilityModel ?? undefined}
            adjustedActionThresholdModel={adjustedActionThresholdModel ?? undefined}
            actionThresholds={actionThresholds ?? undefined}
          />

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            Educational content only. Not medical advice.{" "}
            <Link href="/probid/references" className="underline decoration-gray-400 underline-offset-2 hover:decoration-gray-900">
              See references &amp; methodology.
            </Link>
          </div>
        </div>
      </div>

      {/* Floating mobile bar */}
      <ProbidFloatingBar
        postP={postP} treatmentThresholdP={treatmentThresholdP}
        recommendation={recommendation} recommendationHeadline={recHeadline}
        recommendationBadgeLabel={recBadgeLabel}
        treatmentThresholdLabel={thresholdCopy.treatThresholdLabel}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />

      {/* CATALOG MODAL */}
      {catalogOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/30" onClick={() => setCatalogOpen(false)} />
          <div className="relative z-10 flex h-[92dvh] max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[1.5rem] border bg-white shadow-lg sm:h-[min(720px,calc(100dvh-1rem))] sm:max-h-[calc(100dvh-1rem)] sm:w-[min(980px,calc(100vw-1rem))] sm:rounded-[1.5rem]">
            <div className="flex items-start justify-between gap-4 border-b bg-white p-4">
              <div className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-gray-200 sm:hidden" />
              <div className="min-w-0">
                <div className="text-lg font-semibold text-gray-900">Browse catalog</div>
                <div className="mt-1 text-sm text-gray-600">Pick a category, then mark items Present/Absent.</div>
                <div className="mt-2 text-xs text-gray-500">
                  Selected <span className="font-semibold text-gray-900">{selectedCount}</span> · Pretest <span className="font-semibold text-gray-900">{formatPct(pretestP)}</span>
                </div>
              </div>
              <button type="button" onClick={() => setCatalogOpen(false)} className="shrink-0 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">Close</button>
            </div>

            <div className="border-b bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:max-w-md">
                  <label className="text-sm font-medium text-gray-700">Search</label>
                  <input value={catalogQuery} onChange={(e) => setCatalogQuery(e.target.value)} placeholder="Search by label…" className="mt-2 w-full rounded-lg border px-3 py-2 text-sm" />
                  {catalogQuery && <button type="button" onClick={() => setCatalogQuery("")} className="mt-2 text-xs text-gray-600 underline hover:text-gray-900">Clear search</button>}
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setShowSelectedOnly((v) => !v)} className={["rounded-md border px-3 py-2 text-sm", showSelectedOnly ? "border-gray-900 bg-gray-900 text-white" : "hover:bg-gray-50"].join(" ")}>{showSelectedOnly ? "Showing: Selected" : "Show selected only"}</button>
                </div>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col md:flex-row">
              <aside className="sticky top-0 z-10 w-full border-b bg-gray-50 p-2 md:static md:w-52 md:border-b-0 md:border-r">
                <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">Categories</div>
                <div className="flex gap-2 overflow-x-auto pb-1 md:block md:overflow-visible md:pb-0">
                  {(["Location", ...FAMILY_ORDER.filter((f) => f !== "Location")] as string[]).map((fam) => {
                    const isActive = fam === activeFamily;
                    const count = fam === "Location" ? activeModule.pretestPresets.length : activeModule.items.filter((it) => familyFor(it) === fam).length;
                    return (
                      <button key={fam} type="button" onClick={() => setActiveFamily(fam)} className={["mb-1 flex shrink-0 items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm md:w-full", isActive ? "bg-white border border-gray-200 shadow-sm" : "hover:bg-white/70"].join(" ")}>
                        <span className="truncate">{fam}</span><span className="ml-2 text-xs text-gray-500">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <section className="min-w-0 flex-1 overflow-y-auto p-4" style={{ WebkitOverflowScrolling: "touch" }}>
                {activeFamily === "Location" ? (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-900">Location / Setting</div>
                    <div className="text-xs text-gray-600">Choosing location sets the pretest probability.</div>
                    <div className="mt-3 space-y-2">
                      {activeModule.pretestPresets.filter((p) => !catalogQ || p.label.toLowerCase().includes(catalogQ)).map((p) => (
                        <button key={p.id} type="button" onClick={() => setPresetId(p.id)} className={["w-full rounded-lg border px-3 py-2 text-left hover:bg-gray-50", p.id === presetId ? "border-gray-900 bg-gray-900 text-white hover:bg-gray-900" : ""].join(" ")}>
                          <div className="font-medium">{p.label}</div>
                          <div className="text-xs opacity-90">Pretest {formatPct(p.p)}</div>
                          {p.notes ? <div className="mt-1 text-xs opacity-80">{p.notes}</div> : null}
                          {p.source ? (
                            <div className="mt-1 text-[11px] opacity-80">
                              Evidence: {p.source.short}{p.source.year ? ` (${p.source.year})` : ""}
                            </div>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-gray-900">{activeFamily}</div>
                    {(() => {
                      const items = activeModule.items.filter((it) => familyFor(it) === activeFamily).filter((it) => catalogQ ? matchesQuery(it, catalogQ) : true).filter((it) => !showSelectedOnly || (states[it.id] ?? "unknown") !== "unknown");
                      if (items.length === 0) return <div className="rounded-lg border bg-gray-50 p-4 text-sm text-gray-700">No items found.</div>;
                      const byGroup: Record<string, LRItem[]> = {};
                      for (const it of items) (byGroup[it.group ?? "General"] ??= []).push(it);
                      return (
                        <div className="space-y-4">
                          {Object.keys(byGroup).sort().map((gk) => (
                            <div key={gk} className="rounded-lg border">
                              <div className="border-b bg-gray-50 px-3 py-2"><div className="text-xs font-semibold uppercase tracking-wide text-gray-700">{gk}</div></div>
                              <div className="divide-y">
                                {byGroup[gk].map((it) => {
                                  const st = states[it.id] ?? "unknown";
                                  const locked = isAutoManagedLocked(it.id);
                                  return (
                                    <div key={it.id} className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                                      <div className="min-w-0">
                                        <div className="text-sm font-medium text-gray-900">{it.label}</div>
                                        {it.notes ? <div className="mt-0.5 text-xs text-gray-600">{it.notes}</div> : null}
                                        {it.source ? <div className="mt-1 text-xs text-gray-600">Source: {it.source.url ? <a href={it.source.url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-gray-900">{it.source.short}{it.source.year ? ` (${it.source.year})` : ""}</a> : <span>{it.source.short}{it.source.year ? ` (${it.source.year})` : ""}</span>}</div> : null}
                                      </div>
                                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                                        <button type="button" disabled={locked} onClick={() => setItemState(it, "present")} className={["rounded-lg border px-3 py-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40", st === "present" ? "border-gray-900 bg-gray-900 text-white" : "hover:bg-gray-50"].join(" ")}>Present</button>
                                        <button type="button" disabled={locked} onClick={() => setItemState(it, "absent")} className={["rounded-lg border px-3 py-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40", st === "absent" ? "border-gray-900 bg-gray-900 text-white" : "hover:bg-gray-50"].join(" ")}>Absent</button>
                                        <button type="button" disabled={locked} onClick={() => setItemState(it, "unknown")} className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40" title="Clear">Clear</button>
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

            <div className="border-t bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-700">
                  Selected: <span className="font-semibold">{selectedCount}</span> · Pretest <span className="font-semibold">{formatPct(pretestP)}</span>
                  {showAdjustedPretest ? <span className="ml-2 text-xs text-gray-600">(base {formatPct(basePretestP)})</span> : null}
                </div>
                <button type="button" onClick={() => setCatalogOpen(false)} className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">Done</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function toFindingStateMap(value: unknown): Record<string, FindingState> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, FindingState> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (raw === "present" || raw === "absent" || raw === "unknown") out[key] = raw;
  }
  return out;
}

function toBooleanRecord(value: unknown): Record<string, boolean> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, boolean> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (typeof raw === "boolean") out[key] = raw;
  }
  return out;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function VapRiskModifiers({ useVapRiskModifiers, setUseVapRiskModifiers, vapRiskState, toggleVapRiskFactor, vapSelectedRiskFactors, vapRiskRawMultiplier, vapRiskAppliedMultiplier, basePretestP, pretestP }: {
  useVapRiskModifiers: boolean; setUseVapRiskModifiers: (v: boolean) => void;
  vapRiskState: Record<VapRiskFactorId, boolean>; toggleVapRiskFactor: (id: VapRiskFactorId) => void;
  vapSelectedRiskFactors: VapRiskFactorOption[]; vapRiskRawMultiplier: number; vapRiskAppliedMultiplier: number;
  basePretestP: number; pretestP: number;
}) {
  return (
    <details className="group rounded-xl border p-4 transition-colors open:bg-gray-50/50">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="text-sm font-semibold text-gray-900">VAP risk modifiers (pretest)</span>
        <span className="text-xs text-gray-500 transition-transform duration-200 group-open:rotate-180">▾</span>
      </summary>
      <p className="mt-2 text-xs text-gray-600">Adjust the ICU time-based pretest using pooled VAP risk-factor ORs. These are not diagnostic test LRs.</p>
      <div className="mt-3 rounded-md border bg-white p-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
          <input type="checkbox" checked={useVapRiskModifiers} onChange={(e) => setUseVapRiskModifiers(e.target.checked)} />
          Apply VAP risk-factor pretest adjustment
        </label>
        {useVapRiskModifiers && (
          <div className="mt-3 space-y-3">
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {VAP_RISK_FACTOR_OPTIONS.map((rf) => (
                <label key={rf.id} className="inline-flex items-center gap-2 text-xs text-gray-700">
                  <input type="checkbox" checked={vapRiskState[rf.id]} onChange={() => toggleVapRiskFactor(rf.id)} />
                  {rf.label} <span className="text-gray-500">(OR {rf.pooledOr.toFixed(2)})</span>
                </label>
              ))}
            </div>
            <div className="rounded border bg-gray-50 px-2 py-2 text-xs text-gray-700 space-y-1">
              <div>Selected: <span className="font-semibold">{vapSelectedRiskFactors.length}</span></div>
              <div>Raw OR: <span className="font-semibold">{vapRiskRawMultiplier.toFixed(2)}</span> → Applied: <span className="font-semibold">{vapRiskAppliedMultiplier.toFixed(2)}</span></div>
              <div>Pretest <span className="font-semibold">{formatPct(basePretestP)}</span> → <span className="font-semibold">{formatPct(pretestP)}</span></div>
            </div>
          </div>
        )}
      </div>
    </details>
  );
}

function EndoRiskModifiers({ useEndoRiskModifiers, setUseEndoRiskModifiers, endoRiskState, toggleEndoRiskFactor, endoAppliedRiskFactors, endoSuppressedRiskFactors, endoRiskRawMultiplier, endoRiskAppliedMultiplier, basePretestP, pretestP, useVirsta }: {
  useEndoRiskModifiers: boolean; setUseEndoRiskModifiers: (v: boolean) => void;
  endoRiskState: Record<EndoRiskFactorId, boolean>; toggleEndoRiskFactor: (id: EndoRiskFactorId) => void;
  endoAppliedRiskFactors: EndoRiskFactorOption[]; endoSuppressedRiskFactors: EndoRiskFactorOption[];
  endoRiskRawMultiplier: number; endoRiskAppliedMultiplier: number;
  basePretestP: number; pretestP: number; useVirsta: boolean;
}) {
  return (
    <details className="group rounded-xl border p-4 transition-colors open:bg-gray-50/50">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="text-sm font-semibold text-gray-900">Endocarditis host risk (pretest)</span>
        <span className="text-xs text-gray-500 transition-transform duration-200 group-open:rotate-180">▾</span>
      </summary>
      <div className="mt-3 rounded-md border bg-white p-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
          <input type="checkbox" checked={useEndoRiskModifiers} onChange={(e) => setUseEndoRiskModifiers(e.target.checked)} />
          Apply host-risk pretest adjustment
        </label>
        {useEndoRiskModifiers && (
          <div className="mt-3 space-y-3">
            <div className="rounded border bg-gray-50 p-2">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">General IE Host Risk</div>
              <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                {ENDO_RISK_FACTOR_OPTIONS.filter((rf) => rf.group === "general_ie").map((rf) => (
                  <label key={rf.id} className="inline-flex items-center gap-2 text-xs text-gray-700">
                    <input type="checkbox" checked={endoRiskState[rf.id]} onChange={() => toggleEndoRiskFactor(rf.id)} />
                    {rf.label} <span className="text-gray-500">(OR {rf.orLike.toFixed(2)})</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="rounded border bg-gray-50 p-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">SAB Context</div>
                {useVirsta && <span className="text-[10px] rounded border bg-white px-2 py-0.5 text-gray-600">suppressed by VIRSTA</span>}
              </div>
              <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                {ENDO_RISK_FACTOR_OPTIONS.filter((rf) => rf.group === "sab_context").map((rf) => (
                  <label key={rf.id} className={`inline-flex items-center gap-2 text-xs ${useVirsta ? "text-gray-400" : "text-gray-700"}`}>
                    <input type="checkbox" checked={endoRiskState[rf.id]} onChange={() => toggleEndoRiskFactor(rf.id)} disabled={useVirsta} />
                    {rf.label} <span className="text-gray-500">(OR {rf.orLike.toFixed(2)})</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="rounded border bg-gray-50 px-2 py-2 text-xs text-gray-700 space-y-1">
              <div>Applied: <span className="font-semibold">{endoAppliedRiskFactors.length}</span> {endoSuppressedRiskFactors.length > 0 && <span className="text-gray-500">({endoSuppressedRiskFactors.length} SAB excluded by VIRSTA)</span>}</div>
              <div>Raw: <span className="font-semibold">{endoRiskRawMultiplier.toFixed(2)}</span> → Applied: <span className="font-semibold">{endoRiskAppliedMultiplier.toFixed(2)}</span></div>
              <div>Pretest <span className="font-semibold">{formatPct(basePretestP)}</span> → <span className="font-semibold">{formatPct(pretestP)}</span></div>
            </div>
          </div>
        )}
      </div>
    </details>
  );
}

function EndoScoreAutocompute(props: {
  useVirsta: boolean; setUseVirsta: (v: boolean) => void; virstaScore: number;
  virstaEmboli: boolean; setVirstaEmboli: (v: boolean) => void;
  virstaMeningitis: boolean; setVirstaMeningitis: (v: boolean) => void;
  virstaIntracardiacDevice: boolean; setVirstaIntracardiacDevice: (v: boolean) => void;
  virstaPriorEndocarditis: boolean; setVirstaPriorEndocarditis: (v: boolean) => void;
  virstaNativeValveDisease: boolean; setVirstaNativeValveDisease: (v: boolean) => void;
  virstaIvdu: boolean; setVirstaIvdu: (v: boolean) => void;
  virstaPersistentBacteremia48h: boolean; setVirstaPersistentBacteremia48h: (v: boolean) => void;
  virstaVertebralOsteomyelitis: boolean; setVirstaVertebralOsteomyelitis: (v: boolean) => void;
  virstaAcquisition: VirstaAcquisition; setVirstaAcquisition: (v: VirstaAcquisition) => void;
  virstaSevereSepsisShock: boolean; setVirstaSevereSepsisShock: (v: boolean) => void;
  virstaCrpGt190: boolean; setVirstaCrpGt190: (v: boolean) => void;
  useDenova: boolean; setUseDenova: (v: boolean) => void; denovaScore: number;
  denovaDuration7d: boolean; setDenovaDuration7d: (v: boolean) => void;
  denovaEmbolization: boolean; setDenovaEmbolization: (v: boolean) => void;
  denovaNumPositive2: boolean; setDenovaNumPositive2: (v: boolean) => void;
  denovaOriginUnknown: boolean; setDenovaOriginUnknown: (v: boolean) => void;
  denovaValveDisease: boolean; setDenovaValveDisease: (v: boolean) => void;
  denovaAuscultationMurmur: boolean; setDenovaAuscultationMurmur: (v: boolean) => void;
  useHandoc: boolean; setUseHandoc: (v: boolean) => void; handocScore: number;
  handocHeartMurmurValve: boolean; setHandocHeartMurmurValve: (v: boolean) => void;
  handocSpecies: HandocSpecies; setHandocSpecies: (v: HandocSpecies) => void;
  handocNumPositive2: boolean; setHandocNumPositive2: (v: boolean) => void;
  handocDuration7d: boolean; setHandocDuration7d: (v: boolean) => void;
  handocOnlyOneSpecies: boolean; setHandocOnlyOneSpecies: (v: boolean) => void;
  handocCommunityAcquired: boolean; setHandocCommunityAcquired: (v: boolean) => void;
  useEndoRiskModifiers: boolean;
}) {
  return (
    <details className="group rounded-xl border p-4 transition-colors open:bg-gray-50/50">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="text-sm font-semibold text-gray-900">Endocarditis score auto-compute</span>
        <span className="text-xs text-gray-500 transition-transform duration-200 group-open:rotate-180">▾</span>
      </summary>
      <p className="mt-2 text-xs text-gray-600">Enable a score, mark its components, and ProbID auto-applies the threshold LR item.</p>
      <div className="mt-3 space-y-3">
        {/* VIRSTA */}
        <div className="rounded-md border bg-white p-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <input type="checkbox" checked={props.useVirsta} onChange={(e) => props.setUseVirsta(e.target.checked)} />
            VIRSTA (for SAB)
          </label>
          {props.useVirsta && (
            <div className="mt-3 space-y-2 text-xs text-gray-700">
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.virstaEmboli} onChange={(e) => props.setVirstaEmboli(e.target.checked)} />Emboli (5)</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.virstaMeningitis} onChange={(e) => props.setVirstaMeningitis(e.target.checked)} />Meningitis (5)</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.virstaIntracardiacDevice} onChange={(e) => props.setVirstaIntracardiacDevice(e.target.checked)} />Intracardiac device (4)</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.virstaPriorEndocarditis} onChange={(e) => props.setVirstaPriorEndocarditis(e.target.checked)} />Prior endocarditis (4)</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.virstaNativeValveDisease} onChange={(e) => props.setVirstaNativeValveDisease(e.target.checked)} />Native valve disease (3)</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.virstaIvdu} onChange={(e) => props.setVirstaIvdu(e.target.checked)} />IVDU (4)</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.virstaPersistentBacteremia48h} onChange={(e) => props.setVirstaPersistentBacteremia48h(e.target.checked)} />Persistent bacteremia &gt;48h (3)</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.virstaVertebralOsteomyelitis} onChange={(e) => props.setVirstaVertebralOsteomyelitis(e.target.checked)} />Vertebral osteomyelitis (2)</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.virstaSevereSepsisShock} onChange={(e) => props.setVirstaSevereSepsisShock(e.target.checked)} />Severe sepsis/shock (1)</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.virstaCrpGt190} onChange={(e) => props.setVirstaCrpGt190(e.target.checked)} />CRP &gt;190 (1)</label>
              </div>
              <label className="space-y-1">
                <span className="block text-[11px] uppercase tracking-wide text-gray-500">Acquisition</span>
                <select value={props.virstaAcquisition} onChange={(e) => props.setVirstaAcquisition(e.target.value as VirstaAcquisition)} className="w-full rounded border px-2 py-1 text-xs">
                  <option value="nosocomial">Nosocomial (0)</option>
                  <option value="community_or_nhca">Community or non-nosocomial healthcare-associated (+2)</option>
                </select>
              </label>
              <div className="rounded border bg-gray-50 px-2 py-1">VIRSTA score: <span className="font-semibold">{props.virstaScore}</span> (high if &ge;3)</div>
              {props.useEndoRiskModifiers && <div className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-900">SAB-context host-risk modifiers suppressed while VIRSTA is enabled.</div>}
            </div>
          )}
        </div>
        {/* DENOVA */}
        <div className="rounded-md border bg-white p-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <input type="checkbox" checked={props.useDenova} onChange={(e) => props.setUseDenova(e.target.checked)} />
            DENOVA (for E. faecalis)
          </label>
          {props.useDenova && (
            <div className="mt-3 space-y-2 text-xs text-gray-700">
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.denovaDuration7d} onChange={(e) => props.setDenovaDuration7d(e.target.checked)} />Duration &ge;7 days</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.denovaEmbolization} onChange={(e) => props.setDenovaEmbolization(e.target.checked)} />Embolization</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.denovaNumPositive2} onChange={(e) => props.setDenovaNumPositive2(e.target.checked)} />&ge;2 positive cultures</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.denovaOriginUnknown} onChange={(e) => props.setDenovaOriginUnknown(e.target.checked)} />Origin unknown</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.denovaValveDisease} onChange={(e) => props.setDenovaValveDisease(e.target.checked)} />Valve disease</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.denovaAuscultationMurmur} onChange={(e) => props.setDenovaAuscultationMurmur(e.target.checked)} />Auscultation murmur</label>
              </div>
              <div className="rounded border bg-gray-50 px-2 py-1">DENOVA score: <span className="font-semibold">{props.denovaScore}</span> (high if &ge;3)</div>
            </div>
          )}
        </div>
        {/* HANDOC */}
        <div className="rounded-md border bg-white p-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <input type="checkbox" checked={props.useHandoc} onChange={(e) => props.setUseHandoc(e.target.checked)} />
            HANDOC (for NBHS)
          </label>
          {props.useHandoc && (
            <div className="mt-3 space-y-2 text-xs text-gray-700">
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.handocHeartMurmurValve} onChange={(e) => props.setHandocHeartMurmurValve(e.target.checked)} />Heart murmur/valve</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.handocNumPositive2} onChange={(e) => props.setHandocNumPositive2(e.target.checked)} />&ge;2 positive cultures</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.handocDuration7d} onChange={(e) => props.setHandocDuration7d(e.target.checked)} />Duration &ge;7 days</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.handocOnlyOneSpecies} onChange={(e) => props.setHandocOnlyOneSpecies(e.target.checked)} />Only one species</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={props.handocCommunityAcquired} onChange={(e) => props.setHandocCommunityAcquired(e.target.checked)} />Community acquired</label>
              </div>
              <label className="space-y-1">
                <span className="block text-[11px] uppercase tracking-wide text-gray-500">Species</span>
                <select value={props.handocSpecies} onChange={(e) => props.setHandocSpecies(e.target.value as HandocSpecies)} className="w-full rounded border px-2 py-1 text-xs">
                  <option value="unspecified_other">Other (0)</option>
                  <option value="s_anginosus_group">S. anginosus group (-1)</option>
                  <option value="s_gallolyticus_bovis_group">S. gallolyticus (bovis) (+1)</option>
                  <option value="s_mutans_group">S. mutans (+1)</option>
                  <option value="s_sanguinis_group">S. sanguinis (+1)</option>
                  <option value="s_mitis_oralis_group">S. mitis/oralis (0)</option>
                  <option value="s_salivarius_group">S. salivarius (0)</option>
                </select>
              </label>
              <div className="rounded border bg-gray-50 px-2 py-1">HANDOC score: <span className="font-semibold">{props.handocScore}</span> (high if &ge;3)</div>
            </div>
          )}
        </div>
      </div>
    </details>
  );
}
