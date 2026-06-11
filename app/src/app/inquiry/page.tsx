"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS,
  PAGE_CONTAINER_CLASS,
  PAGE_INLINE_TAB_STRIP_SHELL_CLASS,
  PAGE_SCROLL_ROOT_CLASS,
  PAGE_SCROLL_ROOT_MOBILE_FLUSH_CLASS,
  PAGE_SUBHEADER_WITH_FILTER_CLASS,
} from "@/lib/page-layout";
import { cn } from "@/lib/utils";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { InquiryHistoryList } from "@/components/inquiry/InquiryHistoryList";
import { InquiryTabStrip, type InquiryTab } from "@/components/inquiry/InquiryTabStrip";
import { Snackbar } from "@/components/episode/Snackbar";
import type { InquiryHistoryItem } from "@/types/inquiry";

/** 문의내역 목업 (답변대기 1건 + 답변완료 1건) */
const MOCK_INQUIRY_HISTORY: InquiryHistoryItem[] = [
  {
    id: "1",
    category: "account",
    title: "비밀번호 재설정 이메일이 오지 않아요",
    content:
      "비밀번호 찾기에서 이메일 주소 입력 후 요청했는데 10분이 지나도 메일이 도착하지 않습니다. 스팸함도 확인했어요. 재발송 버튼을 눌러도 동일합니다.",
    email: "user@example.com",
    status: "pending",
    createdAt: "2025.03.05",
  },
  {
    id: "2",
    category: "payment",
    title: "정산 일정 문의드립니다",
    content:
      "이번 달 정산 금액이 언제 입금되는지, 그리고 정산 기준일이 어떻게 되는지 안내 부탁드립니다.",
    email: "creator@example.com",
    status: "answered",
    createdAt: "2025.03.01",
    answeredAt: "2025.03.03",
  },
];

export default function InquiryPage() {
  const [activeTab, setActiveTab] = useState<InquiryTab>("inquiry");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [inquiryHistory] = useState<InquiryHistoryItem[]>(MOCK_INQUIRY_HISTORY);

  return (
    <AppShell sidebarActiveId="inquiry">
      <div className={PAGE_SUBHEADER_WITH_FILTER_CLASS}>
          <div className={`${PAGE_CONTAINER_CLASS} flex items-center justify-start gap-my-16`}>
            <h1 className="text-heading2_700 text-on-surface-10">문의</h1>
          </div>
        </div>

        <div className={PAGE_INLINE_TAB_STRIP_SHELL_CLASS}>
          <div className={PAGE_CONTAINER_CLASS}>
            <InquiryTabStrip activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>

        <div
          className={cn(
            PAGE_SCROLL_ROOT_CLASS,
            PAGE_SCROLL_ROOT_MOBILE_FLUSH_CLASS,
            "items-center gap-my-12 max-lg:gap-0",
          )}
        >
          <div className={PAGE_CONTAINER_CLASS}>
            <div
              className={cn(
                "flex h-fit w-full shrink-0 flex-col rounded-[4px] border border-border-10 bg-white max-lg:overflow-visible lg:overflow-hidden",
                PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS,
              )}
            >
              {activeTab === "inquiry" ? (
                <InquiryForm
                  onSubmit={(e) => {
                    e.preventDefault();
                    // TODO: 실제 문의 접수 API 연동
                  }}
                  onSuccess={() =>
                    setSnackbar({ open: true, message: "문의내용을 전달하였습니다" })
                  }
                />
              ) : (
                <div className="flex flex-col gap-my-16">
                  <InquiryHistoryList items={inquiryHistory} />
                </div>
              )}
            </div>
          </div>
        </div>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </AppShell>
  );
}
