
import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AnimatedTransitionProps {
  children: React.ReactNode;
  show: boolean;
  className?: string;
  animation?: "fade" | "slide-up" | "slide-down" | "scale";
  duration?: number;
}

export const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  show,
  className,
  animation = "fade",
  duration = 300,
}) => {
  const [render, setRender] = useState(show);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show) setRender(true);
    const timer = setTimeout(() => {
      if (!show) setRender(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [show, duration]);

  if (!render) return null;

  const getAnimationClass = () => {
    if (animation === "fade") {
      return show ? "animate-fade-in" : "animate-fade-out";
    } else if (animation === "slide-up") {
      return show ? "animate-slide-up" : "animate-fade-out";
    } else if (animation === "slide-down") {
      return show ? "animate-slide-down" : "animate-fade-out";
    } else if (animation === "scale") {
      return show ? "animate-scale-in" : "animate-fade-out";
    }
    return "";
  };

  return (
    <div
      ref={nodeRef}
      className={cn(
        "transition-all",
        getAnimationClass(),
        show ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};
