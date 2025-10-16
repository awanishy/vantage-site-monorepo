"use client";

import { useContext, createContext } from "react";
import { ToastNotification, ToastType, ToastOptions } from "@/types";

interface ToastContextType {
  toasts: ToastNotification[];
  showToast: (
    message: string,
    type: ToastType,
    options?: ToastOptions
  ) => string;
  hideToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Provider component moved to ToastProvider.tsx

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
