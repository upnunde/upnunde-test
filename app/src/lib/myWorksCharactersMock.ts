import type { CharacterData } from "@/types/character";

/** 내 작품 — 캐릭터 목록 목업 (캐릭터 탭·분석·리소스 가져오기 공통) */
export const MY_WORKS_CHARACTERS_MOCK: CharacterData[] = [
  {
    id: "c0",
    title: "초안 캐릭터",
    tagline: "아직 설정을 다듬는 중이에요",
    status: "DRAFT",
    createdAt: "2024-05-10T00:00:00.000Z",
    viewCount: 0,
    stat1: 0,
    stat2: 0,
  },
  {
    id: "c1",
    title: "눈싸움 달인 그레이브즈",
    tagline: "뭐, 좋은 생각이라도 있어?",
    thumbnailUrl: "/characters/graves-winter-splash.png",
    status: "PRIVATE",
    createdAt: "2024-05-12T00:00:00.000Z",
    viewCount: 25_000,
    stat1: 4231,
    stat2: 4211,
  },
  {
    id: "c2",
    title: "(구) 리신",
    tagline: "앞을 못 보게 된 건 용의 분노를 일깨우려다 혹독한 대가를 치른 것이라오",
    thumbnailUrl: "/characters/leesin-splash.png",
    status: "PUBLIC",
    createdAt: "2024-05-12T00:00:00.000Z",
    viewCount: 25_000,
    stat1: 325_000,
    stat2: 4211,
  },
  {
    id: "c3",
    title: "이터늄 녹턴",
    tagline: "어둠을... 맞이하라...!",
    thumbnailUrl: "/characters/eternum-nocturne-splash.png",
    status: "PUBLIC",
    createdAt: "2024-05-12T00:00:00.000Z",
    viewCount: 25_000,
    stat1: 45_000,
    stat2: 4211,
  },
];
