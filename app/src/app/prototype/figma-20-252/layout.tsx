import type { ReactNode } from "react";

import "@/components/prototype/figma-prototype-light.css";
import "@/components/prototype/tossface.css";

/** Tossface(토스페이스) — 프로토타입 페이지에서만 로드 */
export default function PrototypeFigmaLayout({ children }: { children: ReactNode }) {
  return children;
}
