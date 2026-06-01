import type {
  CustomerAdminProfileRecord,
  CustomerIdentityRecord,
  CustomerManagementSummary,
} from '../types/customer-management.types';
import { CUSTOMER_RISK_STATUS } from '../constants/customer-management.constants';

const toIso = (date?: Date | null): string | null => date ? date.toISOString() : null;
const toId = (value?: { toString: () => string } | null): string | null => value ? value.toString() : null;

export const mapCustomerManagementSummary = (
  customer: CustomerIdentityRecord,
  profile?: CustomerAdminProfileRecord | null,
): CustomerManagementSummary => ({
  customerId: customer._id.toString(),
  userId: customer._id.toString(),
  name: customer.name,
  phone: customer.phone,
  email: customer.email,
  accountStatus: customer.accountStatus,
  cityId: toId(customer.cityId),
  riskStatus: profile?.riskStatus ?? CUSTOMER_RISK_STATUS.NORMAL,
  adminNotes: profile?.adminNotes ?? null,
  blockedAt: toIso(profile?.blockedAt),
  blockedBy: toId(profile?.blockedBy),
  blockReason: profile?.blockReason ?? null,
  lastLoginAt: toIso(customer.lastLoginAt),
  createdAt: customer.createdAt.toISOString(),
  updatedAt: customer.updatedAt.toISOString(),
});
