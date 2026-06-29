"use client";

import React from "react";
import { clamp, formatPct } from "@/lib/lrMath";

type TraceStep = {
  id: string;
  label: string;
  lrUsed: number;
  state: "present" | "absent" | "unknown";
  pAfter: number;
};

type Props = {
  pretestP: number;
  steps: TraceStep[];
  currentP: number;
  observeThresholdP?: number | null;
  treatThresholdP: number;
  observeZoneLabel: string;
  middleZoneLabel: string;
  treatZoneLabel: string;
  observeThresholdLabel: string;
  treatThresholdLabel: string;
};

type Point = {
  label: string;
  probability: number;
  detail: string;
};

export function ProbidProbabilityTrace({
  pretestP,
  steps,
  currentP,
  observeThresholdP,
  treatThresholdP,
  observeZoneLabel,
  middleZoneLabel,
  treatZoneLabel,
  observeThresholdLabel,
  treatThresholdLabel,
}: Props) {
  const points: Point[] = [
    {
      label: "Start",
      probability: pretestP,
      detail: `Pretest ${formatPct(pretestP)}`,
    },
    ...steps.map((step, index) => ({
      label: `${index + 1}`,
      probability: step.pAfter,
      detail: `${step.label} (${step.state === "present" ? "LR+" : "LR-"} ${step.lrUsed.toFixed(2)})`,
    })),
  ];

  const width = 640;
  const height = 220;
  const padLeft = 48;
  const padRight = 24;
  const padTop = 18;
  const padBottom = 34;
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;

  const maxIndex = Math.max(points.length - 1, 1);
  const xForIndex = (index: number) => padLeft + (index / maxIndex) * innerW;
  const yForProbability = (p: number) => padTop + (1 - clamp(p, 0, 1)) * innerH;

  const observeP = observeThresholdP ?? treatThresholdP * 0.5;
  const polyline = points.map((point, index) => `${xForIndex(index)},${yForProbability(point.probability)}`).join(" ");
  return (
    <section className="rounded-[1.4rem] border border-gray-200/90 bg-[linear-gradient(180deg,#fcfdff_0%,#f7fafc_100%)] p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-900">Live probability trace</div>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-600">
            ProbID plots the current path from the starting context to the most recent post-test probability, using the same LR sequence shown in the math panel.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 sm:min-w-[220px]">
          <TraceBadge label={observeThresholdLabel} value={formatPct(observeP)} tone="cool" />
          <TraceBadge label={treatThresholdLabel} value={formatPct(treatThresholdP)} tone="warm" />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-[1.2rem] border border-gray-200 bg-white">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height="100%"
          role="img"
          aria-label={`Probability trace from ${formatPct(pretestP)} to ${formatPct(currentP)} with thresholds at ${formatPct(observeP)} and ${formatPct(treatThresholdP)}`}
        >
          <defs>
            <linearGradient id="trace-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
          </defs>

          <rect x={padLeft} y={padTop} width={innerW} height={yForProbability(treatThresholdP) - padTop} fill="#dcfce7" opacity="0.72" />
          <rect x={padLeft} y={yForProbability(treatThresholdP)} width={innerW} height={yForProbability(observeP) - yForProbability(treatThresholdP)} fill="#fef3c7" opacity="0.82" />
          <rect x={padLeft} y={yForProbability(observeP)} width={innerW} height={yForProbability(0) - yForProbability(observeP)} fill="#dbeafe" opacity="0.82" />

          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
            <g key={tick}>
              <line x1={padLeft} y1={yForProbability(tick)} x2={width - padRight} y2={yForProbability(tick)} stroke="#e5e7eb" strokeWidth="1" />
              <text x={padLeft - 10} y={yForProbability(tick) + 4} textAnchor="end" fill="#6b7280" fontSize="10" fontWeight="600">
                {Math.round(tick * 100)}
              </text>
            </g>
          ))}

          <line x1={padLeft} y1={yForProbability(observeP)} x2={width - padRight} y2={yForProbability(observeP)} stroke="#2563eb" strokeWidth="1.5" strokeDasharray="5 4" />
          <line x1={padLeft} y1={yForProbability(treatThresholdP)} x2={width - padRight} y2={yForProbability(treatThresholdP)} stroke="#b45309" strokeWidth="1.5" strokeDasharray="5 4" />

          <text x={width - padRight} y={yForProbability(0.92)} textAnchor="end" fill="#166534" fontSize="10" fontWeight="700">
            {treatZoneLabel}
          </text>
          <text x={width - padRight} y={yForProbability(0.52)} textAnchor="end" fill="#92400e" fontSize="10" fontWeight="700">
            {middleZoneLabel}
          </text>
          <text x={width - padRight} y={yForProbability(0.08)} textAnchor="end" fill="#1d4ed8" fontSize="10" fontWeight="700">
            {observeZoneLabel}
          </text>

          <polyline fill="none" stroke="url(#trace-line)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" points={polyline} />

          {points.map((point, index) => {
            const x = xForIndex(index);
            const y = yForProbability(point.probability);
            const isLast = index === points.length - 1;
            return (
              <g key={`${point.label}-${index}`}>
                <circle cx={x} cy={y} r={isLast ? 7 : 5.5} fill={isLast ? "#111827" : "#2563eb"} stroke="#ffffff" strokeWidth="2.5" />
                <text x={x} y={height - 10} textAnchor="middle" fill="#6b7280" fontSize="9" fontWeight="700">
                  {point.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {points.map((point, index) => (
          <div key={`${point.label}-${index}`} className={`rounded-xl border px-3 py-2 ${index === points.length - 1 ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white"}`}>
            <div className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${index === points.length - 1 ? "text-white/70" : "text-gray-400"}`}>
              {index === 0 ? "Start" : `Step ${index}`}
            </div>
            <div className={`mt-1 text-sm font-semibold ${index === points.length - 1 ? "text-white" : "text-gray-900"}`}>
              {formatPct(point.probability)}
            </div>
            <div className={`mt-1 text-xs leading-5 ${index === points.length - 1 ? "text-white/80" : "text-gray-600"}`}>
              {point.detail}
            </div>
          </div>
        ))}
      </div>

      {steps.length === 0 && (
        <div className="mt-3 rounded-xl border border-dashed border-gray-300 bg-white/80 px-3 py-2 text-xs text-gray-600">
          Choose findings above to watch the probability move in real time.
        </div>
      )}

      <div className="mt-3 text-[11px] leading-5 text-gray-500">
        Threshold shading updates live with syndrome-specific modifiers. The trace itself only reflects the exact evidence sequence you selected.
      </div>
    </section>
  );
}

function TraceBadge({ label, value, tone }: { label: string; value: string; tone: "cool" | "warm" }) {
  return (
    <div className={`rounded-xl border px-3 py-2 ${tone === "cool" ? "border-blue-200 bg-blue-50" : "border-amber-200 bg-amber-50"}`}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}
