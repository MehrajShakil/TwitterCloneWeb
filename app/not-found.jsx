import Link from "next/link";

// Shown for any URL that doesn't match a route.
export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <h1 style={{ marginBottom: 12 }}>Page not found</h1>
      <p style={{ marginBottom: 20, color: "var(--text-muted)" }}>
        This page doesn&apos;t exist on Tweetly.
      </p>
      <Link href="/home" style={{ color: "var(--primary)", fontWeight: 700 }}>
        Go to Home
      </Link>
    </div>
  );
}
