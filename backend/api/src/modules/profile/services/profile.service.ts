import type { UserIdentityRecord } from '../../auth/models/user-identity.model';
import {
  findCustomerProfileById,
  updateCustomerProfileById,
} from '../repositories/profile.repository';
import type {
  CustomerProfileResponse,
  UpdateCustomerProfileBody,
} from '../types/profile.types';
import {
  profileUserNotFoundError,
  profileValidationFailedError,
} from '../utils/profile-error.mapper';
import { toCustomerProfileResponse } from '../utils/profile-response.mapper';

const normalizeEmail = (email: string | null | undefined): string | null | undefined => {
  if (email === undefined) {
    return undefined;
  }

  if (email === null) {
    return null;
  }

  const trimmed = email.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : null;
};

const normalizeName = (name: string | null | undefined): string | null | undefined => {
  if (name === undefined) {
    return undefined;
  }

  if (name === null) {
    return null;
  }

  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const loadCustomerProfile = async (customerId: string): Promise<CustomerProfileResponse> => {
  const user = await findCustomerProfileById(customerId);

  if (!user) {
    throw profileUserNotFoundError();
  }

  return toCustomerProfileResponse(
    user as UserIdentityRecord & { _id: { toString(): string } },
  );
};

export const getCustomerProfile = async (
  customerId: string,
): Promise<CustomerProfileResponse> => loadCustomerProfile(customerId);

export const updateCustomerProfile = async (
  customerId: string,
  body: UpdateCustomerProfileBody,
): Promise<CustomerProfileResponse> => {
  const name = normalizeName(body.name);
  const email = normalizeEmail(body.email);

  if (name !== undefined && name !== null && name.length > 100) {
    throw profileValidationFailedError({ field: 'name' });
  }

  if (email !== undefined && email !== null && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw profileValidationFailedError({ field: 'email' });
  }

  const updated = await updateCustomerProfileById(customerId, {
    ...(name !== undefined ? { name } : {}),
    ...(email !== undefined ? { email } : {}),
  });

  if (!updated) {
    throw profileUserNotFoundError();
  }

  return toCustomerProfileResponse(
    updated as UserIdentityRecord & { _id: { toString(): string } },
  );
};
