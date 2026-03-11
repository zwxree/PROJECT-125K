"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Droplet, CheckCircle2, ShoppingBag, Package, CreditCard, Sparkles, Clock, Activity, ShieldCheck, Truck, Wallet, ChevronRight, X } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export default function RefillPage() {
  const router = useRouter();
  const { isSynced, startRefill, isReleasing, releaseProgress, updateReleaseProgress, completeRelease } = useStore();
  const [amounts, setAmounts] = useState<Record<string, number>>({
    vitD: 0.65,
    iron: 0.4,
    vitB12: 0,
    magnesium: 0,
  });
  const [selectedChips, setSelectedChips] = useState<string[]>(['vitD', 'iron']);
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedNutrientForPurchase, setSelectedNutrientForPurchase] = useState('vitD');
  const [timeLeft, setTimeLeft] = useState('05:59:59');
  
  // Checkout Flow State
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'payment' | 'processing' | 'success'>('review');
  const [selectedPack, setSelectedPack] = useState<{ n: string, price: string, icon: React.ReactNode } | null>(null);

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
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#00F5FF', '#A78BFA', '#34D399'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#00F5FF', '#A78BFA', '#34D399'] });
    }, 250);
  };

  useEffect(() => {
    let frameId: number;
    let lastTime: number | null = null;

    const update = (currentTime: number) => {
      if (!useStore.getState().isReleasing) return;
      
      if (lastTime === null) {
        lastTime = currentTime;
        frameId = requestAnimationFrame(update);
        return;
      }

      const deltaTime = Math.max(0, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      const currentProgress = useStore.getState().releaseProgress;
      if (currentProgress >= 100) {
        completeRelease();
        triggerConfetti();
        return;
      }

      const increment = 10 * deltaTime;
      const nextProgress = Math.min(currentProgress + increment, 90);
      
      if (nextProgress !== currentProgress) {
        updateReleaseProgress(nextProgress);
      }

      // Update time left display
      const totalSeconds = 6 * 3600;
      const remainingSeconds = Math.max(0, Math.floor(totalSeconds * (1 - nextProgress / 90)));
      const h = Math.floor(remainingSeconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((remainingSeconds % 3600) / 60).toString().padStart(2, '0');
      const s = (remainingSeconds % 60).toString().padStart(2, '0');
      setTimeLeft(`${h}:${m}:${s}`);

      if (nextProgress < 90) {
        frameId = requestAnimationFrame(update);
      } else {
        completeRelease();
        triggerConfetti();
      }
    };

    if (isReleasing && releaseProgress < 100) {
      frameId = requestAnimationFrame(update);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReleasing, updateReleaseProgress, completeRelease]);

  if (!isSynced) return null;

  const handleOpenCheckout = (pack: { n: string, price: string, icon: React.ReactNode }) => {
    setSelectedPack(pack);
    setCheckoutStep('review');
    setShowCheckout(true);
  };

  const handleProcessPayment = () => {
    setCheckoutStep('processing');
    setTimeout(() => {
      setCheckoutStep('success');
      triggerConfetti();
    }, 2000);
  };

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
      setIsConfirming(false);
    }, 2500);
  };

  const nutrientsList = [
    { id: 'vitD', name: 'Vitamin D', color: '#FBBF24' },
    { id: 'iron', name: 'Iron', color: '#F87171' },
    { id: 'vitB12', name: 'Vitamin B12', color: '#34D399' },
    { id: 'magnesium', name: 'Magnesium', color: '#A78BFA' },
  ];

  const packs = [
    { n: '5n', price: '249', icon: <Droplet className="w-6 h-6" />, color: 'from-teal-500/20 to-teal-500/5', desc: 'Starter Supply' },
    { n: '10n', price: '449', icon: <Package className="w-6 h-6" />, color: 'from-purple-500/20 to-purple-500/5', desc: 'Value Pack' },
    { n: '30n', price: '999', icon: <Sparkles className="w-6 h-6" />, color: 'from-yellow-500/20 to-yellow-500/5', desc: 'Monthly Reserve' },
  ];

  return (
    <div className="flex flex-col min-h-screen p-6 pt-12 relative overflow-hidden pb-24">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <Button variant="liquid-glass" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-100" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Refill & Store</h1>
      </motion.div>

      <AnimatePresence mode="wait">
        {!isConfirming ? (
          <motion.div
            key="refill-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col space-y-8"
          >
            {/* Photorealistic Patch Illustration */}
            <div className="relative w-full aspect-square max-w-[240px] mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/20 to-teal-400/20 rounded-[40px] blur-2xl" />
              <GlassCard className="w-full h-full rounded-[40px] border-2 border-white/10 flex items-center justify-center relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] bg-white/5 backdrop-blur-2xl">
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                <div className="w-20 h-20 rounded-full border-4 border-white/10 shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center relative bg-white/5 backdrop-blur-md overflow-hidden">
                  <motion.div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-purple-500 to-teal-400 opacity-80 rounded-b-full"
                    initial={{ height: '20%' }}
                    animate={{ height: '60%' }}
                    transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                  />
                  <Droplet className="w-6 h-6 text-slate-100 z-10" />
                </div>
              </GlassCard>
            </div>

            {/* LIVE ABSORPTION MONITOR */}
            {isReleasing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-semibold text-teal-400 uppercase tracking-wider">Active Absorption</h3>
                  <div className="flex items-center gap-1.5 bg-teal-500/10 px-2 py-1 rounded text-[10px] font-bold text-teal-400">
                    <Activity className="w-3 h-3 animate-pulse" />
                    IN PROGRESS
                  </div>
                </div>
                
                <GlassCard className="p-6 border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <h2 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-300">
                        {releaseProgress.toFixed(1)}%
                      </h2>
                      <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Dosage Given (6-8hr Cycle)</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400 mb-1">
                        <Clock className="w-3 h-3" />
                        <span className="font-mono text-sm">{timeLeft}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Est. Completion</p>
                    </div>
                  </div>
                  
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                      style={{ width: `${(releaseProgress / 90) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-bold text-amber-400/80 uppercase tracking-tighter">
                    <ShieldCheck className="w-3 h-3" />
                    Safety Lock: Refill capped at 90% to prevent over-saturation
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Refill Configuration */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Refill Configuration</h3>
                <div className="flex gap-2">
                  {nutrientsList.map(n => (
                    <button
                      key={n.id}
                      onClick={() => handleChipToggle(n.id)}
                      className={`w-6 h-6 rounded-full border transition-all ${
                        selectedChips.includes(n.id) ? 'border-white/40' : 'border-white/5 bg-white/5'
                      }`}
                      style={{ backgroundColor: selectedChips.includes(n.id) ? n.color : undefined }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {nutrientsList.filter(n => selectedChips.includes(n.id)).map(n => (
                  <div key={n.id} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium" style={{ color: n.color }}>{n.name}</span>
                      <span className="text-sm font-bold text-slate-100">{amounts[n.id]?.toFixed(2) || '0.00'} ml</span>
                    </div>
                    <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{ backgroundColor: n.color, width: `${((amounts[n.id] || 0) / 2.0) * 100}%` }}
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
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <div className="pt-4">
              <Button 
                variant="liquid-purple"
                className="w-full h-14 text-lg rounded-full" 
                onClick={handleConfirm}
                disabled={selectedChips.length === 0 || isReleasing}
              >
                {isReleasing ? 'Active Release In Progress' : 'Initiate Refill'}
              </Button>
            </div>

            {/* Wholesale Marketplace Section */}
            <div className="space-y-4 pb-8">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Wholesale Store</h3>
                <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest bg-teal-500/10 px-2 py-1 rounded border border-teal-500/20">100% Lab Tested & Original</span>
              </div>
              
              {/* Nutrient Selector for Purchase */}
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {nutrientsList.map(n => (
                  <button
                    key={n.id}
                    onClick={() => setSelectedNutrientForPurchase(n.id)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border whitespace-nowrap ${
                      selectedNutrientForPurchase === n.id 
                        ? 'border-purple-500/50 bg-purple-500/20 text-purple-400' 
                        : 'border-white/10 bg-white/5 text-slate-500'
                    }`}
                  >
                    {n.name}
                  </button>
                ))}
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
                {packs.map((pack) => (
                  <motion.button
                    key={pack.n}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenCheckout(pack)}
                    className={`relative flex-shrink-0 w-44 flex flex-col items-center p-6 rounded-[32px] border border-white/10 bg-gradient-to-b ${pack.color} backdrop-blur-xl overflow-hidden group snap-center`}
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]">
                      {pack.icon}
                    </div>
                    <span className="text-2xl font-bold text-slate-100 mb-1">{pack.n}</span>
                    <span className="text-xs font-medium text-slate-400 mb-2">{pack.desc}</span>
                    <span className="text-sm font-bold text-teal-400">₹{pack.price}</span>
                  </motion.button>
                ))}
              </div>
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
              <GlassCard className="w-full h-full rounded-[40px] border-2 border-purple-500/30 flex items-center justify-center relative overflow-hidden bg-white/5 backdrop-blur-2xl">
                <motion.div 
                  className="w-24 h-24 rounded-full border-4 border-purple-500/50 flex items-center justify-center relative bg-white/10 overflow-hidden"
                  initial={{ scale: 1 }}
                  animate={{ scale: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500 to-teal-400 opacity-80" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-purple-400" />
                </motion.div>
              </GlassCard>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-purple-400">Refill Secured</h2>
            <p className="text-slate-400">Starting controlled slow release...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHECKOUT FLOW OVERLAY */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col"
          >
            {/* Checkout Header */}
            <div className="p-6 pt-12 flex items-center justify-between">
              <button 
                onClick={() => setShowCheckout(false)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
              <h2 className="text-lg font-bold text-slate-100">Checkout</h2>
              <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {checkoutStep === 'review' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="text-center space-y-2">
                    <div className="w-20 h-20 rounded-3xl bg-purple-500/20 flex items-center justify-center mx-auto border border-purple-500/30">
                      {selectedPack?.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-100">{selectedPack?.n} {nutrientsList.find(n => n.id === selectedNutrientForPurchase)?.name} Pack</h3>
                    <p className="text-slate-400">Certified Medical Grade Supply</p>
                  </div>

                  <GlassCard className="p-6 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Item Price</span>
                      <span className="text-slate-100 font-bold">₹{selectedPack?.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Wholesale Discount</span>
                      <span className="text-teal-400 font-bold">- ₹45</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Delivery</span>
                      <span className="text-teal-400 font-bold">FREE</span>
                    </div>
                    <div className="pt-4 border-t border-white/10 flex justify-between">
                      <span className="font-bold text-slate-100">Total</span>
                      <span className="text-xl font-bold text-purple-400">₹{(parseInt(selectedPack?.price || '0') - 45)}</span>
                    </div>
                  </GlassCard>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <Truck className="w-5 h-5 text-teal-400" />
                      <div>
                        <p className="text-sm font-bold text-slate-200">Express Delivery</p>
                        <p className="text-xs text-slate-500">Arriving in 45 mins</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <ShieldCheck className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-sm font-bold text-slate-200">Quality Guaranteed</p>
                        <p className="text-xs text-slate-500">Certified Medical Grade Supply</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="liquid-purple" 
                    className="w-full h-14 rounded-full text-lg"
                    onClick={() => setCheckoutStep('payment')}
                  >
                    Continue to Payment
                  </Button>
                </motion.div>
              )}

              {checkoutStep === 'payment' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <h3 className="text-xl font-bold text-slate-100">Select Payment Method</h3>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'upi', name: 'UPI (GPay, PhonePe)', icon: <Wallet className="w-5 h-5" /> },
                      { id: 'card', name: 'Credit / Debit Card', icon: <CreditCard className="w-5 h-5" /> },
                      { id: 'cod', name: 'Cash on Delivery', icon: <Truck className="w-5 h-5" /> },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={handleProcessPayment}
                        className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-purple-500/50 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 text-slate-400 group-hover:text-purple-400 transition-colors">
                            {method.icon}
                          </div>
                          <span className="font-bold text-slate-200">{method.name}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {checkoutStep === 'processing' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
                    <motion.div 
                      className="absolute inset-0 border-4 border-t-purple-500 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100">Processing Secure Payment</h3>
                  <p className="text-slate-400">Connecting to Secure Gateway...</p>
                </div>
              )}

              {checkoutStep === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
                >
                  <div className="w-24 h-24 rounded-full bg-teal-500/20 flex items-center justify-center border-2 border-teal-500/50">
                    <CheckCircle2 className="w-12 h-12 text-teal-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-slate-100">Order Confirmed!</h3>
                    <p className="text-slate-400">Your {selectedPack?.n} pack is on its way.</p>
                  </div>
                  
                  <GlassCard className="p-6 w-full space-y-4">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                        <Truck className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200">Estimated Delivery</p>
                        <p className="text-xs text-teal-400">Today, 9:45 PM</p>
                      </div>
                    </div>
                  </GlassCard>

                  <Button 
                    variant="liquid-teal" 
                    className="w-full h-14 rounded-full text-lg"
                    onClick={() => setShowCheckout(false)}
                  >
                    Back to Refill
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
