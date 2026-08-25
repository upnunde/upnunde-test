"use client";

import { useEffect, useState } from "react";
import { NotificationItem } from "@/components/notification/NotificationItem";
import type { NotificationData } from "@/types/notification";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "design-system/utils";
import { useNewNotificationIdSet } from "@/lib/notification-store";

export type NotificationTab = "all" | "NOTICE" | "WORK_ALERT" | "EVENT";

export interface NotificationTabStripProps {
  activeTab: NotificationTab;
  onTabChange: (tab: NotificationTab) => void;
  className?: string;
}

const TAB_ITEMS = [
  { id: "all" as const, label: "전체" },
  { id: "NOTICE" as const, label: "공지" },
  { id: "WORK_ALERT" as const, label: "작품알림" },
  { id: "EVENT" as const, label: "이벤트" },
] as const;

/** 알림 필터 띠 탭 — 분석·내 작품과 동일 (`text` · `2xl`) */
export function NotificationTabStrip({
  activeTab,
  onTabChange,
  className,
}: NotificationTabStripProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => onTabChange(v as NotificationTab)}
      className={cn("max-w-full min-w-0 min-h-12", className)}
    >
      <TabsList
        variant="text"
        size="2xl"
        aria-label="알림 필터"
        className="max-w-full min-w-0 overflow-x-auto"
      >
        {TAB_ITEMS.map(({ id, label }) => (
          <TabsTrigger key={id} value={id}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export interface NotificationListProps {
  /** 알림 데이터 배열 */
  notifications: NotificationData[];
  /** 문의하기 클릭 시 실행할 외부 핸들러 */
  onContactClick?: (notification: NotificationData) => void;
  /** 알림 펼침 시 읽음 처리 */
  onMarkAsRead?: (id: NotificationData["id"]) => void;
  /** 헤더 팝오버 등에서 지정한 펼침 대상 */
  openId?: NotificationData["id"] | null;
  /** `openId`가 같아도 다시 펼칠 때 증가 */
  openKey?: number;
  /** 목록 하단 페이지네이션 (에피소드 목록 정책과 동일: 11개부터 표시) */
  footer?: React.ReactNode;
  className?: string;
}

/** 알림 목록 본문 — 카드 셸은 페이지 `PageCard`가 담당 */
export function NotificationList({
  notifications,
  onContactClick,
  onMarkAsRead,
  openId = null,
  openKey = 0,
  footer,
  className,
}: NotificationListProps) {
  const [expandedId, setExpandedId] = useState<NotificationData["id"] | null>(openId);
  const newNotificationIds = useNewNotificationIdSet();

  useEffect(() => {
    if (openId == null) return;
    setExpandedId(openId);
  }, [openId, openKey]);

  const handleToggle = (notification: NotificationData) => {
    const willOpen = expandedId !== notification.id;
    const isNew = newNotificationIds.has(String(notification.id));
    // 새소식(dot) 항목을 펼치면 읽음 처리 → dot·헤더 목록에서 제거
    if (willOpen && (isNew || !notification.isRead)) {
      onMarkAsRead?.(notification.id);
    }
    setExpandedId(willOpen ? notification.id : null);
  };

  return (
    <div className={cn("flex h-fit w-full shrink-0 flex-col", className)}>
      <ul className="flex flex-col" role="list">
        {notifications.map((notification) => (
          <li key={notification.id}>
            <NotificationItem
              notification={notification}
              showNewDot={newNotificationIds.has(String(notification.id))}
              onContactClick={onContactClick}
              isOpen={expandedId === notification.id}
              onToggle={() => handleToggle(notification)}
            />
          </li>
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
