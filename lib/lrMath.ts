// lib/lrMath.ts
import type { FindingState, LRItem } from "./lrTypes";

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function probToOdds(p: number) {
  const pp = clamp(p, 1e-6, 1 - 1e-6);
  return pp / (1 - pp);
}

export function oddsToProb(o: number) {
  const oo = Math.max(o, 0);
  return oo / (1 + oo);
}

export function clampLR(lr: number, min = 0.05, max = 20) {
  if (!Number.isFinite(lr) || lr <= 0) return 1;
  return clamp(lr, min, max);
}

export function lrForState(item: LRItem, state: FindingState): number | null {
  if (state === "present" && item.lrPos) return item.lrPos;
  if (state === "absent" && item.lrNeg) return item.lrNeg;
  return null;
}

export function combinedLR(items: LRItem[], states: Record<string, FindingState>) {
  let lr = 1;
  for (const it of items) {
    const s = states[it.id] ?? "unknown";
    const use = lrForState(it, s);
    if (use != null) lr *= clampLR(use);
  }
  return clampLR(lr, 0.001, 1000);
}

export function postTestProb(pretestP: number, lr: number) {
  const preOdds = probToOdds(pretestP);
  const postOdds = preOdds * clampLR(lr, 0.001, 1000);
  return oddsToProb(postOdds);
}

export function buildStepwisePath(args: {
  pretestP: number;
  orderedIds: string[];
  itemsById: Map<string, LRItem>;
  states: Record<string, FindingState>;
}) {
  const { pretestP, orderedIds, itemsById, states } = args;
  const steps: Array<{
    id: string;
    label: string;
    lrUsed: number;
    state: FindingState;
    pAfter: number;
  }> = [];

  let odds = probToOdds(pretestP);

  for (const id of orderedIds) {
    const item = itemsById.get(id);
    if (!item) continue;

    const state = states[id] ?? "unknown";
    const lrUsedRaw = lrForState(item, state);
    if (lrUsedRaw == null) continue;

    const lrUsed = clampLR(lrUsedRaw);
    odds = odds * lrUsed;

    steps.push({
      id,
      label: item.label,
      lrUsed,
      state,
      pAfter: oddsToProb(odds),
    });
  }

  return steps;
}

export function formatPct(p: number) {
  const pp = clamp(p, 0, 1) * 100;
  if (pp < 1) return `${pp.toFixed(1)}%`;
  if (pp < 10) return `${pp.toFixed(1)}%`;
  return `${pp.toFixed(0)}%`;
}
