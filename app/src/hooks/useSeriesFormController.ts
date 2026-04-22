"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CharacterExpressionSlot } from "@/types/resource";
import {
  EMPTY_SERIES_FORM_ERRORS,
  SERIES_FORM_ERROR_FOCUS_ORDER,
  getSeriesFormErrors,
  isSeriesFormValid,
  type SeriesFormField,
  type SeriesFormTab,
} from "@/lib/seriesForm";
import { useEditorStore } from "@/store/useEditorStore";
import type {
  FrameThemePagerState,
  FrameThemeSelectorHandle,
} from "@/components/series/FrameThemeSelector";

interface UseSeriesFormControllerOptions {
  coverSlotId: string;
  logoSlotId: string;
  onValidSubmit?: () => void;
}

export function useSeriesFormController({
  coverSlotId,
  logoSlotId,
  onValidSubmit,
}: UseSeriesFormControllerOptions) {
  const [activeTab, setActiveTab] = useState<SeriesFormTab>("image");
  const [seriesTitle, setSeriesTitle] = useState("");
  const [seriesSummary, setSeriesSummary] = useState("");
  const [seriesKeywords, setSeriesKeywords] = useState("");
  const [worldviewDescription, setWorldviewDescription] = useState("");
  const [worldviewPrompt, setWorldviewPrompt] = useState("");
  const [persona, setPersona] = useState("");
  const [selectedFrameThemeId, setSelectedFrameThemeId] = useState("");

  const frameThemeSelectorRef = useRef<FrameThemeSelectorHandle>(null);
  const [frameThemePager, setFrameThemePager] = useState<FrameThemePagerState>({
    canGoPrev: false,
    canGoNext: false,
    needsPager: false,
  });

  const [hasCoverImage, setHasCoverImage] = useState(false);
  const [hasLogoImage, setHasLogoImage] = useState(false);

  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [pendingCoverUrl, setPendingCoverUrl] = useState<string | null>(null);
  const [pendingLogoUrl, setPendingLogoUrl] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState(EMPTY_SERIES_FORM_ERRORS);
  const [expressionModalOpen, setExpressionModalOpen] = useState(false);
  const [expressionModalMode, setExpressionModalMode] = useState<"cover" | "logo">("cover");

  const coverRef = useRef<HTMLLabelElement | null>(null);
  const logoRef = useRef<HTMLLabelElement | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);
  const logoFileInputRef = useRef<HTMLInputElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const summaryRef = useRef<HTMLTextAreaElement | null>(null);
  const keywordsRef = useRef<HTMLInputElement | null>(null);
  const worldviewRef = useRef<HTMLTextAreaElement | null>(null);
  const promptRef = useRef<HTMLTextAreaElement | null>(null);
  const personaRef = useRef<HTMLInputElement | null>(null);

  const setSeriesPersona = useEditorStore((s) => s.setSeriesPersona);

  const MAX_TITLE = 50;
  const MAX_SUMMARY = 100;
  const MAX_KEYWORDS = 50;
  const MAX_WORLDVIEW = 500;
  const MAX_WORLDVIEW_PROMPT = 1500;
  const MAX_PERSONA = 50;

  useEffect(() => {
    return () => {
      if (coverPreviewUrl) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
      if (pendingCoverUrl) {
        URL.revokeObjectURL(pendingCoverUrl);
      }
      if (pendingLogoUrl) {
        URL.revokeObjectURL(pendingLogoUrl);
      }
    };
  }, [coverPreviewUrl, logoPreviewUrl, pendingCoverUrl, pendingLogoUrl]);

  useEffect(() => {
    setSeriesPersona(persona);
  }, [persona, setSeriesPersona]);

  const handleFrameThemePagerChange = useCallback((state: FrameThemePagerState) => {
    setFrameThemePager(state);
  }, []);

  const isFormValid = isSeriesFormValid(
    getSeriesFormErrors({
      hasCoverImage,
      hasLogoImage,
      seriesTitle,
      seriesSummary,
      seriesKeywords,
      worldviewDescription,
      worldviewPrompt,
      persona,
    })
  );

  const focusField = (tab: SeriesFormTab, ref: { current: HTMLElement | null }) => {
    setActiveTab(tab);
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      ref.current?.focus?.();
    }, 0);
  };

  const handleRequiredFieldChange = useCallback(
    (
      value: string,
      setter: React.Dispatch<React.SetStateAction<string>>,
      field: SeriesFormField
    ) => {
      setter(value);
      if (value.trim().length > 0) {
        setFieldErrors((prev) => ({ ...prev, [field]: false }));
      }
    },
    []
  );

  const openExpressionModalForCover = useCallback(() => {
    if (coverPreviewUrl) {
      setExpressionModalMode("cover");
      setExpressionModalOpen(true);
    } else {
      coverFileInputRef.current?.click();
    }
  }, [coverPreviewUrl]);

  const openExpressionModalForLogo = useCallback(() => {
    if (logoPreviewUrl) {
      setExpressionModalMode("logo");
      setExpressionModalOpen(true);
    } else {
      logoFileInputRef.current?.click();
    }
  }, [logoPreviewUrl]);

  const getExpressionModalInitialSlots = useCallback((): CharacterExpressionSlot[] => {
    if (expressionModalMode === "cover") {
      const url = pendingCoverUrl ?? coverPreviewUrl;
      if (url) {
        return [{ id: coverSlotId, expressionLabel: "", imageUrl: url }];
      }
    }

    if (expressionModalMode === "logo") {
      const url = pendingLogoUrl ?? logoPreviewUrl;
      if (url) {
        return [{ id: logoSlotId, expressionLabel: "", imageUrl: url }];
      }
    }

    return [];
  }, [
    expressionModalMode,
    pendingCoverUrl,
    pendingLogoUrl,
    coverPreviewUrl,
    logoPreviewUrl,
    coverSlotId,
    logoSlotId,
  ]);

  const handleExpressionModalSave = useCallback(
    (slots: CharacterExpressionSlot[]) => {
      const slot = slots[0];
      if (!slot?.imageUrl) return;
      const sourceUrl = slot.imageUrl;
      const isCover = expressionModalMode === "cover";

      const applyUrl = (url: string) => {
        if (isCover) {
          setCoverPreviewUrl((prev) => {
            if (prev && prev !== url) URL.revokeObjectURL(prev);
            return url;
          });
          setPendingCoverUrl(null);
          setHasCoverImage(true);
          setFieldErrors((prev) => ({ ...prev, cover: false }));
        } else {
          setLogoPreviewUrl((prev) => {
            if (prev && prev !== url) URL.revokeObjectURL(prev);
            return url;
          });
          setPendingLogoUrl(null);
          setHasLogoImage(true);
          setFieldErrors((prev) => ({ ...prev, logo: false }));
        }
        setExpressionModalOpen(false);
      };

      if (sourceUrl.startsWith("blob:")) {
        fetch(sourceUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const ownedUrl = URL.createObjectURL(blob);
            applyUrl(ownedUrl);
          })
          .catch(() => {
            applyUrl(sourceUrl);
          });
      } else {
        applyUrl(sourceUrl);
      }
    },
    [expressionModalMode]
  );

  const handleExpressionModalClose = useCallback(() => {
    if (pendingCoverUrl) {
      URL.revokeObjectURL(pendingCoverUrl);
      setPendingCoverUrl(null);
    }
    if (pendingLogoUrl) {
      URL.revokeObjectURL(pendingLogoUrl);
      setPendingLogoUrl(null);
    }
    setExpressionModalOpen(false);
  }, [pendingCoverUrl, pendingLogoUrl]);

  const handleClearCoverPreview = useCallback(() => {
    setCoverPreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
    setHasCoverImage(false);
  }, []);

  const handleClearLogoPreview = useCallback(() => {
    setLogoPreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
    setHasLogoImage(false);
  }, []);

  const handleCoverFileSelected = useCallback((file: File) => {
    setPendingCoverUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setExpressionModalMode("cover");
    setExpressionModalOpen(true);
  }, []);

  const handleLogoFileSelected = useCallback((file: File) => {
    setPendingLogoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setExpressionModalMode("logo");
    setExpressionModalOpen(true);
  }, []);

  const handleSubmit = useCallback(() => {
    const errors = getSeriesFormErrors({
      hasCoverImage,
      hasLogoImage,
      seriesTitle,
      seriesSummary,
      seriesKeywords,
      worldviewDescription,
      worldviewPrompt,
      persona,
    });

    setFieldErrors(errors);

    if (isSeriesFormValid(errors)) {
      onValidSubmit?.();
      return;
    }

    const fieldRefMap: Record<SeriesFormField, { current: HTMLElement | null }> = {
      cover: coverRef,
      logo: logoRef,
      title: titleRef,
      summary: summaryRef,
      keywords: keywordsRef,
      worldview: worldviewRef,
      prompt: promptRef,
      persona: personaRef,
    };

    for (const { field, tab } of SERIES_FORM_ERROR_FOCUS_ORDER) {
      if (!errors[field]) continue;
      focusField(tab, fieldRefMap[field]);
      return;
    }
  }, [
    hasCoverImage,
    hasLogoImage,
    seriesTitle,
    seriesSummary,
    seriesKeywords,
    worldviewDescription,
    worldviewPrompt,
    persona,
    onValidSubmit,
  ]);

  return {
    activeTab,
    setActiveTab,
    seriesTitle,
    setSeriesTitle,
    seriesSummary,
    setSeriesSummary,
    seriesKeywords,
    setSeriesKeywords,
    worldviewDescription,
    setWorldviewDescription,
    worldviewPrompt,
    setWorldviewPrompt,
    persona,
    setPersona,
    selectedFrameThemeId,
    setSelectedFrameThemeId,
    frameThemeSelectorRef,
    frameThemePager,
    handleFrameThemePagerChange,
    fieldErrors,
    isFormValid,
    coverPreviewUrl,
    logoPreviewUrl,
    expressionModalOpen,
    coverRef,
    logoRef,
    coverFileInputRef,
    logoFileInputRef,
    titleRef,
    summaryRef,
    keywordsRef,
    worldviewRef,
    promptRef,
    personaRef,
    MAX_TITLE,
    MAX_SUMMARY,
    MAX_KEYWORDS,
    MAX_WORLDVIEW,
    MAX_WORLDVIEW_PROMPT,
    MAX_PERSONA,
    handleRequiredFieldChange,
    openExpressionModalForCover,
    openExpressionModalForLogo,
    getExpressionModalInitialSlots,
    handleExpressionModalSave,
    handleExpressionModalClose,
    handleClearCoverPreview,
    handleClearLogoPreview,
    handleCoverFileSelected,
    handleLogoFileSelected,
    handleSubmit,
  };
}
