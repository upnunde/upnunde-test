"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ICONS } from "@/lib/icons";
import type { ChoiceItem } from "@/types/editor";
import { PreviewScreen } from "@/components/editor/PreviewScreen";
import {
  EDITOR_MOBILE_FAB_BOTTOM_ABOVE_PANEL_TOGGLE_CLASS,
  EDITOR_MOBILE_FAB_BUTTON_CLASS,
  EDITOR_MOBILE_FAB_RIGHT_CLASS,
  EDITOR_MOBILE_FAB_SIZE_CLASS,
  EDITOR_MOBILE_PREVIEW_HINT_BOTTOM_CLASS,
} from "@/components/editor/editor-mobile-floating-layout";
import {
  PREVIEW_END_HINT_BADGE_CLASS,
  PREVIEW_HINT_BADGE_CLASS,
  PREVIEW_MOBILE_SHELL_CLASS,
} from "@/lib/preview-overlay-styles";
import { useMobilePreviewScrollLock } from "@/hooks/useMobilePreviewScrollLock";
import { useEditorStore } from "@/store/useEditorStore";
import {
  clampPlaybackIndex,
  findSceneBlockIndex,
  resolvePlaybackIndexFromFocus,
} from "@/lib/preview-playback";
import { cn } from "design-system/utils";

export interface EditorMobilePreviewPlayerProps {
  /** 미리보기 탭 활성 시 재생 위치 초기화 */
  isActive: boolean;
}

/** 모바일 에디터 — 풀화면 탭 진행 미리보기 */
export function EditorMobilePreviewPlayer({ isActive }: EditorMobilePreviewPlayerProps) {
  useMobilePreviewScrollLock(isActive);
  const blocks = useEditorStore((s) => s.blocks);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [showTapHint, setShowTapHint] = useState(true);

  const resetPlayback = useCallback(() => {
    setPlaybackIndex(0);
    setShowTapHint(true);
  }, []);

  const syncPlaybackFromFocus = useCallback(() => {
    const { blocks: currentBlocks, focusBlockId: currentFocusId } = useEditorStore.getState();
    setPlaybackIndex(resolvePlaybackIndexFromFocus(currentBlocks, currentFocusId));
  }, []);

  useEffect(() => {
    if (!isActive) return;
    setShowTapHint(true);
    syncPlaybackFromFocus();
  }, [isActive, syncPlaybackFromFocus]);

  useEffect(() => {
    setPlaybackIndex((prev) => clampPlaybackIndex(blocks, prev));
  }, [blocks]);

  const safeIndex = clampPlaybackIndex(blocks, playbackIndex);
  const focusedBlock = blocks[safeIndex] ?? null;
  const focusedBlockId = focusedBlock?.id ?? null;
  const isChoiceStep = focusedBlock?.type === "choice";
  const isAtEnd = blocks.length > 0 && safeIndex >= blocks.length - 1;
  const canTapAdvance = !isChoiceStep && !isAtEnd && blocks.length > 0;

  const progressLabel = useMemo(() => {
    if (blocks.length === 0) return "0 / 0";
    return `${safeIndex + 1} / ${blocks.length}`;
  }, [blocks.length, safeIndex]);

  const handleAdvance = useCallback(() => {
    setShowTapHint(false);
    if (!canTapAdvance) return;
    setPlaybackIndex((prev) => clampPlaybackIndex(blocks, prev + 1));
  }, [blocks, canTapAdvance]);

  const handleChoiceSelect = useCallback(
    (choice: ChoiceItem) => {
      const fromIndex = safeIndex;
      const sceneIdx = findSceneBlockIndex(blocks, choice.nextScene);
      if (sceneIdx >= 0) {
        setPlaybackIndex(sceneIdx);
        return;
      }
      setPlaybackIndex(clampPlaybackIndex(blocks, fromIndex + 1));
    },
    [blocks, safeIndex],
  );

  return (
    <div className={cn("relative", PREVIEW_MOBILE_SHELL_CLASS)}>
      <button
        type="button"
        onClick={resetPlayback}
        disabled={blocks.length === 0}
        className={cn(
          "fixed z-modal lg:hidden",
          EDITOR_MOBILE_FAB_RIGHT_CLASS,
          EDITOR_MOBILE_FAB_BOTTOM_ABOVE_PANEL_TOGGLE_CLASS,
          EDITOR_MOBILE_FAB_SIZE_CLASS,
          EDITOR_MOBILE_FAB_BUTTON_CLASS,
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        aria-label="처음부터"
      >
        <ICONS.rotateCcw className="h-5 w-5 shrink-0" aria-hidden />
      </button>

      {blocks.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-5 text-center text-body3_400 preview-text-placeholder">
          원고를 작성하면 미리볼 수 있어요
        </div>
      ) : (
        <PreviewScreen
          blocks={blocks}
          focusedBlockId={focusedBlockId}
          progressLabel={progressLabel}
          interactive
          onTapAdvance={handleAdvance}
          onChoiceSelect={handleChoiceSelect}
        />
      )}

      {canTapAdvance && showTapHint ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 z-overlay flex justify-center",
            EDITOR_MOBILE_PREVIEW_HINT_BOTTOM_CLASS,
            focusedBlock?.type === "text" &&
              "max-lg:bottom-[calc(var(--space-4)+3rem+var(--space-9)+env(safe-area-inset-bottom,0px)+var(--app-keyboard-inset,var(--app-vv-bottom,0px)))]",
          )}
        >
          <span className={PREVIEW_HINT_BADGE_CLASS}>
            화면을 탭해 다음으로
          </span>
        </div>
      ) : null}

      {isAtEnd && blocks.length > 0 ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 z-overlay flex justify-center",
            EDITOR_MOBILE_PREVIEW_HINT_BOTTOM_CLASS,
          )}
        >
          <span className={PREVIEW_END_HINT_BADGE_CLASS}>
            미리보기가 끝났어요
          </span>
        </div>
      ) : null}
    </div>
  );
}
