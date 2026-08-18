"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ModalConfirmPhraseField,
  ModalFooterButtons,
  ModalHeader,
} from "@/components/ui/modal";
import { CONFIRM_INPUT_PHRASE } from "@/lib/deleteConfirmPhrase";
import { useDeleteConfirmInput } from "@/hooks/useDeleteConfirmInput";
import type { SeriesData } from "@/types/series";

/** 안내팝업 케이스: 시리즈를 삭제하시겠어요? (레이아웃·구조 기준) */
export interface SeriesDeleteModalProps {
  open: boolean;
  series: SeriesData | null;
  onClose: () => void;
  onConfirm: (series: SeriesData) => void;
}

export function SeriesDeleteModal({
  open,
  series,
  onClose,
  onConfirm,
}: SeriesDeleteModalProps) {
  const { confirmInput, setConfirmInput, deleteEnabled, handleOpenChange, resetConfirmInput } =
    useDeleteConfirmInput({ onClose });

  const handleConfirm = () => {
    if (series && deleteEnabled) {
      onConfirm(series);
      resetConfirmInput();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false}>
        <ModalHeader
          title="시리즈를 삭제하시겠어요?"
          subtitle="시리즈를 삭제하면 포함된 모든 회차 정보와 에피소드, 설정된 캐릭터 및 BGM 리소스가 함께 영구 삭제되며, 복구가 불가능합니다."
        />

        <ModalFooterButtons
          layout="end"
          body={
            <ModalConfirmPhraseField
              inputId="series-delete-confirm-input"
              value={confirmInput}
              onChange={setConfirmInput}
            />
          }
          trailingButtons={[
            { label: "취소", closeOnSelect: true },
            {
              label: "동의하고 삭제",
              tone: "destructive",
              onClick: handleConfirm,
              disabled: !deleteEnabled || confirmInput.trim() !== CONFIRM_INPUT_PHRASE,
            },
          ]}
        />
      </DialogContent>
    </Dialog>
  );
}
