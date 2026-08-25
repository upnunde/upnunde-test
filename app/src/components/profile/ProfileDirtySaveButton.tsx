"use client";

import { PAGE_FOOTER_ACTION_BUTTON_CLASS } from "@/lib/page-layout";
import { Button } from "design-system/ui/button";
import { cn } from "design-system/utils";

/** 값이 바뀌었을 때만 노출하는 프로필·정산 공통 저장 버튼 */
export function ProfileDirtySaveButton({
  visible,
  onClick,
}: {
  visible: boolean;
  onClick: () => void;
}) {
  if (!visible) return null;
  return (
    <div className="flex justify-end">
      <Button
        type="button"
        className={cn("h-9 shrink-0 px-4", PAGE_FOOTER_ACTION_BUTTON_CLASS)}
        onClick={onClick}
      >
        저장하기
      </Button>
    </div>
  );
}
