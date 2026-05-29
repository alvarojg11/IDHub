"use client";

import React from "react";
import { clamp, formatPct } from "@/lib/lrMath";

type Props = {
  currentP: number;
  treatThresholdP: number;
  observeThresholdP?: number | null;
  recommendation: "treat" | "test" | "observe";
  compact?: boolean;
};

const ZONE_COLORS = {
  observe: { fill: "#e0f2fe", stroke: "#7dd3fc" },
  test: { fill: "#fef3c7", stroke: "#fcd34d" },
  treat: { fill: "#d1fae5", stroke: "#6ee7b7" },
};

const MARKER_COLORS = {
  treat: "#059669",
  test: "#d97706",
  observe: "#0284c7",
};

export function ProbidThresholdHighway({
  currentP,
  treatThresholdP,
  observeThresholdP,
  recommendation,
  compact = false,
}: Props) {
  const observeP = observeThresholdP ?? treatThresholdP * 0.5;
  const height = compact ? 44 : 60;
  const padX = 8;
  const labelRowH = compact ? 14 : 18;
  const totalH = height + labelRowH + 4;

  const w = 600;
  const innerW = w - padX * 2;

  const xPx = (p: number) => padX + clamp(p, 0, 1) * innerW;

  const cur = clamp(currentP, 0.001, 0.999);
  const treat = clamp(treatThresholdP, 0.001, 0.999);
  const obs = clamp(observeP, 0.001, treat - 0.005);

  const markerColor = MARKER_COLORS[recommendation];

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${w} ${totalH}`}
        width="100%"
        height="100%"
        role="img"
        aria-label={`Probability ${formatPct(currentP)} versus treatment threshold ${formatPct(treatThresholdP)}`}
      >
        <defs>
          <linearGradient id="zone-observe" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ZONE_COLORS.observe.fill} stopOpacity="0.7" />
            <stop offset="100%" stopColor={ZONE_COLORS.observe.fill} />
          </linearGradient>
          <linearGradient id="zone-test" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ZONE_COLORS.test.fill} stopOpacity="0.7" />
            <stop offset="100%" stopColor={ZONE_COLORS.test.fill} />
          </linearGradient>
          <linearGradient id="zone-treat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ZONE_COLORS.treat.fill} stopOpacity="0.7" />
            <stop offset="100%" stopColor={ZONE_COLORS.treat.fill} />
          </linearGradient>
          <filter id="marker-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.15" />
          </filter>
        </defs>

        <rect x={xPx(0)} y={0} width={xPx(obs) - xPx(0)} height={height} fill="url(#zone-observe)" rx={6} />
        <rect x={xPx(obs)} y={0} width={xPx(treat) - xPx(obs)} height={height} fill="url(#zone-test)" />
        <rect
          x={xPx(treat)}
          y={0}
          width={xPx(1) - xPx(treat)}
          height={height}
          fill="url(#zone-treat)"
          rx={6}
        />

        <line
          x1={xPx(obs)}
          y1={0}
          x2={xPx(obs)}
          y2={height}
          stroke={ZONE_COLORS.observe.stroke}
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
        <line
          x1={xPx(treat)}
          y1={0}
          x2={xPx(treat)}
          y2={height}
          stroke={ZONE_COLORS.treat.stroke}
          strokeWidth={2}
        />

        {observeThresholdP != null && !compact && (
          <text
            x={xPx(obs)}
            y={-3}
            textAnchor="middle"
            fill="#0284c7"
            fontSize="10"
            fontWeight={600}
          >
            Observe {formatPct(obs)}
          </text>
        )}

        <text
          x={xPx(treat)}
          y={-3}
          textAnchor={compact ? "end" : "middle"}
          fill="#059669"
          fontSize={compact ? 10 : 11}
          fontWeight={600}
        >
          Treat {formatPct(treat)}
        </text>

        <polygon
          points={`${xPx(cur)},${height} ${xPx(cur) - 7},${height + 10} ${xPx(cur) + 7},${height + 10}`}
          fill={markerColor}
          filter="url(#marker-shadow)"
        />
        <circle cx={xPx(cur)} cy={height / 2} r={compact ? 6 : 8} fill={markerColor} stroke="#fff" strokeWidth={2.5} filter="url(#marker-shadow)" />
        <text
          x={xPx(cur)}
          y={height / 2 + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#fff"
          fontSize={compact ? 8 : 9}
          fontWeight={700}
        >
          {Math.round(cur * 100)}
        </text>

        <g transform={`translate(0, ${height + 2})`}>
          {compact ? (
            <>
              <text x={padX} y={labelRowH - 2} fill="#0284c7" fontSize="9" fontWeight={600}>
                OBS
              </text>
              <text x={xPx(obs) + 6} y={labelRowH - 2} fill="#d97706" fontSize="9" fontWeight={600}>
                TEST MORE
              </text>
              <text x={w - padX} y={labelRowH - 2} textAnchor="end" fill="#059669" fontSize="9" fontWeight={600}>
                TREAT
              </text>
            </>
          ) : (
            <>
              <text x={padX} y={labelRowH - 2} fill="#0284c7" fontSize="10" fontWeight={600}>
                Observe
              </text>
              <text x={xPx(obs) + 8} y={labelRowH - 2} fill="#d97706" fontSize="10" fontWeight={600}>
                Get more data
              </text>
              <text x={w - padX} y={labelRowH - 2} textAnchor="end" fill="#059669" fontSize="10" fontWeight={600}>
                Treat
              </text>
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
