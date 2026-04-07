"use client";

import React, { useState } from "react";
import Header from "@/components/Header/Header";
import AppSidebar from "@/components/AppSidebar/AppSidebar";
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
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<InquiryTab>("inquiry");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [inquiryHistory, setInquiryHistory] = useState<InquiryHistoryItem[]>(MOCK_INQUIRY_HISTORY);

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-slate-50">
        <AppSidebar defaultActiveId="inquiry" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-hidden bg-slate-50">
            {/* Sub Header (레이아웃 가이드: margin 40, max-width 1200, min-width 640) */}
            <div className="w-full h-[64px] shrink-0 border-b border-slate-200 bg-white flex flex-col items-center justify-center px-5">
              <div className="w-full max-w-[1200px] flex items-center justify-start gap-4">
                <h1 className="text-2xl font-bold text-on-surface-10">문의</h1>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col items-center py-8 gap-3 px-5">
              <div className="w-full max-w-[1200px] mx-auto">
              <div className="w-full h-fit rounded-2xl border border-slate-200 bg-white flex flex-col shrink-0 overflow-hidden">
                {/* 탭 헤더 - NotificationList와 동일 구조 */}
                <div className="self-stretch px-5 pt-0 pb-0 mt-2 mb-0 border-b border-border-10 inline-flex flex-col justify-start items-start gap-2.5">
                  <div
                    data-size="L"
                    data-underline="true"
                    className="w-full inline-flex justify-start items-center gap-4 overflow-hidden"
                  >
                    <button
                      type="button"
                      data-height="h40"
                      data-selectline="true"
                      className={
                        "h-10 flex cursor-pointer justify-center items-center gap-2.5 min-w-0 " +
                        (activeTab === "inquiry"
                          ? "border-b-2 border-slate-800 text-on-surface-10 text-base font-bold font-['Pretendard_JP'] leading-6"
                          : "text-on-surface-disabled text-base font-bold font-['Pretendard_JP'] leading-6")
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
                        "h-10 flex cursor-pointer justify-center items-center gap-2.5 min-w-0 " +
                        (activeTab === "history"
                          ? "border-b-2 border-slate-800 text-on-surface-10 text-base font-bold font-['Pretendard_JP'] leading-6"
                          : "text-on-surface-disabled text-base font-bold font-['Pretendard_JP'] leading-6")
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
                    <div className="flex flex-col gap-4">
                      <InquiryHistoryList items={inquiryHistory} />
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </div>
  );
}
