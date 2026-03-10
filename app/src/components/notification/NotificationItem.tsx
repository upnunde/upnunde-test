"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import type { NotificationData } from "@/types/notification";

export interface NotificationItemProps {
  notification: NotificationData;
  /** 문의하기 클릭 시 실행할 핸들러 (부모에서 전달) */
  onContactClick?: (notification: NotificationData) => void;
  /** 목록의 마지막 항목인 경우 true (하단 보더 제거) */
  isLast?: boolean;
  /** 펼침 여부 (부모에서 제어, 한 번에 하나만 펼쳐짐) */
  isOpen?: boolean;
  /** 펼치기/접기 토글 시 호출 */
  onToggle?: () => void;
}

export function NotificationItem({
  notification,
  onContactClick,
  isLast,
  isOpen = false,
  onToggle,
}: NotificationItemProps) {
  const { id, category, title, content, date } = notification;

  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onContactClick?.(notification);
  };

  const handleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle?.();
  };

  return (
    <div className={`border-slate-100 ${isLast ? "" : "border-b"}`}>
      <button
        type="button"
        onClick={() => onToggle?.()}
        className="w-full cursor-pointer self-stretch h-[80px] rounded-lg inline-flex justify-start items-center gap-5"
        aria-expanded={isOpen}
        aria-controls={`notification-content-${id}`}
        id={`notification-trigger-${id}`}
      >
        <div className="w-[72px] h-8 p-2 bg-primary-primary-container rounded flex justify-center items-center gap-2.5">
          <div className="justify-start text-primary text-sm font-medium font-['Pretendard_JP'] leading-5">
            {notification.category === "NOTICE" ? "공지" : "작품알림"}
          </div>
        </div>
        <div className="flex-1 inline-flex flex-col justify-center items-start gap-1">
          <div className="inline-flex justify-start items-center gap-5">
            <div className="flex justify-start items-start gap-1">
              <div className="justify-start text-on-surface-10 text-[15px] font-semibold font-['Pretendard_JP'] leading-5">
                {notification.title}
              </div>
            </div>
          </div>
          <div className="justify-start text-on-surface-30 text-xs font-normal font-['Pretendard_JP'] leading-4">
            {notification.date}
          </div>
        </div>
        <button
          type="button"
          aria-label={isOpen ? "알림 접기" : "알림 펼치기"}
          data-disabled="false"
          data-error="false"
          data-level="ghost"
          data-size="h32"
          data-state="false"
          data-type="onlyicon"
          data-variant="outline"
          data-with-icon="true"
          className="w-8 h-8 px-3 rounded-[999px] cursor-pointer flex justify-center items-center overflow-hidden bg-transparent text-on-surface-30 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <ChevronDown
            className={`w-3 h-3 shrink-0 ${isOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
      </button>

      {isOpen && (
        <div
          id={`notification-content-${id}`}
          role="region"
          aria-labelledby={`notification-trigger-${id}`}
          className="flex items-stretch gap-5 pl-[72px] pr-4 pb-4 pt-0"
        >
          <div
            className="w-px shrink-0 self-stretch min-h-0 bg-slate-100 rounded-full"
            aria-hidden
          />
          <div className="min-w-0 flex-1 flex flex-col gap-3 py-1">
            {content != null && content !== "" ? (
              <p className="text-sm text-on-surface-20 whitespace-pre-wrap leading-[160%]">{content}</p>
            ) : (
              <p className="text-sm text-on-surface-30">내용 없음</p>
            )}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleContactClick}
                className="h-8 cursor-pointer flex items-center rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                문의하기
              </button>
              <button
                type="button"
                onClick={handleCollapse}
                className="h-8 cursor-pointer rounded-md border border-slate-200 bg-white px-3 flex items-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                접기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

