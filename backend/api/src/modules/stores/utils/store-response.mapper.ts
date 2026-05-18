import type { Types } from 'mongoose';
import type { StoreRecord } from '../models/store.model';
import type { StoreResponse } from '../types/store.types';
import type { FulfillmentType } from '../constants/fulfillment-type.constant';
import type { StoreStatus } from '../constants/store-status.constant';
import type { StoreType } from '../constants/store-type.constant';

type StoreLean = StoreRecord & { _id: Types.ObjectId };

export const toStoreResponse = (store: StoreLean): StoreResponse => ({
  id: store._id.toString(),
  vendorId: store.vendorId.toString(),
  cityId: store.cityId.toString(),
  serviceAreaIds: store.serviceAreaIds.map((id) => id.toString()),
  name: store.name,
  slug: store.slug,
  code: store.code,
  description: store.description,
  phone: store.phone,
  email: store.email,
  addressLine1: store.addressLine1,
  addressLine2: store.addressLine2,
  landmark: store.landmark,
  pincode: store.pincode,
  latitude: store.latitude,
  longitude: store.longitude,
  serviceRadiusKm: store.serviceRadiusKm,
  openingTime: store.openingTime,
  closingTime: store.closingTime,
  operatingDays: store.operatingDays,
  isOpen: store.isOpen,
  isAcceptingOrders: store.isAcceptingOrders,
  temporaryClosureReason: store.temporaryClosureReason,
  storeType: store.storeType as StoreType,
  fulfillmentType: store.fulfillmentType as FulfillmentType,
  status: store.status as StoreStatus,
  createdAt: store.createdAt,
  updatedAt: store.updatedAt,
});
