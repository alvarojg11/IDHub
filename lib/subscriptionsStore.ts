import "server-only";

import crypto from "crypto";
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

export type SubscriberStatus = "pending" | "confirmed" | "unsubscribed";

export type SubscriberRecord = {
  email: string;
  status: SubscriberStatus;
  confirmToken: string | null;
  unsubscribeToken: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
};

export type SubscriptionStore = {
  subscribers: SubscriberRecord[];
  knownContentIds: string[];
  sentByContentId: Record<string, string[]>;
};

export type SubscriberListItem = {
  email: string;
  status: SubscriberStatus;
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
};

const STORE_PATH =
  process.env.SUBSCRIPTIONS_STORE_PATH ?? path.join(process.cwd(), "data", "subscribers.json");

const DATABASE_URL =
  process.env.SUBSCRIPTIONS_DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.DATABASE_URL;
const DATABASE_URL_LEGACY = process.env.postgres_url;

let pgPoolPromise: Promise<PgPool> | null = null;
let pgSchemaReadyPromise: Promise<void> | null = null;
let pgUnavailable = false;

let canWriteFileStore = true;
let writeQueue: Promise<unknown> = Promise.resolve();
let memoryStore: SubscriptionStore = {
  subscribers: [],
  knownContentIds: [],
  sentByContentId: {},
};

function usingPostgres() {
  return Boolean(DATABASE_URL ?? DATABASE_URL_LEGACY) && !pgUnavailable;
}

export function subscriptionsStorageMode(): "postgres" | "file" {
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
        CREATE TABLE IF NOT EXISTS subscription_subscribers (
          email TEXT PRIMARY KEY,
          status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
          confirm_token TEXT,
          unsubscribe_token TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL,
          confirmed_at TIMESTAMPTZ
        );
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS subscription_known_content (
          content_id TEXT PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS subscription_deliveries (
          content_id TEXT NOT NULL,
          email TEXT NOT NULL,
          delivered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (content_id, email)
        );
      `);
      await pool.query(
        `CREATE INDEX IF NOT EXISTS idx_subscription_subscribers_status ON subscription_subscribers(status);`
      );
      await pool.query(
        `CREATE INDEX IF NOT EXISTS idx_subscription_deliveries_content_id ON subscription_deliveries(content_id);`
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

function asIso(value: unknown): string {
  if (!value) return nowIso();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return new Date(value).toISOString();
  return nowIso();
}

function rowToSubscriberRecord(row: PgQueryResultRow): SubscriberRecord {
  return {
    email: String(row.email ?? ""),
    status: String(row.status ?? "pending") as SubscriberStatus,
    confirmToken: row.confirm_token ? String(row.confirm_token) : null,
    unsubscribeToken: String(row.unsubscribe_token ?? ""),
    createdAt: asIso(row.created_at),
    updatedAt: asIso(row.updated_at),
    confirmedAt: row.confirmed_at ? asIso(row.confirmed_at) : null,
  };
}

function nowIso() {
  return new Date().toISOString();
}

function randomToken() {
  return crypto.randomBytes(24).toString("hex");
}

function emptyStore(): SubscriptionStore {
  return {
    subscribers: [],
    knownContentIds: [],
    sentByContentId: {},
  };
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

async function readStore(): Promise<SubscriptionStore> {
  if (!canWriteFileStore) return memoryStore;
  await ensureStoreFile();
  if (!canWriteFileStore) return memoryStore;
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    if (!raw.trim()) return memoryStore;
    const parsed = JSON.parse(raw) as SubscriptionStore;
    if (
      parsed &&
      Array.isArray(parsed.subscribers) &&
      Array.isArray(parsed.knownContentIds) &&
      parsed.sentByContentId
    ) {
      memoryStore = parsed;
      return parsed;
    }
    return memoryStore;
  } catch {
    return memoryStore;
  }
}

async function writeStore(store: SubscriptionStore) {
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

async function withWriteLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(fn, fn);
  writeQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  const normalized = normalizeEmail(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

export async function subscribeEmail(rawEmail: string): Promise<{
  status: "created_pending" | "already_pending" | "already_confirmed";
  email: string;
  confirmToken: string | null;
  unsubscribeToken: string;
}> {
  const email = normalizeEmail(rawEmail);
  if (!isValidEmail(email)) {
    throw new Error("Invalid email address.");
  }

  if (usingPostgres() && (await ensurePgSchema())) {
    return withWriteLock(async () => {
      const pool = await getPgPool();
      const now = new Date();
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const existingRes = await client.query(
          `SELECT email, status, confirm_token, unsubscribe_token
           FROM subscription_subscribers
           WHERE email = $1
           FOR UPDATE`,
          [email]
        );
        const existing = existingRes.rows[0];

        if (!existing) {
          const confirmToken = randomToken();
          const unsubscribeToken = randomToken();
          await client.query(
            `INSERT INTO subscription_subscribers
             (email, status, confirm_token, unsubscribe_token, created_at, updated_at, confirmed_at)
             VALUES ($1, 'pending', $2, $3, $4, $4, NULL)`,
            [email, confirmToken, unsubscribeToken, now]
          );
          await client.query("COMMIT");
          return {
            status: "created_pending" as const,
            email,
            confirmToken,
            unsubscribeToken,
          };
        }

        const existingStatus = String(existing.status ?? "");
        const existingUnsubscribeToken = String(existing.unsubscribe_token ?? "");
        if (existingStatus === "confirmed") {
          await client.query("COMMIT");
          return {
            status: "already_confirmed" as const,
            email,
            confirmToken: null,
            unsubscribeToken: existingUnsubscribeToken,
          };
        }

        const nextConfirmToken = existing.confirm_token
          ? String(existing.confirm_token)
          : randomToken();
        await client.query(
          `UPDATE subscription_subscribers
           SET status = 'pending',
               confirm_token = $2,
               updated_at = $3
           WHERE email = $1`,
          [email, nextConfirmToken, now]
        );
        await client.query("COMMIT");
        return {
          status: "already_pending" as const,
          email,
          confirmToken: nextConfirmToken,
          unsubscribeToken: existingUnsubscribeToken,
        };
      } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw error;
      } finally {
        client.release();
      }
    });
  }

  return withWriteLock(async () => {
    const store = await readStore();
    const now = nowIso();
    const existing = store.subscribers.find((s) => s.email === email);

    if (!existing) {
      const record: SubscriberRecord = {
        email,
        status: "pending",
        confirmToken: randomToken(),
        unsubscribeToken: randomToken(),
        createdAt: now,
        updatedAt: now,
        confirmedAt: null,
      };
      store.subscribers.push(record);
      await writeStore(store);
      return {
        status: "created_pending" as const,
        email,
        confirmToken: record.confirmToken,
        unsubscribeToken: record.unsubscribeToken,
      };
    }

    if (existing.status === "confirmed") {
      return {
        status: "already_confirmed" as const,
        email,
        confirmToken: null,
        unsubscribeToken: existing.unsubscribeToken,
      };
    }

    existing.status = "pending";
    // Keep the same pending token so previously sent confirmation links remain valid.
    if (!existing.confirmToken) {
      existing.confirmToken = randomToken();
    }
    existing.updatedAt = now;
    await writeStore(store);
    return {
      status: "already_pending" as const,
      email,
      confirmToken: existing.confirmToken,
      unsubscribeToken: existing.unsubscribeToken,
    };
  });
}

export async function confirmSubscriptionByToken(token: string): Promise<{
  ok: boolean;
  email?: string;
  unsubscribeToken?: string;
  reason?: "invalid_token" | "already_confirmed" | "unsubscribed";
}> {
  if (!token.trim()) return { ok: false, reason: "invalid_token" };

  if (usingPostgres() && (await ensurePgSchema())) {
    return withWriteLock(async () => {
      const pool = await getPgPool();
      const now = new Date();
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const res = await client.query(
          `SELECT email, status, unsubscribe_token
           FROM subscription_subscribers
           WHERE confirm_token = $1
           FOR UPDATE`,
          [token.trim()]
        );
        const hit = res.rows[0];
        if (!hit) {
          await client.query("COMMIT");
          return { ok: false, reason: "invalid_token" as const };
        }

        const status = String(hit.status ?? "");
        const email = String(hit.email ?? "");
        const unsubscribeToken = String(hit.unsubscribe_token ?? "");
        if (status === "unsubscribed") {
          await client.query("COMMIT");
          return { ok: false, reason: "unsubscribed" as const };
        }
        if (status === "confirmed") {
          await client.query("COMMIT");
          return {
            ok: false,
            reason: "already_confirmed" as const,
            email,
            unsubscribeToken,
          };
        }

        await client.query(
          `UPDATE subscription_subscribers
           SET status = 'confirmed',
               confirmed_at = $2,
               updated_at = $2,
               confirm_token = NULL
           WHERE email = $1`,
          [email, now]
        );
        await client.query("COMMIT");
        return { ok: true, email, unsubscribeToken };
      } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw error;
      } finally {
        client.release();
      }
    });
  }

  return withWriteLock(async () => {
    const store = await readStore();
    const now = nowIso();
    const hit = store.subscribers.find((s) => s.confirmToken === token.trim());
    if (!hit) {
      return { ok: false, reason: "invalid_token" as const };
    }
    if (hit.status === "unsubscribed") {
      return { ok: false, reason: "unsubscribed" as const };
    }
    if (hit.status === "confirmed") {
      return {
        ok: false,
        reason: "already_confirmed" as const,
        email: hit.email,
        unsubscribeToken: hit.unsubscribeToken,
      };
    }

    hit.status = "confirmed";
    hit.confirmedAt = now;
    hit.updatedAt = now;
    hit.confirmToken = null;
    await writeStore(store);
    return { ok: true, email: hit.email, unsubscribeToken: hit.unsubscribeToken };
  });
}

export async function unsubscribeByToken(token: string): Promise<{
  ok: boolean;
  email?: string;
  reason?: "invalid_token";
}> {
  if (!token.trim()) return { ok: false, reason: "invalid_token" };

  if (usingPostgres() && (await ensurePgSchema())) {
    return withWriteLock(async () => {
      const pool = await getPgPool();
      const now = new Date();
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const res = await client.query(
          `SELECT email
           FROM subscription_subscribers
           WHERE unsubscribe_token = $1
           FOR UPDATE`,
          [token.trim()]
        );
        const hit = res.rows[0];
        if (!hit) {
          await client.query("COMMIT");
          return { ok: false, reason: "invalid_token" as const };
        }
        const email = String(hit.email ?? "");
        await client.query(
          `UPDATE subscription_subscribers
           SET status = 'unsubscribed',
               confirm_token = NULL,
               updated_at = $2
           WHERE email = $1`,
          [email, now]
        );
        await client.query("COMMIT");
        return { ok: true, email };
      } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw error;
      } finally {
        client.release();
      }
    });
  }

  return withWriteLock(async () => {
    const store = await readStore();
    const now = nowIso();
    const hit = store.subscribers.find((s) => s.unsubscribeToken === token.trim());
    if (!hit) {
      return { ok: false, reason: "invalid_token" as const };
    }
    hit.status = "unsubscribed";
    hit.confirmToken = null;
    hit.updatedAt = now;
    await writeStore(store);
    return { ok: true, email: hit.email };
  });
}

export async function getConfirmedSubscribers() {
  if (usingPostgres() && (await ensurePgSchema())) {
    const pool = await getPgPool();
    const res = await pool.query(
      `SELECT email, status, confirm_token, unsubscribe_token, created_at, updated_at, confirmed_at
       FROM subscription_subscribers
       WHERE status = 'confirmed'
       ORDER BY updated_at DESC`
    );
    return res.rows.map(rowToSubscriberRecord);
  }
  const store = await readStore();
  return store.subscribers.filter((s) => s.status === "confirmed");
}

export async function getSubscribers(status?: SubscriberStatus): Promise<SubscriberListItem[]> {
  if (usingPostgres() && (await ensurePgSchema())) {
    const pool = await getPgPool();
    const params: unknown[] = [];
    const where = status ? "WHERE status = $1" : "";
    if (status) params.push(status);
    const res = await pool.query(
      `SELECT email, status, confirm_token, unsubscribe_token, created_at, updated_at, confirmed_at
       FROM subscription_subscribers
       ${where}
       ORDER BY updated_at DESC`,
      params
    );
    return res.rows.map((row) => {
      const s = rowToSubscriberRecord(row);
      return {
        email: s.email,
        status: s.status,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        confirmedAt: s.confirmedAt,
      };
    });
  }
  const store = await readStore();
  const list = status
    ? store.subscribers.filter((s) => s.status === status)
    : store.subscribers;
  return list
    .map((s) => ({
      email: s.email,
      status: s.status,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      confirmedAt: s.confirmedAt,
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getNotificationState() {
  if (usingPostgres() && (await ensurePgSchema())) {
    const pool = await getPgPool();
    const [knownRes, sentRes] = await Promise.all([
      pool.query(`SELECT content_id FROM subscription_known_content`),
      pool.query(`SELECT content_id, email FROM subscription_deliveries`),
    ]);
    const sentByContentId: Record<string, string[]> = {};
    for (const row of sentRes.rows) {
      const contentId = String(row.content_id ?? "");
      const email = String(row.email ?? "");
      if (!sentByContentId[contentId]) sentByContentId[contentId] = [];
      sentByContentId[contentId].push(email);
    }
    return {
      knownContentIds: new Set(knownRes.rows.map((r) => String(r.content_id ?? ""))),
      sentByContentId,
    };
  }
  const store = await readStore();
  return {
    knownContentIds: new Set(store.knownContentIds),
    sentByContentId: store.sentByContentId,
  };
}

export async function markKnownContentIds(ids: string[]) {
  if (usingPostgres() && (await ensurePgSchema())) {
    if (ids.length === 0) return;
    const pool = await getPgPool();
    await pool.query(
      `INSERT INTO subscription_known_content (content_id)
       SELECT UNNEST($1::text[])
       ON CONFLICT (content_id) DO NOTHING`,
      [ids]
    );
    return;
  }
  await withWriteLock(async () => {
    const store = await readStore();
    const next = new Set([...store.knownContentIds, ...ids]);
    store.knownContentIds = Array.from(next);
    await writeStore(store);
  });
}

export async function markDelivery(contentId: string, email: string) {
  if (usingPostgres() && (await ensurePgSchema())) {
    const pool = await getPgPool();
    await pool.query(
      `INSERT INTO subscription_deliveries (content_id, email)
       VALUES ($1, $2)
       ON CONFLICT (content_id, email) DO NOTHING`,
      [contentId, normalizeEmail(email)]
    );
    return;
  }
  await withWriteLock(async () => {
    const store = await readStore();
    const sent = new Set(store.sentByContentId[contentId] ?? []);
    sent.add(normalizeEmail(email));
    store.sentByContentId[contentId] = Array.from(sent);
    await writeStore(store);
  });
}
