"use client";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PAGE_CONTAINER_CLASS, PAGE_SUBHEADER_CLASS } from "@/lib/page-layout";
import type { AnalyticsAreaTabId } from "@/components/analytics/AnalyticsDashboard";

const AnalyticsDashboard = dynamic(
  () => import("@/components/analytics/AnalyticsDashboard").then((m) => m.AnalyticsDashboard),
  {
    ssr: true,
    loading: () => (
      <div
        className="mx-auto w-full min-h-[min(60vh,520px)] max-w-[1200px] animate-pulse rounded-[4px] bg-slate-100"
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
      <main className="flex flex-1 flex-col overflow-hidden bg-surface-20">
        <div className={PAGE_SUBHEADER_CLASS}>
          <div className={`${PAGE_CONTAINER_CLASS} flex items-center justify-start gap-my-16`}>
            <h1 className="text-heading2_700 text-on-surface-10">분석</h1>
          </div>
        </div>
        <AnalyticsDashboard defaultArea={defaultArea} />
      </main>
    </AppShell>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div
          className="mx-auto w-full min-h-screen max-w-[1200px] animate-pulse bg-slate-50"
          aria-hidden
        />
      }
    >
      <AnalyticsPageContent />
    </Suspense>
  );
}
