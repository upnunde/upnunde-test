"use client";

import * as React from "react";
import { tagVariantProps } from "@/lib/chip-styles";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";

export interface TagProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: React.ReactNode;
  onDismiss?: () => void;
}

/** 입력 필드에 쌓이는 토큰 — Chip과 스타일만 공유, 분류는 Tag */
export function Tag({ children, onDismiss, className, onClick, ...props }: TagProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) {
      onDismiss?.();
    }
  };

  return (
    <Chip
      {...tagVariantProps}
      dismissIcon
      type="button"
      className={cn(className)}
      onClick={handleClick}
      aria-label={typeof children === "string" ? `${children} 삭제` : undefined}
      {...props}
    >
      {children}
    </Chip>
  );
}
