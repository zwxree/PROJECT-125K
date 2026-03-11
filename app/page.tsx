"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { AlertCircle, RefreshCcw, Wifi, Syringe, Pill, FlaskConical, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const LoadingIcons = () => {
  const icons = [
    { Icon: Syringe, delay: 0 },
    { Icon: Pill, delay: 0.5 },
    { Icon: FlaskConical, delay: 1 },
  ];

  return (
    <div className="relative w-20 h-32 flex items-center justify-center">
      {icons.map(({ Icon, delay }, index) => (
        <motion.div
          key={index}
          initial={{ y: 40, opacity: 0, scale: 0.8 }}
          animate={{ 
            y: [-40, -80], 
            opacity: [0, 1, 0],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2, 
            delay,
            ease: "easeInOut" 
          }}
          className="absolute"
        >
          <Icon className="w-12 h-12 text-purple-400/80" strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
};

export default function SplashPage() {
  const router = useRouter();
  const { syncNFC, isSynced, isSyncing, syncError, resetSync } = useStore();

  useEffect(() => {
    if (isSynced) {
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSynced, router]);

  const handleConnect = () => {
    syncNFC();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative z-10 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-16 text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight text-slate-100 mb-2">
          Project 325k
        </h1>
        <div className="h-1 w-16 bg-gradient-to-r from-purple-400 to-teal-400 mx-auto rounded-full shadow-[0_4px_10px_rgba(168,85,247,0.4)]" />
      </motion.div>

      <AnimatePresence mode="wait">
        {isSynced ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-teal-400"
          >
            <div className="w-24 h-24 rounded-full bg-teal-400/10 flex items-center justify-center mb-6 border border-teal-400/30 shadow-[0_0_40px_rgba(45,212,191,0.2)] backdrop-blur-2xl">
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <CheckCircle2 className="w-12 h-12" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">System Initialized</h2>
            <p className="text-slate-400">Loading metabolic profile...</p>
          </motion.div>
        ) : isSyncing ? (
          <motion.div
            key="syncing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-48 h-48 mb-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-purple-400/10 rounded-[48px] blur-3xl" />
              <GlassCard className="w-full h-full rounded-[48px] flex items-center justify-center border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] bg-white/5 backdrop-blur-2xl overflow-hidden">
                <LoadingIcons />
                {/* Subtle pulse effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
              </GlassCard>
            </div>
            <div className="text-center space-y-2">
              <motion.p 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="text-xl font-semibold text-slate-200 tracking-wide"
              >
                Synchronizing...
              </motion.p>
              <p className="text-sm text-slate-500">Establishing secure link</p>
            </div>
          </motion.div>
        ) : syncError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center max-w-xs text-center"
          >
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-3">Sync Failed</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              {syncError}
            </p>
            <div className="flex flex-col w-full gap-3">
              <Button 
                variant="liquid-purple" 
                className="w-full h-14 rounded-full"
                onClick={handleConnect}
              >
                <RefreshCcw className="w-5 h-5 mr-2" />
                Try Again
              </Button>
              <Button 
                variant="liquid-glass" 
                className="w-full h-14 rounded-full border-white/10"
                onClick={resetSync}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center mb-12 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-teal-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Wifi className="w-12 h-12 text-slate-400 group-hover:text-teal-400 transition-colors duration-500" />
            </div>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-slate-100 mb-3 tracking-tight">Ready to Sync</h2>
              <p className="text-slate-400 max-w-[240px] mx-auto leading-relaxed">
                Apply your Project 325k patch and tap below to connect.
              </p>
            </div>
            <Button 
              variant="liquid-purple" 
              className="w-full max-w-xs h-16 text-lg rounded-full shadow-[0_10px_20px_rgba(168,85,247,0.3)]"
              onClick={handleConnect}
            >
              Connect Patch
            </Button>
            <p className="mt-6 text-xs text-slate-600 font-medium tracking-widest uppercase">
              Encrypted Biometric Link
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
