import { NextRequest, NextResponse } from "next/server";

import { castVote, getPollSnapshot } from "@/lib/casePollStore";

function clean(value: string | null | undefined, max = 120): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

function parseOptionIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, 32);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ pollId: string }> }
) {
  const { pollId: rawPollId } = await context.params;
  const pollId = clean(rawPollId);
  if (!pollId) {
    return NextResponse.json({ error: "Invalid pollId" }, { status: 400 });
  }

  const voterId = clean(request.nextUrl.searchParams.get("voterId"));
  const snapshot = await getPollSnapshot(pollId, voterId);
  return NextResponse.json(snapshot);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ pollId: string }> }
) {
  const { pollId: rawPollId } = await context.params;
  const pollId = clean(rawPollId);
  if (!pollId) {
    return NextResponse.json({ error: "Invalid pollId" }, { status: 400 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        optionId?: string;
        voterId?: string;
        optionIds?: string[];
      }
    | null;

  const optionId = clean(body?.optionId, 20);
  if (!optionId) {
    return NextResponse.json({ error: "optionId is required" }, { status: 400 });
  }

  const voterId = clean(body?.voterId);
  const optionIds = parseOptionIds(body?.optionIds);

  const result = await castVote({
    pollId,
    optionId,
    voterId,
    optionIds,
  });

  return NextResponse.json(result);
}
