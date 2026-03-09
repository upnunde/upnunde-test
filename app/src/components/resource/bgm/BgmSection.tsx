"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { BgmListItem } from "./BgmListItem";
import { BgmListModal } from "./BgmListModal";
import type { BgmResource } from "@/types/resource";

/** "00:00" 형식을 초로 변환 */
function parseDurationToSeconds(duration: string): number {
  const parts = duration.trim().split(":");
  if (parts.length >= 2) {
    const m = parseInt(parts[0], 10) || 0;
    const s = parseInt(parts[1], 10) || 0;
    return m * 60 + s;
  }
  return 0;
}

/** [정책 8, 9, 10] BGM 전용 섹션. 리스트 형태, [+ 추가하기] → 팝업, 항목별 미리듣기/삭제. */
export interface BgmSectionProps {
  title: string;
  description: string;
  emptyMessage: string;
  addButtonLabel: string;
  /** 리스트 상단 카테고리 라벨 (예: 로맨스) */
  categoryTitle?: string;
  items: BgmResource[];
  onDelete: (item: BgmResource) => void;
  onAddFromModal: (item: BgmResource) => void;
}

export function BgmSection({
  title,
  description,
  emptyMessage,
  addButtonLabel,
  categoryTitle = "로맨스",
  items,
  onDelete,
  onAddFromModal,
}: BgmSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playingItem = items.find((i) => i.id === playingId);
  const totalSeconds = playingItem ? parseDurationToSeconds(playingItem.duration) : 0;

  useEffect(() => {
    if (playingId && !items.some((i) => i.id === playingId)) {
      setPlayingId(null);
      setIsPaused(false);
      setCurrentTime(0);
    }
  }, [items, playingId]);

  useEffect(() => {
    if (!playingId || isPaused || totalSeconds <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1;
        if (next >= totalSeconds) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setIsPaused(true);
          return totalSeconds;
        }
        return next;
      });
    }, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [playingId, isPaused, totalSeconds]);

  const handlePlay = (item: BgmResource) => {
    if (playingId === item.id) {
      setIsPaused(false);
      return;
    }
    setPlayingId(item.id);
    setIsPaused(false);
    setCurrentTime(0);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleAddFromModal = (trackId: string, title: string, duration: string) => {
    onAddFromModal({ id: trackId, title, duration });
  };

  return (
    <>
      <div className="w-full max-w-[1400px] min-w-[800px] bg-surface-10 rounded-2xl border border-border-10 flex flex-col justify-start items-start">
        <div className="w-full self-stretch px-5 pt-5 pb-3 border-b border-border-10 inline-flex justify-between items-center gap-0">
          <div className="inline-flex flex-col justify-start items-start gap-1">
            <h2 className="text-on-surface-10 text-base font-bold font-['Pretendard_JP'] leading-6">
              {title}
            </h2>
            <p className="text-on-surface-30 text-[13px] font-normal font-['Pretendard_JP'] leading-4">
              {description}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 border-border-20 text-on-surface-10 shrink-0"
            onClick={() => setModalOpen(true)}
          >
            추가하기
          </Button>
        </div>
        {items.length === 0 ? (
          <div className="self-stretch h-36 p-5 rounded-2xl flex flex-col justify-center items-center gap-4">
            <p className="text-on-surface-30 text-sm font-normal font-['Pretendard_JP'] leading-5">
              {emptyMessage}
            </p>
            <Button
              type="button"
              variant="outline"
              className="h-10 min-w-20 px-3 rounded-md border border-border-20 text-on-surface-10"
              onClick={() => setModalOpen(true)}
            >
              {addButtonLabel}
            </Button>
          </div>
        ) : (
          <div className="self-stretch p-5 rounded-2xl inline-flex flex-col justify-start items-start gap-2">
            <div className="justify-center text-on-surface-10 text-base font-bold font-['Pretendard_JP'] leading-5">
              {categoryTitle}
            </div>
            <div className="self-stretch inline-flex justify-start items-start gap-10">
              <div className="flex-1 inline-flex flex-col justify-start items-start gap-0">
                {items
                  .filter((_, i) => i % 2 === 0)
                  .map((item, idx) => (
                    <BgmListItem
                      key={item.id}
                      variant="default"
                      item={item}
                      index={idx * 2 + 1}
                      isActive={playingId === item.id}
                      isPlaying={playingId === item.id && !isPaused}
                      currentTime={playingId === item.id ? currentTime : 0}
                      onPlay={handlePlay}
                      onPause={handlePause}
                      onSeek={playingId === item.id ? setCurrentTime : undefined}
                      onDelete={onDelete}
                    />
                  ))}
              </div>
              <div className="flex-1 inline-flex flex-col justify-start items-start gap-0">
                {items
                  .filter((_, i) => i % 2 === 1)
                  .map((item, idx) => (
                    <BgmListItem
                      key={item.id}
                      variant="default"
                      item={item}
                      index={idx * 2 + 2}
                      isActive={playingId === item.id}
                      isPlaying={playingId === item.id && !isPaused}
                      currentTime={playingId === item.id ? currentTime : 0}
                      onPlay={handlePlay}
                      onPause={handlePause}
                      onSeek={playingId === item.id ? setCurrentTime : undefined}
                      onDelete={onDelete}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <BgmListModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddFromModal}
      />
    </>
  );
}
