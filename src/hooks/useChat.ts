import { useCallback, useState } from "react";

import { sendMessage } from "src/services/chat";
import { createMessage } from "src/services/messages";
import { getWordInfo } from "src/services/vocabulary";
import type { Message, User, VocabularyData } from "src/types";

// Types
interface CreateMessageRequest {
  conversation_id: number;
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface VocabularyPopupState {
  word: string;
  position: { x: number; y: number };
  data?: VocabularyData;
}

// Helpers
const createTempMessage = (conversationId: number, content: string): Message => ({
  message_id: Date.now(),
  conversation_id: conversationId,
  sender: "user",
  content,
  timestamp: new Date().toISOString(),
});

const createMessageRequest = (
  conversationId: number,
  sender: "user" | "ai",
  content: string
): CreateMessageRequest => ({
  conversation_id: conversationId,
  sender,
  content,
  timestamp: new Date(),
});

export const useChat = (
  conversationId: number | null,
  user: User | null,
  onAddMessage: (message: Message) => void
) => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newAiMessageId, setNewAiMessageId] = useState<number | null>(null);
  const [vocabularyPopup, setVocabularyPopup] = useState<VocabularyPopupState | null>(
    null
  );

  const isDisabled = isLoading || !conversationId;

  const handleInputChange = useCallback((value: string) => {
    setInputText(value);
  }, []);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !conversationId || !user?.user_id) return;

      setIsLoading(true);
      setInputText("");
      // Don't clear newAiMessageId here - let it be cleared only after new AI message is set

      try {
        const tempUserMessage = createTempMessage(conversationId, text);
        onAddMessage(tempUserMessage);

        const [chatResponse] = await Promise.all([
          sendMessage(text, user.user_id, conversationId),
          createMessage(createMessageRequest(conversationId, "user", text)),
        ]);

        const aiContent =
          chatResponse.message || "I'm sorry, I couldn't process that message.";

        const aiMessageResponse = await createMessage(
          createMessageRequest(conversationId, "ai", aiContent)
        );

        const aiMessage: Message = {
          message_id: aiMessageResponse.message_id || Date.now() + 1,
          conversation_id: conversationId,
          sender: "ai",
          content: aiContent,
          timestamp: new Date().toISOString(),
        };

        onAddMessage(aiMessage);
        // Clear any previous newAiMessageId and set the new one
        setNewAiMessageId(null);
        // Use a small delay to ensure the previous auto-play is stopped before setting new ID
        setTimeout(() => {
          setNewAiMessageId(aiMessage.message_id);
        }, 50);
      } catch (err) {
        console.error("Error sending message:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, user?.user_id, onAddMessage]
  );

  const handleWordClick = useCallback(async (word: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const position = { x: rect.left, y: rect.bottom + window.scrollY };

    setVocabularyPopup({ word, position });

    try {
      const data = await getWordInfo(word);
      setVocabularyPopup(prev => (prev ? { ...prev, data } : null));
    } catch (err) {
      console.error("Error fetching vocabulary data:", err);
      setVocabularyPopup(prev => (prev ? { ...prev, data: undefined } : null));
    }
  }, []);

  const handleCloseVocabulary = useCallback(() => {
    setVocabularyPopup(null);
  }, []);

  const clearNewAiMessageId = useCallback(() => {
    setNewAiMessageId(null);
  }, []);

  return {
    inputText,
    isLoading,
    newAiMessageId,
    vocabularyPopup,
    isDisabled,
    handleInputChange,
    handleSendMessage,
    handleWordClick,
    handleCloseVocabulary,
    clearNewAiMessageId,
  };
};
