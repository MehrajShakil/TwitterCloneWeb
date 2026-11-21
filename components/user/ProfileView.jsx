"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useTweets } from "@/hooks/useTweets";
import UserAvatar from "./UserAvatar";
import Tweet from "@/components/tweet/Tweet";
import styles from "./Profile.module.css";

export default function ProfileView() {
  const { user } = useAuth();
  const { tweets, toggleLike, deleteTweet } = useTweets();

  const myTweets = tweets.filter((t) => t.isMine);
  const likesReceived = myTweets.reduce((sum, t) => sum + t.likes, 0);
  const joined = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <section className={styles.card}>
        <div className={styles.cover} />
        <div className={styles.headerRow}>
          <div className={styles.avatarRing}>
            <UserAvatar user={user} size={96} />
          </div>
          <Link href="/settings#profile" className={styles.editBtn}>
            Edit profile
          </Link>
        </div>

        <h1 className={styles.name}>{user.name}</h1>
        <p className={styles.handle}>@{user.username}</p>
        {user.bio && <p className={styles.bio}>{user.bio}</p>}
        <p className={styles.meta}>📅 Joined {joined}</p>

        <div className={styles.stats}>
          <span>
            <strong>{myTweets.length}</strong> Tweets
          </span>
          <span>
            <strong>{likesReceived}</strong> Likes received
          </span>
        </div>
      </section>

      <h2 className={styles.sectionTitle}>Your tweets</h2>
      {myTweets.length === 0 ? (
        <p className={styles.empty}>
          You haven&apos;t tweeted yet. <Link href="/home">Write your first one ✍️</Link>
        </p>
      ) : (
        myTweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} onLike={toggleLike} onDelete={deleteTweet} />
        ))
      )}
    </>
  );
}
