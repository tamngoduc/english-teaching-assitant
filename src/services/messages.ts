import type { Message } from "src/types";

import axios from "./axios";

interface CreateMessageRequest {
  conversation_id: number;
  sender: "user" | "ai";
  content: string;
}

/**
 * Get all messages for a conversation
 */
export const getConversationMessages = async (
  conversationId: number
): Promise<Message[]> => {
  const response = await axios.get<Message[]>(`/messages/${conversationId}`);
  return response.data;
};

/**
 * Create a new message
 */
export const createMessage = async (data: CreateMessageRequest): Promise<Message> => {
  const response = await axios.post<Message>("/messages", data);
  return response.data;
};
