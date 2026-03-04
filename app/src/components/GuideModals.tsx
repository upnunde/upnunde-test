"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/** 안내팝업 케이스 1: 잠깐! 시작하기 전 체크 (새 콘텐츠 제작 전) */
export interface StartCheckModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  policyLink?: string;
}

export function StartCheckModal({
  open,
  onClose,
  onConfirm,
  policyLink = "#",
}: StartCheckModalProps) {
  const [policyChecked, setPolicyChecked] = useState(false);

  const handleOpenChange = (o: boolean) => {
    if (!o) {
      setPolicyChecked(false);
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    setPolicyChecked(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>잠깐! 시작하기 전 체크</DialogTitle>
          <DialogDescription asChild>
            <div className="text-sm text-slate-600 space-y-4 pt-2">
              <p>새로운 콘텐츠 제작 전, 아래 내용을 꼭 확인해 주세요!</p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                <li>선정적·폭력적 콘텐츠를 다루지 마세요.</li>
                <li>저작권이 있는 자료를 사용하지 마세요.</li>
                <li>부적절한 콘텐츠는 삭제 또는 제재될 수 있습니다.</li>
              </ol>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="policy-read"
                  checked={policyChecked}
                  onChange={(e) => setPolicyChecked(e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label htmlFor="policy-read" className="cursor-pointer text-slate-700">
                  직접 운영 정책 읽기
                </label>
                <a
                  href={policyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline text-sm"
                >
                  보기
                </a>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-6">
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button onClick={handleConfirm} disabled={!policyChecked}>
            확인하고 계속하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** 안내팝업 케이스 3: 작업을 중단하고 나가시겠습니까? (에디터 이탈) */
export interface LeaveConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LeaveConfirmModal({ open, onClose, onConfirm }: LeaveConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>작업을 중단하고 나가시겠습니까?</DialogTitle>
          <DialogDescription asChild>
            <p className="text-sm text-slate-600 pt-2">
              저장하지 않은 변경 사항은 사라집니다. 나가기 전에 임시저장해 두시는 것을 권장합니다.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-6">
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleConfirm}>
            나가기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** 안내팝업 케이스 4: 리소스를 삭제하시겠어요? */
export interface ResourceDeleteModalProps {
  open: boolean;
  resourceName?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResourceDeleteModal({
  open,
  resourceName,
  onClose,
  onConfirm,
}: ResourceDeleteModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">리소스를 삭제하시겠어요?</DialogTitle>
          <DialogDescription asChild>
            <div className="text-sm text-slate-600 pt-2">
              <p>
                선택한 리소스를 삭제하면 이 리소스를 사용 중인 모든 에피소드에서 표시 오류나
                오류가 발생할 수 있습니다.
              </p>
              {resourceName && (
                <span className="mt-2 block font-medium text-slate-700">「{resourceName}」</span>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-6">
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleConfirm}>
            삭제
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
