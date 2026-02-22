"use client";

import { useEffect, useMemo, useState } from "react";

type PollAdminItem = {
  pollId: string;
  caseSlug?: string | null;
  caseTitle?: string | null;
  counts: Record<string, number>;
  totalVotes: number;
  uniqueIdentifiedVoters: number;
  updatedAt: string;
};

type AdminResponse = {
  ok: boolean;
  error?: string;
  storage?: "postgres" | "file";
  filter?: { q?: string };
  summary?: {
    polls: number;
    totalVotes: number;
    uniqueIdentifiedVoters: number;
  };
  polls?: PollAdminItem[];
};

type ViewMode = "raw" | "case";
type DisplayMode = "table" | "chart";

type CaseGroup = {
  key: string;
  caseSlug: string | null;
  caseTitle: string;
  polls: PollAdminItem[];
  totalVotes: number;
  uniqueIdentifiedVoters: number;
  updatedAt: string;
};

const SECRET_KEY = "idhub-case-polls-admin-secret";

function fmtDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

async function readJsonSafely<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function requestErrorMessage(
  res: Response,
  body: { error?: string } | null,
  fallback: string
) {
  if (body?.error) return body.error;
  if (!res.ok) return `${fallback} (${res.status})`;
  return fallback;
}

function optionBreakdown(counts: Record<string, number>) {
  return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
}

function percent(count: number, total: number) {
  if (!total) return 0;
  return Math.round((count / total) * 100);
}

function inferQuestionLabel(pollId: string) {
  const mQ = pollId.match(/-q(\d+)$/i);
  if (mQ) return `Question ${mQ[1]}`;
  if (/-dx$/i.test(pollId)) return "Diagnosis";
  if (/-tx$/i.test(pollId)) return "Management";
  return pollId;
}

function groupPollsByCase(polls: PollAdminItem[]): CaseGroup[] {
  const byKey = new Map<string, CaseGroup>();

  for (const poll of polls) {
    const key = poll.caseSlug ?? `unknown:${poll.caseTitle ?? poll.pollId}`;
    const title = poll.caseTitle ?? poll.caseSlug ?? "Unknown case";
    const existing = byKey.get(key);
    if (existing) {
      existing.polls.push(poll);
      existing.totalVotes += poll.totalVotes;
      existing.uniqueIdentifiedVoters += poll.uniqueIdentifiedVoters;
      if (poll.updatedAt > existing.updatedAt) existing.updatedAt = poll.updatedAt;
    } else {
      byKey.set(key, {
        key,
        caseSlug: poll.caseSlug ?? null,
        caseTitle: title,
        polls: [poll],
        totalVotes: poll.totalVotes,
        uniqueIdentifiedVoters: poll.uniqueIdentifiedVoters,
        updatedAt: poll.updatedAt,
      });
    }
  }

  return Array.from(byKey.values())
    .map((g) => ({
      ...g,
      polls: [...g.polls].sort((a, b) => a.pollId.localeCompare(b.pollId)),
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function buildCsv(polls: PollAdminItem[]) {
  const rows: string[][] = [
    [
      "case_title",
      "case_slug",
      "poll_id",
      "option_id",
      "count",
      "total_votes",
      "percent",
      "identified_voters",
      "updated_at",
    ],
  ];

  for (const poll of polls) {
    const breakdown = optionBreakdown(poll.counts);
    if (breakdown.length === 0) {
      rows.push([
        poll.caseTitle ?? "",
        poll.caseSlug ?? "",
        poll.pollId,
        "",
        "0",
        String(poll.totalVotes),
        "0",
        String(poll.uniqueIdentifiedVoters),
        poll.updatedAt,
      ]);
      continue;
    }

    for (const [optionId, count] of breakdown) {
      rows.push([
        poll.caseTitle ?? "",
        poll.caseSlug ?? "",
        poll.pollId,
        optionId,
        String(count),
        String(poll.totalVotes),
        String(percent(count, poll.totalVotes)),
        String(poll.uniqueIdentifiedVoters),
        poll.updatedAt,
      ]);
    }
  }

  return rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function CasePollsAdminPanel() {
  const [secret, setSecret] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminResponse | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("case");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("chart");

  const hasSecret = secret.trim().length > 0;
  const polls = useMemo(() => data?.polls ?? [], [data]);
  const caseGroups = useMemo(() => groupPollsByCase(polls), [polls]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(SECRET_KEY) ?? "";
    if (saved) setSecret(saved);
  }, []);

  async function loadPolls() {
    if (!secret.trim()) {
      setError("Enter your admin secret first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      const url = `/api/case-polls/admin${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, {
        headers: { "x-notify-secret": secret.trim() },
        cache: "no-store",
      });
      const body = await readJsonSafely<AdminResponse>(res);
      if (!res.ok || !body?.ok) {
        throw new Error(
          requestErrorMessage(res, body, "Server returned an empty or invalid response")
        );
      }
      setData(body);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(SECRET_KEY, secret.trim());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load case poll results.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  function handleExportCsv() {
    const csv = buildCsv(polls);
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    downloadCsv(`idhub-case-polls-${stamp}.csv`, csv);
  }

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Access</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Enter the same value used for <code>SUBSCRIPTIONS_NOTIFY_SECRET</code>.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="SUBSCRIPTIONS_NOTIFY_SECRET"
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-[var(--primary)] focus:ring-2"
          />
          <button
            type="button"
            onClick={loadPolls}
            disabled={loading || !hasSecret}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : "Load Polls"}
          </button>
        </div>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[240px]">
            <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Poll ID contains
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. carrions, q1, hzo"
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)]"
            />
          </div>
          <button
            type="button"
            onClick={loadPolls}
            disabled={loading || !hasSecret}
            className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={polls.length === 0}
            className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Export CSV
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Metric label="Polls" value={data?.summary?.polls ?? 0} />
          <Metric label="Total Votes" value={data?.summary?.totalVotes ?? 0} />
          <Metric
            label="Identified Voters"
            value={data?.summary?.uniqueIdentifiedVoters ?? 0}
            helper="sum across polls"
          />
        </div>

        {data?.storage ? (
          <p
            className={`mt-3 text-sm ${
              data.storage === "postgres" ? "text-green-700" : "text-amber-700"
            }`}
          >
            Storage mode: <strong>{data.storage}</strong>
            {data.storage === "file" ? " (file storage can reset on Vercel redeploys)" : ""}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <TogglePill
            active={viewMode === "case"}
            onClick={() => setViewMode("case")}
            label="Per Case View"
          />
          <TogglePill
            active={viewMode === "raw"}
            onClick={() => setViewMode("raw")}
            label="Raw Poll IDs"
          />
          <TogglePill
            active={displayMode === "chart"}
            onClick={() => setDisplayMode("chart")}
            label="Chart View"
          />
          <TogglePill
            active={displayMode === "table"}
            onClick={() => setDisplayMode("table")}
            label="Table View"
          />
        </div>

        {viewMode === "raw" && displayMode === "table" ? (
          <RawPollsTable polls={polls} />
        ) : null}

        {viewMode === "raw" && displayMode === "chart" ? (
          <div className="mt-4 space-y-4">
            {polls.map((poll) => (
              <PollChartCard key={poll.pollId} poll={poll} />
            ))}
            {polls.length === 0 ? (
              <EmptyState text="No case polls found for this filter." />
            ) : null}
          </div>
        ) : null}

        {viewMode === "case" && displayMode === "table" ? (
          <CaseGroupsTable groups={caseGroups} />
        ) : null}

        {viewMode === "case" && displayMode === "chart" ? (
          <div className="mt-4 space-y-5">
            {caseGroups.map((group) => (
              <CaseGroupChartCard key={group.key} group={group} />
            ))}
            {caseGroups.length === 0 ? (
              <EmptyState text="No case polls found for this filter." />
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function RawPollsTable({ polls }: { polls: PollAdminItem[] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--border)] bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-[var(--background)] text-left text-[var(--muted)]">
          <tr>
            <th className="px-3 py-2 font-semibold">Case</th>
            <th className="px-3 py-2 font-semibold">Poll ID</th>
            <th className="px-3 py-2 font-semibold">Votes</th>
            <th className="px-3 py-2 font-semibold">Identified Voters</th>
            <th className="px-3 py-2 font-semibold">Breakdown</th>
            <th className="px-3 py-2 font-semibold">Updated</th>
          </tr>
        </thead>
        <tbody>
          {polls.map((poll) => (
            <tr key={poll.pollId} className="border-t border-[var(--border)] align-top">
              <td className="px-3 py-2">
                <div className="font-medium text-[var(--foreground)]">
                  {poll.caseTitle ?? "Unknown case"}
                </div>
                {poll.caseSlug ? <code className="text-xs text-[var(--muted)]">{poll.caseSlug}</code> : null}
              </td>
              <td className="px-3 py-2">
                <code>{poll.pollId}</code>
              </td>
              <td className="px-3 py-2">{poll.totalVotes}</td>
              <td className="px-3 py-2">{poll.uniqueIdentifiedVoters}</td>
              <td className="px-3 py-2 min-w-[240px]">
                <MiniBreakdown poll={poll} />
              </td>
              <td className="px-3 py-2">{fmtDate(poll.updatedAt)}</td>
            </tr>
          ))}
          {polls.length === 0 ? (
            <tr>
              <td className="px-3 py-4 text-[var(--muted)]" colSpan={6}>
                No case polls found for this filter.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function CaseGroupsTable({ groups }: { groups: CaseGroup[] }) {
  return (
    <div className="mt-4 space-y-4">
      {groups.map((group) => (
        <div key={group.key} className="rounded-lg border border-[var(--border)] bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-[var(--foreground)]">{group.caseTitle}</h3>
              <p className="text-xs text-[var(--muted)]">
                {group.caseSlug ? <code>{group.caseSlug}</code> : "No case slug metadata"} · Updated{" "}
                {fmtDate(group.updatedAt)}
              </p>
            </div>
            <div className="text-sm text-[var(--foreground)]">
              <span className="mr-4">Votes: {group.totalVotes}</span>
              <span>Identified voters: {group.uniqueIdentifiedVoters}</span>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-[var(--muted)]">
                <tr>
                  <th className="px-2 py-1 font-semibold">Question</th>
                  <th className="px-2 py-1 font-semibold">Poll ID</th>
                  <th className="px-2 py-1 font-semibold">Votes</th>
                  <th className="px-2 py-1 font-semibold">Breakdown</th>
                </tr>
              </thead>
              <tbody>
                {group.polls.map((poll) => (
                  <tr key={poll.pollId} className="border-t border-[var(--border)] align-top">
                    <td className="px-2 py-2">{inferQuestionLabel(poll.pollId)}</td>
                    <td className="px-2 py-2">
                      <code>{poll.pollId}</code>
                    </td>
                    <td className="px-2 py-2">{poll.totalVotes}</td>
                    <td className="px-2 py-2 min-w-[240px]">
                      <MiniBreakdown poll={poll} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {groups.length === 0 ? <EmptyState text="No case polls found for this filter." /> : null}
    </div>
  );
}

function MiniBreakdown({ poll }: { poll: PollAdminItem }) {
  const breakdown = optionBreakdown(poll.counts);
  return (
    <div className="space-y-2">
      {breakdown.map(([optionId, count]) => (
        <div key={`${poll.pollId}-${optionId}`}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-[var(--foreground)]">{optionId}</span>
            <span className="text-[var(--muted)]">
              {count} ({percent(count, poll.totalVotes)}%)
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded bg-[var(--background)]">
            <div
              className="h-2 rounded bg-[var(--primary)]/60"
              style={{ width: `${percent(count, poll.totalVotes)}%` }}
            />
          </div>
        </div>
      ))}
      {breakdown.length === 0 ? <span className="text-xs text-[var(--muted)]">No votes yet</span> : null}
    </div>
  );
}

function PollChartCard({ poll }: { poll: PollAdminItem }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {poll.caseTitle ?? "Unknown case"}
          </p>
          <p className="text-xs text-[var(--muted)]">
            <code>{poll.pollId}</code>
            {poll.caseSlug ? (
              <>
                {" · "}
                <code>{poll.caseSlug}</code>
              </>
            ) : null}
          </p>
        </div>
        <div className="text-xs text-[var(--muted)]">
          {poll.totalVotes} votes · {poll.uniqueIdentifiedVoters} identified · {fmtDate(poll.updatedAt)}
        </div>
      </div>
      <div className="mt-4">
        <MiniBreakdown poll={poll} />
      </div>
    </div>
  );
}

function CaseGroupChartCard({ group }: { group: CaseGroup }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[var(--foreground)]">{group.caseTitle}</h3>
          <p className="text-xs text-[var(--muted)]">
            {group.caseSlug ? <code>{group.caseSlug}</code> : "No case slug metadata"}
          </p>
        </div>
        <div className="text-xs text-[var(--muted)]">
          {group.totalVotes} total votes · {group.uniqueIdentifiedVoters} identified · {fmtDate(group.updatedAt)}
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {group.polls.map((poll) => (
          <div key={poll.pollId} className="rounded-md border border-[var(--border)] bg-[var(--background)] p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-[var(--foreground)]">
                {inferQuestionLabel(poll.pollId)}
              </p>
              <p className="text-xs text-[var(--muted)]">
                <code>{poll.pollId}</code> · {poll.totalVotes} votes
              </p>
            </div>
            <MiniBreakdown poll={poll} />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-4 rounded-lg border border-[var(--border)] bg-white p-4 text-sm text-[var(--muted)]">
      {text}
    </div>
  );
}

function TogglePill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "border-[var(--primary)] bg-[var(--primary)] text-white"
          : "border-[var(--border)] bg-white text-[var(--foreground)]"
      }`}
    >
      {label}
    </button>
  );
}

function Metric({
  label,
  value,
  helper,
}: {
  label: string;
  value: number;
  helper?: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{value}</p>
      {helper ? <p className="mt-1 text-xs text-[var(--muted)]">{helper}</p> : null}
    </div>
  );
}
