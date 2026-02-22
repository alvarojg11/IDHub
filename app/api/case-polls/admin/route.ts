import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

import { casePollsStorageMode, getCasePollsForAdmin } from "@/lib/casePollStore";
import { CASES } from "@/lib/cases/registry";

export const runtime = "nodejs";

function authorized(request: NextRequest) {
  const expected = process.env.SUBSCRIPTIONS_NOTIFY_SECRET;
  if (!expected) return false;
  return request.headers.get("x-notify-secret") === expected;
}

type CasePollMeta = {
  caseSlug: string | null;
  caseTitle: string | null;
};

async function buildPollToCaseMap(): Promise<Map<string, CasePollMeta>> {
  const map = new Map<string, CasePollMeta>();

  await Promise.all(
    CASES.map(async (c) => {
      const file = path.join(process.cwd(), "app", "cases", c.slug, "page.mdx");
      try {
        const raw = await fs.readFile(file, "utf8");
        const matches = raw.matchAll(/pollId="([^"]+)"/g);
        for (const match of matches) {
          const pollId = match[1]?.trim();
          if (!pollId) continue;
          map.set(pollId, {
            caseSlug: c.slug,
            caseTitle: c.title,
          });
        }
      } catch {
        // ignore unreadable/missing case files
      }
    })
  );

  return map;
}

function inferCaseFromPollId(pollId: string): CasePollMeta {
  const stripped = pollId.replace(/^case-/, "");
  const knownSuffixes = ["-q1", "-q2", "-q3", "-q4", "-dx", "-tx"];
  let base = stripped;
  for (const s of knownSuffixes) {
    if (base.endsWith(s)) {
      base = base.slice(0, -s.length);
      break;
    }
  }
  return {
    caseSlug: null,
    caseTitle: base ? `Inferred: ${base}` : null,
  };
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Pass x-notify-secret header." },
      { status: 401 }
    );
  }

  const pollIdContains = (request.nextUrl.searchParams.get("q") ?? "").trim();

  try {
    const pollCaseMap = await buildPollToCaseMap();
    const items = await getCasePollsForAdmin({
      pollIdContains: pollIdContains || undefined,
    });
    const enriched = items.map((item) => {
      const match = pollCaseMap.get(item.pollId) ?? inferCaseFromPollId(item.pollId);
      return {
        ...item,
        caseSlug: match.caseSlug,
        caseTitle: match.caseTitle,
      };
    });

    return NextResponse.json({
      ok: true,
      storage: casePollsStorageMode(),
      filter: { q: pollIdContains },
      summary: {
        polls: enriched.length,
        totalVotes: enriched.reduce((sum, i) => sum + i.totalVotes, 0),
        uniqueIdentifiedVoters: enriched.reduce((sum, i) => sum + i.uniqueIdentifiedVoters, 0),
      },
      polls: enriched,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected server error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
