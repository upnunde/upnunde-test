"use client";

import * as React from "react";
import {
  menuListBodyClassName,
  menuListItemBaseClassName,
  menuListItemCompactClassName,
  menuListItemDestructiveClassName,
  menuListItemFormClassName,
  menuListItemSheetClassName,
  menuListLabelClassName,
  menuListSeparatorClassName,
} from "@/components/ui/menu-list-styles";
import { cn } from "design-system/utils";

export type MenuListItemVariant = "form" | "compact";

const menuListItemVariantClassName: Record<MenuListItemVariant, string> = {
  form: menuListItemSheetClassName,
  compact: menuListItemCompactClassName,
};

/** shadcn CommandList / DropdownMenuContent 본문 — 선택·액션 목록 컨테이너 */
export function MenuList({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="menu"
      data-slot="menu-list"
      className={cn("flex min-h-0 flex-col", className)}
      {...props}
    />
  );
}

/** 시트·팝오버 내부 목록 패딩 래퍼 */
export function MenuListBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="menu-list-body"
      className={cn(menuListBodyClassName, className)}
      {...props}
    />
  );
}

export interface MenuListItemProps extends React.ComponentProps<"div"> {
  variant?: MenuListItemVariant;
  destructive?: boolean;
}

/**
 * shadcn DropdownMenuItem / CommandItem sheet 대응 — 바텀 시트·팝오버 목록 행.
 * Radix Menu.Item과 같이 `div[role=menuitem]`을 사용한다. CTA용 `Button`과 무관하다.
 */
export const MenuListItem = React.forwardRef<HTMLDivElement, MenuListItemProps>(
  (
    {
      className,
      variant = "form",
      destructive = false,
      role = "menuitem",
      tabIndex = 0,
      onClick,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onClick?.(event as unknown as React.MouseEvent<HTMLDivElement>);
      }
    };

    return (
      <div
        ref={ref}
        role={role}
        tabIndex={tabIndex}
        data-slot="menu-list-item"
        data-variant={variant}
        className={cn(
          menuListItemVariantClassName[variant],
          destructive && menuListItemDestructiveClassName,
          className,
        )}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  },
);
MenuListItem.displayName = "MenuListItem";

/** shadcn CommandGroup heading / DropdownMenuLabel */
export function MenuListLabel({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="menu-list-label"
      className={cn(menuListLabelClassName, className)}
      {...props}
    />
  );
}

/** shadcn CommandSeparator / DropdownMenuSeparator */
export function MenuListSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      data-slot="menu-list-separator"
      className={cn(menuListSeparatorClassName, className)}
      {...props}
    />
  );
}

export {
  menuListItemBaseClassName,
  menuListItemCompactClassName,
  menuListItemFormClassName,
  menuListItemSheetClassName,
  menuListBodyClassName,
  menuListLabelClassName,
  menuListSeparatorClassName,
};
