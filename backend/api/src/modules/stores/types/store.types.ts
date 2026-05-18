import type { Types } from 'mongoose';
import type { StoreRecord } from '../models/store.model';
import type { StoreStatus } from '../constants/store-status.constant';
import type { StoreType } from '../constants/store-type.constant';
import type { FulfillmentType } from '../constants/fulfillment-type.constant';

export type { StoreStatus, StoreType, FulfillmentType };

export type StoreDocument = StoreRecord & {
  _id: Types.ObjectId;
};

export type CreateStoreInput = {
  vendorId: string;
  cityId: string;
  serviceAreaIds?: string[];
  name: string;
  slug?: string;
  code?: string;
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
  status?: StoreStatus;
};

export type UpdateStoreInput = {
  vendorId?: string;
  cityId?: string;
  serviceAreaIds?: string[];
  name?: string;
  slug?: string;
  code?: string;
  description?: string | null;
  phone?: string;
  email?: string | null;
  addressLine1?: string;
  addressLine2?: string | null;
  landmark?: string | null;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  serviceRadiusKm?: number;
  openingTime?: string;
  closingTime?: string;
  operatingDays?: string[];
  isOpen?: boolean;
  isAcceptingOrders?: boolean;
  temporaryClosureReason?: string | null;
  storeType?: StoreType;
  fulfillmentType?: FulfillmentType;
  status?: StoreStatus;
};

export type StoreListQuery = {
  page: number;
  limit: number;
  vendorId?: string;
  cityId?: string;
  serviceAreaId?: string;
  status?: StoreStatus;
  isOpen?: boolean;
  isAcceptingOrders?: boolean;
  storeType?: StoreType;
  fulfillmentType?: FulfillmentType;
  search?: string;
  sortBy?: 'name' | 'code' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};

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
  createdAt: Date;
  updatedAt: Date;
};
