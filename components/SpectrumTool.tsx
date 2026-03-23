"use client";

import { useState, useMemo } from "react";

import { ORGANISMS, ANTIBIOTICS } from "@/lib/spectrum/data";
import type { Susceptibility } from "@/lib/spectrum/data";

const GRAM_CATEGORIES = [
  "All",
  "Gram-positive",
  "Gram-negative",
  "Anaerobe",
  "Atypical",
] as const;

function cellColor(val: Susceptibility) {
  switch (val) {
    case "S":
      return "bg-emerald-100 text-emerald-800 font-bold";
    case "I":
      return "bg-amber-100 text-amber-800 font-bold";
    case "R":
      return "bg-red-100 text-red-800 font-bold";
    default:
      return "bg-gray-50 text-gray-400";
  }
}

export default function SpectrumTool() {
  const [query, setQuery] = useState("");
  const [gramFilter, setGramFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ORGANISMS.filter((org) => {
      if (gramFilter !== "All" && org.gramStain !== gramFilter) return false;
      if (!q) return true;
      return org.organism.toLowerCase().includes(q);
    });
  }, [query, gramFilter]);

  return (
    <div>
      {/* Controls */}
      <div className="mx-auto mb-6 max-w-6xl space-y-4">
        <input
          type="search"
          placeholder="Search organisms…"
          aria-label="Search organisms"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-2xl border border-[var(--border)] bg-white/85 px-5 py-3.5 text-sm text-[var(--foreground)] shadow-[var(--shadow-soft)] outline-none placeholder:text-[var(--muted-soft)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
        />

        <div className="flex flex-wrap gap-2">
          {GRAM_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setGramFilter(cat)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                gramFilter === cat
                  ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                  : "border-[var(--border)] bg-white/80 text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="mx-auto max-w-6xl rounded-[1.8rem] border border-[var(--border)] bg-white/80 p-8 text-center">
          <p className="text-sm text-[var(--muted)]">
            No organisms match your search.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[1.8rem] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background-soft)]">
                <th className="sticky left-0 z-10 min-w-[200px] bg-[var(--background-soft)] px-4 py-3 text-left font-semibold text-[var(--foreground)]">
                  Organism
                </th>
                {ANTIBIOTICS.map((abx) => (
                  <th
                    key={abx}
                    className="whitespace-nowrap px-2 py-3 text-center font-semibold text-[var(--muted)]"
                  >
                    <span className="inline-block max-w-[80px] [writing-mode:vertical-lr] rotate-180">
                      {abx}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((org, idx) => (
                <tr
                  key={org.organism}
                  className={`border-b border-[var(--border)] ${
                    idx % 2 === 0 ? "bg-white" : "bg-[var(--background-soft)]/40"
                  }`}
                >
                  <td className="sticky left-0 z-10 bg-inherit px-4 py-2.5 font-medium italic text-[var(--foreground)]">
                    {org.organism}
                  </td>
                  {ANTIBIOTICS.map((abx) => {
                    const val = org.antibiotics[abx] ?? "—";
                    return (
                      <td key={abx} className="px-2 py-2.5 text-center">
                        <span
                          className={`inline-block w-7 rounded py-0.5 text-[11px] ${cellColor(val as Susceptibility)}`}
                        >
                          {val}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mx-auto mt-4 max-w-6xl text-center text-xs text-[var(--muted-soft)]">
        {filtered.length} of {ORGANISMS.length} organisms shown
      </p>
    </div>
  );
}
