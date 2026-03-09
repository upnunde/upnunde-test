"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResourceBanner } from "./ResourceBanner";
import { ResourceSection } from "./ResourceSection";
import { CharacterCard } from "./cards/CharacterCard";
import { ImageCard } from "./cards/ImageCard";
import { MediaCard } from "./cards/MediaCard";
import { AddResourceSlot } from "./cards/AddResourceSlot";
import { BgmSection } from "./bgm/BgmSection";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal";
import type {
  ResourceCategory,
  CharacterResource,
  ImageResource,
  MediaResource,
  BgmResource,
} from "@/types/resource";
import { PreviewScreen } from "@/components/editor/PreviewScreen";
import type { ScriptBlock } from "@/types/editor";

/** 신규 등록/상세 라우트 (정책 5, 3) - 실제 경로는 프로젝트에 맞게 변경 */
const ROUTES = {
  character: {
    new: (id: string) => `/series/${id}/resources/characters/new`,
    detail: (id: string, itemId: string) => `/series/${id}/characters/${itemId}`,
  },
  background: {
    new: (id: string) => `/series/${id}/resources/backgrounds/new`,
    detail: (id: string, itemId: string) => `/series/${id}/backgrounds/${itemId}`,
  },
  scene: {
    new: (id: string) => `/series/${id}/resources/scenes/new`,
    detail: (id: string, itemId: string) => `/series/${id}/scenes/${itemId}`,
  },
  media: {
    new: (id: string) => `/series/${id}/resources/media/new`,
    detail: (id: string, itemId: string) => `/series/${id}/media/${itemId}`,
  },
  gallery: {
    new: (id: string) => `/series/${id}/resources/gallery/new`,
    detail: (id: string, itemId: string) => `/series/${id}/gallery/${itemId}`,
  },
} as const;

const MOCK_HAS_RESOURCES = true;

const initialCharacters: CharacterResource[] = MOCK_HAS_RESOURCES
  ? [{ id: "1", name: "name", imageUrl: "https://placehold.co/80x80?text=C" }]
  : [];
const initialBackgrounds: ImageResource[] = MOCK_HAS_RESOURCES
  ? [
      { id: "1", name: "배경1", imageUrl: "https://placehold.co/120x80?text=BG1" },
      { id: "2", name: "배경2", imageUrl: "https://placehold.co/120x80?text=BG2" },
    ]
  : [];
const initialScenes: ImageResource[] = MOCK_HAS_RESOURCES
  ? Array.from({ length: 6 }, (_, i) => ({
      id: String(i + 1),
      name: `연출${i + 1}`,
      imageUrl: `https://placehold.co/80x80?text=S${i + 1}`,
    }))
  : [];
const initialMedia: MediaResource[] = MOCK_HAS_RESOURCES
  ? [
      {
        id: "1",
        name: "영상1",
        thumbnailUrl: "https://placehold.co/120x80?text=V1",
        duration: "00:00",
      },
      {
        id: "2",
        name: "영상2",
        thumbnailUrl: "https://placehold.co/120x80?text=V2",
        duration: "00:00",
      },
    ]
  : [];
const initialGallery: ImageResource[] = MOCK_HAS_RESOURCES
  ? Array.from({ length: 8 }, (_, i) => ({
      id: String(i + 1),
      name: `갤러리${i + 1}`,
      imageUrl: `https://placehold.co/80x80?text=G${i + 1}`,
    }))
  : [];
/** 3~5분 랜덤 duration "MM:SS" */
function randomBgmDuration(): string {
  const totalSeconds = 180 + Math.floor(Math.random() * 121); // 180~300초 (3:00~5:00)
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const initialBgm: BgmResource[] = MOCK_HAS_RESOURCES
  ? [
      // 판타지
      { id: "1", title: "빛의 성가", duration: randomBgmDuration() },
      { id: "2", title: "마법의 숲", duration: randomBgmDuration() },
      { id: "3", title: "용자의 여정", duration: randomBgmDuration() },
      { id: "4", title: "신성한 유적", duration: randomBgmDuration() },
      // 호러
      { id: "5", title: "침묵의 복도", duration: randomBgmDuration() },
      { id: "6", title: "낡은 저택", duration: randomBgmDuration() },
      { id: "7", title: "속삭이는 그림자", duration: randomBgmDuration() },
      { id: "8", title: "붉은 달밤", duration: randomBgmDuration() },
      // 로맨스
      { id: "9", title: "봄날의 고백", duration: randomBgmDuration() },
      { id: "10", title: "달빛 산책", duration: randomBgmDuration() },
      { id: "11", title: "두근두근 러브송", duration: randomBgmDuration() },
      { id: "12", title: "별빛 약속", duration: randomBgmDuration() },
    ]
  : [];

export function ResourceManagementPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const seriesId = typeof params?.id === "string" ? params.id : "";
  const showPreview = searchParams.get("preview") === "1";

  const [characters, setCharacters] = useState<CharacterResource[]>(initialCharacters);
  const [backgrounds, setBackgrounds] = useState<ImageResource[]>(initialBackgrounds);
  const [scenes, setScenes] = useState<ImageResource[]>(initialScenes);
  const [media, setMedia] = useState<MediaResource[]>(initialMedia);
  const [gallery, setGallery] = useState<ImageResource[]>(initialGallery);
  const [bgm, setBgm] = useState<BgmResource[]>(initialBgm);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    category: ResourceCategory;
    itemName: string;
    onConfirm: () => void;
  }>({ open: false, category: "character", itemName: "", onConfirm: () => {} });

  const openDeleteConfirm = useCallback(
    (category: ResourceCategory, itemName: string, onConfirm: () => void) => {
      setDeleteModal({ open: true, category, itemName, onConfirm });
    },
    []
  );
  const closeDeleteConfirm = useCallback(() => {
    setDeleteModal((d) => ({ ...d, open: false }));
  }, []);

  const previewBlocks = useMemo<ScriptBlock[]>(() => {
    const bgName = backgrounds[0]?.name ?? "선택 안함";
    const charName = characters[0]?.name ?? "선택 안함";
    const bgmTitle = bgm[0]?.title ?? "선택 안함";

    return [
      { id: "pv-scene", type: "scene", content: "미리보기" },
      { id: "pv-top", type: "top_desc", content: "리소스 미리보기" },
      { id: "pv-bg", type: "background", content: bgName },
      { id: "pv-bgm", type: "bgm", content: bgmTitle },
      { id: "pv-char", type: "character", content: charName },
      {
        id: "pv-text",
        type: "text",
        content: "이 화면에서 등록한 리소스가 어떻게 보이는지 확인할 수 있어요.",
        data: { speaker: charName === "선택 안함" ? "독백" : charName },
      },
    ];
  }, [backgrounds, bgm, characters]);

  const handleBack = useCallback(() => {
    router.push("/series");
  }, [router]);

  const navigateTo = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  return (
    <>
      <main className="flex flex-1 flex-col overflow-hidden bg-slate-50">
        {/* [정책 1] 헤더: < 리소스 관리, 뒤로가기 → /series */}
        <header className="flex h-16 shrink-0 items-center justify-center border-b border-slate-200 bg-white px-6 py-0">
          <div className="flex w-full max-w-[1200px] min-w-[800px] items-center justify-between gap-4">
            <div className="flex items-center justify-start gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleBack}
                className="h-9 w-9 shrink-0 rounded-full border-slate-200 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                aria-label="시리즈 목록으로"
              >
                <ChevronLeft className="h-5 w-5 text-slate-600" strokeWidth={2} />
              </Button>
              <h1 className="text-2xl font-bold text-slate-900">리소스 관리</h1>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto flex flex-col items-center py-8 px-5 gap-4">
          <div className="w-full max-w-[1200px] min-w-[800px] flex flex-col gap-4">
            <ResourceBanner seriesId={seriesId} />

            <div className="flex w-full flex-col items-start gap-6 lg:flex-row">
              {showPreview && (
                <aside className="w-full lg:w-[380px] lg:shrink-0 lg:sticky lg:top-6">
                  <div className="w-full bg-surface-10 rounded-2xl border border-border-10 p-5">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="inline-flex flex-col justify-start items-start gap-1">
                        <div className="text-on-surface-10 text-base font-bold font-['Pretendard_JP'] leading-6">
                          미리보기
                        </div>
                        <div className="text-on-surface-30 text-[13px] font-normal font-['Pretendard_JP'] leading-4">
                          등록한 리소스를 화면에서 확인합니다.
                        </div>
                      </div>
                    </div>

                    <div className="mx-auto h-[652px] w-[300px]">
                      <PreviewScreen blocks={previewBlocks} focusedBlockId="pv-text" />
                    </div>
                  </div>
                </aside>
              )}

              <div className="flex min-w-0 flex-1 flex-col gap-4">

            {/* 등장인물 [정책 2, 3, 5] */}
            <ResourceSection
              title="등장인물"
              description="시리즈에 등장하는 주요 인물의 정보와 상호작용 데이터를 추가합니다."
              emptyMessage="등록된 등장인물이 없습니다"
              addButtonLabel="등장인물 등록"
              isEmpty={characters.length === 0}
              onAddClick={() => navigateTo(ROUTES.character.new(seriesId))}
            >
              <div className="self-stretch p-0 rounded-2xl inline-flex justify-start items-start gap-4 flex-wrap content-start">
                {characters.map((c) => (
                  <CharacterCard
                    key={c.id}
                    character={c}
                    onDetailClick={(char) => navigateTo(ROUTES.character.detail(seriesId, char.id))}
                    onDeleteClick={(char) =>
                      openDeleteConfirm("character", char.name, () => {
                        setCharacters((prev) => prev.filter((x) => x.id !== char.id));
                        closeDeleteConfirm();
                      })
                    }
                  />
                ))}
                <AddResourceSlot
                  variant="character"
                  onClick={() => navigateTo(ROUTES.character.new(seriesId))}
                />
              </div>
            </ResourceSection>

            {/* 배경 [정책 6, 3, 5] */}
            <ResourceSection
              title="배경"
              description="등장인물이 움직이는 주요 공간의 이미지를 등록하고, 세부 설명을 추가합니다."
              emptyMessage="등록된 배경이 없습니다"
              addButtonLabel="배경 등록"
              isEmpty={backgrounds.length === 0}
              onAddClick={() => navigateTo(ROUTES.background.new(seriesId))}
            >
              <div className="self-stretch p-0 rounded-2xl inline-flex justify-start items-start gap-4 flex-wrap content-start">
                {backgrounds.map((bg) => (
                  <ImageCard
                    key={bg.id}
                    item={bg}
                    slotType="img9:16"
                    onDetailClick={(item) =>
                      navigateTo(ROUTES.background.detail(seriesId, item.id))
                    }
                    onDeleteClick={(item) =>
                      openDeleteConfirm("background", item.name, () => {
                        setBackgrounds((prev) => prev.filter((x) => x.id !== item.id));
                        closeDeleteConfirm();
                      })
                    }
                  />
                ))}
                <AddResourceSlot variant="img9:16" onClick={() => navigateTo(ROUTES.background.new(seriesId))} />
              </div>
            </ResourceSection>

            {/* 연출장면 [정책 6, 3, 5] */}
            <ResourceSection
              title="연출장면"
              description="스토리를 풍부하게 만들어 줄 특정 상황에 맞는 이미지, 일러스트를 등록합니다."
              emptyMessage="등록된 연출장면이 없습니다"
              addButtonLabel="연출장면 등록"
              isEmpty={scenes.length === 0}
              onAddClick={() => navigateTo(ROUTES.scene.new(seriesId))}
            >
              <div className="self-stretch p-0 rounded-2xl inline-flex justify-start items-start gap-4 flex-wrap content-start">
                {scenes.map((s) => (
                  <ImageCard
                    key={s.id}
                    item={s}
                    slotType="img9:16"
                    onDetailClick={(item) => navigateTo(ROUTES.scene.detail(seriesId, item.id))}
                    onDeleteClick={(item) =>
                      openDeleteConfirm("scene", item.name, () => {
                        setScenes((prev) => prev.filter((x) => x.id !== item.id));
                        closeDeleteConfirm();
                      })
                    }
                  />
                ))}
                <AddResourceSlot variant="img9:16" onClick={() => navigateTo(ROUTES.scene.new(seriesId))} />
              </div>
            </ResourceSection>

            {/* 미디어 [정책 7, 3, 5] */}
            <ResourceSection
              title="미디어"
              description="영상, 음성 등 주요 스토리를 이해하는데 필요한 미디어 리소스를 관리합니다."
              emptyMessage="등록된 미디어가 없습니다"
              addButtonLabel="미디어 등록"
              isEmpty={media.length === 0}
              descriptionColorClassName="text-[rgba(145,145,148,1)]"
              onAddClick={() => navigateTo(ROUTES.media.new(seriesId))}
            >
              <div className="self-stretch p-0 rounded-2xl inline-flex justify-start items-start gap-4 flex-wrap content-start">
                {media.map((m) => (
                  <MediaCard
                    key={m.id}
                    item={m}
                    onDetailClick={(item) => navigateTo(ROUTES.media.detail(seriesId, item.id))}
                    onDeleteClick={(item) =>
                      openDeleteConfirm("media", item.name, () => {
                        setMedia((prev) => prev.filter((x) => x.id !== item.id));
                        closeDeleteConfirm();
                      })
                    }
                  />
                ))}
                <AddResourceSlot variant="mov" onClick={() => navigateTo(ROUTES.media.new(seriesId))} />
              </div>
            </ResourceSection>

            {/* 갤러리 [정책 7, 3, 5] */}
            <ResourceSection
              title="갤러리"
              description="다양한 시각적 자료를 아카이빙하고, 독자들이 자유롭게 열람할 수 있도록 합니다."
              emptyMessage="등록된 갤러리가 없습니다"
              addButtonLabel="갤러리 등록"
              isEmpty={gallery.length === 0}
              descriptionColorClassName="text-[rgba(145,145,148,1)]"
              onAddClick={() => navigateTo(ROUTES.gallery.new(seriesId))}
            >
              <div className="self-stretch p-0 rounded-2xl inline-flex justify-start items-start gap-4 flex-wrap content-start">
                {gallery.map((g) => (
                  <ImageCard
                    key={g.id}
                    item={g}
                    slotType="img9:16"
                    onDetailClick={(item) =>
                      navigateTo(ROUTES.gallery.detail(seriesId, item.id))
                    }
                    onDeleteClick={(item) =>
                      openDeleteConfirm("gallery", item.name, () => {
                        setGallery((prev) => prev.filter((x) => x.id !== item.id));
                        closeDeleteConfirm();
                      })
                    }
                  />
                ))}
                <AddResourceSlot variant="img9:16" onClick={() => navigateTo(ROUTES.gallery.new(seriesId))} />
              </div>
            </ResourceSection>

            {/* BGM [정책 8, 9, 10] */}
            <BgmSection
              title="BGM"
              description="이야기에 삽입될 배경 음악을 관리합니다."
              emptyMessage="등록된 배경음악 없습니다"
              addButtonLabel="BGM 선택"
              items={bgm}
              onDelete={(item) =>
                openDeleteConfirm("bgm", item.title, () => {
                  setBgm((prev) => prev.filter((x) => x.id !== item.id));
                  closeDeleteConfirm();
                })
              }
              onAddFromModal={(item) => setBgm((prev) => [...prev, item])}
            />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* [정책 4] 삭제 전 확인 팝업 */}
      <ConfirmDeleteModal
        open={deleteModal.open}
        category={deleteModal.category}
        itemName={deleteModal.itemName}
        onClose={closeDeleteConfirm}
        onConfirm={() => {
          deleteModal.onConfirm();
        }}
      />
    </>
  );
}
