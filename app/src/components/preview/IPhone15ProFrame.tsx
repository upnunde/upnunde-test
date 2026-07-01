"use client";

import type { ReactNode } from "react";
import {
  PREVIEW_DEVICE_FRAME_INNER_CLASS,
  PREVIEW_DEVICE_FRAME_OUTER_CLASS,
  PREVIEW_PLAYER_ROOT_CLASS,
} from "@/lib/preview-overlay-styles";
import { cn } from "design-system/utils";

interface IPhone15ProFrameProps {
  children: ReactNode;
  className?: string;
}

export function IPhone15ProFrame({ children, className }: IPhone15ProFrameProps) {
  return (
    <div className={cn(PREVIEW_DEVICE_FRAME_OUTER_CLASS, className)}>
      <div className={cn(PREVIEW_DEVICE_FRAME_INNER_CLASS, PREVIEW_PLAYER_ROOT_CLASS)}>
        {children}
      </div>
    </div>
  );
}
