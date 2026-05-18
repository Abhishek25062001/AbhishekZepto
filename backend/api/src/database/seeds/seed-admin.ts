import { AUTH_ROLE } from '../../modules/auth/constants/auth-role.constants';
import { WILDCARD_PERMISSION } from '../../modules/auth/constants/auth-permission.constants';
import { AUTH_ACCOUNT_STATUS } from '../../modules/auth/constants/auth-status.constants';
import {
  createUserIdentity,
  findUserIdentityByPhoneAndRole,
} from '../../modules/auth/repositories/user-identity.repository';

export const seedSuperAdmin = async (dryRun: boolean): Promise<void> => {
  if (dryRun) {
    console.log('Dry run: super admin seed skipped');
    return;
  }

  const existingSuperAdmin = await findUserIdentityByPhoneAndRole(
    '6666666666',
    AUTH_ROLE.SUPER_ADMIN,
  );

  if (!existingSuperAdmin) {
    await createUserIdentity({
      phone: '6666666666',
      role: AUTH_ROLE.SUPER_ADMIN,
      accountStatus: AUTH_ACCOUNT_STATUS.ACTIVE,
      permissions: [WILDCARD_PERMISSION],
    });
  }

  console.log('Super admin seed completed');
};
