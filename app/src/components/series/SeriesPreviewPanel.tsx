"use client";

import Image from "next/image";
import { IPhone15ProFrame } from "@/components/preview/IPhone15ProFrame";

export type SeriesPreviewPanelLayout = "sidebar" | "centered";

interface SeriesPreviewPanelProps {
  coverPreviewUrl: string | null;
  logoPreviewUrl: string | null;
  /** sidebar: 데스크톱 우측 고정 / centered: 모바일 전환 화면 */
  layout?: SeriesPreviewPanelLayout;
}

function SeriesPreviewContent({
  coverPreviewUrl,
  logoPreviewUrl,
  imageSizes,
}: {
  coverPreviewUrl: string | null;
  logoPreviewUrl: string | null;
  imageSizes: string;
}) {
  if (!coverPreviewUrl && !logoPreviewUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-900 px-my-20 text-center text-body3_400 text-on-surface-30">
        이미지를 등록하면 미리볼 수 있어요
      </div>
    );
  }

  return (
    <>
      <Image
        key={coverPreviewUrl || logoPreviewUrl}
        src={coverPreviewUrl || logoPreviewUrl!}
        alt="시리즈 대표이미지 미리보기"
        fill
        sizes={imageSizes}
        unoptimized
        className="object-cover object-center bg-slate-900/50"
      />
      {coverPreviewUrl && logoPreviewUrl ? (
        <Image
          key={logoPreviewUrl}
          src={logoPreviewUrl}
          alt="로고 미리보기"
          fill
          sizes={imageSizes}
          unoptimized
          className="pointer-events-none z-10 object-cover"
        />
      ) : null}
    </>
  );
}

export function SeriesPreviewPanel({
  coverPreviewUrl,
  logoPreviewUrl,
  layout = "sidebar",
}: SeriesPreviewPanelProps) {
  const isFullscreen = layout === "centered";

  if (isFullscreen) {
    return (
      <div className="relative flex min-h-0 w-full flex-1 bg-black">
        <SeriesPreviewContent
          coverPreviewUrl={coverPreviewUrl}
          logoPreviewUrl={logoPreviewUrl}
          imageSizes="100vw"
        />
      </div>
    );
  }

  return (
    <div className="flex w-[300px] shrink-0 flex-col gap-my-12">
      <p className="text-body1_500 text-on-surface-20">미리보기</p>
      <div className="flex w-full justify-center">
        <IPhone15ProFrame>
          <div className="relative h-full w-full">
            <SeriesPreviewContent
              coverPreviewUrl={coverPreviewUrl}
              logoPreviewUrl={logoPreviewUrl}
              imageSizes="300px"
            />
          </div>
        </IPhone15ProFrame>
      </div>
    </div>
  );
}
