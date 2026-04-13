"use client";

import { ChevronLeft, History } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { Button } from "@/components/ui/button";
import { Snackbar } from "@/components/episode/Snackbar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/** 히스토리 목록: MM.DD, HH:mm (예: 04.07, 16:23) */
function formatScriptHistoryTimestamp(savedAt: number): string {
  const d = new Date(savedAt);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${mm}.${dd}, ${hh}:${min}`;
}

export interface EditorSubHeaderProps {
  /** 제목 (예: "에피소드 제목") */
  title?: string;
  /** 다시 만들기 클릭 시 동작 (없으면 기본: 폼 화면 전환) */
  onRecreate?: () => void;
}

export function EditorSubHeader({ title = "에피소드 제목", onRecreate }: EditorSubHeaderProps) {
  const router = useRouter();
  const blocks = useEditorStore((s) => s.blocks);
  const scriptHistory = useEditorStore((s) => s.scriptHistory);
  const addScriptHistoryEntry = useEditorStore((s) => s.addScriptHistoryEntry);
  const currentView = useEditorStore((s) => s.currentView);
  const setCurrentView = useEditorStore((s) => s.setCurrentView);
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [isBackConfirmOpen, setIsBackConfirmOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const blocksSnapshot = useMemo(() => JSON.stringify(blocks), [blocks]);

  const hasValidationIssues = useMemo(() => {
    for (const block of blocks) {
      if (["scene", "top_desc", "text", "direction"].includes(block.type) && !block.content?.trim()) {
        return true;
      }

      if (block.type === "choice") {
        const choices = Array.isArray(block.data?.choices) ? block.data.choices : [];
        if (choices.length === 0) return true;
        for (const c of choices) {
          const textMissing = !c.isAiMode && !c.text?.trim();
          if (textMissing || !c.nextScene?.trim()) return true;
        }
      }
    }

    const eventStarts = blocks.filter((b) => b.type === "event").length;
    const eventEnds = blocks.filter((b) => b.type === "event_end").length;
    return eventStarts !== eventEnds;
  }, [blocks]);

  const goToEpisodeList = () => {
    if (currentView === "editor") {
      router.push("/series/1/episodes");
      return;
    }
    setCurrentView("form");
  };

  const handleBack = () => {
    if (hasChangesSinceSave) {
      setIsBackConfirmOpen(true);
      return;
    }
    goToEpisodeList();
  };

  /** 변경 없음일 때 '나가기' — 에피소드 목록(관리) 화면으로 이동 (에디터 폼 뒤로가기와 동일 경로) */
  const handleExitToEpisodeList = () => {
    router.push("/series/1/episodes");
  };

  const handleSubmit = () => {
    // TODO: 실제 등록 로직 연동 후 에피소드 목록 화면으로 이동
    router.push("/series/1/episodes");
  };

  const handleTemporarySave = () => {
    // TODO: 실제 임시저장 API 연동 시 저장 성공 시점에 snapshot 갱신
    setSavedSnapshot(blocksSnapshot);
    addScriptHistoryEntry();
    setSnackbar({ open: true, message: "임시저장을 완료했습니다" });
  };
  const handleRecreate = () => {
    setHistoryOpen(false);
    if (onRecreate) {
      onRecreate();
      return;
    }
    setCurrentView("form");
  };

  const hasChangesSinceSave = savedSnapshot == null || savedSnapshot !== blocksSnapshot;

  // 에피소드가 처음 생성되어 에디터에 진입했을 때 1회 자동 히스토리 저장
  useEffect(() => {
    if (blocks.length === 0) return;
    if (scriptHistory.length > 0) return;
    addScriptHistoryEntry("created");
    setSavedSnapshot(blocksSnapshot);
  }, [addScriptHistoryEntry, blocks.length, blocksSnapshot, scriptHistory.length]);

  /** 히스토리가 없을 때 목록 레이아웃용 예시 5건 (신규생성/임시저장 혼합). 최신이 위. */
  const emptyStateDemoEntries = useMemo(() => {
    const now = Date.now();
    return [
      { savedAt: now - 15 * 60 * 1000, source: "temporary" as const },
      { savedAt: now - 60 * 60 * 1000, source: "created" as const },
      { savedAt: now - 5 * 60 * 60 * 1000, source: "temporary" as const },
      { savedAt: now - 24 * 60 * 60 * 1000, source: "temporary" as const },
      { savedAt: now - 48 * 60 * 60 * 1000, source: "created" as const },
    ].sort((a, b) => b.savedAt - a.savedAt);
  }, []);

  return (
    <>
      <header className="mx-auto flex h-16 w-full min-w-[800px] shrink-0 items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleBack}
            className="h-9 w-9 shrink-0 rounded-full"
            aria-label="뒤로 가기"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </Button>
          <h1 className="text-2xl font-extrabold text-on-surface-10">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Popover open={historyOpen} onOpenChange={setHistoryOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 shadow-none bg-white"
                aria-label="히스토리"
              >
                <History className="h-5 w-5 text-on-surface-10" strokeWidth={2} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-[min(100vw-2rem,280px)] max-w-[280px] rounded-lg border border-slate-200 p-0 shadow-lg"
            >
              <div className="px-3 pt-4 pb-1">
                <p className="text-sm font-medium text-slate-400">히스토리</p>
              </div>
              <div className="max-h-[min(40vh,280px)] overflow-y-auto px-2 pb-1">
                <ul className="flex flex-col gap-0.5">
                  {emptyStateDemoEntries.map((entry, i) => (
                    <li key={`demo-${i}`}>
                      <div
                        className={cn(
                          "group flex min-h-10 items-center justify-between gap-2 rounded-md px-2 py-2",
                          "hover:bg-slate-100"
                        )}
                      >
                        <div className="min-w-0 flex items-center gap-2 text-sm font-medium">
                          <div className="text-on-surface-10">
                            {formatScriptHistoryTimestamp(entry.savedAt)}
                          </div>
                          <div className="text-on-surface-03">
                            {entry.source === "created" ? "신규생성" : "임시저장"}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          aria-disabled
                          tabIndex={-1}
                          title="임시저장 후 불러올 수 있어요"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                          className={cn(
                            "h-7 shrink-0 border-slate-200 bg-white px-2 text-xs font-medium text-on-surface-10 shadow-none",
                            "opacity-0 pointer-events-none transition-opacity",
                            "group-hover:opacity-100 group-hover:pointer-events-auto",
                            "[@media(hover:none)]:opacity-100 [@media(hover:none)]:pointer-events-auto",
                            "cursor-default"
                          )}
                        >
                          불러오기
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-slate-200 px-2 py-2.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-sm font-medium text-primary hover:bg-accent hover:text-primary"
                  onClick={handleRecreate}
                >
                  다시 만들기
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 shadow-none bg-white"
            onClick={hasChangesSinceSave ? handleTemporarySave : handleExitToEpisodeList}
          >
            {hasChangesSinceSave ? "임시저장" : "나가기"}
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={hasValidationIssues}
            className="h-10 shadow-none bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/40 disabled:hover:bg-primary/40"
            onClick={handleSubmit}
          >
            등록하기
          </Button>
        </div>
      </header>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={2000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
      <Dialog open={isBackConfirmOpen} onOpenChange={setIsBackConfirmOpen}>
        <DialogContent className="w-[min(92vw,420px)] max-w-[420px] border border-slate-200 bg-white p-5 shadow-none">
          <div className="space-y-2">
            <p className="text-base font-semibold text-on-surface-10">
              아직 작업을 저장하지 않았어요.
            </p>
            <p className="text-sm text-on-surface-20">
              정말 나가시겠어요? 임시저장 후 나갈 수 있어요.
            </p>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsBackConfirmOpen(false)}>
              취소
            </Button>
            <Button
              type="button"
              onClick={() => {
                handleTemporarySave();
                setIsBackConfirmOpen(false);
                goToEpisodeList();
              }}
            >
              임시저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
