import * as authApi from "./auth";
import * as chatApi from "./chat";
import * as conversationsApi from "./conversations";
import * as messagesApi from "./messages";
import * as vocabularyApi from "./vocabulary";

// Export individual modules
export { authApi, chatApi, conversationsApi, messagesApi, vocabularyApi };

// Export types
export * from "../types";

// Export base axios instance
export { default as axios } from "./axios";

// Export all functions directly for convenience
export const { register, login } = authApi;

export const { sendMessage, getChatHistory } = chatApi;

export const { createConversation, getUserConversations, getConversationInfo } =
  conversationsApi;

export const { getConversationMessages, createMessage } = messagesApi;

export const { getWordInfo, fetchWordDetails } = vocabularyApi;
