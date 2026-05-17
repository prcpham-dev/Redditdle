"use client";

import React, { useState } from "react";
import styles from "./GameSetup.module.css";
import { Play } from "lucide-react";

interface GameSetupProps {
  onStart: (subreddit: string) => void;
}

export default function GameSetup({ onStart }: GameSetupProps) {
  const [subreddit, setSubreddit] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subreddit.trim()) {
      onStart(subreddit.trim());
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Redditdle</h1>
      <p className={styles.subtitle}>Which post has more upvotes?</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          value={subreddit}
          onChange={(e) => setSubreddit(e.target.value)}
          placeholder="Enter a subreddit (e.g., memes)"
          className={styles.input}
          required
        />
        
        <button 
          type="submit" 
          className={`${styles.button} flex flex-row items-center justify-center`}
          disabled={!subreddit.trim()}
        >
          <span>Start Game</span>
          {/* We use Tailwind inline styles for small positioning, but mainly for flex */}
          <span style={{ marginLeft: '8px' }}>
            <Play size={20} />
          </span>
        </button>
      </form>
    </div>
  );
}
