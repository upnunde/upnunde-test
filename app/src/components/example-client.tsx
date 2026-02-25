"use client";

import { useState } from "react";

/**
 * React 클라이언트 컴포넌트 예시
 * - "use client"가 있으면 useState, useEffect, 이벤트 핸들러 등 React 기능 사용 가능
 * - 이 파일을 복사해 새 컴포넌트를 만들면 됩니다.
 */
export function ExampleClient() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {open ? "접기" : "펼치기"}
      </button>
      {open && (
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          React 훅으로 작성된 클라이언트 컴포넌트입니다.
        </p>
      )}
    </div>
  );
}
