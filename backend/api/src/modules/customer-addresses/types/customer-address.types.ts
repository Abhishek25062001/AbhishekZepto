import type { CustomerAddressStatus } from '../constants/customer-address-status.constant';

export type CreateCustomerAddressInput = {
  label: string;
  line1: string;
  line2?: string | null;
  landmark?: string | null;
  city: string;
  cityId?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
};

export type UpdateCustomerAddressInput = Partial<CreateCustomerAddressInput> & {
  status?: CustomerAddressStatus;
};

export type CustomerAddressResponse = {
  id: string;
  label: string;
  line1: string;
  line2: string | null;
  landmark: string | null;
  city: string;
  cityId: string | null;
  state: string | null;
  postalCode: string | null;
  country: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  status: CustomerAddressStatus;
  createdAt: string;
  updatedAt: string;
};

export type ServiceabilityInput = {
  latitude: number;
  longitude: number;
  addressId?: string;
};

export type ServiceabilityResult = {
  storeId: string;
  storeName: string;
  cityId: string;
  distanceKm: number;
};

export type SelectStoreInput = {
  addressId: string;
  storeId: string;
};

export type StoreSelectionResponse = {
  storeId: string;
  storeName: string;
  cityId: string;
  addressId: string;
  isSelected: boolean;
};
