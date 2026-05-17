"use client";

import React, { useState } from "react";
import styles from "./GameBoard.module.css";
import { RoundData } from "../../types/types";
import PostCard from "../PostCard/PostCard";
import RoundIndicator, { RoundStatus } from "../RoundIndicator/RoundIndicator";

interface GameBoardProps {
  rounds: RoundData[];
  onPlayAgain: () => void;
}

export default function GameBoard({ rounds, onPlayAgain }: GameBoardProps) {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [roundStatuses, setRoundStatuses] = useState<RoundStatus[]>(
    new Array(rounds.length).fill("unplayed")
  );

  if (rounds.length === 0) {
    return <div>No rounds available.</div>;
  }

  const isGameOver = currentRoundIndex >= rounds.length;

  if (isGameOver) {
    const correctCount = roundStatuses.filter((s) => s === "correct").length;
    return (
      <div className={styles.gameOverContainer}>
        <h2 className={styles.gameOverTitle}>Game Over!</h2>
        <p className={styles.gameOverScore}>
          You got {correctCount} out of {rounds.length} correct.
        </p>
        <button onClick={onPlayAgain} className={styles.nextButton}>
          Play Again
        </button>
      </div>
    );
  }

  const currentRound = rounds[currentRoundIndex];
  const postA = currentRound.postA;
  const postB = currentRound.postB;

  const handleGuess = (selected: "A" | "B") => {
    if (hasGuessed) return;

    const selectedPost = selected === "A" ? postA : postB;
    const otherPost = selected === "A" ? postB : postA;

    const isCorrect = selectedPost.upvotes >= otherPost.upvotes;

    const newStatuses = [...roundStatuses];
    newStatuses[currentRoundIndex] = isCorrect ? "correct" : "wrong";
    setRoundStatuses(newStatuses);
    setHasGuessed(true);
  };

  const handleNextRound = () => {
    setHasGuessed(false);
    setCurrentRoundIndex(currentRoundIndex + 1);
  };

  const getPostStatus = (post: "A" | "B") => {
    if (!hasGuessed) return "none";
    const thisPost = post === "A" ? postA : postB;
    const otherPost = post === "A" ? postB : postA;

    if (thisPost.upvotes > otherPost.upvotes) return "winner";
    if (thisPost.upvotes < otherPost.upvotes) return "loser";
    return "winner"; // If tie, both are winners
  };

  return (
    <div className={`${styles.container} flex flex-col`}>
      <RoundIndicator rounds={roundStatuses} />

      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-400 mb-2">Round {currentRound.round}</h2>
        <p className="text-lg text-gray-500 mb-8">{currentRound.subreddit}</p>
      </div>

      {hasGuessed && (
        <div className={styles.resultText}>
          {roundStatuses[currentRoundIndex] === "correct" ? (
            <span className={styles.resultCorrect}>Correct!</span>
          ) : (
            <span className={styles.resultWrong}>Wrong!</span>
          )}
        </div>
      )}

      <div className={`${styles.cardsContainer} flex flex-col md:flex-row items-center justify-center`}>
        <PostCard
          post={postA}
          onClick={() => handleGuess("A")}
          showUpvotes={hasGuessed}
          status={getPostStatus("A")}
        />

        <div className={styles.vsText}>VS</div>

        <PostCard
          post={postB}
          onClick={() => handleGuess("B")}
          showUpvotes={hasGuessed}
          status={getPostStatus("B")}
        />
      </div>

      {hasGuessed && (
        <button onClick={handleNextRound} className={styles.nextButton}>
          Next Round
        </button>
      )}
    </div>
  );
}
