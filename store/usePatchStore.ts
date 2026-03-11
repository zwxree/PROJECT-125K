import { create } from 'zustand';

interface Nutrient {
  id: string;
  name: string;
  value: number;
  color: string;
}

export interface Schedule {
  id: string;
  nutrientId: string;
  nutrientName: string;
  time: string; // HH:mm
  amount: number;
  isActive: boolean;
}

interface PatchState {
  isConnected: boolean;
  battery: number;
  isReleasing: boolean;
  nutrients: Nutrient[];
  aiMessage: string;
  isFallDetected: boolean;
  schedules: Schedule[];
  // Actions
  toggleRelease: () => void;
  startRelease: () => void;
  emergencyStop: () => void;
  triggerFallDetection: () => void;
  resolveFallDetection: () => void;
  syncTick: (deltaTime?: number) => void; // Called every frame for smooth live data
  generateInsight: () => void;
  addSchedule: (schedule: Omit<Schedule, 'id' | 'isActive'>) => void;
  removeSchedule: (id: string) => void;
  toggleSchedule: (id: string) => void;
}

const INITIAL_NUTRIENTS = [
  { id: 'vitD', name: 'Vitamin D3', value: 41.2, color: '#FBBF24' },
  { id: 'iron', name: 'Serum Iron', value: 28.5, color: '#F87171' },
  { id: 'ins', name: 'Blood Insulin', value: 12.5, color: '#60A5FA' },
  { id: 'pot', name: 'Potassium', value: 72.0, color: '#34D399' },
  { id: 'cal', name: 'Calcium', value: 88.5, color: '#A78BFA' },
  { id: 'zin', name: 'Zinc', value: 45.0, color: '#F472B6' },
  { id: 'vitC', name: 'Vitamin C', value: 65.2, color: '#FB923C' },
  { id: 'hyd', name: 'Hydration', value: 92.0, color: '#22D3EE' },
  { id: 'cor', name: 'Cortisol', value: 15.0, color: '#94A3B8' },
  { id: 'lac', name: 'Lactate', value: 5.0, color: '#EF4444' },
];

export const usePatchStore = create<PatchState>((set, get) => ({
  isConnected: true,
  battery: 87,
  isReleasing: false,
  nutrients: INITIAL_NUTRIENTS,
  aiMessage: "Authenticating biometrics...",
  isFallDetected: false,
  schedules: [
    { id: '1', nutrientId: 'mag', nutrientName: 'Magnesium', time: '22:00', amount: 15, isActive: true },
    { id: '2', nutrientId: 'vitD', nutrientName: 'Vitamin D3', time: '08:30', amount: 10, isActive: false },
  ],

  toggleRelease: () => set((state) => ({ isReleasing: !state.isReleasing })),
  startRelease: () => set({ isReleasing: true }),
  emergencyStop: () => set({ isReleasing: false }),
  triggerFallDetection: () => set({ isFallDetected: true }),
  resolveFallDetection: () => set({ isFallDetected: false }),

  addSchedule: (schedule) => set((state) => ({
    schedules: [...state.schedules, { ...schedule, id: Math.random().toString(36).substr(2, 9), isActive: true }]
  })),

  removeSchedule: (id) => set((state) => ({
    schedules: state.schedules.filter(s => s.id !== id)
  })),

  toggleSchedule: (id) => set((state) => ({
    schedules: state.schedules.map(s => {
      if (s.id === id) return { ...s, isActive: !s.isActive };
      return s;
    })
  })),

  // The engine that drives the real-time UI
  syncTick: (deltaTime: number = 1) => set((state) => {
    if (!state.isConnected) return state;

    // Scale change by deltaTime (assuming 1 unit = 1 second of metabolic time)
    // The original values were for a 5-second tick, so we divide by 5 to get per-second
    const timeScale = deltaTime / 5;

    const newNutrients = state.nutrients.map(n => {
      let change;
      
      // Custom fluctuation logic for different markers
      if (n.id === 'ins') {
        change = state.isReleasing 
          ? (Math.random() * 0.1 + 0.05) * timeScale
          : -(Math.random() * 0.05 + 0.01) * timeScale;
      } else if (n.id === 'cor') {
        // Cortisol spikes with "stress" (randomly)
        change = (Math.random() > 0.95 ? 2 : -0.05) * timeScale;
      } else if (n.id === 'hyd') {
        // Hydration drops naturally, increases with "release" (simulating hydration support)
        change = state.isReleasing ? 0.2 * timeScale : -0.08 * timeScale;
      } else if (n.id === 'lac') {
        // Lactate spikes during "activity" (randomly)
        change = (Math.random() > 0.9 ? 1.5 : -0.1) * timeScale;
      } else {
        change = state.isReleasing 
          ? (Math.random() * 0.05 + 0.01) * timeScale
          : -(Math.random() * 0.02 + 0.005) * timeScale;
      }
      return { ...n, value: Math.max(0, Math.min(100, +(n.value + change).toFixed(4))) };
    });

    // Slow battery drain simulation
    const batteryDrain = state.isReleasing ? 0.005 : 0.001;
    const newBattery = Math.max(0, state.battery - (batteryDrain * timeScale));

    return { nutrients: newNutrients, battery: +(newBattery.toFixed(3)) };
  }),

  // Context-Aware AI Engine
  generateInsight: () => set((state) => {
    const currentHour = new Date().getHours();
    const ironLevel = state.nutrients.find(n => n.id === 'iron')?.value || 100;
    const insulinLevel = state.nutrients.find(n => n.id === 'ins')?.value || 12;
    const cortisolLevel = state.nutrients.find(n => n.id === 'cor')?.value || 15;
    const hydrationLevel = state.nutrients.find(n => n.id === 'hyd')?.value || 90;
    const potassiumLevel = state.nutrients.find(n => n.id === 'pot')?.value || 70;
    const zincLevel = state.nutrients.find(n => n.id === 'zin')?.value || 45;
    
    let message = "";

    if (cortisolLevel > 40) {
      message = "Cortisol spike detected. AI suggests a 5-minute mindfulness break. Patch is adjusting L-Theanine delivery to stabilize stress response.";
    } else if (hydrationLevel < 70) {
      message = "Cellular hydration is dropping (68%). AI recommends immediate water intake. Patch is optimizing electrolyte balance to prevent brain fog.";
    } else if (potassiumLevel < 40) {
      message = "Potassium levels critically low. This can impact heart and muscle function. AI initiating micro-dose stabilization.";
    } else if (zincLevel < 30) {
      message = "Zinc deficiency detected. This may impact immune response and skin healing. AI recommends a Zinc-rich meal or patch-assisted boost.";
    } else if (insulinLevel > 25) {
      message = "Elevated Blood Insulin detected. AI suggests monitoring glucose levels. Patch is ready to stabilize if needed.";
    } else if (currentHour >= 1 && currentHour <= 4) {
      message = "Late-night cognitive strain detected at 3 AM. Based on your 45kg profile, AI recommends initiating an 8-hour slow-drip of Magnesium & L-Theanine for muscle recovery.";
    } else if (ironLevel < 30) {
      message = "Your Serum Iron levels are critically low today. AI recommends: Initiate an 8-hour slow-drip of Iron + Vitamin C mix to restore baseline.";
    } else {
      message = "Vitals stable. Electrolytes and trace minerals optimized. Project 325k is sensing and correcting baseline levels in real-time.";
    }

    return { aiMessage: message };
  }),
}));
