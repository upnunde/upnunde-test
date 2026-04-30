import type { ReactNode } from "react";
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
          ? "w-full rounded-[4px] border border-border-10 bg-white px-5 pt-2 pb-5 shadow-none overflow-hidden"
          : "mx-auto w-full max-w-[1200px] min-w-[640px] rounded-[4px] border border-border-10 bg-white px-5 pt-2 pb-5 shadow-none overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

