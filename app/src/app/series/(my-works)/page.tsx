"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SeriesList } from "@/components/series/SeriesList";
import { SeriesDeleteModal } from "@/components/series/SeriesDeleteModal";
import { PolicyAgreementModal } from "@/components/series/PolicyAgreementModal";
import type { SeriesData } from "@/types/series";
import { useSeriesCatalogStore } from "@/store/useSeriesCatalogStore";

/**
 * 내 작품 — 시리즈 목록 (`/series`)
 */
export default function SeriesListPage() {
  const router = useRouter();
  const ensureDemoSeries = useSeriesCatalogStore((s) => s.ensureDemoSeries);
  const listSeries = useSeriesCatalogStore((s) => s.listSeries);
  const deleteSeries = useSeriesCatalogStore((s) => s.deleteSeries);
  const setSeriesStatus = useSeriesCatalogStore((s) => s.setSeriesStatus);

  const [seriesList, setSeriesList] = useState<SeriesData[]>([]);
  const [seriesToDelete, setSeriesToDelete] = useState<SeriesData | null>(null);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);

  useEffect(() => {
    const syncList = () => {
      ensureDemoSeries();
      setSeriesList(listSeries());
    };

    syncList();

    const unsubHydrate = useSeriesCatalogStore.persist.onFinishHydration(syncList);
    const unsubStore = useSeriesCatalogStore.subscribe(syncList);

    return () => {
      unsubHydrate();
      unsubStore();
    };
  }, [ensureDemoSeries, listSeries]);

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
    [router],
  );

  const handleResourceManage = useCallback(
    (series: SeriesData) => {
      router.push(`/series/${series.id}/resources`);
    },
    [router],
  );

  const handleSeriesManage = useCallback(
    (series: SeriesData) => {
      router.push(`/series/${series.id}/edit`);
    },
    [router],
  );

  const handleCreateSeries = useCallback(() => {
    router.push("/series/new");
  }, [router]);

  const handleOpenCreateSeries = useCallback(() => {
    setPolicyModalOpen(true);
  }, []);

  const handleDeleteSeries = useCallback(
    (target: SeriesData) => {
      deleteSeries(target.id);
    },
    [deleteSeries],
  );

  const handleSetPrivate = useCallback(
    (target: SeriesData) => {
      setSeriesStatus(target.id, "PRIVATE");
    },
    [setSeriesStatus],
  );

  const handleSetPublic = useCallback(
    (target: SeriesData) => {
      setSeriesStatus(target.id, "PUBLIC");
    },
    [setSeriesStatus],
  );

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
