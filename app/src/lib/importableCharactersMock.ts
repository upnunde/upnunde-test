import { MY_WORKS_CHARACTERS_MOCK } from "@/lib/myWorksCharactersMock";
import { initialCharacters } from "@/lib/resourceMockData";
import type { CharacterData, CharacterSourceSeries } from "@/types/character";
import type { CharacterResource } from "@/types/resource";

export type ImportableCharacterPick = Pick<CharacterResource, "id" | "name" | "summary" | "imageUrl">;

export type ImportableResourceCharacterPick = ImportableCharacterPick & {
  seriesId: string;
  seriesTitle: string;
};

export interface ImportCharacterSeriesGroup {
  seriesId: string;
  seriesTitle: string;
  characters: ImportableResourceCharacterPick[];
}

/** 등장인물 등록 화면 — 내 작품 캐릭터를 폼에 반영할 때 */
export const IMPORTABLE_CHARACTERS: ImportableCharacterPick[] = MY_WORKS_CHARACTERS_MOCK.map((character) => ({
  id: character.id,
  name: character.title,
  summary: character.tagline,
  imageUrl: character.thumbnailUrl ?? "",
}));

function toResourceCharacterPick(
  character: CharacterResource,
  seriesId: string,
  seriesTitle: string
): ImportableResourceCharacterPick {
  return {
    id: character.id,
    name: character.name,
    summary: character.summary,
    imageUrl: character.imageUrl,
    seriesId,
    seriesTitle,
  };
}

/** 내 작품 캐릭터 탭 — 시리즈별 리소스 등장인물 (캐릭터 불러오기 다이얼로그) */
export const IMPORT_CHARACTER_SERIES_GROUPS: ImportCharacterSeriesGroup[] = [
  {
    seriesId: "1",
    seriesTitle: "꽃에게는 독이 필요하다",
    characters: initialCharacters.slice(0, 5).map((character) =>
      toResourceCharacterPick(character, "1", "꽃에게는 독이 필요하다")
    ),
  },
  {
    seriesId: "2",
    seriesTitle: "달빛 아래 그대",
    characters: initialCharacters.slice(5).map((character) =>
      toResourceCharacterPick(character, "2", "달빛 아래 그대")
    ),
  },
];

/** @deprecated 시리즈 필터 없이 flat 목록이 필요할 때 — `IMPORT_CHARACTER_SERIES_GROUPS` 우선 */
export const RESOURCE_REGISTERED_CHARACTERS: ImportableResourceCharacterPick[] =
  IMPORT_CHARACTER_SERIES_GROUPS.flatMap((group) => group.characters);

/** 리소스 등장인물이 등록된 시리즈 (목업 — `sourceSeries` 미전달 시 폴백) */
export const DEFAULT_RESOURCE_SOURCE_SERIES = {
  id: "1",
  title: "꽃에게는 독이 필요하다",
} as const;

/** 불러오기 중복 판별용 — `seriesId:resourceCharacterId` */
export function importedResourceKey(seriesId: string, resourceCharacterId: string): string {
  return `${seriesId}:${resourceCharacterId}`;
}

/** 내 작품 목록에 이미 추가된 리소스 등장인물 키 (없으면 null) */
export function importedResourceKeyFromCharacter(character: CharacterData): string | null {
  if (!character.sourceSeries) return null;
  const prefix = `resource-${character.sourceSeries.id}-`;
  if (!character.id.startsWith(prefix)) return null;
  return importedResourceKey(character.sourceSeries.id, character.id.slice(prefix.length));
}

export function collectImportedResourceKeys(characters: CharacterData[]): Set<string> {
  const keys = new Set<string>();
  for (const character of characters) {
    const key = importedResourceKeyFromCharacter(character);
    if (key) keys.add(key);
  }
  return keys;
}

/** 리소스 등장인물 → 내 작품 캐릭터 카드 */
export function characterResourceToCharacterData(
  pick: ImportableCharacterPick & { sourceSeries?: CharacterSourceSeries }
): CharacterData {
  const sourceSeries = pick.sourceSeries ?? DEFAULT_RESOURCE_SOURCE_SERIES;

  return {
    id: `resource-${sourceSeries.id}-${pick.id}`,
    title: pick.name,
    tagline: pick.summary ?? "",
    thumbnailUrl: pick.imageUrl,
    status: "PRIVATE",
    createdAt: new Date().toISOString(),
    viewCount: 0,
    stat1: 0,
    stat2: 0,
    sourceSeries,
  };
}
