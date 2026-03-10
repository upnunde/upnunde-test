"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/Header/Header";
import { EditorSubHeader } from "@/components/editor/EditorSubHeader";
import EditorBody from "@/components/editor/EditorBody";
import { SceneNavigation } from "@/components/editor/SceneNavigation";
import { PreviewScreen } from "@/components/editor/PreviewScreen";
import { EpisodeForm } from "@/components/episode/EpisodeForm";
import { useEditorStore } from "@/store/useEditorStore";
import { useSceneClickHandler } from "@/hooks/useSceneClickHandler";
import { Button } from "@/components/ui/button";

function EditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = useEditorStore((s) => s.currentView);
  const setCurrentView = useEditorStore((s) => s.setCurrentView);
  const handleSceneClick = useSceneClickHandler();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isSceneSidebarCollapsed, setIsSceneSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (searchParams.get("view") === "form") {
      setCurrentView("form");
      router.replace("/editor");
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
          <div className="flex-1 overflow-y-auto flex flex-col items-center py-8 gap-3">
            <EpisodeForm />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* 1. Global Top Header (Logo, User Avatar) - Full Width */}
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />

      {/* 2. Main Flex Container */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* 2-1. Left Sidebar (Scene List) - Fixed Width, Full Height */}
        <aside
          className={
            isSceneSidebarCollapsed
              ? "w-fit shrink-0 border-r border-slate-200 bg-white overflow-y-auto px-2"
              : "w-[240px] shrink-0 border-r border-slate-200 bg-white overflow-y-auto"
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
          {/* 2-2-a. Sub Header (Back, Title, Actions) */}
          <div className="w-full border-b border-slate-200">
            <EditorSubHeader title="에피소드 에디터" />
          </div>

          {/* Container: fixed height, no scroll — only inner content scrolls */}
          <div className="flex flex-1 w-full min-h-0 overflow-hidden bg-white justify-center items-start">
            {/* Left Area: bordered panel fixed in view, only inner content scrolls */}
            <div className="flex flex-1 min-h-0 h-full w-full flex-col border-r border-slate-200 overflow-hidden">
              <div className="py-10 px-0 flex-1 min-h-0 overflow-y-auto">
                <EditorBody />
              </div>
            </div>

            {/* Right Area: Phone Preview (Fixed size, sticky to stay visible when scrolling) */}
            <div className="shrink-0 sticky top-10 h-full ml-auto p-10 flex flex-col justify-start items-center">
              <div className="w-[300px] h-[652px] relative bg-slate-100 rounded-[2rem] outline outline-8 outline-slate-800 overflow-hidden flex flex-col">
                <PreviewScreen />
              </div>
            </div>
          </div>
        </main>

        {/* 2-3. Profile modal portal target (DOM order: 프로필 아이콘 바로 아래 위치용) */}
        <div id="profile-modal-portal" className="absolute left-0 top-0 w-0 h-0 overflow-visible" aria-hidden />
      </div>
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
