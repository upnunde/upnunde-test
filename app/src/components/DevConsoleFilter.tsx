"use client";

import { useEffect } from "react";

const BLOCKED_DYNAMIC_API_ERRORS = [
  "params are being enumerated. `params` is a Promise and must be unwrapped with `React.use()` before accessing its properties.",
  "The keys of `searchParams` were accessed directly. `searchParams` is a Promise and must be unwrapped with `React.use()` before accessing its properties.",
];

/** Cursor IDE 미리보기가 DOM에 주입하는 속성 — hydration 경고 노이즈 */

export default function DevConsoleFilter() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const originalConsoleError = window.console.error;

    window.console.error = (...args: unknown[]) => {
      const hasBlockedMessage = args.some((arg) => {
        if (typeof arg !== "string") return false;
        return BLOCKED_DYNAMIC_API_ERRORS.some((blocked) => arg.includes(blocked));
      });

      if (hasBlockedMessage) {
        return;
      }

      const joinedText = args
        .filter((arg): arg is string => typeof arg === "string")
        .join("\n");
      if (
        joinedText.includes("data-cursor-element-id") &&
        (joinedText.includes("hydration") || joinedText.includes("hydrated"))
      ) {
        return;
      }

      originalConsoleError(...args);
    };

    return () => {
      window.console.error = originalConsoleError;
    };
  }, []);

  return null;
}
