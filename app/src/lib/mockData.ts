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
  { id: "bg-1", name: "School_Day", url: "https://picsum.photos/seed/school/400/700" },
  { id: "bg-2", name: "Night_Street", url: "https://picsum.photos/seed/night/400/700" },
  { id: "bg-3", name: "Cafe_Interior", url: "https://picsum.photos/seed/cafe/400/700" },
  { id: "bg-4", name: "Park_Spring", url: "https://picsum.photos/seed/park/400/700" },
  { id: "bg-5", name: "Room_Cozy", url: "https://picsum.photos/seed/room/400/700" },
];

export const CHARACTERS: CharacterItem[] = [
  { id: "char-1", name: "민수", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=minsoo" },
  { id: "char-2", name: "지은", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=jieun" },
  { id: "char-3", name: "준호", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=junho" },
  { id: "char-4", name: "수진", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=sujin" },
  { id: "char-5", name: "현우", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=hyunwoo" },
  { id: "char-6", name: "서연", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=seoyeon" },
  { id: "char-7", name: "도윤", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=doyoon" },
  { id: "char-8", name: "하린", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=harin" },
];

export const BGMS: AudioItem[] = [
  { id: "bgm-1", name: "Calm_Piano", fileUrl: "/audio/calm_piano.mp3" },
  { id: "bgm-2", name: "City_Evening", fileUrl: "/audio/city_evening.mp3" },
  { id: "bgm-3", name: "Romantic_Strings", fileUrl: "/audio/romantic_strings.mp3" },
  { id: "bgm-4", name: "Light_Rain", fileUrl: "/audio/light_rain.mp3" },
  { id: "bgm-5", name: "Cafe_Ambient", fileUrl: "/audio/cafe_ambient.mp3" },
];

export const SFX: AudioItem[] = [
  { id: "sfx-1", name: "Door_Open", fileUrl: "/audio/sfx_door_open.mp3" },
  { id: "sfx-2", name: "Phone_Ring", fileUrl: "/audio/sfx_phone_ring.mp3" },
  { id: "sfx-3", name: "Footsteps", fileUrl: "/audio/sfx_footsteps.mp3" },
  { id: "sfx-4", name: "Click", fileUrl: "/audio/sfx_click.mp3" },
  { id: "sfx-5", name: "Wind", fileUrl: "/audio/sfx_wind.mp3" },
];

export const GALLERIES: GalleryItem[] = [
  { id: "gallery-1", name: "gallery_1", url: "https://picsum.photos/seed/gallery1/400/700" },
  { id: "gallery-2", name: "gallery_2", url: "https://picsum.photos/seed/gallery2/400/700" },
  { id: "gallery-3", name: "gallery_3", url: "https://picsum.photos/seed/gallery3/400/700" },
];
