"use client";

import { Input, InputGroup, InputHypertext } from "@/components/ui/input";
import { CONFIRM_INPUT_PHRASE } from "@/lib/deleteConfirmPhrase";
import { cn } from "design-system/utils";

export interface ModalConfirmPhraseFieldProps {
  inputId: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  className?: string;
}

/** 모달 푸터 확인 입력 블록 — 안내 문구 + 입력창 + 글자수 카운터 */
export function ModalConfirmPhraseField({
  inputId,
  value,
  onChange,
  maxLength = 50,
  className,
}: ModalConfirmPhraseFieldProps) {
  return (
    <div className={cn("w-full bg-background px-6 py-2", className)}>
      <div className="flex flex-col gap-2">
        <p className="text-body3_500 text-foreground-muted">
          위 내용에 동의하시면 <span className="text-primary">{`‘${CONFIRM_INPUT_PHRASE}’`}</span>를 입력해
          주세요.
        </p>
        <InputGroup>
          <Input
            id={inputId}
            type="text"
            size="lg"
            autoComplete="off"
            maxLength={maxLength}
            placeholder={CONFIRM_INPUT_PHRASE}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <InputHypertext count={value.length} max={maxLength} />
        </InputGroup>
      </div>
    </div>
  );
}
