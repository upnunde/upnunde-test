"use client";

import { useCallback, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import type { ChoiceItem } from "@/types/editor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditorStore } from "@/store/useEditorStore";

export interface SceneOption {
  value: string;
  label: string;
}

export interface ChoiceBlockTableProps {
  blockId: string;
  choices: ChoiceItem[];
  onChange: (newChoices: ChoiceItem[]) => void;
  /** 생성된 장면 목록 (장면 전환 드롭다운용) */
  sceneOptions?: SceneOption[];
  className?: string;
}

function createEmptyChoice(): ChoiceItem {
  return {
    id: crypto.randomUUID(),
    text: "",
    nextScene: "",
    isPaid: false,
  };
}

function createAiChoice(): ChoiceItem {
  return {
    id: crypto.randomUUID(),
    text: "",
    nextScene: "",
    isPaid: false,
    isAiMode: true,
  };
}

/** 선택지 내용 전용 텍스트 필드. 영역 고정 확장이 아니라 텍스트 줄 수에 따라 높이만 가변 확장 */
function ChoiceTextField({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
    ta.style.overflowY = "hidden";
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onInput={adjustHeight}
      placeholder={placeholder}
      rows={1}
      className={cn(
        "w-full rounded-md border-0 bg-transparent px-0 py-0 text-sm leading-5 outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 align-middle overflow-hidden resize-none",
        className
      )}
      style={{ height: "fit-content" }}
    />
  );
}

function ChoiceRow({
  blockId,
  index,
  choice,
  onUpdate,
  onRemove,
  sceneOptions = [],
}: {
  blockId: string;
  index: number;
  choice: ChoiceItem;
  onUpdate: (patch: Partial<ChoiceItem>) => void;
  onRemove: () => void;
  sceneOptions: SceneOption[];
}) {
  const isAiMode = choice.isAiMode === true;
  const issueFocus = useEditorStore((s) => s.issueFocus);
  const clearIssueFocus = useEditorStore((s) => s.clearIssueFocus);
  const selectedSceneLabel =
    sceneOptions.find((opt) => opt.value === choice.nextScene)?.label ?? "장면 선택";
  const isSceneUnselected = !choice.nextScene?.trim();
  const isIssueFocusedChoice = issueFocus?.blockId === blockId && issueFocus?.choiceIndex === index;
  const isTextIssueFocused =
    isIssueFocusedChoice && issueFocus?.field === "text";
  const isNextSceneIssueFocused =
    isIssueFocusedChoice && issueFocus?.field === "nextScene";

  useEffect(() => {
    if (!isIssueFocusedChoice) return;
    if (issueFocus?.field === "text" && choice.text?.trim()) {
      clearIssueFocus();
      return;
    }
    if (issueFocus?.field === "nextScene" && choice.nextScene?.trim()) {
      clearIssueFocus();
    }
  }, [
    isIssueFocusedChoice,
    issueFocus?.field,
    choice.text,
    choice.nextScene,
    clearIssueFocus,
  ]);

  return (
    <div
      className="group/choice-row flex border-b border-slate-100 items-stretch min-h-[40px]"
      data-choice-id={choice.id}
    >
      {/* Col 1: Label */}
      <div className="relative w-[80px] shrink-0 min-h-[40px] px-3 py-0 text-sm text-on-surface-30 self-stretch flex items-center">
        선택 {index + 1}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-slate-100" />
      </div>
      {/* Col 2: Content - 텍스트 필드 분리, 줄 길이에 따라 가변 확장 */}
      <div className="relative flex-1 min-w-[200px] min-h-[40px] px-3 py-1 self-stretch flex items-center">
        {isAiMode ? (
          <span className="text-sm font-semibold text-primary">
            ✨ AI 모드로 직접 대화
          </span>
        ) : (
          <ChoiceTextField
            value={choice.text}
            onChange={(text) => {
              onUpdate({ text });
              if (isTextIssueFocused && text.trim()) {
                clearIssueFocus();
              }
            }}
            placeholder="선택지 내용"
            className={isTextIssueFocused ? "text-destructive placeholder:text-destructive/60" : ""}
          />
        )}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-slate-100" />
      </div>
      {/* Col 3: 장면 전환 드롭다운 */}
      <div className="relative w-[200px] min-w-[160px] max-w-[200px] shrink-0 min-h-[40px] px-3 py-0 self-stretch flex items-center">
        <select
          value={choice.nextScene}
          onChange={(e) => {
            const nextScene = e.target.value;
            onUpdate({ nextScene });
            if (isNextSceneIssueFocused && nextScene.trim()) {
              clearIssueFocus();
            }
          }}
          title={selectedSceneLabel}
          className={cn(
            "h-9 w-full min-w-0 rounded-md border-0 bg-transparent px-0 py-1 pr-2 text-sm overflow-hidden text-ellipsis whitespace-nowrap outline-none focus:outline-none focus:ring-0 focus:ring-offset-0",
            isSceneUnselected ? "text-on-surface-30" : "text-on-surface-10",
            isNextSceneIssueFocused && "text-destructive"
          )}
        >
          <option value="">장면 선택</option>
          {sceneOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-slate-100" />
      </div>
      {/* Col 4: Actions */}
      <div className="w-[120px] min-w-[100px] max-w-[120px] shrink-0 min-h-[40px] px-3 py-0 self-stretch flex items-center justify-between gap-2">
        <SwitchToggle
          checked={choice.isPaid}
          onCheckedChange={(checked) => onUpdate({ isPaid: checked })}
        />
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 rounded text-on-surface-30 opacity-0 transition-opacity transition-colors group-hover/choice-row:opacity-100 group-focus-within/choice-row:opacity-100 hover:text-red-600 hover:bg-red-50"
          aria-label="선택지 삭제"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SwitchToggle({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-[34px] shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
        "pointer-events-none inline-block h-4 w-4 rounded-full bg-white ring-0 transition-transform mt-0.5",
          checked ? "translate-x-4" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export function ChoiceBlockTable({
  blockId,
  choices,
  onChange,
  sceneOptions = [],
  className,
}: ChoiceBlockTableProps) {
  // 선택지는 최소 2개(선택 1, 선택 2)가 기본 구조
  useEffect(() => {
    if (choices.length === 0) {
      onChange([createEmptyChoice(), createEmptyChoice()]);
    } else if (choices.length === 1) {
      onChange([...choices, createEmptyChoice()]);
    }
  }, [choices.length, onChange]);

  const handleUpdate = useCallback(
    (index: number, patch: Partial<ChoiceItem>) => {
      const next = [...choices];
      next[index] = { ...next[index], ...patch };
      onChange(next);
    },
    [choices, onChange]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const next = choices.filter((_, i) => i !== index);
      onChange(next);
    },
    [choices, onChange]
  );

  // Task 3: Insert new normal choice BEFORE AI mode if present (AI always last)
  const handleAddNormalChoice = useCallback(() => {
    const newChoice = createEmptyChoice();
    const aiIndex = choices.findIndex((c) => c.isAiMode);
    const next = [...choices];
    if (aiIndex >= 0) {
      next.splice(aiIndex, 0, newChoice);
    } else {
      next.push(newChoice);
    }
    onChange(next);
  }, [choices, onChange]);

  // Task 3: Add AI choice at the very end; only one AI mode allowed
  const handleAddAiChoice = useCallback(() => {
    const hasAi = choices.some((c) => c.isAiMode);
    if (hasAi) return;
    const newChoice = createAiChoice();
    onChange([...choices, newChoice]);
  }, [choices, onChange]);

  const hasAiChoice = choices.some((c) => c.isAiMode);
  const isAtMaxChoices = choices.length >= 4;

  return (
    <div
      className={cn(
        "border border-slate-200 rounded-md bg-white overflow-hidden",
        className
      )}
      data-block-id={blockId}
    >
      {/* Header */}
      <div className="flex border-b border-slate-200 bg-slate-50/80 text-slate-600 text-xs font-medium min-h-9">
        <div className="w-20 shrink-0 px-3 flex items-center border-r border-slate-200">선택</div>
        <div className="flex-1 min-w-[200px] px-3 flex items-center border-r border-slate-200">내용</div>
        <div className="w-[200px] min-w-[160px] max-w-[200px] shrink-0 px-3 flex items-center border-r border-slate-200">장면 전환</div>
        <div className="w-[120px] min-w-[100px] max-w-[120px] shrink-0 px-3 flex items-center">유료 전환</div>
      </div>
      {/* Rows */}
      {choices.map((choice, index) => (
        <ChoiceRow
          blockId={blockId}
          key={choice.id}
          index={index}
          choice={choice}
          onUpdate={(patch) => handleUpdate(index, patch)}
          onRemove={() => handleRemove(index)}
          sceneOptions={sceneOptions}
        />
      ))}
      {/* Footer: Task 4 - Dropdown with "선택지 추가" and "✨ AI 모드로 직접 대화" */}
      {!isAtMaxChoices && (
        <div className="flex h-[40px] items-center justify-start px-1 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-on-surface-10"
              >
                + 선택지 추가
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={handleAddNormalChoice}>
                선택지 추가
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleAddAiChoice}
                disabled={hasAiChoice}
                className={cn("text-primary", hasAiChoice && "opacity-50")}
              >
                ✨ AI 모드로 직접 대화
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
