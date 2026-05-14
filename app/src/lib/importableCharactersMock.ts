import { MY_WORKS_CHARACTERS_MOCK } from "@/lib/myWorksCharactersMock";
import type { CharacterResource } from "@/types/resource";

/** 리소스 관리·등장인물 등록 화면용 “다른 작품에서 가져오기” 목업 목록 */
export const IMPORTABLE_CHARACTERS: Array<Pick<CharacterResource, "id" | "name" | "summary" | "imageUrl">> =
  MY_WORKS_CHARACTERS_MOCK.map((character) => ({
    id: character.id,
    name: character.title,
    summary: character.tagline,
    imageUrl: character.thumbnailUrl ?? "",
  }));
