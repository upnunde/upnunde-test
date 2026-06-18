"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CharacterExpressionSlot } from "@/types/resource";
import {
  EMPTY_SERIES_FORM_ERRORS,
  SERIES_FORM_ERROR_FOCUS_ORDER,
  getSeriesFormErrors,
  isSeriesFormValid,
  type SeriesFormField,
  type SeriesFormInitialSnapshot,
  type SeriesFormSubmitPayload,
  type SeriesFormTab,
} from "@/lib/seriesForm";
import { createOptimizedImageObjectUrl } from "@/lib/image-upload-compress";
import { persistableImageUrl, revokePreviewUrlIfBlob } from "@/lib/persistable-image-url";
import { parseTagList } from "@/lib/parse-tag-list";
import { useEditorStore } from "@/store/useEditorStore";

interface UseSeriesFormControllerOptions {
  coverSlotId: string;
  logoSlotId: string;
  initialSnapshot?: SeriesFormInitialSnapshot | null;
  onValidSubmit?: (payload: SeriesFormSubmitPayload) => void | Promise<void>;
}

export function useSeriesFormController({
  coverSlotId,
  logoSlotId,
  initialSnapshot,
  onValidSubmit,
}: UseSeriesFormControllerOptions) {
  const [activeTab, setActiveTab] = useState<SeriesFormTab>("image");
  const [seriesTitle, setSeriesTitle] = useState("");
  const [seriesSummary, setSeriesSummary] = useState("");
  const [seriesKeywords, setSeriesKeywords] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [keywordList, setKeywordList] = useState<string[]>([]);
  const [isComposingKeyword, setIsComposingKeyword] = useState(false);
  const [worldviewDescription, setWorldviewDescription] = useState("");
  const [worldviewPrompt, setWorldviewPrompt] = useState("");
  const [persona, setPersona] = useState("");

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
      revokePreviewUrlIfBlob(coverPreviewUrl);
      revokePreviewUrlIfBlob(logoPreviewUrl);
      revokePreviewUrlIfBlob(pendingCoverUrl);
      revokePreviewUrlIfBlob(pendingLogoUrl);
    };
  }, [coverPreviewUrl, logoPreviewUrl, pendingCoverUrl, pendingLogoUrl]);

  useEffect(() => {
    setSeriesPersona(persona);
  }, [persona, setSeriesPersona]);

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

  const applyKeywordList = useCallback((list: string[]) => {
    setKeywordList(list);
    setSeriesKeywords(list.join(", "));
    if (list.length > 0) {
      setFieldErrors((prev) => ({ ...prev, keywords: false }));
    }
  }, []);

  useEffect(() => {
    if (!initialSnapshot) return;

    setSeriesTitle(initialSnapshot.seriesTitle);
    setSeriesSummary(initialSnapshot.seriesSummary);
    setKeywordInput("");
    applyKeywordList([...initialSnapshot.keywordList]);
    setWorldviewDescription(initialSnapshot.worldviewDescription);
    setWorldviewPrompt(initialSnapshot.worldviewPrompt);
    setPersona(initialSnapshot.persona);
    setHasCoverImage(initialSnapshot.hasCoverImage);
    setHasLogoImage(initialSnapshot.hasLogoImage);
    setCoverPreviewUrl(initialSnapshot.coverPreviewUrl);
    setLogoPreviewUrl(initialSnapshot.logoPreviewUrl);
    setFieldErrors(EMPTY_SERIES_FORM_ERRORS);
  }, [initialSnapshot, applyKeywordList]);

  const handleAddKeyword = useCallback(() => {
    const cleaned = keywordInput.trim().replace(/,$/, "");
    const value = cleaned.replace(/^#+/, "");
    if (!value || value.length < 2) return;
    if (keywordList.includes(value)) {
      setKeywordInput("");
      return;
    }
    const next = [...keywordList, value];
    if (next.join(", ").length > MAX_KEYWORDS) return;
    applyKeywordList(next);
    setKeywordInput("");
  }, [keywordInput, keywordList, applyKeywordList, MAX_KEYWORDS]);

  const handleRemoveKeyword = useCallback(
    (keyword: string) => {
      applyKeywordList(keywordList.filter((t) => t !== keyword));
    },
    [keywordList, applyKeywordList],
  );

  const initKeywordsFromString = useCallback((raw: string) => {
    const list = parseTagList(raw);
    setKeywordInput("");
    applyKeywordList(list);
  }, [applyKeywordList]);

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
            revokePreviewUrlIfBlob(prev);
            return url;
          });
          setPendingCoverUrl(null);
          setHasCoverImage(true);
          setFieldErrors((prev) => ({ ...prev, cover: false }));
        } else {
          setLogoPreviewUrl((prev) => {
            revokePreviewUrlIfBlob(prev);
            return url;
          });
          setPendingLogoUrl(null);
          setHasLogoImage(true);
          setFieldErrors((prev) => ({ ...prev, logo: false }));
        }
        setExpressionModalOpen(false);
      };

      void persistableImageUrl(sourceUrl).then((dataUrl) => {
        applyUrl(dataUrl || sourceUrl);
      });
    },
    [expressionModalMode]
  );

  const handleExpressionModalClose = useCallback(() => {
    revokePreviewUrlIfBlob(pendingCoverUrl);
    setPendingCoverUrl(null);
    revokePreviewUrlIfBlob(pendingLogoUrl);
    setPendingLogoUrl(null);
    setExpressionModalOpen(false);
  }, [pendingCoverUrl, pendingLogoUrl]);

  const handleClearCoverPreview = useCallback(() => {
    setCoverPreviewUrl((prev) => {
      revokePreviewUrlIfBlob(prev);
      return null;
    });
    setHasCoverImage(false);
  }, []);

  const handleClearLogoPreview = useCallback(() => {
    setLogoPreviewUrl((prev) => {
      revokePreviewUrlIfBlob(prev);
      return null;
    });
    setHasLogoImage(false);
  }, []);

  const handleCoverFileSelected = useCallback((file: File) => {
    void (async () => {
      try {
        const url = await createOptimizedImageObjectUrl(file);
        setPendingCoverUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        setExpressionModalMode("cover");
        setExpressionModalOpen(true);
      } catch (err) {
        console.error("Cover image prepare failed:", err);
      }
    })();
  }, []);

  const handleLogoFileSelected = useCallback((file: File) => {
    void (async () => {
      try {
        const url = await createOptimizedImageObjectUrl(file);
        setPendingLogoUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        setExpressionModalMode("logo");
        setExpressionModalOpen(true);
      } catch (err) {
        console.error("Logo image prepare failed:", err);
      }
    })();
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
      const payload: SeriesFormSubmitPayload = {
        seriesTitle,
        seriesSummary,
        seriesKeywords,
        keywordList,
        worldviewDescription,
        worldviewPrompt,
        persona,
        coverPreviewUrl,
        logoPreviewUrl,
      };
      void Promise.resolve(onValidSubmit?.(payload));
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
    keywordList,
    coverPreviewUrl,
    logoPreviewUrl,
  ]);

  return {
    activeTab,
    setActiveTab,
    seriesTitle,
    setSeriesTitle,
    seriesSummary,
    setSeriesSummary,
    seriesKeywords,
    keywordInput,
    setKeywordInput,
    keywordList,
    isComposingKeyword,
    setIsComposingKeyword,
    handleAddKeyword,
    handleRemoveKeyword,
    initKeywordsFromString,
    worldviewDescription,
    setWorldviewDescription,
    worldviewPrompt,
    setWorldviewPrompt,
    persona,
    setPersona,
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
