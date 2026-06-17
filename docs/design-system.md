# 디자인 시스템 가이드

> **단일 소스 원칙**: 이 문서가 UI 원칙과 디자인 토큰의 공식 기준이다.  
> 코드(`app/src/app/globals.css`)와 불일치할 경우 이 문서를 기준으로 코드를 수정한다.

---

## Part 1: UI 원칙

### UI 목표

- UI 관점의 최우선 목표는 **사용자 경험의 일관성 유지**다.
- 새 기능은 "새로운 화면을 만드는 것"보다, 기존 사용자에게 **익숙한 패턴 안에서 확장**하는 것을 우선한다.

### 재사용 우선 원칙 (Interface/Foundation First)

- 신규 UI 구현 시 우선순위는 다음과 같다.  
  **1) 기존 컴포넌트 재사용 → 2) 기존 컴포넌트 변형(variant/props) → 3) 신규 컴포넌트 생성**
- 버튼, 입력, 모달, 팝오버, 토스트, 리스트 아이템 등 공통 인터페이스 요소는 가능한 한 기존 컴포넌트 계층을 사용한다.
- 같은 역할의 UI가 여러 스타일로 분화되지 않도록, 비슷한 기능은 동일한 인터랙션/시각 패턴으로 유지한다.

### 레이아웃 및 반응형 원칙 (Layout & Breakpoints)

- **Mobile First**: 기본 레이아웃은 모바일을 기준으로 작성하며, 데스크톱 등 확장이 필요할 때만 `md:`, `lg:` 접두사를 사용한다.
- **최대 폭 제약**: 콘텐츠가 무한히 늘어나지 않도록, 최상위 컨테이너에는 반드시 최대 폭(`max-w-screen-md` 등 프로젝트 합의 규격)을 설정하여 가독성을 방어한다.
- AI는 임의로 고정된 width 값(`w-[800px]`)을 전체 레이아웃에 하드코딩하는 것을 엄격히 금지한다.

### 토큰·변수 대응 원칙

- 색상, 간격, 타이포, radius, shadow 등은 임의 값보다 **이 문서에 정의된 디자인 토큰**을 우선 사용한다.
- 새 변수값이 필요할 때는 먼저 기존 토큰과 매핑 가능한지 검토한다.
- 불가피하게 새 토큰을 추가할 경우, 일회성 하드코딩이 아니라 **재사용 가능한 이름**으로 정의하고 이 문서에 추가한다.

### 토큰 전면 치환 원칙 (컴포넌트 기준)

> **한 줄 요약:** Part 2에 대응되는 값이면, 화면·컴포넌트·스타일 상수 어디에 있든 **항상 문서 토큰만** 쓴다. Tailwind 기본·임의·조합은 **치환 대상**이지 병행 기준이 아니다.

#### 0) 자동 치환 방식 — Tailwind 수치 → 문서 토큰

**원칙:** Tailwind 기본 스케일(`p-4`, `text-sm`, `h-10`, `shadow-lg` …)로 적힌 **수치·조합은 사람이 “비슷한 값”을 고르지 않는다.** 아래 §3 매핑표와 **동일 알고리즘**을 코드·에이전트·CI에 적용한다.

| 역할 | 위치 |
|------|------|
| 규칙 정의 (문서) | 이 절 §3 축별 매핑표 |
| 규칙 구현 (코드) | `app/scripts/lib/token-migrate-rules.mjs` |
| 일괄 적용 (CLI) | `app/scripts/migrate-design-tokens.mjs` → `npm run migrate:tokens` |
| `cn()` 병합 (타이포+색상) | `app/src/lib/utils.ts` — `extendTailwindMerge` |

**실행 파이프라인 (순서 고정):**

1. **컨트롤 높이 오버라이드** — `h-10`→`h-my-36` 등 (일반 스페이싱보다 **먼저**)
2. **스페이싱** — Tailwind `n` → `my-*` (표 조회). `*-0` 유지. `[Npx]`는 토큰 일치 또는 **스냅**(6→8, 10→8, 14→16, 동률→작은 쪽)
3. **Elevation / surface radius** — `shadow-lg`→`shadow-elevation-40`, `rounded-2xl`→`rounded-[4px]` 등
4. **타이포 infer** — 같은 요소의 `text-sm`+`font-medium`+`leading-5` → 단일 `text-body3_500` (접두사 `lg:` 유지)
5. **§7 검증** — grep·Tailwind 빌드·`check:routes`

```bash
# app/ 에서 — 기본 dry-run (변경 목록만)
npm run migrate:tokens

# 파일 반영
npm run migrate:tokens -- --write

# 축만 선택 (예: 스페이싱·높이만)
npm run migrate:tokens -- --axis=spacing,height --write
```

- **신규 작성:** 처음부터 Part 2 토큰만 쓴다 (치환 불필요).
- **기존 수정·마이그레이션:** 위 CLI로 자동 치환 → diff 리뷰 → §7 검증. CLI가 건너뛴 구간(§4 치환 불가)만 수동 처리.
- **에이전트 작업:** 파일을 직접 고칠 때도 **매핑표/규칙 모듈과 동일한 결과**가 나와야 한다. 표와 다른 “감각적” 선택 금지.

#### 1) 무엇을 스캔하는가 (치환 대상 코드)

아래 문자열 안의 Tailwind 클래스만 대상으로 한다. **JS/TS 숫자 props**(차트 `width={120}`, Radix `sideOffset` 등)는 건드리지 않는다.

| 대상 | 예시 경로·패턴 |
|------|----------------|
| JSX `className` | `className="px-5 text-sm"` |
| `cn()` / `cva()` / compoundVariants | `buttonVariants`, `chipVariants`, `modalFooterButtonToneClassName` |
| 스타일 상수 export | `app/src/lib/page-layout.ts`, `*-styles.ts`, `analytics-filter-chips.ts` |
| 페이지·레이아웃 | `app/src/app/**/page.tsx`, `layout.tsx` |

**스캔하지 않는 것:** 주석·JSDoc·Story 설명 문자열, `data-*` 속성, 인라인 `style={{ padding: 20 }}`(가능하면 className 토큰으로 이전).

#### 2) 1차 소스 — 여기를 먼저 맞춘다

개별 페이지를 고치기 전에 아래를 토큰화한다. 페이지에 레거시가 남아도 **1차 소스가 레거시면 그 값이 전파**된다.

| 우선순위 | 파일·모듈 | 역할 |
|----------|-----------|------|
| 1 | `app/src/app/globals.css` | `@theme` · `@utility` 토큰 정의 |
| 2 | `app/src/lib/chip-styles.ts`, `tab-styles.ts`, `form-field-styles.ts`, `page-layout.ts`, **`utils.ts`** | 컨트롤·탭·폼·페이지 인셋 · **`cn()` merge** |
| 3 | `app/src/components/ui/**` (`button`, `chip`, `dialog`, `modal/modal-styles` 등) | 공통 인터랙션 |
| 4 | `app/src/components/layout/**`, `Header`, `AppSidebar` | 셸 |
| 5 | 도메인 컴포넌트 (`series/`, `episode/`, `editor/`, `analytics/` …) | 화면별 UI |
| 6 | `app/src/app/**` | 라우트 페이지 |

#### 3) 축별 치환 규칙 (실행 매핑표)

##### 3-1. 스페이싱 (`my-*`)

> **자동 치환:** 아래 표는 `token-migrate-rules.mjs`의 `TAILWIND_N_TO_MY_SUFFIX`·`snapPxToMyToken()`과 동일하다. `npm run migrate:tokens -- --axis=spacing,height`.

**대상 prefix:** `p` `px` `py` `pt` `pb` `pl` `pr` `ps` `pe` · `m` `mx` `my` `mt` `mb` `ml` `mr` `ms` `me` · `gap` `gap-x` `gap-y` · `space-x` `space-y` · `h` `w` `size` `min-h` `min-w` `max-h` `max-w`(토큰 스케일에 들어오는 숫자만)

Tailwind 숫자 스케일 `n` (기본 4n px) → `my-<px>`:

| n | px | n | px | n | px |
|---|-----|---|-----|---|-----|
| px | 1 | 4 | 16 | 12 | 48 |
| 0.5 | 2 | 5 | 20 | 14 | 56 |
| 1 | 4 | 6 | 24 | 16 | 64 |
| 1.5 | 8 | 7 | 28 | 18 | 72 |
| 2 | 8 | 8 | 32 | 20 | 80 |
| 2.5 | 8 | 9 | 36 | | |
| 3 | 12 | 10 | 40 | | |
| 3.5 | 16 | 11 | 44 | | |

- **예:** `px-5`→`px-my-20`, `gap-4`→`gap-my-16`, `py-3`→`py-my-12`, `gap-1.5`→`gap-my-8`, `mt-4`→`mt-my-16`, `mx-2`→`mx-my-8`
- **`*-0`:** `p-0`, `gap-0`, `m-0` 등 **0은 그대로** 둔다.
- **임의 px `[Npx]`:** 표에 정확히 있으면 `*-my-N` (예: `[8px]`→`my-8`, `[20px]`→`my-20`). 없으면 **가까운 토큰으로 내림 스냅**(동률이면 작은 쪽): 6→8, 10→8, 14→16.
- **margin 약어:** `my-4`(상하 margin) → `my-my-16`, `mx-2` → `mx-my-8` 처럼 **`my-` 접두가 겹치는 형태를 허용**한다(문서 스케일 준수 우선).
- **치환하지 않음:** 80px 초과, `calc()`·`%`·`vw`/`vh`·`rem`/`em`·`auto`·`fr`·CSS 변수(`var(--*)`)

##### 3-2. 타이포그래피 (단일 클래스)

**금지:** 같은 요소에 `text-sm` + `font-medium` + `leading-5` 또는 `text-body1_500` + `leading-5` **혼용**.

1. **크기 토큰**을 찾는다: `text-xs`(12) … `text-3xl`(30), `text-[Npx]`. `text-on-surface-*`, `text-primary`, `text-center` 등 **색·정렬은 크기가 아님**.
2. **굵기:** 같은 요소의 `font-bold`/`font-semibold`→700, `font-medium`→500, `font-normal`/`font-light`→400. 없으면 body/caption→400, heading→700.
3. **단일 토큰**으로 교체 후 `leading-*`, `font-*`(weight) **삭제**. `font-['Pretendard_JP']`·`font-mono`·색·정렬은 유지.

| 레거시 조합 (대표) | 치환 토큰 |
|-------------------|-----------|
| `text-xs` (+ weight) | `text-caption1_400/500/700` |
| `text-sm` (+ weight) | `text-body3_400/500/700` |
| `text-base` (+ weight) | `text-body1_400/500/700` |
| `text-lg` (+ weight) | `text-heading5_400→500/700` (heading에 400 없음 → 500) |
| `text-xl` (+ weight) | `text-heading4_*` |
| `text-2xl` (+ weight) | `text-heading2_*` |
| `text-[15px]` (+ lh/weight) | `text-body2_*` |
| `text-[13px]` | `text-body4_*` |
| `text-[11px]` | `text-caption2_*` |

- **반응형:** `lg:text-2xl font-bold` → `lg:text-heading2_700` (접두사 유지, 값만 토큰화).
- **`cva` base + size:** base에 `text-body3_500`, size `lg`에 `text-body2_500`처럼 **size variant가 base를 덮어쓴다**. `cn`/`twMerge` 후 **한 요소에 타이포 토큰 하나**만 남도록 한다.

##### 3-3. 컨트롤 높이·아이콘 크기

| 레거시 | 치환 | 비고 |
|--------|------|------|
| `h-8`, `size-8`, `min-h-8` | `h-my-32`, `size-my-32`, `min-h-my-32` | compact 32px |
| `h-9`, `size-9` | `h-my-36`, `size-my-36` | standard 36px |
| `h-10`, `size-10` (컨트롤) | `h-my-36` / `size-my-36` | **40px 금지** |
| `h-12` (폼·CTA) | `h-[42px]` / `CONTROL_HEIGHT_FORM_CLASS` | **48px 금지** |
| `min-w-16`, `min-w-20` | `min-w-my-64`, `min-w-my-80` | 64·80px |

썸네일·아바타 등 **비컨트롤** 장식 40px은 `h-my-40`·`size-my-40`으로 크기만 유지(컨트롤 티어 아님).

##### 3-4. Elevation (shadow)

| 레거시 | 치환 |
|--------|------|
| `shadow-[0px_1px_2px_1px_rgba(0,0,0,0.1)]` | `shadow-elevation-10` |
| `shadow-[0px_2px_4px_2px_rgba(0,0,0,0.1)]` | `shadow-elevation-20` |
| `shadow-[0px_8px_16px_6px_rgba(0,0,0,0.1)]` | `shadow-elevation-50` |
| `shadow-sm` | `shadow-elevation-10` |
| `shadow-md` / `shadow-lg` | `shadow-elevation-30` / `shadow-elevation-40` (근사) |
| `shadow-xl` | `shadow-elevation-50` |

##### 3-5. Z-index

| 역할 | 치환 |
|------|------|
| 드롭다운·메뉴·팝오버 | `z-dropdown` |
| 고정 헤더·스티키 바 | `z-sticky` |
| 모달 딤 | `z-overlay` |
| 모달·다이얼로그 본문 | `z-modal` |
| 토스트·스낵바 | `z-toast` |

**예외 보존:** 에디터 오버레이·블록 툴바 등 **기존 `z-[60]`~`z-[200]` 미세 스택**은 동작 회귀 시 유지. **신규** 레이어는 위 역할 토큰부터 사용.

##### 3-6. Radius

| 대상 | 치환 |
|------|------|
| 모달·카드·패널·다이얼로그 **셸** | `rounded-2xl` / `rounded-xl` / `rounded-lg` → `rounded-[4px]` (모서리 분리: `rounded-t-[4px]` 등) |
| `Button`·`Chip`·`Input`·탭 | `rounded-md`, `rounded-[8px]`, `rounded-full` **유지** (인터랙티브) |

##### 3-7. 컬러

시맨틱에 대응 가능하면 **프리미티브·slate 하드코딩 제거**:

| 레거시 | 치환 방향 |
|--------|-----------|
| `text-slate-700`, `text-gray-*` | `text-on-surface-10` / `text-on-surface-20` / `text-on-surface-30` |
| `bg-white`(카드) | `bg-surface-10` |
| `border-slate-200` | `border-border-10` 또는 `border-border-20` |
| `#EC3232` 등 | `error-error`, `primary` 등 Part 2-3 시맨틱 |

#### 4) 치환 불가 — 억지 변환 금지

- 스페이싱 **80px 초과** (`pb-24` 등 Tailwind 96px는 스케일 밖이면 유지 또는 레이아웃 재검토)
- `calc(100vh - …)`, `%`, `min(92vw, 760px)` 등 **반응형 레이아웃 수식**
- 차트·캔버스 **좌표·크기 숫자 props**
- Figma 주석·스펙 설명용 클래스 문자열(실제 `className`에 안 붙는 경우)
- 1차 소스 variant를 **페이지 `className`으로 덮어쓰기** (`FilterChip`에 `px-2.5` 추가 등 — Part 2-9 칩 패딩 표가 단일 소스)

#### 5) 안티패턴 (리뷰에서 즉시 수정)

| 잘못된 예 | 이유 | 올바른 방향 |
|-----------|------|-------------|
| `text-body1_500 leading-5` | 토큰에 line-height 포함 | `text-body1_500`만 |
| `text-body3_500 font-medium` | weight 중복 | `text-body3_500`만 |
| `text-heading4_700 lg:text-2xl` | 반응형에 레거시 잔존 | `lg:text-heading2_700` |
| `text-base font-medium leading-5` on 모달 버튼 | 조합·구 line-height | `text-body1_500` |
| `Button` base `text-body3_500` + `className` `text-base …` | 이중 타이포 | `className`을 `text-body1_500` 등 **토큰 하나**로 |
| `cn('text-body3_500 text-on-surface-30')` 결과에 **타이포 토큰 없음** | `tailwind-merge`가 `text-*` 색상과 타이포를 동일 그룹으로 병합 | `app/src/lib/utils.ts`의 DS `font-size` 등록 유지 · 타이포+색상 **같은 요소 허용** |
| `shadow-lg` on `DialogContent` | elevation 미사용 | `shadow-elevation-40` 등 |
| `px-5` on `PageCard` 본문 | page-layout 상수 미사용 | `PAGE_CONTENT_PAD_X_CLASS` 또는 `px-my-20` |

#### 6) Before → After 예시

```tsx
// ❌ 레거시
<button className="h-9 px-3 text-base font-medium leading-5 text-on-surface-10" />

// ✅ 토큰 (standard 티어 + body1)
<button className="h-my-36 px-my-12 text-body1_500 text-on-surface-10" />
```

```tsx
// ❌ 레거시
<div className="flex gap-4 px-5 py-4 rounded-2xl shadow-lg" />

// ✅ 토큰
<div className="flex gap-my-16 px-my-20 py-my-16 rounded-[4px] shadow-elevation-40" />
```

```tsx
// ❌ 레거시 (FilterChip M과 동치)
<span className="text-sm font-medium leading-5 text-on-surface-30" />

// ✅ 토큰
<span className="text-body3_500 text-on-surface-30" />
```

#### 7) 완료 판정 · 검증 (Part 3 교차 참조)

치환 라운드가 끝났다고 보기 전에:

1. **레거시 잔존 grep** — `text-sm`, `text-base`, `leading-5`, `font-medium`, `shadow-lg`, `rounded-2xl`, `h-10`, `px-5` 등 (에디터·예외 구간은 별도 메모)
2. **이중 타이포 grep** — `text-body[0-9]_.*leading-` / `text-body[0-9]_.*font-(bold|medium)`
3. **1차 소스 우선** — `chip-styles`, `button.tsx`, `modal-styles`, **`utils.ts`**(merge)에 레거시 없음
4. **빌드** — `app/`에서 `npx @tailwindcss/cli -i src/app/globals.css -o /tmp/out.css`
5. **라우트** — `npm run check:routes`

잔존 레거시가 **치환 가능**한데 남아 있으면 **미완료**로 본다.

### 타이포그래피 단일 클래스 사용 원칙

- 글자 스타일을 지정할 때는 개별 Tailwind 유틸리티(`text-sm`, `leading-5`, `font-bold` 등)를 조합해서 섞어 쓰는 것을 **절대 금지**한다.
- 반드시 Part 2-1 표의 **단일 유틸리티 클래스**(예: `text-body1_700`)만 사용한다. 레거시→토큰 매핑·굵기 추론 절차는 위 **§3-2 타이포그래피**를 따른다.

### `cn()` · `tailwind-merge` (타이포 + 색상 공존)

`cva`·compound variant는 **타이포 토큰**과 **색상 `text-on-surface-*`** 를 같은 요소에 붙인다. shadcn이 DS 토큰을 거부하는 것이 아니라, 기본 `tailwind-merge`가 `text-*`를 한 그룹으로 보고 **하나만 남기는** 문제가 있었다.

| 구분 | 클래스 예 | merge 후 |
|------|-----------|----------|
| DS 타이포 | `text-body3_500` | `font-size` 그룹 |
| DS 색상 | `text-on-surface-30`, `text-secondary-on-secondary-container` | `text-color` 그룹 |
| 레거시 타이포 | `text-sm`, `text-base` | 기존 Tailwind 그룹 |

**구현:** `app/src/lib/utils.ts`의 `extendTailwindMerge`에서 아래를 등록한다. **신규 토큰 추가 시 이 파일도 함께 갱신**한다.

| 축 | 등록 | 목적 |
|----|------|------|
| 타이포 | `body\|heading\|caption` + `_400\|_500\|_700` → `font-size` | `text-body3_500` + `text-on-surface-*` 공존 |
| 스페이싱 | `my-1` … `my-80` → `theme.spacing` | `p-my-24`(기본) + `p-0`(오버라이드) **한쪽만** 남음 — 커스텀 셸 모달 필수 |

`DialogContent` 기본 `p-my-24` 위에 `className="p-0"`을 주는 모달(이미지 편집·`modalDialogContentClassName` 등)은 merge가 스페이싱을 인식하지 못하면 **바깥 패딩이 이중 적용**된다.

```tsx
// ✅ Chip M — merge 후 둘 다 유지
cn(chipVariants({ … }), "text-secondary-on-secondary-container")
// → text-body3_500 text-secondary-on-secondary-container

// ❌ merge 수정 전 — 색상만 남아 14px 토큰 소실
```

- **금지:** 같은 요소에 타이포 토큰 **2개**, 또는 타이포 토큰 + `leading-*` / `font-medium`
- **허용:** 타이포 토큰 **1개** + 색상 `text-*` **1개** (+ `text-center` 등 정렬)

### 언어

- **제품 UI 카피는 한국어**를 기본으로 한다.
- 코드 주석·문서는 팀 합의에 따라 한국어 또는 영어를 쓰되, **사용자에게 보이는 문자열**은 한국어 일관성을 우선한다.

### Global Policy (표기 규칙)

아래 규칙은 통계, 목록, 히스토리, 정산, 광고 등 **서비스 전반의 공통 표기 기준**으로 적용한다.

#### 날짜·시간 표기

- `30초 미만`: `방금 전`
- `1분 미만`: `SS초 전` (예: `30초 전`, `59초 전`)
- `60분 미만`: `MM분 전` (예: `1분 전`, `59분 전`)
- `24시간 미만`: `HH시간 전` (예: `1시간 전`, `23시간 전`)
- `24시간 이상`: `YYYY.MM.DD` (예: `2025.01.01`)
- 사용자에게 "최신이 위"인지 혼동이 없도록, 정렬 정책은 기본 문서와 맞춘다.

#### 수치 표기

- `10,000 미만`: 천 단위 구분 기호 사용 (예: `1`, `9,999`)
- `10,000 이상`: 소수점 둘째 자리까지 노출한 만 단위 표기 (예: `13,500 -> 1.35만`, `13,999 -> 1.39만`)
- 갱신 주기: 접속 및 새로고침 시 서버 최신 데이터 기준으로 갱신한다.

#### 기간만료 시간 표기

- `30일 이상`: `YYYY.MM.DD 까지` (예: `2026.01.31 까지`)
- `30일 미만`: `DD일 남음` (예: `1일 남음`, `30일 남음`)
- `24시간 미만`: `HH시간 남음` (예: `1시간 남음`, `23시간 남음`)
- `1시간 미만`: `MM분 남음` (예: `1분 남음`, `59분 남음`)
- 기간 만료 시: `기간 만료` 고정 텍스트 사용

#### 데이터 테이블 타이포 (정산 내역 등)

데스크톱 **행 본문**과 **상태 뱃지**는 타이포 티어를 분리한다. 코드 참고: `app/src/app/settlements/page.tsx` · `SETTLEMENT_STATUS_BADGE_TYPO_CLASS`.

| 영역 | 타이포 | px | 비고 |
|------|--------|-----|------|
| 행 본문 (금액·날짜·실지급액) | `text-body2_*` | 15px | 수익금 숫자 강조 `text-body2_700` |
| 상태 뱃지 | `text-caption1_400` · `sm:text-body4_400` | 12 · 13 | **행 15px 규칙에서 제외** |
| 표 헤더 (컬럼명) | `text-caption1_400` | 12px | 본문보다 한 단계 작게 |

### 접근성

- 아이콘만 있는 버튼(뒤로 가기, 히스토리 등)에는 **`aria-label`** 을 제공한다.
- 키보드·포커스는 Radix UI 컴포넌트의 기본 동작을 존중하고, 커스텀 시 **포커스 트랩·탭 순서**를 깨지 않는다.

### 시각 디자인

- **Tailwind 유틸리티**로 간격·타이포·색을 맞춘다. 시맨틱 토큰(`text-on-surface-10`, `primary`, `border-10` 등)을 제품 전반에서 일관되게 사용한다.
- 팝오버·다이얼로그는 **과한 너비·과한 애니메이션**보다 **읽기 쉬운 폭과 명확한 구획**을 우선한다.
- 컴포넌트 단위 커스터마이징이 필요할 때도, 먼저 기존 class 조합/variant로 해결하고 새로운 스타일 규칙 추가는 마지막 수단으로 둔다.

### 피드백

- 임시저장 완료 등은 **스낵바(토스트)** 등 비차단 피드백으로 짧게 알린다.
- 확인이 필요한 이탈은 **모달/다이얼로그**로 명시적으로 묻는다.

### 카피 톤

- 짧고 정중한 설명체("~해 주세요", "~했어요")를 기본으로 한다.
- 사용자 자책을 유발하는 표현은 피하고, **다음 행동**(임시저장, 취소)을 버튼에 분명히 적는다.

### Figma·MCP

- 디자인 시안과의 정합은 **스크린샷·토큰**을 참고하되, 최종 구현은 **이 저장소의 컴포넌트·토큰**에 맞춘다.

### 구현 전 체크리스트 (UI)

- 이 UI를 기존 컴포넌트로 구현할 수 있는가?
- 새 값이 필요하다면 기존 토큰으로 대응 가능한가?
- **치환 가능한 스타일은 모두 Part 2 토큰만 쓰는가?** (레거시 `text-sm`·`p-4`·`shadow-lg` 잔존 없음)
- 기존 화면과 상호작용(버튼 위치, 용어, 피드백 방식)이 일관적인가?
- 유사 기능 화면과 비교했을 때 사용자가 학습 비용 없이 사용할 수 있는가?

---

## Part 2: 디자인 토큰

### 1. 타이포그래피

폰트 패밀리: **Pretendard JP** (서비스 전역 단일 서체)
> **주의:** 개별 속성 조합(`text-[16px] font-bold`)을 금지하고 반드시 아래 정의된 단일 클래스(`text-body1_700`)를 사용한다.

#### Heading
| 토큰명 (Class) | Size | Line Height | Weight |
|----------------|------|-------------|--------|
| `text-heading1_700` | 32px | 38px | 700 (Bold) |
| `text-heading2_700` | 24px | 34px | 700 (Bold) |
| `text-heading2_500` | 24px | 34px | 500 (Medium) |
| `text-heading3_700` | 22px | 30px | 700 (Bold) |
| `text-heading3_500` | 22px | 30px | 500 (Medium) |
| `text-heading4_700` | 20px | 28px | 700 (Bold) |
| `text-heading4_500` | 20px | 28px | 500 (Medium) |
| `text-heading5_700` | 18px | 26px | 700 (Bold) |
| `text-heading5_500` | 18px | 26px | 500 (Medium) |

#### Body
| 토큰명 (Class) | Size | Line Height | Weight |
|----------------|------|-------------|--------|
| `text-body1_700` | 16px | 24px | 700 (Bold) |
| `text-body1_500` | 16px | 24px | 500 (Medium) |
| `text-body1_400` | 16px | 24px | 400 (Regular) |
| `text-body2_700` | 15px | 22px | 700 (Bold) |
| `text-body2_500` | 15px | 22px | 500 (Medium) |
| `text-body2_400` | 15px | 22px | 400 (Regular) |
| `text-body3_700` | 14px | 20px | 700 (Bold) |
| `text-body3_500` | 14px | 20px | 500 (Medium) |
| `text-body3_400` | 14px | 20px | 400 (Regular) |
| `text-body4_700` | 13px | 18px | 700 (Bold) |
| `text-body4_500` | 13px | 18px | 500 (Medium) |
| `text-body4_400` | 13px | 18px | 400 (Regular) |

#### Caption
| 토큰명 (Class) | Size | Line Height | Weight |
|----------------|------|-------------|--------|
| `text-caption1_700`| 12px | 16px | 700 (Bold) |
| `text-caption1_500`| 12px | 16px | 500 (Medium) |
| `text-caption1_400`| 12px | 16px | 400 (Regular) |
| `text-caption2_700`| 11px | 14px | 700 (Bold) |
| `text-caption2_500`| 11px | 14px | 500 (Medium) |
| `text-caption2_400`| 11px | 14px | 400 (Regular) |

#### 타이포 예외 규칙
- **font-weight 600 (semibold), 800 (extrabold)**: 가이드에 없음. 기존 사용처는 500 또는 700으로 마이그레이션.
- **10px 이하**: 가이드 최소는 11px(`caption2`). 특수 UI(뱃지 카운터 등)만 예외 허용.

---

### 2. 컬러 토큰 (프리미티브)

UI에서 직접 쓰지 않고, **시맨틱 토큰이 참조하는 원천 팔레트**.

#### White & Black Opacity
| 토큰명 | 값 | 토큰명 | 값 |
|--------|-----|--------|-----|
| `white-opacity-10` | `#FFFFFF` 7% | `black-opacity-10` | `#000000` 2% |
| `white-opacity-20` | `#FFFFFF` 9% | `black-opacity-20` | `#000000` 4% |
| `white-opacity-30` | `#FFFFFF` 17% | `black-opacity-30` | `#000000` 8% |
| `white-opacity-40` | `#FFFFFF` 23% | `black-opacity-40` | `#000000` 12% |
| `white-opacity-50` | `#FFFFFF` 33% | `black-opacity-50` | `#000000` 22% |
| `white-opacity-60` | `#FFFFFF` 47% | `black-opacity-60` | `#000000` 38% |
| `white-opacity-70` | `#FFFFFF` 72% | `black-opacity-70` | `#000000` 42% |
| `white-opacity-80` | `#FFFFFF` 78% | `black-opacity-80` | `#000000` 53% |
| `white-opacity-90` | `#FFFFFF` 87% | `black-opacity-90` | `#000000` 67% |
| `white-opacity-100` | `#FFFFFF` 91% | `black-opacity-100` | `#000000` 74% |
| `white-opacity-110` | `#FFFFFF` 95% | `black-opacity-110` | `#000000` 86% |
| `white` | `#FFFFFF` | `black-opacity-120` | `#000000` 93% |
| - | - | `black` | `#000000` |

#### Grayscale
| 토큰명 | 값 | 토큰명 | 값 |
|--------|-----|--------|-----|
| `grayscale-10` | `#F8F8FC` | `grayscale-80` | `#919194` |
| `grayscale-20` | `#F0F0F5` | `grayscale-90` | `#767678` |
| `grayscale-30` | `#E9E9ED` | `grayscale-100` | `#525254` |
| `grayscale-40` | `#E3E3E8` | `grayscale-110` | `#343436` |
| `grayscale-50` | `#D9D9DE` | `grayscale-120` | `#2B2B2B` |
| `grayscale-60` | `#C3C3C7` | `grayscale-130` | `#1C1C1C` |
| `grayscale-70` | `#B4B4B8` | `grayscale-140` | `#111112` |

#### Red & Pink
| 토큰명 | 값 | 토큰명 | 값 |
|--------|-----|--------|-----|
| `red-10` | `#FCE0E0` | `pink-10` | `#FEF0FC` |
| `red-20` | `#FCE0E0` | `pink-20` | `#FEE3F9` |
| `red-30` | `#FFBCBC` | `pink-30` | `#FDD2F5` |
| `red-40` | `#FF9B9B` | `pink-40` | `#FCBBF0` |
| `red-50` | `#F46464` | `pink-50` | `#FA8EE5` |
| `red-60` | `#F03535` | `pink-60` | `#FB68DD` |
| `red-70` | `#EC3232` | `pink-70` | `#F642D4` |
| `red-80` | `#E52828` | `pink-80` | `#C437A9` |
| `red-90` | `#C82424` | `pink-90` | `#922D7F` |
| `red-100` | `#B81C1C` | `pink-100` | `#722663` |
| `red-110` | `#6B1C1C` | `pink-110` | `#59214E` |

---

### 3. 컬러 시맨틱 토큰

UI에서 **실제로 사용하는 역할 기반 토큰**. 값은 프리미티브를 참조한다.

#### Surface & Background
| 토큰명 | 참조 | 값 |
|--------|------|-----|
| `surface-10` | `white` | `#FFFFFF` |
| `surface-20` | `grayscale-10` | `#F8F8FC` |
| `surface-disabled-10` | `black-opacity-10` | `#000000` 2% |
| `surface-disabled-20` | `black-opacity-20` | `#000000` 7% |
| `surface-inverse-10` | `grayscale-120` | `#2B2B2B` |
| `surface-inverse-20` | `grayscale-100` | `#525254` |
| `background-10` | `white` | `#FFFFFF` |
| `background-20` | `grayscale-10` | `#F8F8FC` |

#### On Surface (텍스트/아이콘)
| 토큰명 | 참조 | 값 |
|--------|------|-----|
| `on-surface-10` | `grayscale-120` | `#2B2B2B` |
| `on-surface-20` | `grayscale-100` | `#525254` |
| `on-surface-30` | `grayscale-80` | `#919194` |
| `on-surface-disabled` | `black-opacity-50` | `#000000` 22% |
| `on-surface-inverse` | `white` | `#FFFFFF` |

#### Primary (브랜드) & Secondary
| 토큰명 | 참조 | 값 |
|--------|------|-----|
| `primary` | `pink-70` | `#F642D4` |
| `on-primary` | `white` | `#FFFFFF` |
| `primary-container` | `pink-20` | `#FEE3F9` |
| `on-primary-container` | `pink-70` | `#F642D4` |
| `secondary` | `grayscale-20` | `#F0F0F5` |
| `on-secondary` | `grayscale-100` | `#525254` |
| `secondary-container` | `grayscale-110` | `#343436` |
| `on-secondary-container` | `white` | `#FFFFFF` |

#### Border & Divider & Dim
| 토큰명 | 참조 | 값 |
|--------|------|-----|
| `border-10` | `black-opacity-20` | `#000000` 7% |
| `border-20` | `black-opacity-40` | `#000000` 13% |
| `border-30` | `black-opacity-50` | `#000000` 22% |
| `border-strong` | `grayscale-120` | `#2B2B2B` |
| `border-inverse` | `white` | `#FFFFFF` |
| `divider-10` | `black-opacity-20` | `#000000` 7% |
| `divider-20` | `black-opacity-50` | `#000000` 22% |
| `dim-10` | `black-opacity-60` | `#000000` 28% |
| `dim-20` | `black-opacity-80` | `#000000` 53% |
| `dim-30` | `black-opacity-90` | `#000000` 67% |

#### Error & Success (AI 환각 방어)
| 토큰명 | 참조 | 값 |
|--------|------|-----|
| `error` | `red-70` | `#EC3232` |
| `on-error` | `white` | `#FFFFFF` |
| `error-container` | `red-20` | `#FCE0E0` |
| `on-error-container` | `red-70` | `#EC3232` |
| `success` | `임시: grayscale-120` | `#2B2B2B` |
| `on-success` | `임시: white` | `#FFFFFF` |
| `success-container` | `임시: grayscale-20` | `#F0F0F5` |
| `on-success-container` | `임시: grayscale-120` | `#2B2B2B` |

---

### 4. 스페이싱 (my-* 접두사 강제)

단위: **px**. Tailwind 기본 스케일(`p-4` 등)과의 충돌을 원천 차단하기 위해, 모든 간격/크기 유틸리티는 반드시 **`my-`** 접두사를 결합하여 사용한다. (예: `p-my-12`, `gap-my-4`, `h-my-36`)

| 토큰명 | 클래스(예시) | 값 | 토큰명 | 클래스(예시) | 값 |
|--------|--------------|----|--------|--------------|----|
| `spacing-1` | `my-1` | 1px | `spacing-40` | `my-40` | 40px |
| `spacing-2` | `my-2` | 2px | `spacing-44` | `my-44` | 44px |
| `spacing-4` | `my-4` | 4px | `spacing-48` | `my-48` | 48px |
| `spacing-8` | `my-8` | 8px | `spacing-52` | `my-52` | 52px |
| `spacing-12` | `my-12` | 12px | `spacing-56` | `my-56` | 56px |
| `spacing-16` | `my-16` | 16px | `spacing-60` | `my-60` | 60px |
| `spacing-20` | `my-20` | 20px | `spacing-64` | `my-64` | 64px |
| `spacing-24` | `my-24` | 24px | `spacing-68` | `my-68` | 68px |
| `spacing-28` | `my-28` | 28px | `spacing-72` | `my-72` | 72px |
| `spacing-32` | `my-32` | 32px | `spacing-80` | `my-80` | 80px |
| `spacing-36` | `my-36` | 36px | - | - | - |

#### 페이지·카드 본문 인셋 (공통)
- **가로 인셋**: 모바일·lg+ 공통 **`my-12`(12px)** → Tailwind **`px-my-12`** (`PAGE_GUTTER_X_CLASS`)
- **스크롤 하단 여백**: **`my-80`(80px)** → `pb-my-80` (`PAGE_SCROLL_BOTTOM_CLASS`) — 페이지·바텀 시트 **스크롤 본문** 공통. 고정 푸터는 제외 → `docs/mobile-layout.md`
- **스택 간격(gap)**: 모바일 **`my-12`** · lg+ **`my-20`** → **`gap-my-12 lg:gap-my-20`** (`PAGE_GUTTER_GAP_CLASS`)
- **세로 인셋**: 기본 **`my-20`(20px)** → `py-my-20` / `p-my-20` (세로 패딩은 뷰포트별 분기 없음)
- 상세·체크리스트: **`docs/mobile-layout.md`**
- 코드 단일 소스: `app/src/lib/page-layout.ts` (`PAGE_GUTTER_X_CLASS`, `PAGE_CONTENT_PAD_X_CLASS`, `PAGE_SCROLL_GUTTER_CLASS` 등)
- `Title2` `asSectionHeader`·`PageCard`·`SeriesFormPageScaffold` 본문·정산/분석 스크롤 열은 **`PAGE_GUTTER_X_CLASS`** 와 동일하게 맞춘다.
- 페이지 스택 gap에 **`gap-my-20` 단독 사용 금지** — `PAGE_GUTTER_GAP_CLASS` 또는 `*-my-12 lg:*-my-20`. 가로 인셋은 `PAGE_GUTTER_X_CLASS`(`px-my-12`) 우선.

---

### 5. Elevation (그림자)

Tailwind 기본 `shadow-md` 등의 사용을 금지하고, 디자인 시안에 정의된 정밀한 Box Shadow 토큰만 사용한다. 모든 그림자의 색상은 `#000000 6%` (`rgba(0,0,0,0.06)`) 로 고정된다.

| 토큰명 | CSS Box Shadow 값 (X Y Blur Spread Color) | 사용처 예시 |
|--------|-------------------------------------------|-------------|
| `shadow-elevation-10` | `0px 1px 2px 1px rgba(0, 0, 0, 0.06)` | 컴팩트 컨트롤, 칩, 태그 부각 |
| `shadow-elevation-20` | `0px 2px 4px 2px rgba(0, 0, 0, 0.06)` | 버튼, 카드 컴포넌트 기본 부유 |
| `shadow-elevation-30` | `0px 4px 8px 3px rgba(0, 0, 0, 0.06)` | 드롭다운 메뉴, 툴팁 |
| `shadow-elevation-40` | `0px 8px 12px 4px rgba(0, 0, 0, 0.06)` | 팝오버, 바텀 시트 |
| `shadow-elevation-50` | `0px 8px 16px 6px rgba(0, 0, 0, 0.06)` | 주요 다이얼로그, 작은 모달 |
| `shadow-elevation-60` | `0px 12px 24px 8px rgba(0, 0, 0, 0.06)`| 대형 중앙 모달, 최상단 알림 팝업 |

---

### 6. Z-Index (레이어 계층)

요소가 겹칠 때 임의의 값(`z-50`, `z-[999]`)을 남발하지 않고, 역할에 부여된 Z-index 토큰을 사용해 계층을 통제한다.

| 역할 (Role) | 클래스 | Z-index 값 | 비고 |
|-------------|--------|------------|------|
| Base | `z-base` | `0` | 기본 문서 흐름 |
| Dropdown | `z-dropdown` | `100` | Select 메뉴, 드롭다운 팝오버 |
| Sticky | `z-sticky` | `200` | 스크롤 시 상단/하단 고정 헤더, GNB |
| Overlay | `z-overlay` | `300` | 모달/다이얼로그 뒷면 Dim 처리 (배경) |
| Modal | `z-modal` | `400` | 다이얼로그, 시트 콘텐츠 본문 |
| Toast | `z-toast` | `500` | 스낵바, 글로벌 알림 메시지 (최상위) |

---

### 7. 인터랙티브 컨트롤 높이

인터랙티브 컨트롤 높이는 **32 / 36 / 42** 세 티어만 사용한다. **기존 Tailwind 디폴트인 40px(`h-10`)·48px(`h-12`) 티어는 절대 사용하지 않는다.**

| 용도 | 클래스 | 높이 |
|------|--------|------|
| compact — 기본 `Button`·필터 칩 M·보조 드롭다운·에디터 행 | `h-my-32` / `CONTROL_HEIGHT_CLASS` | 32px |
| 아이콘-only 버튼 (`size="icon"`) | `size-my-32` | 32×32px |
| standard — 칩 L·`Button` lg·sm 폼 필드·모달 버튼·드롭다운 | `h-my-36` / `CONTROL_HEIGHT_STANDARD_CLASS` | 36px |
| 아이콘-only large (`size="icon-lg"`) | `size-my-36` | 36×36px · 내부 SVG **22px** · stroke **1.5** |
| form — `Input` md·텍스트 필드·로그인 CTA·출금 등 | `CONTROL_HEIGHT_FORM_CLASS` (`h-[42px]`) | 42px · 내부 여백 **`px-my-8 py-my-8`** |

**같은 티어를 가로로 묶을 때:** compact → **4px** (`gap-my-4`), standard → **8px** (`gap-my-8`). Tailwind 기본 `gap-2`/`gap-4`와 절대 혼동하지 않는다.
**`Button` `variant="outline"`** 테두리는 **`border-border-20`**(`#000000` 13%)을 공통 사용한다. `disabled` 상태에서도 동일 토큰을 유지한다(`disabled:border-border-20`). 구현: `components/ui/button.tsx`.

#### Button 변형 매트릭스 (Figma 기준)
타입은 **fill / outline / tertiary** 3종. 컨트롤 높이는 정책상 **36/32/24**만 사용.

| 타입 | 톤 | variant / 조합 |
|------|----|----------------|
| fill | primary | `default` |
| fill | secondary (light) | `secondary` |
| fill | secondary 강조 (dark)| `secondaryContainer` |
| fill | error | `error` (또는 `destructive`) |
| outline | primary | `outline` + `outline-primary text-primary` |
| outline | neutral | `outline` + `text-on-surface-30` |
| outline | error | `outline` + `outline-error-error text-error-error` |
| tertiary | neutral (기본) | `tertiary` |
| tertiary | primary | `tertiary` + `text-primary` |
| tertiary | error | `tertiary` + `text-error-error` |

비활성 fill은 `bg-surface-disabled-10` + `text-on-surface-disabled`, 비활성 outline/tertiary는 `text-on-surface-disabled`를 사용.

---

### 8. Radius (모서리)

단위: **px**. 비인터랙티브 surface 기본값은 **4px**.

| 토큰명 | 값 | 토큰명 | 값 |
|--------|-----|--------|-----|
| `radius-2` | 2px | `radius-12` | 12px |
| `radius-4` | 4px | `radius-16` | 16px |
| `radius-6` | 6px | `radius-20` | 20px |
| `radius-8` | 8px | `radius-circle` | 999px |

#### 라운드(반경) 정책
- 버튼·칩·토글 등 **인터랙티브 컴포넌트**를 제외한 모든 surface의 기본 라운드는 **4px(`radius-4`)**를 사용한다. (대상: 카드, 패널, 모달 컨테이너 등)
- 인터랙티브 컴포넌트는 접근성·터치 영역·기존 시각 규칙을 고려해 별도 라운드 값을 유지할 수 있다.

---

### 9. Chip · Tag (Figma `chips`)

| 컴포넌트 | 경로 | 용도 |
|----------|------|------|
| `Chip` | `app/src/components/ui/chip.tsx` | 범용 칩 버튼 (type/variant 직접 지정) |
| `FilterChip` | 동일 | 단일 선택 필터 — `selected` → fill+activated / outline+default |
| `Tag` | `app/src/components/ui/tag.tsx` | 입력 필드 토큰 — fill+default, circle, M, 닫기(X) |

#### Variant 축
| 축 | 값 | 비고 |
|----|-----|------|
| `chipType` | `fill` \| `outline` | HTML `type` 속성과 구분하기 위해 `chipType` 명명 |
| `variant` | `activated` \| `default` | 선택·강조 상태 |
| `corner` | `square` \| `circle` | **square**: L/M 공통 **radius 8px** · **circle**: Tag 등 pill (`rounded-full`) |
| `size` | `l` \| `m` | L=`h-my-36`(36px), M=`h-my-32`(32px) |
| `icon` | boolean | 우측 아이콘 슬롯 활성화 (`gap-my-2`, icon 패딩 행) |
| `trailingIcon` | ReactNode | `Chip` prop — `icon: true`일 때 X 대신 chevron 등 (Tag는 기본 X) |

#### Chip 패딩 (px)
| size | 기본 (좌·우 동일) | 우측 아이콘 (`icon: true`) |
|------|-------------------|----------------------------|
| L (`h-my-36`) | 16 | 좌 16 · 우 8 (`pl-my-16 pr-my-8`) |
| M (`h-my-32`) | 12 | 좌 12 · 우 8 (`pl-my-12 pr-my-8`) |

`FilterChip`·`SegmentedTextTabs` chip에 `px-2.5` 등 **패딩 오버라이드 className을 붙이지 않는다** — 위 표가 `chipVariants` 단일 소스다.

#### 컨트롤 그룹 간격 (가로 나열)
| 티어 | 상수 | gap (px) |
|------|------|----------|
| compact (h-my-32) | `CONTROL_GROUP_GAP_COMPACT_CLASS` | **4px** (`gap-my-4`, `spacing-4`) |
| standard (h-my-36)| `CONTROL_GROUP_GAP_STANDARD_CLASS`| **8px** (`gap-my-8`, `spacing-8`) |

- FilterChip 그룹 → **`chipGroupGapClass(size)`** (`l`→8px, `m`→4px)
- 칩 M과 같은 행의 보조 컨트롤 → **`CHIP_COMPANION_CONTROL_CLASS`** (`h-my-32`, `rounded-[8px]`, `border-border-20`, `text-body3_400`)

#### 시각 매핑 (Figma `chips` — `chipType` × `variant`)

| chipType | variant | 배경 | 테두리 | 텍스트 |
|----------|---------|------|--------|--------|
| `fill` | `activated` | `bg-secondary-secondary-container` | — | `text-secondary-on-secondary-container` |
| `fill` | `default` | `bg-surface-20` | `outline-border-10` | `text-on-surface-30` |
| `outline` | `activated` | transparent | `outline-border-strong` | `text-on-surface-10` |
| `outline` | `default` | transparent | `outline-border-20` | `text-on-surface-30` |

- **FilterChip 선택**: `fill` + `activated`
- **FilterChip 비선택**: `outline` + `default` (위 표 4행)
- **Tag**: `fill` + `default` + `circle` + `icon` (닫기 X)
- **L 타이포**: `text-body1_500` (16px) · **M 타이포**: `text-body3_500` (14px)
- **우측 아이콘 패딩**: L `pl-my-16 pr-my-8` · M `pl-my-12 pr-my-8` · 간격 `gap-my-2`

---

### 10. 모달 크롭 스테이지 (썸네일 미리보기)

| 용도 | 크기 | 코드 단일 소스 |
|------|------|----------------|
| 모달 내 정사각 크롭·캔버스 미리보기 | **400×400px** 고정 | `app/src/lib/thumbnail-styles.ts` — `MODAL_CROP_STAGE_SIZE_PX`, `MODAL_CROP_STAGE_CLASS` |

- `CharacterExpressionModal` 및 파생(`ImageCropOnlyModal` 등) **공통**.
- `w-full`·`max-w-[24rem]`·슬롯 리스트 유무에 따른 **320px 축소 금지**.
- 9:16 크롭은 **400px 높이** 스테이지 안 가이드 프레임. 보내기 뷰포트는 스테이지 rect 기준.

---

### 11. Tab · Tab instance (Figma `tab` / `tab instance`)

**칩(`chips`)과 별도 DS.** 텍스트 탭만 해당한다. 코드 단일 소스: `app/src/lib/tab-styles.ts` · UI: `SegmentedTextTabs` `variant="text"`.

#### Tab 컴포넌트 (`tab`)
| 축 | 값 | 비고 |
|----|-----|------|
| `size` | `xl` \| `l` \| `m` | 서비스 기준 **42 / 36 / 32px** 티어 적용 |
| `underline` | boolean | = instance `selectline`. true면 목록 트랙 `border-b border-border-10` |

**탭 목록 간격** (칩 그룹 4px·8px와 다름): XL=`20px`(`gap-my-20`), L=`16px`(`gap-my-16`), M=`12px`(`gap-my-12`)

#### Tab instance (`tab instance`)
| 축 | 값 | 비고 |
|----|-----|------|
| `activated` | boolean | true → `text-on-surface-10`, false → `text-on-surface-disabled` |
| `selectline` | boolean | true + activated → `border-b-2 border-border-strong` |
| `height` | h48 / h40 / h32 | `data-height` · 실제 높이는 size 티어와 동일 |

- 분석 영역 탭(콘텐츠·이용자·수익) → **`SegmentedTextTabs`** `size="xl"` `underline={false}`
- 밑줄 탭 행 → `underline={true}`
- 필터 칩 행 → **`variant="chip"`** (Tab DS 아님)

---

## Part 3: 코드 적용 가이드

### 마이그레이션·신규 작성 공통

Part 1 **토큰 전면 치환 원칙**을 코드에 적용할 때의 실행 순서다.

#### A. 신규·수정 (한 파일이라도)

1. 스타일이 **1차 소스**에 속하면 (`Button`, `chipVariants`, `PAGE_*_CLASS` 등) 상수·variant를 먼저 수정하고 페이지는 상수를 import한다.
2. 레거시 Tailwind가 남아 있으면 **`npm run migrate:tokens`**(§0 파이프라인)로 자동 치환한다. 스크립트가 다루지 않는 구간만 §3 매핑표로 수동 보완. 접두사(`sm:`, `hover:`)는 유지된다.
3. `cn()` merge 후 **타이포 토큰 1개** + **색상 `text-on-surface-*` 등 1개** 공존하는지 확인한다 (`text-body*` + `leading-*` / 이중 타이포 토큰 금지 — Part 1 **`cn()` · merge** 절).
4. 페이지에서 공통 variant를 **복제·오버라이드하지 않는다** (칩 패딩·버튼 높이 등).

#### B. 기존 코드베이스 정리 (권장 배치)

| 배치 | 범위 | 축 |
|------|------|-----|
| 0 | `globals.css` | 토큰 정의 누락 보완 |
| 1 | `lib/*-styles.ts`, `components/ui/**` | 전 축 · 1차 소스 |
| 2 | `layout/`, `Header`, `AppSidebar` | 스페이싱·타이포 |
| 3 | `series/`, `character/`, `resource/` | 도메인 카드·폼 |
| 4 | `episode/`, `editor/`, `script-editor/` | 에피소드·에디터(타이포 잔량 많음) |
| 5 | `analytics/`, `profile/`, `inquiry/`, … | 대시보드·설정 |
| 6 | `app/**` 페이지 | 라우트별 잔여 |
| 7 | margin·width bare 숫자 | 스페이싱 wave (padding/gap 이후) |

배치마다 **§7 완료 판정**을 통과한 뒤 다음 배치로 넘긴다.

#### C. 검증 명령 ( `app/` 디렉터리에서 )

```bash
# Tailwind 컴파일
npx @tailwindcss/cli -i src/app/globals.css -o /tmp/tw-verify.css

# 라우트 구조
npm run check:routes
```

**잔존 레거시 샘플 grep** (치환 가능 구간 — 0건이 이상적, 예외 구간은 이슈로 메모):

```bash
rg '\btext-(xs|sm|base|lg|xl|2xl|3xl)\b' src --glob '*.{tsx,ts}'
rg '\b(font-bold|font-semibold|font-medium)\b.*\btext-(xs|sm|base)\b' src --glob '*.{tsx,ts}'
rg '\bshadow-(sm|md|lg|xl)\b' src --glob '*.{tsx,ts}'
rg '\brounded-(2xl|xl)\b' src/components src/app --glob '*.tsx'
rg '\bh-10\b|\bh-12\b' src --glob '*.{tsx,ts}'
```

`text-on-surface-*` 등 **색상 클래스**는 타이포 grep에 걸리지 않도록 주의한다.

### Tailwind 연동 및 유틸리티 강제화 (`globals.css` @theme)

AI는 컴포넌트를 작성할 때 아래에 선언된 매핑 규격을 반드시 준수하여 코드를 생성한다.

```css
@theme inline {
  /* 1. 커스텀 스페이싱 토큰 강제 매핑 */
  --spacing-my-1: 1px;
  --spacing-my-2: 2px;
  --spacing-my-4: 4px;
  --spacing-my-8: 8px;
  --spacing-my-12: 12px;
  --spacing-my-16: 16px;
  --spacing-my-20: 20px;
  --spacing-my-24: 24px;
  --spacing-my-28: 28px;
  --spacing-my-32: 32px;
  --spacing-my-36: 36px;
  --spacing-my-40: 40px;
  --spacing-my-44: 44px;
  --spacing-my-48: 48px;
  --spacing-my-52: 52px;
  --spacing-my-56: 56px;
  --spacing-my-60: 60px;
  --spacing-my-64: 64px;
  --spacing-my-68: 68px;
  --spacing-my-72: 72px;
  --spacing-my-80: 80px;

  /* 2. 컬러 토큰 매핑 */
  --color-primary: var(--primary);
  --color-on-surface-10: var(--on-surface-10);
  --color-border-10: var(--border-10);
  
  /* 3. Elevation (Shadow) 매핑 */
  --shadow-elevation-10: 0px 1px 2px 1px rgba(0, 0, 0, 0.06);
  --shadow-elevation-20: 0px 2px 4px 2px rgba(0, 0, 0, 0.06);
  --shadow-elevation-30: 0px 4px 8px 3px rgba(0, 0, 0, 0.06);
  --shadow-elevation-40: 0px 8px 12px 4px rgba(0, 0, 0, 0.06);
  --shadow-elevation-50: 0px 8px 16px 6px rgba(0, 0, 0, 0.06);
  --shadow-elevation-60: 0px 12px 24px 8px rgba(0, 0, 0, 0.06);

  /* 4. Z-index는 v4에서 @theme 네임스페이스로 유틸이 생성되지 않으므로
        아래 @utility 블록으로 직접 선언한다(이 블록 밖). */
}

/* 4. Z-index 레이어 — @utility 직접 선언 */
@utility z-base { z-index: 0; }
@utility z-dropdown { z-index: 100; }
@utility z-sticky { z-index: 200; }
@utility z-overlay { z-index: 300; }
@utility z-modal { z-index: 400; }
@utility z-toast { z-index: 500; }

/* 5. 타이포그래피 단일 유틸리티 선언 (조합 사용 절대 금지) */
@utility text-body1_700 {
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
}
/* 나머지 타이포 토큰도 Part 2-1 테이블을 기준으로 동일한 방식으로 구성됨 */