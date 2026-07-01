"use client";

import { useCallback, useEffect, useState } from "react";
import {
  applyThemeMode,
  persistThemeMode,
  readStoredThemeMode,
  type ThemeMode,
} from "@/lib/theme-mode";

export function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = readStoredThemeMode();
    setMode(stored);
    applyThemeMode(stored);
    setMounted(true);
  }, []);

  const setThemeMode = useCallback((next: ThemeMode) => {
    setMode(next);
    applyThemeMode(next);
    persistThemeMode(next);
  }, []);

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next: ThemeMode = prev === "dark" ? "light" : "dark";
      applyThemeMode(next);
      persistThemeMode(next);
      return next;
    });
  }, []);

  return { mode, mounted, setThemeMode, toggle };
}
