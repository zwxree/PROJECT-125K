import { create } from 'zustand';

interface Nutrient {
  id: string;
  name: string;
  value: number;
  color: string;
}

interface PatchState {
  isConnected: boolean;
  battery: number;
  isReleasing: boolean;
  nutrients: Nutrient[];
  aiMessage: string;
  isFallDetected: boolean;
  // Actions
  toggleRelease: () => void;
  startRelease: () => void;
  emergencyStop: () => void;
  triggerFallDetection: () => void;
  resolveFallDetection: () => void;
  syncTick: () => void; // Called every second to simulate live data
  generateInsight: () => void;
}

const INITIAL_NUTRIENTS = [
  { id: 'vitD', name: 'Vitamin D3', value: 41.2, color: '#FBBF24' },
  { id: 'iron', name: 'Serum Iron', value: 28.5, color: '#F87171' },
  { id: 'b12', name: 'Vitamin B12', value: 89.1, color: '#34D399' },
  { id: 'mag', name: 'Magnesium', value: 65.0, color: '#A78BFA' },
];

export const usePatchStore = create<PatchState>((set, get) => ({
  isConnected: true,
  battery: 87,
  isReleasing: false,
  nutrients: INITIAL_NUTRIENTS,
  aiMessage: "Authenticating biometrics...",
  isFallDetected: false,

  toggleRelease: () => set((state) => ({ isReleasing: !state.isReleasing })),
  startRelease: () => set({ isReleasing: true }),
  emergencyStop: () => set({ isReleasing: false }),
  triggerFallDetection: () => set({ isFallDetected: true }),
  resolveFallDetection: () => set({ isFallDetected: false }),

  // The engine that drives the real-time UI
  syncTick: () => set((state) => {
    if (!state.isConnected) return state;

    const newNutrients = state.nutrients.map(n => {
      const change = state.isReleasing 
        ? (Math.random() * 0.05 + 0.01) // Releasing: Levels go up smoothly
        : -(Math.random() * 0.02 + 0.005); // Idle: Natural metabolic drop
      return { ...n, value: Math.max(0, Math.min(100, +(n.value + change).toFixed(2))) };
    });

    // Slow battery drain simulation
    const newBattery = state.isReleasing ? state.battery - 0.005 : state.battery - 0.001;

    return { nutrients: newNutrients, battery: +(newBattery.toFixed(1)) };
  }),

  // Context-Aware AI Engine
  generateInsight: () => set((state) => {
    const currentHour = new Date().getHours();
    const ironLevel = state.nutrients.find(n => n.id === 'iron')?.value || 100;
    
    let message = "";

    if (currentHour >= 1 && currentHour <= 4) {
      // Late night / 3 AM context
      message = "Late-night cognitive strain detected at 3 AM. Based on your 45kg profile, AI recommends initiating an 8-hour slow-drip of Magnesium & L-Theanine for muscle recovery.";
    } else if (ironLevel < 30) {
      message = "Your Serum Iron levels are critically low today. AI recommends: Initiate an 8-hour slow-drip of Iron + Vitamin C mix to restore baseline.";
    } else {
      message = "Vitals stable. Maintaining baseline micro-dosing. Lean tissue repair optimized. AI Auto-Optimize available.";
    }

    return { aiMessage: message };
  }),
}));
