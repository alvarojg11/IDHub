"use client";

import React from "react";
import { formatPct } from "@/lib/lrMath";

type Props = {
  postP: number;
  pretestP: number;
  treatmentThresholdP: number;
  treatmentThresholdLabel?: string;
  observeThresholdP?: number | null;
  observeThresholdLabel?: string;
  combinedLR: number;
  recommendation: "treat" | "test" | "observe";
  recommendationBadgeLabel?: string;
  recommendationHeadline: string;
  recommendationDetail: string;
  showAdjustedPretest: boolean;
  basePretestP: number;
  syndromeName: string;
  settingLabel: string;
  onCopyShareLink: () => void;
  shareStatus: "idle" | "copied" | "error";
};

const RECOMMENDATION_THEME = {
  treat: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-600 text-white",
    accent: "text-emerald-700",
    number: "text-emerald-700",
  },
  test: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-600 text-white",
    accent: "text-amber-700",
    number: "text-amber-700",
  },
  observe: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    badge: "bg-sky-600 text-white",
    accent: "text-sky-700",
    number: "text-sky-700",
  },
};

const RECOMMENDATION_LABEL = {
  treat: "TREAT",
  test: "GET MORE DATA",
  observe: "OBSERVE",
};

export function ProbidVerdict({
  postP,
  pretestP,
  treatmentThresholdP,
  treatmentThresholdLabel = "Treat at",
  observeThresholdP,
  observeThresholdLabel = "Observe below",
  combinedLR,
  recommendation,
  recommendationBadgeLabel,
  recommendationHeadline,
  recommendationDetail,
  showAdjustedPretest,
  basePretestP,
  syndromeName,
  settingLabel,
  onCopyShareLink,
  shareStatus,
}: Props) {
  const theme = RECOMMENDATION_THEME[recommendation];
  const thresholdCards = [
    { label: "Pretest", value: showAdjustedPretest ? `${formatPct(basePretestP)} → ${formatPct(pretestP)}` : formatPct(pretestP) },
    { label: "Combined LR", value: combinedLR.toFixed(2) },
    ...(observeThresholdP != null ? [{ label: observeThresholdLabel, value: formatPct(observeThresholdP) }] : []),
    { label: treatmentThresholdLabel, value: formatPct(treatmentThresholdP) },
  ];

  return (
    <div className={`rounded-2xl border p-5 ${theme.bg} ${theme.border}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
          Post-test probability
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${theme.badge}`}>
          {recommendationBadgeLabel ?? RECOMMENDATION_LABEL[recommendation]}
        </span>
      </div>

      <div className={`mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl ${theme.number}`}>
        {formatPct(postP)}
      </div>

      <div className="mt-3 text-base font-semibold text-gray-900">{recommendationHeadline}</div>
      {recommendationDetail && (
        <div className="mt-1 text-sm leading-6 text-gray-600">{recommendationDetail}</div>
      )}

      <div className={`mt-4 grid gap-2 text-xs ${thresholdCards.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
        {thresholdCards.map((card) => (
          <div key={card.label} className="rounded-lg bg-white/60 px-3 py-2">
            <div className="text-gray-500">{card.label}</div>
            <div className="mt-1 font-semibold text-gray-900">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
        <span>{syndromeName}</span>
        <span>·</span>
        <span>{settingLabel}</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onCopyShareLink}
          className="rounded-full border border-current/20 bg-white/70 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-white"
        >
          Share case
        </button>
        <span className="text-xs text-gray-500">
          {shareStatus === "copied"
            ? "Link copied"
            : shareStatus === "error"
              ? "Could not copy"
              : "Case state is in the URL"}
        </span>
      </div>
    </div>
  );
}
