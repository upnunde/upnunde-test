"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  const [ackChecked, setAckChecked] = useState(false);

  const handleOpenChange = (o: boolean) => {
    if (!o) {
      setAckChecked(false);
      onClose();
    }
  };

  const handleConfirm = () => {
    if (series) {
      onConfirm(series);
      setAckChecked(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[480px] max-w-[calc(100vw-2rem)] p-0 gap-0 bg-surface-10 rounded-2xl shadow-[0px_8px_16px_8px_rgba(0,0,0,0.16)] overflow-hidden border-0">
        {/* 상단: 제목 + 부제 */}
        <div className="self-stretch px-6 pt-10 pb-4 bg-surface-10 rounded-t-2xl flex flex-col justify-start items-center gap-5 overflow-hidden">
          <div className="self-stretch flex flex-col justify-center items-center gap-2">
            <DialogTitle asChild>
              <h2 className="text-center text-on-surface-10 text-2xl font-bold font-['Pretendard_JP'] leading-8">
                시리즈를 삭제하시겠어요?
              </h2>
            </DialogTitle>
          </div>
          <p className="self-stretch text-center text-on-surface-20 text-base font-medium font-['Pretendard_JP'] leading-6">
            시리즈를 삭제하면 포함된 모든 회차 정보와 에피소드, 설정된 캐릭터 및 BGM 리소스가 함께
            영구 삭제되며, 복구가 불가능합니다.
          </p>
        </div>

        {/* 하단: 체크박스 + 버튼 */}
        <div className="self-stretch rounded-b-2xl flex flex-col justify-start items-start overflow-hidden bg-surface-10">
          <div className="self-stretch px-6 py-4 bg-surface-10 inline-flex justify-between items-center">
            <label className="flex-1 flex justify-start items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ackChecked}
                onChange={(e) => setAckChecked(e.target.checked)}
                className="w-5 h-5 rounded border-border-20 text-primary focus:ring-primary shrink-0"
              />
              <span className="text-on-surface-20 text-base font-normal font-['Pretendard_JP'] leading-6">
                주의사항을 숙지하였으며, 삭제 진행에 동의합니다.
              </span>
            </label>
          </div>
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
              disabled={!ackChecked}
            >
              동의하고 삭제
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
