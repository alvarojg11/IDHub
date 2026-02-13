// components/LRItemToggle.tsx
import React from "react";
import type { FindingState, LRItem } from "@/lib/lrTypes";

type Props = {
  item: LRItem;
  state: FindingState;
  disabled?: boolean;
  onChange: (next: FindingState) => void;
  onOpenEvidence?: () => void;
};

const pillBase =
  "px-2 py-1 text-xs rounded-md border transition select-none";
const onCls =
  "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100";
const offCls =
  "bg-transparent text-slate-700 border-slate-300 hover:bg-slate-50 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-900/30";

function Pill({
  active,
  label,
  onClick,
  disabled,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${pillBase} ${active ? onCls : offCls} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      {label}
    </button>
  );
}

export function LRItemToggle({ item, state, disabled, onChange, onOpenEvidence }: Props) {
  const lrText =
    item.lrPos || item.lrNeg
      ? `LR+ ${item.lrPos ?? "—"} / LR− ${item.lrNeg ?? "—"}`
      : "";

  return (
    <div className={`flex items-center justify-between gap-3 py-2 ${disabled ? "opacity-60" : ""}`}>
      <div className="min-w-0">
        <button
          type="button"
          onClick={onOpenEvidence}
          className="text-left font-medium text-slate-900 dark:text-slate-100 hover:underline"
        >
          {item.label}
        </button>
        <div className="text-xs text-slate-600 dark:text-slate-300">
          {lrText}
          {item.notes ? <span className="ml-2">• {item.notes}</span> : null}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Pill
          disabled={disabled}
          active={state === "present"}
          label="Present"
          onClick={() => onChange(state === "present" ? "unknown" : "present")}
        />
        <Pill
          disabled={disabled}
          active={state === "absent"}
          label="Absent"
          onClick={() => onChange(state === "absent" ? "unknown" : "absent")}
        />
        <Pill
          disabled={disabled}
          active={state === "unknown"}
          label="?"
          onClick={() => onChange("unknown")}
        />
      </div>
    </div>
  );
}
