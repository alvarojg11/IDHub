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

const pillBase = "px-2.5 py-1.5 text-xs rounded-md border transition select-none";
const onCls = "bg-[var(--primary-strong)] text-white border-[var(--primary-strong)]";
const offCls =
  "bg-transparent text-[var(--muted)] border-[var(--border)] hover:bg-[var(--card-hover)]";

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
      className={`${pillBase} ${active ? onCls : offCls} ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
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
    <div
      className={`flex flex-col gap-3 py-2 sm:flex-row sm:items-center sm:justify-between ${disabled ? "opacity-60" : ""}`}
    >
      <div className="min-w-0">
        <button
          type="button"
          onClick={onOpenEvidence}
          className="text-left font-medium text-[var(--foreground)] hover:underline"
        >
          {item.label}
        </button>
        <div className="text-xs text-[var(--muted)]">
          {lrText}
          {item.notes ? <span className="ml-2">• {item.notes}</span> : null}
        </div>
        {item.source ? (
          <div className="mt-1 text-xs text-[var(--muted)]">
            Source:{" "}
            {item.source.url ? (
              <a
                href={item.source.url}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-[var(--foreground)]"
              >
                {item.source.short}
                {item.source.year ? ` (${item.source.year})` : ""}
              </a>
            ) : (
              <span>
                {item.source.short}
                {item.source.year ? ` (${item.source.year})` : ""}
              </span>
            )}
          </div>
        ) : null}
      </div>

      <div className="flex w-full flex-wrap items-center gap-1 sm:w-auto sm:justify-end">
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
