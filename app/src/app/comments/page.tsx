import { redirect } from "next/navigation";

/** 댓글관리 → 반응으로 통합 */
export default function CommentsRedirectPage() {
  redirect("/reactions");
}
