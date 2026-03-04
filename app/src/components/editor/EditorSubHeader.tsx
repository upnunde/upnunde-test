 "use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEditorStore } from "@/store/useEditorStore";
import { Button } from "@/components/ui/button";

export interface EditorSubHeaderProps {
  /** 제목 (예: "에피소드 제목") */
  title?: string;
}

export function EditorSubHeader({ title = "에피소드 제목" }: EditorSubHeaderProps) {
  const router = useRouter();
  const currentView = useEditorStore((s) => s.currentView);
  const setCurrentView = useEditorStore((s) => s.setCurrentView);

  const handleBack = () => {
    if (currentView === "editor") setCurrentView("form");
  };

  const handleSubmit = () => {
    // TODO: 실제 등록 로직 연동 후 에피소드 목록 화면으로 이동
    router.push("/series/1/episodes");
  };

  return (
    <header className="mx-auto flex h-20 w-full min-w-[800px] shrink-0 items-center justify-between px-10">
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
        <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" className="h-10 shadow-none bg-slate-50">
          임시저장
        </Button>
        <Button
          type="button"
          size="sm"
          className="h-10 shadow-none bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleSubmit}
        >
          등록하기
        </Button>
      </div>
    </header>
  );
}
