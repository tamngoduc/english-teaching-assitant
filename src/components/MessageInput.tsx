import type React from "react";
import { useCallback } from "react";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import SendIcon from "@mui/icons-material/Send";
import { Box, IconButton, Paper, TextField, Typography } from "@mui/material";

import { useRecord } from "src/hooks/useRecord";
import { useTheme } from "src/hooks/useTheme";

export const MessageInput = ({
  value,
  onChange,
  onSend,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: (text: string) => void;
  disabled?: boolean;
}) => {
  const { isDarkMode } = useTheme();

  const { isRecording, isSpeechSupported, toggleRecording } = useRecord({
    onTranscript: useCallback(
      (transcript: string) => {
        onChange(value + " " + transcript);
      },
      [onChange, value]
    ),
    onError: useCallback((error: Event) => {
      console.error("Speech recognition error:", error);
    }, []),
  });

  const handleSend = useCallback(() => {
    if (value.trim() && !disabled) {
      onSend(value);
    }
  }, [value, disabled, onSend]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <Box sx={{ position: "relative", maxWidth: 768, mx: "auto" }}>
      {!isSpeechSupported && (
        <Box sx={{ mb: 1.5, textAlign: "center" }}>
          <Typography variant="caption" color="error.main">
            Speech recognition is not supported in your browser.
          </Typography>
        </Box>
      )}

      <Paper
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: 1.5,
          p: 1.5,
          borderRadius: 3,
          border: 1,
          borderColor: isDarkMode ? "#334155" : "#e2e8f0",
          bgcolor: "background.paper",
        }}
      >
        <IconButton
          onClick={toggleRecording}
          disabled={disabled || isSpeechSupported !== true}
          sx={{
            bgcolor: isRecording ? "secondary.main" : "primary.main",
            color: "white",
            width: 40,
            height: 40,
            "&:hover": {
              bgcolor: isRecording ? "secondary.dark" : "primary.dark",
            },
            "&:disabled": {
              bgcolor: "action.disabled",
              color: "action.disabled",
            },
          }}
        >
          {isRecording ? <MicOffIcon fontSize="small" /> : <MicIcon fontSize="small" />}
        </IconButton>

        <TextField
          multiline
          maxRows={4}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message or use the microphone..."
          variant="standard"
          disabled={disabled}
          sx={{
            flex: 1,
            "& .MuiInput-underline:before": { display: "none" },
            "& .MuiInput-underline:after": { display: "none" },
            "& .MuiInputBase-input": {
              fontSize: "0.95rem",
              lineHeight: 1.5,
              color: "text.primary",
              "&::placeholder": {
                color: "text.secondary",
                opacity: 1,
              },
            },
          }}
        />

        <IconButton
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          sx={{
            color: value.trim() && !disabled ? "primary.main" : "text.disabled",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Paper>

      {isRecording && (
        <Box
          sx={{
            position: "absolute",
            top: -50,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          <Paper
            elevation={4}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              bgcolor: "secondary.main",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "white",
                animation: "pulse 1s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                },
              }}
            />
            <Typography variant="body2" fontWeight="500">
              Listening...
            </Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
};
