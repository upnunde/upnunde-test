# Design System 연결 가이드

`design-system` 패키지가 file: 링크로 연결되어 있어 로컬 변경이 즉시 반영된다.

원본: `../../Design System Test/packages/design-system`

## Import 가능한 것

### CSS

```css
@import "design-system/tokens.css";   /* 시맨틱 변수 (--background, --foreground, --primary 등) */
@import "design-system/theme.css";    /* Tailwind v4 매핑 (bg-primary 같은 유틸) */
@import "design-system/icons.css";    /* 아이콘 정규화 */
@import "design-system/fonts.css";    /* Pretendard */
```

### TS 모듈

```ts
import { cn } from "design-system"
import { CONTROL_SIZE_SCALE, controlSizeToIconGlyph } from "design-system/component-size-tokens"
import { SPACING_SCALE, space } from "design-system/spacing-tokens"
import { RADIUS_SCALE } from "design-system/radius-tokens"
import { ICON_GLYPH_SCALE } from "design-system/icon-tokens"
import { MOTION_DURATION_SCALE, MOTION_CHOREOGRAPHY } from "design-system/motion-tokens"
import { BRAND_COLOR_GROUPS } from "design-system/brand-colors"
```

## 점진적 마이그레이션 전략

리노벨은 자체 토큰 체계(`--surface-*`, `--on-surface-*`, `text-body3_500` 등)가 이미 깔려 있다. 한 번에 교체하지 말고 공존부터 시작.

### Phase A — 새 컴포넌트만 디자인 시스템 사용
새로 만드는 컴포넌트는 디자인 시스템의 토큰·유틸을 우선. 기존 컴포넌트는 그대로 둠.

### Phase B — globals.css에서 디자인 시스템 토큰 import
충돌 토큰은 리노벨 정의가 이기도록 import 순서 조정.

### Phase C — 컴포넌트 단위 교체
기존 컴포넌트 → 디자인 시스템 베이스로 wrapping.

### Phase D — 자체 토큰 폐기
모든 사용처 마이그레이션 후 자체 토큰 블록 제거.

## 동작 확인

```bash
cd app
npm run dev
```

## 디자인 시스템 수정이 필요할 때

`../../Design System Test/`로 이동해서 작업. 심볼릭 링크라 저장 즉시 반영됨.

## 주의

- 디자인 시스템 디렉토리를 이동하면 경로 갱신 필요
- npm publish 시점에 file: → npm 의존성으로 전환
