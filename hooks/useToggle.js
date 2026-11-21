"use client";

import { useState } from "react";

// [value, toggle]: call toggle() to flip true <-> false
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  function toggle() {
    setValue((prev) => !prev);
  }

  return [value, toggle];
}
