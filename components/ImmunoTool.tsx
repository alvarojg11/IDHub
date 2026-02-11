"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { DRUGS, RiskTag } from "@/lib/immunoData";

type SelectedRisk = {
  tag: RiskTag;
  maxStrength: number;
  reasons: string[];
  from: string[];
};

type Level = { label: string; blurb: string };

function levelFromScore(score: number): Level {
  if (score <= 3)
    return {
      label: "Low",
      blurb: "Limited immunosuppression; risk largely context-dependent.",
    };
  if (score <= 6)
    return {
      label: "Moderate",
      blurb: "Meaningful immunosuppression; consider opportunistic risks by agent.",
    };
  if (score <= 9)
    return {
      label: "High",
      blurb: "High risk for opportunistic infections; prophylaxis/monitoring often relevant.",
    };
  return {
    label: "Very High",
    blurb: "Very high risk, especially with combination therapy; expect opportunistic infections.",
  };
}

/**
 * Family bucketing: keep this heuristic + small.
 * Tweak the string matching as your class labels evolve.
 */
type Family =
  | "Steroids"
  | "Conventional chemo"
  | "Transplant immunosuppression"
  | "Rheum/IBD biologics & JAK"
  | "Checkpoint inhibitors"
  | "Cell therapies"
  | "Bispecifics / T-cell engagers"
  | "ADCs"
  | "Oncology targeted mAbs (low immunosuppression)"
  | "Cytokines / immune stimulants"
  | "Other";

const FAMILY_ORDER: Family[] = [
  "Steroids",
  "Transplant immunosuppression",
  "Rheum/IBD biologics & JAK",
  "Conventional chemo",
  "Checkpoint inhibitors",
  "Cell therapies",
  "Bispecifics / T-cell engagers",
  "ADCs",
  "Oncology targeted mAbs (low immunosuppression)",
  "Cytokines / immune stimulants",
  "Other",
];

function familyFor(drugClass: string): Family {
  const c = drugClass.toLowerCase();

  // Steroids
  if (c.includes("corticosteroid")) return "Steroids";

  // Transplant
  if (c.includes("transplant / immunosuppressive")) return "Transplant immunosuppression";
  if (c.includes("calcineurin") || c.includes("mtor") || c.includes("il-2 receptor") || c.includes("costimulation blocker"))
    return "Transplant immunosuppression";

  // Checkpoint
  if (c.includes("checkpoint inhibitor")) return "Checkpoint inhibitors";

  // Cell therapies
  if (c.includes("cell therapy") || c.includes("car-t") || c.includes("adoptive cellular"))
    return "Cell therapies";

  // Bispecific / TCE
  if (c.includes("bispecific")) return "Bispecifics / T-cell engagers";
  if (c.includes("t-cell engager")) return "Bispecifics / T-cell engagers";

  // ADCs
  if (c.includes("antibody–drug conjugate") || c.includes("antibody-drug conjugate") || c.includes("adc"))
    return "ADCs";

  // Conventional chemo
  if (c.includes("alkylating") || c.includes("antimetabolite")) return "Conventional chemo";

  // Rheum/IBD biologics & JAK (broad, includes many immunomodulators)
  if (c.includes("tnf blocker") || c.includes("jak inhibitor")) return "Rheum/IBD biologics & JAK";
  if (c.includes("biologic") || c.includes("dmard") || c.includes("immunomodulator")) return "Rheum/IBD biologics & JAK";

  // Cytokines / stimulants
  if (c.includes("immune-stimulating") || c.includes("cytokine")) return "Cytokines / immune stimulants";

  // Oncology targeted mAbs that are typically not “immunosuppressive”
  // (VEGF/EGFR/HER2 etc often end up in generic “Monoclonal antibody … pathway” classes)
  if (
    c.includes("vegf") ||
    c.includes("angiogenesis") ||
    c.includes("egfr") ||
    c.includes("her2") ||
    c.includes("targeted") ||
    c.includes("monoclonal antibody") ||
    c.includes("fusion protein")
  ) {
    // Many of these are not dominant immunosuppressants; keep them together.
    return "Oncology targeted mAbs (low immunosuppression)";
  }

  return "Other";
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function matchesQuery(d: (typeof DRUGS)[number], q: string) {
  const hay = `${d.name} ${d.class} ${d.mechanism}`.toLowerCase();
  return hay.includes(q);
}

export default function ImmunoTool() {
  // State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [catalogOpen, setCatalogOpen] = useState(false);

  // Pinned + recent
  const PINNED_IDS = useMemo(
    () => ["prednisone_20", "rituximab", "infliximab", "mycophenolate_mofetil", "tacrolimus", "tofacitinib"],
    []
  );

  const [recentIds, setRecentIds] = useState<string[]>([]);
  const RECENT_KEY = "immunoid_recent_v1";

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setRecentIds(parsed.filter((x) => typeof x === "string"));
    } catch {
      // ignore
    }
  }, []);

  function pushRecent(id: string) {
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 10);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  // Derived
  const selectedDrugs = useMemo(() => DRUGS.filter((d) => selectedIds.includes(d.id)), [selectedIds]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return [];
    return DRUGS.filter((d) => !selectedIds.includes(d.id))
      .filter((d) => (d.name + " " + d.class).toLowerCase().includes(q))
      .slice(0, 12);
  }, [query, selectedIds]);

  // Actions
  function addDrug(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setQuery("");
    pushRecent(id);
  }

  function removeDrug(id: string) {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }

  function reset() {
    setSelectedIds([]);
    setQuery("");
  }

  // Score + risks
  const totalScore = useMemo(() => {
    const base = selectedDrugs.reduce((sum, d) => sum + d.baseScore, 0);
    const comboPenalty = selectedDrugs.length >= 2 ? (selectedDrugs.length - 1) * 1.5 : 0;
    return Math.round((base + comboPenalty) * 10) / 10;
  }, [selectedDrugs]);

  const level = useMemo(() => levelFromScore(totalScore), [totalScore]);

  const aggregatedRisks = useMemo(() => {
    const map = new Map<RiskTag, SelectedRisk>();

    for (const d of selectedDrugs) {
      for (const r of d.commonRisks) {
        const strength = r.strength ?? 1;
        const why = r.why ?? "";
        const existing = map.get(r.tag);

        if (!existing) {
          map.set(r.tag, {
            tag: r.tag,
            maxStrength: strength,
            reasons: why ? [why] : [],
            from: [d.name],
          });
        } else {
          existing.maxStrength = Math.max(existing.maxStrength, strength);
          if (why && !existing.reasons.includes(why)) existing.reasons.push(why);
          if (!existing.from.includes(d.name)) existing.from.push(d.name);
        }
      }
    }

    const arr = Array.from(map.values());
    arr.sort((a, b) => b.maxStrength - a.maxStrength || a.tag.localeCompare(b.tag));
    return arr;
  }, [selectedDrugs]);

  // Catalog modal: internal search + family accordion
  const [catalogQuery, setCatalogQuery] = useState("");
  const [openFamilies, setOpenFamilies] = useState<Record<string, boolean>>({
    Steroids: true,
  });

  useEffect(() => {
    if (!catalogOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCatalogOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [catalogOpen]);

  const drugsByFamilyThenClass = useMemo(() => {
    const grouped: Record<string, Record<string, (typeof DRUGS)[number][]>> = {};
    for (const d of DRUGS) {
      const fam = familyFor(d.class);
      (grouped[fam] ??= {});
      (grouped[fam][d.class] ??= []).push(d);
    }
    return grouped;
  }, []);

  // Horizontal scrollers per (family+class)
  const scrollersRef = useRef<Record<string, HTMLDivElement | null>>({});

  function scrollRow(key: string, dir: "left" | "right") {
    const el = scrollersRef.current[key];
    if (!el) return;
    const amount = Math.max(240, Math.floor(el.clientWidth * 0.8));
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  function toggleFamily(fam: string) {
    setOpenFamilies((prev) => ({ ...prev, [fam]: !(prev[fam] ?? false) }));
  }

  function openAllFamilies() {
    const all: Record<string, boolean> = {};
    for (const f of FAMILY_ORDER) all[f] = true;
    setOpenFamilies(all);
  }

  function closeAllFamilies() {
    setOpenFamilies({});
  }

  const catalogQ = normalize(catalogQuery);

  function catalogVisible(drug: (typeof DRUGS)[number]) {
    if (selectedIds.includes(drug.id)) return false;
    if (!catalogQ) return true;
    return matchesQuery(drug, catalogQ);
  }

  // Tiny chip renderer
  function Chip({ id, label }: { id: string; label: string }) {
    return (
      <button
        key={id}
        type="button"
        onClick={() => addDrug(id)}
        className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
      >
        + {label}
      </button>
    );
  }

  const pinnedDrugs = useMemo(() => {
    return PINNED_IDS.map((id) => DRUGS.find((d) => d.id === id)).filter(Boolean) as (typeof DRUGS)[number][];
  }, [PINNED_IDS]);

  const recentDrugs = useMemo(() => {
    return recentIds.map((id) => DRUGS.find((d) => d.id === id)).filter(Boolean) as (typeof DRUGS)[number][];
  }, [recentIds]);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">ImmunoID</h1>
      <p className="mt-3 text-gray-700">
        Select immunosuppressive agents to review mechanisms and high-yield infection risks. (Educational aid—not a guideline.)
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT: Selector */}
        <section className="rounded-xl border bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Select agents</h2>
            <button type="button" onClick={reset} className="text-sm text-gray-600 underline hover:text-gray-900">
              Reset
            </button>
          </div>

          {/* Search */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">Type a medication</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filtered[0]) addDrug(filtered[0].id);
              }}
              placeholder="Search (e.g., rituximab, prednisone, cyclophosphamide)…"
              className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
            />

            {filtered.length > 0 && (
              <div className="mt-2 rounded-lg border bg-white p-2">
                <p className="px-2 pb-2 text-xs text-gray-500">Suggestions</p>
                <div className="space-y-1">
                  {filtered.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => addDrug(d.id)}
                      className="w-full rounded-md px-2 py-2 text-left hover:bg-gray-50"
                    >
                      <div className="font-medium text-gray-900">{d.name}</div>
                      <div className="text-xs text-gray-600">{d.class}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pinned */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Pinned</p>
              <button
                type="button"
                onClick={() => setCatalogOpen(true)}
                className="text-xs text-gray-600 underline hover:text-gray-900"
              >
                Browse catalog
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {pinnedDrugs.map((d) => {
                if (selectedIds.includes(d.id)) return null;
                return <Chip key={d.id} id={d.id} label={d.name} />;
              })}
            </div>
          </div>

          {/* Recent */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700">Recent</p>
            {recentDrugs.filter((d) => !selectedIds.includes(d.id)).length === 0 ? (
              <p className="mt-2 text-sm text-gray-600">No recent picks yet.</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {recentDrugs.map((d) => {
                  if (selectedIds.includes(d.id)) return null;
                  return <Chip key={d.id} id={d.id} label={d.name} />;
                })}
              </div>
            )}
          </div>

          {/* Selected */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700">Selected</p>

            {selectedDrugs.length === 0 ? (
              <p className="mt-2 text-sm text-gray-600">No medications selected yet.</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedDrugs.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => removeDrug(d.id)}
                    className="inline-flex items-center gap-2 rounded-full border bg-gray-50 px-3 py-1 text-sm text-gray-900 hover:bg-gray-100"
                    title="Click to remove"
                  >
                    <span className="font-medium">{d.name}</span>
                    <span className="text-xs text-gray-500">×</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Compact “Browse catalog” button (secondary) */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setCatalogOpen(true)}
              className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Browse catalog →
            </button>
          </div>
        </section>

        {/* MIDDLE: Mechanisms */}
        <section className="rounded-xl border bg-white p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900">Mechanisms</h2>

          {selectedDrugs.length === 0 ? (
            <p className="mt-4 text-gray-700">Choose one or more agents to see mechanisms.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {selectedDrugs.map((d) => (
                <div key={d.id} className="rounded-lg border bg-gray-50 p-4">
                  <div className="font-semibold text-gray-900">{d.name}</div>
                  <div className="mt-2 text-sm text-gray-700">{d.mechanism}</div>
                  {d.notes?.length ? (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
                      {d.notes.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RIGHT: Risks + level */}
        <section className="rounded-xl border bg-white p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900">Infection risks</h2>

          <div className="mt-4 rounded-lg border bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-gray-900">Immunosuppression level</div>
              <div className="text-sm text-gray-700">
                <span className="font-semibold">{level.label}</span> (score {totalScore})
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-700">{level.blurb}</p>
            <p className="mt-2 text-xs text-gray-500">
              Score is a simplified teaching heuristic based on selected agents and combination penalty.
            </p>
          </div>

          {selectedDrugs.length === 0 ? (
            <p className="mt-4 text-gray-700">Select agents to see aggregated risks.</p>
          ) : aggregatedRisks.length === 0 ? (
            <p className="mt-4 text-gray-700">No risks listed yet for selected agents.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {aggregatedRisks.map((r) => (
                <div key={r.tag} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-semibold text-gray-900">{r.tag}</div>
                    <div className="text-xs text-gray-600">
                      {r.maxStrength === 3 ? "High-yield" : r.maxStrength === 2 ? "Common" : "Possible"}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <span className="text-gray-600">Linked to:</span> {r.from.join(", ")}
                  </div>
                  {r.reasons.length ? (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                      {r.reasons.map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mt-10 rounded-lg border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
        Educational content only. Not medical advice. Always use clinical judgment, local guidance, and patient-specific factors.
      </div>

      {/* =========================
          CATALOG MODAL
         ========================= */}
      {catalogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Drug catalog"
        >
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            onClick={() => setCatalogOpen(false)}
            aria-label="Close catalog"
          />

          {/* Panel */}
          <div className="relative z-10 w-[min(980px,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] overflow-hidden rounded-xl border bg-white shadow-lg">
            <div className="flex items-start justify-between gap-4 border-b p-4">
              <div className="min-w-0">
                <div className="text-lg font-semibold text-gray-900">Browse catalog</div>
                <div className="mt-1 text-sm text-gray-600">
                  Search + browse by broad families (press <span className="font-semibold">Esc</span> to close).
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

            <div className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:max-w-md">
                  <label className="text-sm font-medium text-gray-700">Search inside catalog</label>
                  <input
                    value={catalogQuery}
                    onChange={(e) => setCatalogQuery(e.target.value)}
                    placeholder="Search by name, class, or mechanism…"
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
                    onClick={openAllFamilies}
                    className="text-xs text-gray-600 underline hover:text-gray-900"
                  >
                    Open all
                  </button>
                  <button
                    type="button"
                    onClick={closeAllFamilies}
                    className="text-xs text-gray-600 underline hover:text-gray-900"
                  >
                    Close all
                  </button>
                </div>
              </div>

              <div className="mt-4 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
                <div className="space-y-3">
                  {FAMILY_ORDER.map((fam) => {
                    const classes = drugsByFamilyThenClass[fam] ?? {};
                    const isOpen = openFamilies[fam] ?? false;

                    // Count visible, not-selected items under this family given catalog search
                    const visibleCount = Object.values(classes)
                      .flat()
                      .filter((d) => catalogVisible(d)).length;

                    return (
                      <div key={fam} className="rounded-lg border">
                        <button
                          type="button"
                          onClick={() => toggleFamily(fam)}
                          className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-gray-50"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-gray-900">{fam}</div>
                            <div className="text-xs text-gray-500">
                              {visibleCount} available {catalogQuery ? " (filtered)" : ""}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-gray-500">
                            <span className="text-xs">{isOpen ? "Hide" : "Show"}</span>
                            <span className="text-sm">{isOpen ? "▾" : "▸"}</span>
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-3 pb-3">
                            {Object.entries(classes)
                              .sort(([a], [b]) => a.localeCompare(b))
                              .map(([cls, drugs]) => {
                                const shown = drugs.filter((d) => catalogVisible(d));
                                if (shown.length === 0) return null;

                                const rowKey = `${fam}__${cls}`;

                                return (
                                  <div key={cls} className="mt-3">
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                        {cls}
                                      </div>
                                      <div className="text-xs text-gray-500">{shown.length}</div>
                                    </div>

                                    <div className="mt-2 flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => scrollRow(rowKey, "left")}
                                        className="shrink-0 rounded-md border px-2 py-1 text-sm text-gray-700 hover:bg-gray-50"
                                        aria-label={`Scroll ${cls} left`}
                                        title="Scroll left"
                                      >
                                        ‹
                                      </button>

                                      <div
                                        ref={(el) => {
                                          scrollersRef.current[rowKey] = el;
                                        }}
                                        className="flex-1 overflow-x-auto"
                                        style={{ scrollbarWidth: "none" }}
                                      >
                                        <div className="flex gap-2 pr-2" style={{ WebkitOverflowScrolling: "touch" }}>
                                          {shown.map((d) => (
                                            <button
                                              key={d.id}
                                              type="button"
                                              onClick={() => addDrug(d.id)}
                                              className="shrink-0 rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
                                              title={d.class}
                                            >
                                              + {d.name}
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => scrollRow(rowKey, "right")}
                                        className="shrink-0 rounded-md border px-2 py-1 text-sm text-gray-700 hover:bg-gray-50"
                                        aria-label={`Scroll ${cls} right`}
                                        title="Scroll right"
                                      >
                                        ›
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}

                            {/* Hide scrollbar in WebKit (optional) */}
                            <style jsx>{`
                              div[style*="scrollbarWidth"]::-webkit-scrollbar {
                                display: none;
                              }
                            `}</style>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 rounded-lg border bg-gray-50 p-3 text-xs text-gray-600">
                Tip: use the catalog search to avoid browsing at all. Families are intentionally broad to keep the UI compact.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
