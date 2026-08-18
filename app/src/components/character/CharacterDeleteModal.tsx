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
import type { CharacterData } from "@/types/character";

export interface CharacterDeleteModalProps {
  open: boolean;
  character: CharacterData | null;
  onClose: () => void;
  onConfirm: (character: CharacterData) => void;
}

export function CharacterDeleteModal({
  open,
  character,
  onClose,
  onConfirm,
}: CharacterDeleteModalProps) {
  const { confirmInput, setConfirmInput, deleteEnabled, handleOpenChange, resetConfirmInput } =
    useDeleteConfirmInput({ onClose });

  const handleConfirm = () => {
    if (character && deleteEnabled) {
      onConfirm(character);
      resetConfirmInput();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false}>
        <ModalHeader
          title="캐릭터를 삭제하시겠어요?"
          subtitle={
            "캐릭터를 삭제하면 설정 정보와 관련 데이터가 함께 영구 삭제되며,\n복구가 불가능합니다."
          }
        />

        <ModalFooterButtons
          layout="end"
          body={
            <ModalConfirmPhraseField
              inputId="character-delete-confirm-input"
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
