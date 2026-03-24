"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
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
  /** 리스트 상단 카테고리 라벨 (예: 로맨스) */
  categoryTitle?: string;
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
  categoryTitle = "판타지",
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
      <div className="w-full max-w-[1200px] min-w-[640px] bg-surface-10 rounded-2xl border border-border-10 flex flex-col justify-start items-start">
        <div className="w-full self-stretch px-5 pt-5 pb-3 border-b border-border-10 inline-flex justify-between items-center gap-0">
          <Title2
            text={title}
            asSectionHeader
            subtitle
            subtitleText={description}
            className="!p-0 !border-0 !border-b-0 min-w-0 flex-1"
          />
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
          <div className="self-stretch px-5 pb-2 pt-2 rounded-2xl flex flex-col justify-start items-start gap-3">
            {/* 상단 카테고리 탭 영역 - 레벨2(보조) 탭 스타일 */}
            <div className="w-full pt-0 pb-0 mt-0 mb-1 inline-flex flex-col justify-start items-start gap-2.5">
              <div
                data-size="L"
                data-underline="true"
                className="w-full inline-flex justify-start items-center gap-4 overflow-hidden"
                role="tablist"
                aria-label="BGM 장르"
              >
                {GENRE_TABS_WITH_ALL.map((genre) => {
                  const isActive = genre === activeGenre;
                  return (
                    <button
                      key={genre}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={
                        "h-7 px-0 flex cursor-pointer justify-center items-center min-w-0 border-b text-sm font-medium font-['Pretendard_JP'] leading-4 transition-colors " +
                        (isActive
                          ? "border-slate-800 text-on-surface-10"
                          : "border-transparent text-[rgba(145,145,148,1)] hover:text-on-surface-20")
                      }
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setActiveGenre(genre)}
                    >
                      <span className="justify-start">{genre}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* 1단 와이드 리스트 영역 */}
            <div className="w-full grid grid-cols-3 gap-x-10 gap-y-0">
              {filteredItems.map((item, idx) => (
                <div key={item.id} className="w-full">
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
