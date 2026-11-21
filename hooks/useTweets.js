"use client";

// All tweet logic in one hook, so /home (Feed) and /profile share it.
//
// Each new tweet stores the author's id. When we show a tweet we look the author
// up again, so after a profile change (name, username, avatar) OLD tweets show
// the new details too. Likes are stored per user in `likedBy`.
import { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useAuth } from "@/components/auth/AuthProvider";
import { tweets as seedTweets } from "@/data/data";

export function useTweets() {
  const { user, users } = useAuth();
  const [tweets, setTweets] = useLocalStorage("tweets", seedTweets);

  // stored tweets -> what the UI shows
  const visible = useMemo(
    () =>
      tweets.map((t) => {
        const author = t.authorId ? users.find((u) => u.id === t.authorId) : null;
        const likedBy = t.likedBy ?? [];
        return {
          ...t,
          name: author?.name ?? t.name,
          handle: author ? `@${author.username}` : t.handle,
          avatar: author ? author.avatar : t.avatar,
          liked: Boolean(user) && likedBy.includes(user.id),
          isMine: Boolean(user) && t.authorId === user.id,
        };
      }),
    [tweets, users, user],
  );

  function addTweet(text) {
    const newTweet = {
      id: Date.now(),
      authorId: user.id,
      // copy of the author details, used only if the account no longer exists
      name: user.name,
      handle: `@${user.username}`,
      avatar: user.avatar,
      text,
      image: null,
      replies: 0,
      retweets: 0,
      likes: 0,
      likedBy: [],
    };
    setTweets((prev) => [newTweet, ...prev]); // ADD to the top
  }

  function toggleLike(id) {
    setTweets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const likedBy = t.likedBy ?? [];
        const liked = likedBy.includes(user.id);
        return {
          ...t,
          likedBy: liked ? likedBy.filter((uid) => uid !== user.id) : [...likedBy, user.id],
          likes: t.likes + (liked ? -1 : 1),
        };
      }),
    ); // UPDATE one
  }

  function deleteTweet(id) {
    // only the author may delete
    setTweets((prev) => prev.filter((t) => !(t.id === id && t.authorId === user.id))); // REMOVE one
  }

  return { tweets: visible, addTweet, toggleLike, deleteTweet };
}
