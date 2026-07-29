"use client";

import React, { useId, useState } from "react";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "design-system/ui/button";
import {
  ModalFooterButtons,
  ModalHeader,
  modalDialogContentClassName,
} from "@/components/ui/modal";
import { Checkbox } from "design-system/ui/checkbox";
import { Label } from "design-system/ui/label";

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
  const agreementId = useId();

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
          className="w-full px-6 pb-4"
        >
          <div className="w-full rounded-lg bg-muted px-4 py-3">
            <ol className="list-decimal list-inside space-y-2 text-body3_400 text-foreground-muted">
              {POLICIES.map((text, i) => (
                <li key={i}>{text}</li>
              ))}
            </ol>
          </div>
        </div>

        <ModalFooterButtons
          layout="end"
          body={
            <div className="flex w-full items-center justify-between gap-2 bg-background px-6 py-2">
              <Label
                htmlFor={agreementId}
                className="cursor-pointer text-body3_400 text-foreground-muted"
              >
                <Checkbox
                  id={agreementId}
                  checked={agreed}
                  onCheckedChange={setAgreed}
                />
                리노벨 운영정책 동의
              </Label>
              <Button
                variant="link"
                size="sm"
                render={<Link href="/guide" />}
                nativeButton={false}
              >
                보기
              </Button>
            </div>
          }
          trailingButtons={[
            { label: "취소", closeOnSelect: true, onClick: handleClose },
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
