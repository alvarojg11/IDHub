"use client";

import React from "react";
import type { AdjustedUtilityModel } from "@/lib/probidExpectedUtility";

type Props = {
  adjustedUtilityModel: AdjustedUtilityModel | null;
  utilityModifierState: Record<string, boolean>;
  onToggleModifier: (id: string) => void;
  expectedUtilityTreat: number | null;
  expectedUtilityNoTreat: number | null;
  expectedUtilityNetBenefit: number | null;
};

export function ProbidPatientFactors({
  adjustedUtilityModel,
  utilityModifierState,
  onToggleModifier,
}: Props) {
  if (!adjustedUtilityModel) return null;

  return (
    <details className="group rounded-xl border p-4 transition-colors open:bg-gray-50/50">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="text-sm font-semibold text-gray-900">Patient factors</span>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-700">
            {adjustedUtilityModel.selectedModifiers.length} selected
          </span>
          <span className="text-xs text-gray-500 transition-transform duration-200 group-open:rotate-180">
            ▾
          </span>
        </div>
      </summary>

      <p className="mt-3 text-xs leading-5 text-gray-600">
        Toggle factors that make missing the diagnosis more harmful or treatment less desirable.
      </p>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {adjustedUtilityModel.model.modifiers.map((modifier) => (
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
