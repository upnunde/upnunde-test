"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { FilterChip } from "@/components/ui/chip";
import { CHIP_GROUP_GAP_CLASS } from "@/lib/chip-styles";
import { PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS } from "@/lib/page-layout";
import { cn } from "@/lib/utils";
import { Title2 } from "@/components/ui/title2";
import { BgmListItem } from "./BgmListItem";
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
  items: BgmResource[];
  onDelete: (item: BgmResource) => void;
  onAddFromModal: (item: BgmResource) => void;
}

const GENRE_TABS = ["판타지", "호러", "로맨스"] as const;
const GENRE_TABS_WITH_ALL = ["전체", ...GENRE_TABS] as const;

const BgmListModal = dynamic(
  () => import("./BgmListModal").then((mod) => mod.BgmListModal),
  { ssr: false }
);

export function BgmSection({
  title,
  description,
  emptyMessage,
  addButtonLabel,
  items,
  onDelete,
  onAddFromModal,
}: BgmSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [activeGenre, setActiveGenre] = useState<string>("전체");

  const playingItem = items.find((i) => i.id === playingId);
  const totalSeconds = playingItem ? parseDurationToSeconds(playingItem.duration) : 0;

  const filteredItems = useMemo(() => {
    if (items.length === 0) return items;
    const index = GENRE_TABS.indexOf(activeGenre as (typeof GENRE_TABS)[number]);
    if (index === -1) return items;
    return items.filter((_, idx) => idx % GENRE_TABS.length === index);
  }, [items, activeGenre]);

  /** 재생 중인 항목이 items에서 사라지면 재생 상태를 초기화 — render 중 setState 패턴 */
  if (playingId && !items.some((i) => i.id === playingId)) {
    setPlayingId(null);
    setIsPaused(false);
    setCurrentTime(0);
  }

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
    setPlayingId(null);
    setIsPaused(false);
    setCurrentTime(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleAddFromModal = (trackId: string, title: string, duration: string) => {
    onAddFromModal({ id: trackId, title, duration });
  };

  return (
    <>
      <div
        className={cn(
          "mx-auto flex w-full min-w-0 max-w-[1200px] flex-col items-start justify-start rounded-[4px] border border-border-10 bg-surface-10",
          PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS,
        )}
      >
        <div className="w-full self-stretch border-b border-border-10 px-my-16 pb-my-12 pt-my-20 lg:px-my-20">
          <Title2
            text={title}
            asSectionHeader
            subtitle
            subtitleText={description}
            className="!p-0 !px-0 !border-0 !border-b-0 w-full"
            sectionEnd={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 shrink-0 border-border-20 text-on-surface-10"
                onClick={() => setModalOpen(true)}
              >
                추가하기
              </Button>
            }
          />
        </div>
        {items.length === 0 ? (
          <div className="self-stretch h-36 p-my-20 rounded-[4px] flex flex-col justify-center items-center gap-my-16">
            <p className="text-on-surface-30 text-body3_400 font-['Pretendard_JP']">
              {emptyMessage}
            </p>
            <Button
              type="button"
              variant="outline"
              className="h-9 min-w-20 px-my-12 rounded-md border border-border-20 text-on-surface-10"
              onClick={() => setModalOpen(true)}
            >
              {addButtonLabel}
            </Button>
          </div>
        ) : (
          <div className="self-stretch px-my-16 lg:px-my-20 pb-my-8 pt-my-8 rounded-[4px] flex flex-col justify-start items-start gap-my-12">
            <div className="mb-1 mt-0 w-full pt-0 pb-0">
              <div
                className={cn(
                  "flex w-full min-w-0 items-center overflow-x-auto overscroll-x-contain",
                  "max-lg:flex-nowrap max-lg:pb-my-4",
                  "lg:flex-wrap",
                  CHIP_GROUP_GAP_CLASS,
                )}
                role="tablist"
                aria-label="BGM 장르"
              >
                {GENRE_TABS_WITH_ALL.map((genre) => {
                  const isActive = genre === activeGenre;
                  return (
                    <FilterChip
                      key={genre}
                      role="tab"
                      aria-selected={isActive}
                      selected={isActive}
                      chipSize="m"
                      className="min-w-0"
                      onClick={() => setActiveGenre(genre)}
                    >
                      {genre}
                    </FilterChip>
                  );
                })}
              </div>
            </div>
            <div className="w-full grid grid-cols-1 gap-y-0 lg:grid-cols-3 lg:gap-x-my-40">
              {filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="w-full border-b border-border-10 last:border-b-0 lg:border-b-0"
                >
                  <BgmListItem
                    variant="default"
                    item={item}
                    index={idx + 1}
                    isActive={playingId === item.id}
                    isPlaying={playingId === item.id && !isPaused}
                    currentTime={playingId === item.id ? currentTime : 0}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onSeek={playingId === item.id ? setCurrentTime : undefined}
                    onDelete={onDelete}
                  />
                </div>
              ))}
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
