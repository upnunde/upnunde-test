"use client";

import React, { useState } from "react";
import Header from "@/components/Header/Header";
import AppSidebar from "@/components/AppSidebar/AppSidebar";
import { PageCard } from "@/components/layout/PageCard";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { Snackbar } from "@/components/episode/Snackbar";

type InquiryTab = "inquiry" | "history";

export default function InquiryPage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<InquiryTab>("inquiry");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-slate-50">
        <AppSidebar defaultActiveId="inquiry" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-hidden bg-slate-50">
            <div className="w-full h-[64px] shrink-0 border-b border-slate-200 bg-white flex flex-col items-center justify-center">
              <div className="w-full max-w-[1200px] min-w-[800px] p-0 flex items-center justify-start gap-4">
                <h1 className="text-2xl font-bold text-slate-900">문의</h1>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col items-center py-8 gap-3">
              <PageCard>
                <div className="w-full pt-0 pb-0 mt-0 mb-5 border-b border-slate-200 inline-flex flex-col justify-start items-start gap-2.5">
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
                        "h-10 flex justify-center items-center gap-2.5 min-w-0 " +
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
                        "h-10 flex justify-center items-center gap-2.5 min-w-0 " +
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
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <p className="text-slate-500 text-sm">등록된 문의내역이 없습니다.</p>
                      <p className="text-slate-400 text-xs mt-1">문의 탭에서 새 문의를 등록해 주세요.</p>
                    </div>
                  </div>
                )}
              </PageCard>
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
