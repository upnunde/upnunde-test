import { create } from "zustand";
import type { ScriptBlock, ScriptBlockData, BlockType, ChoiceItem } from "@/types/editor";
import { BACKGROUNDS, CHARACTERS, BGMS, SFX, VIDEOS } from "@/lib/mockData";

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function createEmptyChoiceItem(): ChoiceItem {
  return {
    id: generateId(),
    text: "",
    nextScene: "",
    isPaid: false,
  };
}

/**
 * Get default content for resource blocks (dummy values)
 */
function getDefaultResourceContent(type: BlockType): string {
  switch (type) {
    case "background":
      return BACKGROUNDS[0]?.name || "School_Day";
    case "character":
      return CHARACTERS[0]?.name || "민수";
    case "bgm":
      return BGMS[0]?.name || "Calm_Piano";
    case "sfx":
      return SFX[0]?.name || "Door_Open";
    case "gallery":
      return "gallery_1";
    case "video":
      return VIDEOS[0]?.name || "동영상1";
    default:
      return "";
  }
}

export function createBlock(
  type: BlockType,
  content: string = "",
  data?: ScriptBlockData
): ScriptBlock {
  // For resource blocks, use default dummy value if content is empty
  const resourceTypes: BlockType[] = ["background", "bgm", "sfx", "character", "gallery", "video"];
  const defaultContent = resourceTypes.includes(type) && !content 
    ? getDefaultResourceContent(type) 
    : content;

  const base = {
    id: generateId(),
    type,
    content: defaultContent,
  };
  if (type === "choice" && (!data || !Array.isArray(data.choices) || data.choices.length === 0)) {
    return {
      ...base,
      data: {
        ...(data ?? {}),
        choices: [createEmptyChoiceItem(), createEmptyChoiceItem()],
      },
    };
  }
  // Text blocks: default speaker to "나레이션" when not provided
  if (type === "text") {
    const textData = { ...(data ?? {}), speaker: data?.speaker ?? "나레이션" };
    return { ...base, data: textData };
  }
  return {
    ...base,
    ...(data && Object.keys(data).length > 0 ? { data } : {}),
  };
}

/** 에디터 신규 진입 기본 블록: 장면01 + 나레이션(삭제 불가 시드) */
export function createDefaultSeedBlocks(): ScriptBlock[] {
  return [
    createBlock("scene", "장면01", { isSeedDefault: true }),
    createBlock("text", "", { speaker: "나레이션" }),
  ];
}

export type CurrentView = "form" | "editor";

const MAX_UNDO = 50;
const MAX_SCRIPT_HISTORY = 50;

const SERIES_PERSONA_STORAGE_KEY = "novelseries:seriesPersona";

export interface ScriptHistoryEntry {
  id: string;
  blocks: ScriptBlock[];
  savedAt: number;
  source: "created" | "temporary";
}

interface EditorState {
  /** 시리즈 정보 탭에서 입력한 페르소나 — 화자 "나 (…)" 표시에 사용 */
  seriesPersona: string;
  blocks: ScriptBlock[];
  focusBlockId: string | null;
  /** 모바일: 「내용수정」으로 키보드 편집 중인 블록 id */
  mobileKeyboardEditBlockId: string | null;
  /** 모바일: 텍스트 영역 탭 후 「내용수정」 버튼 노출 대상 블록 id */
  mobileContentEditPromptBlockId: string | null;
  /** 모바일: 선택지 블록에서 편집 대상 choice 행 index */
  mobileFocusChoiceIndex: number | null;
  issueFocus:
    | {
        blockId: string;
        choiceIndex?: number;
        field?: "text" | "nextScene";
      }
    | null;
  currentView: CurrentView;
  rawScript: string;
  undoStack: ScriptBlock[][];
  redoStack: ScriptBlock[][];
  /** 임시저장 시점별 스크립트 스냅샷 (최신이 앞) */
  scriptHistory: ScriptHistoryEntry[];
}

interface EditorActions {
  setBlocks: (blocks: ScriptBlock[]) => void;
  setFocusBlockId: (id: string | null) => void;
  /** 모바일 「내용수정」 — 포커스·키보드 편집 모드를 한 번에 진입 */
  beginMobileKeyboardContentEdit: (id: string) => void;
  setMobileKeyboardEditBlockId: (id: string | null) => void;
  setMobileContentEditPromptBlockId: (id: string | null) => void;
  setMobileFocusChoiceIndex: (index: number | null) => void;
  setIssueFocus: (issue: EditorState["issueFocus"]) => void;
  clearIssueFocus: () => void;
  setCurrentView: (view: CurrentView) => void;
  setRawScript: (script: string) => void;
  setSeriesPersona: (persona: string) => void;
  undo: () => void;
  redo: () => void;
  addBlock: (index: number, type: BlockType, content?: string, data?: ScriptBlockData) => string; // returns new block id
  updateBlock: (id: string, content: string, data?: ScriptBlockData) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (oldIndex: number, newIndex: number) => void;
  updateBlockType: (id: string, type: BlockType) => void;
  /** 현재 블록 상태를 히스토리에 추가 */
  addScriptHistoryEntry: (source?: ScriptHistoryEntry["source"]) => void;
  /** 에디터 최초 진입 시 목록 UI용 히스토리 시드 (5건) */
  seedInitialScriptHistory: () => void;
  /** 히스토리 항목을 에디터에 불러오기 */
  loadScriptHistoryEntry: (id: string) => void;
}

export type EditorStore = EditorState & EditorActions;

function cloneBlocks(blocks: ScriptBlock[]): ScriptBlock[] {
  return JSON.parse(JSON.stringify(blocks));
}

function pushUndo(state: EditorState): Partial<EditorState> {
  const snapshot = cloneBlocks(state.blocks);
  const undoStack = [...state.undoStack, snapshot].slice(-MAX_UNDO);
  return { undoStack, redoStack: [] };
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  seriesPersona: "",
  blocks: [],
  focusBlockId: null,
  mobileKeyboardEditBlockId: null,
  mobileContentEditPromptBlockId: null,
  mobileFocusChoiceIndex: null,
  issueFocus: null,
  /** 기본은 원고 에디터; 에피소드 생성은 `/editor?view=form`으로만 전환 */
  currentView: "editor",
  rawScript: "",
  undoStack: [],
  redoStack: [],
  scriptHistory: [],

  setBlocks: (blocks) => set({ blocks }),

  setFocusBlockId: (focusBlockId) => {
    const prevFocusBlockId = get().focusBlockId;
    if (
      typeof document !== "undefined" &&
      prevFocusBlockId &&
      focusBlockId !== prevFocusBlockId
    ) {
      const prevEl = document.getElementById(`block-${prevFocusBlockId}`);
      const active = document.activeElement;
      if (prevEl && active instanceof HTMLElement && prevEl.contains(active)) {
        active.blur();
      }
    }
    set((state) => ({
      focusBlockId,
      mobileKeyboardEditBlockId:
        focusBlockId != null && focusBlockId === state.mobileKeyboardEditBlockId
          ? state.mobileKeyboardEditBlockId
          : null,
      mobileContentEditPromptBlockId:
        focusBlockId != null && focusBlockId === state.mobileContentEditPromptBlockId
          ? state.mobileContentEditPromptBlockId
          : null,
    }));
  },

  beginMobileKeyboardContentEdit: (blockId) =>
    set({
      focusBlockId: blockId,
      mobileKeyboardEditBlockId: blockId,
      mobileContentEditPromptBlockId: null,
    }),

  setMobileKeyboardEditBlockId: (mobileKeyboardEditBlockId) => set({ mobileKeyboardEditBlockId }),

  setMobileContentEditPromptBlockId: (mobileContentEditPromptBlockId) =>
    set({ mobileContentEditPromptBlockId }),

  setMobileFocusChoiceIndex: (mobileFocusChoiceIndex) => set({ mobileFocusChoiceIndex }),

  setIssueFocus: (issueFocus) => set({ issueFocus }),

  clearIssueFocus: () => set({ issueFocus: null }),

  setCurrentView: (currentView) => set({ currentView }),

  setRawScript: (rawScript) => set({ rawScript }),

  setSeriesPersona: (seriesPersona) => {
    set({ seriesPersona });
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(SERIES_PERSONA_STORAGE_KEY, seriesPersona);
      } catch {
        /* ignore quota / private mode */
      }
    }
  },

  undo: () =>
    set((state) => {
      if (state.undoStack.length === 0) return state;
      const prev = state.undoStack[state.undoStack.length - 1];
      const undoStack = state.undoStack.slice(0, -1);
      const redoStack = [...state.redoStack, cloneBlocks(state.blocks)];
      return { blocks: prev, undoStack, redoStack };
    }),

  redo: () =>
    set((state) => {
      if (state.redoStack.length === 0) return state;
      const next = state.redoStack[state.redoStack.length - 1];
      const redoStack = state.redoStack.slice(0, -1);
      const undoStack = [...state.undoStack, cloneBlocks(state.blocks)];
      return { blocks: next, undoStack, redoStack };
    }),

  addBlock: (index, type, content = "", data) => {
    const newBlock = createBlock(type, content, data);
    set((state) => {
      const undoPatch = pushUndo(state);
      const next = [...state.blocks];
      next.splice(index, 0, newBlock);
      return { ...undoPatch, blocks: next };
    });
    return newBlock.id;
  },

  updateBlock: (id, content, data) =>
    set((state) => {
      const undoPatch = pushUndo(state);
      const blocks = state.blocks.map((b) =>
        b.id === id
          ? { ...b, content, ...(data !== undefined ? { data: { ...b.data, ...data } } : {}) }
          : b
      );
      return { ...undoPatch, blocks };
    }),

  removeBlock: (id) =>
    set((state) => {
      const target = state.blocks.find((b) => b.id === id);
      if (target?.data?.isSeedDefault === true) return state;
      const undoPatch = pushUndo(state);
      return {
        ...undoPatch,
        blocks: state.blocks.filter((b) => b.id !== id),
        // 삭제된 블록이 선택 상태였다면 해제 (모바일 블록 툴바 등 잔존 방지)
        ...(state.focusBlockId === id ? { focusBlockId: null } : {}),
        ...(state.mobileKeyboardEditBlockId === id ? { mobileKeyboardEditBlockId: null } : {}),
        ...(state.mobileContentEditPromptBlockId === id
          ? { mobileContentEditPromptBlockId: null }
          : {}),
      };
    }),

  reorderBlocks: (oldIndex, newIndex) =>
    set((state) => {
      if (oldIndex === newIndex) return state;
      const firstBlock = state.blocks[0];
      const hasFixedTopSeed = firstBlock?.data?.isSeedDefault === true;
      const movingBlock = state.blocks[oldIndex];

      // 최상단 시드(예: 01 #장면 01)는 항상 0번 인덱스에 고정한다.
      if (hasFixedTopSeed) {
        const movingIsFixedTopSeed = movingBlock?.id === firstBlock.id;
        if (movingIsFixedTopSeed) return state;
        if (newIndex <= 0) return state;
      }

      const undoPatch = pushUndo(state);
      const next = [...state.blocks];
      const [removed] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, removed);
      return { ...undoPatch, blocks: next };
    }),

  updateBlockType: (id, type) =>
    set((state) => {
      const resourceTypes: BlockType[] = ["background", "bgm", "sfx", "character", "gallery"];
      const undoPatch = pushUndo(state);
      const blocks = state.blocks.map((b) => {
        if (b.id === id) {
          const newContent = resourceTypes.includes(type) && !b.content
            ? getDefaultResourceContent(type)
            : (b.content || "");
          return { ...b, type, content: newContent };
        }
        return b;
      });
      return { ...undoPatch, blocks };
    }),

  addScriptHistoryEntry: (source = "temporary") =>
    set((state) => {
      const entry: ScriptHistoryEntry = {
        id: generateId(),
        blocks: cloneBlocks(state.blocks),
        savedAt: Date.now(),
        source,
      };
      const scriptHistory = [entry, ...state.scriptHistory].slice(0, MAX_SCRIPT_HISTORY);
      return { scriptHistory };
    }),

  seedInitialScriptHistory: () =>
    set((state) => {
      if (state.scriptHistory.length > 0 || state.blocks.length === 0) return state;
      const now = Date.now();
      const blocks = cloneBlocks(state.blocks);
      const seeds: { source: ScriptHistoryEntry["source"]; ageMs: number }[] = [
        { source: "temporary", ageMs: 15 * 60 * 1000 },
        { source: "created", ageMs: 60 * 60 * 1000 },
        { source: "temporary", ageMs: 5 * 60 * 60 * 1000 },
        { source: "temporary", ageMs: 24 * 60 * 60 * 1000 },
        { source: "created", ageMs: 48 * 60 * 60 * 1000 },
      ];
      const scriptHistory = seeds
        .map((seed) => ({
          id: generateId(),
          blocks: cloneBlocks(blocks),
          savedAt: now - seed.ageMs,
          source: seed.source,
        }))
        .sort((a, b) => b.savedAt - a.savedAt);
      return { scriptHistory };
    }),

  loadScriptHistoryEntry: (id) =>
    set((state) => {
      const entry = state.scriptHistory.find((e) => e.id === id);
      if (!entry) return state;
      const undoPatch = pushUndo(state);
      return { ...undoPatch, blocks: cloneBlocks(entry.blocks), redoStack: [] };
    }),
}));

/** 에디터 진입 시 같은 탭에서 시리즈 편집에 저장된 페르소나 복원 */
export function hydrateSeriesPersonaFromSession(): void {
  if (typeof window === "undefined") return;
  try {
    const v = sessionStorage.getItem(SERIES_PERSONA_STORAGE_KEY);
    if (v != null) useEditorStore.setState({ seriesPersona: v });
  } catch {
    /* ignore */
  }
}
