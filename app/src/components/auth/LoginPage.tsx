"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { Snackbar } from "@/components/episode/Snackbar";
import { Title2 } from "@/components/ui/title2";
import { cn } from "@/lib/utils";

/* 소셜 로고 인라인 SVG (플랫폼 공식 비주얼) */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-5 shrink-0", className)} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-5 shrink-0", className)}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
    >
      <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-5 shrink-0", className)} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LineIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-6 shrink-0", className)}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#06C755" />
      <text
        x="12"
        y="14"
        textAnchor="middle"
        fontSize="7"
        fontWeight="700"
        fill="white"
      >
        LINE
      </text>
    </svg>
  );
}

/** 구분선: 선-텍스트-선 (Flexbox) */
function Divider({ label = "또는" }: { label?: string }) {
  return (
    <div className="flex w-full items-center gap-4" role="separator" aria-label={label}>
      <div className="h-px flex-1 bg-border-20" />
      <span className="text-xs text-on-surface-30">{label}</span>
      <div className="h-px flex-1 bg-border-20" />
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
    <div className="relative flex min-h-screen min-w-0 flex-col items-center justify-center bg-background-10 px-4 py-8">
      {/* 중앙 콘텐츠: 열 방향 Flexbox */}
      <main className="flex w-full max-w-[400px] flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center gap-3 pb-4">
          <Image
            src="/renovel-studio-logo.png"
            alt="RE:NOVEL Studio"
            width={187}
            height={40}
            priority
            className="h-10 w-auto"
          />
          <h1 className="text-center text-[32px] font-bold text-foreground">
            로그인
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-stretch gap-3"
          noValidate
        >
          <label htmlFor="login-email" className="sr-only">
            이메일 주소
          </label>
          <Input
            id="login-email"
            type="email"
            placeholder="이메일 주소"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 rounded-[12px] focus-visible:border-2 focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[3px]"
            autoComplete="email"
          />
          <Button
            type="button"
            variant="default"
            size="lg"
            className="w-full h-12 rounded-full bg-black text-white hover:bg-black/90"
            onClick={goToSeries}
          >
            계속하기
          </Button>
        </form>

        <Divider />

        <div className="flex w-full flex-col items-stretch gap-3">
          {/* Google + 툴팁 (최근 로그인 계정) */}
          <div className="relative">
            <button
              type="button"
              className="relative flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-surface-10 px-4 h-12 text-sm font-medium text-on-surface-10 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Google로 계속하기"
            >
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-on-surface-10 px-2 py-1 text-xs font-medium text-surface-10 before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-on-surface-10">
                최근 로그인 계정
              </span>
              <GoogleIcon />
              Google로 계속하기
            </button>
          </div>

          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-surface-10 px-4 h-12 text-sm font-medium text-on-surface-10 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Apple로 계속하기"
          >
            <AppleIcon className="text-on-surface-10" />
            Apple로 계속하기
          </button>

          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-surface-10 px-4 h-12 text-sm font-medium text-on-surface-10 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="X로 계속하기"
          >
            <XIcon />
            X로 계속하기
          </button>

          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-surface-10 px-4 h-12 text-sm font-medium text-on-surface-10 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="LINE으로 계속하기"
          >
            <LineIcon />
            LINE으로 계속하기
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
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
      <button
        type="button"
        onClick={() => setInquiryOpen(true)}
        className="absolute bottom-8 right-8 cursor-pointer rounded-md border border-border bg-surface-10 px-4 py-2 text-sm font-medium text-on-surface-10 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        문의하기
      </button>

      <Dialog open={inquiryOpen} onOpenChange={setInquiryOpen}>
        <DialogContent
          className="flex max-h-[min(90vh,calc(100vh-160px))] min-h-0 w-full min-w-[480px] max-w-[640px] flex-col gap-0 overflow-hidden rounded-[4px] border border-slate-200 bg-white px-0 pt-2 pb-0 shadow-none"
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
            className="flex flex-col gap-10 px-5 pt-5 pb-5"
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
