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
      <DialogContent className="flex w-[480px] max-w-[calc(100vw-2rem)] flex-col items-stretch gap-0 overflow-hidden border-0 bg-surface-10 p-0 shadow-[0px_8px_16px_8px_rgba(0,0,0,0.16)] sm:rounded-2xl">
        {/* 상단: 제목 + 부제 */}
        <div className="flex flex-col items-center gap-5 self-stretch overflow-hidden rounded-tl-2xl rounded-tr-2xl bg-surface-10 px-6 pb-4 pt-10">
          <div className="flex flex-col items-center gap-2 self-stretch">
            <DialogTitle asChild>
              <h2 className="text-center font-['Pretendard_JP'] text-2xl font-bold leading-8 text-on-surface-10">
                시리즈를 삭제하시겠어요?
              </h2>
            </DialogTitle>
          </div>
          <p className="self-stretch text-center font-['Pretendard_JP'] text-base font-medium leading-6 text-on-surface-20">
            시리즈를 삭제하면 포함된 모든 회차 정보와 에피소드, 설정된 캐릭터 및 BGM 리소스가 함께
            영구 삭제되며, 복구가 불가능합니다.
          </p>
        </div>

        {/* 중단: 확인 문구 + 입력 */}
        <div className="mx-5 mb-3 flex flex-col items-center gap-2.5 self-stretch overflow-hidden rounded bg-surface-20 p-6">
          <label
            htmlFor="series-delete-confirm-input"
            className="text-center font-['Pretendard_JP'] text-sm font-normal leading-5 text-on-surface-20"
          >
            삭제를 진행하려면 아래에「{DELETE_CONFIRM_INPUT_PHRASE}」를 입력해 주세요.
          </label>
          <div className="flex w-full flex-col items-stretch justify-center gap-2 rounded">
            <Input
              id="series-delete-confirm-input"
              type="text"
              autoComplete="off"
              placeholder={DELETE_CONFIRM_INPUT_PHRASE}
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              className="h-10 rounded border-0 bg-surface-10 px-4 font-['Pretendard_JP'] text-sm font-normal leading-5 text-on-surface-10 shadow-none outline outline-1 -outline-offset-1 outline-border-20 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* 하단: 버튼 */}
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
