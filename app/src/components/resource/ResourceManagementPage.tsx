"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "design-system/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { ResourceBanner } from "./ResourceBanner";
import { ResourceSection } from "./ResourceSection";
import { CharacterCard } from "./cards/CharacterCard";
import { ImageCard } from "./cards/ImageCard";
import { MediaCard } from "./cards/MediaCard";
import { AddResourceSlot } from "./cards/AddResourceSlot";
import { BgmSection } from "./bgm/BgmSection";
import { PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS, PAGE_FLUSH_CONTENT_PAD_X_CLASS, PAGE_SCROLL_COLUMN_CLASS, PAGE_SERIES_TITLE_BAND_CLASS, PAGE_SUBHEADER_PAGE_SHELL_CLASS, PAGE_SUBHEADER_WITH_STICKY_CLASS } from "@/lib/page-layout";
import { RESOURCE_THUMBNAIL_FLUID_SIZE_CLASS, RESOURCE_THUMBNAIL_GRID_CLASS } from "@/lib/thumbnail-styles";
import { cn } from "design-system/utils";
import type { ImageLightboxItem } from "./ImageLightbox";
import type {
  CharacterResource,
  ImageResource,
  MediaResource,
  BgmResource,
} from "@/types/resource";
import {
  initialBackgrounds,
  initialScenes,
  initialMedia,
  initialGallery,
  initialCharacters,
} from "@/lib/resourceMockData";
import { deterministicBgmDuration } from "@/lib/bgm-duration";
import { resetResourceManagementPageStorageIfNeeded } from "@/lib/resource-page-storage";
import {
  RESOURCE_BGM_SECTION_DESCRIPTION,
  RESOURCE_BGM_SECTION_EMPTY_MESSAGE,
} from "@/lib/episode-resource-copy";
import { PreviewScreen } from "@/components/editor/PreviewScreen";
import { Title2 } from "@/components/ui/title2";
import { SubHeaderActions } from "@/components/layout/SubHeaderActions";
import { useSeriesCatalogStore } from "@/store/useSeriesCatalogStore";
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

const RESOURCE_DELETE_TITLE = "리소스를 삭제하시겠어요?";
const RESOURCE_DELETE_DESCRIPTION =
  "선택한 리소스를 삭제하면 이 리소스를 사용 중인 모든 에피소드에서 표시 오류나 오류가 발생할 수 있습니다.";

type PendingResourceDelete =
  | { kind: "character"; id: string }
  | { kind: "background"; id: string }
  | { kind: "scene"; id: string }
  | { kind: "media"; id: string }
  | { kind: "gallery"; id: string };

const DEMO_BGM: BgmResource[] = MOCK_HAS_RESOURCES
  ? [
      // 판타지
      { id: "1", title: "빛의 성가", duration: deterministicBgmDuration("bgm-1") },
      { id: "2", title: "마법의 숲", duration: deterministicBgmDuration("bgm-2") },
      { id: "3", title: "용자의 여정", duration: deterministicBgmDuration("bgm-3") },
      { id: "4", title: "신성한 유적", duration: deterministicBgmDuration("bgm-4") },
      // 호러
      { id: "5", title: "침묵의 복도", duration: deterministicBgmDuration("bgm-5") },
      { id: "6", title: "낡은 저택", duration: deterministicBgmDuration("bgm-6") },
      { id: "7", title: "속삭이는 그림자", duration: deterministicBgmDuration("bgm-7") },
      { id: "8", title: "붉은 달밤", duration: deterministicBgmDuration("bgm-8") },
      // 로맨스
      { id: "9", title: "봄날의 고백", duration: deterministicBgmDuration("bgm-9") },
      { id: "10", title: "달빛 산책", duration: deterministicBgmDuration("bgm-10") },
      { id: "11", title: "두근두근 러브송", duration: deterministicBgmDuration("bgm-11") },
      { id: "12", title: "별빛 약속", duration: deterministicBgmDuration("bgm-12") },
    ]
  : [];

interface SeriesResourceSeed {
  characters: CharacterResource[];
  backgrounds: ImageResource[];
  scenes: ImageResource[];
  media: MediaResource[];
  gallery: ImageResource[];
  bgm: BgmResource[];
}

/** 데모 시리즈 1번만 시드 리소스 — 신규·기타 시리즈는 빈 상태 */
function getSeedResourcesForSeries(seriesId: string): SeriesResourceSeed {
  if (seriesId === "1") {
    return {
      characters: initialCharacters,
      backgrounds: initialBackgrounds,
      scenes: initialScenes,
      media: initialMedia,
      gallery: initialGallery,
      bgm: DEMO_BGM,
    };
  }

  return {
    characters: [],
    backgrounds: [],
    scenes: [],
    media: [],
    gallery: [],
    bgm: [],
  };
}

const ImageLightbox = dynamic(
  () => import("./ImageLightbox").then((mod) => mod.ImageLightbox),
  { ssr: false }
);

export function ResourceManagementPage() {
  const router = useRouter();
  const pathname = usePathname();
  const seriesId = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[1] ?? "";
  }, [pathname]);
  const [showPreview, setShowPreview] = useState(false);
  const ensureDemoSeries = useSeriesCatalogStore((s) => s.ensureDemoSeries);
  const seriesRecord = useSeriesCatalogStore((s) => s.seriesById[seriesId]);
  const seriesTitle = seriesRecord?.title ?? "시리즈";

  useEffect(() => {
    ensureDemoSeries();
  }, [ensureDemoSeries]);

  useEffect(() => {
    resetResourceManagementPageStorageIfNeeded();
  }, []);

  useEffect(() => {
    const seed = getSeedResourcesForSeries(seriesId);
    setCharacters(seed.characters);
    setBackgrounds(seed.backgrounds);
    setScenes(seed.scenes);
    setMedia(seed.media);
    setGallery(seed.gallery);
    setBgm(seed.bgm);
  }, [seriesId]);

  useEffect(() => {
    const updatePreviewFlag = () => {
      if (typeof window === "undefined") return;
      setShowPreview(new URLSearchParams(window.location.search).get("preview") === "1");
    };
    updatePreviewFlag();
    window.addEventListener("popstate", updatePreviewFlag);
    return () => window.removeEventListener("popstate", updatePreviewFlag);
  }, []);

  const [characters, setCharacters] = useState<CharacterResource[]>(
    () => getSeedResourcesForSeries(seriesId).characters,
  );
  const [backgrounds, setBackgrounds] = useState<ImageResource[]>(
    () => getSeedResourcesForSeries(seriesId).backgrounds,
  );
  const [scenes, setScenes] = useState<ImageResource[]>(
    () => getSeedResourcesForSeries(seriesId).scenes,
  );
  const [media, setMedia] = useState<MediaResource[]>(
    () => getSeedResourcesForSeries(seriesId).media,
  );
  const [gallery, setGallery] = useState<ImageResource[]>(
    () => getSeedResourcesForSeries(seriesId).gallery,
  );
  const [bgm, setBgm] = useState<BgmResource[]>(() => getSeedResourcesForSeries(seriesId).bgm);
  const [showAllScenes, _setShowAllScenes] = useState(false);
  const [showAllGallery, _setShowAllGallery] = useState(false);

  const [lightbox, setLightbox] = useState<{
    open: boolean;
    items: ImageLightboxItem[];
    index: number;
  }>({ open: false, items: [], index: 0 });

  const openLightbox = useCallback((items: ImageLightboxItem[], index: number) => {
    setLightbox({ open: true, items, index });
  }, []);
  const closeLightbox = useCallback(() => {
    setLightbox((prev) => ({ ...prev, open: false }));
  }, []);

  const [pendingDelete, setPendingDelete] = useState<PendingResourceDelete | null>(null);

  const confirmPendingDelete = useCallback(() => {
    if (!pendingDelete) return;
    const { kind, id } = pendingDelete;
    if (kind === "character") setCharacters((prev) => prev.filter((x) => x.id !== id));
    if (kind === "background") setBackgrounds((prev) => prev.filter((x) => x.id !== id));
    if (kind === "scene") setScenes((prev) => prev.filter((x) => x.id !== id));
    if (kind === "media") setMedia((prev) => prev.filter((x) => x.id !== id));
    if (kind === "gallery") setGallery((prev) => prev.filter((x) => x.id !== id));
    setPendingDelete(null);
  }, [pendingDelete]);

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
        data: { speaker: charName === "선택 안함" ? "나레이션" : charName },
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

  const visibleScenes = showAllScenes ? scenes : scenes.slice(0, 6);
  const visibleGallery = showAllGallery ? gallery : gallery.slice(0, 6);

  return (
    <>
      <div className={PAGE_SUBHEADER_PAGE_SHELL_CLASS}>
        {/* [정책 1] 헤더 (레이아웃 가이드: margin 40, max-width 1200, min-width 640) */}
        <header className={cn(PAGE_SUBHEADER_WITH_STICKY_CLASS, "max-lg:px-3")}>
          <div className="flex w-full min-w-0 max-w-[1200px] mx-auto items-center justify-between gap-4">
            <div className="flex min-w-0 items-center justify-start gap-3">
              <HeaderBackButton onClick={handleBack} aria-label="시리즈 목록으로" />
              <h1 className="text-heading2_700 text-foreground">리소스 관리</h1>
            </div>
            <SubHeaderActions />
          </div>
        </header>

        <div className={cn(PAGE_SCROLL_COLUMN_CLASS, "max-lg:px-0 max-lg:pt-0")}>
          <div className="mx-auto flex w-full min-w-0 max-w-[1200px] flex-col max-lg:gap-0 lg:gap-5">
            <div className={PAGE_SERIES_TITLE_BAND_CLASS}>
              <h2 className="min-w-0 text-heading4_700 text-foreground">{seriesTitle}</h2>
            </div>

            <ResourceBanner seriesId={seriesId} />

            <div className="flex w-full min-w-0 flex-col items-stretch gap-6 max-lg:gap-0 lg:flex-row lg:items-start">
              {showPreview && (
                <aside className="w-full min-w-0 lg:w-[380px] lg:shrink-0 lg:sticky lg:top-6">
                  <div className={cn("w-full min-w-0 rounded-sm border border-border bg-background py-5 max-lg:rounded-none max-lg:border-0", PAGE_FLUSH_CONTENT_PAD_X_CLASS)}>
                    <Title2
                      text="미리보기"
                      asSectionHeader
                      subtitle
                      subtitleText="등록한 리소스를 화면에서 확인합니다."
                      className="!p-0 !border-0 mb-4"
                    />

                    <div className="relative mx-auto aspect-[9/16] w-full max-w-[300px]">
                      <PreviewScreen blocks={previewBlocks} focusedBlockId="pv-text" />
                    </div>
                  </div>
                </aside>
              )}

              <div className="flex w-full min-w-0 flex-1 flex-col gap-4">

            {/* 등장인물 [정책 2, 3, 5] */}
            <ResourceSection
              title="등장인물"
              description="시리즈에 등장하는 주요 인물의 정보와 상호작용 데이터를 추가합니다."
              emptyMessage="등록된 등장인물이 없습니다"
              addButtonLabel="등장인물 등록"
              isEmpty={characters.length === 0}
              descriptionColorClassName="text-foreground-placeholder"
              onAddClick={() => navigateTo(ROUTES.character.new(seriesId))}
            >
              <div className={RESOURCE_THUMBNAIL_GRID_CLASS}>
                {characters.map((c) => (
                  <CharacterCard
                    key={c.id}
                    fluid
                    character={c}
                    onDetailClick={(char) => navigateTo(ROUTES.character.detail(seriesId, char.id))}
                    onDeleteClick={(char) => setPendingDelete({ kind: "character", id: char.id })}
                    onPreviewClick={(char) => {
                      const items: ImageLightboxItem[] = characters.map((x) => ({
                        id: x.id,
                        imageUrl: x.imageUrl,
                        name: x.name,
                      }));
                      openLightbox(items, characters.findIndex((x) => x.id === char.id));
                    }}
                  />
                ))}
                <AddResourceSlot
                  variant="character"
                  sizeClassName={RESOURCE_THUMBNAIL_FLUID_SIZE_CLASS}
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
              descriptionColorClassName="text-foreground-placeholder"
              onAddClick={() => navigateTo(ROUTES.background.new(seriesId))}
            >
              <div className={RESOURCE_THUMBNAIL_GRID_CLASS}>
                {backgrounds.map((bg) => (
                  <ImageCard
                    key={bg.id}
                    fluid
                    item={bg}
                    slotType="img9:16"
                    onDetailClick={(item) =>
                      navigateTo(ROUTES.background.detail(seriesId, item.id))
                    }
                    onDeleteClick={(item) => setPendingDelete({ kind: "background", id: item.id })}
                    onPreviewClick={(item) => {
                      const items: ImageLightboxItem[] = backgrounds.map((x) => ({
                        id: x.id,
                        imageUrl: x.imageUrl,
                        name: x.name,
                      }));
                      openLightbox(items, backgrounds.findIndex((x) => x.id === item.id));
                    }}
                  />
                ))}
                <AddResourceSlot variant="img9:16" sizeClassName={RESOURCE_THUMBNAIL_FLUID_SIZE_CLASS} onClick={() => navigateTo(ROUTES.background.new(seriesId))} />
              </div>
            </ResourceSection>

            {/* 연출장면 [정책 6, 3, 5] */}
            <ResourceSection
              title="연출장면"
              description="스토리를 풍부하게 만들어 줄 특정 장면에 맞는 이미지, 일러스트를 등록합니다."
              emptyMessage="등록된 연출장면이 없습니다"
              addButtonLabel="연출장면 등록"
              isEmpty={scenes.length === 0}
              descriptionColorClassName="text-foreground-placeholder"
              onAddClick={() => navigateTo(ROUTES.scene.new(seriesId))}
            >
              <div className={RESOURCE_THUMBNAIL_GRID_CLASS}>
                {visibleScenes.map((s) => (
                  <ImageCard
                    key={s.id}
                    fluid
                    item={s}
                    slotType="img9:16"
                    onDetailClick={(item) => navigateTo(ROUTES.scene.detail(seriesId, item.id))}
                    onDeleteClick={(item) => setPendingDelete({ kind: "scene", id: item.id })}
                    onPreviewClick={(item) => {
                      const items: ImageLightboxItem[] = scenes.map((x) => ({
                        id: x.id,
                        imageUrl: x.imageUrl,
                        name: x.name,
                      }));
                      openLightbox(items, scenes.findIndex((x) => x.id === item.id));
                    }}
                  />
                ))}
                <AddResourceSlot variant="img9:16" sizeClassName={RESOURCE_THUMBNAIL_FLUID_SIZE_CLASS} onClick={() => navigateTo(ROUTES.scene.new(seriesId))} />
              </div>
            </ResourceSection>

            {/* 미디어 [정책 7, 3, 5] */}
            <ResourceSection
              title="미디어"
              description="영상, 음성 등 주요 스토리를 이해하는데 필요한 미디어 리소스를 관리합니다."
              emptyMessage="등록된 미디어가 없습니다"
              addButtonLabel="미디어 등록"
              isEmpty={media.length === 0}
              descriptionColorClassName="text-foreground-placeholder"
              onAddClick={() => navigateTo(ROUTES.media.new(seriesId))}
            >
              <div className={RESOURCE_THUMBNAIL_GRID_CLASS}>
                {media.map((m) => (
                  <MediaCard
                    key={m.id}
                    fluid
                    item={m}
                    onDetailClick={(item) => navigateTo(ROUTES.media.detail(seriesId, item.id))}
                    onDeleteClick={(item) => setPendingDelete({ kind: "media", id: item.id })}
                    onPreviewClick={(item) => {
                      const items: ImageLightboxItem[] = media.map((x) => ({
                        id: x.id,
                        imageUrl: x.thumbnailUrl,
                        name: x.name,
                      }));
                      openLightbox(items, media.findIndex((x) => x.id === item.id));
                    }}
                  />
                ))}
                <AddResourceSlot variant="mov" sizeClassName={RESOURCE_THUMBNAIL_FLUID_SIZE_CLASS} onClick={() => navigateTo(ROUTES.media.new(seriesId))} />
              </div>
            </ResourceSection>

            {/* 갤러리 [정책 7, 3, 5] */}
            <ResourceSection
              title="갤러리"
              description="다양한 시각적 자료를 아카이빙하고, 독자들이 자유롭게 열람할 수 있도록 합니다."
              emptyMessage="등록된 갤러리가 없습니다"
              addButtonLabel="갤러리 등록"
              isEmpty={gallery.length === 0}
              descriptionColorClassName="text-foreground-placeholder"
              onAddClick={() => navigateTo(ROUTES.gallery.new(seriesId))}
            >
              <div className={RESOURCE_THUMBNAIL_GRID_CLASS}>
                {visibleGallery.map((g) => (
                  <ImageCard
                    key={g.id}
                    fluid
                    item={g}
                    slotType="img9:16"
                    onDetailClick={(item) =>
                      navigateTo(ROUTES.gallery.detail(seriesId, item.id))
                    }
                    onDeleteClick={(item) => setPendingDelete({ kind: "gallery", id: item.id })}
                    onPreviewClick={(item) => {
                      const items: ImageLightboxItem[] = gallery.map((x) => ({
                        id: x.id,
                        imageUrl: x.imageUrl,
                        name: x.name,
                      }));
                      openLightbox(items, gallery.findIndex((x) => x.id === item.id));
                    }}
                  />
                ))}
                <AddResourceSlot variant="img9:16" sizeClassName={RESOURCE_THUMBNAIL_FLUID_SIZE_CLASS} onClick={() => navigateTo(ROUTES.gallery.new(seriesId))} />
              </div>
            </ResourceSection>

            {/* BGM [정책 8, 9, 10] */}
            <BgmSection
              title="BGM"
              description={RESOURCE_BGM_SECTION_DESCRIPTION}
              emptyMessage={RESOURCE_BGM_SECTION_EMPTY_MESSAGE}
              addButtonLabel="BGM 선택"
              items={bgm}
              onDelete={(item) =>
                setBgm((prev) => prev.filter((x) => x.id !== item.id))
              }
              onAddFromModal={(item) =>
                setBgm((prev) =>
                  prev.some((x) => x.id === item.id) ? prev : [...prev, item],
                )
              }
            />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 썸네일 크게 보기 라이트박스 */}
      <ImageLightbox
        open={lightbox.open}
        onClose={closeLightbox}
        items={lightbox.items}
        initialIndex={lightbox.index}
      />
      <Dialog
        open={pendingDelete != null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{RESOURCE_DELETE_TITLE}</DialogTitle>
            <DialogDescription>{RESOURCE_DELETE_DESCRIPTION}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              취소
            </Button>
            <Button onClick={confirmPendingDelete}>삭제</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
