import { Router } from 'express';
import { validateRequest } from '../../../../middlewares/validate-request.middleware';
import { AUTH_PERMISSION_ACTION, AUTH_PERMISSION_RESOURCE } from '../../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../../auth/utils/permission-code.util';
import {
  createBrandController,
  deleteBrandController,
  getBrandByIdController,
  listBrandsController,
  updateBrandController,
} from '../controllers/brand.controller';
import {
  brandIdParamsValidator,
  createBrandBodyValidator,
  listBrandsQueryValidator,
  updateBrandBodyValidator,
} from '../validators/brand.validators';

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
  validateRequest({ query: listBrandsQueryValidator }),
  listBrandsController,
);

router.post(
  '/',
  requirePermission(catalogCreate),
  validateRequest({ body: createBrandBodyValidator }),
  createBrandController,
);

router.get(
  '/:brandId',
  requirePermission(catalogRead),
  validateRequest({ params: brandIdParamsValidator }),
  getBrandByIdController,
);

router.patch(
  '/:brandId',
  requirePermission(catalogUpdate),
  validateRequest({ params: brandIdParamsValidator }),
  validateRequest({ body: updateBrandBodyValidator }),
  updateBrandController,
);

router.delete(
  '/:brandId',
  requirePermission(catalogDelete),
  validateRequest({ params: brandIdParamsValidator }),
  deleteBrandController,
);

export default router;
