/** 댓글관리 — 네이버 크리에이터스 댓글관리 구조 참고 */

export type CommentManagementTab = "all" | "pick" | "restricted";

export type WorkComment = {
  id: string;
  seriesId: string;
  seriesTitle: string;
  episodeLabel: string;
  authorName: string;
  content: string;
  createdAt: string;
  likeCount: number;
  replyCount: number;
  /** 작가가 PICK한 댓글 — 독자 화면 상단 고정 */
  isPicked: boolean;
  /** 작가가 직접 작성한 댓글 — CREATOR 뱃지 */
  isCreator: boolean;
};

export type RestrictedCommenter = {
  id: string;
  authorName: string;
  restrictedAt: string;
  reason: string;
  seriesTitle: string;
};
