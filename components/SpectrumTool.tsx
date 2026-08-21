"use client";

import { useMemo, useState } from "react";

import {
  ACTIVITY_LABELS,
  ANTIBIOTICS,
  ORGANISM_CATEGORIES,
  ORGANISMS,
  getCell,
  matchesText,
} from "@/lib/spectrum/data";
import type {
  Antibiotic,
  AntibioticName,
  OrganismSpectrum,
  SpectrumActivity,
  SpectrumCell,
} from "@/lib/spectrum/data";

type ViewMode = "bug" | "drug" | "matrix";
type CategoryFilter = (typeof ORGANISM_CATEGORIES)[number];
type DrugRow = [string, SpectrumCell];

const ACTIVITY_STYLES: Record<SpectrumActivity, string> = {
  preferred: "border-emerald-200 bg-emerald-50 text-emerald-800",
  active: "border-sky-200 bg-sky-50 text-sky-800",
  variable: "border-amber-200 bg-amber-50 text-amber-800",
  inactive: "border-gray-200 bg-gray-50 text-gray-400",
  avoid: "border-red-200 bg-red-50 text-red-800",
  "site-only": "border-violet-200 bg-violet-50 text-violet-800",
};

const ACTIVITY_SHORT: Record<SpectrumActivity, string> = {
  preferred: "P",
  active: "A",
  variable: "V",
  inactive: "-",
  avoid: "X",
  "site-only": "S",
};

function activityBadge(activity: SpectrumActivity, compact = false) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border font-semibold ${ACTIVITY_STYLES[activity]} ${
        compact ? "h-7 min-w-7 px-2 text-[11px]" : "px-2.5 py-1 text-xs"
      }`}
      title={ACTIVITY_LABELS[activity]}
    >
      {compact ? ACTIVITY_SHORT[activity] : ACTIVITY_LABELS[activity]}
    </span>
  );
}

function noteText(cell: SpectrumCell) {
  return cell.note || cell.siteCaveat || cell.resistanceCaveat || "No specific caveat listed.";
}

function sortCells<T extends string>(entries: [T, SpectrumCell][]) {
  const rank: Record<SpectrumActivity, number> = {
    preferred: 0,
    active: 1,
    "site-only": 2,
    variable: 3,
    avoid: 4,
    inactive: 5,
  };

  return [...entries].sort((a, b) => rank[a[1].activity] - rank[b[1].activity] || a[0].localeCompare(b[0]));
}

function matchesOrganism(organism: OrganismSpectrum, query: string) {
  return (
    matchesText(organism.organism, query) ||
    matchesText(organism.summary, query) ||
    organism.aliases.some((alias) => matchesText(alias, query)) ||
    organism.keyCaveats.some((caveat) => matchesText(caveat, query))
  );
}

export default function SpectrumTool() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [view, setView] = useState<ViewMode>("bug");
  const [selectedDrug, setSelectedDrug] = useState<AntibioticName>(ANTIBIOTICS[0].name);

  const filteredOrganisms = useMemo(() => {
    const q = query.trim();

    return ORGANISMS.filter((organism) => {
      if (categoryFilter !== "All" && organism.category !== categoryFilter) return false;
      if (!q) return true;
      return matchesOrganism(organism, q);
    });
  }, [categoryFilter, query]);

  const selectedAntibiotic: Antibiotic = ANTIBIOTICS.find((drug) => drug.name === selectedDrug) ?? ANTIBIOTICS[0];

  const drugRows = useMemo(() => {
    return sortCells(
      filteredOrganisms.map((organism): DrugRow => [organism.organism, getCell(organism, selectedDrug)]),
    );
  }, [filteredOrganisms, selectedDrug]);

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-4">
      <div className="mb-6 rounded-[2rem] border border-[var(--border)] bg-white/85 p-4 shadow-[var(--shadow-soft)] sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <input
            type="search"
            placeholder="Search organisms, aliases, syndromes, caveats..."
            aria-label="Search organisms"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-2xl border border-[var(--border)] bg-white px-5 py-3.5 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-soft)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
          />

          <div className="grid grid-cols-3 rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] p-1 text-xs font-semibold">
            {(["bug", "drug", "matrix"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                className={`rounded-xl px-3 py-2 capitalize transition-colors ${
                  view === mode
                    ? "bg-[var(--foreground)] text-white shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {ORGANISM_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setCategoryFilter(category)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                categoryFilter === category
                  ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                  : "border-[var(--border)] bg-white/80 text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
        {(Object.keys(ACTIVITY_LABELS) as SpectrumActivity[]).map((activity) => (
          <span key={activity} className="inline-flex items-center gap-1.5">
            {activityBadge(activity, true)} {ACTIVITY_LABELS[activity]}
          </span>
        ))}
      </div>

      {filteredOrganisms.length === 0 ? (
        <div className="rounded-[1.8rem] border border-[var(--border)] bg-white/80 p-8 text-center">
          <p className="text-sm text-[var(--muted)]">No organisms match your search.</p>
        </div>
      ) : null}

      {view === "bug" && filteredOrganisms.length > 0 ? <BugView organisms={filteredOrganisms} /> : null}
      {view === "drug" && filteredOrganisms.length > 0 ? (
        <DrugView
          selectedDrug={selectedDrug}
          selectedAntibiotic={selectedAntibiotic}
          setSelectedDrug={setSelectedDrug}
          rows={drugRows}
        />
      ) : null}
      {view === "matrix" && filteredOrganisms.length > 0 ? <MatrixView organisms={filteredOrganisms} /> : null}

      <p className="mt-4 text-center text-xs text-[var(--muted-soft)]">
        {filteredOrganisms.length} of {ORGANISMS.length} organisms shown
      </p>
    </div>
  );
}

function BugView({ organisms }: { organisms: OrganismSpectrum[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {organisms.map((organism) => {
        const entries = sortCells(Object.entries(organism.antibiotics) as [AntibioticName, SpectrumCell][]);

        return (
          <article key={organism.organism} className="rounded-[1.8rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-soft)]">{organism.category}</p>
                <h2 className="mt-1 text-xl font-semibold italic text-[var(--foreground)]">{organism.organism}</h2>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{organism.summary}</p>
            <div className="mt-4 space-y-2 rounded-2xl bg-[var(--background-soft)] p-3">
              {organism.keyCaveats.map((caveat) => (
                <p key={caveat} className="text-xs leading-5 text-[var(--muted)]">{caveat}</p>
              ))}
            </div>
            <div className="mt-4 grid gap-2">
              {entries.map(([drug, cell]) => (
                <div key={drug} className="grid gap-2 rounded-2xl border border-[var(--border)] px-3 py-2 text-sm sm:grid-cols-[170px_auto]">
                  <div className="flex items-center gap-2 font-semibold text-[var(--foreground)]">
                    {activityBadge(cell.activity, true)}
                    {drug}
                  </div>
                  <p className="text-xs leading-5 text-[var(--muted)]">{noteText(cell)}</p>
                </div>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function DrugView({
  selectedDrug,
  selectedAntibiotic,
  setSelectedDrug,
  rows,
}: {
  selectedDrug: AntibioticName;
  selectedAntibiotic: Antibiotic;
  setSelectedDrug: (drug: AntibioticName) => void;
  rows: DrugRow[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-[1.8rem] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-soft)]">
        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-soft)]" htmlFor="drug-select">
          Antibiotic
        </label>
        <select
          id="drug-select"
          value={selectedDrug}
          onChange={(event) => setSelectedDrug(event.target.value as AntibioticName)}
          className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
        >
          {ANTIBIOTICS.map((drug) => (
            <option key={drug.name} value={drug.name}>
              {drug.name}
            </option>
          ))}
        </select>
        <div className="mt-4 rounded-2xl bg-[var(--background-soft)] p-4">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">{selectedAntibiotic.name}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{selectedAntibiotic.className} · {selectedAntibiotic.route}</p>
          {selectedAntibiotic.note ? <p className="mt-3 text-xs leading-5 text-[var(--muted)]">{selectedAntibiotic.note}</p> : null}
          <p className="mt-3 text-xs leading-5 text-[var(--muted-soft)]">
            Aliases: {selectedAntibiotic.aliases.join(", ") || "none listed"}
          </p>
        </div>
      </aside>

      <div className="rounded-[1.8rem] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-soft)]">
        <div className="grid gap-2">
          {rows.map(([organism, cell]) => (
            <div key={organism} className="grid gap-2 rounded-2xl border border-[var(--border)] px-3 py-2 text-sm sm:grid-cols-[220px_120px_minmax(0,1fr)] sm:items-center">
              <p className="font-semibold italic text-[var(--foreground)]">{organism}</p>
              <div>{activityBadge(cell.activity)}</div>
              <p className="text-xs leading-5 text-[var(--muted)]">{noteText(cell)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MatrixView({ organisms }: { organisms: OrganismSpectrum[] }) {
  return (
    <div className="overflow-x-auto rounded-[1.8rem] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--background-soft)]">
            <th className="sticky left-0 z-10 min-w-[230px] bg-[var(--background-soft)] px-4 py-3 text-left font-semibold text-[var(--foreground)]">
              Organism
            </th>
            {ANTIBIOTICS.map((drug) => (
              <th key={drug.name} className="whitespace-nowrap px-2 py-3 text-center font-semibold text-[var(--muted)]">
                <span className="inline-block max-w-[88px] [writing-mode:vertical-lr] rotate-180">{drug.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {organisms.map((organism, index) => (
            <tr key={organism.organism} className={`border-b border-[var(--border)] ${index % 2 === 0 ? "bg-white" : "bg-[var(--background-soft)]/40"}`}>
              <td className="sticky left-0 z-10 bg-inherit px-4 py-2.5">
                <p className="font-semibold italic text-[var(--foreground)]">{organism.organism}</p>
                <p className="mt-1 text-[11px] text-[var(--muted-soft)]">{organism.category}</p>
              </td>
              {ANTIBIOTICS.map((drug) => {
                const cell = getCell(organism, drug.name);
                return (
                  <td key={drug.name} className="px-2 py-2.5 text-center">
                    <span title={`${ACTIVITY_LABELS[cell.activity]}: ${noteText(cell)}`}>{activityBadge(cell.activity, true)}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
