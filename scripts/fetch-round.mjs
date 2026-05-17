/**
 * CLI: node scripts/fetch-round.mjs gaming
 * Fetches a random pair of posts and prints game-engine JSON.
 */

const USER_AGENT = "redditdle:1.0.0 (by /u/redditdle-hackathon)";

const MEDIA_POST_HINTS = new Set(["hosted:video", "rich:video", "gallery"]);

const BLOCKED_DOMAINS = new Set([
  "v.redd.it",
  "i.imgur.com",
  "imgur.com",
  "gfycat.com",
  "redgifs.com",
  "streamable.com",
]);

const IMAGE_URL_PATTERN = /\.(jpe?g|png|gif|webp|bmp)(\?.*)?$/i;

function decodeRedditUrl(url) {
  return url.replace(/&amp;/g, "&");
}

function isImageOnlyPost(post) {
  if (post.is_video || post.is_gallery || post.gallery_data) return false;
  if (post.post_hint === "hosted:video" || post.post_hint === "rich:video") {
    return false;
  }
  if (post.post_hint === "image") return true;
  if (
    post.domain?.toLowerCase() === "i.redd.it" &&
    post.url &&
    IMAGE_URL_PATTERN.test(post.url)
  ) {
    return true;
  }
  if (
    !post.is_self &&
    post.url &&
    IMAGE_URL_PATTERN.test(post.url) &&
    !(post.selftext?.trim())
  ) {
    return true;
  }
  return false;
}

function getPostImageUrl(post) {
  const candidates = [
    post.url_overridden_by_dest,
    post.url,
    post.preview?.images?.[0]?.source?.url,
    post.preview?.images?.[0]?.resolutions?.slice(-1)[0]?.url,
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const decoded = decodeRedditUrl(candidate);
    if (IMAGE_URL_PATTERN.test(decoded) || decoded.includes("i.redd.it")) {
      return decoded;
    }
  }
  return undefined;
}

function toRoundPost(post) {
  const roundPost = {
    title: post.title.trim(),
    upvotes: post.ups ?? post.score ?? 0,
    body: (post.selftext ?? "").trim(),
  };
  const image = getPostImageUrl(post);
  if (image) roundPost.image = image;
  return roundPost;
}

function normalizeSubreddit(subreddit) {
  return subreddit.replace(/^\/?r\//i, "").trim();
}

function formatSubreddit(subreddit) {
  return `r/${normalizeSubreddit(subreddit)}`;
}

function isDeletedOrRemoved(post) {
  const title = post.title?.trim() ?? "";
  if (
    title === "[removed]" ||
    title === "[deleted]" ||
    /^removed$/i.test(title)
  ) {
    return true;
  }
  if (post.author === "[deleted]" || post.author === "AutoModerator") {
    return true;
  }
  if (post.removed_by_category) return true;
  const body = post.selftext?.trim() ?? "";
  if (body === "[removed]" || body === "[deleted]") return true;
  return false;
}

function isMediaHeavy(post) {
  if (isImageOnlyPost(post)) return false;
  if (post.is_video || post.is_gallery) return true;
  if (post.gallery_data || post.media) return true;
  if (post.post_hint && MEDIA_POST_HINTS.has(post.post_hint)) return true;
  const domain = post.domain?.toLowerCase() ?? "";
  if (domain && BLOCKED_DOMAINS.has(domain)) return true;
  if (post.url && IMAGE_URL_PATTERN.test(post.url) && domain !== "i.redd.it") {
    return true;
  }
  return false;
}

function isEligiblePost(post) {
  if (!post.title?.trim()) return false;
  if (post.stickied) return false;
  if (post.over_18 || isDeletedOrRemoved(post) || isMediaHeavy(post)) {
    return false;
  }
  return true;
}

function pickRandom(items, count) {
  const pool = [...items];
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(Math.random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

async function fetchGameRound(subreddit, round = 1) {
  const name = normalizeSubreddit(subreddit);
  const url = `https://www.reddit.com/r/${name}/hot.json?limit=100&raw_json=1`;
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Reddit request failed (${response.status})`);
  }
  const json = await response.json();
  const posts = json.data.children.map((c) => c.data);
  const eligible = posts.filter(isEligiblePost);
  if (eligible.length < 2) {
    throw new Error(`Not enough eligible posts (found ${eligible.length})`);
  }
  const [postA, postB] = pickRandom(eligible, 2);
  return [
    {
      round,
      subreddit: formatSubreddit(subreddit),
      postA: toRoundPost(postA),
      postB: toRoundPost(postB),
    },
  ];
}

const subreddit = process.argv[2];
if (!subreddit) {
  console.error("Usage: node scripts/fetch-round.mjs <subreddit>");
  process.exit(1);
}

fetchGameRound(subreddit)
  .then((payload) => console.log(JSON.stringify(payload, null, 2)))
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
