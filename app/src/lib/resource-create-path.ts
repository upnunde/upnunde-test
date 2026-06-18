import type { BlockType } from "@/types/editor";

export interface ResourceCreateLink {
  href: string;
  label: string;
}

/** 블록 타입별 리소스 등록 경로 — seriesId 없으면 null */
export function getResourceCreateLink(
  seriesId: string | null | undefined,
  type: BlockType,
): ResourceCreateLink | null {
  if (!seriesId?.trim()) return null;

  const id = seriesId.trim();

  switch (type) {
    case "character":
      return {
        href: `/series/${id}/resources/characters/new`,
        label: "+ 새 캐릭터 등록",
      };
    case "background":
      return {
        href: `/series/${id}/resources/backgrounds/new`,
        label: "+ 새 배경 등록",
      };
    case "gallery":
      return {
        href: `/series/${id}/resources/gallery/new`,
        label: "+ 새 갤러리 등록",
      };
    case "video":
      return {
        href: `/series/${id}/resources/media/new`,
        label: "+ 새 미디어 등록",
      };
    case "event":
      return {
        href: `/series/${id}/resources/scenes/new`,
        label: "+ 새 연출장면 등록",
      };
    case "bgm":
    case "sfx":
      return {
        href: `/series/${id}/resources`,
        label: "리소스 관리에서 추가",
      };
    default:
      return null;
  }
}
