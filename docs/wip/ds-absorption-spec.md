# DS 흡수 명세 — DS 측 세션 작업 지시서

> **현재 상태 요약**: DS 패키지(`packages/design-system/`)는 토큰 CSS·TS와 `cn`만 export. 컴포넌트는 같은 레포의 별도 위치(`Design System Test/src/components/ui/`)에 있고 패키지 exports 미포함.
> **목표**: 리노벨 스튜디오(`upnunde-test/app`)가 DS만 import해서 토큰·타이포·컴포넌트·cn을 단일 소스로 쓸 수 있게 만든다. DS는 절대 기준이며, 리노벨 자체 토큰은 영구 보존 대상이 아니다.

---

## 1. Typography 흡수 명세

### 1-1. `@utility` 정의 — `packages/design-system/src/typography.css` (현재 이미 존재함 · 변경 불요)

**확인 결과**: DS의 `packages/design-system/src/typography.css`는 이미 아래 27개 `@utility`를 가지고 있고 리노벨 globals.css의 정의와 **완벽히 동일**. 단 `letter-spacing`은 양쪽 모두 미정의(폰트 family와 묶여 globally 적용). 정의 그대로 사용·정본 채택.

```css
/* Heading 1 — 페이지 최상단 타이틀 */
@utility text-heading1_700 { font-size: 32px; line-height: 38px; font-weight: 700; }

/* Heading 2 — 페이지 타이틀 (24/34) */
@utility text-heading2_700 { font-size: 24px; line-height: 34px; font-weight: 700; }
@utility text-heading2_500 { font-size: 24px; line-height: 34px; font-weight: 500; }

/* Heading 3 — 섹션 타이틀 (22/30) */
@utility text-heading3_700 { font-size: 22px; line-height: 30px; font-weight: 700; }
@utility text-heading3_500 { font-size: 22px; line-height: 30px; font-weight: 500; }

/* Heading 4 — 섹션 서브타이틀 (20/28) */
@utility text-heading4_700 { font-size: 20px; line-height: 28px; font-weight: 700; }
@utility text-heading4_500 { font-size: 20px; line-height: 28px; font-weight: 500; }

/* Heading 5 — 카드/모달 타이틀 (18/26) */
@utility text-heading5_700 { font-size: 18px; line-height: 26px; font-weight: 700; }
@utility text-heading5_500 { font-size: 18px; line-height: 26px; font-weight: 500; }

/* Body 1 — 본문 강조 (16/24) */
@utility text-body1_700 { font-size: 16px; line-height: 24px; font-weight: 700; }
@utility text-body1_500 { font-size: 16px; line-height: 24px; font-weight: 500; }
@utility text-body1_400 { font-size: 16px; line-height: 24px; font-weight: 400; }

/* Body 2 — 본문 (15/22) */
@utility text-body2_700 { font-size: 15px; line-height: 22px; font-weight: 700; }
@utility text-body2_500 { font-size: 15px; line-height: 22px; font-weight: 500; }
@utility text-body2_400 { font-size: 15px; line-height: 22px; font-weight: 400; }

/* Body 3 — 기본 텍스트 (14/20) — 가장 많이 사용 (480곳+) */
@utility text-body3_700 { font-size: 14px; line-height: 20px; font-weight: 700; }
@utility text-body3_500 { font-size: 14px; line-height: 20px; font-weight: 500; }
@utility text-body3_400 { font-size: 14px; line-height: 20px; font-weight: 400; }

/* Body 4 — 보조 텍스트 (13/18) */
@utility text-body4_700 { font-size: 13px; line-height: 18px; font-weight: 700; }
@utility text-body4_500 { font-size: 13px; line-height: 18px; font-weight: 500; }
@utility text-body4_400 { font-size: 13px; line-height: 18px; font-weight: 400; }

/* Caption 1 — 라벨/메타 (12/16) */
@utility text-caption1_700 { font-size: 12px; line-height: 16px; font-weight: 700; }
@utility text-caption1_500 { font-size: 12px; line-height: 16px; font-weight: 500; }
@utility text-caption1_400 { font-size: 12px; line-height: 16px; font-weight: 400; }

/* Caption 2 — 가장 작은 라벨 (11/14) */
@utility text-caption2_700 { font-size: 11px; line-height: 14px; font-weight: 700; }
@utility text-caption2_500 { font-size: 11px; line-height: 14px; font-weight: 500; }
@utility text-caption2_400 { font-size: 11px; line-height: 14px; font-weight: 400; }
```

**정책 주석** (typography.css 상단에 명시):
```
/* docs/design-system.md Part2-1 단일 소스.
   size/line-height/weight를 묶은 단일 클래스만 사용.
   개별 속성 조합(text-sm + font-bold 등) 금지.
   폰트 패밀리(Pretendard JP)는 fonts.css에서 전역 적용 → 여기서 미지정. */
```

### 1-2. `package.json` exports에 typography.css 추가

```json
"./typography.css": "./src/typography.css"
```

(현재 미등록 — **반드시 추가**. 리노벨이 globals.css에서 `@import "design-system/typography.css"`로 가져옴.)

### 1-3. `typography-tokens.ts` 재작성안

기존 DS `typography-tokens.ts`는 표준 Tailwind 스케일(`text-xs`/`text-sm`/`text-base`...)을 정본화하고 있음. 이걸 **제거하고** 리노벨 합본 시스템을 정본화한다.

새 구조 (`packages/design-system/src/typography-tokens.ts`):

```ts
export type TypographyGroup = "heading" | "body" | "caption"
export type TypographyWeight = 400 | 500 | 700

export type TypographyToken = {
  /** className 그대로 — text-heading2_700 등 */
  className: string
  /** size_lineHeight (예: "24_34") */
  label: string
  group: TypographyGroup
  /** heading 1~5 · body 1~4 · caption 1~2 */
  rank: number
  fontSizePx: number
  lineHeightPx: number
  fontWeight: TypographyWeight
  description: string
}

/** Display용 27토큰 — typography.css @utility와 1:1 동기화 */
export const TYPOGRAPHY_SCALE: TypographyToken[] = [
  { className: "text-heading1_700", label: "32_38", group: "heading", rank: 1, fontSizePx: 32, lineHeightPx: 38, fontWeight: 700, description: "페이지 최상단 타이틀" },
  { className: "text-heading2_700", label: "24_34", group: "heading", rank: 2, fontSizePx: 24, lineHeightPx: 34, fontWeight: 700, description: "페이지 타이틀" },
  { className: "text-heading2_500", label: "24_34", group: "heading", rank: 2, fontSizePx: 24, lineHeightPx: 34, fontWeight: 500, description: "페이지 타이틀 (medium)" },
  { className: "text-heading3_700", label: "22_30", group: "heading", rank: 3, fontSizePx: 22, lineHeightPx: 30, fontWeight: 700, description: "섹션 타이틀" },
  { className: "text-heading3_500", label: "22_30", group: "heading", rank: 3, fontSizePx: 22, lineHeightPx: 30, fontWeight: 500, description: "섹션 타이틀 (medium)" },
  { className: "text-heading4_700", label: "20_28", group: "heading", rank: 4, fontSizePx: 20, lineHeightPx: 28, fontWeight: 700, description: "섹션 서브타이틀" },
  { className: "text-heading4_500", label: "20_28", group: "heading", rank: 4, fontSizePx: 20, lineHeightPx: 28, fontWeight: 500, description: "섹션 서브타이틀 (medium)" },
  { className: "text-heading5_700", label: "18_26", group: "heading", rank: 5, fontSizePx: 18, lineHeightPx: 26, fontWeight: 700, description: "카드/모달 타이틀" },
  { className: "text-heading5_500", label: "18_26", group: "heading", rank: 5, fontSizePx: 18, lineHeightPx: 26, fontWeight: 500, description: "카드/모달 타이틀 (medium)" },
  { className: "text-body1_700",    label: "16_24", group: "body", rank: 1, fontSizePx: 16, lineHeightPx: 24, fontWeight: 700, description: "본문 강조" },
  { className: "text-body1_500",    label: "16_24", group: "body", rank: 1, fontSizePx: 16, lineHeightPx: 24, fontWeight: 500, description: "본문 강조 (medium)" },
  { className: "text-body1_400",    label: "16_24", group: "body", rank: 1, fontSizePx: 16, lineHeightPx: 24, fontWeight: 400, description: "본문 강조 (regular)" },
  { className: "text-body2_700",    label: "15_22", group: "body", rank: 2, fontSizePx: 15, lineHeightPx: 22, fontWeight: 700, description: "본문" },
  { className: "text-body2_500",    label: "15_22", group: "body", rank: 2, fontSizePx: 15, lineHeightPx: 22, fontWeight: 500, description: "본문 (medium)" },
  { className: "text-body2_400",    label: "15_22", group: "body", rank: 2, fontSizePx: 15, lineHeightPx: 22, fontWeight: 400, description: "본문 (regular)" },
  { className: "text-body3_700",    label: "14_20", group: "body", rank: 3, fontSizePx: 14, lineHeightPx: 20, fontWeight: 700, description: "기본 텍스트 (bold)" },
  { className: "text-body3_500",    label: "14_20", group: "body", rank: 3, fontSizePx: 14, lineHeightPx: 20, fontWeight: 500, description: "기본 텍스트 (medium) — 가장 많이 사용" },
  { className: "text-body3_400",    label: "14_20", group: "body", rank: 3, fontSizePx: 14, lineHeightPx: 20, fontWeight: 400, description: "기본 텍스트 (regular) — 가장 많이 사용" },
  { className: "text-body4_700",    label: "13_18", group: "body", rank: 4, fontSizePx: 13, lineHeightPx: 18, fontWeight: 700, description: "보조 텍스트 (bold)" },
  { className: "text-body4_500",    label: "13_18", group: "body", rank: 4, fontSizePx: 13, lineHeightPx: 18, fontWeight: 500, description: "보조 텍스트 (medium)" },
  { className: "text-body4_400",    label: "13_18", group: "body", rank: 4, fontSizePx: 13, lineHeightPx: 18, fontWeight: 400, description: "보조 텍스트 (regular)" },
  { className: "text-caption1_700", label: "12_16", group: "caption", rank: 1, fontSizePx: 12, lineHeightPx: 16, fontWeight: 700, description: "라벨/메타 (bold)" },
  { className: "text-caption1_500", label: "12_16", group: "caption", rank: 1, fontSizePx: 12, lineHeightPx: 16, fontWeight: 500, description: "라벨/메타 (medium)" },
  { className: "text-caption1_400", label: "12_16", group: "caption", rank: 1, fontSizePx: 12, lineHeightPx: 16, fontWeight: 400, description: "라벨/메타 (regular)" },
  { className: "text-caption2_700", label: "11_14", group: "caption", rank: 2, fontSizePx: 11, lineHeightPx: 14, fontWeight: 700, description: "최소 라벨 (bold)" },
  { className: "text-caption2_500", label: "11_14", group: "caption", rank: 2, fontSizePx: 11, lineHeightPx: 14, fontWeight: 500, description: "최소 라벨 (medium)" },
  { className: "text-caption2_400", label: "11_14", group: "caption", rank: 2, fontSizePx: 11, lineHeightPx: 14, fontWeight: 400, description: "최소 라벨 (regular)" },
]

/** className → token 빠른 조회 */
export const TYPOGRAPHY_BY_CLASS: Record<string, TypographyToken> =
  Object.fromEntries(TYPOGRAPHY_SCALE.map((t) => [t.className, t]))

/** className 매처 — cn 확장·docs 생성용 */
export const isTypographyClass = (className: string): boolean =>
  /^text-(?:body|heading|caption)\d+_\d{3}$/.test(className)
```

**기존 DS `typography-tokens.ts`의 표준 Tailwind 스케일·`FONT_WEIGHT_SCALE`·`COMPONENT_TYPOGRAPHY` 등은 모두 삭제**. 두 시스템 공존하면 stale 한쪽이 생김.

### 1-4. 리노벨 globals.css 원본 (참고용 · 그대로 가져갈 정의)

리노벨 `app/src/app/globals.css#L648-L680`의 27개 `@utility` 정의는 위 1-1과 **완벽 동일** — 그래서 리노벨 사용처 521곳을 그대로 유지하면서 globals.css에서 해당 블록만 제거하고 DS의 `typography.css`를 import하면 작동한다.

---

## 2. Material 결 토큰 명세

### 2-1. 토큰 표 (DS 절대 기준 — 신규 추가)

**라이트 모드** (`packages/design-system/src/tokens.css` `:root`에 추가):

| 토큰명 | 값 | 다크 모드 값 | 용도 / 사용처 |
|---|---|---|---|
| **Container 페어** (Material container 패턴) | | | |
| `--primary-container` | `var(--brand-100)` `#fce8f8` | `var(--brand-800)` `#780f66` | 브랜드 약한 배경 — 칩 활성/필터 강조 (6곳) |
| `--on-primary-container` | `var(--brand-700)` `#b01596` | `var(--brand-100)` | primary-container 위 텍스트 (4곳) |
| `--secondary-container` | `var(--grayscale-110)` `#535356` | `var(--grayscale-130)` `#323235` | 어두운 컨테이너 배경 (1곳) |
| `--on-secondary-container` | `var(--white)` | `var(--white)` | secondary-container 위 텍스트 (1곳) |
| `--destructive-container` | `var(--error-100)` `#fee2e2` | `var(--error-800)` `#991b1b` | 에러 약한 배경 (5곳 `bg-error-error-container`) |
| `--on-destructive-container` | `var(--error-600)` `#dc2626` | `var(--error-100)` | destructive-container 위 텍스트 (5곳) |
| **Dim — overlay 농도 3단계** | | | |
| `--dim-10` | `rgb(0 0 0 / 28%)` | `rgb(0 0 0 / 40%)` | 가벼운 dim (호버 백드롭) |
| `--dim-20` | `rgb(0 0 0 / 53%)` | `rgb(0 0 0 / 60%)` | 중간 dim (모달 배경) |
| `--dim-30` | `rgb(0 0 0 / 67%)` | `rgb(0 0 0 / 75%)` | 강한 dim (이미지 위 텍스트 보호, 2곳 `bg-dim-30`) |
| **Divider — Border와 분리 (시각적 분리선 전용)** | | | |
| `--divider` | `var(--grayscale-15)` `#f1f1f5` | `var(--grayscale-130)` `#323235` | 약한 분리선 (10곳 `border-divider-10`·`bg-divider-10`) |
| `--divider-strong` | `var(--grayscale-30)` `#d7d7db` | `var(--grayscale-110)` `#535356` | 강한 분리선 (`divider-20` 사용처 대응) |
| **Border 강조·반전** | | | |
| `--border-strong` | `var(--grayscale-140)` `#212124` | `var(--grayscale-10)` `#f8f8fc` | 강한 보더 (2곳 `border-border-strong`) |
| `--border-inverse` | `var(--white)` | `var(--grayscale-140)` | 반전 표면 위 보더 |

**다크 모드** (`packages/design-system/src/tokens.css` `.dark`에 추가) — 위 표 "다크 모드 값" 열 그대로.

### 2-2. `theme.css` `@theme inline` 매핑 추가

```css
--color-primary-container: var(--primary-container);
--color-on-primary-container: var(--on-primary-container);
--color-secondary-container: var(--secondary-container);
--color-on-secondary-container: var(--on-secondary-container);
--color-destructive-container: var(--destructive-container);
--color-on-destructive-container: var(--on-destructive-container);
--color-dim-10: var(--dim-10);
--color-dim-20: var(--dim-20);
--color-dim-30: var(--dim-30);
--color-divider: var(--divider);
--color-divider-strong: var(--divider-strong);
--color-border-strong: var(--border-strong);
--color-border-inverse: var(--border-inverse);
```

### 2-3. `--foreground-muted` 값 조정 (시각 회귀 방지)

리노벨 `--on-surface-20`은 `#525254` (128곳 사용). DS의 현재 `--foreground-muted`는 `var(--grayscale-90)` = `#747478` — 너무 흐림.

**변경 지시**: `packages/design-system/src/tokens.css`의 `:root`에서
```css
--foreground-muted: var(--grayscale-90);  /* 변경 전 */
--foreground-muted: var(--grayscale-110); /* 변경 후 — #535356 */
```
다크 모드는 그대로 유지(`var(--grayscale-70)`).

### 2-4. 리노벨 사용처 → DS 토큰 매핑표 (참고용 · A0.8 일괄 치환 시 사용)

| 리노벨 className | DS 대체 | 시각 차이 |
|---|---|---|
| `bg-primary-primary-container` | `bg-primary-container` | `#FEE3F9` → `#fce8f8` — 거의 동일 |
| `text-primary-on-primary-container` | `text-on-primary-container` | `#F642D4` → `#b01596` — **명확히 다름** (브랜드 70 → 브랜드 700). 결정 필요 |
| `bg-secondary-secondary-container` | `bg-secondary-container` | `#343436` → `#535356` — 다름 |
| `text-secondary-on-secondary-container` | `text-on-secondary-container` | 동일 (`#FFFFFF`) |
| `bg-error-error` | `bg-destructive` | `#EC3232` → `#ef4444` — 매우 유사 |
| `text-error-error` | `text-destructive` | 위와 동일 |
| `border-error-error` | `border-destructive` | 위와 동일 |
| `ring-error-error` | `ring-destructive` | 위와 동일 |
| `text-error-on-error` | `text-destructive-foreground` | 동일 (`#FFFFFF`) |
| `bg-error-error-container` | `bg-destructive-container` | `#FCE0E0` → `#fee2e2` — 거의 동일 |
| `text-error-on-error-container` | `text-on-destructive-container` | `#EC3232` → `#dc2626` — 유사 |
| `text-on-secondary` | `text-secondary-foreground` | `#525254` → `var(--grayscale-140)` = `#212124` — 다름. **결정**: 단독 흐린 텍스트 의미였다면 `text-foreground-muted`(`#535356`)로 매핑 |
| `bg-surface-10` | `bg-background` (또는 `bg-canvas`) | 동일 (`#FFFFFF`) |
| `bg-surface-20` | DS에 정확히 매핑 없음 — `#F8F8FC` vs DS `--muted`/`--grayscale-15`(`#f1f1f5`) | **결정 필요** (옵션 A: DS에 `--surface-subtle` 신규 추가 / 옵션 B: `bg-muted`로 통합하고 사용자 검수) |
| `bg-surface-30` | DS 미정의 (`--surface-30` 자체 없음 — 사용 2곳, 무효 코드일 가능성) | 코드 정리 — 무효 사용처 수정 필요 |
| `bg-surface-5` | DS 미정의 (사용 1곳, 무효 코드일 가능성) | 코드 정리 |
| `bg-background-10` | `bg-background` | 동일 |
| `bg-background-20` | 위 surface-20과 동일 결정 | 위와 동일 |
| `text-surface-10` | `text-background` | 흰색 텍스트 — 사실상 `text-inverse-foreground` 의미일 가능성 |
| `bg-on-surface-10` | `bg-foreground` | 다크한 솔리드 배경 (2곳 — 의도 확인 필요) |
| `bg-surface-disabled` / `bg-surface-disabled-10` / `bg-surface-disabled-20` | `bg-disabled` | `rgb(0 0 0 / 2%)` → `var(--grayscale-15)` — 다름 (투명 vs 솔리드) |
| `text-on-surface-disabled` | `text-disabled-foreground` | 다름 (투명 vs 솔리드) |
| `bg-surface-inverse-10` | `bg-inverse` | `#2B2B2B` → `#212124` — 미세 |
| `text-on-surface-inverse` | `text-inverse-foreground` | 동일 (`#FFFFFF`) |
| `border-divider-10` | `border-divider` | 투명 → 솔리드 — 다름 |
| `bg-divider-10` | `bg-divider` | 위와 동일 |
| `border-border-10` (검정 7%) | `border-border` (`--grayscale-20` 솔리드) | **다름** — 203곳 영향. 결정 필요 |
| `border-border-20` (검정 13%) | DS 미정의 — `border-border` 또는 `border-disabled-border` | 결정 필요 — 63곳 |
| `border-border-strong` | `border-border-strong` (이름 동일) | 매핑됨 |

**결정 필요 항목 정리** (DS 측 또는 리노벨 측 정책 결정):
1. `--on-primary-container` 색 강도 (밝은 핑크 vs 진한 핑크)
2. `--surface-20` 처리 — DS에 신규 토큰 추가 여부
3. `bg-surface-30`·`bg-surface-5`·`bg-on-surface-10` 무효/의도 미상 코드 정리
4. `border-border-10/-20` 투명 vs 솔리드 — 시각 회귀 수용 여부

### 2-5. Material 결 토큰에서 의도적으로 흡수하지 않는 것 (정책 일치)

- 리노벨 `--secondary-secondary`/`--secondary-on-secondary` 등 **Figma 별칭** — DS의 `--secondary`/`--secondary-foreground`로 통합 (별칭 폐기).
- `--background-10`/`--background-20` 리노벨 별칭 — DS의 `--background`/`--muted`로 통합.

---

## 3. cn 확장 명세

### 3-1. 현재 리노벨 `app/src/lib/utils.ts` 원본 (그대로 DS에 가져감)

```ts
import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/** DS 스페이싱 토큰 — `p-my-24` 등이 `p-0`·`px-my-20`과 merge 시 충돌 인식되도록 */
const DS_SPACING_THEME = [
  "my-1", "my-2", "my-4", "my-8", "my-12", "my-16", "my-20", "my-24", "my-28",
  "my-32", "my-36", "my-40", "my-44", "my-48", "my-52", "my-56", "my-60",
  "my-64", "my-68", "my-72", "my-80",
] as const

/** DS 타이포 토큰(`text-body3_500` 등)은 font-size 그룹 — `text-on-surface-*` 색상과 병행 가능 */
const isDsTypographyClassPart = (classPart: string) =>
  /^(?:body|heading|caption)\d+_\d{3}$/.test(classPart)

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [...DS_SPACING_THEME],
    },
    classGroups: {
      "font-size": [{ text: [isDsTypographyClassPart] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 3-2. DS `packages/design-system/src/lib/utils.ts` 새 정의 (typography 룰만 흡수, my- 룰은 제외)

`my-*` spacing extend는 **흡수하지 않음** — A0.5에서 `my-*`이 전부 사라지므로 불필요. DS의 표준 `--space-*` 스케일은 Tailwind 기본 spacing 그룹으로 자동 인식됨.

```ts
import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * DS 타이포 합본 클래스(`text-body3_500`·`text-heading2_700`·`text-caption1_400`)는
 * font-size 그룹에 속한다. 이 그룹에 등록해야:
 *   - `cn("text-sm", "text-body3_500")` → `text-body3_500` 만 남음 (충돌 인식)
 *   - `cn("text-body3_500", "text-on-surface-10")` → 둘 다 살아남음 (font-size · color 그룹 분리)
 *
 * 매칭 규칙: typography-tokens.ts의 isTypographyClass와 동일 ((body|heading|caption)\d+_\d{3}).
 */
const isDsTypographyClassPart = (classPart: string) =>
  /^(?:body|heading|caption)\d+_\d{3}$/.test(classPart)

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [isDsTypographyClassPart] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 3-3. 작동 방식

- `tailwind-merge`는 같은 그룹의 클래스 중 마지막 것만 남기고 충돌을 정리.
- 기본 tailwind-merge는 `text-body3_500` 같은 커스텀 합본 클래스를 알지 못해 `text-sm + text-body3_500`처럼 두 개가 다 살아남음 (브라우저에서 마지막 선언이 이김 — 의존도 불안정).
- `classGroups."font-size"`에 정규식 매처를 등록하면 합본 클래스도 font-size 그룹으로 인식 → 표준 `text-sm`과 충돌 시 마지막 것만 남음.
- `[{ text: [matcher] }]` 형식 = "`text-` 접두사 다음에 matcher가 true인 부분이 오면 font-size 그룹".

### 3-4. exports 확인

DS `package.json`에 이미:
```json
"./utils": "./src/lib/utils.ts",
"." : "./src/index.ts"
```
`index.ts`는 `export { cn } from "./lib/utils"` — 그대로 유지. 리노벨은 `import { cn } from "design-system"` 또는 `import { cn } from "design-system/utils"` 둘 다 가능.

---

## 4. Shadow elevation 명세

### 4-1. `packages/design-system/src/tokens.css` `:root` 추가

```css
/* Elevation — Material 결 6단계 그림자
 *   10·20: 카드·인풋 호버
 *   30·40: 드롭다운·팝오버
 *   50·60: 모달·바텀시트
 */
--shadow-elevation-10: 0px 1px 2px 1px rgba(0, 0, 0, 0.06);
--shadow-elevation-20: 0px 2px 4px 2px rgba(0, 0, 0, 0.06);
--shadow-elevation-30: 0px 4px 8px 3px rgba(0, 0, 0, 0.06);
--shadow-elevation-40: 0px 8px 12px 4px rgba(0, 0, 0, 0.06);
--shadow-elevation-50: 0px 8px 16px 6px rgba(0, 0, 0, 0.06);
--shadow-elevation-60: 0px 12px 24px 8px rgba(0, 0, 0, 0.06);
```

(리노벨 globals.css `L120-L125` 원본 그대로.)

### 4-2. `.dark` 추가 — 검정 위에서도 보이도록 알파 강화

```css
--shadow-elevation-10: 0px 1px 2px 1px rgba(0, 0, 0, 0.32);
--shadow-elevation-20: 0px 2px 4px 2px rgba(0, 0, 0, 0.32);
--shadow-elevation-30: 0px 4px 8px 3px rgba(0, 0, 0, 0.32);
--shadow-elevation-40: 0px 8px 12px 4px rgba(0, 0, 0, 0.32);
--shadow-elevation-50: 0px 8px 16px 6px rgba(0, 0, 0, 0.32);
--shadow-elevation-60: 0px 12px 24px 8px rgba(0, 0, 0, 0.32);
```

**메모**: 리노벨에는 다크 그림자 미정의. 위 값은 추정치 (0.06 → 0.32). DS 디자이너 확인 후 조정 가능.

### 4-3. `packages/design-system/src/theme.css` `@theme inline` 매핑

Tailwind v4의 `--shadow-*` 네임스페이스는 변수명이 그대로 `shadow-*` 유틸이 됨. 따라서:

```css
--shadow-elevation-10: var(--shadow-elevation-10);
--shadow-elevation-20: var(--shadow-elevation-20);
--shadow-elevation-30: var(--shadow-elevation-30);
--shadow-elevation-40: var(--shadow-elevation-40);
--shadow-elevation-50: var(--shadow-elevation-50);
--shadow-elevation-60: var(--shadow-elevation-60);
```

(이름이 변수명과 같지만 `@theme inline` 안에서 자기참조 가능 — Tailwind v4 패턴.)

### 4-4. 사용처 (리노벨 — 변경 없이 계속 작동)

```
shadow-elevation-40: 11곳
shadow-elevation-50: 9곳
shadow-elevation-20: 7곳
shadow-elevation-10: 6곳
shadow-elevation-30: 4곳
shadow-elevation-60: 1곳
```

총 38곳. 클래스명 동일 → A0.8에서 별도 치환 없음, globals.css의 `--shadow-elevation-*` 정의 블록만 제거.

---

## 5. 컴포넌트 이전 명세

### 5-1. 이전 작업

DS Test의 컴포넌트가 현재 `Design System Test/src/components/ui/`에 있고 **`packages/design-system/` 밖**. 작업:

1. **이전**: `Design System Test/src/components/ui/*.tsx` → `Design System Test/packages/design-system/src/components/ui/*.tsx`로 전부 이동 (28개 파일).
2. **lib 의존성**: DS 컴포넌트가 사용하는 헬퍼들(예: `@/lib/ui-disabled`, `@/lib/utils`)도 `packages/design-system/src/lib/`로 함께 이동. 컴포넌트 내부 import는 상대경로(`../../lib/utils`·`../../lib/ui-disabled`)로 변경.
3. **DS Test 앱 쪽 `src/components/ui/*` import 경로**는 `@/components/ui/button` → `design-system/ui/button`으로 변경(DS Test 자체 데모 앱도 패키지를 거쳐 쓰는 형태).

### 5-2. `package.json` exports 추가

```json
{
  "name": "design-system",
  "exports": {
    ".": "./src/index.ts",
    "./tokens.css": "./src/tokens.css",
    "./theme.css": "./src/theme.css",
    "./typography.css": "./src/typography.css",
    "./icons.css": "./src/icons.css",
    "./fonts.css": "./src/fonts.css",
    "./utils": "./src/lib/utils.ts",
    "./typography-tokens": "./src/typography-tokens.ts",
    "./typography-display": "./src/typography-display.ts",
    "./component-size-tokens": "./src/component-size-tokens.ts",
    "./radius-tokens": "./src/radius-tokens.ts",
    "./spacing-tokens": "./src/spacing-tokens.ts",
    "./icon-tokens": "./src/icon-tokens.ts",
    "./motion-tokens": "./src/motion-tokens.ts",
    "./brand-colors": "./src/brand-colors.ts",
    "./semantic-state-colors": "./src/semantic-state-colors.ts",
    "./grayscale-colors": "./src/grayscale-colors.ts",
    "./absolute-colors": "./src/absolute-colors.ts",
    "./ui/button": "./src/components/ui/button.tsx",
    "./ui/avatar": "./src/components/ui/avatar.tsx",
    "./ui/badge": "./src/components/ui/badge.tsx",
    "./ui/chip": "./src/components/ui/chip.tsx",
    "./ui/dialog": "./src/components/ui/dialog.tsx",
    "./ui/dropdown-menu": "./src/components/ui/dropdown-menu.tsx",
    "./ui/input": "./src/components/ui/input.tsx",
    "./ui/popover": "./src/components/ui/popover.tsx",
    "./ui/textarea": "./src/components/ui/textarea.tsx",
    "./ui/sonner": "./src/components/ui/sonner.tsx",
    "./ui/accordion": "./src/components/ui/accordion.tsx",
    "./ui/alert": "./src/components/ui/alert.tsx",
    "./ui/button-group": "./src/components/ui/button-group.tsx",
    "./ui/card": "./src/components/ui/card.tsx",
    "./ui/checkbox": "./src/components/ui/checkbox.tsx",
    "./ui/icon": "./src/components/ui/icon.tsx",
    "./ui/label": "./src/components/ui/label.tsx",
    "./ui/progress": "./src/components/ui/progress.tsx",
    "./ui/radio-group": "./src/components/ui/radio-group.tsx",
    "./ui/select": "./src/components/ui/select.tsx",
    "./ui/separator": "./src/components/ui/separator.tsx",
    "./ui/skeleton": "./src/components/ui/skeleton.tsx",
    "./ui/slider": "./src/components/ui/slider.tsx",
    "./ui/switch": "./src/components/ui/switch.tsx",
    "./ui/tabs": "./src/components/ui/tabs.tsx",
    "./ui/toggle": "./src/components/ui/toggle.tsx",
    "./ui/tooltip": "./src/components/ui/tooltip.tsx",
    "./ui/email-input": "./src/components/ui/email-input.tsx"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@base-ui/react": "^1.0.0"
  }
}
```

(`@base-ui/react` 정확한 버전 범위는 DS 측 현재 사용 버전으로.)

### 5-3. 리노벨이 import할 예정 컴포넌트 — 우선도·사용처 빈도

리노벨 `app/src/components/ui/`의 현재 사용 빈도 기준 우선도:

| import 경로 | 리노벨 현재 사용 빈도(대략) | Phase | 도메인 wrapping 여부 |
|---|---|---|---|
| `design-system/utils` (cn) | 모든 컴포넌트 (수백 곳) | **A0.6** | — |
| `design-system/ui/button` | **매우 높음** (50곳+) | A1 첫 사례, C에서 전면 교체 | 도메인 변형(`tertiary`/`addMenu`/`error`) 필요 → 리노벨에서 wrapping |
| `design-system/ui/dialog` | **매우 높음** (모달 다수) | C | `ProfileEditModal`, `GuideModals`, `PolicyAgreementModal` 등 도메인 wrapping |
| `design-system/ui/dropdown-menu` | 높음 (편집 메뉴) | C | `EditorSubHeader` 등에서 wrapping |
| `design-system/ui/popover` | 중간 | C | floating composer 메뉴 |
| `design-system/ui/input` | 높음 (폼) | C | `SeriesFormTextInputField`, `email-input` |
| `design-system/ui/textarea` | 중간 | C | `EpisodeScriptTextarea`, `SeriesFormTextareaField` |
| `design-system/ui/avatar` | 낮음 | C | 프로필 |
| `design-system/ui/badge` | 낮음 | C | 메타 라벨 |
| `design-system/ui/chip` | 중간 | C | `ContentScopeChipGroup`, 필터 칩 |
| `design-system/ui/sonner` | 토스트 시스템 1곳 | C | 리노벨 `toast`/`toaster` 교체 |
| `design-system/ui/tabs` | 중간 | C | `SeriesFormTabs`, `segmented-text-tabs` |
| `design-system/ui/select` | 낮음 | C | 폼 일부 |
| `design-system/ui/separator`, `card`, `icon`, `label`, `checkbox`, `radio-group`, `switch`, `progress`, `slider`, `toggle`, `tooltip`, `skeleton`, `alert`, `accordion`, `button-group` | 미사용 | 필요 시 가져옴 | — |

### 5-4. 도메인 wrapping 패턴 예시

**예시 A — Button에 도메인 변형 추가** (`app/src/components/ui/button.tsx`을 다음으로 재작성):

```tsx
import { Button as DsButton, buttonVariants as dsButtonVariants } from "design-system/ui/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "design-system/utils"

/**
 * 리노벨 도메인 버튼 변형 — DS Button 위에 추가 variant만 쌓는다.
 * DS variants(default/primary/outline/secondary/ghost/destructive/link)는 그대로 사용.
 * 여기에 도메인 전용 tertiary/addMenu 만 보강.
 */
const domainVariants = cva("", {
  variants: {
    domainVariant: {
      tertiary:
        "border-0 bg-transparent shadow-none text-foreground-placeholder hover:text-foreground disabled:text-disabled-foreground disabled:opacity-100",
      addMenu:
        "rounded-full bg-background ring-1 ring-foreground/20 text-foreground hover:bg-background",
    },
  },
})

type Props = React.ComponentProps<typeof DsButton> &
  VariantProps<typeof domainVariants>

export function Button({ className, domainVariant, ...props }: Props) {
  return <DsButton className={cn(domainVariants({ domainVariant }), className)} {...props} />
}

export { dsButtonVariants as buttonVariants }
```

**예시 B — Modal 도메인 컴포넌트** (`ProfileEditModal.tsx` 같은 도메인 모달):

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "design-system/ui/dialog"
import { Button } from "design-system/ui/button"
// 도메인 hook · state · 폼 컴포넌트는 그대로
import { useProfile } from "@/hooks/useProfile"

export function ProfileEditModal({ open, onClose }: Props) {
  const profile = useProfile()
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>프로필 편집</DialogTitle>
        </DialogHeader>
        {/* 도메인 폼 — DS Input/Textarea 조합 */}
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>취소</Button>
          <Button onClick={() => profile.save()}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

**원칙**: DS 컴포넌트는 그대로, 리노벨은 도메인 상태·이벤트·레이아웃만 얹는다. DS 컴포넌트를 fork하지 않음.

---

## 6. Spacing 확장

### 6-1. DS `packages/design-system/src/tokens.css` `:root` 추가

```css
/* Spacing — my-* 흡수: 1·2·4px 단위 · 최대 80px */
--space-11: 2.75rem;  /* 44px */
--space-12: 3rem;     /* 48px */
--space-13: 3.25rem;  /* 52px */
--space-14: 3.5rem;   /* 56px */
--space-15: 3.75rem;  /* 60px */
--space-16: 4rem;     /* 64px */
--space-17: 4.25rem;  /* 68px */
--space-18: 4.5rem;   /* 72px */
--space-20: 5rem;     /* 80px */
```

(my-76 = 19 = 4.75rem는 사용처 0건이라 미정의. 필요해지면 추후 추가.)

### 6-2. `packages/design-system/src/theme.css` `@theme inline` 매핑 추가

```css
--spacing-11: var(--space-11);
--spacing-12: var(--space-12);
--spacing-13: var(--space-13);
--spacing-14: var(--space-14);
--spacing-15: var(--space-15);
--spacing-16: var(--space-16);
--spacing-17: var(--space-17);
--spacing-18: var(--space-18);
--spacing-20: var(--space-20);
```

### 6-3. `packages/design-system/src/spacing-tokens.ts` `SPACING_SCALE`에 9개 항목 추가

```ts
{ token: "11", label: "11_44", variable: "--space-11", px: 44, rem: "2.75rem", className: "w-11" },
{ token: "12", label: "12_48", variable: "--space-12", px: 48, rem: "3rem",    className: "w-12" },
{ token: "13", label: "13_52", variable: "--space-13", px: 52, rem: "3.25rem", className: "w-13" },
{ token: "14", label: "14_56", variable: "--space-14", px: 56, rem: "3.5rem",  className: "w-14" },
{ token: "15", label: "15_60", variable: "--space-15", px: 60, rem: "3.75rem", className: "w-15" },
{ token: "16", label: "16_64", variable: "--space-16", px: 64, rem: "4rem",    className: "w-16" },
{ token: "17", label: "17_68", variable: "--space-17", px: 68, rem: "4.25rem", className: "w-17" },
{ token: "18", label: "18_72", variable: "--space-18", px: 72, rem: "4.5rem",  className: "w-18" },
{ token: "20", label: "20_80", variable: "--space-20", px: 80, rem: "5rem",    className: "w-20" },
```

`SPACING_MAX_PX`도 `40` → `80`으로 갱신.

### 6-4. 리노벨에서 이 범위를 쓰는 사용처 예시

| my-{n} | 리노벨 사용처 예시 |
|---|---|
| `my-44` | `min-h-my-44` — 입력 컨트롤 큰 사이즈 일부 |
| `my-48` | 모달 내부 큰 섹션 간격 |
| `my-52` | 페이지 헤더 높이 |
| `my-56` | 헤더 + 패딩 영역 |
| `my-60` | 큰 카드 마진 |
| `my-64` | 페이지 섹션 간격 |
| `my-68` | 큰 폼 필드 영역 |
| `my-72` | 페이지 푸터 영역 |
| `my-80` | 가장 큰 섹션 간격 |

(정확한 사용처는 A0.5 일괄 치환 스크립트가 자동 처리하므로 여기선 참고용.)

### 6-5. 정책 명시 (DS 측 문서에 추가 권장)

> Spacing 스케일은 4px 단위(이전 my-*) 시스템을 흡수. 1px(`px`) · 2px(`0.5`) 두 미세 단위 + 4px·8px·12px... 4px 단위 · 최대 80px. Tailwind 표준 스케일과 같은 네임스페이스(`spacing`).

---

## 7. z-index 명세

### 7-1. 6개 `@utility` (DS `packages/design-system/src/theme.css` 하단 또는 별도 파일에 추가)

Tailwind v4에서 `--z-index-*` 네임스페이스는 유틸을 안정적으로 생성하지 않으므로 **`@utility`로 직접 선언**. 리노벨 globals.css `L131-L148` 원본 그대로.

```css
/* Z-Index 레이어 — 페이지 위계 6단계 (간격 100) */
@utility z-base     { z-index: 0;   }  /* 기본 페이지 콘텐츠 */
@utility z-dropdown { z-index: 100; }  /* 드롭다운 메뉴·셀렉트 옵션 */
@utility z-sticky   { z-index: 200; }  /* sticky 헤더·사이드바·고정 컬럼 */
@utility z-overlay  { z-index: 300; }  /* 백드롭·dim 레이어·플로팅 패널 */
@utility z-modal    { z-index: 400; }  /* 다이얼로그·바텀시트·풀스크린 모달 */
@utility z-toast    { z-index: 500; }  /* 토스트·스낵바 — 최상단 */
```

### 7-2. 위계 정책

- 간격 100 → 컴포넌트 내부 미세 레이어(예: 드롭다운 내 hover indicator)는 베이스 이름에 `[z-101]` 같은 임의값으로 보강 가능.
- 토스트는 다른 모든 레이어 위 — 모달 위에서도 토스트가 보임.
- `z-overlay`는 모달의 dim 백드롭에 사용. `z-modal`은 모달 콘텐츠 본체.

### 7-3. 사용처 (리노벨 — 변경 없이 계속 작동)

각 6개 유틸리티는 리노벨에서 각각 1곳씩만 사용 — 컴포넌트가 적은 게 아니라 대부분 컴포넌트가 `data-state`/Portal 기반으로 z-index를 명시적으로 안 쓰고 있음. 흡수 후에도 6곳 그대로 작동, globals.css의 6개 `@utility` 정의 블록만 제거.

---

## 8. 리노벨 측 보존 블록 — DS에 가져가지 않음

**결정**: 아래 블록은 DS와 무관한 **앱 도메인 정책**. 리노벨 globals.css 또는 컴포넌트 트리에 영구 보존.

### 8-1. 모바일 입력 16px 강제 (`app/src/app/globals.css#L682-L702`)

```css
@media (max-width: 1023px) {
  :where(input:not([type="checkbox"], [type="radio"], ...), textarea:..., select) {
    font-size: 16px !important;
  }
}
```
모바일 Safari/Chrome의 input focus 자동 확대 방지 — DS와 무관한 OS 레벨 버그 우회.

### 8-2. 에디터 씬 타이틀 typography override (`L705-L735`)

```css
@media (max-width: 1023px) {
  .editor-scene-title-field-shell { min-height: 32px !important; ... }
  :where(input.editor-scene-title-typography, ...) { font-size: 20px !important; line-height: 28px !important; ... }
}
@media (min-width: 1024px) { ... font-size: 24px ... }
```
에디터 씬 타이틀 특수 입력 영역 — 도메인 컴포넌트 전용 규칙.

### 8-3. AI 오버레이 keyframes + utility (`L363-L633`)

- `@keyframes ai-overlay-fade-in`, `ai-orb-loader-spin`, `ai-orb-loader-radius`, `ai-orb-loader-glow`, `ai-text-shimmer`, `ai-loading-dot-pulse`, `composer-border-gradient-flow`
- `@utility ai-convert-overlay`, `ai-orb-loader`, `ai-orb-loader-spin`, `ai-orb-node*`, `ai-orb`, `ai-orb-mono`, `ai-loading-message`, `ai-loading-text-shimmer`, `ai-loading-dots`, `ai-field-text-shimmer`, `ai-field-loading-dots`, `composer-bar-gradient-inner`
- `prefers-reduced-motion` 분기

AI 컴포저·오버레이 도메인 — 리노벨 고유 기능.

### 8-4. 모바일 sticky 패치 (`L328-L341`)

```css
@media (max-width: 1023px) {
  html, body {
    overflow: visible;
    overscroll-behavior-x: none;
    overscroll-behavior-y: auto;
  }
}
```
모바일 sticky + 문서 스크롤 호환 — 브라우저 우회.

### 8-5. 가로 스크롤바 비노출 (`L347-L360`)

```css
*::-webkit-scrollbar:horizontal { height: 0; display: none; }
:where([class*="overflow-x-auto"], [class*="overflow-x-scroll"]) { scrollbar-width: none; ... }
```
앱 UX 정책.

### 8-6. bg-black 강제 치환 (`L637-L645`)

```css
button.bg-black,
[data-slot="button"].bg-black {
  background-color: #343436;
}
button.bg-black:hover,
[data-slot="button"].bg-black:hover {
  background-color: rgba(52, 52, 54, 0.9);
}
```
**Phase C 후 폐기 가능** — `bg-black`을 쓰는 도메인 버튼이 DS Button variant로 교체되면 이 블록 삭제. 지금은 도메인 코드가 의존하므로 보존.

### 8-7. CSS 변수 `--app-vv-*` (`L281-L288`)

```css
:root {
  --app-vv-top: 0px;
  --app-vv-bottom: 0px;
  --app-vv-height: 100dvh;
  --app-vv-offset-top: 0px;
  --app-vv-live-top: 0px;
  --app-vv-live-height: 100dvh;
}
```
Visual viewport 동기화 — 리노벨 `useVisualKeyboardInset` 등 도메인 훅이 JS로 갱신.

### 8-8. `@layer base` 글로벌 셸 (`L290-L326`)

```css
@layer base {
  * { @apply border-border outline-ring/50; }
  html, body { @apply bg-surface-20 text-foreground m-0 p-0 w-full; ... }
  @media (min-width: 1024px) { html, body { height: 100dvh; ... overflow: hidden; ... } }
  @media (max-width: 1023px) { html, body { height: auto; ... } }
  button:not(:disabled), [role="button"]:..., a[href] { cursor: pointer; }
}
```
앱 레이아웃 셸·전역 cursor — 리노벨 도메인 정책. DS 토큰만 사용하도록 점진 정리 (`bg-surface-20` → `bg-muted` 또는 신규 `bg-surface-subtle`).

### 8-9. 추가로 빠진 것 검토 — 확인 완료

위 8-1~8-9 외에 globals.css에 남아야 할 도메인 정책 블록을 다시 훑었어. **추가로 빠진 항목 없음**. 단:

- `@import "shadcn/tailwind.css"`는 shadcn keyframes·variants(accordion-down/up·data-open/closed/checked 등) 정의로 컴포넌트가 의존. **유지 — DS와 무관.**
- riNovel `app/globals.css`의 `@theme inline` 색 매핑(`--color-surface-*`, `--color-on-surface-*` 등)은 자체 토큰 의존이므로, A0.8에서 자체 토큰 삭제와 함께 매핑도 정리.

---

## 부록 — DS 측 작업 완료 후 리노벨 측 실행 순서 재확인

DS 작업이 끝났다는 신호가 오면:

- **A0**: globals.css에 `@import "design-system/tokens.css"`/`/theme.css`/`/typography.css` 추가. 시각 회귀 7개 후보 토큰(`--accent`, `--accent-foreground`, `--ring`, `--radius`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--border`/`--input`)을 리노벨 자체 블록에서 override. dev 서버 회귀 검수.
- **A0.5**: `my-*` → `space-*` 일괄 교체 스크립트(`SPACING_UTILITY_PREFIXES` × 21개 my- 매핑). 1332곳. 검수.
- **A0.6**: `import { cn } from "@/lib/utils"` → `import { cn } from "design-system/utils"` 일괄 교체. `app/src/lib/utils.ts` 삭제.
- **A0.7**: typography는 클래스명 동일하므로 사용처 변경 0건. globals.css의 27개 `@utility` 블록만 삭제 (DS의 typography.css가 대신함).
- **A0.8**: globals.css에서 자체 토큰 블록 정리 — Material 결, shadow-elevation, z-index, my- spacing, typography utility, `@theme inline` 색 매핑까지. 사용처 클래스명 치환(Material 결 매핑표 § 2-4 사용).
- **A1**: `components/shared/EmptyState.tsx` 신규 — `design-system/ui/button`·typography·spacing 첫 사용 사례. 시각 회귀 검수.

---

명세 끝. 이 문서를 DS 측 세션에 그대로 가져가서 흡수 작업 시작. 흡수 작업 중 결정 필요 항목(`--on-primary-container` 강도, `--surface-20` 처리, `border-border-10/-20` 투명/솔리드, 다크 그림자 알파, `bg-surface-30`/`bg-surface-5` 무효 코드)은 DS 디자이너 합의 또는 본 세션에 다시 가져와 협의. **코드 변경은 시작 안 함, 대기.**
