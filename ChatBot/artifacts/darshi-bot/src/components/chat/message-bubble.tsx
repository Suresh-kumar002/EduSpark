import { motion } from "framer-motion";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import type { LocalMessage } from "@/hooks/use-chat";

interface MessageBubbleProps {
  message: LocalMessage | { role: "assistant"; content: string; createdAt: string; isStreaming: true };
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isStreaming = "isStreaming" in message ? message.isStreaming : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex flex-col w-full mb-6", isUser ? "items-end" : "items-start")}
    >
      {!isUser && (
        <div className="flex items-center space-x-2 mb-1.5 ml-1">
          <img
            src={`${import.meta.env.BASE_URL}images/darshibot-avatar.png`}
            alt="DarshiBot"
            className="w-5 h-5 rounded-full ring-1 ring-border/50 shadow-sm object-cover"
          />
          <span className="text-xs font-semibold text-muted-foreground">DarshiBot</span>
        </div>
      )}

      <div
        className={cn(
          "px-5 py-3.5 max-w-[85%] md:max-w-[75%] lg:max-w-[65%] leading-relaxed shadow-sm",
          isUser
            ? "bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-2xl rounded-tr-sm rounded-bl-2xl shadow-primary/20"
            : "bg-card text-card-foreground border border-border/60 rounded-2xl rounded-tl-sm rounded-br-2xl shadow-black/5"
        )}
      >
        <div className={cn("prose prose-sm max-w-none break-words", isUser ? "prose-invert" : "dark:prose-invert")}>
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-primary transition-colors" {...props} />,
              p: ({ node, ...props }) => <p className="m-0 whitespace-pre-wrap" {...props} />,
              pre: ({ node, ...props }) => <pre className="bg-black/50 p-3 rounded-lg overflow-x-auto text-xs my-2 border border-white/10" {...props} />,
              code: ({ node, ...props }) => <code className="bg-black/20 px-1 py-0.5 rounded text-[0.9em]" {...props} />,
            }}
          >
            {message.content}
          </ReactMarkdown>
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 ml-1 bg-primary align-middle animate-pulse" />
          )}
        </div>
      </div>

      <span className={cn("text-[10px] text-muted-foreground mt-1.5 font-medium", isUser ? "mr-1" : "ml-1")}>
        {format(new Date(message.createdAt), "h:mm a")}
      </span>
    </motion.div>
  );
}
