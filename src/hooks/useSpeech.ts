import { useCallback, useEffect, useState } from "react";

import { speak as speakUtil, stopSpeech } from "../utils/speech";

// Event-driven approach without polling
export const useSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTextId, setCurrentTextId] = useState<number | null>(null);

  // Clear state when speech stops
  const clearSpeechState = useCallback(() => {
    setIsPlaying(false);
    setCurrentTextId(null);
  }, []);

  // Main speak function with direct state management
  const speak = useCallback(
    (text: string, textId?: number) => {
      if (isPlaying) {
        stopSpeech();
        clearSpeechState();
      }

      setCurrentTextId(textId ?? null);
      setIsPlaying(true);

      speakUtil(text, {
        onStart: () => {
          setIsPlaying(true);
        },
        onEnd: () => {
          clearSpeechState();
        },
        onError: e => {
          // Only log errors that aren't expected interruptions
          if (e.error !== "interrupted") {
            console.error("Speech error for textId:", textId, e);
          }
          clearSpeechState();
        },
      });
    },
    [isPlaying, clearSpeechState]
  );

  // Stop speech function
  const stop = useCallback(() => {
    stopSpeech();
    clearSpeechState();
  }, [clearSpeechState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  return { isPlaying, currentTextId, speak, stop };
};
