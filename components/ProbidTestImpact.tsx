"use client";

import React, { useState } from "react";
import { clamp, formatPct } from "@/lib/lrMath";
import type { TestImpactEntry, TestImpactClassification } from "@/lib/probidTestImpact";
import { classificationLabel } from "@/lib/probidTestImpact";

type Props = {
  entries: TestImpactEntry[];
  treatThresholdP: number;
  observeThresholdP: number;
  currentP: number;
  onAddTest: (itemId: string, state: "present" | "absent") => void;
  maxVisible?: number;
};

const CLASS_BADGE_COLORS: Record<TestImpactClassification, { bg: string; text: string; bar: string }> = {
  high_value: { bg: "#059669", text: "#ffffff", bar: "#10b981" },
  rule_in: { bg: "#2563eb", text: "#ffffff", bar: "#3b82f6" },
  rule_out: { bg: "#7c3aed", text: "#ffffff", bar: "#8b5cf6" },
  low_impact: { bg: "#9ca3af", text: "#ffffff", bar: "#d1d5db" },
};

export function ProbidTestImpact({
  entries,
  treatThresholdP,
  observeThresholdP,
  currentP,
  onAddTest,
  maxVisible = 5,
}: Props) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? entries : entries.slice(0, maxVisible);
  const hiddenCount = entries.length - maxVisible;

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border bg-gray-50/80 p-4 text-sm text-gray-600">
        Add findings above to see which tests could change the decision.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visible.map((entry) => (
        <TestImpactRow
          key={entry.item.id}
          entry={entry}
          treatThresholdP={treatThresholdP}
          observeThresholdP={observeThresholdP}
          currentP={currentP}
          onAddTest={onAddTest}
        />
      ))}

      {!showAll && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="w-full rounded-lg border border-dashed border-gray-300 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          Show {hiddenCount} more test{hiddenCount !== 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}

function TestImpactRow({
  entry,
  treatThresholdP,
  observeThresholdP,
  currentP,
  onAddTest,
}: {
  entry: TestImpactEntry;
  treatThresholdP: number;
  observeThresholdP: number;
  currentP: number;
  onAddTest: (itemId: string, state: "present" | "absent") => void;
}) {
  const { item, pIfPositive, pIfNegative, classification } = entry;
  const colors = CLASS_BADGE_COLORS[classification];

  const w = 320;
  const h = 28;
  const padX = 4;

  const xPx = (p: number) => padX + clamp(p, 0, 1) * (w - padX * 2);

  const left = pIfNegative != null ? xPx(pIfNegative) : xPx(currentP);
  const right = pIfPositive != null ? xPx(pIfPositive) : xPx(currentP);

  return (
    <div className="rounded-xl border bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-gray-900">{item.label}</div>
        </div>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {classificationLabel(classification)}
        </span>
      </div>

      <div className="mt-2 overflow-hidden rounded-md">
        <svg
          viewBox={`0 0 ${w} ${h + 16}`}
          width="100%"
          height="100%"
          role="img"
          aria-label={`${item.label}: if positive ${pIfPositive != null ? formatPct(pIfPositive) : "N/A"}, if negative ${pIfNegative != null ? formatPct(pIfNegative) : "N/A"}`}
        >
          <rect x={xPx(0)} y={2} width={xPx(observeThresholdP) - xPx(0)} height={h} fill="#e0f2fe" opacity={0.5} />
          <rect x={xPx(observeThresholdP)} y={2} width={xPx(treatThresholdP) - xPx(observeThresholdP)} height={h} fill="#fef3c7" opacity={0.5} />
          <rect x={xPx(treatThresholdP)} y={2} width={xPx(1) - xPx(treatThresholdP)} height={h} fill="#d1fae5" opacity={0.5} />

          <line x1={xPx(observeThresholdP)} y1={2} x2={xPx(observeThresholdP)} y2={h + 2} stroke="#7dd3fc" strokeWidth={1} strokeDasharray="3 2" />
          <line x1={xPx(treatThresholdP)} y1={2} x2={xPx(treatThresholdP)} y2={h + 2} stroke="#6ee7b7" strokeWidth={1.5} />

          <line x1={xPx(currentP)} y1={2} x2={xPx(currentP)} y2={h + 2} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />

          <rect
            x={Math.min(left, right)}
            y={h / 2 - 3}
            width={Math.max(4, Math.abs(right - left))}
            height={6}
            rx={3}
            fill={colors.bar}
            opacity={0.6}
          />

          {pIfNegative != null && (
            <circle cx={left} cy={h / 2 + 2} r={5} fill={colors.bar} stroke="#fff" strokeWidth={1.5} />
          )}
          {pIfPositive != null && (
            <circle cx={right} cy={h / 2 + 2} r={5} fill={colors.bar} stroke="#fff" strokeWidth={1.5} />
          )}

          {pIfNegative != null && (
            <text x={left} y={h + 13} textAnchor="middle" fill="#6b7280" fontSize="8" fontWeight={600}>
              {formatPct(pIfNegative)} if −
            </text>
          )}
          {pIfPositive != null && (
            <text x={right} y={h + 13} textAnchor="middle" fill="#6b7280" fontSize="8" fontWeight={600}>
              {formatPct(pIfPositive)} if +
            </text>
          )}
        </svg>
      </div>

      <div className="mt-2 flex gap-2">
        {item.lrPos != null && (
          <button
            type="button"
            onClick={() => onAddTest(item.id, "present")}
            className="flex-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-2 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 active:scale-[0.98]"
          >
            + {item.label}
          </button>
        )}
        {item.lrNeg != null && (
          <button
            type="button"
            onClick={() => onAddTest(item.id, "absent")}
            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 active:scale-[0.98]"
          >
            − {item.label}
          </button>
        )}
      </div>
    </div>
  );
}
