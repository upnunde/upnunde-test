"use client";

import { ICONS } from "@/lib/icons";
import { IconButton } from "@/components/ui/icon-button";

/** 서브 헤더·에디터 헤더 뒤로가기 — DS icon md_s36 · circle outline */
export function HeaderBackButton({
  onClick,
  "aria-label": ariaLabel = "뒤로 가기",
  className,
}: {
  onClick: () => void;
  "aria-label"?: string;
  className?: string;
}) {
  return (
    <IconButton
      type="button"
      icon={ICONS.chevronLeft}
      aria-label={ariaLabel}
      onClick={onClick}
      variant="outline"
      shape="circle"
      size="icon"
      className={className}
    />
  );
}
