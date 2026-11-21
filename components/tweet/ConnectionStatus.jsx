"use client";

// Small badge next to "Home" that shows if the browser is online (class 28).
//
// Class 28 used useState(navigator.onLine) + useEffect listeners. On the server
// `navigator` doesn't exist, so here we use useSyncExternalStore - React's hook
// for subscribing to something outside React. It also lets us say what to show
// on the server (getServerSnapshot -> assume online).
import { useSyncExternalStore } from "react";
import styles from "./Feed.module.css";

function subscribe(callback) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  // cleanup: remove the listeners when the component is removed
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

const getSnapshot = () => navigator.onLine;
const getServerSnapshot = () => true;

export default function ConnectionStatus() {
  const online = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <span className={`${styles.status} ${online ? styles.online : styles.offline}`}>
      {online ? "🟢 Online" : "🔴 Offline"}
    </span>
  );
}
