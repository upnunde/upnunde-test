"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PageCard } from "@/components/layout/PageCard";
import {
  PAGE_CONTAINER_CLASS,
  PAGE_DESKTOP_SCROLL_SHELL_CLASS,
  PAGE_FILTER_HEADER_INNER_CLASS,
  PAGE_FILTER_HEADER_SHELL_CLASS,
  PAGE_SCROLL_ROOT_FLOW_CLASS,
  PAGE_SCROLL_ROOT_MOBILE_FLUSH_CLASS,
  PAGE_SUBHEADER_WITH_FILTER_CLASS,
} from "@/lib/page-layout";
import { APP_BROWSER_BG_ROOT_CLASS } from "@/lib/mobile-viewport";
import { cn } from "design-system/utils";
import { analyticsScopeFilterShellClassName } from "@/components/analytics/analytics-filter-chips";
import { CONTROL_GROUP_GAP_STANDARD_RESPONSIVE_CLASS } from "@/lib/chip-styles";
import {
  filterNotificationsByTab,
  NotificationList,
  NotificationTabStrip,
  type NotificationTab,
} from "@/components/notification/NotificationList";
import { Pagination } from "@/components/episode/Pagination";
import type { NotificationData } from "@/types/notification";
import { markNotificationAsRead, useNotifications } from "@/lib/notification-store";

/** 알림 목록: 페이지당 20개, 21개부터 페이지네이션 운영 */
const PAGE_SIZE = 20;

function parseOpenNotificationId(raw: string | null): NotificationData["id"] | null {
  if (raw == null || raw === "") return null;
  return /^\d+$/.test(raw) ? Number(raw) : raw;
}

function NotificationsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notifications = useNotifications();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [openId, setOpenId] = useState<NotificationData["id"] | null>(null);
  const [openKey, setOpenKey] = useState(0);

  const filteredNotifications = useMemo(
    () => filterNotificationsByTab(notifications, activeTab),
    [activeTab, notifications],
  );
  const totalItems = filteredNotifications.length;
  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredNotifications.slice(start, start + PAGE_SIZE);
  }, [filteredNotifications, currentPage]);
  const showPagination = totalItems > PAGE_SIZE;

  const handleContactClick = useCallback(
    (_notification: NotificationData) => {
      router.push("/inquiry");
    },
    [router]
  );

  const handleMarkAsRead = useCallback((id: NotificationData["id"]) => {
    markNotificationAsRead(id);
  }, []);

  const pendingOpenRef = React.useRef<string | null>(null);

  useEffect(() => {
    const raw = searchParams.get("open");
    const requestedId = parseOpenNotificationId(raw);
    if (requestedId == null) {
      pendingOpenRef.current = null;
      return;
    }

    const requestKey = String(requestedId);
    if (pendingOpenRef.current === requestKey) return;

    const index = notifications.findIndex((item) => item.id === requestedId);
    if (index < 0) {
      router.replace("/notifications", { scroll: false });
      return;
    }

    pendingOpenRef.current = requestKey;
    setActiveTab("all");
    setCurrentPage(Math.floor(index / PAGE_SIZE) + 1);
    setOpenId(requestedId);
    setOpenKey((key) => key + 1);
    markNotificationAsRead(requestedId);
    router.replace("/notifications", { scroll: false });
  }, [notifications, router, searchParams]);

  useEffect(() => {
    if (openId == null) return;
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(`notification-trigger-${openId}`);
      if (target == null) return;
      target.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [openId, openKey, currentPage]);

  return (
    <AppShell sidebarActiveId="notification" browserBgClassName={APP_BROWSER_BG_ROOT_CLASS}>
      <div className={PAGE_DESKTOP_SCROLL_SHELL_CLASS}>
        <div className={PAGE_SUBHEADER_WITH_FILTER_CLASS}>
          <div className={`${PAGE_CONTAINER_CLASS} flex items-center justify-start gap-4`}>
            <h1 className="text-heading2_700 text-foreground">알림</h1>
          </div>
        </div>

        <div className={PAGE_FILTER_HEADER_SHELL_CLASS}>
          <div className={PAGE_FILTER_HEADER_INNER_CLASS}>
            <div className={analyticsScopeFilterShellClassName}>
              <div
                className={cn(
                  "flex w-full items-center overflow-x-auto",
                  CONTROL_GROUP_GAP_STANDARD_RESPONSIVE_CLASS,
                )}
              >
                <NotificationTabStrip
                  activeTab={activeTab}
                  onTabChange={(tab) => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            PAGE_SCROLL_ROOT_FLOW_CLASS,
            PAGE_SCROLL_ROOT_MOBILE_FLUSH_CLASS,
            "items-stretch justify-start gap-0",
          )}
        >
          <div className={cn(PAGE_CONTAINER_CLASS, "flex")}>
            <div className="min-w-0 flex-1">
              <PageCard
                fullWidth
                className={cn(
                  "flex h-fit shrink-0 flex-col gap-0 overflow-hidden rounded-sm px-0 pt-2 max-lg:rounded-none max-lg:border-0 lg:px-0",
                  showPagination ? "pb-0" : "pb-5",
                )}
              >
                <NotificationList
                  className="self-stretch"
                  notifications={paginatedNotifications}
                  openId={openId}
                  openKey={openKey}
                  onContactClick={handleContactClick}
                  onMarkAsRead={handleMarkAsRead}
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
              </PageCard>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={null}>
      <NotificationsPageInner />
    </Suspense>
  );
}
