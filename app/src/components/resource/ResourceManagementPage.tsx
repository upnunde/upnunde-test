"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { ResourceBanner } from "./ResourceBanner";
import { ResourceSection } from "./ResourceSection";
import { CharacterCard } from "./cards/CharacterCard";
import { ImageCard } from "./cards/ImageCard";
import { MediaCard } from "./cards/MediaCard";
import { AddResourceSlot } from "./cards/AddResourceSlot";
import { BgmSection } from "./bgm/BgmSection";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal";
import { PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS, PAGE_GUTTER_GAP_CLASS, PAGE_SCROLL_COLUMN_CLASS, PAGE_SUBHEADER_PAGE_SHELL_CLASS, PAGE_SUBHEADER_WITH_STICKY_CLASS } from "@/lib/page-layout";
import { RESOURCE_THUMBNAIL_FLUID_SIZE_CLASS, RESOURCE_THUMBNAIL_GRID_CLASS } from "@/lib/thumbnail-styles";
import { cn } from "@/lib/utils";
import type { ImageLightboxItem } from "./ImageLightbox";
import type {
  ResourceCategory,
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
import { PreviewScreen } from "@/components/editor/PreviewScreen";
import { Title2 } from "@/components/ui/title2";
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

const initialBgm: BgmResource[] = MOCK_HAS_RESOURCES
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

  useEffect(() => {
    const updatePreviewFlag = () => {
      if (typeof window === "undefined") return;
      setShowPreview(new URLSearchParams(window.location.search).get("preview") === "1");
    };
    updatePreviewFlag();
    window.addEventListener("popstate", updatePreviewFlag);
    return () => window.removeEventListener("popstate", updatePreviewFlag);
  }, []);

  const [characters, setCharacters] = useState<CharacterResource[]>(initialCharacters);
  const [backgrounds, setBackgrounds] = useState<ImageResource[]>(initialBackgrounds);
  const [scenes, setScenes] = useState<ImageResource[]>(initialScenes);
  const [media, setMedia] = useState<MediaResource[]>(initialMedia);
  const [gallery, setGallery] = useState<ImageResource[]>(initialGallery);
  const [bgm, setBgm] = useState<BgmResource[]>(initialBgm);
  const [showAllScenes, _setShowAllScenes] = useState(false);
  const [showAllGallery, _setShowAllGallery] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    category: ResourceCategory;
    itemName: string;
    onConfirm: () => void;
  }>({ open: false, category: "character", itemName: "", onConfirm: () => {} });

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
        <header className={PAGE_SUBHEADER_WITH_STICKY_CLASS}>
          <div className="flex w-full min-w-0 max-w-[1200px] mx-auto items-center justify-between gap-my-16">
            <div className="flex items-center justify-start gap-my-12">
              <HeaderBackButton onClick={handleBack} aria-label="시리즈 목록으로" />
              <h1 className="text-heading2_700 text-on-surface-10">리소스 관리</h1>
            </div>
          </div>
        </header>

        <div className={cn(PAGE_SCROLL_COLUMN_CLASS, "max-lg:px-0 max-lg:pt-0")}>
          <div className={cn("mx-auto flex w-full min-w-0 max-w-[1200px] flex-col", PAGE_GUTTER_GAP_CLASS)}>
            <ResourceBanner seriesId={seriesId} />

            <div className="flex w-full min-w-0 flex-col items-stretch gap-my-24 lg:flex-row lg:items-start">
              {showPreview && (
                <aside className="w-full min-w-0 lg:w-[380px] lg:shrink-0 lg:sticky lg:top-6">
                  <div className="w-full min-w-0 rounded-[4px] border border-border-10 bg-surface-10 p-my-20 max-lg:rounded-none max-lg:border-0">
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

              <div className="flex w-full min-w-0 flex-1 flex-col gap-my-16">

            {/* 등장인물 [정책 2, 3, 5] */}
            <ResourceSection
              title="등장인물"
              description="시리즈에 등장하는 주요 인물의 정보와 상호작용 데이터를 추가합니다."
              emptyMessage="등록된 등장인물이 없습니다"
              addButtonLabel="등장인물 등록"
              isEmpty={characters.length === 0}
              descriptionColorClassName="text-on-surface-30"
              onAddClick={() => navigateTo(ROUTES.character.new(seriesId))}
            >
              <div className={RESOURCE_THUMBNAIL_GRID_CLASS}>
                {characters.map((c) => (
                  <CharacterCard
                    key={c.id}
                    fluid
                    character={c}
                    onDetailClick={(char) => navigateTo(ROUTES.character.detail(seriesId, char.id))}
                    onDeleteClick={(char) =>
                      openDeleteConfirm("character", char.name, () => {
                        setCharacters((prev) => prev.filter((x) => x.id !== char.id));
                        closeDeleteConfirm();
                      })
                    }
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
              descriptionColorClassName="text-on-surface-30"
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
                    onDeleteClick={(item) =>
                      openDeleteConfirm("background", item.name, () => {
                        setBackgrounds((prev) => prev.filter((x) => x.id !== item.id));
                        closeDeleteConfirm();
                      })
                    }
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
              descriptionColorClassName="text-on-surface-30"
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
                    onDeleteClick={(item) =>
                      openDeleteConfirm("scene", item.name, () => {
                        setScenes((prev) => prev.filter((x) => x.id !== item.id));
                        closeDeleteConfirm();
                      })
                    }
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
              descriptionColorClassName="text-on-surface-30"
              onAddClick={() => navigateTo(ROUTES.media.new(seriesId))}
            >
              <div className={RESOURCE_THUMBNAIL_GRID_CLASS}>
                {media.map((m) => (
                  <MediaCard
                    key={m.id}
                    fluid
                    item={m}
                    onDetailClick={(item) => navigateTo(ROUTES.media.detail(seriesId, item.id))}
                    onDeleteClick={(item) =>
                      openDeleteConfirm("media", item.name, () => {
                        setMedia((prev) => prev.filter((x) => x.id !== item.id));
                        closeDeleteConfirm();
                      })
                    }
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
              descriptionColorClassName="text-on-surface-30"
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
                    onDeleteClick={(item) =>
                      openDeleteConfirm("gallery", item.name, () => {
                        setGallery((prev) => prev.filter((x) => x.id !== item.id));
                        closeDeleteConfirm();
                      })
                    }
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
