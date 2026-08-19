"use client";

import { useEffect, useId, useState } from "react";
import { Button } from "design-system/ui/button";
import { Checkbox } from "design-system/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogNoticeList } from "design-system/ui/dialog-patterns";
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
  const consentId = useId();

  useEffect(() => {
    if (!open) setAgreed(false);
  }, [open]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setAgreed(false);
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!agreed) return;
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 p-0">
        <DialogHeader className="w-full px-5 pt-5 pb-2">
          <DialogTitle>잠깐! 시작하기 전 체크</DialogTitle>
          <DialogDescription>
            즐거운 콘텐츠 창작 전, 아래 내용을 꼭 확인해 주세요!
          </DialogDescription>
        </DialogHeader>

        <div className="grid w-full gap-3 px-5 py-2">
          <div className="w-full rounded-lg bg-background-muted px-2 py-3 text-left">
            <DialogNoticeList items={POLICIES} />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id={consentId}
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
            />
            <Label htmlFor={consentId} className="text-body4_400 leading-5">
              <span>리노벨 운영정책 동의</span>{" "}
              <a
                href="/guide"
                className="text-primary underline underline-offset-3"
                target="_blank"
                rel="noreferrer"
              >
                보기
              </a>
            </Label>
          </div>
        </div>

        <DialogFooter className="mx-0 mb-0 px-5 pt-2 pb-5">
          <DialogClose render={<Button variant="outline" />}>취소</DialogClose>
          <Button disabled={!agreed} onClick={handleConfirm}>
            동의하고 계속하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
