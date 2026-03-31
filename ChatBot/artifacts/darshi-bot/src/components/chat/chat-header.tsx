import { Moon, Sun, Trash2, Bot } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

interface ChatHeaderProps {
  onClear: () => void;
}

export function ChatHeader({ onClear }: ChatHeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-border/50 supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-md opacity-40 rounded-full" />
            <img
              src={`${import.meta.env.BASE_URL}images/darshibot-avatar.png`}
              alt="DarshiBot Logo"
              className="relative w-10 h-10 rounded-full border-2 border-background object-cover shadow-sm"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              DarshiBot
            </h1>
            <p className="text-[11px] font-medium text-muted-foreground -mt-1 tracking-wide uppercase">
              AI Assistant
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onClear}
            className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
          
          <div className="w-px h-5 bg-border mx-1" />

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            title="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
