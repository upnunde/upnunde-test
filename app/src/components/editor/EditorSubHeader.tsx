 "use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { Button } from "@/components/ui/button";
import { Snackbar } from "@/components/episode/Snackbar";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export interface EditorSubHeaderProps {
  /** 제목 (예: "에피소드 제목") */
  title?: string;
  /** 다시 만들기 클릭 시 동작 (없으면 기본: 폼 화면 전환) */
  onRecreate?: () => void;
}

export function EditorSubHeader({ title = "에피소드 제목", onRecreate }: EditorSubHeaderProps) {
  const router = useRouter();
  const blocks = useEditorStore((s) => s.blocks);
  const currentView = useEditorStore((s) => s.currentView);
  const setCurrentView = useEditorStore((s) => s.setCurrentView);
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [isBackConfirmOpen, setIsBackConfirmOpen] = useState(false);

  const blocksSnapshot = useMemo(() => JSON.stringify(blocks), [blocks]);

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

  const goToEpisodeList = () => {
    if (currentView === "editor") {
      router.push("/series/1/episodes");
      return;
    }
    setCurrentView("form");
  };

  const handleBack = () => {
    if (hasChangesSinceSave) {
      setIsBackConfirmOpen(true);
      return;
    }
    goToEpisodeList();
  };

  /** 변경 없음일 때 '나가기' — 에피소드 목록(관리) 화면으로 이동 (에디터 폼 뒤로가기와 동일 경로) */
  const handleExitToEpisodeList = () => {
    router.push("/series/1/episodes");
  };

  const handleSubmit = () => {
    // TODO: 실제 등록 로직 연동 후 에피소드 목록 화면으로 이동
    router.push("/series/1/episodes");
  };

  const handleTemporarySave = () => {
    // TODO: 실제 임시저장 API 연동 시 저장 성공 시점에 snapshot 갱신
    setSavedSnapshot(blocksSnapshot);
    setSnackbar({ open: true, message: "임시저장을 완료했습니다" });
  };
  const handleRecreate = () => {
    if (onRecreate) {
      onRecreate();
      return;
    }
    setCurrentView("form");
  };

  const hasChangesSinceSave = savedSnapshot == null || savedSnapshot !== blocksSnapshot;

  return (
    <>
      <header className="mx-auto flex h-16 w-full min-w-[800px] shrink-0 items-center justify-between px-5">
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 shadow-none bg-white"
            onClick={handleRecreate}
          >
            다시 만들기
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 shadow-none bg-white"
            onClick={hasChangesSinceSave ? handleTemporarySave : handleExitToEpisodeList}
          >
            {hasChangesSinceSave ? "임시저장" : "나가기"}
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
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={2000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
      <Dialog open={isBackConfirmOpen} onOpenChange={setIsBackConfirmOpen}>
        <DialogContent className="w-[min(92vw,420px)] max-w-[420px] border border-slate-200 bg-white p-5 shadow-none">
          <div className="space-y-2">
            <p className="text-base font-semibold text-on-surface-10">
              아직 작업을 저장하지 않았어요.
            </p>
            <p className="text-sm text-on-surface-20">
              정말 나가시겠어요? 임시저장 후 나갈 수 있어요.
            </p>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsBackConfirmOpen(false)}>
              취소
            </Button>
            <Button
              type="button"
              onClick={() => {
                handleTemporarySave();
                setIsBackConfirmOpen(false);
                goToEpisodeList();
              }}
            >
              임시저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
