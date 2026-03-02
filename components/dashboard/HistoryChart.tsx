"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'motion/react';
import { GlassCard } from '@/components/ui/GlassCard';

// Mock 7-day data
const data = [
  { day: 'Mon', vitD: 40, iron: 24 },
  { day: 'Tue', vitD: 42, iron: 26 },
  { day: 'Wed', vitD: 38, iron: 22 },
  { day: 'Thu', vitD: 45, iron: 30 },
  { day: 'Fri', vitD: 55, iron: 45 }, // Surge release day!
  { day: 'Sat', vitD: 50, iron: 42 },
  { day: 'Sun', vitD: 48, iron: 38 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <GlassCard className="p-3 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl bg-white/5">
        <p className="text-slate-400 text-xs mb-1 font-semibold uppercase">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </GlassCard>
    );
  }
  return null;
};

export default function HistoryChart() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-[300px] mt-6"
    >
      <GlassCard className="p-5 rounded-[32px] w-full h-full">
        <h3 className="font-semibold text-lg mb-4 pl-2 text-slate-100">7-Day Biomarker Trend</h3>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVitD" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FBBF24" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorIron" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F87171" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F87171" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="rgba(255,255,255,0.5)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 }} />
            <Area 
              type="monotone" 
              dataKey="vitD" 
              name="Vitamin D3"
              stroke="#FBBF24" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorVitD)" 
            />
            <Area 
              type="monotone" 
              dataKey="iron" 
              name="Serum Iron"
              stroke="#F87171" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorIron)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>
    </motion.div>
  );
}
