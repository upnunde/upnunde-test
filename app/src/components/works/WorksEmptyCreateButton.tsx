"use client";

import { Button } from "design-system/ui/button";

const containerClassName =
  "flex h-full min-h-[241px] w-full flex-col items-center justify-center gap-3 rounded-sm border-2 border-dashed border-border";

export interface WorksEmptyCreateButtonProps {
  hint: string;
  actionLabel: string;
  onClick?: () => void;
  secondaryActionLabel?: string;
  onSecondaryClick?: () => void;
}

/**
 * 내 작품 영역 — 작품이 없을 때 노출하는 점선 박스 + 생성 CTA (시리즈 목록과 동일 스타일)
 */
export function WorksEmptyCreateButton({
  hint,
  actionLabel,
  onClick,
  secondaryActionLabel,
  onSecondaryClick,
}: WorksEmptyCreateButtonProps) {
  const hasSecondary = Boolean(secondaryActionLabel && onSecondaryClick);

  if (hasSecondary) {
    return (
      <div className={containerClassName}>
        <span className="text-body3_400 text-foreground-placeholder">{hint}</span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button type="button" variant="default" shape="square" size="default" onClick={onClick}>
            {actionLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            shape="square"
            size="default"
            onClick={onSecondaryClick}
          >
            {secondaryActionLabel}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <span className="text-body3_400 text-foreground-placeholder">{hint}</span>
      <Button type="button" variant="default" shape="square" size="default" onClick={onClick}>
        {actionLabel}
      </Button>
    </div>
  );
}
