"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { FloatingComposerBar } from "@/components/ui/floating-composer-bar";
import { characterDataToCharacterResource } from "@/lib/myWorksCharacterDetail";
import { PAGE_SUBHEADER_WITH_STICKY_CLASS } from "@/lib/page-layout";
import { Avatar, AvatarFallback, AvatarImage } from "design-system/ui/avatar";
import { Bubble, BubbleContent } from "design-system/ui/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
  MessageHeader,
} from "design-system/ui/message";
import type { CharacterData } from "@/types/character";
import { cn } from "design-system/utils";

type ChatMessage = {
  id: string;
  role: "character" | "user";
  text: string;
};

function mockCharacterReply(userText: string): string {
  const trimmed = userText.trim();
  if (!trimmed) return "…….";
  if (/안녕|반가|하이|hello/i.test(trimmed)) {
    return "인사는 받았소. 허나 길은 아직 멀다.";
  }
  if (/누구|이름|당신/i.test(trimmed)) {
    return "앞이 보이지 않아도, 나아갈 길은 분명하오.";
  }
  if (/도와|부탁|가르쳐/i.test(trimmed)) {
    return "원한다면 손을 내밀겠소. 단, 스스로 서려는 의지가 있어야 하오.";
  }
  if (/왜|이유|어떻게/i.test(trimmed)) {
    return "질문은 많으나, 답은 언제나 발 아래에 있소.";
  }
  return "……그 말, 마음에 새겨 두겠소.";
}

const CHAT_COLUMN_CLASS = "mx-auto w-full max-w-[640px]";

function avatarInitials(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

export interface CharacterChatScreenProps {
  character: CharacterData;
  onClose: () => void;
  className?: string;
}

/**
 * 캐릭터 대화 화면 — 공통 서브헤더 + 풀폭 본문(대화 컬럼 max 640).
 * 입력은 AI 플로팅 컴포저(`FloatingComposerBar`) plain variant.
 * 모바일: safe-area · 좁은 거터 · 키보드(visualViewport) 대응.
 */
export function CharacterChatScreen({
  character,
  onClose,
  className,
}: CharacterChatScreenProps) {
  const detail = useMemo(() => characterDataToCharacterResource(character), [character]);
  const imageUrl = detail.imageUrl || character.thumbnailUrl || "";
  const speaker = detail.name || character.title;
  const greeting =
    detail.greeting?.trim() ||
    character.tagline?.trim() ||
    "……기다리고 있었소.";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef(draft);
  const lastSendAtRef = useRef(0);
  draftRef.current = draft;

  useEffect(() => {
    setMessages([{ id: "greeting", role: "character", text: greeting }]);
    setDraft("");
  }, [character.id, greeting]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSend = useCallback(() => {
    const text = draftRef.current.trim();
    if (!text) return;
    const now = Date.now();
    if (now - lastSendAtRef.current < 250) return;
    lastSendAtRef.current = now;
    draftRef.current = "";
    setDraft("");
    setMessages((prev) => [
      ...prev,
      { id: `u-${now}`, role: "user", text },
      {
        id: `c-${now}-r`,
        role: "character",
        text: mockCharacterReply(text),
      },
    ]);
  }, []);

  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-full flex-col overflow-hidden bg-canvas text-foreground",
        className,
      )}
    >
      <header
        className={cn(
          PAGE_SUBHEADER_WITH_STICKY_CLASS,
          "max-lg:h-[calc(3.5rem+env(safe-area-inset-top,0px))] max-lg:px-3 max-lg:pt-[env(safe-area-inset-top,0px)]",
        )}
      >
        <div className={cn(CHAT_COLUMN_CLASS, "flex min-w-0 items-center justify-start gap-2 lg:gap-3")}>
          <HeaderBackButton onClick={onClose} aria-label="캐릭터 목록으로" />
          <h1 className="min-w-0 truncate text-heading2_700 text-foreground">{speaker}</h1>
        </div>
      </header>

      <div
        ref={listRef}
        className="min-h-0 w-full flex-1 overflow-y-auto overscroll-contain px-3 py-3 lg:px-5 lg:py-4"
      >
        <p className="mb-3 px-1 text-center text-caption2_400 text-foreground-placeholder lg:mb-4">
          이 대화는 AI로 생성된 가상의 이야기입니다
        </p>
        <MessageGroup className={cn(CHAT_COLUMN_CLASS, "gap-3 lg:gap-4")}>
          {messages.map((message) => {
            const isMe = message.role === "user";
            const align = isMe ? "end" : "start";

            return (
              <Message key={message.id} align={align}>
                {!isMe ? (
                  <MessageAvatar>
                    <Avatar size="md" className="max-lg:size-8">
                      {imageUrl ? (
                        <AvatarImage src={imageUrl} alt={speaker} />
                      ) : null}
                      <AvatarFallback>{avatarInitials(speaker)}</AvatarFallback>
                    </Avatar>
                  </MessageAvatar>
                ) : null}
                <MessageContent>
                  {!isMe ? <MessageHeader>{speaker}</MessageHeader> : null}
                  <Bubble variant={isMe ? "default" : "secondary"} align={align}>
                    <BubbleContent>{message.text}</BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
            );
          })}
        </MessageGroup>
      </div>

      <div
        className={cn(
          "w-full shrink-0 px-3 pt-2 lg:px-5 lg:pb-4",
          "pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]",
          "max-lg:pb-[max(0.75rem,calc(env(safe-area-inset-bottom,0px)+var(--app-keyboard-inset,var(--app-vv-bottom,0px))))]",
        )}
      >
        <FloatingComposerBar
          placement="inline"
          variant="plain"
          maxWidthClassName={CHAT_COLUMN_CLASS}
          className="relative z-0"
          value={draft}
          onChange={setDraft}
          onSubmit={handleSend}
          placeholder={`${speaker}에게 메시지 보내기`}
          placeholderPrefix=""
          ariaLabel="메시지 입력"
          submitAriaLabel="전송"
        />
      </div>
    </div>
  );
}
