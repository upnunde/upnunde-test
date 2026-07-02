"use client";

const BLOCKED_DYNAMIC_API_ERRORS = [
  "params are being enumerated. `params` is a Promise and must be unwrapped with `React.use()` before accessing its properties.",
  "The keys of `searchParams` were accessed directly. `searchParams` is a Promise and must be unwrapped with `React.use()` before accessing its properties.",
];

function shouldBlockConsoleError(args: unknown[]): boolean {
  const joinedText = args
    .map((arg) => (typeof arg === "string" ? arg : String(arg)))
    .join("\n");

  if (BLOCKED_DYNAMIC_API_ERRORS.some((blocked) => joinedText.includes(blocked))) {
    return true;
  }

  if (
    joinedText.includes("data-cursor-element-id") &&
    (joinedText.includes("hydration") || joinedText.includes("hydrated"))
  ) {
    return true;
  }

  return false;
}

let filterInstalled = false;

/** React 번들 로드 직후·useEffect 이전에도 동작하도록 모듈 평가 시 1회 설치 */
function installDevConsoleFilter() {
  if (filterInstalled || process.env.NODE_ENV !== "development") return;
  if (typeof window === "undefined") return;

  filterInstalled = true;
  const originalConsoleError = window.console.error;

  window.console.error = (...args: unknown[]) => {
    if (shouldBlockConsoleError(args)) return;
    originalConsoleError(...args);
  };
}

installDevConsoleFilter();

/** 개발 콘솔 노이즈 필터 — Cursor DOM 주입·Next 동적 API 경고 */
export default function DevConsoleFilter() {
  installDevConsoleFilter();
  return null;
}
