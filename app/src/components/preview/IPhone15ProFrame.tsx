"use client";

import type { ReactNode } from "react";

interface IPhone15ProFrameProps {
  children: ReactNode;
  className?: string;
}

export function IPhone15ProFrame({ children, className = "" }: IPhone15ProFrameProps) {
  return (
    <div
      className={`relative w-[300px] h-[650px] rounded-[2.25rem] bg-surface-30 outline outline-[3px] outline-slate-800 overflow-hidden flex flex-col ${className}`}
    >
      <div className="relative h-full w-full min-h-0 min-w-0 overflow-hidden rounded-[2rem] bg-black">
        {/* iPhone 15 Pro style Dynamic Island */}
        <div
          className="absolute left-1/2 top-2 z-30 h-[26px] w-[108px] -translate-x-1/2 rounded-full bg-black"
          aria-hidden
        />
        {children}
      </div>
    </div>
  );
}
