# 디자인 시스템 가이드

> **단일 소스 원칙 (2026-06-30 개정)**
> `design-system` 패키지가 UI 토큰·컴포넌트의 **절대 기준**이다.
> 코드(`app/src/app/globals.css`, `app/src/components/**`)와 불일치할 경우 **DS 패키지를 기준**으로 코드를 수정한다.
>
> - DS 패키지 위치: `../../Design System Test/packages/design-system`
> - node_modules 심볼릭 링크: `app/node_modules/design-system`
> - DS 흡수 명세 (완료본): [`docs/wip/ds-absorption-spec.md`](wip/ds-absorption-spec.md)

---

## 정책 히스토리

- **~ 2026-06-29**: 리노벨 자체 토큰(`--surface-*`, `--on-surface-*`, `--spacing-my-*`, `text-body*_*` 자체 @utility 등)이 단일 소스였음. 이 시기 문서(리노벨 자체 토큰 정의·`npm run migrate:tokens` 매핑표 등)는 **폐기**.
- **2026-06-30**: DS 흡수 완료.
  - DS `tokens.css` · `theme.css` · `typography.css` import
  - 리노벨 `:root` 자체 토큰·`@theme inline` 매핑 완전 삭제
  - `my-*` 스페이싱 1332곳 → DS `space-*` 일괄 치환
  - `text-body3_500` 등 27개 합본 typography 유틸은 DS의 `typography.css`에서 정의 (같은 이름 유지)
  - `cn` 단일 소스: `design-system/utils`
  - Material 결 별칭(`bg-surface-*`, `text-on-surface-*`, `bg-error-error*`, `bg-secondary-secondary-container` 등) → DS 정식 토큰(`bg-muted`/`bg-background`, `text-foreground(-muted/-placeholder/-disabled)`, `bg-destructive*`, `bg-secondary-container` 등)으로 일괄 치환

---

## Part 1: UI 원칙

### 목표

- UI의 최우선 목표는 **사용자 경험의 일관성**이다.
- 새 기능은 "새로운 화면"보다 **기존 사용자에게 익숙한 패턴 안에서 확장**한다.

### 재사용 우선순위

1. **DS 컴포넌트 그대로 사용** — `import { Button } from "design-system/ui/button"`
2. **DS 컴포넌트를 리노벨 어댑터로 래핑** — `app/src/components/ui/*`가 DS 컴포넌트를 감싸 도메인 prop을 노출 (Phase C에서 진행)
3. **도메인 wrapping** — 도메인 컴포넌트(`ProfileEditModal`, `EpisodePromptReferenceModal` 등)는 DS Dialog·DS Popover 위에 도메인 상태·카피·레이아웃만 얹는다. DS 컴포넌트를 fork하지 않는다.

같은 역할의 UI가 여러 스타일로 분화되지 않도록, 비슷한 기능은 동일한 인터랙션·시각 패턴으로 유지한다.

### 레이아웃 및 반응형

- **Mobile First**: 기본 레이아웃은 모바일 기준, 확장은 `md:`·`lg:` 접두사.
- **최대 폭 제약**: 최상위 컨테이너에는 최대 폭을 설정한다.
- 고정 width 값(`w-[800px]` 등)을 전체 레이아웃에 하드코딩하지 않는다.

### 토큰 원칙

- 색상·간격·타이포·radius·shadow·motion·z-index는 **모두 DS 토큰**을 사용한다.
- 임의값(`bg-white`, `text-slate-500`, `rounded-2xl` 등) 사용 금지 — 대응되는 DS 토큰을 사용한다.
- DS에 대응 토큰이 없을 때는 **DS에 흡수**를 요청하고, 어댑터에서 절대 임의 정의하지 않는다.

---

## Part 2: 사용 가능한 토큰 (DS)

### 원본 소스 (여기서 값이 정의된다)

| 파일 | 역할 |
|------|------|
| `packages/design-system/src/tokens.css` | `:root` / `.dark` — CSS 변수 정본 (색·space·radius·shadow·motion) |
| `packages/design-system/src/theme.css` | Tailwind `@theme inline` — 변수를 유틸 클래스로 매핑 + `@utility z-*` |
| `packages/design-system/src/typography.css` | `@utility text-{heading|body|caption}{n}_{weight}` 27종 |
| `packages/design-system/src/spacing-tokens.ts` | `SPACING_SCALE` 상수 (docs용) |
| `packages/design-system/src/typography-tokens.ts` | `TYPOGRAPHY_SCALE` 상수 (docs용) |

### 리노벨 globals.css에서 import 하는 순서

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "design-system/tokens.css";
@import "design-system/theme.css";
@import "design-system/typography.css";
@import "shadcn/tailwind.css";
```

리노벨은 이 아래에 **자체 토큰을 정의하지 않는다** (Geist 폰트 family만 유지 — 도메인 정책).

---

### 1. 타이포그래피

폰트 패밀리: **Pretendard JP** (전역 · DS `fonts.css`)
**정책**: `text-{size}` + `font-{weight}` + `leading-*` 조합 절대 금지. 반드시 합본 단일 클래스만 사용.

#### Heading
| 클래스 | Size | Line Height | Weight |
|---|---|---|---|
| `text-heading1_700` | 32px | 38px | 700 |
| `text-heading2_700` | 24px | 34px | 700 |
| `text-heading2_500` | 24px | 34px | 500 |
| `text-heading3_700` | 22px | 30px | 700 |
| `text-heading3_500` | 22px | 30px | 500 |
| `text-heading4_700` | 20px | 28px | 700 |
| `text-heading4_500` | 20px | 28px | 500 |
| `text-heading5_700` | 18px | 26px | 700 |
| `text-heading5_500` | 18px | 26px | 500 |

#### Body
| 클래스 | Size | Line Height | Weight |
|---|---|---|---|
| `text-body1_700` | 16px | 24px | 700 |
| `text-body1_500` | 16px | 24px | 500 |
| `text-body1_400` | 16px | 24px | 400 |
| `text-body2_700` | 15px | 22px | 700 |
| `text-body2_500` | 15px | 22px | 500 |
| `text-body2_400` | 15px | 22px | 400 |
| `text-body3_700` | 14px | 20px | 700 |
| `text-body3_500` | 14px | 20px | 500 |
| `text-body3_400` | 14px | 20px | 400 |
| `text-body4_700` | 13px | 18px | 700 |
| `text-body4_500` | 13px | 18px | 500 |
| `text-body4_400` | 13px | 18px | 400 |

#### Caption
| 클래스 | Size | Line Height | Weight |
|---|---|---|---|
| `text-caption1_700` | 12px | 16px | 700 |
| `text-caption1_500` | 12px | 16px | 500 |
| `text-caption1_400` | 12px | 16px | 400 |
| `text-caption2_700` | 11px | 14px | 700 |
| `text-caption2_500` | 11px | 14px | 500 |
| `text-caption2_400` | 11px | 14px | 400 |

**금지된 예외**: `font-weight: 600` `800`, `10px` 이하 폰트. 예외 필요 시 DS 측에 추가를 요청.

---

### 2. 컬러 — 시맨틱 토큰

DS 정책: `text-{role}-foreground` 는 **짝 `bg-{role}` 안에서만** 사용. 단독 흐린 텍스트는 `text-foreground-muted/-placeholder/-disabled`.

#### 표면 · 전경
| 클래스 | 라이트 | 다크 | 용도 |
|---|---|---|---|
| `bg-background` `text-foreground` | white / grayscale-140 | grayscale-140 / grayscale-10 | 기본 페이지·카드 표면 |
| `bg-canvas` | white | black | 전체 캔버스 (특수) |
| `bg-card` `text-card-foreground` | = background pair | = background pair | 카드 (Alias) |
| `bg-popover` `text-popover-foreground` | = background pair | = background pair | 팝오버 (Alias) |
| `bg-inverse` `text-inverse-foreground` | grayscale-140 / white | grayscale-10 / grayscale-140 | 반전 표면 (다크 칩·툴팁·인버스 카드) |
| `bg-muted` `text-muted-foreground` | grayscale-15 / grayscale-90 | grayscale-130 / grayscale-70 | 부드러운 표면 (호버 배경·비활성 인풋) |

#### 텍스트 위계 (단독 사용)
| 클래스 | 라이트 | 다크 | 용도 |
|---|---|---|---|
| `text-foreground` | grayscale-140 | grayscale-10 | 주요 텍스트 |
| `text-foreground-muted` | grayscale-110 | grayscale-70 | 보조 텍스트 (구 `text-on-surface-20`) |
| `text-foreground-placeholder` | grayscale-70 | grayscale-80 | 플레이스홀더·비활성 라벨 (구 `text-on-surface-30`) |
| `text-foreground-disabled` | grayscale-60 | grayscale-70 | disabled 텍스트 |

#### 브랜드 · 액션
| 클래스 | 라이트 | 다크 |
|---|---|---|
| `bg-primary` `text-primary-foreground` | brand-500 / white | brand-500 / white |
| `bg-accent` `text-accent-foreground` | brand-50 / brand-600 | brand-800 / brand-100 |
| `bg-secondary` `text-secondary-foreground` | grayscale-15 / grayscale-140 | grayscale-130 / grayscale-10 |

#### Container 패턴 (Material 결)
| 클래스 | 라이트 | 다크 | 용도 |
|---|---|---|---|
| `bg-primary-container` `text-on-primary-container` | brand-100 / brand-700 | brand-800 / brand-100 | 강조 배지·칩 |
| `bg-secondary-container` `text-on-secondary-container` | grayscale-110 / white | grayscale-130 / white | 어두운 컨테이너 |
| `bg-destructive-container` `text-on-destructive-container` | error-100 / error-600 | error-800 / error-100 | 에러 배지 |

#### 상태 · 피드백
| 클래스 | 라이트 | 다크 |
|---|---|---|
| `bg-destructive` `text-destructive-foreground` | error-500 / white | error-400 / white |
| `bg-success` `text-success-foreground` | success-500 / white | success-400 / white |
| `bg-warning` `text-warning-foreground` | warning-500 / grayscale-140 | warning-400 / grayscale-140 |
| `bg-info` `text-info-foreground` | info-500 / white | info-400 / white |

#### 보더 · 디바이더 · 딤
| 클래스 | 라이트 | 다크 | 용도 |
|---|---|---|---|
| `border-border` | grayscale-20 | grayscale-110 | 기본 보더 |
| `border-border-strong` | grayscale-140 | grayscale-10 | 강조 보더 |
| `border-border-inverse` | white | grayscale-140 | 반전 표면 위 |
| `border-divider` `bg-divider` | grayscale-15 | grayscale-130 | 약한 분리선 |
| `border-divider-strong` `bg-divider-strong` | grayscale-30 | grayscale-110 | 강한 분리선 |
| `bg-dim-10` | rgba(0,0,0,0.28) | rgba(0,0,0,0.40) | 가벼운 dim |
| `bg-dim-20` | rgba(0,0,0,0.53) | rgba(0,0,0,0.60) | 중간 dim (모달) |
| `bg-dim-30` | rgba(0,0,0,0.67) | rgba(0,0,0,0.75) | 강한 dim |

#### 비활성
| 클래스 | 라이트 | 다크 |
|---|---|---|
| `bg-disabled` `text-disabled-foreground` `border-disabled-border` | grayscale-15 / grayscale-60 / grayscale-40 | grayscale-120 / grayscale-70 / grayscale-110 |

#### 입력 · 링
| 클래스 | 값 |
|---|---|
| `border-input` | grayscale-30 (라이트) / grayscale-110 (다크) |
| `ring-ring` | brand-500 (라이트) / brand-400 (다크) — **focus indicator는 브랜드 핑크** |

---

### 3. 컬러 — 프리미티브 (직접 사용 지양)

시맨틱 매핑 부재 시에만. UI 코드에서는 시맨틱 토큰을 우선.

| 스케일 | 예 |
|---|---|
| `grayscale-{0,10,15,20,30,40,50,60,70,80,90,100,110,120,130,140}` | 흑백 스케일 |
| `brand-{50,100,200,300,400,500,600,700,800,950}` | 브랜드 스케일 |
| `error-{50,100,200,400,500,600,800,950}` | 에러 스케일 |
| `success-{50,100,200,400,500,600,800,950}` | 완료 |
| `warning-{50,100,200,400,500,600,800,950}` | 주의 |
| `info-{50,100,200,400,500,600,800,950}` | 안내 |
| `white-opacity-{10~130}` `black-opacity-{10~130}` | 투명 스케일 |
| `white` `black` | 절대 |

**`text-white`·`bg-white`·`bg-black`·`text-black` 하드코딩 금지** — `bg-background`/`bg-inverse`/`text-inverse-foreground` 등 시맨틱으로.

---

### 4. 스페이싱

DS 기본 Tailwind spacing 네임스페이스 사용. `p-2`, `gap-4`, `px-5`, `size-8` 등 표준 형식.

| 클래스 | px | 클래스 | px |
|---|---|---|---|
| `px` | 1 | `10` | 40 |
| `0.5` | 2 | `11` | 44 |
| `1` | 4 | `12` | 48 |
| `2` | 8 | `13` | 52 |
| `3` | 12 | `14` | 56 |
| `4` | 16 | `15` | 60 |
| `5` | 20 | `16` | 64 |
| `6` | 24 | `17` | 68 |
| `7` | 28 | `18` | 72 |
| `8` | 32 | `20` | 80 |
| `9` | 36 |  |  |

**폐기**: `my-*` 접두 스케일 (구 리노벨 토큰). 사용처는 A0.5에서 모두 DS `space-*`로 치환됨. 새 코드에서 `my-*` 사용 금지.

---

### 5. Radius (모서리)

| 클래스 | 값 |
|---|---|
| `rounded-xs` | 0.125rem = 2px |
| `rounded-sm` | 0.25rem = 4px |
| `rounded-md` | 0.5rem = 8px |
| `rounded-lg` | 0.75rem = 12px (**DS `--radius` 기본값**) |
| `rounded-xl` | 1rem = 16px |
| `rounded-2xl` | 1.25rem = 20px |
| `rounded-full` | 9999px |

**정책**:
- 비인터랙티브 표면(카드·패널·모달 셸) 기본 라운드는 **`rounded-lg` (12px)**.
- 인터랙티브 컴포넌트(버튼·인풋·칩)는 DS 컴포넌트가 자체 값을 지정 (예: DS Chip은 `rounded-full`).

이전 리노벨 `rounded-2xl`/`rounded-3xl`/`rounded-4xl` 값(리노벨 자체 `--radius: 0.625rem` 기반)은 **폐기**. `rounded-[4px]`처럼 임의값 하드코딩도 지양.

---

### 6. Elevation (그림자)

| 클래스 | 값 (라이트) | 값 (다크) | 용도 |
|---|---|---|---|
| `shadow-elevation-10` | `0px 1px 2px 1px rgba(0,0,0,0.06)` | 알파 `0.32` | 카드·인풋 호버 |
| `shadow-elevation-20` | `0px 2px 4px 2px rgba(0,0,0,0.06)` | 알파 `0.32` | 카드·인풋 |
| `shadow-elevation-30` | `0px 4px 8px 3px rgba(0,0,0,0.06)` | 알파 `0.32` | 드롭다운·툴팁 |
| `shadow-elevation-40` | `0px 8px 12px 4px rgba(0,0,0,0.06)` | 알파 `0.32` | 팝오버·바텀시트 |
| `shadow-elevation-50` | `0px 8px 16px 6px rgba(0,0,0,0.06)` | 알파 `0.32` | 다이얼로그·모달 |
| `shadow-elevation-60` | `0px 12px 24px 8px rgba(0,0,0,0.06)` | 알파 `0.32` | 대형 모달·알림 |

`shadow-sm`/`shadow-md`/`shadow-lg` 등 Tailwind 기본 shadow 사용 금지.

---

### 7. Z-Index (레이어)

| 클래스 | 값 | 용도 |
|---|---|---|
| `z-base` | 0 | 기본 문서 흐름 |
| `z-dropdown` | 100 | 드롭다운·셀렉트 옵션 |
| `z-sticky` | 200 | 스티키 헤더·사이드바 |
| `z-overlay` | 300 | 모달 dim 백드롭·플로팅 패널 |
| `z-modal` | 400 | 다이얼로그·바텀시트 본문 |
| `z-toast` | 500 | 토스트·스낵바 (최상위) |

임의값(`z-50`, `z-[999]`) 사용 금지. 6단 위계로 충분하지 않으면 DS 측에 추가 요청.

---

### 8. Motion (모션)

| 클래스 | 값 | 용도 |
|---|---|---|
| `duration-short` | 100ms | 상태 전환·hover·focus·pressed |
| `duration-medium` | 200ms | 등장·토글된 영역 변경 |
| `duration-long` | 400ms | 큰 표면 전환·페이지 트랜지션 |
| `ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | 일반 상태 전환 |
| `ease-emphasized-decelerate` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | 등장 (감속) |
| `ease-emphasized-accelerate` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | 퇴장 (가속) |

**안무 규칙** (Material 결):
- 인터랙티브 상태 전환 → `duration-short` + `ease-standard`
- 등장 → `duration-medium` + `ease-emphasized-decelerate`
- 퇴장 → `duration-short` + `ease-emphasized-accelerate`
- 컴포넌트 내부 이동(thumb 등) → `duration-short` + `ease-standard`

임의 duration(`duration-150`, `duration-200`), 임의 easing(`ease-out`, `ease-in-out`) 지양.

---

### 9. 컨트롤 사이즈 (버튼·인풋)

DS 컴포넌트가 자체 값을 정의. 리노벨은 컴포넌트를 통해 사용, 사이즈 임의 override 지양.

| 티어 (`size` prop) | 높이 | 용도 |
|---|---|---|
| `xs` | 24px | 최소 버튼·배지 |
| `sm` | 32px | 소형 버튼·폼 |
| `default` | 36px | 기본 버튼·Input·Select |
| `xl` | 40px | 대형 폼·터치 |
| `lg` | 42px | 로그인 CTA·출금 등 폼 필드 |

### FieldLabel (16px default) → 필드 간격

`FieldLabel` / `FormFieldLabel`의 기본 사이즈는 **16px** (`size="default"`, `text-body1_700`).

이 라벨과 **바로 아래 컨트롤**(Input · Textarea · Select · 업로드 슬롯 등) 사이 세로 간격은 **8px가 기본값**이다.

- 클래스: `FORM_LABEL_CONTROL_STACK_CLASS` (`flex flex-col gap-2`) — 라벨·필드가 세로 스택일 때
- 시맨틱: DS `FIELD_LABEL_CONTROL_GAP` (default·lg `mt-2` / 8px, sm `mt-1` / 4px). `FIELD_LABEL_CONTROL_GAP_GROUP_CLASS`는 FieldLabel 바로 다음 형제에만
- `gap-2`와 `mt-2`를 겹치지 말 것. `gap-3`나 `gap-1`+`mt-1`로 8px를 만들지 않는다
- 필드 **그룹 간** 간격은 `space.form.formGroupGap` (`gap-4` / 16px) 등 별도 토큰

```tsx
<div className={FORM_LABEL_CONTROL_STACK_CLASS}>
  <FormFieldLabel title="아이디" inputId="login-id" />
  <Input id="login-id" />
</div>
```

---

## Part 3: DS 컴포넌트 사용법

### 사용 가능한 컴포넌트

`design-system/ui/*` 경로로 import. 리노벨은 필요 시 도메인 wrapping을 얹는다.

| import | Base | 리노벨 어댑터 위치 (Phase C 예정) |
|---|---|---|
| `design-system/ui/button` | `@base-ui/react` | `components/ui/button.tsx` |
| `design-system/ui/dialog` | `@base-ui/react` | `components/ui/dialog.tsx` (Close 숨김 래퍼) |
| `design-system/ui/dropdown-menu` | `@base-ui/react` | `components/ui/dropdown-menu.tsx` |
| `design-system/ui/popover` | `@base-ui/react` | `components/ui/popover.tsx` |
| `design-system/ui/input` | `@base-ui/react` | `components/ui/input.tsx` |
| `design-system/ui/textarea` | native | `components/ui/textarea.tsx` |
| `design-system/ui/select` | `@base-ui/react` | `components/ui/select.tsx` |
| `design-system/ui/checkbox` `radio-group` `switch` `toggle` `slider` | `@base-ui/react` | 도메인 필요 시 wrapping |
| `design-system/ui/chip` | `@base-ui/react` toggle | `components/ui/chip.tsx` |
| `design-system/ui/tabs` | `@base-ui/react` | `components/ui/segmented-text-tabs.tsx` (도메인) |
| `design-system/ui/badge` | native span | `components/ui/badge.tsx` |
| `design-system/ui/avatar` | `@base-ui/react` | 헤더는 `design-system/ui/avatar` 직접 사용 |
| `design-system/ui/tooltip` | `@base-ui/react` | 필요 시 |
| `design-system/ui/sonner` | `sonner` | `components/ui/toaster.tsx` |
| `design-system/ui/card` `alert` `accordion` `skeleton` `separator` `progress` `label` `button-group` `icon` | 각각 | 필요 시 |

현재 핀: **`github:upnunde/Renovel-Studio-DS#v0.1.51`**

### v0.1.51 변경 (앱에 바로 반영)

| 컴포넌트 | 변경 | 앱 영향 |
|---|---|---|
| `Tabs` (`line` · `text`) size `2xl` | 탭 목록 간격 `gap-6`(24px) → **`gap-5`(20px)** (`TABS_TEXT_LIST_GAP_BY_SIZE`) | 분석·내 작품·알림·문의·반응 등 `TabsList` `size="2xl"` 자동 적용. 앱 래퍼 변경 없음. Figma XL(`tab-styles` `gap-5`)과 일치 |

### v0.1.50 변경 (앱에 바로 반영)

| 컴포넌트 | 변경 | 앱 영향 |
|---|---|---|
| `FieldLabel` ↔ Input 간격 | sm 4px → **전 size 8px**. `FIELD_LABEL_CONTROL_GAP_GROUP_CLASS` = `gap-2`. `FIELD_LABEL_CONTROL_GAP_PX` | 마이페이지 `size="sm"` 라벨–필드도 8px. `InputGroup`이 `gap-2`로 간격 소유 |
| `InputGroup` | Hypertext 전용 `mt-2` 제거 — 그룹 `gap-2`로 통일 | 앱 Input 어댑터 변경 없음 |

### v0.1.49 · v0.1.48 변경 (앱에 바로 반영)

| 컴포넌트 | 변경 | 앱 영향 |
|---|---|---|
| `FieldLabel` `size="sm"` | 타이틀 타이포 `body3-*` → **`body2-*`** | 마이페이지 등 `size="sm"` 라벨이 자동으로 body2. 앱 코드 변경 없음 |
| `Input` / `EmailInput` / `PasswordInput` / `FileInput` | 지우기 버튼은 **값이 있어도 포커스(`focus-within`)일 때만** 노출. `inputEndActionPaddingWhenFocused`. 클리어 후 `input.focus()` | DS 직접 사용처(로그인 EmailInput, 앱 Input 어댑터)는 자동 적용. 비포커스 시 우측 패딩도 예약하지 않음 |
| `InputClearButton` | `opacity-0` + `pointer-events-none`, `group-focus-within/input-root`에서 표시. mousedown `preventDefault`로 blur 방지 | 앱 래퍼 변경 없음 |

### v0.1.47 · v0.1.46 변경 (앱에 바로 반영)

| 컴포넌트 | 변경 | 앱 영향 |
|---|---|---|
| `FieldLabel` | `weight` 500/600/700 합본 타이포. 라벨↔필드 간격은 FieldLabel이 그리지 않음 | 기본 `weight="700"` 유지. 간격은 `FIELD_LABEL_CONTROL_GAP` |
| 간격 토큰 | default·lg **8px** (`mt-2`), sm **4px** (`mt-1`). `FIELD_LABEL_CONTROL_GAP_GROUP_CLASS` | 세로 스택은 기존 `FORM_LABEL_CONTROL_STACK_CLASS` (`gap-2`). 둘을 겹치지 말 것 |
| `Input` / `InputGroup` | 스펙에 FieldLabel 간격 소유 명시. Hypertext 행 레이아웃 | 앱 Input 어댑터 변경 없음 |
| 타이포 | `_600` 유틸 추가 (heading·body·caption). `cn` twMerge 합본 그룹 | `text-body1_600` 등 사용 가능. 합본 옆에 `leading-*`/`font-*` 붙이지 말 것 |

### v0.1.45 변경 (앱에 바로 반영)

| 컴포넌트 | 변경 | 앱 영향 |
|---|---|---|
| `FieldLabel` | `description` 최대 3줄 배열 지원, `info` 툴팁(타이틀 행 아이콘) | 기존 `description` 문자열은 그대로. 여러 줄 안내는 `string[]`. 추가 설명은 `info` |
| 스펙 | `specs/field-label.spec.json` — description 최대 3줄, info 툴팁 nativeNotes | 앱 래퍼 `field-label.tsx`는 DS re-export라 별도 코드 변경 없음 |

### v0.1.44 변경 (앱에 바로 반영)

| 컴포넌트 | 변경 | 앱 영향 |
|---|---|---|
| `Input` / `Textarea` / `EmailInput` / `PasswordInput` | `readOnly` 네이티브 지원 — `uiReadOnlyField` · `readOnlyFieldHandlers` (포커스·클릭 차단, ring 제거, `tabIndex=-1`) | 보기 전용 필드는 `disabled` 대신 `readOnly` + 필요 시 `bg-background-muted`만 추가. 수동 `pointer-events-none`·`tabIndex` 제거 |
| `ui-disabled` | `readOnlyFieldHandlers()` export 추가 | EmailInput 자동완성·PasswordInput 토글도 readOnly 시 비활성 |

### v0.1.42 변경 (앱에 바로 반영)

| 컴포넌트 | 변경 | 앱 영향 |
|---|---|---|
| `Dialog` / `DialogInlineShell` | 본문 패딩 `p-5` → `px-5 pt-8 pb-5` | 기본 Dialog는 상단 32px. `className="p-0"` 도메인 모달은 기존대로 덮어씀 |
| 토큰 | `--space-modal-header-padding-top` (`space-8` / 32px) 추가 | `space.overlay.modalHeaderPaddingTop` (`pt-8`) |
| `AvatarImage` | 이미지 dim `--black-opacity-10` → `--black-opacity-20` | DS Avatar를 쓰는 헤더 프로필에 적용 |

### 유틸

```ts
import { cn } from "design-system/utils"          // tailwind-merge + typography group
import { ICONS } from "design-system/icons"       // Lucide 아이콘 집합
import { CONTROL_SIZE_SCALE } from "design-system/component-size-tokens"
import { SPACING_SCALE } from "design-system/spacing-tokens"
import { TYPOGRAPHY_SCALE } from "design-system/typography-tokens"
```

`cn` 은 리노벨 자체 함수를 대체함. `@/lib/utils`에서 `cn`을 import하지 않는다 (파일 자체가 삭제됨).

### 도메인 wrapping 예시 — 모달

```tsx
// app/src/components/ProfileEditModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "design-system/ui/dialog"
import { Button } from "design-system/ui/button"
import { useProfile } from "@/hooks/useProfile"

export function ProfileEditModal({ open, onClose }: Props) {
  const profile = useProfile()
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>프로필 편집</DialogTitle>
        </DialogHeader>
        {/* 도메인 폼 */}
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>취소</Button>
          <Button onClick={() => profile.save()}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

DS 컴포넌트는 그대로, 리노벨은 도메인 상태·이벤트·레이아웃만 얹는다.

### 도메인 특화 컴포넌트 (DS 없음 — 리노벨 유지)

- `FloatingAiComposerPortal`, `floating-composer-bar` — AI 프롬프트 바
- `EditorSubHeader`, `EditorMobilePreviewPlayer`, `ScriptBlock`, `ChoiceBlockTable` 등 — 에디터 도메인
- `MobileViewportSync`, `DevConsoleFilter` — 앱 셸 유틸

이들은 DS 컴포넌트를 **베이스로 조합**해 만든다. 자체 스타일도 DS 토큰만 사용.

---

## Part 4: 다크 모드

- 토글 훅: `app/src/hooks/useThemeMode.ts` — `<html class="dark">` 클래스 토글.
- 저장소: `localStorage`.
- CSS: DS `.dark` 블록이 자동으로 모든 시맨틱 토큰을 다크 값으로 재정의.

### 다크 모드에서 안전한 패턴

- **✅ OK**: `bg-background`, `bg-muted`, `text-foreground`, `text-foreground-muted`, `border-border`, `bg-primary` 등 시맨틱 토큰
- **❌ 금지**: `bg-white`, `bg-black`, `text-white`, `text-slate-500` 등 하드코딩 절대색
- **⚠️ 주의**: `bg-inverse text-inverse-foreground` 페어 — 짝으로만 사용. `text-inverse-foreground` 단독 사용은 부적절

### 리노벨 도메인 CSS의 다크 대응

`app/src/app/globals.css` 하단의 도메인 블록은 다크 모드에서 시각적으로 자연스러운지 개별 검수 필요:

- AI 오버레이 keyframes·utility (`ai-orb-*`, `ai-loading-text-shimmer`, `composer-bar-gradient-inner` 등)
- 에디터 씬 타이틀 override
- 모바일 sticky 패치
- `bg-black` 강제 치환 (`button.bg-black` → `#343436`)

DS 시맨틱으로 옮길 수 있는 것은 옮기고, 완전히 도메인 특화된 것(AI shimmer 그라디언트 등)만 `--on-surface-inverse` 등 DS 변수를 참조하도록 유지한다.

### 메타 theme-color

`app/src/lib/mobile-viewport.ts`의 `APP_BROWSER_BG_BACKGROUND_20_THEME_COLOR = "#F8F8FC"`는 라이트 모드 색만 노출. 다크 모드 대응 위해 `<meta name="theme-color" media="(prefers-color-scheme: dark)">` 병기 또는 JS 갱신 필요.

---

## Part 5: 안티패턴 (리뷰에서 즉시 수정)

| 잘못된 예 | 이유 | 올바른 방향 |
|---|---|---|
| `text-body1_500 leading-5` | 합본 클래스에 line-height 포함 | `text-body1_500` |
| `text-body3_500 font-medium` | weight 중복 | `text-body3_500` |
| `text-sm font-bold` | 합본 클래스 미사용 | `text-body3_700` |
| `bg-white` | 하드코딩 · 다크에서 안 바뀜 | `bg-background` (표면) 또는 `bg-inverse-foreground` (반전 텍스트) |
| `bg-black` `text-black` | 하드코딩 | `bg-inverse` / `text-foreground` |
| `text-slate-500` `border-slate-200` | Tailwind 팔레트 하드코딩 | `text-foreground-muted` / `border-border` |
| `rounded-2xl` on 모달 셸 | DS 기본 `rounded-lg` 사용 | `rounded-lg` 또는 컴포넌트가 정의한 값 |
| `shadow-lg` | Tailwind 기본 shadow | `shadow-elevation-40` |
| `z-50` `z-[999]` | 임의 z-index | `z-modal` / `z-toast` |
| `import { cn } from "@/lib/utils"` | 삭제된 파일 | `import { cn } from "design-system/utils"` |
| `bg-secondary-secondary-container` | Figma 이름 별칭 (폐기됨) | `bg-secondary-container` |
| `text-on-surface-*` | 폐기된 시맨틱 | `text-foreground(-muted/-placeholder/-disabled)` |
| `bg-error-error*` | 폐기된 시맨틱 | `bg-destructive*` |
| 인라인 `style={{ borderRight: "1px solid rgba(0,0,0,0.07)" }}` | 하드코딩 + inline | `border-r border-border` |
| `p-my-24` `gap-my-16` `h-my-36` (리노벨 my-* 스케일) | 폐기 | `p-6` `gap-4` `h-9` |

---

## Part 6: `cn()` · `tailwind-merge`

- 단일 소스: **`design-system/utils`** (`cn`)
- 리노벨의 `app/src/lib/utils.ts`는 **삭제됨**
- DS `cn`은 `extendTailwindMerge`로 typography 합본 클래스(`text-body|heading|caption\d+_\d{3}`)를 `font-size` 그룹으로 인식 → `cn("text-sm", "text-body3_500")` 시 후자만 남음
- 스페이싱은 DS 표준 `--space-*` 그룹으로 자동 인식 (별도 extend 불필요)

**허용 조합**: 합본 typography 1개 + 색상 `text-*` 1개 (+ `text-center` 등 정렬)
**금지 조합**: 합본 typography 2개 · 합본 + `leading-*` · 합본 + `font-*` (weight)

```tsx
// ✅ 허용
cn("text-body3_500", "text-foreground-muted")
// → text-body3_500 text-foreground-muted

// ❌ merge 후 하나만 남음
cn("text-body3_500", "text-body1_700")
```

---

## Part 7: 카피·톤·접근성

### 언어
- 사용자 UI 카피는 **한국어 기본**.
- 코드 주석은 한국어 또는 영어, 사용자에게 보이는 문자열은 한국어 일관.

### 카피 톤
- 짧고 정중한 설명체 ("~해 주세요", "~했어요").
- 자책 유발 표현 지양, 다음 행동을 버튼에 명확히 표기.

### 피드백
- 임시저장·완료 등 비차단 알림은 **토스트** (sonner)로.
- 확인 필요한 이탈은 **모달**로 명시적 확인.

### 접근성
- 아이콘-only 버튼에 `aria-label` 제공.
- `@base-ui/react` 컴포넌트의 기본 키보드·포커스 동작 존중, 커스텀 시 포커스 트랩·탭 순서 유지.

---

## Part 8: 서비스 공통 표기

| 영역 | 규칙 |
|---|---|
| **날짜** `30초 미만` | `방금 전` |
| `1분 미만` | `SS초 전` |
| `60분 미만` | `MM분 전` |
| `24시간 미만` | `HH시간 전` |
| `24시간 이상` | `YYYY.MM.DD` |
| **수치** `<10,000` | 천 단위 구분 (`1`, `9,999`) |
| `≥10,000` | 만 단위 소수점 둘째까지 (`13,500 → 1.35만`) |
| **기간만료** `≥30일` | `YYYY.MM.DD 까지` |
| `<30일` | `DD일 남음` |
| `<24시간` | `HH시간 남음` |
| `<1시간` | `MM분 남음` |
| 만료 시 | `기간 만료` 고정 |

### 데이터 테이블 타이포

| 영역 | 타이포 | 비고 |
|---|---|---|
| 행 본문 (금액·날짜) | `text-body2_*` | 15px. 수익금 강조 `text-body2_700` |
| 상태 뱃지 | `text-caption1_400` · `sm:text-body4_400` | 12·13px |
| 표 헤더 | `text-caption1_400` | 12px |

---

## Part 9: DS에 없는 것 · 흡수 요청 절차

- DS에 필요한 토큰·컴포넌트가 없으면 **리노벨에서 임시 정의하지 말고 DS 측 세션에 흡수를 요청**한다.
- 요청 시 다음을 명시: (1) 사용 사례 (2) 시각·기능 스펙 (3) 기존 유사 토큰과의 차이
- 흡수 완료 신호를 받고 리노벨 코드에서 사용을 시작한다.

**현재 알려진 흡수 대기 항목**:
- container 페어 네이밍 통일 — 라이트 모드는 `--primary-container-foreground` 형태, 다크 모드는 `--on-primary-container` 형태. `theme.css`는 `--on-*` 매핑. 라이트에서 `text-on-primary-container` 폴백 발생. `--on-*`로 통일 필요.

---

## Part 10: 검증

```bash
# 리노벨 자체 폐기 토큰 잔존 검사 (0건이 정상)
grep -rn --include="*.tsx" --include="*.ts" "bg-white\b\|bg-black\b\|text-white\b\|text-black\b" src
grep -rn --include="*.tsx" --include="*.ts" "text-on-surface-\|bg-surface-\|bg-error-error\|bg-secondary-secondary" src
grep -rn --include="*.tsx" --include="*.ts" "\-my-[0-9]" src
grep -rn --include="*.tsx" --include="*.ts" 'from "@/lib/utils"' src

# 타이포 조합 잔존 검사 (0건이 이상적)
grep -rn --include="*.tsx" --include="*.ts" "text-body[0-9]_[0-9]\+.*leading-\|text-body[0-9]_[0-9]\+.*font-\(bold\|medium\)" src

# 타입 · 라우트
cd app && npx tsc --noEmit
```

- `bg-white`/`bg-black` 등 하드코딩 색은 이미지 위 절대 오버레이 등 특수 케이스가 있을 수 있음. 확인 후 최소로 유지 또는 `bg-inverse`/`text-inverse-foreground`로 대체.

---

## Part 11: 폐기·미사용 도구

아래 도구·상수는 **완전히 폐기**됨:

- `app/src/lib/utils.ts` — 삭제됨. `design-system/utils` 사용.
- `app/scripts/migrate-design-tokens.mjs` + `app/scripts/lib/token-migrate-rules.mjs` — 리노벨 자체 토큰(`my-*` 등) 마이그레이션 스크립트. 자체 토큰이 사라져서 obsolete.
- `app/scripts/migrate-rinovel-tokens.mjs` — Phase A0.5/A0.8 일괄 치환 스크립트. 일회성 실행 완료.
- 리노벨 자체 `--surface-*` `--on-surface-*` `--divider-*` `--border-10/20/30` `--dim-*` `--primary-container` `--secondary-container` `--error-error*` `--spacing-my-*` 정의 — 모두 삭제됨.
- 리노벨 자체 `@utility text-body*_*` 27종 — 삭제됨 (DS의 typography.css가 대신함).
- 리노벨 자체 `@utility z-{base|dropdown|sticky|overlay|modal|toast}` — 삭제됨 (DS의 theme.css가 대신함).
- 리노벨 자체 `--shadow-elevation-*` 정의 — 삭제됨.
- Figma 별칭 (`bg-secondary-secondary-container`, `text-primary-on-primary-container` 등) — 사용처 일괄 치환 완료.

---

## 참고

- DS 흡수 명세 (Phase A0 작업 지시서): [`docs/wip/ds-absorption-spec.md`](wip/ds-absorption-spec.md)
- 모바일 레이아웃 정책: [`docs/mobile-layout.md`](mobile-layout.md)
- 에디터 정책: [`docs/editor-policies.md`](editor-policies.md)
