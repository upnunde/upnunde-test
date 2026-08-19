"use client";

import { useCallback, useState } from "react";
import { rewriteWorldviewPrompt } from "@/lib/rewrite-worldview-prompt";
import { useToast } from "@/store/useToastStore";

export function useWorldviewPromptAutocomplete(options: {
  value: string;
  maxLength: number;
  onApply: (next: string) => void;
}) {
  const { value, maxLength, onApply } = options;
  const { toast } = useToast();
  const [isRewriting, setIsRewriting] = useState(false);

  const handleAutocomplete = useCallback(async () => {
    const source = value.trim();
    if (!source) {
      toast({
        message: "자동완성할 내용을 먼저 작성해 주세요.",
        variant: "withClose",
      });
      return;
    }
    if (isRewriting) return;

    setIsRewriting(true);
    try {
      const next = await rewriteWorldviewPrompt(source, maxLength);
      onApply(next);
      toast({
        message: "세계관 프롬프트를 구성에 맞게 정리했어요.",
        variant: "default",
      });
    } catch {
      toast({
        message: "자동완성에 실패했어요. 잠시 후 다시 시도해 주세요.",
        variant: "withClose",
      });
    } finally {
      setIsRewriting(false);
    }
  }, [isRewriting, maxLength, onApply, toast, value]);

  return { isRewriting, handleAutocomplete };
}
