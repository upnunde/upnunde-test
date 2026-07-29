import { AppShell } from "@/components/layout/AppShell";
import {
  AnalyticsDashboard,
  type AnalyticsAreaTabId,
} from "@/components/analytics/AnalyticsDashboard";
import { PAGE_CONTAINER_CLASS, PAGE_SUBHEADER_WITH_FILTER_CLASS } from "@/lib/page-layout";

function parseDefaultArea(area: string | string[] | undefined): AnalyticsAreaTabId {
  const value = Array.isArray(area) ? area[0] : area;
  if (value === "revenue" || value === "user" || value === "content") return value;
  return "content";
}

/**
 * 분석 — `searchParams`는 서버에서 읽어 Suspense/`useSearchParams` bailout을 피한다.
 * (Client Suspense 안에 Base UI Tabs가 있으면 `useId` hydration mismatch 발생)
 */
export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string | string[] }>;
}) {
  const sp = await searchParams;
  const defaultArea = parseDefaultArea(sp.area);

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
