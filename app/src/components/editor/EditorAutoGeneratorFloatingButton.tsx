"use client";

import { ICONS, Icon } from "@/lib/icons";
import { Button } from "design-system/ui/button";
import { controlSizeToIconGlyph } from "design-system/icon-tokens";
import { cn } from "design-system/utils";

export type EditorAutoGeneratorButtonPlacement = "overlay" | "below-tabs";

export interface EditorAutoGeneratorFloatingButtonProps {
  onClick: () => void;
  /** overlay: 본문 위 우상단(데스크톱) / below-tabs: 장면 탭 아래 플로팅(모바일) */
  placement?: EditorAutoGeneratorButtonPlacement;
  className?: string;
}

const buttonVisualClass =
  "rounded-full bg-inverse text-body3_500 text-inverse-foreground shadow-elevation-10 hover:bg-inverse hover:text-inverse-foreground";

const placementClass = (placement: EditorAutoGeneratorButtonPlacement) =>
  cn(
    placement === "overlay" && "absolute top-3 right-3 z-overlay",
    placement === "below-tabs" && "absolute top-full right-2 z-overlay mt-2 shrink-0",
  );

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
      size="xl"
      aria-label="에피소드 생성기"
      className={cn(buttonVisualClass, placementClass(placement), "px-4", className)}
      onClick={onClick}
    >
      <Icon
        icon={ICONS.pencilSparkles}
        size={controlSizeToIconGlyph("xl")}
        position="inline-start"
      />
      에피소드 생성기
    </Button>
  );
}
