"use client";

import React, { useState } from "react";
import Header from "@/components/Header/Header";
import { ResourceManagementPage } from "@/components/resource/ResourceManagementPage";

/**
 * 리소스 관리 페이지 (정책 1~12)
 * - 정책 1: 헤더 뒤로가기 → /series
 * - 정책 11, 12: 온보딩 배너, 닫기 시 영구 비노출
 * - 정책 2, 3, 5, 6, 7: 시각 자원 섹션 및 카드 (CharacterCard, ImageCard, MediaCard)
 * - 정책 4: 삭제 전 확인 팝업
 * - 정책 8, 9, 10: BGM 섹션 (리스트, 추가 팝업, 미리듣기/삭제)
 */
export default function SeriesResourcesPage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex min-h-0 flex-1 overflow-hidden bg-surface-20">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <ResourceManagementPage />
        </div>
      </div>
    </div>
  );
}
