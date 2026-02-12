"use client";

import React, { useMemo, useState } from "react";
import { GNR_CANON, GROUPS, PANEL, RULES, SIR_CHOICES, type GroupKey, type GnrOrganism, type SIR } from "@/lib/mechid/data";
import { consolidateResults, runOrganism, type ResultMap } from "@/lib/mechid/logic";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
      {children}
    </span>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <h2 className="text-base font-semibold text-[var(--foreground)]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Alert({
  kind,
  title,
  children,
}: {
  kind: "mechanism" | "caution" | "favorable" | "therapy";
  title: string;
  children: React.ReactNode;
}) {
  // left border color via CSS variables would be ideal; for now: subtle + consistent
  const left =
    kind === "mechanism"
      ? "border-l-red-700"
      : kind === "caution"
      ? "border-l-amber-600"
      : kind === "favorable"
      ? "border-l-emerald-700"
      : "border-l-teal-700";

  return (
    <div className={`rounded-xl border border-[var(--border)] bg-[color:var(--background)]/40 p-4 ${left} border-l-4`}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">{title}</div>
      </div>
      <div className="mt-2 text-sm text-[var(--foreground)]">{children}</div>
    </div>
  );
}

export default function MechIDClient() {
  const [group, setGroup] = useState<GroupKey>("Gram-negatives");
  const [organism, setOrganism] = useState<string>(GNR_CANON[0]);
  const [user, setUser] = useState<ResultMap>({}); // antibiotic -> SIR | null

  const panel = useMemo(() => {
    if (group === "Gram-negatives") {
      return PANEL[organism as GnrOrganism] ?? [];
    }
    return [];
  }, [group, organism]);

  const rules = useMemo(() => {
    if (group === "Gram-negatives") return RULES[organism as GnrOrganism];
    return undefined;
  }, [group, organism]);

  // When organism changes, clear inputs (streamlit effectively resets per selection)
  function onChangeOrganism(next: string) {
    setOrganism(next);
    setUser({});
  }

  const { final, rows, intrinsic } = useMemo(() => {
    return consolidateResults({
      panel,
      user,
      orgRules: rules,
    });
  }, [panel, user, rules]);

  const output = useMemo(() => runOrganism(organism, final), [organism, final]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <header className="mb-10 flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
              <span className="font-black">Mech</span>
              <span className="font-semibold opacity-90">ID</span>
            </h1>
            <Pill>Educational</Pill>
          </div>
          <p className="mt-3 max-w-3xl text-[var(--muted)]">
            From MIC patterns to likely resistance mechanisms and practical therapy notes. Heuristic output — confirm with your lab, ID consult, and IDSA/CLSI guidance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setUser({})}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:opacity-90"
        >
          Reset
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT: selectors + inputs */}
        <div className="space-y-6 lg:col-span-1">
          <SectionCard title="Select pathogen group">
            <select
              value={group}
              onChange={(e) => {
                const g = e.target.value as GroupKey;
                setGroup(g);
                setUser({});
                if (g === "Gram-negatives") setOrganism(GNR_CANON[0]);
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
            >
              {GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            {group !== "Gram-negatives" ? (
              <p className="mt-3 text-sm text-[var(--muted)]">
                This route is wired for Gram-negatives first. Add additional group panels + engines in <code className="px-1">lib/mechid</code>.
              </p>
            ) : null}
          </SectionCard>

          {group === "Gram-negatives" && (
            <SectionCard title="Organism">
              <select
                value={organism}
                onChange={(e) => onChangeOrganism(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
              >
                {[...GNR_CANON].sort((a, b) => a.localeCompare(b)).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>

              {intrinsic.length ? (
                <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-3 text-xs text-[var(--muted)]">
                  <span className="font-semibold text-[var(--foreground)]">Intrinsic resistance:</span> {intrinsic.join(", ")}
                </div>
              ) : null}
            </SectionCard>
          )}

          <SectionCard title="Susceptibility inputs">
            <p className="text-xs text-[var(--muted)]">Leave blank for untested/unknown.</p>

            <div className="mt-4 space-y-3">
              {panel.map((ab) => {
                const isIntrinsic = intrinsic.includes(ab);
                const value = isIntrinsic ? "Resistant" : (user[ab] ?? "");
                return (
                  <div key={ab} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[var(--foreground)]">
                        {ab} {isIntrinsic ? <span className="ml-2 text-xs font-semibold text-[var(--muted)]">(intrinsic)</span> : null}
                      </div>
                    </div>

                    <select
                      value={value as any}
                      disabled={isIntrinsic}
                      onChange={(e) => {
                        const v = e.target.value as "" | SIR;
                        setUser((prev) => ({ ...prev, [ab]: v ? v : null }));
                      }}
                      className="w-48 shrink-0 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] disabled:opacity-70"
                    >
                      {SIR_CHOICES.map((c) => (
                        <option key={c || "blank"} value={c}>
                          {c || "—"}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        {/* MIDDLE: consolidated results */}
        <SectionCard title="Consolidated results">
          {rows.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No results yet. Enter at least one susceptibility above.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[var(--border)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--background)]/50">
                  <tr>
                    <th className="px-3 py-2 font-semibold text-[var(--foreground)]">Antibiotic</th>
                    <th className="px-3 py-2 font-semibold text-[var(--foreground)]">Result</th>
                    <th className="px-3 py-2 font-semibold text-[var(--foreground)]">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.antibiotic} className="border-t border-[var(--border)]">
                      <td className="px-3 py-2 text-[var(--foreground)]">{r.antibiotic}</td>
                      <td className="px-3 py-2 text-[var(--foreground)]">{r.result}</td>
                      <td className="px-3 py-2 text-[var(--muted)]">{r.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        {/* RIGHT: mechanisms + therapy */}
        <div className="space-y-6 lg:col-span-1">
          <SectionCard title="Mechanism of resistance">
            {output.mechs.length === 0 && output.banners.length === 0 && output.greens.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">
                No organism engine wired yet for <span className="font-semibold text-[var(--foreground)]">{organism}</span>.
                Add it in <code className="px-1">lib/mechid/logic.ts</code>.
              </p>
            ) : (
              <div className="space-y-3">
                {output.mechs.map((m, i) => (
                  <Alert key={`m-${i}`} kind="mechanism" title="Mechanism">
                    {m}
                  </Alert>
                ))}
                {output.banners.map((b, i) => (
                  <Alert key={`b-${i}`} kind="caution" title="Caution">
                    {b}
                  </Alert>
                ))}
                {output.greens.map((g, i) => (
                  <Alert key={`g-${i}`} kind="favorable" title="Favorable">
                    {g}
                  </Alert>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Therapy guidance">
            {output.therapy.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No specific guidance triggered yet — enter more susceptibilities.</p>
            ) : (
              <div className="space-y-3">
                {output.therapy.map((t, i) => (
                  <Alert key={`t-${i}`} kind="therapy" title="Therapy">
                    {t}
                  </Alert>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>

      <footer className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
        <strong className="text-[var(--foreground)]">MechID</strong> is a heuristic teaching tool for pattern recognition in antimicrobial resistance. Always interpret results in clinical context and align with lab policy and formal guidance.
      </footer>
    </main>
  );
}
