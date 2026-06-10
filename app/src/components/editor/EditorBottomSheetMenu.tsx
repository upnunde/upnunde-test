"use client";

import { cloneElement, isValidElement, useCallback, useEffect, type MouseEvent, type ReactElement } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsLgUp } from "@/hooks/useMediaQuery";
import type { EditorMenuPresentation } from "@/components/editor/EditorMenuOption";
import { mobileBottomSheetMaxHeightClassName, MOBILE_BOTTOM_SHEET_PAD_CLASS } from "@/components/ui/modal/modal-styles";
import { cn } from "@/lib/utils";

export interface EditorBottomSheetMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  align?: "start" | "center" | "end";
  contentClassName?: string;
  trigger: React.ReactNode;
  children: (presentation: EditorMenuPresentation) => React.ReactNode;
}

type TriggerElementProps = {
  onClick?: (e: MouseEvent) => void;
  "aria-expanded"?: boolean;
  "aria-haspopup"?: "dialog";
};

export function EditorBottomSheetMenu({
  open,
  onOpenChange,
  title,
  align = "start",
  contentClassName,
  trigger,
  children,
}: EditorBottomSheetMenuProps) {
  const isDesktop = useIsLgUp();

  const handleDismiss = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (isDesktop || !open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleDismiss();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleDismiss, isDesktop, open]);

  const mobileSheet =
    !isDesktop && open && typeof document !== "undefined"
      ? createPortal(
          <>
            <div
              className="fixed inset-0 z-40 bg-black/30"
              aria-hidden
              onClick={handleDismiss}
            />
            <div
              className={cn(
                "fixed inset-x-0 bottom-0 z-50 flex min-h-0 flex-col rounded-t-[4px] border-t border-border-10 bg-white shadow-elevation-40",
                MOBILE_BOTTOM_SHEET_PAD_CLASS,
                mobileBottomSheetMaxHeightClassName,
              )}
              role="dialog"
              aria-modal="true"
              aria-label={title}
            >
              <div className="flex w-full shrink-0 items-center justify-between border-b border-border-10 px-my-12 lg:px-my-20 py-my-16">
                <div className="text-body1_700 text-on-surface-10">{title}</div>
                <button
                  type="button"
                  aria-label="닫기"
                  onClick={handleDismiss}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-on-surface-30 transition-colors hover:bg-surface-20/60 hover:text-on-surface-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                  style={{ marginRight: -8 }}
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-my-8 py-my-8">
                {children("sheet")}
              </div>
            </div>
          </>,
          document.body,
        )
      : null;

  if (!isDesktop) {
    const mobileTrigger = isValidElement(trigger)
      ? cloneElement(trigger as ReactElement<TriggerElementProps>, {
          onClick: (e: MouseEvent) => {
            (trigger as ReactElement<TriggerElementProps>).props.onClick?.(e);
            onOpenChange(true);
          },
          "aria-expanded": open,
          "aria-haspopup": "dialog",
        })
      : trigger;

    return (
      <>
        {mobileTrigger}
        {mobileSheet}
      </>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={cn(contentClassName)}>
        {children("dropdown")}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
