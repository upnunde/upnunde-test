"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
                에피소드를 삭제하시겠어요?
              </h2>
            </DialogTitle>
          </div>
          <div className="self-stretch text-center text-on-surface-20 text-base font-medium font-['Pretendard_JP'] leading-6">
            <p>삭제된 에피소드는 복구할 수 없습니다.</p>
            {episode && (
              <span className="mt-2 block font-medium text-on-surface-10">
                「{episode.title}」
              </span>
            )}
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
            <Button
              variant="destructive"
              size="default"
              className="min-w-20 h-10"
              onClick={handleConfirm}
            >
              삭제
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
