"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

type CaseEntry = {
  slug: string;
  title: string;
  description: string;
  organisms: string[];
  syndromes: string[];
  concepts: string[];
};

type Props = {
  cases: CaseEntry[];
  syndromes: string[];
};

export default function ReferenceIndex({ cases, syndromes }: Props) {
  const [query, setQuery] = useState("");
  const [activeSyndrome, setActiveSyndrome] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return cases.filter((c) => {
      // Syndrome filter
      if (activeSyndrome && !c.syndromes.includes(activeSyndrome)) return false;

      // Text search across all fields
      if (!q) return true;
      const searchable = [
        c.title,
        c.description,
        ...c.organisms,
        ...c.syndromes,
        ...c.concepts,
        c.slug,
      ]
        .join(" ")
        .toLowerCase();
      return searchable.includes(q);
    });
  }, [cases, query, activeSyndrome]);

  return (
    <div>
      {/* Search bar */}
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search by organism, syndrome, or concept…"
          aria-label="Search cases by organism, syndrome, or concept"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-2xl border border-[var(--border)] bg-white/85 px-5 py-3.5 text-sm text-[var(--foreground)] shadow-[var(--shadow-soft)] outline-none placeholder:text-[var(--muted-soft)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
        />
      </div>

      {/* Syndrome filter pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveSyndrome(null)}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            activeSyndrome === null
              ? "border-[var(--primary)] bg-[var(--primary)] text-white"
              : "border-[var(--border)] bg-white/80 text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
          }`}
        >
          All
        </button>
        {syndromes.map((syn) => (
          <button
            key={syn}
            type="button"
            onClick={() =>
              setActiveSyndrome(activeSyndrome === syn ? null : syn)
            }
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeSyndrome === syn
                ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                : "border-[var(--border)] bg-white/80 text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
            }`}
          >
            {syn}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-[1.8rem] border border-[var(--border)] bg-white/80 p-8 text-center">
          <p className="text-sm text-[var(--muted)]">
            No cases match your search. Try a different organism or syndrome.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((c) => (
            <Link
              key={c.slug}
              href={`/cases/${c.slug}`}
              className="group rounded-[1.6rem] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-medium)]"
            >
              <h2 className="text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)]">
                {c.title}
              </h2>

              {c.organisms.length > 0 && (
                <p className="mt-2 text-sm font-medium italic text-[var(--primary)]">
                  {c.organisms.join(", ")}
                </p>
              )}

              {c.description && (
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {c.description}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.syndromes.map((syn) => (
                  <span
                    key={syn}
                    className="rounded-full bg-[var(--primary-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--primary)]"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}

      <p className="mt-6 text-center text-xs text-[var(--muted-soft)]">
        {filtered.length} of {cases.length} cases shown
      </p>
    </div>
  );
}
