"use client";

import { ICONS } from "@/lib/icons";
import { IconButton } from "@/components/ui/icon-button";
import { useThemeMode } from "@/hooks/useThemeMode";

/** DS 다크모드 확인용 — 글로벌 헤더 프로필 옆 토글 */
export function ThemeToggleButton() {
  const { mode, mounted, toggle } = useThemeMode();
  const icon = !mounted ? ICONS.moon : mode === "dark" ? ICONS.sun : ICONS.moon;

  return (
    <IconButton
      type="button"
      variant="ghost"
      shape="circle"
      size="icon-xl"
      icon={icon}
      onClick={toggle}
      aria-label={mode === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
      aria-pressed={mode === "dark"}
    />
  );
}
