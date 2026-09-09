"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModalFooterButtons } from "@/components/ui/modal";

export type WorksVisibilityAction = "public" | "private";

export interface WorksVisibilityConfirmDialogProps {
  open: boolean;
  action: WorksVisibilityAction | null;
  /** 시리즈 | 캐릭터 */
  entityLabel: "시리즈" | "캐릭터";
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

/** 공개/비공개 전환 확인 — DS Dialog 정본 */
export function WorksVisibilityConfirmDialog({
  open,
  action,
  entityLabel,
  onOpenChange,
  onConfirm,
}: WorksVisibilityConfirmDialogProps) {
  const isPublic = action === "public";
  const title = isPublic
    ? `${entityLabel}를 공개할까요?`
    : `${entityLabel}를 비공개로 전환할까요?`;
  const description = isPublic
    ? `공개하면 다른 이용자가 ${entityLabel === "시리즈" ? "이 작품을" : "이 캐릭터를"} 볼 수 있어요.`
    : `비공개로 바꾸면 목록과 검색에서 더 이상 노출되지 않아요.`;
  const confirmLabel = isPublic ? "공개" : "비공개";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onOpenChange(false);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ModalFooterButtons
          layout="end"
          trailingButtons={[
            { label: "취소", closeOnSelect: true },
            {
              label: confirmLabel,
              tone: "primary",
              onClick: () => {
                onConfirm();
                onOpenChange(false);
              },
            },
          ]}
        />
      </DialogContent>
    </Dialog>
  );
}
