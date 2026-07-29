"use client";

import { space } from "design-system/spacing-tokens";
import { cn } from "design-system/utils";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "design-system/ui/button";
import { MODAL_ACTION_BUTTON_SIZE } from "@/components/ui/modal";
import { FormFieldLabel, formFieldAriaDescribedBy } from "@/components/ui/field-label";
import { Title2 } from "@/components/ui/title2";
import { THUMBNAIL_DIM_OVERLAY_CLASS } from "@/lib/thumbnail-styles";
import { Input, InputGroup, InputHypertext } from "@/components/ui/input";
import { Textarea } from "design-system/ui/textarea";
import { DUMMY_DEFAULT_THUMBNAIL } from "@/lib/dummy-thumbnail-images";

interface EpisodePromptReferenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_TITLE = 50;
const MAX_SUMMARY = 100;
const MAX_HISTORY = 5000;
const MAX_SCRIPT = 5000;

const REF_TITLE_ID = "episode-prompt-ref-title";
const REF_SUMMARY_ID = "episode-prompt-ref-summary";
const REF_HISTORY_ID = "episode-prompt-ref-history";
const REF_SCRIPT_ID = "episode-prompt-ref-script";

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

const REFERENCE_THUMBNAIL = DUMMY_DEFAULT_THUMBNAIL;

export function EpisodePromptReferenceModal({
  open,
  onOpenChange,
}: EpisodePromptReferenceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-lg:max-w-none max-lg:rounded-t-xl lg:max-w-[760px] min-w-0 border-0 bg-transparent p-0 shadow-none">
        <DialogHeader className="sr-only">
          <DialogTitle>에피소드 기준 프롬프트</DialogTitle>
        </DialogHeader>
        <div className="mx-auto w-full rounded-sm border border-border bg-background shadow-none flex min-h-0 h-full flex-col overflow-hidden max-w-[760px] min-w-0">
          <Title2 text="에피소드" asSectionHeader />
          <div className="mx-0 max-w-none min-w-0 border-0 rounded-none px-5 pt-5 pb-5 shadow-none min-h-0 flex-1 overflow-y-auto">
            <div className={cn("mt-0 flex flex-col", space.overlay.modalBodyStackGap.className)}>
              <div className="flex flex-col gap-3">
                <FormFieldLabel
                  title="에피소드 제목*"
                  subtitle="에피소드 제목을 입력해주세요."
                  inputId={REF_TITLE_ID}
                />
                <InputGroup>
                  <Input
                    id={REF_TITLE_ID}
                    aria-describedby={formFieldAriaDescribedBy(REF_TITLE_ID)}
                    type="text"
                    size="lg"
                    maxLength={MAX_TITLE}
                    value={REFERENCE_TITLE}
                    readOnly
                    tabIndex={-1}
                    className="pointer-events-none bg-muted"
                  />
                  <InputHypertext count={REFERENCE_TITLE.length} max={MAX_TITLE} />
                </InputGroup>
              </div>

              <div className="flex flex-col gap-3">
                <FormFieldLabel
                  title="에피소드 요약*"
                  subtitle="에피소드를 한 줄로 소개해주세요."
                  inputId={REF_SUMMARY_ID}
                />
                <InputGroup>
                  <Input
                    id={REF_SUMMARY_ID}
                    aria-describedby={formFieldAriaDescribedBy(REF_SUMMARY_ID)}
                    type="text"
                    size="lg"
                    maxLength={MAX_SUMMARY}
                    value={REFERENCE_SUMMARY}
                    readOnly
                    tabIndex={-1}
                    className="pointer-events-none bg-muted"
                  />
                  <InputHypertext count={REFERENCE_SUMMARY.length} max={MAX_SUMMARY} />
                </InputGroup>
              </div>

              <div className="flex flex-col gap-3 pb-5">
                <FormFieldLabel
                  title="대표 이미지*"
                  subtitle="에피소드 대표 이미지를 등록해주세요."
                />
                <div className="relative h-[107px] w-[60px] overflow-hidden rounded border border-border bg-secondary">
                  <Image
                    src={REFERENCE_THUMBNAIL}
                    alt="대표 이미지"
                    fill
                    sizes="60px"
                    className="object-cover"
                  />
                  <div className={THUMBNAIL_DIM_OVERLAY_CLASS} aria-hidden />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <FormFieldLabel
                  title="지난 사건 히스토리*"
                  subtitle="지난 사건의 히스토리를 작성해 주세요."
                  inputId={REF_HISTORY_ID}
                />
                <InputGroup>
                  <Textarea
                    id={REF_HISTORY_ID}
                    aria-describedby={formFieldAriaDescribedBy(REF_HISTORY_ID)}
                    rows={4}
                    maxLength={MAX_HISTORY}
                    value={REFERENCE_HISTORY}
                    readOnly
                    tabIndex={-1}
                    className="pointer-events-none min-h-[160px] max-h-[400px] bg-muted"
                  />
                  <InputHypertext count={REFERENCE_HISTORY.length} max={MAX_HISTORY} />
                </InputGroup>
              </div>

              <div className="flex flex-col gap-3">
                <FormFieldLabel
                  title="에피소드 대본*"
                  subtitle="에피소드 대본을 상세하게 작성해 주세요."
                  inputId={REF_SCRIPT_ID}
                />
                <InputGroup>
                  <Textarea
                    id={REF_SCRIPT_ID}
                    aria-describedby={formFieldAriaDescribedBy(REF_SCRIPT_ID)}
                    rows={8}
                    maxLength={MAX_SCRIPT}
                    value={REFERENCE_SCRIPT}
                    readOnly
                    tabIndex={-1}
                    className="pointer-events-none min-h-[160px] max-h-[400px] bg-muted"
                  />
                  <InputHypertext count={REFERENCE_SCRIPT.length} max={MAX_SCRIPT} />
                </InputGroup>
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 border-t border-border bg-background px-5 py-4">
            <div className="flex justify-end">
              <Button type="button" variant="outline" size={MODAL_ACTION_BUTTON_SIZE} onClick={() => onOpenChange(false)}>
                닫기
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
