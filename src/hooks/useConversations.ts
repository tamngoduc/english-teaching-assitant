import { useCallback, useEffect, useRef, useState } from "react";

import { createConversation, getUserConversations } from "src/services/conversations";
import { getConversationMessages } from "src/services/messages";
import type { Conversation, Message, User } from "src/types";

export const useConversations = (
  user: User | null,
  activeConversationId: number | null = null
) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const cache = useRef<Map<number, Message[]>>(new Map());

  const loadConversations = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const list = await getUserConversations(user.user_id);
      setConversations(list);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id]);

  const loadMessages = useCallback(async () => {
    if (!activeConversationId) return;
    setIsLoading(true);

    try {
      if (cache.current.has(activeConversationId)) {
        setMessages(cache.current.get(activeConversationId)!);
      } else {
        const fetched = await getConversationMessages(activeConversationId);
        cache.current.set(activeConversationId, fetched);
        setMessages(fetched);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (activeConversationId) {
      loadMessages();
    }
  }, [activeConversationId, loadMessages]);

  const createNewConversation = useCallback(async (): Promise<number | null> => {
    if (!user) return null;
    setIsLoading(true);

    try {
      const { conversation_id } = await createConversation(user.user_id);
      const newConv: Conversation = {
        conversation_id,
        user_id: user.user_id,
        start_time: new Date().toISOString(),
        end_time: null,
      };

      setConversations(prev => [newConv, ...prev]);
      setMessages([]);
      cache.current.set(conversation_id, []);

      return conversation_id;
    } catch (err) {
      console.error("Failed to create conversation:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id]);

  const addMessage = useCallback(
    (message: Message) => {
      const { conversation_id } = message;
      if (!conversation_id) return;

      if (conversation_id === activeConversationId) {
        setMessages(prev => [...prev, message]);
      }

      const cached = cache.current.get(conversation_id) || [];
      cache.current.set(conversation_id, [...cached, message]);
    },
    [activeConversationId]
  );

  return {
    conversations,
    activeMessages: messages,
    isLoading,
    loadConversations,
    loadMessages,
    createNewConversation,
    addMessage,
  };
};
