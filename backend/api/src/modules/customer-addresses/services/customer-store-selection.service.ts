import { Types } from 'mongoose';
import { writeAuditLog } from '../../audit';
import { findStoreById } from '../../stores/repositories/store.repository';
import { CUSTOMER_ADDRESS_AUDIT_EVENTS } from '../constants/customer-address-audit-events.constant';
import { findAddressByIdForCustomer } from '../repositories/customer-address.repository';
import { upsertSelectedStore } from '../repositories/customer-store-selection.repository';
import type {
  SelectStoreInput,
  ServiceabilityInput,
  ServiceabilityResult,
  StoreSelectionResponse,
} from '../types/customer-address.types';
import {
  addressNotFoundError,
  storeNotFoundError,
  storeNotServiceableError,
} from '../utils/customer-address-error.mapper';
import type { CustomerAddressAuditContext } from './customer-address.service';
import {
  findNearestServiceableStore,
  isStoreServiceableForCoordinates,
} from './store-serviceability.service';

export const checkServiceability = async (
  customerId: string,
  input: ServiceabilityInput,
): Promise<ServiceabilityResult> => {
  let latitude = input.latitude;
  let longitude = input.longitude;
  let cityId: string | null | undefined;

  if (input.addressId) {
    const address = await findAddressByIdForCustomer(input.addressId, customerId);

    if (!address) {
      throw addressNotFoundError();
    }

    latitude = address.latitude;
    longitude = address.longitude;
    cityId = address.cityId ? address.cityId.toString() : undefined;
  }

  return findNearestServiceableStore({ latitude, longitude, cityId });
};

export const selectStoreForCustomer = async (
  customerId: string,
  input: SelectStoreInput,
  audit: CustomerAddressAuditContext,
): Promise<StoreSelectionResponse> => {
  const address = await findAddressByIdForCustomer(input.addressId, customerId);

  if (!address) {
    throw addressNotFoundError();
  }

  const store = await findStoreById(input.storeId);

  if (!store) {
    throw storeNotFoundError();
  }

  const serviceable = await isStoreServiceableForCoordinates({
    storeId: input.storeId,
    latitude: address.latitude,
    longitude: address.longitude,
  });

  if (!serviceable) {
    throw storeNotServiceableError();
  }

  await upsertSelectedStore({
    customerId,
    addressId: input.addressId,
    storeId: input.storeId,
  });

  await writeAuditLog({
    eventType: CUSTOMER_ADDRESS_AUDIT_EVENTS.STORE_SELECTED,
    actorId: new Types.ObjectId(audit.actorId),
    actorRole: 'customer',
    actorSurface: 'customer_app',
    entityType: 'customer_store_selection',
    entityId: new Types.ObjectId(input.storeId),
    vendorId: store.vendorId,
    storeId: store._id,
    cityId: store.cityId,
    requestId: audit.requestId ?? null,
    traceId: audit.traceId ?? null,
    ipAddress: null,
    userAgent: null,
    metadata: { addressId: input.addressId },
    status: 'success',
  });

  return {
    storeId: store._id.toString(),
    storeName: store.name,
    cityId: store.cityId.toString(),
    addressId: input.addressId,
    isSelected: true,
  };
};
