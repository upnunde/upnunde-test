"use client";

import React from "react";
import { Play, Trash2 } from "lucide-react";
import type { BgmResource } from "@/types/resource";

/** [정책 10] BGM 리스트 항목. 참조 스타일(h-14, 번호+제목/시간). 미리듣기 + 삭제. */
export interface BgmListItemProps {
  item: BgmResource;
  index: number;
  onPlay: (item: BgmResource) => void;
  onDelete: (item: BgmResource) => void;
}

export function BgmListItem({ item, index, onPlay, onDelete }: BgmListItemProps) {
  return (
    <div className="self-stretch h-14 py-2 rounded-lg inline-flex justify-center items-center gap-1 overflow-hidden">
      <div className="w-5 self-stretch inline-flex flex-col justify-start items-start gap-0.5 shrink-0">
        <div className="justify-center text-on-surface-10 text-sm font-medium font-['Pretendard_JP'] leading-5">
          {index + 1}
        </div>
        <div className="self-stretch justify-center text-on-surface-30 text-xs font-normal font-['Pretendard_JP'] leading-4">
          {" "}
        </div>
      </div>
      <div className="flex-1 min-w-0 inline-flex flex-col justify-start items-start gap-0.5">
        <div className="self-stretch justify-center text-on-surface-10 text-sm font-medium font-['Pretendard_JP'] leading-5 truncate">
          {item.title}
        </div>
        <div className="self-stretch justify-center text-on-surface-30 text-xs font-normal font-['Pretendard_JP'] leading-4">
          {item.duration}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onPlay(item)}
          className="w-8 h-8 rounded-full inline-flex justify-center items-center text-on-surface-10 hover:bg-slate-100"
          aria-label="미리듣기"
        >
          <Play className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(item)}
          className="w-8 h-8 rounded-full inline-flex justify-center items-center text-on-surface-10 hover:bg-slate-100 hover:text-destructive"
          aria-label="삭제"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
