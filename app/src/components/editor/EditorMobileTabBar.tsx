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
  /** 기본 「편집」 — 읽기 전용 화면에서는 「원고」 등으로 교체 */
  editTabLabel?: string;
  ariaLabel?: string;
}

/** lg 미만 에디터 하단 — 편집 / 미리보기 */
export function EditorMobileTabBar({
  active,
  onChange,
  editTabLabel = "편집",
  ariaLabel = "에디터 패널",
}: EditorMobileTabBarProps) {
  const tabs = TABS.map((tab) =>
    tab.id === "edit" ? { ...tab, label: editTabLabel } : tab,
  );

  return (
    <nav
      className="flex h-14 shrink-0 border-t border-border-10 bg-white px-my-8"
      aria-label={ariaLabel}
    >
      {tabs.map(({ id, label, icon: Icon }) => {
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
