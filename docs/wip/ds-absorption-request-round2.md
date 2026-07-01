# DS 흡수 요청 명세 (Round 2)

> **작성일**: 2026-07-01
> **컨텍스트**: 리노벨 스튜디오 Phase A~C 진행 중 발견한 DS 미충족 도메인 스펙.
> **원칙**: 리노벨 어댑터에 임의 variant/prop 추가 금지. 필요 스펙은 DS에 흡수 후 사용.
>
> 이 문서를 DS 측 세션에 그대로 전달. 각 항목은 (1) 필요 스펙 (2) 사용 사례 (3) 스타일 정의 (4) 대체 검토를 포함.

---

## 1. Badge — `soft` / `softDestructive` variant

### 배경
Figma 배지 스펙 중 **"opacity 배경 + 강조 텍스트 · 사각 rounded"** 형태가 있음. 리노벨 도메인(작품 상태 표시)에서 사용.
- 예: 시리즈/캐릭터 리스트의 "비공개", "작성중" 배지
- DOM 예: `<span class="rounded px-2 py-1 text-body3_500 bg-primary/10 text-primary">비공개</span>`

### 대체 검토 (실패)
현재 DS Badge variants: `default` `secondary` `destructive` `outline` `ghost` `link`.
- **`default`** (bg-primary + text-primary-foreground): 시각 반전 (진한 브랜드 채움). 원본은 부드러운 opacity 배경.
- **`secondary`** (bg-secondary + text-secondary-foreground): 회색 톤, 브랜드 컬러 손실.
- **`outline`**: 배경 없음, 도메인 스펙과 다름.
- **`ghost`**: 호버에서만 배경, 상시 표시 아님.

DS `destructive` variant는 이미 `bg-destructive/10 text-destructive` (soft 패턴). **`primary` 계열도 동일 패턴 필요**.

### 요청 스펙

DS `packages/design-system/src/components/ui/badge.tsx`의 `badgeVariants`에 다음 추가:

```ts
soft: "bg-primary/10 text-primary [a]:hover:bg-primary/20",
```

기존 `destructive` variant의 opacity 패턴과 대칭. 사각 rounded는 이미 DS Badge의 `shape="square"`로 제어 가능 → 별도 shape prop 필요 없음.

### 사용 예 (리노벨에서 사용 시)

```tsx
<Badge variant="soft" shape="square" size="md">비공개</Badge>
<Badge variant="soft" shape="square" size="md">작성중</Badge>
```

### 다크 모드
- 라이트: `bg-primary/10` `text-primary`
- 다크: `bg-primary/20` `text-primary` (알파 강화)

명세는 DS 디자이너 검토 후 조정.

---

## 2. Button — `size="form"` 티어 (h-42)

### 배경
리노벨 도메인 스펙: **폼 CTA 버튼 · 로그인 소셜 버튼 등에 42px 높이 티어** 사용. Figma에도 정의됨.
- 사용처: `LoginPage`(소셜 4개), `series/new`·`series/[id]/edit`(폼 CTA), `character/edit` 등 총 18곳

### 대체 검토
DS Button size: `xs`(24) `sm`(32) `default`(36) `lg`(42) `xl`(40) `2xl`(48).
- **`lg`가 42px** — 리노벨 `form`과 정확히 일치. **이미 현재 리노벨은 `size="lg"`로 이관 완료.**

**결론: DS에서 별도 흡수 불필요.** 리노벨 `size="form"` 사용처 18곳 모두 `size="lg"`로 정리 완료. 이 항목은 **확인만 하고 요청 취소.**

---

## 3. Button — `tertiary` variant (배경 없음 · 회색 텍스트)

### 배경
리노벨 도메인: **"배경 없음 + 흐린 회색 텍스트 + 호버 시 강조"** 버튼.
- 사용처: ProfileEditModal 로그아웃 버튼 등
- Figma에서 `tertiary` 타입 정의

### 대체 검토
DS Button variants: `default`(inverse) `primary` `outline` `secondary` `ghost` `destructive` `link`.
- **`ghost`** — 배경 없음 + 호버 시 accent. 리노벨 tertiary와 매우 유사.
- 차이: 리노벨 tertiary는 **텍스트 기본색이 `text-foreground-placeholder`(회색), 호버 시 `text-foreground-muted`(더 진한 회색)**. DS `ghost`는 텍스트 기본색이 body foreground.

### 요청 스펙 (선택)

**옵션 A (권장)**: DS `ghost`로 통합 — 리노벨은 필요 시 `className`으로 `text-foreground-placeholder`만 추가 지정. 이미 리노벨 사용처 1곳(ProfileEditModal 로그아웃)은 destructive 색이라 `text-destructive` className을 이미 씀 → `ghost` variant + className 조합이 이미 정상 작동.

**옵션 B**: DS Button에 `tertiary` variant 신설. `ghost`와 별도로 텍스트 톤 다운 스펙.
```ts
tertiary: "text-foreground-placeholder hover:text-foreground-muted disabled:text-foreground-disabled",
```

**결론: A 채택**. 이 항목은 요청 취소, 리노벨은 `ghost` + className 유지.

---

## 4. Button — `addMenu` variant (플로팅 원형 · 브랜드 링)

### 배경
리노벨 도메인: 리스트 아이템 호버 시 나타나는 **원형 플로팅 "추가" 버튼**.
- 스펙: `rounded-full bg-background ring-1 ring-foreground/20 text-foreground shadow-elevation-20`
- 현재 사용처: 0곳 (Figma 스펙만 있고 실제 렌더링 코드 미확인)

### 대체 검토
DS Button variants에는 대응 없음. 다만 **사용처 0곳**이라 실제 필요성 검증 안 됨.

### 결론
**요청 보류** — 실제 사용 사례가 생기면 그때 흡수 요청. 현재 리노벨 어댑터에서 `addMenu` variant 삭제 완료.

---

## 5. Dialog — `presentation` prop (바텀시트 vs 중앙)

### 배경
리노벨 도메인: **모바일에서 모달이 하단 바텀시트 · 데스크톱에서 중앙 정렬**. `presentation="auto"` (반응형)와 `presentation="center"` (항상 중앙, 알림·경고용) 두 케이스.
- 사용처 19개 파일 (`ProfileEditModal`, `GuideModals`, `SeriesDeleteModal`, `CharacterExpressionModal`, `EpisodeAutoGeneratorModal`, `BgmListModal`, `ImportCharacterDialog` 등)
- 모바일 UX 필수: 키보드 대응 · 스와이프 다운 닫기 · safe-area inset

### 대체 검토
DS Dialog는 항상 **중앙 정렬 · sm max-width**. 모바일 바텀시트 스펙 없음.

### 요청 스펙

**옵션 A (권장)**: DS Dialog에 `presentation` prop 신설.

```ts
type DialogPopupProps = {
  presentation?: "center" | "auto"
  // "auto" — 모바일(<lg)에서 bottom-sheet, 데스크톱에서 center
  // "center" — 모든 뷰포트에서 center (default)
}
```

**바텀시트 시각 스펙** (모바일 `auto`):
- 위치: `fixed inset-x-0 bottom-0`
- radius: 상단만 rounded (하단 flat)
- 애니메이션: `slide-in-from-bottom` / `slide-out-to-bottom`
- max-height: `min(92dvh, 900px, var(--app-vv-live-height, 92dvh))` — visual viewport 대응
- 키보드 대응: `bottom-[var(--app-keyboard-inset, var(--app-vv-bottom, 0px))]`
- safe-area: `pb-[env(safe-area-inset-bottom, 0px)]`

**중앙 스펙** (`center` 또는 데스크톱 `auto`):
- 현재 DS Dialog 기본과 동일
- 모바일 keyboard 대응만 추가: `top-[calc(var(--app-vv-live-top, 0px) + var(--app-vv-live-height, 100dvh) / 2)]`

### 참조 코드 (리노벨 현재 어댑터)
`app/src/components/ui/dialog.tsx` — `dialogContentAutoClass` / `dialogContentCenterClass` 상수.

### 리노벨 액션
DS 흡수 완료 후:
1. 리노벨 `dialog.tsx`를 DS Dialog 순수 re-export로 정리
2. 사용처 19개 파일의 `presentation` prop은 그대로 유지 (DS 표준 prop이 됨)
3. `dialogContentAutoClass` / `dialogContentCenterClass` 삭제
4. `--app-vv-live-*` CSS 변수는 리노벨 도메인 유지 (visual viewport 훅이 세팅)

### 결정 필요 (DS 디자이너)
- 모바일 브레이크포인트: `<lg` (1024px) 기준 vs 다른 기준?
- 바텀시트 세로 스와이프 닫기 인터랙션 채택 여부
- keyboard-inset 변수 이름 (`--app-keyboard-inset` vs DS 표준 이름)

---

## 6. Dialog — `DialogHeader` 컴포넌트

### 배경
리노벨 자주 반복되는 모달 헤더 조합:
```tsx
<DialogHeader className="sr-only">
  <DialogTitle>...</DialogTitle>
</DialogHeader>
```
또는
```tsx
<DialogHeader>
  <DialogTitle>...</DialogTitle>
  <DialogDescription>...</DialogDescription>
</DialogHeader>
```
- 스타일: `flex flex-col space-y-2 text-center sm:text-left`
- 사용처 15곳

### 대체 검토
DS Dialog에는 `Title`·`Description`만 있음. 헤더 컨테이너 없음.

### 요청 스펙

DS Dialog에 `DialogHeader` 컴포넌트 추가:

```tsx
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}
```

간단한 유틸리티 컴포넌트. shadcn/ui 표준 패턴과 동일 (그쪽에서 이미 사용).

또한 짝으로 `DialogFooter`도 흡수 요청:

```tsx
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}
```

### 리노벨 액션
DS 흡수 후 리노벨은 `DialogHeader`·`DialogFooter`를 DS에서 import.

---

## 7. Dialog — `asChild` prop (radix 호환)

### 배경
리노벨 도메인 코드가 광범위하게 사용:
```tsx
<DialogTrigger asChild>
  <Button>열기</Button>
</DialogTrigger>
<DialogClose asChild>
  <Button variant="outline">취소</Button>
</DialogClose>
<DialogTitle asChild>
  <h2>...</h2>
</DialogTitle>
```
- 사용처: `ModalHeader`, `ModalFooterButtons`, `CharacterExpressionModal`, `BgmListModal`, `ConfirmModals` 등 30곳+

### 대체 검토
DS는 `@base-ui/react` 기반이라 `render` prop 사용:
```tsx
<DialogTrigger render={<Button>열기</Button>} />
```

**API 시그니처가 완전히 다름**. 리노벨 사용처 30곳+ 리팩터 필요.

### 요청 스펙

DS Dialog primitives (`Trigger`, `Close`, `Title`, `Description`)에 **radix 호환 `asChild` prop** 추가.

```tsx
function DialogTrigger({
  asChild,
  children,
  ...props
}: DialogPrimitive.Trigger.Props & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return <DialogPrimitive.Trigger render={children as React.ReactElement} {...props} />
  }
  return <DialogPrimitive.Trigger {...props}>{children}</DialogPrimitive.Trigger>
}
```

동일 로직을 Trigger·Close·Title·Description에 적용.

### 대체 (요청 반려 시)
리노벨 어댑터에서 자체 변환 (현재 그렇게 되어 있음). 하지만 사용자 정책 "리노벨 어댑터에 임의 확장 금지"와 충돌 → DS 흡수가 원칙.

### 리노벨 액션
DS 흡수 후 리노벨 `dialog.tsx`의 `asChild → render` 변환 layer 삭제. 사용처 코드는 변경 없음.

---

## 8. Popover · DropdownMenu — pointer 제스처 API

### 배경
리노벨 도메인: **터치 스크린에서 pointerdown이 아니라 click(터치업)에서 메뉴 열기**. radix 기본은 pointerdown 즉시 열려 스크롤 제스처와 충돌.
- 리노벨 커스텀 훅 `usePointerTapGestureTracker`로 pointerdown 억제, tap 완료 시에만 open
- 사용처: `DropdownMenuTrigger` 12곳, `PopoverTrigger` 4곳

### 대체 검토
DS Popover/DropdownMenu는 `@base-ui/react` 기반, radix와 유사한 pointer 동작.
- 스크롤 vs 메뉴 열기 충돌은 모바일 UX 이슈로 널리 알려짐

### 요청 스펙

DS Popover/DropdownMenu Root에 `openOn` prop 추가:

```tsx
type PopoverRootProps = {
  openOn?: "pointerdown" | "click"  // default "pointerdown"
}
```

`"click"` 시:
- `onPointerDown`에서 즉시 열지 않음
- `pointerdown` → `pointerup`이 짧은 거리·짧은 시간 안에 끝나면 tap으로 인식, `onClick`에서 open
- `pointerdown` → `pointermove` (일정 거리 이상) → `pointerup`은 scroll로 인식, open 안 됨

### 참조 코드 (리노벨 훅)
`app/src/lib/pointer-tap-gesture.ts` — `usePointerTapGestureTracker` 구현. 임계값: 10px 이동, 300ms 시간.

### 리노벨 액션
DS 흡수 후:
1. 리노벨 `dropdown-menu.tsx` · `popover.tsx` 어댑터에서 `usePointerTapGestureTracker` 로직 삭제
2. `<DropdownMenu openOn="click">` 지정
3. 사용처 API 변경 없음
4. `pointer-tap-gesture.ts` 삭제 가능

---

## 9. Toast · Toaster — 리노벨 stack 정책

### 배경
리노벨 도메인: **최대 3개 stack + 상단 정렬 + safe-area·visual viewport 대응 · 세로 gap 16px · 액션 버튼 인라인**.
- 스토어: `useToastStore` (Zustand)
- 정책: FIFO 3개 초과 시 오래된 것 제거

### 대체 검토
DS는 `sonner` 기반 (`design-system/ui/sonner`). sonner는 자체 stack·수명·위치 API 있음.
- sonner 기본: 우측 하단 · 자동 dismiss · 액션 콜백
- 리노벨은 상단 정렬 · 3개 상한 · 커스텀 액션 UI

sonner 옵션으로 대부분 커버 가능 (`position="top-center"`, `richColors`, `visibleToasts`).

### 요청 스펙 (선택)

**옵션 A**: 리노벨이 sonner로 이관. DS `Toaster` 컴포넌트를 그대로 사용, `useToastStore` 폐기하고 `sonner`의 `toast()` 함수 직접 호출. 초기 세팅에서 sonner 옵션으로 리노벨 정책 반영:
```tsx
<Toaster position="top-center" visibleToasts={3} offset={{ top: "var(--app-vv-top, 0px)" }} />
```

**옵션 B**: DS에 리노벨 스펙 Toaster 별도 추가. sonner 미사용, 자체 stack 로직 유지.

**결론**: A 채택. 리노벨 도메인 훅(`useToastStore` 사용처 확인 필요) 마이그레이션 후 DS Sonner 사용.

### 리노벨 액션 (사용자 확인 후)
1. `useToastStore` 사용처 조사 (`toast.show({ message, variant, actionLabel, onAction })` 등)
2. sonner API로 매핑 (`toast(message, { action: { label, onClick } })`)
3. 리노벨 `ui/toast.tsx` · `ui/toaster.tsx` 삭제

---

## 10. Container 페어 네이밍 통일 (Round 1 미완료 계승)

### 배경
DS `tokens.css`에서 라이트 모드와 다크 모드의 container foreground 변수 네이밍 불일치:

라이트 모드 (`:root`):
```css
--primary-container-foreground: var(--brand-700);
--secondary-container-foreground: var(--white);
--destructive-container-foreground: var(--error-600);
```

다크 모드 (`.dark`):
```css
--on-primary-container: var(--brand-100);
--on-secondary-container: var(--white);
--on-destructive-container: var(--error-100);
```

`theme.css`의 `@theme inline` 매핑은 `--color-on-primary-container: var(--on-primary-container)` 형태로 다크 네이밍 사용. **라이트 모드에서 undefined 폴백 발생 가능**.

### 요청 스펙

`--on-*-container` 형태로 통일 (다크 모드 네이밍 채택):
- `--primary-container-foreground` → `--on-primary-container`
- `--secondary-container-foreground` → `--on-secondary-container`
- `--destructive-container-foreground` → `--on-destructive-container`

`theme.css` 매핑은 이미 `--on-*` 사용 중이라 별도 변경 없음.

---

## 우선순위

| # | 항목 | 우선도 | 이유 |
|---|---|---|---|
| 10 | Container 네이밍 통일 | **높음** | 라이트 모드 폴백 버그 |
| 5 | Dialog `presentation` prop | **높음** | 19개 파일 도메인 wrapping 필수 |
| 6 | `DialogHeader`·`DialogFooter` | 높음 | 15곳 사용, 단순 유틸 |
| 7 | Dialog `asChild` prop | 높음 | 30곳+ 사용, 리노벨 어댑터 layer 폐기용 |
| 8 | Popover/DropdownMenu `openOn` | 중간 | 모바일 UX 개선, 16곳 어댑터 layer 폐기 |
| 1 | Badge `soft` variant | 중간 | 4곳 사용, secondary로 임시 이관 완료 |
| 9 | Toast → sonner 이관 | 낮음 | 리노벨 도메인 정리 |
| 2, 3, 4 | 기타 (검토 후 요청 취소) | — | 대체 가능 |

---

## DS 측 세션에 전달 (요약)

**긴급 (라이트 모드 폴백 버그)**:
- container 페어 `--on-*` 네이밍 통일

**높음 (리노벨 어댑터 도메인 layer 제거용)**:
- Dialog `presentation` prop (`auto` 바텀시트 · `center` 중앙)
- `DialogHeader` · `DialogFooter` 헬퍼 컴포넌트
- Dialog primitives (`Trigger`·`Close`·`Title`·`Description`)에 `asChild` prop
- Popover/DropdownMenu `openOn: "pointerdown" | "click"` prop

**중간**:
- Badge `soft` variant (opacity 배경 + 강조 텍스트 · primary tone)

**낮음**:
- Toast → sonner 이관 지원 (sonner 사용 예 문서화)

각 항목마다 위에 세부 스펙·다크 대응·리노벨 액션이 정리돼 있음. DS 반영 순서는 우선도대로.

---

**리노벨 측 현재 상태**:
- 위 미충족 스펙을 임시로 리노벨 어댑터에서 처리 중인 것 (Dialog `presentation`·`asChild`, Popover pointer 제스처, Toast store 등)은 **DS 흡수 후 어댑터 layer 제거 예정**
- 리노벨 어댑터에 신규 도메인 variant 추가는 금지 (Badge `soft` 사례처럼 재발 방지)
