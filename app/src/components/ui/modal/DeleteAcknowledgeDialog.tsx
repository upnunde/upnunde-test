"use client";

import { useEffect, useState } from "react";
import { Button } from "design-system/ui/button";
import { Input } from "design-system/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmInputGuideHint } from "@/components/ui/modal/ModalConfirmPhraseField";
import { CONFIRM_INPUT_PHRASE } from "@/lib/deleteConfirmPhrase";

export interface DeleteAcknowledgeDialogProps {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
}

/** DS DialogAcknowledge와 동일 구조 — 확인 안내를 description 줄바꿈에 포함 */
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
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>취소</DialogClose>
          <Button variant="default" tone="destructive" disabled={!ready} onClick={handleConfirm}>
            동의하고 삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
