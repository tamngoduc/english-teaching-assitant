import type React from "react";
import { useCallback, useEffect, useState } from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Chip,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useAuth } from "src/hooks/useAuth";
import { useAutoSend } from "src/hooks/useAutoSend";
import { useConversations } from "src/hooks/useConversations";
import { useRecord } from "src/hooks/useRecord";
import { useTheme } from "src/hooks/useTheme";
import { sendMessage } from "src/services/chat";
import { createMessage } from "src/services/messages";

export const HomeScreen = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { createNewConversation } = useConversations(user);
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Memoized callbacks for useRecord to prevent infinite loops
  const handleTranscript = useCallback((transcript: string) => {
    setInputText(transcript);
  }, []);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || !user?.user_id || isSending) return;

    const messageText = inputText.trim();
    setIsSending(true);
    setInputText(""); // Clear input immediately

    try {
      // Create a new conversation
      const conversationId = await createNewConversation();

      if (conversationId) {
        // Create the user message
        await createMessage({
          conversation_id: conversationId,
          sender: "user",
          content: messageText,
        });

        // Send the message to get AI response
        const chatResponse = await sendMessage(
          messageText,
          user.user_id,
          conversationId
        );

        // Create the AI message
        await createMessage({
          conversation_id: conversationId,
          sender: "ai",
          content: chatResponse.message || "I'm sorry, I couldn't process that message.",
        });

        // Navigate to the new conversation
        navigate(`/chat/${conversationId}`);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
      // Restore input text on error
      setInputText(messageText);
    } finally {
      setIsSending(false);
    }
  }, [
    inputText,
    user?.user_id,
    isSending,
    createNewConversation,
    navigate,
    setInputText,
  ]);

  // Auto-send functionality
  const { handleFocus, handleBlur, handleRecordingStop, clearAutoSendTimeout } =
    useAutoSend({
      text: inputText,
      onSend: handleSend,
      disabled: isSending,
    });

  // Update handleSend to include clearAutoSendTimeout in callback after it's defined
  const wrappedHandleSend = useCallback(async () => {
    clearAutoSendTimeout(); // Clear auto-send when manually sending
    await handleSend();
  }, [handleSend, clearAutoSendTimeout]);

  const { isRecording, start, stop } = useRecord({
    onResult: handleTranscript,
  });

  // Handle recording stop to trigger auto-send timer
  useEffect(() => {
    if (!isRecording) {
      handleRecordingStop();
    }
  }, [isRecording, handleRecordingStop]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        wrappedHandleSend();
      }
    },
    [wrappedHandleSend]
  );

  const handleSuggestionClick = useCallback(
    async (suggestion: string) => {
      if (!user?.user_id || isSending) return;

      setIsSending(true);

      try {
        // Create a new conversation
        const conversationId = await createNewConversation();

        if (conversationId) {
          // Create the user message
          await createMessage({
            conversation_id: conversationId,
            sender: "user",
            content: suggestion,
          });

          // Send the message to get AI response
          const chatResponse = await sendMessage(
            suggestion,
            user.user_id,
            conversationId
          );

          // Create the AI message
          await createMessage({
            conversation_id: conversationId,
            sender: "ai",
            content:
              chatResponse.message || "I'm sorry, I couldn't process that message.",
          });

          // Navigate to the new conversation
          navigate(`/chat/${conversationId}`);
        }
      } catch (error) {
        console.error("Error creating conversation:", error);
      } finally {
        setIsSending(false);
      }
    },
    [user?.user_id, isSending, createNewConversation, navigate]
  );

  const suggestions = [
    "Tell me about your day",
    "Let's practice small talk",
    "Help me with pronunciation",
    "I want to learn business English",
    "Practice job interview questions",
    "Discuss current events",
  ];

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: isDarkMode
            ? "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(79, 70, 229, 0.05) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: isDarkMode
            ? "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(124, 58, 237, 0.04) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            py: 4,
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              mb: 6,
              opacity: 0,
              animation: "fadeInUp 0.8s ease forwards",
              "@keyframes fadeInUp": {
                "0%": {
                  opacity: 0,
                  transform: "translateY(20px)",
                },
                "100%": {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: isDarkMode
                    ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                    : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AutoAwesomeIcon sx={{ color: "white", fontSize: 24 }} />
              </Box>
              <Typography
                variant="h3"
                component="h1"
                fontWeight="700"
                sx={{
                  background: isDarkMode
                    ? "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
                    : "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SpeakFluent AI
              </Typography>
            </Box>

            <Typography
              variant="h5"
              color="text.primary"
              fontWeight="500"
              sx={{ mb: 2, maxWidth: 600, mx: "auto" }}
            >
              Start practicing English with AI-powered conversations
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 500, mx: "auto", lineHeight: 1.6 }}
            >
              Ask questions, practice conversations, or get help with pronunciation. Your
              AI English tutor is ready to help you improve your language skills.
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              maxWidth: 600,
              opacity: 0,
              animation: "fadeInUp 1s ease forwards 0.2s",
              "@keyframes fadeInUp": {
                "0%": {
                  opacity: 0,
                  transform: "translateY(20px)",
                },
                "100%": {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                alignItems: "flex-end",
                gap: 2,
                p: 2,
                borderRadius: 4,
                border: 2,
                borderColor: isDarkMode ? "#334155" : "#e2e8f0",
                bgcolor: "background.paper",
                boxShadow: isDarkMode
                  ? "0 10px 40px rgba(0, 0, 0, 0.3)"
                  : "0 10px 40px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: isDarkMode
                    ? "0 15px 50px rgba(99, 102, 241, 0.2)"
                    : "0 15px 50px rgba(79, 70, 229, 0.15)",
                },
                "&:focus-within": {
                  borderColor: "primary.main",
                  boxShadow: isDarkMode
                    ? "0 15px 50px rgba(99, 102, 241, 0.25)"
                    : "0 15px 50px rgba(79, 70, 229, 0.2)",
                },
              }}
            >
              <IconButton
                onClick={isRecording ? stop : start}
                disabled={isSending}
                sx={{
                  bgcolor: isRecording ? "secondary.main" : "primary.main",
                  color: "white",
                  width: 48,
                  height: 48,
                  "&:hover": {
                    bgcolor: isRecording ? "secondary.dark" : "primary.dark",
                  },
                  "&:disabled": {
                    bgcolor: "action.disabled",
                    color: "action.disabled",
                  },
                }}
              >
                {isRecording ? <MicOffIcon /> : <MicIcon />}
              </IconButton>

              <TextField
                multiline
                maxRows={4}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={
                  isSending
                    ? "Creating conversation..."
                    : "Type your message or use the microphone..."
                }
                variant="standard"
                disabled={isSending}
                sx={{
                  flex: 1,
                  "& .MuiInput-underline:before": { display: "none" },
                  "& .MuiInput-underline:after": { display: "none" },
                  "& .MuiInputBase-input": {
                    fontSize: "1.1rem",
                    lineHeight: 1.5,
                    color: "text.primary",
                    py: 1,
                    "&::placeholder": {
                      color: "text.secondary",
                      opacity: 1,
                    },
                  },
                }}
              />

              <IconButton
                onClick={wrappedHandleSend}
                disabled={!inputText.trim() || isSending}
                sx={{
                  bgcolor:
                    inputText.trim() && !isSending ? "primary.main" : "transparent",
                  color: inputText.trim() && !isSending ? "white" : "text.disabled",
                  width: 48,
                  height: 48,
                  "&:hover": {
                    bgcolor:
                      inputText.trim() && !isSending ? "primary.dark" : "action.hover",
                  },
                  "&:disabled": {
                    color: "text.disabled",
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Paper>

            {isRecording && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "secondary.main",
                  color: "white",
                  opacity: 0,
                  animation: "fadeIn 0.3s ease forwards",
                  "@keyframes fadeIn": {
                    "0%": { opacity: 0, transform: "translateY(-10px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
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
              </Box>
            )}
          </Box>

          <Box
            sx={{
              mt: 4,
              width: "100%",
              maxWidth: 600,
              opacity: 0,
              animation: "fadeInUp 1.2s ease forwards 0.4s",
              "@keyframes fadeInUp": {
                "0%": {
                  opacity: 0,
                  transform: "translateY(20px)",
                },
                "100%": {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, textAlign: "center", fontWeight: 500 }}
            >
              Try these conversation starters:
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              justifyContent="center"
            >
              {suggestions.map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  variant="outlined"
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isSending}
                  sx={{
                    cursor: isSending ? "default" : "pointer",
                    fontSize: "0.875rem",
                    borderRadius: 3,
                    py: 0.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: !isSending
                        ? isDarkMode
                          ? "#334155"
                          : "#f1f5f9"
                        : "transparent",
                      borderColor: !isSending ? "primary.main" : "action.disabled",
                      transform: !isSending ? "translateY(-1px)" : "none",
                      boxShadow: !isSending
                        ? isDarkMode
                          ? "0 4px 12px rgba(99, 102, 241, 0.2)"
                          : "0 4px 12px rgba(79, 70, 229, 0.15)"
                        : "none",
                    },
                    "&:disabled": {
                      opacity: 0.5,
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
