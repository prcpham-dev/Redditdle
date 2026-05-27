# 🟠 Upvotedle

> A high-fidelity, Higher-or-Lower style trivia game built on the Reddit Developer Platform (Devvit). Guess which post has the upper hand in upvotes!

---

## Inspiration

*Upvotedle* is inspired by the viral sensation *The Higher Lower Game* (which compares Google search trends), combined with the engaging, diverse, and often unpredictable world of Reddit. Reddit is a treasure trove of content—ranging from heartwarming dog photos to controversial tech discussions—where a post's score represents the collective reaction of millions of users. We wondered: *How well do Redditors actually know what makes a post explode?* Upvotedle turns Reddit's upvote metric into a fast-paced, addictive trivia game that lets users test their intuition on post popularity.

## What it does

Upvotedle pits two posts from the same subreddit against each other and asks: **Which post has more upvotes?**

- **Daily Puzzle Mode**: Each day, a fresh 10-round challenge is generated across a curated set of popular subreddits (e.g., `r/gaming`, `r/AskReddit`, `r/todayilearned`, `r/showerthoughts`). The daily challenge is deterministic—every player on Reddit gets the same set of posts and can compare their scores.
- **Custom Game Mode**: Players can input any public subreddit (e.g., `r/memes`, `r/aww`) and an optional seed to play a customized game.
- **Dynamic Scoring & Feedback**: When a user selects a card, the real upvote count is revealed using a smooth count-up animation. Visual cues indicate whether the guess was correct (green) or wrong (red), accompanied by post metadata (author, post date, and a handy permalink copy button to view the post live on Reddit).
- **Responsive Layout**: Designed to look stunning on both desktop (side-by-side post comparisons) and mobile (stacked post cards).

## How we built it

Upvotedle is built entirely on the modern Devvit tech stack, combining Reddit's platform-native capabilities with robust web technology:

- **Client & UI**: Built with **React 19** and **Vite**, utilizing custom CSS Modules for premium micro-animations (e.g., card hover lifts, spin loaders, fade-ins, and score count-up animations) combined with **TailwindCSS v4** for clean utility layout styles.
- **Backend Routing**: Runs a lightweight **Hono** router in the Devvit server context to cleanly separate API endpoints for daily crawls, custom round generation, and moderator tools.
- **State & Caching (Redis)**: Uses Devvit's integrated **Redis** store to cache the pre-calculated daily puzzle.
- **Cron Jobs**: Utilizes Devvit's **Scheduler API** to run a background crawler (`daily-crawl`) every day at 12:00 AM UTC. It shuffles the subreddit pool using seeded random numbers, fetches eligible posts, pairs them up, and updates the cached puzzle while automatically pruning historical keys older than 48 hours.
- **Deterministic Shuffling**: Utilizes a seeded pseudorandom number generator (PRNG) to ensure that round generation is entirely reproducible given a seed.

## Challenges we ran into

- **Reddit API Rate Limits & Cold Starts**: Fetching high-upvote posts on-demand for every player created latency and hit rate limits. We solved this by implementing the background Redis caching worker for the Daily Puzzle, drastically reducing external API dependency.
- **Niche/Small Subreddit Scarcity**: When players entered a custom subreddit with very few highly-upvoted posts, our initial filter (requiring posts to have >1000 upvotes) failed. We designed a **tiered fallback system** (1000 → 500 → 0 upvotes) that automatically degrades the upvote floor so the game remains fully playable.
- **Deduplication**: Ensuring that posts are never repeated in the same round, or across subsequent rounds in the same session, required keeping track of used post IDs throughout the game state.
- **Webview Iframe Sandbox Restrictions**: Copying post permalinks to the user's clipboard is usually straightforward, but webview iframe sandboxes block standard clipboard APIs. We had to write a fallback copy mechanism using a temporary off-screen `<textarea>` selection.

## Accomplishments that we're proud of

- **Polished UX/UI**: The interface feels incredibly premium, utilizing custom ease-out-expo count-up animations for scores, beautiful skeletons, and smooth card transition animations.
- **Automated Caching Architecture**: Creating a fully self-healing scheduler that crawls, stores, and prunes daily game puzzles without any manual intervention.
- **Flexible Playlists**: Supporting both daily curated challenges and highly custom, seeded playlists.
- **Robust Error Tolerances**: Handling API limits and post scarcities gracefully without ever crashing the user experience.

## What we learned

- How to design around the constraints of the Devvit platform, including context boundaries and state synchronization.
- Best practices for seeded randomness to guarantee deterministic random shuffling.
- Managing responsive design patterns for game interactions where layout direction (row vs. column) shifts dramatically between desktop and mobile.

## What's next for Upvotedle

- **Endless Mode**: Fully polish and unlock the infinite survival mode where you play until you make a single incorrect guess.
- **Global Leaderboards**: Integrate Reddit username tracking with Redis sorted sets to showcase daily and endless high scores.
- **Interactive Duels**: Enable real-time or asynchronous multiplayer matchups where players compete on the same deck of cards.
- **Rich Media Playback**: Render inline video players and interactive image gallery carousels directly inside the post cards.

---

## Tech Stack

- [Devvit](https://developers.reddit.com/): Reddit developer platform for building app extensions
- [Vite](https://vite.dev/): For compiling the webview client
- [React](https://react.dev/): For building the UI components
- [Hono](https://hono.dev/): For backend routing logic
- [TailwindCSS v4](https://tailwindcss.com/): For layout styles
- [TypeScript](https://www.typescriptlang.org/): For type safety

---

## Getting Started

> Make sure you have Node 22 downloaded on your machine before running!

1. Clone this repository
2. Run `npm install` to download dependencies
3. Copy the command on the success page into your terminal
4. Run `npm run login` to sign in with your Reddit account

## Commands

- `npm run dev`: Starts a development server where you can develop your application live on Reddit.
- `npm run build`: Builds your client and server projects.
- `npm run deploy`: Uploads a new version of your app.
- `npm run launch`: Publishes your app for review.
- `npm run login`: Logs your CLI into Reddit.
- `npm run type-check`: Type checks, lints, and prettifies your app.

---

## Authors

Created with ❤️ by **Percy Pham**, **Minh Pham**, and **Danny Pham**.
