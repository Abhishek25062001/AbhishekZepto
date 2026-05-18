# Phase 3 Database Schema Review

**Date:** 2026-05-18  
**Result:** **PASS** (all PDF fields present in models)

All models include `createdAt`/`updatedAt` via `baseSchemaOptions` unless noted.

## Catalog collections

### categories — PASS

All PDF fields present: `name`, `slug`, `description`, `parentCategoryId`, `level`, `displayOrder`, `iconUrl`, `bannerUrl`, `isFeatured`, `isVisible`, `status`, `isDeleted`, `deletedAt`, `createdBy`, `updatedBy`.

### brands — PASS

All PDF fields present.

### product_units — PASS

All PDF fields present: `code`, `name`, `baseUnit`, `conversionFactor`, `status`, soft-delete, audit fields.

### products — PASS

All PDF fields present including `approvalStatus`, approval/rejection audit fields, `searchKeywords`, `tags`, `attributeSummary`.

### product_variants — PASS

All PDF fields present including dimensions, `attributeValues`, `isDefault`.

## Location & store collections

### cities — PASS

All PDF fields: geo, `isServiceable`, `timezone`, `currencyCode`, etc.

### service_areas — PASS

All PDF fields including `polygon`, center/radius.

### stores — PASS

All PDF fields: `vendorId`, `serviceAreaIds`, hours, `storeType`, `fulfillmentType`, address block.

## Operational collections

### store_products — PASS

All PDF fields including `availabilityUpdatedAt`, pricing trio, `isPriceLocked`.

### inventory_stocks — PASS

All quantity buckets, thresholds, `lastStockMovementId`, scope ids.

### inventory_movements — PASS

Movement deltas and reference fields present. **Note:** no `isDeleted` (append-only log — acceptable).

### inventory_locks — PASS

Lock lifecycle fields present. **Note:** no soft-delete (acceptable for locks).

### media_files — PASS

Storage, owner, checksum, soft-delete via `deletedBy` present.

## Gaps

None blocking Phase 3 validation.
