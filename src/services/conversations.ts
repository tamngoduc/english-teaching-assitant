import type { Conversation } from "src/types";

import axios from "./axios";

interface CreateConversationRequest {
  userId: number;
}

interface CreateConversationResponse {
  conversation_id: number;
}

interface ConversationInfoResponse {
  conversation_id: number;
  user_id: number;
  start_time: string;
  end_time: string | null;
}

/**
 * Create a new conversation
 */
export const createConversation = async (
  userId: number
): Promise<CreateConversationResponse> => {
  const request: CreateConversationRequest = { userId };
  const response = await axios.post<CreateConversationResponse>(
    "/conversations",
    request
  );
  return response.data;
};

/**
 * Get all conversations for a user
 */
export const getUserConversations = async (userId: number): Promise<Conversation[]> => {
  const response = await axios.get<Conversation[]>(`/conversations/${userId}`);
  return response.data;
};

/**
 * Get conversation info
 */
export const getConversationInfo = async (
  conversationId: number
): Promise<ConversationInfoResponse> => {
  const response = await axios.get<ConversationInfoResponse>(
    `/conversations/${conversationId}/info`
  );
  return response.data;
};
