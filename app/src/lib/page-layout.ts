/**
 * 페이지·카드 본문 인셋 — design-system spacing-20(20px) = Tailwind `p-5` / `px-5`
 */

/** 카드 섹션 헤더·본문·푸터 좌우 인셋 */
export const PAGE_CONTENT_PAD_X_CLASS = "px-my-20";

/** 카드 본문(폼 필드 묶음) */
export const PAGE_CONTENT_BODY_CLASS = "px-my-20 py-my-20";

/** 카드 하단 액션 바 */
export const PAGE_CONTENT_FOOTER_CLASS = "px-my-20 py-my-16";

/** 메인 스크롤 영역 — max-width 컨테이너 바깥 가로 여백 */
export const PAGE_SCROLL_GUTTER_CLASS = "px-my-20";

/** 서브 페이지 상단 바(뒤로가기·제목) */
export const PAGE_SUBHEADER_CLASS =
  "flex h-my-64 shrink-0 items-center justify-center border-b border-border-10 bg-white px-my-20 py-0";

/** 스크롤 + 중앙 정렬 레이아웃(리소스 상세·목록 등) */
export const PAGE_SCROLL_COLUMN_CLASS =
  "flex-1 overflow-y-auto flex flex-col items-center py-my-32 gap-my-16 px-my-20";

/** 본문·카드·서브헤더 내부 — 모바일 가로 스크롤 방지 (min-w-0) */
export const PAGE_CONTAINER_CLASS = "w-full min-w-0 max-w-[1200px] mx-auto";

/** 넓은 폼·모달 (에피소드 폼 등) */
export const PAGE_MODAL_WIDE_CLASS = "w-[min(92vw,760px)] max-w-[760px] min-w-0";
