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
  title = "Clinical Question",
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
      className="mt-10 border-y border-[var(--border-strong)] bg-white px-0 py-6"
    >
      <p className="idhub-kicker">
        {title}
      </p>
      <p
        className="mt-3 text-[1.18rem] font-semibold leading-8 text-[var(--foreground)]"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {prompt}
      </p>

      <div className="mt-5 border-t border-[var(--border)]">
        {options.map((o) => {
          const active = o.id === selectedId;
          const pct = percentFor(o.id);
          const count = poll[o.id] ?? 0;
          const isBestAnswer = !!selectedId && correctId === o.id;
          const isSelectedCorrect = active && correctId === o.id;
          const isSelectedIncorrect = active && !!correctId && correctId !== o.id;

          return (
            <button
              key={o.id}
              type="button"
              onClick={() => vote(o.id)}
              disabled={!!selectedId || submitting}
              className={`group w-full border-b border-[var(--border)] px-0 py-3.5 text-left transition ${
                isSelectedCorrect || (!active && isBestAnswer)
                  ? "bg-[var(--primary-tint)]"
                  : isSelectedIncorrect
                    ? "bg-amber-50"
                    : selectedId
                      ? "bg-white"
                      : "bg-white hover:bg-[var(--background-soft)]"
              }`}
            >
              <div className="flex items-start gap-3 px-3 sm:px-4">
                <span
                  className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center border text-[0.8rem] font-semibold ${
                    isSelectedIncorrect
                      ? "border-amber-500 bg-white text-amber-800"
                      : active || isBestAnswer
                        ? "border-[var(--primary)] bg-white text-[var(--primary)]"
                        : "border-[var(--border-strong)] text-[var(--foreground)] group-hover:border-[var(--primary)]"
                  }`}
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {o.id}
                </span>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <span className="leading-6 text-[var(--foreground)]">
                      {o.label}
                    </span>

                    {showResults && (
                      <span className="shrink-0 pt-0.5 text-xs text-[var(--muted)]">
                        {pct}% · {count}
                      </span>
                    )}
                  </div>

                  {showResults && (
                    <div className="mt-2 h-px w-full bg-[var(--border)]">
                      <div
                        className="h-px bg-[var(--primary)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}

                  {selectedId && (active || isBestAnswer) ? (
                    <p
                      className={`mt-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                        isSelectedIncorrect ? "text-amber-800" : "text-[var(--primary)]"
                      }`}
                    >
                      {isSelectedCorrect
                        ? "Selected · Correct"
                        : isSelectedIncorrect
                          ? "Selected · Incorrect"
                          : active
                            ? "Selected"
                            : "Best answer"}
                    </p>
                  ) : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {showPoll && (
        <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
          {selectedId
            ? `Peer response data shown (${totalVotes} total responses).`
            : "Select one answer to view the rationale and peer response data."}
        </p>
      )}

      {fetchError && <p className="mt-2 text-xs text-amber-700">{fetchError}</p>}

      {selected && (
        <div className="mt-6 border-l-2 border-[var(--primary)] bg-[var(--background-soft)] px-4 py-3.5">
          <p className="idhub-kicker">
            Answer &amp; Rationale
          </p>
          <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
            {correctId ? (isCorrect ? "Correct." : "Not quite.") : "Explanation."}
          </p>
          <p className="mt-1.5 leading-6 text-[var(--ink-soft)]">
            {selected.feedback}
          </p>

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
