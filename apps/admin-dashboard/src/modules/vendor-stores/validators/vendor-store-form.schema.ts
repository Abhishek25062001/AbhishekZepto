import { z } from 'zod';

import {
  STORE_STATUS_OPTIONS,
  VENDOR_STATUS_OPTIONS,
} from '../constants/admin-vendor-store.constants';

const vendorStatusValues = VENDOR_STATUS_OPTIONS.map(option => option.value) as [string, ...string[]];
const storeStatusValues = STORE_STATUS_OPTIONS.map(option => option.value) as [string, ...string[]];

export const vendorStatusFormSchema = z.object({
  status: z.enum(vendorStatusValues),
  reason: z.string().trim().min(5).max(500),
});

export type VendorStatusFormValues = z.input<typeof vendorStatusFormSchema>;

export const storeStatusFormSchema = z.object({
  status: z.enum(storeStatusValues),
  reason: z.string().trim().min(5).max(500),
});

export type StoreStatusFormValues = z.input<typeof storeStatusFormSchema>;
