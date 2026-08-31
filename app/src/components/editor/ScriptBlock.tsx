"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import NextImage from "next/image";
import TextareaAutosize from "react-textarea-autosize";
import { ICONS, Icon as DsIcon } from "@/lib/icons";
import type { ScriptBlock as ScriptBlockType, ScriptBlockData, BlockType } from "@/types/editor";
import { useEditorStore } from "@/store/useEditorStore";
import { CHARACTERS, BACKGROUNDS, BGMS, SFX, VIDEOS, GALLERIES } from "@/lib/mockData";
import { initialCharacters } from "@/lib/resourceMockData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "design-system/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getCaretCoordinates } from "@/lib/caretPosition";
import { SlashCommandMenu, type SlashSelectPayload } from "./SlashCommandMenu";
import { ResourcePicker } from "./ResourcePicker";
import { useEditorSeriesId } from "./EditorSeriesContext";
import { EditorBottomSheetMenu } from "./EditorBottomSheetMenu";
import { EditorMenuOption, EditorMenuSectionLabel } from "./EditorMenuOption";
import { BlockAttributeTrigger } from "./BlockAttributeTrigger";
import { ChoiceBlockTable } from "./ChoiceBlockTable";
import {
  EDITOR_BLOCK_LABEL_COLUMN_CLASS,
  EDITOR_BLOCK_SPEAKER_COLUMN_CLASS,
  EDITOR_CONTROL_MUTED_TEXT_CLASS,
  EDITOR_INLINE_BODY_FIELD_CLASS,
  editorInlineMenuTriggerClass,
  editorRowControlIconClass,
  EDITOR_SCENE_TITLE_FIELD_SHELL_CLASS,
  EDITOR_SCENE_TITLE_INPUT_CLASS,
  EDITOR_SCENE_TITLE_TYPOGRAPHY_INPUT_ATTR,
  EDITOR_SCENE_TITLE_TYPOGRAPHY_INPUT_VALUE,
} from "@/lib/editor-block-layout";
import {
  editorBlockTrailingActionClass,
  editorRowTrailingActionClass,
} from "@/lib/editor-control-visibility";
import { useIsLgUp } from "@/hooks/useMediaQuery";
import { useMobileBlockTextEdit } from "@/hooks/useMobileBlockTextEdit";

/** Enter 분할이 한 키 입력에 두 번 도는 것 방지 (리마운트·IME 재keydown 포함) */
let lastTextEnterSplitAt = 0;
const TEXT_ENTER_SPLIT_COOLDOWN_MS = 250;

function isImeComposingKey(e: React.KeyboardEvent): boolean {
  return Boolean(e.nativeEvent.isComposing || e.keyCode === 229);
}

function beginTextEnterSplit(): boolean {
  const now = Date.now();
  if (now - lastTextEnterSplitAt < TEXT_ENTER_SPLIT_COOLDOWN_MS) return false;
  lastTextEnterSplitAt = now;
  return true;
}
import { cn } from "design-system/utils";
import {
  SPEAKER_PERSONA_TOKEN,
  formatPersonaSpeakerLabel,
  isPersonaSpeakerToken,
  resolveSpeakerDisplay,
} from "@/lib/speakerPersona";
import { LABEL_COLOR_BY_TYPE } from "@/lib/blockLabelColors";
import { BLOCK_LABEL_KO } from "@/lib/blockTypeLabels";
import { resolveRegisteredResourceName } from "@/lib/resolveRegisteredResourceName";
import {
  EDITOR_TEXT_FORMAT_TOOLBAR_BUTTON_CLASS,
  EDITOR_TEXT_FORMAT_TOOLBAR_DIVIDER_CLASS,
  EDITOR_TEXT_FORMAT_TOOLBAR_MENU_CONTENT_CLASS,
  EDITOR_TEXT_FORMAT_TOOLBAR_MENU_TRIGGER_CLASS,
  EDITOR_TEXT_FORMAT_TOOLBAR_SHELL_CLASS,
} from "@/lib/editor-control-styles";

const RESOURCE_TYPES: BlockType[] = ["background", "bgm", "sfx", "character", "gallery", "video", "choice"];

const PICKER_RESOURCE_TYPES: BlockType[] = ["background", "character", "bgm", "sfx", "gallery", "video", "event"];

const TEXT_BLOCK_PLACEHOLDER_DESKTOP =
  "'/'를 눌러 메뉴를 선택하거나 텍스트를 입력할 수 있습니다.";
const TEXT_BLOCK_PLACEHOLDER_MOBILE = "텍스트를 입력할 수 있습니다.";

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
  scene: ICONS.type,
  top_desc: ICONS.clapperboard,
  text: ICONS.type,
  background: ICONS.image,
  bgm: ICONS.music,
  sfx: ICONS.music,
  character: ICONS.user,
  gallery: ICONS.imagePlus,
  video: ICONS.film,
  direction: ICONS.sliders,
  choice: ICONS.listChecks,
  event: ICONS.type,
  event_end: ICONS.type,
};

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

/** 한 줄 블록 전용 (장면/캐릭터/연출/배경 등): 높이 32px(h-8), px-0 py-1, gap-4 */
const COMPACT_BLOCK_ROOT_CLASSES =
  "flex items-center justify-start rounded-lg border-0 outline-none min-w-0 flex-1 min-h-8 h-8 px-0 py-1 gap-4 select-none";

/** 오디오·동영상 등 썸네일 없는 리소스 아이콘 — surface 배경 없음 */
function pickerFallbackIconClass(isRowFocused: boolean) {
  return cn(
    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-transparent",
    editorRowControlIconClass(isRowFocused),
  );
}

/** 삭제 버튼 아이콘 공통 크기 20x20 */
const DELETE_ICON_CLASS = "h-5 w-5";

export interface ScriptBlockProps {
  block: ScriptBlockType;
  index: number;
  updateBlock: (id: string, content: string, data?: ScriptBlockData) => void;
  addBlock: (index: number, type: BlockType, content?: string, data?: ScriptBlockData) => string;
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
  const isDesktop = useIsLgUp();
  const seriesId = useEditorSeriesId();
  const isSeedDefault = block.data?.isSeedDefault === true;
  const blocks = useEditorStore((s) => s.blocks);
  const seriesPersona = useEditorStore((s) => s.seriesPersona);
  const updateBlockType = useEditorStore((s) => s.updateBlockType);
  const setFocusBlockId = useEditorStore((s) => s.setFocusBlockId);
  const focusBlockId = useEditorStore((s) => s.focusBlockId);
  const isRowFocused = focusBlockId === block.id;
  const onFocusBlock = useCallback(() => setFocusBlockId(block.id), [block.id, setFocusBlockId]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const sceneInputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);
  const pendingSelectionRef = useRef<number | null>(null);
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
  const [speakerMenuOpen, setSpeakerMenuOpen] = useState(false);
  const [speakerCustomModalOpen, setSpeakerCustomModalOpen] = useState(false);
  const [speakerDraft, setSpeakerDraft] = useState("");
  const [effectMenuOpen, setEffectMenuOpen] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);

  const indexLabel = String(index).padStart(2, "0");
  const prevBlock = index > 0 ? blocks[index - 1] : null;

  const textMobileEdit = useMobileBlockTextEdit(block.id, textareaRef);
  const sceneMobileEdit = useMobileBlockTextEdit(block.id, sceneInputRef);

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

  const insertTextBlockAfterCursor = useCallback(() => {
    const ta = textareaRef.current;
    const pos = ta?.selectionStart ?? block.content.length;
    const value = ta?.value ?? block.content;
    const afterCursor = value.slice(pos);
    const beforeCursor = value.slice(0, pos);
    updateBlock(block.id, beforeCursor);
    const speakerData =
      prevBlock?.type === "text"
        ? { speaker: prevBlock.data?.speaker ?? "나레이션" }
        : undefined;
    const newId = addBlock(index, "text", afterCursor, speakerData);
    focusBlock(newId);
  }, [
    addBlock,
    block.content,
    block.id,
    focusBlock,
    index,
    prevBlock,
    updateBlock,
  ]);

  const handleSlashSelect = useCallback(
    (payload: SlashSelectPayload) => {
      if (typeof payload === "object" && "action" in payload && payload.action === "add_sentence") {
        setSlashMenuPosition(null);
        insertTextBlockAfterCursor();
        return;
      }

      const isPayloadWithDefault =
        typeof payload === "object" && "content" in payload;

      if (isPayloadWithDefault) {
        updateBlockType(block.id, payload.type);
        updateBlock(block.id, payload.content, payload.data);
        setSlashMenuPosition(null);
        if (payload.data?.isNew) setPickerOpen(true);
      } else {
        const type = payload as BlockType;
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
    [
      block.id,
      block.content,
      insertTextBlockAfterCursor,
      updateBlockType,
      updateBlock,
      getDefaultResourceContent,
    ],
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
        if (!isDesktop) {
          return;
        }
        // 슬래시 명령은 "빈 텍스트 블록"에서만 허용한다.
        if (ta.value.trim().length === 0) {
          const coords = getCaretCoordinates(ta, pos);
          const rect = ta.getBoundingClientRect();
          setSlashMenuPosition({
            top: rect.top + coords.top + coords.height,
            left: rect.left + coords.left,
          });
          return;
        }
        setSlashMenuPosition(null);
      }

      if (e.key === "Enter" && !e.shiftKey) {
        if (!isDesktop) {
          return;
        }
        // IME 조합 확정 Enter는 무시 — 조합 종료 후 실제 Enter만 분할
        if (isImeComposingKey(e)) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (!beginTextEnterSplit()) {
          return;
        }
        insertTextBlockAfterCursor();
        return;
      }

      if (e.key === "Backspace" && pos === 0 && prevBlock) {
        if (isSeedDefault) return;
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
      isDesktop,
      isSeedDefault,
      insertTextBlockAfterCursor,
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
      if (isSeedDefault) return;
      e?.preventDefault();
      e?.stopPropagation();
      const currentIdx = index - 1;
      const nextBlock = currentIdx + 1 < blocks.length ? blocks[currentIdx + 1] : null;
      const prevBlockToFocus = currentIdx > 0 ? blocks[currentIdx - 1] : null;
      removeBlock(block.id);
      if (nextBlock) focusBlock(nextBlock.id);
      else if (prevBlockToFocus) focusBlock(prevBlockToFocus.id);
    },
    [block.id, index, blocks, focusBlock, isSeedDefault, removeBlock]
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
    (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const currentIdx = index - 1;
      const field = e.currentTarget;

      // Enter = 새 텍스트 블록 추가 후 이동 (장면·장면정보는 인풋 내 줄바꿈 없음)
      if (e.key === "Enter") {
        if (isImeComposingKey(e)) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (!beginTextEnterSplit()) {
          return;
        }
        updateBlock(block.id, field.value);
        const newId = addBlock(index, "text", "");
        focusBlock(newId);
        return;
      }

      if (e.key === "Delete") {
        handleDeleteBlock(e);
        return;
      }
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        if (field instanceof HTMLTextAreaElement) {
          const { selectionStart, selectionEnd, value } = field;
          if (e.key === "ArrowUp" && (selectionStart !== 0 || selectionEnd !== 0)) return;
          if (e.key === "ArrowDown" && (selectionStart !== value.length || selectionEnd !== value.length)) {
            return;
          }
          updateBlock(block.id, value);
        }
        if (e.key === "ArrowUp") {
          if (currentIdx > 0) {
            e.preventDefault();
            e.stopPropagation();
            focusBlock(blocks[currentIdx - 1].id);
          }
          return;
        }
        if (currentIdx < blocks.length - 1) {
          e.preventDefault();
          e.stopPropagation();
          focusBlock(blocks[currentIdx + 1].id);
        }
      }
    },
    [addBlock, block.id, index, blocks, focusBlock, handleDeleteBlock, updateBlock],
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
        <div
          className={cn(
            "flex min-h-8 items-center justify-start gap-0 overflow-hidden pr-3",
            EDITOR_BLOCK_SPEAKER_COLUMN_CLASS,
          )}
        >
          {!hideIndex && (
            <span className="text-body3_500 text-foreground-placeholder w-5 text-right tabular-nums">
              {indexLabel}
            </span>
          )}
          <EditorBottomSheetMenu
            open={speakerMenuOpen}
            onOpenChange={setSpeakerMenuOpen}
            title="화자"
            contentClassName="min-w-[200px]"
            trigger={
              <button type="button" className={editorInlineMenuTriggerClass(isRowFocused)}>
                <span className="inline-block min-w-0 w-fit truncate text-left">
                  {speakerDisplay}
                </span>
                <ICONS.chevronDown className={cn("h-4 w-4 shrink-0", editorRowControlIconClass(isRowFocused))} />
              </button>
            }
          >
            {(presentation) => (
              <>
                <EditorMenuOption
                  presentation={presentation}
                  onSelect={() => {
                    updateSpeaker("나레이션");
                    setSpeakerMenuOpen(false);
                  }}
                >
                  나레이션
                </EditorMenuOption>
                <EditorMenuOption
                  presentation={presentation}
                  onSelect={() => {
                    updateSpeaker(SPEAKER_PERSONA_TOKEN);
                    setSpeakerMenuOpen(false);
                  }}
                >
                  {formatPersonaSpeakerLabel(seriesPersona)}
                </EditorMenuOption>
                <EditorMenuOption
                  presentation={presentation}
                  onSelect={() => {
                    setSpeakerMenuOpen(false);
                    openCustomSpeakerModal();
                  }}
                >
                  직접 입력
                </EditorMenuOption>
                <EditorMenuSectionLabel presentation={presentation}>
                  등장인물
                </EditorMenuSectionLabel>
                {CHARACTERS.map((c) => (
                  <EditorMenuOption
                    key={c.id}
                    presentation={presentation}
                    onSelect={() => {
                      updateSpeaker(c.name);
                      setSpeakerMenuOpen(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    <NextImage
                      src={c.url}
                      alt=""
                      width={24}
                      height={24}
                      className="size-6 shrink-0 rounded-full object-cover bg-background-muted"
                    />
                    {c.name}
                  </EditorMenuOption>
                ))}
              </>
            )}
          </EditorBottomSheetMenu>

          <Dialog open={speakerCustomModalOpen} onOpenChange={setSpeakerCustomModalOpen}>
            <DialogContent className="gap-0 overflow-hidden border-0 p-0 max-lg:border-t-0 max-lg:pb-0 sm:max-w-md">
              <div className="px-5 pt-4 pb-2 max-lg:rounded-t-xl lg:px-6 lg:pt-6">
                <DialogTitle className="text-left text-heading5_700 text-foreground">
                  화자 이름
                </DialogTitle>
              </div>
              <div className="px-5 pb-4 lg:px-6">
                <Input
                  size="xl"
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
              </div>
              <div
                className={cn(
                  "mt-auto shrink-0 bg-background px-5 pt-2 pb-4",
                  "max-lg:pb-[calc(var(--space-4)+env(safe-area-inset-bottom,0px))]",
                )}
              >
                <div className="flex justify-end gap-2">
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
          onPointerDown={textMobileEdit.onContentAreaPointerDown}
        >
          {hasInlineTagToken && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 min-h-8 pt-1 pb-0 text-body1_500 whitespace-pre-wrap break-words text-foreground-muted"
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
            onFocus={textMobileEdit.onContentFocus}
            onPointerDown={textMobileEdit.onContentPointerDown}
            readOnly={textMobileEdit.readOnly}
            onKeyDown={handleTextKeyDown}
            onMouseUp={handleTextMouseUp}
            placeholder={
              isDesktop ? TEXT_BLOCK_PLACEHOLDER_DESKTOP : TEXT_BLOCK_PLACEHOLDER_MOBILE
            }
            className={cn(
              EDITOR_INLINE_BODY_FIELD_CLASS,
              hasInlineTagToken ? "text-transparent caret-foreground" : EDITOR_CONTROL_MUTED_TEXT_CLASS,
            )}
            rows={1}
          />
        </div>

        {!isSeedDefault ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            shape="circle"
            className={cn(
              "ml-auto shrink-0 text-foreground-placeholder lg:hover:bg-destructive-container lg:hover:text-destructive",
              editorRowTrailingActionClass(),
            )}
            aria-label="Delete block"
            onClick={handleDeleteBlock}
          >
            <ICONS.trash2 className={DELETE_ICON_CLASS} />
          </Button>
        ) : null}

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
            className={EDITOR_TEXT_FORMAT_TOOLBAR_SHELL_CLASS}
            style={{ top: selection.y, left: selection.x, transform: "translate(-50%, -100%)" }}
          >
            {/* Basic Icons */}
            <div className="flex items-center px-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => applyTag("<b>", "</b>")}
                className={EDITOR_TEXT_FORMAT_TOOLBAR_BUTTON_CLASS}
                aria-label="굵게"
              >
                <ICONS.formatBold className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => applyTag("<i>", "</i>")}
                className={EDITOR_TEXT_FORMAT_TOOLBAR_BUTTON_CLASS}
                aria-label="기울임"
              >
                <ICONS.formatItalic className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => applyTag("<u>", "</u>")}
                className={EDITOR_TEXT_FORMAT_TOOLBAR_BUTTON_CLASS}
                aria-label="밑줄"
              >
                <ICONS.formatUnderlined className="w-4 h-4" />
              </Button>
            </div>

            {/* Divider */}
            <div className={EDITOR_TEXT_FORMAT_TOOLBAR_DIVIDER_CLASS} />

            {/* Effect Dropdown */}
            <DropdownMenu
              modal={false}
              open={effectMenuOpen}
              onOpenChange={(open) => {
                setEffectMenuOpen(open);
                if (open) setColorMenuOpen(false);
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={EDITOR_TEXT_FORMAT_TOOLBAR_MENU_TRIGGER_CLASS}
                >
                  이펙트
                  <DsIcon icon={ICONS.chevronDown} size="md" position="inline-end" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                portalled={false}
                className={cn(EDITOR_TEXT_FORMAT_TOOLBAR_MENU_CONTENT_CLASS, "w-40")}
                ref={dropdownRef}
              >
                <DropdownMenuGroup>
                  {EFFECT_OPTIONS.map((effect) => {
                    const isSelected = selectedEffect === effect.key;
                    return (
                      <DropdownMenuItem
                        key={effect.key}
                        onClick={() => applyEffect(effect.key)}
                        className={cn("relative", isSelected && "pl-8")}
                      >
                        {isSelected ? (
                          <DsIcon
                            icon={ICONS.check}
                            size="md"
                            className="absolute left-2"
                          />
                        ) : null}
                        {effect.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuGroup>
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
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={EDITOR_TEXT_FORMAT_TOOLBAR_MENU_TRIGGER_CLASS}
                >
                  컬러
                  <DsIcon icon={ICONS.chevronDown} size="md" position="inline-end" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                portalled={false}
                className={cn(EDITOR_TEXT_FORMAT_TOOLBAR_MENU_CONTENT_CLASS, "w-44")}
                ref={dropdownRef}
              >
                <DropdownMenuGroup>
                  {COLOR_OPTIONS.map((color) => {
                    return (
                      <DropdownMenuItem
                        key={color.hex}
                        onClick={() => applyColor(color.hex)}
                      >
                        <span
                          className="h-5 w-5 shrink-0 rounded-full border border-border"
                          style={{ backgroundColor: color.hex }}
                          aria-hidden
                        />
                        {color.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuGroup>
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
    const sceneInputClass =
      block.type === "scene" ? EDITOR_SCENE_TITLE_INPUT_CLASS : EDITOR_INLINE_BODY_FIELD_CLASS;
    const showSceneValueAsReadOnly = !isDesktop && sceneMobileEdit.readOnly;
    /** Enter 줄바꿈 금지 — 붙여넣기 개행도 제거 (긴 문장은 soft-wrap만) */
    const onSceneContentChange = (raw: string) => {
      updateBlock(block.id, raw.replace(/\n/g, ""));
    };

    return (
      <>
        {!hideIndex && (
          <span className="shrink-0 text-caption1_500 text-foreground-placeholder tabular-nums">
            {indexLabel}
          </span>
        )}
        <span
          className={cn(
            "flex shrink-0 items-center justify-start text-body4_500",
            EDITOR_BLOCK_LABEL_COLUMN_CLASS,
            block.type === "scene" ? "min-h-8 self-start" : "h-8 items-center",
            labelColorClass,
          )}
        >
          {labelText}
        </span>
        {block.type === "scene" ? (
          <div className={EDITOR_SCENE_TITLE_FIELD_SHELL_CLASS}>
            <TextareaAutosize
              ref={sceneInputRef as React.RefObject<HTMLTextAreaElement>}
              value={block.content}
              onChange={(e) => onSceneContentChange(e.target.value)}
              onFocus={sceneMobileEdit.onContentFocus}
              onPointerDown={sceneMobileEdit.onContentPointerDown}
              readOnly={sceneMobileEdit.readOnly}
              onKeyDown={handleSceneKeyDown}
              placeholder={placeholder}
              rows={1}
              {...{
                [EDITOR_SCENE_TITLE_TYPOGRAPHY_INPUT_ATTR]:
                  EDITOR_SCENE_TITLE_TYPOGRAPHY_INPUT_VALUE,
              }}
              className={cn(
                sceneInputClass,
                showSceneValueAsReadOnly && "cursor-text",
                showSceneValueAsReadOnly && !block.content?.trim() && "text-foreground-placeholder",
              )}
            />
          </div>
        ) : (
          <div
            className={cn(
              "relative flex min-h-8 min-w-0 flex-1 items-start justify-start self-stretch",
              rootClassName,
            )}
          >
            <TextareaAutosize
              ref={sceneInputRef as React.RefObject<HTMLTextAreaElement>}
              value={block.content}
              onChange={(e) => onSceneContentChange(e.target.value)}
              onFocus={sceneMobileEdit.onContentFocus}
              onPointerDown={sceneMobileEdit.onContentPointerDown}
              readOnly={sceneMobileEdit.readOnly}
              onKeyDown={handleSceneKeyDown}
              placeholder={placeholder}
              rows={1}
              className={cn(
                sceneInputClass,
                showSceneValueAsReadOnly && "cursor-text",
                showSceneValueAsReadOnly && !block.content?.trim()
                  ? "text-foreground-placeholder"
                  : EDITOR_CONTROL_MUTED_TEXT_CLASS,
              )}
            />
          </div>
        )}
        {!isSeedDefault ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(
              "ml-auto shrink-0 self-start text-foreground-placeholder lg:hover:bg-destructive-container lg:hover:text-destructive",
              editorBlockTrailingActionClass(),
            )}
            aria-label="Delete block"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeBlock(block.id);
            }}
          >
            <ICONS.trash2 className={DELETE_ICON_CLASS} />
          </Button>
        ) : null}
      </>
    );
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
          <span className="shrink-0 text-caption1_500 text-foreground-placeholder tabular-nums">
            {indexLabel}
          </span>
        )}
        <div className="flex min-w-0 flex-1 w-full items-center gap-0">
          <span
            className={cn(
              "flex h-8 items-center justify-start text-body4_500",
              EDITOR_BLOCK_LABEL_COLUMN_CLASS,
              LABEL_COLOR_BY_TYPE.direction
            )}
          >
            {labelText}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(
              "ml-auto shrink-0 text-foreground-placeholder lg:hover:bg-destructive-container lg:hover:text-destructive",
              editorBlockTrailingActionClass(),
            )}
            aria-label="Delete block"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeBlock(block.id);
            }}
          >
            <ICONS.trash2 className={DELETE_ICON_CLASS} />
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
          <span className="shrink-0 text-caption1_500 text-foreground-placeholder tabular-nums">
            {indexLabel}
          </span>
        )}
        <span
          className={cn(
            "flex h-8 items-center justify-start overflow-hidden text-caption1_500",
            EDITOR_BLOCK_LABEL_COLUMN_CLASS,
            LABEL_COLOR_BY_TYPE.choice
          )}
        >
          #선택지
        </span>
        <ChoiceBlockTable
          className="min-w-0 flex-1 max-lg:max-w-full"
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
          size="icon-sm"
          shape="circle"
          className={cn(
            "ml-auto shrink-0 text-foreground-placeholder lg:hover:bg-destructive-container lg:hover:text-destructive",
            editorRowTrailingActionClass(),
          )}
          aria-label="Delete block"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeBlock(block.id);
          }}
        >
          <ICONS.trash2 className={DELETE_ICON_CLASS} />
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
        className={cn(COMPACT_BLOCK_ROOT_CLASSES, rootClassName)}
        onFocus={onFocusBlock}
        tabIndex={0}
      >
        {!hideIndex && (
          <span className="shrink-0 text-caption1_500 text-foreground-placeholder tabular-nums">
            {indexLabel}
          </span>
        )}
        <div className="flex flex-1 items-center gap-4">
          <Icon className="h-4 w-4 shrink-0 text-foreground-placeholder" />
          <span
            className={cn(
              "flex h-8 items-center justify-start text-body4_500",
              EDITOR_BLOCK_LABEL_COLUMN_CLASS,
              LABEL_COLOR_BY_TYPE[block.type]
            )}
          >
            {label}
          </span>
          <Input
            type="text"
            size="default"
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
            className="min-w-[120px] flex-1 rounded border-0 bg-background px-2 py-2 text-body3_400 outline-none focus:outline-none focus:ring-0"
            autoFocus
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(
              "ml-auto shrink-0 text-foreground-placeholder lg:hover:bg-destructive-container lg:hover:text-destructive",
              editorBlockTrailingActionClass(),
            )}
            aria-label="Delete block"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeBlock(block.id);
            }}
          >
            <ICONS.trash2 className={DELETE_ICON_CLASS} />
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
    const isGallery = block.type === "gallery";
    const characterItem = isCharacter
      ? CHARACTERS.find((c) => c.name === displayName)
      : null;
    const backgroundItem = isBackground
      ? BACKGROUNDS.find((b) => b.name === displayName)
      : null;
    const galleryItem = isGallery
      ? GALLERIES.find((g) => g.name === displayName)
      : null;
    const thumbnailUrl =
      characterItem?.url ?? backgroundItem?.url ?? galleryItem?.url ?? null;
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
          <span className="shrink-0 text-caption1_500 text-foreground-placeholder tabular-nums">
            {indexLabel}
          </span>
        )}
        <div className="flex min-w-0 flex-1 items-center gap-0">
          <span
            className={cn(
              "flex h-8 items-center justify-start text-body4_500",
              EDITOR_BLOCK_LABEL_COLUMN_CLASS,
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
            seriesId={seriesId}
            onSelect={(value) => {
              if (block.type === "character") {
                if (!value.trim()) {
                  setExpressionMenuOpen(false);
                  updateBlock(block.id, value, {
                    ...(block.data ?? {}),
                    expression: DEFAULT_CHARACTER_EXPRESSION,
                  });
                } else {
                  const nextOptions = getCharacterExpressionOptions(value);
                  requestAnimationFrame(() => setExpressionMenuOpen(true));
                  updateBlock(block.id, value, {
                    ...(block.data ?? {}),
                    expression: nextOptions[0] ?? DEFAULT_CHARACTER_EXPRESSION,
                  });
                }
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
            <BlockAttributeTrigger
              rowFocused={isRowFocused}
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
            >
              {hasImageThumbnail ? (
                <NextImage
                  src={thumbnailUrl!}
                  alt={displayName}
                  width={20}
                  height={20}
                  className="h-5 w-5 shrink-0 rounded-full object-cover"
                />
              ) : block.type === "bgm" || block.type === "sfx" ? (
                <span className={pickerFallbackIconClass(isRowFocused)}>
                  <ICONS.music className="h-4 w-4" />
                </span>
              ) : isVideo ? (
                <span className={pickerFallbackIconClass(isRowFocused)}>
                  <ICONS.film className="h-4 w-4" />
                </span>
              ) : null}
              <span className="min-w-0 flex-1 truncate text-body4_500">
                {isEmpty ? "선택 안됨" : displayName}
              </span>
              <ICONS.chevronDown className={cn("ml-1 h-4 w-4 shrink-0", editorRowControlIconClass(isRowFocused))} />
            </BlockAttributeTrigger>
          </ResourcePicker>
          {isCharacter && !isEmpty && (
            <EditorBottomSheetMenu
              open={expressionMenuOpen}
              onOpenChange={setExpressionMenuOpen}
              title="표정"
              contentClassName="w-40 p-1 bg-background rounded-lg border border-border"
              trigger={
                <BlockAttributeTrigger
                  rowFocused={isRowFocused}
                  onClick={(e) => e.stopPropagation()}
                  onFocus={onFocusBlock}
                  className="ml-2"
                >
                  <span className="min-w-0 flex-1 truncate text-body4_500">
                    {currentExpression}
                  </span>
                  <ICONS.chevronDown className={cn("ml-1 h-4 w-4 shrink-0", editorRowControlIconClass(isRowFocused))} />
                </BlockAttributeTrigger>
              }
            >
              {(presentation) =>
                characterExpressionOptions.map((expr) => (
                  <EditorMenuOption
                    key={expr}
                    presentation={presentation}
                    onSelect={() => {
                      updateBlock(block.id, block.content, {
                        ...(block.data ?? {}),
                        expression: expr,
                      });
                      setExpressionMenuOpen(false);
                    }}
                  >
                    {expr}
                  </EditorMenuOption>
                ))
              }
            </EditorBottomSheetMenu>
          )}
          {isVideo && !isEmpty && (
            <EditorBottomSheetMenu
              open={videoOptionMenuOpen}
              onOpenChange={setVideoOptionMenuOpen}
              title="재생"
              contentClassName="w-40 p-1 bg-background rounded-lg border border-border"
              trigger={
                <BlockAttributeTrigger
                  rowFocused={isRowFocused}
                  onClick={(e) => e.stopPropagation()}
                  onFocus={onFocusBlock}
                  className="ml-2"
                >
                  <span className="min-w-0 flex-1 truncate text-body4_500">
                    {currentVideoPlaybackLabel}
                  </span>
                  <ICONS.chevronDown className={cn("ml-1 h-4 w-4 shrink-0", editorRowControlIconClass(isRowFocused))} />
                </BlockAttributeTrigger>
              }
            >
              {(presentation) => (
                <>
                  <EditorMenuOption
                    presentation={presentation}
                    onSelect={() => {
                      updateBlock(block.id, block.content, {
                        ...(block.data ?? {}),
                        playback: "loop",
                      });
                      setVideoOptionMenuOpen(false);
                    }}
                  >
                    무한루프
                  </EditorMenuOption>
                  <EditorMenuOption
                    presentation={presentation}
                    onSelect={() => {
                      updateBlock(block.id, block.content, {
                        ...(block.data ?? {}),
                        playback: "once",
                      });
                      setVideoOptionMenuOpen(false);
                    }}
                  >
                    한 번만
                  </EditorMenuOption>
                </>
              )}
            </EditorBottomSheetMenu>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(
              "ml-auto shrink-0 text-foreground-placeholder lg:hover:bg-destructive-container lg:hover:text-destructive",
              editorBlockTrailingActionClass(),
            )}
            aria-label="Delete block"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeBlock(block.id);
            }}
          >
            <ICONS.trash2 className={DELETE_ICON_CLASS} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(COMPACT_BLOCK_ROOT_CLASSES, "cursor-pointer", isNone && "opacity-70", rootClassName)}
      onClick={() => {
        onFocusBlock();
        setResourceEditing(true);
      }}
      onFocus={onFocusBlock}
      tabIndex={0}
      onKeyDown={handleResourceBlockKeyDown}
    >
      {!hideIndex && (
        <span className="shrink-0 text-caption1_500 text-foreground-placeholder tabular-nums">
          {indexLabel}
        </span>
      )}
      <div className="flex min-w-0 flex-1 items-center gap-0">
        <Icon className="h-4 w-4 shrink-0 text-foreground-placeholder" />
        <span
          className={cn(
            "flex h-8 items-center justify-start text-body4_500",
            EDITOR_BLOCK_LABEL_COLUMN_CLASS,
            LABEL_COLOR_BY_TYPE[block.type]
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-body3_400",
            isNone ? "text-foreground-placeholder" : "text-foreground"
          )}
        >
          {isNone ? "—" : block.content}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={cn(
              "ml-auto shrink-0 text-foreground-placeholder lg:hover:bg-destructive-container lg:hover:text-destructive",
              editorBlockTrailingActionClass(),
            )}
          aria-label="Delete block"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeBlock(block.id);
          }}
        >
          <ICONS.trash2 className={DELETE_ICON_CLASS} />
        </Button>
      </div>
    </div>
  );
}
