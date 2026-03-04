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

export interface SceneOption {
  value: string;
  label: string;
}

export interface ChoiceBlockTableProps {
  blockId: string;
  choices: ChoiceItem[];
  onChange: (newChoices: ChoiceItem[]) => void;
  /** 생성된 씬 목록 (Scene 전환 드롭다운용) */
  sceneOptions?: SceneOption[];
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

const CHOICE_TEXTAREA_LINE_HEIGHT_PX = 40; // 디폴트 높이 40px, 텍스트에 따라 확장
const CHOICE_TEXTAREA_MAX_LINES = 2;

function ChoiceRow({
  index,
  choice,
  onUpdate,
  onRemove,
  sceneOptions = [],
}: {
  index: number;
  choice: ChoiceItem;
  onUpdate: (patch: Partial<ChoiceItem>) => void;
  onRemove: () => void;
  sceneOptions: SceneOption[];
}) {
  const isAiMode = choice.isAiMode === true;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const capped = Math.min(
      ta.scrollHeight,
      CHOICE_TEXTAREA_LINE_HEIGHT_PX * CHOICE_TEXTAREA_MAX_LINES
    );
    ta.style.height = `${capped}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [choice.text, adjustHeight]);

  return (
    <div
      className="group/row flex border-b border-slate-100 items-center min-h-10"
      data-choice-id={choice.id}
    >
      {/* Col 1: Label */}
      <div className="w-[80px] shrink-0 px-4 py-2 text-sm text-slate-500 self-center h-full">
        선택 {index + 1}
      </div>
      {/* Col 2: Content */}
      <div className="flex-1 min-w-0 min-h-[40px] p-0 flex items-center">
        {isAiMode ? (
          <span className="text-sm font-semibold text-primary">
            ✨ AI 모드로 직접 대화
          </span>
        ) : (
          <textarea
            ref={textareaRef}
            value={choice.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            onInput={adjustHeight}
            placeholder="선택지 내용"
            rows={1}
            className="min-h-[40px] max-h-[5rem] w-full resize-none rounded-md border-0 bg-transparent px-0 py-[10px] text-sm leading-5 outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 align-middle overflow-y-auto"
            style={{ height: CHOICE_TEXTAREA_LINE_HEIGHT_PX }}
          />
        )}
      </div>
      {/* Col 3: Scene 전환 드롭다운 */}
      <div className="w-48 shrink-0 px-4 py-0 h-full">
        <select
          value={choice.nextScene}
          onChange={(e) => onUpdate({ nextScene: e.target.value })}
          className="h-9 w-full min-w-0 rounded-md border-0 bg-transparent px-0 py-1 text-sm outline-none focus:outline-none focus:ring-0 focus:ring-offset-0"
        >
          <option value="">Scene 선택</option>
          {sceneOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {/* Col 4: Actions */}
      <div className="w-[140px] shrink-0 px-4 py-2 flex items-center justify-between gap-2">
        <SwitchToggle
          checked={choice.isPaid}
          onCheckedChange={(checked) => onUpdate({ isPaid: checked })}
        />
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover/row:opacity-100"
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
          "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform mt-0.5",
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

  return (
    <div
      className="border border-slate-200 rounded-md bg-white overflow-hidden"
      data-block-id={blockId}
    >
      {/* Header */}
      <div className="flex border-b border-slate-200 bg-slate-50/80 text-slate-600 text-xs font-medium min-h-9">
        <div className="w-20 shrink-0 px-4 flex items-center">선택</div>
        <div className="flex-1 min-w-0 px-0 flex items-center">내용</div>
        <div className="w-48 shrink-0 px-4 flex items-center">Scene 전환</div>
        <div className="w-[140px] shrink-0 px-4 flex items-center">
          선택지 유료로 전환
        </div>
      </div>
      {/* Rows */}
      {choices.map((choice, index) => (
        <ChoiceRow
          key={choice.id}
          index={index}
          choice={choice}
          onUpdate={(patch) => handleUpdate(index, patch)}
          onRemove={() => handleRemove(index)}
          sceneOptions={sceneOptions}
        />
      ))}
      {/* Footer: Task 4 - Dropdown with "선택지 추가" and "✨ AI 모드로 직접 대화" */}
      <div className="flex h-[40px] items-center justify-start px-1 py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-slate-900"
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
    </div>
  );
}
