"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

type Props = {
  pollId: string;
  children: ReactNode;
  lockedMessage?: string;
};

export default function CaseReveal({
  pollId,
  children,
  lockedMessage = "Answer the question above to reveal the rationale.",
}: Props) {
  const storageKey = useMemo(() => `idhub:answered:${pollId}`, [pollId]);
  const [unlocked, setUnlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    function refresh() {
      try {
        setUnlocked(window.localStorage.getItem(storageKey) === "1");
      } catch {
        setUnlocked(false);
      }
      setHydrated(true);
    }

    function onAnswered(event: Event) {
      const detail = (event as CustomEvent<{ pollId?: string }>).detail;
      if (!detail?.pollId || detail.pollId === pollId) {
        refresh();
      }
    }

    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("idhub:case-answered", onAnswered as EventListener);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("idhub:case-answered", onAnswered as EventListener);
    };
  }, [pollId, storageKey]);

  if (hydrated && unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="my-6 rounded-[1rem] border border-dashed border-[var(--border-strong)] bg-[var(--background-soft)] p-4 text-sm text-[var(--muted)]">
      {lockedMessage}
    </div>
  );
}
