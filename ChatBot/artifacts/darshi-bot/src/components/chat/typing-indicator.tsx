import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TypingIndicator() {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -5 },
  };

  const transition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut",
  };

  return (
    <div className="flex flex-col space-y-1 items-start max-w-[80%]">
      <div className="flex items-center space-x-2">
        <span className="text-xs font-medium text-muted-foreground ml-1">DarshiBot is typing</span>
      </div>
      <div className={cn(
        "px-4 py-4 rounded-2xl rounded-tl-sm w-fit",
        "bg-card border border-border shadow-sm",
        "flex items-center space-x-1.5"
      )}>
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-primary/60"
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{ ...transition, delay: 0 }}
        />
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-primary/60"
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{ ...transition, delay: 0.15 }}
        />
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-primary/60"
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{ ...transition, delay: 0.3 }}
        />
      </div>
    </div>
  );
}
