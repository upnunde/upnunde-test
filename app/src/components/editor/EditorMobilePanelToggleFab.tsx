"use client";

import { FileText, Smartphone } from "lucide-react";
import {
  EDITOR_MOBILE_FAB_BUTTON_CLASS,
  EDITOR_MOBILE_FAB_SIZE_CLASS,
  type EditorMobilePanel,
} from "@/components/editor/editor-mobile-floating-layout";
import { cn } from "@/lib/utils";

export interface EditorMobilePanelToggleFabProps {
  active: EditorMobilePanel;
  onToggle: () => void;
  /** 미리보기 → 편집 전환 라벨. 기본 「편집」 */
  editTargetLabel?: string;
  className?: string;
}

/** lg 미만 — 편집 ↔ 미리보기 토글 FAB (다음 화면 아이콘 표시) */
export function EditorMobilePanelToggleFab({
  active,
  onToggle,
  editTargetLabel = "편집",
  className,
}: EditorMobilePanelToggleFabProps) {
  const isEdit = active === "edit";
  const TargetIcon = isEdit ? Smartphone : FileText;
  const ariaLabel = isEdit ? "미리보기로 전환" : `${editTargetLabel}으로 전환`;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(EDITOR_MOBILE_FAB_SIZE_CLASS, EDITOR_MOBILE_FAB_BUTTON_CLASS, className)}
      aria-label={ariaLabel}
    >
      <TargetIcon className="h-5 w-5 shrink-0" aria-hidden />
    </button>
  );
}
