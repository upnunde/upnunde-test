# 컴포넌트 미채택 스캔 리포트

> 생성일: 2026-07-01
> 스캔 대상: `app/src/**/*.tsx` (컴포넌트 ui/ 제외)
> 발견 총계: **34건** (20개 파일)

## 판정 방법

- 인라인 마크업의 태그·className·속성 패턴을 규칙 매처로 판정.
- 규칙별 신뢰도: **high** = 스타일·시맨틱 명확 (자동 교체 후보) · **medium** = 검수 필요 · **low** = 도메인 판단
- 하나의 요소는 첫 매치 규칙만 기록 (규칙 우선순위 순).

## HIGH — 23건

### Skeleton — 1건

권장 교체: `<Skeleton>`

| 파일 | 라인 | 태그 | 스니펫 |
|---|---|---|---|
| `src/app/analytics/page.tsx` | 15 | `<div>` | `<div         className="mx-auto w-full min-h-[min(60vh,520px)] max-w-[1200px] animate-pulse rounded-sm bg-muted"         aria-hidden       />` |

### Button (icon-only ghost) — 22건

권장 교체: `<Button variant="ghost" size="icon-sm">`

| 파일 | 라인 | 태그 | 스니펫 |
|---|---|---|---|
| `src/components/Header/Header.tsx` | 41 | `<button>` | `<button             type="button"             onClick={onMenuClick}             className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground-muted hover:bg-mu…` |
| `src/components/ProfileEditModal.tsx` | 311 | `<button>` | `<button                     type="button"                     aria-label="닫기"                     onClick={handleClose}                     className="flex h-8 w-8 cursor-pointer items-center justify-…` |
| `src/components/ProfileEditModal.tsx` | 373 | `<button>` | `<button                 type="button"                 onClick={handleClose}                 className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-foreground-muted transi…` |
| `src/components/analytics/AnalyticsPeriodPicker.tsx` | 330 | `<button>` | `<button                       type="button"                       aria-label="닫기"                       onClick={handleDismiss}                       className="flex h-8 w-8 cursor-pointer items-cente…` |
| `src/components/character/CharacterItem.tsx` | 110 | `<button>` | `<button                   type="button"                   className="-mr-2 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground-placeholder hover:bg-muted focus-visible…` |
| `src/components/editor/EditorBody.tsx` | 204 | `<button>` | `<button             type="button"             className="flex h-8 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-full p-0 text-foreground-placeholder hover:bg-muted hover:text…` |
| `src/components/editor/EditorBottomSheetMenu.tsx` | 84 | `<button>` | `<button                   type="button"                   aria-label="닫기"                   onClick={handleDismiss}                   className="flex h-8 w-8 cursor-pointer items-center justify-center…` |
| `src/components/editor/ResourcePicker.tsx` | 374 | `<button>` | `<button         type="button"         aria-label="닫기"         onClick={onClose}         className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-foreground-placeholder tran…` |
| `src/components/resource/ImageResourceDetailPage.tsx` | 328 | `<button>` | `<button                           type="button"                           className="w-8 h-8 rounded-full cursor-pointer bg-background inline-flex justify-center items-center text-foreground hover:bg-…` |
| `src/components/resource/ImageResourceDetailPage.tsx` | 339 | `<button>` | `<button                           type="button"                           className="w-8 h-8 rounded-full cursor-pointer bg-background inline-flex justify-center items-center text-foreground hover:bg-…` |
| `src/components/resource/MediaResourceDetailPage.tsx` | 346 | `<button>` | `<button                           type="button"                           className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-background text-foreground hover:bg-…` |
| `src/components/resource/MediaResourceDetailPage.tsx` | 409 | `<button>` | `<button                           type="button"                           className="w-8 h-8 rounded-full cursor-pointer bg-background inline-flex justify-center items-center text-foreground hover:bg-…` |
| `src/components/resource/MediaResourceDetailPage.tsx` | 420 | `<button>` | `<button                           type="button"                           className="w-8 h-8 rounded-full cursor-pointer bg-background inline-flex justify-center items-center text-foreground hover:bg-…` |
| `src/components/resource/bgm/BgmListItem.tsx` | 161 | `<button>` | `<button                       type="button"                       onClick={handlePlayPause}                       className="w-8 h-8 rounded-full cursor-pointer inline-flex justify-center items-center…` |
| `src/components/resource/bgm/BgmListItem.tsx` | 175 | `<button>` | `<button                       type="button"                       onClick={onAdd}                       className="w-8 h-8 rounded-full cursor-pointer inline-flex justify-center items-center border bo…` |
| `src/components/resource/bgm/BgmListItem.tsx` | 196 | `<button>` | `<button                     type="button"                     onClick={handlePlayPause}                     className="w-8 h-8 rounded-full cursor-pointer inline-flex justify-center items-center borde…` |
| `src/components/resource/bgm/BgmListItem.tsx` | 210 | `<button>` | `<button                     type="button"                     onClick={onAdd}                     className="w-8 h-8 rounded-full cursor-pointer inline-flex justify-center items-center border border-b…` |
| `src/components/resource/character/CharacterDetailPage.tsx` | 433 | `<button>` | `<button                               type="button"                               className="w-8 h-8 rounded-full cursor-pointer bg-background inline-flex justify-center items-center text-foreground h…` |
| `src/components/resource/character/CharacterDetailPage.tsx` | 444 | `<button>` | `<button                               type="button"                               className="w-8 h-8 rounded-full cursor-pointer bg-background inline-flex justify-center items-center text-foreground h…` |
| `src/components/resource/character/CharacterDetailPage.tsx` | 498 | `<button>` | `<button                                 type="button"                                 className="w-8 h-8 rounded-full cursor-pointer bg-background inline-flex justify-center items-center text-foregrou…` |
| `src/components/resource/character/CharacterDetailPage.tsx` | 506 | `<button>` | `<button                                 type="button"                                 className="w-8 h-8 rounded-full cursor-pointer bg-background inline-flex justify-center items-center text-foregrou…` |
| `src/components/series/SeriesItem.tsx` | 174 | `<button>` | `<button                 type="button"                 className="shrink-0 w-8 h-8 -mt-1 -mr-2 rounded-full flex items-center justify-center text-foreground-placeholder hover:bg-muted focus-visible:out…` |

## MEDIUM — 11건

### Alert (destructive) — 1건

권장 교체: `<Alert variant="destructive">`

| 파일 | 라인 | 태그 | 스니펫 |
|---|---|---|---|
| `src/app/settlements/page.tsx` | 843 | `<div>` | `<div className="rounded-sm border border-destructive/30 bg-destructive/10 px-3 py-2 text-caption1_400 text-destructive">` |

### Button (outline) — 8건

권장 교체: `<Button variant="outline">`

| 파일 | 라인 | 태그 | 스니펫 |
|---|---|---|---|
| `src/components/auth/LoginPage.tsx` | 95 | `<button>` | `<button               type="button"               className="relative flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-background px-4 h-[42px] text-bo…` |
| `src/components/auth/LoginPage.tsx` | 108 | `<button>` | `<button             type="button"             className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-background px-4 h-[42px] text-body3_500 text-…` |
| `src/components/auth/LoginPage.tsx` | 117 | `<button>` | `<button             type="button"             className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-background px-4 h-[42px] text-body3_500 text-…` |
| `src/components/auth/LoginPage.tsx` | 126 | `<button>` | `<button             type="button"             className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-background px-4 h-[42px] text-body3_500 text-…` |
| `src/components/episode/Pagination.tsx` | 164 | `<button>` | `<button             type="submit"             className="h-8 cursor-pointer rounded border border-border px-3 text-body3_500 text-foreground-muted transition-colors hover:bg-muted disabled:border-bord…` |
| `src/components/inquiry/InquiryHistoryItem.tsx` | 102 | `<button>` | `<button                 type="button"                 onClick={handleCollapse}                 className="h-8 cursor-pointer rounded-md border border-border bg-background px-3 text-body3_500 text-fore…` |
| `src/components/notification/NotificationItem.tsx` | 92 | `<button>` | `<button                 type="button"                 onClick={handleContactClick}                 className="h-8 cursor-pointer flex items-center rounded-md border border-border bg-background px-3 te…` |
| `src/components/notification/NotificationItem.tsx` | 99 | `<button>` | `<button                 type="button"                 onClick={handleCollapse}                 className="h-8 cursor-pointer rounded-md border border-border bg-background px-3 flex items-center text-b…` |

### Badge (solid destructive) — 2건

권장 교체: `<Badge variant="destructive">`

| 파일 | 라인 | 태그 | 스니펫 |
|---|---|---|---|
| `src/components/editor/EditorMobileIssueFloatingButton.tsx` | 55 | `<span>` | `<span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-destructive px-1 py-0.5 text-center text-caption2_400 leading-none text-inverse-foreground">` |
| `src/components/editor/SceneNavigation.tsx` | 364 | `<span>` | `<span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-destructive px-1 text-caption2_400 text-inverse-foreground">` |
