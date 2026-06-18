"use client";

import { createContext, useContext, type ReactNode } from "react";

const EditorSeriesContext = createContext<string | null>(null);

export function EditorSeriesProvider({
  seriesId,
  children,
}: {
  seriesId: string | null;
  children: ReactNode;
}) {
  return (
    <EditorSeriesContext.Provider value={seriesId}>{children}</EditorSeriesContext.Provider>
  );
}

export function useEditorSeriesId(): string | null {
  return useContext(EditorSeriesContext);
}
