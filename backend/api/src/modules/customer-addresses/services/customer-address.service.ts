import { Types } from 'mongoose';
import { writeAuditLog } from '../../audit';
import { CUSTOMER_ADDRESS_AUDIT_EVENTS } from '../constants/customer-address-audit-events.constant';
import type { CustomerAddressRecord } from '../models/customer-address.model';
import {
  clearDefaultForCustomer,
  createAddress,
  findAddressByIdForCustomer,
  findAddressesByCustomerId,
  softDeleteAddressById,
  updateAddressById,
} from '../repositories/customer-address.repository';
import type {
  CreateCustomerAddressInput,
  CustomerAddressResponse,
  UpdateCustomerAddressInput,
} from '../types/customer-address.types';
import { addressNotFoundError } from '../utils/customer-address-error.mapper';
import { toCustomerAddressResponse } from '../utils/customer-address.mapper';

export type CustomerAddressAuditContext = {
  actorId: string;
  requestId?: string | null;
  traceId?: string | null;
};

const requireAddressForCustomer = async (
  addressId: string,
  customerId: string,
): Promise<CustomerAddressRecord & { _id: Types.ObjectId }> => {
  const address = await findAddressByIdForCustomer(addressId, customerId);

  if (!address) {
    throw addressNotFoundError();
  }

  return address;
};

const mapResponses = (
  records: (CustomerAddressRecord & { _id: Types.ObjectId })[],
): CustomerAddressResponse[] => records.map(toCustomerAddressResponse);

export const listCustomerAddresses = async (
  customerId: string,
): Promise<CustomerAddressResponse[]> => {
  const records = await findAddressesByCustomerId(customerId);
  return mapResponses(records);
};

export const createCustomerAddress = async (
  customerId: string,
  input: CreateCustomerAddressInput,
  audit: CustomerAddressAuditContext,
): Promise<CustomerAddressResponse> => {
  if (input.isDefault) {
    await clearDefaultForCustomer(customerId);
  }

  const created = await createAddress({
    customerId: new Types.ObjectId(customerId),
    label: input.label,
    line1: input.line1,
    line2: input.line2 ?? null,
    landmark: input.landmark ?? null,
    city: input.city,
    cityId: input.cityId ? new Types.ObjectId(input.cityId) : null,
    state: input.state ?? null,
    postalCode: input.postalCode ?? null,
    country: input.country ?? 'IN',
    latitude: input.latitude,
    longitude: input.longitude,
    isDefault: input.isDefault ?? false,
    status: 'active',
    isDeleted: false,
    deletedAt: null,
  });

  await writeAuditLog({
    eventType: CUSTOMER_ADDRESS_AUDIT_EVENTS.CREATED,
    actorId: new Types.ObjectId(audit.actorId),
    actorRole: 'customer',
    actorSurface: 'customer_app',
    entityType: 'customer_address',
    entityId: created._id,
    vendorId: null,
    storeId: null,
    cityId: created.cityId,
    requestId: audit.requestId ?? null,
    traceId: audit.traceId ?? null,
    ipAddress: null,
    userAgent: null,
    metadata: { label: created.label, city: created.city },
    status: 'success',
  });

  return toCustomerAddressResponse(created);
};

export const updateCustomerAddress = async (
  customerId: string,
  addressId: string,
  input: UpdateCustomerAddressInput,
  audit: CustomerAddressAuditContext,
): Promise<CustomerAddressResponse> => {
  await requireAddressForCustomer(addressId, customerId);

  if (input.isDefault) {
    await clearDefaultForCustomer(customerId);
  }

  const updated = await updateAddressById(addressId, customerId, {
    ...(input.label !== undefined ? { label: input.label } : {}),
    ...(input.line1 !== undefined ? { line1: input.line1 } : {}),
    ...(input.line2 !== undefined ? { line2: input.line2 } : {}),
    ...(input.landmark !== undefined ? { landmark: input.landmark } : {}),
    ...(input.city !== undefined ? { city: input.city } : {}),
    ...(input.cityId !== undefined
      ? { cityId: input.cityId ? new Types.ObjectId(input.cityId) : null }
      : {}),
    ...(input.state !== undefined ? { state: input.state } : {}),
    ...(input.postalCode !== undefined ? { postalCode: input.postalCode } : {}),
    ...(input.country !== undefined ? { country: input.country } : {}),
    ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
    ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
    ...(input.isDefault !== undefined ? { isDefault: input.isDefault } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
  });

  if (!updated) {
    throw addressNotFoundError();
  }

  await writeAuditLog({
    eventType: CUSTOMER_ADDRESS_AUDIT_EVENTS.UPDATED,
    actorId: new Types.ObjectId(audit.actorId),
    actorRole: 'customer',
    actorSurface: 'customer_app',
    entityType: 'customer_address',
    entityId: updated._id,
    vendorId: null,
    storeId: null,
    cityId: updated.cityId,
    requestId: audit.requestId ?? null,
    traceId: audit.traceId ?? null,
    ipAddress: null,
    userAgent: null,
    metadata: { label: updated.label },
    status: 'success',
  });

  return toCustomerAddressResponse(updated);
};

export const deleteCustomerAddress = async (
  customerId: string,
  addressId: string,
  audit: CustomerAddressAuditContext,
): Promise<void> => {
  const deleted = await softDeleteAddressById(addressId, customerId);

  if (!deleted) {
    throw addressNotFoundError();
  }

  await writeAuditLog({
    eventType: CUSTOMER_ADDRESS_AUDIT_EVENTS.DELETED,
    actorId: new Types.ObjectId(audit.actorId),
    actorRole: 'customer',
    actorSurface: 'customer_app',
    entityType: 'customer_address',
    entityId: deleted._id,
    vendorId: null,
    storeId: null,
    cityId: deleted.cityId,
    requestId: audit.requestId ?? null,
    traceId: audit.traceId ?? null,
    ipAddress: null,
    userAgent: null,
    metadata: { label: deleted.label },
    status: 'success',
  });
};

export const setDefaultCustomerAddress = async (
  customerId: string,
  addressId: string,
  audit: CustomerAddressAuditContext,
): Promise<CustomerAddressResponse> => {
  await requireAddressForCustomer(addressId, customerId);
  await clearDefaultForCustomer(customerId);

  const updated = await updateAddressById(addressId, customerId, { isDefault: true });

  if (!updated) {
    throw addressNotFoundError();
  }

  await writeAuditLog({
    eventType: CUSTOMER_ADDRESS_AUDIT_EVENTS.UPDATED,
    actorId: new Types.ObjectId(audit.actorId),
    actorRole: 'customer',
    actorSurface: 'customer_app',
    entityType: 'customer_address',
    entityId: updated._id,
    vendorId: null,
    storeId: null,
    cityId: updated.cityId,
    requestId: audit.requestId ?? null,
    traceId: audit.traceId ?? null,
    ipAddress: null,
    userAgent: null,
    metadata: { isDefault: true },
    status: 'success',
  });

  return toCustomerAddressResponse(updated);
};

export const getCustomerAddressForServiceability = async (
  customerId: string,
  addressId?: string,
): Promise<(CustomerAddressRecord & { _id: Types.ObjectId }) | null> => {
  if (!addressId) {
    return null;
  }

  return findAddressByIdForCustomer(addressId, customerId);
};
