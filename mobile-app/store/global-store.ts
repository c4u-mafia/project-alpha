import { create } from 'zustand';

interface GlobalState {
  role: 'tenant' | 'landlord';
  setRole: (role: 'tenant' | 'landlord') => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  role: 'tenant',
  setRole: (role) => set({ role }),
}));
