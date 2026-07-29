"use client";

import * as React from "react";
import { Switch as DsSwitch } from "design-system/ui/switch";
import { cn } from "design-system/utils";

/**
 * 리노벨 Switch — DS Switch 재사용.
 * 에디터 본문(`cursor-text`) 등 부모 cursor가 상속되지 않도록 `cursor-pointer`를 기본으로 둔다.
 */
function Switch({
  className,
  ...props
}: React.ComponentProps<typeof DsSwitch>) {
  return <DsSwitch className={cn("cursor-pointer", className)} {...props} />;
}

export { Switch };
