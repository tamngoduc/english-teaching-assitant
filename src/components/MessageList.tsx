import type React from "react";
import { Box, Typography } from "@mui/material";

import type { Message } from "src/types";

import { LoadingIndicator } from "./LoadingIndicator";
import { MessageBubble } from "./MessageBubble";

export const MessageList = ({
  messages,
  onWordClick,
  isLoading,
  newAiMessageId,
  clearNewAiMessageId,
}: {
  messages: Message[];
  onWordClick: (word: string, event: React.MouseEvent) => void;
  isLoading: boolean;
  newAiMessageId: number | null;
  clearNewAiMessageId: () => void;
}) => {
  return (
    <Box sx={{ maxWidth: 768, mx: "auto" }}>
      {messages.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Start a conversation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Begin practicing your English with AI assistance
          </Typography>
        </Box>
      )}

      {messages.map(message => (
        <MessageBubble
          key={message.message_id}
          message={message}
          onWordClick={onWordClick}
          newAiMessageId={newAiMessageId}
          clearNewAiMessageId={clearNewAiMessageId}
        />
      ))}

      {isLoading && <LoadingIndicator />}
    </Box>
  );
};
