"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ModalFooterButtons,
  ModalHeader,
  modalDialogContentClassName,
} from "@/components/ui/modal";
import { formTextFieldSmClassName } from "@/lib/form-field-styles";
import { CONFIRM_INPUT_GUIDE_TEXT, CONFIRM_INPUT_PHRASE } from "@/lib/deleteConfirmPhrase";
import { cn } from "@/lib/utils";
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
  const [confirmationText, setConfirmationText] = useState("");
  const isConfirmKeywordMatched = confirmationText.trim() === CONFIRM_INPUT_PHRASE;

  const handleConfirm = () => {
    if (episode && isConfirmKeywordMatched) {
      setConfirmationText("");
      onConfirm(episode);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setConfirmationText("");
          onClose();
        }
      }}
    >
      <DialogContent presentation="center" className="w-[480px] max-w-[calc(100vw-2rem)] p-0 gap-0 bg-surface-10 shadow-elevation-50 border-0 outline-none focus:outline-none max-lg:rounded-[16px] lg:rounded-[4px]">
        {/* 상단: 제목 + 부제 (가이드 레이아웃) */}
        <div className="self-stretch px-my-24 pt-my-40 pb-my-16 bg-surface-10 max-lg:rounded-t-[16px] lg:rounded-t-[4px] flex flex-col justify-start items-center gap-my-20">
          <div className="self-stretch flex flex-col justify-center items-center gap-my-8">
            <DialogTitle asChild>
              <h2 className="text-center text-on-surface-10 text-heading2_700 font-['Pretendard_JP']">
                공개 전 유의사항
              </h2>
            </DialogTitle>
          </div>
          <div className="self-stretch text-on-surface-20 text-body1_500 font-['Pretendard_JP'] space-y-my-12">
            <p className="text-center">
              에피소드를 공개하기 전, 아래 내용을 꼭 확인해 주세요!
            </p>
            <div className="self-stretch p-my-20 bg-surface-20 rounded-lg inline-flex flex-col justify-center items-center gap-my-8">
              <div className="self-stretch inline-flex justify-start items-start gap-my-8">
                <div className="w-4 justify-center text-on-surface-20 text-body1_500 font-['Pretendard_JP']">
                  1
                </div>
                <div className="flex-1 justify-center text-on-surface-20 text-body1_400 font-['Pretendard_JP']">
                  결제 보안 및 데이터 신뢰성 보호를 위해 공개 이후에는 창작자가 직접 에피소드를 수정하거나
                  삭제할 수 없습니다.
                </div>
              </div>
              <div className="self-stretch inline-flex justify-start items-start gap-my-8">
                <div className="w-4 justify-center text-on-surface-20 text-body1_500 font-['Pretendard_JP']">
                  2
                </div>
                <div className="flex-1 justify-center text-on-surface-20 text-body1_400 font-['Pretendard_JP']">
                  내용의 변경 또는 삭제가 반드시 필요한 경우, 고객센터 이메일을 통한 별도의 요청 및 승인
                  절차를 거쳐야 합니다.
                </div>
              </div>
            </div>
            <div className="self-stretch space-y-my-8">
              <p className="text-body3_500 text-on-surface-20">{CONFIRM_INPUT_GUIDE_TEXT}</p>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={CONFIRM_INPUT_PHRASE}
                className={cn(formTextFieldSmClassName, "w-full")}
              />
            </div>
          </div>
        </div>

        {/* 하단: 버튼 영역 (가이드 레이아웃) */}
        <div className="self-stretch max-lg:rounded-b-[16px] lg:rounded-b-[4px] flex flex-col justify-start items-start overflow-hidden bg-surface-10">
          <div className="self-stretch px-my-24 pt-my-8 pb-my-20 bg-surface-10 inline-flex justify-end items-center gap-my-8">
            <DialogClose asChild>
              <Button variant="outline" size="lg" className="min-w-20">
                취소
              </Button>
            </DialogClose>
            <Button
              size="lg"
              className="min-w-20"
              onClick={handleConfirm}
              disabled={!isConfirmKeywordMatched || !episode}
            >
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
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent presentation="center" className={modalDialogContentClassName}>
        <ModalHeader
          title="에피소드를 삭제하시겠어요?"
          subtitle="정말 삭제하시겠어요? 삭제 후에는 복구할 수 없어요."
        />
        {episode ? (
          <p className="-mt-3 px-my-24 pb-my-8 text-center font-['Pretendard_JP'] text-body1_500 text-on-surface-10">
            「{episode.title}」
          </p>
        ) : null}
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
