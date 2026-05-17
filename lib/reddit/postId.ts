import type { RedditPostRaw, RoundPost } from "./types";

/** Stable id for deduping and exclusion (Reddit id or title+author fallback). */
export function getPostId(post: RedditPostRaw): string {
  if (post.id) {
    return post.id;
  }
  return `${post.title}\0${post.author}`;
}

export function collectPostIdsFromRound(round: {
  postA: RoundPost;
  postB: RoundPost;
}): string[] {
  return [round.postA.id, round.postB.id];
}

export function collectPostIdsFromRounds(
  rounds: Array<{ postA: RoundPost; postB: RoundPost }>,
): string[] {
  return rounds.flatMap(collectPostIdsFromRound);
}
