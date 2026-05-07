"use client";

import { useEffect } from "react";

const BLOCKED_DYNAMIC_API_ERRORS = [
  "params are being enumerated. `params` is a Promise and must be unwrapped with `React.use()` before accessing its properties.",
  "The keys of `searchParams` were accessed directly. `searchParams` is a Promise and must be unwrapped with `React.use()` before accessing its properties.",
];

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

      originalConsoleError(...args);
    };

    return () => {
      window.console.error = originalConsoleError;
    };
  }, []);

  return null;
}
