"use client";

import Image from "next/image";
import { IPhone15ProFrame } from "@/components/preview/IPhone15ProFrame";

interface SeriesPreviewPanelProps {
  coverPreviewUrl: string | null;
  logoPreviewUrl: string | null;
}

export function SeriesPreviewPanel({ coverPreviewUrl, logoPreviewUrl }: SeriesPreviewPanelProps) {
  return (
    <div className="w-[300px] shrink-0 flex flex-col gap-3">
      <p className="text-base font-medium text-on-surface-20">미리보기</p>
      <div className="w-full flex justify-center">
        <IPhone15ProFrame>
          <div className="relative w-full h-full">
            {coverPreviewUrl || logoPreviewUrl ? (
              <>
                <Image
                  key={coverPreviewUrl || logoPreviewUrl}
                  src={coverPreviewUrl || logoPreviewUrl!}
                  alt="시리즈 대표이미지 미리보기"
                  fill
                  sizes="300px"
                  unoptimized
                  className="object-cover object-center bg-slate-900/50"
                />
                {coverPreviewUrl && logoPreviewUrl && (
                  <Image
                    key={logoPreviewUrl}
                    src={logoPreviewUrl}
                    alt="로고 미리보기"
                    fill
                    sizes="300px"
                    unoptimized
                    className="object-cover z-10 pointer-events-none"
                  />
                )}
              </>
            ) : null}
          </div>
        </IPhone15ProFrame>
      </div>
    </div>
  );
}
