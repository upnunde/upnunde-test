 "use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { Button } from "@/components/ui/button";

export interface EditorSubHeaderProps {
  /** 제목 (예: "에피소드 제목") */
  title?: string;
}

export function EditorSubHeader({ title = "에피소드 제목" }: EditorSubHeaderProps) {
  const router = useRouter();
  const blocks = useEditorStore((s) => s.blocks);
  const currentView = useEditorStore((s) => s.currentView);
  const setCurrentView = useEditorStore((s) => s.setCurrentView);

  const hasValidationIssues = useMemo(() => {
    for (const block of blocks) {
      if (["scene", "top_desc", "text", "direction"].includes(block.type) && !block.content?.trim()) {
        return true;
      }

      if (block.type === "choice") {
        const choices = Array.isArray(block.data?.choices) ? block.data.choices : [];
        if (choices.length === 0) return true;
        for (const c of choices) {
          if (!c.text?.trim() || !c.nextScene?.trim()) return true;
        }
      }
    }

    const eventStarts = blocks.filter((b) => b.type === "event").length;
    const eventEnds = blocks.filter((b) => b.type === "event_end").length;
    return eventStarts !== eventEnds;
  }, [blocks]);

  const handleBack = () => {
    if (currentView === "editor") setCurrentView("form");
  };

  const handleSubmit = () => {
    // TODO: 실제 등록 로직 연동 후 에피소드 목록 화면으로 이동
    router.push("/series/1/episodes");
  };

  return (
    <header className="mx-auto flex h-16 w-full min-w-[800px] shrink-0 items-center justify-between px-10">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleBack}
          className="h-9 w-9 shrink-0 rounded-full"
          aria-label="뒤로 가기"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} />
        </Button>
        <h1 className="text-2xl font-extrabold text-on-surface-10">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" className="h-10 shadow-none bg-slate-50">
          임시저장
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={hasValidationIssues}
          className="h-10 shadow-none bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/40 disabled:hover:bg-primary/40"
          onClick={handleSubmit}
        >
          등록하기
        </Button>
      </div>
    </header>
  );
}
