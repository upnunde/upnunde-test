"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/** [정책 9] BGM 추가 시 노출되는 음악 목록 팝업. 미리듣기 후 추가 가능 (뼈대). */
export interface BgmListModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (trackId: string, title: string, duration: string) => void;
}

const MOCK_TRACKS = [
  { id: "t1", title: "로렌스 테마", duration: "03:45" },
  { id: "t2", title: "전투 BGM", duration: "02:30" },
  { id: "t3", title: "평화로운 마을", duration: "04:00" },
];

export function BgmListModal({ open, onClose, onAdd }: BgmListModalProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlay = (id: string) => {
    setPlayingId((prev) => (prev === id ? null : id));
    // TODO: 실제 오디오 재생 연동
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[480px] max-w-[calc(100vw-2rem)] gap-4 bg-surface-10 rounded-2xl border border-border-10">
        <DialogHeader>
          <DialogTitle className="text-on-surface-10 text-xl font-bold font-['Pretendard_JP']">
            BGM 선택
          </DialogTitle>
          <DialogDescription className="text-on-surface-30 text-sm">
            미리듣기 후 추가할 음악을 선택하세요.
          </DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col gap-2 max-h-[320px] overflow-y-auto">
          {MOCK_TRACKS.map((track) => (
            <li
              key={track.id}
              className="flex items-center gap-3 rounded-md border border-border-10 px-3 py-2"
            >
              <button
                type="button"
                onClick={() => handlePlay(track.id)}
                className="w-8 h-8 rounded-full inline-flex justify-center items-center text-on-surface-10 hover:bg-slate-100"
                aria-label="미리듣기"
              >
                <span className="text-lg">{playingId === track.id ? "⏸" : "▶"}</span>
              </button>
              <span className="flex-1 text-on-surface-10 text-sm truncate">{track.title}</span>
              <span className="text-sm text-on-surface-30 tabular-nums">{track.duration}</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="shrink-0"
                onClick={() => {
                  onAdd(track.id, track.title, track.duration);
                  onClose();
                }}
              >
                추가
              </Button>
            </li>
          ))}
        </ul>
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              닫기
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
