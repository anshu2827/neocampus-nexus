import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CyberpunkCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  glitch?: boolean;
}

export function CyberpunkCard({ children, className, title, glitch = false }: CyberpunkCardProps) {
  return (
    <div className={cn(
      "relative bg-card border border-primary/30 p-6 overflow-hidden group hover:border-primary/60 transition-colors duration-300",
      "before:absolute before:top-0 before:left-0 before:w-2 before:h-2 before:border-t-2 before:border-l-2 before:border-primary before:content-['']",
      "after:absolute after:bottom-0 after:right-0 after:w-2 after:h-2 after:border-b-2 after:border-r-2 after:border-primary after:content-['']",
      className
    )}>
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.025)_50%)] bg-[length:100%_4px] pointer-events-none" />
      
      {title && (
        <div className="mb-4 flex items-center justify-between border-b border-primary/20 pb-2">
          <h3 className={cn(
            "text-lg font-bold tracking-tighter text-primary uppercase",
            glitch && "animate-pulse"
          )}>
            {title}
          </h3>
          <div className="h-2 w-2 bg-primary animate-ping" />
        </div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Corner accents */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-secondary/10 to-transparent pointer-events-none" />
    </div>
  );
}
