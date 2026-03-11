"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Shield, Zap, Activity, Heart, ArrowRight, Check } from 'lucide-react';

const steps = [
  {
    title: "Advanced Biometrics",
    description: "Project 325k uses medical-grade sensors to monitor your metabolic health in real-time.",
    icon: Activity,
    color: "text-purple-400",
    bg: "bg-purple-400/10"
  },
  {
    title: "Smart Nutrient Patch",
    description: "Our transdermal patch delivers precise micro-doses of vitamins and minerals directly to your bloodstream.",
    icon: Zap,
    color: "text-teal-400",
    bg: "bg-teal-400/10"
  },
  {
    title: "AI Health Guard",
    description: "Integrated fall detection and emergency alerts keep you safe 24/7, wherever you are.",
    icon: Shield,
    color: "text-amber-400",
    bg: "bg-amber-400/10"
  },
  {
    title: "You're All Set",
    description: "Ready to start your journey towards optimal health? Let's sync your first patch.",
    icon: Heart,
    color: "text-red-400",
    bg: "bg-red-400/10"
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = useStore();
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding();
      router.push('/');
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10 flex flex-col h-full">
        <div className="flex justify-between items-center mb-12">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentStep ? 'w-8 bg-purple-500' : 'w-2 bg-white/10'
                }`} 
              />
            ))}
          </div>
          <button 
            onClick={() => {
              completeOnboarding();
              router.push('/');
            }}
            className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors"
          >
            Skip
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center"
            >
              <div className={`w-24 h-24 rounded-[32px] ${steps[currentStep].bg} flex items-center justify-center mb-10 border border-white/10 shadow-xl`}>
                <StepIcon className={`w-12 h-12 ${steps[currentStep].color}`} />
              </div>
              
              <h1 className="text-3xl font-bold text-slate-100 tracking-tight mb-4">
                {steps[currentStep].title}
              </h1>
              
              <p className="text-slate-400 text-lg leading-relaxed px-4">
                {steps[currentStep].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-12">
          <Button
            variant={currentStep === steps.length - 1 ? "liquid-teal" : "liquid-purple"}
            className="w-full h-16 rounded-2xl text-lg font-bold shadow-lg"
            onClick={nextStep}
          >
            {currentStep === steps.length - 1 ? (
              <span className="flex items-center gap-2">
                Get Started <Check className="w-6 h-6" />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue <ArrowRight className="w-6 h-6" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
