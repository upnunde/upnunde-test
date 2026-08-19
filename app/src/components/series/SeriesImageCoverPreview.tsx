"use client";

import Image from "next/image";

interface SeriesImageCoverPreviewProps {
  coverPreviewUrl: string | null;
  logoPreviewUrl: string | null;
  imageSizes: string;
}

/** 이미지 탭 — 대표이미지 풀블리드 + 로고 전체 오버레이 */
export function SeriesImageCoverPreview({
  coverPreviewUrl,
  logoPreviewUrl,
  imageSizes,
}: SeriesImageCoverPreviewProps) {
  const heroUrl = coverPreviewUrl || logoPreviewUrl;

  return (
    <div className="relative h-full w-full min-h-0 preview-bg-canvas">
      {heroUrl ? (
        <Image
          key={heroUrl}
          src={heroUrl}
          alt="시리즈 대표이미지 미리보기"
          fill
          sizes={imageSizes}
          unoptimized
          className="object-cover object-center"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-5 text-center text-caption1_400 preview-text-placeholder">
          이미지를 등록하면 미리볼 수 있어요
        </div>
      )}
      {coverPreviewUrl && logoPreviewUrl ? (
        <Image
          key={logoPreviewUrl}
          src={logoPreviewUrl}
          alt="시리즈 타이틀 로고"
          fill
          sizes={imageSizes}
          unoptimized
          className="pointer-events-none z-dropdown object-cover object-center"
        />
      ) : null}
    </div>
  );
}
