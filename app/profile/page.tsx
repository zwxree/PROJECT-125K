"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { usePatchStore } from '@/store/usePatchStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { User, Bell, Vibrate, LogOut, Moon, Sun, ShieldAlert, Activity, Siren, Edit2, Save, X, Phone, UserCircle, Droplets, Scale, Ruler, FileText, Pill as PillIcon, CheckCircle2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const { isSynced, profile, hapticsEnabled, notificationsEnabled, fallDetectionEnabled, toggleHaptics, toggleNotifications, toggleFallDetection, disconnectPatch, updateProfile, logout, isAuthenticated } = useStore();
  const { emergencyStop, isReleasing, triggerFallDetection } = usePatchStore();
  const { theme, setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!isSynced) {
      router.push('/');
    }
  }, [isSynced, isAuthenticated, router]);

  if (!isSynced || !profile || !editedProfile) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
    toast('Logged Out', {
      icon: <LogOut className="w-4 h-4 text-slate-400" />,
    });
  };

  const handleSaveProfile = () => {
    updateProfile(editedProfile);
    setIsEditing(false);
    toast.success('Profile Updated', {
      description: 'Your biometric profile has been synchronized.',
      icon: <CheckCircle2 className="w-4 h-4 text-teal-400" />,
    });
  };

  const handleToggleHaptics = () => {
    toggleHaptics();
    if (!hapticsEnabled) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(100);
      }
      toast.success('Haptic Alerts Enabled', {
        icon: <Vibrate className="w-4 h-4 text-teal-400" />,
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
        icon: <Bell className="w-4 h-4 text-teal-400" />,
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
      icon: theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-purple-400" />,
    });
  };

  const handleDisconnect = () => {
    disconnectPatch();
    router.push('/');
    toast('Patch Disconnected', {
      icon: <LogOut className="w-4 h-4 text-red-400" />,
    });
  };

  const handleEmergencyStop = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]); // Danger buzz
    }
    emergencyStop();
    toast.error('Emergency Stop Activated', {
      description: 'Patch pores crystallized. Delivery halted.',
      icon: <ShieldAlert className="w-4 h-4 text-red-400" />,
    });
  };

  const handleToggleFallDetection = () => {
    toggleFallDetection();
    if (!fallDetectionEnabled) {
      toast.success('Fall Detection Enabled', {
        icon: <Activity className="w-4 h-4 text-yellow-400" />,
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
    <div className="flex flex-col min-h-screen p-6 pt-12 space-y-6 pb-24">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Settings & Safety</h1>
        <Button 
          variant="liquid-glass" 
          size="sm" 
          className="rounded-full border-white/10"
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-teal-400 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] border-2 border-white/10">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">{profile.name}</h2>
            <p className="text-sm text-slate-400">ABHA ID: {profile.abhaId}</p>
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
        <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider ml-2">Personal Details</h3>
        
        <GlassCard className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4 text-center pb-4 border-b border-white/10">
            <div>
              <p className="text-xs text-slate-400 mb-1">Height</p>
              <p className="font-medium text-slate-100">{profile.height}</p>
            </div>
            <div className="border-x border-white/10">
              <p className="text-xs text-slate-400 mb-1">Weight</p>
              <p className="font-medium text-slate-100">{profile.weight}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Blood</p>
              <p className="font-medium text-red-400">{profile.bloodGroup}</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Emergency Info</h4>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Allergies</span>
              <span className="font-bold text-red-400">{profile.allergies}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Contact</span>
              <span className="font-bold text-slate-100">{profile.contact}</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Medical Profile</h4>
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-slate-400 whitespace-nowrap">History</span>
              <span className="font-medium text-slate-100 text-right text-sm leading-tight">{profile.history}</span>
            </div>
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-slate-400 whitespace-nowrap">Meds</span>
              <span className="font-medium text-slate-100 text-right text-sm leading-tight">{profile.meds}</span>
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
        <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider ml-2">Safety Controls</h3>
        
        <GlassCard className="p-5 border-red-500/30 bg-red-500/10">
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="font-semibold text-slate-100 mb-1 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                Emergency Stop
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Instantly crystallize patch pores to halt delivery. Use only if experiencing adverse reactions.
              </p>
            </div>
            <Button 
              variant="danger" 
              className={`w-full h-14 text-lg rounded-full shadow-[0_8px_16px_rgba(239,68,68,0.3)] ${!isReleasing ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleEmergencyStop}
              disabled={!isReleasing}
            >
              HALT DELIVERY
            </Button>
            <Button 
              variant="liquid-glass" 
              className="w-full h-14 text-lg rounded-full text-yellow-500"
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
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider ml-2">Preferences</h3>
        
        <GlassCard className="divide-y divide-white/10">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]">
                {theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-yellow-400" />}
              </div>
              <span className="font-medium text-slate-100">Appearance</span>
            </div>
            <button 
              onClick={handleToggleTheme}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]">
                <Bell className="w-4 h-4 text-purple-400" />
              </div>
              <span className="font-medium text-slate-100">Push Notifications</span>
            </div>
            <button 
              onClick={handleToggleNotifications}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${notificationsEnabled ? 'bg-purple-500' : 'bg-white/10'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Fall Detection Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]">
                <Activity className="w-4 h-4 text-yellow-400" />
              </div>
              <span className="font-medium text-slate-100">Fall Detection</span>
            </div>
            <button 
              onClick={handleToggleFallDetection}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${fallDetectionEnabled ? 'bg-yellow-500' : 'bg-white/10'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${fallDetectionEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Haptics Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]">
                <Vibrate className="w-4 h-4 text-teal-400" />
              </div>
              <span className="font-medium text-slate-100">Haptic Feedback</span>
            </div>
            <button 
              onClick={handleToggleHaptics}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${hapticsEnabled ? 'bg-teal-500' : 'bg-white/10'}`}
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
        className="mt-8 pt-4 border-t border-white/10 space-y-3"
      >
        <Button 
          variant="liquid-glass" 
          className="w-full h-14 text-lg rounded-full text-slate-300"
          onClick={handleDisconnect}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Disconnect Patch
        </Button>
        <Button 
          variant="liquid-glass" 
          className="w-full h-14 text-lg rounded-full text-red-400/80 border-red-500/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout Account
        </Button>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border-t sm:border border-white/10 rounded-t-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-10">
                <h2 className="text-xl font-bold text-slate-100">Edit Bio-Profile</h2>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest">Basic Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 ml-1">Full Name</label>
                      <div className="relative">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                          type="text"
                          value={editedProfile.name}
                          onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                          className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 text-slate-100 focus:outline-none focus:border-purple-500/50 transition-colors"
                          placeholder="Full Name"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 ml-1">ABHA ID</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                          type="text"
                          value={editedProfile.abhaId}
                          onChange={(e) => setEditedProfile({ ...editedProfile, abhaId: e.target.value })}
                          className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 text-slate-100 focus:outline-none focus:border-purple-500/50 transition-colors"
                          placeholder="ABHA ID"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Physical Stats */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-teal-400 uppercase tracking-widest">Physical Stats</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium text-slate-500 ml-1">Height</label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                        <input 
                          type="text"
                          value={editedProfile.height}
                          onChange={(e) => setEditedProfile({ ...editedProfile, height: e.target.value })}
                          className="w-full h-10 bg-white/5 border border-white/10 rounded-xl pl-8 pr-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500/50 transition-colors"
                          placeholder="5'7''"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium text-slate-500 ml-1">Weight</label>
                      <div className="relative">
                        <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                        <input 
                          type="text"
                          value={editedProfile.weight}
                          onChange={(e) => setEditedProfile({ ...editedProfile, weight: e.target.value })}
                          className="w-full h-10 bg-white/5 border border-white/10 rounded-xl pl-8 pr-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500/50 transition-colors"
                          placeholder="65 kg"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium text-slate-500 ml-1">Blood</label>
                      <div className="relative">
                        <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-red-500/50" />
                        <input 
                          type="text"
                          value={editedProfile.bloodGroup}
                          onChange={(e) => setEditedProfile({ ...editedProfile, bloodGroup: e.target.value })}
                          className="w-full h-10 bg-white/5 border border-white/10 rounded-xl pl-8 pr-2 text-xs text-slate-100 focus:outline-none focus:border-red-500/50 transition-colors"
                          placeholder="B+"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest">Medical Profile</h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 ml-1">Allergies</label>
                      <input 
                        type="text"
                        value={editedProfile.allergies}
                        onChange={(e) => setEditedProfile({ ...editedProfile, allergies: e.target.value })}
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-slate-100 focus:outline-none focus:border-red-500/50 transition-colors"
                        placeholder="e.g. Penicillin, Peanuts"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 ml-1">Medical History</label>
                      <textarea 
                        value={editedProfile.history}
                        onChange={(e) => setEditedProfile({ ...editedProfile, history: e.target.value })}
                        className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 focus:outline-none focus:border-red-500/50 transition-colors resize-none"
                        placeholder="e.g. Type 2 Diabetes, Hypertension"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 ml-1">Current Medications</label>
                      <div className="relative">
                        <PillIcon className="absolute left-4 top-4 w-4 h-4 text-slate-500" />
                        <textarea 
                          value={editedProfile.meds}
                          onChange={(e) => setEditedProfile({ ...editedProfile, meds: e.target.value })}
                          className="w-full h-20 bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-4 text-slate-100 focus:outline-none focus:border-red-500/50 transition-colors resize-none"
                          placeholder="e.g. Metformin 500mg"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500 ml-1">Emergency Contact</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                          type="text"
                          value={editedProfile.contact}
                          onChange={(e) => setEditedProfile({ ...editedProfile, contact: e.target.value })}
                          className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 text-slate-100 focus:outline-none focus:border-purple-500/50 transition-colors"
                          placeholder="Emergency Contact Number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-[#0a0a0a] sticky bottom-0">
                <Button 
                  variant="liquid-purple" 
                  className="w-full h-14 rounded-full text-lg shadow-[0_8px_20px_rgba(168,85,247,0.3)]"
                  onClick={handleSaveProfile}
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Bio-Profile
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
