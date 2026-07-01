/**
 * DS 파운데이션 검사 규칙 — docs/design-system.md · design-system/spacing-tokens.ts 정본
 */

/** @type {readonly string[]} DS SPACING_SCALE token (px, 0.5 … 20) */
export const DS_SPACING_TOKENS = [
  "0",
  "px",
  "0.5",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "8",
  "10",
  "12",
  "16",
  "20",
];

export const DS_SPACING_UTILITY_PREFIXES = [
  "p",
  "px",
  "py",
  "pt",
  "pb",
  "pl",
  "pr",
  "ps",
  "pe",
  "m",
  "mx",
  "my",
  "mt",
  "mb",
  "ml",
  "mr",
  "ms",
  "me",
  "gap",
  "gap-x",
  "gap-y",
  "space-x",
  "space-y",
];

/** 레이아웃·컨트롤 치수 — 임의 px 허용 파일(단일 소스) */
export const FOUNDATION_ARBITRARY_PX_FILES = new Set([
  "src/lib/page-layout.ts",
  "src/lib/worksArea.ts",
  "src/lib/mobile-viewport.ts",
  "src/lib/thumbnail-styles.ts",
  "src/lib/modal-styles.ts",
  "src/lib/editor-block-layout.ts",
  "src/lib/editor-scroll.ts",
  "src/lib/form-field-styles.ts",
  "src/lib/chip-styles.ts",
  "src/components/ui/modal/modal-styles.ts",
  "src/components/brand/RenovelStudioLogo.tsx",
  "src/components/profile/profile-field-styles.tsx",
  "src/components/resource/cards/AddResourceSlot.tsx",
  "src/components/preview/IPhone15ProFrame.tsx",
  "src/lib/series-form-mobile-layout.ts",
  "src/components/ui/dialog.tsx",
  "src/components/editor/editor-mobile-floating-layout.ts",
  "src/components/analytics/analytics-horizontal-stacked-bar.ts",
  "src/lib/inquiry-list-styles.ts",
  "src/lib/preview-overlay-styles.ts",
  "src/lib/preview-player-chroma.css",
  "src/lib/editor-control-styles.ts",
]);

/** 도메인 특화 — 팔레트·그라디언트 허용 */
export const PALETTE_COLOR_ALLOWLIST_FILES = new Set([
  "src/components/script-editor/script-block.tsx",
  "src/components/series/SeriesPreviewPanel.tsx",
  "src/components/preview/IPhone15ProFrame.tsx",
  "src/components/ui/floating-composer-bar.tsx",
  "src/app/globals.css",
]);

/** 레거시 my-* 스페이싱 토큰 (폐기) */
export const LEGACY_MY_SPACING_RE = /(?:^|[\s"'`])-?(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|h|w|size|min-h|min-w|max-h|max-w)-my-\d+/;

/** Tailwind 기본 팔레트 색 (DS 시맨틱만 허용) */
export const FORBIDDEN_PALETTE_COLOR_RE =
  /\b(?:bg|text|border|outline|ring|fill|stroke|from|to|via)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-/;

export const FORBIDDEN_ABSOLUTE_COLOR_RE =
  /\b(?:bg|text|border)-(?:white|black)(?:\/|\b)/;

export const FORBIDDEN_LEGACY_TYPO_RE = /\btext-(?:xs|sm|base|lg|xl|2xl|3xl)\b/;

export const FORBIDDEN_FONT_WEIGHT_WITH_TYPO_RE =
  /\btext-(?:body|heading|caption)\d+_\d{3}\b[\s\S]{0,80}?\bfont-(?:medium|semibold|bold|normal|light)\b/;

/** radius: DS rounded-sm(4px)·rounded-md(8px)·rounded-lg(12px) */
export const FORBIDDEN_RADIUS_RE =
  /\brounded(?:-(?:t|b|l|r|tl|tr|bl|br))?-\[(?:4|8|12|16|20)px\]/;

export const RADIUS_REPLACEMENTS = {
  "rounded-[4px]": "rounded-sm",
  "rounded-t-[4px]": "rounded-t-sm",
  "rounded-b-[4px]": "rounded-b-sm",
  "rounded-l-[4px]": "rounded-l-sm",
  "rounded-r-[4px]": "rounded-r-sm",
  "rounded-tl-[4px]": "rounded-tl-sm",
  "rounded-tr-[4px]": "rounded-tr-sm",
  "rounded-bl-[4px]": "rounded-bl-sm",
  "rounded-br-[4px]": "rounded-br-sm",
  "rounded-[8px]": "rounded-md",
  "rounded-t-[8px]": "rounded-t-md",
  "rounded-b-[8px]": "rounded-b-md",
  "rounded-l-[8px]": "rounded-l-md",
  "rounded-r-[8px]": "rounded-r-md",
  "rounded-[12px]": "rounded-lg",
  "rounded-[16px]": "rounded-xl",
  "rounded-[20px]": "rounded-2xl",
  "rounded-t-[16px]": "rounded-t-xl",
};

export const FORBIDDEN_SHADOW_RE = /\bshadow-(?:sm|md|lg|xl|2xl)\b/;

/** DS z-* 유틸 + 스택 기준 z-0만 허용 */
export const FORBIDDEN_Z_INDEX_RE = /\bz-(?!0\b|base\b|dropdown\b|sticky\b|overlay\b|modal\b|toast\b)\d+/;

export const SPACING_OUT_OF_SCALE_RE = new RegExp(
  `\\b(?:${DS_SPACING_UTILITY_PREFIXES.join("|")})-(?!${DS_SPACING_TOKENS.map((t) => t.replace(".", "\\.")).join("|")})(?:\\d+(?:\\.\\d+)?|\\[[^\\]]+\\])`,
);

/** 내 작품·AppShell 레이아웃 — lg 이원 분할만 (md/sm 금지) */
export const LAYOUT_SHELL_FILES = new Set([
  "src/app/series/(my-works)/layout.tsx",
  "src/components/layout/AppShell.tsx",
  "src/lib/page-layout.ts",
  "src/lib/worksArea.ts",
]);

export const FORBIDDEN_LAYOUT_BREAKPOINT_RE = /\b(?:^|[\s"'`])(?:sm|md):/;

export const CANVAS_THEME_COLORS = {
  light: "#ffffff",
  dark: "#000000",
};

/**
 * 에디터 블록 타입 라벨 chroma — DS foreground 짝 규칙 예외.
 * 정의 정본: `src/lib/blockLabelColors.ts` (`LABEL_COLOR_BY_TYPE`)
 */
export const BLOCK_LABEL_COLOR_SOURCE_FILE = "src/lib/blockLabelColors.ts";

export const BLOCK_LABEL_COLOR_EXCEPTION_FILES = new Set([
  BLOCK_LABEL_COLOR_SOURCE_FILE,
  "src/components/editor/ScriptBlock.tsx",
  "src/components/editor/EditorBodyReadOnly.tsx",
]);

/** 라벨 매핑에만 허용되는 chroma 클래스 (blockLabelColors.ts 검증용) */
export const BLOCK_LABEL_CHROMA_CLASS_RE =
  /\btext-(?:block-label-[a-z-]+|foreground-(?:muted|placeholder))\b/;

/** 소비처에서 `LABEL_COLOR_BY_TYPE` 없이 쓰면 안 되는 role·라벨 chroma */
export const BLOCK_LABEL_ROLE_FOREGROUND_RE =
  /\btext-(?:block-label-|warning|success|info|primary)-/;

/** lucide-react 직접 import 금지 — `@/lib/icons` · `ICONS` 레지스트리만 허용 */
export const FORBIDDEN_LUCIDE_IMPORT_RE =
  /from\s+["']lucide-react["']/;

/** DS 아이콘 레지스트리 우회 금지 (앱은 `@/lib/icons`만) */
export const FORBIDDEN_DS_ICONS_DIRECT_IMPORT_RE =
  /from\s+["']design-system\/icons["']/;

/** 인라인 SVG 아이콘 금지 — 브랜드 로고·장식 패턴만 예외 */
export const INLINE_SVG_ALLOWLIST_FILES = new Set([
  "src/components/brand/RenovelStudioLogo.tsx",
  "src/components/editor/ResourcePicker.tsx",
  "src/components/preview/IPhone15ProFrame.tsx",
]);

export const INLINE_SVG_TAG_RE = /<svg[\s>]/;

/** DS motion — duration-short|medium|long · ease-standard|emphasized-* 만 허용 */
export const FORBIDDEN_MOTION_DURATION_RE =
  /\bduration-(?!short\b|medium\b|long\b)(?:\d+|\[[^\]]+\])/;

export const FORBIDDEN_MOTION_EASING_RE =
  /\bease-(?!standard\b|emphasized-decelerate\b|emphasized-accelerate\b)(?:linear|in|out|in-out)\b/;

/** 레거시 Material surface/on-surface CSS 변수 (폐기) */
export const FORBIDDEN_LEGACY_SURFACE_VAR_RE =
  /var\(--(?:on-surface|surface-inverse|surface)-/;

/** 레거시 container 전경 별칭 — DS: *-container-foreground */
export const FORBIDDEN_LEGACY_CONTAINER_TEXT_RE =
  /\btext-on-(?:primary|secondary|destructive)-container\b/;

export const LEGACY_CONTAINER_TEXT_REPLACEMENTS = {
  "text-on-primary-container": "text-primary-container-foreground",
  "text-on-secondary-container": "text-secondary-container-foreground",
  "text-on-destructive-container": "text-destructive-container-foreground",
};

export const LEGACY_SURFACE_UTILITY_REPLACEMENTS = {
  "from-surface-20": "from-muted",
  "via-surface-20": "via-muted",
  "caret-on-surface-10": "caret-foreground",
  "border-t-on-surface-10": "border-t-foreground",
};

/** 임의 scale transform */
export const FORBIDDEN_ARBITRARY_SCALE_RE = /\b(?:active:|hover:|focus:)?scale-\[/;

/** 임의 hex/rgba 배경·보더 클래스 */
export const FORBIDDEN_ARBITRARY_HEX_CLASS_RE =
  /\b(?:bg|border|text|outline|ring|fill|stroke)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\()/;

/** Tailwind 기본 shadow-* (DS shadow-elevation-* 만) */
export const FORBIDDEN_ARBITRARY_SHADOW_RE = /\bshadow-\[/;

/** 임의 z-index — DS z-* · 단일 소스 파일만 예외 */
export const FORBIDDEN_ARBITRARY_Z_RE = /\bz-\[\d+\]/;

export const FOUNDATION_ARBITRARY_Z_FILES = new Set([]);

/** globals.css — AI 로더 등 도메인 애니메이션 키프레임 */
export const FOUNDATION_MOTION_CSS_FILES = new Set(["src/app/globals.css"]);
