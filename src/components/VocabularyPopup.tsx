import { useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import { usePronunciationAudio } from "src/hooks/usePronunciationAudio";
import { useTheme } from "src/hooks/useTheme";
import type { VocabularyData } from "src/types";

import { useSpeech } from "../hooks/useSpeech";

export const VocabularyPopup = ({
  word,
  position,
  data,
  onClose,
}: {
  word: string;
  position: { x: number; y: number };
  data?: VocabularyData;
  onClose: () => void;
}) => {
  const { isDarkMode } = useTheme();
  const { isPlaying, speak } = useSpeech();
  const { audioSrc, isLoadingAudio, error, setError } = usePronunciationAudio(
    word,
    data
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup audio on unmount or word change
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [word]);

  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const playAudioFile = async () => {
    const audio = new Audio(audioSrc);
    audioRef.current = audio;

    audio.onended = () => {
      audioRef.current = null;
    };

    audio.onerror = () => {
      stopCurrentAudio();
      setError(`Could not play pronunciation for "${word}"`);
      speak(word); // Fallback to speech synthesis
    };

    try {
      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setError(`Could not play pronunciation for "${word}"`);
      speak(word); // Fallback to speech synthesis
    }
  };

  const handlePlayPronunciation = () => {
    // Stop current audio if playing
    if (isPlaying && audioRef.current) {
      stopCurrentAudio();
      return;
    }

    // Play audio file if available, otherwise use speech synthesis
    if (audioSrc) {
      playAudioFile();
    } else {
      speak(word);
    }
  };

  // Get best match for pronunciation
  const getBestPronunciation = () => {
    if (!data?.pronunciation || !data.pronunciation.length) return null;

    // First try to get one with both text and audio
    const bestMatch = data.pronunciation.find(p => p.text && p.audio);
    if (bestMatch) return bestMatch;

    // Then try to get one with text
    const textMatch = data.pronunciation.find(p => p.text);
    if (textMatch) return textMatch;

    // Last resort, return the first one
    return data.pronunciation[0];
  };

  const bestPronunciation = getBestPronunciation();

  // Function to handle overflow by positioning the popup
  const getPopupPosition = () => {
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    // Calculate left position to prevent overflow
    let left = Math.min(position.x, maxWidth - 320);
    left = Math.max(left, 10); // Ensure at least 10px from left edge

    // Calculate top position to prevent overflow
    let top = position.y + 10;
    if (top + 400 > maxHeight) {
      // If it would overflow bottom, position above the word instead
      top = Math.max(position.y - 410, 10);
    }

    return { left, top };
  };

  const popupPosition = getPopupPosition();

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          bgcolor: "transparent",
        }}
        onClick={onClose}
      />

      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          left: popupPosition.left,
          top: popupPosition.top,
          width: 300,
          maxHeight: 400,
          overflowY: "auto",
          zIndex: 1001,
          borderRadius: 3,
          border: 1,
          borderColor: isDarkMode ? "#334155" : "#e2e8f0",
          bgcolor: "background.paper",
          boxShadow: isDarkMode
            ? "0 4px 20px rgba(0, 0, 0, 0.5)"
            : "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="600" color="primary.main">
              {word}
            </Typography>
            <IconButton size="small" onClick={onClose} sx={{ color: "text.secondary" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {!data && !error ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 3 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Loading...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, py: 2 }}>
              <ErrorOutlineIcon color="error" sx={{ mt: 0.5 }} />
              <Typography variant="body2" color="error.main">
                {error}
              </Typography>
            </Box>
          ) : !data?.meaning || data.meaning.length === 0 ? (
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, py: 2 }}>
              <ErrorOutlineIcon color="warning" sx={{ mt: 0.5 }} />
              <Typography variant="body2" color="warning.main">
                No definition found for "{word}". Try another word.
              </Typography>
            </Box>
          ) : (
            <>
              {bestPronunciation ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontFamily: "monospace" }}
                  >
                    {bestPronunciation.text || word}
                  </Typography>
                  <Tooltip
                    title={audioSrc ? "Play pronunciation" : "Use speech synthesis"}
                  >
                    <IconButton
                      size="small"
                      onClick={handlePlayPronunciation}
                      disabled={isLoadingAudio}
                      sx={{
                        color: isPlaying ? "primary.main" : "text.secondary",
                        animation: isPlaying
                          ? "pulse 1s infinite"
                          : isLoadingAudio
                            ? "pulse 1.5s infinite"
                            : "none",
                        "@keyframes pulse": {
                          "0%": { opacity: 0.6 },
                          "50%": { opacity: 1 },
                          "100%": { opacity: 0.6 },
                        },
                      }}
                    >
                      {isLoadingAudio ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <VolumeUpIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No pronunciation available
                  </Typography>
                  <Tooltip title="Try speech synthesis">
                    <IconButton
                      size="small"
                      onClick={handlePlayPronunciation}
                      sx={{ color: "text.secondary" }}
                    >
                      <VolumeUpIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

              {data?.meaning && data.meaning.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  {data.meaning.map((meaning, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight="600"
                        color="text.primary"
                        gutterBottom
                        sx={{
                          bgcolor: isDarkMode
                            ? "rgba(99, 102, 241, 0.1)"
                            : "rgba(79, 70, 229, 0.05)",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          display: "inline-block",
                        }}
                      >
                        {meaning.partOfSpeech}
                      </Typography>
                      {meaning.definitions.map((def, defIndex) => (
                        <Box key={defIndex} sx={{ mb: 1.5, ml: 1 }}>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ lineHeight: 1.6, mb: 0.5 }}
                          >
                            {def.definition}
                          </Typography>
                          {def.example && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                fontStyle: "italic",
                                display: "block",
                                mb: 1,
                                ml: 1,
                              }}
                            >
                              "{def.example}"
                            </Typography>
                          )}
                          {def.synonyms && def.synonyms.length > 0 && (
                            <Box sx={{ mb: 1, mt: 1 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontWeight: 500 }}
                              >
                                Synonyms:
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={0.5}
                                flexWrap="wrap"
                                useFlexGap
                                sx={{ mt: 0.5 }}
                              >
                                {def.synonyms.slice(0, 3).map((synonym, synIndex) => (
                                  <Chip
                                    key={synIndex}
                                    label={synonym}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: "0.7rem", height: 20 }}
                                  />
                                ))}
                                {def.synonyms.length > 3 && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ alignSelf: "center" }}
                                  >
                                    +{def.synonyms.length - 3} more
                                  </Typography>
                                )}
                              </Stack>
                            </Box>
                          )}
                          {def.antonyms && def.antonyms.length > 0 && (
                            <Box sx={{ mb: 1, mt: 1 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontWeight: 500 }}
                              >
                                Antonyms:
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={0.5}
                                flexWrap="wrap"
                                useFlexGap
                                sx={{ mt: 0.5 }}
                              >
                                {def.antonyms.slice(0, 3).map((antonym, antIndex) => (
                                  <Chip
                                    key={antIndex}
                                    label={antonym}
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                    sx={{ fontSize: "0.7rem", height: 20 }}
                                  />
                                ))}
                                {def.antonyms.length > 3 && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ alignSelf: "center" }}
                                  >
                                    +{def.antonyms.length - 3} more
                                  </Typography>
                                )}
                              </Stack>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  ))}
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight="600"
                  color="text.primary"
                  gutterBottom
                >
                  Vietnamese
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {data?.translation || `Translation not available for "${word}"`}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default VocabularyPopup;
