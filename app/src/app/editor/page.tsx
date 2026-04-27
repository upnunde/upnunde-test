"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/Header/Header";
import { EditorScriptBootstrap } from "@/components/editor/EditorScriptBootstrap";
import { EditorSubHeader } from "@/components/editor/EditorSubHeader";
import EditorBody from "@/components/editor/EditorBody";
import { SceneNavigation } from "@/components/editor/SceneNavigation";
import { PreviewScreen } from "@/components/editor/PreviewScreen";
import { IPhone15ProFrame } from "@/components/preview/IPhone15ProFrame";
import { EpisodeForm } from "@/components/episode/EpisodeForm";
import { useEditorStore } from "@/store/useEditorStore";
import { useSceneClickHandler } from "@/hooks/useSceneClickHandler";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

function EditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = useEditorStore((s) => s.currentView);
  const setCurrentView = useEditorStore((s) => s.setCurrentView);
  const handleSceneClick = useSceneClickHandler();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isSceneSidebarCollapsed, setIsSceneSidebarCollapsed] = useState(false);
  const [isRecreateModalOpen, setIsRecreateModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("view") === "form") {
      setCurrentView("form");
      router.replace("/editor");
      return;
    }
    // 에피소드 목록에서 `?episode=` 로 진입 시 이전 탭에서 남은 `form` 뷰를 덮어씀
    if (searchParams.get("episode") != null) {
      setCurrentView("editor");
    }
  }, [searchParams, setCurrentView, router]);

  if (currentView === "form") {
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-white">
        <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
        {/* 에피소드 생성 서브 헤더: 뒤로가기 + 제목 */}
        <header className="flex h-16 shrink-0 items-center justify-center border-b border-slate-200 bg-white px-6 py-0">
          <div className="flex w-full max-w-[1200px] min-w-[800px] items-center justify-start gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => router.push("/series/1/episodes")}
              className="h-9 w-9 shrink-0 rounded-full border-slate-200 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              aria-label="뒤로 가기"
            >
              <ChevronLeft className="h-5 w-5 text-slate-600" strokeWidth={2} />
            </Button>
            <h1 className="text-2xl font-extrabold text-on-surface-10">에피소드 생성</h1>
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
          <div className="flex min-h-0 flex-1 flex-col items-center gap-3 overflow-y-auto overscroll-none py-8 px-5">
            <EpisodeForm />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {/* 1. Global Top Header (Logo, User Avatar) - Full Width */}
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />

      {/* 2. Main Flex Container */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* 2-1. Left Sidebar (Scene List) - Fixed Width, Full Height */}
        <aside
          className={
            isSceneSidebarCollapsed
              ? "relative z-20 w-fit shrink-0 border-r border-slate-200 bg-white overflow-visible px-2"
              : "w-[240px] shrink-0 border-r border-slate-200 bg-white overflow-y-auto overscroll-none"
          }
        >
          <SceneNavigation
            onSceneClick={handleSceneClick}
            collapsed={isSceneSidebarCollapsed}
            onToggleCollapsed={() =>
              setIsSceneSidebarCollapsed((prev) => !prev)
            }
          />
        </aside>

        {/* 2-2. Right Content Area (Sub-header + Editor + Preview) */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <EditorScriptBootstrap routeKey={searchParams.toString()} />
          {/* 2-2-a. Sub Header (Back, Title, Actions) */}
          <div className="w-full border-b border-slate-200">
            <EditorSubHeader
              key={searchParams.size === 0 ? "editor" : searchParams.toString()}
              title="에피소드 에디터"
              onRecreate={() => setIsRecreateModalOpen(true)}
            />
          </div>

          {/* Container: fixed height, no scroll — only inner content scrolls */}
          <div className="flex flex-1 w-full min-h-0 overflow-hidden bg-white justify-center items-start">
            {/* Left Area: bordered panel fixed in view, only inner content scrolls */}
            <div className="flex flex-1 min-h-0 h-full w-full flex-col border-r border-slate-200 overflow-hidden">
              <div className="py-10 px-0 flex-1 min-h-0 overflow-y-auto overscroll-none">
                <EditorBody />
              </div>
            </div>

            {/* Right Area: Phone Preview (Fixed size, sticky to stay visible when scrolling) */}
            <div className="shrink-0 sticky top-10 h-full ml-auto p-10 flex flex-col justify-start items-center">
              <IPhone15ProFrame>
                <PreviewScreen />
              </IPhone15ProFrame>
            </div>
          </div>
        </main>

        {/* 2-3. Profile modal portal target (DOM order: 프로필 아이콘 바로 아래 위치용) */}
        <div id="profile-modal-portal" className="absolute left-0 top-0 w-0 h-0 overflow-visible" aria-hidden />
      </div>
      <Dialog open={isRecreateModalOpen} onOpenChange={setIsRecreateModalOpen}>
        <DialogContent
          className="h-[min(90vh,calc(100vh-80px))] w-[min(92vw,760px)] max-w-[760px] min-w-[560px] overflow-y-auto border-0 bg-transparent p-0 shadow-none"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">에피소드 생성</DialogTitle>
          <EpisodeForm
            onCancel={() => setIsRecreateModalOpen(false)}
            onConverted={() => setIsRecreateModalOpen(false)}
            containerClassName="max-w-[760px] min-w-[560px]"
            stickyFooter
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={null}>
      <EditorInner />
    </Suspense>
  );
}
