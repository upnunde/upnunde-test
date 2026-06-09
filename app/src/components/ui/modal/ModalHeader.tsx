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
      <div className="flex flex-col items-center justify-center gap-my-8 self-stretch">
        {icon ? <div className="relative flex h-7 w-7 items-center justify-center">{icon}</div> : null}
        <DialogTitle asChild>
          <h2 className="text-center font-['Pretendard_JP'] text-heading2_700 text-on-surface-10">
            {title}
          </h2>
        </DialogTitle>
      </div>
      {subtitle ? (
        <DialogDescription asChild>
          <p className="self-stretch whitespace-pre-line text-center font-['Pretendard_JP'] text-body1_500 text-on-surface-20">
            {subtitle}
          </p>
        </DialogDescription>
      ) : null}
    </div>
  );
}
