import { useEffect, useState } from "react";

import { fetchWordDetails } from "src/services/vocabulary";
import type { VocabularyData } from "src/types";

export const usePronunciationAudio = (word: string, data?: VocabularyData) => {
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when word changes
    setAudioSrc("");
    setError(null);
    setIsLoadingAudio(true);

    const fetchPronunciationAudio = async () => {
      // Check if we already have audio data
      if (data?.pronunciation && data.pronunciation.length > 0) {
        // Try to find any pronunciation entry with audio
        const audioEntry = data.pronunciation.find(p => p.audio);
        if (audioEntry?.audio) {
          setAudioSrc(audioEntry.audio);
          setIsLoadingAudio(false);
          return;
        }
      }

      // If we don't have audio from the initial data, fetch from dictionary API
      try {
        const detailedData = await fetchWordDetails(word);

        // Search all pronunciation entries for audio
        let foundAudio = "";
        if (detailedData?.pronunciation && detailedData.pronunciation.length > 0) {
          const audioEntry = detailedData.pronunciation.find(p => p.audio);
          if (audioEntry?.audio) {
            foundAudio = audioEntry.audio;
          }
        }

        setAudioSrc(foundAudio);
      } catch (error) {
        console.error("Error fetching pronunciation:", error);
        // We don't set error here because we still want to show word info
      } finally {
        setIsLoadingAudio(false);
      }
    };

    fetchPronunciationAudio();
  }, [word, data]);

  return {
    audioSrc,
    isLoadingAudio,
    error,
    setError,
  };
};
