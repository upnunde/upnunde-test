"use client";

import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type EditorMenuPresentation = "dropdown" | "sheet";

const OPTION_CLASS =
  "flex cursor-pointer items-center gap-my-8 rounded-md px-my-12 py-my-8 text-body3_400 text-on-surface-20 outline-none focus:bg-surface-20 lg:hover:bg-surface-20";

const SECTION_LABEL_CLASS =
  "px-my-12 py-my-8 text-caption1_400 text-on-surface-30";

export interface EditorMenuOptionProps {
  presentation: EditorMenuPresentation;
  onSelect: () => void;
  children: React.ReactNode;
  className?: string;
}

export function EditorMenuOption({
  presentation,
  onSelect,
  children,
  className,
}: EditorMenuOptionProps) {
  if (presentation === "dropdown") {
    return (
      <DropdownMenuItem onClick={onSelect} className={cn(OPTION_CLASS, className)}>
        {children}
      </DropdownMenuItem>
    );
  }

  return (
    <button
      type="button"
      className={cn("w-full text-left", OPTION_CLASS, className)}
      onClick={onSelect}
    >
      {children}
    </button>
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
        <DropdownMenuLabel className={SECTION_LABEL_CLASS}>{children}</DropdownMenuLabel>
      </>
    );
  }

  return (
    <>
      <div className="my-my-4 border-t border-border-10" role="separator" />
      <p className={SECTION_LABEL_CLASS}>{children}</p>
    </>
  );
}
