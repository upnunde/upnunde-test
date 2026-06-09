"use client";

import { Input } from "@/components/ui/input";
import { CONFIRM_INPUT_PHRASE } from "@/lib/deleteConfirmPhrase";
import { cn } from "@/lib/utils";

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
    <div className={cn("w-full bg-surface-10 px-my-24 py-my-8", className)}>
      <div className="flex flex-col gap-my-8">
        <p className="text-body3_500 text-on-surface-20">
          위 내용에 동의하시면 <span className="text-primary">{`‘${CONFIRM_INPUT_PHRASE}’`}</span>를 입력해
          주세요.
        </p>
        <div className="flex flex-col items-stretch gap-my-8 rounded">
          <Input
            id={inputId}
            type="text"
            autoComplete="off"
            maxLength={maxLength}
            placeholder={CONFIRM_INPUT_PHRASE}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="px-my-16 text-body1_400 shadow-none placeholder:text-on-surface-disabled"
          />
          <div className="inline-flex items-center justify-end gap-my-8 self-stretch">
            <p className="text-right text-caption1_400 text-on-surface-30">
              {value.length}/{maxLength}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

