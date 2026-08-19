"use client";

import { IPhone15ProFrame } from "@/components/preview/IPhone15ProFrame";
import { SeriesImageCoverPreview } from "@/components/series/SeriesImageCoverPreview";
import { SeriesInfoLorePreview } from "@/components/series/SeriesInfoLorePreview";
import type { SeriesFormTab } from "@/lib/seriesForm";

export type SeriesPreviewPanelLayout = "sidebar" | "centered";

interface SeriesPreviewPanelProps {
  activeTab?: SeriesFormTab;
  coverPreviewUrl: string | null;
  logoPreviewUrl: string | null;
  title?: string;
  summary?: string;
  keywords?: readonly string[];
  worldviewDescription?: string;
  /** sidebar: 데스크톱 우측 고정 / centered: 모바일 전환 화면 */
  layout?: SeriesPreviewPanelLayout;
}

export function SeriesPreviewPanel({
  activeTab = "image",
  coverPreviewUrl,
  logoPreviewUrl,
  title = "",
  summary = "",
  keywords = [],
  worldviewDescription = "",
  layout = "sidebar",
}: SeriesPreviewPanelProps) {
  const isFullscreen = layout === "centered";
  const imageSizes = isFullscreen ? "100vw" : "300px";

  const preview =
    activeTab === "image" ? (
      <SeriesImageCoverPreview
        coverPreviewUrl={coverPreviewUrl}
        logoPreviewUrl={logoPreviewUrl}
        imageSizes={imageSizes}
      />
    ) : (
      <SeriesInfoLorePreview
        title={title}
        headline={summary}
        keywords={keywords}
        body={worldviewDescription}
      />
    );

  if (isFullscreen) {
    return (
      <div className="relative flex min-h-0 w-full flex-1 bg-inverse">
        {preview}
      </div>
    );
  }

  return (
    <div className="flex w-[300px] shrink-0 flex-col gap-3">
      <p className="text-body1_500 text-foreground-muted">미리보기</p>
      <div className="flex w-full justify-center">
        <IPhone15ProFrame>{preview}</IPhone15ProFrame>
      </div>
    </div>
  );
}
