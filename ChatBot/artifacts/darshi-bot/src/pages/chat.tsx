import { useEffect, useRef } from "react";
import { useChat } from "@/hooks/use-chat";
import { MessageBubble } from "@/components/chat/message-bubble";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatHeader } from "@/components/chat/chat-header";
import { BotMessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export function ChatPage() {
  const { messages, isTyping, streamingContent, sendMessage, clearChat } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent, isTyping]);

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden relative">
      {/* Decorative ambient background */}
      <div className="bg-blob w-[600px] h-[600px] top-[-100px] left-[-200px] bg-primary/20 dark:bg-primary/30" />
      <div className="bg-blob w-[500px] h-[500px] bottom-[-200px] right-[-100px] bg-accent/20 dark:bg-accent/30" />

      <ChatHeader onClear={clearChat} />

      <main className="flex-1 overflow-y-auto w-full relative" ref={scrollRef}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-end min-h-full">
          
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 space-y-6 animate-in fade-in duration-700 pb-20">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/20 transform rotate-3">
                  <BotMessageSquare className="w-12 h-12 text-white -rotate-3" />
                </div>
              </div>
              <div className="max-w-md space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Welcome to DarshiBot</h2>
                <p className="text-muted-foreground text-lg">
                  Your intelligent companion. Ask me anything, and I'll do my best to help you out!
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mt-8">
                {["Who are you?", "Tell me a joke", "Write a haiku about code", "How do I center a div?"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="p-4 text-sm font-medium text-left bg-card hover:bg-secondary border border-border/60 hover:border-primary/50 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col pb-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              
              {streamingContent && (
                <MessageBubble
                  message={{
                    role: "assistant",
                    content: streamingContent,
                    createdAt: new Date().toISOString(),
                    isStreaming: true,
                  }}
                />
              )}

              {isTyping && !streamingContent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <TypingIndicator />
                </motion.div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="w-full bg-gradient-to-t from-background via-background/95 to-transparent pt-6 pb-4 md:pb-6 px-4 sm:px-6 relative z-10 shrink-0">
        <ChatInput onSend={sendMessage} disabled={isTyping && !streamingContent} />
      </footer>
    </div>
  );
}
