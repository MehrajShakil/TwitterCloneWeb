"use client";

// Main section of /home. The tweet list + add/like/delete now live in the
// useTweets() hook (shared with /profile); Feed only handles search + layout.
import { useState, useEffect, useMemo } from "react";
import { useTweets } from "@/hooks/useTweets";
import NewTweet from "./NewTweet";
import Tweet from "./Tweet";
import ConnectionStatus from "./ConnectionStatus";
import UserToolbar from "@/components/user/UserToolbar";
import styles from "./Feed.module.css";

export default function Feed() {
  const { tweets, addTweet, toggleLike, deleteTweet } = useTweets();
  const [search, setSearch] = useState("");

  // keep the tab title in sync with the number of tweets
  useEffect(() => {
    document.title = `Home (${tweets.length}) / Tweetly`;
  }, [tweets]);

  const visibleTweets = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (query === "") return tweets;

    return tweets.filter(
      (t) => t.text.toLowerCase().includes(query) || t.name.toLowerCase().includes(query),
    );
  }, [tweets, search]);

  return (
    <>
      <div className={styles.feedHeader}>
        <h1 className={styles.feedTitle}>Home</h1>
        <div className={styles.headerRight}>
          <ConnectionStatus />
          <UserToolbar />
        </div>
      </div>

      <input
        className={styles.searchInput}
        placeholder="🔍 Search tweets"
        aria-label="Search tweets"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <NewTweet onAdd={addTweet} />

      {tweets.length === 0 && <p className={styles.emptyFeed}>No tweets yet. Write one! ✍️</p>}

      {tweets.length > 0 && visibleTweets.length === 0 && (
        <p className={styles.emptyFeed}>No tweets match &quot;{search}&quot; 🤷</p>
      )}

      {visibleTweets.map((tweet, index) => (
        <Tweet
          key={tweet.id}
          tweet={tweet}
          onLike={toggleLike}
          onDelete={deleteTweet}
          eager={index === 0} // first tweet is visible right away - don't lazy-load its image
        />
      ))}
    </>
  );
}
