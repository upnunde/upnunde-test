"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  "rounded-full bg-slate-800 text-body3_500 text-white shadow-elevation-10 hover:bg-slate-700 hover:text-white";

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
      size={compact ? "icon-lg" : "form"}
      className={cn(
        buttonVisualClass,
        "transition-[width,padding] duration-200 ease-out",
        placement === "overlay" && "absolute top-my-12 right-my-12 z-30 px-my-16",
        placement === "below-tabs" &&
          "absolute top-full right-my-8 z-30 mt-my-8 shrink-0",
        compact ? "h-12 w-12 min-w-0 p-0" : "px-my-16",
        className,
      )}
      onClick={onClick}
      aria-label={compact ? "에피소드 생성기" : undefined}
    >
      {compact ? (
        <Sparkles className="h-5 w-5 shrink-0" aria-hidden />
      ) : (
        "에피소드 생성기"
      )}
    </Button>
  );
}
