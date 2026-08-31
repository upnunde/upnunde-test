"use client";

import type { ReactNode } from "react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "design-system/utils";

export interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
}

/** 확인 모달 헤더 — DS DialogHeader 정본(패딩은 DialogContent가 담당) */
export function ModalHeader({ title, subtitle, icon, className }: ModalHeaderProps) {
  return (
    <DialogHeader className={cn(className)}>
      {icon ? icon : null}
      <DialogTitle>{title}</DialogTitle>
      {subtitle ? <DialogDescription>{subtitle}</DialogDescription> : null}
    </DialogHeader>
  );
}
