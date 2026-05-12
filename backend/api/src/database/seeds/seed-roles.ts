import { AUTH_ROLE } from '../../modules/auth/constants/auth-role.constants';
import { WILDCARD_PERMISSION } from '../../modules/auth/constants/auth-permission.constants';
import { upsertSystemRole } from '../../modules/auth/repositories/role.repository';

const systemRoles = [
  {
    code: AUTH_ROLE.CUSTOMER,
    name: 'Customer',
    permissions: ['auth:read'],
  },
  {
    code: AUTH_ROLE.DELIVERY_AGENT,
    name: 'Delivery Agent',
    permissions: ['auth:read'],
  },
  {
    code: AUTH_ROLE.VENDOR_OWNER,
    name: 'Vendor Owner',
    permissions: ['auth:read'],
  },
  {
    code: AUTH_ROLE.STORE_MANAGER,
    name: 'Store Manager',
    permissions: ['auth:read'],
  },
  {
    code: AUTH_ROLE.STORE_STAFF,
    name: 'Store Staff',
    permissions: ['auth:read'],
  },
  {
    code: AUTH_ROLE.SUPPORT_ADMIN,
    name: 'Support Admin',
    permissions: ['auth:read'],
  },
  {
    code: AUTH_ROLE.OPERATIONS_ADMIN,
    name: 'Operations Admin',
    permissions: ['auth:read'],
  },
  {
    code: AUTH_ROLE.SUPER_ADMIN,
    name: 'Super Admin',
    permissions: [WILDCARD_PERMISSION],
  },
];

export const seedRoles = async (dryRun: boolean): Promise<void> => {
  if (dryRun) {
    console.log(
      `Dry run: roles seed skipped for ${systemRoles.map((role) => role.code).join(', ')}`,
    );
    return;
  }

  for (const role of systemRoles) {
    await upsertSystemRole({
      ...role,
      description: null,
      isSystemRole: true,
      isEditable: false,
    });
  }

  console.log('Roles seed placeholder completed');
};
