import { useCallback, useEffect, useState } from "react";

import { createSpeechRecognition } from "src/utils/speech";
import type {
  SpeechRecognition,
  SpeechRecognitionAlternative,
  SpeechRecognitionEvent,
  SpeechRecognitionResult,
} from "src/utils/speechTypes";

export interface UseRecordOptions {
  onTranscript?: (transcript: string) => void;
  onError?: (error: Event) => void;
  onEnd?: () => void;
}

export interface UseRecordReturn {
  isRecording: boolean;
  isSpeechSupported: boolean | null;
  startRecording: () => void;
  stopRecording: () => void;
  toggleRecording: () => void;
}

export const useRecord = (options: UseRecordOptions = {}): UseRecordReturn => {
  const { onTranscript, onError, onEnd } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Speech recognition event handlers
  const handleSpeechResult = useCallback(
    (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(
          (result: SpeechRecognitionResult) => result[0] as SpeechRecognitionAlternative
        )
        .map((result: SpeechRecognitionAlternative) => result.transcript)
        .join("");

      onTranscript?.(transcript);
    },
    [onTranscript]
  );

  const handleSpeechError = useCallback(
    (event: Event) => {
      console.error("Speech recognition error:", event);
      setIsRecording(false);
      onError?.(event);
    },
    [onError]
  );

  const handleSpeechEnd = useCallback(() => {
    setIsRecording(false);
    onEnd?.();
  }, [onEnd]);

  // Initialize speech recognition
  useEffect(() => {
    const speechRecognition = createSpeechRecognition();
    setRecognition(speechRecognition);

    if (speechRecognition) {
      speechRecognition.onresult = handleSpeechResult;
      speechRecognition.onerror = handleSpeechError;
      speechRecognition.onend = handleSpeechEnd;
      setIsSpeechSupported(true);
    } else {
      // Only set this to false after a short delay to avoid flashing the message on page load
      const timer = setTimeout(() => setIsSpeechSupported(false), 1000);
      return () => clearTimeout(timer);
    }

    // Cleanup function to ensure speech recognition is stopped
    return () => {
      if (speechRecognition) {
        try {
          speechRecognition.stop();
        } catch (e) {
          console.error("Error stopping speech recognition:", e);
        }
      }
    };
  }, [handleSpeechResult, handleSpeechError, handleSpeechEnd]); // Remove isRecording dependency

  const startRecording = useCallback(() => {
    if (recognition) {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    }
  }, [recognition]);

  const stopRecording = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  }, [recognition]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return {
    isRecording,
    isSpeechSupported,
    startRecording,
    stopRecording,
    toggleRecording,
  };
};
