"use client";

import * as React from "react";
import { Button } from "design-system/ui/button";

/**
 * 에디터 블록 속성 트리거 — DS Button outline/sm.
 * PopoverAnchor·DropdownMenuTrigger `asChild` 호환.
 */
export type BlockAttributeTriggerProps = React.ComponentProps<typeof Button>;

export function BlockAttributeTrigger({
  variant = "outline",
  size = "sm",
  shape = "square",
  type = "button",
  ...props
}: BlockAttributeTriggerProps) {
  return <Button type={type} variant={variant} size={size} shape={shape} {...props} />;
}
