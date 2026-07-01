"use client";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/skeleton";
import { PAGE_CONTAINER_CLASS, PAGE_SUBHEADER_WITH_FILTER_CLASS } from "@/lib/page-layout";
import type { AnalyticsAreaTabId } from "@/components/analytics/AnalyticsDashboard";

const AnalyticsDashboard = dynamic(
  () => import("@/components/analytics/AnalyticsDashboard").then((m) => m.AnalyticsDashboard),
  {
    ssr: true,
    loading: () => (
      <Skeleton
        className="mx-auto w-full min-h-[min(60vh,520px)] max-w-[1200px] rounded-sm"
        aria-hidden
      />
    ),
  },
);

function parseDefaultArea(searchParams: URLSearchParams): AnalyticsAreaTabId {
  const area = searchParams.get("area");
  if (area === "revenue" || area === "user" || area === "content") return area;
  return "content";
}

function AnalyticsPageContent() {
  const searchParams = useSearchParams();
  const defaultArea = parseDefaultArea(searchParams);
  return (
    <AppShell sidebarActiveId="analytics">
      <div className={PAGE_SUBHEADER_WITH_FILTER_CLASS}>
        <div className={`${PAGE_CONTAINER_CLASS} flex items-center justify-start gap-4`}>
          <h1 className="text-heading2_700 text-foreground">분석</h1>
        </div>
      </div>
      <AnalyticsDashboard defaultArea={defaultArea} />
    </AppShell>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div
          className="mx-auto w-full min-h-screen max-w-[1200px] animate-pulse bg-muted"
          aria-hidden
        />
      }
    >
      <AnalyticsPageContent />
    </Suspense>
  );
}
