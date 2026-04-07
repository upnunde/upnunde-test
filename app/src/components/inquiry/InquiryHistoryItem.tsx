"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import type { InquiryHistoryItem as InquiryHistoryItemType } from "@/types/inquiry";
import { INQUIRY_STATUS_LABEL, INQUIRY_CATEGORY_LABEL } from "@/types/inquiry";

export interface InquiryHistoryItemProps {
  item: InquiryHistoryItemType;
  /** 펼침 여부 (부모에서 제어, 한 번에 하나만 펼쳐짐) */
  isOpen?: boolean;
  /** 펼치기/접기 토글 시 호출 */
  onToggle?: () => void;
}

export function InquiryHistoryItem({
  item,
  isOpen = false,
  onToggle,
}: InquiryHistoryItemProps) {
  const { id, category, title, content, email, status, createdAt } = item;

  return (
    <div className="transition-colors hover:bg-slate-50">
      <button
        type="button"
        onClick={() => onToggle?.()}
        className="w-[calc(100%-40px)] mx-5 cursor-pointer self-stretch h-[80px] rounded-lg inline-flex justify-start items-center gap-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
        aria-expanded={isOpen}
        aria-controls={`inquiry-content-${id}`}
        id={`inquiry-trigger-${id}`}
      >
        <div
          className={`w-[72px] h-8 p-2 rounded flex justify-center items-center gap-2.5 ${
            status === "answered"
              ? "bg-slate-100 text-on-surface-20"
              : "bg-primary-primary-container text-primary"
          }`}
        >
          <div className="justify-start text-sm font-medium font-['Pretendard_JP'] leading-5">
            {INQUIRY_STATUS_LABEL[status]}
          </div>
        </div>
        <div className="flex-1 inline-flex flex-col justify-center items-start gap-1">
          <div className="inline-flex justify-start items-center gap-5">
            <div className="flex justify-start items-start gap-1">
              <div className="justify-start text-on-surface-10 text-[15px] font-semibold font-['Pretendard_JP'] leading-5">
                {title}
              </div>
            </div>
          </div>
          <div className="justify-start text-on-surface-30 text-xs font-normal font-['Pretendard_JP'] leading-4">
            {createdAt}
          </div>
        </div>
        <div className="w-8 h-8 px-3 rounded-[999px] flex justify-center items-center overflow-hidden bg-transparent text-on-surface-30">
          <ChevronDown
            className={`w-3 h-3 shrink-0 ${isOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </div>
      </button>

      {isOpen && (
        <div
          id={`inquiry-content-${id}`}
          role="region"
          aria-labelledby={`inquiry-trigger-${id}`}
          className="flex items-stretch gap-5 pl-[90px] pr-5 pb-5 pt-0"
        >
          <div
            className="w-px shrink-0 self-stretch min-h-0 bg-slate-100 rounded-full"
            aria-hidden
          />
          <div className="min-w-0 flex-1 flex flex-col gap-4 py-1">
            <div>
              <p className="text-[13px] font-bold text-on-surface-30 mb-1">문의 유형</p>
              <p className="text-sm text-on-surface-20">{INQUIRY_CATEGORY_LABEL[category]}</p>
            </div>
            <div>
              <p className="text-[13px] font-bold text-on-surface-30 mb-1">상세내용</p>
              <p className="text-sm text-on-surface-20 whitespace-pre-wrap leading-[160%]">
                {content}
              </p>
            </div>
            {email && (
              <div>
                <p className="text-[13px] font-bold text-on-surface-30 mb-1">연락 이메일</p>
                <p className="text-sm text-on-surface-20">{email}</p>
              </div>
            )}
            {status === "answered" && (
              <div className="rounded-lg bg-slate-50/50 px-4 py-3 text-on-surface-30">
                <p className="text-[13px] font-bold text-on-surface-30 mb-1">답변</p>
                <p className="text-sm text-on-surface-20">
                  문의해 주셔서 감사합니다. 검토 후 연락드리겠습니다.
                </p>
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle?.();
                }}
                className="h-8 cursor-pointer rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
