"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Header from "@/components/Header/Header";
import AppSidebar from "@/components/AppSidebar/AppSidebar";
import { Button } from "@/components/ui/button";
import { PageCard } from "@/components/layout/PageCard";

type InquiryTab = "inquiry" | "history";

export default function InquiryPage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<InquiryTab>("inquiry");
  const [category, setCategory] = useState<"account" | "payment" | "bug" | "etc">("account");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 실제 문의 접수 API 연동
    // eslint-disable-next-line no-alert
    alert("문의가 임시로 저장되었습니다. 실제 전송 기능은 추후 연동 예정입니다.");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-slate-50">
        <AppSidebar defaultActiveId="inquiry" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-hidden bg-slate-50">
            <div className="w-full h-[80px] shrink-0 border-b border-slate-200 bg-white flex flex-col items-center justify-center">
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
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-10"
                >
                  {/* 문의 유형 */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="inquiry-category"
                      className="flex items-center justify-start text-sm font-bold text-slate-900"
                    >
                      문의 유형
                    </label>
                    <p className="text-xs text-slate-400">
                      문의 내용을 가장 잘 설명하는 유형을 선택해 주세요.
                    </p>
                    <div className="relative mt-1 w-full">
                      <select
                        id="inquiry-category"
                        value={category}
                        onChange={(e) =>
                          setCategory(e.target.value as "account" | "payment" | "bug" | "etc")
                        }
                        className="h-10 w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-3 text-sm text-slate-900 outline-none focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="account">계정 / 로그인</option>
                        <option value="payment">결제 / 정산</option>
                        <option value="bug">버그 / 오류 제보</option>
                        <option value="etc">기타 문의</option>
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700"
                        aria-hidden
                      />
                    </div>
                  </div>

                  {/* 제목 */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="inquiry-title"
                      className="flex items-center justify-start text-sm font-bold text-slate-900"
                    >
                      제목
                    </label>
                    <p className="text-xs text-slate-400">제목을 입력해주세요.</p>
                    <input
                      id="inquiry-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="제목을 입력해주세요."
                      className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  {/* 상세내용 작성 */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="inquiry-content"
                      className="flex items-center justify-start text-sm font-bold text-slate-900"
                    >
                      상세내용 작성
                    </label>
                    <p className="text-xs text-slate-400">
                      내용을 최대한 상세하게 작성해 주세요.
                    </p>
                    <textarea
                      id="inquiry-content"
                      rows={6}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="상세내용을 작성해 주세요."
                      className="mt-1 resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <p className="text-xs text-on-surface-30">
                      개인정보(주민등록번호, 카드번호 등) 입력은 지양해 주세요. 필요한 경우 최소한의 정보만
                      적어 주셔도 충분합니다.
                    </p>
                  </div>

                  {/* 이메일 */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="inquiry-email"
                      className="flex items-center justify-start text-sm font-bold text-slate-900"
                    >
                      이메일
                    </label>
                    <p className="text-xs text-slate-400">
                      답변이 필요하신 경우 이메일 주소를 남겨주세요.
                    </p>
                    <input
                      id="inquiry-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="이메일 주소를 입력해주세요."
                      className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* 이미지 파일 첨부 */}
                  <div className="flex flex-col gap-1 pb-2">
                    <label className="flex items-center justify-start text-sm font-bold text-slate-900">
                      이미지 파일 첨부
                    </label>
                    <p className="text-xs text-slate-400">최대 5개의 파일 업로드 가능</p>
                    <p className="text-xs text-slate-400">
                      지원되는 파일 유형: jpg, png, gif, webp, heic, tiff
                    </p>
                    <div className="mt-2">
                      <label
                        htmlFor="inquiry-attachments"
                        className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition-colors hover:border-slate-400 hover:bg-slate-100"
                      >
                        <span className="text-2xl leading-none">+</span>
                      </label>
                      <input
                        id="inquiry-attachments"
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.gif,.webp,.heic,.tiff"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* 버튼 영역 */}
                  <div className="mt-4 flex items-center justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="px-5"
                      onClick={() => {
                        setCategory("account");
                        setTitle("");
                        setContent("");
                        setEmail("");
                      }}
                    >
                      취소
                    </Button>
                    <Button type="submit" size="sm" className="px-5" disabled={!title || !content}>
                      제출
                    </Button>
                  </div>
                </form>
                ) : (
                <div className="flex flex-col gap-4">
                  {/* 문의내역: 빈 상태 또는 목록 (추후 API 연동) */}
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
    </div>
  );
}
