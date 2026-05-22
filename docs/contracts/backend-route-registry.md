# Backend Route Registry

## Public Routes

- `GET /api/v1/public/health`
- `GET /api/v1/public/version`
- `GET /api/v1/public/system-info`
- `GET /api/v1/public/docs`
- `GET /api/v1/public/openapi.json`
- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`

## Customer Routes

Customer auth and catalog routes are mounted. Modules 1–3 customer routes are **IMPLEMENTED** (2026-05-19). Remaining Phase 4 shopping routes (checkout+) are **PLANNED**.

### Phase 4 Module 1 — Customer Location (IMPLEMENTED)

| Method | Path | Module | Contract | Status |
|--------|------|--------|----------|--------|
| GET | `/api/v1/customer/addresses` | 1 | `customer-address-api.md` | IMPLEMENTED |
| POST | `/api/v1/customer/addresses` | 1 | `customer-address-api.md` | IMPLEMENTED |
| PATCH | `/api/v1/customer/addresses/:addressId` | 1 | `customer-address-api.md` | IMPLEMENTED |
| DELETE | `/api/v1/customer/addresses/:addressId` | 1 | `customer-address-api.md` | IMPLEMENTED |
| POST | `/api/v1/customer/addresses/:addressId/set-default` | 1 | `customer-address-api.md` | IMPLEMENTED |
| POST | `/api/v1/customer/serviceability` | 1 | `customer-address-api.md` | IMPLEMENTED |
| POST | `/api/v1/customer/store-selection` | 1 | `customer-address-api.md` | IMPLEMENTED |

### Phase 4 Module 2 — Customer Home (IMPLEMENTED)

| Method | Path | Module | Contract | Status |
|--------|------|--------|----------|--------|
| GET | `/api/v1/customer/home` | 2 | `customer-home-shopping-entry-api.md` | IMPLEMENTED |

### Phase 4 Module 3 — Cart (IMPLEMENTED)

| Method | Path | Module | Contract | Status |
|--------|------|--------|----------|--------|
| GET | `/api/v1/customer/cart` | 3 | `cart-api.md` | IMPLEMENTED |
| POST | `/api/v1/customer/cart/items` | 3 | `cart-api.md` | IMPLEMENTED |
| PATCH | `/api/v1/customer/cart/items/:itemId` | 3 | `cart-api.md` | IMPLEMENTED |
| DELETE | `/api/v1/customer/cart/items/:itemId` | 3 | `cart-api.md` | IMPLEMENTED |
| DELETE | `/api/v1/customer/cart` | 3 | `cart-api.md` | IMPLEMENTED |

### Phase 4 Module 5 — Cart Pricing (IMPLEMENTED)

| Method | Path | Module | Contract | Status |
|--------|------|--------|----------|--------|
| POST | `/api/v1/customer/cart/recalculate` | 5 | `cart-api.md`, `cart-pricing-calculation.md` | IMPLEMENTED |

Enhanced totals and `GET ?validatePrices=` on existing cart routes (Module 5).

### Phase 4 Module 6 — Checkout Preparation (IMPLEMENTED)

| Method | Path | Module | Contract | Status |
|--------|------|--------|----------|--------|
| POST | `/api/v1/customer/checkout/initiate` | 6 | `checkout-api.md` | IMPLEMENTED |
| GET | `/api/v1/customer/checkout/summary` | 6 | `checkout-api.md` | IMPLEMENTED |
| POST | `/api/v1/customer/checkout/cancel` | 6 | `checkout-api.md` | IMPLEMENTED |

### Phase 4 Module 8 — Payment Gateway Foundation (IMPLEMENTED)

| Method | Path | Module | Contract | Status |
|--------|------|--------|----------|--------|
| POST | `/api/v1/customer/payments/create-order` | 8 | `payment-api.md` | IMPLEMENTED |
| POST | `/api/v1/customer/payments/verify` | 8 | `payment-api.md` | IMPLEMENTED |

### Phase 4 Module 10 — Order Creation Backend (IMPLEMENTED)

| Method | Path | Module | Contract | Status |
|--------|------|--------|----------|--------|
| POST | `/api/v1/customer/orders` | 10 | `order-customer-api.md` | IMPLEMENTED |
| GET | `/api/v1/customer/orders` | 10 | `order-customer-api.md` | IMPLEMENTED |
| GET | `/api/v1/customer/orders/:orderId` | 10 | `order-customer-api.md` | IMPLEMENTED |

### Phase 4 Module 12 — Basic Customer Profile (IMPLEMENTED)

| Method | Path | Module | Contract | Status |
|--------|------|--------|----------|--------|
| GET | `/api/v1/customer/profile` | 12 | `customer-profile-api.md` | IMPLEMENTED |
| PATCH | `/api/v1/customer/profile` | 12 | `customer-profile-api.md` | IMPLEMENTED |

### Phase 4 Module 13 — Browse improvements (IMPLEMENTED — client only)

No new backend routes. Pagination/OOS on existing `GET /customer/catalog/products` and `GET /customer/catalog/search`.

### Phase 4 integration status

Modules 1–13 **IMPLEMENTED**. Module 15 integration review complete 2026-05-19.

### Phase 4 Webhooks — Module 8 (IMPLEMENTED)

| Method | Path | Module | Contract | Status |
|--------|------|--------|----------|--------|
| POST | `/api/v1/webhooks/razorpay` | 8 | `payment-api.md` | IMPLEMENTED |

## Phase 5 Order Lifecycle Routes (IMPLEMENTED)

Phase 5 extends the Phase 4 placed-order surface with order lifecycle, store
operations, cancellation, operational visibility, and SLA filters. Module 13
notification placeholders are internal only and add no public route.

### Customer Order Lifecycle

| Method | Path | Module | Contract | Status |
|--------|------|--------|----------|--------|
| GET | `/api/v1/customer/orders` | 12 | `order-customer-api.md`, `order-lifecycle-api.md` | IMPLEMENTED |
| GET | `/api/v1/customer/orders/:orderId` | 12 | `order-customer-api.md`, `order-lifecycle-api.md` | IMPLEMENTED |
| GET | `/api/v1/customer/orders/:orderId/state` | 2, 12 | `order-lifecycle-api.md` | IMPLEMENTED |
| GET | `/api/v1/customer/orders/:orderId/lifecycle` | 2, 12 | `order-lifecycle-api.md` | IMPLEMENTED |
| POST | `/api/v1/customer/orders/:orderId/cancel` | 7, 12 | `order-lifecycle-api.md` | IMPLEMENTED |

### Store Order Operations

| Method | Path | Module | Contract | Status |
|--------|------|--------|----------|--------|
| GET | `/api/v1/store/orders` | 2, 8, 9, 10 | `phase-5-store-order-api.md` | IMPLEMENTED |
| GET | `/api/v1/store/orders/:orderId` | 2, 8, 9, 10 | `phase-5-store-order-api.md` | IMPLEMENTED |
| POST | `/api/v1/store/orders/:orderId/accept` | 3, 8 | `phase-5-store-order-api.md` | IMPLEMENTED |
| POST | `/api/v1/store/orders/:orderId/reject` | 3, 8 | `phase-5-store-order-api.md` | IMPLEMENTED |
| POST | `/api/v1/store/orders/:orderId/picking/start` | 4, 9 | `phase-5-store-order-api.md` | IMPLEMENTED |
| POST | `/api/v1/store/orders/:orderId/items/:itemId/picked` | 4, 9 | `phase-5-store-order-api.md` | IMPLEMENTED |
| POST | `/api/v1/store/orders/:orderId/items/:itemId/missing` | 4, 6, 9 | `phase-5-store-order-api.md` | IMPLEMENTED |
| POST | `/api/v1/store/orders/:orderId/picking/complete` | 4, 6, 9 | `phase-5-store-order-api.md` | IMPLEMENTED |
| POST | `/api/v1/store/orders/:orderId/packing/start` | 5, 9 | `phase-5-store-order-api.md` | IMPLEMENTED |
| POST | `/api/v1/store/orders/:orderId/packing/complete` | 5, 9 | `phase-5-store-order-api.md` | IMPLEMENTED |
| POST | `/api/v1/store/orders/:orderId/ready-for-pickup` | 5, 9 | `phase-5-store-order-api.md` | IMPLEMENTED |
| POST | `/api/v1/store/orders/:orderId/cancel` | 7, 10 | `phase-5-store-order-api.md` | IMPLEMENTED |

### Admin Order Operations

| Method | Path | Module | Contract | Status |
|--------|------|--------|----------|--------|
| GET | `/api/v1/admin/orders` | 2, 11, 14 | `phase-5-admin-order-api.md` | IMPLEMENTED |
| GET | `/api/v1/admin/orders/:orderId` | 2, 11 | `phase-5-admin-order-api.md` | IMPLEMENTED |
| GET | `/api/v1/admin/orders/:orderId/timeline` | 2, 11 | `phase-5-admin-order-api.md` | IMPLEMENTED |
| POST | `/api/v1/admin/orders/:orderId/status` | 2, 11 | `phase-5-admin-order-api.md` | IMPLEMENTED |
| POST | `/api/v1/admin/orders/:orderId/cancel` | 7, 11 | `phase-5-admin-order-api.md` | IMPLEMENTED |

## Delivery Routes

Placeholder route group:

```text
/api/v1/delivery/*
```

## Vendor Routes

Placeholder route group:

```text
/api/v1/vendor/*
```

## Admin Routes

- `GET /api/v1/admin`
- `GET /api/v1/admin/me/permissions`
- `GET /api/v1/admin/roles`
- `POST /api/v1/admin/roles`
- `GET /api/v1/admin/roles/:roleId`
- `PATCH /api/v1/admin/roles/:roleId`
- `DELETE /api/v1/admin/roles/:roleId`
- `PATCH /api/v1/admin/users/:userId/permissions`
- `PATCH /api/v1/admin/users/:userId/role`
- `POST /api/v1/admin/users/:userId/sync-role-permissions`

## Internal Routes

- `POST /api/v1/internal/system/database-write-check`
- `GET /api/v1/internal/auth/test-protected`

Internal test routes must be protected or removed before production.

## Phase 3 Catalog Routes — Categories (mounted)

Mounted in Category Management Backend (`admin.routes.ts`):

- `GET /api/v1/admin/catalog/categories`
- `POST /api/v1/admin/catalog/categories`
- `GET /api/v1/admin/catalog/categories/:categoryId`
- `PATCH /api/v1/admin/catalog/categories/:categoryId`
- `DELETE /api/v1/admin/catalog/categories/:categoryId`

Contract: `docs/contracts/category-management-api.md`

## Phase 3 Catalog Routes — Brands & Units (mounted)

- `GET|POST /api/v1/admin/catalog/brands`
- `GET|PATCH|DELETE /api/v1/admin/catalog/brands/:brandId`
- `GET|POST /api/v1/admin/catalog/units`
- `GET|PATCH|DELETE /api/v1/admin/catalog/units/:unitId`

Contracts: `docs/contracts/brand-management-api.md`, `docs/contracts/product-unit-management-api.md`

## Phase 3 Catalog Routes — Products (mounted)

- `GET|POST /api/v1/admin/catalog/products`
- `GET|PATCH|DELETE /api/v1/admin/catalog/products/:productId`
- `PATCH /api/v1/admin/catalog/products/:productId/approval-status`

Contract: `docs/contracts/product-management-api.md`

## Phase 3 Catalog Routes — Product Variants (nested, mounted)

- `GET|POST /api/v1/admin/catalog/products/:productId/variants`
- `PATCH|DELETE /api/v1/admin/catalog/products/:productId/variants/:variantId`

Contract: `docs/contracts/product-variant-management-api.md`

## Phase 3 Location & Store Routes (mounted)

- `GET|POST /api/v1/admin/locations/cities`
- `GET|PATCH|DELETE /api/v1/admin/locations/cities/:cityId`
- `GET|POST /api/v1/admin/locations/service-areas`
- `GET|PATCH|DELETE /api/v1/admin/locations/service-areas/:serviceAreaId`
- `GET|POST /api/v1/admin/stores`
- `GET|PATCH|DELETE /api/v1/admin/stores/:storeId`

Contracts: `docs/contracts/city-management-api.md`, `docs/contracts/service-area-management-api.md`, `docs/contracts/store-management-api.md`

## Phase 3 Store Product Mapping Routes (mounted)

Admin:

- `GET|POST /api/v1/admin/store-products`
- `GET|PATCH|DELETE /api/v1/admin/store-products/:storeProductId`
- `POST /api/v1/admin/store-products/bulk-map`
- `PATCH /api/v1/admin/store-products/bulk-price`
- `PATCH /api/v1/admin/store-products/bulk-visibility`

Vendor:

- `GET /api/v1/vendor/store-products`
- `GET /api/v1/vendor/store-products/:storeProductId`
- `PATCH /api/v1/vendor/store-products/:storeProductId/availability`
- `PATCH /api/v1/vendor/store-products/:storeProductId/price`

Contract: `docs/contracts/store-product-mapping-api.md`

## Phase 3 Inventory Foundation Routes (mounted)

Admin:

- `POST|GET /api/v1/admin/inventory/stocks`
- `GET|PATCH|DELETE /api/v1/admin/inventory/stocks/:inventoryStockId`
- `POST /api/v1/admin/inventory/stocks/:inventoryStockId/adjust`
- `POST /api/v1/admin/inventory/stocks/bulk-upload`
- `PATCH /api/v1/admin/inventory/stocks/bulk-thresholds`
- `GET /api/v1/admin/inventory/movements`
- `GET /api/v1/admin/inventory/movements/:movementId`

Vendor:

- `GET /api/v1/vendor/inventory/stocks`
- `GET /api/v1/vendor/inventory/stocks/:inventoryStockId`
- `POST /api/v1/vendor/inventory/stocks/:inventoryStockId/adjust`
- `GET /api/v1/vendor/inventory/movements`

Contract: `docs/contracts/inventory-foundation-api.md`

## Phase 3 — Inventory Locking (mounted)

**Internal**

- `POST /api/v1/internal/inventory/locks`
- `POST /api/v1/internal/inventory/locks/:lockToken/release`
- `POST /api/v1/internal/inventory/locks/:lockToken/confirm`

**Admin**

- `GET /api/v1/admin/inventory/locks`
- `GET /api/v1/admin/inventory/locks/:lockId`
- `POST /api/v1/admin/inventory/locks/expire-due`

Contract: `docs/contracts/inventory-locking-api.md`

## Phase 3 — Media & File Upload (mounted)

**Admin**

- `POST /api/v1/admin/media/upload`
- `POST /api/v1/admin/media/bulk-upload`
- `GET /api/v1/admin/media/files`
- `GET /api/v1/admin/media/files/:mediaFileId`
- `GET /api/v1/admin/media/files/:mediaFileId/signed-url`
- `PATCH /api/v1/admin/media/files/:mediaFileId`
- `DELETE /api/v1/admin/media/files/:mediaFileId`

**Vendor**

- `POST /api/v1/vendor/media/upload`
- `GET /api/v1/vendor/media/files`
- `GET /api/v1/vendor/media/files/:mediaFileId`
- `DELETE /api/v1/vendor/media/files/:mediaFileId`

**Internal**

- `POST /api/v1/internal/media/attach-owner`
- `GET /api/v1/internal/media/files/:mediaFileId`

Contract: `docs/contracts/media-file-upload-api.md`

## Phase 3 Catalog Search & Filtering (mounted)

Admin enhanced list (via existing products route):

- `GET /api/v1/admin/catalog/products` — search, filters, sort (`catalog:read`)

Vendor:

- `GET /api/v1/vendor/catalog/categories`
- `GET /api/v1/vendor/catalog/brands`
- `GET /api/v1/vendor/catalog/products`
- `GET /api/v1/vendor/catalog/products/:productId`
- `GET /api/v1/vendor/catalog/products/:productId/variants`
- `GET /api/v1/vendor/catalog/facets`

Customer:

- `GET /api/v1/customer/catalog/categories`
- `GET /api/v1/customer/catalog/brands`
- `GET /api/v1/customer/catalog/products`
- `GET /api/v1/customer/catalog/products/:productId`
- `GET /api/v1/customer/catalog/products/:productId/variants`
- `GET /api/v1/customer/catalog/search` (`q` param)
- `GET /api/v1/customer/catalog/featured-products`
- `GET /api/v1/customer/catalog/facets`

Contract: `docs/contracts/catalog-search-filtering-api.md`

## Phase 3 Catalog Read Routes

All vendor/customer catalog browse routes are **MOUNTED** (RW-03–RW-06, 2026-05-18). See:

- `docs/contracts/catalog-admin-api-contract.md`
- `docs/contracts/catalog-vendor-api-contract.md`
- `docs/contracts/catalog-customer-api-contract.md`

## Phase 6 Module 2 — Delivery Partner Profile Backend

All four delivery agent profile routes are **IMPLEMENTED** (Phase 6 Module 2, 2026-05-21).

Contract: `docs/contracts/phase-6-delivery-agent-profile-api.md`

### Delivery Agent Surface

| Method | Path | Actor | Status |
|--------|------|-------|--------|
| GET | `/api/v1/delivery/profile` | Delivery Agent | IMPLEMENTED |
| PATCH | `/api/v1/delivery/profile` | Delivery Agent | IMPLEMENTED |

**Auth note:** Placeholder auth via `x-agent-id` header. Real JWT auth deferred to Module 5/6.

### Admin Surface

| Method | Path | Actor | Status |
|--------|------|-------|--------|
| GET | `/api/v1/admin/agents` | Admin | IMPLEMENTED |
| GET | `/api/v1/admin/agents/:agentId` | Admin | IMPLEMENTED |

## Phase 6 Module 3 — Rider Availability & Online Status

The rider availability status endpoints are **IMPLEMENTED** (Phase 6 Module 3, 2026-05-21).

Contract: `docs/contracts/phase-6-rider-availability-api.md`

### Delivery Agent Surface

| Method | Path | Actor | Status |
|--------|------|-------|--------|
| PATCH | `/api/v1/delivery/availability` | Delivery Agent | IMPLEMENTED |
| GET | `/api/v1/delivery/status` | Delivery Agent | IMPLEMENTED |

**Auth note:** Placeholder auth via `x-agent-id` header. Real JWT auth deferred to Module 5/6.

## Phase 6 Module 4 — Delivery Assignment Backend

The manual administrative dispatch and pending queue endpoints are **IMPLEMENTED** (Phase 6 Module 4, 2026-05-21).

Contract: `docs/contracts/phase-6-delivery-assignment-api.md`

### Admin Surface

| Method | Path | Actor | Status |
|--------|------|-------|--------|
| GET | `/api/v1/admin/deliveries/pending` | Admin | IMPLEMENTED |
| POST | `/api/v1/admin/deliveries/:deliveryId/dispatch` | Admin | IMPLEMENTED |
