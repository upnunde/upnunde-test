/**
 * 페이지·카드 본문 인셋 — DS Spacing Semantic (`space.layout` · `space.section` · `space.list`)
 * 앱 셸은 `pagePaddingY` 대신 `PAGE_SCROLL_TOP` + `scrollBottom` 조합.
 */

import { APP_BROWSER_BG_CLASS } from "@/lib/mobile-viewport";

/** 페이지·카드 좌우 인셋 — 모바일·lg+ 공통 20px */
export const PAGE_GUTTER_X_CLASS = "px-5";

/**
 * 풀블리드 카드·섹션 내부 좌우 인셋 — 20px (`space.section.sectionPadding` X축).
 * 에디터 본문(`EDITOR_PAGE_SCROLL_CLASS`) 제외.
 */
export const PAGE_FLUSH_CONTENT_PAD_X_CLASS = "px-5";

/** 페이지·섹션 스택 간격 — 모바일 12px · lg+ 20px */
export const PAGE_GUTTER_GAP_CLASS = "gap-3 lg:gap-5";

/** 카드 섹션 헤더·본문·푸터 좌우 인셋 — 20px */
export const PAGE_CONTENT_PAD_X_CLASS = PAGE_FLUSH_CONTENT_PAD_X_CLASS;

/** 카드 본문 — 20px 인셋 */
export const PAGE_CONTENT_BODY_CLASS = "p-5";

/** 카드 하단 액션 바 — 좌우 section pad X · 상하 16px */
export const PAGE_CONTENT_FOOTER_CLASS = `${PAGE_CONTENT_PAD_X_CLASS} py-4`;

/** 카드 하단 취소·저장 등 — 모바일 form 42px · lg+ 36px */
export const PAGE_FOOTER_ACTION_BUTTON_CLASS =
  "lg:h-9 lg:min-h-9 lg:min-w-18 lg:px-3 lg:text-body2_500";

/** 메인 스크롤 영역 — max-width 컨테이너 바깥 가로 여백 */
export const PAGE_SCROLL_GUTTER_CLASS = PAGE_GUTTER_X_CLASS;

/** 스크롤 영역 마지막 콘텐츠 하단 여백 — 80px */
export const PAGE_SCROLL_BOTTOM_CLASS = "pb-20";

/**
 * 스크롤 영역 상단 여백 — 모바일 12px · lg+ 40px.
 * DS `pagePaddingY`는 앱 셸에 쓰지 않음(상·하 비대칭).
 */
export const PAGE_SCROLL_TOP_CLASS = "max-lg:pt-3 lg:pt-10";

/**
 * 모바일: 문서(body) 스크롤 — 콘텐츠 높이만큼 부모가 늘어나야 sticky containing block이 유효함.
 * (flex-1+min-h-0이면 main 높이가 뷰포트에 고정되어 sticky가 즉시 풀림)
 * 데스크톱: flex-1 내부 스크롤
 */
const PAGE_SCROLL_MOBILE_FILL_CLASS = "";
const PAGE_SCROLL_LG_TRAP_CLASS = "lg:min-h-0 lg:flex-1 lg:overflow-y-auto";

/**
 * 앱 본문 유일 main — AppShell·StandaloneHeaderPage에서 한 번만 사용.
 * 모바일: 콘텐츠 높이만큼 확장(문서 스크롤·sticky) / lg: flex-1 내부 스크롤
 */
export const APP_MAIN_CLASS =
  `flex min-w-0 w-full flex-col ${APP_BROWSER_BG_CLASS} max-lg:overflow-visible lg:min-h-0 lg:flex-1 lg:overflow-hidden`;

/** AppShell·시리즈 페이지 본문 패널 */
export const APP_MAIN_PANEL_CLASS =
  "flex w-full flex-col max-lg:overflow-visible lg:min-h-0 lg:flex-1 lg:overflow-hidden";

/** 서브헤더 + 스크롤 본문을 한 덩어리로 묶는 페이지 셸(리소스 상세·관리 등) */
export const PAGE_SUBHEADER_PAGE_SHELL_CLASS = `${APP_MAIN_PANEL_CLASS} ${APP_BROWSER_BG_CLASS}`;

/**
 * AppShell 사이드바+본문 행
 * - 모바일: flex-1/min-h-0 없음 · overflow-visible (sticky 조상 트랩 금지, `display:contents` 사용 금지)
 * - 데스크톱: flex-row + flex-1 내부 스크롤
 */
export const APP_SHELL_BODY_ROW_CLASS =
  "relative flex w-full min-w-0 flex-col max-lg:overflow-visible lg:min-h-0 lg:flex-1 lg:flex-row lg:overflow-hidden";

const PAGE_SCROLL_ROOT_LAYOUT_CLASS =
  `flex flex-col max-lg:overflow-visible ${PAGE_SCROLL_MOBILE_FILL_CLASS} ${PAGE_SCROLL_LG_TRAP_CLASS} ${PAGE_SCROLL_TOP_CLASS} ${PAGE_SCROLL_GUTTER_CLASS} ${PAGE_SCROLL_BOTTOM_CLASS}`;

/** AppShell main 스크롤 루트 — 상단·가로 인셋 · 하단 80px */
export const PAGE_SCROLL_ROOT_CLASS = `${PAGE_SCROLL_ROOT_LAYOUT_CLASS} ${APP_BROWSER_BG_CLASS}`;

/** 스크롤 루트 배경 없음 — AppShell browser base(모바일 canvas-muted · lg+ canvas)가 비치도록 */
export const PAGE_SCROLL_ROOT_TRANSPARENT_CLASS = PAGE_SCROLL_ROOT_LAYOUT_CLASS;

/** 모바일 풀블리드 스크롤 루트 — 외곽 패딩만 제거(콘텐츠 gap은 페이지에서 유지) */
export const PAGE_SCROLL_ROOT_MOBILE_FLUSH_CLASS = "max-lg:pt-0 max-lg:px-0 max-lg:pb-0";

/** 모바일 풀블리드 카드 셸 — 테두리·모서리 라운드 제거 */
export const PAGE_CARD_SHELL_MOBILE_FLUSH_CLASS = "max-lg:rounded-none max-lg:border-0";

/** fullWidth PageCard — 가로 인셋 없음(스크롤 루트·내부 flush 토큰이 담당) */
export const PAGE_CARD_FULL_WIDTH_PAD_X_CLASS = "max-lg:px-0 lg:px-0";

/** 모바일 목록 행 — 아웃라인 없이 divider로 구분 (에피소드 등) */
export const PAGE_MOBILE_LIST_ITEM_CARD_CLASS =
  "max-lg:border-b max-lg:border-divider max-lg:bg-background max-lg:py-4 max-lg:last:border-b-0";

/** 모바일 목록 스택 — divider 행은 gap 없음 */
export const PAGE_MOBILE_LIST_STACK_GAP_CLASS = "max-lg:gap-0";

/** AppShell main 스크롤 루트 — 상단 여백 · 가로 인셋 · 하단 80px */
export const PAGE_SCROLL_ROOT_TOP_CLASS =
  `flex flex-col ${APP_BROWSER_BG_CLASS} max-lg:overflow-visible ${PAGE_SCROLL_LG_TRAP_CLASS} ${PAGE_SCROLL_TOP_CLASS} ${PAGE_SCROLL_GUTTER_CLASS} ${PAGE_SCROLL_BOTTOM_CLASS}`;

/** @deprecated 서브헤더 sticky 미사용 */
export const PAGE_SUBHEADER_STICKY_CLASS = "";

/** 모바일 sticky 글로벌 헤더(h-14) 바로 아래 — 필터·탭 띠 전용 */
export const PAGE_FILTER_HEADER_STICKY_CLASS =
  "max-lg:sticky max-lg:top-14 max-lg:z-overlay";

/** 서브 페이지 상단 바(뒤로가기·제목) — 모바일 56px · lg+ 64px · 좌우 20px */
export const PAGE_SUBHEADER_CLASS =
  `flex h-14 w-full shrink-0 items-center justify-center border-b border-border bg-background ${PAGE_FLUSH_CONTENT_PAD_X_CLASS} py-0 lg:h-16`;

/** 필터 띠와 함께 쓰는 서브헤더 */
export const PAGE_SUBHEADER_WITH_FILTER_CLASS = PAGE_SUBHEADER_CLASS;

/** @deprecated `PAGE_SUBHEADER_CLASS`와 동일 — 서브헤더 sticky 미사용 */
export const PAGE_SUBHEADER_WITH_STICKY_CLASS = PAGE_SUBHEADER_CLASS;

/**
 * 상단 필터 띠 셸 — 스크롤 본문과 형제로 배치.
 * 모바일 글로벌 헤더 아래 sticky.
 */
export const PAGE_FILTER_HEADER_SHELL_CLASS = [
  "flex w-full shrink-0 flex-col items-center border-b border-border bg-background",
  PAGE_FLUSH_CONTENT_PAD_X_CLASS,
  "py-3",
  PAGE_FILTER_HEADER_STICKY_CLASS,
].join(" ");

/** @deprecated `PAGE_FILTER_HEADER_SHELL_CLASS` 사용 */
export const PAGE_FILTER_HEADER_CLASS = PAGE_FILTER_HEADER_SHELL_CLASS;

/** 필터 띠 내부 max-width 컨테이너 */
export const PAGE_FILTER_HEADER_INNER_CLASS = "w-full min-w-0 max-w-[1200px]";

/** 인라인 탭 띠 셸(알림·문의 등) — 모바일 헤더 아래 sticky, 하단 구분선 유지 */
export const PAGE_INLINE_TAB_STRIP_SHELL_CLASS = [
  "w-full shrink-0 border-b border-border bg-background",
  PAGE_GUTTER_X_CLASS,
  PAGE_FILTER_HEADER_STICKY_CLASS,
].join(" ");

/** 스크롤 + 중앙 정렬 레이아웃(리소스 상세·목록 등) */
export const PAGE_SCROLL_COLUMN_CLASS =
  `flex flex-col items-center ${APP_BROWSER_BG_CLASS} max-lg:overflow-visible ${PAGE_SCROLL_MOBILE_FILL_CLASS} ${PAGE_SCROLL_LG_TRAP_CLASS} ${PAGE_SCROLL_TOP_CLASS} ${PAGE_GUTTER_GAP_CLASS} ${PAGE_GUTTER_X_CLASS} ${PAGE_SCROLL_BOTTOM_CLASS}`;

/** PAGE_SCROLL_COLUMN 스크롤 루트 식별자 — 모바일 헤더 접힘 훅용 */
export const PAGE_SCROLL_COLUMN_ROOT_ATTR = "data-page-scroll-column-root";

/**
 * 모바일 시리즈 타이틀 띠 — 풀폭 surface(`bg-background`).
 * 스크롤 상단·가로 인셋을 띠가 담당한다. 스크롤 루트는 `max-lg:px-0 max-lg:pt-0`.
 */
export const PAGE_SERIES_TITLE_BAND_CLASS =
  "flex w-full min-w-0 shrink-0 flex-col gap-3 self-stretch px-0 max-lg:bg-background max-lg:px-5 max-lg:pt-6 max-lg:pb-3 lg:flex-row lg:items-center lg:justify-between";

/** @deprecated 스크롤 루트 `max-lg:px-0` + `PAGE_SERIES_TITLE_BAND_CLASS` 사용 */
export const PAGE_SERIES_TITLE_BAND_BREAKOUT_CLASS = "max-lg:-mx-5";

/** 타이틀 띠 아래 본문 — 스크롤이 `max-lg:px-0`일 때 모바일 가로 인셋 + surface */
export const PAGE_SERIES_BODY_GUTTER_CLASS = "max-lg:bg-background max-lg:px-5";

/** 모바일 하단 고정 액션 바(36px 버튼 + py-12×2) 위 스크롤 하단 여백 */
export const PAGE_MOBILE_FIXED_ACTION_BAR_SCROLL_PAD_CLASS =
  "max-lg:pb-[calc(var(--space-20)+var(--space-3)+var(--space-9)+var(--space-3)+env(safe-area-inset-bottom,0px))]";

/** 본문·카드·서브헤더 내부 — 모바일 가로 스크롤 방지 (min-w-0) */
export const PAGE_CONTAINER_CLASS = "w-full min-w-0 max-w-[1200px] mx-auto";

/** max-width 컨테이너 + 세로 스택(정산·프로필 등 — 세로 패딩은 PAGE_SCROLL_ROOT_CLASS) */
export const PAGE_STACK_CLASS =
  `${PAGE_CONTAINER_CLASS} flex flex-col ${PAGE_GUTTER_GAP_CLASS}`;

/** 넓은 폼·모달 (에피소드 폼 등) */
export const PAGE_MODAL_WIDE_CLASS = "w-[min(92vw,760px)] max-w-[760px] min-w-0";

/** 에디터·에피소드 상세 본문 — 모바일: 헤더 아래 내부 스크롤 / lg: 패널 내부 스크롤 · 편집 면은 background */
export const EDITOR_PAGE_SCROLL_CLASS =
  "flex min-w-0 flex-col overscroll-none bg-background lg:relative lg:z-0 lg:min-h-0 lg:flex-1 lg:overflow-y-auto";
