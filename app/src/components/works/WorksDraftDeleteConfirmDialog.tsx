"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModalFooterButtons } from "@/components/ui/modal";

export interface WorksDraftDeleteConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

/** 작성중(미등록) 삭제 — DS Dialog 정본(문구 입력 없음) */
export function WorksDraftDeleteConfirmDialog({
  open,
  title,
  description = "작성 중인 내용이 삭제되며, 복구할 수 없어요.",
  onOpenChange,
  onConfirm,
}: WorksDraftDeleteConfirmDialogProps) {
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
              label: "삭제",
              tone: "destructive",
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
