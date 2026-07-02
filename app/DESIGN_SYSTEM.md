# Design System 연결 가이드

`design-system`은 GitHub 패키지로 설치한다.

```json
"design-system": "github:upnunde/Renovel-Studio-DS#v0.1.1"
```

저장소: [upnunde/Renovel-Studio-DS](https://github.com/upnunde/Renovel-Studio-DS)

## 설치

```bash
cd app
npm install
```

CI·클린 환경(lockfile이 `git+ssh`로 resolve된 경우):

```bash
cd app
sh scripts/ci-install.sh
```

## Import 가능한 것

### CSS

```css
@import "design-system/tokens.css";
@import "design-system/theme.css";
@import "design-system/icons.css";
@import "design-system/fonts.css";
```

### TS 모듈

```ts
import { cn } from "design-system/utils";
import { Button } from "design-system/ui/button";
import { ICON_GLYPH_SCALE } from "design-system/icon-tokens";
```

전체 export 목록은 `node_modules/design-system/package.json`의 `exports` 필드를 참고한다.

## 버전 올리기 (수동)

1. [Renovel-Studio-DS](https://github.com/upnunde/Renovel-Studio-DS)에 변경 푸시 + 태그 (예: `v0.1.2`)
2. `app/package.json`의 `#v0.1.1` → `#v0.1.2`
3. `npm install` 후 `package-lock.json` 커밋
4. `npm run check:ds` · `npx tsc --noEmit` · `npm run build` 확인

또는 로컬에서 최신 태그만 맞출 때: `npm run sync:ds`

## 자동 동기화 (권장)

### upnunde-test (이 저장소)

- **`.github/workflows/ds-sync.yml`** — DS 새 태그 감지 → `package.json`·lockfile 갱신 → `check:ds`·`tsc` → **PR 자동 생성**
- 트리거:
  - `repository_dispatch` (`ds-release`) — DS 릴리스 직후 즉시
  - `schedule` — 매일 09:00 UTC (웹훅 누락 대비)
  - `workflow_dispatch` — 수동 실행·특정 태그 지정
- **`.github/dependabot.yml`** — npm 의존성(포함 `design-system`) 일일 점검 PR

### Renovel-Studio-DS (DS 저장소 — 1회 설정)

`docs/ds-repo-release-notify.yml` 내용을 DS에  
`.github/workflows/notify-upnunde-test.yml` 로 추가한다.

DS repo **Secrets**:

| 이름 | 용도 |
|------|------|
| `UPNUNDE_TEST_DISPATCH_PAT` | `upnunde/upnunde-test`에 `repository_dispatch` 가능한 PAT |

upnunde-test repo **Secrets** (DS가 비공개일 때):

| 이름 | 용도 |
|------|------|
| `DS_REPO_TOKEN` | `ds-sync`가 DS 릴리스 API 조회용 (없으면 `GITHUB_TOKEN` 시도) |

### 흐름

```
DS: 태그 v0.1.2 + GitHub Release publish
  → repository_dispatch (즉시) 또는 schedule (최대 24h)
  → upnunde-test: ds-sync 워크플로
  → PR: chore(app): design-system v0.1.2 동기화
  → 리뷰·머지 후 배포
```

**푸시만 하고 Release/태그가 없으면 동기화되지 않습니다.** DS 변경은 반드시 `v*.*.*` 태그 + Release publish를 사용하세요.

## Next.js

`next.config.ts`에 `transpilePackages: ["design-system"]` 설정됨 (GitHub에서 받은 TS 소스 트랜스파일).

## 로컬 DS 개발 (선택)

패키지 소스를 직접 수정하며 연동하려면 일시적으로 file 의존성으로 바꿀 수 있다.

```json
"design-system": "file:../../path/to/design-system"
```

작업 후 GitHub 태그 버전으로 되돌리고 lockfile을 갱신한다.

## 동작 확인

```bash
cd app
npm run check:ds
npm run dev
```
