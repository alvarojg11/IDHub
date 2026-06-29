"use client";

import React from "react";
import { formatPct } from "@/lib/lrMath";

type Props = {
  postP: number;
  treatmentThresholdP: number;
  recommendation: "treat" | "test" | "observe";
  recommendationHeadline: string;
  recommendationBadgeLabel?: string;
  treatmentThresholdLabel?: string;
  onScrollToTop: () => void;
};

const BADGE = {
  treat: "bg-emerald-600 text-white",
  test: "bg-amber-600 text-white",
  observe: "bg-sky-600 text-white",
};

const LABEL = {
  treat: "TREAT",
  test: "GET MORE DATA",
  observe: "OBSERVE",
};

export function ProbidFloatingBar({
  postP,
  treatmentThresholdP,
  recommendation,
  recommendationHeadline,
  recommendationBadgeLabel,
  treatmentThresholdLabel = "Treat at",
  onScrollToTop,
}: Props) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
      <button
        type="button"
        onClick={onScrollToTop}
        className="block w-full rounded-2xl border border-gray-200 bg-white/95 px-4 py-3 text-left shadow-lg backdrop-blur transition-transform duration-150 active:scale-[0.99]"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold text-gray-900">{formatPct(postP)}</span>
              <span className="text-xs text-gray-500">probability</span>
            </div>
            <div className="mt-0.5 text-sm font-medium text-gray-700 truncate">
              {recommendationHeadline}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${BADGE[recommendation]}`}
              >
                {recommendationBadgeLabel ?? LABEL[recommendation]}
              </span>
            <span className="text-gray-400" aria-hidden="true">
              ▲
            </span>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
          <span>
            {treatmentThresholdLabel} <span className="font-semibold text-gray-700">{formatPct(treatmentThresholdP)}</span>
          </span>
          <span>·</span>
          <span className="text-gray-400">Tap to scroll up</span>
        </div>
      </button>
    </div>
  );
}
