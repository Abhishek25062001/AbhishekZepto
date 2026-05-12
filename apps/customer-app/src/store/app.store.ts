import { create } from 'zustand';

type AppStoreState = {
  selectedAddressId: string | null;
  selectedStoreId: string | null;
  serviceableCityId: string | null;
  setSelectedAddress: (selectedAddressId: string | null) => void;
  setSelectedStore: (selectedStoreId: string | null) => void;
};

export const useAppStore = create<AppStoreState>((set) => ({
  selectedAddressId: null,
  selectedStoreId: null,
  serviceableCityId: null,
  setSelectedAddress: (selectedAddressId) => set({ selectedAddressId }),
  setSelectedStore: (selectedStoreId) => set({ selectedStoreId }),
}));

