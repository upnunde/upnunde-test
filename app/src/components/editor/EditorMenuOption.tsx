"use client";

import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
  MenuListItem,
  MenuListLabel,
  MenuListSeparator,
  menuListItemFormClassName,
  menuListLabelClassName,
} from "@/components/ui/menu-list";
import { cn } from "@/lib/utils";

export type EditorMenuPresentation = "dropdown" | "sheet";

export interface EditorMenuOptionProps {
  presentation: EditorMenuPresentation;
  onSelect: () => void;
  children: React.ReactNode;
  className?: string;
  destructive?: boolean;
}

export function EditorMenuOption({
  presentation,
  onSelect,
  children,
  className,
  destructive = false,
}: EditorMenuOptionProps) {
  if (presentation === "dropdown") {
    return (
      <DropdownMenuItem
        variant={destructive ? "destructive" : "default"}
        onClick={onSelect}
        className={cn(menuListItemFormClassName, className)}
      >
        {children}
      </DropdownMenuItem>
    );
  }

  return (
    <MenuListItem
      variant="form"
      destructive={destructive}
      className={className}
      onClick={onSelect}
    >
      {children}
    </MenuListItem>
  );
}

export function EditorMenuSectionLabel({
  presentation,
  children,
}: {
  presentation: EditorMenuPresentation;
  children: React.ReactNode;
}) {
  if (presentation === "dropdown") {
    return (
      <>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className={menuListLabelClassName}>{children}</DropdownMenuLabel>
      </>
    );
  }

  return (
    <>
      <MenuListSeparator />
      <MenuListLabel>{children}</MenuListLabel>
    </>
  );
}
