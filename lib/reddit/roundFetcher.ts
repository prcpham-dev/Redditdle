import { RoundData } from "@/types/types";

/** Initial number of rounds to load before the game starts. */
export const BATCH_SIZE = 5;

/** Total rounds for a non-endless game. */
export const TOTAL_ROUNDS = 10;

export interface FetchRoundBatchOptions {
  /** Ordered subreddit candidates. Single-item = custom sub. Multiple = pool. */
  subreddits: string[];
  /** How many rounds to fetch in this batch. */
  count: number;
  /** Round number to start from (1-based). Used for seeding + round labels. */
  startRound: number;
  /** Pre-built query string e.g. "minUpvotes=1000&maxUpvotes=1000000" */
  limitsQuery: string;
  /** Base seed — each round uses seed + roundNumber for determinism. */
  seed: number;
  /** Post IDs already used in this game — excluded to prevent repeats. */
  usedPostIds?: Set<string>;
}

/**
 * Fetches a batch of game rounds from the /api/round backend.
 *
 * Strategy:
 * - Single subreddit: one request with count > 1 (efficient).
 * - Multi-subreddit pool: one request per subreddit, with fallback to next candidate.
 *
 * Seeds are deterministic: round N always uses `seed + N` so replaying the same
 * seed always produces the same posts in the same order.
 */
export async function fetchRoundBatch({
  subreddits,
  count,
  startRound,
  limitsQuery,
  seed,
  usedPostIds = new Set(),
}: FetchRoundBatchOptions): Promise<RoundData[]> {
  const excludeParam =
    usedPostIds.size > 0
      ? `&excludePostIds=${encodeURIComponent([...usedPostIds].join(","))}`
      : "";

  // ── Single subreddit: bulk fetch ─────────────────────────────────────────
  if (subreddits.length === 1) {
    const sub = subreddits[0];
    const roundSeed = seed + startRound;
    const url = `/api/round?subreddit=${encodeURIComponent(sub)}&count=${count}&round=${startRound}&${limitsQuery}&seed=${roundSeed}${excludeParam}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(
        typeof data.error === "string"
          ? data.error
          : `Failed to fetch rounds for r/${sub}.`
      );
    }

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(`No rounds returned for r/${sub}.`);
    }

    // Re-index rounds from startRound
    return data.slice(0, count).map((r, i) => ({
      ...r,
      round: startRound + i,
    })) as RoundData[];
  }

  // ── Multi-subreddit pool: sequential with fallbacks ──────────────────────
  const payload: RoundData[] = [];
  let candidateIndex = 0;

  while (payload.length < count && candidateIndex < subreddits.length) {
    const roundNumber = startRound + payload.length;
    const sub = subreddits[(candidateIndex) % subreddits.length];
    candidateIndex++;

    const roundSeed = seed + roundNumber;
    const url = `/api/round?subreddit=${encodeURIComponent(sub)}&round=${roundNumber}&${limitsQuery}&seed=${roundSeed}${excludeParam}`;

    try {
      const res = await fetch(url);
      if (!res.ok) continue;

      const data = await res.json();
      if (data.error || !Array.isArray(data) || !data[0]) continue;

      payload.push({ ...(data[0] as RoundData), round: roundNumber });
    } catch {
      // Try next candidate subreddit
    }
  }

  if (payload.length < count) {
    throw new Error(
      `Could only build ${payload.length} of ${count} rounds. Try lowering upvote filters.`
    );
  }

  return payload;
}
