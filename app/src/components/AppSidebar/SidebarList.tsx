"use client";

import React from "react";

export interface SidebarListItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SidebarListProps {
  items: SidebarListItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  /** 컨테이너(ul)에 적용할 클래스 */
  listClassName?: string;
  /** 각 버튼에 적용할 클래스. active 시 추가될 클래스는 itemActiveClassName으로. */
  itemClassName?: string;
  /** 활성 항목 버튼에만 적용할 클래스 */
  itemActiveClassName?: string;
  /** 비활성 항목 버튼에만 적용할 클래스 */
  itemInactiveClassName?: string;
  /** 각 li 래퍼에 적용할 클래스 (margin/padding/height 등) */
  itemWrapperClassName?: string;
  ariaLabel?: string;
}

const DEFAULT_ITEM_CLASS =
  "flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";
const DEFAULT_ACTIVE_CLASS = "text-primary";
const DEFAULT_INACTIVE_CLASS = "text-slate-700 hover:bg-slate-50";

/**
 * 사이드바/패널에서 사용하는 선택 가능한 목록. AppSidebar, BGM 모달 장르 목록 등에서 재사용.
 */
export function SidebarList({
  items,
  activeId,
  onSelect,
  listClassName,
  itemClassName,
  itemActiveClassName,
  itemInactiveClassName,
  itemWrapperClassName,
  ariaLabel,
}: SidebarListProps) {
  return (
    <ul
      className={listClassName ?? "flex flex-col gap-1"}
      role="list"
      aria-label={ariaLabel}
    >
      {items.map((item) => {
        const isActive = activeId === item.id;
        const buttonClass = [
          itemClassName ?? DEFAULT_ITEM_CLASS,
          isActive
            ? (itemActiveClassName ?? DEFAULT_ACTIVE_CLASS)
            : (itemInactiveClassName ?? DEFAULT_INACTIVE_CLASS),
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <li key={item.id} className={itemWrapperClassName}>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className={buttonClass}
              data-state={isActive ? "focused" : undefined}
              aria-current={isActive ? "true" : undefined}
            >
              {item.icon != null && (
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center [&_svg]:h-5 [&_svg]:w-5"
                  aria-hidden
                >
                  {item.icon}
                </span>
              )}
              <span className="text-[15px] font-medium">{item.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
