import type {
  FulfillmentType,
  StoreStatus,
  StoreType,
} from '../constants/store.constants';

export type StoreResponse = {
  id: string;
  vendorId: string;
  cityId: string;
  serviceAreaIds: string[];
  name: string;
  slug: string;
  code: string;
  description: string | null;
  phone: string;
  email: string | null;
  addressLine1: string;
  addressLine2: string | null;
  landmark: string | null;
  pincode: string;
  latitude: number;
  longitude: number;
  serviceRadiusKm: number;
  openingTime: string;
  closingTime: string;
  operatingDays: string[];
  isOpen: boolean;
  isAcceptingOrders: boolean;
  temporaryClosureReason: string | null;
  storeType: StoreType;
  fulfillmentType: FulfillmentType;
  status: StoreStatus;
  createdAt: string;
  updatedAt: string;
};

export type StoreFormValues = {
  vendorId: string;
  cityId: string;
  serviceAreaIds?: string[];
  name: string;
  slug?: string;
  description?: string | null;
  phone: string;
  email?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  landmark?: string | null;
  pincode: string;
  latitude: number;
  longitude: number;
  serviceRadiusKm: number;
  openingTime: string;
  closingTime: string;
  operatingDays: string[];
  isOpen?: boolean;
  isAcceptingOrders?: boolean;
  temporaryClosureReason?: string | null;
  storeType: StoreType;
  fulfillmentType: FulfillmentType;
  status: StoreStatus;
};

export type StoreListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  vendorId?: string;
  cityId?: string;
  serviceAreaId?: string;
  status?: StoreStatus;
  isOpen?: boolean;
  isAcceptingOrders?: boolean;
  storeType?: StoreType;
  fulfillmentType?: FulfillmentType;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};
