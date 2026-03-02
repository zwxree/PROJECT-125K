"use client";

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { usePatchStore } from '@/store/usePatchStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { User, Bell, Vibrate, LogOut, Moon, Sun, ShieldAlert, Activity, Siren } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const { isSynced, profile, hapticsEnabled, notificationsEnabled, fallDetectionEnabled, toggleHaptics, toggleNotifications, toggleFallDetection, disconnectPatch } = useStore();
  const { emergencyStop, isReleasing, triggerFallDetection } = usePatchStore();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!isSynced) {
      router.push('/');
    }
  }, [isSynced, router]);

  if (!isSynced || !profile) return null;

  const handleToggleHaptics = () => {
    toggleHaptics();
    if (!hapticsEnabled) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(100);
      }
      toast.success('Haptic Alerts Enabled', {
        icon: <Vibrate className="w-4 h-4 text-[#00F5FF]" />,
      });
    } else {
      toast('Haptic Alerts Disabled', {
        icon: <Vibrate className="w-4 h-4 text-muted-foreground" />,
      });
    }
  };

  const handleToggleNotifications = () => {
    toggleNotifications();
    if (!notificationsEnabled) {
      toast.success('Push Notifications Enabled', {
        icon: <Bell className="w-4 h-4 text-[#00F5FF]" />,
      });
    } else {
      toast('Push Notifications Disabled', {
        icon: <Bell className="w-4 h-4 text-muted-foreground" />,
      });
    }
  };

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toast(`Switched to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, {
      icon: theme === 'dark' ? <Sun className="w-4 h-4 text-[#FBBF24]" /> : <Moon className="w-4 h-4 text-[#A78BFA]" />,
    });
  };

  const handleDisconnect = () => {
    disconnectPatch();
    router.push('/');
    toast('Patch Disconnected', {
      icon: <LogOut className="w-4 h-4 text-[#F87171]" />,
    });
  };

  const handleEmergencyStop = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]); // Danger buzz
    }
    emergencyStop();
    toast.error('Emergency Stop Activated', {
      description: 'Patch pores crystallized. Delivery halted.',
      icon: <ShieldAlert className="w-4 h-4 text-[#F87171]" />,
    });
  };

  const handleToggleFallDetection = () => {
    toggleFallDetection();
    if (!fallDetectionEnabled) {
      toast.success('Fall Detection Enabled', {
        icon: <Activity className="w-4 h-4 text-[#FBBF24]" />,
      });
    } else {
      toast('Fall Detection Disabled', {
        icon: <Activity className="w-4 h-4 text-muted-foreground" />,
      });
    }
  };

  const handleSimulateFall = () => {
    if (!fallDetectionEnabled) {
      toast.error('Enable Fall Detection first');
      return;
    }
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([500, 200, 500]);
    }
    triggerFallDetection();
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen p-6 pt-12 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-4"
      >
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">Settings & Safety</h1>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#DE6262] to-[#FFB88C] flex items-center justify-center shadow-[0_0_20px_rgba(222,98,98,0.4)] border-2 border-white/60">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight">{profile.name}</h2>
            <p className="text-sm text-[#1A1A1A]/60">ABHA ID: {profile.abhaId}</p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Personal Bio-Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="space-y-4"
      >
        <h3 className="text-sm font-semibold text-[#DE6262] uppercase tracking-wider ml-2">Personal Details</h3>
        
        <GlassCard className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4 text-center pb-4 border-b border-black/10">
            <div>
              <p className="text-xs text-[#1A1A1A]/60 mb-1">Height</p>
              <p className="font-medium text-[#1A1A1A]">{profile.height}</p>
            </div>
            <div className="border-x border-black/10">
              <p className="text-xs text-[#1A1A1A]/60 mb-1">Weight</p>
              <p className="font-medium text-[#1A1A1A]">{profile.weight}</p>
            </div>
            <div>
              <p className="text-xs text-[#1A1A1A]/60 mb-1">Blood</p>
              <p className="font-medium text-[#F87171]">{profile.bloodGroup}</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-[#1A1A1A]/50 uppercase tracking-widest mb-2">Emergency Info</h4>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#1A1A1A]/60">Allergies</span>
              <span className="font-bold text-[#F87171]">{profile.allergies}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#1A1A1A]/60">Contact</span>
              <span className="font-bold text-[#1A1A1A]">{profile.contact}</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-black/10">
            <h4 className="text-xs font-bold text-[#1A1A1A]/50 uppercase tracking-widest mb-2">Medical Profile</h4>
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-[#1A1A1A]/60 whitespace-nowrap">History</span>
              <span className="font-medium text-[#1A1A1A] text-right text-sm leading-tight">{profile.history}</span>
            </div>
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-[#1A1A1A]/60 whitespace-nowrap">Meds</span>
              <span className="font-medium text-[#1A1A1A] text-right text-sm leading-tight">{profile.meds}</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Safety & Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-4"
      >
        <h3 className="text-sm font-semibold text-[#F87171] uppercase tracking-wider ml-2">Safety Controls</h3>
        
        <GlassCard className="p-5 border-[#F87171]/30 bg-[#F87171]/10">
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="font-semibold text-[#1A1A1A] mb-1 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#F87171]" />
                Emergency Stop
              </h4>
              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                Instantly crystallize patch pores to halt delivery. Use only if experiencing adverse reactions.
              </p>
            </div>
            <Button 
              variant="danger" 
              className={`w-full h-14 text-lg rounded-full shadow-[0_8px_16px_rgba(248,113,113,0.3)] ${!isReleasing ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleEmergencyStop}
              disabled={!isReleasing}
            >
              HALT DELIVERY
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-14 text-lg rounded-full border-[#FBBF24]/50 text-[#FBBF24] hover:bg-[#FBBF24]/10"
              onClick={handleSimulateFall}
            >
              <Siren className="w-5 h-5 mr-2" />
              Simulate Fall Event
            </Button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Settings List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="text-sm font-semibold text-[#1A1A1A]/80 uppercase tracking-wider ml-2">Preferences</h3>
        
        <GlassCard className="divide-y divide-black/10">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]">
                {theme === 'dark' ? <Moon className="w-4 h-4 text-[#A78BFA]" /> : <Sun className="w-4 h-4 text-[#FBBF24]" />}
              </div>
              <span className="font-medium text-[#1A1A1A]">Appearance</span>
            </div>
            <button 
              onClick={handleToggleTheme}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#DE6262] focus:ring-offset-2 focus:ring-offset-white"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]">
                <Bell className="w-4 h-4 text-[#DE6262]" />
              </div>
              <span className="font-medium text-[#1A1A1A]">Push Notifications</span>
            </div>
            <button 
              onClick={handleToggleNotifications}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#DE6262] focus:ring-offset-2 focus:ring-offset-white ${notificationsEnabled ? 'bg-[#DE6262]' : 'bg-black/10'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Fall Detection Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]">
                <Activity className="w-4 h-4 text-[#FBBF24]" />
              </div>
              <span className="font-medium text-[#1A1A1A]">Fall Detection</span>
            </div>
            <button 
              onClick={handleToggleFallDetection}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#DE6262] focus:ring-offset-2 focus:ring-offset-white ${fallDetectionEnabled ? 'bg-[#FBBF24]' : 'bg-black/10'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${fallDetectionEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Haptics Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]">
                <Vibrate className="w-4 h-4 text-[#34D399]" />
              </div>
              <span className="font-medium text-[#1A1A1A]">Haptic Feedback</span>
            </div>
            <button 
              onClick={handleToggleHaptics}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#DE6262] focus:ring-offset-2 focus:ring-offset-white ${hapticsEnabled ? 'bg-[#34D399]' : 'bg-black/10'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${hapticsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 pt-4 border-t border-black/10"
      >
        <Button 
          variant="ghost" 
          className="w-full h-14 text-lg rounded-full text-[#1A1A1A]/50 hover:text-[#1A1A1A] hover:bg-black/5"
          onClick={handleDisconnect}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Disconnect Patch
        </Button>
      </motion.div>
    </div>
  );
}
