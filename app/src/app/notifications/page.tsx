"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header/Header";
import AppSidebar from "@/components/AppSidebar/AppSidebar";
import { NotificationList } from "@/components/notification/NotificationList";
import { Pagination } from "@/components/episode/Pagination";
import type { NotificationData } from "@/types/notification";

/** 알림 목록: 페이지당 20개, 21개부터 페이지네이션 운영 */
const PAGE_SIZE = 20;

/** 알림 50개 더미 데이터 (펼쳤을 때 상세 내용 포함) */
function buildMockNotifications(): NotificationData[] {
  const titles: { category: NotificationData["category"]; title: string; content: string }[] = [
    {
      category: "NOTICE",
      title: "서비스 점검 안내",
      content:
        "2025년 12월 20일 02:00~06:00 서비스 점검이 예정되어 있습니다. 이용에 참고 부탁드립니다. 점검 시간 동안 웹·앱 접속 및 결제·열람이 일시 중단되며, 완료 후 자동 재개됩니다. 데이터베이스 백업 및 보안 패치 작업이며, 완료 시점은 다소 지연될 수 있습니다. 긴급 열람이 필요하신 분은 점검 전 콘텐츠를 미리 저장해 두시기 바랍니다. 문의는 고객센터 또는 1:1 문의를 이용해 주세요.",
    },
    {
      category: "WORK_ALERT",
      title: "신규 구독자가 발생했습니다",
      content:
        "작품에 새로운 구독자가 추가되었습니다. 구독 알림을 켜두셨다면 이와 같은 알림을 받으실 수 있으며, 시리즈 대시보드에서 구독자 수 추이를 확인하실 수 있습니다. 꾸준한 연재와 소통으로 구독 유지율을 높여 보세요.",
    },
    {
      category: "NOTICE",
      title: "개인정보 처리방침 개정 안내",
      content:
        "개인정보 처리방침이 2025년 12월 1일자로 개정되었습니다. 이번 개정은 서비스를 이용하시는 여러분의 개인정보를 더욱 안전하고 투명하게 보호하기 위한 조치로, 관련 법령 개정 사항과 서비스 운영 방식의 변화를 반영하여 전반적인 내용을 정비한 것입니다. 특히 어떤 정보를 어떤 목적로 수집하고 얼마 동안 보관하는지, 그리고 어떤 상황에서 제3자에게 제공하거나 외부 업체에 처리 업무를 맡기는지에 대한 설명을 한층 더 구체적으로 보완했습니다. 회원 가입, 로그인, 결제, 고객 지원, 이벤트 참여 등 서비스 이용 과정에서 수집되는 정보의 항목이 보다 세분화되어 명시되며, 이용자는 각 목적별로 수집 및 이용에 대한 내용을 쉽게 확인하실 수 있습니다. 또한 불필요하게 장기간 보관되던 일부 항목의 보존 기간을 조정하여 최소 수집 및 최소 보관 원칙을 강화했으며, 법령상 의무 보관이 필요한 정보와 그렇지 않은 정보를 구분해 안내함으로써 개인정보 관리 기준을 보다 명확하게 제시했습니다. 제3자 제공 및 처리 위탁과 관련해서는 실제 업무를 수행하는 수탁 업체의 범위와 역할, 제공되는 정보의 종류, 보관 기간 등을 최신 정보 기준으로 재정리했으며, 필수 제공이 아닌 경우에는 사전에 명확한 동의 절차를 거치도록 동의 구조를 개선했습니다. 이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리 정지, 동의 철회 등을 요청하실 수 있으며, 이러한 권리를 행사하는 방법과 절차, 처리 기한에 대해서도 자세히 안내하고 있습니다. 특히 장기간 미이용 계정의 휴면 전환 기준, 휴면 전환 후 정보 분리 보관 방식, 재이용 시 계정 복원 절차 등에 대한 설명을 추가해 예측 가능성을 높였습니다. 변경된 개인정보 처리방침 전문은 공지사항 및 마이페이지 내 개인정보 처리방침 메뉴에서 확인하실 수 있으며, 개정 효력 발생일 이후에도 서비스를 계속 이용하시는 경우 변경된 내용에 동의하신 것으로 간주됩니다. 만약 개정 내용에 동의하지 않으시는 경우, 일부 기능 이용이 제한되거나 서비스 이용을 중단하셔야 할 수 있으므로 반드시 내용을 꼼꼼히 확인해 주시기 바랍니다. 이번 개정은 회원님의 소중한 정보를 보다 안전한 환경에서 관리하기 위한 것으로, 앞으로도 관련 법령을 준수하고 보안 수준을 지속적으로 강화해 나가겠습니다. 개정 내용이나 적용 방식과 관련해 궁금하신 점이 있으시면 언제든지 고객센터 또는 1대1 문의를 통해 문의해 주시기 바랍니다.",
    },
    {
      category: "WORK_ALERT",
      title: "새 댓글이 달렸습니다",
      content:
        "독자 'novel_lover'님이 120화에 댓글을 남기셨습니다. \"다음 회가 너무 기대돼요!\" 댓글 알림을 켜두시면 독자 소통을 놓치지 않으실 수 있으며, 답글을 달면 해당 독자에게 알림이 전달됩니다. 부적절한 댓글은 신고하기로 접수할 수 있습니다.",
    },
    {
      category: "NOTICE",
      title: "결제 시스템 업데이트 완료",
      content:
        "결제 시스템이 안정화되었습니다. 일시적으로 이용이 제한되었던 분들은 이제 정상 이용 가능합니다. 결제 수단 재등록이 필요할 수 있으니 문제가 있으시면 마이페이지에서 결제 정보를 확인해 주시기 바랍니다.",
    },
    {
      category: "WORK_ALERT",
      title: "일일 조회수 1,000 돌파",
      content:
        "오늘 하루 조회수가 1,000을 돌파했습니다. 응원해 주셔서 감사합니다. 시리즈 대시보드에서 일별·주별 조회수 추이를 확인하실 수 있으며, 연재 일정을 맞추시면 조회 유지에 도움이 됩니다.",
    },
    {
      category: "NOTICE",
      title: "연말 연휴 고객센터 운영 안내",
      content:
        "12월 29일(월)~1월 1일(목) 고객센터 운영이 중단됩니다. 긴급 문의는 1:1 문의하기를 이용해 주세요. 해당 기간 전화·챗봇·이메일 상담이 중단되며, 1월 2일(금)부터 순차 답변드릴 예정입니다. 1:1 문의는 영업일 기준 1~2일 내 회신을 원칙으로 합니다. 새해 복 많이 받으세요.",
    },
    {
      category: "WORK_ALERT",
      title: "119화 공개 알림",
      content:
        "119화가 정상적으로 공개되었습니다. 구독자에게 푸시 알림이 발송되었습니다. 공개 일정을 미리 설정해 두시면 자동 공개와 알림 발송이 이루어지며, 시리즈 관리에서 공개 예정 에피소드를 확인하실 수 있습니다.",
    },
    {
      category: "NOTICE",
      title: "이용약관 개정 예고",
      content:
        "2026년 1월 15일자 이용약관 개정이 예고됩니다. 주요 변경 사항은 공지사항에서 확인하실 수 있으며, 개정 효력 발생 전까지 이견이 있으시면 고객센터로 의견을 보내 주시기 바랍니다. 이용약관은 서비스 내에서 상시 열람 가능합니다.",
    },
    {
      category: "WORK_ALERT",
      title: "신규 구독자 +5",
      content:
        "최근 24시간 동안 5명의 신규 구독자가 추가되었습니다. 시리즈 대시보드에서 구독자 추이와 유입 경로를 확인하실 수 있으며, 연재 일정을 꾸준히 유지하시면 구독 유지에 도움이 됩니다.",
    },
    {
      category: "NOTICE",
      title: "앱 버전 2.1.0 업데이트 안내",
      content:
        "RE:NOVEL 스튜디오 앱 2.1.0이 배포되었습니다. 알림 설정 개선 및 접근성 기능이 추가되었으며, 앱 스토어에서 업데이트해 주시면 최신 기능을 이용하실 수 있습니다. 업데이트 후에도 문의가 있으시면 고객센터로 연락해 주세요.",
    },
    {
      category: "WORK_ALERT",
      title: "수익 정산 완료 안내",
      content:
        "2025년 11월 분 수익 정산이 완료되었습니다. 정산 내역은 마이페이지 > 수익 현황에서 확인하실 수 있으며, 출금 신청을 하시면 영업일 기준 3~5일 내 처리됩니다. 정산 관련 문의는 고객센터로 연락해 주세요.",
    },
    {
      category: "NOTICE",
      title: "서버 점검 일정 변경",
      content:
        "기존 12월 18일 예정이던 점검이 12월 22일로 변경되었습니다. 불편을 드려 죄송합니다. 변경된 일정에 맞춰 이용에 참고해 주시고, 점검 시간대에는 접속이 제한될 수 있음을 양지해 주세요.",
    },
    {
      category: "WORK_ALERT",
      title: "댓글 신고 처리 완료",
      content:
        "신고하신 댓글이 운영 정책에 따라 삭제 처리되었습니다. 해당 이용자에게는 정책 위반 안내가 전달되었으며, 반복 위반 시 서비스 이용이 제한될 수 있습니다. 추가 문의는 고객센터로 연락해 주세요.",
    },
    {
      category: "NOTICE",
      title: "이벤트 당첨자 발표",
      content:
        "12월 추천 이벤트 당첨자가 발표되었습니다. 당첨자에게는 별도 연락을 드리며, 당첨 내역은 마이페이지 > 이벤트 참여 현황에서 확인하실 수 있습니다. 경품 발송은 연락 확인 후 영업일 기준 7일 이내 진행됩니다. 수령 의사가 있으시면 기한 내 응답 부탁드립니다.",
    },
    {
      category: "WORK_ALERT",
      title: "120화 업로드 완료",
      content:
        "120화 원고가 성공적으로 업로드되었습니다. 공개 설정 후 구독자에게 노출되며, 공개 일시를 지정해 두시면 자동 공개와 알림 발송이 이루어집니다. 미리보기로 최종 확인 후 공개하시기 바랍니다.",
    },
    {
      category: "NOTICE",
      title: "개인정보 보호 인증 갱신",
      content:
        "개인정보보호 우수사이트 인증이 갱신되었습니다. 회원님의 개인정보는 관련 법령과 내부 규정에 따라 안전하게 관리되고 있으며, 인증 갱신 내역은 서비스 하단에서 확인하실 수 있습니다.",
    },
    {
      category: "WORK_ALERT",
      title: "작품 연재 일정 리마인더",
      content:
        "다음 회 예정일이 3일 남았습니다. 미리 원고를 준비해 주세요. 연재 일정표를 확인하시고, 필요시 편집부와 일정 조율을 요청하실 수 있습니다. 독자에게 예고된 연재일을 지키는 것이 구독 유지에 중요하므로, 여유 있는 일정 관리와 미리 준비하는 습관을 권장드립니다. 추가 문의는 문의하기를 이용해 주세요.",
    },
    {
      category: "NOTICE",
      title: "비밀번호 재설정 요청",
      content:
        "비밀번호 재설정을 요청하셨습니다. 본인이 아닌 경우 고객센터로 연락해 주세요. 재설정 링크 유효기간은 1시간이며, 만료 시 다시 요청해 주시기 바랍니다. 보안을 위해 주기적인 비밀번호 변경을 권장드립니다.",
    },
    {
      category: "WORK_ALERT",
      title: "구독 해지 1건",
      content:
        "구독자 1명이 구독을 해지했습니다. 구독 해지는 시리즈 대시보드에서 확인하실 수 있으며, 꾸준한 연재와 소통으로 이탈을 줄이는 것을 권장드립니다. 재구독 유도는 공지나 이벤트로 할 수 있습니다.",
    },
    {
      category: "NOTICE",
      title: "신규 기능: 시리즈 대시보드",
      content:
        "시리즈별 통계와 수익을 한눈에 보는 대시보드가 오픈되었습니다. 시리즈 관리 화면에서 조회수, 구독자, 수익 추이를 확인하실 수 있으며, 에피소드별 성과도 함께 보실 수 있습니다. 활용해 보시고 문의는 고객센터로 연락해 주세요.",
    },
    {
      category: "WORK_ALERT",
      title: "리소스 저장 실패 알림",
      content:
        "118화 첨부 이미지 중 1건이 용량 제한으로 저장에 실패했습니다. 이미지 크기를 5MB 이하로 조정한 뒤 다시 업로드해 주세요. 압축 도구를 사용하시거나 해상도를 낮추면 용량을 줄일 수 있으며, 재업로드 후 공개 설정을 다시 확인해 주시기 바랍니다.",
    },
    {
      category: "NOTICE",
      title: "정기 결제 실패 안내",
      content:
        "등록된 결제 수단으로 결제에 실패했습니다. 결제 수단을 확인한 뒤 다시 시도해 주시고, 카드 한도·유효기간·잔액을 확인해 보시기 바랍니다. 문제가 계속되면 마이페이지에서 결제 수단을 재등록해 주세요.",
    },
    {
      category: "WORK_ALERT",
      title: "새 구독 +10",
      content:
        "이번 주 신규 구독자 10명이 추가되었습니다. 시리즈 대시보드에서 주간·월간 구독 추이를 확인하실 수 있으며, 연재 일정을 맞추시면 구독 유지에 도움이 됩니다. 새 구독자에게 인사 공지로 소통해 보세요.",
    },
    {
      category: "NOTICE",
      title: "콘텐츠 가이드라인 업데이트",
      content:
        "콘텐츠 등급 및 가이드라인이 일부 수정되었습니다. 이번 수정에서는 연령 등급 기준 보강, 금지 표현 예시 추가, 이미지·광고 노출 기준이 반영되었습니다. 작성 중인 원고가 정책에 맞는지 확인해 주시고, 기존 연재분은 유예 기간 내 수정 또는 등급 재신청이 필요할 수 있습니다. 자세한 내용은 공지사항과 작가 가이드를 참고해 주세요.",
    },
    {
      category: "WORK_ALERT",
      title: "에피소드 미공개 기한 임박",
      content:
        "116화가 7일 이상 비공개 상태입니다. 공개 예정이 있다면 시리즈 관리에서 공개 일시를 설정해 주세요. 장기 미공개 에피소드는 독자 문의가 있을 수 있으므로, 휴재 공지와 함께 일정을 안내해 주시면 좋습니다.",
    },
    {
      category: "NOTICE",
      title: "이메일 인증 완료",
      content:
        "이메일 인증이 완료되었습니다. 모든 기능을 이용하실 수 있으며, 인증된 이메일로 중요 공지와 알림이 발송됩니다. 비밀번호 재설정 등 보안 관련 기능도 이메일을 통해 이용 가능합니다.",
    },
    {
      category: "WORK_ALERT",
      title: "댓글 답글 알림",
      content:
        "119화 댓글에 답글이 달렸습니다. \"작가님 다음 회 기대할게요!\" 댓글 알림을 켜두시면 독자와의 소통을 놓치지 않으실 수 있으며, 답글을 달면 해당 독자에게 알림이 전달됩니다. 부적절한 댓글은 신고하기로 접수할 수 있습니다.",
    },
    {
      category: "NOTICE",
      title: "계정 보안 알림",
      content:
        "새로운 기기에서 로그인이 감지되었습니다. 본인이 맞다면 무시하셔도 됩니다. 본인이 아닌 경우 비밀번호를 즉시 변경하고, 마이페이지에서 로그인 기기 목록을 확인한 뒤 의심스러운 기기는 로그아웃 처리해 주세요.",
    },
    {
      category: "WORK_ALERT",
      title: "일일 조회수 2,500",
      content:
        "오늘 하루 조회수 2,500을 기록했습니다. 시리즈 대시보드에서 일별·주별 조회수 추이를 확인하실 수 있으며, 연재일과 연동해 보시면 독자 반응을 파악하는 데 도움이 됩니다. 꾸준한 연재 응원드립니다.",
    },
    {
      category: "NOTICE",
      title: "공지: 연재 휴재 안내 방법",
      content:
        "연재 휴재 시 시리즈 관리 > 공지에서 독자에게 미리 알릴 수 있습니다. 휴재 공지 작성 시 독자 이탈을 줄일 수 있으며, 재개 예정일을 안내해 주시면 구독 유지에 도움이 됩니다. 장기 휴재 시에는 별도 공지로 양해를 구해 주세요.",
    },
    {
      category: "WORK_ALERT",
      title: "50화 공개",
      content:
        "50화가 정상 공개되었으며, 구독자 알림이 발송되었습니다. 시리즈 대시보드에서 에피소드별 조회수와 반응을 확인하실 수 있으며, 마일스톤 에피소드에는 독자와 소통하는 공지를 올려 보시기 바랍니다.",
    },
    {
      category: "NOTICE",
      title: "개발자 API 베타 오픈",
      content:
        "작품/에피소드 데이터를 연동할 수 있는 API가 베타 오픈되었습니다. 개발자 센터에서 신청하실 수 있으며, 베타 기간에는 조회·통계·에피소드 목록 등 제한된 엔드포인트가 제공됩니다. 승인 후 API 키가 발급되며, 사용량 제한과 이용 규정을 준수해 주시기 바랍니다. 정식 오픈 시 요금제가 적용될 수 있으니 개발자 센터 공지를 참고해 주세요.",
    },
    {
      category: "WORK_ALERT",
      title: "수익 목표 달성",
      content:
        "이번 달 수익 목표를 달성했습니다. 축하드립니다! 마이페이지 > 수익 현황에서 상세 내역을 확인하실 수 있으며, 다음 달 목표를 설정해 두시면 동기 부여에 도움이 됩니다. 꾸준한 연재 응원드립니다.",
    },
    {
      category: "NOTICE",
      title: "필명 변경 기능 안내",
      content:
        "마이페이지에서 필명을 변경할 수 있습니다. 변경 후 기존 작품·댓글에는 새 필명이 반영되며, 구독자에게는 변경 사실이 별도 알림으로 전달되지 않습니다. 한 번 변경 시 일정 기간 내 재변경이 제한될 수 있으니 신중히 설정해 주세요.",
    },
    {
      category: "WORK_ALERT",
      title: "신규 구독자",
      content:
        "작품에 새로운 구독자가 1명 추가되었습니다. 구독 알림을 켜두시면 이와 같은 알림을 받으실 수 있으며, 시리즈 대시보드에서 구독자 수 추이를 확인하실 수 있습니다. 첫 구독자에게 인사 공지를 올려 보세요.",
    },
    {
      category: "NOTICE",
      title: "저작권 보호 정책 안내",
      content:
        "타인의 저작물 무단 사용 시 서비스 이용이 제한될 수 있습니다. 직접 작성·촬영한 자료만 업로드해 주세요. 무단 사용 시 신고 접수 후 해당 콘텐츠는 비공개·삭제 처리되며, 반복 위반 시 계정 제한이 있을 수 있습니다. 참고·인용 시 출처를 명시해 주시고, 저작권 침해 신고는 고객센터 또는 콘텐츠 신고하기로 접수 가능합니다.",
    },
    {
      category: "WORK_ALERT",
      title: "에피소드 수정 요청 반영",
      content:
        "118화 수정 요청이 반영되었습니다. 변경 사항은 5분 이내에 반영되며, 이미 공개된 에피소드는 구독자에게 수정 안내가 노출될 수 있습니다. 추가 수정이 필요하시면 에피소드 관리에서 다시 편집해 주세요.",
    },
    {
      category: "NOTICE",
      title: "로그인 세션 만료",
      content:
        "장시간 미사용으로 로그인 세션이 만료되었습니다. 다시 로그인해 주세요. 보안을 위해 일정 시간 미활동 시 자동 로그아웃되며, 비밀번호를 잊으셨다면 로그인 화면에서 재설정 요청을 진행해 주시기 바랍니다.",
    },
    {
      category: "WORK_ALERT",
      title: "누적 조회 10만",
      content:
        "누적 조회수가 10만을 돌파했습니다. 많은 사랑 감사드립니다. 시리즈 대시보드에서 에피소드별·기간별 조회 추이를 확인하실 수 있으며, 마일스톤 공지로 독자에게 감사 인사를 전해 보시기 바랍니다.",
    },
    {
      category: "NOTICE",
      title: "이벤트: 신규 연재 지원금",
      content:
        "12월 신규 연재 작가 지원금 이벤트가 진행 중입니다. 조건 충족 시 1만 원 지원금을 받을 수 있습니다. 참여 조건은 12월 중 신규 연재 시작 후 3회 이상 업로드, 총 3만 자 이상이며, 심사 통과 시 1만 원이 지급됩니다. 신청은 마이페이지 > 이벤트에서 기한 내 진행해 주시고, 지급은 심사 완료 후 다음 달 정산에 포함됩니다. 자세한 내용은 이벤트 페이지를 확인해 주세요.",
    },
    {
      category: "WORK_ALERT",
      title: "링크 에디터 저장 완료",
      content:
        "120화 링크 에디터 저장이 완료되었습니다. 저장된 내용은 공개 시 반영되며, 수정이 필요하시면 에피소드 편집에서 다시 편집해 주세요. 링크 오류가 있다면 미리보기로 확인 후 공개하시기 바랍니다.",
    },
    {
      category: "NOTICE",
      title: "알림 설정 변경 안내",
      content:
        "알림 설정이 변경되었습니다. 작품 알림·공지 알림을 개별적으로 켜고 끌 수 있으며, 푸시·이메일·앱 내 알림을 세분화해 설정할 수 있습니다. 마이페이지 > 알림 설정에서 언제든 수정 가능합니다.",
    },
    {
      category: "WORK_ALERT",
      title: "댓글 좋아요 +20",
      content:
        "최근 업로드한 에피소드 댓글에 좋아요가 20개 달렸습니다. 독자 반응이 좋은 댓글에는 답글을 남겨 소통해 보시기 바랍니다. 댓글 알림을 켜두시면 이런 소식을 놓치지 않으실 수 있습니다.",
    },
    {
      category: "NOTICE",
      title: "점검 완료: 서비스 정상화",
      content:
        "12월 20일 진행된 점검이 완료되었습니다. 현재 모든 서비스가 정상 운영 중이며, 점검으로 인해 저장하지 못한 내용이 있다면 다시 작성해 주시기 바랍니다. 이용에 불편이 있으시면 고객센터로 연락해 주세요.",
    },
    {
      category: "WORK_ALERT",
      title: "구독자 수 1,000명 달성",
      content:
        "구독자 수가 1,000명을 달성했습니다. 감사합니다. 시리즈 대시보드에서 구독 추이와 유입 경로를 확인하실 수 있으며, 마일스톤 공지로 독자에게 감사 인사를 전해 보시기 바랍니다. 꾸준한 연재 응원드립니다.",
    },
    {
      category: "NOTICE",
      title: "휴면 계정 전환 예정",
      content:
        "1년 이상 로그인하지 않아 30일 후 휴면 계정으로 전환될 예정입니다. 로그인하시면 전환이 해제되며, 휴면 전환 시 일부 개인정보가 분리 저장됩니다. 재이용 시 로그인만 하시면 정상 이용 가능합니다.",
    },
    {
      category: "WORK_ALERT",
      title: "새 에피소드 알림",
      content:
        "새 에피소드가 업로드되어 구독자에게 알림이 발송되었습니다. 알림 설정을 켜두시면 공개 시점에 구독자에게 푸시가 전달되며, 시리즈 대시보드에서 열람률을 확인하실 수 있습니다. 꾸준한 연재로 구독 유지에 힘써 주세요.",
    },
    {
      category: "NOTICE",
      title: "고객 만족도 설문 참여 안내",
      content:
        "서비스 개선을 위한 짧은 설문에 참여해 주세요. 참여 시 소정의 포인트를 드리며, 설문은 약 2~3분 소요됩니다. 의견을 주시면 더 나은 서비스 설계에 반영하겠습니다. 마이페이지 또는 공지 링크에서 참여 가능합니다.",
    },
    {
      category: "WORK_ALERT",
      title: "수익 출금 신청 접수",
      content:
        "출금 신청이 접수되었습니다. 처리까지 영업일 기준 3~5일이 소요되며, 완료 시 등록하신 계좌로 입금됩니다. 마이페이지 > 수익 현황에서 처리 상태를 확인하실 수 있고, 지연 시 고객센터로 문의해 주세요.",
    },
  ];

  const dateFormats = [
    "5분 전",
    "15분 전",
    "1시간 전",
    "3시간 전",
    "어제",
    "2025.11.20",
    "2025.11.25",
    "2025.12.01",
    "2025.12.05",
    "2025.12.10",
    "2025.12.15",
    "2025.12.18",
    "2025.12.20",
  ] as const;

  // 랜덤한 순서로 섞어서 NOTICE / WORK_ALERT가 규칙적으로 보이지 않도록 처리
  const shuffled = [...titles];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }

  return shuffled.map((item, index) => ({
    id: index + 1,
    category: item.category,
    title: item.title,
    content: item.content,
    date: dateFormats[index % dateFormats.length],
    isRead: index % 3 === 0 ? false : true,
  }));
}

const MOCK_NOTIFICATIONS: NotificationData[] = buildMockNotifications();

export default function NotificationsPage() {
  const router = useRouter();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [notifications] = useState<NotificationData[]>(MOCK_NOTIFICATIONS);
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = notifications.length;
  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return notifications.slice(start, start + PAGE_SIZE);
  }, [notifications, currentPage]);
  const showPagination = totalItems > PAGE_SIZE;

  const handleContactClick = useCallback(
    (_notification: NotificationData) => {
      router.push("/inquiry");
    },
    [router]
  );

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <Header profileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl} />
      <div className="flex flex-1 overflow-hidden bg-slate-50">
        <AppSidebar defaultActiveId="notification" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-hidden bg-slate-50">
            {/* Sub Header (레이아웃 가이드: margin 40, max-width 1200, min-width 640) */}
            <div className="w-full h-[64px] shrink-0 border-b border-slate-200 bg-white flex flex-col items-center justify-center px-5">
              <div className="w-full max-w-[1200px] flex items-center justify-start gap-4">
                <h1 className="text-2xl font-bold text-on-surface-10">알림</h1>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col items-center py-8 gap-3 px-5">
              <div className="w-full max-w-[1200px] mx-auto">
              <NotificationList
                notifications={paginatedNotifications}
                onContactClick={handleContactClick}
                footer={
                  showPagination ? (
                    <Pagination
                      currentPage={currentPage}
                      totalItems={totalItems}
                      onPageChange={setCurrentPage}
                      pageSize={PAGE_SIZE}
                    />
                  ) : undefined
                }
              />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
