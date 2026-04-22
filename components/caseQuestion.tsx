"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

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

const CLIENT_ID_KEY = "idhub:client-id";

function getClientId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const existing = window.localStorage.getItem(CLIENT_ID_KEY);
    if (existing) return existing;
    const created = `client-${crypto.randomUUID()}`;
    window.localStorage.setItem(CLIENT_ID_KEY, created);
    return created;
  } catch {
    return null;
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CaseQuestion({
  title = "Question",
  prompt,
  options,
  pollId,
  showPoll = true,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [poll, setPoll] = useState<PollState>({});
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Build a stable poll key
  const pollKey = useMemo(() => {
    // If no pollId is supplied, we still support a per-question poll by hashing prompt+options
    const base =
      pollId ??
      `auto:${prompt}::${options.map((o) => `${o.id}-${o.label}`).join("|")}`;
    return `idhub:poll:${base}`;
  }, [pollId, prompt, options]);

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

  const answeredKey = useMemo(() => `idhub:answered:${pollId ?? pollKey}`, [pollId, pollKey]);

  const markAnswered = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(answeredKey, "1");
      window.dispatchEvent(
        new CustomEvent("idhub:case-answered", {
          detail: { pollId: pollId ?? pollKey },
        })
      );
    } catch {}
  }, [answeredKey, pollId, pollKey]);

  useEffect(() => {
    let cancelled = false;

    async function loadSharedPoll() {
      if (!pollId) {
        // Fallback for questions without explicit pollId: browser-only poll behavior.
        try {
          const raw = window.localStorage.getItem(pollKey);
          if (raw && !cancelled) {
            setPoll(JSON.parse(raw) as PollState);
          }
        } catch {}
        return;
      }

      try {
        const voterId = getClientId();
        const query = voterId ? `?voterId=${encodeURIComponent(voterId)}` : "";
        const res = await fetch(`/api/case-polls/${encodeURIComponent(pollId)}${query}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Could not load poll");
        const data = (await res.json()) as {
          counts?: PollState;
          userVote?: string | null;
        };
        if (cancelled) return;
        setPoll(data.counts ?? {});
        if (data.userVote) {
          setSelectedId(data.userVote);
          markAnswered();
        }
      } catch {
        if (!cancelled) {
          setFetchError("Live poll unavailable. Showing local results only.");
          try {
            const raw = window.localStorage.getItem(pollKey);
            setPoll(raw ? (JSON.parse(raw) as PollState) : {});
          } catch {
            setPoll({});
          }
        }
      }
    }

    loadSharedPoll();
    return () => {
      cancelled = true;
    };
  }, [markAnswered, pollId, pollKey]);

  async function vote(id: string) {
    if (selectedId || submitting) return;
    setSubmitting(true);
    setFetchError(null);

    if (!pollId) {
      setSelectedId(id);
      const next: PollState = { ...poll, [id]: (poll[id] ?? 0) + 1 };
      setPoll(next);
      try {
        window.localStorage.setItem(pollKey, JSON.stringify(next));
      } catch {}
      markAnswered();
      setSubmitting(false);
      return;
    }

    try {
      const voterId = getClientId();
      const res = await fetch(`/api/case-polls/${encodeURIComponent(pollId)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          optionId: id,
          voterId,
          optionIds: options.map((o) => o.id),
        }),
      });
      if (!res.ok) throw new Error("Vote failed");
      const data = (await res.json()) as {
        snapshot?: { counts?: PollState; userVote?: string | null };
      };
      const snapshot = data.snapshot;
      setPoll(snapshot?.counts ?? {});
      setSelectedId(snapshot?.userVote ?? id);
      markAnswered();
    } catch {
      setFetchError("Live poll unavailable. Showing local results only.");
      setSelectedId(id);
      const next: PollState = { ...poll, [id]: (poll[id] ?? 0) + 1 };
      setPoll(next);
      try {
        window.localStorage.setItem(pollKey, JSON.stringify(next));
      } catch {}
      markAnswered();
    } finally {
      setSubmitting(false);
    }
  }

  const isCorrect =
    selectedId && correctId ? selectedId === correctId : false;
  const showResults = showPoll && !!selectedId;
  const sectionId = useMemo(() => {
    if (pollId) {
      return `question-${slugify(pollId)}`;
    }

    return `question-${slugify(`${title}-${prompt}`)}`;
  }, [pollId, prompt, title]);

  return (
    <section
      id={sectionId}
      data-case-question="true"
      className="mt-10 rounded-[1.6rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,249,247,0.95))] p-6 shadow-[var(--shadow-soft)]"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
        {title}
      </p>
      <p className="mt-3 text-lg font-semibold leading-8 text-[var(--foreground)]">{prompt}</p>

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
              disabled={!!selectedId || submitting}
              className={`w-full rounded-[1rem] border border-[var(--border)] p-4 text-left transition ${
                active
                  ? "bg-[var(--background-soft)] shadow-[0_10px_24px_rgba(13,30,24,0.05)]"
                  : "bg-white hover:border-[var(--border-strong)] hover:bg-[var(--card-hover)]"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] text-sm font-semibold text-[var(--foreground)]">
                  {o.id}
                </span>

                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[var(--foreground)]">{o.label}</span>

                    {showResults && (
                      <span className="text-xs text-[var(--muted)]">
                        {pct}% ({count})
                      </span>
                    )}
                  </div>

                  {showResults && (
                    <div className="mt-2 h-2 w-full overflow-hidden rounded bg-[var(--background-soft)]">
                      <div
                        className="h-2 rounded bg-[var(--primary)]/45"
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
        <p className="mt-3 text-xs text-[var(--muted)]">
          {selectedId
            ? `Live poll results shown (${totalVotes} total responses).`
            : "Select one option to submit your answer and view live poll results."}
        </p>
      )}

      {fetchError && <p className="mt-2 text-xs text-amber-700">{fetchError}</p>}

      {selected && (
        <div className="mt-6 rounded-[1rem] border border-[var(--border)] bg-[var(--background-soft)] p-4">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {correctId ? (isCorrect ? "Correct" : "Explanation") : "Explanation"}
          </p>
          <p className="mt-2 text-[var(--muted)]">{selected.feedback}</p>

          {correctId && selectedId !== correctId && (
            <p className="mt-3 text-sm text-[var(--muted)]">
              Best answer: <span className="font-semibold">{correctId}</span>
            </p>
          )}
        </div>
      )}
    </section>
  );
}
