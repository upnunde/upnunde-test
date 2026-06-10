"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type EditorAutoGeneratorButtonPlacement = "overlay" | "below-tabs";

export interface EditorAutoGeneratorFloatingButtonProps {
  onClick: () => void;
  /** overlay: 본문 위 우상단(데스크톱) / below-tabs: 장면 탭 바로 아래 플로팅(모바일) */
  placement?: EditorAutoGeneratorButtonPlacement;
  className?: string;
}

const buttonVisualClass =
  "rounded-full bg-slate-800 px-my-16 text-body3_500 text-white shadow-elevation-10 hover:bg-slate-700 hover:text-white";

/** 에피소드 생성기 진입 버튼 */
export function EditorAutoGeneratorFloatingButton({
  onClick,
  placement = "overlay",
  className,
}: EditorAutoGeneratorFloatingButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="form"
      className={cn(
        buttonVisualClass,
        placement === "overlay" && "absolute top-my-12 right-my-12 z-30",
        placement === "below-tabs" &&
          "absolute top-full right-my-16 z-30 mt-my-8",
        className,
      )}
      onClick={onClick}
    >
      에피소드 생성기
    </Button>
  );
}
