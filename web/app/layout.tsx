import "../styles/index.css";
import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Cursor Talk to Figma MCP Dashboard",
  description: "Web UI for Cursor ↔ Figma MCP integration"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

