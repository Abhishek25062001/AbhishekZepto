import type { Types } from 'mongoose';
import type { AuthAccountStatus } from '../../auth/types/auth-status.types';
import type { UserIdentityRecord } from '../../auth/models/user-identity.model';
import type {
  CUSTOMER_MANAGEMENT_ACCOUNT_STATUS,
  CUSTOMER_RISK_STATUS,
} from '../constants/customer-management.constants';

export type CustomerRiskStatus =
  (typeof CUSTOMER_RISK_STATUS)[keyof typeof CUSTOMER_RISK_STATUS];

export type CustomerManagementAccountStatus =
  (typeof CUSTOMER_MANAGEMENT_ACCOUNT_STATUS)[keyof typeof CUSTOMER_MANAGEMENT_ACCOUNT_STATUS];

export type CustomerAdminProfileRecord = {
  customerId: Types.ObjectId;
  riskStatus: CustomerRiskStatus;
  adminNotes: string | null;
  blockedAt: Date | null;
  blockedBy: Types.ObjectId | null;
  blockReason: string | null;
  updatedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomerIdentityRecord = UserIdentityRecord & {
  _id: Types.ObjectId;
};

export type CustomerManagementSummary = {
  customerId: string;
  userId: string;
  name: string | null;
  phone: string;
  email: string | null;
  accountStatus: AuthAccountStatus;
  cityId: string | null;
  riskStatus: CustomerRiskStatus;
  adminNotes: string | null;
  blockedAt: string | null;
  blockedBy: string | null;
  blockReason: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ListCustomersInput = {
  status?: AuthAccountStatus;
  cityId?: string;
  actorCityId?: string | null;
  search?: string;
  createdFrom?: string;
  createdTo?: string;
  page: number;
  limit: number;
};

export type PaginatedCustomers = {
  items: CustomerManagementSummary[];
  page: number;
  limit: number;
  total: number;
};
