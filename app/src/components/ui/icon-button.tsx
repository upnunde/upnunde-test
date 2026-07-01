"use client";

import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { Button as DsButton, buttonVariants } from "design-system/ui/button";
import { iconButtonSizeToIconGlyph } from "design-system/icon-tokens";
import { Icon, type LucideIcon } from "@/lib/icons";

type IconButtonSize = Extract<
  NonNullable<VariantProps<typeof buttonVariants>["size"]>,
  `icon${string}`
>;

export type IconButtonProps = Omit<
  React.ComponentProps<typeof DsButton>,
  "size" | "children"
> & {
  icon: LucideIcon;
  "aria-label": string;
  size?: IconButtonSize;
  shape?: VariantProps<typeof buttonVariants>["shape"];
  iconClassName?: string;
  children?: React.ReactNode;
};

/** DS icon-only Button — `design-system/ui/button` + `Icon` 글리프 매핑 */
export function IconButton({
  icon,
  size = "icon",
  shape = "square",
  variant = "outline",
  className,
  iconClassName,
  children,
  ...props
}: IconButtonProps) {
  const glyphSize = iconButtonSizeToIconGlyph(size);

  return (
    <DsButton
      data-slot="icon-button"
      variant={variant}
      shape={shape}
      size={size}
      className={className}
      {...props}
    >
      <Icon icon={icon} size={glyphSize} className={iconClassName} />
      {children}
    </DsButton>
  );
}
