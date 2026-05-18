import assert from 'node:assert/strict';
import { test } from 'node:test';

import catalogSearchCustomerRoutes from '../routes/catalog-search-customer.routes';
import catalogSearchVendorRoutes from '../routes/catalog-search-vendor.routes';
import { customerCatalogListQueryValidator } from '../validators/catalog-search.validators';

type RouterLayer = {
  route?: {
    path: string;
    methods: Record<string, boolean>;
  };
};

const listRoutes = (router: { stack: RouterLayer[] }) =>
  router.stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route?.path ?? '',
      methods: Object.keys(layer.route?.methods ?? {}).sort(),
    }));

test('vendor catalog search routes expose products and facets', () => {
  const routes = listRoutes(catalogSearchVendorRoutes as unknown as { stack: RouterLayer[] });

  assert.deepEqual(routes, [
    { path: '/categories', methods: ['get'] },
    { path: '/brands', methods: ['get'] },
    { path: '/products/:productId/variants', methods: ['get'] },
    { path: '/products/:productId', methods: ['get'] },
    { path: '/products', methods: ['get'] },
    { path: '/facets', methods: ['get'] },
  ]);
});

test('customer catalog search routes expose browse endpoints', () => {
  const routes = listRoutes(catalogSearchCustomerRoutes as unknown as { stack: RouterLayer[] });

  assert.deepEqual(routes, [
    { path: '/categories', methods: ['get'] },
    { path: '/brands', methods: ['get'] },
    { path: '/products/:productId/variants', methods: ['get'] },
    { path: '/products/:productId', methods: ['get'] },
    { path: '/products', methods: ['get'] },
    { path: '/search', methods: ['get'] },
    { path: '/featured-products', methods: ['get'] },
    { path: '/facets', methods: ['get'] },
  ]);
});

test('customerCatalogListQueryValidator rejects invalid price range', () => {
  assert.throws(() =>
    customerCatalogListQueryValidator.parse({
      page: 1,
      limit: 20,
      minPrice: 100,
      maxPrice: 10,
    }),
  );
});
