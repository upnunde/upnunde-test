"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageCard } from "@/components/layout/PageCard";
import {
  PAGE_CONTAINER_CLASS,
  PAGE_GUTTER_X_CLASS,
  PAGE_SCROLL_BOTTOM_CLASS,
  PAGE_SCROLL_TOP_CLASS,
  PAGE_SUBHEADER_WITH_FILTER_CLASS,
} from "@/lib/page-layout";
import { cn } from "design-system/utils";
import { InquiryFaqList } from "@/components/inquiry/InquiryFaqList";
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
  const [activeTab, setActiveTab] = useState<InquiryTab>("faq");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [inquiryHistory] = useState<InquiryHistoryItem[]>(MOCK_INQUIRY_HISTORY);

  return (
    <AppShell sidebarActiveId="inquiry">
      <div className={PAGE_SUBHEADER_WITH_FILTER_CLASS}>
          <div className={`${PAGE_CONTAINER_CLASS} flex items-center justify-start gap-4`}>
            <h1 className="text-heading2_700 text-foreground">문의</h1>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col items-center max-lg:overflow-visible lg:min-h-0 lg:flex-1 lg:overflow-y-auto",
            PAGE_SCROLL_TOP_CLASS,
            PAGE_SCROLL_BOTTOM_CLASS,
            PAGE_GUTTER_X_CLASS,
            "max-lg:px-0 max-lg:pt-0",
          )}
        >
          <div className="mx-auto flex w-full max-w-[1200px]">
            <div className="min-w-0 flex-1">
              <PageCard
                fullWidth
                className="flex h-fit shrink-0 flex-col gap-0 overflow-hidden rounded-sm px-0 pt-2 pb-5 max-lg:rounded-none max-lg:border-0 lg:px-0"
              >
                <InquiryTabStrip activeTab={activeTab} onTabChange={setActiveTab} />
                {activeTab === "faq" ? (
                  <InquiryFaqList
                    className="self-stretch"
                    onGoToInquiry={() => setActiveTab("inquiry")}
                  />
                ) : activeTab === "inquiry" ? (
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
                  <InquiryHistoryList className="self-stretch" items={inquiryHistory} />
                )}
              </PageCard>
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
