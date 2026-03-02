import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: React.ReactNode;
  className?: string;
  haptic?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, className, haptic = true, onClick, ...props }, ref) => {
    const { hapticsEnabled } = useStore();

    const baseStyles = "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-[#1A1A1A] text-white hover:bg-[#2A2A2A] shadow-[0_8px_20px_rgba(0,0,0,0.15)]",
      secondary: "bg-white/40 text-[#1A1A1A] hover:bg-white/60 border border-white/60 backdrop-blur-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,0.8)]",
      danger: "bg-[#F87171] text-white hover:bg-[#F87171]/90 shadow-[0_8px_16px_rgba(248,113,113,0.2)]",
      ghost: "hover:bg-black/5 text-[#1A1A1A]",
      outline: "border border-black/10 bg-transparent hover:bg-black/5 text-[#1A1A1A]",
    };

    const sizes = {
      sm: "h-10 px-4 text-xs rounded-full",
      md: "h-14 px-8 text-sm rounded-full",
      lg: "h-16 px-10 text-base rounded-full",
      icon: "h-14 w-14 rounded-full",
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (haptic && hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50); // Short vibration
      }
      if (onClick) onClick(e);
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        onClick={handleClick}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
