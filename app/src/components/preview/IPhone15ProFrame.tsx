"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IPhone15ProFrameProps {
  children: ReactNode;
  className?: string;
}

export function IPhone15ProFrame({ children, className }: IPhone15ProFrameProps) {
  return (
    <div
      className={cn(
        "relative flex h-[650px] w-[300px] flex-col overflow-hidden rounded-[2.25rem] bg-surface-30 outline outline-[3px] outline-slate-800",
        className,
      )}
    >
      <div className="relative h-full w-full min-h-0 min-w-0 overflow-hidden rounded-[2rem] bg-black">
        {children}
      </div>
    </div>
  );
}
