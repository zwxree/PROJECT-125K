"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, ArrowRight, Fingerprint, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes: if email contains 'new', treat as new user
    const isNew = email.toLowerCase().includes('new');
    login(email, isNew);
    
    if (isNew) {
      router.push('/onboarding');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-teal-400 mb-6 shadow-[0_8px_20px_rgba(168,85,247,0.4)]"
          >
            <ShieldCheck className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 mt-2">Sign in to your Project 325k account</p>
        </div>

        <GlassCard className="p-8 border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <button type="button" className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                Forgot Password?
              </button>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="rounded border-white/10 bg-white/5 text-purple-500" />
                <label htmlFor="remember" className="text-xs text-slate-400">Remember me</label>
              </div>
            </div>

            <Button
              type="submit"
              variant="liquid-purple"
              className="w-full h-14 rounded-2xl text-lg font-bold"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full"
                />
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <p className="text-xs text-slate-500 font-medium">Or continue with Biometrics</p>
            <button className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group">
              <Fingerprint className="w-8 h-8 text-slate-400 group-hover:text-teal-400 transition-colors" />
            </button>
          </div>
        </GlassCard>

        <p className="text-center mt-8 text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <button 
            onClick={() => {
              setEmail('newuser@example.com');
              setPassword('password');
            }}
            className="text-purple-400 font-bold hover:underline"
          >
            Create one
          </button>
        </p>
      </motion.div>
    </div>
  );
}
