"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { AiFieldLoadingMessage } from "@/components/episode/EpisodeAiFieldLoading";
import { EPISODE_FORM_FIELD_COPY } from "@/lib/episode-form-copy";
import {
  SERIES_FORM_MOBILE_COMPOSER_FIXED_INSET_CLASS,
  SERIES_FORM_MOBILE_FLOATING_ROW_BOTTOM_CLASS,
} from "@/lib/series-form-mobile-layout";
import { cn } from "@/lib/utils";

export type FloatingComposerBarPlacement = "fixed" | "sticky";

/** 플로팅 AI 입력 바 전용 최대 너비 (에피소드 폼 카드 너비와 무관) */
export const FLOATING_COMPOSER_MAX_WIDTH_CLASS = "max-w-[560px] w-full";

/** fixed 배치 가로 폭·정렬 — safe-area·20px 양쪽 여백, 가로 화면(landscape) 대응 */
const FLOATING_COMPOSER_FIXED_WIDTH_CLASS =
  "left-1/2 -translate-x-1/2 w-[min(560px,calc(100dvw-env(safe-area-inset-left,0px)-env(safe-area-inset-right,0px)-2*var(--spacing-my-20)))]";

/** 미리보기 FAB와 겹치지 않도록 우측 inset 확보 */
const FLOATING_COMPOSER_FIXED_WIDTH_WITH_MOBILE_FAB_LANE_CLASS =
  "left-[max(var(--spacing-my-20),env(safe-area-inset-left,0px))] right-[calc(var(--spacing-my-16)+3rem+var(--spacing-my-8)+env(safe-area-inset-right,0px))] w-auto max-w-[560px] translate-x-0";

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
  /** 모바일 고정 제출 바 위에 쌓을 때 */
  stackAboveMobileSubmitBar?: boolean;
  /** 모바일 미리보기 FAB와 겹치지 않도록 우측 inset 확보 */
  reserveMobileFabLane?: boolean;
  maxWidthClassName?: string;
  className?: string;
  ariaLabel?: string;
}

const shellShadow =
  "shadow-[0_-2px_12px_rgba(15,23,42,0.06),0_8px_24px_rgba(15,23,42,0.08)]";

/** 플로팅 컴포저 pill 한 줄 높이 */
const COMPOSER_BAR_HEIGHT_CLASS = "h-[48px]";

/**
 * fixed 배치 하단 앵커 — 모바일: 20px + safe-area + 브라우저/키보드 크롬 · 데스크톱: 20px
 */
const FLOATING_COMPOSER_FIXED_BOTTOM_CLASS =
  "max-lg:bottom-[calc(var(--spacing-my-20)+env(safe-area-inset-bottom,0px)+var(--app-keyboard-inset,var(--app-vv-bottom,0px)))] lg:bottom-my-20";

const FLOATING_COMPOSER_FIXED_ABOVE_SUBMIT_BAR_BOTTOM_CLASS =
  `${SERIES_FORM_MOBILE_FLOATING_ROW_BOTTOM_CLASS} lg:bottom-my-20`;

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
  stackAboveMobileSubmitBar = false,
  reserveMobileFabLane = false,
  maxWidthClassName = FLOATING_COMPOSER_MAX_WIDTH_CLASS,
  className,
  ariaLabel = "에피소드 AI 초안 입력",
}: FloatingComposerBarProps) {
  const fixedBottomClass = stackAboveMobileSubmitBar
    ? FLOATING_COMPOSER_FIXED_ABOVE_SUBMIT_BAR_BOTTOM_CLASS
    : FLOATING_COMPOSER_FIXED_BOTTOM_CLASS;
  const fixedWidthClass =
    stackAboveMobileSubmitBar && reserveMobileFabLane
      ? SERIES_FORM_MOBILE_COMPOSER_FIXED_INSET_CLASS
      : reserveMobileFabLane
        ? FLOATING_COMPOSER_FIXED_WIDTH_WITH_MOBILE_FAB_LANE_CLASS
        : FLOATING_COMPOSER_FIXED_WIDTH_CLASS;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wasFocusedRef = useRef(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isMultiline, setIsMultiline] = useState(false);

  const isEmpty = value.trim().length === 0;
  const canSubmit = !isEmpty && !submitDisabled && !disabled && !isLoading;
  const showSendButton = !isEmpty && !isLoading;
  const showExpandedLayout = isMultiline && !isLoading;

  const shellRadiusClass = showExpandedLayout ? "rounded-[22px]" : "rounded-full";

  const hasExplicitMultiline = (text: string) => {
    const trimmed = text.replace(/\n+$/, "");
    return trimmed.includes("\n");
  };

  const syncComposerLayout = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    if (isLoading) {
      setIsMultiline(false);
      el.style.height = "";
      el.style.overflowY = "hidden";
      return;
    }

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
  }, [value, isLoading]);

  const restoreFocusIfNeeded = useCallback(() => {
    const el = textareaRef.current;
    if (!wasFocusedRef.current || !el || document.activeElement === el) return;
    el.focus({ preventScroll: true });
  }, []);

  const resetLayoutStyles = useCallback(() => {
    setIsMultiline(false);
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "";
    el.style.overflowY = "hidden";
  }, []);

  const resetToDefaultLayout = useCallback(
    (options?: { blur?: boolean }) => {
      resetLayoutStyles();
      if (!options?.blur) return;
      wasFocusedRef.current = false;
      setIsFocused(false);
      textareaRef.current?.blur();
    },
    [resetLayoutStyles],
  );

  useLayoutEffect(() => {
    syncComposerLayout();
    restoreFocusIfNeeded();
  }, [syncComposerLayout, restoreFocusIfNeeded]);

  /** 단일 줄 레이아웃으로 바뀐 뒤 한 번 더 측정해 pill 형태로 복원 */
  useLayoutEffect(() => {
    if (isMultiline) return;
    syncComposerLayout();
    restoreFocusIfNeeded();
  }, [isMultiline, syncComposerLayout, restoreFocusIfNeeded]);

  /** 모바일 키보드·브라우저 크롬 변화 시 fixed 재배치로 포커스가 풀리는 경우 복원 */
  useEffect(() => {
    if (!isFocused) return;
    const vv = window.visualViewport;
    if (!vv) return;

    const keepFocus = () => {
      restoreFocusIfNeeded();
    };

    vv.addEventListener("resize", keepFocus);
    vv.addEventListener("scroll", keepFocus);
    return () => {
      vv.removeEventListener("resize", keepFocus);
      vv.removeEventListener("scroll", keepFocus);
    };
  }, [isFocused, restoreFocusIfNeeded]);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    onSubmit();
  }, [canSubmit, onSubmit]);

  /** 생성 시작 시 확장 레이아웃을 pill 기본 크기로 접음 */
  useLayoutEffect(() => {
    if (!isLoading) return;
    resetToDefaultLayout({ blur: true });
  }, [isLoading, resetToDefaultLayout]);

  /** 생성 완료 후 부모가 value를 비우면 pill 기본 레이아웃으로 복원 (포커스는 유지) */
  useLayoutEffect(() => {
    if (isLoading || value) return;
    resetLayoutStyles();
  }, [isLoading, resetLayoutStyles, value]);

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
        "z-30 pointer-events-auto",
        placement === "fixed"
          ? `fixed ${fixedWidthClass} ${fixedBottomClass}`
          : maxWidthClassName,
        placement === "sticky" &&
          "sticky bottom-0 w-full shrink-0 bg-gradient-to-t from-surface-20 from-40% via-surface-20/95 to-transparent py-my-24",
        className,
      )}
    >
      <div
        className={cn(
          "composer-bar-gradient-inner",
          placement === "sticky" && "mb-my-20",
          shellRadiusClass,
          shellShadow,
          "grid pl-my-16 grid-cols-[1fr_auto] pr-my-8",
          showExpandedLayout
            ? "gap-x-my-8 gap-y-my-8 py-my-8"
            : `${COMPOSER_BAR_HEIGHT_CLASS} items-center gap-my-8 py-0`,
          isFocused && "ring-0",
          disabled && "opacity-70",
        )}
        role="group"
        aria-label={ariaLabel}
        aria-busy={isLoading}
      >
        <div
          className={cn(
            "relative col-start-1 row-start-1 min-w-0",
            showExpandedLayout ? "col-span-full" : "flex items-center self-stretch",
          )}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => {
              wasFocusedRef.current = true;
              setIsFocused(true);
            }}
            onBlur={() => {
              wasFocusedRef.current = false;
              setIsFocused(false);
            }}
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
                : "min-h-5 py-0 leading-5",
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
            "col-start-2 flex shrink-0 items-center justify-center",
            showExpandedLayout
              ? "col-span-full row-start-2 w-full justify-end pt-my-2"
              : "row-start-1 self-center",
            !showSendButton && !showExpandedLayout && "invisible pointer-events-none",
          )}
        >
          {sendButton}
        </div>
      </div>
    </div>
  );
}

/** 플로팅 컴포저가 열린 페이지 스크롤 영역 하단 여백 */
export const FLOATING_COMPOSER_SCROLL_PAD_CLASS =
  "max-lg:pb-[calc(var(--spacing-my-20)+3rem+env(safe-area-inset-bottom,0px)+var(--app-keyboard-inset,var(--app-vv-bottom,0px)))] lg:pb-[calc(var(--spacing-my-20)+3rem)]";
