import { useCallback, useEffect, useRef } from "react";

interface UseAutoSendOptions {
  text: string;
  onSend: (text: string) => void;
  delay?: number; // in milliseconds
  disabled?: boolean;
}

export const useAutoSend = ({
  text,
  onSend,
  delay = 3000, // 3 seconds default
  disabled = false,
}: UseAutoSendOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTextRef = useRef<string>("");
  const isFocusedRef = useRef<boolean>(false);

  // Clear existing timeout
  const clearAutoSendTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Start auto-send timer
  const startAutoSendTimer = useCallback(() => {
    if (disabled || !text.trim() || isFocusedRef.current) {
      return;
    }

    clearAutoSendTimeout();

    timeoutRef.current = setTimeout(() => {
      if (!isFocusedRef.current && text.trim() && text === lastTextRef.current) {
        onSend(text);
      }
    }, delay);
  }, [text, onSend, delay, disabled, clearAutoSendTimeout]);

  // Handle text changes
  useEffect(() => {
    lastTextRef.current = text;

    // Clear timeout when text changes (user is typing)
    clearAutoSendTimeout();

    // Don't start timer if input is focused (user is actively typing)
    if (!isFocusedRef.current && text.trim()) {
      startAutoSendTimer();
    }
  }, [text, startAutoSendTimer, clearAutoSendTimeout]);

  // Handle focus events
  const handleFocus = useCallback(() => {
    isFocusedRef.current = true;
    clearAutoSendTimeout();
  }, [clearAutoSendTimeout]);

  const handleBlur = useCallback(() => {
    isFocusedRef.current = false;
    lastTextRef.current = text;

    // Start timer when input loses focus and has text
    if (text.trim()) {
      startAutoSendTimer();
    }
  }, [text, startAutoSendTimer]);

  // Handle recording stop (should trigger timer)
  const handleRecordingStop = useCallback(() => {
    // Small delay to ensure transcript is updated
    setTimeout(() => {
      if (text.trim() && !isFocusedRef.current) {
        startAutoSendTimer();
      }
    }, 100);
  }, [text, startAutoSendTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAutoSendTimeout();
    };
  }, [clearAutoSendTimeout]);

  return {
    handleFocus,
    handleBlur,
    handleRecordingStop,
    clearAutoSendTimeout,
  };
};
