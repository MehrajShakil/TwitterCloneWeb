import FollowItem from "./FollowItem";
import styles from "./Trends.module.css";

// Class 28 fetched users in the browser with useEffect + 3 pieces of state
// (users, loading, error). In Next.js this is an async SERVER Component:
// the fetch runs on the server, so no useEffect, no loading state, no `ignore` flag.
// Loading is handled by <Suspense> in RightColumn.js.
async function getUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users?_limit=3", {
    next: { revalidate: 3600 }, // cache the result, refresh at most once an hour
  });
  if (!res.ok) throw new Error("Could not load users");
  return res.json();
}

export default async function WhoToFollow() {
  let users = [];
  let error = null;

  try {
    users = await getUsers();
  } catch (err) {
    error = err.message;
  }

  return (
    <div className={`${styles.trendsCard} ${styles.followCard}`}>
      <h2>Who to follow</h2>

      {error && <p className={`${styles.followMessage} ${styles.error}`}>❌ {error}</p>}

      {users.map((user) => (
        <FollowItem key={user.id} user={user} />
      ))}
    </div>
  );
}
