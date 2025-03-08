
import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  variant?: "default" | "subtle" | "elevated";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, as: Component = "div", variant = "default", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "glass-morph p-6 transition-all duration-300",
          variant === "default" && "bg-white/80",
          variant === "subtle" && "bg-white/60",
          variant === "elevated" && "shadow-elegant-hover bg-white/90",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
