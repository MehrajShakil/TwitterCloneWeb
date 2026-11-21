"use client";

// One suggested user with its own Follow button (local state).
import { useState } from "react";
import styles from "./Trends.module.css";

export default function FollowItem({ user }) {
  const [following, setFollowing] = useState(false);

  const initials = user.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <div className={styles.followItem}>
      <div className={styles.followAvatar}>{initials}</div>
      <div className={styles.followText}>
        <p className={styles.name}>{user.name}</p>
        <p className={styles.handle}>@{user.username}</p>
      </div>
      <button
        type="button"
        className={`${styles.followBtn} ${following ? styles.following : ""}`}
        onClick={() => setFollowing(!following)}
      >
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
}
