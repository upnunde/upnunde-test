"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { StandaloneHeaderPage } from "@/components/layout/StandaloneHeaderPage";
import { EpisodeList } from "@/components/episode/EpisodeList";
import { EmptyStateBanner } from "@/components/episode/EmptyStateBanner";
import { Pagination } from "@/components/episode/Pagination";
import { PublishConfirmModal, DeleteConfirmModal, type PublishConfirmPayload } from "@/components/episode/ConfirmModals";
import { Snackbar } from "@/components/episode/Snackbar";
import { EpisodeForm } from "@/components/episode/EpisodeForm";
import { Button } from "@/components/ui/button";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formDialogShellClassName, formDialogSheetBodyWrapperClassName, formDialogSheetEpisodeFormClassName } from "@/components/ui/modal";
import {
  PAGE_GUTTER_X_CLASS,
  PAGE_MOBILE_FIXED_ACTION_BAR_SCROLL_PAD_CLASS,
  PAGE_SCROLL_COLUMN_CLASS,
  PAGE_SCROLL_COLUMN_ROOT_ATTR,
  PAGE_SUBHEADER_WITH_STICKY_CLASS,
} from "@/lib/page-layout";
import { SeriesFormStepNav } from "@/components/series/SeriesFormStepNav";
import { cn } from "@/lib/utils";
import { applyInitialScriptToEditor } from "@/lib/apply-initial-script-to-editor";
import { createDefaultSeedBlocks, useEditorStore } from "@/store/useEditorStore";
import type { Episode, SortOptions, SnackbarState, SeriesType } from "@/types/episode";
import { DUMMY_BACKGROUND_GALLERY_THUMBNAILS } from "@/lib/dummy-thumbnail-images";
import { formatScheduledPublishSummary } from "@/lib/formatEpisode";

const PAGE_SIZE = 10;

/** 정렬 옵션 기본값: 회차 최신순 (정책 4) */
const DEFAULT_SORT: SortOptions = {
  field: "episodeNumber",
  direction: "desc",
};

/** 에피소드 썸네일용 더미 이미지
 *  - 리소스 관리에서 사용하는 더미 리소스 중
 *    등장인물·연출장면을 제외한 배경/갤러리 썸네일만 사용
 *  - 실제 서비스 연동 시에는 에피소드별 대표 썸네일 리소스로 교체 예정
 */
const RESOURCE_THUMBNAIL_IMAGES = DUMMY_BACKGROUND_GALLERY_THUMBNAILS;

/** SSR/CSR 동일 — Math.random 금지(하이드레이션 불일치 방지) */
function deterministicViews(episodeNumber: number): number {
  return 100 + ((episodeNumber * 7919 + 12345) % 4901);
}

function deterministicThumbnail(episodeNumber: number): string {
  const idx =
    Math.abs((episodeNumber * 1103515245 + 12345) % RESOURCE_THUMBNAIL_IMAGES.length) %
    RESOURCE_THUMBNAIL_IMAGES.length;
  return RESOURCE_THUMBNAIL_IMAGES[idx]!;
}

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
    const views = deterministicViews(n);
    const thumbnail = deterministicThumbnail(n);

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
      date: "2026-06-19",
      views: 0,
      status: "SCHEDULED",
      scheduledPublishAt: "2026-06-19T15:00:00",
    },
    {
      episodeNumber: 120,
      title: "새벽의 문턱에서",
      date: "2026-01-15",
      views: 0,
      status: "PRIVATE",
      scheduledPublishAt: null,
    },
    {
      episodeNumber: 121,
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
    } else {
      const base = episodes[0];
      if (!base) continue;
      episodes.push({
        ...base,
        id: o.episodeNumber ?? episodes.length + 1,
        episodeNumber: o.episodeNumber ?? episodes.length + 1,
        title: `에피소드 ${o.episodeNumber}화`,
        thumbnail: deterministicThumbnail(o.episodeNumber ?? episodes.length + 1),
        date: new Date().toISOString().slice(0, 10),
        views: 0,
        status: "PUBLISHED",
        scheduledPublishAt: null,
        ...o,
      });
    }
  }

  return episodes;
}

const MOCK_EPISODES: Episode[] = buildMockEpisodes();

export default function EpisodeManagementPage() {
  const router = useRouter();
  const setCurrentView = useEditorStore((s) => s.setCurrentView);
  const setBlocks = useEditorStore((s) => s.setBlocks);
  const setRawScript = useEditorStore((s) => s.setRawScript);
  const pathname = usePathname();
  const seriesId = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[1] ?? "1";
  }, [pathname]);

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>(MOCK_EPISODES);
  const [sortOptions] = useState<SortOptions>(DEFAULT_SORT);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateEpisodeModalOpen, setIsCreateEpisodeModalOpen] = useState(false);
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
  const nextEpisodeNumber = useMemo(() => {
    const maxEpisodeNo = episodes.reduce((max, episode) => {
      return episode.episodeNumber > max ? episode.episodeNumber : max;
    }, 0);
    return maxEpisodeNo + 1;
  }, [episodes]);

  /** 정책 1: 뒤로가기 → 시리즈 목록 화면 */
  const handleBack = useCallback(() => {
    router.push("/series");
  }, [router]);

  /** 정책 3: 에피소드 추가 → 현재 페이지에서 생성 모달 오픈 */
  const handleAddEpisode = useCallback(() => {
    setIsCreateEpisodeModalOpen(true);
  }, []);

  /** 정책 16: 리소스 관리 → 리소스 관리 화면 */
  const handleResourceManagement = useCallback(() => {
    router.push(`/series/${seriesId}/resources`);
  }, [router, seriesId]);

  /** 에피소드 행 클릭 → 편집 가능한 원고 에디터 */
  const handleEdit = useCallback(
    (episode: Episode) => {
      setCurrentView("editor");
      applyInitialScriptToEditor();
      const titleParam = encodeURIComponent(episode.title || "에피소드 제목");
      const thumbnailParam = encodeURIComponent(episode.thumbnail || "");
      router.push(
        `/editor?episodeNo=${episode.episodeNumber}&episodeTitle=${titleParam}&episodeThumbnail=${thumbnailParam}`,
      );
    },
    [router, setCurrentView],
  );

  /** 정책 6: 공개 전환 클릭 → 확인 팝업 */
  const handlePublishClick = useCallback((episode: Episode) => {
    setEpisodeToPublish(episode);
    setIsPublishModalOpen(true);
  }, []);

  const handlePublishConfirm = useCallback((payload: PublishConfirmPayload) => {
    const { episode, mode, scheduledPublishAt } = payload;

    if (mode === "immediate") {
      setEpisodes((prev) =>
        prev.map((e) =>
          e.id === episode.id
            ? { ...e, status: "PUBLISHED" as const, scheduledPublishAt: null }
            : e,
        ),
      );
      setSnackbarState({
        open: true,
        message: "에피소드가 공개되었어요.",
      });
    } else if (scheduledPublishAt) {
      setEpisodes((prev) =>
        prev.map((e) =>
          e.id === episode.id
            ? {
                ...e,
                status: "SCHEDULED" as const,
                scheduledPublishAt,
              }
            : e,
        ),
      );
      setSnackbarState({
        open: true,
        message: `예약 공개가 설정되었어요. ${formatScheduledPublishSummary(scheduledPublishAt)}에 자동으로 공개됩니다.`,
      });
    }

    setEpisodeToPublish(null);
    setIsPublishModalOpen(false);
  }, []);

  const handleCancelSchedule = useCallback((episode: Episode) => {
    setEpisodes((prev) =>
      prev.map((e) =>
        e.id === episode.id
          ? { ...e, status: "PRIVATE" as const, scheduledPublishAt: null }
          : e,
      ),
    );
    setSnackbarState({
      open: true,
      message: "예약 공개가 취소되었어요.",
    });
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

  /** 정책 10: 에피소드 상세(수정 불가 잉크 에디터 미리보기) 진입 */
  const handleLinkEditor = useCallback(
    (episode: Episode) => {
      const titleParam = encodeURIComponent(episode.title || "에피소드 제목");
      router.push(
        `/series/${seriesId}/episodes/${episode.id}/detail?episodeNo=${episode.episodeNumber}&episodeTitle=${titleParam}`,
      );
    },
    [router, seriesId],
  );

  /**
   * 에피소드 행 클릭 — 공개·예약: 뷰어(읽기 전용) / 비공개·임시저장: 편집 에디터
   */
  const handleRowClick = useCallback(
    (episode: Episode) => {
      if (episode.status === "DRAFT" || episode.status === "PRIVATE") {
        handleEdit(episode);
        return;
      }
      handleLinkEditor(episode);
    },
    [handleEdit, handleLinkEditor],
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

  const handleCreateComplete = useCallback(
    (payload: { title: string; summary: string; thumbnailUrl: string }) => {
      // 모달 종료 애니메이션 잔상 없이 바로 빈 에디터로 진입
      setCurrentView("editor");
      setRawScript("");
      setBlocks(createDefaultSeedBlocks());
      const titleParam = encodeURIComponent(payload.title || "에피소드 제목");
      const summaryParam = encodeURIComponent(payload.summary || "");
      const thumbnailParam = encodeURIComponent(payload.thumbnailUrl || "");
      router.push(
        `/editor?episodeNo=${nextEpisodeNumber}&startEmpty=1&episodeTitle=${titleParam}&episodeSummary=${summaryParam}&episodeThumbnail=${thumbnailParam}`,
      );
    },
    [nextEpisodeNumber, router, setBlocks, setCurrentView, setRawScript],
  );

  return (
    <StandaloneHeaderPage
      profileImageUrl={profileImageUrl}
      onProfileImageChange={setProfileImageUrl}
      className="max-lg:bg-surface-10"
    >
      <header className={PAGE_SUBHEADER_WITH_STICKY_CLASS}>
              <div className="flex w-full max-w-[1200px] items-center justify-start gap-my-12">
                <HeaderBackButton onClick={handleBack} aria-label="시리즈 목록으로" />
                <h1 className="text-heading2_700 text-on-surface-10">에피소드 관리</h1>
              </div>
            </header>

            <div
              className={cn(
                PAGE_SCROLL_COLUMN_CLASS,
                PAGE_MOBILE_FIXED_ACTION_BAR_SCROLL_PAD_CLASS,
                "max-lg:bg-surface-10 max-lg:px-my-20",
                "max-lg:pt-my-24 lg:pt-my-40",
              )}
              {...{ [PAGE_SCROLL_COLUMN_ROOT_ATTR]: "" }}
            >
              <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-my-12">
              {/* Title & Actions - 정책 2, 3, 16 */}
              <div className="flex w-full shrink-0 flex-col gap-my-12 px-0 lg:flex-row lg:items-center lg:justify-between">
                <h2 className="min-w-0 text-heading4_700 text-on-surface-10">{seriesTitle}</h2>
                <div className="hidden items-center gap-my-12 lg:flex">
                  <Button type="button" variant="outline" onClick={handleResourceManagement}>
                    리소스 관리
                  </Button>
                  <Button type="button" onClick={handleAddEpisode}>
                    새 에피소드
                  </Button>
                </div>
              </div>

              {/* 정책 14, 15: 빈 화면 배너 또는 리스트/페이지네이션 */}
              {showEmptyBanner ? (
                <div className={`w-full ${PAGE_GUTTER_X_CLASS}`}>
                  <EmptyStateBanner />
                </div>
              ) : (
                <div className="flex w-full flex-col max-lg:gap-my-12 lg:overflow-hidden lg:rounded-[4px] lg:border lg:border-border-10 lg:bg-white">
                  <EpisodeList
                    episodes={paginatedEpisodes}
                    onRowClick={handleRowClick}
                    onPublish={handlePublishClick}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onLinkEditor={handleLinkEditor}
                    onStats={handleStats}
                    onInquiry={handleInquiry}
                    onCancelSchedule={handleCancelSchedule}
                  />
                  {showPagination ? (
                    <Pagination
                      currentPage={currentPage}
                      totalItems={totalItems}
                      onPageChange={setCurrentPage}
                      pageSize={PAGE_SIZE}
                      className="max-lg:border-0 max-lg:bg-transparent lg:rounded-b-[4px] lg:border-t lg:border-divider-10"
                    />
                  ) : null}
                </div>
              )}
              </div>
            </div>

            <SeriesFormStepNav className="lg:hidden">
              <Button type="button" variant="outline" onClick={handleResourceManagement}>
                리소스 관리
              </Button>
              <Button type="button" onClick={handleAddEpisode}>
                새 에피소드
              </Button>
            </SeriesFormStepNav>

      <PublishConfirmModal
        open={isPublishModalOpen}
        episode={episodeToPublish}
        onClose={() => {
          setIsPublishModalOpen(false);
          setEpisodeToPublish(null);
        }}
        onConfirm={handlePublishConfirm}
        onCancelSchedule={handleCancelSchedule}
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
      <Dialog open={isCreateEpisodeModalOpen} onOpenChange={setIsCreateEpisodeModalOpen}>
        <DialogContent
          presentation="auto"
          className={formDialogShellClassName}
          aria-describedby={undefined}
        >
          <div className={formDialogSheetBodyWrapperClassName}>
            <header className="shrink-0 border-b border-border-10 px-my-12 py-my-16 lg:sr-only lg:border-0 lg:p-0">
              <DialogTitle className="text-body1_700 text-on-surface-10">
                새 에피소드 생성
              </DialogTitle>
            </header>
            <EpisodeForm
              onConverted={handleCreateComplete}
              onCancel={() => setIsCreateEpisodeModalOpen(false)}
              containerClassName={formDialogSheetEpisodeFormClassName}
              stickyFooter
              sectionTitle={`${nextEpisodeNumber}화 에피소드`}
            />
          </div>
        </DialogContent>
      </Dialog>
    </StandaloneHeaderPage>
  );
}
