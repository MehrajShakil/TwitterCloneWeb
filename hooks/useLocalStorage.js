"use client";

import { useState, useEffect } from "react";

// Works like useState, but the value is saved in localStorage (class 28).
//
// Next.js difference: components are first rendered on the SERVER, where
// `localStorage` does not exist. If we read it during the first render, the
// server HTML and the browser HTML would differ (a "hydration mismatch").
// So we start with `initialValue`, then load the saved value after mount.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [loaded, setLoaded] = useState(false);

  // 1) after the first render in the browser: read the saved value
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from an external store on mount
      if (saved !== null) setValue(JSON.parse(saved));
    } catch {
      // storage blocked or bad JSON - keep initialValue
    }
    setLoaded(true);
  }, [key]);

  // 2) every time the value changes: save it
  //    (skipped until loaded, so we don't overwrite the saved value with initialValue)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or blocked - ignore
    }
  }, [key, value, loaded]);

  return [value, setValue];
}
