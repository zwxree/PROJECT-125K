import React from 'react';
import { motion } from 'motion/react';

interface NutrientRingProps {
  percentage: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  pulse?: boolean;
}

export const NutrientRing: React.FC<NutrientRingProps> = ({
  percentage,
  color,
  size = 120,
  strokeWidth = 12,
  label,
  sublabel,
  pulse = false,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-black/5 dark:text-white/10"
        />
        {/* Progress Ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", type: "spring", stiffness: 50 }}
          className={pulse ? "animate-pulse" : ""}
        />
      </svg>
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold tracking-tighter"
            style={{ color }}
          >
            {percentage}%
          </motion.span>
        )}
        {sublabel && (
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mt-1">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
