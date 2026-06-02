import { z } from 'zod';

import { mongoObjectIdValidator } from '../../../validators/common.validators';
import { STORE_STATUS_VALUES } from '../../stores/constants/store-status.constant';

export const VENDOR_MANAGEMENT_STATUS_VALUES = [
  'active',
  'inactive',
  'blocked',
  'suspended',
  'pending_approval',
  'deleted',
] as const;

export const VENDOR_MANAGEMENT_MUTATION_STATUS_VALUES = [
  'active',
  'inactive',
  'blocked',
  'suspended',
  'pending_approval',
] as const;

export const vendorIdParamValidator = {
  params: z.object({
    vendorId: mongoObjectIdValidator,
  }),
};

export const storeIdParamValidator = {
  params: z.object({
    storeId: mongoObjectIdValidator,
  }),
};

export const listVendorsQueryValidator = {
  query: z.object({
    status: z.enum(VENDOR_MANAGEMENT_STATUS_VALUES).optional(),
    cityId: mongoObjectIdValidator.optional(),
    search: z.string().trim().min(1).max(120).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};

export const listStoresQueryValidator = {
  query: z.object({
    status: z.enum(STORE_STATUS_VALUES).optional(),
    vendorId: mongoObjectIdValidator.optional(),
    cityId: mongoObjectIdValidator.optional(),
    search: z.string().trim().min(1).max(120).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};

export const updateVendorStatusValidator = {
  body: z.object({
    status: z.enum(VENDOR_MANAGEMENT_MUTATION_STATUS_VALUES),
    reason: z.string().trim().min(5).max(500),
  }),
};

export const updateStoreStatusValidator = {
  body: z.object({
    status: z.enum(STORE_STATUS_VALUES),
    reason: z.string().trim().min(5).max(500),
  }),
};

export const storeInspectionQueryValidator = {
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};
