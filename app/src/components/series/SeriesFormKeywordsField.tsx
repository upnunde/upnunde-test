"use client";

import { Title1 } from "@/components/ui/title1";
import { Input } from "@/components/ui/input";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";

interface SeriesFormKeywordsFieldProps {
  title: string;
  subtitle: string;
  keywordInput: string;
  keywordList: readonly string[];
  placeholder: string;
  maxLength: number;
  error: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isComposing: boolean;
  onKeywordInputChange: (value: string) => void;
  onComposingChange: (composing: boolean) => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (keyword: string) => void;
}

/** 캐릭터 해시태그 필드와 동일한 입력·Tag 스택 패턴 */
export function SeriesFormKeywordsField({
  title,
  subtitle,
  keywordInput,
  keywordList,
  placeholder,
  maxLength,
  error,
  inputRef,
  isComposing,
  onKeywordInputChange,
  onComposingChange,
  onAddKeyword,
  onRemoveKeyword,
}: SeriesFormKeywordsFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <Title1 text={title} variant="title-subtitle" subtitleText={subtitle} />
      <div className="flex flex-col items-start justify-center gap-2">
        <Input
          ref={inputRef}
          type="text"
          maxLength={maxLength}
          value={keywordInput}
          onChange={(e) => onKeywordInputChange(e.target.value)}
          onCompositionStart={() => onComposingChange(true)}
          onCompositionEnd={() => onComposingChange(false)}
          onKeyDown={(e) => {
            if (!isComposing && (e.key === "Enter" || e.key === ",")) {
              e.preventDefault();
              onAddKeyword();
            } else if (e.key === "Backspace" && !keywordInput && keywordList.length > 0) {
              e.preventDefault();
              onRemoveKeyword(keywordList[keywordList.length - 1]!);
            }
          }}
          placeholder={placeholder}
          aria-invalid={error}
          className={cn(
            "h-[42px] rounded-md border bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30",
            error ? "border-destructive focus-visible:ring-destructive/40" : "border-border-10",
          )}
        />
        <div className="inline-flex w-full items-start justify-end gap-2">
          {keywordList.length > 0 ? (
            <div className="flex min-w-0 flex-1 flex-wrap gap-2">
              {keywordList.map((keyword) => (
                <Tag key={keyword} onDismiss={() => onRemoveKeyword(keyword)}>
                  #{keyword}
                </Tag>
              ))}
            </div>
          ) : null}
          <div className="w-fit shrink-0 text-right text-xs font-normal leading-4 tabular-nums text-on-surface-30">
            {keywordInput.length}/{maxLength}
          </div>
        </div>
      </div>
    </div>
  );
}
