import type { WorkFollow, WorkLike } from "@/types/reaction";

export const MOCK_WORK_LIKES: WorkLike[] = [
  {
    id: "l1",
    seriesId: "1",
    seriesTitle: "꽃에게는 독이 필요하다",
    episodeLabel: "120화",
    authorName: "novel_lover",
    createdAt: "3분 전",
  },
  {
    id: "l2",
    seriesId: "1",
    seriesTitle: "꽃에게는 독이 필요하다",
    episodeLabel: "120화",
    authorName: "moonreader",
    createdAt: "18분 전",
  },
  {
    id: "l3",
    seriesId: "1",
    seriesTitle: "꽃에게는 독이 필요하다",
    episodeLabel: "119화",
    authorName: "fanclub_a",
    createdAt: "어제",
  },
  {
    id: "l4",
    seriesId: "2",
    seriesTitle: "달빛 아래 그대",
    episodeLabel: "50화",
    authorName: "soft_night",
    createdAt: "어제",
  },
  {
    id: "l5",
    seriesId: "2",
    seriesTitle: "달빛 아래 그대",
    episodeLabel: "48화",
    authorName: "bookworm",
    createdAt: "2025.12.18",
  },
];

export const MOCK_WORK_FOLLOWS: WorkFollow[] = [
  {
    id: "f1",
    authorName: "new_reader_01",
    createdAt: "10분 전",
    seriesTitle: "꽃에게는 독이 필요하다",
  },
  {
    id: "f2",
    authorName: "nightowl",
    createdAt: "1시간 전",
    seriesTitle: null,
  },
  {
    id: "f3",
    authorName: "bloom_fan",
    createdAt: "어제",
    seriesTitle: "달빛 아래 그대",
  },
  {
    id: "f4",
    authorName: "quiet_room",
    createdAt: "2025.12.20",
    seriesTitle: "꽃에게는 독이 필요하다",
  },
];
