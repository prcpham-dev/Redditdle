import { DEFAULT_MAX_UPVOTES, DEFAULT_MIN_UPVOTES } from "./constants";
import {
  DAILY_ROUND_COUNT,
  selectDailySubreddits,
} from "./dailySubreddits";
import { fetchGameRound } from "./fetchRound";
import { dailyRoundSeed, getDailyDateKey } from "./seededRandom";
import type { FetchRoundOptions, GameRoundPayload } from "./types";

const EXPECTED_ROUNDS = DAILY_ROUND_COUNT;

/**
 * Builds today's full puzzle by fetching one round per configured subreddit.
 */
export async function fetchDailyPuzzle(
  options: Pick<FetchRoundOptions, "maxUpvotes" | "minUpvotes"> = {},
): Promise<GameRoundPayload> {
  const maxUpvotes = options.maxUpvotes ?? DEFAULT_MAX_UPVOTES;
  const minUpvotes = options.minUpvotes ?? DEFAULT_MIN_UPVOTES;
  const rounds = await Promise.all(
    DAILY_SUBREDDITS.map((subreddit, index) =>
      fetchGameRound(subreddit, {
        round: index + 1,
        sort: "hot",
        maxUpvotes,
        minUpvotes,
      }),
    ),
  const dateKey = getDailyDateKey();
  const subreddits = selectDailySubreddits(dateKey);
  const rounds = await Promise.all(
    subreddits.map((subreddit, index) => {
      const round = index + 1;
      return fetchGameRound(subreddit, {
        round,
        sort: "hot",
        maxUpvotes,
        seed: dailyRoundSeed(dateKey, subreddit, round),
      });
    }),
  );

  const payload = rounds.flat();

  if (payload.length !== EXPECTED_ROUNDS) {
    throw new Error(
      `Expected ${EXPECTED_ROUNDS} rounds but received ${payload.length}`,
    );
  }

  return payload;
}
