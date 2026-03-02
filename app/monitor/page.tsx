"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Activity, CheckCircle, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MonitorPage() {
  const router = useRouter();
  const { isSynced, isReleasing, releaseProgress, updateReleaseProgress, completeRelease } = useStore();
  const [timeLeft, setTimeLeft] = useState('05:59:59');

  useEffect(() => {
    if (!isSynced) {
      router.push('/');
    }
  }, [isSynced, router]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#00F5FF', '#A78BFA', '#34D399']
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#00F5FF', '#A78BFA', '#34D399']
      });
    }, 250);
  };

  useEffect(() => {
    if (isReleasing && releaseProgress < 100) {
      const interval = setInterval(() => {
        updateReleaseProgress(Math.min(releaseProgress + 1, 100));
        
        // Simulate time left
        const totalSeconds = 6 * 3600;
        const remainingSeconds = Math.floor(totalSeconds * (1 - (releaseProgress + 1) / 100));
        const h = Math.floor(remainingSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((remainingSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = (remainingSeconds % 60).toString().padStart(2, '0');
        setTimeLeft(`${h}:${m}:${s}`);

        if (releaseProgress + 1 >= 100) {
          clearInterval(interval);
          completeRelease();
          triggerConfetti();
        }
      }, 100); // Speed up for demo purposes

      return () => clearInterval(interval);
    }
  }, [isReleasing, releaseProgress, updateReleaseProgress, completeRelease]);

  if (!isSynced) return null;

  return (
    <div className="flex flex-col min-h-screen p-6 pt-12 relative overflow-hidden">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight text-white">Live Monitor</h1>
      </motion.div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Full-screen glass overlay / Background effects */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            className="w-[150vw] h-[150vw] rounded-full bg-gradient-to-tr from-purple-400/10 to-teal-400/10 blur-3xl"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          />
        </div>

        <AnimatePresence mode="wait">
          {releaseProgress < 100 ? (
            <motion.div
              key="monitoring"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full max-w-sm flex flex-col items-center z-10"
            >
              {/* Animated absorption visualization */}
              <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
                {/* Outer glowing rings */}
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border border-purple-400/30"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: [0, 0.5, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 3, 
                      delay: i * 1,
                      ease: "easeOut" 
                    }}
                  />
                ))}
                
                {/* Center Patch */}
                <GlassCard className="w-32 h-32 rounded-full flex items-center justify-center border-2 border-white/10 shadow-[0_8px_32px_rgba(168,85,247,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] z-10 relative overflow-hidden bg-white/5 backdrop-blur-2xl">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent" />
                  <Activity className="w-12 h-12 text-purple-400" />
                  
                  {/* Liquid level inside patch */}
                  <motion.div 
                    className="absolute bottom-0 w-full bg-purple-400/30"
                    style={{ height: `${100 - releaseProgress}%` }}
                    transition={{ type: "spring", stiffness: 50 }}
                  />
                </GlassCard>

                {/* Molecules moving into bloodstream */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={`molecule-${i}`}
                    className="absolute w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,1)]"
                    initial={{ 
                      x: 0, y: 0, opacity: 0, scale: 0 
                    }}
                    animate={{ 
                      x: Math.cos((i * 30) * Math.PI / 180) * 100, 
                      y: Math.sin((i * 30) * Math.PI / 180) * 100,
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2, 
                      delay: i * 0.2,
                      ease: "easeOut" 
                    }}
                  />
                ))}
              </div>

              {/* Real-time countdown + percentage */}
              <GlassCard className="w-full p-6 text-center border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]">
                <h2 className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-300 mb-2">
                  {releaseProgress}%
                </h2>
                <p className="text-sm text-purple-400 font-medium uppercase tracking-widest mb-6">Absorbed</p>
                
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono text-lg">{timeLeft}</span>
                  <span className="text-xs uppercase ml-1">Remaining</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-3 bg-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] rounded-full mt-6 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    style={{ width: `${releaseProgress}%` }}
                    transition={{ type: "spring", stiffness: 50 }}
                  />
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm flex flex-col items-center justify-center text-center z-10"
            >
              <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center mb-8 shadow-[0_8px_32px_rgba(45,212,191,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/10 backdrop-blur-2xl">
                <CheckCircle className="w-16 h-16 text-teal-400" />
              </div>
              <h2 className="text-4xl font-bold mb-4 text-white tracking-tight">Release Complete</h2>
              <p className="text-lg text-gray-400 mb-12">
                Your nutrient levels have been optimally restored.
              </p>
              <Button 
                variant="liquid-teal"
                className="w-full h-14 text-lg rounded-full" 
                onClick={() => router.push('/dashboard')}
              >
                Return to Dashboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
