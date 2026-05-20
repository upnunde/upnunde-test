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
}

export function Chip({
  chipType,
  variant,
  corner,
  size,
  icon,
  dismissIcon = false,
  className,
  children,
  type = "button",
  ...props
}: ChipProps) {
  const showIcon = icon || dismissIcon;

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
            size === "l" ? "h-6 w-6" : "h-5 w-5",
          )}
          aria-hidden
        >
          <X
            className={cn(
              "text-current",
              size === "l" ? "h-3 w-3" : "h-2.5 w-2.5",
            )}
            strokeWidth={2.25}
          />
        </span>
      ) : null}
    </button>
  );
}

export interface FilterChipProps
  extends Omit<ChipProps, "chipType" | "variant" | "icon" | "dismissIcon"> {
  selected?: boolean;
  chipSize?: NonNullable<ChipVariantProps["size"]>;
  /** 미지정 시 M=`circle`(rounded), L=`square` */
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
