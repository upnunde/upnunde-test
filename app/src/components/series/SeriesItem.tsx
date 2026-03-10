"use client";

import React, { useState } from "react";
import { MoreVertical, Eye, EyeOff, Trash2, Calendar, Layers } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { SeriesData, SeriesStatus } from "@/types/series";
import { formatSeriesDate, formatSeriesViewCount } from "@/lib/formatSeries";

export interface SeriesItemProps {
  series: SeriesData;
  /** 리소스 관리 클릭 */
  onResourceManage?: (series: SeriesData) => void;
  /** 에피소드 관리 클릭 */
  onEpisodeManage?: (series: SeriesData) => void;
  /** 시리즈 관리 클릭 */
  onSeriesManage?: (series: SeriesData) => void;
  /** 비공개로 전환 (PUBLIC → PRIVATE) */
  onSetPrivate?: (series: SeriesData) => void;
  /** 공개로 전환 (PRIVATE → PUBLIC) */
  onSetPublic?: (series: SeriesData) => void;
  /** 삭제 */
  onDelete?: (series: SeriesData) => void;
  /** 가이드 정책 위반 상세 페이지 이동 (정책 6) */
  onViolationDetail?: (series: SeriesData) => void;
}

function ViolationIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 6v6h-2V8h2Zm0 8v2h-2v-2h2Z" />
    </svg>
  );
}

export function SeriesItem({
  series,
  onResourceManage,
  onEpisodeManage,
  onSeriesManage,
  onSetPrivate,
  onSetPublic,
  onDelete,
  onViolationDetail,
}: SeriesItemProps) {
  const { id, title, thumbnailUrl, status, createdAt, episodeCount, viewCount } = series;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDraft = status === "DRAFT";
  const isBanned = status === "BANNED";
  const isPrivate = status === "PRIVATE";

  const dateStr = formatSeriesDate(createdAt);
  const viewStr = formatSeriesViewCount(viewCount);

  const handleResource = () => {
    if (isDraft) return;
    onResourceManage?.(series);
  };

  const handleEpisode = () => {
    if (isDraft) return;
    onEpisodeManage?.(series);
  };

  const handleSeriesManage = () => {
    onSeriesManage?.(series);
  };

  return (
    <div className="w-full flex gap-5 pl-5 pr-5 py-5 rounded-xl border border-slate-200 bg-white">
      {/* 썸네일 영역 (정책 6, 8, 9, 10) */}
      <div className="w-28 aspect-[9/16] shrink-0 rounded overflow-hidden relative bg-slate-200">
        {status === "DRAFT" ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-200" aria-hidden>
            <span className="text-on-surface-30 text-xs">썸네일 없음</span>
          </div>
        ) : (
          <>
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
            {(isPrivate || isBanned) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="text-white text-[15px] font-bold">
                  {isBanned ? "이용금지" : "비공개"}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* 우측: 제목, 뱃지, 메타, 버튼 */}
      <div className="flex-1 flex flex-col justify-start items-start min-w-0">
        {/* 제목 + 더보기 (정책 5, 6) */}
        <div className="w-full flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-on-surface-10 truncate flex-1 min-w-0">
            {title}
          </h3>
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="shrink-0 w-8 h-8 -mt-1 -mr-2 rounded-full flex items-center justify-center text-on-surface-30 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
                aria-label="더보기"
              >
                <MoreVertical className="w-5 h-5" aria-hidden />
              </button>
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-lg border border-slate-100 bg-white p-1">
              {status === "PUBLIC" && (
                <>
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm text-slate-700 outline-none hover:bg-slate-50"
                    onSelect={() => onSetPrivate?.(series)}
                  >
                    <EyeOff className="h-4 w-4 shrink-0 text-on-surface-30" aria-hidden />
                    비공개
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm"
                    onSelect={() => onDelete?.(series)}
                  >
                    <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                    삭제
                  </DropdownMenuItem>
                </>
              )}
              {status === "PRIVATE" && (
                <>
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm text-slate-700 outline-none hover:bg-slate-50"
                    onSelect={() => onSetPublic?.(series)}
                  >
                    <Eye className="h-4 w-4 shrink-0 text-on-surface-30" aria-hidden />
                    공개
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm"
                    onSelect={() => onDelete?.(series)}
                  >
                    <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                    삭제
                  </DropdownMenuItem>
                </>
              )}
              {(status === "DRAFT" || status === "BANNED") && (
                <>
                  <DropdownMenuItem
                    disabled
                    className="flex cursor-not-allowed items-center gap-2 rounded-md px-3 py-2.5 text-sm text-on-surface-30"
                  >
                    <Eye className="h-4 w-4 shrink-0" aria-hidden />
                    공개
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm"
                    onSelect={() => onDelete?.(series)}
                  >
                    <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                    삭제
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 상태 뱃지 (정책 8, 9, 10) */}
        {isPrivate && (
          <span className="inline-flex mt-1 h-fit rounded px-2 py-1 text-sm font-medium bg-primary/10 text-primary">
            비공개
          </span>
        )}
        {isDraft && (
          <span className="inline-flex mt-1 h-fit rounded px-2 py-1 text-sm font-medium bg-primary/10 text-primary">
            작성중
          </span>
        )}
        {isBanned && (
          <div className="inline-flex mt-1 h-7 items-center gap-4 px-2 py-1 rounded border border-destructive">
            <div className="flex items-center gap-1">
              <ViolationIcon className="h-5 w-5 text-destructive" aria-hidden />
              <span className="text-destructive text-sm font-medium">
                가이드 정책을 위반, 이용 금지
              </span>
            </div>
            <button
              type="button"
              onClick={() => onViolationDetail?.(series)}
              className="text-destructive text-sm font-medium underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              자세히 보기
            </button>
          </div>
        )}

        {/* 레이아웃 정렬을 위한 빈 블록 */}
        <div className="w-full h-full" />

        {/* 메타: 날짜, 회차 수, 조회수 (정책 2, 3, 4, 11 - 툴팁) */}
        <div className="mb-5 flex flex-wrap gap-6 text-[13px] text-on-surface-20">
          <div className="flex flex-col justify-center items-start gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-[18px] h-[18px] text-on-surface-20" aria-hidden />
              <span title="생성한 날짜">{dateStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-[18px] h-[18px] text-on-surface-20" aria-hidden />
              <span title="작품 누적 조회수">{viewStr}</span>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-[18px] h-[18px] text-on-surface-20" aria-hidden />
              <span title="에피소드 등록 수">
                {episodeCount}회
              </span>
            </div>
          </div>
        </div>

        {/* 하단 관리 버튼: 모든 상태에서 활성화 */}
        <div className="self-stretch inline-flex justify-start items-start gap-2 pt-0">
          <button
            type="button"
            onClick={handleSeriesManage}
            className="h-10 w-full rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            시리즈 관리
          </button>
          <button
            type="button"
            disabled={isDraft}
            title={isDraft ? "시리즈 작성 완료 후 이용 가능합니다" : undefined}
            onClick={handleResource}
            className={`h-10 w-full rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              isDraft
                ? "border-slate-200 text-on-surface-30 cursor-not-allowed"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            리소스 관리
          </button>
          <button
            type="button"
            disabled={isDraft}
            title={isDraft ? "시리즈 작성 완료 후 이용 가능합니다" : undefined}
            onClick={handleEpisode}
            className={`h-10 w-full rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              isDraft
                ? "border-slate-200 text-on-surface-30 cursor-not-allowed"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            에피소드 관리
          </button>
        </div>
      </div>
    </div>
  );
}
