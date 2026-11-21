"use client";

import { trends } from "@/data/data";
import { useToggle } from "@/hooks/useToggle";
import TrendItem from "./TrendItem";
import styles from "./Trends.module.css";

// Trends card with "Show more / Show less" (class 28).
export default function Trends() {
  const [showAll, toggleShowAll] = useToggle(false);

  const visibleTrends = showAll ? trends : trends.slice(0, 2); // derived value

  return (
    <div className={styles.trendsCard}>
      <h2>Trending</h2>

      {visibleTrends.map((trend, index) => (
        <TrendItem key={trend.id} number={index + 1} trend={trend} />
      ))}

      {/* a <button> instead of <a href="#"> - no need for e.preventDefault() */}
      <button type="button" className={styles.trendMore} onClick={toggleShowAll}>
        {showAll ? "Show less" : "Show more"}
      </button>
    </div>
  );
}
