import {
  APP_BROWSER_BG_CANVAS_THEME_COLOR_DARK,
  APP_BROWSER_BG_CANVAS_THEME_COLOR_LIGHT,
} from "@/lib/mobile-viewport";

export const THEME_MODE_STORAGE_KEY = "renovel-theme-mode";

export type ThemeMode = "light" | "dark";

const THEME_COLOR_META_ID = "renovel-theme-color";

export function syncThemeColorMeta(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  const color =
    mode === "dark"
      ? APP_BROWSER_BG_CANVAS_THEME_COLOR_DARK
      : APP_BROWSER_BG_CANVAS_THEME_COLOR_LIGHT;
  let meta = document.getElementById(THEME_COLOR_META_ID) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  }
  if (!meta) {
    meta = document.createElement("meta");
    meta.id = THEME_COLOR_META_ID;
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = color;
}

export function readStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "light";
  try {
    return localStorage.getItem(THEME_MODE_STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function applyThemeMode(mode: ThemeMode): void {
  document.documentElement.classList.toggle("dark", mode === "dark");
  syncThemeColorMeta(mode);
}

export function persistThemeMode(mode: ThemeMode): void {
  try {
    localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
  } catch {
    // storage unavailable
  }
}
