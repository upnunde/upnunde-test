"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DELETE_CONFIRM_INPUT_PHRASE } from "@/lib/deleteConfirmPhrase";
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
      <DialogContent className="flex w-[480px] max-w-[calc(100vw-2rem)] flex-col items-stretch gap-0 overflow-hidden border-0 bg-surface-10 p-0 shadow-[0px_8px_16px_8px_rgba(0,0,0,0.16)] sm:rounded-[4px]">
        <div className="flex flex-col items-center gap-5 self-stretch overflow-hidden rounded-tl-2xl rounded-tr-2xl bg-surface-10 px-6 pb-4 pt-10">
          <div className="flex flex-col items-center gap-2 self-stretch">
            <DialogTitle asChild>
              <h2 className="text-center font-['Pretendard_JP'] text-2xl font-bold leading-8 text-on-surface-10">
                캐릭터를 삭제하시겠어요?
              </h2>
            </DialogTitle>
          </div>
          <p className="self-stretch text-center font-['Pretendard_JP'] text-base font-medium leading-6 text-on-surface-20">
            캐릭터를 삭제하면 설정 정보와 관련 데이터가 함께 영구 삭제되며, 복구가 불가능합니다.
          </p>
        </div>

        <div className="mx-5 mb-3 flex flex-col items-center gap-2.5 self-stretch overflow-hidden rounded bg-surface-20 p-6">
          <label
            htmlFor="character-delete-confirm-input"
            className="text-center font-['Pretendard_JP'] text-sm font-normal leading-5 text-on-surface-20"
          >
            삭제를 진행하려면 아래에「{DELETE_CONFIRM_INPUT_PHRASE}」를 입력해 주세요.
          </label>
          <div className="flex w-full flex-col items-stretch justify-center gap-2 rounded">
            <Input
              id="character-delete-confirm-input"
              type="text"
              autoComplete="off"
              placeholder={DELETE_CONFIRM_INPUT_PHRASE}
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              className="h-10 rounded border-0 bg-surface-10 px-4 font-['Pretendard_JP'] text-sm font-normal leading-5 text-on-surface-10 shadow-none outline outline-1 -outline-offset-1 outline-border-20 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <div className="flex items-center justify-end overflow-hidden rounded-bl-2xl rounded-br-2xl bg-surface-10">
          <div className="inline-flex items-center justify-end gap-2 self-stretch bg-surface-10 px-6 pb-5 pt-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-10 min-w-20 rounded-md border border-border-20 bg-surface-10 px-3 font-['Pretendard_JP'] text-base font-medium leading-5 text-on-surface-10 hover:bg-surface-20"
              >
                취소
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              className="h-10 min-w-20 rounded-md bg-error-error px-3 font-['Pretendard_JP'] text-base font-medium leading-5 text-white hover:bg-error-error/90 disabled:opacity-50"
              onClick={handleConfirm}
              disabled={!deleteEnabled}
            >
              동의하고 삭제
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
