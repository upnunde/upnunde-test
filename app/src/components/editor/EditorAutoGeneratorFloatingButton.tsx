"use client";

import { ICONS, Icon } from "@/lib/icons";
import { Button } from "design-system/ui/button";
import { iconButtonSizeToIconGlyph } from "design-system/icon-tokens";
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

const placementClass = (placement: EditorAutoGeneratorButtonPlacement) =>
  cn(
    "transition-[width,padding] duration-short ease-standard",
    placement === "overlay" && "absolute top-3 right-3 z-overlay",
    placement === "below-tabs" && "absolute top-full right-2 z-overlay mt-2 shrink-0",
  );

/** 에피소드 생성기 진입 버튼 */
export function EditorAutoGeneratorFloatingButton({
  onClick,
  placement = "overlay",
  compact = false,
  className,
}: EditorAutoGeneratorFloatingButtonProps) {
  if (compact) {
    return (
      <Button
        type="button"
        variant="ghost"
        shape="circle"
        size="icon-xl"
        aria-label="에피소드 생성기"
        className={cn(buttonVisualClass, placementClass(placement), className)}
        onClick={onClick}
      >
        <Icon
          icon={ICONS.pencilSparkles}
          size={iconButtonSizeToIconGlyph("icon-xl")}
        />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="xl"
      className={cn(buttonVisualClass, placementClass(placement), "px-4", className)}
      onClick={onClick}
    >
      에피소드 생성기
    </Button>
  );
}
