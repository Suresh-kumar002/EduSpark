import { useState, useEffect, useRef } from "react";
import { createConversation } from "@workspace/api-client-react";

export type MessageRole = "user" | "assistant" | "system";

export interface LocalMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

const STORAGE_KEY_MESSAGES = "darshibot_messages";
const STORAGE_KEY_CONV_ID = "darshibot_conversation_id";

export function useChat() {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const isInitializing = useRef(false);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY_MESSAGES);
    const savedConvId = localStorage.getItem(STORAGE_KEY_CONV_ID);

    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to parse saved messages", e);
      }
    } else {
      // Add initial greeting if no history
      setMessages([
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Hello! 👋 I'm DarshiBot. How can I help you today?",
          createdAt: new Date().toISOString(),
        }
      ]);
    }

    if (savedConvId) {
      setConversationId(parseInt(savedConvId, 10));
    } else {
      initConversation();
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    }
  }, [messages]);

  const initConversation = async () => {
    if (isInitializing.current) return;
    isInitializing.current = true;
    try {
      const conv = await createConversation();
      setConversationId(conv.id);
      localStorage.setItem(STORAGE_KEY_CONV_ID, conv.id.toString());
    } catch (error) {
      console.error("Failed to create conversation. Will use fallback mode.", error);
    } finally {
      isInitializing.current = false;
    }
  };

  const getFallbackReply = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.match(/hi|hello|hey|greetings/)) {
      return "Hello! 👋 I'm DarshiBot, your AI assistant. How can I help you today?";
    } else if (lower.match(/who are you|what are you/)) {
      return "I'm DarshiBot, an AI chatbot built to assist you! Ask me anything. 🤖";
    } else if (lower.match(/how are you/)) {
      return "I'm doing great, thank you for asking! How can I assist you today? 😊";
    } else if (lower.match(/bye|goodbye|cya/)) {
      return "Goodbye! 👋 Feel free to come back anytime!";
    }
    return "I'm having trouble connecting right now. Please try again in a moment. 🔧";
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: LocalMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setStreamingContent("");

    try {
      if (!conversationId) {
        throw new Error("No conversation ID");
      }

      const response = await fetch(`/api/openai/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullAssistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((line) => line.trim().startsWith("data: "));

        for (const line of lines) {
          const dataStr = line.replace("data: ", "").trim();
          if (!dataStr) continue;

          try {
            const data = JSON.parse(dataStr);
            if (data.done) {
              // Stream finished
              setIsTyping(false);
              setMessages((prev) => [
                ...prev,
                {
                  id: (Date.now() + 1).toString(),
                  role: "assistant",
                  content: fullAssistantMessage,
                  createdAt: new Date().toISOString(),
                },
              ]);
              setStreamingContent("");
              return;
            } else if (data.content) {
              fullAssistantMessage += data.content;
              setStreamingContent(fullAssistantMessage);
            }
          } catch (e) {
            console.warn("Failed to parse SSE chunk", dataStr);
          }
        }
      }
    } catch (error) {
      console.warn("API failed, using fallback:", error);
      // Fallback mode
      setTimeout(() => {
        setIsTyping(false);
        setStreamingContent("");
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: getFallbackReply(content),
            createdAt: new Date().toISOString(),
          },
        ]);
      }, 1000);
    }
  };

  const clearChat = () => {
    localStorage.removeItem(STORAGE_KEY_MESSAGES);
    localStorage.removeItem(STORAGE_KEY_CONV_ID);
    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content: "Chat cleared! How can I help you next? ✨",
        createdAt: new Date().toISOString(),
      }
    ]);
    setConversationId(null);
    initConversation();
  };

  return {
    messages,
    isTyping,
    streamingContent,
    sendMessage,
    clearChat,
  };
}
