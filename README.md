# 🟠 Upvotedle
A Higher-or-Lower style trivia game built on the Reddit Developer Platform (Devvit). Guess which post has the upper hand in upvotes! This helps users stay engaged and explore subreddits more deeply. It can also be used to determine which types of content receive the most engagement, as players only focus on the content itself.

## Inspiration
*Upvotedle* is inspired by the viral *Higher Lower Game*, which compares Google search trends. Reddit has all kinds of content where a post's score shows the reaction of millions of users. We wondered: how well do Redditors actually know what makes a post explode? Upvotedle turns Reddit's upvote counts into a fast, addictive trivia game that lets users test their instincts on post popularity.

## What it does
Upvotedle pits two posts from the same subreddit against each other and asks: **Which post has more upvotes?**

- **Daily Puzzle Mode**: Each day, a fresh 10-round challenge is generated across a curated set of popular subreddits (e.g., `r/gaming`, `r/AskReddit`, `r/todayilearned`, `r/showerthoughts`). Every player on Reddit gets the same set of posts and can compare their scores.

- **Custom Game Mode**: Players can input any public subreddit (e.g., `r/memes`, `r/aww`) and an optional seed to play a customized game of their own factorite subreddit.

## How we built it
Upvotedle is built entirely on the modern Devvit tech stack, combining Reddit's platform-native capabilities with robust web technology:

- **Client & UI**: Built with **React** and **Vite**, utilizing custom CSS Modules combined with **TailwindCSS**.
- **Backend Routing**: Runs a lightweight **Hono** router in the Devvit server context to cleanly separate API endpoints for daily crawls, custom round generation, and moderator tools.
- **State & Caching (Redis)**: Uses Devvit's integrated **Redis** store to cache the pre-calculated daily puzzle.
- **Cron Jobs**: Utilizes Devvit's **Scheduler API** to run a background crawler (`daily-crawl`) every day at 12:00 AM UTC. It shuffles the subreddit pool using seeded random numbers, fetches eligible posts, pairs them up, and updates the cached puzzle while automatically pruning historical keys older than 48 hours.

## Challenges we ran into
- **Reddit API Rate Limits & Cold Starts**: Fetching high-upvote posts on-demand for every player created latency and hit rate limits. We solved this by implementing the background Redis caching worker for the Daily Puzzle, drastically reducing external API dependency.
- **Niche/Small Subreddit**: When players entered a custom subreddit with very few highly-upvoted posts, our initial filter (requiring posts to have >1000 upvotes) failed. We designed a **tiered fallback system** (1000 → 500 → 0 upvotes) that automatically degrades the upvote floor so the game remains fully playable.
- **Duplication**: Ensuring that posts are never repeated in the same round, or across subsequent rounds in the same session, required keeping track of used post IDs throughout the game state.

## Accomplishments that we're proud of
- **Polished UX/UI**: The interface feels incredibly premium, utilizing custom ease-out-expo count-up animations for scores, beautiful skeletons, and smooth card transition animations.
- **Automated Caching Architecture**: Creating a fully self-healing scheduler that crawls, stores, and prunes daily game puzzles without any manual intervention.
- **Flexible Playlists**: Supporting both daily curated challenges and highly custom, seeded playlists.

## What we learned
- How to design around the constraints of the Devvit platform, including context boundaries and state synchronization.
- Best practices for seeded randomness to guarantee deterministic random shuffling.

## What's next for Upvotedle
- **Engagement Feedback**: Provides in-depth insights into the differences between actual upvotes and what people genuinely want to see, helping moderators better understand user preferences.
- **Endless Mode**: Fully polish and unlock the infinite survival mode, where you play until you make a single incorrect guess.
- **Global Leaderboards**: Integrate Reddit username tracking with Redis sorted sets to showcase daily and endless high scores.
- **Interactive Duels**: Enable real-time or asynchronous multiplayer matchups where players compete on the same deck of cards.
- **Engagement Feedback**: Provides in-depth insights into the differences between actual upvotes and what people genuinely want to see, helping moderators better understand user preferences.

## Authors
Created by **Percy Pham**, **Minh Pham**, and **Danny Pham**.
