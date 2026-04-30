"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useEditorStore, createBlock } from "@/store/useEditorStore";
import { parseScriptToBlocks } from "@/utils/scriptParser";
import { Button } from "@/components/ui/button";
import { PageCard } from "@/components/layout/PageCard";
import { AddResourceSlot } from "@/components/resource/cards/AddResourceSlot";
import { ImageCard } from "@/components/resource/cards/ImageCard";
import { Title1 } from "@/components/ui/title1";
import { Title2 } from "@/components/ui/title2";
import { ImageCropPosterModal } from "@/components/resource/character/CharacterExpressionModal";
import { cn } from "@/lib/utils";
import { initialBackgrounds } from "@/lib/resourceMockData";
import type { ImageResource } from "@/types/resource";

const MAX_TITLE = 50;
const MAX_SUMMARY = 100;
const MAX_HISTORY = 5000;
const MAX_SCRIPT = 5000;
const DUMMY_TITLE = "새벽의 문턱에서";
const DUMMY_SUMMARY = "봉인된 문이 열리며 주인공이 첫 선택의 대가를 마주합니다.";
const DUMMY_HISTORY =
  "지난 화에서 주인공은 금서 보관실에서 오래된 열쇠를 발견했습니다. " +
  "열쇠에는 정체불명의 문양이 새겨져 있었고, 그 문양은 마을 외곽 폐성당의 지하 문과 일치했습니다. " +
  "동료들은 위험을 경고했지만 주인공은 진실을 확인하기 위해 새벽에 홀로 성당으로 향합니다.";
const DUMMY_SCRIPT = `[scene] 폐성당 지하 입구
[top_desc] 차가운 안개가 계단을 타고 올라온다.
[text speaker="나레이션"] 새벽 다섯 시, 성당의 종은 울리지 않았다.
[text speaker="나 (페르소나 닉네임)"] 이 문이 정말 모든 시작점이라면, 지금 열어야 해.
[direction] 주인공이 열쇠를 문에 꽂고 천천히 돌린다.
[event] 낡은 문이 열리며 푸른 빛이 새어 나온다.
[text speaker="나레이션"] 문틈 너머로 오래전 사라진 이름이 속삭인다.
[event_end]`;
const DUMMY_THUMBNAIL = initialBackgrounds[0]?.imageUrl ?? "/background-1.png";

export interface EpisodeFormProps {
  onCancel?: () => void;
  onConverted?: () => void;
  containerClassName?: string;
  stickyFooter?: boolean;
}

export function EpisodeForm({
  onCancel,
  onConverted,
  containerClassName,
  stickyFooter = false,
}: EpisodeFormProps) {
  const rawScript = useEditorStore((s) => s.rawScript);
  const setRawScript = useEditorStore((s) => s.setRawScript);
  const setBlocks = useEditorStore((s) => s.setBlocks);
  const setCurrentView = useEditorStore((s) => s.setCurrentView);

  const [title, setTitle] = useState(DUMMY_TITLE);
  const [summary, setSummary] = useState(DUMMY_SUMMARY);
  const [history, setHistory] = useState(DUMMY_HISTORY);
  const [thumbnailUrl, setThumbnailUrl] = useState(DUMMY_THUMBNAIL);
  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
  const [thumbnailModalInitialSlots, setThumbnailModalInitialSlots] =
    useState<{ id: string; expressionLabel: string; imageUrl?: string }[] | null>(null);
  const [pendingThumbnailUrl, setPendingThumbnailUrl] = useState<string | null>(null);
  const thumbnailFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleConvertToEditor = useCallback(() => {
    const parsed = parseScriptToBlocks(rawScript);
    setBlocks(parsed.length > 0 ? parsed : [createBlock("text", "")]);
    setCurrentView("editor");
    onConverted?.();
  }, [onConverted, rawScript, setBlocks, setCurrentView]);

  useEffect(() => {
    if (!rawScript.trim()) {
      setRawScript(DUMMY_SCRIPT);
    }
  }, [rawScript, setRawScript]);

  useEffect(() => {
    return () => {
      if (thumbnailUrl && thumbnailUrl.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailUrl);
      }
      if (pendingThumbnailUrl && pendingThumbnailUrl.startsWith("blob:")) {
        URL.revokeObjectURL(pendingThumbnailUrl);
      }
    };
  }, [thumbnailUrl, pendingThumbnailUrl]);

  const handleThumbnailClick = useCallback(() => {
    if (thumbnailUrl) {
      setThumbnailModalInitialSlots([
        { id: "episode-thumbnail", expressionLabel: "", imageUrl: thumbnailUrl },
      ]);
      setThumbnailModalOpen(true);
      return;
    }
    thumbnailFileInputRef.current?.click();
  }, [thumbnailUrl]);

  const handleThumbnailRemove = useCallback(() => {
    setThumbnailUrl((prev) => {
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return "";
    });
  }, []);

  const thumbnailItem: ImageResource = {
    id: "episode-thumbnail",
    name: "대표 이미지",
    imageUrl: thumbnailUrl,
  };

  const handleThumbnailFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = (e.target.files ?? [])[0];
      e.target.value = "";
      if (!file || !file.type.startsWith("image/")) return;

      const objectUrl = URL.createObjectURL(file);
      setPendingThumbnailUrl((prev) => {
        if (prev && prev.startsWith("blob:")) {
          URL.revokeObjectURL(prev);
        }
        return objectUrl;
      });
      setThumbnailModalInitialSlots([
        { id: "episode-thumbnail", expressionLabel: "", imageUrl: objectUrl },
      ]);
      setThumbnailModalOpen(true);
    },
    [],
  );

  const isFormComplete =
    title.trim().length > 0 &&
    summary.trim().length > 0 &&
    history.trim().length > 0 &&
    rawScript.trim().length > 0 &&
    thumbnailUrl.trim().length > 0;

  const footer = (
    <div
      className={cn(
        "flex justify-end gap-2",
        stickyFooter
          ? "sticky bottom-0 border-t border-border-10 bg-white px-5 py-4"
          : "mt-8",
      )}
    >
      <Button type="button" variant="outline" onClick={onCancel}>
        취소
      </Button>
      <Button
        type="button"
        onClick={handleConvertToEditor}
        disabled={!isFormComplete}
      >
        에디터 변환하기
      </Button>
    </div>
  );

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1200px] min-w-[640px] rounded-[4px] border border-border-10 bg-white shadow-none",
        stickyFooter && "flex min-h-0 h-full flex-col overflow-hidden",
        containerClassName,
      )}
    >
      <Title2 text="에피소드" asSectionHeader />

      <PageCard
        className={cn(
          "mx-0 max-w-none min-w-0 border-0 rounded-none px-5 pt-5 pb-5 shadow-none",
          stickyFooter && "min-h-0 flex-1 overflow-y-auto",
        )}
      >
        <div className="mt-0 flex flex-col gap-6">
          {/* 에피소드 제목 */}
          <div className="flex flex-col gap-3">
            <Title1
              text="에피소드 제목*"
              variant="title-subtitle-dot"
              subtitleText="에피소드 제목을 입력해주세요."
            />
            <input
              type="text"
              maxLength={MAX_TITLE}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="에피소드 제목을 입력해주세요."
              className="h-12 rounded-md border border-border-10 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end text-xs text-on-surface-30">
              {title.length}/{MAX_TITLE}
            </div>
          </div>

          {/* 에피소드 요약 */}
          <div className="flex flex-col gap-3">
            <Title1
              text="에피소드 요약*"
              variant="title-subtitle-dot"
              subtitleText="에피소드를 한 줄로 소개해주세요."
            />
            <input
              type="text"
              maxLength={MAX_SUMMARY}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="에피소드 요약을 입력해주세요."
              className="h-12 rounded-md border border-border-10 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end text-xs text-on-surface-30">
              {summary.length}/{MAX_SUMMARY}
            </div>
          </div>

          {/* 대표 이미지 (9:16 썸네일 + 단일 크롭 모달) */}
          <div className="flex flex-col gap-3 pb-5">
            <Title1
              text="대표 이미지*"
              variant="title-subtitle-dot"
              subtitleText="에피소드 대표 이미지를 등록해주세요."
            />
            {thumbnailUrl ? (
              <ImageCard
                item={thumbnailItem}
                slotType="img9:16"
                showName={false}
                onDetailClick={handleThumbnailClick}
                onDeleteClick={handleThumbnailRemove}
              />
            ) : (
              <AddResourceSlot
                variant="img9:16"
                ariaLabel="대표 이미지 업로드"
                onClick={handleThumbnailClick}
              />
            )}
          </div>

          {/* 지난 사건 히스토리 */}
          <div className="flex flex-col gap-3">
            <Title1
              text="지난 사건 히스토리*"
              variant="title-subtitle-dot"
              subtitleText="지난 사건의 히스토리를 작성해 주세요."
            />
            <textarea
              rows={4}
              maxLength={MAX_HISTORY}
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              placeholder="지난 사건의 히스토리를 작성해 주세요."
              className="min-h-[160px] max-h-[400px] rounded-md border border-border-10 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end text-xs text-on-surface-30">
              {history.length}/{MAX_HISTORY}
            </div>
          </div>

          {/* 에피소드 대본 */}
          <div className="flex flex-col gap-3">
            <Title1
              text="에피소드 대본*"
              variant="title-subtitle-dot"
              subtitleText="에피소드 대본을 상세하게 작성해 주세요."
            />
            <textarea
              rows={8}
              maxLength={MAX_SCRIPT}
              value={rawScript}
              onChange={(e) => setRawScript(e.target.value)}
              placeholder="에피소드 대본을 상세하게 작성해 주세요."
              className="min-h-[160px] max-h-[400px] rounded-md border border-border-10 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end text-xs text-on-surface-30">
              {rawScript.length}/{MAX_SCRIPT}
            </div>
          </div>
        </div>

        {!stickyFooter && footer}
      </PageCard>
      {stickyFooter && footer}
      <input
        ref={thumbnailFileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label="대표 이미지 업로드"
        onChange={handleThumbnailFileChange}
      />
      <ImageCropPosterModal
        open={thumbnailModalOpen}
        onClose={() => {
          setThumbnailModalOpen(false);
          setThumbnailModalInitialSlots(null);
          setPendingThumbnailUrl((prev) => {
            if (prev && prev.startsWith("blob:")) {
              URL.revokeObjectURL(prev);
            }
            return null;
          });
        }}
        initialSlots={thumbnailModalInitialSlots ?? []}
        onSave={(slots) => {
          const saved = slots[0];
          if (saved?.imageUrl) {
            setThumbnailUrl((prev) => {
              if (prev && prev.startsWith("blob:") && prev !== saved.imageUrl) {
                URL.revokeObjectURL(prev);
              }
              return saved.imageUrl ?? "";
            });
          }
          setThumbnailModalOpen(false);
          setThumbnailModalInitialSlots(null);
          setPendingThumbnailUrl((prev) => {
            if (prev && prev.startsWith("blob:") && prev !== saved?.imageUrl) {
              URL.revokeObjectURL(prev);
            }
            return null;
          });
        }}
      />
    </div>
  );
}
