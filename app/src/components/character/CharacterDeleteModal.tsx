"use client";

import { DeleteAcknowledgeDialog } from "@/components/ui/modal";
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
  return (
    <DeleteAcknowledgeDialog
      open={open}
      title="캐릭터를 삭제하시겠어요?"
      description={"캐릭터를 삭제하면 설정 정보와 관련 데이터가 함께 영구 삭제되며,\n복구가 불가능합니다."}
      onClose={onClose}
      onConfirm={() => {
        if (character) onConfirm(character);
      }}
    />
  );
}
