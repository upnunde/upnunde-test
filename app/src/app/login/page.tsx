import { redirect } from "next/navigation";

/** 로그인 화면은 첫 화면(/)으로 통일. /login 접속 시 루트로 리다이렉트 */
export default function LoginRoute() {
  redirect("/");
}
