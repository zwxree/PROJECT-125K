"use client";

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { usePatchStore } from '@/store/usePatchStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Activity, TrendingUp, TrendingDown, Info } from 'lucide-react';

export default function MonitorPage() {
  const router = useRouter();
  const { isSynced } = useStore();
  const { nutrients } = usePatchStore();

  useEffect(() => {
    if (!isSynced) {
      router.push('/');
    }
  }, [isSynced, router]);

  if (!isSynced) return null;

  return (
    <div className="flex flex-col min-h-screen p-6 pt-12 space-y-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-teal-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4 relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Bio-Feed</h1>
        </div>
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Live Sync
        </div>
      </motion.div>

      {/* Main Grid - Grouped */}
      <div className="space-y-8 relative z-10">
        {/* Vitamins Group */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <div className="w-1 h-4 bg-purple-500 rounded-full" />
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Essential Vitamins</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {nutrients.filter(n => n.id.startsWith('vit')).map((nutrient, index) => (
              <motion.div
                key={nutrient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-5 flex flex-col gap-4 overflow-hidden relative group">
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{ backgroundColor: nutrient.color }}
                  />
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{nutrient.name}</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-mono font-bold tracking-tighter" style={{ color: nutrient.color }}>
                          {nutrient.value.toFixed(2)}
                        </span>
                        <span className="text-sm text-slate-500 font-medium">%</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${nutrient.value > 50 ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {nutrient.value > 50 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {nutrient.value > 50 ? 'OPTIMAL' : 'LOW'}
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                      style={{ backgroundColor: nutrient.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${nutrient.value}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Minerals Group */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <div className="w-1 h-4 bg-teal-500 rounded-full" />
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Vital Minerals</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {nutrients.filter(n => !n.id.startsWith('vit')).map((nutrient, index) => (
              <motion.div
                key={nutrient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <GlassCard className="p-5 flex flex-col gap-4 overflow-hidden relative group">
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{ backgroundColor: nutrient.color }}
                  />
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{nutrient.name}</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-mono font-bold tracking-tighter" style={{ color: nutrient.color }}>
                          {nutrient.value.toFixed(2)}
                        </span>
                        <span className="text-sm text-slate-500 font-medium">%</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${nutrient.value > 50 ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {nutrient.value > 50 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {nutrient.value > 50 ? 'OPTIMAL' : 'LOW'}
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                      style={{ backgroundColor: nutrient.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${nutrient.value}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10"
      >
        <GlassCard className="p-5 border-white/10 bg-gradient-to-br from-purple-500/5 to-teal-500/5">
          <h3 className="text-sm font-bold text-slate-200 mb-3">System Health Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Sensor Connectivity</span>
              <span className="text-teal-400 font-bold">99.8%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Biometric Drift</span>
              <span className="text-slate-200 font-bold">±0.01%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">AI Confidence</span>
              <span className="text-purple-400 font-bold">High</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
