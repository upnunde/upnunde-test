import { dummyAsset } from "@/lib/dummy-asset-path";
import type { ImageResource, MediaResource, CharacterResource } from "@/types/resource";

const MOCK_HAS_RESOURCES = true;

const BACKGROUND_LIST: ImageResource[] = MOCK_HAS_RESOURCES
  ? [
      { id: "1", name: "교실", imageUrl: dummyAsset("background-1.png") },
      { id: "2", name: "강변 산책로", imageUrl: dummyAsset("background-2.png") },
      { id: "3", name: "주택가 노을", imageUrl: dummyAsset("background-3.png") },
      { id: "4", name: "베이커리_낮", imageUrl: dummyAsset("background-bakery-day.png") },
      { id: "5", name: "부엌_밤", imageUrl: dummyAsset("background-kitchen-night.png") },
      { id: "6", name: "베이커리_밤", imageUrl: dummyAsset("background-bakery-night.png") },
      { id: "7", name: "부엌_비오는날", imageUrl: dummyAsset("background-kitchen-rain.png") },
      { id: "8", name: "거리_낮", imageUrl: dummyAsset("background-street-day.png") },
      { id: "9", name: "내방_밤", imageUrl: dummyAsset("background-room-night.png") },
      { id: "10", name: "거리_밤", imageUrl: dummyAsset("background-street-night.png") },
      { id: "11", name: "내방_낮", imageUrl: dummyAsset("background-room-day.png") },
      { id: "12", name: "거리_노을", imageUrl: dummyAsset("background-street-evening.png") },
      { id: "13", name: "베이커리_노을", imageUrl: dummyAsset("background-bakery-evening.png") },
      { id: "14", name: "내방_비오는날", imageUrl: dummyAsset("background-room-rain.png") },
      { id: "15", name: "부엌_낮", imageUrl: dummyAsset("background-kitchen-day.png") },
      { id: "16", name: "베이커리_비오는날", imageUrl: dummyAsset("background-bakery-rain.png") },
      { id: "17", name: "거실_낮", imageUrl: dummyAsset("background-livingroom-day.png") },
      { id: "18", name: "내방_노을", imageUrl: dummyAsset("background-room-evening.png") },
      { id: "19", name: "부엌_노을", imageUrl: dummyAsset("background-kitchen-evening.png") },
    ]
  : [];

const SCENE_IMAGE_PATHS = [
  dummyAsset("scene-camera-act.png"),
  dummyAsset("scene-accident-memory.png"),
  dummyAsset("scene-cafe-step.png"),
  dummyAsset("scene-hajoon-garam-tears.png"),
  dummyAsset("scene-hajoon-garam-memory.png"),
  dummyAsset("scene-hajoon-accident.png"),
  dummyAsset("scene-hajoon-ian.png"),
  dummyAsset("scene-hand-promise.png"),
  dummyAsset("scene-ian-hand-moment.png"),
  dummyAsset("scene-garam-play-cello.png"),
  dummyAsset("scene-ian-memory.png"),
  dummyAsset("scene-ian-nametag.png"),
  dummyAsset("scene-hajoon-tears.png"),
  dummyAsset("scene-siwoo-cat.png"),
  dummyAsset("scene-siwoo-run.png"),
  dummyAsset("scene-ian-tears.png"),
  dummyAsset("scene-ian-post.png"),
  dummyAsset("scene-smoothie.png"),
  dummyAsset("scene-university-guy2.png"),
  dummyAsset("scene-university-guy1.png"),
] as const;

const SCENE_LIST: ImageResource[] = MOCK_HAS_RESOURCES
  ? SCENE_IMAGE_PATHS.map((path, index) => ({
      id: String(index + 1),
      name: `연출${index + 1}`,
      imageUrl: path,
    }))
  : [];

const GALLERY_IMAGE_PATHS = [
  dummyAsset("gallery-G3.png"),
  dummyAsset("gallery-G4.png"),
  dummyAsset("gallery-G5.png"),
  dummyAsset("gallery-G6.png"),
  dummyAsset("gallery-G7.png"),
  dummyAsset("gallery-G8.png"),
  dummyAsset("gallery-G9.png"),
  dummyAsset("gallery-G10.png"),
  dummyAsset("gallery-G11.png"),
] as const;

const GALLERY_LIST: ImageResource[] = MOCK_HAS_RESOURCES
  ? Array.from({ length: GALLERY_IMAGE_PATHS.length }, (_, i) => ({
      id: String(i + 1),
      name: `갤러리${i + 1}`,
      imageUrl: GALLERY_IMAGE_PATHS[i],
    }))
  : [];

const MEDIA_LIST: MediaResource[] = MOCK_HAS_RESOURCES
  ? [
      { id: "1", name: "베란다_노을", thumbnailUrl: dummyAsset("media-veranda-evening.png"), duration: "00:00" },
      { id: "2", name: "베란다_비오는날", thumbnailUrl: dummyAsset("media-veranda-rain.png"), duration: "00:00" },
      { id: "3", name: "베란다_밤하늘", thumbnailUrl: dummyAsset("media-veranda-night.png"), duration: "00:00" },
      { id: "4", name: "베란다_맑은낮", thumbnailUrl: dummyAsset("media-veranda-day.png"), duration: "00:00" },
      { id: "5", name: "비오는_골목길", thumbnailUrl: dummyAsset("media-street-rain.png"), duration: "00:00" },
    ]
  : [];

const CHARACTER_LIST: CharacterResource[] = MOCK_HAS_RESOURCES
  ? [
      {
        id: "1",
        name: "등장인물1",
        imageUrl: dummyAsset("character-1.png"),
        summary: "사람의 소리를 볼 수 있는 소리 수집가 소년",
        tags: "고등학생, 사진, 츤데레",
        greeting: "안녕, 오늘도 사진 찍으러 나갈 준비됐지?",
        expressions: [
          { id: "char-1-exp-1", expressionLabel: "기본", imageUrl: dummyAsset("character-1.png") },
          { id: "char-1-exp-2", expressionLabel: "미소", imageUrl: dummyAsset("character-1.png") },
          { id: "char-1-exp-3", expressionLabel: "당황", imageUrl: dummyAsset("character-1.png") },
        ],
      },
      {
        id: "2",
        name: "등장인물2",
        imageUrl: dummyAsset("character-2.png"),
        summary: "밝고 활발한 성격의 단짝 친구",
        tags: "친구, 밝음, 유머",
        greeting: "오늘 뭐 할 거야? 나랑 놀자!",
        expressions: [
          { id: "char-2-exp-1", expressionLabel: "기본", imageUrl: dummyAsset("character-2.png") },
          { id: "char-2-exp-2", expressionLabel: "환한 웃음", imageUrl: dummyAsset("character-2.png") },
          { id: "char-2-exp-3", expressionLabel: "삐짐", imageUrl: dummyAsset("character-2.png") },
          { id: "char-2-exp-4", expressionLabel: "장난기", imageUrl: dummyAsset("character-2.png") },
        ],
      },
      {
        id: "3",
        name: "등장인물3",
        imageUrl: dummyAsset("character-3.png"),
        summary: "차분하고 신중한 반장",
        tags: "반장, 책임감, 성실",
        greeting: "오늘도 수업 잘 부탁해.",
        expressions: [
          { id: "char-3-exp-1", expressionLabel: "무표정", imageUrl: dummyAsset("character-3.png") },
          { id: "char-3-exp-2", expressionLabel: "엄격", imageUrl: dummyAsset("character-3.png") },
          { id: "char-3-exp-3", expressionLabel: "걱정", imageUrl: dummyAsset("character-3.png") },
        ],
      },
      {
        id: "4",
        name: "등장인물4",
        imageUrl: dummyAsset("character-4.png"),
        summary: "몽상가 기질의 예술 소년",
        tags: "예술, 꿈, 감성",
        greeting: "이 풍경, 한 번 담아볼까.",
        expressions: [
          { id: "char-4-exp-1", expressionLabel: "기본", imageUrl: dummyAsset("character-4.png") },
          { id: "char-4-exp-2", expressionLabel: "사색", imageUrl: dummyAsset("character-4.png") },
          { id: "char-4-exp-3", expressionLabel: "감탄", imageUrl: dummyAsset("character-4.png") },
        ],
      },
      {
        id: "5",
        name: "등장인물5",
        imageUrl: dummyAsset("character-5.png"),
        summary: "차분하고 신비로운 분위기의 청년",
        tags: "차분함, 미스터리, 음악",
        greeting: ".... 신경 쓰지 마, 난 그냥 보고 있을 뿐이야.",
        expressions: [
          { id: "char-5-exp-1", expressionLabel: "무표정", imageUrl: dummyAsset("character-5.png") },
          { id: "char-5-exp-2", expressionLabel: "냉소", imageUrl: dummyAsset("character-5.png") },
        ],
      },
      {
        id: "6",
        name: "등장인물6",
        imageUrl: dummyAsset("character-6.png"),
        summary: "냉철한 카리스마를 가진 엘리트",
        tags: "엘리트, 카리스마, 냉정",
        greeting: "이 정도 일로 흔들리면, 여기까지 오지도 못했겠지.",
        expressions: [
          { id: "char-6-exp-1", expressionLabel: "기본", imageUrl: dummyAsset("character-6.png") },
          { id: "char-6-exp-2", expressionLabel: "단호", imageUrl: dummyAsset("character-6.png") },
          { id: "char-6-exp-3", expressionLabel: "분노", imageUrl: dummyAsset("character-6.png") },
        ],
      },
      {
        id: "7",
        name: "등장인물7",
        imageUrl: dummyAsset("character-7.png"),
        summary: "밝고 다정한 분위기의 친구",
        tags: "다정함, 친구, 긍정",
        greeting: "왔어? 오늘도 재밌는 하루로 만들어 보자.",
        expressions: [
          { id: "char-7-exp-1", expressionLabel: "기본", imageUrl: dummyAsset("character-7.png") },
          { id: "char-7-exp-2", expressionLabel: "활짝 웃음", imageUrl: dummyAsset("character-7.png") },
          { id: "char-7-exp-3", expressionLabel: "놀람", imageUrl: dummyAsset("character-7.png") },
          { id: "char-7-exp-4", expressionLabel: "울먹임", imageUrl: dummyAsset("character-7.png") },
        ],
      },
      {
        id: "8",
        name: "등장인물8",
        imageUrl: dummyAsset("character-8.png"),
        summary: "도시적인 이미지의 프로페셔널 커리어우먼",
        tags: "커리어우먼, 냉철, 프로",
        greeting: "반가워요. 오늘 협의할 안건부터 정리해 볼까요?",
        expressions: [
          { id: "char-8-exp-1", expressionLabel: "기본", imageUrl: dummyAsset("character-8.png") },
          { id: "char-8-exp-2", expressionLabel: "미소", imageUrl: dummyAsset("character-8.png") },
          { id: "char-8-exp-3", expressionLabel: "곤란", imageUrl: dummyAsset("character-8.png") },
          { id: "char-8-exp-4", expressionLabel: "집중", imageUrl: dummyAsset("character-8.png") },
        ],
      },
    ]
  : [];

export const initialBackgrounds = BACKGROUND_LIST;
export const initialScenes = SCENE_LIST;
export const initialGallery = GALLERY_LIST;
export const initialMedia = MEDIA_LIST;
export const initialCharacters = CHARACTER_LIST;

export function getBackgroundById(id: string): ImageResource | undefined {
  return BACKGROUND_LIST.find((item) => item.id === id);
}

export function getSceneById(id: string): ImageResource | undefined {
  return SCENE_LIST.find((item) => item.id === id);
}

export function getGalleryById(id: string): ImageResource | undefined {
  return GALLERY_LIST.find((item) => item.id === id);
}

export function getMediaById(id: string): MediaResource | undefined {
  return MEDIA_LIST.find((item) => item.id === id);
}

export function getCharacterById(id: string): CharacterResource | undefined {
  return CHARACTER_LIST.find((item) => item.id === id);
}
