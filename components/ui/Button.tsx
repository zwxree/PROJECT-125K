import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'liquid-purple' | 'liquid-teal' | 'liquid-glass' | 'solid-white';
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
      primary: "bg-white/10 text-white hover:bg-white/20 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]",
      secondary: "bg-black/40 text-white hover:bg-black/60 border border-white/10 backdrop-blur-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]",
      danger: "bg-red-500/80 text-white hover:bg-red-500 border border-red-400/50 shadow-[0_8px_16px_rgba(239,68,68,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]",
      ghost: "hover:bg-white/10 text-gray-300 hover:text-white",
      outline: "border border-white/20 bg-transparent hover:bg-white/10 text-gray-300 hover:text-white",
      'liquid-purple': "bg-gradient-to-b from-purple-500/40 to-purple-700/40 backdrop-blur-2xl border border-purple-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_32px_rgba(168,85,247,0.4)] text-white font-semibold",
      'liquid-teal': "bg-gradient-to-b from-teal-400/40 to-teal-600/40 backdrop-blur-2xl border border-teal-300/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_32px_rgba(45,212,191,0.4)] text-white font-semibold",
      'liquid-glass': "bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.4)] text-gray-300 font-medium hover:bg-white/10 hover:text-white",
      'solid-white': "bg-white/90 backdrop-blur-sm shadow-[0_4px_10px_rgba(0,0,0,0.2)] text-gray-900 font-medium hover:bg-white",
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
