"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { PreviewScreen } from "@/components/editor/PreviewScreen";
import { IPhone15ProFrame } from "@/components/preview/IPhone15ProFrame";
import { ICONS } from "@/lib/icons";
import { INITIAL_SCRIPT } from "@/lib/initialScript";
import {
  clampPlaybackIndex,
  findSceneBlockIndex,
} from "@/lib/preview-playback";
import { hydrateSeriesPersonaFromSession } from "@/store/useEditorStore";
import { parseScriptToBlocks } from "@/utils/scriptParser";
import type { ChoiceItem } from "@/types/editor";
import type { Episode } from "@/types/episode";
import { cn } from "design-system/utils";

export interface EpisodePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  episode: Episode;
}

/**
 * 에피소드 목록 — 상세 우측 폰 미리보기만 모달로 확인.
 * 원고 데이터는 상세와 동일하게 INITIAL_SCRIPT 더미를 사용한다.
 */
export function EpisodePreviewModal({
  open,
  onOpenChange,
  episode,
}: EpisodePreviewModalProps) {
  const blocks = useMemo(() => {
    const parsed = parseScriptToBlocks(INITIAL_SCRIPT);
    return parsed.length > 0 ? parsed : [];
  }, []);

  const [playbackIndex, setPlaybackIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    hydrateSeriesPersonaFromSession();
    setPlaybackIndex(0);
  }, [open, episode.id]);

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
      const next = choice.nextScene?.trim();
      if (!next) {
        setPlaybackIndex((prev) => clampPlaybackIndex(blocks, prev + 1));
        return;
      }
      const sceneIndex = findSceneBlockIndex(blocks, next);
      if (sceneIndex >= 0) {
        setPlaybackIndex(sceneIndex);
        return;
      }
      setPlaybackIndex((prev) => clampPlaybackIndex(blocks, prev + 1));
    },
    [blocks],
  );

  const title = `${episode.episodeNumber}화 ${episode.title}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex w-auto max-w-[min(100vw-2rem,380px)] flex-col items-center gap-0 border-0 bg-transparent p-0 shadow-none",
          "max-lg:max-w-none",
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title} 미리보기</DialogTitle>
        </DialogHeader>

        <div className="relative flex flex-col items-center gap-3">
          <IconButton
            type="button"
            variant="outline"
            shape="circle"
            size="icon-sm"
            icon={ICONS.close}
            aria-label="미리보기 닫기"
            className="absolute -right-1 -top-1 z-dropdown bg-background shadow-elevation-20"
            onClick={() => onOpenChange(false)}
          />
          <IPhone15ProFrame>
            <PreviewScreen
              blocks={blocks}
              focusedBlockId={focusedBlockId}
              interactive
              progressLabel={progressLabel}
              onTapAdvance={handleAdvance}
              onChoiceSelect={handleChoiceSelect}
            />
          </IPhone15ProFrame>
        </div>
      </DialogContent>
    </Dialog>
  );
}
