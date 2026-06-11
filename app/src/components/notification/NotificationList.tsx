"use client";

import React, { useState } from "react";
import { NotificationItem } from "@/components/notification/NotificationItem";
import type { NotificationData } from "@/types/notification";
import { PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

export type NotificationTab = "all" | "NOTICE" | "WORK_ALERT";

export interface NotificationTabStripProps {
  activeTab: NotificationTab;
  onTabChange: (tab: NotificationTab) => void;
}

/** 알림 목록 상단 탭(전체/공지/작품알림) — 페이지 레벨 sticky 셸 안에 배치 */
export function NotificationTabStrip({ activeTab, onTabChange }: NotificationTabStripProps) {
  return (
    <div className="inline-flex w-full flex-col items-start justify-start gap-my-8 pt-0 pb-0 mt-2 mb-0">
      <div
        data-size="L"
        data-underline="true"
        className="inline-flex w-full items-center justify-start gap-my-16 overflow-hidden"
      >
        {(
          [
            { id: "all" as const, label: "전체" },
            { id: "NOTICE" as const, label: "공지" },
            { id: "WORK_ALERT" as const, label: "작품알림" },
          ] as const
        ).map(({ id, label }) => (
          <button
            key={id}
            type="button"
            data-height="h40"
            data-selectline="true"
            className={cn(
              "flex h-9 min-w-0 cursor-pointer items-center justify-center gap-my-8 font-['Pretendard_JP'] text-body1_700",
              activeTab === id
                ? "border-b-2 border-slate-800 text-on-surface-10"
                : "text-on-surface-disabled",
            )}
            onClick={() => onTabChange(id)}
            data-activated={activeTab === id}
          >
            <span className="justify-start">{label}</span>
          </button>
        ))}
      </div>
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

/** 알림 목록 카드 — 탭은 `NotificationTabStrip` + `PAGE_INLINE_TAB_STRIP_SHELL_CLASS`로 페이지에서 분리 */
export function NotificationList({
  notifications,
  onContactClick,
  footer,
  className,
}: NotificationListProps) {
  const [expandedId, setExpandedId] = useState<NotificationData["id"] | null>(null);

  return (
    <div
      className={cn(
        "flex h-fit w-full shrink-0 flex-col rounded-[4px] border border-border-10 bg-white max-lg:overflow-visible lg:overflow-hidden",
        PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS,
        className,
      )}
    >
      <div className="pt-0 pb-0">
        <ul className="flex flex-col" role="list">
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              {index > 0 ? (
                <li aria-hidden className="list-none">
                  <div className="mx-5 my-0 h-px bg-surface-20" role="separator" />
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
      </div>
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
