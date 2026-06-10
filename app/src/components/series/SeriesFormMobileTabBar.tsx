"use client";

import { FileText, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export type SeriesFormMobilePanel = "form" | "preview";

const TABS: { id: SeriesFormMobilePanel; label: string; icon: typeof FileText }[] = [
  { id: "form", label: "입력", icon: FileText },
  { id: "preview", label: "미리보기", icon: Smartphone },
];

export interface SeriesFormMobileTabBarProps {
  active: SeriesFormMobilePanel;
  onChange: (panel: SeriesFormMobilePanel) => void;
}

/** lg 미만 시리즈 폼 하단 — 입력 / 미리보기 */
export function SeriesFormMobileTabBar({ active, onChange }: SeriesFormMobileTabBarProps) {
  return (
    <nav
      className="flex h-14 shrink-0 border-t border-border-10 bg-white px-my-8 lg:hidden"
      aria-label="시리즈 폼 패널"
    >
      {TABS.map(({ id, label, icon: Icon }) => {
        const selected = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "flex min-w-0 flex-1 flex-col items-center justify-center gap-my-4 rounded-md text-caption1_500 transition-colors",
              selected
                ? "text-on-surface-10"
                : "text-on-surface-30 hover:bg-surface-20 hover:text-on-surface-20",
            )}
            aria-current={selected ? "page" : undefined}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
