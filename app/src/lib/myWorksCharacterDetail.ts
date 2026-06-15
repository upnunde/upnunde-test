import type { CharacterData } from "@/types/character";
import type { CharacterResource } from "@/types/resource";
import { getCharacterById } from "@/lib/resourceMockData";
import { MY_WORKS_CHARACTERS_MOCK } from "@/lib/myWorksCharactersMock";

/** 내 작품 캐릭터 편집 폼용 상세 목업 — 목록 카드(id)와 1:1 */
const MY_WORKS_CHARACTER_DETAILS: Record<string, CharacterResource> = {
  c1: {
    id: "c1",
    name: "눈싸움 달인 그레이브즈",
    imageUrl: "/characters/graves-winter-splash.png",
    summary: "뭐, 좋은 생각이라도 있어?",
    tags: "눈싸움, 겨울, 유머",
    greeting: "눈싸움 한 판 어때? 내가 이기면… 농담이야.",
    expressions: [
      {
        id: "c1-exp-1",
        expressionLabel: "기본",
        imageUrl: "/characters/graves-winter-splash.png",
      },
      {
        id: "c1-exp-2",
        expressionLabel: "장난",
        imageUrl: "/characters/graves-winter-splash.png",
      },
      {
        id: "c1-exp-3",
        expressionLabel: "당황",
        imageUrl: "/characters/graves-winter-splash.png",
      },
    ],
  },
  c2: {
    id: "c2",
    name: "(구) 리신",
    imageUrl: "/characters/leesin-splash.png",
    summary: "앞을 못 보게 된 건 용의 분노를 일깨우려다 혹독한 대가를 치른 것이라오",
    tags: "수행자, 용, 각오",
    greeting: "앞이 보이지 않아도, 나아갈 길은 분명하다.",
    expressions: [
      {
        id: "c2-exp-1",
        expressionLabel: "무표정",
        imageUrl: "/characters/leesin-splash.png",
      },
      {
        id: "c2-exp-2",
        expressionLabel: "단호",
        imageUrl: "/characters/leesin-splash.png",
      },
    ],
  },
  c3: {
    id: "c3",
    name: "이터늄 녹턴",
    imageUrl: "/characters/eternum-nocturne-splash.png",
    summary: "어둠을... 맞이하라...!",
    tags: "어둠, 밤, 신비",
    greeting: "어둠 속에서도… 너는 빛나고 있어.",
    expressions: [
      {
        id: "c3-exp-1",
        expressionLabel: "기본",
        imageUrl: "/characters/eternum-nocturne-splash.png",
      },
      {
        id: "c3-exp-2",
        expressionLabel: "위협",
        imageUrl: "/characters/eternum-nocturne-splash.png",
      },
      {
        id: "c3-exp-3",
        expressionLabel: "고요",
        imageUrl: "/characters/eternum-nocturne-splash.png",
      },
      {
        id: "c3-exp-4",
        expressionLabel: "미소",
        imageUrl: "/characters/eternum-nocturne-splash.png",
      },
    ],
  },
};

function getImportedResourceCharacterDetail(id: string): CharacterResource | undefined {
  const match = /^resource-([^-]+)-(.+)$/.exec(id);
  if (!match) return undefined;

  const resource = getCharacterById(match[2]!);
  if (!resource) return undefined;

  return { ...resource, id };
}

/** URL·편집 화면용 — 등록된 상세가 있으면 전체 폼 데이터 반환 */
export function getMyWorksCharacterDetailById(id: string): CharacterResource | undefined {
  const registered = MY_WORKS_CHARACTER_DETAILS[id];
  if (registered) return registered;

  return getImportedResourceCharacterDetail(id);
}

/** 목록 카드 → 편집 폼 (상세 목업 우선, 없으면 카드 필드로 최소 구성) */
export function characterDataToCharacterResource(character: CharacterData): CharacterResource {
  const detail = getMyWorksCharacterDetailById(character.id);
  if (detail) return detail;

  return {
    id: character.id,
    name: character.title,
    imageUrl: character.thumbnailUrl ?? "",
    summary: character.tagline,
    tags: "",
    greeting: "",
    expressions: character.thumbnailUrl
      ? [
          {
            id: `${character.id}-exp-1`,
            expressionLabel: "기본",
            imageUrl: character.thumbnailUrl,
          },
        ]
      : [],
  };
}

/** 목록에 있는 id인지 (목업 + 세션에서 추가된 항목은 호출부 state로 판별) */
export function isKnownMyWorksCharacterId(id: string): boolean {
  if (MY_WORKS_CHARACTER_DETAILS[id]) return true;
  if (getImportedResourceCharacterDetail(id)) return true;
  return MY_WORKS_CHARACTERS_MOCK.some((c) => c.id === id);
}

const MY_WORKS_CHARACTER_EDIT_STAGING_KEY = "my-works-character-edit-staging";

/** 목록 → 설정 화면 진입 시 카드 데이터를 폼 초기값으로 넘김 (상세 목업 없을 때) */
export function stageMyWorksCharacterEdit(character: CharacterData): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    MY_WORKS_CHARACTER_EDIT_STAGING_KEY,
    JSON.stringify(characterDataToCharacterResource(character)),
  );
}

export function consumeMyWorksCharacterEdit(characterId: string): CharacterResource | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(MY_WORKS_CHARACTER_EDIT_STAGING_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CharacterResource;
    if (parsed.id !== characterId) return null;
    sessionStorage.removeItem(MY_WORKS_CHARACTER_EDIT_STAGING_KEY);
    return parsed;
  } catch {
    sessionStorage.removeItem(MY_WORKS_CHARACTER_EDIT_STAGING_KEY);
    return null;
  }
}

export function resolveMyWorksCharacterDetail(characterId: string): CharacterResource | undefined {
  return getMyWorksCharacterDetailById(characterId) ?? consumeMyWorksCharacterEdit(characterId) ?? undefined;
}
