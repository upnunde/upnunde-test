"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/Header/Header";
import AppSidebar from "@/components/AppSidebar/AppSidebar";
import { EpisodeList } from "@/components/episode/EpisodeList";
import { EpisodeListItem } from "@/components/episode/EpisodeListItem";
import { EmptyStateBanner } from "@/components/episode/EmptyStateBanner";
import { Pagination } from "@/components/episode/Pagination";
import { PublishConfirmModal, DeleteConfirmModal } from "@/components/episode/ConfirmModals";
import { Snackbar } from "@/components/episode/Snackbar";
import { Button } from "@/components/ui/button";
import type { Episode, SortOptions, SnackbarState, SeriesType } from "@/types/episode";

const PAGE_SIZE = 10;

/** 정렬 옵션 기본값: 회차 최신순 (정책 4) */
const DEFAULT_SORT: SortOptions = {
  field: "episodeNumber",
  direction: "desc",
};

/** 에피소드 썸네일용 일러스트/아트 이미지 (60x107 크기) */
const THUMBNAIL_ILLUSTRATIONS = [
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=60&h=107&fit=crop",
  "https://images.unsplash.com/photo-1589998059171-988d41df7358?w=60&h=107&fit=crop",
  "https://images.unsplash.com/photo-1513542789411-b6d5b059ee63?w=60&h=107&fit=crop",
  "https://images.unsplash.com/photo-1558591718-4da6c2d5972e?w=60&h=107&fit=crop",
  "https://images.unsplash.com/photo-1578301978018-3005759f5c85?w=60&h=107&fit=crop",
];

/** 1~120화 더미 데이터 생성 (정책 13: 페이지네이션 동작 검증용) - 모든 목록 공개 중 */
function buildMockEpisodes(): Episode[] {
  const episodes: Episode[] = [];

  for (let n = 1; n <= 120; n++) {
    const id = n;
    const episodeNumber = n;
    const isSpecial = n >= 116 && n <= 120;
    const title = isSpecial
      ? (n === 116 && "작성 중인 에피소드") ||
        (n === 117 && "기억의 늪에 빠진 로맨스") ||
        (n === 118 && "잊혀진 과거의 그림자") ||
        (n === 119 && "운명의 갈림길에서") ||
        (n === 120 && "빛과 그림자") ||
        `에피소드 ${n}화`
      : `에피소드 ${n}화`;
    const baseDate = new Date(2024, 0, 1);
    baseDate.setDate(baseDate.getDate() + (n - 1) * 2);
    const date = baseDate.toISOString().slice(0, 10);
    const views = Math.floor(100 + Math.random() * 5000);
    const thumbnail =
      THUMBNAIL_ILLUSTRATIONS[(n - 1) % THUMBNAIL_ILLUSTRATIONS.length];

    episodes.push({
      id,
      episodeNumber,
      title,
      thumbnail,
      date,
      views,
      status: "PUBLISHED",
    });
  }

  // 116~120화 제목·날짜·조회수만 덮기 (상태는 모두 공개 중 유지)
  const overrides: Partial<Episode>[] = [
    {
      episodeNumber: 116,
      title: "작성 중인 에피소드",
      date: "2026-01-20",
      views: 320,
      status: "PUBLISHED",
    },
    {
      episodeNumber: 117,
      title: "기억의 늪에 빠진 로맨스",
      date: "2026-01-01",
      views: 890,
      status: "PUBLISHED",
    },
    {
      episodeNumber: 118,
      title: "잊혀진 과거의 그림자",
      date: "2025-12-12",
      views: 1205,
      status: "PUBLISHED",
    },
    {
      episodeNumber: 119,
      title: "운명의 갈림길에서",
      date: "2026-01-15",
      views: 0,
      status: "PRIVATE",
    },
    {
      episodeNumber: 120,
      title: "빛과 그림자",
      date: "",
      views: 0,
      status: "DRAFT",
    },
  ];

  for (const o of overrides) {
    const idx = episodes.findIndex((e) => e.episodeNumber === o.episodeNumber);
    if (idx !== -1) {
      episodes[idx] = { ...episodes[idx], ...o };
    }
  }

  return episodes;
}

const MOCK_EPISODES: Episode[] = buildMockEpisodes();

export default function EpisodeManagementPage() {
  const router = useRouter();
  const params = useParams();
  const seriesId = String(params?.id ?? "1");

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>(MOCK_EPISODES);
  const [sortOptions, setSortOptions] = useState<SortOptions>(DEFAULT_SORT);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [episodeToPublish, setEpisodeToPublish] = useState<Episode | null>(null);
  const [episodeToDelete, setEpisodeToDelete] = useState<Episode | null>(null);
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    message: "",
  });

  /** 정책 2: 시리즈 제목 텍스트만 노출 (페이지 내 수정 불가) */
  const seriesTitle = "꽃에게는 독이 필요하다";
  /** 정책 15: 단품이 아닐 때만 빈 화면 배너 노출 */
  const seriesType: SeriesType = "series";

  const sortedEpisodes = useMemo(() => {
    const list = [...episodes];
    const { field, direction } = sortOptions;
    list.sort((a, b) => {
      const aVal = field === "episodeNumber" ? a.episodeNumber : a.views;
      const bVal = field === "episodeNumber" ? b.episodeNumber : b.views;
      if (aVal === bVal) return 0;
      return direction === "asc" ? (aVal > bVal ? 1 : -1) : aVal > bVal ? -1 : 1;
    });
    return list;
  }, [episodes, sortOptions]);

  const totalItems = sortedEpisodes.length;
  const paginatedEpisodes = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedEpisodes.slice(start, start + PAGE_SIZE);
  }, [sortedEpisodes, currentPage]);

  const showEmptyBanner = episodes.length === 0 && seriesType === "series";
  const showPagination = totalItems > PAGE_SIZE;

  /** 정책 1: 뒤로가기 → 시리즈 목록 화면 */
  const handleBack = useCallback(() => {
    router.push("/series");
  }, [router]);

  /** 정책 3: 에피소드 추가 → 에피소드 추가 페이지 */
  const handleAddEpisode = useCallback(() => {
    router.push("/editor?view=form");
  }, [router]);

  /** 정책 16: 리소스 관리 → 리소스 관리 화면 */
  const handleResourceManagement = useCallback(() => {
    router.push(`/series/${seriesId}/resources`);
  }, [router, seriesId]);

  /** 정책 7: 행 클릭 → 원고 에디터 화면 */
  const handleRowClick = useCallback(
    (episode: Episode) => {
      router.push(`/editor?episode=${episode.id}`);
    },
    [router]
  );

  /** 정책 6: 공개 전환 클릭 → 확인 팝업 */
  const handlePublishClick = useCallback((episode: Episode) => {
    setEpisodeToPublish(episode);
    setIsPublishModalOpen(true);
  }, []);

  const handlePublishConfirm = useCallback((episode: Episode) => {
    setEpisodes((prev) =>
      prev.map((e) => (e.id === episode.id ? { ...e, status: "PUBLISHED" as const } : e))
    );
    setEpisodeToPublish(null);
    setIsPublishModalOpen(false);
  }, []);

  /** 정책 8: 삭제 클릭 → 확인 팝업 */
  const handleDeleteClick = useCallback((episode: Episode) => {
    setEpisodeToDelete(episode);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback((episode: Episode) => {
    setEpisodes((prev) => prev.filter((e) => e.id !== episode.id));
    setEpisodeToDelete(null);
    setIsDeleteModalOpen(false);
    setSnackbarState({
      open: true,
      message: "에피소드가 정상적으로 삭제되었습니다.",
    });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbarState((s) => ({ ...s, open: false }));
  }, []);

  /** 정책 10: 링크 에디터(읽기 전용) 진입 */
  const handleLinkEditor = useCallback(
    (episode: Episode) => {
      router.push(`/series/${seriesId}/episodes/${episode.id}/links`);
    },
    [router, seriesId]
  );

  /** 정책 11: 통계 화면 진입 */
  const handleStats = useCallback(
    (episode: Episode) => {
      router.push(`/series/${seriesId}/episodes/${episode.id}/stats`);
    },
    [router, seriesId]
  );

  /** 문의하기 → 문의 페이지로 이동 */
  const handleInquiry = useCallback(() => {
    router.push("/inquiry");
  }, [router]);

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-slate-50">
        <AppSidebar defaultActiveId="series" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-hidden bg-slate-50">
            {/* Sub Header - EditorInner와 동일 스타일 (뒤로가기 + 제목) */}
            <header className="flex h-16 shrink-0 items-center justify-center border-b border-slate-200 bg-white px-6 py-0">
              <div className="flex w-full max-w-[1200px] min-w-[800px] items-center justify-start gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleBack}
                  className="h-9 w-9 shrink-0 rounded-full border-slate-200 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  aria-label="시리즈 목록으로"
                >
                  <ChevronLeft className="h-5 w-5 text-slate-600" strokeWidth={2} />
                </Button>
                <h1 className="text-2xl font-extrabold text-slate-900">에피소드 관리</h1>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto flex flex-col items-center py-8 gap-3">
              {/* Title & Actions - 정책 2, 3, 16 */}
              <div className="w-full max-w-[1200px] min-w-[800px] px-0 flex justify-between items-center shrink-0">
                <h2 className="text-xl font-bold text-slate-900">{seriesTitle}</h2>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResourceManagement}
                    className="h-10 px-4 bg-white border border-slate-200 rounded-md text-slate-700 font-medium hover:bg-slate-100 transition-colors"
                  >
                    리소스 관리
                  </button>
                  <button
                    type="button"
                    onClick={handleAddEpisode}
                    className="h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-md transition-colors"
                  >
                    에피소드 추가
                  </button>
                </div>
              </div>

              {/* 정책 14, 15: 빈 화면 배너 또는 리스트/페이지네이션 */}
              {showEmptyBanner ? (
                <div className="w-full max-w-[1200px] min-w-[800px] px-10">
                  <EmptyStateBanner />
                </div>
              ) : (
                <EpisodeList
                  episodes={paginatedEpisodes}
                  onRowClick={handleRowClick}
                  onPublish={handlePublishClick}
                  onEdit={(ep) => handleRowClick(ep)}
                  onDelete={handleDeleteClick}
                  onLinkEditor={handleLinkEditor}
                  onStats={handleStats}
                  onInquiry={handleInquiry}
                  footer={
                    showPagination ? (
                      <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        onPageChange={setCurrentPage}
                        pageSize={PAGE_SIZE}
                      />
                    ) : undefined
                  }
                />
              )}
            </div>
          </main>
        </div>
      </div>

      <PublishConfirmModal
        open={isPublishModalOpen}
        episode={episodeToPublish}
        onClose={() => {
          setIsPublishModalOpen(false);
          setEpisodeToPublish(null);
        }}
        onConfirm={handlePublishConfirm}
      />
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        episode={episodeToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEpisodeToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
      <Snackbar
        open={snackbarState.open}
        message={snackbarState.message}
        onClose={closeSnackbar}
      />
    </div>
  );
}
