import "server-only";

import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";

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

let canWriteFileStore = true;
let writeQueue: Promise<unknown> = Promise.resolve();
let memoryStore: SubscriptionStore = {
  subscribers: [],
  knownContentIds: [],
  sentByContentId: {},
};

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
  const store = await readStore();
  return store.subscribers.filter((s) => s.status === "confirmed");
}

export async function getSubscribers(status?: SubscriberStatus): Promise<SubscriberListItem[]> {
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
  const store = await readStore();
  return {
    knownContentIds: new Set(store.knownContentIds),
    sentByContentId: store.sentByContentId,
  };
}

export async function markKnownContentIds(ids: string[]) {
  await withWriteLock(async () => {
    const store = await readStore();
    const next = new Set([...store.knownContentIds, ...ids]);
    store.knownContentIds = Array.from(next);
    await writeStore(store);
  });
}

export async function markDelivery(contentId: string, email: string) {
  await withWriteLock(async () => {
    const store = await readStore();
    const sent = new Set(store.sentByContentId[contentId] ?? []);
    sent.add(normalizeEmail(email));
    store.sentByContentId[contentId] = Array.from(sent);
    await writeStore(store);
  });
}
