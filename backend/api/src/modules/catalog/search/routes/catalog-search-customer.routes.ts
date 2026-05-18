import { Router } from 'express';
import { validateRequest } from '../../../../middlewares/validate-request.middleware';
import {
  getCustomerCatalogFacetsController,
  getCustomerFeaturedProductsController,
  getCustomerProductDetailController,
  listCustomerBrandsController,
  listCustomerCategoriesController,
  listCustomerCatalogProductsController,
  listCustomerProductVariantsController,
  searchCustomerCatalogController,
} from '../controllers/catalog-search-customer.controller';
import {
  customerBrandBrowseQueryValidator,
  customerCatalogListQueryValidator,
  customerCatalogSearchQueryValidator,
  customerCategoryBrowseQueryValidator,
  customerFacetQueryValidator,
  customerFeaturedQueryValidator,
  customerProductDetailQueryValidator,
  customerProductIdParamsValidator,
} from '../validators/catalog-search.validators';

const router = Router();

router.get(
  '/categories',
  validateRequest({ query: customerCategoryBrowseQueryValidator }),
  listCustomerCategoriesController,
);

router.get(
  '/brands',
  validateRequest({ query: customerBrandBrowseQueryValidator }),
  listCustomerBrandsController,
);

router.get(
  '/products/:productId/variants',
  validateRequest({ params: customerProductIdParamsValidator }),
  listCustomerProductVariantsController,
);

router.get(
  '/products/:productId',
  validateRequest({
    params: customerProductIdParamsValidator,
    query: customerProductDetailQueryValidator,
  }),
  getCustomerProductDetailController,
);

router.get(
  '/products',
  validateRequest({ query: customerCatalogListQueryValidator }),
  listCustomerCatalogProductsController,
);

router.get(
  '/search',
  validateRequest({ query: customerCatalogSearchQueryValidator }),
  searchCustomerCatalogController,
);

router.get(
  '/featured-products',
  validateRequest({ query: customerFeaturedQueryValidator }),
  getCustomerFeaturedProductsController,
);

router.get(
  '/facets',
  validateRequest({ query: customerFacetQueryValidator }),
  getCustomerCatalogFacetsController,
);

export default router;
