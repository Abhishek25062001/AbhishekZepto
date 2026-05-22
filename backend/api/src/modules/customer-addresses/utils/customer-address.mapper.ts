import type { CustomerAddressRecord } from '../models/customer-address.model';
import type { CustomerAddressResponse } from '../types/customer-address.types';

export const toCustomerAddressResponse = (
  record: CustomerAddressRecord & { _id: { toString(): string } },
): CustomerAddressResponse => ({
  id: record._id.toString(),
  label: record.label,
  line1: record.line1,
  line2: record.line2,
  landmark: record.landmark,
  city: record.city,
  cityId: record.cityId ? record.cityId.toString() : null,
  state: record.state,
  postalCode: record.postalCode,
  country: record.country,
  latitude: record.latitude,
  longitude: record.longitude,
  isDefault: record.isDefault,
  status: record.status,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});
