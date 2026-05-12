import { create } from 'zustand';

type UiStoreState = {
  sidebarOpen: boolean;
  activeCityId: string | null;
  activeStoreId: string | null;
  toggleSidebar: () => void;
  setActiveCity: (activeCityId: string | null) => void;
  setActiveStore: (activeStoreId: string | null) => void;
};

export const useUiStore = create<UiStoreState>((set) => ({
  sidebarOpen: true,
  activeCityId: null,
  activeStoreId: null,
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),
  setActiveCity: (activeCityId) => set({ activeCityId }),
  setActiveStore: (activeStoreId) => set({ activeStoreId }),
}));

