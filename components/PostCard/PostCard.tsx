"use client";

import React from "react";
import styles from "./PostCard.module.css";
import { Post } from "../../types/types";
import { ArrowUp } from "lucide-react";

interface PostCardProps {
  post: Post;
  onClick?: () => void;
  showUpvotes: boolean;
  status?: "winner" | "loser" | "none";
}

export default function PostCard({ post, onClick, showUpvotes, status = "none" }: PostCardProps) {

  const formatUpvotes = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  let cardClass = styles.card;
  if (showUpvotes) {
    if (status === "winner") cardClass += ` ${styles.winner}`;
    if (status === "loser") cardClass += ` ${styles.loser}`;
  }

  return (
    <div
      className={`${cardClass} flex flex-col`}
      onClick={onClick}
    >
      <h2 className={styles.title}>{post.title}</h2>

      <div className={`${styles.upvotesContainer} flex flex-col items-center justify-center`}>
        <p className={styles.upvoteLabel}>Upvotes</p>
        {showUpvotes ? (
          <div className="flex flex-row items-center justify-center gap-2">
            <ArrowUp size={32} color="#ff4500" />
            <span className={styles.upvoteCount}>{formatUpvotes(post.upvotes)}</span>
          </div>
        ) : (
          <span className={styles.hiddenCount}>???</span>
        )}
      </div>
    </div>
  );
}
