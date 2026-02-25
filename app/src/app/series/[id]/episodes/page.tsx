\"use client\";

import React from "react";
import { ChevronLeft, MoreVertical, FileText, Mail, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const MOCK_EPISODES = [
  { id: 117, title: "기억의 늪에 빠진 로맨스", date: "2026.01.01", views: 0, status: "비공개" },
  { id: 118, title: "잊혀진 과거의 그림자", date: "2025.12.12", views: 0, status: "공개 중" },
  { id: 119, title: "운명의 갈림길에서", date: "2026.01.15", views: 0, status: "공개 중" },
  { id: 120, title: "빛과 그림자", date: "2026.01.22", views: 0, status: "공개 중" },
  { id: 121, title: "사라진 날들의 기억", date: "2026.01.29", views: 0, status: "공개 중" },
  { id: 122, title: "그대와 나의 시간", date: "2026.02.05", views: 0, status: "공개 중" },
];

export default function EpisodeManagementPage() {
  return (
    <div className="flex flex-col h-screen w-full bg-slate-50">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          {/* Sub Header */}
          <div className="w-full bg-white border-b border-slate-200 flex flex-col items-center shrink-0">
            <div className="w-full max-w-[1400px] min-w-[800px] px-10 py-8 flex items-center gap-4">
              <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <h1 className="text-2xl font-bold text-slate-900">에피소드 관리</h1>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center py-8 gap-6">
            {/* Title & Add Button */}
            <div className="w-full max-w-[1400px] min-w-[800px] px-10 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-slate-900">꽃에게는 독이 필요하다</h2>
              <button className="h-10 px-4 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-md transition-colors">
                에피소드 추가
              </button>
            </div>

            {/* Table Container */}
            <div className="w-full max-w-[1400px] min-w-[800px] mx-10 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col shrink-0">
              {/* Table Header */}
              <div className="h-12 border-b border-slate-100 flex items-center px-4 bg-white rounded-t-2xl">
                <div className="w-16 px-4 text-xs text-slate-400">회차</div>
                <div className="flex-1 px-4 text-xs text-slate-400">제목</div>
                <div className="w-32 px-4 text-xs text-slate-400">개시일</div>
                <div className="w-24 px-4 text-xs text-slate-400">조회수</div>
                <div className="w-24 px-4 text-xs text-slate-400">공개여부</div>
                <div className="w-48 px-4 text-xs text-slate-400 text-right">작업</div>
              </div>

              {/* Table Body */}
              <div className="flex flex-col">
                {MOCK_EPISODES.map((ep) => (
                  <div
                    key={ep.id}
                    className="flex items-center px-4 py-3 border-b border-slate-100 hover:bg-slate-100 transition-colors group"
                  >
                    <div className="w-16 px-4 text-sm text-slate-900">{ep.id}화</div>

                    <div className="flex-1 px-4 flex items-center gap-4">
                      <div className="w-14 h-20 bg-slate-200 rounded border border-slate-200 overflow-hidden shrink-0">
                        <img
                          src={`https://placehold.co/60x80`}
                          alt="thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-base font-medium text-slate-900">{ep.title}</span>
                    </div>

                    <div className="w-32 px-4 text-sm text-slate-600">{ep.date}</div>
                    <div className="w-24 px-4 text-sm text-slate-600">{ep.views}</div>
                    <div className="w-24 px-4 text-sm text-slate-600">{ep.status}</div>

                    <div className="w-48 px-4 flex justify-end items-center gap-2">
                      {ep.status === "비공개" ? (
                        <>
                          <button className="h-9 px-3 border border-pink-500 text-pink-500 rounded-md text-sm font-medium hover:bg-pink-50 transition-colors">
                            공개로 전환
                          </button>
                          <button className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="w-9 h-9 flex items-center justify-center rounded-full border border-transparent hover:border-slate-200 hover:bg-slate-200 text-slate-500 outline-none transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-40 bg-white rounded-lg shadow-lg border border-slate-100 p-1"
                          >
                            <DropdownMenuItem className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 rounded-md outline-none">
                              <FileText className="w-4 h-4 text-slate-500" /> 에피소드 상세
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 rounded-md outline-none">
                              <Mail className="w-4 h-4 text-slate-500" /> 문의하기
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="h-16 border-t border-slate-100 flex justify-center items-center gap-8 bg-white rounded-b-2xl">
                <div className="flex gap-1">
                  <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900">
                    &lt;
                  </button>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        page === 3 ? "bg-[#2d2d2d] text-white" : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900">
                    &gt;
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      defaultValue="3"
                      className="w-12 h-8 text-center text-sm border border-slate-200 rounded outline-none focus:border-slate-400"
                    />
                    <span className="text-sm text-slate-400">/ 23</span>
                  </div>
                  <button className="h-8 px-3 border border-slate-200 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    Go
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

