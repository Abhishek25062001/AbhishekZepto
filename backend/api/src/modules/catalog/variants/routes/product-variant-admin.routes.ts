import { Router } from 'express';
import { validateRequest } from '../../../../middlewares/validate-request.middleware';
import { AUTH_PERMISSION_ACTION, AUTH_PERMISSION_RESOURCE } from '../../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../../auth/utils/permission-code.util';
import {
  createProductVariantController,
  deleteProductVariantController,
  listProductVariantsController,
  updateProductVariantController,
} from '../controllers/product-variant.controller';
import {
  createProductVariantBodyValidator,
  listProductVariantsQueryValidator,
  productVariantParamsValidator,
  updateProductVariantBodyValidator,
} from '../validators/product-variant.validators';

const router = Router({ mergeParams: true });

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
  validateRequest({ query: listProductVariantsQueryValidator }),
  listProductVariantsController,
);

router.post(
  '/',
  requirePermission(catalogCreate),
  validateRequest({ body: createProductVariantBodyValidator }),
  createProductVariantController,
);

router.patch(
  '/:variantId',
  requirePermission(catalogUpdate),
  validateRequest({ params: productVariantParamsValidator }),
  validateRequest({ body: updateProductVariantBodyValidator }),
  updateProductVariantController,
);

router.delete(
  '/:variantId',
  requirePermission(catalogDelete),
  validateRequest({ params: productVariantParamsValidator }),
  deleteProductVariantController,
);

export default router;
