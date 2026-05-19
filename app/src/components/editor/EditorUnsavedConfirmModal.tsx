"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ModalFooterButtons, ModalHeader, modalDialogContentClassName } from "@/components/ui/modal";

export interface EditorUnsavedConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  secondaryLabel: string;
  onSecondary: () => void;
  primaryLabel: string;
  onPrimary: () => void;
}

/** 에디터: 미저장 변경 시 취소 + 보조·주 액션 확인 (Footer split) */
export function EditorUnsavedConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  secondaryLabel,
  onSecondary,
  primaryLabel,
  onPrimary,
}: EditorUnsavedConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={modalDialogContentClassName}>
        <ModalHeader title={title} subtitle={description} />
        <ModalFooterButtons
          layout="split"
          leadingButton={{ label: "취소", closeOnSelect: true }}
          trailingButtons={[
            { label: secondaryLabel, onClick: onSecondary },
            { label: primaryLabel, tone: "primary", onClick: onPrimary },
          ]}
        />
      </DialogContent>
    </Dialog>
  );
}
