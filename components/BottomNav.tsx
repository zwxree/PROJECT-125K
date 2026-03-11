"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Home, Droplet, Activity, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { hapticsEnabled, isNavHidden } = useStore();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show if scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } 
      // Hide if scrolling down and passed a threshold
      else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { name: 'Home', icon: Home, path: '/dashboard' },
    { name: 'Refill', icon: Droplet, path: '/refill' },
    { name: 'Monitor', icon: Activity, path: '/monitor' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  const handleNav = (path: string) => {
    if (hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }
    router.push(path);
  };

  if (pathname === '/') return null; // Don't show on splash screen

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe pointer-events-none">
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: (isNavHidden || !isVisible) ? 150 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={cn(
          "mx-4 mb-6 flex items-center justify-around rounded-full p-4 pointer-events-auto",
          "bg-white/5 backdrop-blur-2xl",
          "border border-white/10",
          "shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]"
        )}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => handleNav(item.path)}
              className="relative flex flex-col items-center justify-center w-16 h-12"
            >
              <motion.div
                whileTap={{ scale: 0.8 }}
                className={cn(
                  "flex flex-col items-center justify-center gap-1",
                  isActive ? "text-white" : "text-gray-500"
                )}
              >
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </motion.div>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
};
