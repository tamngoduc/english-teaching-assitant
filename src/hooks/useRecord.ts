import { useCallback, useEffect, useState } from "react";

import { createSpeechRecognition } from "src/utils/speech";
import type {
  SpeechRecognition,
  SpeechRecognitionAlternative,
  SpeechRecognitionEvent,
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
      const results = Array.from(event.results);

      // Get the complete transcript (both final and interim)
      const transcript = results
        .map(result => (result[0] as SpeechRecognitionAlternative).transcript)
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

    if (speechRecognition) {
      // Configure for continuous listening
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = "en-US"; // Adjust as needed

      // Set event handlers
      speechRecognition.onresult = handleSpeechResult;
      speechRecognition.onerror = handleSpeechError;
      speechRecognition.onend = handleSpeechEnd;

      setRecognition(speechRecognition);
      setIsSpeechSupported(true);
    } else {
      const timer = setTimeout(() => setIsSpeechSupported(false), 1000);
      return () => clearTimeout(timer);
    }

    return () => {
      if (speechRecognition) {
        try {
          speechRecognition.stop();
        } catch (e) {
          console.error("Error stopping speech recognition:", e);
        }
      }
    };
  }, [handleSpeechResult, handleSpeechError, handleSpeechEnd]);

  const startRecording = useCallback(() => {
    if (recognition && !isRecording) {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    }
  }, [recognition, isRecording]);

  const stopRecording = useCallback(() => {
    if (recognition && isRecording) {
      recognition.stop();
    }
  }, [recognition, isRecording]);

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
