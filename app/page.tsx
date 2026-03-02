"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScanFace } from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();
  const { syncNFC, isSynced } = useStore();
  const [scanSuccess, setScanSuccess] = useState(false);

  useEffect(() => {
    if (isSynced && !scanSuccess) {
      router.push('/dashboard');
    }
  }, [isSynced, scanSuccess, router]);

  useEffect(() => {
    // Auto-transition after 2 seconds
    const timer = setTimeout(() => {
      setScanSuccess(true);
      setTimeout(() => {
        syncNFC();
        router.push('/dashboard');
      }, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [syncNFC, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-16 text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A] mb-2">
          Project 125k
        </h1>
        <div className="h-1 w-16 bg-[#DE6262] mx-auto rounded-full shadow-[0_4px_10px_rgba(222,98,98,0.4)]" />
      </motion.div>

      {/* Pulsing FaceID/TouchID glass icon */}
      <AnimatePresence mode="wait">
        {!scanSuccess ? (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#DE6262]/20 rounded-[40px] blur-3xl" />
              <GlassCard className="w-full h-full rounded-[40px] flex items-center justify-center border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.8)] bg-white/40 backdrop-blur-xl">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <ScanFace className="w-16 h-16 text-[#DE6262]" strokeWidth={1.5} />
                </motion.div>
                {/* Scanning sweep effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-[#DE6262]/20 to-transparent"
                  initial={{ y: '-100%' }}
                  animate={{ y: '200%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </GlassCard>
            </div>
            <motion.p 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="text-lg font-medium text-[#1A1A1A]/80 tracking-wide"
            >
              Authenticating Bio-Profile...
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-[#34D399]"
          >
            <div className="w-24 h-24 rounded-full bg-white/60 flex items-center justify-center mb-4 border border-white/80 shadow-[0_20px_50px_rgba(52,211,153,0.2),inset_0_2px_4px_rgba(255,255,255,0.8)] backdrop-blur-xl">
              <ScanFace className="w-12 h-12 text-[#34D399]" />
            </div>
            <p className="text-xl font-semibold text-[#1A1A1A]">Verified</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
