import { Router } from 'express';
import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../constants/auth-permission.constants';
import {
  cityScopeTestController,
  storeScopeTestController,
  vendorScopeTestController,
} from '../controllers/auth-scope-test.controller';
import {
  authSessionListTestController,
  authSessionRevokeTestController,
  authTestController,
} from '../controllers/auth-test.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { requireCityScope } from '../middlewares/require-city-scope.middleware';
import { requirePermission } from '../middlewares/require-permission.middleware';
import { requireStoreScope } from '../middlewares/require-store-scope.middleware';
import { requireVendorScope } from '../middlewares/require-vendor-scope.middleware';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import { logoutSessionValidator } from '../validators/auth.validators';
import { createPermissionCode } from '../utils/permission-code.util';

const router = Router();
const authReadPermission = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.AUTH,
  AUTH_PERMISSION_ACTION.READ,
);

router.get(
  '/test-protected',
  authenticate(),
  requirePermission(authReadPermission),
  authTestController,
);
router.get('/test-session-list', authenticate(), authSessionListTestController);
router.post(
  '/test-session-revoke',
  authenticate(),
  validateRequest(logoutSessionValidator),
  authSessionRevokeTestController,
);
router.get(
  '/test-vendor-scope',
  authenticate(),
  requireVendorScope((request) =>
    typeof request.query.vendorId === 'string' ? request.query.vendorId : null,
  ),
  vendorScopeTestController,
);
router.get(
  '/test-store-scope',
  authenticate(),
  requireStoreScope((request) =>
    typeof request.query.storeId === 'string' ? request.query.storeId : null,
  ),
  storeScopeTestController,
);
router.get(
  '/test-city-scope',
  authenticate(),
  requireCityScope((request) =>
    typeof request.query.cityId === 'string' ? request.query.cityId : null,
  ),
  cityScopeTestController,
);

export default router;
