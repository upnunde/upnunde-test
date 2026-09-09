"use client";

import { DeleteAcknowledgeDialog } from "@/components/ui/modal";
import { WorksDraftDeleteConfirmDialog } from "@/components/works/WorksDraftDeleteConfirmDialog";
import type { SeriesData } from "@/types/series";

/** 안내팝업 케이스: 시리즈를 삭제하시겠어요? */
export interface SeriesDeleteModalProps {
  open: boolean;
  series: SeriesData | null;
  onClose: () => void;
  onConfirm: (series: SeriesData) => void;
}

export function SeriesDeleteModal({
  open,
  series,
  onClose,
  onConfirm,
}: SeriesDeleteModalProps) {
  const isDraft = series?.status === "DRAFT";

  if (isDraft) {
    return (
      <WorksDraftDeleteConfirmDialog
        open={open}
        title="시리즈를 삭제할까요?"
        description="작성 중인 시리즈 초안이 삭제되며, 복구할 수 없어요."
        onOpenChange={(next) => {
          if (!next) onClose();
        }}
        onConfirm={() => {
          if (series) onConfirm(series);
        }}
      />
    );
  }

  return (
    <DeleteAcknowledgeDialog
      open={open}
      title="시리즈를 삭제하시겠어요?"
      description="시리즈를 삭제하면 포함된 모든 회차 정보와 에피소드, 설정된 캐릭터 및 BGM 리소스가 함께 영구 삭제되며, 복구가 불가능합니다."
      onClose={onClose}
      onConfirm={() => {
        if (series) onConfirm(series);
      }}
    />
  );
}
