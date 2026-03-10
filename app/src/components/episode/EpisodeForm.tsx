"use client";

import { useState, useCallback } from "react";
import { useEditorStore, createBlock } from "@/store/useEditorStore";
import { parseScriptToBlocks } from "@/utils/scriptParser";
import { Button } from "@/components/ui/button";
import { PageCard } from "@/components/layout/PageCard";
import { AddResourceSlot } from "@/components/resource/cards/AddResourceSlot";
import { Title1 } from "@/components/ui/title1";
import { Title2 } from "@/components/ui/title2";

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
    <div className="mx-auto w-full max-w-[1200px] min-w-[640px] rounded-xl border border-slate-200 bg-white shadow-none">
      <Title2 text="에피소드" asSectionHeader />

      <PageCard className="mx-0 max-w-none min-w-0 border-0 rounded-none px-5 pt-5 pb-5 shadow-none">
        <div className="mt-0 flex flex-col gap-6">
          {/* 에피소드 제목 */}
          <div className="flex flex-col gap-3">
            <Title1
              text="에피소드 제목*"
              showDot
              subtitle
              subtitleText="에피소드 제목을 입력해주세요."
            />
            <input
              type="text"
              maxLength={MAX_TITLE}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="에피소드 제목을 입력해주세요."
              className="h-12 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end text-xs text-on-surface-30">
              {title.length}/{MAX_TITLE}
            </div>
          </div>

          {/* 에피소드 요약 */}
          <div className="flex flex-col gap-3">
            <Title1
              text="에피소드 요약*"
              showDot
              subtitle
              subtitleText="에피소드를 한 줄로 소개해주세요."
            />
            <input
              type="text"
              maxLength={MAX_SUMMARY}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="에피소드 요약을 입력해주세요."
              className="h-12 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end text-xs text-on-surface-30">
              {summary.length}/{MAX_SUMMARY}
            </div>
          </div>

          {/* 대표 이미지 (img1:1 타입 슬롯과 동일 스타일) */}
          <div className="flex flex-col gap-3 pb-5">
            <Title1
              text="대표 이미지*"
              showDot
              subtitle
              subtitleText="에피소드 대표 이미지를 등록해주세요."
            />
            <AddResourceSlot
              variant="img1:1"
              ariaLabel="대표 이미지 업로드"
              onClick={() => {}}
            />
          </div>

          {/* 지난 사건 히스토리 */}
          <div className="flex flex-col gap-3">
            <Title1
              text="지난 사건 히스토리*"
              showDot
              subtitle
              subtitleText="지난 사건의 히스토리를 작성해 주세요."
            />
            <textarea
              rows={4}
              maxLength={MAX_HISTORY}
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              placeholder="지난 사건의 히스토리를 작성해 주세요."
              className="min-h-[160px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end text-xs text-on-surface-30">
              {history.length}/{MAX_HISTORY}
            </div>
          </div>

          {/* 에피소드 대본 */}
          <div className="flex flex-col gap-3">
            <Title1
              text="에피소드 대본*"
              showDot
              subtitle
              subtitleText="에피소드 대본을 상세하게 작성해 주세요."
            />
            <textarea
              rows={8}
              maxLength={MAX_SCRIPT}
              value={rawScript}
              onChange={(e) => setRawScript(e.target.value)}
              placeholder="에피소드 대본을 상세하게 작성해 주세요."
              className="min-h-[160px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end text-xs text-on-surface-30">
              {rawScript.length}/{MAX_SCRIPT}
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="mt-8 flex justify-end gap-2">
          <Button type="button" variant="outline">
            취소
          </Button>
          <Button
            type="button"
            onClick={handleConvertToEditor}
          >
            에디터 변환하기
          </Button>
        </div>
      </PageCard>
    </div>
  );
}
