import { create } from 'zustand';

type UiStoreState = {
  sidebarOpen: boolean;
  activeStoreId: string | null;
  activeVendorId: string | null;
  toggleSidebar: () => void;
  setActiveStore: (activeStoreId: string | null) => void;
};

export const useUiStore = create<UiStoreState>((set) => ({
  sidebarOpen: true,
  activeStoreId: null,
  activeVendorId: null,
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),
  setActiveStore: (activeStoreId) => set({ activeStoreId }),
}));

