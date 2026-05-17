import { fetchGameRound, fetchMultipleGameRounds } from "@/lib/reddit";
import {
  parseExcludePostIds,
  parseMaxUpvotes,
  parseMinUpvotes,
} from "@/lib/reddit/parseMaxUpvotes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const subreddit = searchParams.get("subreddit");

  if (!subreddit?.trim()) {
    return NextResponse.json(
      { error: "Query parameter `subreddit` is required (e.g. gaming or r/gaming)" },
      { status: 400 },
    );
  }

  const roundParam = searchParams.get("round");
  const round = roundParam ? Number.parseInt(roundParam, 10) : 1;
  const countParam = searchParams.get("count");
  const count = countParam ? Number.parseInt(countParam, 10) : 1;
  const sort = searchParams.get("sort") as
    | "hot"
    | "new"
    | "top"
    | "rising"
    | null;
  const maxUpvotes = parseMaxUpvotes(searchParams.get("maxUpvotes"));
  const minUpvotes = parseMinUpvotes(searchParams.get("minUpvotes"));
  const excludePostIds = parseExcludePostIds(
    searchParams.get("excludePostIds"),
  );

  const seedParam = searchParams.get("seed");
  const parsedSeed = seedParam ? Number.parseInt(seedParam, 10) : NaN;
  const seed = Number.isFinite(parsedSeed) ? parsedSeed : undefined;

  const roundOptions = {
    round: Number.isFinite(round) ? round : 1,
    maxUpvotes,
    minUpvotes,
    excludePostIds,
    ...(seed !== undefined ? { seed } : {}),
    ...(sort ? { sort } : {}),
  };

  try {
    const payload =
      Number.isFinite(count) && count > 1
        ? await fetchMultipleGameRounds(subreddit, count, roundOptions)
        : await fetchGameRound(subreddit, roundOptions);
    return NextResponse.json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to build game round";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
