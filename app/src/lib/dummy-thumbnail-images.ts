import { dummyAsset } from "@/lib/dummy-asset-path";

/** 시리즈·에피소드 썸네일용 — 배경 + 갤러리 더미 (등장인물·연출 제외) */
const BACKGROUND_THUMBNAIL_FILES = [
  "background-1.png",
  "background-2.png",
  "background-3.png",
  "background-bakery-day.png",
  "background-kitchen-night.png",
  "background-bakery-night.png",
  "background-kitchen-rain.png",
  "background-street-day.png",
  "background-room-night.png",
  "background-street-night.png",
  "background-room-day.png",
  "background-street-evening.png",
  "background-bakery-evening.png",
  "background-room-rain.png",
  "background-kitchen-day.png",
  "background-bakery-rain.png",
  "background-livingroom-day.png",
  "background-room-evening.png",
  "background-kitchen-evening.png",
] as const;

const GALLERY_THUMBNAIL_FILES = [
  "gallery-G3.png",
  "gallery-G4.png",
  "gallery-G5.png",
  "gallery-G6.png",
  "gallery-G7.png",
  "gallery-G8.png",
  "gallery-G9.png",
  "gallery-G10.png",
  "gallery-G11.png",
] as const;

export const DUMMY_BACKGROUND_GALLERY_THUMBNAILS = [
  ...BACKGROUND_THUMBNAIL_FILES.map(dummyAsset),
  ...GALLERY_THUMBNAIL_FILES.map(dummyAsset),
] as const;

export const DUMMY_DEFAULT_THUMBNAIL = dummyAsset("background-1.png");
