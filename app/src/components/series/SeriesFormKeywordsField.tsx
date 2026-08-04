"use client";

import { useId } from "react";

import { FormFieldLabel, formFieldAriaDescribedBy } from "@/components/ui/field-label";
import { Input, InputGroup, InputHypertext } from "@/components/ui/input";
import { Tag } from "@/components/ui/tag";

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
  const inputId = useId().replace(/:/g, "");

  return (
    <div className="flex flex-col gap-1">
      <FormFieldLabel title={title} subtitle={subtitle} inputId={inputId} />
      <InputGroup className="mt-1">
        <Input
          ref={inputRef}
          id={inputId}
          aria-describedby={formFieldAriaDescribedBy(inputId, Boolean(subtitle))}
          type="text"
          size="xl"
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
        />
        <div className="flex w-full items-start justify-end gap-2">
          {keywordList.length > 0 ? (
            <div className="flex min-w-0 flex-1 flex-wrap gap-2">
              {keywordList.map((keyword) => (
                <Tag key={keyword} onDismiss={() => onRemoveKeyword(keyword)}>
                  #{keyword}
                </Tag>
              ))}
            </div>
          ) : null}
          <InputHypertext
            count={keywordInput.length}
            max={maxLength}
            variant={error ? "error" : "default"}
            className="w-fit shrink-0"
          />
        </div>
      </InputGroup>
    </div>
  );
}
