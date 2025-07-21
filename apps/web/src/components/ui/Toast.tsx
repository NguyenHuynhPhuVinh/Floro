'use client';

import React from 'react';
import { toast } from 'sonner';

/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast notification options
 */
export interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
}

/**
 * Toast utility functions using sonner
 */
export const showToast = {
  success: (options: ToastOptions) => {
    toast.success(options.title, {
      description: options.message,
      duration: options.duration,
    });
  },
  error: (options: ToastOptions) => {
    toast.error(options.title, {
      description: options.message,
      duration: options.duration,
    });
  },
  warning: (options: ToastOptions) => {
    toast.warning(options.title, {
      description: options.message,
      duration: options.duration,
    });
  },
  info: (options: ToastOptions) => {
    toast.info(options.title, {
      description: options.message,
      duration: options.duration,
    });
  },
};

/**
 * Legacy Toast component props for backward compatibility
 */
export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

/**
 * Legacy Toast component - now uses sonner internally
 * @deprecated Use showToast utility functions instead
 */
export const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  duration = 5000,
}) => {
  // Automatically show toast using sonner
  React.useEffect(() => {
    showToast[type]({ title, message, duration });
  }, [type, title, message, duration]);

  // Return null since sonner handles the rendering
  return null;
};

/**
 * Legacy Toast container component
 * @deprecated Use Toaster from sonner instead
 */
export interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
  }>;
  onRemoveToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  // Show all toasts using sonner
  React.useEffect(() => {
    toasts.forEach(toastItem => {
      showToast[toastItem.type]({
        title: toastItem.title,
        message: toastItem.message,
        duration: toastItem.duration,
      });
    });
  }, [toasts]);

  // Return null since sonner handles the rendering
  return null;
};
