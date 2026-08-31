"use client";

import { useEffect, useState } from "react";
import { Input } from "design-system/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmInputGuideHint } from "@/components/ui/modal/ModalConfirmPhraseField";
import { ModalFooterButtons } from "@/components/ui/modal";
import { CONFIRM_INPUT_PHRASE } from "@/lib/deleteConfirmPhrase";

export interface DeleteAcknowledgeDialogProps {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
}

/** DS Dialog 정본 구조 — 확인 안내를 description 줄바꿈에 포함 */
export function DeleteAcknowledgeDialog({
  open,
  title,
  description,
  onClose,
  onConfirm,
}: DeleteAcknowledgeDialogProps) {
  const [phrase, setPhrase] = useState("");
  const ready = phrase.trim() === CONFIRM_INPUT_PHRASE;

  useEffect(() => {
    if (!open) setPhrase("");
  }, [open]);

  const handleConfirm = () => {
    if (!ready) return;
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
            {"\n\n"}
            <ConfirmInputGuideHint />
          </DialogDescription>
        </DialogHeader>
        <Input
          value={phrase}
          onChange={(event) => setPhrase(event.target.value)}
          placeholder={CONFIRM_INPUT_PHRASE}
          aria-label={`확인 문구 입력: ${CONFIRM_INPUT_PHRASE}`}
          autoComplete="off"
        />
        <ModalFooterButtons
          layout="end"
          trailingButtons={[
            { label: "취소", closeOnSelect: true },
            {
              label: "동의하고 삭제",
              tone: "destructive",
              onClick: handleConfirm,
              disabled: !ready,
            },
          ]}
        />
      </DialogContent>
    </Dialog>
  );
}
