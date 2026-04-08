import { create } from "zustand";
import type { ScriptBlock, BlockType, ChoiceItem } from "@/types/editor";
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
  data?: Record<string, any>
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
  setIssueFocus: (issue: EditorState["issueFocus"]) => void;
  clearIssueFocus: () => void;
  setCurrentView: (view: CurrentView) => void;
  setRawScript: (script: string) => void;
  setSeriesPersona: (persona: string) => void;
  undo: () => void;
  redo: () => void;
  addBlock: (index: number, type: BlockType, content?: string, data?: Record<string, any>) => string; // returns new block id
  updateBlock: (id: string, content: string, data?: Record<string, any>) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (oldIndex: number, newIndex: number) => void;
  updateBlockType: (id: string, type: BlockType) => void;
  /** 현재 블록 상태를 히스토리에 추가 */
  addScriptHistoryEntry: (source?: ScriptHistoryEntry["source"]) => void;
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

export const useEditorStore = create<EditorStore>((set) => ({
  seriesPersona: "",
  blocks: [],
  focusBlockId: null,
  issueFocus: null,
  currentView: "form",
  rawScript: "",
  undoStack: [],
  redoStack: [],
  scriptHistory: [],

  setBlocks: (blocks) => set({ blocks }),

  setFocusBlockId: (focusBlockId) => set({ focusBlockId }),

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
      const undoPatch = pushUndo(state);
      return { ...undoPatch, blocks: state.blocks.filter((b) => b.id !== id) };
    }),

  reorderBlocks: (oldIndex, newIndex) =>
    set((state) => {
      if (oldIndex === newIndex) return state;
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
