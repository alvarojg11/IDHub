import "server-only";

import { promises as fs } from "fs";
import path from "path";

type PgQueryResultRow = Record<string, unknown>;
type PgClient = {
  query: (text: string, values?: unknown[]) => Promise<{ rows: PgQueryResultRow[] }>;
  release: () => void;
};
type PgPool = {
  query: (text: string, values?: unknown[]) => Promise<{ rows: PgQueryResultRow[] }>;
  connect: () => Promise<PgClient>;
};

type PollRecord = {
  counts: Record<string, number>;
  votesByVoter: Record<string, string>;
  updatedAt: string;
};

type PollStore = {
  polls: Record<string, PollRecord>;
};

export type PollSnapshot = {
  counts: Record<string, number>;
  totalVotes: number;
  updatedAt: string;
  userVote: string | null;
};

export type CasePollAdminItem = {
  pollId: string;
  counts: Record<string, number>;
  totalVotes: number;
  uniqueIdentifiedVoters: number;
  updatedAt: string;
};

const STORE_PATH =
  process.env.CASE_POLL_STORE_PATH ?? path.join(process.cwd(), "data", "case-polls.json");

const DATABASE_URL =
  process.env.SUBSCRIPTIONS_DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.DATABASE_URL;
const DATABASE_URL_LEGACY = process.env.postgres_url;

let pgPoolPromise: Promise<PgPool> | null = null;
let pgSchemaReadyPromise: Promise<void> | null = null;
let pgUnavailable = false;

let writeQueue: Promise<unknown> = Promise.resolve();
let canWriteFileStore = true;
let memoryStore: PollStore = emptyStore();

function emptyStore(): PollStore {
  return { polls: {} };
}

function nowIso() {
  return new Date().toISOString();
}

function asIso(value: unknown): string {
  if (!value) return nowIso();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return new Date(value).toISOString();
  return nowIso();
}

function usingPostgres() {
  return Boolean(DATABASE_URL ?? DATABASE_URL_LEGACY) && !pgUnavailable;
}

export function casePollsStorageMode(): "postgres" | "file" {
  return usingPostgres() ? "postgres" : "file";
}

async function getPgPool(): Promise<PgPool> {
  const connectionString = DATABASE_URL ?? DATABASE_URL_LEGACY;
  if (pgUnavailable) {
    throw new Error("Postgres driver is unavailable in this runtime.");
  }
  if (!connectionString) {
    throw new Error(
      "Database URL is not configured. Set SUBSCRIPTIONS_DATABASE_URL, POSTGRES_URL, POSTGRES_URL_NON_POOLING, or DATABASE_URL."
    );
  }
  if (!pgPoolPromise) {
    pgPoolPromise = (async () => {
      try {
        const pg = (await import("pg")) as {
          Pool: new (opts: { connectionString: string }) => PgPool;
        };
        return new pg.Pool({ connectionString });
      } catch {
        pgUnavailable = true;
        pgPoolPromise = null;
        throw new Error("Postgres driver 'pg' is unavailable; falling back to file storage.");
      }
    })();
  }
  return pgPoolPromise;
}

async function ensurePgSchema(): Promise<boolean> {
  if (!usingPostgres()) return false;
  if (!pgSchemaReadyPromise) {
    pgSchemaReadyPromise = (async () => {
      const pool = await getPgPool();
      await pool.query(`
        CREATE TABLE IF NOT EXISTS case_poll_options (
          poll_id TEXT NOT NULL,
          option_id TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (poll_id, option_id)
        );
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS case_poll_votes (
          id BIGSERIAL PRIMARY KEY,
          poll_id TEXT NOT NULL,
          option_id TEXT NOT NULL,
          voter_id TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_case_poll_votes_poll_voter_unique
        ON case_poll_votes(poll_id, voter_id)
        WHERE voter_id IS NOT NULL;
      `);
      await pool.query(
        `CREATE INDEX IF NOT EXISTS idx_case_poll_votes_poll_created ON case_poll_votes(poll_id, created_at DESC);`
      );
      await pool.query(
        `CREATE INDEX IF NOT EXISTS idx_case_poll_votes_poll_option ON case_poll_votes(poll_id, option_id);`
      );
      await pool.query(
        `CREATE INDEX IF NOT EXISTS idx_case_poll_options_poll ON case_poll_options(poll_id);`
      );
    })();
  }
  try {
    await pgSchemaReadyPromise;
    return true;
  } catch {
    pgUnavailable = true;
    pgSchemaReadyPromise = null;
    return false;
  }
}

async function ensureStoreFile() {
  if (!canWriteFileStore) return;
  const dir = path.dirname(STORE_PATH);
  try {
    await fs.mkdir(dir, { recursive: true });
    try {
      await fs.access(STORE_PATH);
    } catch {
      await fs.writeFile(STORE_PATH, JSON.stringify(emptyStore(), null, 2), "utf8");
    }
  } catch {
    canWriteFileStore = false;
  }
}

async function readStore(): Promise<PollStore> {
  if (!canWriteFileStore) {
    return memoryStore;
  }
  await ensureStoreFile();
  if (!canWriteFileStore) {
    return memoryStore;
  }
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    if (!raw.trim()) return memoryStore;
    const parsed = JSON.parse(raw) as PollStore;
    if (parsed && parsed.polls) {
      memoryStore = parsed;
      return parsed;
    }
    return memoryStore;
  } catch {
    return memoryStore;
  }
}

async function writeStore(store: PollStore) {
  memoryStore = store;
  if (!canWriteFileStore) return;
  await ensureStoreFile();
  if (!canWriteFileStore) return;
  try {
    await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
  } catch {
    canWriteFileStore = false;
  }
}

async function withStoreWriteLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(fn, fn);
  writeQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

function normalizeOptionIds(optionIds?: string[]): string[] {
  if (!optionIds?.length) return [];
  const deduped = new Set(
    optionIds
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .slice(0, 32)
  );
  return Array.from(deduped);
}

function ensurePollRecord(store: PollStore, pollId: string, optionIds?: string[]): PollRecord {
  const poll =
    store.polls[pollId] ??
    (store.polls[pollId] = {
      counts: {},
      votesByVoter: {},
      updatedAt: nowIso(),
    });

  for (const id of normalizeOptionIds(optionIds)) {
    if (typeof poll.counts[id] !== "number") {
      poll.counts[id] = 0;
    }
  }

  return poll;
}

function toSnapshot(poll: PollRecord, voterId?: string): PollSnapshot {
  const totalVotes = Object.values(poll.counts).reduce((sum, n) => sum + (n || 0), 0);
  return {
    counts: poll.counts,
    totalVotes,
    updatedAt: poll.updatedAt,
    userVote: voterId ? poll.votesByVoter[voterId] ?? null : null,
  };
}

async function upsertPollOptionsPg(pollId: string, optionIds?: string[]) {
  const normalized = normalizeOptionIds(optionIds);
  if (!normalized.length) return;
  const pool = await getPgPool();
  await pool.query(
    `INSERT INTO case_poll_options (poll_id, option_id)
     SELECT $1, UNNEST($2::text[])
     ON CONFLICT (poll_id, option_id) DO NOTHING`,
    [pollId, normalized]
  );
}

async function getPollSnapshotPg(
  pollId: string,
  voterId?: string,
  optionIds?: string[]
): Promise<PollSnapshot> {
  await upsertPollOptionsPg(pollId, optionIds);
  const pool = await getPgPool();

  const [countsRes, metaRes, userVoteRes] = await Promise.all([
    pool.query(
      `
      WITH counts AS (
        SELECT option_id, COUNT(*)::int AS count
        FROM case_poll_votes
        WHERE poll_id = $1
        GROUP BY option_id
      )
      SELECT o.option_id, COALESCE(c.count, 0)::int AS count
      FROM case_poll_options o
      LEFT JOIN counts c ON c.option_id = o.option_id
      WHERE o.poll_id = $1
      ORDER BY o.option_id ASC
      `,
      [pollId]
    ),
    pool.query(
      `
      SELECT
        COALESCE(MAX(created_at), NOW()) AS updated_at,
        COUNT(*)::int AS total_votes
      FROM case_poll_votes
      WHERE poll_id = $1
      `,
      [pollId]
    ),
    voterId
      ? pool.query(
          `
          SELECT option_id
          FROM case_poll_votes
          WHERE poll_id = $1 AND voter_id = $2
          ORDER BY created_at DESC
          LIMIT 1
          `,
          [pollId, voterId]
        )
      : Promise.resolve({ rows: [] as PgQueryResultRow[] }),
  ]);

  const counts: Record<string, number> = {};
  for (const row of countsRes.rows) {
    counts[String(row.option_id ?? "")] = Number(row.count ?? 0);
  }

  const meta = metaRes.rows[0] ?? {};
  return {
    counts,
    totalVotes: Number(meta.total_votes ?? 0),
    updatedAt: asIso(meta.updated_at),
    userVote: voterId ? (userVoteRes.rows[0]?.option_id ? String(userVoteRes.rows[0].option_id) : null) : null,
  };
}

export async function getPollSnapshot(
  pollId: string,
  voterId?: string,
  optionIds?: string[]
): Promise<PollSnapshot> {
  if (usingPostgres() && (await ensurePgSchema())) {
    return getPollSnapshotPg(pollId, voterId, optionIds);
  }

  const store = await readStore();
  const poll = ensurePollRecord(store, pollId, optionIds);
  if (normalizeOptionIds(optionIds).length > 0) {
    // Persist new option keys so zero-count bars remain stable.
    await writeStore(store);
  }
  return toSnapshot(poll, voterId);
}

export async function castVote(params: {
  pollId: string;
  optionId: string;
  voterId?: string;
  optionIds?: string[];
}): Promise<{ accepted: boolean; snapshot: PollSnapshot }> {
  const { pollId, optionId, voterId, optionIds } = params;

  if (usingPostgres() && (await ensurePgSchema())) {
    return withStoreWriteLock(async () => {
      const pool = await getPgPool();
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const normalizedOptionIds = normalizeOptionIds(optionIds);
        if (!normalizedOptionIds.includes(optionId)) normalizedOptionIds.push(optionId);
        if (normalizedOptionIds.length) {
          await client.query(
            `INSERT INTO case_poll_options (poll_id, option_id)
             SELECT $1, UNNEST($2::text[])
             ON CONFLICT (poll_id, option_id) DO NOTHING`,
            [pollId, normalizedOptionIds]
          );
        }

        if (voterId) {
          const existing = await client.query(
            `SELECT option_id FROM case_poll_votes WHERE poll_id = $1 AND voter_id = $2 LIMIT 1`,
            [pollId, voterId]
          );
          if (existing.rows[0]) {
            await client.query("COMMIT");
            const snapshot = await getPollSnapshotPg(pollId, voterId, optionIds);
            return { accepted: false, snapshot };
          }
        }

        await client.query(
          `INSERT INTO case_poll_votes (poll_id, option_id, voter_id, created_at)
           VALUES ($1, $2, $3, NOW())`,
          [pollId, optionId, voterId ?? null]
        );

        await client.query("COMMIT");
        const snapshot = await getPollSnapshotPg(pollId, voterId, optionIds);
        return { accepted: true, snapshot };
      } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw error;
      } finally {
        client.release();
      }
    });
  }

  return withStoreWriteLock(async () => {
    const store = await readStore();
    const poll = ensurePollRecord(store, pollId, optionIds);

    if (voterId && poll.votesByVoter[voterId]) {
      return {
        accepted: false,
        snapshot: toSnapshot(poll, voterId),
      };
    }

    poll.counts[optionId] = (poll.counts[optionId] ?? 0) + 1;
    if (voterId) {
      poll.votesByVoter[voterId] = optionId;
    }
    poll.updatedAt = nowIso();

    await writeStore(store);

    return {
      accepted: true,
      snapshot: toSnapshot(poll, voterId),
    };
  });
}

export async function getCasePollsForAdmin(params?: {
  pollIdContains?: string;
}): Promise<CasePollAdminItem[]> {
  const filterRaw = params?.pollIdContains?.trim() ?? "";
  const filter = filterRaw.toLowerCase();

  if (usingPostgres() && (await ensurePgSchema())) {
    const pool = await getPgPool();
    const where = filter ? `WHERE LOWER(v.poll_id) LIKE $1` : "";
    const values: unknown[] = filter ? [`%${filter}%`] : [];

    const [summaryRes, countsRes] = await Promise.all([
      pool.query(
        `
        SELECT
          v.poll_id,
          COUNT(*)::int AS total_votes,
          COUNT(DISTINCT v.voter_id)::int AS unique_identified_voters,
          MAX(v.created_at) AS updated_at
        FROM case_poll_votes v
        ${where}
        GROUP BY v.poll_id
        ORDER BY MAX(v.created_at) DESC
        `,
        values
      ),
      pool.query(
        `
        SELECT
          v.poll_id,
          v.option_id,
          COUNT(*)::int AS count
        FROM case_poll_votes v
        ${where}
        GROUP BY v.poll_id, v.option_id
        `,
        values
      ),
    ]);

    const countsByPoll: Record<string, Record<string, number>> = {};
    for (const row of countsRes.rows) {
      const pollId = String(row.poll_id ?? "");
      if (!countsByPoll[pollId]) countsByPoll[pollId] = {};
      countsByPoll[pollId][String(row.option_id ?? "")] = Number(row.count ?? 0);
    }

    return summaryRes.rows.map((row) => ({
      pollId: String(row.poll_id ?? ""),
      counts: countsByPoll[String(row.poll_id ?? "")] ?? {},
      totalVotes: Number(row.total_votes ?? 0),
      uniqueIdentifiedVoters: Number(row.unique_identified_voters ?? 0),
      updatedAt: asIso(row.updated_at),
    }));
  }

  const store = await readStore();
  const entries = Object.entries(store.polls)
    .filter(([pollId]) => (filter ? pollId.toLowerCase().includes(filter) : true))
    .map(([pollId, poll]) => ({
      pollId,
      counts: poll.counts,
      totalVotes: Object.values(poll.counts).reduce((sum, n) => sum + (n || 0), 0),
      uniqueIdentifiedVoters: Object.keys(poll.votesByVoter ?? {}).length,
      updatedAt: poll.updatedAt,
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return entries;
}
