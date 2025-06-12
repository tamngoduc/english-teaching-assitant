import { useCallback, useEffect, useState } from "react";

import { createSpeechRecognition } from "src/utils/speech";
import type { SpeechRecognition } from "src/utils/speechTypes";

export interface UseRecordOptions {
  onResult?: (transcript: string) => void;
}

export const useRecord = ({ onResult }: UseRecordOptions = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    const rec = createSpeechRecognition();
    if (!rec) return;

    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = e =>
      onResult?.(
        Array.from(e.results)
          .map(r => r[0].transcript)
          .join("")
      );
    rec.onend = () => setIsRecording(false);

    setRecognition(rec);
    return () => rec.stop();
  }, [onResult]);

  const start = useCallback(() => {
    recognition?.start();
    setIsRecording(true);
  }, [recognition]);

  const stop = useCallback(() => {
    recognition?.stop();
  }, [recognition]);

  return { isRecording, start, stop, supported: !!recognition };
};
