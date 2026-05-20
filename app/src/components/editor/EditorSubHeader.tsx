"use client";

import { ChevronLeft, History } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { Button } from "@/components/ui/button";
import { Snackbar } from "@/components/episode/Snackbar";
import { EditorUnsavedConfirmModal } from "@/components/editor/EditorUnsavedConfirmModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ScriptBlock } from "@/types/editor";

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
  const seedInitialScriptHistory = useEditorStore((s) => s.seedInitialScriptHistory);
  const loadScriptHistoryEntry = useEditorStore((s) => s.loadScriptHistoryEntry);
  const undoDepth = useEditorStore((s) => s.undoStack.length);
  const setBlocks = useEditorStore((s) => s.setBlocks);
  const currentView = useEditorStore((s) => s.currentView);
  const setCurrentView = useEditorStore((s) => s.setCurrentView);
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [isBackConfirmOpen, setIsBackConfirmOpen] = useState(false);
  const [isLoadConfirmOpen, setIsLoadConfirmOpen] = useState(false);
  const [pendingLoadHistoryId, setPendingLoadHistoryId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  /** 블록이 비었다가 다시 생길 때까지 한 번만 진입 기준선을 잡기 위함 */
  const snapshotBaselineInitRef = useRef(false);

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
    useEditorStore.setState({ undoStack: [], redoStack: [] });
    router.push("/series/1/episodes");
  };

  const handleTemporarySave = () => {
    // TODO: 실제 임시저장 API 연동 시 저장 성공 시점에 snapshot 갱신
    setSavedSnapshot(blocksSnapshot);
    addScriptHistoryEntry();
    useEditorStore.setState({ undoStack: [], redoStack: [] });
    setSnackbar({ open: true, message: "임시저장을 완료했습니다" });
  };

  /** 확인 모달: 마지막 저장(또는 최초 스냅샷) 기준으로 편집 내용 버리고 목록으로 */
  const handleLeaveWithoutSave = () => {
    if (savedSnapshot != null) {
      try {
        setBlocks(JSON.parse(savedSnapshot) as ScriptBlock[]);
      } catch {
        /* ignore */
      }
    }
    useEditorStore.setState({ undoStack: [], redoStack: [] });
    setIsBackConfirmOpen(false);
    goToEpisodeList();
  };

  const handleTemporarySaveAndLeave = () => {
    handleTemporarySave();
    setIsBackConfirmOpen(false);
    goToEpisodeList();
  };
  const handleRecreate = () => {
    setHistoryOpen(false);
    if (onRecreate) {
      onRecreate();
      return;
    }
    setCurrentView("form");
  };

  const finishHistoryLoad = (historyId: string) => {
    loadScriptHistoryEntry(historyId);
    const snap = JSON.stringify(useEditorStore.getState().blocks);
    setSavedSnapshot(snap);
    useEditorStore.setState({ undoStack: [], redoStack: [] });
    setHistoryOpen(false);
    setIsLoadConfirmOpen(false);
    setPendingLoadHistoryId(null);
    setSnackbar({ open: true, message: "히스토리를 불러왔어요" });
  };

  const handleHistoryLoadClick = (historyId: string) => {
    if (hasChangesSinceSave) {
      setPendingLoadHistoryId(historyId);
      setIsLoadConfirmOpen(true);
      return;
    }
    finishHistoryLoad(historyId);
  };

  const handleLoadWithoutSave = () => {
    if (pendingLoadHistoryId) finishHistoryLoad(pendingLoadHistoryId);
  };

  const handleTemporarySaveAndLoad = () => {
    if (!pendingLoadHistoryId) return;
    handleTemporarySave();
    finishHistoryLoad(pendingLoadHistoryId);
  };

  /** 실제 편집(undo 스택 생성)이 발생한 경우에만 저장 필요 상태로 간주 */
  const hasChangesSinceSave = undoDepth > 0;
  const canSubmit = hasChangesSinceSave && !hasValidationIssues;

  /**
   * 편집 전 기준선(savedSnapshot) 확보.
   * - 히스토리가 비어 있으면 신규 생성 1건을 쌓은 뒤 현재 블록을 기준선으로 삼는다.
   * - 이미 히스토리가 있으면(목록 재진입 등) 추가 시드 없이 현재 블록만 기준선으로 삼는다.
   * blocksSnapshot을 deps에 넣지 않아, 타이핑마다 effect가 돌며 스냅샷을 덮어쓰지 않게 한다.
   */
  useLayoutEffect(() => {
    if (blocks.length === 0) {
      snapshotBaselineInitRef.current = false;
      return;
    }
    if (snapshotBaselineInitRef.current) return;
    snapshotBaselineInitRef.current = true;
    if (scriptHistory.length === 0) {
      seedInitialScriptHistory();
    }
    const snap = JSON.stringify(useEditorStore.getState().blocks);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 진입 시점 baseline 확보(첫 페인트 전)
    setSavedSnapshot(snap);
  }, [blocks.length, scriptHistory.length, seedInitialScriptHistory]);

  const historyListItems = useMemo(
    () =>
      scriptHistory.map((entry) => ({
        id: entry.id,
        savedAt: entry.savedAt,
        source: entry.source,
      })),
    [scriptHistory],
  );

  return (
    <>
      <header className="mx-auto flex h-16 w-full min-w-[800px] shrink-0 items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleBack}
            className="h-8 w-8 shrink-0 rounded-full"
            aria-label="뒤로 가기"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </Button>
          <h1 className="text-2xl font-bold text-on-surface-10">{title}</h1>
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
              className="w-[min(100vw-2rem,280px)] max-w-[280px] rounded-lg border border-border-10 p-0 shadow-lg"
            >
              <div className="px-3 pt-4 pb-1">
                <p className="text-sm font-medium text-on-surface-30">히스토리</p>
              </div>
              <div className="max-h-[min(40vh,280px)] overflow-y-auto px-2 pb-1">
                <ul className="flex flex-col gap-0.5">
                  {historyListItems.map((entry) => (
                    <li key={entry.id}>
                      <div
                        className={cn(
                          "group flex min-h-10 items-center justify-between gap-2 rounded-md px-2 py-2",
                          "hover:bg-surface-20"
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
                          title="이 시점의 원고 불러오기"
                          onClick={() => handleHistoryLoadClick(entry.id)}
                          className={cn(
                            "h-7 shrink-0 border-border-10 bg-white px-2 text-xs font-medium text-on-surface-10 shadow-none",
                            "opacity-0 pointer-events-none transition-opacity",
                            "group-hover:opacity-100 group-hover:pointer-events-auto",
                            "[@media(hover:none)]:opacity-100 [@media(hover:none)]:pointer-events-auto",
                          )}
                        >
                          불러오기
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-border-10 px-2 py-2.5">
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
            disabled={!canSubmit}
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
      <EditorUnsavedConfirmModal
        open={isBackConfirmOpen}
        onOpenChange={setIsBackConfirmOpen}
        title="저장되지 않았어요!"
        description={"정말 나가시겠어요? 임시저장 후 나갈 수 있어요."}
        secondaryLabel="저장 안 함"
        onSecondary={handleLeaveWithoutSave}
        primaryLabel="저장 후 나가기"
        onPrimary={handleTemporarySaveAndLeave}
      />
      <EditorUnsavedConfirmModal
        open={isLoadConfirmOpen}
        onOpenChange={(open) => {
          setIsLoadConfirmOpen(open);
          if (!open) setPendingLoadHistoryId(null);
        }}
        title="히스토리를 불러올까요?"
        description={"지금 편집 중인 내용이 있어요.\n임시저장한 뒤 불러오거나, 저장하지 않고 불러올 수 있어요."}
        secondaryLabel="저장 없이 불러오기"
        onSecondary={handleLoadWithoutSave}
        primaryLabel="저장 후 불러오기"
        onPrimary={handleTemporarySaveAndLoad}
      />
    </>
  );
}
