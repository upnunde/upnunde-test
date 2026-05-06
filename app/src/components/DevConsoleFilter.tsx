"use client";

import { useEffect } from "react";

const PARAMS_PROMISE_ENUMERATION_ERROR =
  "params are being enumerated. `params` is a Promise and must be unwrapped with `React.use()` before accessing its properties.";

export default function DevConsoleFilter() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const originalConsoleError = window.console.error;

    window.console.error = (...args: unknown[]) => {
      const firstArg = args[0];
      const message = typeof firstArg === "string" ? firstArg : "";

      if (message.includes(PARAMS_PROMISE_ENUMERATION_ERROR)) {
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
