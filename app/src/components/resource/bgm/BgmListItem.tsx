"use client";

import React, { useState } from "react";
import { Play, Square, Trash2, Plus, Minus, Check } from "lucide-react";
import type { BgmResource } from "@/types/resource";

/** "00:00" 형식을 초( number )로 변환 */
function parseDurationToSeconds(duration: string): number {
  const parts = duration.trim().split(":");
  if (parts.length >= 2) {
    const m = parseInt(parts[0], 10) || 0;
    const s = parseInt(parts[1], 10) || 0;
    return m * 60 + s;
  }
  return 0;
}

/** 초를 "00:00" 형식으로 변환 */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * BGM 리스트 항목 컴포넌트.
 *
 * **1번 (variant="default")** – 메인/리소스 페이지용. 4가지 케이스:
 * - 기본 / 진행률만 / 재생+삭제 / 재생중(진행률+일시정지+삭제).
 * 액션: 재생·일시정지 + 삭제(휴지통). hover 시 버튼 노출.
 *
 * **2번 (variant="selection")** – 모달 리스트·선택한 음악용. 8가지 케이스.
 * variant 값: hovered( CSS group-hover ) / playing( isActive && isPlaying ) / selected.
 * - 리스트: 추가(+) 또는 선택됨(체크)
 * - 선택한 음악: 제거(−)
 */
export type BgmListItemVariant = "default" | "selection";

export interface BgmListItemProps {
  item: BgmResource;
  /**
   * 1번(메인/리소스) vs 2번(모달 리스트·선택한 음악).
   * @default "default"
   */
  variant?: BgmListItemVariant;
  /** 목록에서의 순번(1부터). 표시 여부는 variant에 따름 */
  index?: number;
  /** 이 항목이 재생 대상(재생 중 또는 일시정지)인지 → 2번에서 playing */
  isActive?: boolean;
  /** 재생 중인지(일시정지가 아닌지) */
  isPlaying?: boolean;
  /** 현재 재생 시간(초). isActive일 때만 사용 */
  currentTime?: number;
  onPlay?: (item: BgmResource) => void;
  onPause?: (item: BgmResource) => void;
  onDelete?: (item: BgmResource) => void;
  /** 재생 버튼 표시 (기본 true) */
  showPlayButton?: boolean;
  /** 1번에서 삭제(휴지통) 버튼 표시 (기본 true). 2번 리스트에서는 무시. */
  showDeleteButton?: boolean;
  /** 2번 리스트용: 추가(+) 버튼 클릭 시. 있으면 추가/선택 UI */
  onAdd?: () => void;
  /** 프로그레스 바 표시 (기본 true) */
  showProgressBar?: boolean;
  /** 재생 위치 시킹(클릭/드래그). 초 단위로 호출 */
  onSeek?: (seconds: number) => void;
  /** 2번에서 선택됨 → 체크 아이콘 표시 */
  selected?: boolean;
  /** 버튼 영역 항상 표시 (false면 hover 시에만 표시) */
  alwaysShowActions?: boolean;
}

export function BgmListItem({
  item,
  variant = "default",
  index,
  isActive = false,
  isPlaying = false,
  currentTime = 0,
  onPlay,
  onPause,
  onDelete,
  showPlayButton = true,
  showDeleteButton = true,
  onAdd,
  showProgressBar = true,
  onSeek,
  selected = false,
  alwaysShowActions = false,
}: BgmListItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const totalSeconds = parseDurationToSeconds(item.duration);
  const progress = totalSeconds > 0 ? Math.min(currentTime / totalSeconds, 1) : 0;
  /** 재생 중(또는 일시정지)일 때만 "현재 / 전체" + 진행률 바. 호버만으로는 타임 정보 1개(전체만) */
  const showExpandedTime = isActive;
  const timeLabel = showExpandedTime
    ? `${formatTime(currentTime)} / ${item.duration}`
    : item.duration;

  const isSelection = variant === "selection";
  const showAddButton = Boolean(onAdd);
  /** 1번: 삭제(휴지통). 2번 리스트에서는 사용 안 함 */
  const showDelete =
    !isSelection && showDeleteButton && Boolean(onDelete);
  /** 2번 선택한 음악: 제거(−) 버튼 */
  const showRemove = isSelection && Boolean(onDelete) && !showAddButton;
  /** 2번 리스트: 선택됐을 때 체크 아이콘 */
  const showSelectedCheck = isSelection && selected && showAddButton;

  const handlePlayPause = () => {
    if (!onPlay || !onPause) return;
    if (isActive && isPlaying) {
      onPause(item);
    } else {
      onPlay(item);
    }
  };

  const hasActions =
    showPlayButton ||
    showDelete ||
    showRemove ||
    showAddButton ||
    showSelectedCheck;
  /** selection: default(숨김) → hovered(재생+추가) → selected(체크만) → selected+hovered(재생+빼기). 항상 보이면 alwaysShowActions */
  const actionsAlwaysVisible = alwaysShowActions || (showSelectedCheck && !isHovered);
  const actionsClass = hasActions
    ? actionsAlwaysVisible
      ? "flex items-center gap-1 shrink-0"
      : "flex items-center gap-1 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100"
    : "hidden";

  return (
    <div
      className="group w-full self-stretch pl-0 pr-0 rounded-lg inline-flex justify-center items-center gap-1 overflow-visible flex-col h-fit transition-colors cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="self-stretch flex flex-col gap-0 min-w-0 h-fit">
        <div className="self-stretch inline-flex justify-center items-start gap-1 min-h-[40px] flex-shrink-0">
          {variant === "default" && index != null && (
            <span className="shrink-0 w-6 text-on-surface-10 text-sm font-medium font-['Pretendard_JP'] leading-5 tabular-nums">
              {index}
            </span>
          )}
          <div className="flex-1 min-w-0 inline-flex flex-col justify-start items-start gap-0.5">
            <div className="self-stretch justify-center text-on-surface-10 text-sm font-medium font-['Pretendard_JP'] leading-5 truncate">
              {item.title}
            </div>
            <div className="self-stretch justify-center text-[rgba(145,145,148,1)] text-[13px] font-normal font-['Pretendard_JP'] leading-4">
              {timeLabel}
            </div>
          </div>
          <div className={actionsClass}>
            {showSelectedCheck ? (
              isHovered ? (
                /* selected + hovered: 재생 + 빼기(선택 해제) */
                <>
                  {showPlayButton && (
                    <button
                      type="button"
                      onClick={handlePlayPause}
                      className="w-8 h-8 rounded-full cursor-pointer inline-flex justify-center items-center border border-border-20 bg-white text-on-surface-10 hover:bg-slate-50 hover:border-border-10"
                      aria-label={isActive && isPlaying ? "정지" : "미리듣기"}
                    >
                      {isActive && isPlaying ? (
                        <Square className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </button>
                  )}
                  {onAdd && (
                    <button
                      type="button"
                      onClick={onAdd}
                      className="w-8 h-8 rounded-full cursor-pointer inline-flex justify-center items-center border border-border-20 bg-white text-on-surface-10 hover:bg-slate-50 hover:border-border-10"
                      aria-label="선택 해제"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </>
              ) : (
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center text-primary"
                  aria-label="선택됨"
                >
                  <Check className="h-5 w-5" strokeWidth={2.5} />
                </span>
              )
            ) : (
              <>
                {showPlayButton && (
                  <button
                    type="button"
                    onClick={handlePlayPause}
                    className="w-8 h-8 rounded-full cursor-pointer inline-flex justify-center items-center border border-border-20 bg-white text-on-surface-10 hover:bg-slate-50 hover:border-border-10"
                    aria-label={isActive && isPlaying ? "정지" : "미리듣기"}
                  >
                    {isActive && isPlaying ? (
                      <Square className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                  </button>
                )}
                {showAddButton && (
                  <button
                    type="button"
                    onClick={onAdd}
                    className="w-8 h-8 rounded-full cursor-pointer inline-flex justify-center items-center border border-border-20 bg-white text-on-surface-10 hover:bg-slate-50 hover:border-border-10"
                    aria-label="추가"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
            {showDelete && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(item)}
                className="w-8 h-8 rounded-full cursor-pointer inline-flex justify-center items-center border border-border-20 bg-white text-on-surface-10 hover:bg-slate-50 hover:border-border-10 hover:text-destructive"
                aria-label="삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            {showRemove && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(item)}
                className="w-8 h-8 rounded-full cursor-pointer inline-flex justify-center items-center border border-border-20 bg-white text-on-surface-10 hover:bg-slate-50 hover:border-border-10"
                aria-label="선택에서 제거"
              >
                <Minus className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        {showProgressBar && (
          <div
            role={showExpandedTime ? "slider" : undefined}
            aria-label={showExpandedTime ? "재생 위치" : undefined}
            aria-valuemin={showExpandedTime ? 0 : undefined}
            aria-valuemax={showExpandedTime ? totalSeconds : undefined}
            aria-valuenow={showExpandedTime ? currentTime : undefined}
            tabIndex={showExpandedTime && onSeek ? 0 : undefined}
            className={`self-stretch flex-shrink-0 min-w-0 rounded-full overflow-hidden touch-none select-none relative h-fit ${
              showExpandedTime && onSeek ? "py-2 cursor-pointer" : "py-2"
            }`}
            onClick={
              showExpandedTime && onSeek && totalSeconds > 0
                ? (e) => {
                    const el = e.currentTarget;
                    const rect = el.getBoundingClientRect();
                    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                    const seconds = Math.floor(ratio * totalSeconds);
                    onSeek(seconds);
                  }
                : undefined
            }
            onKeyDown={
              showExpandedTime && onSeek && totalSeconds > 0
                ? (e) => {
                    const step = e.shiftKey ? 10 : 1;
                    if (e.key === "ArrowLeft" || e.key === "Home") {
                      e.preventDefault();
                      onSeek(Math.max(0, currentTime - (e.key === "Home" ? currentTime : step)));
                    } else if (e.key === "ArrowRight" || e.key === "End") {
                      e.preventDefault();
                      onSeek(Math.min(totalSeconds, currentTime + (e.key === "End" ? totalSeconds - currentTime : step)));
                    }
                  }
                : undefined
            }
          >
            {/* 트랙 배경 */}
            <div
              className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full pointer-events-none ${
                showExpandedTime ? "bg-surface-20" : "bg-transparent"
              }`}
            />
            {/* 진행 바 */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-primary transition-[width] duration-150 pointer-events-none"
              style={{ width: `${(showExpandedTime ? progress : 0) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
