/**
 * Mock resource data for Safe Default flow.
 * Used by SlashCommandMenu (default value) and ResourcePicker (selection).
 */

export interface BackgroundItem {
  id: string;
  name: string;
  url: string;
}

export interface CharacterItem {
  id: string;
  name: string;
  url: string;
}

export interface AudioItem {
  id: string;
  name: string;
  fileUrl: string;
}

export interface GalleryItem {
  id: string;
  name: string;
  url: string;
}

export const BACKGROUNDS: BackgroundItem[] = [
  { id: "bg-1", name: "교실", url: "/background-1.png" },
  { id: "bg-2", name: "강변 산책로", url: "/background-2.png" },
  { id: "bg-3", name: "주택가 노을", url: "/background-3.png" },
  { id: "bg-4", name: "베이커리_낮", url: "/background-bakery-day.png" },
  { id: "bg-5", name: "부엌_밤", url: "/background-kitchen-night.png" },
  { id: "bg-6", name: "베이커리_밤", url: "/background-bakery-night.png" },
  { id: "bg-7", name: "부엌_비오는날", url: "/background-kitchen-rain.png" },
  { id: "bg-8", name: "거리_낮", url: "/background-street-day.png" },
  { id: "bg-9", name: "내방_밤", url: "/background-room-night.png" },
  { id: "bg-10", name: "거리_밤", url: "/background-street-night.png" },
  { id: "bg-11", name: "내방_낮", url: "/background-room-day.png" },
  { id: "bg-12", name: "거리_노을", url: "/background-street-evening.png" },
  { id: "bg-13", name: "베이커리_노을", url: "/background-bakery-evening.png" },
  { id: "bg-14", name: "내방_비오는날", url: "/background-room-rain.png" },
  { id: "bg-15", name: "부엌_낮", url: "/background-kitchen-day.png" },
  { id: "bg-16", name: "베이커리_비오는날", url: "/background-bakery-rain.png" },
  { id: "bg-17", name: "거실_낮", url: "/background-livingroom-day.png" },
  { id: "bg-18", name: "내방_노을", url: "/background-room-evening.png" },
  { id: "bg-19", name: "부엌_노을", url: "/background-kitchen-evening.png" },
];

export const CHARACTERS: CharacterItem[] = [
  { id: "char-1", name: "등장인물1", url: "/character-1.png" },
  { id: "char-2", name: "등장인물2", url: "/character-2.png" },
  { id: "char-3", name: "등장인물3", url: "/character-3.png" },
  { id: "char-4", name: "등장인물4", url: "/character-4.png" },
];

export const BGMS: AudioItem[] = [
  { id: "bgm-1", name: "빛의 성가", fileUrl: "/audio/bgm-1.mp3" },
  { id: "bgm-2", name: "마법의 숲", fileUrl: "/audio/bgm-2.mp3" },
  { id: "bgm-3", name: "용자의 여정", fileUrl: "/audio/bgm-3.mp3" },
  { id: "bgm-4", name: "신성한 유적", fileUrl: "/audio/bgm-4.mp3" },
  { id: "bgm-5", name: "침묵의 복도", fileUrl: "/audio/bgm-5.mp3" },
  { id: "bgm-6", name: "낡은 저택", fileUrl: "/audio/bgm-6.mp3" },
  { id: "bgm-7", name: "속삭이는 그림자", fileUrl: "/audio/bgm-7.mp3" },
  { id: "bgm-8", name: "붉은 달밤", fileUrl: "/audio/bgm-8.mp3" },
  { id: "bgm-9", name: "봄날의 고백", fileUrl: "/audio/bgm-9.mp3" },
  { id: "bgm-10", name: "달빛 산책", fileUrl: "/audio/bgm-10.mp3" },
  { id: "bgm-11", name: "두근두근 러브송", fileUrl: "/audio/bgm-11.mp3" },
  { id: "bgm-12", name: "별빛 약속", fileUrl: "/audio/bgm-12.mp3" },
];

export const SFX: AudioItem[] = [
  { id: "sfx-1", name: "Door_Open", fileUrl: "/audio/sfx_door_open.mp3" },
  { id: "sfx-2", name: "Phone_Ring", fileUrl: "/audio/sfx_phone_ring.mp3" },
  { id: "sfx-3", name: "Footsteps", fileUrl: "/audio/sfx_footsteps.mp3" },
  { id: "sfx-4", name: "Click", fileUrl: "/audio/sfx_click.mp3" },
  { id: "sfx-5", name: "Wind", fileUrl: "/audio/sfx_wind.mp3" },
];

export const GALLERIES: GalleryItem[] = [
  { id: "gallery-1", name: "갤러리1", url: "/gallery-G3.png" },
  { id: "gallery-2", name: "갤러리2", url: "/gallery-G4.png" },
  { id: "gallery-3", name: "갤러리3", url: "/gallery-G5.png" },
  { id: "gallery-4", name: "갤러리4", url: "/gallery-G6.png" },
  { id: "gallery-5", name: "갤러리5", url: "/gallery-G7.png" },
  { id: "gallery-6", name: "갤러리6", url: "/gallery-G8.png" },
  { id: "gallery-7", name: "갤러리7", url: "/gallery-G9.png" },
  { id: "gallery-8", name: "갤러리8", url: "/gallery-G10.png" },
  { id: "gallery-9", name: "갤러리9", url: "/gallery-G11.png" },
];
