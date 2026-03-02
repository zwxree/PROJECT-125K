"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { usePatchStore } from '@/store/usePatchStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { User, Battery, Wifi, AlertTriangle, Zap, X, Siren, Phone, PhoneOff, MicOff, Grid, Volume2, MessageSquare, CheckCircle } from 'lucide-react';
import HistoryChart from '@/components/dashboard/HistoryChart';

export default function DashboardPage() {
  const router = useRouter();
  const { isSynced, profile, setNavHidden, isNavHidden } = useStore();
  const { battery, nutrients, aiMessage, isReleasing, startRelease, isFallDetected, resolveFallDetection } = usePatchStore();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [isAlertSent, setIsAlertSent] = useState(false);
  const [timeSinceAlert, setTimeSinceAlert] = useState(0);

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isFallDetected && !isAlertSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && !isAlertSent && isFallDetected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAlertSent(true);
    }
    return () => clearInterval(timer);
  }, [isFallDetected, countdown, isAlertSent]);

  // Alert duration timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAlertSent) {
      timer = setInterval(() => {
        setTimeSinceAlert((prev) => prev + 1);
      }, 1000);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeSinceAlert(0);
    }
    return () => clearInterval(timer);
  }, [isAlertSent]);

  // Reset state when fall detection is resolved
  useEffect(() => {
    if (!isFallDetected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCountdown(15);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAlertSent(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeSinceAlert(0);
    }
  }, [isFallDetected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!isSynced) {
      router.push('/');
    }
  }, [isSynced, router]);

  if (!isSynced || !profile) return null;

  const handleSimulateTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([50, 100, 50]); // Distinct buzz pattern
    }
    startRelease();
    setShowBottomSheet(false);
  };

  return (
    <div className={`flex flex-col min-h-screen p-6 pt-12 space-y-6 transition-colors duration-1000 ${isReleasing ? 'bg-[#84FAB0]/10' : ''}`}>
      {/* Top Status Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-xl text-[#1A1A1A]">Project 125k</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/40 px-3 py-1.5 rounded-full border border-white/60 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,0.8)]">
            <div className={`w-2 h-2 rounded-full ${isReleasing ? 'bg-[#DE6262] shadow-[0_0_8px_#DE6262] animate-pulse' : 'bg-[#34D399]'}`} />
            <span className="text-xs font-medium text-[#1A1A1A]">{isReleasing ? 'Active' : 'Idle'}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center overflow-hidden">
            <User className="w-5 h-5 text-[#1A1A1A]/70" />
          </div>
        </div>
      </motion.div>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A] flex items-center">
              Good morning, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DE6262] to-[#FFB88C] ml-2">
                {profile.name}
              </span>
              <button 
                onClick={() => setNavHidden(!isNavHidden)}
                className="ml-2 hover:scale-110 transition-transform active:scale-95 inline-block text-2xl"
                title="Toggle Navigation"
              >
                👋
              </button>
            </h1>
          </div>
          <div className="bg-[#34D399]/20 text-[#059669] px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-[#34D399]/30">
            Active
          </div>
        </div>
      </motion.div>

      {/* Connection Status Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center py-4"
      >
        <div className={`relative w-48 h-48 rounded-full border flex flex-col items-center justify-center bg-white/40 backdrop-blur-[40px] transition-all duration-500 ${isReleasing ? 'border-[#DE6262]/50 shadow-[0_8px_32px_rgba(222,98,98,0.2),inset_0_2px_4px_rgba(255,255,255,0.8),inset_2px_0_4px_rgba(255,255,255,0.8)]' : 'border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,0.8),inset_2px_0_4px_rgba(255,255,255,0.8)]'}`}>
          <div className={`absolute inset-0 rounded-full border-t-2 animate-spin ${isReleasing ? 'border-[#DE6262]' : 'border-[#1A1A1A]/20'}`} style={{ animationDuration: isReleasing ? '2s' : '4s' }} />
          <Wifi className={`w-6 h-6 mb-2 ${isReleasing ? 'text-[#DE6262]' : 'text-[#1A1A1A]/50'}`} />
          <span className="text-sm font-medium text-[#1A1A1A]">Patch Connected</span>
          <div className="flex items-center gap-2 mt-2 text-xs text-[#1A1A1A]/60">
            <Battery className="w-3 h-3 text-[#34D399]" /> {battery}%
          </div>
          <span className="text-[10px] mt-1 uppercase tracking-wider font-semibold" style={{ color: isReleasing ? '#DE6262' : '#1A1A1A80' }}>
            {isReleasing ? 'Active Drip' : 'Idle'}
          </span>
        </div>
      </motion.div>

      {/* LIVE BIOMARKER FEED */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold text-[#1A1A1A]/60 uppercase tracking-wider mb-4">Live Biomarker Feed</h3>
          <div className="grid grid-cols-2 gap-4">
            {nutrients.map((nutrient) => (
              <div key={nutrient.id} className="bg-white/40 rounded-2xl p-4 border border-white/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] flex flex-col">
                <span className="text-xs font-medium text-[#1A1A1A]/60 mb-1">{nutrient.name}</span>
                <div className="flex items-baseline gap-1">
                  <div className="relative overflow-hidden h-8 flex items-center">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={nutrient.value}
                        initial={{ y: isReleasing ? 20 : -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: isReleasing ? -20 : 20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="text-2xl font-mono font-bold tracking-tight inline-block"
                        style={{ color: nutrient.color }}
                      >
                        {nutrient.value.toFixed(2)}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <span className="text-[10px] text-[#1A1A1A]/40">%</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* AI Insight Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard className="p-5 border-[#A78BFA]/30 bg-gradient-to-br from-white/40 to-[#A78BFA]/10">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-[#A78BFA]/20 text-[#8B5CF6]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#8B5CF6] mb-1">Context-Aware Insight</h3>
              <p className="text-sm leading-relaxed text-[#1A1A1A]/80">
                {aiMessage}
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* History Chart */}
      <HistoryChart />

      {/* Action Button (The "Wow" Factor) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="pt-4 pb-8"
      >
        <Button 
          variant="primary"
          className="w-full h-16 text-lg rounded-full" 
          onClick={() => setShowBottomSheet(true)}
        >
          <Zap className="w-5 h-5 mr-2" />
          AI Auto-Optimize
        </Button>
      </motion.div>

      {/* Bottom Sheet Overlay */}
      <AnimatePresence>
        {showBottomSheet && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
              onClick={() => setShowBottomSheet(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-[100] p-6 pb-12 bg-white/80 backdrop-blur-[40px] border-t border-white/60 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.8)]"
            >
              <div className="w-12 h-1.5 bg-[#1A1A1A]/20 rounded-full mx-auto mb-6" />
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#1A1A1A]">Physical Security Lock</h3>
                <button onClick={() => setShowBottomSheet(false)} className="p-2 bg-black/5 rounded-full">
                  <X className="w-5 h-5 text-[#1A1A1A]/70" />
                </button>
              </div>
              <p className="text-[#1A1A1A]/80 mb-8 leading-relaxed">
                Tap physical secure key to phone to authorize 8-hour microneedle release.
              </p>
              <Button 
                variant="primary"
                className="w-full h-14 text-lg rounded-full"
                onClick={handleSimulateTap}
              >
                <Wifi className="w-5 h-5 mr-2" />
                Simulate Tap
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Fall Detection Overlay */}
      <AnimatePresence>
        {isFallDetected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 backdrop-blur-2xl transition-colors duration-500 ${isAlertSent ? 'bg-white/95' : 'bg-[#DE6262]/95'}`}
          >
            {isAlertSent ? (
              <div className="flex flex-col items-center justify-between h-full w-full py-20 animate-in fade-in duration-500">
                <div className="flex flex-col items-center mt-10 text-center">
                  <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4 tracking-tight">Alerts Sent</h2>
                  <p className="text-lg text-[#1A1A1A]/70 mb-2 max-w-[280px]">
                    Emergency text alerts with your location have been sent to:
                  </p>
                  <ul className="text-[#1A1A1A] font-medium mb-6 space-y-2">
                    <li>• Emergency Contacts</li>
                    <li>• 112 Helpline</li>
                  </ul>
                  <p className="text-xl text-[#1A1A1A]/90 font-mono tracking-widest">{formatDuration(timeSinceAlert)}</p>
                </div>

                <div className="flex flex-col items-center gap-16 mb-10">
                  <button
                    className="w-full max-w-[240px] h-14 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center shadow-lg hover:bg-[#1A1A1A]/90 transition-all active:scale-95 px-6"
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.vibrate) {
                        navigator.vibrate(50);
                      }
                      resolveFallDetection();
                    }}
                  >
                    <X className="w-5 h-5 mr-2" />
                    Dismiss Alert
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full max-w-sm animate-in fade-in duration-300">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center mb-8 shadow-[0_0_100px_rgba(255,255,255,0.4)] border border-white/50"
                >
                  <Siren className="w-20 h-20 text-white" />
                </motion.div>
                
                <h2 className="text-4xl font-bold text-white mb-4 text-center tracking-tight">HARD FALL DETECTED</h2>
                <p className="text-white/80 text-center mb-12 text-lg leading-relaxed">
                  Biometric sensors indicate a sudden impact. Sending emergency text alerts in <br/>
                  <span className="text-5xl font-bold text-white mt-4 block">{countdown}</span>
                </p>

                <div className="w-full space-y-4">
                  <Button 
                    variant="primary"
                    className="w-full h-16 text-xl rounded-full bg-white text-[#DE6262] shadow-[0_8px_16px_rgba(0,0,0,0.1)] hover:bg-white/90"
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.vibrate) {
                        navigator.vibrate([100, 50, 100]);
                      }
                      setIsAlertSent(true);
                    }}
                  >
                    <MessageSquare className="w-6 h-6 mr-2" />
                    Send SOS Now
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full h-16 text-xl rounded-full border-white/40 text-white hover:bg-white/10"
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.vibrate) {
                        navigator.vibrate(50);
                      }
                      resolveFallDetection();
                    }}
                  >
                    I&apos;m Okay (Cancel)
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
