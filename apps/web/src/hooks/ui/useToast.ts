import { useState, useCallback } from 'react';
import { ToastType } from '../../components/ui/Toast';

/**
 * Toast notification interface
 */
export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

/**
 * Hook return interface for toast management
 */
export interface UseToastReturn {
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  showSuccess: (title: string, message?: string) => string;
  showError: (title: string, message?: string) => string;
  showWarning: (title: string, message?: string) => string;
  showInfo: (title: string, message?: string) => string;
}

/**
 * Hook for managing toast notifications
 * Provides methods to show different types of toasts and manage their lifecycle
 */
export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  /**
   * Generate a unique ID for a toast
   */
  const generateId = useCallback((): string => {
    return `toast-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  }, []);

  /**
   * Add a new toast notification
   * @param toast - Toast configuration without ID
   * @returns The generated toast ID
   */
  const addToast = useCallback(
    (toast: Omit<ToastNotification, 'id'>): string => {
      const id = generateId();
      const newToast: ToastNotification = {
        id,
        duration: 5000, // Default 5 seconds
        ...toast,
      };

      setToasts(prevToasts => [...prevToasts, newToast]);
      return id;
    },
    [generateId]
  );

  /**
   * Remove a toast notification by ID
   * @param id - Toast ID to remove
   */
  const removeToast = useCallback((id: string): void => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  /**
   * Clear all toast notifications
   */
  const clearAllToasts = useCallback((): void => {
    setToasts([]);
  }, []);

  /**
   * Show a success toast
   * @param title - Toast title
   * @param message - Optional toast message
   * @returns The generated toast ID
   */
  const showSuccess = useCallback(
    (title: string, message?: string): string => {
      return addToast({
        type: 'success',
        title,
        message,
      });
    },
    [addToast]
  );

  /**
   * Show an error toast
   * @param title - Toast title
   * @param message - Optional toast message
   * @returns The generated toast ID
   */
  const showError = useCallback(
    (title: string, message?: string): string => {
      return addToast({
        type: 'error',
        title,
        message,
        duration: 8000, // Errors stay longer
      });
    },
    [addToast]
  );

  /**
   * Show a warning toast
   * @param title - Toast title
   * @param message - Optional toast message
   * @returns The generated toast ID
   */
  const showWarning = useCallback(
    (title: string, message?: string): string => {
      return addToast({
        type: 'warning',
        title,
        message,
        duration: 6000, // Warnings stay a bit longer
      });
    },
    [addToast]
  );

  /**
   * Show an info toast
   * @param title - Toast title
   * @param message - Optional toast message
   * @returns The generated toast ID
   */
  const showInfo = useCallback(
    (title: string, message?: string): string => {
      return addToast({
        type: 'info',
        title,
        message,
      });
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
