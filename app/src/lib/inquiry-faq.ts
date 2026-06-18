import type { InquiryCategory } from "@/types/inquiry";
import { INQUIRY_CATEGORY_LABEL } from "@/types/inquiry";

export interface InquiryFaqItem {
  id: string;
  category: InquiryCategory;
  question: string;
  answer: string;
}

/** 자주 받는 질문 — 문의 유형과 동일 category 체계 */
export const INQUIRY_FAQ_ITEMS: InquiryFaqItem[] = [
  // 계정 / 로그인
  {
    id: "faq-account-login",
    category: "account",
    question: "로그인이 되지 않거나 비밀번호 재설정 메일이 오지 않아요.",
    answer:
      "입력하신 이메일이 가입 계정과 일치하는지 확인해 주세요. 메일이 10분 이상 도착하지 않으면 스팸함을 확인한 뒤 재발송을 시도해 주세요. 소셜 로그인을 사용 중이라면 동일한 제공자로 다시 시도해 주세요. 계속 문제가 있으면 문의 탭에서 계정 이메일과 증상을 알려 주시면 확인해 드립니다.",
  },
  {
    id: "faq-account-social",
    category: "account",
    question: "소셜 로그인(구글·애플 등)으로 가입했는데 비밀번호를 설정할 수 있나요?",
    answer:
      "소셜 로그인으로 가입한 계정은 해당 제공자 인증으로 로그인합니다. 이메일·비밀번호 로그인을 추가로 쓰려면 프로필 설정에서 연동 상태를 확인해 주세요. 제공자마다 지원 방식이 다를 수 있어, 화면에 안내된 방법을 따라 주시면 됩니다.",
  },
  {
    id: "faq-account-profile",
    category: "account",
    question: "프로필 이미지·닉네임·소개글은 어디서 수정하나요?",
    answer:
      "우측 상단 프로필 메뉴에서 프로필 편집으로 들어갈 수 있습니다. 닉네임과 소개는 독자에게 노출되는 정보이므로, 운영 정책에 맞는 표현으로 작성해 주세요. 변경 내용은 저장 후 일부 화면에 바로 반영됩니다.",
  },
  {
    id: "faq-account-email",
    category: "account",
    question: "계정 이메일을 변경하거나 탈퇴하고 싶어요.",
    answer:
      "프로필 설정에서 이메일 변경을 요청할 수 있습니다. 탈퇴는 공개 중인 시리즈·정산 진행·미수령 수익 여부에 따라 처리 기간이 달라질 수 있어요. 탈퇴 전 내 작품과 정산 메뉴에서 공개 상태와 예정 금액을 꼭 확인해 주세요.",
  },
  {
    id: "faq-account-notification",
    category: "account",
    question: "알림이 오지 않거나 너무 많이 와요.",
    answer:
      "알림 메뉴에서 최근 알림 목록을 확인할 수 있습니다. 푸시·이메일 수신 설정은 프로필 또는 기기 설정과 연동될 수 있어요. 특정 유형의 알림만 끄고 싶다면 문의 탭에서 원하는 알림 종류를 알려 주시면 안내해 드립니다.",
  },

  // 결제 / 정산
  {
    id: "faq-payment-settlement",
    category: "payment",
    question: "정산은 언제, 어떤 기준으로 이루어지나요?",
    answer:
      "정산은 월 단위로 집계되며, 수익 발생월 기준 익월 중순경 입금 일정을 안내드립니다. 정산 내역과 세금 계산은 수익·정산 메뉴에서 확인할 수 있어요. 입금 지연이 의심되면 정산 월과 예상 입금액을 함께 문의해 주세요.",
  },
  {
    id: "faq-payment-tax",
    category: "payment",
    question: "원천징수·세금계산서는 어떻게 확인하나요?",
    answer:
      "정산 상세 화면에서 해당 월의 원천징수 내역과 증빙 준비 상태를 확인할 수 있습니다. 사업자·개인에 따라 필요 서류가 다를 수 있으니, 정산 페이지의 세금 계산 안내를 참고해 주세요.",
  },
  {
    id: "faq-payment-monetization",
    category: "payment",
    question: "수익 창출(유료화)은 어떻게 시작하나요?",
    answer:
      "수익·정산 메뉴에서 유료화 신청 및 정산 계좌 등록 절차를 확인할 수 있습니다. 시리즈·에피소드 공개 전후 모두 정책에 맞는지 검토가 필요할 수 있어요. 신청 후 승인 상태는 같은 메뉴에서 확인해 주세요.",
  },
  {
    id: "faq-payment-revenue",
    category: "payment",
    question: "수익 금액은 어디서 확인하고, 어떤 항목이 포함되나요?",
    answer:
      "수익·정산 메뉴의 대시보드와 기간별 상세에서 조회할 수 있습니다. 에피소드 판매·후원 등 항목별 집계 방식은 화면 안내를 참고해 주세요. 특정 일자 금액이 맞지 않는다면 해당 기간·시리즈명을 함께 문의해 주시면 확인해 드립니다.",
  },
  {
    id: "faq-payment-account-info",
    category: "payment",
    question: "정산 계좌 정보를 잘못 입력했어요. 수정할 수 있나요?",
    answer:
      "정산 계좌는 수익·정산 설정에서 변경할 수 있습니다. 이미 지급 요청·처리 중인 건은 수정이 제한될 수 있어요. 긴급한 경우 문의 탭에서 예금주명·계좌번호 오입력 여부를 알려 주시면 처리 가능 여부를 안내해 드립니다.",
  },

  // 작품 · 시리즈 · 에피소드
  {
    id: "faq-series-create",
    category: "etc",
    question: "시리즈는 어떻게 만들고, 대표 이미지·로고는 필수인가요?",
    answer:
      "시리즈 목록에서 ‘시리즈 만들기’로 들어가 제목·요약·키워드·세계관 등 기본 정보를 입력합니다. 대표 이미지와 로고는 독자에게 노출되는 공식 자료이므로 등록을 권장하며, 가이드에 맞는 비율·투명 PNG 로고 사용을 권장합니다. 하단 AI 입력 바로 초안을 빠르게 채울 수도 있어요.",
  },
  {
    id: "faq-series-resource",
    category: "etc",
    question: "캐릭터·배경·연출 장면 리소스는 어디서 등록하나요?",
    answer:
      "시리즈 상세 > 리소스 관리에서 등장인물, 배경, 연출 장면, 미디어, 갤러리 등을 등록할 수 있습니다. 에디터에서 장면을 구성할 때 이 리소스를 불러와 사용합니다. 캐릭터는 캐릭터 이미지·표정까지 등록해 두면 연출에 유리합니다.",
  },
  {
    id: "faq-episode-create",
    category: "etc",
    question: "에피소드는 어떻게 추가하고 공개·예약 발행하나요?",
    answer:
      "에피소드 관리에서 ‘새 에피소드’로 제목·요약·대표 이미지를 입력한 뒤 에디터에서 원고를 작성합니다. 작성 후 목록에서 즉시 공개 또는 예약 공개를 설정할 수 있어요. 공개 전 미리보기로 독자 화면을 확인해 보세요.",
  },
  {
    id: "faq-episode-ai",
    category: "etc",
    question: "하단 AI 입력 바는 무엇이며, 어떤 필드가 채워지나요?",
    answer:
      "시리즈·캐릭터·리소스 등록 화면 하단의 AI 입력 바에 작품 컨셉을 서술형으로 입력하면, 제목·요약·설명 등 텍스트 필드 초안을 자동으로 채워 줍니다. 이미지·썸네일은 직접 등록해야 하며, AI 설정이 없는 환경에서는 임시 규칙으로 채워질 수 있습니다.",
  },
  {
    id: "faq-editor-save",
    category: "etc",
    question: "에디터에서 작성한 내용은 자동 저장되나요?",
    answer:
      "에디터는 작업 중 내용을 자동 저장합니다. 네트워크가 불안정하면 저장 시점이 지연될 수 있으니, 중요한 마일스톤 후에는 잠시 기다린 뒤 페이지를 이동해 주세요. 저장 오류 메시지가 보이면 새로고침 전에 문의 탭으로 알려 주시면 안전합니다.",
  },
  {
    id: "faq-editor-preview",
    category: "etc",
    question: "독자에게 보이는 화면은 어디서 미리볼 수 있나요?",
    answer:
      "시리즈 등록·관리 화면의 미리보기 패널과 에피소드 에디터의 프리뷰 기능을 통해 대표 이미지·레이아웃 등을 확인할 수 있습니다. 실제 독자 앱과 완전히 동일하지 않을 수 있으니, 공개 전 한 번 더 훑어 보시는 것을 권장합니다.",
  },
  {
    id: "faq-content-policy",
    category: "etc",
    question: "어떤 콘텐츠는 등록이 제한되나요?",
    answer:
      "타인의 권리를 침해하거나, 과도한 폭력·혐오·불법 행위를 조장하는 등 운영 정책에 어긋나는 내용은 제한될 수 있습니다. 대표 이미지·썸네일도 동일 기준이 적용됩니다. 구체적 사례는 가이드·약관을 참고하시고, 판단이 어려우면 문의해 주세요.",
  },
  {
    id: "faq-character-import",
    category: "etc",
    question: "다른 시리즈·내 작품에 있는 캐릭터를 가져올 수 있나요?",
    answer:
      "등장인물 등록 화면의 ‘캐릭터 가져오기’에서 내 작품에 등록된 캐릭터를 선택해 정보를 불러올 수 있습니다. 이미지·표정 등 일부 항목은 시리즈별로 다시 확인·수정이 필요할 수 있어요.",
  },

  // 버그 / 오류
  {
    id: "faq-bug-browser",
    category: "bug",
    question: "권장 브라우저와 기기 환경이 있나요?",
    answer:
      "최신 Chrome·Safari·Edge 데스크톱 환경을 권장합니다. 모바일에서는 최신 OS와 브라우저를 사용해 주세요. Internet Explorer 등 구형 브라우저는 일부 기능이 동작하지 않을 수 있습니다.",
  },
  {
    id: "faq-bug-editor-resource",
    category: "bug",
    question: "에디터에서 이미지·캐릭터 리소스가 보이지 않아요.",
    answer:
      "해당 시리즈의 리소스 관리에서 캐릭터·배경·연출 장면이 등록되어 있는지 확인해 주세요. 브라우저 새로고침·캐시 삭제 후에도 동일하면 사용 기기·브라우저·재현 순서를 문의해 주시면 빠르게 확인해 드립니다.",
  },
  {
    id: "faq-bug-upload",
    category: "bug",
    question: "이미지 업로드·파일 선택 창이 열리지 않아요.",
    answer:
      "브라우저에서 파일 접근 권한이 차단되었거나, IDE 내 미리보기 창에서는 OS 파일 선택이 지원되지 않을 수 있습니다. Chrome·Safari 등 일반 브라우저에서 http://renovel.localhost:3000 으로 접속해 다시 시도해 주세요. 모바일에서는 갤러리 접근 권한도 확인해 주세요.",
  },
  {
    id: "faq-bug-report",
    category: "bug",
    question: "오류·버그를 신고하려면 어떤 정보를 함께 보내면 좋나요?",
    answer:
      "문의 유형에서 ‘버그 / 오류 제보’를 선택하고, 발생 화면 URL·재현 순서·스크린샷(가능한 경우)을 함께 적어 주세요. PC/모바일 여부와 브라우저 종류도 알려 주시면 원인 파악에 도움이 됩니다.",
  },
  {
    id: "faq-bug-performance",
    category: "bug",
    question: "화면이 느리거나 자주 멈춰요.",
    answer:
      "에디터·리소스가 많은 시리즈에서는 기기 사양과 브라우저 탭 수에 따라 속도가 달라질 수 있습니다. 다른 탭을 줄이고 브라우저를 최신 버전으로 유지해 주세요. 특정 화면에서만 반복된다면 해당 URL과 증상을 문의해 주세요.",
  },
];

export function getInquiryFaqCategoryLabel(category: InquiryCategory): string {
  return INQUIRY_CATEGORY_LABEL[category];
}

/** 질문·답변·카테고리 라벨 기준 FAQ 검색 */
export function filterInquiryFaqItems(query: string): InquiryFaqItem[] {
  const normalized = query.trim();
  if (!normalized) return INQUIRY_FAQ_ITEMS;

  const lowered = normalized.toLowerCase();
  return INQUIRY_FAQ_ITEMS.filter((item) => {
    const categoryLabel = getInquiryFaqCategoryLabel(item.category);
    const haystack = `${categoryLabel} ${item.question} ${item.answer}`;
    return haystack.includes(normalized) || haystack.toLowerCase().includes(lowered);
  });
}
