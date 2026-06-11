"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { AiFieldLoadingMessage } from "@/components/episode/EpisodeAiFieldLoading";
import { EPISODE_FORM_FIELD_COPY } from "@/lib/episode-form-copy";
import { cn } from "@/lib/utils";

export type FloatingComposerBarPlacement = "fixed" | "sticky";

/** 플로팅 AI 입력 바 전용 최대 너비 (에피소드 폼 카드 너비와 무관) */
export const FLOATING_COMPOSER_MAX_WIDTH_CLASS = "max-w-[560px] w-full";

const COMPOSER_TEXTAREA_MAX_HEIGHT_PX = 120;
/** text-sm leading-5 한 줄 line-height */
const COMPOSER_LINE_HEIGHT_PX = 20;
/** 한 줄일 때 scrollHeight 상한 */
const COMPOSER_SINGLE_LINE_SCROLL_MAX_PX = COMPOSER_LINE_HEIGHT_PX + 8;

export interface FloatingComposerBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  submitDisabled?: boolean;
  isLoading?: boolean;
  loadingMessage?: string;
  placement?: FloatingComposerBarPlacement;
  maxWidthClassName?: string;
  className?: string;
  ariaLabel?: string;
}

const shellShadow =
  "shadow-[0_-2px_12px_rgba(15,23,42,0.06),0_8px_24px_rgba(15,23,42,0.08)]";

/**
 * 플로팅 AI 프롬프트 바 — 기본: 첨부 pill(한 줄 + 우측 전송).
 * 줄바꿈(2줄 이상) 시에만 Gemini형 확장 레이아웃(max 120px).
 */
export function FloatingComposerBar({
  value,
  onChange,
  onSubmit,
  placeholder = "AI로 에피소드 내용을 작성해 보세요.",
  disabled = false,
  submitDisabled = false,
  isLoading = false,
  loadingMessage = EPISODE_FORM_FIELD_COPY.aiComposer.fieldLoading.composer,
  placement = "fixed",
  maxWidthClassName = FLOATING_COMPOSER_MAX_WIDTH_CLASS,
  className,
  ariaLabel = "에피소드 AI 초안 입력",
}: FloatingComposerBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isMultiline, setIsMultiline] = useState(false);

  const isEmpty = value.trim().length === 0;
  const canSubmit = !isEmpty && !submitDisabled && !disabled && !isLoading;
  const showExpandedLayout = isMultiline;

  const shellRadiusClass = showExpandedLayout ? "rounded-[22px]" : "rounded-full";

  const hasExplicitMultiline = (text: string) => {
    const trimmed = text.replace(/\n+$/, "");
    return trimmed.includes("\n");
  };

  const syncComposerLayout = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    if (!value) {
      setIsMultiline(false);
      el.style.height = "";
      el.style.overflowY = "hidden";
      return;
    }

    el.style.height = "auto";
    const scrollHeight = el.scrollHeight;
    const multiline =
      hasExplicitMultiline(value) ||
      scrollHeight > COMPOSER_SINGLE_LINE_SCROLL_MAX_PX;

    setIsMultiline(multiline);

    if (!multiline) {
      el.style.height = "";
      el.style.overflowY = "hidden";
      return;
    }

    const nextHeight = Math.min(
      Math.max(scrollHeight, COMPOSER_LINE_HEIGHT_PX),
      COMPOSER_TEXTAREA_MAX_HEIGHT_PX,
    );
    el.style.height = `${nextHeight}px`;
    el.style.overflowY =
      scrollHeight > COMPOSER_TEXTAREA_MAX_HEIGHT_PX ? "auto" : "hidden";
  }, [value]);

  useLayoutEffect(() => {
    syncComposerLayout();
  }, [syncComposerLayout]);

  /** 단일 줄 레이아웃으로 바뀐 뒤 한 번 더 측정해 pill 형태로 복원 */
  useLayoutEffect(() => {
    if (isMultiline) return;
    syncComposerLayout();
  }, [isMultiline, syncComposerLayout]);

  const resetToDefaultLayout = useCallback(() => {
    setIsFocused(false);
    setIsMultiline(false);
    const el = textareaRef.current;
    if (!el) return;
    el.blur();
    el.style.height = "";
    el.style.overflowY = "hidden";
  }, []);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    onSubmit();
  }, [canSubmit, onSubmit]);

  /** 생성 완료 후 부모가 value를 비우면 pill 기본 레이아웃으로 복원 */
  useLayoutEffect(() => {
    if (!isLoading && !value) {
      resetToDefaultLayout();
    }
  }, [isLoading, resetToDefaultLayout, value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const sendButton = (
    <button
      type="button"
      disabled={!canSubmit}
      onClick={handleSubmit}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full transition-all",
        canSubmit
          ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-elevation-10 hover:opacity-90"
          : "cursor-not-allowed bg-surface-20 text-on-surface-30",
      )}
      aria-label="AI로 초안 채우기"
    >
      <ArrowUp className="size-4" strokeWidth={2.25} aria-hidden />
    </button>
  );

  return (
    <div
      className={cn(
        "z-30 flex w-full justify-center px-my-20 pb-my-20 pt-my-12",
        placement === "fixed" &&
          "pointer-events-none fixed inset-x-0 max-lg:bottom-[var(--app-vv-bottom,0px)] lg:bottom-0",
        placement === "sticky" &&
          "pointer-events-auto sticky bottom-0 shrink-0 bg-gradient-to-t from-surface-20 from-40% via-surface-20/95 to-transparent pt-my-24",
        className,
      )}
    >
      <div className={cn("pointer-events-auto", maxWidthClassName)}>
        <div
          className={cn(
            "composer-bar-gradient-inner",
            shellRadiusClass,
            shellShadow,
            "grid grid-cols-[1fr_auto] pl-my-16 pr-my-8",
            showExpandedLayout
              ? "gap-x-my-8 gap-y-my-8 py-my-8"
              : "h-[42px] items-center gap-my-8 py-0",
            isFocused && "ring-0",
            disabled && "opacity-70",
          )}
          role="group"
          aria-label={ariaLabel}
          aria-busy={isLoading}
        >
          <div
            className={cn(
              "relative col-start-1 row-start-1 min-w-0 self-center",
              showExpandedLayout && "col-span-full",
            )}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              readOnly={isLoading}
              disabled={disabled}
              placeholder={`✨${placeholder}`}
              aria-label={ariaLabel}
              className={cn(
                "block min-w-0 w-full resize-none border-0 bg-transparent text-body3_400 caret-primary",
                "text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-0",
                showExpandedLayout
                ? "max-h-[120px] py-my-2"
                : "min-h-5 py-0",
                isLoading && "pointer-events-none text-transparent placeholder:text-transparent",
              )}
            />
            {isLoading ? (
              <div className="pointer-events-none absolute inset-0 flex items-center">
                <AiFieldLoadingMessage message={loadingMessage} />
              </div>
            ) : null}
          </div>
          <div
            className={cn(
              "flex shrink-0 items-center justify-center",
              showExpandedLayout
                ? "col-span-full row-start-2 w-full justify-end pt-my-2"
                : "col-start-2 row-start-1 h-[42px]",
            )}
          >
            {sendButton}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 플로팅 컴포저가 열린 모달 스크롤 영역 하단 여백 */
export const FLOATING_COMPOSER_SCROLL_PAD_CLASS = "pb-my-20";
