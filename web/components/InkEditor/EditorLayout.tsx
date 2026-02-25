"use client";

import { ReactNode } from "react";
import styles from "./EditorLayout.module.css";

interface EditorLayoutProps {
  /**
   * 사이드바에 들어갈 컴포넌트
   */
  sidebarContent: ReactNode;

  /**
   * 에디터 본문 (Block List)
   */
  children: ReactNode;

  /**
   * 사이드바 열림 상태
   */
  isSidebarOpen: boolean;

  /**
   * 헤더 영역 (선택적)
   * 제공하지 않으면 기본 헤더가 표시됨
   */
  header?: ReactNode;
}

export default function EditorLayout({
  sidebarContent,
  children,
  isSidebarOpen,
  header,
}: EditorLayoutProps) {
  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        {header || (
          <div className={styles.headerContent}>
            <div className={styles.logo}>
              <strong>RE:NOVEL</strong> Studio
            </div>
            <button className={styles.saveButton} aria-label="Save">
              저장
            </button>
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className={styles.mainContainer}>
        {/* Editor Canvas (Left) */}
        <div className={styles.editorCanvas}>{children}</div>

        {/* Property Sidebar (Right) - Conditional Rendering */}
        {isSidebarOpen && (
          <div className={styles.sidebar}>
            <div className={styles.sidebarContent}>{sidebarContent}</div>
          </div>
        )}
      </div>
    </div>
  );
}
