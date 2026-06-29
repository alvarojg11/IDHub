"use client";

import React from "react";
import { formatPct } from "@/lib/lrMath";

type Step = {
  id: string;
  label: string;
  lrUsed: number;
  state: "present" | "absent" | "unknown";
  pAfter: number;
};

type Props = {
  steps: Step[];
  pretestP: number;
  combinedLR: number;
  showAdjustedPretest: boolean;
  basePretestP: number;
  harmEstimate?: {
    baseMissedDx: number;
    baseUnnecessaryTx: number;
    missedDx: number;
    unnecessaryTx: number;
    rationale: string[];
    missedDxDrivers: Array<{ label: string; delta: number; evidence?: { short: string; url?: string } }>;
    baseEvidence?: { short: string; url?: string };
  } | null;
  adjustedUtilityModel?: {
    terms: Record<string, { label: string; adjustedValue: number; baseValue: number; rationale: string; evidence?: { short: string; url?: string }; structuredEstimate?: boolean }>;
    selectedModifiers: Array<{ id: string; label: string; description: string }>;
    model: { summary: string };
  } | null;
  adjustedActionThresholdModel?: {
    terms: Record<string, { label: string; adjustedValue: number; baseValue: number; appliedMultiplier: number; rationale: string; evidence?: { short: string; url?: string } }>;
    selectedModifiers: Array<{ id: string; label: string; description: string }>;
    model: { summary: string; thresholdsLabel: { low: string; high: string } };
  } | null;
  actionThresholds?: {
    stopThresholdP: number;
    manageThresholdP: number;
  } | null;
};

export function ProbidMathDetails({
  steps,
  pretestP,
  combinedLR,
  showAdjustedPretest,
  basePretestP,
  harmEstimate,
  adjustedUtilityModel,
  adjustedActionThresholdModel,
  actionThresholds,
}: Props) {
  return (
    <details className="group rounded-xl border p-4 transition-colors open:bg-gray-50/50">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="text-sm font-semibold text-gray-900">See the math</span>
        <span className="text-xs text-gray-500 transition-transform duration-200 group-open:rotate-180">
          ▾
        </span>
      </summary>

      <div className="mt-4 space-y-4">
        <div className="text-sm text-gray-700">
          Start: <span className="font-semibold">{formatPct(pretestP)}</span>
          {showAdjustedPretest && (
            <span className="ml-2 text-xs text-gray-500">(base {formatPct(basePretestP)})</span>
          )}
          <span className="ml-3 text-xs text-gray-500">Combined LR: {combinedLR.toFixed(2)}</span>
        </div>

        {steps.length === 0 ? (
          <p className="text-sm text-gray-600">Choose findings to see stepwise probability updates.</p>
        ) : (
          <ol className="space-y-2">
            {steps.map((s, idx) => (
              <li key={s.id} className="rounded-lg border bg-white p-3">
                <div className="text-sm font-medium text-gray-900">
                  {idx + 1}. {s.label}
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  {s.state === "present" ? "LR+" : "LR−"} {s.lrUsed.toFixed(2)} →{" "}
                  <span className="font-semibold text-gray-900">{formatPct(s.pAfter)}</span>
                </div>
              </li>
            ))}
          </ol>
        )}

        {harmEstimate && !adjustedUtilityModel && (
          <div className="rounded-lg border bg-white p-3 text-xs text-gray-700">
            <div className="font-semibold text-gray-900">Harm estimate</div>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-500">Missed diagnosis:</span>{" "}
                <span className="font-semibold">{harmEstimate.missedDx}</span>
              </div>
              <div>
                <span className="text-gray-500">Unnecessary treatment:</span>{" "}
                <span className="font-semibold">{harmEstimate.unnecessaryTx}</span>
              </div>
            </div>
          </div>
        )}

        {adjustedActionThresholdModel && actionThresholds && (
          <div className="rounded-lg border bg-white p-3 text-xs text-gray-700">
            <div className="font-semibold text-gray-900">Action-threshold model</div>
            <div className="mt-1 text-[11px] leading-5 text-gray-600">{adjustedActionThresholdModel.model.summary}</div>
            <div className="mt-2 space-y-1">
              {(["testHarm", "missHarm", "overtreatHarm"] as const).map((key) => {
                const term = adjustedActionThresholdModel.terms[key];
                return (
                  <div key={key} className="flex items-center justify-between gap-3">
                    <span>{term.label}</span>
                    <span className="font-semibold">
                      {term.baseValue.toFixed(2)} × {term.appliedMultiplier.toFixed(2)} = {term.adjustedValue.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 border-t pt-2 sm:grid-cols-2">
              <div>
                <span className="text-gray-500">{adjustedActionThresholdModel.model.thresholdsLabel.low}:</span>{" "}
                <span className="font-semibold">{formatPct(actionThresholds.stopThresholdP)}</span>
              </div>
              <div>
                <span className="text-gray-500">{adjustedActionThresholdModel.model.thresholdsLabel.high}:</span>{" "}
                <span className="font-semibold">{formatPct(actionThresholds.manageThresholdP)}</span>
              </div>
            </div>
            {adjustedActionThresholdModel.selectedModifiers.length > 0 && (
              <div className="mt-2 border-t pt-2">
                <div className="font-semibold text-gray-900">Active modifiers</div>
                <ul className="mt-1 list-disc pl-4 text-[11px] text-gray-600">
                  {adjustedActionThresholdModel.selectedModifiers.map((m) => (
                    <li key={m.id}>
                      <span className="font-medium text-gray-700">{m.label}:</span> {m.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {adjustedUtilityModel && (
          <div className="rounded-lg border bg-white p-3 text-xs text-gray-700">
            <div className="font-semibold text-gray-900">Utility model</div>
            <div className="mt-2 space-y-1">
              {(
                ["treatDisease", "noTreatDisease", "treatNoDisease", "noTreatNoDisease"] as const
              ).map((key) => {
                const term = adjustedUtilityModel.terms[key];
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span>{term.label}</span>
                    <span className="font-semibold">
                      {term.baseValue.toFixed(3)} → {term.adjustedValue.toFixed(3)}
                    </span>
                  </div>
                );
              })}
            </div>
            {adjustedUtilityModel.selectedModifiers.length > 0 && (
              <div className="mt-2 border-t pt-2">
                <div className="font-semibold text-gray-900">Active modifiers</div>
                <ul className="mt-1 list-disc pl-4 text-[11px] text-gray-600">
                  {adjustedUtilityModel.selectedModifiers.map((m) => (
                    <li key={m.id}>
                      <span className="font-medium text-gray-700">{m.label}:</span> {m.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs leading-5 text-gray-600">
          Multiplying LRs assumes conditional independence. Correlated inputs may overestimate
          certainty. Educational content only — not medical advice.
        </div>
      </div>
    </details>
  );
}
