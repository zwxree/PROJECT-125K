import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, interactive = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-[32px]",
          "bg-white/40 backdrop-blur-[40px]",
          "border border-white/50",
          "shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,0.8),inset_2px_0_4px_rgba(255,255,255,0.8)]",
          className
        )}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
