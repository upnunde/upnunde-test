"use client";

const containerClassName =
  "flex h-full min-h-[241px] w-full flex-col items-center justify-center gap-my-12 rounded-[4px] border-2 border-dashed border-border-10";

const primaryActionClassName =
  "inline-flex items-center gap-my-8 rounded-md bg-slate-800 px-my-16 py-my-8 text-body3_500 text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

const secondaryActionClassName =
  "inline-flex items-center gap-my-8 rounded-md border border-border-20 bg-white px-my-16 py-my-8 text-body3_500 text-on-surface-20 hover:bg-surface-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:border-border-20";

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
        <span className="text-body3_400 text-on-surface-30">{hint}</span>
        <div className="flex flex-wrap items-center justify-center gap-my-8">
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
      className={`${containerClassName} cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`}
    >
      <span className="text-body3_400 text-on-surface-30">{hint}</span>
      <span className={primaryActionClassName}>{actionLabel}</span>
    </button>
  );
}
