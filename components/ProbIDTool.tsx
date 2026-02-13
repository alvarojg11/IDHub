// components/ProbIDTool.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { FindingState, LRItem, SyndromeLRModule } from "@/lib/lrTypes";
import { combinedLR, postTestProb, buildStepwisePath, formatPct, clamp } from "@/lib/lrMath";
import { FaganChart } from "@/components/FaganChart";
import { LRItemToggle } from "@/components/LRItemToggle";
import { FAMILY_ORDER, familyFor, matchesQuery, normalize } from "@/lib/probidCatalog";
import Link from "next/link";

type Props = {
  modules: SyndromeLRModule[];
  defaultModuleId?: string;
};

function byId(mods: SyndromeLRModule[], id?: string) {
  if (!id) return mods[0];
  return mods.find((m) => m.id === id) ?? mods[0];
}

export function ProbIDTool({ modules, defaultModuleId }: Props) {
  // Syndrome
  const [moduleId, setModuleId] = useState(byId(modules, defaultModuleId)?.id ?? modules[0]?.id);
  const module = useMemo(() => byId(modules, moduleId), [modules, moduleId]);

  // Location (pretest)
  const [presetId, setPresetId] = useState(module.pretestPresets[0]?.id ?? "");

  // Item states + step order
  const [states, setStates] = useState<Record<string, FindingState>>({});
  const [clickOrder, setClickOrder] = useState<string[]>([]);

  // Catalog modal (2-pane)
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogQuery, setCatalogQuery] = useState("");
  const [activeFamily, setActiveFamily] = useState<string>("Location");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  // Reset when syndrome changes
  useEffect(() => {
    setPresetId(module.pretestPresets[0]?.id ?? "");
    setStates({});
    setClickOrder([]);
    setCatalogQuery("");
    setActiveFamily("Location");
    setShowSelectedOnly(false);
  }, [module.id]);

  // Derived pretest/posttest
  const preset = module.pretestPresets.find((p) => p.id === presetId) ?? module.pretestPresets[0];
  const pretestP = clamp(preset?.p ?? 0.05, 0.001, 0.999);

  const itemsById = useMemo(() => new Map(module.items.map((i) => [i.id, i])), [module.items]);

  const lr = useMemo(() => combinedLR(module.items, states), [module.items, states]);
  const postP = useMemo(() => postTestProb(pretestP, lr), [pretestP, lr]);

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
        for (const other of module.items) {
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

  function resetAll() {
    setPresetId(module.pretestPresets[0]?.id ?? "");
    setStates({});
    setClickOrder([]);
    setCatalogQuery("");
    setActiveFamily("Location");
    setShowSelectedOnly(false);
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
    const p = module.pretestPresets.find((x) => x.id === pId);
    if (!p) return;
    setPresetId(pId);
  }

  // Selected: show everything active (not unknown)
  const activeSelected = useMemo(() => {
    return module.items
      .filter((it) => (states[it.id] ?? "unknown") !== "unknown")
      .map((it) => it.id);
  }, [module.items, states]);

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
                    m.id === module.id ? "bg-gray-900 text-white border-gray-900" : "hover:bg-gray-50",
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
                <span className="ml-2 text-xs text-gray-600">(Pretest {Math.round(pretestP * 100)}%)</span>
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
                  return (
                    <div key={id} className="px-3 py-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <LRItemToggle
                            item={it}
                            state={states[it.id] ?? "unknown"}
                            disabled={false}
                            onChange={(next) => setItemState(it, next)}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => setItemState(it, "unknown")}
                          className="mt-1 shrink-0 rounded-md border px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
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
                Pretest <span className="font-semibold">{formatPct(pretestP)}</span>
              </div>
            </div>

            <div className="mt-2 text-5xl font-extrabold tracking-tight text-gray-900">{formatPct(postP)}</div>

            <div className="mt-3 text-sm text-gray-700">
              Combined LR: <span className="font-semibold">{lr.toFixed(2)}</span>
            </div>

            <div className="mt-3 text-xs text-gray-600">Educational estimate only. Always use clinical context.</div>
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
                      ? module.pretestPresets.length
                      : module.items.filter((it) => familyFor(it) === fam).length;

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
                      {module.pretestPresets
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
                            <div className="text-xs opacity-90">Pretest {Math.round(p.p * 100)}%</div>
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
                      const items = module.items
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

                                  return (
                                    <div key={it.id} className="flex items-center justify-between gap-3 px-3 py-2">
                                      <div className="min-w-0">
                                        <div className="truncate text-sm font-medium text-gray-900">{it.label}</div>
                                        {it.notes ? (
                                          <div className="mt-0.5 text-xs text-gray-600">{it.notes}</div>
                                        ) : null}
                                      </div>

                                      <div className="shrink-0 flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => setItemState(it, "present")}
                                          className={[
                                            "rounded-md border px-2 py-1 text-xs",
                                            isPresent
                                              ? "border-gray-900 bg-gray-900 text-white"
                                              : "hover:bg-gray-50",
                                          ].join(" ")}
                                        >
                                          Present
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setItemState(it, "absent")}
                                          className={[
                                            "rounded-md border px-2 py-1 text-xs",
                                            isAbsent
                                              ? "border-gray-900 bg-gray-900 text-white"
                                              : "hover:bg-gray-50",
                                          ].join(" ")}
                                        >
                                          Absent
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setItemState(it, "unknown")}
                                          className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
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
                  <span className="font-semibold">{Math.round(pretestP * 100)}%</span>
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
