import { useState, useCallback, useEffect } from "react";
import { ApiError } from "@/lib/api/types";
import type { ChatMessage, ChatSource } from "@/lib/api/chat.types";
import { initChatSession, saveChatMessages } from "@/lib/chat-session";
import { streamChatAnswer } from "@/services/chatbot.service";

export type { ChatMessage as Message } from "@/lib/api/chat.types";

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages(initChatSession());
    setIsSessionReady(true);
  }, []);

  useEffect(() => {
    if (!isSessionReady) {
      return;
    }
    saveChatMessages(messages);
  }, [messages, isSessionReady]);

  const sendMessage = useCallback(async (question: string, hindi?: boolean) => {
    setIsLoading(true);
    setError(null);

    let history: Pick<ChatMessage, "role" | "content">[] = [];
    setMessages((prev) => {
      history = prev.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
      return [...prev, { role: "user", content: question }];
    });

    try {
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let currentAnswer = "";
      let currentSources: ChatSource[] = [];
      let currentRelatedOptions: string[] = [];

      const payload = {
        question,
        conversationHistory: history,
        ...(hindi !== undefined ? { hindi } : {}),
      };

      for await (const event of streamChatAnswer(payload)) {
        if (event.type === "sources") {
          currentSources = event.data;
        } else if (event.type === "token") {
          currentAnswer += event.data;
        } else if (event.type === "relatedOptions") {
          currentRelatedOptions = event.data;
        } else if (event.type === "done" && event.data) {
          currentAnswer = event.data;
        }

        if (
          event.type === "token" ||
          event.type === "done" ||
          event.type === "sources" ||
          event.type === "relatedOptions"
        ) {
          setMessages((prev) => {
            const updated = [...prev];
            const lastMessage = updated[updated.length - 1];
            if (lastMessage?.role === "assistant") {
              updated[updated.length - 1] = {
                ...lastMessage,
                content: currentAnswer,
                sources: currentSources,
                relatedOptions: currentRelatedOptions,
              };
            }
            return updated;
          });
        }
      }
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "An error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
}
