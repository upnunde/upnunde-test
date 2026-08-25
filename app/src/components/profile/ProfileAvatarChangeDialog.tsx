"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "design-system/utils";

const SHEET_ROW_CLASS =
  "flex min-h-12 w-full items-center justify-center px-5 py-3.5 text-body1_500";

export function ProfileAvatarChangeDialog({
  open,
  onOpenChange,
  canDelete,
  onUpload,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canDelete: boolean;
  onUpload: () => void;
  onDelete: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "w-[min(calc(100%-2rem),320px)] gap-0 overflow-hidden rounded-2xl p-0",
          "border border-border bg-background text-foreground sm:max-w-[320px]",
        )}
      >
        <div className="divide-y divide-divider">
          <div className={SHEET_ROW_CLASS}>
            <DialogTitle className="text-center text-body1_700 text-foreground">
              프로필 사진 바꾸기
            </DialogTitle>
            <DialogDescription className="sr-only">
              사진을 업로드하거나 현재 사진을 삭제할 수 있습니다.
            </DialogDescription>
          </div>

          <button
            type="button"
            className={cn(SHEET_ROW_CLASS, "text-primary hover:bg-muted")}
            onClick={() => {
              onOpenChange(false);
              onUpload();
            }}
          >
            사진 업로드
          </button>

          <button
            type="button"
            disabled={!canDelete}
            className={cn(
              SHEET_ROW_CLASS,
              "text-destructive hover:bg-muted",
              "disabled:pointer-events-none disabled:opacity-40",
            )}
            onClick={() => {
              onOpenChange(false);
              onDelete();
            }}
          >
            현재 사진 삭제
          </button>

          <DialogClose className={cn(SHEET_ROW_CLASS, "text-foreground hover:bg-muted")}>
            취소
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
