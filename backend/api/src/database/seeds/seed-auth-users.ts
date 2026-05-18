import { Types } from 'mongoose';
import { AUTH_ROLE } from '../../modules/auth/constants/auth-role.constants';
import { WILDCARD_PERMISSION } from '../../modules/auth/constants/auth-permission.constants';
import { AUTH_ACCOUNT_STATUS } from '../../modules/auth/constants/auth-status.constants';
import {
  findUserIdentityByPhoneAndRole,
  createUserIdentity,
} from '../../modules/auth/repositories/user-identity.repository';
import type { AuthRole } from '../../modules/auth/types/auth-role.types';
import type { PermissionCode } from '../../modules/auth/types/auth-permission.types';

type SeedAuthUser = {
  phone: string;
  role: AuthRole;
  permissions?: PermissionCode[];
  vendorId?: Types.ObjectId | null;
  storeId?: Types.ObjectId | null;
  cityId?: Types.ObjectId | null;
};

const seededVendorId = new Types.ObjectId('65f0a0000000000000000001');
const seededStoreId = new Types.ObjectId('65f0a0000000000000000002');
const seededCityId = new Types.ObjectId('65f0a0000000000000000003');

export const developmentAuthUserSeedMatrix: SeedAuthUser[] = [
  {
    phone: '9999999999',
    role: AUTH_ROLE.CUSTOMER,
  },
  {
    phone: '8888888888',
    role: AUTH_ROLE.DELIVERY_AGENT,
    cityId: seededCityId,
  },
  {
    phone: '7777777777',
    role: AUTH_ROLE.VENDOR_OWNER,
    vendorId: seededVendorId,
    storeId: seededStoreId,
    cityId: seededCityId,
  },
  {
    phone: '6666666666',
    role: AUTH_ROLE.SUPER_ADMIN,
    permissions: [WILDCARD_PERMISSION],
  },
];

export const seedAuthIdentities = async (dryRun: boolean): Promise<void> => {
  if (dryRun) {
    console.log(
      `Dry run: auth user seed skipped for ${developmentAuthUserSeedMatrix.map((user) => user.phone).join(', ')}`,
    );
    return;
  }

  for (const seedUser of developmentAuthUserSeedMatrix) {
    const existingUser = await findUserIdentityByPhoneAndRole(seedUser.phone, seedUser.role);

    if (existingUser) {
      continue;
    }

    await createUserIdentity({
      phone: seedUser.phone,
      role: seedUser.role,
      accountStatus: AUTH_ACCOUNT_STATUS.ACTIVE,
      permissions: seedUser.permissions ?? [],
      vendorId: seedUser.vendorId ?? null,
      storeId: seedUser.storeId ?? null,
      cityId: seedUser.cityId ?? null,
    });
  }

  console.log('Development auth identities seeded');
};
