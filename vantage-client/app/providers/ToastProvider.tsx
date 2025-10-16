"use client";

import React, { useState, useCallback, useContext, createContext } from "react";
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

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType, options: ToastOptions = {}): string => {
      const id = `toast-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const toast: ToastNotification = {
        id,
        type,
        title: options.title || getDefaultTitle(type),
        message,
        duration: options.duration || getDefaultDuration(type),
        isVisible: true,
        timestamp: new Date().toISOString(),
        actions: options.actions,
        metadata: options.metadata,
      };

      setToasts((prev) => [...prev, toast]);

      // Auto-hide toast after duration
      if (toast.duration && toast.duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, toast.duration);
      }

      return id;
    },
    [hideToast]
  );

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const getDefaultTitle = (type: ToastType): string => {
    switch (type) {
      case "success":
        return "Success";
      case "error":
        return "Error";
      case "warning":
        return "Warning";
      case "info":
        return "Information";
      default:
        return "Notification";
    }
  };

  const getDefaultDuration = (type: ToastType): number => {
    switch (type) {
      case "success":
        return 5000;
      case "error":
        return 8000;
      case "warning":
        return 6000;
      case "info":
        return 4000;
      default:
        return 5000;
    }
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        hideToast,
        clearToasts,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
