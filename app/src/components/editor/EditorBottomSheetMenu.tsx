"use client";

import { cloneElement, isValidElement, useCallback, useEffect, type MouseEvent, type ReactElement } from "react";
import { createPortal } from "react-dom";
import { ICONS } from "@/lib/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useIsLgUp } from "@/hooks/useMediaQuery";
import type { EditorMenuPresentation } from "@/components/editor/EditorMenuOption";
import { MenuListBody } from "@/components/ui/menu-list";
import {
  MOBILE_BOTTOM_SHEET_SCRIM_CLASS,
  MOBILE_BOTTOM_SHEET_SHELL_BASE_CLASS,
  mobileBottomSheetMediumMaxHeightClassName,
} from "@/components/ui/modal/modal-styles";
import { cn } from "design-system/utils";

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
              className={MOBILE_BOTTOM_SHEET_SCRIM_CLASS}
              aria-hidden
              onClick={handleDismiss}
            />
            <div
              className={cn(
                MOBILE_BOTTOM_SHEET_SHELL_BASE_CLASS,
                mobileBottomSheetMediumMaxHeightClassName,
              )}
              role="dialog"
              aria-modal="true"
              aria-label={title}
            >
              <div className="flex w-full shrink-0 items-center justify-between border-b border-border px-5 py-4">
                <div className="text-body1_700 text-foreground">{title}</div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="닫기"
                  onClick={handleDismiss}
                  className="rounded-full text-foreground-placeholder -mr-2"
                >
                  <ICONS.close className="h-5 w-5" aria-hidden />
                </Button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <MenuListBody>{children("sheet")}</MenuListBody>
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
        <DropdownMenuGroup>{children("dropdown")}</DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
