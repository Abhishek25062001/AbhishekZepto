import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';

const readSource = (path: string): string => readFileSync(resolve(process.cwd(), path), 'utf8');

test('vendor store API client consumes existing Module 6 endpoints only', () => {
  const source = readSource('src/modules/vendor-stores/api/admin-vendor-store.api.ts');

  assert.match(source, /const ADMIN_VENDOR_BASE = '\/api\/v1\/admin\/vendors'/);
  assert.match(source, /const ADMIN_STORE_BASE = '\/api\/v1\/admin\/stores'/);
  assert.match(source, /apiClient\.get<ApiSuccessResponse<PaginatedAdminVendors>>/);
  assert.match(source, /`\$\{ADMIN_VENDOR_BASE\}\/\$\{vendorId\}`/);
  assert.match(source, /`\$\{ADMIN_VENDOR_BASE\}\/\$\{vendorId\}\/status`/);
  assert.match(source, /apiClient\.get<ApiSuccessResponse<PaginatedAdminStores>>/);
  assert.match(source, /`\$\{ADMIN_STORE_BASE\}\/\$\{storeId\}`/);
  assert.match(source, /`\$\{ADMIN_STORE_BASE\}\/\$\{storeId\}\/status`/);
  assert.match(source, /`\$\{ADMIN_STORE_BASE\}\/\$\{storeId\}\/orders`/);
  assert.match(source, /`\$\{ADMIN_STORE_BASE\}\/\$\{storeId\}\/inventory`/);
  assert.match(source, /`\$\{ADMIN_STORE_BASE\}\/\$\{storeId\}\/audit`/);
  assert.doesNotMatch(source, /\/create|\/delete|\/catalog|\/payouts|\/settlements/);
});

test('vendor store hooks expose query keys and mutation invalidation', () => {
  const vendorHookSource = readSource('src/modules/vendor-stores/hooks/useAdminVendors.ts');
  const storeHookSource = readSource('src/modules/vendor-stores/hooks/useAdminStores.ts');
  const mutationSource = readSource(
    'src/modules/vendor-stores/hooks/useAdminVendorStoreMutations.ts',
  );

  assert.match(vendorHookSource, /all: \['admin-vendor-stores'\]/);
  assert.match(vendorHookSource, /vendors: \(query: AdminVendorListQuery\)/);
  assert.match(vendorHookSource, /vendorDetail: \(vendorId: string\)/);
  assert.match(vendorHookSource, /storeOrders: \(storeId: string, query: unknown\)/);
  assert.match(storeHookSource, /useAdminStores/);
  assert.match(mutationSource, /useUpdateAdminVendorStatusMutation/);
  assert.match(mutationSource, /useUpdateAdminStoreStatusMutation/);
  assert.match(mutationSource, /invalidateQueries\(\{ queryKey: adminVendorStoreQueryKeys\.all \}\)/);
  assert.match(mutationSource, /adminVendorStoreQueryKeys\.vendorDetail\(vendorId\)/);
  assert.match(mutationSource, /adminVendorStoreQueryKeys\.storeDetail\(storeId\)/);
});

test('vendor store frontend types match documented filters and payloads', () => {
  const typeSource = readSource('src/modules/vendor-stores/types/admin-vendor-store.types.ts');
  const constantsSource = readSource(
    'src/modules/vendor-stores/constants/admin-vendor-store.constants.ts',
  );

  assert.match(typeSource, /export type AdminVendorListQuery = \{/);
  assert.match(typeSource, /status\?: VendorManagementStatus/);
  assert.match(typeSource, /cityId\?: string/);
  assert.match(typeSource, /search\?: string/);
  assert.match(typeSource, /export type AdminStoreListQuery = \{/);
  assert.match(typeSource, /vendorId\?: string/);
  assert.match(typeSource, /export type VendorStatusPayload = \{/);
  assert.match(typeSource, /export type StoreStatusPayload = \{/);
  assert.match(typeSource, /reason: string/);
  assert.match(constantsSource, /VENDOR_STATUS_OPTIONS/);
  assert.match(constantsSource, /STORE_STATUS_OPTIONS/);
});

test('vendors list page wires documented filters and pagination', () => {
  const routeSource = readSource('src/routes/admin.routes.tsx');
  const pageSource = readSource('src/pages/vendors/VendorsPage.tsx');
  const filterSource = readSource('src/modules/vendor-stores/components/VendorsFilterBar.tsx');
  const tableSource = readSource('src/modules/vendor-stores/components/VendorsTable.tsx');

  assert.match(routeSource, /path: '\/vendors'/);
  assert.match(routeSource, /permission="stores:read"/);
  assert.match(pageSource, /useAdminVendors\(filters\)/);
  assert.match(pageSource, /page: 1, limit: 20/);
  assert.match(pageSource, /pagination\.hasPreviousPage/);
  assert.match(pageSource, /pagination\.hasNextPage/);
  assert.match(filterSource, /status:/);
  assert.match(filterSource, /cityId:/);
  assert.match(filterSource, /search:/);
  assert.match(tableSource, /to=\{`\/vendors\/\$\{row\.vendorId\}`\}/);
});

test('vendor detail route and page use read-only detail contract', () => {
  const routeSource = readSource('src/routes/admin.routes.tsx');
  const detailSource = readSource('src/pages/vendors/VendorDetailPage.tsx');
  const summarySource = readSource('src/modules/vendor-stores/components/VendorSummary.tsx');

  assert.match(routeSource, /path: '\/vendors\/:vendorId'/);
  assert.match(routeSource, /permission="stores:read"/);
  assert.match(detailSource, /useParams<\{ vendorId: string \}>/);
  assert.match(detailSource, /useAdminVendorDetail\(vendorId\)/);
  assert.match(detailSource, /<VendorSummary vendor=\{detailQuery\.data\} \/>/);
  assert.match(summarySource, /primaryVendorUserId/);
  assert.match(summarySource, /accountStatus/);
  assert.match(summarySource, /storeCount/);
  assert.doesNotMatch(detailSource, /useUpdateAdminVendorStatusMutation/);
  assert.doesNotMatch(detailSource, /create|delete|catalog|payout|settlement/i);
});

test('vendor status control is permission-gated and submits status reason only', () => {
  const detailSource = readSource('src/pages/vendors/VendorDetailPage.tsx');
  const controlSource = readSource('src/modules/vendor-stores/components/VendorStatusControl.tsx');
  const schemaSource = readSource('src/modules/vendor-stores/validators/vendor-store-form.schema.ts');

  assert.match(detailSource, /VENDOR_STATUS_PERMISSIONS/);
  assert.match(detailSource, /'stores:update'/);
  assert.match(detailSource, /'settings:manage'/);
  assert.match(detailSource, /<CanAccessAny permissions=\{VENDOR_STATUS_PERMISSIONS\}>/);
  assert.match(detailSource, /<VendorStatusControl/);
  assert.match(controlSource, /useUpdateAdminVendorStatusMutation\(vendor\.vendorId\)/);
  assert.match(controlSource, /status: parsed\.data\.status/);
  assert.match(controlSource, /reason: parsed\.data\.reason/);
  assert.match(controlSource, /role="alert"/);
  assert.match(schemaSource, /vendorStatusFormSchema/);
  assert.match(schemaSource, /z\.string\(\)\.trim\(\)\.min\(5\)\.max\(500\)/);
  assert.doesNotMatch(controlSource, /deleted/);
  assert.doesNotMatch(controlSource, /profile|catalog|payout|settlement/i);
});

test('stores list page wires documented filters and pagination', () => {
  const routeSource = readSource('src/routes/store.routes.tsx');
  const pageSource = readSource('src/pages/stores/AdminStoresPage.tsx');
  const filterSource = readSource('src/modules/vendor-stores/components/StoresFilterBar.tsx');
  const tableSource = readSource('src/modules/vendor-stores/components/StoresTable.tsx');

  assert.match(routeSource, /path: '\/stores'/);
  assert.match(routeSource, /permission="stores:read"/);
  assert.match(routeSource, /<AdminStoresPage \/>/);
  assert.match(pageSource, /useAdminStores\(filters\)/);
  assert.match(pageSource, /page: 1, limit: 20/);
  assert.match(pageSource, /pagination\.hasPreviousPage/);
  assert.match(pageSource, /pagination\.hasNextPage/);
  assert.match(filterSource, /status:/);
  assert.match(filterSource, /vendorId:/);
  assert.match(filterSource, /cityId:/);
  assert.match(filterSource, /search:/);
  assert.match(tableSource, /to=\{`\/stores\/\$\{row\.storeId\}`\}/);
  assert.doesNotMatch(pageSource, /create|edit|delete|inventoryMutation|orderAction/i);
});

test('store detail route and page use read-only detail contract', () => {
  const routeSource = readSource('src/routes/store.routes.tsx');
  const detailSource = readSource('src/pages/stores/AdminStoreDetailPage.tsx');
  const summarySource = readSource('src/modules/vendor-stores/components/StoreSummary.tsx');

  assert.match(routeSource, /path: '\/stores\/:storeId'/);
  assert.match(routeSource, /permission="stores:read"/);
  assert.match(routeSource, /<AdminStoreDetailPage \/>/);
  assert.match(routeSource, /path: '\/stores\/:storeId\/edit'/);
  assert.match(detailSource, /useParams<\{ storeId: string \}>/);
  assert.match(detailSource, /useAdminStoreDetail\(storeId\)/);
  assert.match(detailSource, /<StoreSummary store=\{detailQuery\.data\} \/>/);
  assert.match(summarySource, /isOpen/);
  assert.match(summarySource, /isAcceptingOrders/);
  assert.match(summarySource, /temporaryClosureReason/);
  assert.doesNotMatch(detailSource, /useUpdateAdminStoreStatusMutation/);
  assert.doesNotMatch(detailSource, /catalog|inventoryMutation|orderAction|payout|settlement/i);
});

test('store detail page exposes read-only orders inventory and audit inspection', () => {
  const detailSource = readSource('src/pages/stores/AdminStoreDetailPage.tsx');
  const ordersTableSource = readSource(
    'src/modules/vendor-stores/components/StoreOrdersTable.tsx',
  );
  const inventoryTableSource = readSource(
    'src/modules/vendor-stores/components/StoreInventoryTable.tsx',
  );
  const auditTableSource = readSource('src/modules/vendor-stores/components/StoreAuditTable.tsx');

  assert.match(detailSource, /useAdminStoreOrders\(storeId, ordersQuery\)/);
  assert.match(detailSource, /useAdminStoreInventory\(storeId, inventoryQuery\)/);
  assert.match(detailSource, /useAdminStoreAudit\(storeId, auditQuery\)/);
  assert.match(detailSource, /orderPagination/);
  assert.match(detailSource, /inventoryPagination/);
  assert.match(detailSource, /auditPagination/);
  assert.match(ordersTableSource, /orderStatus/);
  assert.match(ordersTableSource, /paymentStatus/);
  assert.match(inventoryTableSource, /availableQuantity/);
  assert.match(inventoryTableSource, /reservedQuantity/);
  assert.match(auditTableSource, /actionType/);
  assert.match(auditTableSource, /adminId/);
  assert.match(auditTableSource, /reason/);
  assert.doesNotMatch(detailSource, /acceptOrder|rejectOrder|startPicking|adjustInventory|deleteAudit/i);
});

test('store status control is permission-gated and submits status reason only', () => {
  const detailSource = readSource('src/pages/stores/AdminStoreDetailPage.tsx');
  const controlSource = readSource('src/modules/vendor-stores/components/StoreStatusControl.tsx');
  const schemaSource = readSource('src/modules/vendor-stores/validators/vendor-store-form.schema.ts');

  assert.match(detailSource, /STORE_STATUS_PERMISSIONS/);
  assert.match(detailSource, /'stores:update'/);
  assert.match(detailSource, /'settings:manage'/);
  assert.match(detailSource, /<CanAccessAny permissions=\{STORE_STATUS_PERMISSIONS\}>/);
  assert.match(detailSource, /<StoreStatusControl/);
  assert.match(controlSource, /useUpdateAdminStoreStatusMutation\(store\.storeId\)/);
  assert.match(controlSource, /status: parsed\.data\.status/);
  assert.match(controlSource, /reason: parsed\.data\.reason/);
  assert.match(controlSource, /role="alert"/);
  assert.match(controlSource, /disabled=\{mutation\.isPending\}/);
  assert.match(controlSource, /loading=\{mutation\.isPending\}/);
  assert.match(schemaSource, /storeStatusFormSchema/);
  assert.doesNotMatch(
    controlSource,
    /isOpen|isAcceptingOrders|updateCatalog|adjustInventory|acceptOrder|rejectOrder|payout|settlement/i,
  );
});

test('vendor store management UI avoids unsupported workflows', () => {
  const pageSource = [
    readSource('src/pages/vendors/VendorsPage.tsx'),
    readSource('src/pages/vendors/VendorDetailPage.tsx'),
    readSource('src/pages/stores/AdminStoresPage.tsx'),
    readSource('src/pages/stores/AdminStoreDetailPage.tsx'),
  ].join('\n');
  const apiSource = readSource('src/modules/vendor-stores/api/admin-vendor-store.api.ts');

  assert.match(pageSource, /ErrorView/);
  assert.match(pageSource, /EmptyState/);
  assert.doesNotMatch(pageSource, /acceptOrder|rejectOrder|startPicking|completePacking/i);
  assert.doesNotMatch(pageSource, /adjustInventory|updateCatalog|payout|settlement|supportTicket/i);
  assert.doesNotMatch(apiSource, /\/catalog|\/inventory\/adjust|\/orders\/.*\/status|\/payout|\/settlement|\/support/i);
});
