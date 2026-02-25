"use client";

import { useState, ReactNode } from "react";
import MusicComponent from "./MusicComponent";
import ControlPanel from "./ControlPanel";
import styles from "./SceneEditorLayout.module.css";

interface SceneEditorLayoutProps {
  children?: ReactNode;
}

export default function SceneEditorLayout({ children }: SceneEditorLayoutProps) {
  const [showMusicPanel, setShowMusicPanel] = useState(true);
  const [showControlPanel, setShowControlPanel] = useState(false);

  return (
    <div className={styles.container}>
      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Editor Section */}
        <div className={styles.editorSection}>
          <div className={styles.editorContent}>
            {children}
          </div>
        </div>

        {/* Music Panel */}
        {showMusicPanel && (
          <div className={styles.musicPanel}>
            <MusicComponent onClose={() => setShowMusicPanel(false)} />
          </div>
        )}
      </div>

      {/* Control Panel */}
      {showControlPanel && (
        <ControlPanel
          onClose={() => {
            console.log("Closing control panel");
            setShowControlPanel(false);
          }}
        />
      )}
    </div>
  );
}
