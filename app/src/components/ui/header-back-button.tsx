"use client";

import { ICONS } from "@/lib/icons";
import { IconButton } from "@/components/ui/icon-button";

/** 서브 헤더·에디터 헤더 뒤로가기 — DS icon-xl(40) · circle ghost */
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
      variant="ghost"
      shape="circle"
      size="icon-xl"
      className={className}
    />
  );
}
