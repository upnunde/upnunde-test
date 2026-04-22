"use client";

import { useState } from "react";
import { DELETE_CONFIRM_INPUT_PHRASE } from "@/lib/deleteConfirmPhrase";

interface UseDeleteConfirmInputOptions {
  onClose: () => void;
}

export function useDeleteConfirmInput({ onClose }: UseDeleteConfirmInputOptions) {
  const [confirmInput, setConfirmInput] = useState("");
  const deleteEnabled = confirmInput.trim() === DELETE_CONFIRM_INPUT_PHRASE;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setConfirmInput("");
      onClose();
    }
  };

  const resetConfirmInput = () => {
    setConfirmInput("");
  };

  return {
    confirmInput,
    setConfirmInput,
    deleteEnabled,
    handleOpenChange,
    resetConfirmInput,
  };
}
