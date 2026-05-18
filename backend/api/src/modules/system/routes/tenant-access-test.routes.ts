import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';
import { authenticate } from '../../auth/middlewares/authenticate.middleware';
import { requireAnyPermission } from '../../auth/middlewares/require-any-permission.middleware';
import { requireRole } from '../../auth/middlewares/require-role.middleware';
import { requireStoreScope } from '../../auth/middlewares/require-store-scope.middleware';
import { requireVendorScope } from '../../auth/middlewares/require-vendor-scope.middleware';
import { createPermissionCode } from '../../auth/utils/permission-code.util';
import {
  createTenantAccessTestRecordController,
  listCustomerTenantAccessTestRecordsController,
  listDeliveryAgentTenantAccessTestRecordsController,
  listVendorStoreTenantAccessTestRecordsController,
} from '../controllers/tenant-access-test.controller';
import {
  createTenantAccessTestRecordValidator,
  customerTenantAccessLookupValidator,
  deliveryAgentTenantAccessLookupValidator,
  vendorStoreTenantAccessLookupValidator,
} from '../validators/tenant-access-test.validators';

const router = Router();

const getSingleParam = (value: string | string[] | undefined): string | null => {
  return typeof value === 'string' ? value : null;
};

const adminInternalTenantAccessRoles = [
  AUTH_ROLE.SUPPORT_ADMIN,
  AUTH_ROLE.OPERATIONS_ADMIN,
  AUTH_ROLE.SUPER_ADMIN,
] as const;

const usersReadPermission = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.USERS,
  AUTH_PERMISSION_ACTION.READ,
);
const settingsManagePermission = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.SETTINGS,
  AUTH_PERMISSION_ACTION.MANAGE,
);
const vendorReadStorePermission = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.VENDOR,
  AUTH_PERMISSION_ACTION.READ_STORE,
);
const customerReadSelfPermission = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.CUSTOMER,
  AUTH_PERMISSION_ACTION.READ_SELF,
);
const deliveryReadSelfPermission = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.DELIVERY,
  AUTH_PERMISSION_ACTION.READ_SELF,
);

router.post(
  '/test-records',
  authenticate(),
  requireRole(adminInternalTenantAccessRoles),
  requireAnyPermission([usersReadPermission, settingsManagePermission]),
  validateRequest(createTenantAccessTestRecordValidator),
  createTenantAccessTestRecordController,
);

router.get(
  '/vendor/:vendorId/store/:storeId/test-records',
  authenticate(),
  requireAnyPermission([vendorReadStorePermission, usersReadPermission]),
  validateRequest(vendorStoreTenantAccessLookupValidator),
  requireVendorScope((request) => getSingleParam(request.params.vendorId)),
  requireStoreScope((request) => getSingleParam(request.params.storeId)),
  listVendorStoreTenantAccessTestRecordsController,
);

router.get(
  '/customer/:customerId/test-records',
  authenticate(),
  requireAnyPermission([customerReadSelfPermission, usersReadPermission]),
  validateRequest(customerTenantAccessLookupValidator),
  listCustomerTenantAccessTestRecordsController,
);

router.get(
  '/delivery-agent/:deliveryAgentId/test-records',
  authenticate(),
  requireAnyPermission([deliveryReadSelfPermission, usersReadPermission]),
  validateRequest(deliveryAgentTenantAccessLookupValidator),
  listDeliveryAgentTenantAccessTestRecordsController,
);

export default router;
