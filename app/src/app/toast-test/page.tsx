"use client";

import React from "react";
import { useToast } from "@/store/useToastStore";
import { Button } from "@/components/ui/button";

/**
 * 토스트 기획서 정책 테스트 페이지
 * - Type A: 텍스트만
 * - Type B: 텍스트 + 닫기(X)
 * - Type C: 텍스트 + 액션 버튼(Primary)
 */
export default function ToastTestPage() {
  const { toast } = useToast();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-bold text-on-surface-10">토스트 정책 테스트</h1>
      <p className="text-sm text-on-surface-30">
        하단 40px, 토스트 간격 16px, 최대 3개 · 3~5초 자동 닫힘
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          variant="outline"
          onClick={() =>
            toast({
              message: "Type A — 메시지만 노출되는 기본형 토스트입니다.",
              variant: "default",
            })
          }
        >
          Type A (기본형)
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              message: "Type B — 우측 X 버튼으로 닫을 수 있습니다.",
              variant: "withClose",
            })
          }
        >
          Type B (닫기형)
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              message: "Type C — 액션 버튼을 누르면 닫힙니다.",
              variant: "withAction",
              actionLabel: "확인",
              onAction: () => {
                console.log("액션 클릭");
              },
            })
          }
        >
          Type C (액션형)
        </Button>
      </div>
      <Button
        variant="secondary"
        onClick={() => {
          toast({ message: "토스트 1", variant: "default" });
          setTimeout(() => toast({ message: "토스트 2", variant: "withClose" }), 100);
          setTimeout(() => toast({ message: "토스트 3", variant: "withAction", actionLabel: "확인" }), 200);
          setTimeout(
            () => toast({ message: "4번째 토스트 — 최대 3개이므로 1번이 사라집니다.", variant: "default" }),
            300
          );
        }}
      >
        최대 3개 테스트 (연속 발동)
      </Button>
    </div>
  );
}
