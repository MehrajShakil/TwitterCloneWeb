import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

// Root layout: wraps EVERY route in the app (login + home).
// `title.template` lets each page set just its own name, e.g. "Home" -> "Home / Tweetly".
export const metadata = {
  title: {
    template: "%s / Tweetly",
    default: "Tweetly",
  },
  description: "Tweetly - a Twitter-like app built with Next.js (migrated from class 08 & class 11).",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* AuthProvider is here (not in a group layout) so login AND home can use useAuth() */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
