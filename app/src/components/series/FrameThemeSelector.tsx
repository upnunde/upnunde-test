"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { ImageCard } from "@/components/resource/cards/ImageCard";
import type { ImageResource } from "@/types/resource";

export interface FrameThemeItem {
  id: string;
  name: string;
  imageUrl?: string;
}

export type FrameThemePagerState = {
  canGoPrev: boolean;
  canGoNext: boolean;
  /** 한 화면(그리드)에 모두 들어가지 않아 스와이프·페이지 이동이 필요할 때만 true */
  needsPager: boolean;
};

export type FrameThemeSelectorHandle = {
  goPrev: () => void;
  goNext: () => void;
};

interface FrameThemeSelectorProps {
  selectedThemeId: string;
  onSelectTheme: (themeId: string) => void;
  themes?: FrameThemeItem[];
  onPagerChange?: (state: FrameThemePagerState) => void;
}

/** 프레임 테마 선택기 기본 썸네일(첨부 1:1 이미지, 개수만큼만 노출) */
const FRAME_THEME_THUMBNAIL_URLS = [
  "/frame-theme-thumbnails/theme-01.png",
  "/frame-theme-thumbnails/theme-02.png",
  "/frame-theme-thumbnails/theme-03.png",
  "/frame-theme-thumbnails/theme-04.png",
  "/frame-theme-thumbnails/theme-05.png",
  "/frame-theme-thumbnails/theme-06.png",
  "/frame-theme-thumbnails/theme-07.png",
] as const;

const DEFAULT_THEME_ITEMS: FrameThemeItem[] = FRAME_THEME_THUMBNAIL_URLS.map((imageUrl, index) => {
  const order = index + 1;
  return {
    id: `theme-${order}`,
    name: `테마 ${String(order).padStart(2, "0")}`,
    imageUrl,
  };
});

/** 기본 더미 테마 개수(총 N개 표시 등에 사용) */
export const DEFAULT_FRAME_THEME_ITEM_COUNT = DEFAULT_THEME_ITEMS.length;

export const FrameThemeSelector = forwardRef<FrameThemeSelectorHandle, FrameThemeSelectorProps>(
  function FrameThemeSelector(
    { selectedThemeId, onSelectTheme, themes = DEFAULT_THEME_ITEMS, onPagerChange },
    ref
  ) {
    const ROW_COUNT = 2;
    const MAX_VISIBLE_COUNT = 16;
    const MIN_CARD_WIDTH = 90;
    const GAP_X = 16;

    const [activePage, setActivePage] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const touchStartXRef = useRef<number | null>(null);
    const touchEndXRef = useRef<number | null>(null);

    useEffect(() => {
      const node = viewportRef.current;
      if (!node) return;

      const update = () => {
        setContainerWidth(node.clientWidth);
      };
      update();

      const observer = new ResizeObserver(() => update());
      observer.observe(node);
      return () => observer.disconnect();
    }, []);

    const columnCount = useMemo(() => {
      if (containerWidth <= 0) return 4;
      const computed = Math.floor((containerWidth + GAP_X) / (MIN_CARD_WIDTH + GAP_X));
      return Math.max(1, Math.min(8, computed));
    }, [containerWidth]);

    const pageSize = useMemo(() => {
      return Math.min(MAX_VISIBLE_COUNT, columnCount * ROW_COUNT);
    }, [columnCount]);

    const themePages = useMemo(() => {
      const pages: FrameThemeItem[][] = [];
      for (let i = 0; i < themes.length; i += pageSize) {
        pages.push(themes.slice(i, i + pageSize));
      }
      return pages;
    }, [pageSize, themes]);

    const totalPages = themePages.length;
    const needsPager = totalPages > 1;

    const maxPage = Math.max(0, totalPages - 1);
    const clampedPage = Math.min(activePage, maxPage);
    const canGoPrev = clampedPage > 0;
    const canGoNext = clampedPage < totalPages - 1;

    const goPrev = useCallback(() => {
      setActivePage((prev) => Math.max(0, prev - 1));
    }, []);

    const goNext = useCallback(() => {
      setActivePage((prev) => Math.min(Math.max(0, totalPages - 1), prev + 1));
    }, [totalPages]);

    useImperativeHandle(
      ref,
      () => ({
        goPrev,
        goNext,
      }),
      [goPrev, goNext]
    );

    useEffect(() => {
      onPagerChange?.({ canGoPrev, canGoNext, needsPager });
    }, [canGoPrev, canGoNext, needsPager, onPagerChange]);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      touchStartXRef.current = e.touches[0]?.clientX ?? null;
      touchEndXRef.current = null;
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
      touchEndXRef.current = e.touches[0]?.clientX ?? null;
    };

    const handleTouchEnd = () => {
      const startX = touchStartXRef.current;
      const endX = touchEndXRef.current;
      if (startX === null || endX === null) return;
      const distance = startX - endX;
      const threshold = 40;

      if (distance > threshold) goNext();
      if (distance < -threshold) goPrev();
    };

    return (
      <div className="mt-2 flex flex-col gap-2">
        <div
          ref={viewportRef}
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex w-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${clampedPage * 100}%)` }}
          >
            {themePages.map((page, pageIndex) => (
              <div key={`page-${pageIndex}`} className="w-full shrink-0">
                <div
                  className="grid gap-x-4 gap-y-3 justify-items-start"
                  style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
                >
                  {page.map((theme) => {
                    const isSelected = selectedThemeId === theme.id;
                    const cardItem: ImageResource = {
                      id: theme.id,
                      name: theme.name,
                      imageUrl: theme.imageUrl ?? FRAME_THEME_THUMBNAIL_URLS[0],
                    };

                    return (
                      <ImageCard
                        key={theme.id}
                        item={cardItem}
                        slotType="img1:1"
                        showName
                        showActions={false}
                        selected={isSelected}
                        containerClassName="min-w-[90px] w-full max-w-none"
                        frameClassName="w-full aspect-square min-h-0"
                        imageClassName="w-full h-full max-h-none object-cover"
                        onDetailClick={() => onSelectTheme(theme.id)}
                        onDeleteClick={() => {}}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {needsPager ? (
          <div className="flex justify-center gap-1.5 pt-0.5">
            {themePages.map((_, idx) => (
              <button
                key={`dot-${idx}`}
                type="button"
                aria-label={`${idx + 1}페이지로 이동`}
                onClick={() => setActivePage(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === clampedPage ? "w-5 bg-slate-700" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }
);
