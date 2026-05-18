# Redditdle 🎮

Redditdle is a sleek, dynamic **Higher-Lower** game built for Reddit posts. Players are presented with two different Reddit posts side-by-side (or top-and-bottom on mobile) and must guess which post has a higher upvote count.

---

## 🕹️ Core Game Mechanics

*   **Higher / Lower Guessing**: Compare two Reddit posts (titles, authors, and images if available) and tap on the card you believe has more upvotes.
*   **Daily Puzzle**: Play a pre-selected 10-round set that resets daily. Every user globally gets the exact same set of challenges each day to compete for the best score.
*   **Custom Games**:
    *   **Custom Subreddit**: Test your knowledge of specific communities (e.g., `r/BeAmazed`, `r/CrappyDesign`, or `r/mildlyinteresting`).
    *   **Deterministic Seeding**: Enter a custom seed to generate a repeatable set of rounds. Share your seed with friends to see who can get the higher score on the same challenges!
    *   **Endless Mode**: Play infinitely until you make a single wrong guess.
*   **Upvote Limits**: Customize the game's difficulty by configuring the minimum and maximum upvote thresholds in the settings dashboard.

---

## 📁 Codebase Structure

The project is built using **Next.js (App Router)**, **TypeScript**, and modular **Vanilla CSS**.

```text
├── app/
│   ├── api/
│   │   ├── daily/           # Handles the daily puzzle server-side logic
│   │   └── round/           # Fetches and processes individual game rounds
│   ├── page.tsx             # Main client entry point and game setup control flow
│   └── layout.tsx           # Global HTML metadata and font loader
├── components/
│   ├── GameBoard/           # Manages round progression, prefetching, and game-over states
│   ├── GameSetup/           # The layout for selecting game modes, seeds, and subreddits
│   ├── PostCard/            # The visual card representing a single Reddit post
│   ├── RoundIndicator/      # Track correct/incorrect guesses across the 10 rounds
│   └── Settings/            # Custom slider to set upvote ranges (min/max upvotes)
├── lib/
│   ├── reddit/              # Main Reddit logic engine
│   │   ├── constants.ts     # Configurable thresholds and limit controls
│   │   ├── fetchDaily.ts    # Server-side selector for daily curated pools
│   │   ├── fetchRound.ts    # Fetch, filter, and structure raw Reddit JSON
│   │   ├── seededRandom.ts  # LCG-based random seed generator for repeatable games
│   │   ├── roundFetcher.ts  # Client-side helper that manages sequential round batching
│   │   └── types.ts         # Internal Reddit JSON parsing declarations
│   └── settings.ts          # LocalStorage wrappers for preserving user upvote configs
├── types/
│   └── types.ts             # Shared Game types (RoundData, GameRound, UpvoteLimits)
```

---

## 🛠️ Getting Started

### Prerequisites

*   Node.js (v18+ recommended)
*   npm or yarn

### Installation

1. Clone the repository and navigate into the directory:
   ```bash
   cd redditdle
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Spin up the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to start playing!
