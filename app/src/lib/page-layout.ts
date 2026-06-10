/**
 * 페이지·카드 본문 인셋 — design-system spacing
 * 모바일 가로 16px · lg+ 20px → `docs/mobile-layout.md`
 */

/** 페이지·카드 좌우 인셋 — 모바일 16px · lg+ 20px */
export const PAGE_GUTTER_X_CLASS = "px-my-16 lg:px-my-20";

/** 페이지·섹션 스택 간격 — 모바일 12px · lg+ 20px */
export const PAGE_GUTTER_GAP_CLASS = "gap-my-12 lg:gap-my-20";

/** 카드 섹션 헤더·본문·푸터 좌우 인셋 */
export const PAGE_CONTENT_PAD_X_CLASS = PAGE_GUTTER_X_CLASS;

/** 카드 본문(폼 필드 묶음) */
export const PAGE_CONTENT_BODY_CLASS = `${PAGE_GUTTER_X_CLASS} py-my-20`;

/** 카드 하단 액션 바 */
export const PAGE_CONTENT_FOOTER_CLASS = `${PAGE_GUTTER_X_CLASS} py-my-16`;

/** 메인 스크롤 영역 — max-width 컨테이너 바깥 가로 여백 */
export const PAGE_SCROLL_GUTTER_CLASS = PAGE_GUTTER_X_CLASS;

/** 스크롤 영역 마지막 콘텐츠 하단 여백 — 80px (모든 뷰포트 공통) */
export const PAGE_SCROLL_BOTTOM_CLASS = "pb-my-80";

/** 스크롤 영역 상단 여백 — 모바일 20px · lg+ 32px */
export const PAGE_SCROLL_TOP_CLASS = "pt-my-20 lg:pt-my-32";

/** AppShell main 스크롤 루트 — py-0 · 가로 인셋 · 하단 80px */
export const PAGE_SCROLL_ROOT_CLASS =
  `flex min-h-0 flex-1 flex-col overflow-y-auto py-0 ${PAGE_SCROLL_GUTTER_CLASS} ${PAGE_SCROLL_BOTTOM_CLASS}`;

/** AppShell main 스크롤 루트 — 상단 여백 · 가로 인셋 · 하단 80px */
export const PAGE_SCROLL_ROOT_TOP_CLASS =
  `flex flex-1 flex-col overflow-y-auto ${PAGE_SCROLL_TOP_CLASS} ${PAGE_SCROLL_GUTTER_CLASS} ${PAGE_SCROLL_BOTTOM_CLASS}`;

/** 서브 페이지 상단 바(뒤로가기·제목) — 모바일 56px · lg+ 64px */
export const PAGE_SUBHEADER_CLASS =
  `flex h-my-56 w-full shrink-0 items-center justify-center border-b border-border-10 bg-white ${PAGE_GUTTER_X_CLASS} py-0 lg:h-my-64`;

/** 스크롤 + 중앙 정렬 레이아웃(리소스 상세·목록 등) */
export const PAGE_SCROLL_COLUMN_CLASS =
  `flex-1 overflow-y-auto flex flex-col items-center ${PAGE_SCROLL_TOP_CLASS} ${PAGE_GUTTER_GAP_CLASS} ${PAGE_GUTTER_X_CLASS} ${PAGE_SCROLL_BOTTOM_CLASS}`;

/** PAGE_SCROLL_COLUMN 스크롤 루트 식별자 — 모바일 헤더 접힘 훅용 */
export const PAGE_SCROLL_COLUMN_ROOT_ATTR = "data-page-scroll-column-root";

/** 모바일 하단 고정 액션 바(36px 버튼 + py-12×2) 위 스크롤 하단 여백 */
export const PAGE_MOBILE_FIXED_ACTION_BAR_SCROLL_PAD_CLASS =
  "max-lg:pb-[calc(var(--spacing-my-80)+var(--spacing-my-12)+var(--spacing-my-36)+var(--spacing-my-12)+env(safe-area-inset-bottom,0px)+var(--app-vv-bottom,0px))]";

/** 본문·카드·서브헤더 내부 — 모바일 가로 스크롤 방지 (min-w-0) */
export const PAGE_CONTAINER_CLASS = "w-full min-w-0 max-w-[1200px] mx-auto";

/** max-width 컨테이너 + 세로 스택(정산·프로필 등 AppShell 본문) */
export const PAGE_STACK_CLASS =
  `${PAGE_CONTAINER_CLASS} flex flex-col ${PAGE_GUTTER_GAP_CLASS} py-my-20`;

/** 넓은 폼·모달 (에피소드 폼 등) */
export const PAGE_MODAL_WIDE_CLASS = "w-[min(92vw,760px)] max-w-[760px] min-w-0";
