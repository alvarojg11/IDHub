"use client";

import React, { useMemo, useState } from "react";

export type CaseOption = {
  id: string;
  label: string;
  correct?: boolean;
  feedback: string;
};

type Props = {
  title?: string;
  prompt: string;
  options: CaseOption[];

  // Poll behavior (optional)
  pollId?: string; // e.g. "case-2-q1"
  showPoll?: boolean; // default true
};

type PollState = Record<string, number>; // optionId -> count

export default function CaseQuestion({
  title = "Question",
  prompt,
  options,
  pollId,
  showPoll = true,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Build a stable poll key
  const pollKey = useMemo(() => {
    // If no pollId is supplied, we still support a per-question poll by hashing prompt+options
    const base =
      pollId ??
      `auto:${prompt}::${options.map((o) => `${o.id}-${o.label}`).join("|")}`;
    return `idhub:poll:${base}`;
  }, [pollId, prompt, options]);

  const [poll, setPoll] = useState<PollState>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.localStorage.getItem(pollKey);
      return raw ? (JSON.parse(raw) as PollState) : {};
    } catch {
      return {};
    }
  });

  const correctId = useMemo(() => {
    const c = options.find((o) => o.correct);
    return c?.id ?? null;
  }, [options]);

  const selected = useMemo(
    () => options.find((o) => o.id === selectedId) ?? null,
    [options, selectedId]
  );

  const totalVotes = useMemo(() => {
    return options.reduce((sum, o) => sum + (poll[o.id] ?? 0), 0);
  }, [options, poll]);

  function percentFor(optionId: string) {
    const n = poll[optionId] ?? 0;
    if (totalVotes === 0) return 0;
    return Math.round((n / totalVotes) * 100);
  }

  function vote(id: string) {
    setSelectedId(id);

    // one vote per click (per device). If you want "one vote total", we can add a guard.
    const next: PollState = { ...poll, [id]: (poll[id] ?? 0) + 1 };
    setPoll(next);
    try {
      window.localStorage.setItem(pollKey, JSON.stringify(next));
    } catch {}
  }

  const isCorrect =
    selectedId && correctId ? selectedId === correctId : false;

  return (
    <section className="mt-10 rounded-xl border bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-3 text-gray-800">{prompt}</p>

      <div className="mt-5 space-y-3">
        {options.map((o) => {
          const active = o.id === selectedId;
          const pct = percentFor(o.id);
          const count = poll[o.id] ?? 0;

          return (
            <button
              key={o.id}
              type="button"
              onClick={() => vote(o.id)}
              className={`w-full rounded-lg border p-4 text-left transition ${
                active ? "bg-gray-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md border text-sm font-semibold text-gray-700">
                  {o.id}
                </span>

                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-gray-900">{o.label}</span>

                    {showPoll && (
                      <span className="text-xs text-gray-600">
                        {pct}% ({count})
                      </span>
                    )}
                  </div>

                  {showPoll && (
                    <div className="mt-2 h-2 w-full overflow-hidden rounded bg-gray-100">
                      <div
                        className="h-2 rounded bg-gray-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {showPoll && (
        <p className="mt-3 text-xs text-gray-500">
          Poll results shown are from this browser only.
        </p>
      )}

      {selected && (
        <div className="mt-6 rounded-lg border bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-900">
            {correctId ? (isCorrect ? "Correct" : "Explanation") : "Explanation"}
          </p>
          <p className="mt-2 text-gray-700">{selected.feedback}</p>

          {correctId && selectedId !== correctId && (
            <p className="mt-3 text-sm text-gray-600">
              Best answer: <span className="font-semibold">{correctId}</span>
            </p>
          )}
        </div>
      )}
    </section>
  );
}
