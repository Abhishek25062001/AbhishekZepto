import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const readSource = (path: string): string => readFileSync(resolve(process.cwd(), path), 'utf8');

test('catalog oversight API client consumes existing admin catalog endpoints only', () => {
  const source = readSource('src/modules/catalog/api/product.api.ts');
  const categorySource = readSource('src/modules/catalog/api/category.api.ts');
  const brandSource = readSource('src/modules/catalog/api/brand.api.ts');
  const unitSource = readSource('src/modules/catalog/api/product-unit.api.ts');

  assert.match(categorySource, /const BASE = '\/api\/v1\/admin\/catalog\/categories'/);
  assert.match(brandSource, /const BASE = '\/api\/v1\/admin\/catalog\/brands'/);
  assert.match(unitSource, /const BASE = '\/api\/v1\/admin\/catalog\/units'/);
  assert.match(source, /const BASE = '\/api\/v1\/admin\/catalog\/products'/);
  assert.match(source, /`\$\{BASE\}\/\$\{productId\}\/approval-status`/);
  assert.match(source, /`\$\{BASE\}\/\$\{productId\}\/variants`/);
  assert.match(source, /`\$\{BASE\}\/\$\{productId\}\/variants\/\$\{variantId\}`/);
  assert.doesNotMatch(source, /\/vendor\/catalog|\/customer\/catalog|\/stores|\/inventory|\/promotions|\/exports/);
});

test('catalog oversight variant client exposes typed read and mutation helpers', () => {
  const source = readSource('src/modules/catalog/api/product.api.ts');
  const typeSource = readSource('src/modules/catalog/types/product-variant.types.ts');
  const hookSource = readSource('src/modules/catalog/hooks/useProductVariantMutations.ts');

  assert.match(typeSource, /export type ProductVariantResponse = \{/);
  assert.match(typeSource, /export type ProductVariantFormValues = \{/);
  assert.match(typeSource, /export type ProductVariantListQuery = \{/);
  assert.match(source, /getAdminProductVariants/);
  assert.match(source, /getAdminProductVariantsPage/);
  assert.match(source, /createAdminProductVariant/);
  assert.match(source, /updateAdminProductVariant/);
  assert.match(source, /deleteAdminProductVariant/);
  assert.match(source, /unwrapPaginated/);
  assert.match(hookSource, /useProductVariantMutations/);
  assert.match(hookSource, /\['admin-product-variants', productId\]/);
});

test('catalog route gates remain permission scoped', () => {
  const routeSource = readSource('src/routes/catalog.routes.tsx');

  assert.match(routeSource, /permission="catalog:read"/);
  assert.match(routeSource, /permission="catalog:create"/);
  assert.match(routeSource, /permission="catalog:update"/);
  assert.match(routeSource, /\/catalog\/products\/:productId\/variants/);
  assert.doesNotMatch(routeSource, /stores:|delivery:|customer:|settings:manage/);
});

test('category oversight exposes read-only detail and gates mutation actions', () => {
  const routeSource = readSource('src/routes/catalog.routes.tsx');
  const listSource = readSource('src/modules/catalog/pages/categories/CategoryListPage.tsx');
  const detailSource = readSource('src/modules/catalog/pages/categories/CategoryDetailPage.tsx');

  assert.match(routeSource, /path: '\/catalog\/categories\/:categoryId'/);
  assert.match(routeSource, /<CategoryDetailPage \/>/);
  assert.match(routeSource, /permission="catalog:read"/);
  assert.match(listSource, /to=\{`\/catalog\/categories\/\$\{row\.id\}`\}/);
  assert.match(listSource, /permission="catalog:update"/);
  assert.match(listSource, /permission="catalog:delete"/);
  assert.match(detailSource, /useCategoryDetail\(categoryId\)/);
  assert.match(detailSource, /permission="catalog:update"/);
  assert.match(detailSource, /CatalogStatusBadge/);
  assert.doesNotMatch(detailSource, /deleteMutation|useCategoryMutations/);
});

test('category mutation surfaces use existing category endpoints and guards', () => {
  const apiSource = readSource('src/modules/catalog/api/category.api.ts');
  const createSource = readSource('src/modules/catalog/pages/categories/CategoryCreatePage.tsx');
  const editSource = readSource('src/modules/catalog/pages/categories/CategoryEditPage.tsx');
  const hookSource = readSource('src/modules/catalog/hooks/useCategoryMutations.ts');
  const formSource = readSource('src/modules/catalog/forms/CategoryForm.tsx');

  assert.match(apiSource, /createAdminCategory/);
  assert.match(apiSource, /updateAdminCategory/);
  assert.match(apiSource, /deleteAdminCategory/);
  assert.match(createSource, /createMutation\.mutateAsync\(values\)/);
  assert.match(editSource, /updateMutation\.mutateAsync\(\{ categoryId, payload: values \}\)/);
  assert.match(editSource, /excludeParentId=\{categoryId\}/);
  assert.match(hookSource, /invalidateQueries\(\{ queryKey: \['admin-categories'\] \}\)/);
  assert.match(hookSource, /invalidateQueries\(\{ queryKey: \['admin-category'\] \}\)/);
  assert.match(formSource, /categoryFormSchema/);
  assert.match(formSource, /CategorySelect/);
  assert.doesNotMatch(apiSource, /hardDelete|\/stores|\/inventory|\/vendor|\/customer/);
});

test('brand and unit oversight expose detail routes and gate mutations', () => {
  const routeSource = readSource('src/routes/catalog.routes.tsx');
  const brandListSource = readSource('src/modules/catalog/pages/brands/BrandListPage.tsx');
  const brandDetailSource = readSource('src/modules/catalog/pages/brands/BrandDetailPage.tsx');
  const unitListSource = readSource('src/modules/catalog/pages/units/ProductUnitListPage.tsx');
  const unitDetailSource = readSource('src/modules/catalog/pages/units/ProductUnitDetailPage.tsx');

  assert.match(routeSource, /path: '\/catalog\/brands\/:brandId'/);
  assert.match(routeSource, /path: '\/catalog\/units\/:unitId'/);
  assert.match(routeSource, /<BrandDetailPage \/>/);
  assert.match(routeSource, /<ProductUnitDetailPage \/>/);
  assert.match(brandListSource, /to=\{`\/catalog\/brands\/\$\{row\.id\}`\}/);
  assert.match(unitListSource, /to=\{`\/catalog\/units\/\$\{row\.id\}`\}/);
  assert.match(brandListSource, /permission="catalog:update"/);
  assert.match(unitListSource, /permission="catalog:update"/);
  assert.match(brandDetailSource, /useBrandDetail\(brandId\)/);
  assert.match(unitDetailSource, /useProductUnitDetail\(unitId\)/);
  assert.doesNotMatch(brandDetailSource, /useBrandMutations|deleteMutation/);
  assert.doesNotMatch(unitDetailSource, /useProductUnitMutations|deleteMutation/);
});

test('product oversight read views expose filters detail and permission-gated actions', () => {
  const routeSource = readSource('src/routes/catalog.routes.tsx');
  const listSource = readSource('src/modules/catalog/pages/products/ProductListPage.tsx');
  const detailSource = readSource('src/modules/catalog/pages/products/ProductDetailPage.tsx');

  assert.match(routeSource, /path: '\/catalog\/products'/);
  assert.match(routeSource, /path: '\/catalog\/products\/:productId'/);
  assert.match(routeSource, /permission="catalog:read"/);
  assert.match(listSource, /useProducts\(\)/);
  assert.match(listSource, /Approval status/);
  assert.match(listSource, /Food type/);
  assert.match(listSource, /Product type/);
  assert.match(listSource, /Visibility/);
  assert.match(listSource, /Featured/);
  assert.match(listSource, /permission="catalog:update"/);
  assert.match(listSource, /permission="catalog:approve"/);
  assert.match(listSource, /permission="catalog:delete"/);
  assert.match(detailSource, /useProductDetail\(productId\)/);
  assert.match(detailSource, /to=\{`\/catalog\/products\/\$\{record\.id\}\/variants`\}/);
  assert.match(detailSource, /PRODUCT_APPROVAL_STATUS_LABELS/);
  assert.doesNotMatch(detailSource, /storeProduct|inventory|vendor|customer/i);
});

test('product mutation surfaces use master catalog APIs only', () => {
  const apiSource = readSource('src/modules/catalog/api/product.api.ts');
  const createSource = readSource('src/modules/catalog/pages/products/ProductCreatePage.tsx');
  const editSource = readSource('src/modules/catalog/pages/products/ProductEditPage.tsx');
  const hookSource = readSource('src/modules/catalog/hooks/useProductMutations.ts');
  const formSource = readSource('src/modules/catalog/forms/ProductForm.tsx');

  assert.match(apiSource, /createAdminProduct/);
  assert.match(apiSource, /updateAdminProduct/);
  assert.match(apiSource, /deleteAdminProduct/);
  assert.match(createSource, /createMutation\.mutateAsync\(values\)/);
  assert.match(editSource, /updateMutation\.mutateAsync\(\{ payload: values, productId \}\)/);
  assert.match(formSource, /ProductForm/);
  assert.match(formSource, /CategorySelect/);
  assert.match(formSource, /BrandSelect/);
  assert.match(hookSource, /invalidateQueries\(\{ queryKey: \['admin-products'\] \}\)/);
  assert.match(hookSource, /invalidateQueries\(\{ queryKey: \['admin-product'\] \}\)/);
  assert.doesNotMatch(apiSource, /\/store-products|\/inventory|\/vendor|\/customer|pricing/);
  assert.doesNotMatch(formSource, /stock|inventory|storePrice|sellingPrice/);
});

test('product approval workflow uses approval permission and endpoint only', () => {
  const apiSource = readSource('src/modules/catalog/api/product.api.ts');
  const listSource = readSource('src/modules/catalog/pages/products/ProductListPage.tsx');
  const detailSource = readSource('src/modules/catalog/pages/products/ProductDetailPage.tsx');
  const dialogSource = readSource('src/modules/catalog/components/ProductApprovalDialog.tsx');
  const schemaSource = readSource('src/modules/catalog/forms/product-approval.schema.ts');

  assert.match(apiSource, /updateAdminProductApprovalStatus/);
  assert.match(apiSource, /`\$\{BASE\}\/\$\{productId\}\/approval-status`/);
  assert.match(listSource, /permission="catalog:approve"/);
  assert.match(detailSource, /permission="catalog:approve"/);
  assert.match(dialogSource, /ProductApprovalDialog/);
  assert.match(schemaSource, /productApprovalSchema/);
  assert.match(schemaSource, /rejectionReason/);
  assert.doesNotMatch(apiSource, /\/status`|\/stores|\/inventory|\/vendor|\/customer/);
});

test('variant oversight supports nested product variant CRUD only', () => {
  const routeSource = readSource('src/routes/catalog.routes.tsx');
  const pageSource = readSource('src/modules/catalog/pages/variants/VariantListPage.tsx');
  const formSource = readSource('src/modules/catalog/forms/ProductVariantForm.tsx');
  const schemaSource = readSource('src/modules/catalog/forms/product-variant-form.schema.ts');
  const apiSource = readSource('src/modules/catalog/api/product.api.ts');

  assert.match(routeSource, /path: '\/catalog\/products\/:productId\/variants'/);
  assert.match(pageSource, /getAdminProductVariants\(productId, \{ limit: 500 \}\)/);
  assert.match(pageSource, /useProductVariantMutations\(productId \?\? ''\)/);
  assert.match(pageSource, /permission="catalog:create"/);
  assert.match(pageSource, /permission="catalog:update"/);
  assert.match(pageSource, /permission="catalog:delete"/);
  assert.match(formSource, /ProductVariantForm/);
  assert.match(schemaSource, /productVariantFormSchema/);
  assert.match(apiSource, /createAdminProductVariant/);
  assert.match(apiSource, /updateAdminProductVariant/);
  assert.match(apiSource, /deleteAdminProductVariant/);
  assert.doesNotMatch(pageSource, /storeProduct|inventory|sellingPrice|vendor|customer/i);
});
