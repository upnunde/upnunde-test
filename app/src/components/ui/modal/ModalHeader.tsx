"use client";

import type { ReactNode } from "react";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { modalHeaderClassName } from "@/components/ui/modal/modal-styles";

export interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
}

/** modal Header 프레임 — with icon / subtitle 옵션 */
export function ModalHeader({ title, subtitle, icon, className }: ModalHeaderProps) {
  return (
    <div className={cn(modalHeaderClassName, className)}>
      <div className="flex flex-col items-center justify-center gap-2 self-stretch">
        {icon ? <div className="relative flex h-7 w-7 items-center justify-center">{icon}</div> : null}
        <DialogTitle asChild>
          <h2 className="text-center font-['Pretendard_JP'] text-2xl font-bold leading-8 text-on-surface-10">
            {title}
          </h2>
        </DialogTitle>
      </div>
      {subtitle ? (
        <DialogDescription asChild>
          <p className="self-stretch whitespace-pre-line text-center font-['Pretendard_JP'] text-base font-medium leading-6 text-on-surface-20">
            {subtitle}
          </p>
        </DialogDescription>
      ) : null}
    </div>
  );
}
