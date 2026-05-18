import { Router } from 'express';
import { validateRequest } from '../../../../middlewares/validate-request.middleware';
import { AUTH_PERMISSION_ACTION, AUTH_PERMISSION_RESOURCE } from '../../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../../auth/utils/permission-code.util';
import { listAdminCatalogProductsController } from '../../search/controllers/catalog-search-admin.controller';
import { adminCatalogSearchQueryValidator } from '../../search/validators/catalog-search.validators';
import {
  createProductController,
  deleteProductController,
  getProductByIdController,
  updateProductApprovalStatusController,
  updateProductController,
} from '../controllers/product.controller';
import productVariantAdminRoutes from '../../variants/routes/product-variant-admin.routes';
import {
  createProductBodyValidator,
  productIdParamsValidator,
  updateProductApprovalBodyValidator,
  updateProductBodyValidator,
} from '../validators/product.validators';

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
const catalogApprove = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.CATALOG,
  AUTH_PERMISSION_ACTION.APPROVE,
);

router.get(
  '/',
  requirePermission(catalogRead),
  validateRequest({ query: adminCatalogSearchQueryValidator }),
  listAdminCatalogProductsController,
);

router.post(
  '/',
  requirePermission(catalogCreate),
  validateRequest({ body: createProductBodyValidator }),
  createProductController,
);

router.use('/:productId/variants', productVariantAdminRoutes);

router.get(
  '/:productId',
  requirePermission(catalogRead),
  validateRequest({ params: productIdParamsValidator }),
  getProductByIdController,
);

router.patch(
  '/:productId',
  requirePermission(catalogUpdate),
  validateRequest({ params: productIdParamsValidator }),
  validateRequest({ body: updateProductBodyValidator }),
  updateProductController,
);

router.patch(
  '/:productId/approval-status',
  requirePermission(catalogApprove),
  validateRequest({ params: productIdParamsValidator }),
  validateRequest({ body: updateProductApprovalBodyValidator }),
  updateProductApprovalStatusController,
);

router.delete(
  '/:productId',
  requirePermission(catalogDelete),
  validateRequest({ params: productIdParamsValidator }),
  deleteProductController,
);

export default router;
