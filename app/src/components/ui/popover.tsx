"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"

import {
  POINTER_TAP_TRIGGER_TOUCH_ACTION_CLASS,
  usePointerTapGestureTracker,
} from "@/lib/pointer-tap-gesture"
import { cn } from "design-system/utils"

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

const PopoverTrigger = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(
  (
    {
      className,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onClick,
      ...props
    },
    ref,
  ) => {
    const gesture = usePointerTapGestureTracker()

    return (
      <PopoverPrimitive.Trigger
        ref={ref}
        data-slot="popover-trigger"
        className={cn(POINTER_TAP_TRIGGER_TOUCH_ACTION_CLASS, className)}
        onPointerDown={(event) => {
          gesture.onPointerDown(event)
          onPointerDown?.(event)
        }}
        onPointerMove={(event) => {
          gesture.onPointerMove(event)
          onPointerMove?.(event)
        }}
        onPointerUp={(event) => {
          gesture.onPointerUp(event)
          onPointerUp?.(event)
        }}
        onPointerCancel={(event) => {
          gesture.onPointerCancel(event)
          onPointerCancel?.(event)
        }}
        onClick={(event) => {
          onClick?.(event)
          if (gesture.shouldSuppressActivation()) {
            event.preventDefault()
            event.stopPropagation()
          }
          gesture.reset()
        }}
        {...props}
      />
    )
  },
)
PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  container,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & {
  /** Dialog 모달 안에서는 body 대신 Dialog 노드로 포털해야 포인터가 막히지 않는다. */
  container?: HTMLElement | null
}) {
  return (
    <PopoverPrimitive.Portal container={container ?? undefined}>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          // z-index는 사용처에서 지정한다 — tailwind-merge가 커스텀 z-* 유틸(z-sticky/z-overlay/z-modal)을
          // 같은 그룹으로 병합하지 못해, base에 z를 두면 사용처 override가 무효화되기 때문.
          "bg-background text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 min-w-[200px] w-72 origin-(--radix-popover-content-transform-origin) rounded-md border border-border p-4 shadow-elevation-40 outline-hidden",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-body3_400", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <div
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
}
