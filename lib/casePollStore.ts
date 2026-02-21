import "server-only";

import { promises as fs } from "fs";
import path from "path";

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

const STORE_PATH =
  process.env.CASE_POLL_STORE_PATH ?? path.join(process.cwd(), "data", "case-polls.json");

let writeQueue: Promise<unknown> = Promise.resolve();
let canWriteFileStore = true;
let memoryStore: PollStore = emptyStore();

function emptyStore(): PollStore {
  return { polls: {} };
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
      updatedAt: new Date().toISOString(),
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

export async function getPollSnapshot(
  pollId: string,
  voterId?: string,
  optionIds?: string[]
): Promise<PollSnapshot> {
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
    poll.updatedAt = new Date().toISOString();

    await writeStore(store);

    return {
      accepted: true,
      snapshot: toSnapshot(poll, voterId),
    };
  });
}
