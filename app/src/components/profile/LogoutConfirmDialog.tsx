"use client";

import { Button } from "design-system/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function LogoutConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0">
        <DialogHeader className="w-full px-5 pt-5 pb-2">
          <DialogTitle>로그아웃할까요?</DialogTitle>
          <DialogDescription>
            작성 중인 원고는 저장된 내용까지 유지돼요.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mx-0 mb-0 px-5 pt-5 pb-5">
          <DialogClose render={<Button variant="outline" />}>취소</DialogClose>
          <Button
            variant="default"
            tone="destructive"
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
          >
            로그아웃
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
