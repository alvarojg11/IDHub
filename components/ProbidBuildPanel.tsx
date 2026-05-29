"use client";

import React, { useMemo, useState } from "react";
import type { FindingState, LRItem, SyndromeLRModule } from "@/lib/lrTypes";
import { formatPct } from "@/lib/lrMath";
import { FAMILY_ORDER, familyFor, matchesQuery, normalize } from "@/lib/probidCatalog";
import { SYNDROME_GROUPS } from "@/lib/probidSyndromesCatalog";
import { PINNED_BY_SYNDROME } from "@/lib/probidCatalog";
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
};

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
}: Props) {
  const activeGroupId = useMemo(() => {
    for (const g of SYNDROME_GROUPS) {
      if (g.syndromes.some((s) => s.moduleId === activeModule.id)) return g.id;
    }
    return SYNDROME_GROUPS[0].id;
  }, [activeModule.id]);

  const [expandedGroup, setExpandedGroup] = useState<string>(activeGroupId);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const preset = activeModule.pretestPresets.find((p) => p.id === presetId) ?? activeModule.pretestPresets[0];
  const pinnedItems = useMemo(
    () => (PINNED_BY_SYNDROME[activeModule.id] ?? []).map((id) => activeModule.items.find((it) => it.id === id)).filter((it): it is LRItem => it != null),
    [activeModule.id, activeModule.items],
  );

  const itemsByFamily = useMemo(() => {
    const map: Record<string, LRItem[]> = {};
    for (const fam of FAMILY_ORDER) {
      if (fam === "Location") continue;
      map[fam] = activeModule.items.filter((it) => familyFor(it) === fam);
    }
    return map;
  }, [activeModule.items]);

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

      {pinnedItems.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Start here</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {pinnedItems.map((it) => {
              const st = states[it.id] ?? "unknown";
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => {
                    const next: FindingState = st === "unknown" ? "present" : st === "present" ? "absent" : "unknown";
                    onSetItemState(it, next);
                  }}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    st === "present"
                      ? "border-emerald-300 bg-emerald-100 text-emerald-900"
                      : st === "absent"
                        ? "border-slate-300 bg-slate-100 text-slate-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {st === "present" ? "+ " : st === "absent" ? "− " : ""}
                  {it.label}
                  {st === "unknown" && (
                    <span className="ml-1 text-[10px] text-gray-400">
                      LR+{it.lrPos ?? "—"} LR−{it.lrNeg ?? "—"}
                    </span>
                  )}
                </button>
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

      <div className="mt-4 space-y-1">
        {filteredItemsByFamily ? (
          Object.entries(filteredItemsByFamily).map(([fam, items]) => (
            <CategorySection
              key={fam}
              family={fam}
              items={items}
              states={states}
              isAutoManagedLocked={isAutoManagedLocked}
              onSetItemState={onSetItemState}
              isExpanded={expandedCategory === fam}
              onToggle={() => setExpandedCategory(expandedCategory === fam ? null : fam)}
              forceOpen
            />
          ))
        ) : (
          FAMILY_ORDER.filter((f) => f !== "Location").map((fam) => {
            const items = itemsByFamily[fam] ?? [];
            if (items.length === 0) return null;
            return (
              <CategorySection
                key={fam}
                family={fam}
                items={items}
                states={states}
                isAutoManagedLocked={isAutoManagedLocked}
                onSetItemState={onSetItemState}
                isExpanded={expandedCategory === fam}
                onToggle={() => setExpandedCategory(expandedCategory === fam ? null : fam)}
              />
            );
          })
        )}
      </div>

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

function CategorySection({
  family,
  items,
  states,
  isAutoManagedLocked,
  onSetItemState,
  isExpanded,
  onToggle,
  forceOpen,
}: {
  family: string;
  items: LRItem[];
  states: Record<string, FindingState>;
  isAutoManagedLocked: (id: string) => boolean;
  onSetItemState: (item: LRItem, state: FindingState) => void;
  isExpanded: boolean;
  onToggle: () => void;
  forceOpen?: boolean;
}) {
  const open = forceOpen || isExpanded;
  const selectedInCategory = items.filter((it) => (states[it.id] ?? "unknown") !== "unknown").length;

  return (
    <div className="rounded-lg border">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left transition-colors hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <span
            className={`text-xs transition-transform ${open ? "rotate-90" : ""}`}
            aria-hidden="true"
          >
            ▸
          </span>
          <span className="text-sm font-medium text-gray-900">{family}</span>
          <span className="text-xs text-gray-500">({items.length})</span>
        </div>
        {selectedInCategory > 0 && (
          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
            {selectedInCategory}
          </span>
        )}
      </button>

      {open && (
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
      )}
    </div>
  );
}
