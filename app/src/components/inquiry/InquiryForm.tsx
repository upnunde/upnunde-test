"use client";

import React, { useId, useState } from "react";
import { ICONS } from "@/lib/icons";
import { Button } from "design-system/ui/button";
import { FormFieldLabel, formFieldAriaDescribedBy } from "@/components/ui/field-label";
import { FORM_LABEL_CONTROL_STACK_CLASS } from "@/lib/form-field-styles";
import { PAGE_FLUSH_CONTENT_PAD_X_CLASS } from "@/lib/page-layout";
import { Input, InputGroup, InputHypertext } from "@/components/ui/input";
import { Textarea } from "design-system/ui/textarea";
import { cn } from "design-system/utils";

export type InquiryCategory = "account" | "payment" | "bug" | "etc";

export interface InquiryFormProps {
  /** 접두사로 사용. 모달 등에서 id 중복 방지용 (예: "modal") */
  idPrefix?: string;
  /** 제출 성공 시 콜백 (모달에서는 닫기 등) */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  /** 제출 직후 호출 (스낵바 표시 등) */
  onSuccess?: () => void;
  /** 취소 클릭 시 콜백 (모달에서는 닫기) */
  onCancel?: () => void;
  /** 스크롤되는 `<form>` 필드 영역 클래스 */
  className?: string;
  /** 바깥 래퍼 (form + 푸터). 모달에서 `flex-1 min-h-0` 등으로 높이 제한 시 함께 사용 */
  rootClassName?: string;
}

const defaultSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
   
  alert("문의가 임시로 저장되었습니다. 실제 전송 기능은 추후 연동 예정입니다.");
};

export function InquiryForm({
  idPrefix = "",
  onSubmit = defaultSubmit,
  onSuccess,
  onCancel,
  className = cn(
    "mt-4 flex flex-col gap-10",
    PAGE_FLUSH_CONTENT_PAD_X_CLASS,
  ),
  rootClassName,
}: InquiryFormProps) {
  const prefix = idPrefix ? `${idPrefix}-` : "";
  const formDomId = `${prefix}inquiry-form-${useId().replace(/:/g, "")}`;
  const [category, setCategory] = useState<InquiryCategory>("account");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
    onSuccess?.();
  };

  const handleCancel = () => {
    setCategory("account");
    setTitle("");
    setContent("");
    setEmail("");
    onCancel?.();
  };

  return (
    <div
      className={cn(
        "flex flex-col max-lg:overflow-visible lg:min-h-0 lg:flex-1 lg:overflow-hidden",
        rootClassName,
      )}
    >
      <form
        id={formDomId}
        onSubmit={handleSubmit}
        className={cn("max-lg:overflow-visible lg:min-h-0 lg:flex-1 lg:overflow-y-auto", className)}
      >
      {/* 문의 유형 */}
      <div className={FORM_LABEL_CONTROL_STACK_CLASS}>
        <FormFieldLabel
          title="문의 유형*"
          subtitle="문의 내용을 가장 잘 설명하는 유형을 선택해 주세요."
          inputId={`${prefix}inquiry-category`}
        />
        <div className="relative w-full">
          <select
            id={`${prefix}inquiry-category`}
            aria-describedby={formFieldAriaDescribedBy(`${prefix}inquiry-category`)}
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as InquiryCategory)
            }
            className="h-9 w-full appearance-none rounded-md border border-border bg-background pl-3 pr-3 text-body3_400 text-foreground outline-none focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="account">계정 / 로그인</option>
            <option value="payment">결제 / 정산</option>
            <option value="bug">버그 / 오류 제보</option>
            <option value="etc">기타 문의</option>
          </select>
          <ICONS.chevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted"
            aria-hidden
          />
        </div>
      </div>

      {/* 제목 */}
      <div className={FORM_LABEL_CONTROL_STACK_CLASS}>
        <FormFieldLabel
          title="제목*"
          subtitle="제목을 입력해주세요."
          inputId={`${prefix}inquiry-title`}
        />
        <InputGroup>
          <Input
            id={`${prefix}inquiry-title`}
            aria-describedby={formFieldAriaDescribedBy(`${prefix}inquiry-title`)}
            type="text"
            size="xl"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요."
            required
          />
        </InputGroup>
      </div>

      {/* 상세내용 작성 */}
      <div className={FORM_LABEL_CONTROL_STACK_CLASS}>
        <FormFieldLabel
          title="상세내용 작성*"
          subtitle="내용을 최대한 상세하게 작성해 주세요."
          inputId={`${prefix}inquiry-content`}
        />
        <InputGroup>
          <Textarea
            id={`${prefix}inquiry-content`}
            aria-describedby={formFieldAriaDescribedBy(`${prefix}inquiry-content`, true)}
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="상세내용을 작성해 주세요."
            className="min-h-[160px] max-h-[400px]"
            required
          />
          <InputHypertext id={formFieldAriaDescribedBy(`${prefix}inquiry-content`, true)}>
            개인정보(주민등록번호, 카드번호 등) 입력은 지양해 주세요. 필요한 경우 최소한의 정보만
            적어 주셔도 충분합니다.
          </InputHypertext>
        </InputGroup>
      </div>

      {/* 이메일 */}
      <div className={FORM_LABEL_CONTROL_STACK_CLASS}>
        <FormFieldLabel
          title="이메일"
          subtitle="답변이 필요하신 경우 이메일 주소를 남겨주세요."
          inputId={`${prefix}inquiry-email`}
        />
        <InputGroup>
          <Input
            id={`${prefix}inquiry-email`}
            aria-describedby={formFieldAriaDescribedBy(`${prefix}inquiry-email`)}
            type="email"
            size="xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 주소를 입력해주세요."
          />
        </InputGroup>
      </div>

      {/* 이미지 파일 첨부 */}
      <div className={cn(FORM_LABEL_CONTROL_STACK_CLASS, "pb-2")}>
        <FormFieldLabel
          title="이미지 파일 첨부"
          subtitle="최대 5개의 파일 업로드 가능. 지원되는 파일 유형: jpg, png, gif, webp, heic, tiff"
          inputId={`${prefix}inquiry-attachments`}
        />
        <div>
          <label
            htmlFor={`${prefix}inquiry-attachments`}
            className="flex w-[120px] h-[120px] cursor-pointer items-center justify-center rounded-lg border border-dashed border-border bg-background text-muted-foreground transition-colors hover:border-border hover:bg-background"
          >
            <ICONS.plus className="w-5 h-5" aria-hidden />
          </label>
          <input
            id={`${prefix}inquiry-attachments`}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.gif,.webp,.heic,.tiff"
            className="hidden"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="px-5"
          onClick={handleCancel}
        >
          취소
        </Button>
        <Button
          type="submit"
          size="sm"
          className="px-5"
          disabled={!title || !content}
        >
          제출
        </Button>
      </div>
      </form>
    </div>
  );
}
