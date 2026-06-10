"use client";

import { History, MoreVertical, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { createDefaultSeedBlocks, useEditorStore } from "@/store/useEditorStore";
import { Button } from "@/components/ui/button";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { Snackbar } from "@/components/episode/Snackbar";
import { EditorUnsavedConfirmModal } from "@/components/editor/EditorUnsavedConfirmModal";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ScriptBlock } from "@/types/editor";

/** 시리즈·에피소드 더보기 메뉴와 동일 스타일 */
const MORE_MENU_CONTENT_CLASS =
  "w-48 rounded-lg border border-border-10 bg-white p-my-4 shadow-elevation-40";
const MORE_MENU_ITEM_CLASS =
  "flex cursor-pointer items-center gap-my-8 rounded-md px-my-12 py-my-8 text-body3_400 text-on-surface-20 outline-none hover:bg-surface-20 focus:bg-surface-20";

/** 히스토리 목록: MM.DD, HH:mm (예: 04.07, 16:23) */
function formatScriptHistoryTimestamp(savedAt: number): string {
  const d = new Date(savedAt);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${mm}.${dd}, ${hh}:${min}`;
}

/** 임시저장 직후 히스토리 버튼·목록 new 표시 */
function HistoryNewDot({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute size-2 rounded-full bg-destructive ring-2 ring-white",
        className,
      )}
      aria-hidden
    />
  );
}

export interface EditorSubHeaderProps {
  /** 제목 (예: "에피소드 에디터") */
  title?: string;
  /** 회차 정보 수정 모달 열기 */
  onEditEpisodeInfo?: () => void;
  /** 다시 만들기 클릭 시 동작 (없으면 기본: 폼 화면 전환) */
  onRecreate?: () => void;
}

export function EditorSubHeader({
  title = "에피소드 에디터",
  onEditEpisodeInfo,
  onRecreate,
}: EditorSubHeaderProps) {
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
  const [isRecreateConfirmOpen, setIsRecreateConfirmOpen] = useState(false);
  const [pendingLoadHistoryId, setPendingLoadHistoryId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isHistoryEnabled, setIsHistoryEnabled] = useState(false);
  /** 임시저장으로 추가된 최신 히스토리 — 팝오버 닫을 때까지 new 닷 표시 */
  const [newHistoryEntryId, setNewHistoryEntryId] = useState<string | null>(null);
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

  const handleSubmit = () => {
    // TODO: 실제 등록 로직 연동 후 에피소드 목록 화면으로 이동
    useEditorStore.setState({ undoStack: [], redoStack: [] });
    router.push("/series/1/episodes");
  };

  const handleTemporarySave = () => {
    // TODO: 실제 임시저장 API 연동 시 저장 성공 시점에 snapshot 갱신
    setSavedSnapshot(blocksSnapshot);
    addScriptHistoryEntry();
    const latestEntryId = useEditorStore.getState().scriptHistory[0]?.id ?? null;
    setNewHistoryEntryId(latestEntryId);
    setIsHistoryEnabled(true);
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
  const recreateToInitialEmpty = () => {
    const nextBlocks = createDefaultSeedBlocks();
    setBlocks(nextBlocks);
    useEditorStore.setState({
      rawScript: "",
      undoStack: [],
      redoStack: [],
      focusBlockId: null,
    });
    setSavedSnapshot(JSON.stringify(nextBlocks));
    setIsHistoryEnabled(false);
    setHistoryOpen(false);
    setNewHistoryEntryId(null);
    setSnackbar({ open: true, message: "처음 상태로 다시 만들었어요" });
  };

  const handleRecreate = () => {
    setHistoryOpen(false);
    setNewHistoryEntryId(null);
    if (!isHistoryEnabled && hasChangesSinceSave) {
      setIsRecreateConfirmOpen(true);
      return;
    }
    if (onRecreate) {
      onRecreate();
      return;
    }
    recreateToInitialEmpty();
  };

  const handleRecreateWithoutSave = () => {
    setIsRecreateConfirmOpen(false);
    if (onRecreate) {
      onRecreate();
      return;
    }
    recreateToInitialEmpty();
  };

  const handleTemporarySaveAndRecreate = () => {
    handleTemporarySave();
    setIsRecreateConfirmOpen(false);
    if (onRecreate) {
      onRecreate();
      return;
    }
    recreateToInitialEmpty();
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

  const titleHeading = (
    <h1 className="min-w-0 truncate text-body1_700 text-on-surface-10 lg:text-heading2_700">
      {title}
    </h1>
  );

  const editEpisodeInfoButton =
    onEditEpisodeInfo != null ? (
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        className="shrink-0 text-on-surface-30 hover:bg-surface-20 hover:text-on-surface-10"
        aria-label="회차 정보 수정"
        onClick={onEditEpisodeInfo}
      >
        <Pencil />
      </Button>
    ) : null;

  return (
    <>
      <header className="relative mx-auto w-full min-w-0 shrink-0 px-my-12 lg:px-my-20">
        {/* 모바일 */}
        <div className="flex h-14 items-center gap-my-8 lg:hidden">
          <HeaderBackButton onClick={handleBack} />
          <div className="flex min-w-0 flex-1 items-center gap-my-8">{titleHeading}</div>
          <Button
            type="button"
            size="sm"
            disabled={!canSubmit}
            className="h-8 shrink-0 px-my-12 shadow-none"
            onClick={handleSubmit}
          >
            등록
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                className="relative shrink-0 bg-white shadow-none"
                aria-label="더보기"
              >
                <MoreVertical />
                {newHistoryEntryId ? (
                  <HistoryNewDot className="top-0 right-0" />
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={MORE_MENU_CONTENT_CLASS}>
              {onEditEpisodeInfo ? (
                <DropdownMenuItem
                  className={MORE_MENU_ITEM_CLASS}
                  onSelect={onEditEpisodeInfo}
                >
                  정보수정
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem
                disabled={!hasChangesSinceSave}
                className={MORE_MENU_ITEM_CLASS}
                onSelect={handleTemporarySave}
              >
                임시저장
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!isHistoryEnabled}
                className={MORE_MENU_ITEM_CLASS}
                onSelect={() => setHistoryOpen(true)}
              >
                히스토리
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 데스크톱 */}
        <div className="hidden h-16 items-center justify-between gap-my-12 lg:flex">
          <div className="flex min-w-0 items-center gap-my-12">
            <HeaderBackButton onClick={handleBack} />
            <div className="flex min-w-0 flex-1 items-center gap-my-8">
              {titleHeading}
              {editEpisodeInfoButton}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-my-8">
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              className="relative shrink-0 bg-white shadow-none text-on-surface-30 hover:text-on-surface-10 disabled:border-border-20"
              aria-label="히스토리"
              disabled={!isHistoryEnabled}
              onClick={() => isHistoryEnabled && setHistoryOpen(true)}
            >
              <History />
              {newHistoryEntryId ? (
                <HistoryNewDot className="top-0 right-0" />
              ) : null}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 shadow-none bg-white"
              disabled={!hasChangesSinceSave}
              onClick={handleTemporarySave}
            >
              임시저장
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!canSubmit}
              className="h-9 shadow-none bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/40 disabled:hover:bg-primary/40"
              onClick={handleSubmit}
            >
              등록하기
            </Button>
          </div>
        </div>

        <Popover
          open={historyOpen}
          onOpenChange={(open) => {
            if (!isHistoryEnabled) return;
            setHistoryOpen(open);
            if (!open) setNewHistoryEntryId(null);
          }}
        >
          <PopoverAnchor className="absolute right-4 top-1/2 h-px w-px -translate-y-1/2 lg:right-8" />
          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-[min(100vw-2rem,280px)] max-w-[280px] rounded-lg border border-border-10 p-0 shadow-elevation-40"
          >
            <div className="px-my-12 pt-my-16 pb-my-4">
              <p className="text-body3_500 text-on-surface-30">히스토리</p>
            </div>
            <div className="max-h-[min(40vh,280px)] overflow-y-auto px-my-8 pb-my-4">
              <ul className="flex flex-col gap-my-2">
                {historyListItems.map((entry) => (
                  <li key={entry.id}>
                    <div
                      className={cn(
                        "group relative flex min-h-9 items-center justify-between gap-my-8 rounded-md px-my-8 py-my-8",
                        "hover:bg-surface-20",
                      )}
                    >
                      {historyOpen && newHistoryEntryId === entry.id ? (
                        <HistoryNewDot className="top-1.5 left-1.5" />
                      ) : null}
                      <div className="flex min-w-0 items-center gap-my-8 text-body3_500">
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
                          "h-7 shrink-0 bg-white px-my-8 text-caption1_500 text-on-surface-10 shadow-none disabled:border-border-20",
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
            <div className="border-t border-border-10 px-my-8 py-my-8">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-my-12 text-body3_500 text-primary hover:bg-accent hover:text-primary"
                onClick={handleRecreate}
              >
                다시 만들기
              </Button>
            </div>
          </PopoverContent>
        </Popover>
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
      <EditorUnsavedConfirmModal
        open={isRecreateConfirmOpen}
        onOpenChange={setIsRecreateConfirmOpen}
        title="임시저장 후 다시 만들까요?"
        description={
          "아직 임시저장하지 않은 내용이 있어요.\n임시저장 후 다시 만들거나, 저장하지 않고 다시 만들 수 있어요."
        }
        secondaryLabel="저장 없이 다시 만들기"
        onSecondary={handleRecreateWithoutSave}
        primaryLabel="저장 후 다시 만들기"
        onPrimary={handleTemporarySaveAndRecreate}
      />
    </>
  );
}
