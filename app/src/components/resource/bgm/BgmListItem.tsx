"use client";

import React, { useState } from "react";
import { ICONS } from "@/lib/icons";
import { IconButton } from "@/components/ui/icon-button";
import { Slider } from "@/components/ui/slider";
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
      : "flex items-center gap-1 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100 max-lg:opacity-100"
    : "hidden";

  return (
    <div
      className="group inline-flex h-fit w-full cursor-pointer flex-col items-center justify-center gap-1 self-stretch overflow-visible rounded-sm px-2 py-2 transition-colors hover:bg-muted max-lg:px-1 lg:px-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex h-fit min-w-0 flex-col gap-0 self-stretch">
        <div className="inline-flex min-h-9 flex-shrink-0 items-center justify-center gap-2 self-stretch max-lg:gap-1">
          {variant === "default" && index != null && (
            <span className="w-8 shrink-0 tabular-nums text-body3_500 text-foreground">
              {index}
            </span>
          )}
          <div className="inline-flex min-w-0 flex-1 flex-col items-start justify-start gap-0.5">
            <div className="w-full truncate text-body3_500 text-foreground max-lg:text-body2_500">
              {item.title}
            </div>
            <div className="w-full text-body4_400 text-foreground-placeholder">
              {timeLabel}
            </div>
          </div>
          <div className={actionsClass}>
            {showSelectedCheck ? (
              isHovered ? (
                /* selected + hovered: 재생 + 빼기(선택 해제) */
                <>
                  {showPlayButton && (
                    <IconButton
                      type="button"
                      variant="outline"
                      shape="circle"
                      size="icon-sm"
                      icon={isActive && isPlaying ? ICONS.square : ICONS.play}
                      iconClassName="fill-current"
                      onClick={handlePlayPause}
                      aria-label={isActive && isPlaying ? "정지" : "미리듣기"}
                    />
                  )}
                  {onAdd && (
                    <IconButton
                      type="button"
                      variant="outline"
                      shape="circle"
                      size="icon-sm"
                      icon={ICONS.minus}
                      onClick={onAdd}
                      aria-label="선택 해제"
                    />
                  )}
                </>
              ) : (
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center text-primary"
                  aria-label="선택됨"
                >
                  <ICONS.check className="h-5 w-5" strokeWidth={2.5} />
                </span>
              )
            ) : (
              <>
                {showPlayButton && (
                  <IconButton
                    type="button"
                    variant="outline"
                    shape="circle"
                    size="icon-sm"
                    icon={isActive && isPlaying ? ICONS.square : ICONS.play}
                    iconClassName="fill-current"
                    onClick={handlePlayPause}
                    aria-label={isActive && isPlaying ? "정지" : "미리듣기"}
                  />
                )}
                {showAddButton && (
                  <IconButton
                    type="button"
                    variant="outline"
                    shape="circle"
                    size="icon-sm"
                    icon={ICONS.plus}
                    onClick={onAdd}
                    aria-label="추가"
                  />
                )}
              </>
            )}
            {showDelete && onDelete && (
              <IconButton
                type="button"
                variant="outline"
                shape="circle"
                size="icon-sm"
                icon={ICONS.trash2}
                onClick={() => onDelete(item)}
                aria-label="삭제"
              />
            )}
            {showRemove && onDelete && (
              <IconButton
                type="button"
                variant="outline"
                shape="circle"
                size="icon-sm"
                icon={ICONS.minus}
                onClick={() => onDelete(item)}
                aria-label="선택에서 제거"
              />
            )}
          </div>
        </div>
        {showProgressBar && showExpandedTime && totalSeconds > 0 ? (
          <Slider
            className="w-full shrink-0 py-2"
            min={0}
            max={totalSeconds}
            step={1}
            value={currentTime}
            onValueChange={(value) => {
              const next = Array.isArray(value) ? value[0] : value;
              onSeek?.(next);
            }}
            disabled={!onSeek}
            aria-label="재생 위치"
          />
        ) : null}
      </div>
    </div>
  );
}
