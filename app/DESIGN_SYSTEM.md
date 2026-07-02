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

## 버전 올리기

1. [Renovel-Studio-DS](https://github.com/upnunde/Renovel-Studio-DS)에 변경 푸시 + 태그 (예: `v0.1.2`)
2. `app/package.json`의 `#v0.1.1` → `#v0.1.2`
3. `npm install` 후 `package-lock.json` 커밋
4. `npm run check:ds` · `npx tsc --noEmit` · `npm run build` 확인

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
