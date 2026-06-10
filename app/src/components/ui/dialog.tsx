"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const dialogContentAnimationClass =
  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200";

/** 알림·경고 — 항상 중앙 모달 */
const dialogContentCenterClass = cn(
  "fixed left-1/2 top-1/2 z-50 flex w-full max-w-lg max-h-[calc(100dvh-160px)] min-h-0 -translate-x-1/2 -translate-y-1/2 flex-col gap-my-16 overflow-y-auto rounded-[4px] bg-background p-my-24 shadow-elevation-50 outline-none focus:outline-none",
  dialogContentAnimationClass,
  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
);

/** 폼·상세 — 모바일 바텀 시트 / lg+ 중앙 모달 */
const dialogContentAutoClass = cn(
  "fixed z-50 flex w-full min-h-0 flex-col bg-background shadow-elevation-50 outline-none focus:outline-none",
  dialogContentAnimationClass,
  "max-lg:inset-x-0 max-lg:bottom-0 max-lg:top-auto max-lg:max-h-[min(92dvh,900px)] max-lg:translate-x-0 max-lg:translate-y-0 max-lg:gap-0 max-lg:overflow-hidden max-lg:rounded-t-[4px] max-lg:rounded-b-none max-lg:border-t border-border-10 max-lg:p-0 max-lg:pb-[env(safe-area-inset-bottom)]",
  "lg:left-1/2 lg:top-1/2 lg:max-w-lg lg:max-h-[calc(100dvh-160px)] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:gap-my-16 lg:overflow-y-auto lg:rounded-[4px] lg:border-t-0 lg:p-my-24 lg:shadow-elevation-50 lg:pb-my-24",
  "lg:data-[state=closed]:zoom-out-95 lg:data-[state=open]:zoom-in-95",
);

export type DialogContentPresentation = "auto" | "center";

export type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  /** `auto`: 모바일 바텀 시트 · `center`: 알림·경고 등 항상 중앙 */
  presentation?: DialogContentPresentation;
};

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, presentation = "auto", children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        presentation === "center" ? dialogContentCenterClass : dialogContentAutoClass,
        className,
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-my-8 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-heading2_700 tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-muted-foreground text-body3_400", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
