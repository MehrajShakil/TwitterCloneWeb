"use client";

// One tweet card. Likes and delete are handled by the parent (Feed);
// retweet is local state that only this card cares about.
import { useState } from "react";
import Image from "next/image";
import UserAvatar from "@/components/user/UserAvatar";
import styles from "./Tweet.module.css";

export default function Tweet({ tweet, onLike, onDelete, eager = false }) {
  const [retweeted, setRetweeted] = useState(false);

  const retweetCount = tweet.retweets + (retweeted ? 1 : 0); // derived value

  return (
    <article className={styles.tweet}>
      <UserAvatar user={tweet} />

      <div className={styles.tweetContent}>
        <p>
          <span className={styles.name}>{tweet.name}</span>{" "}
          <span className={styles.handle}>{tweet.handle}</span>
        </p>
        <p className={styles.tweetText}>{tweet.text}</p>

        {tweet.image && (
          <Image
            src={tweet.image.src}
            width={tweet.image.width}
            height={tweet.image.height}
            alt="Tweet image"
            className={styles.tweetImage}
            sizes="(max-width: 1000px) 100vw, 500px"
            loading={eager ? "eager" : "lazy"}
          />
        )}

        <div className={styles.tweetActions}>
          <span>💬 {tweet.replies}</span>

          <button
            type="button"
            className={retweeted ? styles.retweeted : ""}
            onClick={() => setRetweeted(!retweeted)}
            aria-pressed={retweeted}
          >
            🔁 {retweetCount}
          </button>

          <button
            type="button"
            className={tweet.liked ? styles.liked : ""}
            onClick={() => onLike(tweet.id)}
            aria-pressed={tweet.liked}
          >
            {tweet.liked ? "❤️" : "🤍"} {tweet.likes}
          </button>

          {/* only the author can delete their own tweet */}
          {tweet.isMine && (
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={() => onDelete(tweet.id)}
              aria-label="Delete tweet"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
