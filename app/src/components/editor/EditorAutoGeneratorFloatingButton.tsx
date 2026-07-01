"use client";

import { ICONS } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { cn } from "design-system/utils";

export type EditorAutoGeneratorButtonPlacement = "overlay" | "below-tabs";

export interface EditorAutoGeneratorFloatingButtonProps {
  onClick: () => void;
  /** overlay: 본문 위 우상단(데스크톱) / below-tabs: 장면 탭 아래 플로팅(모바일) */
  placement?: EditorAutoGeneratorButtonPlacement;
  /** below-tabs — 스크롤 다운 시 아이콘만 노출 */
  compact?: boolean;
  className?: string;
}

const buttonVisualClass =
  "rounded-full bg-inverse text-body3_500 text-inverse-foreground shadow-elevation-10 hover:bg-inverse hover:text-inverse-foreground";

/** 에피소드 생성기 진입 버튼 */
export function EditorAutoGeneratorFloatingButton({
  onClick,
  placement = "overlay",
  compact = false,
  className,
}: EditorAutoGeneratorFloatingButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size={compact ? "icon-lg" : "lg"}
      className={cn(
        buttonVisualClass,
        "transition-[width,padding] duration-short ease-standard",
        placement === "overlay" && "absolute top-3 right-3 z-overlay px-4",
        placement === "below-tabs" &&
          "absolute top-full right-2 z-overlay mt-2 shrink-0",
        compact ? "h-12 w-12 min-w-0 p-0" : "px-4",
        className,
      )}
      onClick={onClick}
      aria-label={compact ? "에피소드 생성기" : undefined}
    >
      {compact ? (
        <ICONS.sparkles className="h-5 w-5 shrink-0" aria-hidden />
      ) : (
        "에피소드 생성기"
      )}
    </Button>
  );
}
