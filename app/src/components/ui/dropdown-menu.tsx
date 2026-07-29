"use client";

import * as React from "react";
import { startTransition } from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  DropdownMenu as DsDropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem as DsDropdownMenuItem,
  DropdownMenuContent as DsDropdownMenuContent,
} from "design-system/ui/dropdown-menu";
import { DropdownMenuOpenContext } from "@/components/ui/dropdown-menu-open-context";
import {
  POINTER_TAP_TRIGGER_TOUCH_ACTION_CLASS,
  usePointerTapGestureTracker,
} from "@/lib/pointer-tap-gesture";
import { cn } from "design-system/utils";

const DROPDOWN_MENU_INLINE_CONTENT_CLASS =
  "z-sticky max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-elevation-40 ring-1 ring-foreground/10 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-open:duration-medium data-open:ease-emphasized-decelerate data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95 data-closed:duration-short data-closed:ease-emphasized-accelerate";

function DropdownMenu({
  open: openProp,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DsDropdownMenu>) {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: (value) => {
      (onOpenChange as ((next: boolean) => void) | undefined)?.(value);
    },
  });

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (next === open) return;
      startTransition(() => setOpen(next));
    },
    [open, setOpen],
  );

  return (
    <DropdownMenuOpenContext.Provider value={{ setOpen }}>
      <DsDropdownMenu
        data-slot="dropdown-menu"
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </DropdownMenuOpenContext.Provider>
  );
}

type DropdownMenuTriggerProps = React.ComponentProps<typeof MenuPrimitive.Trigger> & {
  asChild?: boolean;
};

function DropdownMenuTrigger({
  asChild,
  children,
  className,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onClick,
  ...props
}: DropdownMenuTriggerProps) {
  const menuOpen = React.useContext(DropdownMenuOpenContext);
  const gesture = usePointerTapGestureTracker();

  const triggerProps: React.ComponentProps<typeof MenuPrimitive.Trigger> = {
    className: cn(POINTER_TAP_TRIGGER_TOUCH_ACTION_CLASS, className),
    onPointerDown: (event) => {
      gesture.onPointerDown(event as React.PointerEvent);
      event.preventDefault();
      onPointerDown?.(event);
    },
    onPointerMove: (event) => {
      gesture.onPointerMove(event as React.PointerEvent);
      onPointerMove?.(event);
    },
    onPointerUp: (event) => {
      gesture.onPointerUp(event as React.PointerEvent);
      onPointerUp?.(event);
    },
    onPointerCancel: (event) => {
      gesture.onPointerCancel(event as React.PointerEvent);
      onPointerCancel?.(event);
    },
    onClick: (event) => {
      onClick?.(event);
      if (gesture.shouldSuppressActivation()) {
        event.preventDefault();
        event.stopPropagation();
        gesture.reset();
        return;
      }
      menuOpen?.setOpen((prev) => !prev);
      gesture.reset();
    },
    ...props,
  };

  if (asChild && React.isValidElement(children)) {
    return (
      <MenuPrimitive.Trigger
        render={children as React.ReactElement}
        {...triggerProps}
      />
    );
  }

  return <MenuPrimitive.Trigger {...triggerProps}>{children}</MenuPrimitive.Trigger>;
}

function DropdownMenuContent({
  className,
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  portalled = true,
  ...props
}: React.ComponentProps<typeof DsDropdownMenuContent> &
  Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset"> & {
    portalled?: boolean;
  }) {
  if (portalled) {
    return (
      <DsDropdownMenuContent
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className={className}
        {...props}
      />
    );
  }

  // Base UI는 Positioner 앞에 Portal이 필수. 인라인 스택용이어도 Portal을 유지한다.
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-sticky outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(DROPDOWN_MENU_INLINE_CONTENT_CLASS, className)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuItem({
  onSelect,
  onClick,
  className,
  ...props
}: React.ComponentProps<typeof DsDropdownMenuItem> & {
  onSelect?: (event: React.MouseEvent<HTMLElement>) => void;
}) {
  return (
    <DsDropdownMenuItem
      className={className}
      onClick={(event) => {
        onClick?.(event);
        onSelect?.(event);
      }}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
