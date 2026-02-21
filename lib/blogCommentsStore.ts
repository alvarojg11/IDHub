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

export type BlogCommentRecord = {
  id: string;
  slug: string;
  name: string;
  comment: string;
  approved: boolean;
  createdAt: string;
};

type BlogCommentStore = {
  comments: BlogCommentRecord[];
};

const STORE_PATH =
  process.env.BLOG_COMMENTS_STORE_PATH ?? path.join(process.cwd(), "data", "blog-comments.json");

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
let memoryStore: BlogCommentStore = { comments: [] };

function usingPostgres() {
  return Boolean(DATABASE_URL ?? DATABASE_URL_LEGACY) && !pgUnavailable;
}

export function commentsStorageMode(): "postgres" | "file" {
  return usingPostgres() ? "postgres" : "file";
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

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase();
}

export function isValidBlogSlug(slug: string) {
  return /^[a-z0-9-]{2,160}$/.test(normalizeSlug(slug));
}

function toRow(row: PgQueryResultRow): BlogCommentRecord {
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    name: String(row.name ?? ""),
    comment: String(row.comment ?? ""),
    approved: Boolean(row.approved),
    createdAt: asIso(row.created_at),
  };
}

async function withWriteLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(fn, fn);
  writeQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
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
        const importDynamic = new Function("moduleName", "return import(moduleName);") as (
          moduleName: string
        ) => Promise<unknown>;
        const pg = (await importDynamic("pg")) as {
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
        CREATE TABLE IF NOT EXISTS blog_comments (
          id TEXT PRIMARY KEY,
          slug TEXT NOT NULL,
          name TEXT NOT NULL,
          comment TEXT NOT NULL,
          approved BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      await pool.query(
        `CREATE INDEX IF NOT EXISTS idx_blog_comments_slug_approved_created
         ON blog_comments(slug, approved, created_at DESC);`
      );
      await pool.query(
        `CREATE INDEX IF NOT EXISTS idx_blog_comments_approved_created
         ON blog_comments(approved, created_at DESC);`
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
      await fs.writeFile(STORE_PATH, JSON.stringify({ comments: [] }, null, 2), "utf8");
    }
  } catch {
    canWriteFileStore = false;
  }
}

async function readStore(): Promise<BlogCommentStore> {
  if (!canWriteFileStore) return memoryStore;
  await ensureStoreFile();
  if (!canWriteFileStore) return memoryStore;
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    if (!raw.trim()) return memoryStore;
    const parsed = JSON.parse(raw) as BlogCommentStore;
    if (parsed && Array.isArray(parsed.comments)) {
      memoryStore = parsed;
      return parsed;
    }
    return memoryStore;
  } catch {
    return memoryStore;
  }
}

async function writeStore(store: BlogCommentStore) {
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

function createCommentId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return crypto.randomBytes(16).toString("hex");
}

export async function addBlogComment(input: {
  slug: string;
  name: string;
  comment: string;
}): Promise<BlogCommentRecord> {
  const slug = normalizeSlug(input.slug);
  const name = input.name.trim();
  const comment = input.comment.trim();

  if (usingPostgres() && (await ensurePgSchema())) {
    return withWriteLock(async () => {
      const pool = await getPgPool();
      const id = createCommentId();
      const now = new Date();
      const res = await pool.query(
        `INSERT INTO blog_comments (id, slug, name, comment, approved, created_at)
         VALUES ($1, $2, $3, $4, FALSE, $5)
         RETURNING id, slug, name, comment, approved, created_at`,
        [id, slug, name, comment, now]
      );
      return toRow(res.rows[0] ?? {});
    });
  }

  return withWriteLock(async () => {
    const store = await readStore();
    const record: BlogCommentRecord = {
      id: createCommentId(),
      slug,
      name,
      comment,
      approved: false,
      createdAt: nowIso(),
    };
    store.comments.push(record);
    await writeStore(store);
    return record;
  });
}

export async function getApprovedCommentsBySlug(slugRaw: string): Promise<BlogCommentRecord[]> {
  const slug = normalizeSlug(slugRaw);
  if (usingPostgres() && (await ensurePgSchema())) {
    const pool = await getPgPool();
    const res = await pool.query(
      `SELECT id, slug, name, comment, approved, created_at
       FROM blog_comments
       WHERE slug = $1 AND approved = TRUE
       ORDER BY created_at DESC
       LIMIT 200`,
      [slug]
    );
    return res.rows.map(toRow);
  }
  const store = await readStore();
  return store.comments
    .filter((c) => c.slug === slug && c.approved)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 200);
}

export async function getCommentsForAdmin(filters?: {
  slug?: string;
  approved?: boolean;
}): Promise<BlogCommentRecord[]> {
  const slug = filters?.slug ? normalizeSlug(filters.slug) : undefined;
  const approved = filters?.approved;

  if (usingPostgres() && (await ensurePgSchema())) {
    const pool = await getPgPool();
    const clauses: string[] = [];
    const params: unknown[] = [];
    if (slug) {
      params.push(slug);
      clauses.push(`slug = $${params.length}`);
    }
    if (typeof approved === "boolean") {
      params.push(approved);
      clauses.push(`approved = $${params.length}`);
    }
    const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
    const res = await pool.query(
      `SELECT id, slug, name, comment, approved, created_at
       FROM blog_comments
       ${where}
       ORDER BY created_at DESC
       LIMIT 1000`,
      params
    );
    return res.rows.map(toRow);
  }

  const store = await readStore();
  return store.comments
    .filter((c) => {
      if (slug && c.slug !== slug) return false;
      if (typeof approved === "boolean" && c.approved !== approved) return false;
      return true;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 1000);
}

export async function setCommentApproved(id: string, approved: boolean): Promise<boolean> {
  const targetId = id.trim();
  if (!targetId) return false;

  if (usingPostgres() && (await ensurePgSchema())) {
    return withWriteLock(async () => {
      const pool = await getPgPool();
      const res = await pool.query(
        `UPDATE blog_comments
         SET approved = $2
         WHERE id = $1
         RETURNING id`,
        [targetId, approved]
      );
      return res.rows.length > 0;
    });
  }

  return withWriteLock(async () => {
    const store = await readStore();
    const hit = store.comments.find((c) => c.id === targetId);
    if (!hit) return false;
    hit.approved = approved;
    await writeStore(store);
    return true;
  });
}
