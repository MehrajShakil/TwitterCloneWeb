"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import UserAvatar from "@/components/user/UserAvatar";
import styles from "./Tweet.module.css";

const MAX = 280;

export default function NewTweet({ onAdd }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const textareaRef = useRef(null); // will hold the real <textarea>

  // on mount: load the saved draft and put the cursor in the tweet box.
  // (class 28 read localStorage inside useState - that breaks on the server)
  useEffect(() => {
    const draft = localStorage.getItem("draft");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only storage on mount
    if (draft) setText(draft);
    textareaRef.current.focus();
  }, []);

  // save the draft 500ms after the user STOPS typing
  useEffect(() => {
    const timerId = setTimeout(() => {
      localStorage.setItem("draft", text);
    }, 500);
    return () => clearTimeout(timerId);
  }, [text]);

  const charsLeft = MAX - text.length;
  const isEmpty = text.trim() === "";

  function handleTweet() {
    if (isEmpty) return;
    onAdd(text.trim()); // tell the parent (Feed)
    setText("");
    textareaRef.current.focus(); // ready for the next tweet
  }

  // Ctrl + Enter (Cmd + Enter on Mac) posts the tweet
  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleTweet();
    }
  }

  return (
    <>
      <div className={styles.newTweet}>
        <UserAvatar user={user} />
        <textarea
          ref={textareaRef}
          placeholder="What's happening?"
          aria-label="What's happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={MAX}
        />
      </div>

      <div className={styles.newTweetFooter}>
        <span className={`${styles.charCount} ${charsLeft < 20 ? styles.warning : ""}`}>
          {charsLeft}
        </span>
        <button
          type="button"
          className={styles.tweetBtnSmall}
          onClick={handleTweet}
          disabled={isEmpty}
        >
          Tweet
        </button>
      </div>
    </>
  );
}
