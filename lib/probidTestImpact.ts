import type { FindingState, LRItem } from "@/lib/lrTypes";
import { clampLR, postTestProb, clamp } from "@/lib/lrMath";

export type TestImpactClassification = "high_value" | "rule_in" | "rule_out" | "low_impact";

export type TestImpactEntry = {
  item: LRItem;
  pIfPositive: number | null;
  pIfNegative: number | null;
  classification: TestImpactClassification;
  minDistanceToThreshold: number;
};

export function computeTestImpact(args: {
  currentPostP: number;
  currentCombinedLR: number;
  items: LRItem[];
  states: Record<string, FindingState>;
  treatThresholdP: number;
  observeThresholdP: number;
}): TestImpactEntry[] {
  const { currentPostP, items, states, treatThresholdP, observeThresholdP } = args;

  const unselected = items.filter((it) => {
    const s = states[it.id] ?? "unknown";
    return s === "unknown" && (it.lrPos != null || it.lrNeg != null);
  });

  const entries: TestImpactEntry[] = [];

  for (const item of unselected) {
    const lrPos = item.lrPos != null ? clampLR(item.lrPos) : null;
    const lrNeg = item.lrNeg != null ? clampLR(item.lrNeg) : null;

    const pIfPositive = lrPos != null ? postTestProb(currentPostP, lrPos) : null;
    const pIfNegative = lrNeg != null ? postTestProb(currentPostP, lrNeg) : null;

    const positiveCrossesTreat = pIfPositive != null && pIfPositive >= treatThresholdP;
    const negativeDropsBelowObserve = pIfNegative != null && pIfNegative <= observeThresholdP;

    let classification: TestImpactClassification;
    if (positiveCrossesTreat && negativeDropsBelowObserve) {
      classification = "high_value";
    } else if (positiveCrossesTreat) {
      classification = "rule_in";
    } else if (negativeDropsBelowObserve) {
      classification = "rule_out";
    } else {
      classification = "low_impact";
    }

    const distances: number[] = [];
    if (pIfPositive != null) {
      distances.push(Math.abs(pIfPositive - treatThresholdP));
    }
    if (pIfNegative != null) {
      distances.push(Math.abs(pIfNegative - observeThresholdP));
    }
    const minDistance = distances.length > 0 ? Math.min(...distances) : 1;

    entries.push({
      item,
      pIfPositive,
      pIfNegative,
      classification,
      minDistanceToThreshold: clamp(minDistance, 0, 1),
    });
  }

  const classificationOrder: Record<TestImpactClassification, number> = {
    high_value: 0,
    rule_in: 1,
    rule_out: 2,
    low_impact: 3,
  };

  entries.sort((a, b) => {
    const co = classificationOrder[a.classification] - classificationOrder[b.classification];
    if (co !== 0) return co;
    return a.minDistanceToThreshold - b.minDistanceToThreshold;
  });

  return entries;
}

export function classificationLabel(c: TestImpactClassification): string {
  switch (c) {
    case "high_value":
      return "High value";
    case "rule_in":
      return "Rule-in";
    case "rule_out":
      return "Rule-out";
    case "low_impact":
      return "Low impact";
  }
}

export function classificationDescription(c: TestImpactClassification): string {
  switch (c) {
    case "high_value":
      return "Positive could cross treat threshold and negative could drop below observe threshold";
    case "rule_in":
      return "Positive result would cross the treatment threshold";
    case "rule_out":
      return "Negative result would drop below the observe threshold";
    case "low_impact":
      return "Neither outcome would cross a decision threshold";
  }
}
