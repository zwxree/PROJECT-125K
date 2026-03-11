import { create } from 'zustand';

interface UserProfile {
  name: string;
  abhaId: string;
  height: string;
  weight: string;
  bloodGroup: string;
  allergies: string;
  history: string;
  meds: string;
  contact: string;
}

interface NutrientLevel {
  id: string;
  name: string;
  level: number;
  status: 'Low' | 'Deficient' | 'Normal' | 'Optimal';
  color: string;
}

interface AppState {
  isSynced: boolean;
  isSyncing: boolean;
  syncError: string | null;
  battery: number;
  lastSynced: string;
  profile: UserProfile | null;
  nutrients: NutrientLevel[];
  isReleasing: boolean;
  releaseProgress: number;
  hapticsEnabled: boolean;
  notificationsEnabled: boolean;
  fallDetectionEnabled: boolean;
  isNavHidden: boolean;
  
  syncNFC: () => Promise<void>;
  resetSync: () => void;
  disconnectPatch: () => void;
  startRefill: (amounts: Record<string, number>) => void;
  updateReleaseProgress: (progress: number) => void;
  completeRelease: () => void;
  toggleHaptics: () => void;
  toggleNotifications: () => void;
  toggleFallDetection: () => void;
  setNavHidden: (hidden: boolean) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

export const useStore = create<AppState>((set) => ({
  isSynced: false,
  isSyncing: false,
  syncError: null,
  battery: 87,
  lastSynced: '2 min ago',
  profile: null,
  nutrients: [
    { id: 'vitD', name: 'Vitamin D', level: 41, status: 'Low', color: '#FBBF24' },
    { id: 'iron', name: 'Iron', level: 28, status: 'Deficient', color: '#F87171' },
    { id: 'vitB12', name: 'Vitamin B12', level: 89, status: 'Normal', color: '#34D399' },
  ],
  isReleasing: false,
  releaseProgress: 0,
  hapticsEnabled: true,
  notificationsEnabled: true,
  fallDetectionEnabled: true,
  isNavHidden: false,

  syncNFC: async () => {
    set({ isSyncing: true, syncError: null });
    
    // Simulate network/hardware delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 20% chance of failure for simulation
    if (Math.random() < 0.2) {
      set({ 
        isSyncing: false, 
        syncError: 'Patch Not Found. Ensure NFC is enabled and patch is applied to skin.' 
      });
      return;
    }

    set({
      isSynced: true,
      isSyncing: false,
      profile: {
        name: 'Rahul Sharma',
        abhaId: '14-1234-5678-9012',
        height: '5\'7"',
        weight: '65 kg',
        bloodGroup: 'B+',
        allergies: 'Penicillin, Peanuts',
        history: 'Type 2 Diabetes, Hypertension, adhd',
        meds: 'Metformin 500mg, Amlodipine 5mg',
        contact: '+919876543210',
      },
      lastSynced: 'Just now',
    });
  },

  resetSync: () => {
    set({ isSyncing: false, syncError: null });
  },

  disconnectPatch: () => {
    set({
      isSynced: false,
      isSyncing: false,
      syncError: null,
      profile: null,
      isReleasing: false,
      releaseProgress: 0,
    });
  },

  startRefill: (amounts) => {
    set({ isReleasing: true, releaseProgress: 0 });
    // In a real app, this would trigger the hardware
  },

  updateReleaseProgress: (progress) => {
    set({ releaseProgress: progress });
  },

  completeRelease: () => {
    set((state) => ({
      isReleasing: false,
      releaseProgress: 100,
      nutrients: state.nutrients.map(n => {
        if (n.id === 'vitD') return { ...n, level: 85, status: 'Optimal', color: '#34D399' };
        if (n.id === 'iron') return { ...n, level: 75, status: 'Normal', color: '#34D399' };
        return n;
      })
    }));
  },

  toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
  toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
  toggleFallDetection: () => set((state) => ({ fallDetectionEnabled: !state.fallDetectionEnabled })),
  setNavHidden: (hidden) => set({ isNavHidden: hidden }),
  updateProfile: (newProfile) => set((state) => ({
    profile: state.profile ? { ...state.profile, ...newProfile } : {
      name: '', abhaId: '', height: '', weight: '', bloodGroup: '', allergies: '', history: '', meds: '', contact: '',
      ...newProfile
    }
  })),
}));
