"use client";

import { useLayoutEffect } from "react";
import { parseScriptToBlocks } from "@/utils/scriptParser";
import {
  createBlock,
  createDefaultSeedBlocks,
  hydrateSeriesPersonaFromSession,
  useEditorStore,
} from "@/store/useEditorStore";
import { INITIAL_SCRIPT } from "@/lib/initialScript";

/**
 * 에디터 본문(INITIAL_SCRIPT)을 스토어에 넣는 시점을 SubHeader보다 앞당긴다.
 * EditorBody의 useEffect보다 먼저 실행되면, 이전 세션 blocks로 잘못 잡힌 savedSnapshot 불일치를 막는다.
 */
export function EditorScriptBootstrap({
  routeKey,
  startEmpty = false,
}: {
  routeKey: string;
  startEmpty?: boolean;
}) {
  useLayoutEffect(() => {
    hydrateSeriesPersonaFromSession();
    const parsed = startEmpty ? [] : parseScriptToBlocks(INITIAL_SCRIPT);
    const nextBlocks = startEmpty
      ? createDefaultSeedBlocks()
      : parsed.length > 0
        ? parsed
        : [createBlock("text", "")];
    useEditorStore.setState({
      blocks: nextBlocks,
      scriptHistory: [],
      undoStack: [],
      redoStack: [],
      focusBlockId: null,
      mobileKeyboardEditBlockId: null,
      mobileContentEditPromptBlockId: null,
      issueFocus: null,
    });
  }, [routeKey, startEmpty]);

  return null;
}
