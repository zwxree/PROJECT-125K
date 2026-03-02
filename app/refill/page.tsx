"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Droplet, CheckCircle2 } from 'lucide-react';

export default function RefillPage() {
  const router = useRouter();
  const { isSynced, startRefill } = useStore();
  const [amounts, setAmounts] = useState<Record<string, number>>({
    vitD: 0.65,
    iron: 0.4,
    vitB12: 0,
    magnesium: 0,
  });
  const [selectedChips, setSelectedChips] = useState<string[]>(['vitD', 'iron']);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (!isSynced) {
      router.push('/');
    }
  }, [isSynced, router]);

  if (!isSynced) return null;

  const handleSliderChange = (id: string, value: number) => {
    setAmounts(prev => ({ ...prev, [id]: value }));
    if (value > 0 && !selectedChips.includes(id)) {
      setSelectedChips(prev => [...prev, id]);
    } else if (value === 0 && selectedChips.includes(id)) {
      setSelectedChips(prev => prev.filter(c => c !== id));
    }
  };

  const handleChipToggle = (id: string) => {
    if (selectedChips.includes(id)) {
      setSelectedChips(prev => prev.filter(c => c !== id));
      setAmounts(prev => ({ ...prev, [id]: 0 }));
    } else {
      setSelectedChips(prev => [...prev, id]);
      setAmounts(prev => ({ ...prev, [id]: 0.5 })); // Default amount
    }
  };

  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      startRefill(amounts);
      router.push('/monitor');
    }, 2500);
  };

  const nutrientsList = [
    { id: 'vitD', name: 'Vitamin D', color: '#FBBF24' },
    { id: 'iron', name: 'Iron', color: '#F87171' },
    { id: 'vitB12', name: 'Vitamin B12', color: '#34D399' },
    { id: 'magnesium', name: 'Magnesium', color: '#A78BFA' },
  ];

  return (
    <div className="flex flex-col min-h-screen p-6 pt-12 relative overflow-hidden">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full bg-white/40 border border-white/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]">
          <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">Refill Mode</h1>
      </motion.div>

      <AnimatePresence mode="wait">
        {!isConfirming ? (
          <motion.div
            key="refill-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col"
          >
            {/* Photorealistic Patch Illustration */}
            <div className="relative w-full aspect-square max-w-[280px] mx-auto mb-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#DE6262]/20 to-[#FFB88C]/20 rounded-[40px] blur-2xl" />
              <GlassCard className="w-full h-full rounded-[40px] border-2 border-white/60 flex items-center justify-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.8)]">
                {/* Patch Texture */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                
                {/* Refill Hole (Open) */}
                <div className="w-24 h-24 rounded-full border-4 border-white/80 shadow-[inset_0_4px_10px_rgba(0,0,0,0.1)] flex items-center justify-center relative bg-white/40 backdrop-blur-md overflow-hidden">
                  {/* Orange Liquid Visible */}
                  <motion.div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-[#FBBF24] to-[#F87171] opacity-80 rounded-b-full"
                    initial={{ height: '20%' }}
                    animate={{ height: '60%' }}
                    transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                  />
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.2)] pointer-events-none" />
                  <Droplet className="w-8 h-8 text-[#1A1A1A]/80 z-10" />
                </div>
              </GlassCard>
            </div>

            {/* Multi-select Chips */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#1A1A1A]/60 uppercase tracking-wider mb-3">Select Nutrients</h3>
              <div className="flex flex-wrap gap-2">
                {nutrientsList.map(n => (
                  <button
                    key={n.id}
                    onClick={() => handleChipToggle(n.id)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${
                      selectedChips.includes(n.id) 
                        ? `bg-[${n.color}]/20 border-[${n.color}]/50 text-[#1A1A1A] shadow-[0_0_10px_rgba(255,255,255,0.5)]` 
                        : 'bg-white/40 border-white/60 text-[#1A1A1A]/50 hover:bg-white/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]'
                    }`}
                    style={{
                      backgroundColor: selectedChips.includes(n.id) ? `${n.color}33` : undefined,
                      borderColor: selectedChips.includes(n.id) ? `${n.color}80` : undefined,
                      color: selectedChips.includes(n.id) ? '#1A1A1A' : undefined,
                    }}
                  >
                    {n.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="flex-1 space-y-6 overflow-y-auto pb-24 hide-scrollbar">
              {nutrientsList.filter(n => selectedChips.includes(n.id)).map(n => (
                <div key={n.id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium" style={{ color: n.color }}>{n.name}</span>
                    <span className="text-sm font-bold text-[#1A1A1A]">{amounts[n.id]?.toFixed(2) || '0.00'} ml</span>
                  </div>
                  <div className="relative h-3 bg-black/5 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
                    <motion.div 
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{ backgroundColor: n.color, width: `${((amounts[n.id] || 0) / 2.0) * 100}%` }}
                      layoutId={`slider-${n.id}`}
                    />
                    <input 
                      type="range" 
                      min="0" 
                      max="2.0" 
                      step="0.05"
                      value={amounts[n.id] || 0}
                      onChange={(e) => handleSliderChange(n.id, parseFloat(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#1A1A1A]/40 font-medium">
                    <span>0.0 ml</span>
                    <span>2.0 ml</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Confirm Button */}
            <div className="pt-4 pb-8 mt-auto">
              <Button 
                variant="primary"
                className="w-full h-14 text-lg rounded-full" 
                onClick={handleConfirm}
                disabled={selectedChips.length === 0}
              >
                Confirm Refill
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="confirming"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="relative w-48 h-48 mb-8">
              {/* Patch Hole Closing Animation */}
              <GlassCard className="w-full h-full rounded-[40px] border-2 border-[#DE6262]/50 flex items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(222,98,98,0.2)]">
                <motion.div 
                  className="w-24 h-24 rounded-full border-4 border-[#DE6262] flex items-center justify-center relative bg-white/60 overflow-hidden"
                  initial={{ scale: 1 }}
                  animate={{ scale: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#DE6262] to-[#FFB88C] opacity-80" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-[#DE6262]" />
                </motion.div>
              </GlassCard>
            </div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold mb-2 text-[#DE6262]"
            >
              Refill Secured
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-[#1A1A1A]/60"
            >
              Starting controlled slow release over 6 hours...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
