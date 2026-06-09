"use client";

const containerClassName =
  "flex flex-col items-center justify-center gap-3 w-full min-h-[241px] rounded-[4px] border-2 border-dashed border-border-10 bg-surface-20/50";

const primaryActionClassName =
  "inline-flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

const secondaryActionClassName =
  "inline-flex items-center gap-2 rounded-md border border-border-20 bg-white px-4 py-2 text-sm font-medium text-on-surface-20 hover:bg-surface-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:border-border-20";

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
        <span className="text-sm text-on-surface-30">{hint}</span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button type="button" onClick={onClick} className={primaryActionClassName}>
            {actionLabel}
          </button>
          <button type="button" onClick={onSecondaryClick} className={secondaryActionClassName}>
            {secondaryActionLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${containerClassName} cursor-pointer hover:bg-surface-20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`}
    >
      <span className="text-sm text-on-surface-30">{hint}</span>
      <span className={primaryActionClassName}>{actionLabel}</span>
    </button>
  );
}
