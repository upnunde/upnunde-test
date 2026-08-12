"use client";

import { space } from "@/lib/spacing";
import { APP_BROWSER_BG_CLASS } from "@/lib/mobile-viewport";
import { cn } from "design-system/utils";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "design-system/ui/button";
import { EmailInput } from "design-system/ui/email-input";
import { InputGroup } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { Snackbar } from "@/components/episode/Snackbar";
import { Title2 } from "@/components/ui/title2";
import { ICONS } from "@/lib/icons";
import { RenovelStudioLogo } from "@/components/brand/RenovelStudioLogo";

/** 구분선: 선-텍스트-선 (Flexbox) */
function Divider({ label = "또는" }: { label?: string }) {
  return (
    <div className="flex w-full items-center gap-4" role="separator" aria-label={label}>
      <div className="h-px flex-1 bg-border" />
      <span className="text-caption1_400 text-foreground-placeholder">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const goToSeries = useCallback(() => {
    // TODO: 이메일 로그인 연동
    router.push("/series");
  }, [router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    goToSeries();
  };

  return (
    <div className={cn("relative flex min-h-dvh min-w-0 flex-col items-center justify-center px-6 py-8", APP_BROWSER_BG_CLASS)}>
      {/* 중앙 콘텐츠: 열 방향 Flexbox */}
      <main className="flex w-full max-w-[400px] flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center gap-3 pb-4">
          <RenovelStudioLogo
            width={342}
            height={36}
            className="h-9 w-[342px] max-lg:h-[25px] max-lg:w-[238px]"
          />
          <h1 className="text-center text-heading1_700 text-foreground">
            로그인
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-stretch gap-3"
          noValidate
        >
          <InputGroup>
            <label htmlFor="login-email" className="sr-only">
              이메일 주소
            </label>
            <EmailInput
              id="login-email"
              name="email"
              size="2xl"
              placeholder="이메일 주소"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </InputGroup>
          <Button
            type="submit"
            variant="default"
            size="xl"
            shape="circle"
            className="w-full"
          >
            계속하기
          </Button>
        </form>

        <Divider />

        <div className="flex w-full flex-col items-stretch gap-3">
          {/* Google + 툴팁 (최근 로그인 계정) */}
          <div className="relative">
            <Button
              variant="outline"
              size="xl"
              shape="circle"
              className="w-full"
              aria-label="Google로 계속하기"
            >
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-foreground px-2 py-1 text-caption1_500 text-background before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-foreground">
                최근 로그인 계정
              </span>
              <ICONS.googleBrand />
              Google로 계속하기
            </Button>
          </div>

          <Button
            variant="outline"
            size="xl"
            shape="circle"
            className="w-full"
            aria-label="Apple로 계속하기"
          >
            <ICONS.appleBrand className="text-foreground" />
            Apple로 계속하기
          </Button>

          <Button
            variant="outline"
            size="xl"
            shape="circle"
            className="w-full"
            aria-label="X로 계속하기"
          >
            <ICONS.xBrand />
            X로 계속하기
          </Button>

          <Button
            variant="outline"
            size="xl"
            shape="circle"
            className="w-full"
            aria-label="LINE으로 계속하기"
          >
            <ICONS.lineBrand />
            LINE으로 계속하기
          </Button>
        </div>

        <p className="text-center text-body3_400 text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline"
          >
            가입하기
          </Link>
        </p>
      </main>

      {/* 우측 하단 고정: 문의하기 → 클릭 시 현재 화면 유지, 480px 문의 팝업 */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="absolute bottom-8 right-8"
        onClick={() => setInquiryOpen(true)}
      >
        문의하기
      </Button>

      <Dialog open={inquiryOpen} onOpenChange={setInquiryOpen}>
        <DialogContent
          className="flex max-lg:h-[min(92dvh,900px)] max-lg:max-w-none min-h-0 w-full min-w-0 flex-col gap-0 overflow-hidden max-lg:rounded-t-xl lg:rounded-sm border border-border bg-background px-0 pt-2 pb-0 shadow-none lg:min-w-[480px] lg:max-w-[640px] lg:max-h-[min(90vh,calc(100dvh-160px))]"
          aria-describedby={undefined}
        >
          <DialogHeader className="shrink-0 flex flex-col justify-center items-start gap-0 border-none p-0 px-5 pt-2 pb-2">
            <Title2 text="문의" showDot={false} showGuide={false} subtitle={false} />
          </DialogHeader>
          <InquiryForm
            idPrefix="modal"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: 실제 문의 접수 API 연동
              setInquiryOpen(false);
              setSnackbar({ open: true, message: "문의내용을 전달하였습니다" });
            }}
            onCancel={() => setInquiryOpen(false)}
            className={cn("flex flex-col px-5 pt-5 pb-5", space.layout.sectionGap.className)}
            rootClassName="min-h-0 flex-1 flex-col"
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </div>
  );
}
