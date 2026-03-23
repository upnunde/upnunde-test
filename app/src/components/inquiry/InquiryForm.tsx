"use client";

import React, { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Title1 } from "@/components/ui/title1";

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
  /** 폼 내부 스타일용 (간격 등). 기본: flex flex-col gap-10 */
  className?: string;
}

const defaultSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // eslint-disable-next-line no-alert
  alert("문의가 임시로 저장되었습니다. 실제 전송 기능은 추후 연동 예정입니다.");
};

export function InquiryForm({
  idPrefix = "",
  onSubmit = defaultSubmit,
  onSuccess,
  onCancel,
  className = "flex flex-col gap-10",
}: InquiryFormProps) {
  const prefix = idPrefix ? `${idPrefix}-` : "";
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
    <form onSubmit={handleSubmit} className={className}>
      {/* 문의 유형 */}
      <div className="flex flex-col gap-1">
        <Title1
          text="문의 유형*"
          showDot
          subtitle
          subtitleText="문의 내용을 가장 잘 설명하는 유형을 선택해 주세요."
        />
        <div className="relative mt-1 w-full">
          <select
            id={`${prefix}inquiry-category`}
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as InquiryCategory)
            }
            className="h-10 w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-3 text-sm text-on-surface-10 outline-none focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="account">계정 / 로그인</option>
            <option value="payment">결제 / 정산</option>
            <option value="bug">버그 / 오류 제보</option>
            <option value="etc">기타 문의</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700"
            aria-hidden
          />
        </div>
      </div>

      {/* 제목 */}
      <div className="flex flex-col gap-1">
        <Title1
          text="제목*"
          showDot
          subtitle
          subtitleText="제목을 입력해주세요."
        />
        <input
          id={`${prefix}inquiry-title`}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요."
          className="mt-1 h-12 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      {/* 상세내용 작성 */}
      <div className="flex flex-col gap-1">
        <Title1
          text="상세내용 작성*"
          showDot
          subtitle
          subtitleText="내용을 최대한 상세하게 작성해 주세요."
        />
        <textarea
          id={`${prefix}inquiry-content`}
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="상세내용을 작성해 주세요."
          className="mt-1 min-h-[160px] max-h-[400px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <p className="text-xs text-on-surface-30">
          개인정보(주민등록번호, 카드번호 등) 입력은 지양해 주세요. 필요한 경우 최소한의 정보만
          적어 주셔도 충분합니다.
        </p>
      </div>

      {/* 이메일 */}
      <div className="flex flex-col gap-1">
        <Title1
          text="이메일"
          showDot={false}
          subtitle
          subtitleText="답변이 필요하신 경우 이메일 주소를 남겨주세요."
        />
        <input
          id={`${prefix}inquiry-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 주소를 입력해주세요."
          className="mt-1 h-12 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* 이미지 파일 첨부 */}
      <div className="flex flex-col gap-1 pb-2">
        <Title1
          text="이미지 파일 첨부"
          showDot={false}
          subtitle
          subtitleText="최대 5개의 파일 업로드 가능. 지원되는 파일 유형: jpg, png, gif, webp, heic, tiff"
        />
        <div className="mt-2">
          <label
            htmlFor={`${prefix}inquiry-attachments`}
            className="flex w-[120px] h-[120px] cursor-pointer items-center justify-center rounded-lg border border-dashed border-border-20 bg-white text-muted-foreground transition-colors hover:border-border-10 hover:bg-white"
          >
            <Plus className="w-5 h-5" aria-hidden />
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

      {/* 버튼 영역 */}
      <div className="mt-4 flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="px-5"
          onClick={handleCancel}
        >
          취소
        </Button>
        <Button type="submit" size="sm" className="px-5" disabled={!title || !content}>
          제출
        </Button>
      </div>
    </form>
  );
}
