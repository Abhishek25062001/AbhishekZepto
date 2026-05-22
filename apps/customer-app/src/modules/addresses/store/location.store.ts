import { create } from 'zustand';

import {
  CUSTOMER_SELECTED_ADDRESS_ID,
  CUSTOMER_SELECTED_STORE_ID,
  CUSTOMER_SELECTED_STORE_NAME,
  CUSTOMER_SELECTED_CITY_ID,
} from '../../../constants/storage-keys';
import {
  getSecureItem,
  removeSecureItem,
  setSecureItem,
} from '../../../services/storage/secure-storage.service';

type LocationStoreState = {
  selectedAddressId: string | null;
  selectedStoreId: string | null;
  selectedStoreName: string | null;
  cityId: string | null;
  isHydrated: boolean;
  hydrateLocation: () => Promise<void>;
  setSelectedLocation: (input: {
    addressId: string;
    storeId: string;
    storeName: string;
    cityId: string;
  }) => Promise<void>;
  clearSelectedLocation: () => Promise<void>;
};

export const useLocationStore = create<LocationStoreState>((set) => ({
  selectedAddressId: null,
  selectedStoreId: null,
  selectedStoreName: null,
  cityId: null,
  isHydrated: false,
  hydrateLocation: async () => {
    const [addressId, storeId, storeName, cityId] = await Promise.all([
      getSecureItem(CUSTOMER_SELECTED_ADDRESS_ID),
      getSecureItem(CUSTOMER_SELECTED_STORE_ID),
      getSecureItem(CUSTOMER_SELECTED_STORE_NAME),
      getSecureItem(CUSTOMER_SELECTED_CITY_ID),
    ]);

    set({
      selectedAddressId: addressId,
      selectedStoreId: storeId,
      selectedStoreName: storeName,
      cityId,
      isHydrated: true,
    });
  },
  setSelectedLocation: async ({ addressId, storeId, storeName, cityId }) => {
    await Promise.all([
      setSecureItem(CUSTOMER_SELECTED_ADDRESS_ID, addressId),
      setSecureItem(CUSTOMER_SELECTED_STORE_ID, storeId),
      setSecureItem(CUSTOMER_SELECTED_STORE_NAME, storeName),
      setSecureItem(CUSTOMER_SELECTED_CITY_ID, cityId),
    ]);

    set({
      selectedAddressId: addressId,
      selectedStoreId: storeId,
      selectedStoreName: storeName,
      cityId,
    });
  },
  clearSelectedLocation: async () => {
    await Promise.all([
      removeSecureItem(CUSTOMER_SELECTED_ADDRESS_ID),
      removeSecureItem(CUSTOMER_SELECTED_STORE_ID),
      removeSecureItem(CUSTOMER_SELECTED_STORE_NAME),
      removeSecureItem(CUSTOMER_SELECTED_CITY_ID),
    ]);

    set({
      selectedAddressId: null,
      selectedStoreId: null,
      selectedStoreName: null,
      cityId: null,
    });
  },
}));

export const hasSelectedStore = (): boolean => Boolean(useLocationStore.getState().selectedStoreId);
