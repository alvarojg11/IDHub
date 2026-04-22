"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { CaseDirectoryEntry } from "@/lib/cases/directory";

type SortMode = "newest" | "alphabetical";

type Props = {
  cases: CaseDirectoryEntry[];
  syndromes: string[];
  defaultSort?: SortMode;
  emptyMessage?: string;
  cardVariant?: "simple" | "detailed";
  showPublishedDate?: boolean;
  showOrganisms?: boolean;
  showSyndromeTags?: boolean;
  syndromeFilterStyle?: "pills" | "select";
};

function compareAlphabetical(a: CaseDirectoryEntry, b: CaseDirectoryEntry) {
  return a.title.localeCompare(b.title);
}

function compareNewest(a: CaseDirectoryEntry, b: CaseDirectoryEntry) {
  const aTime = a.publishedAt ? Date.parse(a.publishedAt) : Number.NEGATIVE_INFINITY;
  const bTime = b.publishedAt ? Date.parse(b.publishedAt) : Number.NEGATIVE_INFINITY;

  if (aTime !== bTime) {
    return bTime - aTime;
  }

  return compareAlphabetical(a, b);
}

function formatPublishedDate(value?: string) {
  if (!value) return null;

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return null;
  }
}

export default function CaseDirectory({
  cases,
  syndromes,
  defaultSort = "newest",
  emptyMessage = "No cases match your search. Try a different organism, syndrome, or keyword.",
  cardVariant = "detailed",
  showPublishedDate = true,
  showOrganisms = true,
  showSyndromeTags = true,
  syndromeFilterStyle = "pills",
}: Props) {
  const [query, setQuery] = useState("");
  const [activeSyndrome, setActiveSyndrome] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>(defaultSort);
  const hasActiveFilters = query.trim().length > 0 || activeSyndrome !== null || sortMode !== defaultSort;

  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    const matches = cases.filter((item) => {
      if (activeSyndrome && !item.syndromes.includes(activeSyndrome)) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchableText = [
        item.title,
        item.description,
        item.slug,
        ...item.organisms,
        ...item.syndromes,
        ...item.concepts,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });

    return matches.toSorted(sortMode === "newest" ? compareNewest : compareAlphabetical);
  }, [activeSyndrome, cases, query, sortMode]);

  function resetFilters() {
    setQuery("");
    setActiveSyndrome(null);
    setSortMode(defaultSort);
  }

  return (
    <div>
      <div className="grid gap-4 rounded-[1.8rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(241,248,245,0.94))] p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
          <label className="block">
            <span className="text-sm font-semibold text-[var(--foreground)]">Search the case library</span>
            <div className="relative mt-2">
              <input
                type="search"
                placeholder="Search by title, organism, syndrome, or concept"
                aria-label="Search cases"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-2xl border border-[var(--border)] bg-white/90 px-5 py-3.5 pr-24 text-sm text-[var(--foreground)] shadow-[0_10px_24px_rgba(13,30,24,0.04)] outline-none placeholder:text-[var(--muted-soft)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[var(--foreground)]">Sort by</span>
            <select
              aria-label="Sort cases"
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3.5 text-sm text-[var(--foreground)] shadow-[0_10px_24px_rgba(13,30,24,0.04)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
            >
              <option value="newest">Newest</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </label>
        </div>

        <div>
          {syndromeFilterStyle === "select" ? (
            <div className="grid gap-3 sm:grid-cols-[minmax(0,260px)_auto] sm:items-end sm:justify-between">
              <label className="block">
                <span className="text-sm font-semibold text-[var(--foreground)]">Filter by syndrome</span>
                <select
                  aria-label="Filter cases by syndrome"
                  value={activeSyndrome ?? ""}
                  onChange={(event) => setActiveSyndrome(event.target.value || null)}
                  className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3.5 text-sm text-[var(--foreground)] shadow-[0_10px_24px_rgba(13,30,24,0.04)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
                >
                  <option value="">All syndromes</option>
                  {syndromes.map((syndrome) => (
                    <option key={syndrome} value={syndrome}>
                      {syndrome}
                    </option>
                  ))}
                </select>
              </label>

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="justify-self-start rounded-full border border-transparent px-3 py-1.5 text-xs font-semibold text-[var(--primary)] hover:border-[var(--border)] hover:bg-white/80 sm:justify-self-end"
                >
                  Reset all
                </button>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSyndrome(null)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  activeSyndrome === null
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                    : "border-[var(--border)] bg-white/80 text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                }`}
              >
                All syndromes
              </button>
              {syndromes.map((syndrome) => (
                <button
                  key={syndrome}
                  type="button"
                  onClick={() => setActiveSyndrome(activeSyndrome === syndrome ? null : syndrome)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    activeSyndrome === syndrome
                      ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                      : "border-[var(--border)] bg-white/80 text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {syndrome}
                </button>
              ))}
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-full border border-transparent px-3 py-1.5 text-xs font-semibold text-[var(--primary)] hover:border-[var(--border)] hover:bg-white/80"
                >
                  Reset all
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--muted)]">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>
            <span className="font-semibold text-[var(--foreground)]">{filtered.length}</span> of {cases.length} cases shown
          </span>
          <span className="text-[var(--muted-soft)]">•</span>
          <span>{sortMode === "newest" ? "Newest first" : "Alphabetical order"}</span>
        </p>
        {activeSyndrome ? (
          <p>
            Filtered by <span className="font-semibold text-[var(--foreground)]">{activeSyndrome}</span>
          </p>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-[1.8rem] border border-[var(--border)] bg-white/80 p-8 text-center">
          <p className="text-sm text-[var(--muted)]">{emptyMessage}</p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 inline-flex rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)] shadow-[0_8px_24px_rgba(13,30,24,0.05)] hover:border-[var(--border-strong)]"
            >
              Reset filters
            </button>
          ) : null}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => {
            const publishedLabel = formatPublishedDate(item.publishedAt);

            return (
              <Link
                key={item.slug}
                href={`/cases/${item.slug}`}
                className={`group flex h-full flex-col rounded-[1.65rem] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-medium)] ${
                  cardVariant === "simple" ? "p-6" : "p-5"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
                    Case
                  </p>
                  {showPublishedDate && publishedLabel ? (
                    <p className="rounded-full bg-[var(--background-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--muted)]">
                      {publishedLabel}
                    </p>
                  ) : null}
                </div>

                <h2 className={`mt-3 font-semibold text-[var(--foreground)] transition group-hover:text-[var(--primary)] ${
                  cardVariant === "simple" ? "text-3xl" : "text-2xl"
                }`}>
                  {item.title}
                </h2>

                {showOrganisms && item.organisms.length > 0 ? (
                  <p className="mt-3 text-sm font-medium text-[var(--primary)]">
                    {item.organisms.join(", ")}
                  </p>
                ) : null}

                {item.description ? (
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.description}</p>
                ) : null}

                {showSyndromeTags ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.syndromes.slice(0, 3).map((syndrome) => (
                      <span
                        key={syndrome}
                        className="rounded-full bg-[var(--primary-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--primary)]"
                      >
                        {syndrome}
                      </span>
                    ))}
                  </div>
                ) : null}

                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[var(--primary)]">
                  Open case
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
