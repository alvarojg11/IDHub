// components/LRWorkbench3Panel.tsx
"use client";

import React, { useMemo, useState } from "react";
import type { FindingState, SyndromeLRModule, LRItem } from "@/lib/lrTypes";
import { combinedLR, postTestProb, buildStepwisePath, formatPct, clamp } from "@/lib/lrMath";
import { FaganChart } from "@/components/FaganChart";
import { LRItemToggle } from "@/components/LRItemToggle";

type Props = {
  modules: SyndromeLRModule[];      // multiple syndromes
  defaultModuleId?: string;
  defaultPresetIdByModule?: Record<string, string>;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
        {title}
      </div>
      {children}
    </div>
  );
}

function pickDefaultModule(modules: SyndromeLRModule[], id?: string) {
  return modules.find((m) => m.id === id) ?? modules[0];
}

export function LRWorkbench3Panel({ modules, defaultModuleId, defaultPresetIdByModule }: Props) {
  const [moduleId, setModuleId] = useState<string>(pickDefaultModule(modules, defaultModuleId)?.id ?? modules[0]?.id);
  const module = useMemo(() => pickDefaultModule(modules, moduleId), [modules, moduleId]);

  const defaultPresetId = defaultPresetIdByModule?.[module.id];
  const initialPreset =
    module.pretestPresets.find((p) => p.id === defaultPresetId) ?? module.pretestPresets[0];

  const [presetId, setPresetId] = useState<string>(initialPreset?.id ?? "");
  const [states, setStates] = useState<Record<string, FindingState>>({});
  const [clickOrder, setClickOrder] = useState<string[]>([]);
  const [evidenceId, setEvidenceId] = useState<string | null>(null);

  // If module changes, reset state to keep UX sane
  React.useEffect(() => {
    const p = module.pretestPresets.find((x) => x.id === defaultPresetIdByModule?.[module.id]) ?? module.pretestPresets[0];
    setPresetId(p?.id ?? "");
    setStates({});
    setClickOrder([]);
    setEvidenceId(null);
  }, [module.id]);

  const preset = module.pretestPresets.find((p) => p.id === presetId) ?? module.pretestPresets[0];
  const pretestP = clamp(preset?.p ?? 0.05, 0.001, 0.999);

  const itemsById = useMemo(() => new Map(module.items.map((i) => [i.id, i])), [module.items]);

  const lr = useMemo(() => combinedLR(module.items, states), [module.items, states]);
  const postP = useMemo(() => postTestProb(pretestP, lr), [pretestP, lr]);

  const steps = useMemo(
    () => buildStepwisePath({ pretestP, orderedIds: clickOrder, itemsById, states }),
    [pretestP, clickOrder, itemsById, states]
  );

  // Catalog buckets
  const sx = module.items.filter((i) => i.category === "symptom");
  const vitals = module.items.filter((i) => i.category === "vital");
  const exam = module.items.filter((i) => i.category === "exam");
  const imaging = module.items.filter((i) => i.category === "imaging");
  const labs = module.items.filter((i) => i.category === "lab" || i.category === "micro");

  function isDisabledByGroup(item: LRItem) {
    if (!item.group) return false;
    const activeId = module.items.find(
      (it) => it.group === item.group && (states[it.id] === "present" || states[it.id] === "absent")
    )?.id;
    return !!activeId && activeId !== item.id;
  }

  function setItemState(item: LRItem, next: FindingState) {
    setStates((prev) => {
      const out = { ...prev, [item.id]: next };
      if (item.group && next !== "unknown") {
        for (const other of module.items) {
          if (other.id !== item.id && other.group === item.group) out[other.id] = "unknown";
        }
      }
      return out;
    });

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

  const evidenceItem = evidenceId ? itemsById.get(evidenceId) : null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* LEFT PANEL */}
      <div className="lg:col-span-4 space-y-3">
        <Section title="Clinical syndrome">
          <div className="flex flex-wrap gap-2">
            {modules.map((m) => {
              const active = m.id === module.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModuleId(m.id)}
                  className={[
                    "rounded-md border px-3 py-1 text-sm transition",
                    active
                      ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/30",
                  ].join(" ")}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
          {module.description ? (
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">{module.description}</div>
          ) : null}
        </Section>

        <Section title="Location / setting (pretest)">
          <div className="space-y-2">
            {module.pretestPresets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPresetId(p.id)}
                className={[
                  "w-full rounded-md border px-3 py-2 text-left text-sm transition",
                  p.id === presetId
                    ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/30",
                ].join(" ")}
              >
                <div className="font-medium">{p.label}</div>
                <div className="text-xs opacity-90">Pretest: {Math.round(p.p * 100)}%</div>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Signs & symptoms">
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {[...sx, ...vitals, ...exam].map((it) => (
              <LRItemToggle
                key={it.id}
                item={it}
                state={states[it.id] ?? "unknown"}
                disabled={isDisabledByGroup(it)}
                onChange={(next) => setItemState(it, next)}
                onOpenEvidence={() => setEvidenceId(it.id)}
              />
            ))}
          </div>
        </Section>

        <Section title="Radiology">
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {imaging.map((it) => (
              <LRItemToggle
                key={it.id}
                item={it}
                state={states[it.id] ?? "unknown"}
                disabled={isDisabledByGroup(it)}
                onChange={(next) => setItemState(it, next)}
                onOpenEvidence={() => setEvidenceId(it.id)}
              />
            ))}
          </div>
        </Section>

        <Section title="Laboratory / microbiology">
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {labs.map((it) => (
              <LRItemToggle
                key={it.id}
                item={it}
                state={states[it.id] ?? "unknown"}
                disabled={isDisabledByGroup(it)}
                onChange={(next) => setItemState(it, next)}
                onOpenEvidence={() => setEvidenceId(it.id)}
              />
            ))}
          </div>
        </Section>
      </div>

      {/* MIDDLE PANEL */}
      <div className="lg:col-span-5 space-y-3">
        <Section title="Stepwise update">
          {steps.length === 0 ? (
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Select findings/tests to see the probability update step-by-step.
            </div>
          ) : (
            <ol className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <li>
                Start (pretest): <span className="font-semibold">{formatPct(pretestP)}</span>
              </li>
              {steps.map((s, idx) => (
                <li key={s.id}>
                  {idx + 1}. {s.label} ({s.state === "present" ? "LR+" : "LR−"} {s.lrUsed.toFixed(2)}) →{" "}
                  <span className="font-semibold">{formatPct(s.pAfter)}</span>
                </li>
              ))}
            </ol>
          )}
        </Section>

        <Section title="Fagan nomogram (dynamic)">
          <FaganChart pretestP={pretestP} combinedLR={lr} />
        </Section>

        <Section title="Evidence (click an item)">
          {!evidenceItem ? (
            <div className="text-sm text-slate-600 dark:text-slate-300">Click a finding/test label to view details.</div>
          ) : (
            <div className="space-y-2">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{evidenceItem.label}</div>
              <div className="text-sm text-slate-700 dark:text-slate-200">
                LR+ {evidenceItem.lrPos ?? "—"} • LR− {evidenceItem.lrNeg ?? "—"}
              </div>
              {evidenceItem.notes ? <div className="text-sm text-slate-700 dark:text-slate-200">{evidenceItem.notes}</div> : null}
              {evidenceItem.source ? (
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  Source: {evidenceItem.source.short}
                  {evidenceItem.source.year ? ` (${evidenceItem.source.year})` : ""}
                  {evidenceItem.source.url ? (
                    <>
                      {" "}
                      •{" "}
                      <a className="hover:underline" href={evidenceItem.source.url} target="_blank" rel="noreferrer">
                        Link
                      </a>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          )}
        </Section>
      </div>

      {/* RIGHT PANEL */}
      <div className="lg:col-span-3 space-y-3">
        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            Post-test probability
          </div>
          <div className="mt-1 text-4xl font-semibold text-slate-900 dark:text-slate-100">{formatPct(postP)}</div>
          <div className="mt-2 text-sm text-slate-700 dark:text-slate-200">
            Pretest {formatPct(pretestP)} • Combined LR {lr.toFixed(2)}
          </div>
          <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
            Caution: LR stacking assumes conditional independence. Correlated findings may overestimate certainty.
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            Controls
          </div>
          <button
            type="button"
            onClick={() => {
              setStates({});
              setClickOrder([]);
              setEvidenceId(null);
            }}
            className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/30"
          >
            Reset selections
          </button>
        </div>
      </div>
    </div>
  );
}
