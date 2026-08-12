"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

import { cn } from "design-system/utils";
import {
  MOBILE_MODAL_RADIUS_CLASS,
  MOBILE_MODAL_TOP_RADIUS_CLASS,
  DESKTOP_MODAL_RADIUS_CLASS,
  DIALOG_CONTENT_Z_CLASS,
  DIALOG_OVERLAY_Z_CLASS,
  CONFIRM_DIALOG_WIDTH_CLASS,
} from "@/components/ui/modal/modal-styles";

/**
 * 리노벨 Dialog — DS `@base-ui/react/dialog`를 primitive로 사용하는 도메인 어댑터.
 * radix API(`asChild`, `data-state=open|closed`)를 유지하면서 내부는 @base-ui.
 * - Trigger·Close의 `asChild` 자식은 render prop으로 변환 (radix 호환)
 * - 상태 selector는 `data-open` / `data-closed` (@base-ui 컨벤션)
 * - `presentation`: `auto`(모바일 바텀시트 + 데스크톱 중앙) · `center`(항상 중앙)
 */

const Dialog = DialogPrimitive.Root;

type BaseCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>;
type BaseTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>;

/**
 * radix 스타일 `asChild`를 지원. asChild=true 시 자식을 render prop으로 전달.
 */
function DialogTrigger({
  asChild,
  children,
  ...props
}: Omit<BaseTriggerProps, "render"> & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return (
      <DialogPrimitive.Trigger
        render={children as React.ReactElement}
        {...props}
      />
    );
  }
  return <DialogPrimitive.Trigger {...props}>{children}</DialogPrimitive.Trigger>;
}

function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal {...props} />;
}

function DialogClose({
  asChild,
  children,
  ...props
}: Omit<BaseCloseProps, "render"> & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return (
      <DialogPrimitive.Close
        render={children as React.ReactElement}
        {...props}
      />
    );
  }
  return <DialogPrimitive.Close {...props}>{children}</DialogPrimitive.Close>;
}

const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Backdrop>
>(function DialogOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Backdrop
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 top-0 bg-dim-20 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0",
        // 모바일: 키보드로 줄어든 visual viewport 추적
        "max-lg:bottom-auto max-lg:top-[var(--app-vv-live-top,0px)] max-lg:h-[var(--app-vv-live-height,100dvh)]",
        DIALOG_OVERLAY_Z_CLASS,
        className,
      )}
      {...props}
    />
  );
});

const dialogContentAnimationClass =
  "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 duration-short";

/** 알림·경고 — 항상 중앙 모달 */
const dialogContentCenterClass = cn(
  "fixed left-1/2 top-1/2 flex min-h-0 -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-y-auto bg-background p-6 shadow-elevation-50 outline-none focus:outline-none max-h-[calc(100dvh-160px)]",
  "max-lg:top-[calc(var(--app-vv-live-top,0px)+var(--app-vv-live-height,100dvh)/2)] max-lg:max-h-[calc(var(--app-vv-live-height,100dvh)-var(--space-10))]",
  CONFIRM_DIALOG_WIDTH_CLASS,
  DIALOG_CONTENT_Z_CLASS,
  MOBILE_MODAL_RADIUS_CLASS,
  DESKTOP_MODAL_RADIUS_CLASS,
  dialogContentAnimationClass,
  "data-closed:zoom-out-95 data-open:zoom-in-95",
);

/** 폼·상세 — 모바일 바텀 시트 / lg+ 중앙 모달 */
const dialogContentAutoClass = cn(
  "fixed flex w-full min-h-0 flex-col bg-background shadow-elevation-50 outline-none focus:outline-none",
  DIALOG_CONTENT_Z_CLASS,
  dialogContentAnimationClass,
  "max-lg:inset-x-0 max-lg:bottom-[var(--app-keyboard-inset,var(--app-vv-bottom,0px))] max-lg:top-auto max-lg:max-h-[min(92dvh,900px,var(--app-vv-live-height,92dvh))] max-lg:translate-x-0 max-lg:translate-y-0 max-lg:gap-0 max-lg:overflow-hidden max-lg:rounded-b-none max-lg:border-t border-border max-lg:p-0 max-lg:pb-[env(safe-area-inset-bottom,0px)] max-lg:data-open:slide-in-from-bottom max-lg:data-closed:slide-out-to-bottom",
  MOBILE_MODAL_TOP_RADIUS_CLASS,
  "lg:left-1/2 lg:top-1/2 lg:max-w-lg lg:max-h-[calc(100dvh-160px)] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:gap-0 lg:overflow-y-auto lg:border-t-0 lg:p-0 lg:shadow-elevation-50 lg:pb-0",
  DESKTOP_MODAL_RADIUS_CLASS,
  "lg:data-closed:zoom-out-95 lg:data-open:zoom-in-95",
);

export type DialogContentPresentation = "auto" | "center";

export type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup> & {
  /** `auto`: 모바일 바텀 시트 · `center`: 알림·경고 등 항상 중앙 */
  presentation?: DialogContentPresentation;
};

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent({ className, presentation = "auto", children, ...props }, ref) {
    return (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Popup
          ref={ref}
          className={cn(
            presentation === "center" ? dialogContentCenterClass : dialogContentAutoClass,
            className,
          )}
          {...props}
        >
          {children}
        </DialogPrimitive.Popup>
      </DialogPortal>
    );
  },
);

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

type BaseTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;
const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  Omit<BaseTitleProps, "render"> & { asChild?: boolean }
>(function DialogTitle({ className, asChild, children, ...props }, ref) {
  const merged = cn("text-heading2_700 tracking-tight", className);
  if (asChild && React.isValidElement(children)) {
    return (
      <DialogPrimitive.Title
        ref={ref}
        className={merged}
        render={children as React.ReactElement}
        {...props}
      />
    );
  }
  return (
    <DialogPrimitive.Title ref={ref} className={merged} {...props}>
      {children}
    </DialogPrimitive.Title>
  );
});

type BaseDescriptionProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;
const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  Omit<BaseDescriptionProps, "render"> & { asChild?: boolean }
>(function DialogDescription({ className, asChild, children, ...props }, ref) {
  const merged = cn("text-foreground-muted text-body3_400", className);
  if (asChild && React.isValidElement(children)) {
    return (
      <DialogPrimitive.Description
        ref={ref}
        className={merged}
        render={children as React.ReactElement}
        {...props}
      />
    );
  }
  return (
    <DialogPrimitive.Description ref={ref} className={merged} {...props}>
      {children}
    </DialogPrimitive.Description>
  );
});

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
