import type { ReactNode } from "react";
import {
  PAGE_CARD_FULL_WIDTH_PAD_X_CLASS,
  PAGE_CONTAINER_CLASS,
  PAGE_GUTTER_X_CLASS,
} from "@/lib/page-layout";
import { cn } from "design-system/utils";

interface PageCardProps {
  className?: string;
  children: ReactNode;
  /** true면 너비 제약(min/max)을 제거하고 부모 레이아웃에 맞게 채움 */
  fullWidth?: boolean;
}

export function PageCard({ className, children, fullWidth = false }: PageCardProps) {
  return (
    <div
      className={cn(
        fullWidth
          ? `w-full rounded-sm border border-border bg-background ${PAGE_CARD_FULL_WIDTH_PAD_X_CLASS} pt-2 pb-5 shadow-none overflow-hidden`
          : cn(PAGE_CONTAINER_CLASS, `rounded-sm border border-border bg-background ${PAGE_GUTTER_X_CLASS} pt-2 pb-5 shadow-none overflow-hidden`),
        className,
      )}
    >
      {children}
    </div>
  );
}

