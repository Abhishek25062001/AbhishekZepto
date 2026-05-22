export type ServiceabilityResult = {
  storeId: string;
  storeName: string;
  cityId: string;
  distanceKm: number;
};

export type StoreSelectionResult = {
  storeId: string;
  storeName: string;
  cityId: string;
  addressId: string;
  isSelected: boolean;
};

export type ServiceabilityInput = {
  latitude: number;
  longitude: number;
  addressId?: string;
};

export type SelectStoreInput = {
  addressId: string;
  storeId: string;
};
