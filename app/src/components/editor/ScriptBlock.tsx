"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import {
  Image,
  Music,
  User,
  Film,
  Clapperboard,
  ImagePlus,
  Sliders,
  ListChecks,
  Type,
  ChevronDown,
  Trash2,
  Bold,
  Italic,
  Underline,
  Check,
} from "lucide-react";
import type { ScriptBlock as ScriptBlockType, BlockType } from "@/types/editor";
import { useEditorStore } from "@/store/useEditorStore";
import { CHARACTERS, BACKGROUNDS, BGMS, SFX, VIDEOS } from "@/lib/mockData";
import { initialCharacters } from "@/lib/resourceMockData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getCaretCoordinates } from "@/lib/caretPosition";
import { SlashCommandMenu, type SlashSelectPayload } from "./SlashCommandMenu";
import { ResourcePicker } from "./ResourcePicker";
import { ChoiceBlockTable } from "./ChoiceBlockTable";
import { cn } from "@/lib/utils";
import {
  SPEAKER_PERSONA_TOKEN,
  formatPersonaSpeakerLabel,
  isPersonaSpeakerToken,
  resolveSpeakerDisplay,
} from "@/lib/speakerPersona";
import { LABEL_COLOR_BY_TYPE } from "@/lib/blockLabelColors";
import { BLOCK_LABEL_KO } from "@/lib/blockTypeLabels";

const RESOURCE_TYPES: BlockType[] = ["background", "bgm", "sfx", "character", "gallery", "video", "choice"];

const PICKER_RESOURCE_TYPES: BlockType[] = ["background", "character", "bgm", "sfx", "gallery", "video", "event"];

const TYPE_LABELS: Record<BlockType, string> = {
  scene: "장면",
  top_desc: "장면정보",
  text: "Text",
  background: "Background",
  bgm: "BGM",
  sfx: "SFX",
  character: "Character",
  gallery: "Gallery",
  video: "Video",
  direction: "Direction",
  choice: "Choice",
  event: "Event",
  event_end: "Event End",
};

const TYPE_ICONS: Record<BlockType, React.ElementType> = {
  scene: Type,
  top_desc: Clapperboard,
  text: Type,
  background: Image,
  bgm: Music,
  sfx: Music,
  character: User,
  gallery: ImagePlus,
  video: Film,
  direction: Sliders,
  choice: ListChecks,
  event: Type,
  event_end: Type,
};

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function pickFallbackNameBySeed(
  names: string[],
  seedValue: string | undefined,
  fallbackSeed: string
): string {
  if (names.length === 0) return "";
  const seed = (seedValue?.trim() || fallbackSeed);
  const idx = Math.abs(hashString(seed)) % names.length;
  return names[idx] ?? names[0] ?? "";
}

function resolveRegisteredResourceName(type: BlockType, value: string | undefined): string {
  const raw = (value ?? "").trim();
  const empty = raw === "" || raw === "none";

  switch (type) {
    case "background": {
      const names = BACKGROUNDS.map((x) => x.name);
      if (!empty && names.includes(raw)) return raw;
      return pickFallbackNameBySeed(names, raw, "__bg_fallback__");
    }
    case "character": {
      const names = CHARACTERS.map((x) => x.name);
      if (!empty && names.includes(raw)) return raw;
      return pickFallbackNameBySeed(names, raw, "__char_fallback__");
    }
    case "bgm": {
      const names = BGMS.map((x) => x.name);
      if (!empty && names.includes(raw)) return raw;
      return pickFallbackNameBySeed(names, raw, "__bgm_fallback__");
    }
    case "sfx": {
      const names = SFX.map((x) => x.name);
      if (!empty && names.includes(raw)) return raw;
      return pickFallbackNameBySeed(names, raw, "__sfx_fallback__");
    }
    case "gallery": {
      const names = GALLERIES.map((x) => x.name);
      if (!empty && names.includes(raw)) return raw;
      return pickFallbackNameBySeed(names, raw, "__gallery_fallback__");
    }
    case "video": {
      const names = VIDEOS.map((x) => x.name);
      if (!empty && names.includes(raw)) return raw;
      return pickFallbackNameBySeed(names, raw, "__video_fallback__");
    }
    default:
      return raw;
  }
}

function getRandomNameFromList<T extends { name: string }>(items: T[]): string {
  if (!items.length) return "";
  const index = Math.floor(Math.random() * items.length);
  return items[index]?.name ?? "";
}

const DEFAULT_CHARACTER_EXPRESSION = "기본";
const EFFECT_OPTIONS = [
  { key: "shake", label: "흔들림" },
  { key: "flash", label: "플래시" },
  { key: "zoom_in", label: "줌 인" },
  { key: "slow_motion", label: "슬로우 모션" },
  { key: "dramatic", label: "드라마틱 강조" },
] as const;
const COLOR_OPTIONS = [
  { key: "rose", hex: "#F15F62", label: "레드" },
  { key: "mint", hex: "#94DBB4", label: "그린" },
  { key: "sky", hex: "#87DFFF", label: "블루" },
] as const;

function getCharacterExpressionOptions(characterName: string): string[] {
  const target = initialCharacters.find((c) => c.name === characterName);
  const labels = (target?.expressions ?? [])
    .map((slot) => slot.expressionLabel?.trim() ?? "")
    .filter((label): label is string => label.length > 0 && label !== "untitle");
  const deduped = Array.from(new Set(labels));
  return deduped.length > 0 ? deduped : [DEFAULT_CHARACTER_EXPRESSION];
}

/** 한 줄 블록 전용 (장면/캐릭터/연출/배경 등): 높이 36px, px-0 py-1, gap-4 */
const COMPACT_BLOCK_ROOT_CLASSES =
  "flex items-center justify-start rounded-lg border-0 outline-none focus-within:bg-white min-w-0 flex-1 min-h-[36px] h-[36px] px-0 py-1 gap-4 select-none";

/** 삭제 버튼 아이콘 공통 크기 20x20 */
const DELETE_ICON_CLASS = "h-5 w-5";

export interface ScriptBlockProps {
  block: ScriptBlockType;
  index: number;
  updateBlock: (id: string, content: string, data?: Record<string, any>) => void;
  addBlock: (index: number, type: BlockType, content?: string, data?: Record<string, any>) => string;
  removeBlock: (id: string) => void;
  focusBlock: (id: string) => void;
  /** When true, do not render the index label (e.g. when parent renders it) */
  hideIndex?: boolean;
  /** Optional class for the root element */
  rootClassName?: string;
}

export function ScriptBlock({
  block,
  index,
  updateBlock,
  addBlock,
  removeBlock,
  focusBlock,
  hideIndex = false,
  rootClassName,
}: ScriptBlockProps) {
  const blocks = useEditorStore((s) => s.blocks);
  const seriesPersona = useEditorStore((s) => s.seriesPersona);
  const focusBlockId = useEditorStore((s) => s.focusBlockId);
  const updateBlockType = useEditorStore((s) => s.updateBlockType);
  const setFocusBlockId = useEditorStore((s) => s.setFocusBlockId);
  const onFocusBlock = useCallback(() => setFocusBlockId(block.id), [block.id, setFocusBlockId]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const pendingSelectionRef = useRef<number | null>(null);
  const enterSplitLockRef = useRef(false);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [selection, setSelection] = useState<{
    start: number;
    end: number;
    x: number;
    y: number;
  } | null>(null);
  const [slashMenuPosition, setSlashMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [resourceEditing, setResourceEditing] = useState(false);
  const [isPickerOpen, setPickerOpen] = useState(
    Boolean(block.data?.isNew && PICKER_RESOURCE_TYPES.includes(block.type))
  );
  const [expressionMenuOpen, setExpressionMenuOpen] = useState(false);
  const [videoOptionMenuOpen, setVideoOptionMenuOpen] = useState(false);
  const [speakerCustomModalOpen, setSpeakerCustomModalOpen] = useState(false);
  const [speakerDraft, setSpeakerDraft] = useState("");
  const [effectMenuOpen, setEffectMenuOpen] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);

  const indexLabel = String(index).padStart(2, "0");
  const prevBlock = index > 0 ? blocks[index - 1] : null;
  const isResourceType = RESOURCE_TYPES.includes(block.type);

  const getDefaultResourceContent = useCallback((type: BlockType): string => {
    switch (type) {
      case "background":
        return getRandomNameFromList(BACKGROUNDS) || "School_Day";
      case "character":
        return getRandomNameFromList(CHARACTERS) || "민수";
      case "bgm":
        return getRandomNameFromList(BGMS) || "Calm_Piano";
      case "sfx":
        return getRandomNameFromList(SFX) || "Door_Open";
      case "gallery":
        return "gallery_1";
      case "video":
        return getRandomNameFromList(VIDEOS) || "동영상1";
      default:
        return "";
    }
  }, []);

  const handleSlashSelect = useCallback(
    (payload: SlashSelectPayload) => {
      const isPayloadWithDefault =
        typeof payload === "object" && "content" in payload;

      if (isPayloadWithDefault) {
        updateBlockType(block.id, payload.type);
        updateBlock(block.id, payload.content, payload.data);
        setSlashMenuPosition(null);
        if (payload.data?.isNew) setPickerOpen(true);
      } else {
        const type = payload;
        updateBlockType(block.id, type);
        let content = block.content.replace(/\/\s*$/, "").trim();
        // If changing to resource type and content is empty, set default dummy value
        if (RESOURCE_TYPES.includes(type) && !content) {
          content = getDefaultResourceContent(type);
          updateBlock(block.id, content);
        } else if (content !== block.content) {
          updateBlock(block.id, content);
        }
        setSlashMenuPosition(null);
        if (
          type !== "text" &&
          type !== "scene" &&
          type !== "top_desc" &&
          type !== "gallery" &&
          !PICKER_RESOURCE_TYPES.includes(type)
        ) {
          setResourceEditing(true);
        }
      }
    },
    [block.id, block.content, updateBlockType, updateBlock, getDefaultResourceContent]
  );

  const handleTextMouseUp = useCallback(
    (e: React.MouseEvent<HTMLTextAreaElement>) => {
      if (!textareaRef.current) return;
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;

      if (start !== end) {
        const ta = textareaRef.current;
        const rect = ta.getBoundingClientRect();
        const startCoords = getCaretCoordinates(ta, start);
        const endCoords = getCaretCoordinates(ta, end);
        const centerX = rect.left + (startCoords.left + endCoords.left) / 2;

        setSelection({
          start,
          end,
          x: centerX,
          y: e.clientY - 40,
        });
      } else {
        setSelection(null);
      }
    },
    []
  );

  const handleTextKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // 새로운 입력이 시작되면 플로팅 툴바는 숨김
      setSelection(null);
      const ta = e.currentTarget;
      const pos = ta.selectionStart;

      if (e.key === "/") {
        const coords = getCaretCoordinates(ta, pos);
        const rect = ta.getBoundingClientRect();
        setSlashMenuPosition({
          top: rect.top + coords.top + coords.height,
          left: rect.left + coords.left,
        });
        return;
      }

      if (e.key === "Enter" && !e.shiftKey) {
        if (enterSplitLockRef.current) {
          e.preventDefault();
          return;
        }
        enterSplitLockRef.current = true;
        e.preventDefault();
        const afterCursor = ta.value.slice(pos);
        const beforeCursor = ta.value.slice(0, pos);
        updateBlock(block.id, beforeCursor);
        // index is 1-based; store expects 0-based insert position = index. Inherit speaker from previous block when it's text.
        const speakerData =
          prevBlock?.type === "text"
            ? { speaker: prevBlock.data?.speaker ?? "나레이션" }
            : undefined;
        const newId = addBlock(index, "text", afterCursor, speakerData);
        focusBlock(newId);
        // Unlock on the same timing window as focusBlock's double-rAF focus move.
        // This prevents a quick "/" right after Enter from being handled by the previous block.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            enterSplitLockRef.current = false;
          });
        });
        return;
      }

      if (e.key === "Backspace" && pos === 0 && prevBlock) {
        e.preventDefault();
        const prevContent = prevBlock.content + block.content;
        updateBlock(prevBlock.id, prevContent, prevBlock.data);
        removeBlock(block.id);
        focusBlock(prevBlock.id);
        return;
      }

      // Delete: 한 글자씩 삭제 (커서 바로 뒤 한 글자만 제거)
      if (e.key === "Delete") {
        const len = ta.value.length;
        if (pos < len) {
          e.preventDefault();
          const newValue = ta.value.slice(0, pos) + ta.value.slice(pos + 1);
          pendingSelectionRef.current = pos;
          updateBlock(block.id, newValue);
        }
        return;
      }

      // Arrow keys: move focus between all blocks (including resource blocks)
      // IMPORTANT: Save current text before moving focus
      const currentIdx = index - 1; // 0-based (index is 1-based display number)
      if (e.key === "ArrowUp") {
        if (currentIdx > 0) {
          e.preventDefault();
          e.stopPropagation(); // Prevent event from bubbling to parent div
          // Save current textarea value before moving focus
          updateBlock(block.id, ta.value);
          focusBlock(blocks[currentIdx - 1].id);
          return;
        }
      } else if (e.key === "ArrowDown") {
        if (currentIdx < blocks.length - 1) {
          e.preventDefault();
          e.stopPropagation(); // Prevent event from bubbling to parent div
          // Save current textarea value before moving focus
          updateBlock(block.id, ta.value);
          focusBlock(blocks[currentIdx + 1].id);
          return;
        }
      }
    },
    [
      block.id,
      block.content,
      index,
      blocks,
      prevBlock,
      addBlock,
      updateBlock,
      removeBlock,
      focusBlock,
      setSelection,
    ]
  );

  const handleResourceSave = useCallback(
    (value: string) => {
      updateBlock(block.id, value || "none");
      setResourceEditing(false);
    },
    [block.id, updateBlock]
  );

  /** Delete key: remove current block and focus next or previous. Used by all block types when focused. */
  const handleDeleteBlock = useCallback(
    (e?: React.KeyboardEvent | React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      const currentIdx = index - 1;
      const nextBlock = currentIdx + 1 < blocks.length ? blocks[currentIdx + 1] : null;
      const prevBlockToFocus = currentIdx > 0 ? blocks[currentIdx - 1] : null;
      removeBlock(block.id);
      if (nextBlock) focusBlock(nextBlock.id);
      else if (prevBlockToFocus) focusBlock(prevBlockToFocus.id);
    },
    [block.id, index, blocks, removeBlock, focusBlock]
  );

  const handleResourceBlockKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Delete") {
        handleDeleteBlock(e);
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setResourceEditing(true);
        return;
      }
      const currentIdx = index - 1;
      if (e.key === "ArrowUp") {
        if (currentIdx > 0) {
          e.preventDefault();
          focusBlock(blocks[currentIdx - 1].id);
          return;
        }
      } else if (e.key === "ArrowDown") {
        if (currentIdx < blocks.length - 1) {
          e.preventDefault();
          focusBlock(blocks[currentIdx + 1].id);
          return;
        }
      }
    },
    [index, blocks, focusBlock, setResourceEditing, handleDeleteBlock]
  );

  const applyTag = useCallback(
    (openTag: string, closeTag: string) => {
      if (!selection || !textareaRef.current) return;

      const text = block.content;
      const { start, end } = selection;

      const newText =
        text.slice(0, start) + openTag + text.slice(start, end) + closeTag + text.slice(end);

      updateBlock(block.id, newText);
      setSelection(null);

      // 태그 적용 후 커서를 태그 끝으로 이동
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newCursorPos = end + openTag.length + closeTag.length;
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    },
    [selection, block.id, block.content, updateBlock]
  );

  // 에디터 영역 밖 클릭 시 플로팅 툴바 숨김
  useEffect(() => {
    if (!selection) return;
    const handleDocumentClick = (event: MouseEvent) => {
      // Keep toolbar alive while either formatting menu is open.
      if (effectMenuOpen || colorMenuOpen) return;
      const target = event.target as Node | null;
      if (!target) return;
      if (textareaRef.current && textareaRef.current.contains(target)) return;
      if (toolbarRef.current && toolbarRef.current.contains(target)) return;
      if (dropdownRef.current && dropdownRef.current.contains(target)) return;
      // Radix DropdownMenu is rendered via Portal; inspect composed path and keep toolbar open.
      const path = event.composedPath();
      const clickedInsideDropdown = path.some((node) => {
        if (!(node instanceof Element)) return false;
        if (node.matches("[data-slot='dropdown-menu-content']")) return true;
        if (node.matches("[data-slot='dropdown-menu-trigger']")) return true;
        if (node.matches("[data-radix-menu-content]")) return true;
        if (node.getAttribute("role") === "menu") return true;
        return false;
      });
      if (clickedInsideDropdown) return;
      setSelection(null);
    };

    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [selection, effectMenuOpen, colorMenuOpen]);

  const handleSceneKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const currentIdx = index - 1;
      if (e.key === "Delete") {
        handleDeleteBlock(e);
        return;
      }
      if (e.key === "ArrowUp") {
        if (currentIdx > 0) {
          e.preventDefault();
          e.stopPropagation(); // Prevent event from bubbling to parent div
          focusBlock(blocks[currentIdx - 1].id);
          return;
        }
      } else if (e.key === "ArrowDown") {
        if (currentIdx < blocks.length - 1) {
          e.preventDefault();
          e.stopPropagation(); // Prevent event from bubbling to parent div
          focusBlock(blocks[currentIdx + 1].id);
          return;
        }
      }
    },
    [index, blocks, focusBlock, handleDeleteBlock]
  );

  // Clear isNew after opening picker so it doesn't auto-open again on re-mount
  useEffect(() => {
    if (isPickerOpen && block.data?.isNew && PICKER_RESOURCE_TYPES.includes(block.type)) {
      updateBlock(block.id, block.content, { isNew: false });
    }
  }, [isPickerOpen, block.id, block.content, block.data?.isNew, block.type, updateBlock]);

  // 등록되지 않은 리소스 값은 등록 목록 내 값으로 자동 정규화한다.
  useEffect(() => {
    if (!PICKER_RESOURCE_TYPES.includes(block.type)) return;
    if (block.type === "event") return;
    const normalized = resolveRegisteredResourceName(block.type, block.content);
    if (!normalized || normalized === block.content) return;
    updateBlock(block.id, normalized, block.data);
  }, [block.id, block.type, block.content, block.data, updateBlock]);

  // 한 글자 삭제 후 커서 위치 유지
  useLayoutEffect(() => {
    if (block.type !== "text") return;
    if (pendingSelectionRef.current !== null && textareaRef.current) {
      const pos = pendingSelectionRef.current;
      pendingSelectionRef.current = null;
      textareaRef.current.setSelectionRange(pos, pos);
    }
  }, [block.type, block.content]);

  // Text block: dialogue with per-block speaker dropdown (default "나레이션")
  // Rigid two-column flex layout so wrapped lines don't flow under the left controls (Notion-style).
  if (block.type === "text") {
    const rawSpeaker = block.data?.speaker;
    const speakerDisplay = resolveSpeakerDisplay(rawSpeaker, seriesPersona);
    const updateSpeaker = (speaker: string) =>
      updateBlock(block.id, block.content, { ...(block.data ?? {}), speaker });
    const selectedEffect = (block.data?.effect as string | undefined) ?? EFFECT_OPTIONS[0].key;
    const selectedColor = (block.data?.textColor as string | undefined) ?? COLOR_OPTIONS[0].hex;
    const hasInlineTagToken = /<[^>]+>/.test(block.content);
    const highlightedSegments = block.content.split(/(<[^>]+>)/g);
    const applyEffect = (effect: (typeof EFFECT_OPTIONS)[number]["key"]) => {
      updateBlock(block.id, block.content, { ...(block.data ?? {}), effect });
      applyTag(`<effect=${effect}>`, "</effect>");
    };
    const applyColor = (hex: (typeof COLOR_OPTIONS)[number]["hex"]) => {
      updateBlock(block.id, block.content, { ...(block.data ?? {}), textColor: hex });
      applyTag(`<color=${hex}>`, "</color>");
    };

    const openCustomSpeakerModal = () => {
      if (rawSpeaker === undefined || rawSpeaker === "") {
        setSpeakerDraft("");
      } else if (isPersonaSpeakerToken(rawSpeaker)) {
        setSpeakerDraft(seriesPersona.trim());
      } else {
        setSpeakerDraft(String(rawSpeaker));
      }
      setSpeakerCustomModalOpen(true);
    };

    const applyCustomSpeaker = () => {
      const name = speakerDraft.trim();
      updateSpeaker(name || "나레이션");
      setSpeakerCustomModalOpen(false);
    };

    return (
      <>
        {/* Left column: 화자 — 시안 w-[100px] min-w-14 min-h-8 */}
        <div className="flex min-h-8 w-[100px] min-w-14 shrink-0 items-center justify-start gap-0 overflow-hidden pr-3">
          {!hideIndex && (
            <span className="text-sm font-medium text-slate-300 w-5 text-right tabular-nums">
              {indexLabel}
            </span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-8 min-h-8 w-full min-w-0 items-center justify-start gap-0.5 rounded-none border-0 py-0 pl-0 pr-2 text-left text-xs font-medium leading-4 text-on-surface-30 shadow-none outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0 overflow-hidden"
              >
                <span className="inline-block min-w-0 w-fit truncate text-left">
                  {speakerDisplay}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[200px]">
              <DropdownMenuItem onClick={() => updateSpeaker("나레이션")}>
                나레이션
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateSpeaker(SPEAKER_PERSONA_TOKEN)}>
                {formatPersonaSpeakerLabel(seriesPersona)}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openCustomSpeakerModal()}>
                직접 입력
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-muted-foreground text-xs font-normal px-2 py-1.5">
                등장인물
              </DropdownMenuLabel>
              {CHARACTERS.map((c) => (
                <DropdownMenuItem
                  key={c.id}
                  onClick={() => updateSpeaker(c.name)}
                  className="flex items-center gap-2"
                >
                  <img
                    src={c.url}
                    alt=""
                    className="size-6 shrink-0 rounded-full object-cover bg-slate-100"
                  />
                  {c.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={speakerCustomModalOpen} onOpenChange={setSpeakerCustomModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg">화자 이름</DialogTitle>
              </DialogHeader>
              <Input
                value={speakerDraft}
                onChange={(e) => setSpeakerDraft(e.target.value)}
                placeholder="이름을 입력하세요"
                aria-label="화자 이름"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyCustomSpeaker();
                  }
                }}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSpeakerCustomModalOpen(false)}
                >
                  취소
                </Button>
                <Button type="button" onClick={applyCustomSpeaker}>
                  적용
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Right column: text content — stretch to row height; top-align so multi-line height matches hover row */}
        <div
          className={cn(
            "relative flex min-h-8 min-w-0 flex-1 items-start justify-start self-stretch",
            rootClassName
          )}
        >
          {hasInlineTagToken && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 min-h-8 pt-1 pb-0 text-base font-medium leading-6 whitespace-pre-wrap break-words text-on-surface-20"
            >
              {highlightedSegments.map((segment, idx) => {
                const isTag = /^<[^>]+>$/.test(segment);
                return (
                  <span key={`${idx}-${segment}`} className={isTag ? "text-primary" : undefined}>
                    {segment}
                  </span>
                );
              })}
            </div>
          )}
          <TextareaAutosize
            ref={textareaRef}
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            onFocus={onFocusBlock}
            onKeyDown={handleTextKeyDown}
            onMouseUp={handleTextMouseUp}
            placeholder="'/'를 눌러 메뉴를 선택하거나 텍스트를 입력할 수 있습니다."
            className={cn(
              "relative z-10 min-h-8 h-fit min-w-0 w-full flex-1 resize-none overflow-hidden border-0 bg-transparent pt-1 pb-0 text-base font-medium leading-6 outline-none placeholder:text-on-surface-30 focus:outline-none focus:ring-0",
              hasInlineTagToken ? "text-transparent caret-on-surface-10" : "text-on-surface-20"
            )}
            rows={1}
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8 shrink-0 rounded-full p-0 text-on-surface-30 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover/row:opacity-100"
          aria-label="Delete block"
          onClick={handleDeleteBlock}
        >
          <Trash2 className={DELETE_ICON_CLASS} />
        </Button>

        {slashMenuPosition && (
          <SlashCommandMenu
            position={slashMenuPosition}
            onSelect={handleSlashSelect}
            onClose={() => setSlashMenuPosition(null)}
            targetBlockId={block.id}
          />
        )}

        {/* Floating toolbar for selected text (tag insertion) */}
        {selection && block.type === "text" && (
          <div
            ref={toolbarRef}
            className="fixed z-[120] flex items-center bg-[#2d2d2d] rounded-md border border-[#3d3d3d] overflow-visible"
            style={{ top: selection.y, left: selection.x, transform: "translate(-50%, -100%)" }}
          >
            {/* Basic Icons */}
            <div className="flex items-center px-1">
              <button
                type="button"
                onClick={() => applyTag("<b>", "</b>")}
                className="p-2 text-slate-300 hover:text-white transition-colors"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyTag("<i>", "</i>")}
                className="p-2 text-slate-300 hover:text-white transition-colors"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyTag("<u>", "</u>")}
                className="p-2 text-slate-300 hover:text-white transition-colors"
                title="Underline"
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-[#4d4d4d] mx-1" />

            {/* Effect Dropdown */}
            <DropdownMenu
              modal={false}
              open={effectMenuOpen}
              onOpenChange={(open) => {
                setEffectMenuOpen(open);
                if (open) setColorMenuOpen(false);
              }}
            >
              <DropdownMenuTrigger
                className="flex items-center gap-1 px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors outline-none"
              >
                이펙트 <ChevronDown className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                portalled={false}
                className="z-[110] w-40 p-1 bg-white rounded-lg border border-slate-100"
                ref={dropdownRef}
              >
                {EFFECT_OPTIONS.map((effect) => {
                  const isSelected = selectedEffect === effect.key;
                  return (
                    <DropdownMenuItem
                      key={effect.key}
                      onClick={() => applyEffect(effect.key)}
                      className="flex items-center px-3 py-2.5 cursor-pointer text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-md relative"
                    >
                      {isSelected ? (
                        <Check className="w-4 h-4 mr-1 absolute left-2" />
                      ) : null}
                      <span className="ml-5">{effect.label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Color Dropdown */}
            <DropdownMenu
              modal={false}
              open={colorMenuOpen}
              onOpenChange={(open) => {
                setColorMenuOpen(open);
                if (open) setEffectMenuOpen(false);
              }}
            >
              <DropdownMenuTrigger
                className="flex items-center gap-1 px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors outline-none"
              >
                컬러 <ChevronDown className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                portalled={false}
                className="z-[110] w-44 p-1 bg-white rounded-lg border border-slate-100"
                ref={dropdownRef}
              >
                {COLOR_OPTIONS.map((color) => {
                  return (
                    <DropdownMenuItem
                      key={color.hex}
                      onClick={() => applyColor(color.hex)}
                      className="flex items-center px-3 py-2.5 cursor-pointer text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-md"
                    >
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-5 w-5 rounded-full border border-slate-200"
                          style={{ backgroundColor: color.hex }}
                          aria-hidden
                        />
                        <span>{color.label}</span>
                      </span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </>
    );
  }

  // Scene & top_desc: Two-Box — Label + editable Value (no picker)
  if (block.type === "scene" || block.type === "top_desc") {
    const sceneOrder =
      block.type === "scene"
        ? blocks.slice(0, index).filter((b) => b.type === "scene").length
        : 0;
    const labelText =
      block.type === "scene"
        ? `#장면 ${String(sceneOrder).padStart(2, "0")}`
        : "#장면정보";
    const labelColorClass = LABEL_COLOR_BY_TYPE[block.type];
    const placeholder =
      block.type === "scene" ? "장면 제목" : "장면정보를 입력하세요";

    const sceneContent = (
      <div
        className={cn(COMPACT_BLOCK_ROOT_CLASSES, rootClassName)}
        tabIndex={0}
        onFocus={onFocusBlock}
        onKeyDown={(e) => {
          if (e.target === e.currentTarget && e.key === "Delete") {
            handleDeleteBlock(e);
            return;
          }
          // Only handle arrow keys if input is not focused (prevent double handling)
          if (e.target === e.currentTarget && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
            const currentIdx = index - 1;
            if (e.key === "ArrowUp" && currentIdx > 0) {
              e.preventDefault();
              focusBlock(blocks[currentIdx - 1].id);
            } else if (e.key === "ArrowDown" && currentIdx < blocks.length - 1) {
              e.preventDefault();
              focusBlock(blocks[currentIdx + 1].id);
            }
          }
        }}
      >
        {!hideIndex && (
          <span className="shrink-0 text-xs font-medium text-on-surface-30 tabular-nums">
            {indexLabel}
          </span>
        )}
        <div className="flex min-w-0 flex-1 w-full items-center gap-0">
          <span
            className={cn(
              "block shrink-0 w-[100px] text-sm font-medium",
              labelColorClass
            )}
          >
            {labelText}
          </span>
          <input
            type="text"
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            onFocus={onFocusBlock}
            onKeyDown={handleSceneKeyDown}
            placeholder={placeholder}
            className={cn(
              "min-w-0 flex-1 rounded-md border-0 bg-transparent px-0 py-1.5 text-[rgba(29,41,61,1)] placeholder:text-on-surface-30 outline-none transition-colors focus:outline-none focus:ring-0",
              block.type === "scene"
                ? "text-[24px] font-bold"
                : "text-base font-medium leading-relaxed"
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ml-auto shrink-0 opacity-0 transition-opacity group-hover:opacity-100 h-8 w-8 text-on-surface-30 hover:bg-red-50 hover:text-red-500"
            aria-label="Delete block"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeBlock(block.id);
            }}
          >
            <Trash2 className={DELETE_ICON_CLASS} />
          </Button>
        </div>
      </div>
    );

    // 장면 블록 포함, 배경/텍스트 등과 동일한 한 줄(32px) 구조
    return sceneContent;
  }

  // Direction: 안내문구만 노출 (상세 기능 추후 추가)
  if (block.type === "direction") {
    const labelText = "Direction";

    return (
      <div
        className={cn(COMPACT_BLOCK_ROOT_CLASSES, rootClassName)}
        tabIndex={0}
        onFocus={onFocusBlock}
        onKeyDown={(e) => {
          if (e.target === e.currentTarget && e.key === "Delete") {
            handleDeleteBlock(e);
            return;
          }
          if (e.target === e.currentTarget && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
            const currentIdx = index - 1;
            if (e.key === "ArrowUp" && currentIdx > 0) {
              e.preventDefault();
              focusBlock(blocks[currentIdx - 1].id);
            } else if (e.key === "ArrowDown" && currentIdx < blocks.length - 1) {
              e.preventDefault();
              focusBlock(blocks[currentIdx + 1].id);
            }
          }
        }}
      >
        {!hideIndex && (
          <span className="shrink-0 text-xs font-medium text-on-surface-30 tabular-nums">
            {indexLabel}
          </span>
        )}
        <div className="flex min-w-0 flex-1 w-full items-center gap-0">
          <span className={cn("shrink-0 text-sm font-medium", LABEL_COLOR_BY_TYPE.direction)}>
            {labelText}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ml-auto shrink-0 opacity-0 transition-opacity group-hover:opacity-100 h-8 w-8 text-on-surface-30 hover:bg-red-50 hover:text-red-500"
            aria-label="Delete block"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeBlock(block.id);
            }}
          >
            <Trash2 className={DELETE_ICON_CLASS} />
          </Button>
        </div>
      </div>
    );
  }

  // Choice block: [#선택지] + ChoiceBlockTable — 텍스트 행과 동일 열 간격(라벨 w-[100px], 삭제 group-hover/row)
  if (block.type === "choice") {
    return (
      <div
        className={cn(
          "flex w-full min-w-0 flex-1 items-start gap-0 outline-none min-h-0",
          rootClassName
        )}
        tabIndex={0}
        onFocus={onFocusBlock}
        onKeyDown={(e) => {
          if (e.key === "Delete") {
            handleDeleteBlock(e);
            return;
          }
          const currentIdx = index - 1;
          if (e.key === "ArrowUp" && currentIdx > 0) {
            e.preventDefault();
            focusBlock(blocks[currentIdx - 1].id);
          } else if (e.key === "ArrowDown" && currentIdx < blocks.length - 1) {
            e.preventDefault();
            focusBlock(blocks[currentIdx + 1].id);
          }
        }}
      >
        {!hideIndex && (
          <span className="shrink-0 text-xs font-medium text-on-surface-30 tabular-nums">
            {indexLabel}
          </span>
        )}
        <span
          className={cn(
            "flex shrink-0 items-center justify-start overflow-hidden pt-0.5 w-[100px] min-w-14 min-h-8 text-xs font-medium leading-4",
            LABEL_COLOR_BY_TYPE.choice
          )}
        >
          #선택지
        </span>
        <ChoiceBlockTable
          className="min-w-0 flex-1"
          blockId={block.id}
          choices={block.data?.choices ?? []}
          onChange={(newChoices) =>
            updateBlock(block.id, "", {
              ...(block.data ?? {}),
              choices: newChoices,
            })
          }
          sceneOptions={blocks
            .filter((b) => b.type === "scene")
            .map((b, i) => ({
              value: b.content?.trim() || `장면_${i + 1}`,
              label: b.content?.trim() || `장면_${i + 1}`,
            }))}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8 shrink-0 rounded-full p-0 text-on-surface-30 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover/row:opacity-100"
          aria-label="Delete block"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeBlock(block.id);
          }}
        >
          <Trash2 className={DELETE_ICON_CLASS} />
        </Button>
      </div>
    );
  }

  // Resource blocks: [Icon] [Label] [Value]
  const Icon = TYPE_ICONS[block.type];
  const label = TYPE_LABELS[block.type];
  const isNone = block.content === "none" || !block.content;

  if (resourceEditing) {
    return (
      <div
        className={cn(COMPACT_BLOCK_ROOT_CLASSES, "bg-slate-50/50", rootClassName)}
        onFocus={onFocusBlock}
        tabIndex={0}
      >
        {!hideIndex && (
          <span className="shrink-0 text-xs font-medium text-on-surface-30 tabular-nums">
            {indexLabel}
          </span>
        )}
        <div className="flex flex-1 items-center gap-4">
          <Icon className="h-4 w-4 shrink-0 text-on-surface-30" />
          <span className={cn("w-[100px] shrink-0 text-sm font-medium", LABEL_COLOR_BY_TYPE[block.type])}>
            {label}
          </span>
          <input
            type="text"
            value={block.content === "none" ? "" : block.content}
            onChange={(e) => updateBlock(block.id, e.target.value || "none")}
            onFocus={onFocusBlock}
            onBlur={() => setResourceEditing(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleResourceSave(
                  block.content === "none" ? "" : block.content
                );
                return;
              }
              if (e.key === "Delete") {
                handleDeleteBlock(e);
                return;
              }
              // Arrow keys: move focus between all blocks
              const currentIdx = index - 1;
              if (e.key === "ArrowUp") {
                if (currentIdx > 0) {
                  e.preventDefault();
                  e.stopPropagation(); // Prevent event from bubbling to parent div
                  focusBlock(blocks[currentIdx - 1].id);
                  return;
                }
              } else if (e.key === "ArrowDown") {
                if (currentIdx < blocks.length - 1) {
                  e.preventDefault();
                  e.stopPropagation(); // Prevent event from bubbling to parent div
                  focusBlock(blocks[currentIdx + 1].id);
                  return;
                }
              }
            }}
            placeholder="Value..."
            className="min-w-[120px] flex-1 rounded border-0 bg-white px-2 py-1.5 text-sm outline-none focus:outline-none focus:ring-0"
            autoFocus
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ml-auto shrink-0 opacity-0 transition-opacity group-hover:opacity-100 h-8 w-8 text-on-surface-30 hover:bg-red-50 hover:text-red-500"
            aria-label="Delete block"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeBlock(block.id);
            }}
          >
            <Trash2 className={DELETE_ICON_CLASS} />
          </Button>
        </div>
      </div>
    );
  }

  // Picker resource types: Two-Box design — Label box + Value box
  if (PICKER_RESOURCE_TYPES.includes(block.type)) {
    const displayName =
      block.type === "event"
        ? (block.content?.trim() || "")
        : resolveRegisteredResourceName(block.type, block.content);
    const isCharacter = block.type === "character";
    const isVideo = block.type === "video";
    const isSceneTransition = block.type === "event";
    const isBackground = block.type === "background";
    const characterItem = isCharacter
      ? CHARACTERS.find((c) => c.name === displayName)
      : null;
    const backgroundItem = isBackground
      ? BACKGROUNDS.find((b) => b.name === displayName)
      : null;
    const thumbnailUrl = characterItem?.url ?? backgroundItem?.url ?? null;
    const hasImageThumbnail = Boolean(thumbnailUrl);
    const isEmpty = !displayName || displayName === "none";
    const labelKo = BLOCK_LABEL_KO[block.type] ?? label;
    const labelColorClass = LABEL_COLOR_BY_TYPE[block.type];
    const sceneItems = isSceneTransition
      ? blocks
          .map((b, idx) => ({ b, idx }))
          .filter(({ b }) => b.type === "scene")
          .map(({ b, idx }) => {
            const sceneNumber = blocks.slice(0, idx).filter((x) => x.type === "scene").length + 1;
            const sceneTitle = b.content?.trim() || `장면 ${sceneNumber}`;
            return {
              id: b.id,
              name: `${String(sceneNumber).padStart(2, "0")} ${sceneTitle}`,
            };
          })
      : undefined;
    const characterExpressionOptions =
      block.type === "character"
        ? getCharacterExpressionOptions(displayName)
        : [DEFAULT_CHARACTER_EXPRESSION];
    const currentExpressionRaw = (block.data?.expression as string | undefined)?.trim() ?? "";
    const currentExpression =
      characterExpressionOptions.includes(currentExpressionRaw) && currentExpressionRaw.length > 0
        ? currentExpressionRaw
        : characterExpressionOptions[0] ?? DEFAULT_CHARACTER_EXPRESSION;

    const currentVideoPlayback = (block.data?.playback as "loop" | "once" | undefined) ?? "loop";
    const currentVideoPlaybackLabel = currentVideoPlayback === "once" ? "한 번만" : "무한루프";

    return (
      <div
        className={cn(COMPACT_BLOCK_ROOT_CLASSES, rootClassName)}
        onClick={() => onFocusBlock()}
        onFocus={onFocusBlock}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Delete") {
            handleDeleteBlock(e);
            return;
          }
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setPickerOpen(true);
            return;
          }
          // Arrow keys: move focus between all blocks
          const currentIdx = index - 1;
          if (e.key === "ArrowUp") {
            if (currentIdx > 0) {
              e.preventDefault();
              focusBlock(blocks[currentIdx - 1].id);
              return;
            }
          } else if (e.key === "ArrowDown") {
            if (currentIdx < blocks.length - 1) {
              e.preventDefault();
              focusBlock(blocks[currentIdx + 1].id);
              return;
            }
          }
        }}
      >
        {!hideIndex && (
          <span className="shrink-0 text-xs font-medium text-on-surface-30 tabular-nums">
            {indexLabel}
          </span>
        )}
        <div className="flex min-w-0 flex-1 items-center gap-0">
          <span
            className={cn(
              "block w-[100px] shrink-0 font-medium text-[13px]",
              labelColorClass
            )}
          >
            {`#${labelKo}`}
          </span>
          <ResourcePicker
            type={block.type}
            isOpen={isPickerOpen}
            onOpenChange={setPickerOpen}
            itemsOverride={sceneItems}
            onSelect={(value) => {
              if (block.type === "character") {
                const nextOptions = getCharacterExpressionOptions(value);
                requestAnimationFrame(() => setExpressionMenuOpen(true));
                updateBlock(block.id, value, {
                  ...(block.data ?? {}),
                  expression: nextOptions[0] ?? DEFAULT_CHARACTER_EXPRESSION,
                });
              } else if (block.type === "video") {
                requestAnimationFrame(() => setVideoOptionMenuOpen(true));
                updateBlock(block.id, value, {
                  ...(block.data ?? {}),
                  playback: (block.data?.playback as "loop" | "once" | undefined) ?? "loop",
                });
              } else if (block.type === "event") {
                // 장면 전환: 선택한 장면 라벨을 content로 저장하고, 원본 scene block id도 같이 저장
                const selected = sceneItems?.find((it) => it.name === value);
                updateBlock(block.id, value, { ...(block.data ?? {}), sceneId: selected?.id });
              } else {
                updateBlock(block.id, value);
              }
            }}
            onClose={() => setPickerOpen(false)}
            selectedName={displayName}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFocusBlock();
                setPickerOpen(true);
              }}
              onFocus={onFocusBlock}
              onKeyDown={(e) => {
                if (e.key === "Delete") {
                  handleDeleteBlock(e);
                  return;
                }
                const currentIdx = index - 1;
                if (e.key === "ArrowUp") {
                  if (currentIdx > 0) {
                    e.preventDefault();
                    focusBlock(blocks[currentIdx - 1].id);
                    return;
                  }
                } else if (e.key === "ArrowDown") {
                  if (currentIdx < blocks.length - 1) {
                    e.preventDefault();
                    focusBlock(blocks[currentIdx + 1].id);
                    return;
                  }
                }
              }}
              className="flex h-8 min-w-0 w-fit cursor-pointer items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1.5 transition-all hover:bg-slate-50 focus:outline-none focus:ring-0 active:scale-[0.98]"
            >
              {hasImageThumbnail ? (
                <img
                  src={thumbnailUrl!}
                  alt={displayName}
                  className="h-5 w-5 shrink-0 rounded-full object-cover"
                />
              ) : block.type === "bgm" || block.type === "sfx" ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-on-surface-30">
                  <Music className="h-3 w-3" />
                </span>
              ) : isVideo ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-on-surface-30">
                  <Film className="h-3 w-3" />
                </span>
              ) : null}
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-[13px] font-medium",
                  isEmpty ? "text-on-surface-30" : "text-[rgba(126,140,160,1)]"
                )}
              >
                {isEmpty ? "선택 안됨" : displayName}
              </span>
              <ChevronDown className="ml-1 h-4 w-4 shrink-0 text-on-surface-30" />
            </button>
          </ResourcePicker>
          {isCharacter && !isEmpty && (
            <DropdownMenu open={expressionMenuOpen} onOpenChange={setExpressionMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  onFocus={onFocusBlock}
                  className="ml-2 flex h-8 min-w-0 w-fit cursor-pointer items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1.5 transition-all hover:bg-slate-50 focus:outline-none focus:ring-0 active:scale-[0.98]"
                >
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-[13px] font-medium text-[rgba(126,140,160,1)]"
                    )}
                  >
                    {currentExpression}
                  </span>
                  <ChevronDown className="ml-1 h-4 w-4 shrink-0 text-on-surface-30" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-40 p-1 bg-white rounded-lg border border-slate-100"
              >
                {characterExpressionOptions.map((expr) => (
                  <DropdownMenuItem
                    key={expr}
                    onClick={() =>
                      updateBlock(block.id, block.content, {
                        ...(block.data ?? {}),
                        expression: expr,
                      })
                    }
                    className="flex items-center px-3 py-2.5 cursor-pointer text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-md"
                  >
                    {expr}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {isVideo && !isEmpty && (
            <DropdownMenu open={videoOptionMenuOpen} onOpenChange={setVideoOptionMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  onFocus={onFocusBlock}
                  className="ml-2 flex h-8 min-w-0 w-fit cursor-pointer items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1.5 transition-all hover:bg-slate-50 focus:outline-none focus:ring-0 active:scale-[0.98]"
                >
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[rgba(126,140,160,1)]">
                    {currentVideoPlaybackLabel}
                  </span>
                  <ChevronDown className="ml-1 h-4 w-4 shrink-0 text-on-surface-30" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-40 p-1 bg-white rounded-lg border border-slate-100"
              >
                <DropdownMenuItem
                  onClick={() =>
                    updateBlock(block.id, block.content, {
                      ...(block.data ?? {}),
                      playback: "loop",
                    })
                  }
                  className="flex items-center px-3 py-2.5 cursor-pointer text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-md"
                >
                  무한루프
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    updateBlock(block.id, block.content, {
                      ...(block.data ?? {}),
                      playback: "once",
                    })
                  }
                  className="flex items-center px-3 py-2.5 cursor-pointer text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-md"
                >
                  한 번만
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ml-auto shrink-0 opacity-0 transition-opacity group-hover:opacity-100 h-8 w-8 text-on-surface-30 hover:bg-red-50 hover:text-red-500"
            aria-label="Delete block"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeBlock(block.id);
            }}
          >
            <Trash2 className={DELETE_ICON_CLASS} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(COMPACT_BLOCK_ROOT_CLASSES, "cursor-pointer", isNone && "opacity-70", rootClassName)}
      onClick={(e) => {
        onFocusBlock();
        setResourceEditing(true);
      }}
      onFocus={onFocusBlock}
      tabIndex={0}
      onKeyDown={handleResourceBlockKeyDown}
    >
      {!hideIndex && (
        <span className="shrink-0 text-xs font-medium text-on-surface-30 tabular-nums">
          {indexLabel}
        </span>
      )}
      <div className="flex min-w-0 flex-1 items-center gap-0">
        <Icon className="h-4 w-4 shrink-0 text-on-surface-30" />
        <span className={cn("w-[100px] shrink-0 text-sm font-medium", LABEL_COLOR_BY_TYPE[block.type])}>
          {label}
        </span>
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-sm",
            isNone ? "text-on-surface-30" : "text-on-surface-10"
          )}
        >
          {isNone ? "—" : block.content}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-auto shrink-0 opacity-0 transition-opacity group-hover:opacity-100 h-8 w-8 text-on-surface-30 hover:bg-red-50 hover:text-red-500"
          aria-label="Delete block"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeBlock(block.id);
          }}
        >
          <Trash2 className={DELETE_ICON_CLASS} />
        </Button>
      </div>
    </div>
  );
}
