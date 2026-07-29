import { CONTROL_HEIGHT_FORM_CLASS } from "@/lib/chip-styles";
import { space } from "design-system/spacing-tokens";
import { cn } from "design-system/utils";

/** shadcn DropdownMenuItem / CommandItem 공통 — 포커스·호버·비활성 */
export const menuListItemInteractiveClassName = cn(
  "outline-none select-none",
  "focus-visible:bg-muted focus-visible:text-foreground",
  "data-[highlighted]:bg-muted data-[highlighted]:text-foreground",
  "lg:hover:bg-muted lg:hover:text-foreground",
  "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40",
  "disabled:pointer-events-none disabled:opacity-50",
);

/** 목록 행 공통 베이스 — 타이포는 variant별로 지정 · `space.list.listItemGapCompact` */
export const menuListItemBaseClassName = cn(
  "relative flex w-full cursor-pointer items-center text-left",
  space.list.listItemGapCompact.className,
  menuListItemInteractiveClassName,
);

/**
 * 모바일 바텀 시트 목록 행 — 48px (`h-12`) · 16px/500 (`text-body1_500`).
 * `MenuListItem` variant `form`, `EditorBottomSheetMenu` sheet 경로.
 */
export const menuListItemSheetClassName = cn(
  menuListItemBaseClassName,
  "text-body1_500 text-foreground",
  "h-12 min-h-12",
  "rounded-md px-3 py-0",
);

/**
 * PC 드롭다운·액션 메뉴 — form 42px 티어 · 16px/500 (`text-body1_500`).
 * `EditorMenuOption` dropdown, 모바일 더보기 드롭다운 등.
 */
export const menuListItemFormClassName = cn(
  menuListItemBaseClassName,
  "text-body1_500 text-foreground",
  CONTROL_HEIGHT_FORM_CLASS,
  "rounded-md px-3 py-0",
);

/**
 * 팝오버·컴팩트 드롭다운 — 14px/400 (`text-body3_400`).
 * `SlashCommandMenu` popover, `ResourcePicker` popover 등.
 */
export const menuListItemCompactClassName = cn(
  menuListItemBaseClassName,
  "text-body3_400 text-foreground-muted",
  "rounded-sm px-2 py-2",
);

export const menuListItemDestructiveClassName = cn(
  "text-destructive focus-visible:bg-destructive/10 data-[highlighted]:bg-destructive/10 lg:hover:bg-destructive/10",
  "[&_svg:not([class*='text-'])]:text-current",
);

/** 시트·드롭다운 스크롤 본문 래퍼 */
export const menuListBodyClassName = "flex flex-col px-2 py-2";

export const menuListLabelClassName = "px-3 py-2 text-caption1_400 text-foreground-placeholder";

export const menuListSeparatorClassName = "bg-border -mx-2 my-1 h-px";
