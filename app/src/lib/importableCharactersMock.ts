import type { CharacterResource } from "@/types/resource";

/** 리소스 관리·등장인물 등록 화면용 “다른 작품에서 가져오기” 목업 목록 */
export const IMPORTABLE_CHARACTERS: Array<Pick<CharacterResource, "id" | "name" | "summary" | "imageUrl">> = [
  {
    id: "c1",
    name: "눈싸움 달인 그레이브즈",
    summary: "뭐, 좋은 생각이라도 있어?",
    imageUrl: "/characters/graves-winter-splash.png",
  },
  {
    id: "c2",
    name: "(구) 리신",
    summary: "앞을 못 보게 된 건 용의 분노를 일깨우려다 혹독한 대가를 치른 것이라오",
    imageUrl: "/characters/leesin-splash.png",
  },
  {
    id: "c3",
    name: "이터늄 녹턴",
    summary: "어둠을... 맞이하라...!",
    imageUrl: "/characters/eternum-nocturne-splash.png",
  },
];
