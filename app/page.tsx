"use client";

import React, { useState } from "react";
import GameSetup from "@/components/GameSetup/GameSetup";
import GameBoard from "@/components/GameBoard/GameBoard";
import { RoundData } from "@/types/types";

export default function Home() {
  const [gameState, setGameState] = useState<"setup" | "loading" | "playing" | "error">("setup");
  const [rounds, setRounds] = useState<RoundData[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleStartGame = async (subreddit: string) => {
    setGameState("loading");
    setErrorMessage("");

    try {
      const response = await fetch(`https://www.reddit.com/r/${subreddit}/top.json?t=month&limit=25`);
      if (!response.ok) {
        throw new Error("Failed to fetch subreddit data. Please check the spelling.");
      }

      const json = await response.json();
      const posts = json.data.children;

      if (posts.length < 2) {
        throw new Error("Not enough posts found in this subreddit.");
      }

      const validPosts = posts.filter((p: any) => !p.data.stickied && p.data.title);

      const numRounds = Math.floor(validPosts.length / 2);

      if (numRounds === 0) {
        throw new Error("Not enough valid posts found.");
      }

      const shuffledPosts = [...validPosts].sort(() => 0.5 - Math.random());

      const generatedRounds: RoundData[] = [];

      const maxRounds = Math.min(10, numRounds);

      for (let i = 0; i < maxRounds; i++) {
        const postAData = shuffledPosts[i * 2].data;
        const postBData = shuffledPosts[i * 2 + 1].data;

        generatedRounds.push({
          round: i + 1,
          subreddit: `r/${subreddit}`,
          postA: {
            title: postAData.title,
            upvotes: postAData.score,
          },
          postB: {
            title: postBData.title,
            upvotes: postBData.score,
          }
        });
      }

      setRounds(generatedRounds);
      setGameState("playing");

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred.");
      setGameState("error");
    }
  };

  const handlePlayAgain = () => {
    setGameState("setup");
    setRounds([]);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {gameState === "setup" && <GameSetup onStart={handleStartGame} />}

      {gameState === "loading" && (
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#ff4500] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-xl text-gray-300">Fetching Reddit Posts...</p>
        </div>
      )}

      {gameState === "error" && (
        <div className="flex flex-col items-center justify-center max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400 mb-8">{errorMessage}</p>
          <button
            onClick={handlePlayAgain}
            className="px-6 py-3 bg-[#ff4500] text-white font-bold rounded-lg hover:bg-[#ff5722]"
          >
            Try Again
          </button>
        </div>
      )}

      {gameState === "playing" && (
        <GameBoard rounds={rounds} onPlayAgain={handlePlayAgain} />
      )}
    </main>
  );
}
