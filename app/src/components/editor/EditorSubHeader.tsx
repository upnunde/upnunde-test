"use client";

import { ICONS, Icon } from "@/lib/icons";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createDefaultSeedBlocks, useEditorStore } from "@/store/useEditorStore";
import { Button } from "design-system/ui/button";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { IconButton } from "@/components/ui/icon-button";
import { Snackbar } from "@/components/episode/Snackbar";
import { EditorUnsavedConfirmModal } from "@/components/editor/EditorUnsavedConfirmModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOBILE_BOTTOM_SHEET_SCRIM_CLASS, MOBILE_BOTTOM_SHEET_SHELL_BASE_CLASS, mobileBottomSheetLargeMaxHeightClassName } from "@/components/ui/modal/modal-styles";
import { useClientMounted } from "@/hooks/useClientMounted";
import { useIsLgUp } from "@/hooks/useMediaQuery";
import { APP_HEADER_BAR_PAD_X_CLASS } from "@/lib/mobile-viewport";
import { cn } from "design-system/utils";
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

/** 임시저장 직후 히스토리 버튼·목록 new 표시 */
function HistoryNewDot({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute size-2 rounded-full bg-destructive ring-2 ring-background",
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
  const isDesktop = useIsLgUp();
  const mounted = useClientMounted();
  const blocks = useEditorStore((s) => s.blocks);
  const scriptHistory = useEditorStore((s) => s.scriptHistory);
  const addScriptHistoryEntry = useEditorStore((s) => s.addScriptHistoryEntry);
  const seedInitialScriptHistory = useEditorStore((s) => s.seedInitialScriptHistory);
  const loadScriptHistoryEntry = useEditorStore((s) => s.loadScriptHistoryEntry);
  const setBlocks = useEditorStore((s) => s.setBlocks);
  const focusBlockId = useEditorStore((s) => s.focusBlockId);
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
  /** 사용자가 실제 편집을 시작(블록 포커스)했는지 — 이 시점 이후로 기준선을 고정한다 */
  const userEngagedRef = useRef(false);
  /** 더보기 메뉴 클릭 직후 같은 포인터 이벤트가 백드롭에 전달되는 것 방지 */
  const [historySheetBackdropActive, setHistorySheetBackdropActive] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

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
      mobileKeyboardEditBlockId: null,
      mobileContentEditPromptBlockId: null,
      mobileFocusChoiceIndex: null,
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
      setHistoryOpen(false);
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

  /**
   * 저장 필요 여부는 "마지막 저장(또는 진입) 기준선 대비 실제 내용 변경"으로 판단한다.
   * undoDepth는 마운트 시 정규화 등 비-사용자 mutation으로도 증가할 수 있어(진입 직후 뒤로가기에
   * 저장 모달이 뜨는 원인) 기준선 스냅샷과 현재 스냅샷을 직접 비교한다.
   * savedSnapshot === null(baseline 확보 전)이면 변경 없음으로 취급한다.
   */
  const hasChangesSinceSave =
    savedSnapshot != null && blocksSnapshot !== savedSnapshot;
  const canSubmit = hasChangesSinceSave && !hasValidationIssues;

  /** 사용자가 블록을 포커스하면 편집 시작으로 간주하고 기준선을 고정한다. */
  useEffect(() => {
    if (focusBlockId != null) userEngagedRef.current = true;
  }, [focusBlockId]);

  /**
   * 편집 전 기준선(savedSnapshot) 확보.
   * - 히스토리가 비어 있으면 최초 1회 신규 생성 시드를 쌓는다.
   * - 진입 직후 실행되는 리소스 정규화 등 비-사용자 mutation으로 blocks 내용이 변할 수 있으므로,
   *   사용자가 편집을 시작(블록 포커스)하기 전까지는 기준선을 현재 내용으로 계속 동기화한다.
   *   → 정규화 결과를 기준선이 흡수하여, 편집 없이 뒤로가기 시 저장 모달이 뜨지 않는다.
   * - 사용자가 편집을 시작한 이후에는 기준선을 갱신하지 않아 실제 변경만 dirty로 잡힌다.
   */
  useLayoutEffect(() => {
    if (blocks.length === 0) {
      snapshotBaselineInitRef.current = false;
      userEngagedRef.current = false;
      return;
    }
    if (!snapshotBaselineInitRef.current) {
      snapshotBaselineInitRef.current = true;
      if (scriptHistory.length === 0) {
        seedInitialScriptHistory();
      }
    }
    if (userEngagedRef.current) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 진입~편집 시작 전 baseline 동기화(첫 페인트 전)
    setSavedSnapshot(blocksSnapshot);
  }, [blocks.length, blocksSnapshot, scriptHistory.length, seedInitialScriptHistory]);

  const historyListItems = useMemo(
    () =>
      scriptHistory.map((entry) => ({
        id: entry.id,
        savedAt: entry.savedAt,
        source: entry.source,
      })),
    [scriptHistory],
  );

  const handleHistoryOpenChange = useCallback(
    (open: boolean) => {
      if (!isHistoryEnabled) return;
      setHistoryOpen(open);
      if (!open) {
        setNewHistoryEntryId(null);
        setHistorySheetBackdropActive(false);
      }
    },
    [isHistoryEnabled],
  );

  /** 모바일 더보기 → 히스토리: 메뉴 닫힌 뒤 시트 오픈(같은 클릭이 백드롭으로 전달되지 않도록 지연) */
  const scheduleOpenHistoryPanel = useCallback(() => {
    if (!isHistoryEnabled) return;
    setMoreMenuOpen(false);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setHistoryOpen(true));
    });
  }, [isHistoryEnabled]);

  useEffect(() => {
    if (isDesktop || !historyOpen) {
      setHistorySheetBackdropActive(false);
      return;
    }
    setHistorySheetBackdropActive(false);
    const timer = window.setTimeout(() => setHistorySheetBackdropActive(true), 400);
    return () => window.clearTimeout(timer);
  }, [historyOpen, isDesktop]);

  useEffect(() => {
    if (isDesktop || !historyOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleHistoryOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleHistoryOpenChange, historyOpen, isDesktop]);

  const renderHistoryPanelList = (mobile: boolean) => (
    <>
      <div
        className={cn(
          mobile ? "px-2 pb-1" : "max-h-[min(40vh,280px)] overflow-y-auto px-2 pb-1",
        )}
      >
        <ul className={cn("flex flex-col", mobile ? "gap-1" : "gap-0.5")}>
          {historyListItems.map((entry) => (
            <li key={entry.id}>
              <div
                className={cn(
                  "relative flex min-h-9 items-center justify-between gap-2 rounded-md",
                  mobile
                    ? "min-h-11 gap-3 px-3 py-3"
                    : "group px-2 py-2 hover:bg-muted",
                )}
              >
                <div className="flex min-w-0 flex-1 items-center gap-2 text-body3_500">
                  {historyOpen && newHistoryEntryId === entry.id ? (
                    <span
                      className="size-2 shrink-0 rounded-full bg-destructive"
                      aria-hidden
                    />
                  ) : null}
                  <div className="text-foreground">
                    {formatScriptHistoryTimestamp(entry.savedAt)}
                  </div>
                  <div className="text-foreground-placeholder">
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
                    "shrink-0 bg-background px-3 text-caption1_500 text-foreground shadow-none disabled:border-border",
                    mobile
                      ? "h-8"
                      : cn(
                          "h-7 px-2 opacity-0 pointer-events-none transition-opacity",
                          "group-hover:opacity-100 group-hover:pointer-events-auto",
                          "[@media(hover:none)]:opacity-100 [@media(hover:none)]:pointer-events-auto",
                        ),
                  )}
                >
                  불러오기
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-border px-2 py-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 px-3 text-body3_500 text-primary",
            mobile ? "active:bg-accent active:text-primary" : "hover:bg-accent hover:text-primary",
          )}
          onClick={handleRecreate}
        >
          다시 만들기
        </Button>
      </div>
    </>
  );

  const desktopHistoryPopoverContent = (
    <>
      <div className="px-3 pt-4 pb-1">
        <p className="text-body3_500 text-foreground-placeholder">히스토리</p>
      </div>
      {renderHistoryPanelList(false)}
    </>
  );

  const mobileHistorySheet =
    mounted && !isDesktop && historyOpen
      ? createPortal(
          <>
            <div
              className={cn(
                MOBILE_BOTTOM_SHEET_SCRIM_CLASS,
                !historySheetBackdropActive && "pointer-events-none",
              )}
              aria-hidden
              onClick={() => {
                if (historySheetBackdropActive) handleHistoryOpenChange(false);
              }}
            />
            <div
              className={cn(
                MOBILE_BOTTOM_SHEET_SHELL_BASE_CLASS,
                mobileBottomSheetLargeMaxHeightClassName,
              )}
              role="dialog"
              aria-modal="true"
              aria-label="히스토리"
            >
              <div className="flex w-full shrink-0 items-center justify-between border-b border-border px-4 py-4">
                <div className="text-body1_700 text-foreground">히스토리</div>
                <button
                  type="button"
                  aria-label="닫기"
                  onClick={() => handleHistoryOpenChange(false)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-foreground-placeholder transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                  style={{ marginRight: -8 }}
                >
                  <ICONS.close className="h-5 w-5" aria-hidden />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
                {renderHistoryPanelList(true)}
              </div>
            </div>
          </>,
          document.body,
        )
      : null;

  const titleHeading = (
    <h1 className="min-w-0 truncate text-heading2_700 text-foreground">
      {title}
    </h1>
  );

  const editEpisodeInfoButton =
    onEditEpisodeInfo != null ? (
      <IconButton
        type="button"
        variant="ghost"
        shape="circle"
        size="icon-xl"
        icon={ICONS.bookText}
        aria-label="회차 정보 수정"
        className="shrink-0"
        onClick={onEditEpisodeInfo}
      />
    ) : null;

  return (
    <>
      <header className={cn("relative mx-auto w-full min-w-0 shrink-0", APP_HEADER_BAR_PAD_X_CLASS, "max-lg:px-3")}>
        {/* 모바일 */}
        <div className="flex h-14 items-center gap-2 lg:hidden">
          <HeaderBackButton onClick={handleBack} />
          <div className="flex min-w-0 flex-1 items-center gap-2">{titleHeading}</div>
          <Button
            type="button"
            variant="default"
            tone="brand"
            size="default"
            disabled={!canSubmit}
            className="shrink-0"
            onClick={handleSubmit}
          >
            등록
          </Button>
          <DropdownMenu open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
            <DropdownMenuTrigger asChild>
              <IconButton
                type="button"
                variant="ghost"
                shape="circle"
                size="icon-xl"
                icon={ICONS.moreVertical}
                aria-label="더보기"
                className="relative shrink-0"
              >
                {newHistoryEntryId ? (
                  <HistoryNewDot className="top-0 right-0" />
                ) : null}
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {onEditEpisodeInfo ? (
                  <DropdownMenuItem onSelect={onEditEpisodeInfo}>
                    <Icon icon={ICONS.settings2} size="md" />
                    정보수정
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem
                  disabled={!hasChangesSinceSave}
                  onSelect={handleTemporarySave}
                >
                  <Icon icon={ICONS.fileText} size="md" />
                  임시저장
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!isHistoryEnabled}
                  onSelect={scheduleOpenHistoryPanel}
                >
                  <Icon icon={ICONS.history} size="md" />
                  히스토리
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 데스크톱 */}
        <div className="hidden h-16 items-center justify-between gap-3 lg:flex">
          <div className="flex min-w-0 items-center gap-3">
            <HeaderBackButton onClick={handleBack} />
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {titleHeading}
              {editEpisodeInfoButton}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Popover
              open={isDesktop && historyOpen}
              onOpenChange={(open) => {
                if (!isDesktop) return;
                handleHistoryOpenChange(open);
              }}
            >
              <PopoverTrigger asChild>
                <IconButton
                  type="button"
                  variant="ghost"
                  shape="circle"
                  size="icon-xl"
                  icon={ICONS.history}
                  aria-label="히스토리"
                  disabled={!isHistoryEnabled}
                  className="relative shrink-0"
                >
                  {newHistoryEntryId ? (
                    <HistoryNewDot className="top-0 right-0" />
                  ) : null}
                </IconButton>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                sideOffset={8}
                className="z-modal w-[min(100vw-2rem,280px)] max-w-[280px] rounded-lg border border-border p-0 shadow-elevation-40"
              >
                {desktopHistoryPopoverContent}
              </PopoverContent>
            </Popover>
            <Button
              type="button"
              variant="outline"
              tone="neutral"
              size="default"
              className="bg-background"
              disabled={!hasChangesSinceSave}
              onClick={handleTemporarySave}
            >
              임시저장
            </Button>
            <Button
              type="button"
              variant="default"
              tone="brand"
              size="default"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              등록하기
            </Button>
          </div>
        </div>
      </header>
      {mobileHistorySheet}
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
