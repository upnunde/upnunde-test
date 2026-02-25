# 아이콘 사용 가이드

프로젝트에 182개의 SVG 아이콘이 등록되어 있습니다.

## 📍 아이콘 위치

모든 아이콘은 `/public/icons/` 폴더에 저장되어 있습니다.

## 🚀 사용 방법

### 1. Icon 컴포넌트 사용 (권장)

```tsx
import Icon from "@/components/Icon";

// 기본 사용
<Icon name="arrow_back" />

// 크기 지정
<Icon name="home" width={32} height={32} />

// 스타일 적용
<Icon 
  name="search" 
  width={24} 
  height={24}
  className="text-primary"
  onClick={() => console.log("clicked")}
/>
```

### 2. 직접 이미지 태그 사용

```tsx
import { getIconPath } from "@/lib/icons";

<img src={getIconPath("arrow_back")} alt="back" width={24} height={24} />
```

### 3. Next.js Image 컴포넌트 사용

```tsx
import Image from "next/image";
import { getIconPath } from "@/lib/icons";

<Image 
  src={getIconPath("home")} 
  alt="home" 
  width={24} 
  height={24}
/>
```

## 📋 사용 가능한 아이콘 목록

모든 아이콘 이름은 `web/lib/icon-list.ts` 파일에서 확인할 수 있습니다.

주요 아이콘 예시:
- `arrow_back`, `arrow_forward`, `arrow_up`, `arrow_down`
- `home`, `home_fill`
- `search`
- `menu`, `more_horiz`, `more_vert`
- `close`, `close_circle`
- `plus`, `minus`
- `heart`, `heart_fill`
- `star`, `star_fill`
- `bookmark`, `bookmark_fill`
- `notification`, `notification_fill`
- `setting`, `setting_fill`

## 🔄 아이콘 목록 업데이트

새로운 아이콘을 추가한 후, 아이콘 목록을 다시 생성하려면:

```bash
cd web
npx tsx scripts/generate-icon-list.ts
```

## 💡 팁

- 아이콘 이름에 공백이 있는 경우 (예: `arrow_circle down`) 그대로 사용하면 됩니다.
- 파일명은 대소문자를 구분합니다.
- 아이콘을 찾을 수 없으면 콘솔에 경고가 표시됩니다.
