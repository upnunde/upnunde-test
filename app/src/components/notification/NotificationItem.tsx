"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import type { NotificationData } from "@/types/notification";

export interface NotificationItemProps {
  notification: NotificationData;
  /** 문의하기 클릭 시 실행할 핸들러 (부모에서 전달) */
  onContactClick?: (notification: NotificationData) => void;
  /** 펼침 여부 (부모에서 제어, 한 번에 하나만 펼쳐짐) */
  isOpen?: boolean;
  /** 펼치기/접기 토글 시 호출 */
  onToggle?: () => void;
}

export function NotificationItem({
  notification,
  onContactClick,
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
    <div className="transition-colors hover:bg-surface-20">
      <button
        type="button"
        onClick={() => onToggle?.()}
        className="mx-5 w-[calc(100%-40px)] cursor-pointer self-stretch h-[80px] rounded-lg inline-flex justify-start items-center gap-my-20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
        aria-expanded={isOpen}
        aria-controls={`notification-content-${id}`}
        id={`notification-trigger-${id}`}
      >
        <div
          className={`w-[72px] h-8 p-my-8 rounded flex justify-center items-center gap-my-8 ${
            category === "NOTICE"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          <div className="justify-start text-body3_500 font-['Pretendard_JP']">
            {category === "NOTICE" ? "공지" : "작품알림"}
          </div>
        </div>
        <div className="flex-1 inline-flex flex-col justify-center items-start gap-my-4">
          <div className="inline-flex justify-start items-center gap-my-20">
            <div className="flex justify-start items-start gap-my-4">
              <div className="justify-start text-on-surface-10 text-body2_500 font-['Pretendard_JP']">
                {title}
              </div>
            </div>
          </div>
          <div className="justify-start text-on-surface-30 text-caption1_400 font-['Pretendard_JP']">
            {date}
          </div>
        </div>
        <div className="w-8 h-8 px-my-12 rounded-[999px] flex justify-center items-center overflow-hidden bg-transparent text-on-surface-30">
          <ChevronDown
            className={`w-3 h-3 shrink-0 ${isOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </div>
      </button>

      {isOpen && (
        <div
          id={`notification-content-${id}`}
          role="region"
          aria-labelledby={`notification-trigger-${id}`}
          className="flex items-stretch gap-my-20 pl-[90px] pr-my-20 pb-my-20 pt-0"
        >
          <div
            className="w-px shrink-0 self-stretch min-h-0 bg-surface-20 rounded-full"
            aria-hidden
          />
          <div className="min-w-0 flex-1 flex flex-col gap-my-12 py-my-4">
            {content != null && content !== "" ? (
              <p className="text-body3_400 text-on-surface-20 whitespace-pre-wrap">{content}</p>
            ) : (
              <p className="text-body3_400 text-on-surface-30">내용 없음</p>
            )}
            <div className="flex items-center justify-end gap-my-8">
              <button
                type="button"
                onClick={handleContactClick}
                className="h-8 cursor-pointer flex items-center rounded-md border border-border-20 bg-white px-my-12 text-body3_500 text-on-surface-20 transition-colors hover:bg-surface-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:border-border-20"
              >
                문의하기
              </button>
              <button
                type="button"
                onClick={handleCollapse}
                className="h-8 cursor-pointer rounded-md border border-border-20 bg-white px-my-12 flex items-center text-body3_500 text-on-surface-20 transition-colors hover:bg-surface-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:border-border-20"
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

