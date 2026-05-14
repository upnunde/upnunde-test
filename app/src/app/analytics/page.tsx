"use client";

import dynamic from "next/dynamic";
import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header/Header";
import AppSidebar from "@/components/AppSidebar/AppSidebar";
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
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-surface-20">
        <AppSidebar defaultActiveId="analytics" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-hidden bg-surface-20">
            <div className="flex h-[64px] w-full shrink-0 flex-col items-center justify-center border-b border-border-10 bg-white px-5">
              <div className="flex w-full max-w-[1200px] items-center justify-start gap-4">
                <h1 className="text-2xl font-bold text-on-surface-10">분석</h1>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col justify-start items-stretch gap-0 overflow-y-auto px-5 py-0">
              <div className="mx-auto w-full min-w-0 max-w-[1200px]">
                <AnalyticsDashboard defaultArea={defaultArea} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
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
