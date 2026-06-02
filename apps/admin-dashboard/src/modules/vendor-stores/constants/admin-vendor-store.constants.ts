import type {
  StoreManagementStatus,
  VendorManagementStatus,
} from '../types/admin-vendor-store.types';

export const VENDOR_STATUS_OPTIONS: Array<{ label: string; value: VendorManagementStatus }> = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Pending Approval', value: 'pending_approval' },
];

export const STORE_STATUS_OPTIONS: Array<{ label: string; value: StoreManagementStatus }> = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Archived', value: 'archived' },
];
