"use client";

import { StandaloneHeaderPage } from "@/components/layout/StandaloneHeaderPage";
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
  return (
    <StandaloneHeaderPage>
      <ResourceManagementPage />
    </StandaloneHeaderPage>
  );
}
