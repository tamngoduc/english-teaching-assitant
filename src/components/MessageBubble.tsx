import type React from "react";
import { useEffect } from "react";
import PersonIcon from "@mui/icons-material/Person";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import StopIcon from "@mui/icons-material/Stop";
import { Box, IconButton, Typography } from "@mui/material";

import { useAudioAutoPlay } from "src/hooks/useAudio";
import { useTheme } from "src/hooks/useTheme";

import { useSpeech } from "../hooks/useSpeech";
import type { Message } from "../types";

export const MessageBubble = ({
  message,
  onWordClick,
  newAiMessageId,
  clearNewAiMessageId,
}: {
  message: Message;
  onWordClick: (word: string, event: React.MouseEvent) => void;
  newAiMessageId: number | null;
  clearNewAiMessageId: () => void;
}) => {
  const { isDarkMode } = useTheme();
  const { isPlaying, currentTextId, speak } = useSpeech();
  const { autoPlayTTS } = useAudioAutoPlay();
  const isUser = message.sender === "user";

  useEffect(() => {
    // Only auto-play if:
    // 1. Auto-play is enabled
    // 2. It's an AI message
    // 3. This message is not currently playing (prevents re-triggering during playback)
    // 4. Either this message is the new AI message that should be auto-played,
    //    OR it's a new conversation and this is the first AI message
    const shouldAutoPlay =
      autoPlayTTS &&
      !isUser &&
      currentTextId !== message.message_id &&
      newAiMessageId === message.message_id;

    if (shouldAutoPlay) {
      speak(message.content, message.message_id);
      // Clear the newAiMessageId after triggering auto-play to prevent re-triggering
      if (newAiMessageId === message.message_id) {
        setTimeout(() => {
          clearNewAiMessageId();
        }, 100);
      }
    }
  }, [
    autoPlayTTS,
    isUser,
    message.content,
    message.message_id,
    newAiMessageId,
    currentTextId,
    speak,
    clearNewAiMessageId,
  ]);

  const isCurrentlyPlaying = isPlaying && currentTextId === message.message_id;

  const handleWordClick = (word: string, event: React.MouseEvent) => {
    // Clean the word - remove punctuation and convert to lowercase
    const cleanedWord = word
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
      .toLowerCase()
      .trim();

    if (!cleanedWord) return; // Skip empty words

    // Pass the cleaned word to the parent component
    onWordClick(cleanedWord, event);
  };

  const renderClickableText = (text: string) => {
    const words = text.split(/(\s+)/);
    return words.map((word, index) => {
      const cleanWord = word.trim();
      if (!cleanWord || /^\s+$/.test(word)) {
        return <span key={index}>{word}</span>;
      }

      return (
        <span
          key={index}
          onClick={e => handleWordClick(cleanWord, e)}
          style={{
            cursor: "pointer",
            borderRadius: "4px",
            padding: "1px 2px",
            display: "inline-block",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            const element = e.target as HTMLElement;
            if (isUser) {
              element.style.backgroundColor = isDarkMode
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(255, 255, 255, 0.3)";
            } else {
              element.style.backgroundColor = isDarkMode ? "#334155" : "#f1f5f9";
            }
            element.style.padding = "1px 4px";
            element.style.margin = "0 -2px";
            element.style.transform = "scale(1.05)";
            element.style.boxShadow = isDarkMode ? "0 1px 0 #6366f1" : "0 1px 0 #4f46e5";
          }}
          onMouseLeave={e => {
            const element = e.target as HTMLElement;
            element.style.backgroundColor = "transparent";
            element.style.padding = "1px 2px";
            element.style.margin = "0";
            element.style.transform = "scale(1)";
            element.style.boxShadow = "none";
          }}
        >
          {word}
        </span>
      );
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 3,
        alignItems: "flex-start",
        gap: 2,
      }}
    >
      {!isUser && (
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            background: isDarkMode
              ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
              : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <SmartToyIcon sx={{ color: "white", fontSize: 18 }} />
        </Box>
      )}

      <Box sx={{ maxWidth: "75%" }}>
        <Box
          sx={{
            p: 2.5,
            bgcolor: isUser
              ? isDarkMode
                ? "#6366f1"
                : "#4f46e5"
              : isDarkMode
                ? "#1e293b"
                : "#f8fafc",
            color: isUser ? "white" : isDarkMode ? "#f8fafc" : "#1e293b",
            borderRadius: 3,
            border: isUser ? "none" : 1,
            borderColor: isDarkMode ? "#334155" : "#e2e8f0",
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <Typography
              variant="body1"
              sx={{ flex: 1, lineHeight: 1.6, fontSize: "0.95rem" }}
            >
              {renderClickableText(message.content)}
            </Typography>

            {!isUser && (
              <IconButton
                size="small"
                onClick={() => speak(message.content, message.message_id)}
                sx={{
                  color: isDarkMode ? "#94a3b8" : "#64748b",
                  "&:hover": {
                    bgcolor: isDarkMode ? "#334155" : "#f1f5f9",
                  },
                  ml: 1,
                }}
              >
                {isCurrentlyPlaying ? (
                  <StopIcon fontSize="small" />
                ) : (
                  <PlayArrowIcon fontSize="small" />
                )}
              </IconButton>
            )}
          </Box>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 1.5,
              opacity: 0.7,
              textAlign: isUser ? "right" : "left",
              fontSize: "0.75rem",
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Box>
      </Box>

      {isUser && (
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: isDarkMode ? "#374151" : "#e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <PersonIcon sx={{ color: isDarkMode ? "#9ca3af" : "#6b7280", fontSize: 18 }} />
        </Box>
      )}
    </Box>
  );
};
