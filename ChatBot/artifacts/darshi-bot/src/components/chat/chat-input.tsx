import { useState, useRef, useEffect } from "react";
import { Send, Smile, Paperclip } from "lucide-react";
import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Handle clicking outside of emoji picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setShowEmoji(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput("");
    setShowEmoji(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onEmojiClick = (emojiData: any) => {
    const cursor = textareaRef.current?.selectionStart || input.length;
    const newText = input.slice(0, cursor) + emojiData.emoji + input.slice(cursor);
    setInput(newText);
    
    // Maintain focus after emoji selection
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(cursor + emojiData.emoji.length, cursor + emojiData.emoji.length);
      }
    }, 10);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Emoji Picker Popover */}
      {showEmoji && (
        <div ref={emojiRef} className="absolute bottom-full left-0 mb-4 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div className="shadow-2xl rounded-2xl overflow-hidden border border-border">
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme={theme === "dark" ? EmojiTheme.DARK : EmojiTheme.LIGHT}
              lazyLoadEmojis
            />
          </div>
        </div>
      )}

      <div className={cn(
        "relative flex items-end w-full rounded-2xl md:rounded-3xl border border-border/80",
        "bg-card/50 backdrop-blur-xl shadow-lg shadow-black/5",
        "transition-all duration-300 ease-in-out focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 focus-within:bg-card/90"
      )}>
        <div className="flex p-3 sm:p-4 gap-2">
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors shrink-0"
            onClick={() => setShowEmoji(!showEmoji)}
            title="Add Emoji"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask DarshiBot anything..."
          className={cn(
            "w-full max-h-[120px] py-4 md:py-5 bg-transparent border-none outline-none resize-none",
            "text-[15px] sm:text-base text-foreground placeholder:text-muted-foreground",
            "scrollbar-thin scrollbar-thumb-muted"
          )}
          rows={1}
          disabled={disabled}
        />

        <div className="p-2 sm:p-3 shrink-0">
          <button
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            className={cn(
              "flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl transition-all duration-200",
              input.trim() && !disabled
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            )}
          >
            <Send className="w-5 h-5 ml-0.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
      <div className="text-center mt-3 mb-1">
        <p className="text-[11px] text-muted-foreground font-medium flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          DarshiBot is ready to assist you.
        </p>
      </div>
    </div>
  );
}
