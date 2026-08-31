"use client";

import React, { useState } from "react";
import { StandaloneHeaderPage } from "@/components/layout/StandaloneHeaderPage";
import { ImageResourceDetailPage } from "@/components/resource/ImageResourceDetailPage";

export default function SeriesSceneNewPage() {

  return (
    <StandaloneHeaderPage>
          <ImageResourceDetailPage kind="scene" />
    </StandaloneHeaderPage>
  );
}

