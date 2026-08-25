export type FinancialInstitutionCategory = "bank" | "securities";

export type FinancialInstitution = {
  id: string;
  name: string;
  category: FinancialInstitutionCategory;
  /** `public/bank-logos/{id}.{logoExt}` — korea_bank_icons(MIT) 기반 */
  logoExt?: "svg" | "png";
  /** 로고 로드 실패 시 폴백 */
  brandColor: string;
  logoLabel?: string;
  logoTextColor?: string;
};

/** 금융결제원 코드 기반 아이콘 — flxh4894/korea_bank_icons (MIT) */
export const KOREAN_FINANCIAL_INSTITUTIONS: FinancialInstitution[] = [
  { id: "kbank", name: "케이뱅크", category: "bank", brandColor: "#120064" },
  { id: "shinhan", name: "신한", category: "bank", brandColor: "#0046FF" },
  { id: "kakao", name: "카카오뱅크", category: "bank", brandColor: "#FEE500" },
  { id: "woori", name: "우리", category: "bank", brandColor: "#007BC8" },
  { id: "ibk", name: "기업", category: "bank", brandColor: "#0057A8" },
  { id: "hana", name: "하나", category: "bank", brandColor: "#009178" },
  { id: "kb", name: "KB국민", category: "bank", brandColor: "#FFBC00" },
  { id: "nh", name: "농협", category: "bank", brandColor: "#F7941D" },
  { id: "toss", name: "토스뱅크", category: "bank", brandColor: "#001A42" },
  { id: "sc", name: "SC제일은행", category: "bank", brandColor: "#0072AA" },
  { id: "kdb", name: "KDB", category: "bank", brandColor: "#003087" },
  { id: "citi", name: "씨티은행", category: "bank", brandColor: "#003B70" },
  { id: "suhyup", name: "수협", category: "bank", brandColor: "#004098" },
  { id: "dgb", name: "대구은행", category: "bank", brandColor: "#0054A6" },
  { id: "busan", name: "부산은행", category: "bank", brandColor: "#D71920" },
  { id: "kyongnam", name: "경남은행", category: "bank", brandColor: "#D71920" },
  { id: "mirae", name: "미래에셋", category: "securities", brandColor: "#F58220" },
  { id: "kbsec", name: "KB증권", category: "securities", brandColor: "#FFBC00" },
  { id: "samsung", name: "삼성증권", category: "securities", brandColor: "#003087" },
  { id: "nhsec", name: "NH투자", category: "securities", brandColor: "#F7941D" },
  { id: "koreainvest", name: "한국투자", category: "securities", brandColor: "#7A003C" },
  { id: "kiwoom", name: "키움", category: "securities", brandColor: "#E60012" },
  { id: "shinhansec", name: "신한투자", category: "securities", brandColor: "#0046FF" },
  { id: "hanasec", name: "하나증권", category: "securities", brandColor: "#009178" },
  { id: "daishin", name: "대신", category: "securities", brandColor: "#0054A6" },
  { id: "meritz", name: "메리츠", category: "securities", brandColor: "#E60012" },
  { id: "sksec", name: "SK증권", category: "securities", brandColor: "#EA002C" },
  { id: "yuanta", name: "유안타", category: "securities", brandColor: "#003876" },
  { id: "ibksec", name: "IBK투자", category: "securities", brandColor: "#0057A8" },
  { id: "kakaopaysec", name: "카카오페이증권", category: "securities", brandColor: "#FEE500" },
  { id: "lssec", name: "LS증권", category: "securities", brandColor: "#0054A6", logoLabel: "LS" },
  { id: "tosssec", name: "토스증권", category: "securities", brandColor: "#001A42" },
];

export function findFinancialInstitutionByName(
  name: string | null | undefined,
): FinancialInstitution | undefined {
  const trimmed = name?.trim();
  if (!trimmed) return undefined;
  return KOREAN_FINANCIAL_INSTITUTIONS.find((item) => item.name === trimmed);
}

export function listFinancialInstitutionsByCategory(
  category: FinancialInstitutionCategory,
): FinancialInstitution[] {
  return KOREAN_FINANCIAL_INSTITUTIONS.filter((item) => item.category === category);
}
