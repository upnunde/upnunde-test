"use client";

import React, { useState } from "react";
import { StandaloneHeaderPage } from "@/components/layout/StandaloneHeaderPage";
import { MediaResourceDetailPage } from "@/components/resource/MediaResourceDetailPage";

export default function SeriesMediaNewPage() {

  return (
    <StandaloneHeaderPage>
          <MediaResourceDetailPage />
    </StandaloneHeaderPage>
  );
}

