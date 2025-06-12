import type { Message } from "src/types";

import axios from "./axios";

interface SendMessageRequest {
  text: string;
  userId?: number;
  conversationId?: number;
}

interface SendMessageResponse {
  message: string;
  success?: boolean;
}

interface ChatHistoryResponse {
  history: Message[];
}

/**
 * Send a message to the chatbot
 */
export const sendMessage = async (
  text: string,
  userId?: number,
  conversationId?: number
): Promise<SendMessageResponse> => {
  const request: SendMessageRequest = {
    text,
    userId,
    conversationId,
  };
  const response = await axios.post<SendMessageResponse>("/chat/message", request);
  return response.data;
};

/**
 * Get chat history
 */
export const getChatHistory = async (): Promise<ChatHistoryResponse> => {
  const response = await axios.get<ChatHistoryResponse>("/chat/history");
  return response.data;
};
