"use client";

import React, { useState } from "react";
import { NotificationItem } from "@/components/notification/NotificationItem";
import type { NotificationData } from "@/types/notification";

export type NotificationTab = "all" | "NOTICE" | "WORK_ALERT";

export interface NotificationListProps {
  /** 알림 데이터 배열 */
  notifications: NotificationData[];
  /** 문의하기 클릭 시 실행할 외부 핸들러 */
  onContactClick?: (notification: NotificationData) => void;
  /** 목록 하단 페이지네이션 (에피소드 목록 정책과 동일: 11개부터 표시) */
  footer?: React.ReactNode;
  className?: string;
}

/**
 * 알림 목록 컨테이너: 탭(전체/공지/작품알림) + notifications를 map하여 NotificationItem 렌더링
 */
export function NotificationList({
  notifications,
  onContactClick,
  footer,
  className,
}: NotificationListProps) {
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [expandedId, setExpandedId] = useState<NotificationData["id"] | null>(null);

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.category === activeTab);

  return (
    <div
      className={
        "w-full h-fit rounded-2xl border border-slate-200 bg-white flex flex-col shrink-0 overflow-hidden " +
        (className ?? "")
      }
    >
      <div className="self-stretch px-5 pt-0 pb-0 mt-2 mb-0 border-b border-border-10 inline-flex flex-col justify-start items-start gap-2.5">
        <div
          data-size="L"
          data-underline="true"
          className="self-stretch inline-flex justify-start items-center gap-4 overflow-hidden"
        >
          <button
            type="button"
            data-height="h40"
            data-selectline="true"
            className={
              "h-10 flex cursor-pointer justify-center items-center gap-2.5 min-w-0 " +
              (activeTab === "all"
                ? "border-b-2 border-slate-800 text-on-surface-10 text-base font-bold font-['Pretendard_JP'] leading-6"
                : "text-on-surface-disabled text-base font-bold font-['Pretendard_JP'] leading-6")
            }
            onClick={() => {
              setActiveTab("all");
              setExpandedId(null);
            }}
            data-activated={activeTab === "all"}
          >
            <span className="justify-start">전체</span>
          </button>
          <button
            type="button"
            data-height="h40"
            data-selectline="true"
            className={
              "h-10 flex cursor-pointer justify-center items-center gap-2.5 min-w-0 " +
              (activeTab === "NOTICE"
                ? "border-b-2 border-slate-800 text-on-surface-10 text-base font-bold font-['Pretendard_JP'] leading-6"
                : "text-on-surface-disabled text-base font-bold font-['Pretendard_JP'] leading-6")
            }
            onClick={() => {
              setActiveTab("NOTICE");
              setExpandedId(null);
            }}
            data-activated={activeTab === "NOTICE"}
          >
            <span className="justify-start">공지</span>
          </button>
          <button
            type="button"
            data-height="h40"
            data-selectline="true"
            className={
              "h-10 flex cursor-pointer justify-center items-center gap-2.5 min-w-0 " +
              (activeTab === "WORK_ALERT"
                ? "border-b-2 border-slate-800 text-on-surface-10 text-base font-bold font-['Pretendard_JP'] leading-6"
                : "text-on-surface-disabled text-base font-bold font-['Pretendard_JP'] leading-6")
            }
            onClick={() => {
              setActiveTab("WORK_ALERT");
              setExpandedId(null);
            }}
            data-activated={activeTab === "WORK_ALERT"}
          >
            <span className="justify-start">작품알림</span>
          </button>
        </div>
      </div>
      <div className="pt-0 pb-0">
        <ul className="flex flex-col" role="list">
          {filteredNotifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              {index > 0 ? (
                <li aria-hidden className="list-none">
                  <div
                    className="mx-5 my-0 h-px bg-slate-100"
                    role="separator"
                  />
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
