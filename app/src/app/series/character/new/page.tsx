"use client";

import React, { useState } from "react";
import { StandaloneHeaderPage } from "@/components/layout/StandaloneHeaderPage";
import { CharacterDetailPage } from "@/components/resource/character/CharacterDetailPage";

/** 내 작품 — 새 캐릭터 생성 (`/series/character/new`) */
export default function WorksCharacterNewPage() {

  return (
    <StandaloneHeaderPage>
      <CharacterDetailPage isNew context="my-works" />
    </StandaloneHeaderPage>
  );
}
