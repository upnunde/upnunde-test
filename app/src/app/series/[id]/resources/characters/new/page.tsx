"use client";

import React, { useState } from "react";
import { StandaloneHeaderPage } from "@/components/layout/StandaloneHeaderPage";
import { CharacterDetailPage } from "@/components/resource/character/CharacterDetailPage";

export default function SeriesCharacterNewPage() {

  return (
    <StandaloneHeaderPage>
      <CharacterDetailPage isNew />
    </StandaloneHeaderPage>
  );
}

