"use client";

import * as React from "react";
import { Button } from "design-system/ui/button";
import { cn } from "design-system/utils";
import { editorRowControlTextClass } from "@/lib/editor-block-layout";

/**
 * 에디터 블록 속성 트리거 — DS Button outline/sm.
 * PopoverAnchor·DropdownMenuTrigger `asChild` 호환.
 */
export type BlockAttributeTriggerProps = React.ComponentProps<typeof Button> & {
  rowFocused?: boolean;
};

export function BlockAttributeTrigger({
  variant = "outline",
  size = "sm",
  shape = "square",
  type = "button",
  rowFocused = false,
  className,
  ...props
}: BlockAttributeTriggerProps) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      shape={shape}
      className={cn("min-w-0 justify-start", editorRowControlTextClass(rowFocused), className)}
      {...props}
    />
  );
}
