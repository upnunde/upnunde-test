"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PAGE_CONTAINER_CLASS, PAGE_SCROLL_ROOT_CLASS, PAGE_SUBHEADER_CLASS } from "@/lib/page-layout";
import { cn } from "@/lib/utils";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { InquiryHistoryList } from "@/components/inquiry/InquiryHistoryList";
import { Snackbar } from "@/components/episode/Snackbar";
import type { InquiryHistoryItem } from "@/types/inquiry";

type InquiryTab = "inquiry" | "history";

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
      <main className="flex flex-1 flex-col overflow-hidden bg-surface-20">
        <div className={PAGE_SUBHEADER_CLASS}>
          <div className={`${PAGE_CONTAINER_CLASS} flex items-center justify-start gap-my-16`}>
            <h1 className="text-heading2_700 text-on-surface-10">문의</h1>
          </div>
        </div>
        <div className={cn(PAGE_SCROLL_ROOT_CLASS, "items-center gap-my-12")}>
          <div className={PAGE_CONTAINER_CLASS}>
              <div className="w-full h-fit rounded-[4px] border border-border-10 bg-white flex flex-col shrink-0 overflow-hidden">
                {/* 탭 헤더 - NotificationList와 동일 구조 */}
                <div className="self-stretch px-my-16 lg:px-my-20 pt-0 pb-0 mt-2 mb-0 border-b border-border-10 inline-flex flex-col justify-start items-start gap-my-8">
                  <div
                    data-size="L"
                    data-underline="true"
                    className="w-full inline-flex justify-start items-center gap-my-16 overflow-hidden"
                  >
                    <button
                      type="button"
                      data-height="h40"
                      data-selectline="true"
                      className={
                        "h-9 flex cursor-pointer justify-center items-center gap-my-8 min-w-0 " +
                        (activeTab === "inquiry"
                          ? "border-b-2 border-slate-800 text-on-surface-10 text-body1_700 font-['Pretendard_JP']"
                          : "text-on-surface-disabled text-body1_700 font-['Pretendard_JP']")
                      }
                      onClick={() => setActiveTab("inquiry")}
                      data-activated={activeTab === "inquiry"}
                    >
                      <span className="justify-start">문의</span>
                    </button>
                    <button
                      type="button"
                      data-height="h40"
                      data-selectline="true"
                      className={
                        "h-9 flex cursor-pointer justify-center items-center gap-my-8 min-w-0 " +
                        (activeTab === "history"
                          ? "border-b-2 border-slate-800 text-on-surface-10 text-body1_700 font-['Pretendard_JP']"
                          : "text-on-surface-disabled text-body1_700 font-['Pretendard_JP']")
                      }
                      onClick={() => setActiveTab("history")}
                      data-activated={activeTab === "history"}
                    >
                      <span className="justify-start">문의내역</span>
                    </button>
                  </div>
                </div>

                {/* 콘텐츠 영역 */}
                <div className="pt-0 pb-0">
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
        </div>
      </main>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </AppShell>
  );
}
