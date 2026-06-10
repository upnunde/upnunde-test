"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import type { ChoiceItem } from "@/types/editor";
import { PreviewScreen } from "@/components/editor/PreviewScreen";
import {
  EDITOR_MOBILE_FAB_BOTTOM_ABOVE_PANEL_TOGGLE_CLASS,
  EDITOR_MOBILE_FAB_BUTTON_CLASS,
  EDITOR_MOBILE_FAB_RIGHT_CLASS,
  EDITOR_MOBILE_FAB_SIZE_CLASS,
} from "@/components/editor/editor-mobile-floating-layout";
import { useEditorStore } from "@/store/useEditorStore";
import {
  clampPlaybackIndex,
  findSceneBlockIndex,
  resolvePlaybackIndexFromFocus,
} from "@/lib/preview-playback";
import { cn } from "@/lib/utils";

export interface EditorMobilePreviewPlayerProps {
  /** 미리보기 탭 활성 시 재생 위치 초기화 */
  isActive: boolean;
}

/** 모바일 에디터 — 풀화면 탭 진행 미리보기 */
export function EditorMobilePreviewPlayer({ isActive }: EditorMobilePreviewPlayerProps) {
  const blocks = useEditorStore((s) => s.blocks);
  const [playbackIndex, setPlaybackIndex] = useState(0);

  const resetPlayback = useCallback(() => {
    setPlaybackIndex(0);
  }, []);

  const syncPlaybackFromFocus = useCallback(() => {
    const { blocks: currentBlocks, focusBlockId: currentFocusId } = useEditorStore.getState();
    setPlaybackIndex(resolvePlaybackIndexFromFocus(currentBlocks, currentFocusId));
  }, []);

  useEffect(() => {
    if (isActive) syncPlaybackFromFocus();
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
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center px-my-16 py-my-12">
        <span className="rounded-full bg-black/50 px-my-12 py-my-4 text-caption1_400 text-white/80 backdrop-blur-sm">
          {progressLabel}
        </span>
      </div>

      <button
        type="button"
        onClick={resetPlayback}
        disabled={blocks.length === 0}
        className={cn(
          "fixed z-40 lg:hidden",
          EDITOR_MOBILE_FAB_RIGHT_CLASS,
          EDITOR_MOBILE_FAB_BOTTOM_ABOVE_PANEL_TOGGLE_CLASS,
          EDITOR_MOBILE_FAB_SIZE_CLASS,
          EDITOR_MOBILE_FAB_BUTTON_CLASS,
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        aria-label="처음부터"
      >
        <RotateCcw className="h-5 w-5 shrink-0" aria-hidden />
      </button>

      {blocks.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-my-16 lg:px-my-20 text-center text-body3_400 text-on-surface-30">
          원고를 작성하면 미리볼 수 있어요
        </div>
      ) : (
        <PreviewScreen
          blocks={blocks}
          focusedBlockId={focusedBlockId}
          interactive
          onTapAdvance={handleAdvance}
          onChoiceSelect={handleChoiceSelect}
        />
      )}

      {canTapAdvance ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-24 z-30 flex justify-center",
            focusedBlock?.type === "text" && "bottom-36",
          )}
        >
          <span className="rounded-full bg-black/45 px-my-12 py-my-4 text-caption2_400 text-white/70 backdrop-blur-sm">
            화면을 탭해 다음으로
          </span>
        </div>
      ) : null}

      {isAtEnd && blocks.length > 0 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-30 flex justify-center">
          <span className="rounded-full bg-black/55 px-my-16 py-my-8 text-caption1_400 text-white/85 backdrop-blur-sm">
            미리보기가 끝났어요
          </span>
        </div>
      ) : null}
    </div>
  );
}
