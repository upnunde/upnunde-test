"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ResourceCategory } from "@/types/resource";

/** [정책 4] 삭제 전 확인 팝업 - 등장인물, 배경, 연출장면, 갤러리, 미디어, BGM 공통 */
const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  character: "등장인물",
  background: "배경",
  scene: "연출장면",
  media: "미디어",
  gallery: "갤러리",
  bgm: "BGM",
};

export interface ConfirmDeleteModalProps {
  open: boolean;
  category: ResourceCategory;
  itemName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({
  open,
  category,
  itemName,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const label = CATEGORY_LABELS[category];
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[400px] max-w-[calc(100vw-2rem)] gap-4 bg-surface-10 rounded-[4px] border border-border-10">
        <DialogHeader>
          <DialogTitle className="text-on-surface-10 text-xl font-bold font-['Pretendard_JP']">
            {label}을(를) 삭제하시겠어요?
          </DialogTitle>
          <DialogDescription className="text-on-surface-30 text-sm">
            &quot;{itemName}&quot; 항목이 영구 삭제되며 복구할 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-fit">
              취소
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            삭제
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
