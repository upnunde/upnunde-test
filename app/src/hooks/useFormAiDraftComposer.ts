"use client";

import { useCallback, useState } from "react";
import { useToast } from "@/store/useToastStore";

export interface FormAiDraftResult<T> {
  draft: T;
  usedFallback: boolean;
}

interface UseFormAiDraftComposerOptions<T> {
  generate: (brief: string) => Promise<FormAiDraftResult<T>>;
  onApply: (draft: T) => void;
  successMessage?: string;
  fallbackMessage?: string;
  errorMessage?: string;
}

export function useFormAiDraftComposer<T>({
  generate,
  onApply,
  successMessage = "초안을 채웠어요.",
  fallbackMessage = "AI 설정이 없어 임시 규칙으로 채웠어요.",
  errorMessage = "초안 생성에 실패했어요.",
}: UseFormAiDraftComposerOptions<T>) {
  const { toast } = useToast();
  const [briefPrompt, setBriefPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(async () => {
    const prompt = briefPrompt.trim();
    if (!prompt || isGenerating) return;

    setIsGenerating(true);
    try {
      const { draft, usedFallback } = await generate(prompt);
      onApply(draft);
      setBriefPrompt("");
      toast({
        message: usedFallback ? fallbackMessage : successMessage,
        variant: "default",
      });
    } catch (error) {
      toast({
        message: error instanceof Error ? error.message : errorMessage,
        variant: "withClose",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [
    briefPrompt,
    errorMessage,
    fallbackMessage,
    generate,
    isGenerating,
    onApply,
    successMessage,
    toast,
  ]);

  return {
    briefPrompt,
    setBriefPrompt,
    isGenerating,
    handleGenerate,
  };
}
