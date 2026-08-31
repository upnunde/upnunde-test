"use client";

import { PAGE_GUTTER_X_CLASS } from "@/lib/page-layout";
import { cn } from "design-system/utils";

/** 목업 전문 — 실제 방침은 운영 공지 링크로 대체한다. */
const POLICY_SECTIONS: { title: string; paragraphs: string[] }[] = [
  {
    title: "1. 수집하는 개인정보 항목",
    paragraphs: [
      "회원 가입, 작품 등록, 정산, 고객 문의 과정에서 아래 정보를 수집합니다.",
      "· 필수: 이메일, 작가명, 연동 로그인 계정 식별자\n· 정산: 예금주, 은행명, 계좌번호, 사업자등록번호, 세금계산서 수신 이메일\n· 자동 수집: 접속 기기 정보, 접속 로그, 서비스 이용 기록",
    ],
  },
  {
    title: "2. 개인정보의 이용 목적",
    paragraphs: [
      "수집한 정보는 회원 식별과 서비스 제공, 작품 게시와 정산 처리, 고객 문의 응대, 서비스 개선을 위한 통계 분석에만 사용합니다. 목적이 달라지는 경우 사전에 동의를 받습니다.",
    ],
  },
  {
    title: "3. 보유 및 이용 기간",
    paragraphs: [
      "회원 탈퇴 시 지체 없이 파기합니다. 다만 관련 법령에 따라 보관이 필요한 정보는 아래 기간 동안 분리 보관합니다.",
      "· 계약·청약철회 기록: 5년\n· 대금 결제 및 재화 공급 기록: 5년\n· 소비자 불만 또는 분쟁 처리 기록: 3년\n· 접속 로그 기록: 3개월",
    ],
  },
  {
    title: "4. 개인정보의 제3자 제공",
    paragraphs: [
      "원칙적으로 제3자에게 제공하지 않습니다. 정산 대행, 본인 확인 등 서비스 제공에 필요한 경우에 한해 최소한의 범위로 제공하며, 제공 항목과 보관 기간은 사전에 안내합니다.",
    ],
  },
  {
    title: "5. 이용자의 권리와 행사 방법",
    paragraphs: [
      "언제든지 개인정보 열람, 정정, 삭제, 처리 정지, 동의 철회를 요청하실 수 있습니다. 설정 > 서비스 문의를 통해 접수하시면 영업일 기준 3일 이내에 처리 결과를 안내해 드립니다.",
    ],
  },
  {
    title: "6. 개인정보 보호책임자",
    paragraphs: [
      "· 책임자: 개인정보보호팀\n· 문의: privacy@renovel.co.kr",
    ],
  },
];

export function ProfilePrivacyPolicyView() {
  return (
    <div className={cn("flex w-full flex-col gap-6 py-6", PAGE_GUTTER_X_CLASS)}>
      <p className="text-body3_400 text-foreground-muted">
        RE:NOVEL 스튜디오는 작가님의 개인정보를 소중히 다루며, 관련 법령에 따라 아래와 같이 처리합니다.
        (시행일: 2025년 12월 1일)
      </p>
      {POLICY_SECTIONS.map(({ title, paragraphs }) => (
        <section key={title} className="flex flex-col gap-2">
          <h3 className="text-body1_700 text-foreground">{title}</h3>
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 12)}
              className="whitespace-pre-wrap text-body3_400 leading-6 text-foreground-muted"
            >
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
