"use client";

import React, { useMemo, useState } from "react";
import type { FindingState, LRItem, SyndromeLRModule } from "@/lib/lrTypes";
import { formatPct } from "@/lib/lrMath";
import { FAMILY_ORDER, familyFor, matchesQuery, normalize } from "@/lib/probidCatalog";
import { SYNDROME_GROUPS } from "@/lib/probidSyndromesCatalog";
import { LRItemToggle } from "@/components/LRItemToggle";

type Props = {
  activeModule: SyndromeLRModule;
  presetId: string;
  states: Record<string, FindingState>;
  onSetModule: (id: string) => void;
  onSetPreset: (id: string) => void;
  onSetItemState: (item: LRItem, state: FindingState) => void;
  onOpenCatalog: () => void;
  onReset: () => void;
  isAutoManagedLocked: (itemId: string) => boolean;
  patientFactorsStep?: {
    selectedCount: number;
    content: React.ReactNode;
  } | null;
};

const PATIENT_FACTORS_STEP_ID = "__patient_factors__";

type GuidedStep = {
  id: string;
  label: string;
  items: LRItem[];
  selectedCount: number;
  presentCount: number;
  kind: "findings" | "patient_factors";
};

function stepDescription(stepId: string) {
  switch (stepId) {
    case "Host":
      return "Start with baseline context, host susceptibility, and revision-risk enrichers.";
    case "Symptoms":
      return "Document the symptom story before moving into objective data.";
    case "Vitals":
      return "Capture fever or other physiologic signals that shift suspicion.";
    case "Exam":
      return "Record wound findings, sinus tract, and local joint inflammation.";
    case "Labs":
      return "Choose one serum anchor and the aspiration-zone findings that best match the evidence.";
    case "Micro":
      return "Add culture or molecular confirmation when it is truly part of the case.";
    case "Imaging":
      return "Supportive imaging belongs late and should not outweigh stronger blocks.";
    case PATIENT_FACTORS_STEP_ID:
      return "Finish by showing why frailty, revision plans, and treatment burden change the decision thresholds.";
    default:
      return "Document the case in the same order you would write a clinical note.";
  }
}

export function ProbidBuildPanel({
  activeModule,
  presetId,
  states,
  onSetModule,
  onSetPreset,
  onSetItemState,
  onOpenCatalog,
  onReset,
  isAutoManagedLocked,
  patientFactorsStep,
}: Props) {
  const noteFlowFamilies = useMemo(
    () => FAMILY_ORDER.filter((fam) => !["Location", "Other"].includes(fam)),
    []
  );
  const activeGroupId = useMemo(() => {
    for (const g of SYNDROME_GROUPS) {
      if (g.syndromes.some((s) => s.moduleId === activeModule.id)) return g.id;
    }
    return SYNDROME_GROUPS[0].id;
  }, [activeModule.id]);

  const [expandedGroup, setExpandedGroup] = useState<string>(activeGroupId);
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const stepRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const hasMountedRef = React.useRef(false);

  const preset = activeModule.pretestPresets.find((p) => p.id === presetId) ?? activeModule.pretestPresets[0];

  const itemsByFamily = useMemo(() => {
    const map: Record<string, LRItem[]> = {};
    for (const fam of FAMILY_ORDER) {
      if (fam === "Location") continue;
      map[fam] = activeModule.items.filter((it) => familyFor(it) === fam);
    }
      return map;
  }, [activeModule.items]);

  const categorySummaries = useMemo(
    () =>
      noteFlowFamilies.flatMap((family) => {
        const items = itemsByFamily[family] ?? [];
        if (items.length === 0) return [];
        const selected = items.filter((it) => (states[it.id] ?? "unknown") !== "unknown").length;
        const present = items.filter((it) => (states[it.id] ?? "unknown") === "present").length;
        return [{ family, items, selected, present }];
      }),
    [itemsByFamily, noteFlowFamilies, states]
  );

  const guidedSteps = useMemo(() => {
    const baseSteps: GuidedStep[] = categorySummaries.map((entry) => ({
      id: entry.family,
      label: entry.family,
      items: entry.items,
      selectedCount: entry.selected,
      presentCount: entry.present,
      kind: "findings" as const,
    }));

    if (patientFactorsStep) {
      baseSteps.push({
        id: PATIENT_FACTORS_STEP_ID,
        label: "Patient factors",
        items: [],
        selectedCount: patientFactorsStep.selectedCount,
        presentCount: patientFactorsStep.selectedCount,
        kind: "patient_factors" as const,
      });
    }

    return baseSteps;
  }, [categorySummaries, patientFactorsStep]);

  const defaultExpandedStepId = useMemo(
    () => guidedSteps[0]?.id ?? null,
    [guidedSteps]
  );

  React.useEffect(() => {
    setExpandedGroup(activeGroupId);
    setExpandedStepId(defaultExpandedStepId);
    setSearchQuery("");
  }, [activeGroupId, activeModule.id, defaultExpandedStepId]);

  React.useEffect(() => {
    if (!expandedStepId) return;
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    stepRefs.current[expandedStepId]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [expandedStepId]);

  const filteredItemsByFamily = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = normalize(searchQuery);
    const map: Record<string, LRItem[]> = {};
    for (const fam of FAMILY_ORDER) {
      if (fam === "Location") continue;
      const filtered = (itemsByFamily[fam] ?? []).filter((it) => matchesQuery(it, q));
      if (filtered.length > 0) map[fam] = filtered;
    }
    return map;
  }, [searchQuery, itemsByFamily]);

  const activeSelected = useMemo(
    () =>
      activeModule.items
        .filter((it) => (states[it.id] ?? "unknown") !== "unknown")
        .map((it) => ({ id: it.id, label: it.label, state: states[it.id] ?? "unknown" as FindingState })),
    [activeModule.items, states],
  );

  const presentCount = activeSelected.filter((s) => s.state === "present").length;
  const absentCount = activeSelected.filter((s) => s.state === "absent").length;

  return (
    <section className="rounded-[1.4rem] border border-gray-200/90 bg-white/95 p-4 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Build the case</div>
          <p className="mt-1 text-sm text-gray-600">
            Pick syndrome, choose the setting, then add findings.
          </p>
        </div>
        <button type="button" onClick={onReset} className="text-sm text-gray-600 underline hover:text-gray-900">
          Reset
        </button>
      </div>

      <div className="mt-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SYNDROME_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setExpandedGroup(g.id)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                expandedGroup === g.id
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SYNDROME_GROUPS.find((g) => g.id === expandedGroup)?.syndromes.map((s) => {
            const isActive = s.moduleId === activeModule.id;
            return (
              <button
                key={s.moduleId}
                type="button"
                onClick={() => onSetModule(s.moduleId)}
                className={`shrink-0 rounded-xl border px-3 py-2 text-left transition-all sm:min-w-[100px] ${
                  isActive
                    ? "border-[var(--primary-strong)] bg-[var(--primary-strong)] text-white shadow-sm"
                    : "border-gray-200 hover:bg-gray-50 hover:shadow-sm"
                }`}
              >
                <div className="text-sm font-semibold">{s.label}</div>
                <div className={`text-[11px] leading-tight ${isActive ? "text-white/80" : "text-gray-500"}`}>
                  {s.shortDescription}
                </div>
              </button>
            );
          }) ?? null}
        </div>
      </div>

      <div className="mt-4 rounded-xl border bg-gray-50 p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Setting</div>
            <div className="mt-1 text-sm font-medium text-gray-900">{preset?.label ?? "Select"}</div>
            <div className="text-xs text-gray-500">Pretest {formatPct(preset?.p ?? 0.05)}</div>
            {preset?.notes ? (
              <div className="mt-2 max-w-[34rem] text-xs leading-5 text-gray-600">{preset.notes}</div>
            ) : null}
            {preset?.source ? (
              <div className="mt-2 text-[11px] text-gray-500">
                Evidence: {preset.source.url ? (
                  <a href={preset.source.url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-gray-900">
                    {preset.source.short}{preset.source.year ? ` (${preset.source.year})` : ""}
                  </a>
                ) : (
                  <span>{preset.source.short}{preset.source.year ? ` (${preset.source.year})` : ""}</span>
                )}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onOpenCatalog}
            className="rounded-lg border px-2 py-1 text-xs font-medium text-gray-600 hover:bg-white"
          >
            Change
          </button>
        </div>
        {activeModule.pretestPresets.length > 1 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {activeModule.pretestPresets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSetPreset(p.id)}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${
                  p.id === presetId
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p.label} ({formatPct(p.p)})
              </button>
            ))}
          </div>
        )}
      </div>

      {guidedSteps.length > 0 && (
        <div className="mt-4 rounded-[1.2rem] border border-gray-200 bg-[linear-gradient(135deg,#fbfdff_0%,#f7f9fc_55%,#eef3f8_100%)] p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Document in order</div>
              <div className="mt-1 text-sm text-gray-600">One open step at a time, just like building the assessment in a clinical note.</div>
            </div>
            <div className="rounded-full border border-white/80 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-gray-600 shadow-sm">
              {guidedSteps.reduce((acc, step) => acc + step.selectedCount, 0)} marked
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {guidedSteps.map((step, index) => {
              const isActive = expandedStepId === step.id;
              const previousStep = index > 0 ? guidedSteps[index - 1] : null;
              const nextStep = index < guidedSteps.length - 1 ? guidedSteps[index + 1] : null;

              return (
                <div
                  key={step.id}
                  ref={(node) => {
                    stepRefs.current[step.id] = node;
                  }}
                  className={`overflow-hidden rounded-2xl border transition-all ${
                    isActive
                      ? "border-gray-900 bg-white shadow-sm"
                      : step.selectedCount > 0
                        ? "border-emerald-200 bg-white/90"
                        : "border-gray-200 bg-white/75"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedStepId(step.id)}
                    className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition-colors ${
                      isActive ? "bg-gray-900 text-white" : "hover:bg-white"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${isActive ? "text-white/70" : "text-gray-400"}`}>
                        Step {index + 1}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-semibold">{step.label}</span>
                        {isActive && (
                          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                            Open
                          </span>
                        )}
                      </div>
                      <div className={`mt-1 max-w-2xl text-xs leading-5 ${isActive ? "text-white/75" : "text-gray-600"}`}>
                        {stepDescription(step.id)}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${isActive ? "bg-white/15 text-white" : step.selectedCount > 0 ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-500"}`}>
                        {step.kind === "findings" ? `${step.selectedCount}/${step.items.length}` : `${step.selectedCount} selected`}
                      </span>
                      <span className={`text-xs transition-transform ${isActive ? "rotate-90 text-white/80" : "text-gray-400"}`} aria-hidden="true">
                        ▸
                      </span>
                    </div>
                  </button>

                  {isActive && (
                    <div className="border-t bg-white px-4 py-4">
                      {step.kind === "findings" ? (
                        <div className="space-y-1">
                          {step.items.map((it) => {
                            const st = states[it.id] ?? "unknown";
                            const locked = isAutoManagedLocked(it.id);
                            return (
                              <LRItemToggle
                                key={it.id}
                                item={it}
                                state={st}
                                disabled={locked}
                                onChange={(next) => onSetItemState(it, next)}
                              />
                            );
                          })}
                        </div>
                      ) : (
                        <div className="space-y-3">{patientFactorsStep?.content}</div>
                      )}

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                        <div className="text-[11px] leading-5 text-gray-500">
                          {step.kind === "findings"
                            ? step.selectedCount > 0
                              ? `${step.presentCount} present, ${step.selectedCount - step.presentCount} absent selected.`
                              : "Nothing selected yet in this step."
                            : step.selectedCount > 0
                              ? `${step.selectedCount} patient factors selected.`
                              : "No patient factors selected yet."}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {previousStep && (
                            <button
                              type="button"
                              onClick={() => setExpandedStepId(previousStep.id)}
                              className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                            >
                              Back: {previousStep.label}
                            </button>
                          )}
                          {nextStep && (
                            <button
                              type="button"
                              onClick={() => setExpandedStepId(nextStep.id)}
                              className="rounded-lg border border-gray-900 bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                            >
                              Continue: {nextStep.label}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSelected.length > 0 && (
        <div className="mt-4 rounded-xl border bg-white p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
              Selected ({activeSelected.length})
            </div>
            <div className="text-xs text-gray-500">
              {presentCount} present · {absentCount} absent
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {activeSelected.slice(0, 8).map((s) => (
              <span
                key={s.id}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  s.state === "present"
                    ? "bg-emerald-100 text-emerald-900"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {s.state === "present" ? "+" : "−"} {s.label}
              </span>
            ))}
            {activeSelected.length > 8 && (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                +{activeSelected.length - 8} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mt-4">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search findings and tests..."
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm placeholder:text-gray-400"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="mt-1 text-xs text-gray-500 underline"
          >
            Clear
          </button>
        )}
      </div>

      {filteredItemsByFamily && (
        <div className="mt-4 space-y-1">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Search results</div>
          {Object.entries(filteredItemsByFamily).map(([fam, items]) => (
            <SearchSection
              key={fam}
              family={fam}
              items={items}
              states={states}
              isAutoManagedLocked={isAutoManagedLocked}
              onSetItemState={onSetItemState}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onOpenCatalog}
        className="mt-4 w-full rounded-xl border border-dashed border-gray-300 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
      >
        Open full catalog
      </button>
    </section>
  );
}

function SearchSection({
  family,
  items,
  states,
  isAutoManagedLocked,
  onSetItemState,
}: {
  family: string;
  items: LRItem[];
  states: Record<string, FindingState>;
  isAutoManagedLocked: (id: string) => boolean;
  onSetItemState: (item: LRItem, state: FindingState) => void;
}) {
  const selectedInCategory = items.filter((it) => (states[it.id] ?? "unknown") !== "unknown").length;

  return (
    <div className="rounded-lg border">
      <div className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left bg-gray-50/80">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">{family}</span>
          <span className="text-xs text-gray-500">({items.length})</span>
        </div>
        {selectedInCategory > 0 && (
          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
            {selectedInCategory}
          </span>
        )}
      </div>

      <div className="border-t px-3 py-2">
        {items.map((it) => {
          const st = states[it.id] ?? "unknown";
          const locked = isAutoManagedLocked(it.id);
          return (
            <LRItemToggle
              key={it.id}
              item={it}
              state={st}
              disabled={locked}
              onChange={(next) => onSetItemState(it, next)}
            />
          );
        })}
      </div>
    </div>
  );
}
