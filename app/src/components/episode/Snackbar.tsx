"use client";

import React, { useEffect } from "react";

export interface SnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
  /** 자동 닫힘 시간(ms). 0이면 자동 닫힘 없음 */
  autoHideDuration?: number;
}

/**
 * 정책 17: 삭제 완료 후 화면 하단 스낵바
 */
export function Snackbar({
  open,
  message,
  onClose,
  autoHideDuration = 4000,
}: SnackbarProps) {
  useEffect(() => {
    if (!open || autoHideDuration <= 0) return;
    const t = setTimeout(onClose, autoHideDuration);
    return () => clearTimeout(t);
  }, [open, autoHideDuration, onClose]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 z-50 -translate-x-1/2 rounded-lg bg-slate-800 px-my-16 py-my-12 text-body3_500 text-white max-lg:bottom-[calc(var(--spacing-my-24)+env(safe-area-inset-bottom,0px)+var(--app-vv-bottom,0px))] lg:bottom-6"
    >
      {message}
    </div>
  );
}
