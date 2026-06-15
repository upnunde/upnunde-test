"use client";

import React, { useState } from "react";
import { NotificationItem } from "@/components/notification/NotificationItem";
import type { NotificationData } from "@/types/notification";
import { SegmentedTextTabs } from "@/components/ui/segmented-text-tabs";
import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

export type NotificationTab = "all" | "NOTICE" | "WORK_ALERT";

export interface NotificationTabStripProps {
  activeTab: NotificationTab;
  onTabChange: (tab: NotificationTab) => void;
}

const TAB_ITEMS = [
  { id: "all" as const, label: "전체" },
  { id: "NOTICE" as const, label: "공지" },
  { id: "WORK_ALERT" as const, label: "작품알림" },
] as const;

/** 알림 목록 상단 탭(전체/공지/작품알림) — PageCard 내부에 배치 */
export function NotificationTabStrip({ activeTab, onTabChange }: NotificationTabStripProps) {
  return (
    <div className={cn("inline-flex flex-col items-start justify-start gap-my-8 self-stretch border-b border-border-10 pb-0 pt-0", PAGE_FLUSH_CONTENT_PAD_X_CLASS)}>
      <SegmentedTextTabs
        aria-label="알림 필터"
        items={TAB_ITEMS}
        activeId={activeTab}
        onSelect={(id) => onTabChange(id as NotificationTab)}
        underline
        size="l"
        tabListClassName="mb-0 self-stretch border-b-0"
      />
    </div>
  );
}

export interface NotificationListProps {
  /** 알림 데이터 배열 */
  notifications: NotificationData[];
  /** 문의하기 클릭 시 실행할 외부 핸들러 */
  onContactClick?: (notification: NotificationData) => void;
  /** 목록 하단 페이지네이션 (에피소드 목록 정책과 동일: 11개부터 표시) */
  footer?: React.ReactNode;
  className?: string;
}

/** 알림 목록 본문 — 카드 셸은 페이지 `PageCard`가 담당 */
export function NotificationList({
  notifications,
  onContactClick,
  footer,
  className,
}: NotificationListProps) {
  const [expandedId, setExpandedId] = useState<NotificationData["id"] | null>(null);

  return (
    <div className={cn("flex h-fit w-full shrink-0 flex-col", className)}>
      <ul className="flex flex-col" role="list">
        {notifications.map((notification, index) => (
          <React.Fragment key={notification.id}>
            {index > 0 ? (
              <li aria-hidden className="list-none">
                <div className="my-0 h-px w-full bg-surface-20" role="separator" />
              </li>
            ) : null}
            <li>
              <NotificationItem
                notification={notification}
                onContactClick={onContactClick}
                isOpen={expandedId === notification.id}
                onToggle={() =>
                  setExpandedId((prev) => (prev === notification.id ? null : notification.id))
                }
              />
            </li>
          </React.Fragment>
        ))}
      </ul>
      {footer != null ? footer : null}
    </div>
  );
}

export function filterNotificationsByTab(
  notifications: NotificationData[],
  activeTab: NotificationTab,
): NotificationData[] {
  if (activeTab === "all") return notifications;
  return notifications.filter((n) => n.category === activeTab);
}
