"use client";

import { cn } from "design-system/utils";

interface SeriesInfoLorePreviewProps {
  title: string;
  headline: string;
  keywords: readonly string[];
  body: string;
}

/** 정보 탭 미리보기 — 세계관 탭에서도 동일 화면 유지 */
export function SeriesInfoLorePreview({
  title,
  headline,
  keywords,
  body,
}: SeriesInfoLorePreviewProps) {
  const displayTitle = title.trim();
  const displayHeadline = headline.trim();
  const displayBody = body.trim();

  return (
    <div className="flex h-full min-h-0 w-full flex-col preview-bg-canvas px-4 pb-5 pt-6">
      <p
        className={cn(
          "shrink-0 line-clamp-2 text-center text-heading5_700",
          displayTitle ? "preview-text-body" : "preview-text-placeholder",
        )}
      >
        {displayTitle || "제목"}
      </p>

      <div className="mt-8 flex min-h-0 flex-1 flex-col gap-4">
        <p
          className={cn(
            "line-clamp-4 text-center text-body1_500 leading-snug",
            displayHeadline ? "preview-text-body" : "preview-text-placeholder",
          )}
        >
          {displayHeadline || "세계관 주제를 입력하면 여기에 표시됩니다"}
        </p>

        {keywords.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-1.5">
            {keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-sm border preview-border-overlay px-2 py-1 text-caption2_400 preview-text-subtle"
              >
                #{keyword}
              </span>
            ))}
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {displayBody ? (
            <p className="whitespace-pre-wrap text-caption1_400 leading-relaxed preview-text-muted">
              {displayBody}
            </p>
          ) : (
            <p className="text-center text-caption2_400 preview-text-placeholder">
              세계관 설명을 입력하면 여기에 표시됩니다
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
