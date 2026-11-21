import Feed from "@/components/tweet/Feed";

export const metadata = {
  title: "Home",
};

// Server Component shell. Tweets come from localStorage (useTweets hook inside
// <Feed />), seeded from data/data.js the first time.
export default function HomePage() {
  return <Feed />;
}
