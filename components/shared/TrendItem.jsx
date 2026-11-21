import styles from "./Trends.module.css";

export default function TrendItem({ number, trend }) {
  return (
    <a className={styles.trendItem} href="#">
      <p className={styles.trendNumber}>{number}</p>
      <div>
        <p className={styles.trendCategory}>{trend.category}</p>
        <p className={styles.trendName}>{trend.name}</p>
        <p className={styles.trendCount}>{trend.count}</p>
      </div>
    </a>
  );
}
