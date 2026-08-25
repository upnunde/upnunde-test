import { redirect } from "next/navigation";

/** 관리 → 반응으로 통합 */
export default function ManagementRedirectPage() {
  redirect("/reactions");
}
