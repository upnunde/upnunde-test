import { redirect } from "next/navigation";

/** 수익 화면은 분석 > 수익 탭으로 통합됨 */
export default function MonetizationPage() {
  redirect("/analytics?area=revenue");
}
