"use client";

import React, { useState } from "react";
import { StandaloneHeaderPage } from "@/components/layout/StandaloneHeaderPage";
import { ImageResourceDetailPage } from "@/components/resource/ImageResourceDetailPage";

export default function SeriesBackgroundNewPage() {

  return (
    <StandaloneHeaderPage>
          <ImageResourceDetailPage kind="background" />
    </StandaloneHeaderPage>
  );
}

