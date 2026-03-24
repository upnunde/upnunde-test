"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import {
  Image,
  Music,
  User,
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
import { CHARACTERS, BACKGROUNDS, BGMS, SFX } from "@/lib/mockData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getCaretCoordinates } from "@/lib/caretPosition";
import { SlashCommandMenu, type SlashSelectPayload } from "./SlashCommandMenu";
import { ResourcePicker } from "./ResourcePicker";
import { ChoiceBlockTable } from "./ChoiceBlockTable";
import { cn } from "@/lib/utils";

const RESOURCE_TYPES: BlockType[] = ["background", "bgm", "sfx", "character", "gallery", "choice"];

const PICKER_RESOURCE_TYPES: BlockType[] = ["background", "character", "bgm", "sfx", "gallery"];

const TYPE_LABELS: Record<BlockType, string> = {
  scene: "Scene",
  top_desc: "Situation Info",
  text: "Text",
  background: "Background",
  bgm: "BGM",
  sfx: "SFX",
  character: "Character",
  gallery: "Gallery",
  direction: "Direction",
  choice: "Choice",
  event: "Event",
  event_end: "Event End",
};

/** Two-Box: Korean label for picker resource types */
const PICKER_LABEL_KO: Record<BlockType, string> = {
  scene: "씬",
  top_desc: "상황정보",
  text: "텍스트",
  background: "배경",
  bgm: "BGM",
  sfx: "SFX",
  character: "캐릭터",
  gallery: "갤러리",
  direction: "연출",
  choice: "선택",
  event: "이벤트",
  event_end: "이벤트 종료",
};

/** 카테고리별 안내문구 고유 색상 (겹치지 않음, 채도 차이 적용) */
const LABEL_COLOR_BY_TYPE: Record<BlockType, string> = {
  scene: "text-emerald-600",
  top_desc: "text-primary",
  text: "text-zinc-600",
  background: "text-blue-600",
  bgm: "text-rose-600",
  sfx: "text-orange-500",
  character: "text-violet-600",
  gallery: "text-teal-600",
  direction: "text-indigo-600",
  choice: "text-cyan-600",
  event: "text-amber-600",
  event_end: "text-amber-700",
};

const TYPE_ICONS: Record<BlockType, React.ElementType> = {
  scene: Type,
  top_desc: Type,
  text: Type,
  background: Image,
  bgm: Music,
  sfx: Music,
  character: User,
  gallery: ImagePlus,
  direction: Sliders,
  choice: ListChecks,
  event: Type,
  event_end: Type,
};

function getRandomNameFromList<T extends { name: string }>(items: T[]): string {
  if (!items.length) return "";
  const index = Math.floor(Math.random() * items.length);
  return items[index]?.name ?? "";
}

/** 캐릭터 블록용 표정 옵션 */
const EXPRESSIONS = ["기본", "웃음", "슬픔", "화남", "놀람", "당황", "무표정"] as const;

/** 텍스트(대사) 블록 전용: 높이 내용에 맞춤, 패딩/갭 별도 적용, 세로 상단 정렬 */
const TEXT_BLOCK_ROOT_CLASSES =
  "relative flex items-start justify-center w-full group/row gap-0 py-0 rounded-lg border-0 outline-none hover:bg-slate-50/50 focus-within:bg-white min-w-0 flex-1 min-h-[36px] h-fit";

/** 한 줄 블록 전용 (씬/캐릭터/연출/배경 등): 높이 36px, px-0 py-1, gap-4 */
const COMPACT_BLOCK_ROOT_CLASSES =
  "group flex items-center justify-start rounded-lg border-0 outline-none hover:bg-slate-50/50 focus-within:bg-white min-w-0 flex-1 min-h-[36px] h-[36px] px-0 py-1 gap-4 select-none";

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
        setSelection({
          start,
          end,
          x: e.clientX,
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
            ? { speaker: prevBlock.data?.speaker ?? "독백" }
            : undefined;
        const newId = addBlock(index, "text", afterCursor, speakerData);
        focusBlock(newId);
        requestAnimationFrame(() => {
          enterSplitLockRef.current = false;
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
    const handleDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (textareaRef.current && textareaRef.current.contains(target)) return;
      if (toolbarRef.current && toolbarRef.current.contains(target)) return;
      if (dropdownRef.current && dropdownRef.current.contains(target)) return;
      setSelection(null);
    };

    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  }, [selection]);

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

  // 한 글자 삭제 후 커서 위치 유지
  useLayoutEffect(() => {
    if (block.type !== "text") return;
    if (pendingSelectionRef.current !== null && textareaRef.current) {
      const pos = pendingSelectionRef.current;
      pendingSelectionRef.current = null;
      textareaRef.current.setSelectionRange(pos, pos);
    }
  }, [block.type, block.content]);

  // Text block: dialogue with per-block speaker dropdown (default "독백")
  // Rigid two-column flex layout so wrapped lines don't flow under the left controls (Notion-style).
  if (block.type === "text") {
    const currentSpeaker = block.data?.speaker ?? "독백";
    const updateSpeaker = (speaker: string) =>
      updateBlock(block.id, block.content, { ...(block.data ?? {}), speaker });

    return (
      <div className={cn(TEXT_BLOCK_ROOT_CLASSES, rootClassName)}>
        {/* Left column: block index + speaker dropdown — shrink-0 so content never overlaps */}
        <div className="flex items-center justify-start gap-0 shrink-0 pt-0 w-[80px] mt-1">
          {!hideIndex && (
            <span className="text-sm font-medium text-slate-300 w-5 text-right tabular-nums">
              {indexLabel}
            </span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-0 h-7 max-w-[64px] min-w-0 p-0 m-0 text-[13px] text-on-surface-30 font-medium rounded-md border-0 outline-none shadow-none hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0 overflow-hidden"
              >
                <span className="min-w-0 whitespace-nowrap">
                  {currentSpeaker.length > 3
                    ? `${currentSpeaker.slice(0, 3)}..`
                    : currentSpeaker}
                </span>
                <ChevronDown className="ml-1 w-3 h-3 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => updateSpeaker("독백")}>
                독백
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-muted-foreground text-xs font-normal px-2 py-1.5">
                캐릭터
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
        </div>

        {/* Right column: text content — flex-1 min-w-0 so text wraps within column */}
        <div className="flex-1 min-w-0 h-fit flex items-center">
          <TextareaAutosize
            ref={textareaRef}
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            onFocus={onFocusBlock}
            onKeyDown={handleTextKeyDown}
            onMouseUp={handleTextMouseUp}
            placeholder="'/'를 눌러 메뉴를 선택하거나 텍스트를 입력할 수 있습니다."
            className="w-full resize-none overflow-hidden bg-transparent focus:outline-none leading-relaxed font-medium text-[16px] text-on-surface-10 placeholder:text-on-surface-30 min-h-[2rem] py-0 mt-1 border-0 outline-none focus:ring-0"
            rows={1}
          />
        </div>

        {/* Delete block on hover */}
        <div className="opacity-0 group-hover/row:opacity-100 shrink-0 flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-on-surface-30 hover:bg-red-50 hover:text-red-500"
            aria-label="Delete block"
            onClick={handleDeleteBlock}
          >
            <Trash2 className={DELETE_ICON_CLASS} />
          </Button>
        </div>

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
            className="fixed z-50 flex items-center bg-[#2d2d2d] rounded-md border border-[#3d3d3d] overflow-visible animate-in fade-in zoom-in-95 duration-150"
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
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-1 px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors outline-none"
                onPointerDown={(e) => e.preventDefault()}
              >
                이펙트 <ChevronDown className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-40 p-1 bg-white rounded-lg border border-slate-100"
                ref={dropdownRef}
              >
                <DropdownMenuItem
                  onClick={() => applyTag("<effect=fear>", "</effect>")}
                  className="flex items-center px-3 py-2.5 cursor-pointer text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-md"
                >
                  <span className="ml-5">공포, 떨림</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => applyTag("<effect=dizzy>", "</effect>")}
                  className="flex items-center px-3 py-2.5 cursor-pointer text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-md relative"
                >
                  <Check className="w-4 h-4 mr-1 absolute left-2" />
                  <span className="ml-5">어지러움</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => applyTag("<effect=joy>", "</effect>")}
                  className="flex items-center px-3 py-2.5 cursor-pointer text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-md"
                >
                  <span className="ml-5">즐거움</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Color Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-1 px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors outline-none"
                onPointerDown={(e) => e.preventDefault()}
              >
                컬러 <ChevronDown className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-44 p-1 bg-white rounded-lg border border-slate-100"
                ref={dropdownRef}
              >
                <DropdownMenuItem
                  onClick={() => applyTag("<color=green>", "</color>")}
                  className="flex items-center px-3 py-2.5 cursor-pointer text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-md"
                >
                  <div className="w-4 h-4 rounded-full bg-emerald-300 ml-5 mr-2" />
                  <span>공포, 떨림</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => applyTag("<color=red>", "</color>")}
                  className="flex items-center px-3 py-2.5 cursor-pointer text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-md relative"
                >
                  <Check className="w-4 h-4 absolute left-2" />
                  <div className="w-4 h-4 rounded-full bg-red-400 ml-5 mr-2" />
                  <span>어지러움</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => applyTag("<color=blue>", "</color>")}
                  className="flex items-center px-3 py-2.5 cursor-pointer text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-md"
                >
                  <div className="w-4 h-4 rounded-full bg-sky-300 ml-5 mr-2" />
                  <span>즐거움</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    );
  }

  // Scene & top_desc & event & event_end: Two-Box — Label + editable Value (no picker)
  if (block.type === "scene" || block.type === "top_desc" || block.type === "event" || block.type === "event_end") {
    const sceneOrder =
      block.type === "scene"
        ? blocks.slice(0, index).filter((b) => b.type === "scene").length
        : 0;
    const labelText =
      block.type === "scene"
        ? `# 씬 ${String(sceneOrder).padStart(2, "0")}`
        : block.type === "top_desc"
        ? "# 상황정보"
        : block.type === "event"
        ? "# 이벤트"
        : "# 이벤트 종료";
    const labelColorClass = LABEL_COLOR_BY_TYPE[block.type];
    const placeholder =
      block.type === "scene"
        ? "씬 제목"
        : block.type === "top_desc"
        ? "상황정보를 입력하세요"
        : block.type === "event"
        ? "이벤트 이름"
        : "종료됨";

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
          <div className="shrink-0 w-20">
            <span
              className={cn(
                "text-sm font-medium",
                labelColorClass
              )}
            >
              {labelText}
            </span>
          </div>
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
          <div className="ml-auto flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-on-surface-30 hover:bg-red-50 hover:text-red-500"
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
      </div>
    );

    // 씬 블록 포함, 배경/텍스트 등과 동일한 한 줄(32px) 구조
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
          <div className="ml-auto flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-on-surface-30 hover:bg-red-50 hover:text-red-500"
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
      </div>
    );
  }

  // Choice block: [# 선택지] + ChoiceBlockTable — 높이 고정 없이 내용만큼 확장
  if (block.type === "choice") {
    return (
      <div
        className={cn(
          "group flex items-start justify-start gap-4 min-w-0 flex-1 px-0 py-1 min-h-0",
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
        <div className="flex min-w-0 flex-1 items-start gap-0">
          <div className="w-20 shrink-0 mt-[3px]">
            <span className={cn("shrink-0 text-[13px] font-medium pt-0", LABEL_COLOR_BY_TYPE.choice)}>
              # 선택지
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <ChoiceBlockTable
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
                  value: b.content?.trim() || `Scene_${i + 1}`,
                  label: b.content?.trim() || `Scene_${i + 1}`,
                }))}
            />
          </div>
          <div className="ml-auto flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-on-surface-30 hover:bg-red-50 hover:text-red-500"
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
          <span className={cn("w-24 shrink-0 text-sm font-medium", LABEL_COLOR_BY_TYPE[block.type])}>
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
          <div className="ml-auto flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-on-surface-30 hover:bg-red-50 hover:text-red-500"
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
      </div>
    );
  }

  // Picker resource types: Two-Box design — Label box + Value box
  if (PICKER_RESOURCE_TYPES.includes(block.type)) {
    const displayName = block.content?.trim() || "";
    const isCharacter = block.type === "character";
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
    const labelKo = PICKER_LABEL_KO[block.type] ?? label;
    const labelColorClass = LABEL_COLOR_BY_TYPE[block.type];

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
          <div className="w-20 shrink-0 flex items-center">
            <span
              className={cn(
                "w-fit font-medium text-[13px]",
                labelColorClass
              )}
            >
              # {labelKo}
            </span>
          </div>
          <ResourcePicker
            type={block.type}
            isOpen={isPickerOpen}
            onOpenChange={setPickerOpen}
            onSelect={(value) => {
              updateBlock(block.id, value);
              if (block.type === "character") {
                requestAnimationFrame(() => setExpressionMenuOpen(true));
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
                    {(block.data?.expression as string) || "기본"}
                  </span>
                  <ChevronDown className="ml-1 h-4 w-4 shrink-0 text-on-surface-30" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-40 p-1 bg-white rounded-lg border border-slate-100"
              >
                {EXPRESSIONS.map((expr) => (
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
          <div className="ml-auto flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-on-surface-30 hover:bg-red-50 hover:text-red-500"
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
      </div>
    );
  }

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
    },
    [index, blocks, focusBlock, setResourceEditing, handleDeleteBlock]
  );

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
<span className={cn("w-24 shrink-0 text-sm font-medium", LABEL_COLOR_BY_TYPE[block.type])}>
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
        <div className="ml-auto flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-on-surface-30 hover:bg-red-50 hover:text-red-500"
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
    </div>
  );
}
