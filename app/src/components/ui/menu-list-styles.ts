import { CONTROL_HEIGHT_FORM_CLASS } from "@/lib/chip-styles";
import { cn } from "@/lib/utils";

/** shadcn DropdownMenuItem / CommandItem 공통 — 포커스·호버·비활성 */
export const menuListItemInteractiveClassName = cn(
  "outline-none select-none",
  "focus-visible:bg-surface-20 focus-visible:text-on-surface-10",
  "data-[highlighted]:bg-surface-20 data-[highlighted]:text-on-surface-10",
  "lg:hover:bg-surface-20 lg:hover:text-on-surface-10",
  "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40",
  "disabled:pointer-events-none disabled:opacity-50",
);

/** 목록 행 공통 베이스 — 타이포는 variant별로 지정 */
export const menuListItemBaseClassName = cn(
  "relative flex w-full cursor-pointer items-center gap-my-8 text-left",
  menuListItemInteractiveClassName,
);

/**
 * 모바일 바텀 시트 목록 행 — 48px (`h-my-48`) · 16px/500 (`text-body1_500`).
 * `MenuListItem` variant `form`, `EditorBottomSheetMenu` sheet 경로.
 */
export const menuListItemSheetClassName = cn(
  menuListItemBaseClassName,
  "text-body1_500 text-on-surface-10",
  "h-my-48 min-h-my-48",
  "rounded-md px-my-12 py-0",
);

/**
 * PC 드롭다운·액션 메뉴 — form 42px 티어 · 16px/500 (`text-body1_500`).
 * `EditorMenuOption` dropdown, 모바일 더보기 드롭다운 등.
 */
export const menuListItemFormClassName = cn(
  menuListItemBaseClassName,
  "text-body1_500 text-on-surface-10",
  CONTROL_HEIGHT_FORM_CLASS,
  "rounded-md px-my-12 py-0",
);

/**
 * 팝오버·컴팩트 드롭다운 — 14px/400 (`text-body3_400`).
 * `SlashCommandMenu` popover, `ResourcePicker` popover 등.
 */
export const menuListItemCompactClassName = cn(
  menuListItemBaseClassName,
  "text-body3_400 text-on-surface-20",
  "rounded-sm px-my-8 py-my-8",
);

export const menuListItemDestructiveClassName =
  "text-error-error focus-visible:bg-error-error/10 data-[highlighted]:bg-error-error/10 lg:hover:bg-error-error/10";

/** 시트·드롭다운 스크롤 본문 래퍼 */
export const menuListBodyClassName = "flex flex-col px-my-8 py-my-8";

export const menuListLabelClassName = "px-my-12 py-my-8 text-caption1_400 text-on-surface-30";

export const menuListSeparatorClassName = "bg-border-10 -mx-my-8 my-my-4 h-px";
