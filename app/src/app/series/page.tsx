"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header/Header";
import AppSidebar from "@/components/AppSidebar/AppSidebar";
import { SeriesList } from "@/components/series/SeriesList";
import { SeriesDeleteModal } from "@/components/series/SeriesDeleteModal";
import type { SeriesData } from "@/types/series";

/** 기본(공개), 비공개, 작성중, 이용금지 4가지 상태 더미 */
const MOCK_SERIES: SeriesData[] = [
  {
    id: "1",
    title: "꽃에게는 독이 필요하다",
    thumbnailUrl: "https://placehold.co/200x350?text=Thumbnail",
    status: "PUBLIC",
    createdAt: "2025-12-01T09:00:00.000Z",
    episodeCount: 120,
    viewCount: 125000,
  },
  {
    id: "2",
    title: "달빛 아래 그대",
    thumbnailUrl: "https://placehold.co/200x350?text=Thumbnail",
    status: "PRIVATE",
    createdAt: "2025-11-15T14:30:00.000Z",
    episodeCount: 50,
    viewCount: 8900,
  },
  {
    id: "3",
    title: "작성 중인 시리즈",
    status: "DRAFT",
    createdAt: "2025-12-20T10:00:00.000Z",
    episodeCount: 0,
    viewCount: 0,
  },
  {
    id: "4",
    title: "가이드 위반 작품",
    thumbnailUrl: "https://placehold.co/200x350?text=Thumbnail",
    status: "BANNED",
    createdAt: "2025-10-01T00:00:00.000Z",
    episodeCount: 10,
    viewCount: 3200,
  },
];

/**
 * 시리즈 목록 화면 (정책 1: 에피소드 관리에서 뒤로가기 시 진입)
 */
export default function SeriesListPage() {
  const router = useRouter();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [seriesList, setSeriesList] = useState<SeriesData[]>(MOCK_SERIES);
  const [seriesToDelete, setSeriesToDelete] = useState<SeriesData | null>(null);

  const handleEpisodeManage = useCallback(
    (series: SeriesData) => {
      router.push(`/series/${series.id}/episodes`);
    },
    [router]
  );

  const handleResourceManage = useCallback(
    (series: SeriesData) => {
      router.push(`/series/${series.id}/resources`);
    },
    [router]
  );

  const handleViolationDetail = useCallback(
    (_series: SeriesData) => {
      router.push("/guide/violation");
    },
    [router]
  );

  const handleCreateSeries = useCallback(() => {
    router.push("/series/new");
  }, [router]);

  const handleDeleteSeries = useCallback(
    (target: SeriesData) => {
      setSeriesList((prev) => prev.filter((series) => series.id !== target.id));
    },
    []
  );

  const handleSetPrivate = useCallback((target: SeriesData) => {
    setSeriesList((prev) =>
      prev.map((s) => (s.id === target.id ? { ...s, status: "PRIVATE" as const } : s))
    );
  }, []);

  const handleSetPublic = useCallback((target: SeriesData) => {
    setSeriesList((prev) =>
      prev.map((s) => (s.id === target.id ? { ...s, status: "PUBLIC" as const } : s))
    );
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-slate-50">
        <AppSidebar defaultActiveId="series" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-hidden bg-slate-50">
            {/* Sub Header */}
            <div className="w-full h-[80px] shrink-0 border-b border-slate-200 bg-white flex flex-col items-center justify-center">
              <div className="w-full max-w-[1200px] min-w-[800px] p-0 flex items-center justify-start gap-4">
                <h1 className="text-2xl font-bold text-slate-900">시리즈</h1>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col items-center py-8 gap-3">
              <SeriesList
                seriesList={seriesList}
                onResourceManage={handleResourceManage}
                onEpisodeManage={handleEpisodeManage}
                onViolationDetail={handleViolationDetail}
                onSetPrivate={handleSetPrivate}
                onSetPublic={handleSetPublic}
                onDelete={(series) => setSeriesToDelete(series)}
                onCreateSeries={handleCreateSeries}
              />
            </div>

            <SeriesDeleteModal
              open={!!seriesToDelete}
              series={seriesToDelete}
              onClose={() => setSeriesToDelete(null)}
              onConfirm={(s) => {
                handleDeleteSeries(s);
                setSeriesToDelete(null);
              }}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
