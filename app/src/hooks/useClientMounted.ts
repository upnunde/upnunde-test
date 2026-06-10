"use client";

import { useEffect, useState } from "react";

/** SSR·hydration 첫 패스와 동일하게 유지한 뒤, 마운트 후에만 클라이언트 전용 UI를 켠다. */
export function useClientMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
