import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageCardProps {
  className?: string;
  children: ReactNode;
}

export function PageCard({ className, children }: PageCardProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1200px] min-w-[640px] rounded-xl border border-slate-200 bg-white px-5 pt-2 pb-5 shadow-none",
        className,
      )}
    >
      {children}
    </div>
  );
}

