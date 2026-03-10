"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PolicyAgreementModalProps {
  open: boolean;
  onClose: () => void;
  /** 동의하고 계속하기 클릭 시 (체크된 상태에서만 호출) */
  onConfirm: () => void;
}

const POLICIES = [
  "불법, 혐오, 선정적인 내용은 절대 안 돼요.",
  "저작권을 도용하거나, 위반하지 않도록 주의해 주세요.",
  "부적합한 콘텐츠는 삭제되거나, 이용이 제한될 수 있어요.",
];

export function PolicyAgreementModal({
  open,
  onClose,
  onConfirm,
}: PolicyAgreementModalProps) {
  const [agreed, setAgreed] = useState(false);

  const handleConfirm = () => {
    if (!agreed) return;
    onConfirm();
    onClose();
    setAgreed(false);
  };

  const handleClose = () => {
    onClose();
    setAgreed(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent
        className="!flex flex-col justify-center items-center gap-5 w-full max-w-[480px] rounded-2xl border border-slate-200 bg-white p-6 pt-10 shadow-lg"
        aria-describedby="policy-agreement-description"
      >
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-on-surface-10 text-center">
            잠깐! 시작하기 전 체크
          </DialogTitle>
        </DialogHeader>
        <p
          id="policy-agreement-description"
          className="text-base text-slate-600 text-center mt-0"
        >
          즐거운 콘텐츠 창작 전, 아래 내용을 꼭 확인해 주세요!
        </p>

        {/* 정책 목록 (회색 박스) */}
        <div className="rounded-lg bg-slate-100 px-4 py-3 w-full mt-0">
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
            {POLICIES.map((text, i) => (
              <li key={i}>{text}</li>
            ))}
          </ol>
        </div>

        {/* 리노벨 운영정책 동의 + 보기 링크 */}
        <div className="flex items-center justify-between gap-2 w-full mt-0">
          <button
            type="button"
            onClick={() => setAgreed((prev) => !prev)}
            className="flex items-center gap-2 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
            aria-pressed={agreed}
            aria-label={agreed ? "리노벨 운영정책 동의함" : "리노벨 운영정책 동의"}
          >
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                agreed
                  ? "border-primary bg-primary text-white"
                  : "border-slate-300 bg-white"
              )}
              aria-hidden
            >
              {agreed && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            <span>리노벨 운영정책 동의</span>
          </button>
          <Link
            href="/guide"
            className="text-sm text-on-surface-10 underline hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            보기
          </Link>
        </div>

        {/* 취소 / 동의하고 계속하기 */}
        <div className="flex justify-end gap-2 mt-6 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="border-slate-200"
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!agreed}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            동의하고 계속하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
