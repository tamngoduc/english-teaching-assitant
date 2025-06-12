import { useCallback, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";

import { useAuth } from "src/hooks/useAuth";
import { useChat } from "src/hooks/useChat";
import { useConversations } from "src/hooks/useConversations";

import { stopSpeech } from "../utils/speech";
import { LoadingScreen } from "./LoadingScreen";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import VocabularyPopup from "./VocabularyPopup";

const useScrollToBottom = (dependency: unknown[]) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);
  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependency);
  return { messagesEndRef, scrollToBottom };
};

export const ChatInterface = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const {
    isLoading: isConversationsLoading,
    activeMessages,
    addMessage,
  } = useConversations(user, Number(conversationId));
  const { messagesEndRef } = useScrollToBottom([activeMessages]);
  const {
    inputText,
    isLoading: isChatLoading,
    newAiMessageId,
    vocabularyPopup,
    isDisabled,
    handleInputChange,
    handleSendMessage,
    handleWordClick,
    handleCloseVocabulary,
    clearNewAiMessageId,
  } = useChat(Number(conversationId), user, addMessage);

  // Add global keyboard shortcut to stop speech
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Stop speech when Escape key is pressed
      if (e.key === "Escape") {
        stopSpeech();
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isConversationsLoading) {
    return (
      <Box sx={{ p: 3, height: "100%" }}>
        <LoadingScreen />
      </Box>
    );
  }
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        <MessageList
          messages={activeMessages}
          onWordClick={handleWordClick}
          isLoading={isChatLoading}
          newAiMessageId={newAiMessageId}
          clearNewAiMessageId={clearNewAiMessageId}
        />
        <div ref={messagesEndRef} />
      </Box>

      <Box
        sx={{
          p: 3,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <MessageInput
          value={inputText}
          onChange={handleInputChange}
          onSend={handleSendMessage}
          disabled={isDisabled}
        />
      </Box>

      {vocabularyPopup && (
        <VocabularyPopup
          word={vocabularyPopup.word}
          position={vocabularyPopup.position}
          data={vocabularyPopup.data}
          onClose={handleCloseVocabulary}
        />
      )}
    </Box>
  );
};
