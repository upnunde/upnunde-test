"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SeriesList } from "@/components/series/SeriesList";
import { SeriesDeleteModal } from "@/components/series/SeriesDeleteModal";
import { PolicyAgreementModal } from "@/components/series/PolicyAgreementModal";
import type { SeriesData } from "@/types/series";

const SERIES_THUMBNAIL_IMAGES = [
  "/background-1.png",
  "/background-2.png",
  "/background-3.png",
  "/background-bakery-day.png",
  "/background-kitchen-night.png",
  "/background-bakery-night.png",
  "/background-kitchen-rain.png",
  "/background-street-day.png",
  "/background-room-night.png",
  "/background-street-night.png",
  "/background-room-day.png",
  "/background-street-evening.png",
  "/background-bakery-evening.png",
  "/background-room-rain.png",
  "/background-kitchen-day.png",
  "/background-bakery-rain.png",
  "/background-livingroom-day.png",
  "/background-room-evening.png",
  "/background-kitchen-evening.png",
  "/gallery-G3.png",
  "/gallery-G4.png",
  "/gallery-G5.png",
  "/gallery-G6.png",
  "/gallery-G7.png",
  "/gallery-G8.png",
  "/gallery-G9.png",
  "/gallery-G10.png",
  "/gallery-G11.png",
] as const;

function deterministicSeriesThumbnail(seriesId: string): string {
  let hash = 0;
  for (const ch of seriesId) {
    hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  }
  const index = hash % SERIES_THUMBNAIL_IMAGES.length;
  return SERIES_THUMBNAIL_IMAGES[index]!;
}

const MOCK_SERIES: SeriesData[] = [
  {
    id: "1",
    title: "꽃에게는 독이 필요하다",
    thumbnailUrl: deterministicSeriesThumbnail("1"),
    status: "PUBLIC",
    createdAt: "2025-12-01T09:00:00.000Z",
    episodeCount: 120,
    viewCount: 125000,
  },
  {
    id: "2",
    title: "달빛 아래 그대",
    thumbnailUrl: deterministicSeriesThumbnail("2"),
    status: "PRIVATE",
    createdAt: "2025-11-15T14:30:00.000Z",
    episodeCount: 50,
    viewCount: 8900,
  },
  {
    id: "4",
    title: "가이드 위반 작품",
    thumbnailUrl: deterministicSeriesThumbnail("4"),
    status: "BANNED",
    createdAt: "2025-10-01T00:00:00.000Z",
    episodeCount: 10,
    viewCount: 3200,
  },
];

/**
 * 내 작품 — 시리즈 목록 (`/series`)
 */
export default function SeriesListPage() {
  const router = useRouter();
  const [seriesList, setSeriesList] = useState<SeriesData[]>(MOCK_SERIES);
  const [seriesToDelete, setSeriesToDelete] = useState<SeriesData | null>(null);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);

  useEffect(() => {
    for (const series of seriesList) {
      router.prefetch(`/series/${series.id}/episodes`);
      router.prefetch(`/series/${series.id}/resources`);
      router.prefetch(`/series/${series.id}/edit`);
    }
  }, [router, seriesList]);

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

  const handleSeriesManage = useCallback(
    (series: SeriesData) => {
      router.push(`/series/${series.id}/edit`);
    },
    [router]
  );

  const handleCreateSeries = useCallback(() => {
    router.push("/series/new");
  }, [router]);

  const handleOpenCreateSeries = useCallback(() => {
    setPolicyModalOpen(true);
  }, []);

  const handleDeleteSeries = useCallback((target: SeriesData) => {
    setSeriesList((prev) => prev.filter((series) => series.id !== target.id));
  }, []);

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
    <>
      <SeriesList
        seriesList={seriesList.filter((s) => s.status !== "BANNED")}
        onResourceManage={handleResourceManage}
        onEpisodeManage={handleEpisodeManage}
        onSeriesManage={handleSeriesManage}
        onSetPrivate={handleSetPrivate}
        onSetPublic={handleSetPublic}
        onDelete={(series) => setSeriesToDelete(series)}
        onCreateSeries={handleOpenCreateSeries}
      />

      <SeriesDeleteModal
        open={!!seriesToDelete}
        series={seriesToDelete}
        onClose={() => setSeriesToDelete(null)}
        onConfirm={(s) => {
          handleDeleteSeries(s);
          setSeriesToDelete(null);
        }}
      />

      <PolicyAgreementModal
        open={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
        onConfirm={handleCreateSeries}
      />
    </>
  );
}
