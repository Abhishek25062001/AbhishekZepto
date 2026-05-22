# Phase 4 Index Plan

Status: **PLANNED** — create indexes in owning module migrations.

## customer_addresses

| Index | Keys | Options |
|-------|------|---------|
| `customer_addresses_customer` | `{ customerId: 1, isDeleted: 1 }` | |
| `customer_addresses_default` | `{ customerId: 1, isDefault: 1 }` | partial: `isDefault: true, isDeleted: false` |

## carts

| Index | Keys | Options |
|-------|------|---------|
| `carts_active_unique` | `{ customerId: 1, storeId: 1, status: 1 }` | unique partial: `status: 'active'` |
| `carts_customer` | `{ customerId: 1, updatedAt: -1 }` | |

## customer_store_selections

| Index | Keys | Options |
|-------|------|---------|
| `customer_store_selections_customer_selected` | `{ customerId: 1, isSelected: 1 }` | partial unique: `isSelected: true` |
| `customer_store_selections_customer` | `{ customerId: 1 }` | |

## checkout_sessions

| Index | Keys | Options |
|-------|------|---------|
| `checkout_customer_status` | `{ customerId: 1, status: 1 }` | |
| `checkout_expires` | `{ reservationExpiresAt: 1 }` | TTL optional for auto-delete of expired docs (NEEDS VERIFICATION — may use job instead) |

## payments

| Index | Keys | Options |
|-------|------|---------|
| `payments_gateway_order` | `{ gatewayOrderId: 1 }` | unique |
| `payments_idempotency` | `{ idempotencyKey: 1 }` | unique sparse |
| `payments_checkout` | `{ checkoutSessionId: 1 }` | |

## orders

| Index | Keys | Options |
|-------|------|---------|
| `orders_number` | `{ orderNumber: 1 }` | unique |
| `orders_customer_placed` | `{ customerId: 1, placedAt: -1 }` | |
| `orders_payment` | `{ paymentId: 1 }` | unique sparse |

## API Endpoints

None — index documentation only.
