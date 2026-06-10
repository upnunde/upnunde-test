"use client";

import { FileText, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export type EditorMobilePanel = "edit" | "preview";

const TABS: { id: EditorMobilePanel; label: string; icon: typeof FileText }[] = [
  { id: "edit", label: "편집", icon: FileText },
  { id: "preview", label: "미리보기", icon: Smartphone },
];

export interface EditorMobileTabBarProps {
  active: EditorMobilePanel;
  onChange: (panel: EditorMobilePanel) => void;
}

/** lg 미만 에디터 하단 — 편집 / 미리보기 */
export function EditorMobileTabBar({ active, onChange }: EditorMobileTabBarProps) {
  return (
    <nav
      className="flex h-14 shrink-0 border-t border-border-10 bg-white px-my-8"
      aria-label="에디터 패널"
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
