"use client";

import { Plus } from "lucide-react";

export interface WorksEmptyCreateButtonProps {
  hint: string;
  actionLabel: string;
  onClick?: () => void;
}

/**
 * 내 작품 영역 — 작품이 없을 때 노출하는 점선 박스 + 생성 CTA (시리즈 목록과 동일 스타일)
 */
export function WorksEmptyCreateButton({ hint, actionLabel, onClick }: WorksEmptyCreateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col cursor-pointer items-center justify-center gap-3 w-full min-h-[241px] rounded-[4px] border-2 border-dashed border-border-10 bg-surface-20/50 hover:bg-surface-20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <span className="text-sm text-on-surface-30">{hint}</span>
      <span className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
        <Plus className="h-4 w-4" aria-hidden />
        {actionLabel}
      </span>
    </button>
  );
}
