"use client";

import * as React from "react";
import { X } from "lucide-react";
import { chipVariants, filterChipVariantProps, type ChipVariantProps } from "@/lib/chip-styles";
import { cn } from "@/lib/utils";

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    ChipVariantProps {
  children: React.ReactNode;
  /** 닫기 아이콘 표시 (Tag에서 사용) */
  dismissIcon?: boolean;
  /** 우측 아이콘 슬롯 — `icon: true`일 때 X 대신 렌더 (드롭다운 chevron 등) */
  trailingIcon?: React.ReactNode;
}

export function Chip({
  chipType,
  variant,
  corner,
  size,
  icon,
  dismissIcon = false,
  trailingIcon,
  className,
  children,
  type = "button",
  ...props
}: ChipProps) {
  const showIcon = icon || dismissIcon || Boolean(trailingIcon);

  return (
    <button
      type={type}
      className={cn(
        chipVariants({ chipType, variant, corner, size, icon: showIcon }),
        props.disabled ? "cursor-default" : "cursor-pointer",
        className,
      )}
      {...props}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <span className="whitespace-nowrap">{children}</span>
      ) : (
        children
      )}
      {showIcon ? (
        <span
          className={cn(
            "relative inline-flex shrink-0 items-center justify-center",
            size === "l" ? "size-my-24" : "size-my-20",
          )}
          aria-hidden
        >
          {trailingIcon ?? (
            <X
              className={cn(
                "text-current",
                size === "l" ? "size-my-12" : "size-[10px]",
              )}
              strokeWidth={2.25}
            />
          )}
        </span>
      ) : null}
    </button>
  );
}

export interface FilterChipProps
  extends Omit<ChipProps, "chipType" | "variant" | "icon" | "dismissIcon"> {
  selected?: boolean;
  chipSize?: NonNullable<ChipVariantProps["size"]>;
  /** 미지정 시 `square` — L/M 공통 8px 라운드 (`chip-styles`) */
  corner?: ChipVariantProps["corner"];
}

/** 분석·BGM 등 단일 선택 필터 칩 */
export function FilterChip({
  selected = false,
  chipSize = "m",
  corner,
  className,
  children,
  ...props
}: FilterChipProps) {
  const variantProps = filterChipVariantProps(selected, chipSize, corner);

  return (
    <Chip
      {...variantProps}
      aria-pressed={selected}
      className={className}
      {...props}
    >
      {children}
    </Chip>
  );
}
