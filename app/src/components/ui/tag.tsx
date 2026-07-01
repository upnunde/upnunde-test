"use client";

import { Chip } from "design-system/ui/chip";
import { cn } from "design-system/utils";

export interface TagProps {
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

/** 입력 필드에 쌓이는 토큰 — DS `Chip` `variant="subtle"` `size="sm"` */
export function Tag({ children, onDismiss, className }: TagProps) {
  return (
    <Chip
      variant="subtle"
      size="sm"
      onRemove={onDismiss}
      className={cn(className)}
    >
      {children}
    </Chip>
  );
}
