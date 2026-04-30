import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getAnalyticsTopFiveThumbnailUrl } from "@/lib/analyticsTopFiveThumbnails";

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
    <span className={cn("text-xs font-normal leading-4", contentTypeAccentClass(tone))}>{children}</span>
  );
}

export function RankDecoration({ rank, tone }: { rank: number; tone: ContentTone }) {
  if (rank === 2) {
    return (
      <div className="flex w-10 items-center justify-start gap-1">
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
      <div className="flex w-10 items-center justify-start gap-1">
        <div className="text-center justify-center text-error-error text-sm font-normal font-['Pretendard_JP'] leading-5">
          New
        </div>
      </div>
    );
  }
  if (rank === 4 || tone === "seriesBlue" || tone === "character") {
    const num = "3";
    const accent = contentTypeAccentClass(tone);
    return (
      <div className="flex w-10 items-center gap-0.5">
        <span className={cn("text-sm", accent)} aria-hidden>
          ▼
        </span>
        <span className={cn("text-sm", accent)}>{num}</span>
      </div>
    );
  }
  const num = rank === 3 ? "1" : "3";
  return (
    <div className="flex w-10 items-center gap-0.5">
      <span className="text-sm text-error-error" aria-hidden>
        ▲
      </span>
      <span className="text-sm text-error-error">{num}</span>
    </div>
  );
}

export function AnalyticsTopFiveRowList({ rows }: { rows: readonly AnalyticsTopFiveRow[] }) {
  return (
    <div className="flex flex-col items-start justify-start gap-4 self-stretch rounded-[4px] p-5">
      {rows.map((row) => {
        const count = row.countLabel ?? "5,678";
        const suffix = row.countSuffix ?? "회";
        return (
          <div key={row.rank} className="inline-flex items-center justify-between self-stretch">
            <div className="flex items-center justify-start gap-4">
              <div className="inline-flex w-14 items-center justify-start gap-1">
                <RankDecoration rank={row.rank} tone={row.tone} />
                <div className="justify-center text-base font-bold leading-6 text-on-surface-10 font-['Pretendard_JP']">
                  {row.rank}
                </div>
              </div>
              <div className="relative h-24 w-14 shrink-0 overflow-hidden rounded-[4px] outline outline-1 outline-offset-[-1px] outline-border-10/5">
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
              </div>
              <div className="inline-flex flex-col items-start justify-center gap-1">
                <ContentTypeBadge tone={row.tone}>{row.badge}</ContentTypeBadge>
                <span className="text-center text-base font-medium leading-6 text-on-surface-10">{row.title}</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1">
              <span className="text-center text-base font-medium leading-5 text-on-surface-10">{count}</span>
              <span className="text-center text-base font-medium leading-5 text-on-surface-30">{suffix}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
