import type { UserIdentityRecord } from '../../auth/models/user-identity.model';
import type { CustomerProfileResponse } from '../types/profile.types';

export const toCustomerProfileResponse = (
  user: UserIdentityRecord & { _id: { toString(): string } },
): CustomerProfileResponse => ({
  customerId: user._id.toString(),
  phone: user.phone,
  name: user.name,
  email: user.email,
});
