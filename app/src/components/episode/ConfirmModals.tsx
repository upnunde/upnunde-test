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
import type { Episode } from "@/types/episode";

/** 안내팝업: 공개 전 유의사항 (정책 6) */
export interface PublishConfirmModalProps {
  open: boolean;
  episode: Episode | null;
  onClose: () => void;
  onConfirm: (episode: Episode) => void;
}

export function PublishConfirmModal({
  open,
  episode,
  onClose,
  onConfirm,
}: PublishConfirmModalProps) {
  const handleConfirm = () => {
    if (episode) {
      onConfirm(episode);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[480px] max-w-[calc(100vw-2rem)] p-0 gap-0 bg-surface-10 rounded-2xl shadow-[0px_8px_16px_8px_rgba(0,0,0,0.16)] overflow-hidden border-0">
        {/* 상단: 제목 + 부제 (가이드 레이아웃) */}
        <div className="self-stretch px-6 pt-10 pb-4 bg-surface-10 rounded-t-2xl flex flex-col justify-start items-center gap-5 overflow-hidden">
          <div className="self-stretch flex flex-col justify-center items-center gap-2">
            <DialogTitle asChild>
              <h2 className="text-center text-on-surface-10 text-2xl font-bold font-['Pretendard_JP'] leading-8">
                공개 전 유의사항
              </h2>
            </DialogTitle>
          </div>
          <div className="self-stretch text-on-surface-20 text-base font-medium font-['Pretendard_JP'] leading-6 space-y-3">
            <p className="text-center">
              에피소드를 공개하기 전, 아래 내용을 꼭 확인해 주세요!
            </p>
            <div className="self-stretch p-5 bg-surface-20 rounded-lg inline-flex flex-col justify-center items-center gap-2">
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                <div className="w-4 justify-center text-on-surface-20 text-base font-medium font-['Pretendard_JP'] leading-6">
                  1
                </div>
                <div className="flex-1 justify-center text-on-surface-20 text-base font-normal font-['Pretendard_JP'] leading-6">
                  결제 보안 및 데이터 신뢰성 보호를 위해 공개 이후에는 창작자가 직접 에피소드를 수정하거나
                  삭제할 수 없습니다.
                </div>
              </div>
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                <div className="w-4 justify-center text-on-surface-20 text-base font-medium font-['Pretendard_JP'] leading-6">
                  2
                </div>
                <div className="flex-1 justify-center text-on-surface-20 text-base font-normal font-['Pretendard_JP'] leading-6">
                  내용의 변경 또는 삭제가 반드시 필요한 경우, 고객센터 이메일을 통한 별도의 요청 및 승인
                  절차를 거쳐야 합니다.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단: 버튼 영역 (가이드 레이아웃) */}
        <div className="self-stretch rounded-b-2xl flex flex-col justify-start items-start overflow-hidden bg-surface-10">
          <div className="self-stretch px-6 pt-2 pb-5 bg-surface-10 inline-flex justify-end items-center gap-2">
            <DialogClose asChild>
              <Button variant="outline" size="default" className="min-w-20 h-10">
                취소
              </Button>
            </DialogClose>
            <Button size="default" className="min-w-20 h-10" onClick={handleConfirm}>
              공개
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** 안내팝업 케이스: 에피소드를 삭제하시겠어요? (정책 8) */
export interface DeleteConfirmModalProps {
  open: boolean;
  episode: Episode | null;
  onClose: () => void;
  onConfirm: (episode: Episode) => void;
}

export function DeleteConfirmModal({
  open,
  episode,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const { confirmInput, setConfirmInput, deleteEnabled, handleOpenChange, resetConfirmInput } =
    useDeleteConfirmInput({ onClose });

  const handleConfirm = () => {
    if (episode && deleteEnabled) {
      onConfirm(episode);
      resetConfirmInput();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex w-[480px] max-w-[calc(100vw-2rem)] flex-col items-stretch gap-0 overflow-hidden border-0 bg-surface-10 p-0 shadow-[0px_8px_16px_8px_rgba(0,0,0,0.16)] sm:rounded-2xl">
        {/* 상단: 제목 + 부제 (가이드 셸) */}
        <div className="flex flex-col items-center gap-5 self-stretch overflow-hidden rounded-tl-2xl rounded-tr-2xl bg-surface-10 px-6 pb-4 pt-10">
          <div className="flex flex-col items-center gap-2 self-stretch">
            <DialogTitle asChild>
              <h2 className="text-center font-['Pretendard_JP'] text-2xl font-bold leading-8 text-on-surface-10">
                에피소드를 삭제하시겠어요?
              </h2>
            </DialogTitle>
          </div>
          <div className="flex flex-col gap-2 self-stretch text-center font-['Pretendard_JP'] text-base font-medium leading-6 text-on-surface-20">
            <p>삭제된 에피소드는 복구할 수 없습니다.</p>
            {episode && (
              <span className="block font-medium text-on-surface-10">「{episode.title}」</span>
            )}
          </div>
        </div>

        {/* 중단: 확인 문구 + 입력 (surface-20 띠) */}
        <div className="mx-5 mb-3 flex flex-col items-center gap-2.5 self-stretch overflow-hidden rounded bg-surface-20 p-6">
          <label
            htmlFor="episode-delete-confirm-input"
            className="text-center font-['Pretendard_JP'] text-sm font-normal leading-5 text-on-surface-20"
          >
            삭제를 진행하려면 아래에「{DELETE_CONFIRM_INPUT_PHRASE}」를 입력해 주세요.
          </label>
          <div className="flex w-full flex-col items-stretch justify-center gap-2 rounded">
            <Input
              id="episode-delete-confirm-input"
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
              에피소드 삭제
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
