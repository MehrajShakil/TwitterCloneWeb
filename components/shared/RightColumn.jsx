import { Suspense } from "react";
import Trends from "./Trends";
import WhoToFollow from "./WhoToFollow";
import styles from "./Trends.module.css";

// Right column. In class 28, Trends rendered <WhoToFollow /> inside itself.
// Here Trends is a Client Component (it uses useToggle) and WhoToFollow is an
// async Server Component - a Client Component can't import a Server Component,
// so this Server Component places them side by side instead.
export default function RightColumn() {
  return (
    <aside className={styles.trends}>
      <Trends />
      {/* Suspense shows the fallback while the server is still fetching users */}
      <Suspense
        fallback={
          <div className={`${styles.trendsCard} ${styles.followCard}`}>
            <h2>Who to follow</h2>
            <p className={styles.followMessage}>Loading...</p>
          </div>
        }
      >
        <WhoToFollow />
      </Suspense>
    </aside>
  );
}
