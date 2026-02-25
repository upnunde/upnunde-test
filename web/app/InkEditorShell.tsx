"use client";

import { useEffect, useRef } from "react";

type Props = {
  styles: string;
  script: string;
  body: string;
};

export default function InkEditorShell({ styles, script, body }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const styleId = "ink-editor-inline-styles";

    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.innerHTML = styles;
      document.head.appendChild(styleEl);
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = body;
      
      // 스크립트를 컨테이너 내부에 추가하여 제대로 실행되도록 함
      const scriptEl = document.createElement("script");
      scriptEl.type = "text/javascript";
      scriptEl.text = script;
      containerRef.current.appendChild(scriptEl);
    }

    return () => {
      // Cleanup은 Next.js가 자동으로 처리
    };
  }, [styles, script, body]);

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: "100%",
        height: "100%",
        overflow: "visible",
        position: "relative",
        zIndex: 1
      } as React.CSSProperties}
    >
      <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%" }} />
    </div>
  );
}

