import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getAnalyticsTopFiveThumbnailUrl } from "@/lib/analyticsTopFiveThumbnails";
import { THUMBNAIL_DIM_OVERLAY_CLASS } from "@/lib/thumbnail-styles";

export type ContentTone = "series" | "character" | "seriesBlue" | "scenario";

/** 배지·순위 장식 등 같은 콘텐츠 유형은 동일 톤 (시리즈·seriesBlue 통일) */
export function contentTypeAccentClass(tone: ContentTone): string {
  switch (tone) {
    case "series":
    case "seriesBlue":
      return "text-primary-on-primary-container";
    case "character":
      return "text-blue-500";
    case "scenario":
      return "text-lime-600";
  }
}

export type AnalyticsTopFiveRow = {
  rank: number;
  badge: string;
  title: string;
  tone: ContentTone;
  /** 기본 "5,678" */
  countLabel?: string;
  countSuffix?: string;
};

export function ContentTypeBadge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: ContentTone;
}) {
  return (
    <span className={cn("text-caption1_400", contentTypeAccentClass(tone))}>{children}</span>
  );
}

export function RankDecoration({ rank, tone }: { rank: number; tone: ContentTone }) {
  if (rank === 2) {
    return (
      <div className="flex w-9 items-center justify-center gap-my-4 lg:justify-start">
        <div className="relative h-5 w-5">
          <div
            className="absolute left-[4.38px] top-[9.38px] h-[1.25px] w-3 bg-on-surface-30"
            aria-hidden
          />
        </div>
      </div>
    );
  }
  if (rank === 5) {
    return (
      <div className="flex w-9 items-center justify-center gap-my-4 lg:justify-start">
        <div className="text-center justify-center text-error-error text-body3_400 font-['Pretendard_JP']">
          New
        </div>
      </div>
    );
  }
  if (rank === 4 || tone === "seriesBlue" || tone === "character") {
    const num = "3";
    return (
      <div className="flex w-9 items-center justify-center gap-my-2 lg:justify-start">
        <span className="text-body3_400 text-blue-500" aria-hidden>
          ▼
        </span>
        <span className="text-body3_400 text-blue-500">{num}</span>
      </div>
    );
  }
  const num = rank === 3 ? "1" : "3";
  return (
    <div className="flex w-9 items-center justify-center gap-my-2 lg:justify-start">
      <span className="text-body3_400 text-error-error" aria-hidden>
        ▲
      </span>
      <span className="text-body3_400 text-error-error">{num}</span>
    </div>
  );
}

export function AnalyticsTopFiveRowList({ rows }: { rows: readonly AnalyticsTopFiveRow[] }) {
  return (
    <div className="flex flex-col items-start justify-start gap-my-16 self-stretch rounded-[4px] p-my-20">
      {rows.map((row) => {
        const count = row.countLabel ?? "5,678";
        const suffix = row.countSuffix ?? "회";
        return (
          <div
            key={row.rank}
            className="flex w-full items-center justify-between gap-my-8 self-stretch lg:gap-my-12"
          >
            <div className="flex min-w-0 flex-1 items-center gap-my-12 lg:gap-my-16">
              <div className="flex w-9 shrink-0 flex-col items-center justify-center gap-my-4 lg:w-14 lg:flex-row lg:items-center lg:justify-start lg:gap-my-4">
                <RankDecoration rank={row.rank} tone={row.tone} />
                <div className="text-body1_700 text-on-surface-10 font-['Pretendard_JP']">
                  {row.rank}
                </div>
              </div>
              <div className="relative aspect-[9/16] w-14 shrink-0 overflow-hidden rounded-[4px] outline outline-1 outline-offset-[-1px] outline-border-10/5">
                <Image
                  src={getAnalyticsTopFiveThumbnailUrl({
                    rank: row.rank,
                    title: row.title,
                    tone: row.tone,
                  })}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="56px"
                />
                <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-end justify-center gap-my-4 lg:items-start">
                <ContentTypeBadge tone={row.tone}>{row.badge}</ContentTypeBadge>
                <span className="line-clamp-2 text-right text-body1_500 text-on-surface-10 lg:text-left">
                  {row.title}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center justify-end gap-my-4">
              <span className="text-body1_500 text-on-surface-10">{count}</span>
              <span className="text-body1_500 text-on-surface-30">{suffix}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
