"use client";

import { AlertCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ModalFooterButtons,
  ModalHeader,
  modalDialogContentClassName,
} from "@/components/ui/modal";
import type { ResourceCategory } from "@/types/resource";

/** [정책 4] 삭제 전 확인 팝업 — 등장인물·배경·연출장면·갤러리·미디어·BGM 공통 */
const RESOURCE_DELETE_TITLE = "리소스를 삭제하시겠어요?";
const RESOURCE_DELETE_SUBTITLE =
  "현재 선택한 리소스를 삭제하면, 이 리소스가 포함된 모든 에피소드에서 이미지 노출 누락 또는 음원 재생 오류가 발생될 수 있습니다.";

export interface ConfirmDeleteModalProps {
  open: boolean;
  /** 하위 호환·호출부 유지용 (표시 카피는 리소스 공통 문구 사용) */
  category: ResourceCategory;
  itemName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className={modalDialogContentClassName}>
        <ModalHeader
          title={RESOURCE_DELETE_TITLE}
          subtitle={RESOURCE_DELETE_SUBTITLE}
          icon={
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-inverse-10)]"
              aria-hidden
            >
              <AlertCircle className="h-4 w-4 text-[var(--on-surface-inverse)]" strokeWidth={2.25} />
            </span>
          }
        />
        <ModalFooterButtons
          layout="end"
          trailingButtons={[
            { label: "취소", closeOnSelect: true },
            { label: "삭제", tone: "destructive", onClick: handleConfirm },
          ]}
        />
      </DialogContent>
    </Dialog>
  );
}
