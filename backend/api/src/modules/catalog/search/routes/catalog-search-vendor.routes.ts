import { Router } from 'express';
import { validateRequest } from '../../../../middlewares/validate-request.middleware';
import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../../auth/utils/permission-code.util';
import {
  getVendorCatalogFacetsController,
  getVendorProductDetailController,
  listVendorBrandsController,
  listVendorCategoriesController,
  listVendorCatalogProductsController,
  listVendorProductVariantsController,
} from '../controllers/catalog-search-vendor.controller';
import {
  customerBrandBrowseQueryValidator,
  customerCategoryBrowseQueryValidator,
  customerProductIdParamsValidator,
  vendorCatalogSearchQueryValidator,
  vendorFacetQueryValidator,
} from '../validators/catalog-search.validators';

const router = Router();

const catalogRead = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.CATALOG,
  AUTH_PERMISSION_ACTION.READ,
);

router.get(
  '/categories',
  requirePermission(catalogRead),
  validateRequest({ query: customerCategoryBrowseQueryValidator }),
  listVendorCategoriesController,
);

router.get(
  '/brands',
  requirePermission(catalogRead),
  validateRequest({ query: customerBrandBrowseQueryValidator }),
  listVendorBrandsController,
);

router.get(
  '/products/:productId/variants',
  requirePermission(catalogRead),
  validateRequest({ params: customerProductIdParamsValidator }),
  listVendorProductVariantsController,
);

router.get(
  '/products/:productId',
  requirePermission(catalogRead),
  validateRequest({ params: customerProductIdParamsValidator }),
  getVendorProductDetailController,
);

router.get(
  '/products',
  requirePermission(catalogRead),
  validateRequest({ query: vendorCatalogSearchQueryValidator }),
  listVendorCatalogProductsController,
);

router.get(
  '/facets',
  requirePermission(catalogRead),
  validateRequest({ query: vendorFacetQueryValidator }),
  getVendorCatalogFacetsController,
);

export default router;
