// components/FaganChart.tsx
import React, { useMemo } from "react";
import { clamp, postTestProb, formatPct } from "@/lib/lrMath";

type Props = {
  pretestP: number; // 0..1
  combinedLR: number;
  width?: number;
  height?: number;
  xMax?: number; // default 0.30 (30%)
};

function scaleLinear(x: number, d0: number, d1: number, r0: number, r1: number) {
  if (d1 === d0) return r0;
  const t = (x - d0) / (d1 - d0);
  return r0 + t * (r1 - r0);
}

function niceTicks(min: number, max: number, step: number) {
  const out: number[] = [];
  const start = Math.ceil(min / step) * step;
  for (let v = start; v <= max + 1e-9; v += step) out.push(Number(v.toFixed(10)));
  return out;
}

export function FaganChart({ pretestP, combinedLR, width = 520, height = 260, xMax = 0.3 }: Props) {
  const pad = { l: 54, r: 16, t: 24, b: 40 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;

  const pre = clamp(pretestP, 0.001, 0.999);
  const post = clamp(postTestProb(pre, combinedLR), 0.001, 0.999);

  const xMin = 0;
  const xMaxClamped = clamp(xMax, 0.05, 0.99);
  const xRight = Math.min(0.99, Math.max(xMaxClamped, pre * 1.15)); // keep dot visible

  // curve points
  const pts = useMemo(() => {
    const N = 140;
    const arr: Array<{ x: number; y: number }> = [];
    for (let i = 0; i <= N; i++) {
      const x = xMin + (i / N) * (xRight - xMin);
      const y = postTestProb(clamp(x, 0.001, 0.999), combinedLR);
      arr.push({ x, y });
    }
    return arr;
  }, [combinedLR, xRight]);

  // y-axis max (nice-ish)
  const yTop = Math.min(0.95, Math.max(0.2, Math.max(post, pts[pts.length - 1]?.y ?? 0) * 1.05));
  const yMaxNice = Math.min(0.95, Math.ceil(yTop * 20) / 20); // steps of 0.05

  const xPix = (x: number) => pad.l + scaleLinear(x, xMin, xRight, 0, innerW);
  const yPix = (y: number) => pad.t + scaleLinear(y, 0, yMaxNice, innerH, 0);

  const pathD = pts
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${xPix(p.x).toFixed(2)} ${yPix(p.y).toFixed(2)}`)
    .join(" ");

  const dotX = xPix(clamp(pre, xMin, xRight));
  const dotY = yPix(clamp(post, 0, yMaxNice));

  const xTicks = niceTicks(0, xRight, 0.05); // 0, 5, 10, ...
  const yTicks = niceTicks(0, yMaxNice, 0.1); // 0, 10, 20, ...

  // Explicit SVG colors (no Tailwind fill/stroke utilities needed)
  const gridStroke = "#e5e7eb"; // gray-200
  const axisStroke = "#94a3b8"; // slate-400
  const curveStroke = "#0f172a"; // slate-900
  const textFill = "#475569"; // slate-600
  const titleFill = "#0f172a"; // slate-900

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="LR update curve">
        {/* IMPORTANT: explicit fill so we never get the “black block” */}
        <rect x={0} y={0} width={width} height={height} rx={12} fill="none" />

        {/* Title */}
        <text x={pad.l} y={16} fill={titleFill} fontSize="12" fontWeight={600}>
          Updating probability using likelihood ratios (Combined LR = {combinedLR.toFixed(2)})
        </text>

        {/* Grid */}
        {xTicks.map((t) => (
          <line
            key={`xgrid-${t}`}
            x1={xPix(t)}
            y1={pad.t}
            x2={xPix(t)}
            y2={pad.t + innerH}
            stroke={gridStroke}
            strokeWidth={1}
          />
        ))}
        {yTicks.map((t) => (
          <line
            key={`ygrid-${t}`}
            x1={pad.l}
            y1={yPix(t)}
            x2={pad.l + innerW}
            y2={yPix(t)}
            stroke={gridStroke}
            strokeWidth={1}
          />
        ))}

        {/* Axes */}
        <line x1={pad.l} y1={pad.t + innerH} x2={pad.l + innerW} y2={pad.t + innerH} stroke={axisStroke} strokeWidth={1.5} />
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + innerH} stroke={axisStroke} strokeWidth={1.5} />

        {/* Curve */}
        <path d={pathD} fill="none" stroke={curveStroke} strokeWidth={2.25} />

        {/* Dot */}
        <circle cx={dotX} cy={dotY} r={5} fill={curveStroke} />

        {/* Dot label */}
        <text x={dotX + 10} y={dotY - 8} fill={titleFill} fontSize="12" fontWeight={600}>
          {formatPct(pre)} → {formatPct(post)}
        </text>

        {/* X tick labels */}
        {xTicks.map((t) => (
          <text key={`xt-${t}`} x={xPix(t)} y={pad.t + innerH + 18} textAnchor="middle" fill={textFill} fontSize="11">
            {Math.round(t * 100)}
          </text>
        ))}
        <text x={pad.l + innerW / 2} y={height - 10} textAnchor="middle" fill={textFill} fontSize="12">
          Pretest probability (%)
        </text>

        {/* Y tick labels */}
        {yTicks.map((t) => (
          <text key={`yt-${t}`} x={pad.l - 10} y={yPix(t) + 4} textAnchor="end" fill={textFill} fontSize="11">
            {Math.round(t * 100)}
          </text>
        ))}
        <text
          x={14}
          y={pad.t + innerH / 2}
          textAnchor="middle"
          fill={textFill}
          fontSize="12"
          transform={`rotate(-90 14 ${pad.t + innerH / 2})`}
        >
          Post-test probability (%)
        </text>
      </svg>
    </div>
  );
}
