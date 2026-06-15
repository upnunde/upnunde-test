"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ModalFooterButtons,
  ModalHeader,
  modalDialogContentClassName,
} from "@/components/ui/modal";
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
        presentation="center"
        className={modalDialogContentClassName}
        aria-describedby="policy-agreement-description"
      >
        <ModalHeader
          title="잠깐! 시작하기 전 체크"
          subtitle="즐거운 콘텐츠 창작 전, 아래 내용을 꼭 확인해 주세요!"
        />

        <div
          id="policy-agreement-description"
          className="w-full px-my-24 pb-my-16"
        >
          <div className="w-full rounded-lg bg-surface-20 px-my-16 py-my-12">
            <ol className="list-decimal list-inside space-y-my-8 text-body3_400 text-on-surface-20">
              {POLICIES.map((text, i) => (
                <li key={i}>{text}</li>
              ))}
            </ol>
          </div>
        </div>

        <ModalFooterButtons
          layout="end"
          body={
            <div className="flex w-full items-center justify-between gap-my-8 bg-surface-10 px-my-24 py-my-8">
              <button
                type="button"
                onClick={() => setAgreed((prev) => !prev)}
                className="flex items-center gap-my-8 rounded text-body3_400 text-on-surface-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-pressed={agreed}
                aria-label={agreed ? "리노벨 운영정책 동의함" : "리노벨 운영정책 동의"}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    agreed
                      ? "border-primary bg-primary text-white"
                      : "border-border-20 bg-white",
                  )}
                  aria-hidden
                >
                  {agreed && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                <span>리노벨 운영정책 동의</span>
              </button>
              <Link
                href="/guide"
                className="rounded text-body3_400 text-on-surface-10 underline hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                보기
              </Link>
            </div>
          }
          trailingButtons={[
            { label: "취소", closeOnSelect: true },
            {
              label: "동의하고 계속하기",
              tone: "primary",
              onClick: handleConfirm,
              disabled: !agreed,
            },
          ]}
        />
      </DialogContent>
    </Dialog>
  );
}
