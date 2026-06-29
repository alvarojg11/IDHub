"use client";

import React from "react";
import type { AdjustedUtilityModel } from "@/lib/probidExpectedUtility";
import type { AdjustedActionThresholdModel } from "@/lib/probidDecision";
import { formatPct } from "@/lib/lrMath";

type Props = {
  adjustedUtilityModel: AdjustedUtilityModel | null;
  adjustedActionThresholdModel: AdjustedActionThresholdModel | null;
  utilityModifierState: Record<string, boolean>;
  onToggleModifier: (id: string) => void;
  expectedUtilityTreat: number | null;
  expectedUtilityNoTreat: number | null;
  expectedUtilityNetBenefit: number | null;
  currentProbability: number;
  stopThresholdP: number | null;
  manageThresholdP: number | null;
};

export function ProbidPatientFactors({
  adjustedUtilityModel,
  adjustedActionThresholdModel,
  utilityModifierState,
  onToggleModifier,
  expectedUtilityTreat,
  expectedUtilityNoTreat,
  expectedUtilityNetBenefit,
  currentProbability,
  stopThresholdP,
  manageThresholdP,
}: Props) {
  const activeModel = adjustedActionThresholdModel ?? adjustedUtilityModel;
  if (!activeModel) return null;

  const modifiers = activeModel.model.modifiers;
  const selectedCount = activeModel.selectedModifiers.length;
  const isActionModel = adjustedActionThresholdModel != null;

  return (
    <details className="group rounded-xl border p-4 transition-colors open:bg-gray-50/50">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="text-sm font-semibold text-gray-900">Patient factors</span>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-700">
            {selectedCount} selected
          </span>
          <span className="text-xs text-gray-500 transition-transform duration-200 group-open:rotate-180">
            ▾
          </span>
        </div>
      </summary>

      <p className="mt-3 text-xs leading-5 text-gray-600">
        {isActionModel
          ? "Toggle patient-specific factors that change when chronic-PJI work-up can stop and when the case should be managed as likely infection."
          : "Toggle factors that make missing the diagnosis more harmful or treatment less desirable."}
      </p>

      {adjustedActionThresholdModel && stopThresholdP != null && manageThresholdP != null && (
        <div className="mt-3 rounded-lg border bg-white p-3 text-xs text-gray-700">
          <div className="font-semibold text-gray-900">Current chronic-PJI action zone</div>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div>
              <div className="text-gray-500">Current probability</div>
              <div className="mt-1 font-semibold text-gray-900">{formatPct(currentProbability)}</div>
            </div>
            <div>
              <div className="text-gray-500">Stop invasive work-up below</div>
              <div className="mt-1 font-semibold text-gray-900">{formatPct(stopThresholdP)}</div>
            </div>
            <div>
              <div className="text-gray-500">Manage as likely PJI at</div>
              <div className="mt-1 font-semibold text-gray-900">{formatPct(manageThresholdP)}</div>
            </div>
          </div>
          <div className="mt-2 text-[11px] leading-5 text-gray-600">
            Base harms are multiplicatively adjusted from the Bayesian chronic-PJI threshold model, so frailty, treatment burden, and revision risk move the thresholds in visible ways.
          </div>
        </div>
      )}

      {adjustedUtilityModel && expectedUtilityTreat != null && expectedUtilityNoTreat != null && expectedUtilityNetBenefit != null && (
        <div className="mt-3 rounded-lg border bg-white p-3 text-xs text-gray-700">
          <div className="font-semibold text-gray-900">Current expected utility</div>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div>
              <div className="text-gray-500">EU(treat)</div>
              <div className="mt-1 font-semibold text-gray-900">{expectedUtilityTreat.toFixed(3)}</div>
            </div>
            <div>
              <div className="text-gray-500">EU(no treat)</div>
              <div className="mt-1 font-semibold text-gray-900">{expectedUtilityNoTreat.toFixed(3)}</div>
            </div>
            <div>
              <div className="text-gray-500">Net benefit</div>
              <div className="mt-1 font-semibold text-gray-900">{expectedUtilityNetBenefit.toFixed(3)}</div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {modifiers.map((modifier) => (
          <label
            key={modifier.id}
            className="rounded-lg border bg-white px-3 py-3 text-xs text-gray-700"
          >
            <span className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={Boolean(utilityModifierState[modifier.id])}
                onChange={() => onToggleModifier(modifier.id)}
                className="mt-0.5"
              />
              <span>
                <span className="block font-semibold text-gray-900">{modifier.label}</span>
                <span className="mt-1 block leading-5 text-gray-600">{modifier.description}</span>
              </span>
            </span>
          </label>
        ))}
      </div>
    </details>
  );
}
