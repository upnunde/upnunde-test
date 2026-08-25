/** 반응 — 작품에 대한 댓글·팔로우 모아보기 */

export type ReactionTab = "comments" | "follows";

export type WorkLike = {
  id: string;
  seriesId: string;
  seriesTitle: string;
  episodeLabel: string;
  authorName: string;
  createdAt: string;
};

export type WorkFollow = {
  id: string;
  authorName: string;
  createdAt: string;
  /** 구독(팔로우)한 작품 — 전체 계정 팔로우면 null */
  seriesTitle: string | null;
};
