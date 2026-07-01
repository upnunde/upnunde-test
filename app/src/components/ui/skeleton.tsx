import * as React from "react"

import { cn } from "design-system/utils"

/**
 * 리노벨 Skeleton — DS 스펙 재구현 (`animate-pulse rounded-md bg-muted`).
 * DS 패키지의 skeleton은 다른 @types/react 인스턴스라 직접 re-export 불가 →
 * 동일 시각 스펙을 여기서 native로 렌더한다.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
