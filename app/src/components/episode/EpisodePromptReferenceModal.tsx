"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Title1 } from "@/components/ui/title1";
import { Title2 } from "@/components/ui/title2";

interface EpisodePromptReferenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_TITLE = 50;
const MAX_SUMMARY = 100;
const MAX_HISTORY = 5000;
const MAX_SCRIPT = 5000;

const REFERENCE_TITLE = "새벽의 문턱에서";
const REFERENCE_SUMMARY = "봉인된 문이 열리며 주인공이 첫 선택의 대가를 마주합니다.";
const REFERENCE_HISTORY =
  "지난 화에서 주인공은 금서 보관실에서 오래된 열쇠를 발견했습니다. " +
  "열쇠에는 정체불명의 문양이 새겨져 있었고, 그 문양은 마을 외곽 폐성당의 지하 문과 일치했습니다. " +
  "동료들은 위험을 경고했지만 주인공은 진실을 확인하기 위해 새벽에 홀로 성당으로 향합니다.";
const REFERENCE_SCRIPT = `[scene] 폐성당 지하 입구
[top_desc] 차가운 안개가 계단을 타고 올라온다.
[text speaker="나레이션"] 새벽 다섯 시, 성당의 종은 울리지 않았다.
[text speaker="나 (페르소나 닉네임)"] 이 문이 정말 모든 시작점이라면, 지금 열어야 해.
[direction] 주인공이 열쇠를 문에 꽂고 천천히 돌린다.
[event] 낡은 문이 열리며 푸른 빛이 새어 나온다.
[text speaker="나레이션"] 문틈 너머로 오래전 사라진 이름이 속삭인다.
[event_end]`;
const REFERENCE_THUMBNAIL = "/background-1.png";

export function EpisodePromptReferenceModal({
  open,
  onOpenChange,
}: EpisodePromptReferenceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[760px] min-w-[560px] border-0 bg-transparent p-0 shadow-none">
        <DialogHeader className="sr-only">
          <DialogTitle>에피소드 기준 프롬프트</DialogTitle>
        </DialogHeader>
        <div className="mx-auto w-full rounded-xl border border-slate-200 bg-white shadow-none flex min-h-0 h-full flex-col overflow-hidden max-w-[760px] min-w-[560px]">
          <Title2 text="에피소드" asSectionHeader />
          <div className="mx-0 max-w-none min-w-0 border-0 rounded-none px-5 pt-5 pb-5 shadow-none min-h-0 flex-1 overflow-y-auto">
            <div className="mt-0 flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Title1
                  text="에피소드 제목*"
                  variant="title-subtitle-dot"
                  subtitleText="에피소드 제목을 입력해주세요."
                />
                <input
                  type="text"
                  maxLength={MAX_TITLE}
                  value={REFERENCE_TITLE}
                  readOnly
                  tabIndex={-1}
                  className="h-12 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-on-surface-10 pointer-events-none"
                />
                <div className="flex justify-end text-xs text-on-surface-30">
                  {REFERENCE_TITLE.length}/{MAX_TITLE}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Title1
                  text="에피소드 요약*"
                  variant="title-subtitle-dot"
                  subtitleText="에피소드를 한 줄로 소개해주세요."
                />
                <input
                  type="text"
                  maxLength={MAX_SUMMARY}
                  value={REFERENCE_SUMMARY}
                  readOnly
                  tabIndex={-1}
                  className="h-12 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-on-surface-10 pointer-events-none"
                />
                <div className="flex justify-end text-xs text-on-surface-30">
                  {REFERENCE_SUMMARY.length}/{MAX_SUMMARY}
                </div>
              </div>

              <div className="flex flex-col gap-3 pb-5">
                <Title1
                  text="대표 이미지*"
                  variant="title-subtitle-dot"
                  subtitleText="에피소드 대표 이미지를 등록해주세요."
                />
                <div className="relative h-[107px] w-[60px] overflow-hidden rounded border border-slate-200 bg-slate-200">
                  <Image
                    src={REFERENCE_THUMBNAIL}
                    alt="대표 이미지"
                    fill
                    sizes="60px"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Title1
                  text="지난 사건 히스토리*"
                  variant="title-subtitle-dot"
                  subtitleText="지난 사건의 히스토리를 작성해 주세요."
                />
                <textarea
                  rows={4}
                  maxLength={MAX_HISTORY}
                  value={REFERENCE_HISTORY}
                  readOnly
                  tabIndex={-1}
                  className="min-h-[160px] max-h-[400px] rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-on-surface-10 pointer-events-none"
                />
                <div className="flex justify-end text-xs text-on-surface-30">
                  {REFERENCE_HISTORY.length}/{MAX_HISTORY}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Title1
                  text="에피소드 대본*"
                  variant="title-subtitle-dot"
                  subtitleText="에피소드 대본을 상세하게 작성해 주세요."
                />
                <textarea
                  rows={8}
                  maxLength={MAX_SCRIPT}
                  value={REFERENCE_SCRIPT}
                  readOnly
                  tabIndex={-1}
                  className="min-h-[160px] max-h-[400px] rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-on-surface-10 pointer-events-none"
                />
                <div className="flex justify-end text-xs text-on-surface-30">
                  {REFERENCE_SCRIPT.length}/{MAX_SCRIPT}
                </div>
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-4">
            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                닫기
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
