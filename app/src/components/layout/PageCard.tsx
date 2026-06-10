import type { ReactNode } from "react";
import { PAGE_CONTAINER_CLASS } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

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
          ? "w-full rounded-[4px] border border-border-10 bg-white px-my-20 pt-my-8 pb-my-20 shadow-none overflow-hidden"
          : cn(PAGE_CONTAINER_CLASS, "rounded-[4px] border border-border-10 bg-white px-my-20 pt-my-8 pb-my-20 shadow-none overflow-hidden"),
        className,
      )}
    >
      {children}
    </div>
  );
}

