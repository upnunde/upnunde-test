# 리노벨 디자인 시스템 - UI 컴포넌트 라이브러리

프로젝트의 디자인 시스템을 준수하는 UI 컴포넌트 라이브러리입니다.

## 설치된 컴포넌트

- ✅ **Button** - 버튼 컴포넌트
- ✅ **Input** - 입력 필드 컴포넌트
- ✅ **Card** - 카드 컴포넌트
- ✅ **Label** - 레이블 컴포넌트
- ✅ **Badge** - 배지 컴포넌트
- ✅ **Checkbox** - 체크박스 컴포넌트

## 사용 방법

### Button

```tsx
import { Button } from "@/components/ui";

// 기본 버튼
<Button>클릭</Button>

// Variant
<Button variant="default">기본</Button>
<Button variant="destructive">삭제</Button>
<Button variant="outline">아웃라인</Button>
<Button variant="secondary">보조</Button>
<Button variant="ghost">고스트</Button>
<Button variant="link">링크</Button>

// Size
<Button size="sm">작은 버튼</Button>
<Button size="default">기본 버튼</Button>
<Button size="lg">큰 버튼</Button>
<Button size="icon">
  <Icon name="close" />
</Button>

// 아이콘과 함께
<Button>
  <Icon name="plus" />
  추가하기
</Button>
```

### Input

```tsx
import { Input } from "@/components/ui";

// 기본 입력
<Input placeholder="입력하세요" />

// 타입 지정
<Input type="email" placeholder="이메일" />
<Input type="password" placeholder="비밀번호" />

// 에러 상태
<Input aria-invalid="true" placeholder="에러가 있는 입력" />

// 비활성화
<Input disabled placeholder="비활성화" />
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui";

<Card>
  <CardHeader>
    <CardTitle>카드 제목</CardTitle>
    <CardDescription>카드 설명</CardDescription>
  </CardHeader>
  <CardContent>
    카드 내용
  </CardContent>
  <CardFooter>
    <Button>액션</Button>
  </CardFooter>
</Card>
```

### Label

```tsx
import { Label } from "@/components/ui";

<Label htmlFor="email">이메일</Label>
<Input id="email" type="email" />
```

### Badge

```tsx
import { Badge } from "@/components/ui";

<Badge>기본</Badge>
<Badge variant="secondary">보조</Badge>
<Badge variant="destructive">삭제</Badge>
<Badge variant="outline">아웃라인</Badge>
```

### Checkbox

```tsx
import { Checkbox } from "@/components/ui";
import { useState } from "react";

function MyComponent() {
  const [checked, setChecked] = useState(false);
  
  return (
    <Checkbox 
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
}
```

## 디자인 시스템 준수

모든 컴포넌트는 다음 디자인 토큰을 사용합니다:

- **컬러**: `var(--primary)`, `var(--on-surface-10)` 등
- **타이포그래피**: `var(--body-2-400)`, `var(--heading-4-700)` 등
- **스페이싱**: `var(--spacing-*)`
- **라디우스**: `var(--radius-*)`

## 주의사항

- Dialog, Select 컴포넌트는 Radix UI가 필요하므로 현재 프로젝트에는 포함되지 않았습니다.
- 필요시 별도로 구현하거나 Radix UI를 설치하여 사용할 수 있습니다.
