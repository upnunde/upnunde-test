"use client";

import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { useEditorStore, createBlock } from "@/store/useEditorStore";
import { parseScriptToBlocks } from "@/utils/scriptParser";
import { Button } from "@/components/ui/button";
import { PageCard } from "@/components/layout/PageCard";

const MAX_TITLE = 50;
const MAX_SUMMARY = 100;
const MAX_HISTORY = 5000;
const MAX_SCRIPT = 5000;

export function EpisodeForm() {
  const rawScript = useEditorStore((s) => s.rawScript);
  const setRawScript = useEditorStore((s) => s.setRawScript);
  const setBlocks = useEditorStore((s) => s.setBlocks);
  const setCurrentView = useEditorStore((s) => s.setCurrentView);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [history, setHistory] = useState("");

  const handleConvertToEditor = useCallback(() => {
    const parsed = parseScriptToBlocks(rawScript);
    setBlocks(parsed.length > 0 ? parsed : [createBlock("text", "")]);
    setCurrentView("editor");
  }, [rawScript, setBlocks, setCurrentView]);

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-slate-50 p-6">
      <PageCard>
        <h1 className="text-2xl font-bold text-slate-900">에피소드</h1>

        <div className="mt-6 flex flex-col gap-6">
          {/* 에피소드 제목 */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center justify-start text-sm font-bold text-slate-900">
              에피소드 제목<span className="text-red-500 px-1 h-fit w-fit align-middle -mt-1">*</span>
            </label>
            <p className="mb-2 text-xs text-slate-400">에피소드 제목을 입력해주세요.</p>
            <input
              type="text"
              maxLength={MAX_TITLE}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="에피소드 제목을 입력해주세요."
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end text-xs text-slate-400">
              {title.length}/{MAX_TITLE}
            </div>
          </div>

          {/* 에피소드 요약 */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center justify-start text-sm font-bold text-slate-900">
              에피소드 요약<span className="text-red-500 px-1 h-fit w-fit align-middle -mt-1">*</span>
            </label>
            <p className="text-xs text-slate-400 pb-2">에피소드를 한 줄로 소개해주세요.</p>
            <input
              type="text"
              maxLength={MAX_SUMMARY}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="에피소드 요약을 입력해주세요."
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end text-xs text-slate-400">
              {summary.length}/{MAX_SUMMARY}
            </div>
          </div>

          {/* 대표 이미지 */}
          <div className="flex flex-col gap-1 pb-5">
            <label className="flex items-center justify-start text-sm font-bold text-slate-900">
              대표 이미지<span className="text-red-500 px-1 h-fit w-fit align-middle -mt-1">*</span>
            </label>
            <p className="mb-2 text-xs text-slate-400">에피소드 대표 이미지를 등록해주세요.</p>
            <button
              type="button"
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition-colors hover:border-slate-400 hover:bg-slate-100"
              aria-label="대표 이미지 업로드"
            >
              <Plus className="h-6 w-6" strokeWidth={2} />
            </button>
          </div>

          {/* 지난 사건 히스토리 */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center justify-start text-sm font-bold text-slate-900">
              지난 사건 히스토리<span className="text-red-500 px-1 h-fit w-fit align-middle -mt-1">*</span>
            </label>
            <p className="mb-2 text-xs text-slate-400">지난 사건의 히스토리를 작성해 주세요.</p>
            <textarea
              rows={4}
              maxLength={MAX_HISTORY}
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              placeholder="지난 사건의 히스토리를 작성해 주세요."
              className="resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end text-xs text-slate-400">
              {history.length}/{MAX_HISTORY}
            </div>
          </div>

          {/* 에피소드 대본 */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center justify-start text-sm font-bold text-slate-900">
              에피소드 대본<span className="text-red-500 px-1 h-fit w-fit align-middle -mt-1">*</span>
            </label>
            <p className="mb-2 text-xs text-slate-400">에피소드 대본을 상세하게 작성해 주세요.</p>
            <textarea
              rows={8}
              maxLength={MAX_SCRIPT}
              value={rawScript}
              onChange={(e) => setRawScript(e.target.value)}
              placeholder="에피소드 대본을 상세하게 작성해 주세요."
              className="resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end text-xs text-slate-400">
              {rawScript.length}/{MAX_SCRIPT}
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="mt-8 flex justify-end gap-2">
          <Button type="button" variant="outline">
            취소
          </Button>
          <Button type="button" onClick={handleConvertToEditor}>
            에디터 변환하기
          </Button>
        </div>
      </PageCard>
    </div>
  );
}
