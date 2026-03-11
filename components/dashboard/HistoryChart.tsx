"use client";
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '@/components/ui/GlassCard';
import { usePatchStore } from '@/store/usePatchStore';

// Mock 7-day data for all biomarkers
const data = [
  { day: 'Mon', vitD: 40, iron: 24, ins: 12, pot: 70, cal: 85, zin: 42, vitC: 60, hyd: 85, cor: 15, lac: 4 },
  { day: 'Tue', vitD: 42, iron: 26, ins: 14, pot: 72, cal: 86, zin: 44, vitC: 62, hyd: 82, cor: 18, lac: 6 },
  { day: 'Wed', vitD: 38, iron: 22, ins: 11, pot: 68, cal: 84, zin: 40, vitC: 58, hyd: 75, cor: 25, lac: 12 },
  { day: 'Thu', vitD: 45, iron: 30, ins: 18, pot: 75, cal: 88, zin: 46, vitC: 65, hyd: 88, cor: 12, lac: 5 },
  { day: 'Fri', vitD: 55, iron: 45, ins: 25, pot: 80, cal: 92, zin: 50, vitC: 75, hyd: 92, cor: 10, lac: 3 },
  { day: 'Sat', vitD: 50, iron: 42, ins: 20, pot: 78, cal: 90, zin: 48, vitC: 70, hyd: 90, cor: 14, lac: 7 },
  { day: 'Sun', vitD: 48, iron: 38, ins: 15, pot: 76, cal: 89, zin: 47, vitC: 68, hyd: 95, cor: 11, lac: 4 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <GlassCard className="p-3 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl bg-white/5">
        <p className="text-slate-400 text-xs mb-1 font-semibold uppercase">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(1)}%
          </p>
        ))}
      </GlassCard>
    );
  }
  return null;
};

export default function HistoryChart() {
  const { nutrients } = usePatchStore();
  const [selectedId, setSelectedId] = useState('vitD');
  
  const selectedNutrient = nutrients.find(n => n.id === selectedId) || nutrients[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mt-6"
    >
      <GlassCard className="p-5 rounded-[32px] w-full">
        <div className="flex flex-col mb-6">
          <h3 className="font-semibold text-lg mb-4 pl-2 text-slate-100">7-Day Biomarker Trend</h3>
          
          {/* Biomarker Selector Tabs */}
          <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar -mx-2 px-2">
            {nutrients.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelectedId(n.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${
                  selectedId === n.id 
                    ? 'bg-white/10 border-white/20 text-white shadow-[0_4px_12px_rgba(255,255,255,0.1)]' 
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: n.color }} />
                  {n.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="h-[240px] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="selectedColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={selectedNutrient.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={selectedNutrient.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                  <Area 
                    type="monotone" 
                    dataKey={selectedId} 
                    name={selectedNutrient.name}
                    stroke={selectedNutrient.color} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#selectedColor)" 
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </div>
      </GlassCard>
    </motion.div>
  );
}
