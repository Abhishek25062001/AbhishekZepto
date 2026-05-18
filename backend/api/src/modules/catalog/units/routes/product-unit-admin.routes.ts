import { Router } from 'express';
import { validateRequest } from '../../../../middlewares/validate-request.middleware';
import { AUTH_PERMISSION_ACTION, AUTH_PERMISSION_RESOURCE } from '../../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../../auth/utils/permission-code.util';
import {
  createProductUnitController,
  deleteProductUnitController,
  getProductUnitByIdController,
  listProductUnitsController,
  updateProductUnitController,
} from '../controllers/product-unit.controller';
import {
  createProductUnitBodyValidator,
  listProductUnitsQueryValidator,
  productUnitIdParamsValidator,
  updateProductUnitBodyValidator,
} from '../validators/product-unit.validators';

const router = Router();

const catalogRead = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.CATALOG,
  AUTH_PERMISSION_ACTION.READ,
);
const catalogCreate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.CATALOG,
  AUTH_PERMISSION_ACTION.CREATE,
);
const catalogUpdate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.CATALOG,
  AUTH_PERMISSION_ACTION.UPDATE,
);
const catalogDelete = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.CATALOG,
  AUTH_PERMISSION_ACTION.DELETE,
);

router.get(
  '/',
  requirePermission(catalogRead),
  validateRequest({ query: listProductUnitsQueryValidator }),
  listProductUnitsController,
);

router.post(
  '/',
  requirePermission(catalogCreate),
  validateRequest({ body: createProductUnitBodyValidator }),
  createProductUnitController,
);

router.get(
  '/:unitId',
  requirePermission(catalogRead),
  validateRequest({ params: productUnitIdParamsValidator }),
  getProductUnitByIdController,
);

router.patch(
  '/:unitId',
  requirePermission(catalogUpdate),
  validateRequest({ params: productUnitIdParamsValidator }),
  validateRequest({ body: updateProductUnitBodyValidator }),
  updateProductUnitController,
);

router.delete(
  '/:unitId',
  requirePermission(catalogDelete),
  validateRequest({ params: productUnitIdParamsValidator }),
  deleteProductUnitController,
);

export default router;
