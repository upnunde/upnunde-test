"use client";

import type { ReactNode } from "react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
}

/** 확인 모달 헤더 — DS DialogHeader 정본(중앙 정렬) */
export function ModalHeader({ title, subtitle, icon, className }: ModalHeaderProps) {
  return (
    <DialogHeader className={className}>
      {icon ? icon : null}
      <DialogTitle>{title}</DialogTitle>
      {subtitle ? <DialogDescription>{subtitle}</DialogDescription> : null}
    </DialogHeader>
  );
}
