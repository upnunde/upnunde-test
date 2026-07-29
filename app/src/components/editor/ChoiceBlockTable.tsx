"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ICONS, Icon } from "@/lib/icons";
import type { ChoiceItem } from "@/types/editor";
import { Button } from "design-system/ui/button";
import { Switch } from "@/components/ui/switch";
import { useMobileBlockTextEdit } from "@/hooks/useMobileBlockTextEdit";
import { Textarea } from "design-system/ui/textarea";
import { cn } from "design-system/utils";
import { EDITOR_CONTROL_MUTED_ICON_CLASS, EDITOR_CONTROL_MUTED_TEXT_CLASS } from "@/lib/editor-block-layout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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

/** 모바일 선택지 내용 입력 영역 */
function choiceMobileFieldShellClass({ isIssue }: { isIssue?: boolean }) {
  return cn(
    "rounded-sm border border-border bg-background px-3 py-2 transition-colors",
    isIssue && "border-destructive",
  );
}

/** 선택지 내용 전용 텍스트 필드. 영역 고정 확장이 아니라 텍스트 줄 수에 따라 높이만 가변 확장 */
function ChoiceTextField({
  blockId,
  value,
  onChange,
  placeholder,
  className,
  onActivate,
}: {
  blockId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  onActivate?: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { readOnly, onContentFocus, onContentPointerDown } = useMobileBlockTextEdit(
    blockId,
    textareaRef,
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLTextAreaElement>) => {
      onActivate?.();
      onContentPointerDown(e);
    },
    [onActivate, onContentPointerDown],
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      onActivate?.();
      onContentFocus(e);
    },
    [onActivate, onContentFocus],
  );

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
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={handleFocus}
      onPointerDown={handlePointerDown}
      readOnly={readOnly}
      onInput={adjustHeight}
      placeholder={placeholder}
      rows={1}
      className={cn(
        "field-sizing-fixed w-full resize-none overflow-hidden rounded-none border-0 bg-transparent px-0 py-0 shadow-none align-middle focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent",
        className
      )}
      style={{ height: "fit-content" }}
    />
  );
}

function useChoiceRowIssueState(
  blockId: string,
  index: number,
  choice: ChoiceItem,
) {
  const issueFocus = useEditorStore((s) => s.issueFocus);
  const clearIssueFocus = useEditorStore((s) => s.clearIssueFocus);
  const isIssueFocusedChoice =
    issueFocus?.blockId === blockId && issueFocus?.choiceIndex === index;
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

  return {
    clearIssueFocus,
    isTextIssueFocused,
    isNextSceneIssueFocused,
  };
}

function ChoiceSceneSelect({
  value,
  onChange,
  sceneOptions,
  selectedSceneLabel,
  isSceneUnselected,
  isNextSceneIssueFocused,
  className,
  variant = "field",
}: {
  value: string;
  onChange: (nextScene: string) => void;
  sceneOptions: SceneOption[];
  selectedSceneLabel: string;
  isSceneUnselected: boolean;
  isNextSceneIssueFocused: boolean;
  className?: string;
  variant?: "field" | "table";
}) {
  const isTable = variant === "table";

  return (
    <div className={cn("relative min-w-0", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        title={selectedSceneLabel}
        className={cn(
          "w-full min-w-0 appearance-none text-body3_400 outline-none focus:outline-none focus:ring-0 focus:ring-offset-0",
          "overflow-hidden text-ellipsis whitespace-nowrap",
          isTable
            ? "h-8 rounded-md border-0 bg-transparent px-0 py-1 pr-2"
            : "h-9 rounded-sm border border-border bg-background py-0 pl-3 pr-8",
          isSceneUnselected ? EDITOR_CONTROL_MUTED_TEXT_CLASS : "text-foreground",
          isNextSceneIssueFocused &&
            (isTable ? "text-destructive" : "border-destructive text-destructive")
        )}
      >
        <option value="">장면 선택</option>
        {sceneOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {!isTable ? (
        <ICONS.chevronDown
          aria-hidden
          className={cn("pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2", EDITOR_CONTROL_MUTED_ICON_CLASS)}
        />
      ) : null}
    </div>
  );
}

function ChoiceRowMobile({
  blockId,
  index,
  choice,
  onUpdate,
  onRemove,
  sceneOptions = [],
  showBottomBorder = true,
  canRemove,
  isContentTouched,
  onSelectContent,
}: {
  blockId: string;
  index: number;
  choice: ChoiceItem;
  onUpdate: (patch: Partial<ChoiceItem>) => void;
  onRemove: () => void;
  sceneOptions: SceneOption[];
  showBottomBorder?: boolean;
  canRemove: boolean;
  isContentTouched: boolean;
  onSelectContent: () => void;
}) {
  const isAiMode = choice.isAiMode === true;
  const selectedSceneLabel =
    sceneOptions.find((opt) => opt.value === choice.nextScene)?.label ?? "장면 선택";
  const isSceneUnselected = !choice.nextScene?.trim();
  const { clearIssueFocus, isTextIssueFocused, isNextSceneIssueFocused } =
    useChoiceRowIssueState(blockId, index, choice);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 px-3 py-3",
        showBottomBorder && "border-b border-border",
      )}
      data-choice-id={choice.id}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "text-caption1_500",
            isContentTouched ? "text-primary" : "text-foreground-placeholder",
          )}
        >
          선택 {index + 1}
        </span>
        <div className="flex items-center gap-2">
          {choice.isPaid ? (
            <span className="inline-flex h-5 items-center rounded bg-primary/12 px-2 text-caption2_500 text-primary">
              유료
            </span>
          ) : null}
          {canRemove ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onRemove}
              className="shrink-0 text-foreground-placeholder hover:bg-destructive-container hover:text-destructive"
              aria-label="선택지 삭제"
            >
              <ICONS.trash2 className="h-4 w-4" aria-hidden />
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-caption1_400 text-foreground-placeholder">내용</span>
        {isAiMode ? (
          <div className="rounded-sm border border-primary/20 bg-primary/5 px-3 py-2">
            <span className="text-body3_500 text-primary">✨ AI 모드로 직접 대화</span>
          </div>
        ) : (
          <div
            className={choiceMobileFieldShellClass({
              isIssue: isTextIssueFocused,
            })}
            onPointerDown={onSelectContent}
          >
            <ChoiceTextField
              blockId={blockId}
              value={choice.text}
              onChange={(text) => {
                onUpdate({ text });
                if (isTextIssueFocused && text.trim()) {
                  clearIssueFocus();
                }
              }}
              placeholder="선택지 내용"
              onActivate={onSelectContent}
              className={isTextIssueFocused ? "text-destructive placeholder:text-destructive/60" : ""}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-caption1_400 text-foreground-placeholder">장면 전환</span>
        <ChoiceSceneSelect
          value={choice.nextScene}
          onChange={(nextScene) => {
            onUpdate({ nextScene });
            if (isNextSceneIssueFocused && nextScene.trim()) {
              clearIssueFocus();
            }
          }}
          sceneOptions={sceneOptions}
          selectedSceneLabel={selectedSceneLabel}
          isSceneUnselected={isSceneUnselected}
          isNextSceneIssueFocused={isNextSceneIssueFocused}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-caption1_400 text-foreground-placeholder">유료 전환</span>
        <Switch
          checked={choice.isPaid}
          onCheckedChange={(checked) => onUpdate({ isPaid: checked })}
          aria-label="유료 전환"
        />
      </div>
    </div>
  );
}

function ChoiceRowDesktop({
  blockId,
  index,
  choice,
  onUpdate,
  onRemove,
  sceneOptions = [],
  showBottomBorder = true,
}: {
  blockId: string;
  index: number;
  choice: ChoiceItem;
  onUpdate: (patch: Partial<ChoiceItem>) => void;
  onRemove: () => void;
  sceneOptions: SceneOption[];
  showBottomBorder?: boolean;
}) {
  const isAiMode = choice.isAiMode === true;
  const selectedSceneLabel =
    sceneOptions.find((opt) => opt.value === choice.nextScene)?.label ?? "장면 선택";
  const isSceneUnselected = !choice.nextScene?.trim();
  const { clearIssueFocus, isTextIssueFocused, isNextSceneIssueFocused } =
    useChoiceRowIssueState(blockId, index, choice);

  return (
    <div
      className={cn(
        "group/choice-row flex min-h-9 items-stretch",
        showBottomBorder && "border-b border-border",
      )}
      data-choice-id={choice.id}
    >
      <div className="flex min-h-9 w-[80px] shrink-0 self-stretch items-center border-r border-border px-3 py-0 text-body3_400 text-foreground-placeholder">
        선택 {index + 1}
      </div>
      <div className="flex min-h-9 min-w-[200px] flex-1 self-stretch items-center border-r border-border px-3 py-1">
        {isAiMode ? (
          <span className="text-body3_500 text-primary">✨ AI 모드로 직접 대화</span>
        ) : (
          <ChoiceTextField
            blockId={blockId}
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
      </div>
      <div className="flex min-h-9 w-[200px] min-w-[160px] max-w-[200px] shrink-0 self-stretch items-center border-r border-border px-3 py-0">
        <ChoiceSceneSelect
          value={choice.nextScene}
          onChange={(nextScene) => {
            onUpdate({ nextScene });
            if (isNextSceneIssueFocused && nextScene.trim()) {
              clearIssueFocus();
            }
          }}
          sceneOptions={sceneOptions}
          selectedSceneLabel={selectedSceneLabel}
          isSceneUnselected={isSceneUnselected}
          isNextSceneIssueFocused={isNextSceneIssueFocused}
          variant="table"
          className="w-full"
        />
      </div>
      <div className="flex min-h-9 w-[120px] min-w-[100px] max-w-[120px] shrink-0 self-stretch items-center justify-between gap-2 px-3 py-0">
        <Switch
          checked={choice.isPaid}
          onCheckedChange={(checked) => onUpdate({ isPaid: checked })}
          aria-label="유료 전환"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          className="shrink-0 text-foreground-placeholder opacity-0 transition-opacity lg:group-hover/choice-row:opacity-100 lg:group-focus-within/choice-row:opacity-100 lg:hover:bg-destructive-container lg:hover:text-destructive"
          aria-label="선택지 삭제"
        >
          <ICONS.trash2 className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </div>
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
  }, [choices, onChange]);

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

  const handleAddAiChoice = useCallback(() => {
    const hasAi = choices.some((c) => c.isAiMode);
    if (hasAi) return;
    const newChoice = createAiChoice();
    onChange([...choices, newChoice]);
  }, [choices, onChange]);

  const hasAiChoice = choices.some((c) => c.isAiMode);
  const isAtMaxChoices = choices.length >= 4;
  const canRemoveChoice = choices.length > 2;
  const focusBlockId = useEditorStore((s) => s.focusBlockId);
  const issueFocus = useEditorStore((s) => s.issueFocus);
  const setMobileFocusChoiceIndex = useEditorStore((s) => s.setMobileFocusChoiceIndex);
  const isBlockFocused = focusBlockId === blockId;
  const [activeChoiceId, setActiveChoiceId] = useState<string | null>(null);

  useEffect(() => {
    if (!isBlockFocused) {
      setActiveChoiceId(null);
      setMobileFocusChoiceIndex(null);
      return;
    }
    if (
      issueFocus?.blockId === blockId &&
      issueFocus.choiceIndex != null &&
      choices[issueFocus.choiceIndex]
    ) {
      setActiveChoiceId(choices[issueFocus.choiceIndex].id);
      setMobileFocusChoiceIndex(issueFocus.choiceIndex);
    }
  }, [isBlockFocused, issueFocus, blockId, choices, setMobileFocusChoiceIndex]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-border bg-background",
        className
      )}
      data-block-id={blockId}
    >
      {/* 모바일: 카드형 스택 */}
      <div className="lg:hidden">
        {choices.map((choice, index) => (
          <ChoiceRowMobile
            blockId={blockId}
            key={choice.id}
            index={index}
            choice={choice}
            onUpdate={(patch) => handleUpdate(index, patch)}
            onRemove={() => handleRemove(index)}
            sceneOptions={sceneOptions}
            showBottomBorder={index < choices.length - 1}
            canRemove={canRemoveChoice}
            isContentTouched={isBlockFocused && activeChoiceId === choice.id}
            onSelectContent={() => {
              setActiveChoiceId(choice.id);
              setMobileFocusChoiceIndex(index);
            }}
          />
        ))}
      </div>

      {/* 데스크톱: 테이블 */}
      <div className="hidden lg:block">
        <div className="flex min-h-8 border-b border-border bg-muted/80 text-caption1_500 text-foreground-placeholder">
          <div className="flex w-20 shrink-0 items-center border-r border-border px-3">
            선택
          </div>
          <div className="flex min-w-[200px] flex-1 items-center border-r border-border px-3">
            내용
          </div>
          <div className="flex w-[200px] min-w-[160px] max-w-[200px] shrink-0 items-center border-r border-border px-3">
            장면 전환
          </div>
          <div className="flex w-[120px] min-w-[100px] max-w-[120px] shrink-0 items-center px-3">
            유료 전환
          </div>
        </div>
        {choices.map((choice, index) => (
          <ChoiceRowDesktop
            blockId={blockId}
            key={choice.id}
            index={index}
            choice={choice}
            onUpdate={(patch) => handleUpdate(index, patch)}
            onRemove={() => handleRemove(index)}
            sceneOptions={sceneOptions}
            showBottomBorder={index < choices.length - 1 || !isAtMaxChoices}
          />
        ))}
      </div>

      {!isAtMaxChoices && (
        <div className="flex h-9 items-center justify-start border-t border-border px-1 py-2 lg:border-t-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="sm">
                선택지 추가
                <Icon icon={ICONS.chevronDown} size="md" position="inline-end" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-fit">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleAddNormalChoice}>
                  선택지 추가
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleAddAiChoice}
                  disabled={hasAiChoice}
                  className={cn(!hasAiChoice && "text-primary")}
                >
                  <Icon icon={ICONS.sparkles} size="md" />
                  AI 모드로 직접 대화
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
