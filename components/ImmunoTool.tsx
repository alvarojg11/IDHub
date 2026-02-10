"use client";

import React, { useMemo, useState } from "react";
import { DRUGS, RiskTag } from "@/lib/immunoData";

type SelectedRisk = {
  tag: RiskTag;
  maxStrength: number;
  reasons: string[];
  from: string[]; // drug names
};

function levelFromScore(score: number) {
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

export default function ImmunoTool() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const selectedDrugs = useMemo(
    () => DRUGS.filter((d) => selectedIds.includes(d.id)),
    [selectedIds]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return DRUGS.filter((d) => !selectedIds.includes(d.id))
      .filter((d) => (d.name + " " + d.class).toLowerCase().includes(q))
      .slice(0, 12);
  }, [query, selectedIds]);

  function addDrug(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setQuery("");
  }

  function removeDrug(id: string) {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }

  function reset() {
    setSelectedIds([]);
    setQuery("");
  }

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

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
        ImmunoID
      </h1>
      <p className="mt-3 text-gray-700">
        Select immunosuppressive agents to review mechanisms and high-yield infection risks.
        (Educational aid—not a guideline.)
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT: Selector */}
        <section className="rounded-xl border bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Select agents</h2>
            <button
              type="button"
              onClick={reset}
              className="text-sm text-gray-600 underline hover:text-gray-900"
            >
              Reset
            </button>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">
              Type a medication
            </label>
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

          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700">Common picks</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "prednisone_20",
                "rituximab",
                "infliximab",
                "mycophenolate_mofetil",
                "tacrolimus",
                "tofacitinib",
              ].map((id) => {
                const d = DRUGS.find((x) => x.id === id);
                if (!d || selectedIds.includes(id)) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => addDrug(id)}
                    className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
                  >
                    + {d.name}
                  </button>
                );
              })}
            </div>
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
        Educational content only. Not medical advice. Always use clinical judgment, local guidance,
        and patient-specific factors.
      </div>
    </div>
  );
}
